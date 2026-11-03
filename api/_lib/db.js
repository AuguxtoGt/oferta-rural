'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadEnv, hashPassword } = require('./security');

loadEnv();

const PRIMARY_DB_PATH = path.resolve(__dirname, '../../data/members-db.json');
const TMP_DB_PATH = '/tmp/regularize-rural-members-db.json';

const INITIAL_DRIP_MODULES = [
  { modulo_id: 'mod-01', titulo: 'CCIR e SNCR/INCRA Passo a Passo do Zero', trilha: 'principal', dias_para_liberar: 0, codigo_video: 'V01_CCIR' },
  { modulo_id: 'mod-02', titulo: 'ITR, CIB, CNIR e DITR 2026 na Receita Federal', trilha: 'principal', dias_para_liberar: 0, codigo_video: 'V02_ITR' },
  { modulo_id: 'mod-03', titulo: 'CAR e SICAR 2026: Inscricao, Mapas e Retificacao', trilha: 'principal', dias_para_liberar: 0, codigo_video: 'V03_CAR' },
  { modulo_id: 'mod-04', titulo: 'Manual Pratico 2026: Rota dos 26 Estados + DF', trilha: 'principal', dias_para_liberar: 0, codigo_video: 'V04_ESTADOS' },
  { modulo_id: 'mod-05', titulo: 'Modelos Editaveis de Solicitacao de Retificacao de Area', trilha: 'principal', dias_para_liberar: 7, codigo_video: 'V05_RETIFICACAO' },
  { modulo_id: 'mod-06', titulo: 'Guia de Acesso ao Credito Rural Pos-Regularizacao', trilha: 'principal', dias_para_liberar: 7, codigo_video: 'V06_CREDITO' },
  { modulo_id: 'mod-07', titulo: 'Bonus 01: Checklist Completo de Documentos por Objetivo', trilha: 'principal', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-08', titulo: 'Bonus 02: Calendario Anual de Prazos do Imovel Rural', trilha: 'principal', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-09', titulo: 'Bonus 03: Guia de Erros Comuns e Como Corrigir', trilha: 'principal', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-10', titulo: 'Bonus 04: Sobreposicao no CEFIR e CAR: Como Resolver', trilha: 'principal', dias_para_liberar: 7, codigo_video: '' },
  { modulo_id: 'mod-11', titulo: 'Bonus 05: Portal e-CAC para Imovel Rural na Pratica', trilha: 'principal', dias_para_liberar: 7, codigo_video: '' },
  { modulo_id: 'mod-12', titulo: 'OB1 Vol 1: Manual de Prospeccao e Captacao de Clientes Rurais', trilha: 'ob1', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-13', titulo: 'OB1 Vol 2: Guia de Atendimento, Diagnostico e Apresentacao', trilha: 'ob1', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-14', titulo: 'OB1 Vol 3: Tabela de Precificacao, Pacotes e Fechamento', trilha: 'ob1', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-15', titulo: 'OB2 Vol 1: Caderno de Fichas de Atendimento e Checklists', trilha: 'ob2', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-16', titulo: 'OB2 Vol 2: Kit de Propostas Comerciais, Orcamentos e Recibos', trilha: 'ob2', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-17', titulo: 'OB2 Vol 3: Modelos de Procuracoes, Termos e Contratos', trilha: 'ob2', dias_para_liberar: 7, codigo_video: '' },
  { modulo_id: 'mod-18', titulo: 'OB3 Vol 1: Servicos Cadastrais e Fiscais (Servicos 01 a 07)', trilha: 'ob3', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-19', titulo: 'OB3 Vol 2: Servicos Ambientais e Produtor (Servicos 08 a 14)', trilha: 'ob3', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-20', titulo: 'OB3 Vol 3: Credito, Contratos e Recorrencia (Servicos 15 a 20)', trilha: 'ob3', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-21', titulo: 'Upsell Vol 1: Marca, Instagram e WhatsApp Business Rural', trilha: 'upsell', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-22', titulo: 'Upsell Vol 2: Catalogo, Pacotes, Cobranca e Pos-Venda', trilha: 'upsell', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-23', titulo: 'Upsell Vol 3: Parcerias Locais, Indicacoes e Renda Recorrente', trilha: 'upsell', dias_para_liberar: 0, codigo_video: '' },
  { modulo_id: 'mod-24', titulo: 'Consultor Rural IA 24h: Assistente Tecnico e Comercial', trilha: 'ia', dias_para_liberar: 0, codigo_video: '' }
];

const TRACK_TO_ACCESS_KEY = {
  principal: 'acesso_principal',
  ob1: 'acesso_ob1_profissional',
  ob2: 'acesso_ob2_modelos',
  ob3: 'acesso_ob3_20servicos',
  upsell: 'acesso_upsell_negocio',
  ia: 'acesso_ia_consultor'
};

function isSupabaseConfigured() {
  loadEnv();
  const url = (process.env.SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return Boolean(url && key && url.startsWith('http'));
}

async function supabaseRequest(endpoint, options = {}) {
  const baseUrl = (process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const url = `${baseUrl}/rest/v1/${endpoint.replace(/^\/+/, '')}`;

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (_e) {
      data = text;
    }
  }

  if (!response.ok) {
    const err = new Error(
      `Supabase error (${response.status}): ${typeof data === 'object' ? JSON.stringify(data) : text}`
    );
    err.status = response.status;
    throw err;
  }

  return data;
}

function buildSeedDatabase() {
  const now = Date.now();
  const todayIso = new Date(now).toISOString();
  const tenDaysAgoIso = new Date(now - 10 * 86400000).toISOString();
  const fifteenDaysAgoIso = new Date(now - 15 * 86400000).toISOString();
  const thirtyDaysAgoIso = new Date(now - 30 * 86400000).toISOString();
  const todayDateStr = todayIso.slice(0, 10);

  const defaultPassHash = hashPassword(
    process.env.DEFAULT_STUDENT_PASSWORD || 'rural123',
    'a1b2c3d4e5f60718293a4b5c6d7e8f90'
  );

  return {
    version: '2026.1',
    updated_at: todayIso,
    users: [
      {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'vip@rural.com',
        nome: 'Carlos Mendes - Aluno VIP',
        telefone: '(62) 99812-4400',
        senha_hash: defaultPassHash,
        status: 'ativo',
        isAdmin: false,
        acesso_principal: true,
        acesso_ob1_profissional: true,
        acesso_ob2_modelos: true,
        acesso_ob3_20servicos: true,
        acesso_upsell_negocio: true,
        acesso_ia_consultor: true,
        data_primeira_compra: fifteenDaysAgoIso,
        liberar_trava_7dias_manual: false,
        progresso_aulas: ['mod-01-aula-01', 'mod-01-aula-02', 'mod-02-aula-01'],
        perguntas_ia_hoje: 1,
        data_ultimo_uso_ia: todayDateStr,
        created_at: fifteenDaysAgoIso,
        updated_at: todayIso
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        email: 'aluno@rural.com',
        nome: 'João Produtor - Aluno Dia 1',
        telefone: '(34) 99123-7788',
        senha_hash: defaultPassHash,
        status: 'ativo',
        isAdmin: false,
        acesso_principal: true,
        acesso_ob1_profissional: false,
        acesso_ob2_modelos: false,
        acesso_ob3_20servicos: false,
        acesso_upsell_negocio: false,
        acesso_ia_consultor: false,
        data_primeira_compra: todayIso,
        keep_day_one_demo: true,
        liberar_trava_7dias_manual: false,
        progresso_aulas: ['mod-01-aula-01'],
        perguntas_ia_hoje: 0,
        data_ultimo_uso_ia: todayDateStr,
        created_at: todayIso,
        updated_at: todayIso
      },
      {
        id: '33333333-3333-4333-8333-333333333333',
        email: 'aluno8dias@rural.com',
        nome: 'Roberto Almeida - Aluno Dia 8+',
        telefone: '(17) 99741-5520',
        senha_hash: defaultPassHash,
        status: 'ativo',
        isAdmin: false,
        acesso_principal: true,
        acesso_ob1_profissional: true,
        acesso_ob2_modelos: false,
        acesso_ob3_20servicos: false,
        acesso_upsell_negocio: false,
        acesso_ia_consultor: false,
        data_primeira_compra: tenDaysAgoIso,
        liberar_trava_7dias_manual: false,
        progresso_aulas: ['mod-01-aula-01', 'mod-01-aula-02', 'mod-03-aula-01'],
        perguntas_ia_hoje: 0,
        data_ultimo_uso_ia: todayDateStr,
        created_at: tenDaysAgoIso,
        updated_at: todayIso
      },
      {
        id: '44444444-4444-4444-8444-444444444444',
        email: 'admin@regularizerural.com.br',
        nome: 'Administrador Geral',
        telefone: '(11) 99999-0000',
        senha_hash: defaultPassHash,
        status: 'ativo',
        isAdmin: true,
        acesso_principal: true,
        acesso_ob1_profissional: true,
        acesso_ob2_modelos: true,
        acesso_ob3_20servicos: true,
        acesso_upsell_negocio: true,
        acesso_ia_consultor: true,
        data_primeira_compra: thirtyDaysAgoIso,
        liberar_trava_7dias_manual: true,
        progresso_aulas: [],
        perguntas_ia_hoje: 0,
        data_ultimo_uso_ia: todayDateStr,
        created_at: thirtyDaysAgoIso,
        updated_at: todayIso
      },
      {
        id: '55555555-5555-4555-8555-555555555555',
        email: 'proprietario@rural.com',
        nome: 'Antônio Fazendeiro - Proprietário Rural',
        telefone: '(62) 99611-2200',
        senha_hash: defaultPassHash,
        status: 'ativo',
        isAdmin: false,
        perfil: 'proprietario',
        acesso_principal: true,
        acesso_ob1_profissional: false,
        acesso_ob2_modelos: true,
        acesso_ob3_20servicos: false,
        acesso_upsell_negocio: false,
        acesso_ia_consultor: true,
        data_primeira_compra: tenDaysAgoIso,
        liberar_trava_7dias_manual: true,
        progresso_aulas: ['__perfil:proprietario', 'mod-01-aula-01'],
        perguntas_ia_hoje: 0,
        data_ultimo_uso_ia: todayDateStr,
        created_at: tenDaysAgoIso,
        updated_at: todayIso
      }
    ],
    drip_config: INITIAL_DRIP_MODULES.map((m) => ({
      ...m,
      updated_at: todayIso
    })),
    webhook_logs: [
      {
        id: 'wh-log-001',
        gateway: 'novark',
        evento: 'approved',
        email: 'vip@rural.com',
        produtos_liberados: [
          'acesso_principal',
          'acesso_ob1_profissional',
          'acesso_ob2_modelos',
          'acesso_ob3_20servicos',
          'acesso_upsell_negocio',
          'acesso_ia_consultor'
        ],
        payload: {
          event: 'order.paid',
          checkout_id: 'jxiib47t',
          customer: { email: 'vip@rural.com', name: 'Carlos Mendes - Aluno VIP' }
        },
        ip_origem: '127.0.0.1',
        created_at: fifteenDaysAgoIso
      },
      {
        id: 'wh-log-002',
        gateway: 'novark',
        evento: 'approved',
        email: 'aluno@rural.com',
        produtos_liberados: ['acesso_principal'],
        payload: {
          event: 'order.paid',
          checkout_id: 'jxiib47t',
          customer: { email: 'aluno@rural.com', name: 'João Produtor - Aluno Dia 1' }
        },
        ip_origem: '127.0.0.1',
        created_at: todayIso
      }
    ]
  };
}

let memoryDbCache = null;

function ensureLocalDb() {
  if (fs.existsSync(TMP_DB_PATH)) {
    try {
      const raw = fs.readFileSync(TMP_DB_PATH, 'utf8');
      memoryDbCache = JSON.parse(raw);
      return memoryDbCache;
    } catch (_e) {
      // Continua para o caminho principal
    }
  }

  if (fs.existsSync(PRIMARY_DB_PATH)) {
    try {
      const raw = fs.readFileSync(PRIMARY_DB_PATH, 'utf8');
      memoryDbCache = JSON.parse(raw);
      return memoryDbCache;
    } catch (_e) {
      // Se corrompido, recria
    }
  }

  const seed = buildSeedDatabase();
  memoryDbCache = seed;
  saveLocalDb(seed);
  return seed;
}

function saveLocalDb(dbData) {
  memoryDbCache = dbData;
  dbData.updated_at = new Date().toISOString();
  const serialized = JSON.stringify(dbData, null, 2);

  try {
    const dir = path.dirname(PRIMARY_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_DB_PATH, serialized, 'utf8');
  } catch (_err) {
    // Em ambiente serverless read-only (Vercel), salva em /tmp
    try {
      fs.writeFileSync(TMP_DB_PATH, serialized, 'utf8');
    } catch (_err2) {
      // Mantem em memoria
    }
  }
}

// Garante a criacao imediata do arquivo data/members-db.json ao carregar o modulo
ensureLocalDb();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeUserRecord(u) {
  if (!u) return null;
  const email = normalizeEmail(u.email);
  const adminEmail = normalizeEmail(
    process.env.ADMIN_EMAIL || 'admin@regularizerural.com.br'
  );
  const isAdmin = Boolean(
    u.isAdmin ||
      email === adminEmail ||
      email === 'admin@regularizerural.com.br'
  );

  // Para a conta de demonstracao Dia 1, mantem no Dia 1 caso nao tenha sido editada manualmente pelo Admin
  let purchaseDate = u.data_primeira_compra || new Date().toISOString();
  if (u.keep_day_one_demo === true) {
    purchaseDate = new Date().toISOString();
  }

  const rawProgresso = Array.isArray(u.progresso_aulas) ? u.progresso_aulas : [];
  const isProprietario = Boolean(
    u.perfil === 'proprietario' ||
      email === 'proprietario@rural.com' ||
      rawProgresso.includes('__perfil:proprietario')
  );
  const perfil = isProprietario ? 'proprietario' : 'consultor';

  return {
    id: u.id || crypto.randomUUID(),
    email,
    nome: u.nome || (isProprietario ? 'Proprietário Rural' : 'Aluno Consultor Rural'),
    telefone: u.telefone || '',
    senha_hash: u.senha_hash || '',
    status: u.status || 'ativo',
    isAdmin,
    perfil,
    acesso_principal: isAdmin ? true : Boolean(u.acesso_principal),
    acesso_ob1_profissional: isAdmin ? true : Boolean(u.acesso_ob1_profissional),
    acesso_ob2_modelos: isAdmin ? true : Boolean(u.acesso_ob2_modelos),
    acesso_ob3_20servicos: isAdmin ? true : Boolean(u.acesso_ob3_20servicos),
    acesso_upsell_negocio: isAdmin ? true : Boolean(u.acesso_upsell_negocio),
    acesso_ia_consultor: isAdmin ? true : Boolean(u.acesso_ia_consultor),
    data_primeira_compra: purchaseDate,
    keep_day_one_demo: Boolean(u.keep_day_one_demo),
    liberar_trava_7dias_manual: isAdmin
      ? true
      : Boolean(u.liberar_trava_7dias_manual),
    progresso_aulas: rawProgresso,
    perguntas_ia_hoje: Number(u.perguntas_ia_hoje || 0),
    data_ultimo_uso_ia:
      u.data_ultimo_uso_ia || new Date().toISOString().slice(0, 10),
    created_at: u.created_at || purchaseDate,
    updated_at: u.updated_at || new Date().toISOString()
  };
}

/**
 * Busca um aluno pelo e-mail (Supabase REST API + fallback local).
 */
async function getUserByEmail(email) {
  loadEnv();
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return null;

  const configuredAdminEmail = normalizeEmail(
    process.env.ADMIN_EMAIL || 'admin@regularizerural.com.br'
  );

  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRequest(
        `alunos_membros?email=eq.${encodeURIComponent(cleanEmail)}&select=*&limit=1`
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return normalizeUserRecord(rows[0]);
      }
    } catch (_err) {
      // Fallback para o banco local caso a tabela ainda nao tenha sido criada no Supabase
    }
  }

  const db = ensureLocalDb();
  const found = (db.users || []).find(
    (u) => normalizeEmail(u.email) === cleanEmail
  );
  if (found) {
    return normalizeUserRecord(found);
  }

  if (cleanEmail === configuredAdminEmail) {
    const thirtyDaysAgoIso = new Date(Date.now() - 30 * 86400000).toISOString();
    const adminUser = normalizeUserRecord({
      id: '44444444-4444-4444-8444-444444444444',
      email: cleanEmail,
      nome: 'Administrador Geral',
      telefone: '',
      status: 'ativo',
      isAdmin: true,
      acesso_principal: true,
      acesso_ob1_profissional: true,
      acesso_ob2_modelos: true,
      acesso_ob3_20servicos: true,
      acesso_upsell_negocio: true,
      acesso_ia_consultor: true,
      data_primeira_compra: thirtyDaysAgoIso,
      liberar_trava_7dias_manual: true
    });
    return adminUser;
  }

  if (cleanEmail === 'proprietario@rural.com') {
    const tenDaysAgoIso = new Date(Date.now() - 10 * 86400000).toISOString();
    return normalizeUserRecord({
      id: '55555555-5555-4555-8555-555555555555',
      email: 'proprietario@rural.com',
      nome: 'Antônio Fazendeiro - Proprietário Rural',
      telefone: '(62) 99611-2200',
      status: 'ativo',
      isAdmin: false,
      perfil: 'proprietario',
      acesso_principal: true,
      acesso_ob1_profissional: false,
      acesso_ob2_modelos: true,
      acesso_ob3_20servicos: false,
      acesso_upsell_negocio: false,
      acesso_ia_consultor: true,
      data_primeira_compra: tenDaysAgoIso,
      liberar_trava_7dias_manual: true,
      progresso_aulas: ['__perfil:proprietario', 'mod-01-aula-01']
    });
  }

  return null;
}

/**
 * Cria ou atualiza usuario vindo do Webhook (somando permissoes de produtos comprados).
 */
async function upsertUserFromWebhook({
  email,
  nome,
  telefone,
  status = 'ativo',
  grants = {}
}) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail || !cleanEmail.includes('@')) {
    throw new Error('E-mail invalido no payload do webhook.');
  }

  const db = ensureLocalDb();
  const existingIdx = (db.users || []).findIndex(
    (u) => normalizeEmail(u.email) === cleanEmail
  );
  const existingLocal = existingIdx >= 0 ? db.users[existingIdx] : null;
  let existing = existingLocal ? normalizeUserRecord(existingLocal) : null;

  if (!existing && isSupabaseConfigured()) {
    existing = await getUserByEmail(cleanEmail);
  }

  const nowIso = new Date().toISOString();
  const defaultPass = process.env.DEFAULT_STUDENT_PASSWORD || 'rural123';
  const isRevoke = status === 'reembolsado' || status === 'bloqueado';
  const isPartialRevoke = Boolean(isRevoke && grants.isSubProductOnly === true);

  let userRecord;
  if (existing) {
    const nextProgresso = Array.isArray(existing.progresso_aulas)
      ? [...existing.progresso_aulas]
      : [];
    if (grants.perfil === 'proprietario' && !nextProgresso.includes('__perfil:proprietario')) {
      nextProgresso.push('__perfil:proprietario');
    } else if (grants.perfil === 'consultor' && grants.matchedMainConsultor) {
      const pIdx = nextProgresso.indexOf('__perfil:proprietario');
      if (pIdx >= 0) nextProgresso.splice(pIdx, 1);
    }

    if (isPartialRevoke) {
      // Cancelamento/Nao-renovacao APENAS de assinatura de IA ou de um Order Bump/Upsell isolado:
      // Mantem a conta ativa e revoga somente o item cancelado
      userRecord = {
        ...existing,
        nome: nome && nome !== 'Aluno Consultor Rural' ? nome : existing.nome,
        telefone: telefone || existing.telefone,
        status: existing.status === 'ativo' ? 'ativo' : existing.status,
        acesso_principal: existing.acesso_principal,
        acesso_ob1_profissional: grants.acesso_ob1_profissional
          ? false
          : existing.acesso_ob1_profissional,
        acesso_ob2_modelos: grants.acesso_ob2_modelos
          ? false
          : existing.acesso_ob2_modelos,
        acesso_ob3_20servicos: grants.acesso_ob3_20servicos
          ? false
          : existing.acesso_ob3_20servicos,
        acesso_upsell_negocio: grants.acesso_upsell_negocio
          ? false
          : existing.acesso_upsell_negocio,
        acesso_ia_consultor: grants.acesso_ia_consultor
          ? false
          : existing.acesso_ia_consultor,
        progresso_aulas: nextProgresso,
        updated_at: nowIso
      };
    } else {
      userRecord = {
        ...existing,
        perfil: grants.perfil || existing.perfil || 'consultor',
        nome: nome && nome !== 'Aluno Consultor Rural' ? nome : existing.nome,
        telefone: telefone || existing.telefone,
        status: isRevoke ? status : 'ativo',
        acesso_principal: isRevoke
          ? false
          : Boolean(existing.acesso_principal || grants.acesso_principal !== false),
        acesso_ob1_profissional: isRevoke
          ? false
          : Boolean(
              existing.acesso_ob1_profissional || grants.acesso_ob1_profissional
            ),
        acesso_ob2_modelos: isRevoke
          ? false
          : Boolean(existing.acesso_ob2_modelos || grants.acesso_ob2_modelos),
        acesso_ob3_20servicos: isRevoke
          ? false
          : Boolean(
              existing.acesso_ob3_20servicos || grants.acesso_ob3_20servicos
            ),
        acesso_upsell_negocio: isRevoke
          ? false
          : Boolean(
              existing.acesso_upsell_negocio || grants.acesso_upsell_negocio
            ),
        acesso_ia_consultor: isRevoke
          ? false
          : Boolean(existing.acesso_ia_consultor || grants.acesso_ia_consultor),
        progresso_aulas: nextProgresso,
        updated_at: nowIso
      };
    }
  } else {
    const initialProgresso =
      grants.perfil === 'proprietario' ? ['__perfil:proprietario'] : [];
    userRecord = normalizeUserRecord({
      id: crypto.randomUUID(),
      email: cleanEmail,
      perfil: grants.perfil || 'consultor',
      nome:
        nome ||
        (grants.perfil === 'proprietario'
          ? 'Proprietário Rural'
          : 'Aluno Consultor Rural'),
      telefone: telefone || '',
      senha_hash: hashPassword(defaultPass),
      status: isRevoke ? status : 'ativo',
      acesso_principal: isRevoke
        ? false
        : grants.acesso_principal !== undefined
          ? Boolean(grants.acesso_principal)
          : true,
      acesso_ob1_profissional: isRevoke
        ? false
        : Boolean(grants.acesso_ob1_profissional),
      acesso_ob2_modelos: isRevoke ? false : Boolean(grants.acesso_ob2_modelos),
      acesso_ob3_20servicos: isRevoke
        ? false
        : Boolean(grants.acesso_ob3_20servicos),
      acesso_upsell_negocio: isRevoke
        ? false
        : Boolean(grants.acesso_upsell_negocio),
      acesso_ia_consultor: isRevoke
        ? false
        : Boolean(grants.acesso_ia_consultor),
      data_primeira_compra: nowIso,
      liberar_trava_7dias_manual: false,
      progresso_aulas: initialProgresso,
      perguntas_ia_hoje: 0,
      data_ultimo_uso_ia: nowIso.slice(0, 10),
      created_at: nowIso,
      updated_at: nowIso
    });
  }

  if (existingIdx >= 0) {
    db.users[existingIdx] = userRecord;
  } else {
    db.users.push(userRecord);
  }
  saveLocalDb(db);

  if (isSupabaseConfigured()) {
    try {
      const supabasePayload = {
        email: userRecord.email,
        nome: userRecord.nome,
        telefone: userRecord.telefone,
        senha_hash: userRecord.senha_hash,
        status: userRecord.status,
        acesso_principal: userRecord.acesso_principal,
        acesso_ob1_profissional: userRecord.acesso_ob1_profissional,
        acesso_ob2_modelos: userRecord.acesso_ob2_modelos,
        acesso_ob3_20servicos: userRecord.acesso_ob3_20servicos,
        acesso_upsell_negocio: userRecord.acesso_upsell_negocio,
        acesso_ia_consultor: userRecord.acesso_ia_consultor,
        data_primeira_compra: userRecord.data_primeira_compra,
        liberar_trava_7dias_manual: userRecord.liberar_trava_7dias_manual,
        progresso_aulas: userRecord.progresso_aulas,
        perguntas_ia_hoje: userRecord.perguntas_ia_hoje,
        data_ultimo_uso_ia: userRecord.data_ultimo_uso_ia,
        updated_at: nowIso
      };
      await supabaseRequest('alunos_membros?on_conflict=email', {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: supabasePayload
      });
    } catch (_err) {
      // Mantem salvo no cache local
    }
  }

  return userRecord;
}

