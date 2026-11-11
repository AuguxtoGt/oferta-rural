'use strict';

const {
  isProductionEnv,
  extractSessionFromReq,
  getClientIp,
  checkRateLimit,
  sendJson
} = require('./_lib/security');
const {
  INITIAL_DRIP_MODULES,
  TRACK_TO_ACCESS_KEY,
  getUserByEmail,
  getDripConfig,
  computeAccessStatus,
  getCheckoutUrls
} = require('./_lib/db');

let bundledCoursesDb = null;
try {
  bundledCoursesDb = require('./_lib/courses-db.js');
} catch (_e) {
  bundledCoursesDb = null;
}

const DEFAULT_TRACKS = [
  {
    id: 'principal',
    title: 'Trilha 1: Formacao Principal - Imovel Rural em Dia (2026)',
    subtitle: 'Passo a passo de CCIR, ITR, CAR, Retificacao, Credito Rural e Bonus Praticos',
    accessKey: 'acesso_principal',
    badge: 'OFERTA PRINCIPAL'
  },
  {
    id: 'ob1',
    title: 'Trilha 2: Consultor Rural Profissional (Order Bump 1)',
    subtitle: 'Prospeccao, Atendimento, Diagnostico, Tabela de Precos e Fechamento',
    accessKey: 'acesso_ob1_profissional',
    badge: 'ORDER BUMP 1'
  },
  {
    id: 'ob2',
    title: 'Trilha 3: Modelos Prontos Para Consultoria (Order Bump 2)',
    subtitle: 'Fichas de Atendimento, Propostas, Orcamentos, Recibos, Procuracoes e Contratos',
    accessKey: 'acesso_ob2_modelos',
    badge: 'ORDER BUMP 2'
  },
  {
    id: 'ob3',
    title: 'Trilha 4: Guia de 20 Servicos Rurais Lucrativos (Order Bump 3)',
    subtitle: 'Manual de Execucao dos 20 Servicos mais Rentaveis do Agro',
    accessKey: 'acesso_ob3_20servicos',
    badge: 'ORDER BUMP 3'
  },
  {
    id: 'upsell',
    title: 'Trilha 5: Acelerador Negocio Rural do Zero (Upsell)',
    subtitle: 'Marca, Instagram, WhatsApp Business, Pacotes, Parcerias e Recorrencia',
    accessKey: 'acesso_upsell_negocio',
    badge: 'UPSELL VIP'
  },
  {
    id: 'ia',
    title: 'Trilha 6: Consultor Rural IA 24h (Assistente Inteligente)',
    subtitle: 'Diagnostico de casos reais, checklists, honorarios e scripts sob medida',
    accessKey: 'acesso_ia_consultor',
    badge: 'CONSULTOR IA 24H'
  }
];

function buildFallbackCatalog() {
  const modules = INITIAL_DRIP_MODULES.map((m, idx) => ({
    id: m.modulo_id,
    modulo_id: m.modulo_id,
    number: idx + 1,
    title: m.titulo,
    trilha: m.trilha,
    track: m.trilha,
    accessKey: TRACK_TO_ACCESS_KEY[m.trilha] || 'acesso_principal',
    dripDays: m.dias_para_liberar,
    videoCode: m.codigo_video || '',
    description: `Conteudo completo e estruturado do modulo ${m.titulo}.`,
    lessons: [
      {
        id: `${m.modulo_id}-aula-01`,
        title: `Aula 01: Visao Geral e Passo a Passo - ${m.titulo}`,
        duration: '18 min',
        html: `<div class="lesson-rich-content"><h3>${m.titulo}</h3><p>Conteudo tecnico pratico disponivel para consulta e aplicacao imediata.</p></div>`
      }
    ]
  }));

  return {
    tracks: DEFAULT_TRACKS,
    modules
  };
}

function loadCoursesDatabase() {
  if (bundledCoursesDb && Array.isArray(bundledCoursesDb.modules)) {
    return {
      tracks: Array.isArray(bundledCoursesDb.tracks)
        ? bundledCoursesDb.tracks
        : DEFAULT_TRACKS,
      modules: bundledCoursesDb.modules
    };
  }
  return buildFallbackCatalog();
}

