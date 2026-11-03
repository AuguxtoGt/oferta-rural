'use strict';

const {
  loadEnv,
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
  computeAccessStatus,
  getCheckoutUrls,
  sanitizeUserForClient
} = require('./_lib/db');

loadEnv();

const DEMO_EMAILS = new Set([
  'vip@rural.com',
  'aluno@rural.com',
  'aluno8dias@rural.com',
  'proprietario@rural.com',
  'admin@regularizerural.com.br'
]);

function checkStudentPassword(inputPassword, user) {
  loadEnv();
  const provided = String(inputPassword || '').trim();
  if (!provided) return false;

  const defaultPass = process.env.DEFAULT_STUDENT_PASSWORD || 'rural123';
  const adminPass = process.env.ADMIN_PASSWORD || 'adminrural2026';
  const configuredAdminEmail = String(
    process.env.ADMIN_EMAIL || 'admin@regularizerural.com.br'
  )
    .trim()
    .toLowerCase();

  // Se for o admin customizado na .env, exige a senha do admin configurada na .env
  if (
    user.isAdmin &&
    user.email === configuredAdminEmail &&
    configuredAdminEmail !== 'admin@regularizerural.com.br'
  ) {
    return provided === adminPass;
  }

  if (user.isAdmin && provided === adminPass) return true;
  if (provided === defaultPass) return true;
  if (user.senha_hash && verifyPassword(provided, user.senha_hash)) {
    return true;
  }
  return false;
}