/**
 * Lista todos os alunos cadastrados.
 */
async function listAllUsers() {
  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRequest(
        'alunos_membros?select=*&order=created_at.desc'
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map(normalizeUserRecord);
      }
    } catch (_err) {
      // Fallback local
    }
  }

  const db = ensureLocalDb();
  return (db.users || []).map(normalizeUserRecord);
}

/**
 * Atualiza acessos, progresso, cota da IA ou trava de 7 dias de um aluno (ou cria se nao existir).
 */
async function updateUserAccess(email, updates = {}) {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) throw new Error('E-mail obrigatorio.');

  const db = ensureLocalDb();
  const idx = (db.users || []).findIndex(
    (u) => normalizeEmail(u.email) === cleanEmail
  );
  const nowIso = new Date().toISOString();
  const defaultPass = process.env.DEFAULT_STUDENT_PASSWORD || 'rural123';

  let baseUser = idx >= 0 ? normalizeUserRecord(db.users[idx]) : null;
  if (!baseUser && isSupabaseConfigured()) {
    baseUser = await getUserByEmail(cleanEmail);
  }

  if (!baseUser) {
    baseUser = normalizeUserRecord({
      id: crypto.randomUUID(),
      email: cleanEmail,
      nome: updates.nome || 'Aluno Consultor Rural',
      telefone: updates.telefone || '',
      senha_hash: hashPassword(updates.password || defaultPass),
      status: updates.status || 'ativo',
      acesso_principal:
        updates.acesso_principal !== undefined
          ? Boolean(updates.acesso_principal)
          : true,
      acesso_ob1_profissional: Boolean(updates.acesso_ob1_profissional),
      acesso_ob2_modelos: Boolean(updates.acesso_ob2_modelos),
      acesso_ob3_20servicos: Boolean(updates.acesso_ob3_20servicos),
      acesso_upsell_negocio: Boolean(updates.acesso_upsell_negocio),
      acesso_ia_consultor: Boolean(updates.acesso_ia_consultor),
      data_primeira_compra: nowIso,
      liberar_trava_7dias_manual: Boolean(updates.liberar_trava_7dias_manual),
      progresso_aulas: [],
      perguntas_ia_hoje: 0,
      data_ultimo_uso_ia: nowIso.slice(0, 10),
      created_at: nowIso,
      updated_at: nowIso
    });
  }

  const updated = { ...baseUser };

  if (updates.nome !== undefined) updated.nome = String(updates.nome).trim();
  if (updates.telefone !== undefined)
    updated.telefone = String(updates.telefone).trim();
  if (updates.status !== undefined) updated.status = updates.status;
  if (updates.password) updated.senha_hash = hashPassword(updates.password);

  const booleanFields = [
    'acesso_principal',
    'acesso_ob1_profissional',
    'acesso_ob2_modelos',
    'acesso_ob3_20servicos',
    'acesso_upsell_negocio',
    'acesso_ia_consultor',
    'liberar_trava_7dias_manual'
  ];

  for (const field of booleanFields) {
    if (updates[field] !== undefined) {
      updated[field] = Boolean(updates[field]);
    }
  }

  if (updates.daysAgo !== undefined && updates.daysAgo !== null && updates.daysAgo !== '') {
    const days = Math.max(0, Number(updates.daysAgo) || 0);
    updated.data_primeira_compra = new Date(
      Date.now() - days * 86400000
    ).toISOString();
    updated.keep_day_one_demo = false;
  } else if (updates.data_primeira_compra !== undefined) {
    updated.data_primeira_compra = updates.data_primeira_compra;
    updated.keep_day_one_demo = false;
  }

  if (Array.isArray(updates.progresso_aulas)) {
    updated.progresso_aulas = updates.progresso_aulas;
  }
  if (updates.perguntas_ia_hoje !== undefined) {
    updated.perguntas_ia_hoje = Number(updates.perguntas_ia_hoje || 0);
  }
  if (updates.data_ultimo_uso_ia !== undefined) {
    updated.data_ultimo_uso_ia = updates.data_ultimo_uso_ia;
  }

  updated.updated_at = nowIso;

  if (idx >= 0) {
    db.users[idx] = updated;
  } else {
    db.users.push(updated);
  }
  saveLocalDb(db);

  if (isSupabaseConfigured()) {
    try {
      const supabasePayload = {
        email: updated.email,
        nome: updated.nome,
        telefone: updated.telefone,
        senha_hash: updated.senha_hash,
        status: updated.status,
        acesso_principal: updated.acesso_principal,
        acesso_ob1_profissional: updated.acesso_ob1_profissional,
        acesso_ob2_modelos: updated.acesso_ob2_modelos,
        acesso_ob3_20servicos: updated.acesso_ob3_20servicos,
        acesso_upsell_negocio: updated.acesso_upsell_negocio,
        acesso_ia_consultor: updated.acesso_ia_consultor,
        data_primeira_compra: updated.data_primeira_compra,
        liberar_trava_7dias_manual: updated.liberar_trava_7dias_manual,
        progresso_aulas: updated.progresso_aulas,
        perguntas_ia_hoje: updated.perguntas_ia_hoje,
        data_ultimo_uso_ia: updated.data_ultimo_uso_ia,
        updated_at: nowIso
      };
      await supabaseRequest('alunos_membros?on_conflict=email', {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: supabasePayload
      });
    } catch (_err) {
      // Mantem salvo localmente
    }
  }

  return updated;
}

