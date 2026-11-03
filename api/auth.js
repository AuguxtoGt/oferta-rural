'use strict';

const {
  loadEnv,
  isProductionEnv,
  safeCompareString,
  hashPassword,
  verifyPassword,
  signSession,
  extractSessionFromReq,
  setSessionCookie,
  clearSessionCookie,
  getClientIp,
  checkRateLimit,
  sendJson,
  parseRequestBody
} = require('./_lib/security');
const {
  getUserByEmail,
  listAllUsers,
  updateUserAccess,
  getDripConfig,
  updateDripConfig,
  getWebhookLogs,
  logSecurityEvent,
  computeAccessStatus,
  getCheckoutUrls,
  sanitizeUserForClient
} = require('./_lib/db');

loadEnv();

const DEMO_EMAILS = new Set([
  'vip@rural.com',
  'aluno@rural.com',
  'aluno8dias@rural.com',
  'proprietario@rural.com'
]);

const DUMMY_SCRYPT_HASH = hashPassword(
  'constant_time_dummy_verify_2026',
  '0123456789abcdef0123456789abcdef'
);

const GENERIC_LOGIN_ERROR =
  'E-mail ou senha invalidos. Utilize o mesmo e-mail da compra e a sua senha de acesso.';

function checkStudentPassword(inputPassword, user) {
  loadEnv();
  const provided = String(inputPassword || '').trim();
  if (!provided || !user) return false;

  if (user.isAdmin) {
    const adminPass = String(
      process.env.ADMIN_PASSWORD || (isProductionEnv() ? '' : 'adminrural2026')
    ).trim();
    if (!adminPass) return false;
    return safeCompareString(provided, adminPass);
  }

  const defaultPass = String(
    process.env.DEFAULT_STUDENT_PASSWORD || 'rural123'
  ).trim();
  if (defaultPass && safeCompareString(provided, defaultPass)) {
    return true;
  }
  if (user.senha_hash && verifyPassword(provided, user.senha_hash)) {
    return true;
  }
  return false;
}

async function resolveSessionActor(req) {
  const session = extractSessionFromReq(req);
  if (!session || !session.email) {
    return { session: null, user: null, isOriginAdmin: false };
  }

  let isOriginAdmin = false;
  let adminOriginEmail = '';
  if (session.adminOriginEmail) {
    const originAdmin = await getUserByEmail(session.adminOriginEmail, {
      allowDemo: false
    });
    if (
      originAdmin &&
      originAdmin.status === 'ativo' &&
      originAdmin.isAdmin === true
    ) {
      isOriginAdmin = true;
      adminOriginEmail = originAdmin.email;
    }
  }

  const allowDemo = !isProductionEnv() || isOriginAdmin;
  const user = await getUserByEmail(session.email, { allowDemo });
  if (!user || user.status !== 'ativo') {
    return { session, user: null, isOriginAdmin: false, adminOriginEmail: '' };
  }

  if (user.isAdmin === true) {
    isOriginAdmin = true;
    adminOriginEmail = user.email;
  }

  return { session, user, isOriginAdmin, adminOriginEmail };
}