module.exports = async function handler(req, res) {
  const ip = getClientIp(req);

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  // GET /api/auth -> Retorna sessao atual + dados atualizados do usuario + dripConfig + checkoutUrls
  if (req.method === 'GET') {
    const session = extractSessionFromReq(req);
    const dripConfig = await getDripConfig();

    if (!session || !session.email) {
      return sendJson(res, 200, {
        ok: false,
        authenticated: false,
        dripConfig,
        checkoutUrls: getCheckoutUrls('')
      });
    }

    const user = await getUserByEmail(session.email);
    if (!user || user.status !== 'ativo') {
      clearSessionCookie(res);
      return sendJson(res, 401, {
        ok: false,
        authenticated: false,
        error:
          user && user.status !== 'ativo'
            ? 'O acesso deste e-mail encontra-se suspenso ou reembolsado.'
            : 'Sessao expirada ou usuario nao encontrado.',
        dripConfig,
        checkoutUrls: getCheckoutUrls('')
      });
    }

    const access = computeAccessStatus(user, dripConfig);
    const sanitizedUser = sanitizeUserForClient(user, dripConfig);
    const checkoutUrls = getCheckoutUrls(user.email);

    const responsePayload = {
      ok: true,
      authenticated: true,
      user: sanitizedUser,
      daysSincePurchase: access.daysSincePurchase,
      access,
      dripConfig,
      checkoutUrls
    };

    if (req.query && (req.query.admin_list === '1' || user.isAdmin)) {
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
      body = await parseRequestBody(req);
    } catch (err) {
      return sendJson(res, 400, {
        ok: false,
        error: err.message || 'Requisicao invalida.'
      });
    }

    const action = String(body.action || 'login').toLowerCase();

    if (action === 'logout') {
      clearSessionCookie(res);
      return sendJson(res, 200, {
        ok: true,
        message: 'Sessao encerrada com sucesso.'
      });
    }

    if (action === 'quick_switch') {
      const targetEmail = String(body.email || '')
        .trim()
        .toLowerCase();
      if (!targetEmail) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Informe o e-mail do perfil para alternar.'
        });
      }

      const currentSession = extractSessionFromReq(req);
      const isAllowedDemo =
        DEMO_EMAILS.has(targetEmail) ||
        Boolean(currentSession && currentSession.isAdmin);

      if (!isAllowedDemo) {
        return sendJson(res, 403, {
          ok: false,
          error: 'Troca rapida permitida apenas para perfis de demonstracao ou administrador.'
        });
      }

      const user = await getUserByEmail(targetEmail);
      if (!user) {
        return sendJson(res, 404, {
          ok: false,
          error: 'Perfil de demonstracao nao encontrado.'
        });
      }

      const dripConfig = await getDripConfig();
      const access = computeAccessStatus(user, dripConfig);
      const sanitizedUser = sanitizeUserForClient(user, dripConfig);
      const token = signSession({
        email: user.email,
        nome: user.nome,
        isAdmin: Boolean(user.isAdmin)
      });

      setSessionCookie(res, token);

      const responsePayload = {
        ok: true,
        authenticated: true,
        token,
        user: sanitizedUser,
        daysSincePurchase: access.daysSincePurchase,
        access,
        dripConfig,
        checkoutUrls: getCheckoutUrls(user.email)
      };

      if (user.isAdmin) {
        const allUsers = await listAllUsers();
        responsePayload.adminData = {
          users: allUsers.map((u) => sanitizeUserForClient(u, dripConfig)),
          webhookLogs: await getWebhookLogs(40),
          dripConfig
        };
      }

      return sendJson(res, 200, responsePayload);
    }

    // action === 'login'
    const rl = checkRateLimit(ip, 'auth_login', 25, 60000);
    if (!rl.allowed) {
      return sendJson(res, 429, {
        ok: false,
        error: `Muitas tentativas de login. Aguarde ${rl.retryAfterSec} segundos e tente novamente.`
      });
    }

    const email = String(body.email || '')
      .trim()
      .toLowerCase();
    const password = String(body.password || body.senha || '').trim();

    if (!email || !email.includes('@')) {
      return sendJson(res, 400, {
        ok: false,
        error: 'Digite um e-mail valido utilizado na sua compra.'
      });
    }

    if (!password) {
      return sendJson(res, 400, {
        ok: false,
        error: 'Digite a senha de acesso (senha padrao: rural123).'
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return sendJson(res, 401, {
        ok: false,
        error:
          'Este e-mail nao possui uma compra ativa registrada. Use o mesmo e-mail utilizado no checkout.'
      });
    }

    if (user.status !== 'ativo') {
      return sendJson(res, 403, {
        ok: false,
        error: 'O acesso deste e-mail encontra-se suspenso ou reembolsado.'
      });
    }

    if (!checkStudentPassword(password, user)) {
      return sendJson(res, 401, {
        ok: false,
        error: 'Senha incorreta. Utilize a senha padrao rural123 enviada na confirmacao.'
      });
    }

    const dripConfig = await getDripConfig();
    const access = computeAccessStatus(user, dripConfig);
    const sanitizedUser = sanitizeUserForClient(user, dripConfig);
    const token = signSession({
      email: user.email,
      nome: user.nome,
      isAdmin: Boolean(user.isAdmin)
    });

    setSessionCookie(res, token);

    const responsePayload = {
      ok: true,
      authenticated: true,
      token,
      user: sanitizedUser,
      daysSincePurchase: access.daysSincePurchase,
      access,
      dripConfig,
      checkoutUrls: getCheckoutUrls(user.email)
    };

    if (user.isAdmin) {
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
    let body = {};
    try {
      body = await parseRequestBody(req);
    } catch (err) {
      return sendJson(res, 400, {
        ok: false,
        error: err.message || 'Requisicao invalida.'
      });
    }

    const session = extractSessionFromReq(req);
    const action = String(body.action || '').toLowerCase();

    if (action === 'toggle_lesson') {
      const targetEmail =
        (session && session.email) ||
        String(body.email || '')
          .trim()
          .toLowerCase();
      const lessonId = String(body.lessonId || '').trim();

      if (!targetEmail || !lessonId) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Sessao e lessonId sao obrigatorios para salvar progresso.'
        });
      }

      const user = await getUserByEmail(targetEmail);
      if (!user) {
        return sendJson(res, 404, {
          ok: false,
          error: 'Aluno nao encontrado.'
        });
      }

      const currentProgress = Array.isArray(user.progresso_aulas)
        ? [...user.progresso_aulas]
        : [];
      const existsIdx = currentProgress.indexOf(lessonId);

      if (existsIdx >= 0) {
        currentProgress.splice(existsIdx, 1);
      } else {
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

    if (action === 'admin_save_user') {
      const targetEmail = String(body.email || '')
        .trim()
        .toLowerCase();
      if (!targetEmail || !targetEmail.includes('@')) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Informe um e-mail valido para cadastrar ou atualizar o aluno.'
        });
      }

      const updatedUser = await updateUserAccess(targetEmail, {
        nome: body.nome,
        telefone: body.telefone,
        status: body.status || 'ativo',
        acesso_principal: body.acesso_principal,
        acesso_ob1_profissional: body.acesso_ob1_profissional,
        acesso_ob2_modelos: body.acesso_ob2_modelos,
        acesso_ob3_20servicos: body.acesso_ob3_20servicos,
        acesso_upsell_negocio: body.acesso_upsell_negocio,
        acesso_ia_consultor: body.acesso_ia_consultor,
        liberar_trava_7dias_manual: body.liberar_trava_7dias_manual,
        daysAgo: body.daysAgo
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
      const moduloId = String(body.moduloId || body.modulo_id || '').trim();
      if (!moduloId) {
        return sendJson(res, 400, {
          ok: false,
          error: 'Informe o moduloId para atualizar a configuracao.'
        });
      }

      const updatedDrip = await updateDripConfig(moduloId, {
        dias_para_liberar: body.dias_para_liberar,
        codigo_video: body.codigo_video,
        titulo: body.titulo
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