/**
 * Retorna a configuracao de trava de 7 dias e codigo de video dos 24 modulos.
 */
async function getDripConfig() {
  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRequest(
        'config_modulos_drip?select=*&order=modulo_id.asc'
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows;
      }
    } catch (_err) {
      // Fallback local
    }
  }

  const db = ensureLocalDb();
  if (!Array.isArray(db.drip_config) || db.drip_config.length === 0) {
    db.drip_config = INITIAL_DRIP_MODULES.map((m) => ({
      ...m,
      updated_at: new Date().toISOString()
    }));
    saveLocalDb(db);
  }
  return db.drip_config;
}

/**
 * Atualiza dias_para_liberar e codigo_video de um modulo.
 */
async function updateDripConfig(moduloId, updates = {}) {
  const cleanId = String(moduloId || '').trim();
  if (!cleanId) throw new Error('moduloId obrigatorio.');

  const db = ensureLocalDb();
  if (!Array.isArray(db.drip_config)) {
    db.drip_config = INITIAL_DRIP_MODULES.map((m) => ({ ...m }));
  }

  const nowIso = new Date().toISOString();
  const idx = db.drip_config.findIndex((m) => m.modulo_id === cleanId);

  if (idx >= 0) {
    if (updates.dias_para_liberar !== undefined) {
      db.drip_config[idx].dias_para_liberar = Math.max(
        0,
        Number(updates.dias_para_liberar) || 0
      );
    }
    if (updates.codigo_video !== undefined) {
      db.drip_config[idx].codigo_video = String(updates.codigo_video || '').trim();
    }
    if (updates.titulo !== undefined) {
      db.drip_config[idx].titulo = String(updates.titulo).trim();
    }
    db.drip_config[idx].updated_at = nowIso;
  } else {
    db.drip_config.push({
      modulo_id: cleanId,
      titulo: updates.titulo || cleanId,
      trilha: updates.trilha || 'principal',
      dias_para_liberar: Math.max(0, Number(updates.dias_para_liberar) || 0),
      codigo_video: String(updates.codigo_video || '').trim(),
      updated_at: nowIso
    });
  }

  saveLocalDb(db);

  if (isSupabaseConfigured()) {
    try {
      const target = db.drip_config.find((m) => m.modulo_id === cleanId);
      await supabaseRequest('config_modulos_drip?on_conflict=modulo_id', {
        method: 'POST',
        headers: {
          Prefer: 'resolution=merge-duplicates,return=representation'
        },
        body: target
      });
    } catch (_err) {
      // Mantem no cache local
    }
  }

  return db.drip_config;
}

