'use strict';

const {
  loadEnv,
  safeCompareString,
  extractSessionFromReq,
  getClientIp,
  checkRateLimit,
  sendJson,
  parseRequestBody
} = require('./_lib/security');
const {
  getUserByEmail,
  upsertUserFromWebhook,
  addWebhookLog,
  logSecurityEvent,
  getWebhookLogs,
  sanitizeUserForClient,
  getDripConfig
} = require('./_lib/db');

loadEnv();

function normalizeText(val) {
  return String(val || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function safeCompareSecret(provided, expected) {
  if (!provided || !expected) return false;
  return safeCompareString(String(provided).trim(), String(expected).trim());
}

async function verifyWebhookAuth(req, body = {}) {
  loadEnv();
  const expectedSecret = String(process.env.WEBHOOK_SECRET || '').trim();

  if (expectedSecret) {
    const queryToken = req.query && (req.query.token || req.query.secret);
    if (safeCompareSecret(queryToken, expectedSecret)) {
      return { valid: true, method: 'query_token' };
    }

    const headers = req.headers || {};
    const headerCandidates = [
      headers['x-webhook-token'],
      headers['x-novark-token'],
      headers['x-wiven-token'],
      headers['x-kiwify-token'],
      headers['x-hotmart-hottok'],
      headers['x-perfectpay-token']
    ];

    for (const h of headerCandidates) {
      if (safeCompareSecret(h, expectedSecret)) {
        return { valid: true, method: 'header_token' };
      }
    }

    const authHeader = headers.authorization || headers.Authorization;
    if (typeof authHeader === 'string') {
      const tokenPart = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader.trim();
      if (safeCompareSecret(tokenPart, expectedSecret)) {
        return { valid: true, method: 'bearer_token' };
      }
    }

    if (
      safeCompareSecret(
        body.token || body.webhook_token || body.hottok,
        expectedSecret
      )
    ) {
      return { valid: true, method: 'body_token' };
    }
  }

  // Permite disparo de teste autenticado exclusivamente por sessao real de Administrador validada no banco
  const session = extractSessionFromReq(req);
  if (session && session.email) {
    const caller = await getUserByEmail(session.email, { allowDemo: false });
    if (caller && caller.status === 'ativo' && caller.isAdmin === true) {
      return { valid: true, method: 'admin_session' };
    }
  }

  return {
    valid: false,
    method: null,
    misconfigured: !expectedSecret
  };
}

function extractSlugFromEnvUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return '';
  const clean = urlStr.trim().replace(/\/+$/, '').split('?')[0];
  const parts = clean.split('/');
  return (parts[parts.length - 1] || '').toLowerCase().trim();
}

function detectGateway(_req, body = {}) {
  if (body.gateway) return String(body.gateway).toLowerCase().slice(0, 40);
  const rawStr = JSON.stringify(body).toLowerCase();
  if (
    rawStr.includes('novark') ||
    rawStr.includes('jxiib47t') ||
    rawStr.includes('kg1a7jgt') ||
    rawStr.includes('t61jpbxl') ||
    rawStr.includes('ty2kxpf2') ||
    rawStr.includes('483r78iu') ||
    rawStr.includes('fotl08p9') ||
    rawStr.includes('p0ptqz86') ||
    rawStr.includes('bet5bxrw') ||
    rawStr.includes('agwfds26')
  ) {
    return 'novark';
  }
  if (rawStr.includes('wiven') || rawStr.includes('0rskiqy')) {
    return 'wiven';
  }
  if (rawStr.includes('kiwify')) return 'kiwify';
  if (rawStr.includes('hotmart') || body.hottok) return 'hotmart';
  if (rawStr.includes('perfectpay')) return 'perfectpay';
  return 'checkout';
}

function extractCustomerInfo(body = {}) {
  const data = body.data || {};
  const customer =
    body.customer ||
    body.buyer ||
    body.client ||
    body.Customer ||
    data.customer ||
    data.buyer ||
    data.client ||
    {};

  const email =
    customer.email ||
    body.email ||
    data.email ||
    (body.user && body.user.email) ||
    (body.subscriber && body.subscriber.email) ||
    '';

  const nome =
    customer.name ||
    customer.full_name ||
    customer.nome ||
    body.nome ||
    body.name ||
    data.nome ||
    data.name ||
    'Aluno Consultor Rural';

  const telefone =
    customer.phone ||
    customer.mobile ||
    customer.telefone ||
    customer.phone_number ||
    body.telefone ||
    body.phone ||
    data.telefone ||
    '';

  return {
    email: String(email || '').trim().toLowerCase().slice(0, 180),
    nome: String(nome || 'Aluno Consultor Rural').trim().slice(0, 120),
    telefone: String(telefone || '').trim().slice(0, 40)
  };
}

function detectWebhookEvent(body = {}) {
  const data = body.data || {};
  const rawParts = [
    body.event,
    body.status,
    body.order_status,
    body.payment_status,
    body.transaction_status,
    body.webhook_event_type,
    data.event,
    data.status,
    data.order_status,
    data.payment_status
  ].filter(Boolean);

  const rawEvent = rawParts.length ? rawParts.join(' | ') : 'approved';
  const norm = normalizeText(rawEvent);

  const revokeTokens = [
    'refund',
    'refunded',
    'reembolsado',
    'reembolso',
    'chargeback',
    'chargedback',
    'estornado',
    'estorno',
    'canceled',
    'cancelled',
    'cancelado',
    'order_canceled',
    'blocked',
    'bloqueado',
    'expired',
    'expirado',
    'refused',
    'recusado'
  ];

  for (const token of revokeTokens) {
    if (norm.includes(token)) {
      return {
        eventType: norm.includes('chargeback') ? 'chargeback' : 'refunded',
        userStatus: 'reembolsado',
        rawEvent: String(rawEvent).slice(0, 120)
      };
    }
  }

  const paidTokens = [
    'order_paid',
    'paid',
    'approved',
    'aprovado',
    'pago',
    'completed',
    'concluido',
    'active',
    'ativo'
  ];
  const hasPaidToken = paidTokens.some((t) => norm.includes(t));

  const pendingTokens = [
    'pending',
    'pendente',
    'waiting',
    'aguardando',
    'created',
    'order_created',
    'abandoned',
    'abandonado',
    'unpaid',
    'gerado'
  ];
  if (!hasPaidToken && pendingTokens.some((t) => norm.includes(t))) {
    return {
      eventType: 'pending_ignored',
      userStatus: 'ignorado',
      rawEvent: String(rawEvent).slice(0, 120)
    };
  }

  return {
    eventType: 'approved',
    userStatus: 'ativo',
    rawEvent: String(rawEvent).slice(0, 120)
  };
}

function extractProductGrants(body = {}) {
  const grants = {
    acesso_principal: true,
    acesso_ob1_profissional: false,
    acesso_ob2_modelos: false,
    acesso_ob3_20servicos: false,
    acesso_upsell_negocio: false,
    acesso_ia_consultor: false
  };

  const descriptors = [];
  const pushVal = (v) => {
    if (!v) return;
    if (typeof v === 'string' || typeof v === 'number') {
      descriptors.push(String(v));
    } else if (Array.isArray(v)) {
      v.forEach(pushVal);
    } else if (typeof v === 'object') {
      const fields = [
        v.id,
        v.code,
        v.slug,
        v.checkout_id,
        v.product_id,
        v.offer_id,
        v.name,
        v.title,
        v.nome,
        v.titulo,
        v.description,
        v.product_name,
        v.offer_name
      ];
      fields.forEach((f) => {
        if (f) descriptors.push(String(f));
      });
    }
  };

  const data = body.data || {};
  pushVal(body.product);
  pushVal(body.products);
  pushVal(body.items);
  pushVal(body.order_bumps);
  pushVal(body.orderBumps);
  pushVal(body.bumps);
  pushVal(body.offer);
  pushVal(body.plan);
  pushVal(body.checkout_id);
  pushVal(body.product_id);
  pushVal(body.offer_id);
  pushVal(body.product_name);
  pushVal(body.offer_name);
  pushVal(data.product);
  pushVal(data.products);
  pushVal(data.items);
  pushVal(data.order_bumps);
  pushVal(data.offer);
  pushVal(data.checkout_id);
  pushVal(data.product_id);

  const combined = normalizeText(descriptors.join(' | '));

  loadEnv();
  const slugPrincipal = extractSlugFromEnvUrl(process.env.CHECKOUT_PRINCIPAL_URL);
  const slugPrincipal37 = extractSlugFromEnvUrl(process.env.CHECKOUT_PRINCIPAL_URL_37);
  const slugEntenda = extractSlugFromEnvUrl(
    process.env.CHECKOUT_ENTENDA_URL || 'https://pay.novarkbr.com/agwfds26'
  );
  const slugOb1 = extractSlugFromEnvUrl(
    process.env.CHECKOUT_OB1_URL_CONSULTOR_RURAL || process.env.CHECKOUT_OB1_URL
  );
  const slugOb2 = extractSlugFromEnvUrl(
    process.env.CHECKOUT_OB2_URL_MODELOS_PRONTOS || process.env.CHECKOUT_OB2_URL
  );
  const slugOb3 = extractSlugFromEnvUrl(
    process.env.CHECKOUT_OB3_URL_GUIA_SERVICOS || process.env.CHECKOUT_OB3_URL
  );
  const slugCombo3Obs = extractSlugFromEnvUrl(process.env.CHECKOUT_COMBO_3OBS_URL);
  const slugUpsell = extractSlugFromEnvUrl(process.env.CHECKOUT_UPSELL_URL);
  const slugIa = extractSlugFromEnvUrl(process.env.CHECKOUT_IA_URL);

  let matchedMainCourse = false;
  let matchedMainConsultor = false;

  // 1. Oferta "Imovel Rural em Dia ( Entenda )" -> Perfil Proprietario Rural (agwfds26)
  if (
    (slugEntenda && combined.includes(slugEntenda)) ||
    combined.includes('agwfds26') ||
    combined.includes('entenda') ||
    combined.includes('proprietario')
  ) {
    grants.acesso_principal = true;
    grants.perfil = 'proprietario';
    matchedMainCourse = true;
  }

  // 2. Oferta Principal de Lucrar / Consultor Rural (jxiib47t, kg1a7jgt, 0RSKIQY, Oferta Rural)
  if (
    (slugPrincipal && combined.includes(slugPrincipal)) ||
    (slugPrincipal37 && combined.includes(slugPrincipal37)) ||
    combined.includes('jxiib47t') ||
    combined.includes('0rskiqy') ||
    combined.includes('kg1a7jgt') ||
    combined.includes('oferta rural') ||
    (combined.includes('imovel rural em dia') && !combined.includes('entenda'))
  ) {
    grants.acesso_principal = true;
    grants.perfil = 'consultor';
    matchedMainCourse = true;
    matchedMainConsultor = true;
  }

  // Order Bump 1: Consultor Rural Profissional (t61jpbxl)
  if (
    (slugOb1 && combined.includes(slugOb1)) ||
    combined.includes('t61jpbxl') ||
    combined.includes('profissional') ||
    combined.includes('ob1') ||
    combined.includes('prospeccao') ||
    combined.includes('captacao') ||
    combined.includes('bump 1') ||
    combined.includes('bump1')
  ) {
    grants.acesso_ob1_profissional = true;
  }

  // Order Bump 2: Modelos Prontos Para Consultoria (ty2kxpf2)
  if (
    (slugOb2 && combined.includes(slugOb2)) ||
    combined.includes('ty2kxpf2') ||
    combined.includes('modelos') ||
    combined.includes('ob2') ||
    combined.includes('contratos') ||
    combined.includes('procuracoes') ||
    combined.includes('fichas') ||
    combined.includes('bump 2') ||
    combined.includes('bump2')
  ) {
    grants.acesso_ob2_modelos = true;
  }

  // Order Bump 3: Guia de 20 Servicos Rurais Lucrativos (483r78iu)
  if (
    (slugOb3 && combined.includes(slugOb3)) ||
    combined.includes('483r78iu') ||
    combined.includes('20 servicos') ||
    combined.includes('lucrativos') ||
    combined.includes('ob3') ||
    combined.includes('servicos rurais') ||
    combined.includes('bump 3') ||
    combined.includes('bump3')
  ) {
    grants.acesso_ob3_20servicos = true;
  }

  // COMBO DOS 3 ORDER BUMPS ACIMA (fotl08p9 / "OFERTA ESPECIAL - LEVE OS 3" -> libera OB1 + OB2 + OB3)
  if (
    (slugCombo3Obs && combined.includes(slugCombo3Obs)) ||
    combined.includes('fotl08p9') ||
    combined.includes('combo') ||
    combined.includes('leve os 3') ||
    combined.includes('leve os tres') ||
    combined.includes('3 order bumps') ||
    combined.includes('3 bumps') ||
    combined.includes('kit completo consultor')
  ) {
    grants.acesso_ob1_profissional = true;
    grants.acesso_ob2_modelos = true;
    grants.acesso_ob3_20servicos = true;
  }

  // Upsell: Negocio Rural do Zero / Negocio de Sucesso / Primeiros Clientes / Acelerador (p0ptqz86 / bet5bxrw)
  if (
    (slugUpsell && combined.includes(slugUpsell)) ||
    combined.includes('p0ptqz86') ||
    combined.includes('bet5bxrw') ||
    combined.includes('negocio rural') ||
    combined.includes('negocio de sucesso') ||
    combined.includes('primeiros clientes') ||
    combined.includes('linha de credito rural') ||
    combined.includes('upsell') ||
    combined.includes('acelerador')
  ) {
    grants.acesso_upsell_negocio = true;
  }

  // Agente Consultor Rural IA 24h (CHECKOUT_IA_URL ou nome com IA)
  if (
    (slugIa && combined.includes(slugIa)) ||
    /\bia\b/.test(combined) ||
    combined.includes('inteligencia') ||
    combined.includes('assistente') ||
    combined.includes('consultor ia') ||
    combined.includes('24h')
  ) {
    grants.acesso_ia_consultor = true;
  }

  const matchedAnySubProduct = Boolean(
    grants.acesso_ob1_profissional ||
      grants.acesso_ob2_modelos ||
      grants.acesso_ob3_20servicos ||
      grants.acesso_upsell_negocio ||
      grants.acesso_ia_consultor
  );

  grants.matchedMainCourse = matchedMainCourse;
  grants.matchedMainConsultor = matchedMainConsultor;
  grants.isSubProductOnly = Boolean(matchedAnySubProduct && !matchedMainCourse);

  // Pacote Completo / VIP
  if (
    combined.includes('pacote vip') ||
    combined.includes('acesso total') ||
    combined.includes('completo vip')
  ) {
    grants.acesso_principal = true;
    grants.acesso_ob1_profissional = true;
    grants.acesso_ob2_modelos = true;
    grants.acesso_ob3_20servicos = true;
    grants.acesso_upsell_negocio = true;
    grants.acesso_ia_consultor = true;
  }

  // Flags explicitas enviadas em body.grants (somente quando autenticado via token/admin)
  if (body.grants && typeof body.grants === 'object') {
    const g = body.grants;
    if (g.acesso_principal !== undefined)
      grants.acesso_principal = Boolean(g.acesso_principal);
    if (g.acesso_ob1_profissional !== undefined)
      grants.acesso_ob1_profissional = Boolean(g.acesso_ob1_profissional);
    if (g.acesso_ob2_modelos !== undefined)
      grants.acesso_ob2_modelos = Boolean(g.acesso_ob2_modelos);
    if (g.acesso_ob3_20servicos !== undefined)
      grants.acesso_ob3_20servicos = Boolean(g.acesso_ob3_20servicos);
    if (g.acesso_upsell_negocio !== undefined)
      grants.acesso_upsell_negocio = Boolean(g.acesso_upsell_negocio);
    if (g.acesso_ia_consultor !== undefined)
      grants.acesso_ia_consultor = Boolean(g.acesso_ia_consultor);
  }

  const unlockedList = Object.entries(grants)
    .filter(([, val]) => val === true)
    .map(([key]) => key);

  return { grants, unlockedList };
}

module.exports = async function handler(req, res) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, 'webhook', 60, 60000);
  if (!rl.allowed) {
    return sendJson(res, 429, {
      ok: false,
      error: 'Muitas requisicoes seguidas ao webhook. Aguarde alguns segundos.'
    });
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === 'GET') {
    const authCheck = await verifyWebhookAuth(req, {});
    if (!authCheck.valid) {
      return sendJson(res, 200, {
        ok: true,
        service: 'Regularize Rural - Webhook Receiver',
        status: 'online'
      });
    }

    const includeLogs = req.query && req.query.logs === '1';
    const logs = includeLogs ? await getWebhookLogs(30) : undefined;

    return sendJson(res, 200, {
      ok: true,
      service: 'Regularize Rural - Webhook Receiver',
      status: 'online',
      authenticated: true,
      logs
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      ok: false,
      error: 'Metodo nao permitido. Use POST para enviar eventos de webhook.'
    });
  }

  let body = {};
  try {
    body = await parseRequestBody(req, 102400);
  } catch (_err) {
    return sendJson(res, 400, {
      ok: false,
      error: 'Corpo da requisicao invalido.'
    });
  }

  const authCheck = await verifyWebhookAuth(req, body);
  if (!authCheck.valid) {
    if (authCheck.misconfigured) {
      console.error('[webhook_config_error] WEBHOOK_SECRET ausente no ambiente.');
      return sendJson(res, 500, {
        ok: false,
        error: 'Configuracao de seguranca do webhook ausente no servidor.'
      });
    }
    await logSecurityEvent({
      evento: 'webhook_invalid_token',
      ip
    });
    return sendJson(res, 401, {
      ok: false,
      error: 'Token de seguranca do Webhook invalido ou ausente.'
    });
  }

  const gateway = detectGateway(req, body);
  const eventInfo = detectWebhookEvent(body);
  const customer = extractCustomerInfo(body);

  // Responde 200 OK imediato quando o gateway dispara o botao "TESTAR" (ping sem e-mail de comprador)
  if (!customer.email || !customer.email.includes('@')) {
    return sendJson(res, 200, {
      ok: true,
      testPing: true,
      gateway,
      message: 'Webhook Regularize Rural conectado e autenticado com sucesso!'
    });
  }

  // Ignora com seguranca pedidos apenas criados / Pix aguardando pagamento (sem liberar acesso antes de pagar)
  if (eventInfo.userStatus === 'ignorado') {
    await addWebhookLog({
      gateway,
      evento: eventInfo.eventType,
      email: customer.email,
      produtos_liberados: ['aguardando_pagamento'],
      payload: body,
      ip_origem: ip
    });
    return sendJson(res, 200, {
      ok: true,
      ignored: true,
      event: eventInfo.eventType,
      message: `Evento ${eventInfo.rawEvent} registrado sem alterar acessos ate confirmacao de pagamento.`
    });
  }

  const { grants, unlockedList } = extractProductGrants(body);

  try {
    const userRecord = await upsertUserFromWebhook({
      email: customer.email,
      nome: customer.nome,
      telefone: customer.telefone,
      status: eventInfo.userStatus,
      grants
    });

    const logEntry = await addWebhookLog({
      gateway,
      evento: eventInfo.eventType,
      email: customer.email,
      produtos_liberados:
        eventInfo.userStatus === 'ativo' ? unlockedList : ['acesso_revogado'],
      payload: body,
      ip_origem: ip
    });

    const dripConfig = await getDripConfig();

    return sendJson(res, 200, {
      ok: true,
      message:
        eventInfo.userStatus === 'ativo'
          ? `Acesso liberado com sucesso para ${customer.email}.`
          : `Acesso suspenso/reembolsado para ${customer.email}.`,
      gateway,
      event: eventInfo.eventType,
      unlockedProducts: unlockedList,
      user: sanitizeUserForClient(userRecord, dripConfig),
      logId: logEntry.id
    });
  } catch (err) {
    console.error('[webhook_processing_error]', err);
    return sendJson(res, 500, {
      ok: false,
      error: 'Erro interno ao processar webhook.'
    });
  }
};