function normalizeModuleWithAccess(
  rawMod,
  index,
  dripMap,
  user,
  daysSincePurchase,
  bypassDrip,
  checkoutUrls
) {
  const modId =
    rawMod.id || rawMod.modulo_id || `mod-${String(index + 1).padStart(2, '0')}`;
  const dripRow = dripMap.get(modId) || {};

  const trilha =
    rawMod.trilha ||
    rawMod.track ||
    rawMod.trackId ||
    dripRow.trilha ||
    'principal';

  const accessKey =
    rawMod.accessKey || TRACK_TO_ACCESS_KEY[trilha] || 'acesso_principal';

  const dripDays =
    dripRow.dias_para_liberar !== undefined
      ? Math.max(0, Number(dripRow.dias_para_liberar) || 0)
      : Math.max(
          0,
          Number(rawMod.dripDays ?? rawMod.dias_para_liberar ?? 0) || 0
        );

  const rawDripVideo = String(dripRow.codigo_video || '').trim();
  const isLegacyPlaceholder = /^(V0\d_|VID_M\d+)/i.test(rawDripVideo);
  const videoCode =
    rawDripVideo && !isLegacyPlaceholder
      ? rawDripVideo
      : rawMod.videoCode || rawMod.codigo_video || '';

  const hasPurchase = Boolean(
    user && user.status === 'ativo' && (user.isAdmin || user[accessKey] === true)
  );

  let unlocked = false;
  let lockReason = null;
  let daysRemaining = 0;

  if (!hasPurchase) {
    unlocked = false;
    lockReason = 'PURCHASE';
    daysRemaining = 0;
  } else if (!bypassDrip && dripDays > daysSincePurchase) {
    unlocked = false;
    lockReason = 'DRIP_7_DAYS';
    daysRemaining = Math.max(1, dripDays - daysSincePurchase);
  } else {
    unlocked = true;
    lockReason = null;
    daysRemaining = 0;
  }

  const rawLessons = Array.isArray(rawMod.lessons || rawMod.aulas)
    ? rawMod.lessons || rawMod.aulas
    : [];

  return {
    id: modId,
    modulo_id: modId,
    number: rawMod.number || index + 1,
    shortTitle: rawMod.shortTitle || rawMod.title || dripRow.titulo || modId,
    title: rawMod.title || dripRow.titulo || rawMod.titulo || modId,
    subtitle: rawMod.subtitle || rawMod.subtitulo || '',
    description: rawMod.description || rawMod.descricao || '',
    category: rawMod.category || '',
    coverCategory: rawMod.coverCategory || '',
    coverColor: rawMod.coverColor || '#14532d',
    coverAccent: rawMod.coverAccent || '#4ade80',
    coverIcon: rawMod.coverIcon || 'compass',
    duration: rawMod.duration || '45 min',
    trilha,
    track: trilha,
    accessKey,
    dripDays,
    dias_para_liberar: dripDays,
    videoCode,
    codigo_video: videoCode,
    unlocked,
    lockReason,
    daysRemaining,
    checkoutUrl:
      checkoutUrls[trilha] || checkoutUrls[accessKey] || checkoutUrls.principal,
    lessonCount: rawLessons.length,
    rawLessons
  };
}

function stripLessonHtml(lesson, index, modId) {
  return {
    id: lesson.id || `${modId}-aula-${String(index + 1).padStart(2, '0')}`,
    title: lesson.title || lesson.titulo || `Aula ${index + 1}`,
    subtitle: lesson.subtitle || lesson.subtitulo || '',
    duration: lesson.duration || lesson.duracao || '15 min',
    type: lesson.type || 'aula',
    locked: true
  };
}

function formatFullLesson(lesson, index, modId) {
  return {
    ...lesson,
    id: lesson.id || `${modId}-aula-${String(index + 1).padStart(2, '0')}`,
    title: lesson.title || lesson.titulo || `Aula ${index + 1}`,
    subtitle: lesson.subtitle || lesson.subtitulo || '',
    duration: lesson.duration || lesson.duracao || '15 min',
    html: lesson.html || lesson.content || lesson.conteudo || '',
    locked: false
  };
}

async function resolveAuthenticatedContentUser(req) {
  const session = extractSessionFromReq(req);
  if (!session || !session.email) return null;

  let isOriginAdmin = false;
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
    }
  }

  const allowDemo = !isProductionEnv() || isOriginAdmin;
  const user = await getUserByEmail(session.email, { allowDemo });
  if (!user || user.status !== 'ativo') return null;
  return user;
}