/**
 * Registra log de auditoria do Webhook.
 */
async function addWebhookLog(entry = {}) {
  const nowIso = new Date().toISOString();
  const logItem = {
    id: crypto.randomUUID(),
    gateway: entry.gateway || 'checkout',
    evento: entry.evento || 'approved',
    email: normalizeEmail(entry.email || ''),
    produtos_liberados: Array.isArray(entry.produtos_liberados)
      ? entry.produtos_liberados
      : [],
    payload: entry.payload || {},
    ip_origem: entry.ip_origem || '127.0.0.1',
    created_at: nowIso
  };

  const db = ensureLocalDb();
  if (!Array.isArray(db.webhook_logs)) db.webhook_logs = [];
  db.webhook_logs.unshift(logItem);
  if (db.webhook_logs.length > 100) {
    db.webhook_logs = db.webhook_logs.slice(0, 100);
  }
  saveLocalDb(db);

  if (isSupabaseConfigured()) {
    try {
      await supabaseRequest('webhook_logs', {
        method: 'POST',
        body: {
          gateway: logItem.gateway,
          evento: logItem.evento,
          email: logItem.email,
          produtos_liberados: logItem.produtos_liberados,
          payload: logItem.payload,
          ip_origem: logItem.ip_origem,
          created_at: nowIso
        }
      });
    } catch (_err) {
      // Mantem no log local
    }
  }

  return logItem;
}