module.exports = async function handler(req, res) {
  const ip = getClientIp(req);

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  // GET /api/auth -> Retorna sessao atual + dados atualizados do usuario + dripConfig + checkoutUrls
  if (req.method === 'GET') {
    const rl = checkRateLimit(ip, 'auth_get', 90, 60000);
    if (!rl.allowed) {
      return sendJson(res, 429, {
        ok: false,
        error: 'Muitas requisicoes seguidas. Aguarde alguns instantes.'
      });
    }

    const dripConfig = await getDripConfig();
    const actor = await resolveSessionActor(req);

    if (!actor.session || !actor.session.email) {
      return sendJson(res, 200, {
        ok: false,
        authenticated: false,
        canSimulateDemo: !isProductionEnv(),
        dripConfig,
        checkoutUrls: getCheckoutUrls('')
      });
    }

    if (!actor.user) {
      clearSessionCookie(res, req);
      return sendJson(res, 401, {
        ok: false,
        authenticated: false,
        canSimulateDemo: !isProductionEnv(),
        error: 'Sessao expirada ou conta inativa.',
        dripConfig,
        checkoutUrls: getCheckoutUrls('')
      });
    }

    const user = actor.user;
    const access = computeAccessStatus(user, dripConfig);
    const sanitizedUser = sanitizeUserForClient(user, dripConfig);
    const checkoutUrls = getCheckoutUrls(user.email);

    const responsePayload = {
      ok: true,
      authenticated: true,
      canSimulateDemo: Boolean(!isProductionEnv() || actor.isOriginAdmin),
      user: sanitizedUser,
      daysSincePurchase: access.daysSincePurchase,
      access,
      dripConfig,
      checkoutUrls
    };

    // Somente administradores reais recebem listagem de usuarios e logs
    if (user.isAdmin === true) {
      const allUsers = await listAllUsers();
      responsePayload.adminData = {
        users: allUsers.map((u) => sanitizeUserForClient(u, dripConfig)),
        webhookLogs: await getWebhookLogs(40),
        dripConfig
      };
    }

    return sendJson(res, 200, responsePayload);
  }

  // POST /api/auth -> login, quick_switch ou logout
  if (req.method === 'POST') {
    let body = {};
    try {
      body = await parseRequestBody(req, 16384);
    } catch (_err) {
      return sendJson(res, 400, {
        ok: false,
        error: 'Requisicao invalida.'
      });
    }

    const action = String(body.action || 'login').toLowerCase();

    if (action === 'logout') {
      clearSessionCookie(res, req);
      return sendJson(res, 200, {
        ok: true,
        message: 'Sessao encerrada com sucesso.'
      });
    }

    if (action === 'quick_switch') {
      const rlSwitch = checkRateLimit(ip, 'auth_quick_switch', 15, 60000);
      if (!rlSwitch.allowed) {
        return sendJson(res, 429, {
          ok: false,
          error: 'Muitas trocas seguidas. Aguarde alguns segundos.'
        });
      }

      const targetEmail = String(body.email || '')
        .trim()
        .toLowerCase()
        .slice(0, 180);
      if (!targetEmail || !DEMO_EMAILS.has(targetEmail)) {
        await logSecurityEvent({
          evento: 'quick_switch_invalid_target',
          email: targetEmail,
          ip
        });
        return sendJson(res, 403, {
          ok: false,
          error: 'Troca rapida restrita aos perfis de demonstracao.'
        });
      }

      const actor = await resolveSessionActor(req);
      const allowedToSwitch = Boolean(
        !isProductionEnv() || actor.isOriginAdmin === true
      );

      if (!allowedToSwitch) {
        await logSecurityEvent({
          evento: 'quick_switch_blocked_prod',
          email: targetEmail,
          ip
        });
        return sendJson(res, 403, {
          ok: false,
          error: 'Modo de demonstracao desativado em producao.'
        });
      }

      const user = await getUserByEmail(targetEmail, { allowDemo: true });
      if (!user) {
        return sendJson(res, 404, {
          ok: false,
          error: 'Perfil de demonstracao nao encontrado.'
        });
      }

      const dripConfig = await getDripConfig();
      const access = computeAccessStatus(user, dripConfig);
      const sanitizedUser = sanitizeUserForClient(user, dripConfig);
      const sessionPayload = {
        email: user.email,
        nome: user.nome,
        isAdmin: false
      };
      if (actor.isOriginAdmin && actor.adminOriginEmail) {
        sessionPayload.adminOriginEmail = actor.adminOriginEmail;
      }

      const token = signSession(sessionPayload);
      setSessionCookie(res, token, undefined, req);

      return sendJson(res, 200, {
        ok: true,
        authenticated: true,
        canSimulateDemo: true,
        user: sanitizedUser,
        daysSincePurchase: access.daysSincePurchase,
        access,
        dripConfig,
        checkoutUrls: getCheckoutUrls(user.email)
      });
    }

    // action === 'login'
    const email = String(body.email || '')
      .trim()
      .toLowerCase()
      .slice(0, 180);
    const password = String(body.password || body.senha || '')
      .trim()
      .slice(0, 200);

    const rlIp = checkRateLimit(ip, 'auth_login_ip', 8, 600000);
    const rlAcct = email
      ? checkRateLimit(`${ip}:${email}`, 'auth_login_acct', 6, 600000)
      : { allowed: true, retryAfterSec: 0 };

    if (!rlIp.allowed || !rlAcct.allowed) {
      const waitSec = Math.max(rlIp.retryAfterSec || 0, rlAcct.retryAfterSec || 0);
      await logSecurityEvent({
        evento: 'login_rate_limited',
        email,
        ip,
        detalhe: { waitSec }
      });
      return sendJson(res, 429, {
        ok: false,
        error: `Muitas tentativas de login. Aguarde ${waitSec} segundos e tente novamente.`
      });
    }

    if (!email || !email.includes('@') || !password) {
      return sendJson(res, 400, {
        ok: false,
        error: 'Informe seu e-mail de compra e sua senha de acesso.'
      });
    }

    const user = await getUserByEmail(email, { allowDemo: !isProductionEnv() });
    if (!user) {
      verifyPassword(password, DUMMY_SCRYPT_HASH);
      await logSecurityEvent({
        evento: 'login_failed_unknown_email',
        email,
        ip
      });
      return sendJson(res, 401, {
        ok: false,
        error: GENERIC_LOGIN_ERROR
      });
    }

    const passwordValid = checkStudentPassword(password, user);
    if (!passwordValid) {
      await logSecurityEvent({
        evento: 'login_failed_bad_password',
        email,
        ip,
        detalhe: { isAdminTarget: Boolean(user.isAdmin) }
      });
      return sendJson(res, 401, {
        ok: false,
        error: GENERIC_LOGIN_ERROR
      });
    }

    if (user.status !== 'ativo') {
      await logSecurityEvent({
        evento: 'login_blocked_inactive_user',
        email,
        ip,
        detalhe: { status: user.status }
      });
      return sendJson(res, 403, {
        ok: false,
        error: 'O acesso deste e-mail encontra-se suspenso ou reembolsado.'
      });
    }

    let token;
    try {
      token = signSession({
        email: user.email,
        nome: user.nome,
        isAdmin: Boolean(user.isAdmin),
        ...(user.isAdmin ? { adminOriginEmail: user.email } : {})
      });
    } catch (err) {
      console.error('[auth_sign_error]', err);
      return sendJson(res, 500, {
        ok: false,
        error: 'Erro interno ao iniciar sessao.'
      });
    }

    const dripConfig = await getDripConfig();
    const access = computeAccessStatus(user, dripConfig);
    const sanitizedUser = sanitizeUserForClient(user, dripConfig);

    setSessionCookie(res, token, undefined, req);

    const responsePayload = {
      ok: true,
      authenticated: true,
      canSimulateDemo: Boolean(!isProductionEnv() || user.isAdmin),
      user: sanitizedUser,
      daysSincePurchase: access.daysSincePurchase,
      access,
      dripConfig,
      checkoutUrls: getCheckoutUrls(user.email)
    };

    if (user.isAdmin === true) {
      const allUsers = await listAllUsers();
      responsePayload.adminData = {
        users: allUsers.map((u) => sanitizeUserForClient(u, dripConfig)),
        webhookLogs: await getWebhookLogs(40),
        dripConfig
      };
    }

    return sendJson(res, 200, responsePayload);
  }

  // PUT /api/auth -> toggle_lesson, admin_save_user, admin_save_drip
  if (req.method === 'PUT') {
    const rlPut = checkRateLimit(ip, 'auth_put', 30, 60000);
    if (!rlPut.allowed) {
      return sendJson(res, 429, {
        ok: false,
        error: 'Muitas operacoes seguidas. Aguarde alguns instantes.'
      });
    }

    let body = {};
    try {
      body = await parseRequestBody(req, 32768);
    } catch (_err) {
      return sendJson(res, 400, {
        ok: false,
        error: 'Requisicao invalida.'
      });
    }

    const actor = await resolveSessionActor(req);
    if (!actor.user) {
      await logSecurityEvent({
        evento: 'unauthenticated_put_auth',
        ip,
        detalhe: { action: String(body.action || '').slice(0, 40) }
      });
      return sendJson(res, 401, {
        ok: false,
        error: 'Sessao nao autenticada. Faca login novamente.'
      });
    }

    const action = String(body.action || '').toLowerCase();

    if (action === 'toggle_lesson') {
      const lessonId = String(body.lessonId || '').trim();
      if (
        !lessonId ||
        lessonId.length > 64 ||
        !/^[a-zA-Z0-9_:-]+$/.test(lessonId)
      ) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Identificador de aula invalido.'
        });
      }

      const user = actor.user;
      const currentProgress = Array.isArray(user.progresso_aulas)
        ? [...user.progresso_aulas]
        : [];
      const existsIdx = currentProgress.indexOf(lessonId);

      if (existsIdx >= 0) {
        currentProgress.splice(existsIdx, 1);
      } else {
        if (currentProgress.length >= 300) {
          return sendJson(res, 400, {
            ok: false,
            error: 'Limite maximo de registros de progresso atingido.'
          });
        }
        currentProgress.push(lessonId);
      }

      const updatedUser = await updateUserAccess(user.email, {
        progresso_aulas: currentProgress
      });
      const dripConfig = await getDripConfig();

      return sendJson(res, 200, {
        ok: true,
        completed: existsIdx < 0,
        progresso_aulas: updatedUser.progresso_aulas,
        user: sanitizeUserForClient(updatedUser, dripConfig)
      });
    }

    if (action === 'admin_save_user' || action === 'admin_save_drip') {
      if (actor.user.isAdmin !== true) {
        await logSecurityEvent({
          evento: 'unauthorized_admin_action',
          email: actor.user.email,
          ip,
          detalhe: { action }
        });
        return sendJson(res, 403, {
          ok: false,
          error: 'Acesso restrito ao administrador.'
        });
      }
    }

    if (action === 'admin_save_user') {
      const targetEmail = String(body.email || '')
        .trim()
        .toLowerCase()
        .slice(0, 180);
      if (!targetEmail || !targetEmail.includes('@')) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Informe um e-mail valido para cadastrar ou atualizar o aluno.'
        });
      }

      const allowedStatuses = new Set(['ativo', 'reembolsado', 'bloqueado']);
      const safeStatus = allowedStatuses.has(String(body.status || '').toLowerCase())
        ? String(body.status).toLowerCase()
        : 'ativo';

      const updatedUser = await updateUserAccess(targetEmail, {
        nome:
          body.nome !== undefined
            ? String(body.nome).trim().slice(0, 120)
            : undefined,
        telefone:
          body.telefone !== undefined
            ? String(body.telefone).trim().slice(0, 40)
            : undefined,
        status: safeStatus,
        acesso_principal: body.acesso_principal,
        acesso_ob1_profissional: body.acesso_ob1_profissional,
        acesso_ob2_modelos: body.acesso_ob2_modelos,
        acesso_ob3_20servicos: body.acesso_ob3_20servicos,
        acesso_upsell_negocio: body.acesso_upsell_negocio,
        acesso_ia_consultor: body.acesso_ia_consultor,
        liberar_trava_7dias_manual: body.liberar_trava_7dias_manual,
        daysAgo: body.daysAgo
      });

      await logSecurityEvent({
        evento: 'admin_save_user',
        email: actor.user.email,
        ip,
        detalhe: { targetEmail, status: safeStatus }
      });

      const dripConfig = await getDripConfig();
      const allUsers = await listAllUsers();

      return sendJson(res, 200, {
        ok: true,
        message: `Permissoes atualizadas para ${targetEmail}.`,
        user: sanitizeUserForClient(updatedUser, dripConfig),
        users: allUsers.map((u) => sanitizeUserForClient(u, dripConfig))
      });
    }

    if (action === 'admin_save_drip') {
      const moduloId = String(body.moduloId || body.modulo_id || '')
        .trim()
        .slice(0, 40);
      if (!moduloId || !/^[a-zA-Z0-9_-]+$/.test(moduloId)) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Informe um moduloId valido para atualizar a configuracao.'
        });
      }

      const updatedDrip = await updateDripConfig(moduloId, {
        dias_para_liberar: Math.min(
          365,
          Math.max(0, Number(body.dias_para_liberar) || 0)
        ),
        codigo_video:
          body.codigo_video !== undefined
            ? String(body.codigo_video).trim().slice(0, 200)
            : undefined,
        titulo:
          body.titulo !== undefined
            ? String(body.titulo).trim().slice(0, 160)
            : undefined
      });

      await logSecurityEvent({
        evento: 'admin_save_drip',
        email: actor.user.email,
        ip,
        detalhe: { moduloId }
      });

      return sendJson(res, 200, {
        ok: true,
        message: `Configuracao do modulo ${moduloId} salva com sucesso.`,
        dripConfig: updatedDrip
      });
    }

    return sendJson(res, 400, {
      ok: false,
      error: 'Acao PUT desconhecida.'
    });
  }

  return sendJson(res, 405, {
    ok: false,
    error: 'Metodo nao permitido.'
  });
};