module.exports = async function handler(req, res) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, 'content_api', 120, 60000);
  if (!rl.allowed) {
    return sendJson(res, 429, {
      ok: false,
      error: 'Muitas requisicoes seguidas. Aguarde alguns instantes.'
    });
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (req.method !== 'GET') {
    return sendJson(res, 405, {
      ok: false,
      error: 'Metodo nao permitido. Use GET.'
    });
  }

  const user = await resolveAuthenticatedContentUser(req);
  const dripConfig = await getDripConfig();
  const dripMap = new Map(dripConfig.map((d) => [d.modulo_id, d]));

  const accessInfo = computeAccessStatus(user, dripConfig);
  const checkoutUrls = getCheckoutUrls(user ? user.email : '');
  const rawCatalog = loadCoursesDatabase();
  const aiEnabled = process.env.ENABLE_AI_CONSULTANT === 'true';
  const catalog = {
    tracks: (rawCatalog.tracks || []).filter((t) => aiEnabled || t.id !== 'ia'),
    modules: (rawCatalog.modules || []).filter((m) => {
      if (aiEnabled) return true;
      const mid = String(m.id || m.modulo_id || '');
      return (
        mid !== 'mod-24' &&
        m.trilha !== 'ia' &&
        m.accessKey !== 'acesso_ia_consultor'
      );
    })
  };

  const requestedModuleId =
    req.query && (req.query.moduleId || req.query.modulo_id || req.query.id)
      ? String(req.query.moduleId || req.query.modulo_id || req.query.id).trim()
      : '';

  // Caso 1: Solicitou um modulo especifico (?moduleId=mod-XX)
  if (requestedModuleId) {
    const modIndex = catalog.modules.findIndex(
      (m, i) =>
        (m.id || m.modulo_id || `mod-${String(i + 1).padStart(2, '0')}`) ===
        requestedModuleId
    );

    if (modIndex < 0) {
      return sendJson(res, 404, {
        ok: false,
        error: `Modulo ${requestedModuleId} nao encontrado.`
      });
    }

    const evaluated = normalizeModuleWithAccess(
      catalog.modules[modIndex],
      modIndex,
      dripMap,
      user,
      accessInfo.daysSincePurchase,
      accessInfo.bypassDrip,
      checkoutUrls
    );

    const { rawLessons, ...moduleMeta } = evaluated;

    if (!evaluated.unlocked) {
      const lockMessage =
        evaluated.lockReason === 'DRIP_7_DAYS'
          ? `Liberacao Programada de Seguranca (8o Dia): Este modulo avancado ja faz parte do seu acesso e sera desbloqueado automaticamente na sua conta em ${evaluated.daysRemaining} dia(s), logo apos o periodo inicial de 7 dias.`
          : 'Este modulo pertence a um pacote complementar bloqueado para o seu e-mail atual. Destrave agora para acessar todas as aulas e modelos.';

      return sendJson(res, 403, {
        ok: false,
        unlocked: false,
        lockReason: evaluated.lockReason,
        daysRemaining: evaluated.daysRemaining,
        daysSincePurchase: accessInfo.daysSincePurchase,
        checkoutUrl: evaluated.checkoutUrl,
        error: lockMessage,
        module: {
          ...moduleMeta,
          lessons: rawLessons.map((l, idx) =>
            stripLessonHtml(l, idx, evaluated.id)
          )
        }
      });
    }

    return sendJson(res, 200, {
      ok: true,
      unlocked: true,
      lockReason: null,
      daysRemaining: 0,
      daysSincePurchase: accessInfo.daysSincePurchase,
      module: {
        ...moduleMeta,
        lessons: rawLessons.map((l, idx) =>
          formatFullLesson(l, idx, evaluated.id)
        )
      }
    });
  }

  // Caso 2: Catalogo completo de trilhas e modulos (nunca entrega HTML de modulos bloqueados ou sem sessao)
  const includeUnlockedHtml = Boolean(user && req.query && req.query.full === '1');

  const modulesOut = catalog.modules.map((rawMod, idx) => {
    const evaluated = normalizeModuleWithAccess(
      rawMod,
      idx,
      dripMap,
      user,
      accessInfo.daysSincePurchase,
      accessInfo.bypassDrip,
      checkoutUrls
    );
    const { rawLessons, ...moduleMeta } = evaluated;

    return {
      ...moduleMeta,
      lessons: rawLessons.map((l, lIdx) =>
        evaluated.unlocked && includeUnlockedHtml
          ? formatFullLesson(l, lIdx, evaluated.id)
          : stripLessonHtml(l, lIdx, evaluated.id)
      )
    };
  });

  return sendJson(res, 200, {
    ok: true,
    authenticated: Boolean(user),
    daysSincePurchase: accessInfo.daysSincePurchase,
    bypassDrip: accessInfo.bypassDrip,
    tracks: catalog.tracks,
    modules: modulesOut,
    dripConfig,
    checkoutUrls
  });
};