/**
 * Retorna os logs recentes do Webhook.
 */
async function getWebhookLogs(limit = 50) {
  if (isSupabaseConfigured()) {
    try {
      const rows = await supabaseRequest(
        `webhook_logs?select=*&order=created_at.desc&limit=${Number(limit) || 50}`
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows;
      }
    } catch (_err) {
      // Fallback local
    }
  }

  const db = ensureLocalDb();
  return (db.webhook_logs || []).slice(0, limit);
}

/**
 * Calcula daysSincePurchase e status de liberacao por modulo considerando compra + trava de 7 dias.
 */
function computeAccessStatus(user, dripConfig) {
  const configList = Array.isArray(dripConfig)
    ? dripConfig
    : INITIAL_DRIP_MODULES;

  if (!user) {
    return {
      daysSincePurchase: 0,
      bypassDrip: false,
      permissions: {
        acesso_principal: false,
        acesso_ob1_profissional: false,
        acesso_ob2_modelos: false,
        acesso_ob3_20servicos: false,
        acesso_upsell_negocio: false,
        acesso_ia_consultor: false
      },
      modulesStatus: {}
    };
  }

  const purchaseMs = new Date(
    user.data_primeira_compra || Date.now()
  ).getTime();
  const diffMs = Math.max(0, Date.now() - (Number.isNaN(purchaseMs) ? Date.now() : purchaseMs));
  const daysSincePurchase = Math.floor(diffMs / 86400000);
  const bypassDrip = Boolean(user.liberar_trava_7dias_manual || user.isAdmin);

  const permissions = {
    acesso_principal: Boolean(user.isAdmin || user.acesso_principal),
    acesso_ob1_profissional: Boolean(
      user.isAdmin || user.acesso_ob1_profissional
    ),
    acesso_ob2_modelos: Boolean(user.isAdmin || user.acesso_ob2_modelos),
    acesso_ob3_20servicos: Boolean(user.isAdmin || user.acesso_ob3_20servicos),
    acesso_upsell_negocio: Boolean(user.isAdmin || user.acesso_upsell_negocio),
    acesso_ia_consultor: Boolean(user.isAdmin || user.acesso_ia_consultor)
  };

  const modulesStatus = {};
  for (const item of configList) {
    const accessKey =
      TRACK_TO_ACCESS_KEY[item.trilha] || 'acesso_principal';
    const hasPurchase = Boolean(permissions[accessKey]);
    const dripDays = Math.max(0, Number(item.dias_para_liberar) || 0);

    let unlocked = false;
    let lockReason = null;
    let daysRemaining = 0;

    if (!hasPurchase) {
      unlocked = false;
      lockReason = 'PURCHASE';
    } else if (!bypassDrip && dripDays > daysSincePurchase) {
      unlocked = false;
      lockReason = 'DRIP_7_DAYS';
      daysRemaining = Math.max(1, dripDays - daysSincePurchase);
    } else {
      unlocked = true;
      lockReason = null;
      daysRemaining = 0;
    }

    modulesStatus[item.modulo_id] = {
      modulo_id: item.modulo_id,
      trilha: item.trilha,
      accessKey,
      dripDays,
      codigo_video: item.codigo_video || '',
      unlocked,
      lockReason,
      daysRemaining
    };
  }

  return {
    daysSincePurchase,
    bypassDrip,
    permissions,
    modulesStatus
  };
}

function getCheckoutUrls(userEmail) {
  loadEnv();
  const basePrincipal =
    process.env.CHECKOUT_PRINCIPAL_URL || 'https://pay.novarkbr.com/jxiib47t';
  const basePrincipal37 =
    process.env.CHECKOUT_PRINCIPAL_URL_37 || 'https://pay.novarkbr.com/kg1a7jgt';
  const baseEntenda =
    process.env.CHECKOUT_ENTENDA_URL || 'https://pay.novarkbr.com/agwfds26';
  const baseOb1 =
    process.env.CHECKOUT_OB1_URL_CONSULTOR_RURAL ||
    process.env.CHECKOUT_OB1_URL ||
    'https://pay.novarkbr.com/t61jpbxl';
  const baseOb2 =
    process.env.CHECKOUT_OB2_URL_MODELOS_PRONTOS ||
    process.env.CHECKOUT_OB2_URL ||
    'https://pay.novarkbr.com/ty2kxpf2';
  const baseOb3 =
    process.env.CHECKOUT_OB3_URL_GUIA_SERVICOS ||
    process.env.CHECKOUT_OB3_URL ||
    'https://pay.novarkbr.com/483r78iu';
  const baseCombo3Obs =
    process.env.CHECKOUT_COMBO_3OBS_URL || 'https://pay.novarkbr.com/fotl08p9';
  const baseUpsell =
    process.env.CHECKOUT_UPSELL_URL || 'https://pay.novarkbr.com/p0ptqz86';
  const baseIa =
    process.env.CHECKOUT_IA_URL || baseUpsell;

  const appendEmail = (urlStr) => {
    if (!userEmail) return urlStr;
    const sep = urlStr.includes('?') ? '&' : '?';
    return `${urlStr}${sep}email=${encodeURIComponent(userEmail)}`;
  };

  return {
    principal: appendEmail(basePrincipal),
    principal37: appendEmail(basePrincipal37),
    entenda: appendEmail(baseEntenda),
    ob1: appendEmail(baseOb1),
    ob2: appendEmail(baseOb2),
    ob3: appendEmail(baseOb3),
    combo3obs: appendEmail(baseCombo3Obs),
    upsell: appendEmail(baseUpsell),
    ia: appendEmail(baseIa),
    acesso_principal: appendEmail(basePrincipal),
    acesso_ob1_profissional: appendEmail(baseOb1),
    acesso_ob2_modelos: appendEmail(baseOb2),
    acesso_ob3_20servicos: appendEmail(baseOb3),
    acesso_combo_3obs: appendEmail(baseCombo3Obs),
    acesso_upsell_negocio: appendEmail(baseUpsell),
    acesso_ia_consultor: appendEmail(baseIa)
  };
}

function sanitizeUserForClient(user, dripConfig) {
  if (!user) return null;
  const normalized = normalizeUserRecord(user);
  const access = computeAccessStatus(normalized, dripConfig);
  return {
    id: normalized.id,
    email: normalized.email,
    nome: normalized.nome,
    telefone: normalized.telefone,
    status: normalized.status,
    isAdmin: normalized.isAdmin,
    perfil: normalized.perfil || 'consultor',
    acesso_principal: access.permissions.acesso_principal,
    acesso_ob1_profissional: access.permissions.acesso_ob1_profissional,
    acesso_ob2_modelos: access.permissions.acesso_ob2_modelos,
    acesso_ob3_20servicos: access.permissions.acesso_ob3_20servicos,
    acesso_upsell_negocio: access.permissions.acesso_upsell_negocio,
    acesso_ia_consultor: access.permissions.acesso_ia_consultor,
    data_primeira_compra: normalized.data_primeira_compra,
    liberar_trava_7dias_manual: normalized.liberar_trava_7dias_manual,
    daysSincePurchase: access.daysSincePurchase,
    bypassDrip: access.bypassDrip,
    progresso_aulas: normalized.progresso_aulas,
    perguntas_ia_hoje: normalized.perguntas_ia_hoje,
    data_ultimo_uso_ia: normalized.data_ultimo_uso_ia,
    limite_ia_diario: 40
  };
}

module.exports = {
  INITIAL_DRIP_MODULES,
  TRACK_TO_ACCESS_KEY,
  isSupabaseConfigured,
  ensureLocalDb,
  getUserByEmail,
  upsertUserFromWebhook,
  listAllUsers,
  updateUserAccess,
  getDripConfig,
  updateDripConfig,
  addWebhookLog,
  getWebhookLogs,
  computeAccessStatus,
  getCheckoutUrls,
  sanitizeUserForClient
};
