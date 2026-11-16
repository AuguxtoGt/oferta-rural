'use strict';

/**
 * IMOVEL RURAL EM DIA - APPLE MINIMALIST UI APPLICATION
 * Zero emojis, zero travessoes longos. Todos os icones em SVG fino (stroke-width="1.8").
 */
(function () {
  // Flag do Consultor Rural IA 24h (desativado e oculto ate o lancamento futuro; mude para true para reativar)
  const ENABLE_AI_CONSULTANT = false;

  const SVG_ICONS = {
    lock: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    unlock: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>',
    check: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="20 6 9 17 4 12"/></svg>',
    clock: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>',
    play: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="6 4 20 12 6 20 6 4"/></svg>',
    copy: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    download: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    trash: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    arrowRight: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    arrowLeft: '<svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>'
  };

  const PRESET_AI_CASES = [
    'Meu cliente tem um sitio de 25 ha com CCIR no nome do pai falecido e quer vender. O que faco e quanto cobro?',
    'O banco travou o Pronaf do produtor porque a CND do ITR nao sai e o CIB nao esta vinculado no CNIR. Qual o passo a passo?',
    'O CAR do cliente deu sobreposicao com o vizinho. Como resolver sem briga e qual documento usar?',
    'Monte um orcamento com 3 pacotes para regularizar uma fazenda de 120 hectares com ITR atrasado.'
  ];

  const PRESET_AI_CASES_PROPRIETARIO = [
    'Comprei ou herdei um sitio e o CCIR ainda esta no nome antigo. Qual o passo a passo para passar para o meu nome?',
    'Meu ITR esta atrasado ou com pendencia na Receita Federal. Como regularizar e emitir a Certidao Negativa da minha terra?',
    'Quero pedir financiamento (Pronaf ou Pronamp) no banco. Quais documentos do meu imovel rural preciso deixar prontos?',
    'A area na matricula do cartorio esta diferente do CCIR e do CAR. Qual orgao devo corrigir primeiro?'
  ];

  const PROPRIETARIO_TRACKS = [
    {
      id: 'trilha-prop-principal',
      modRange: [1, 6],
      title: 'Passo a Passo da Minha Propriedade',
      subtitle: 'Como emitir, atualizar e regularizar o seu CCIR, ITR, CAR, Retificação de Área e Crédito Rural.',
      accessKey: 'acesso_principal',
      checkoutUrl: 'https://pay.novarkbr.com/agwfds26'
    },
    {
      id: 'trilha-prop-bonus',
      modRange: [7, 11],
      title: 'Guias e Bônus do Proprietário Rural',
      subtitle: 'Checklists para venda, herança e financiamento, calendário anual de prazos, erros comuns, sobreposição e e-CAC.',
      accessKey: 'acesso_principal',
      checkoutUrl: 'https://pay.novarkbr.com/agwfds26'
    },
    {
      id: 'trilha-prop-modelos',
      modRange: [15, 17],
      title: 'Modelos Jurídicos e Contratos da Terra',
      subtitle: 'Fichas de organização documental da propriedade, recibos, procurações e contratos rurais prontos.',
      accessKey: 'acesso_ob2_modelos',
      checkoutUrl: 'https://pay.novarkbr.com/ty2kxpf2'
    },
    ...(ENABLE_AI_CONSULTANT
      ? [
          {
            id: 'trilha-prop-ia',
            modRange: [24, 24],
            title: 'Tira-Dúvidas Rural IA 24h',
            subtitle: 'Assistente inteligente para responder dúvidas específicas sobre a documentação do seu imóvel rural.',
            accessKey: 'acesso_ia_consultor',
            checkoutUrl: 'https://pay.novarkbr.com/p0ptqz86'
          }
        ]
      : [])
  ];

  const PROPRIETARIO_MODULE_TITLES = {
    1: 'Manual Prático CCIR, ITR e CAR 2026',
    2: 'Passo a Passo do Meu CCIR no INCRA',
    3: 'Passo a Passo do Meu ITR e Certidão no e-CAC',
    4: 'Passo a Passo do Meu CAR no SICAR',
    5: 'Modelos de Solicitação de Retificação de Área',
    6: 'Guia do Proprietário para Crédito Rural',
    7: 'Checklists do Imóvel: Venda, Herança e Banco',
    8: 'Calendário Anual de Prazos da Propriedade',
    9: 'Os 10 Erros que Travam a Terra e Como Corrigir',
    10: 'Como Resolver Sobreposição no CAR e CEFIR',
    11: 'Como Usar o Portal e-CAC para o Seu Imóvel',
    15: 'Fichas de Organização da Pasta da Propriedade',
    16: 'Modelos de Recibos e Declarações Rurais',
    17: 'Procurações e Contratos Rurais do Proprietário',
    24: 'Tira-Dúvidas Rural IA 24h (Proprietário)'
  };

  const CANONICAL_TRACKS = [
    {
      id: 'trilha-principal',
      modRange: [1, 6],
      title: 'Formação Principal',
      subtitle: 'O passo a passo de CCIR, ITR, CAR, Retificação de Área e Crédito Rural.',
      accessKey: 'acesso_principal',
      checkoutUrl: 'https://pay.novarkbr.com/jxiib47t'
    },
    {
      id: 'trilha-bonus',
      modRange: [7, 11],
      title: 'Biblioteca Prática de Campo',
      subtitle: 'Checklists por objetivo, calendário anual, correção de erros, sobreposição e e-CAC.',
      accessKey: 'acesso_principal',
      checkoutUrl: 'https://pay.novarkbr.com/jxiib47t'
    },
    {
      id: 'trilha-ob1',
      modRange: [12, 14],
      title: 'Consultor Rural Profissional',
      subtitle: 'Prospecção de clientes, diagnóstico comercial, precificação e pacotes.',
      accessKey: 'acesso_ob1_profissional',
      checkoutUrl: 'https://pay.novarkbr.com/t61jpbxl'
    },
    {
      id: 'trilha-ob2',
      modRange: [15, 17],
      title: 'Modelos e Contratos Prontos',
      subtitle: 'Fichas de atendimento, auditoria cruzada, propostas, procurações e contratos.',
      accessKey: 'acesso_ob2_modelos',
      checkoutUrl: 'https://pay.novarkbr.com/ty2kxpf2'
    },
    {
      id: 'trilha-ob3',
      modRange: [18, 20],
      title: 'Guia de 20 Serviços Rurais Lucrativos',
      subtitle: 'Catálogo técnico dos 20 serviços mais demandados com execução e preços.',
      accessKey: 'acesso_ob3_20servicos',
      checkoutUrl: 'https://pay.novarkbr.com/483r78iu'
    },
    {
      id: 'trilha-upsell',
      modRange: ENABLE_AI_CONSULTANT ? [21, 24] : [21, 23],
      title: ENABLE_AI_CONSULTANT ? 'Negócio Rural e Consultor IA' : 'Negócio Rural do Zero',
      subtitle: ENABLE_AI_CONSULTANT
        ? 'Posicionamento profissional, parcerias recorrentes e assistente inteligente.'
        : 'Posicionamento profissional, pacotes premium e parcerias recorrentes.',
      accessKey: 'acesso_upsell_negocio',
      checkoutUrl: 'https://pay.novarkbr.com/p0ptqz86'
    }
  ];

  /* Titulos curtos e elegantes para as capas estilo Apple Books (maximo 2 linhas) */
  const SHORT_MODULE_META = {
    1: { shortTitle: 'Manual Prático CCIR, ITR e CAR 2026', tag: 'VISÃO 360 · 26 UFs', art: 'tripe' },
    2: { shortTitle: 'Emissão e Regularização do CCIR no INCRA', tag: 'INCRA · SNCR', art: 'ccir' },
    3: { shortTitle: 'Declaração de ITR, CIB e Certidão no e-CAC', tag: 'RECEITA · DITR', art: 'itr' },
    4: { shortTitle: 'Cadastro Ambiental Rural (CAR e SICAR)', tag: 'MEIO AMBIENTE', art: 'car' },
    5: { shortTitle: 'Guia e Requerimento de Retificação de Área', tag: 'CARTÓRIO · INCRA', art: 'retificacao' },
    6: { shortTitle: 'Acesso ao Crédito Rural Pós-Regularização', tag: 'PRONAF · PLANO SAFRA', art: 'credito' },
    7: { shortTitle: 'Checklists de Documentos por Objetivo', tag: 'VENDA · HERANÇA', art: 'checklist' },
    8: { shortTitle: 'Calendário Anual de Prazos e Obrigações', tag: 'AGENDA RURAL', art: 'calendario' },
    9: { shortTitle: 'Os 10 Erros Mais Comuns e Como Corrigir', tag: 'SOLUÇÃO DE ERROS', art: 'erros' },
    10: { shortTitle: 'Sobreposição de Área no CAR e CEFIR', tag: 'DESBLOQUEIO TÉCNICO', art: 'sobreposicao' },
    11: { shortTitle: 'Dominando o e-CAC para Imóvel Rural', tag: 'CAFIR · CNIR · RFB', art: 'ecac' },
    12: { shortTitle: 'Prospecção e Captação de Clientes Rurais', tag: 'COMERCIAL · CAMPO', art: 'prospeccao' },
    13: { shortTitle: 'Atendimento, Diagnóstico e Apresentação', tag: 'FECHAMENTO', art: 'diagnostico' },
    14: { shortTitle: 'Tabela de Precificação e Pacotes Rurais', tag: 'HONORÁRIOS', art: 'precos' },
    15: { shortTitle: 'Caderno de Fichas e Auditoria Operacional', tag: 'KIT OPERACIONAL', art: 'fichas' },
    16: { shortTitle: 'Propostas Comerciais, Orçamentos e Recibos', tag: 'MODELOS PRONTOS', art: 'propostas' },
    17: { shortTitle: 'Procurações, Termos LGPD e Contratos', tag: 'JURÍDICO PRÁTICO', art: 'contratos' },
    18: { shortTitle: 'Serviços Lucrativos 01 a 07: Cadastrais e Fiscais', tag: 'VOLUME 01', art: 'servicos1' },
    19: { shortTitle: 'Serviços Lucrativos 08 a 14: Ambientais e Posse', tag: 'VOLUME 02', art: 'servicos2' },
    20: { shortTitle: 'Serviços Lucrativos 15 a 20: Crédito e Gestão', tag: 'VOLUME 03', art: 'servicos3' },
    21: { shortTitle: 'Marca de Consultor e Posicionamento Digital', tag: 'AUTORIDADE', art: 'marca' },
    22: { shortTitle: 'Pacotes Premium, Cobrança e Pós-Venda', tag: 'ESCALA E GESTÃO', art: 'pacotes' },
    23: { shortTitle: 'Parcerias com Imobiliárias, Contadores e Sindicatos', tag: 'RENDA RECORRENTE', art: 'parcerias' },
    24: { shortTitle: 'Guia Oficial do Consultor Rural IA', tag: 'INTELIGÊNCIA ARTIFICIAL', art: 'ia' }
  };

  const MODULE_YOUTUBE_VIDEOS = {
    'mod-01': {
      youtubeId: 'vkfm83l7etM',
      url: 'https://youtu.be/vkfm83l7etM',
      title: '1. Os 4 Grandes Documentos Rurais e a Regra de Ouro'
    },
    'mod-02': {
      youtubeId: 'oX35mlvcQ_0',
      url: 'https://youtu.be/oX35mlvcQ_0',
      title: '2. Passo a Passo do CCIR no INCRA (SNCR e DCR)'
    },
    'mod-03': {
      youtubeId: 'zH9O5e1-ycw',
      url: 'https://youtu.be/zH9O5e1-ycw',
      title: '3. Passo a Passo do ITR, CIB, CNIR e Certidão no e-CAC'
    },
    'mod-04': {
      youtubeId: 'NG791XF23_w',
      url: 'https://youtu.be/NG791XF23_w',
      title: '4. Passo a Passo do CAR no SICAR e Reserva Legal'
    },
    'mod-05': {
      youtubeId: '3Mjgfs6Aebk',
      url: 'https://youtu.be/3Mjgfs6Aebk',
      title: '5. Retificação de Área Rural e Pasta Bancária'
    }
  };

  function extractYouTubeId(raw) {
    const str = String(raw || '').trim();
    if (!str) return '';
    const mShort = str.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (mShort) return mShort[1];
    const mLong = str.match(/youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (mLong) return mLong[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
    return '';
  }

  function resolveModuleVideo(mod) {
    if (!mod) return null;
    const mapped = MODULE_YOUTUBE_VIDEOS[mod.id];
    const ytFromCode = extractYouTubeId(mod.videoCode);
    const youtubeId = ytFromCode || (mapped ? mapped.youtubeId : '');
    if (youtubeId) {
      return {
        type: 'youtube',
        youtubeId,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&playsinline=1`,
        watchUrl: `https://youtu.be/${youtubeId}`,
        title: (mapped && mapped.title) || mod.title || `Vídeo do Módulo ${mod.number}`
      };
    }
    const code = String(mod.videoCode || '').trim();
    if (code.endsWith('.mp4') || code.endsWith('.webm') || code.startsWith('/')) {
      return {
        type: 'direct',
        src: code,
        title: mod.title || `Vídeo do Módulo ${mod.number}`
      };
    }
    return null;
  }

  const state = {
    canSimulateDemo: false,
    user: null,
    daysSincePurchase: 0,
    dripConfig: [],
    checkoutUrls: {},
    modules: [],
    currentView: 'home',
    currentSimKey: 'vip',
    searchQuery: '',
    currentModule: null,
    currentLessonIndex: 0,
    modalModule: null,
    aiMessages: [],
    activeToolTab: 'tab-honorarios',
    certSide: 'front',
    certPreviewName: '',
    certPreviewDoc: '',
    certDocEdited: false
  };

  let isRestoringTools = false;

  /* ========================================================================
     UTILITARIOS DE SANITIZACAO (ZERO EMOJIS E ZERO TRAVESSOES)
     ======================================================================== */
  function sanitizeCleanText(text) {
    return String(text || '')
      .replace(/[\u2013\u2014]/g, '-')
      .replace(/\ufb01/g, 'fi')
      .replace(/\ufb02/g, 'fl')
      .replace(/[■]+/g, '')
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '');
  }

  function escapeHtml(str) {
    return sanitizeCleanText(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatBRL(value) {
    const num = Math.round(Number(value) || 0);
    return 'R$ ' + num.toLocaleString('pt-BR');
  }

  function formatBRLCents(value) {
    const num = Number(value) || 0;
    return (
      'R$ ' +
      num.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setHtml(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function escapeCsvCell(val) {
    const clean = sanitizeCleanText(val === null || val === undefined ? '' : String(val)).trim();
    if (/[;"\r\n]/.test(clean)) {
      return '"' + clean.replace(/"/g, '""') + '"';
    }
    return clean;
  }

  function downloadCsvFile(filename, headers, rows) {
    const rawName = sanitizeCleanText(filename || 'planilha-imovel-rural.csv')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-+/g, '-');
    const finalName = rawName.toLowerCase().endsWith('.csv') ? rawName : `${rawName}.csv`;

    const csvLines = [];
    if (Array.isArray(headers) && headers.length > 0) {
      csvLines.push(headers.map(escapeCsvCell).join(';'));
    }
    (rows || []).forEach((row) => {
      if (Array.isArray(row)) {
        csvLines.push(row.map(escapeCsvCell).join(';'));
      }
    });

    const csvContent = csvLines.join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', finalName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast('Planilha .CSV baixada com sucesso.');
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'apple-toast';
    toast.innerHTML = `${SVG_ICONS.check}<span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      toast.style.transition = 'all 0.2s ease';
      setTimeout(() => toast.remove(), 220);
    }, 2600);
  }

  async function apiFetch(url, options = {}) {
    const headers = Object.assign(
      { 'Content-Type': 'application/json' },
      options.headers || {}
    );
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin'
      });
      let data = {};
      try {
        data = await response.json();
      } catch (_e) {
        data = { ok: false, error: 'Erro ao ler resposta do servidor.' };
      }
      return { status: response.status, ok: response.ok && data.ok !== false, data };
    } catch (_err) {
      return { status: 0, ok: false, data: { ok: false } };
    }
  }

  function getLocalCoursesDb() {
    if (typeof window !== 'undefined' && window.COURSES_DB) {
      return window.COURSES_DB;
    }
    return { tracks: CANONICAL_TRACKS, modules: [] };
  }

  function buildCheckoutLinkWithEmail(baseUrl) {
    const base = baseUrl || 'https://pay.novarkbr.com/jxiib47t';
    const email = state.user && state.user.email ? state.user.email : '';
    if (!email) return base;
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}email=${encodeURIComponent(email)}`;
  }

  /* ========================================================================
     TEMA LIGHT MODE APPLE GALLERY (PADRAO) E DARK MODE
     ======================================================================== */
  function initTheme() {
    const saved = localStorage.getItem('rr_theme_apple') || 'light';
    applyTheme(saved);
  }

  function applyTheme(theme) {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', normalized);
    localStorage.setItem('rr_theme_apple', normalized);

    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');

    if (normalized === 'dark') {
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
    } else {
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    showToast(next === 'light' ? 'Modo Claro ativado' : 'Modo Escuro ativado');
  }

  /* ========================================================================
     MENU DISCRETO DE PERFIL NO TOPO DIREITO
     ======================================================================== */
  function toggleProfileMenu(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('profile-dropdown');
    const btn = document.getElementById('profile-menu-btn');
    if (!menu) return;
    const isHidden = menu.classList.toggle('hidden');
    if (btn) btn.setAttribute('aria-expanded', String(!isHidden));
  }

  function closeProfileMenu() {
    const menu = document.getElementById('profile-dropdown');
    const btn = document.getElementById('profile-menu-btn');
    if (menu) menu.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.profile-dropdown-wrap');
    if (wrap && !wrap.contains(e.target)) {
      closeProfileMenu();
    }
  });

  /* ========================================================================
     GERADOR DINAMICO DE CAPAS DE LIVRO APPLE BOOKS / APPLE TV+ (24 MODULOS)
     ======================================================================== */
  function getPaletteForModule(numInt) {
    const palettes = [
      { bg1: '#0a2e1a', bg2: '#15803d', accent: '#86efac', badgeBg: 'rgba(255,255,255,0.12)' },
      { bg1: '#0f2922', bg2: '#0f766e', accent: '#99f6e4', badgeBg: 'rgba(255,255,255,0.12)' },
      { bg1: '#14261c', bg2: '#166534', accent: '#bbf7d0', badgeBg: 'rgba(255,255,255,0.12)' },
      { bg1: '#1c2420', bg2: '#2e4f3e', accent: '#a7f3d0', badgeBg: 'rgba(255,255,255,0.12)' },
      { bg1: '#18181b', bg2: '#27272a', accent: '#fde047', badgeBg: 'rgba(250,204,21,0.16)' },
      { bg1: '#0c1f17', bg2: '#14532d', accent: '#4ade80', badgeBg: 'rgba(255,255,255,0.12)' }
    ];
    return palettes[(numInt - 1) % palettes.length];
  }

  function getCenterIllustrationSvg(artKey, accent) {
    switch (artKey) {
      case 'tripe':
        return `
          <circle cx="120" cy="148" r="46" stroke="${accent}" stroke-width="1.8" stroke-dasharray="4 4" opacity="0.45"/>
          <polygon points="120,104 162,174 78,174" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <circle cx="120" cy="104" r="7" fill="${accent}"/>
          <circle cx="162" cy="174" r="7" fill="${accent}"/>
          <circle cx="78" cy="174" r="7" fill="${accent}"/>
        `;
      case 'ccir':
        return `
          <rect x="82" y="102" width="76" height="94" rx="10" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <line x1="98" y1="126" x2="142" y2="126" stroke="${accent}" stroke-width="1.8"/>
          <line x1="98" y1="142" x2="142" y2="142" stroke="#ffffff" stroke-width="1.8" opacity="0.7"/>
          <circle cx="120" cy="170" r="12" stroke="${accent}" stroke-width="1.8"/>
          <polyline points="115 170 119 174 126 166" stroke="#ffffff" stroke-width="1.8"/>
        `;
      case 'itr':
        return `
          <rect x="76" y="110" width="88" height="76" rx="10" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <polyline points="92 164 110 144 126 154 148 128" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="148" cy="128" r="4" fill="#ffffff"/>
        `;
      case 'car':
        return `
          <path d="M90 176C90 136 122 108 156 108C156 146 128 176 90 176Z" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.07)"/>
          <path d="M90 176L132 134" stroke="${accent}" stroke-width="1.8" stroke-linecap="round"/>
        `;
      case 'retificacao':
        return `
          <polygon points="84,122 146,106 162,166 94,182" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <circle cx="84" cy="122" r="4.5" fill="${accent}"/>
          <circle cx="146" cy="106" r="4.5" fill="${accent}"/>
          <circle cx="162" cy="166" r="4.5" fill="${accent}"/>
          <circle cx="94" cy="182" r="4.5" fill="${accent}"/>
        `;
      case 'credito':
        return `
          <rect x="76" y="116" width="88" height="64" rx="10" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <line x1="76" y1="136" x2="164" y2="136" stroke="${accent}" stroke-width="1.8"/>
          <circle cx="142" cy="158" r="9" stroke="${accent}" stroke-width="1.8"/>
        `;
      case 'checklist':
        return `
          <rect x="84" y="102" width="72" height="92" rx="10" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <polyline points="98 132 104 138 114 126" stroke="${accent}" stroke-width="1.8"/>
          <line x1="122" y1="132" x2="142" y2="132" stroke="#ffffff" stroke-width="1.8"/>
          <polyline points="98 158 104 164 114 152" stroke="${accent}" stroke-width="1.8"/>
          <line x1="122" y1="158" x2="142" y2="158" stroke="#ffffff" stroke-width="1.8"/>
        `;
      case 'calendario':
        return `
          <rect x="80" y="110" width="80" height="76" rx="10" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <line x1="80" y1="132" x2="160" y2="132" stroke="${accent}" stroke-width="1.8"/>
          <circle cx="104" cy="152" r="4" fill="#ffffff"/>
          <circle cx="120" cy="152" r="4" fill="${accent}"/>
          <circle cx="136" cy="152" r="4" fill="#ffffff"/>
        `;
      case 'sobreposicao':
        return `
          <circle cx="106" cy="148" r="30" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.05)"/>
          <circle cx="134" cy="148" r="30" stroke="${accent}" stroke-width="1.8" fill="rgba(255,255,255,0.05)"/>
        `;
      case 'ia':
        return `
          <circle cx="120" cy="148" r="40" stroke="${accent}" stroke-width="1.8" opacity="0.4"/>
          <path d="M120 114L128 138L152 146L128 154L120 178L112 154L88 146L112 138L120 114Z" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.1)"/>
        `;
      default:
        return `
          <rect x="82" y="106" width="76" height="84" rx="12" stroke="#ffffff" stroke-width="1.8" fill="rgba(255,255,255,0.06)"/>
          <path d="M100 156L114 140L126 150L142 130" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="120" cy="148" r="36" stroke="${accent}" stroke-width="1.2" opacity="0.28"/>
        `;
    }
  }

  function buildAppleBookCoverSvg(mod) {
    const numInt = mod.numInt || 1;
    const meta = SHORT_MODULE_META[numInt] || {
      shortTitle: mod.title,
      tag: mod.category || 'FORMAÇÃO RURAL',
      art: 'default'
    };
    const pal = getPaletteForModule(numInt);
    const centerArt = getCenterIllustrationSvg(meta.art, pal.accent);

    return `
      <svg class="book-cover-svg" viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="covGrad${numInt}" x1="0" y1="0" x2="240" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${pal.bg1}"/>
            <stop offset="100%" stop-color="${pal.bg2}"/>
          </linearGradient>
        </defs>
        <rect width="240" height="300" fill="url(#covGrad${numInt})"/>

        <!-- Linhas topograficas sutis de fundo -->
        <path d="M-20 230 C 60 190, 140 260, 260 200" stroke="rgba(255,255,255,0.07)" stroke-width="1.2"/>
        <path d="M-20 260 C 70 220, 150 285, 260 235" stroke="rgba(255,255,255,0.05)" stroke-width="1.2"/>
        <circle cx="120" cy="148" r="64" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>

        <!-- Selo Superior do Modulo -->
        <rect x="22" y="22" width="88" height="24" rx="12" fill="${pal.badgeBg}"/>
        <text x="66" y="38" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="700" letter-spacing="0.08em" text-anchor="middle">MÓDULO ${mod.number}</text>

        <!-- Ilustracao Vetorial Central -->
        ${centerArt}

        <!-- Rodape Minimalista da Capa -->
        <line x1="24" y1="242" x2="216" y2="242" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <text x="24" y="262" fill="${pal.accent}" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" letter-spacing="0.08em">${escapeHtml(meta.tag)}</text>
        <text x="24" y="278" fill="rgba(255,255,255,0.65)" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="500">Imóvel Rural em Dia</text>
      </svg>
    `;
  }

  /* ========================================================================
     SINCRONIZACAO DO CATALOGO E SESSAO
     ======================================================================== */
  function mergeModulesCatalog(apiModules = []) {
    const localDb = getLocalCoursesDb();
    const localMods = Array.isArray(localDb.modules) ? localDb.modules : [];
    const localMap = new Map(localMods.map((m) => [m.id, m]));
    const dripMap = new Map((state.dripConfig || []).map((d) => [d.modulo_id, d]));

    const rawSourceList = apiModules.length > 0 ? apiModules : localMods;
    const sourceList = ENABLE_AI_CONSULTANT
      ? rawSourceList
      : rawSourceList.filter((m) => {
          const mid = String(m.id || m.modulo_id || '');
          return mid !== 'mod-24' && m.accessKey !== 'acesso_ia_consultor' && m.trilha !== 'ia';
        });

    return sourceList.map((m, idx) => {
      const id = m.id || m.modulo_id || `mod-${String(idx + 1).padStart(2, '0')}`;
      const localMod = localMap.get(id) || {};
      const dripRow = dripMap.get(id) || {};
      const numInt = parseInt(String(id).replace('mod-', ''), 10) || idx + 1;
      const numStr = String(numInt).padStart(2, '0');
      const shortMeta = SHORT_MODULE_META[numInt] || {};

      const accessKey =
        m.accessKey ||
        localMod.accessKey ||
        (numInt === 24
          ? 'acesso_ia_consultor'
          : numInt >= 21
            ? 'acesso_upsell_negocio'
            : numInt >= 18
              ? 'acesso_ob3_20servicos'
              : numInt >= 15
                ? 'acesso_ob2_modelos'
                : numInt >= 12
                  ? 'acesso_ob1_profissional'
                  : 'acesso_principal');

      const dripDays =
        dripRow.dias_para_liberar !== undefined
          ? Number(dripRow.dias_para_liberar)
          : m.dripDays !== undefined
            ? Number(m.dripDays)
            : Number(localMod.dripDays || 0);

      const user = state.user;
      const hasPurchase = Boolean(user && (user.isAdmin || user[accessKey] === true));
      const bypassDrip = Boolean(user && (user.isAdmin || user.liberar_trava_7dias_manual === true));
      const daysSince = Number(state.daysSincePurchase || 0);

      let unlocked = m.unlocked !== undefined ? Boolean(m.unlocked) : false;
      let lockReason = m.lockReason || null;
      let daysRemaining = Number(m.daysRemaining || 0);

      if (user) {
        if (!hasPurchase) {
          unlocked = false;
          lockReason = 'PURCHASE';
          daysRemaining = 0;
        } else if (!bypassDrip && dripDays > daysSince) {
          unlocked = false;
          lockReason = 'DRIP_7_DAYS';
          daysRemaining = Math.max(1, dripDays - daysSince);
        } else {
          unlocked = true;
          lockReason = null;
          daysRemaining = 0;
        }
      }

      const lessons =
        Array.isArray(localMod.lessons) && localMod.lessons.length > 0
          ? localMod.lessons
          : Array.isArray(m.lessons)
            ? m.lessons
            : [];

      let canonicalTrackId = 'trilha-principal';
      for (const t of CANONICAL_TRACKS) {
        if (numInt >= t.modRange[0] && numInt <= t.modRange[1]) {
          canonicalTrackId = t.id;
          break;
        }
      }

      const rawDripVideo = String(dripRow.codigo_video || '').trim();
      const isLegacyVideoPlaceholder = /^(V0\d_|VID_M\d+)/i.test(rawDripVideo);
      const effectiveVideoCode =
        (rawDripVideo && !isLegacyVideoPlaceholder ? rawDripVideo : '') ||
        (MODULE_YOUTUBE_VIDEOS[id] ? MODULE_YOUTUBE_VIDEOS[id].url : '') ||
        m.videoCode ||
        localMod.videoCode ||
        '';

      return {
        id,
        number: numStr,
        numInt,
        trackId: canonicalTrackId,
        accessKey,
        title: sanitizeCleanText(shortMeta.shortTitle || m.title || localMod.title || `Módulo ${numStr}`),
        fullTitle: sanitizeCleanText(m.title || localMod.title || `Módulo ${numStr}`),
        subtitle: sanitizeCleanText(m.subtitle || localMod.subtitle || ''),
        category: sanitizeCleanText(shortMeta.tag || localMod.category || m.category || 'MÓDULO PRÁTICO'),
        dripDays,
        videoCode: effectiveVideoCode,
        pdfUrl: localMod.pdfUrl || m.pdfUrl || '',
        unlocked,
        lockReason,
        daysRemaining,
        checkoutUrl:
          m.checkoutUrl ||
          (state.checkoutUrls && state.checkoutUrls[accessKey]) ||
          (numInt === 24
            ? (state.checkoutUrls && state.checkoutUrls.ia) || 'https://pay.novarkbr.com/p0ptqz86'
            : numInt >= 21
              ? 'https://pay.novarkbr.com/p0ptqz86'
              : numInt >= 18
                ? 'https://pay.novarkbr.com/483r78iu'
                : numInt >= 15
                  ? 'https://pay.novarkbr.com/ty2kxpf2'
                  : numInt >= 12
                    ? 'https://pay.novarkbr.com/t61jpbxl'
                    : 'https://pay.novarkbr.com/jxiib47t'),
        lessonCount: lessons.length || m.lessonCount || 1,
        lessons
      };
    });
  }

  async function loadCatalogAndSession() {
    const res = await apiFetch('/api/content');
    if (res.ok && res.data) {
      if (res.data.dripConfig) state.dripConfig = res.data.dripConfig;
      if (res.data.checkoutUrls) state.checkoutUrls = res.data.checkoutUrls;
      if (res.data.daysSincePurchase !== undefined) {
        state.daysSincePurchase = res.data.daysSincePurchase;
      }
      state.modules = mergeModulesCatalog(res.data.modules || []);
    } else {
      state.modules = mergeModulesCatalog([]);
    }
    updateHeaderAndProfile();
    renderTracks();
  }

  /* ========================================================================
     AUTENTICACAO E TROCA DISCRETA DE CONTA DE TESTE
     ======================================================================== */
  function highlightSimMenu(simKey) {
    state.currentSimKey = simKey;
    document.querySelectorAll('.dropdown-item[data-sim]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-sim') === simKey);
    });
  }

  async function quickSwitch(email, simKey = 'vip') {
    closeProfileMenu();

    const res = await apiFetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'quick_switch', email })
    });

    if (!res.ok || !res.data || !res.data.user) {
      showToast(
        (res.data && res.data.error) ||
          'Modo de demonstracao disponivel apenas para o administrador.'
      );
      if (!state.user) {
        showLoginScreen();
      }
      return;
    }

    highlightSimMenu(simKey);
    state.user = res.data.user;
    state.certPreviewName = '';
    state.certPreviewDoc = '';
    state.certDocEdited = false;
    state.canSimulateDemo = Boolean(res.data.canSimulateDemo);
    state.daysSincePurchase = res.data.daysSincePurchase ?? 0;
    state.dripConfig = res.data.dripConfig || state.dripConfig;
    state.checkoutUrls = res.data.checkoutUrls || state.checkoutUrls;
    syncDemoUiVisibility();

    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    await loadCatalogAndSession();
    closeModals();

    if (state.currentView === 'classroom') {
      navigate('home');
    } else if (state.currentView === 'certificate') {
      if (isProprietarioMode()) {
        navigate('home');
      } else {
        renderCertificateView({ syncInputs: true });
      }
    } else {
      updateAiAccessState();
    }

    const toastMap = {
      vip: ENABLE_AI_CONSULTANT
        ? 'Conta ativa: Aluno VIP (24 módulos + Consultor IA)'
        : 'Conta ativa: Aluno VIP (23 módulos completos)',
      dia1: 'Conta ativa: Aluno Dia 1 (Trava de 7 dias ativa)',
      dia8: 'Conta ativa: Aluno Dia 8+ (Módulos de 7 dias liberados)',
      proprietario: 'Portal do Proprietário Rural ativo (Oferta Entenda)'
    };
    showToast(toastMap[simKey] || `Conta alterada para ${email}`);
  }

  function showLoginScreen() {
    closeProfileMenu();
    document.getElementById('app-shell').classList.add('hidden');
    document.getElementById('login-view').classList.remove('hidden');
    const alertBox = document.getElementById('login-alert');
    if (alertBox) alertBox.classList.add('hidden');
  }

  function togglePasswordVisibility() {
    const passEl = document.getElementById('login-password');
    if (!passEl) return;
    passEl.type = passEl.type === 'password' ? 'text' : 'password';
  }

  async function handleLoginSubmit(event) {
    if (event) event.preventDefault();
    const emailEl = document.getElementById('login-email');
    const passEl = document.getElementById('login-password');
    const alertBox = document.getElementById('login-alert');
    const submitBtn = document.getElementById('login-submit-btn');

    const email = (emailEl ? emailEl.value : '').trim().toLowerCase();
    const password = (passEl ? passEl.value : '').trim();

    if (submitBtn) submitBtn.disabled = true;
    if (alertBox) alertBox.classList.add('hidden');

    const res = await apiFetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', email, password })
    });

    if (submitBtn) submitBtn.disabled = false;

    if (!res.ok) {
      if (alertBox) {
        alertBox.textContent = sanitizeCleanText(
          (res.data && res.data.error) ||
            'E-mail sem inscrição ativa localizada. Verifique o e-mail utilizado na compra.'
        );
        alertBox.classList.remove('hidden');
      }
      return;
    }

    state.user = res.data.user;
    state.certPreviewName = '';
    state.certPreviewDoc = '';
    state.certDocEdited = false;
    state.canSimulateDemo = Boolean(res.data.canSimulateDemo);
    state.daysSincePurchase = res.data.daysSincePurchase ?? 0;
    state.dripConfig = res.data.dripConfig || [];
    state.checkoutUrls = res.data.checkoutUrls || {};
    syncDemoUiVisibility();

    document.getElementById('login-view').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    await loadCatalogAndSession();
    navigate('home');
    showToast('Acesso liberado.');
  }

  async function logout() {
    closeProfileMenu();
    await apiFetch('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'logout' })
    });
    try {
      localStorage.removeItem('rr_token');
    } catch (_e) {}
    state.user = null;
    state.certPreviewName = '';
    state.certPreviewDoc = '';
    state.certDocEdited = false;
    state.canSimulateDemo = false;
    syncDemoUiVisibility();
    showLoginScreen();
  }

  /* ========================================================================
     PROGRESSO E CABECALHO
     ======================================================================== */
  function isProprietarioMode() {
    const path = (window.location.pathname || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    if (path.includes('/proprietario') || search.includes('modo=proprietario')) {
      if (!state.user || state.currentSimKey === 'proprietario' || state.user.perfil === 'proprietario') {
        return true;
      }
    }
    if (state.currentSimKey === 'proprietario') return true;
    const u = state.user;
    if (!u) return false;
    if (u.perfil === 'proprietario' || u.email === 'proprietario@rural.com') return true;
    if (Array.isArray(u.progresso_aulas) && u.progresso_aulas.includes('__perfil:proprietario')) {
      return true;
    }
    return false;
  }

  function applyRoleUiTheme() {
    const isProp = isProprietarioMode();

    const heroEyebrow = document.getElementById('hero-eyebrow');
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroAiLabel = document.getElementById('hero-ai-btn-label');
    const navTools = document.getElementById('nav-btn-tools');
    const navAi = document.getElementById('nav-btn-ai');

    if (heroEyebrow) {
      heroEyebrow.textContent = isProp
        ? 'PORTAL DO PROPRIETÁRIO RURAL · ENTENDA SEM SE PERDER'
        : 'FORMAÇÃO CONSULTOR RURAL';
    }
    if (heroTitle) {
      heroTitle.textContent = isProp
        ? 'Organize e regularize o seu imóvel rural sem depender de ninguém.'
        : 'Domine a regularização rural com clareza visual.';
    }
    if (heroSubtitle) {
      heroSubtitle.textContent = isProp
        ? 'Passo a passo prático de CCIR, ITR, CAR, Retificação de Área e Crédito Rural para deixar a documentação da sua terra 100% em dia.'
        : ENABLE_AI_CONSULTANT
          ? 'CCIR, ITR, CAR, Retificação de Área, Crédito Rural e Consultoria em 24 módulos práticos.'
          : 'CCIR, ITR, CAR, Retificação de Área, Crédito Rural e Consultoria em 23 módulos práticos.';
    }
    const heroSecondaryBtn = document.getElementById('hero-secondary-btn');
    if (heroSecondaryBtn) {
      heroSecondaryBtn.onclick = () => navigate(ENABLE_AI_CONSULTANT ? 'ai' : 'tools');
    }
    if (heroAiLabel) {
      if (ENABLE_AI_CONSULTANT) {
        heroAiLabel.textContent = isProp ? 'Tira-Dúvidas IA da Minha Terra' : 'Abrir Consultor IA';
      } else {
        heroAiLabel.textContent = isProp ? 'Diagnóstico do Meu Imóvel' : 'Ferramentas e Planilhas';
      }
    }
    if (navTools) {
      navTools.textContent = isProp ? 'Diagnóstico do Meu Imóvel' : 'Ferramentas e Planilhas';
    }
    if (navAi) {
      navAi.classList.toggle('hidden', !ENABLE_AI_CONSULTANT);
      navAi.textContent = isProp ? 'Tira-Dúvidas IA' : 'Consultor IA';
    }

    // Ajusta navegacao e cabecalhos das 6 planilhas interativas conforme o perfil
    const toolsNavPills = document.getElementById('tools-nav-pills');
    if (toolsNavPills) {
      toolsNavPills.classList.remove('hidden');
    }

    const pillHonorarios = document.getElementById('pill-tab-honorarios');
    const pillAuditoria = document.getElementById('pill-tab-auditoria');
    const pillMeta = document.getElementById('pill-tab-meta');
    const pillConversor = document.getElementById('pill-tab-conversor');
    const pillItr = document.getElementById('pill-tab-itr');
    const pillCrm = document.getElementById('pill-tab-crm');

    document.querySelectorAll('[data-role-only="consultor"]').forEach((el) => {
      if (el.hasAttribute('data-tool-panel')) return;
      el.classList.toggle('hidden', isProp);
    });

    if (isProp) {
      if (pillAuditoria) pillAuditoria.textContent = '01 Diagnóstico 4 Órgãos';
      if (pillConversor) pillConversor.textContent = '02 Conversor de Área';
      if (pillItr) pillItr.textContent = '03 Simulador Meu ITR';
      if (pillCrm) pillCrm.textContent = '04 Ficha da Minha Terra';
      setText('tools-eyebrow', 'FERRAMENTAS DA PROPRIEDADE');
      setText('tools-title', 'Planilhas e Simuladores da Sua Terra.');
      setText(
        'tools-subtitle',
        'Confira os 4 documentos do imóvel, converta medidas antigas para hectares, simule seu ITR legal e organize a ficha das suas glebas.'
      );
      setText('audit-eyebrow', 'FERRAMENTA INTERATIVA 01');
      setText(
        'audit-title',
        'Diagnóstico dos 4 Documentos da Sua Terra (Matrícula x CCIR x ITR x CAR)'
      );
      setText('conv-eyebrow', 'FERRAMENTA INTERATIVA 02');
      setText('itr-eyebrow', 'FERRAMENTA INTERATIVA 03');
      setText('crm-eyebrow', 'FERRAMENTA INTERATIVA 04');
      setText('crm-title', 'Ficha Patrimonial das Minhas Glebas e Vencimentos');
      setText(
        'crm-desc',
        'Organize as matrículas e glebas da sua propriedade, códigos CCIR/CIB/CAR, taxas anuais e situação cadastral salvos neste navegador.'
      );
      setText('crm-kpi-main-tag', 'TAXAS E IMPOSTOS ANUAIS ESTIMADOS');
      setText('crm-kpi-sub1-label', 'Já Quitado');
      setText('crm-kpi-sub2-label', 'Em Aberto no Ano');
      setText('crm-kpi-sub3-label', 'Glebas Cadastradas');
      setText('crm-label-name', 'Gleba / Imóvel');
      setText('crm-label-doc', 'Matrícula / CCIR / CIB');
      setText('crm-label-value', 'Taxa / Imposto Anual (R$)');
      setText('crm-chart-title', 'Situação de Quitação Anual e Regularidade das Glebas');
      setText(
        'crm-chart-sub',
        'Comparativo em tempo real entre taxas quitadas, em aberto e situação cadastral'
      );
    } else {
      if (pillHonorarios) pillHonorarios.textContent = '01 Honorários';
      if (pillAuditoria) pillAuditoria.textContent = '02 Auditoria 4 Órgãos';
      if (pillMeta) pillMeta.textContent = '03 Meta 12 Meses';
      if (pillConversor) pillConversor.textContent = '04 Conversor de Área';
      if (pillItr) pillItr.textContent = '05 Simulador ITR';
      if (pillCrm) pillCrm.textContent = '06 Carteira CRM';
      setText('tools-eyebrow', 'CENTRAL OPERACIONAL DO CONSULTOR');
      setText('tools-title', '6 Planilhas e Simuladores de Campo.');
      setText(
        'tools-subtitle',
        'Calcule honorários, audite os 4 órgãos, projete 12 meses de receita, converta áreas, simule ITR e gerencie sua carteira com gráficos e Excel .CSV.'
      );
      setText('audit-eyebrow', 'PLANILHA INTERATIVA 02');
      setText(
        'audit-title',
        'Auditoria Cruzada dos 4 Órgãos (Matrícula x CCIR x ITR x CAR)'
      );
      setText('conv-eyebrow', 'PLANILHA INTERATIVA 04');
      setText('itr-eyebrow', 'PLANILHA INTERATIVA 05');
      setText('crm-eyebrow', 'PLANILHA INTERATIVA 06');
      setText('crm-title', 'Carteira CRM de Clientes e Recebíveis 50/50');
      setText(
        'crm-desc',
        'Cadastre seus atendimentos ativos, acompanhe o andamento nos órgãos e controle entradas e saldos salvos automaticamente no seu navegador.'
      );
      setText('crm-kpi-main-tag', 'VALOR TOTAL EM CARTEIRA');
      setText('crm-kpi-sub1-label', 'Já Recebido');
      setText('crm-kpi-sub2-label', 'A Receber na Entrega');
      setText('crm-kpi-sub3-label', 'Pastas Ativas');
      setText('crm-label-name', 'Cliente / Propriedade');
      setText('crm-label-doc', 'Órgãos / Códigos');
      setText('crm-label-value', 'Honorários (R$)');
      setText('crm-chart-title', 'Distribuição Financeira e Status Operacional da Carteira');
      setText(
        'crm-chart-sub',
        'Comparativo em tempo real entre valores recebidos, pendentes e etapas'
      );
    }

    const crmNameInput = document.getElementById('crm-name');
    const crmDocInput = document.getElementById('crm-doc');
    const crmValueInput = document.getElementById('crm-value');
    const crmStatusSelect = document.getElementById('crm-status');
    if (crmNameInput) {
      crmNameInput.placeholder = isProp
        ? 'Ex.: Gleba Principal - Sítio São José'
        : 'Ex.: Sítio São José (Sr. Marcos)';
    }
    if (crmDocInput) {
      crmDocInput.placeholder = isProp
        ? 'Ex.: Matr. 14.820 · CCIR e CIB'
        : 'Ex.: DCR INCRA + ITR + CAR';
    }
    if (crmValueInput) {
      crmValueInput.placeholder = isProp ? '240' : '1650';
    }
    if (crmStatusSelect && crmStatusSelect.getAttribute('data-role-mode') !== (isProp ? 'prop' : 'cons')) {
      crmStatusSelect.setAttribute('data-role-mode', isProp ? 'prop' : 'cons');
      crmStatusSelect.innerHTML = isProp
        ? [
            '<option value="Em Dia">Em Dia</option>',
            '<option value="Em Atualização">Em Atualização</option>',
            '<option value="Pendente">Pendente</option>'
          ].join('')
        : [
            '<option value="Triagem">Triagem Documental</option>',
            '<option value="Em Protocolo">Em Protocolo</option>',
            '<option value="Aguardando Órgão">Aguardando Órgão</option>',
            '<option value="Concluído">Concluído / Quitado</option>'
          ].join('');
    }

    // Atualiza as 4 pilulas de sugestao do chat de IA
    const pills = document.querySelectorAll('.ai-suggestions-row .ai-suggestion-pill');
    const activeCases = isProp ? PRESET_AI_CASES_PROPRIETARIO : PRESET_AI_CASES;
    const pillLabelsProp = [
      'Passar CCIR de falecido/antigo dono para meu nome',
      'Regularizar ITR atrasado e emitir Certidão Negativa',
      'Documentos do imóvel para pedir Pronaf/Pronamp',
      'Área diferente entre Escritura, CCIR e CAR'
    ];
    const pillLabelsCons = [
      'Sítio de 25 ha com CCIR no nome de falecido',
      'Pronaf travado por CND de ITR e vínculo no CNIR',
      'Sobreposição de área no CAR com vizinho',
      'Orçamento em 3 pacotes para fazenda de 120 ha'
    ];
    pills.forEach((btn, idx) => {
      btn.textContent = isProp
        ? pillLabelsProp[idx] || activeCases[idx]
        : pillLabelsCons[idx] || activeCases[idx];
    });

    const footerBrand = document.getElementById('footer-legal-brand');
    if (footerBrand) {
      footerBrand.textContent = isProp
        ? 'Portal do Proprietário Rural · Conteúdo Educacional Independente (sem vínculo governamental)'
        : 'Imóvel Rural em Dia · Conteúdo Educacional Independente (sem vínculo governamental)';
    }

    const footerDisclaimer = document.getElementById('footer-legal-disclaimer');
    if (footerDisclaimer) {
      footerDisclaimer.innerHTML = isProp
        ? '<strong>Aviso Legal:</strong> Este portal possui caráter exclusivamente educacional e informativo sobre organização documental de imóveis rurais, sem qualquer vínculo com INCRA, Receita Federal, SICAR, IBAMA, cartórios ou instituições financeiras. Os guias, checklists, diagnósticos e modelos disponibilizados são referenciais e não substituem análise técnica, jurídica, contábil, tributária, ambiental ou fundiária individualizada, nem dispensam a contratação de profissional habilitado em conselho de classe (como CREA, CFT, OAB ou CRC) quando exigido por lei, cartório, banco ou órgão público (incluindo georreferenciamento no SIGEF, plantas, memoriais com ART/TRT, retificações contenciosas e projetos PRADA). Sistemas oficiais, normas, prazos, taxas e exigências podem mudar sem aviso prévio: confira sempre todas as informações diretamente nos canais oficiais e órgãos competentes antes de executar qualquer procedimento ou assinar documentos.'
        : '<strong>Aviso Legal:</strong> Esta plataforma possui caráter exclusivamente educacional e informativo sobre rotinas cadastrais de imóveis rurais, sem qualquer vínculo com INCRA, Receita Federal, SICAR, IBAMA, cartórios ou instituições financeiras. O conteúdo, as planilhas e os modelos disponibilizados são referenciais e não substituem análise técnica, jurídica, contábil, tributária, ambiental ou fundiária individualizada, nem habilitam para atos privativos de profissionais registrados em conselhos de classe (como CREA, CFT, OAB ou CRC, incluindo georreferenciamento no SIGEF, plantas, memoriais ou laudos com ART/TRT e projetos PRADA). Valores de honorários, tabelas de preços e simulações financeiras são estimativas educativas de mercado, sem promessa ou garantia de faturamento. Sistemas oficiais, normas, prazos, taxas e exigências podem mudar sem aviso prévio: confira sempre todas as informações diretamente nos canais oficiais e órgãos competentes antes de executar qualquer procedimento ou assinar documentos.';
    }

    renderCrmSheet();
    switchToolTab(state.activeToolTab);
    updateHomeKpiStrip();
    if (isProp && state.currentView === 'certificate') {
      navigate('home');
    }
  }

  function getCompletedLessonsSet() {
    const arr =
      state.user && Array.isArray(state.user.progresso_aulas)
        ? state.user.progresso_aulas.filter((item) => !String(item).startsWith('__'))
        : [];
    return new Set(arr);
  }

  function computeOverallProgress() {
    const completed = getCompletedLessonsSet();
    const isProp = isProprietarioMode();
    const activeTracks = isProp ? PROPRIETARIO_TRACKS : CANONICAL_TRACKS;
    let totalLessons = 0;
    let doneCount = 0;

    state.modules.forEach((mod) => {
      const inRole = activeTracks.some(
        (t) => mod.numInt >= t.modRange[0] && mod.numInt <= t.modRange[1]
      );
      if (inRole && mod.unlocked && Array.isArray(mod.lessons)) {
        mod.lessons.forEach((lesson) => {
          totalLessons += 1;
          if (completed.has(lesson.id)) doneCount += 1;
        });
      }
    });

    const pct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;
    return { totalLessons, doneCount, pct };
  }

  function updateHomeKpiStrip() {
    const isProp = isProprietarioMode();
    const prog = computeOverallProgress();
    const activeTracks = isProp ? PROPRIETARIO_TRACKS : CANONICAL_TRACKS;
    const roleModules = state.modules.filter((m) =>
      activeTracks.some((t) => m.numInt >= t.modRange[0] && m.numInt <= t.modRange[1])
    );
    const totalVisibleModsCount = roleModules.length || (isProp ? 14 : 23);
    const unlockedModsCount = roleModules.filter((m) => m.unlocked).length;

    let checksCount = 0;
    try {
      const savedChecks = JSON.parse(localStorage.getItem('rr_checklist_items') || '{}');
      if (savedChecks && typeof savedChecks === 'object') {
        checksCount = Object.keys(savedChecks).filter((k) => Boolean(savedChecks[k])).length;
      }
    } catch (_e) {
      checksCount = 0;
    }

    setText('kpi-overall-pct', `${prog.pct}%`);
    const barEl = document.getElementById('kpi-overall-bar');
    if (barEl) barEl.style.width = `${prog.pct}%`;
    setText('kpi-overall-sub', `${prog.doneCount} concluídas de ${prog.totalLessons} liberadas`);
    setText('kpi-lessons-done', `${prog.doneCount} / ${prog.totalLessons || 70}`);
    setText('kpi-mods-unlocked', `${unlockedModsCount} de ${totalVisibleModsCount} módulos liberados`);
    setText('kpi-checks-done', `${checksCount} ${checksCount === 1 ? 'item' : 'itens'}`);

    setText('kpi-tools-eyebrow', isProp ? 'Ferramentas da Terra' : 'Central Operacional');
    setText('kpi-tools-count', isProp ? '4 Ferramentas' : '6 Planilhas');
    setText(
      'kpi-tools-cta',
      isProp ? 'Diagnóstico, área, ITR e ficha .CSV' : 'Gráficos ao vivo e download .CSV'
    );
    updateCertificateSummaryUi();
  }

  function updateHeaderAndProfile() {
    const user = state.user || { nome: 'Aluno Consultor', email: 'vip@rural.com' };
    const cleanName = sanitizeCleanText(user.nome || 'Aluno Consultor');
    const initials = cleanName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('') || 'AL';

    const initEl = document.getElementById('header-user-initials');
    const emailEl = document.getElementById('header-user-email');
    const dropName = document.getElementById('dropdown-user-name');
    const dropEmail = document.getElementById('dropdown-user-email');

    if (initEl) initEl.textContent = initials;
    if (emailEl) emailEl.textContent = user.email || '';
    if (dropName) dropName.textContent = cleanName;
    if (dropEmail) dropEmail.textContent = user.email || '';

    const prog = computeOverallProgress();
    const pctEl = document.getElementById('header-progress-pct');
    const barEl = document.getElementById('header-progress-bar');
    if (pctEl) pctEl.textContent = `${prog.pct}% concluído (${prog.doneCount}/${prog.totalLessons} aulas)`;
    if (barEl) barEl.style.width = `${prog.pct}%`;

    applyRoleUiTheme();
    updateHomeKpiStrip();
    updateAiAccessState();
    updateCertificateSummaryUi();
  }

  /* ========================================================================
     NAVEGACAO ENTRE AS VISÕES (HOME, CLASSROOM, TOOLS, AI, CERTIFICATE)
     ======================================================================== */
  function navigate(viewName) {
    if (viewName === 'ai' && !ENABLE_AI_CONSULTANT) {
      viewName = 'tools';
    }
    if (viewName === 'certificate' && isProprietarioMode()) {
      viewName = 'home';
    }
    state.currentView = viewName;
    const views = ['home', 'classroom', 'tools', 'ai', 'certificate'];
    views.forEach((v) => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.classList.toggle('hidden', v !== viewName);
    });

    document.querySelectorAll('.nav-item').forEach((btn) => {
      const target = btn.getAttribute('data-nav');
      btn.classList.toggle('active', target === viewName || (viewName === 'classroom' && target === 'home'));
    });

    if (viewName === 'tools') {
      recalculatePricing();
      runCrossAudit();
      recalculateGoal();
      recalculateConverter();
      recalculateItr();
      renderCrmSheet();
      switchToolTab(state.activeToolTab);
    } else if (viewName === 'home') {
      updateHomeKpiStrip();
    } else if (viewName === 'certificate') {
      renderCertificateView({ syncInputs: true });
    } else if (viewName === 'ai') {
      updateAiAccessState();
      if (state.aiMessages.length === 0) {
        initAiWelcomeMessage();
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openCertificateFromMenu() {
    closeProfileMenu();
    navigate('certificate');
  }

  function continueStudying() {
    const firstUnlocked = state.modules.find((m) => m.unlocked) || state.modules[0];
    if (firstUnlocked) {
      openModule(firstUnlocked.id, 0);
    }
  }

  /* ========================================================================
     VITRINE DE CAPAS DE MODULOS (APPLE BOOKS / APPLE TV+)
     ======================================================================== */
  function handleSearch(query) {
    state.searchQuery = String(query || '').trim().toLowerCase();
    const clearBtn = document.getElementById('search-clear-btn');
    if (clearBtn) {
      clearBtn.classList.toggle('hidden', state.searchQuery.length === 0);
    }
    if (state.searchQuery && state.currentView !== 'home') {
      navigate('home');
    }
    renderTracks();
  }

  function clearSearch() {
    const input = document.getElementById('module-search-input');
    if (input) input.value = '';
    handleSearch('');
  }

  function moduleMatchesSearch(mod) {
    if (!state.searchQuery) return true;
    const q = state.searchQuery;
    const haystack = [
      mod.title,
      mod.fullTitle,
      mod.subtitle,
      mod.category,
      `modulo ${mod.number}`,
      ...(mod.lessons || []).map((l) => l.title)
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  }

  function getModuleProgress(mod) {
    const completed = getCompletedLessonsSet();
    const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
    if (lessons.length === 0) return { done: 0, total: mod.lessonCount || 1, pct: 0 };
    let done = 0;
    lessons.forEach((l) => {
      if (completed.has(l.id)) done += 1;
    });
    return {
      done,
      total: lessons.length,
      pct: Math.round((done / lessons.length) * 100)
    };
  }

  function renderTracks() {
    const container = document.getElementById('tracks-container');
    if (!container) return;

    const isProp = isProprietarioMode();
    const activeTracks = isProp ? PROPRIETARIO_TRACKS : CANONICAL_TRACKS;

    let html = '';
    let totalVisible = 0;

    activeTracks.forEach((track) => {
      const trackModules = state.modules.filter(
        (m) =>
          m.numInt >= track.modRange[0] &&
          m.numInt <= track.modRange[1] &&
          moduleMatchesSearch(m)
      );

      if (trackModules.length === 0) return;
      totalVisible += trackModules.length;

      const cardsHtml = trackModules
        .map((mod) => {
          const displayTitle =
            isProp && PROPRIETARIO_MODULE_TITLES[mod.numInt]
              ? PROPRIETARIO_MODULE_TITLES[mod.numInt]
              : mod.title;
          const prog = getModuleProgress(mod);
          const coverSvg = buildAppleBookCoverSvg(mod);

          let lockOverlayHtml = '';
          let captionHtml = '';
          const hasVideo = Boolean(resolveModuleVideo(mod));

          if (mod.unlocked) {
            if (prog.pct === 100) {
              captionHtml = `<span class="book-caption caption-done">${SVG_ICONS.check}<span>${hasVideo ? 'Vídeo + ' : ''}${prog.total} aulas · Concluído</span></span>`;
            } else if (prog.done > 0) {
              captionHtml = `<span class="book-caption">${hasVideo ? SVG_ICONS.play + '<span>Vídeo · ' : '<span>'}${prog.done} de ${prog.total} aulas</span></span>`;
            } else if (hasVideo) {
              captionHtml = `<span class="book-caption">${SVG_ICONS.play}<span>Vídeo + ${prog.total} ${prog.total === 1 ? 'aula' : 'aulas'}</span></span>`;
            } else {
              captionHtml = `<span class="book-caption">${prog.total} ${prog.total === 1 ? 'aula' : 'aulas'}</span>`;
            }
          } else if (mod.lockReason === 'DRIP_7_DAYS') {
            lockOverlayHtml = `<span class="book-lock-pill" title="Liberação programada">${SVG_ICONS.clock}</span>`;
            captionHtml = `<span class="book-caption">${SVG_ICONS.clock}<span>Libera em ${mod.daysRemaining} dias</span></span>`;
          } else {
            lockOverlayHtml = `<span class="book-lock-pill" title="Módulo bloqueado">${SVG_ICONS.lock}</span>`;
            captionHtml = `<span class="book-caption">${SVG_ICONS.lock}<span>Bloqueado</span></span>`;
          }

          return `
            <article
              class="apple-book-card"
              onclick="window.RRApp.handleModuleCardClick('${mod.id}')"
              role="button"
              tabindex="0"
              aria-label="Módulo ${mod.number}: ${escapeHtml(displayTitle)}"
            >
              <div class="book-cover-frame">
                ${coverSvg}
                <div class="book-spine-sheen"></div>
                ${lockOverlayHtml}
              </div>
              <div class="book-meta">
                <h3 class="book-title">${escapeHtml(displayTitle)}</h3>
                ${captionHtml}
              </div>
            </article>
          `;
        })
        .join('');

      html += `
        <section class="track-tile" id="section-${track.id}">
          <div class="track-tile-inner">
            <div class="track-header">
              <div>
                <h2 class="track-title">${escapeHtml(track.title)}</h2>
                <p class="track-subtitle">${escapeHtml(track.subtitle)}</p>
              </div>
              <div class="track-controls">
                <button type="button" class="carousel-btn" onclick="window.RRApp.scrollCarousel('carousel-${track.id}', -520)" aria-label="Anterior">
                  ${SVG_ICONS.arrowLeft}
                </button>
                <button type="button" class="carousel-btn" onclick="window.RRApp.scrollCarousel('carousel-${track.id}', 520)" aria-label="Próximo">
                  ${SVG_ICONS.arrowRight}
                </button>
              </div>
            </div>
            <div id="carousel-${track.id}" class="covers-carousel">
              ${cardsHtml}
            </div>
          </div>
        </section>
      `;
    });

    if (totalVisible === 0) {
      html = `
        <section class="track-tile">
          <div class="track-tile-inner" style="text-align: center; padding: 48px 0;">
            <h2 class="track-title">Nenhum módulo encontrado</h2>
            <p class="track-subtitle" style="margin: 8px 0 20px;">Não encontramos resultados para "${escapeHtml(state.searchQuery)}".</p>
            <button type="button" class="btn-apple-primary" onclick="window.RRApp.clearSearch()">
              Mostrar todos os módulos
            </button>
          </div>
        </section>
      `;
    }

    container.innerHTML = html;
    updateHomeKpiStrip();
  }

  function scrollCarousel(carouselId, delta) {
    const el = document.getElementById(carouselId);
    if (el) {
      el.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }

  /* ========================================================================
     LEITOR INTERATIVO DE MODULO (WORKBOOK VISUAL)
     ======================================================================== */
  async function handleModuleCardClick(modId) {
    const mod = state.modules.find((m) => m.id === modId);
    if (!mod) return;

    if (!mod.unlocked) {
      if (mod.lockReason === 'DRIP_7_DAYS') {
        openDripModal(mod);
      } else {
        openPurchaseModal(mod);
      }
      return;
    }

    await openModule(modId, 0);
  }

  async function openModule(modId, lessonIdx = 0) {
    const mod = state.modules.find((m) => m.id === modId);
    if (!mod) return;

    const res = await apiFetch(`/api/content?moduleId=${encodeURIComponent(modId)}`);

    if (!res.ok && res.status === 401) {
      showLoginScreen();
      return;
    }

    if (!res.ok && res.status === 403 && res.data) {
      if (res.data.lockReason === 'DRIP_7_DAYS') {
        openDripModal(mod);
      } else {
        openPurchaseModal(mod);
      }
      return;
    }

    if (!res.ok) {
      showToast('Nao foi possivel carregar o modulo. Faca login novamente.');
      return;
    }

    const localDb = getLocalCoursesDb();
    const localMod = (localDb.modules || []).find((m) => m.id === modId) || {};
    const apiLessons =
      res.data && res.data.module && Array.isArray(res.data.module.lessons)
        ? res.data.module.lessons
        : [];
    const fullLessons =
      Array.isArray(localMod.lessons) && localMod.lessons.length > 0
        ? localMod.lessons
        : apiLessons;

    state.currentModule = {
      ...mod,
      lessons: fullLessons
    };
    state.currentLessonIndex = Math.max(0, Math.min(lessonIdx, fullLessons.length - 1));

    const heroContinueLabel = document.getElementById('hero-continue-label');
    if (heroContinueLabel) {
      heroContinueLabel.textContent = `Continuar: Módulo ${mod.number}`;
    }

    navigate('classroom');
    renderClassroom();
  }

  function renderClassroom() {
    const mod = state.currentModule;
    if (!mod) return;

    document.getElementById('cls-mod-number').textContent = `MÓDULO ${mod.number}`;
    document.getElementById('cls-mod-title').textContent = mod.title;

    const sidePdfBtn = document.getElementById('cls-sidebar-pdf-btn');
    if (sidePdfBtn) sidePdfBtn.classList.toggle('hidden', !mod.pdfUrl);

    renderVideoStage(mod);
    renderClassroomSidebarLessons();
    renderActiveLessonContent();
  }

  function renderVideoStage(mod) {
    const stage = document.getElementById('cls-video-stage');
    if (!stage) return;

    const videoMeta = resolveModuleVideo(mod);

    if (!videoMeta) {
      stage.innerHTML = '';
      stage.classList.add('hidden');
      return;
    }

    stage.classList.remove('hidden');

    if (videoMeta.type === 'youtube') {
      stage.innerHTML = `
        <div class="apple-video-card">
          <div class="apple-video-header">
            <div class="apple-video-header-left">
              <span class="apple-video-badge">${SVG_ICONS.play}<span>Vídeo-Aula · Módulo ${mod.number}</span></span>
              <span class="apple-video-title">${escapeHtml(videoMeta.title)}</span>
            </div>
            <a
              href="${escapeHtml(videoMeta.watchUrl)}"
              target="_blank"
              rel="noopener noreferrer"
              class="apple-video-yt-link"
            >
              <span>Assistir no YouTube</span>
              ${SVG_ICONS.arrowRight}
            </a>
          </div>
          <div class="apple-video-frame">
            <iframe
              src="${escapeHtml(videoMeta.embedUrl)}"
              title="${escapeHtml(videoMeta.title)}"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      `;
    } else {
      stage.innerHTML = `
        <div class="apple-video-card">
          <div class="apple-video-frame">
            <video controls preload="metadata" src="${escapeHtml(videoMeta.src)}">
              Seu navegador não suporta vídeo HTML5.
            </video>
          </div>
        </div>
      `;
    }
  }

  function renderClassroomSidebarLessons() {
    const mod = state.currentModule;
    if (!mod) return;

    const completed = getCompletedLessonsSet();
    const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
    const prog = getModuleProgress(mod);

    const progText = document.getElementById('cls-mod-progress-text');
    const progBar = document.getElementById('cls-mod-progress-bar');
    if (progText) progText.textContent = `${prog.done} de ${prog.total} aulas`;
    if (progBar) progBar.style.width = `${prog.pct}%`;

    const listEl = document.getElementById('cls-lessons-list');
    if (!listEl) return;

    listEl.innerHTML = lessons
      .map((lesson, idx) => {
        const isDone = completed.has(lesson.id);
        const isActive = idx === state.currentLessonIndex;
        const shortLessonTitle = sanitizeCleanText(lesson.title)
          .replace(/^(Parte|Aula)\s+\d+:\s*/i, '')
          .replace(/\(Etapas\s+\d+\s+a\s+\d+\)/i, '')
          .trim();

        return `
          <button
            type="button"
            class="lesson-nav-item ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}"
            onclick="window.RRApp.selectLesson(${idx})"
          >
            <span class="lesson-nav-num">
              ${isDone ? SVG_ICONS.check : String(idx + 1).padStart(2, '0')}
            </span>
            <span class="lesson-nav-text">
              <span class="lesson-nav-title">Aula ${String(idx + 1).padStart(2, '0')}: ${escapeHtml(shortLessonTitle || lesson.title)}</span>
              <span class="lesson-nav-dur">${escapeHtml(lesson.duration || '15 min')}${isDone ? ' · Concluída' : ''}</span>
            </span>
          </button>
        `;
      })
      .join('');
  }

  function selectLesson(index) {
    if (!state.currentModule) return;
    state.currentLessonIndex = index;
    renderClassroomSidebarLessons();
    renderActiveLessonContent();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildModuleVisualBanner(mod, lessonIdx) {
    const stepsByTrack = {
      'trilha-principal': [
        { num: '01', title: 'Triagem Documental', sub: 'Matrícula, CPF e Código' },
        { num: '02', title: 'Acesso ao Portal Oficial', sub: 'SNCR, e-CAC ou SICAR' },
        { num: '03', title: 'Validação Cruzada', sub: 'Mesma área nos 3 órgãos' },
        { num: '04', title: 'Emissão e Quitação', sub: 'Certidão e recibo ativo' }
      ],
      'trilha-bonus': [
        { num: '01', title: 'Identificação do Caso', sub: 'Venda, herança ou crédito' },
        { num: '02', title: 'Conferência de Prazos', sub: 'CCIR, ITR e regularidade' },
        { num: '03', title: 'Saneamento de Pendência', sub: 'Correção técnica guiada' },
        { num: '04', title: 'Pasta Pronta', sub: 'Dossiê validado' }
      ],
      default: [
        { num: '01', title: 'Captação e Triagem', sub: 'Levantamento do imóvel' },
        { num: '02', title: 'Diagnóstico Técnico', sub: 'Cruzamento de cadastros' },
        { num: '03', title: 'Proposta em 3 Níveis', sub: 'Entrada 50% + contrato' },
        { num: '04', title: 'Entrega e Pós-Venda', sub: 'Renovação anual recorrente' }
      ]
    };

    const steps = stepsByTrack[mod.trackId] || stepsByTrack.default;

    return `
      <div class="visual-banner">
        <div class="visual-banner-head">
          <div>
            <span class="visual-banner-eyebrow">FLUXO VISUAL DO MÓDULO ${mod.number} · AULA 0${lessonIdx + 1}</span>
            <h4 class="visual-banner-title">${escapeHtml(mod.title)}</h4>
          </div>
          <button type="button" class="btn-copy-pill" onclick="window.RRApp.navigate('tools')">
            <span>Abrir Planilhas Interativas</span>
          </button>
        </div>
        <div class="topic-grid" style="margin: 0;">
          ${steps
            .map(
              (s) => `
              <div class="topic-card">
                <div class="topic-card-top">
                  <span class="topic-card-num">${s.num}</span>
                </div>
                <h4>${escapeHtml(s.title)}</h4>
                <p>${escapeHtml(s.sub)}</p>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  function renderActiveLessonContent() {
    const mod = state.currentModule;
    if (!mod || !Array.isArray(mod.lessons) || mod.lessons.length === 0) return;

    const lesson = mod.lessons[state.currentLessonIndex] || mod.lessons[0];
    const completed = getCompletedLessonsSet();
    const isDone = completed.has(lesson.id);

    document.getElementById('cls-lesson-number-badge').textContent =
      `Aula ${String(state.currentLessonIndex + 1).padStart(2, '0')} de ${String(mod.lessons.length).padStart(2, '0')}`;
    document.getElementById('cls-lesson-duration-badge').textContent =
      `Leitura: ${sanitizeCleanText(lesson.duration || '15 min')}`;

    const statusBadge = document.getElementById('cls-lesson-status-badge');
    if (statusBadge) {
      statusBadge.textContent = isDone ? 'Concluída' : 'Em estudo';
    }

    document.getElementById('cls-lesson-title').textContent = sanitizeCleanText(lesson.title);

    const bodyEl = document.getElementById('cls-lesson-content');
    if (bodyEl) {
      let rawHtml = sanitizeCleanText(lesson.html || '');
      const hasVisualBanner = rawHtml.includes('visual-banner') || rawHtml.includes('visual-diagram');
      const bannerHtml = hasVisualBanner ? '' : buildModuleVisualBanner(mod, state.currentLessonIndex);

      if (mod.id === 'mod-24' && ENABLE_AI_CONSULTANT) {
        rawHtml += `
          <div class="visual-banner" style="margin-top: 24px;">
            <span class="visual-banner-eyebrow">ACESSO DIRETO</span>
            <h4 class="visual-banner-title" style="margin: 4px 0 10px;">Console do Consultor Rural IA</h4>
            <p style="margin-bottom: 14px; color: var(--ink-secondary);">Envie o caso real do seu cliente agora para receber o diagnóstico completo e o orçamento pronto.</p>
            <button type="button" class="btn-apple-primary" onclick="window.RRApp.navigate('ai')">
              <span>Abrir Consultor IA</span>
            </button>
          </div>
        `;
      }

      bodyEl.innerHTML = bannerHtml + rawHtml;
      enhanceWorkbookInteractivity(bodyEl, lesson.id);
    }

    const completeBtn = document.getElementById('cls-complete-btn');
    const completeLabel = document.getElementById('cls-complete-btn-label');
    if (completeBtn && completeLabel) {
      completeBtn.classList.toggle('is-completed', isDone);
      completeLabel.textContent = isDone ? 'Aula concluída' : 'Marcar aula como concluída';
    }

    const prevBtn = document.getElementById('cls-prev-btn');
    if (prevBtn) {
      prevBtn.disabled = state.currentLessonIndex === 0;
      prevBtn.style.opacity = state.currentLessonIndex === 0 ? '0.4' : '1';
    }

    const nextLabel = document.getElementById('cls-next-btn-label');
    if (nextLabel) {
      nextLabel.textContent =
        state.currentLessonIndex < mod.lessons.length - 1 ? 'Próxima Aula' : 'Próximo Módulo';
    }
  }

  /**
   * Estiliza tabelas, adiciona botoes Copiar Modelo em .script-box / .doc-paper / .script / .doc-box
   * e torna todos os .check-item e .check li interativos com persistencia em localStorage.
   */
  function enhanceWorkbookInteractivity(container, lessonId) {
    // 0. Filtra blocos exclusivos por perfil (/membros consultor vs /proprietario dono da terra)
    const isProp = isProprietarioMode();
    container.querySelectorAll('[data-role-only]').forEach((el) => {
      const role = el.getAttribute('data-role-only');
      const hide =
        (role === 'proprietario' && !isProp) ||
        (role === 'consultor' && isProp);
      el.classList.toggle('hidden', hide);
    });

    // 1. Envolve tabelas soltas em .apple-table-wrap e injeta barra de filtro + exportacao .CSV
    container.querySelectorAll('table').forEach((tbl) => {
      if (!tbl.parentElement.classList.contains('apple-table-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'apple-table-wrap';
        tbl.parentNode.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
      }
    });

    container.querySelectorAll('.apple-table-wrap').forEach((wrap, idx) => {
      if (wrap.querySelector('.table-toolbar')) return;
      const tbl = wrap.querySelector('table');
      if (!tbl) return;
      if (tbl.querySelector('input, select, textarea')) return;

      const allRows = Array.from(tbl.querySelectorAll('tr'));
      const hasThead = Boolean(tbl.tHead && tbl.tHead.rows.length > 0);
      const firstRowHasTh = allRows.length > 0 && Boolean(allRows[0].querySelector('th'));
      const headRow = hasThead ? tbl.tHead.rows[0] : firstRowHasTh ? allRows[0] : null;
      const bodyRows =
        hasThead && tbl.tBodies && tbl.tBodies.length > 0 && tbl.tBodies[0].rows.length > 0
          ? Array.from(tbl.tBodies[0].rows)
          : headRow
            ? allRows.slice(1)
            : allRows;
      const rowCount = bodyRows.length;
      if (rowCount === 0) return;

      const toolbar = document.createElement('div');
      toolbar.className = 'table-toolbar';

      const metaSpan = document.createElement('span');
      metaSpan.className = 'table-toolbar-meta';
      metaSpan.textContent = `${rowCount} ${rowCount === 1 ? 'registro' : 'registros'} na tabela`;

      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'table-toolbar-actions';

      if (rowCount >= 5) {
        const filterInput = document.createElement('input');
        filterInput.type = 'search';
        filterInput.className = 'table-filter-input';
        filterInput.placeholder = 'Filtrar na tabela...';
        filterInput.setAttribute('aria-label', 'Filtrar linhas da tabela');
        filterInput.addEventListener('input', () => {
          const q = normStr(filterInput.value);
          let visible = 0;
          bodyRows.forEach((tr) => {
            const match = !q || normStr(tr.textContent).includes(q);
            tr.classList.toggle('hidden', !match);
            if (match) visible += 1;
          });
          metaSpan.textContent = q
            ? `${visible} de ${rowCount} registros`
            : `${rowCount} ${rowCount === 1 ? 'registro' : 'registros'} na tabela`;
        });
        actionsDiv.appendChild(filterInput);
      }

      const csvBtn = document.createElement('button');
      csvBtn.type = 'button';
      csvBtn.className = 'btn-table-csv';
      csvBtn.innerHTML = `${SVG_ICONS.download}<span>Baixar .CSV</span>`;
      csvBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const headers = headRow
          ? Array.from(headRow.querySelectorAll('th, td')).map((c) => c.textContent.trim())
          : [];
        const visibleRows = bodyRows
          .filter((tr) => !tr.classList.contains('hidden'))
          .map((tr) =>
            Array.from(tr.querySelectorAll('td, th')).map((c) => c.textContent.trim())
          );
        downloadCsvFile(`${lessonId}-tabela-${idx + 1}.csv`, headers, visibleRows);
      });
      actionsDiv.appendChild(csvBtn);

      toolbar.appendChild(metaSpan);
      toolbar.appendChild(actionsDiv);
      wrap.insertBefore(toolbar, wrap.firstChild);
    });

    // 2. Injeta botao Copiar Modelo em blocos de script e documento
    const copyableBlocks = container.querySelectorAll('.script-box, .doc-paper, .script, .doc-box');
    copyableBlocks.forEach((block) => {
      if (block.querySelector('.btn-copy-model')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-copy-model';
      btn.innerHTML = `${SVG_ICONS.copy}<span>Copiar Modelo</span>`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const clone = block.cloneNode(true);
        clone.querySelectorAll('.btn-copy-model, .lbl, .script-head, .doc-title').forEach((el) => el.remove());
        copyText(clone.innerText.trim(), btn);
      });
      block.appendChild(btn);
    });

    // 3. Checklists interativos (.check-item e .check li)
    let savedChecks = {};
    try {
      savedChecks = JSON.parse(localStorage.getItem('rr_checklist_items') || '{}') || {};
    } catch (_e) {
      savedChecks = {};
    }
    const checkItems = container.querySelectorAll('.check-item, .check li');
    checkItems.forEach((item, idx) => {
      const itemKey = `${lessonId}-chk-${idx}`;
      let box = item.querySelector('.check-box');
      if (!box) {
        box = document.createElement('span');
        box.className = 'check-box';
        box.innerHTML = SVG_ICONS.check;
        item.insertBefore(box, item.firstChild);
      } else if (!box.innerHTML.trim()) {
        box.innerHTML = SVG_ICONS.check;
      }

      if (savedChecks[itemKey]) {
        item.classList.add('is-checked');
      }

      item.addEventListener('click', () => {
        const nowChecked = item.classList.toggle('is-checked');
        try {
          const store = JSON.parse(localStorage.getItem('rr_checklist_items') || '{}') || {};
          if (nowChecked) {
            store[itemKey] = true;
          } else {
            delete store[itemKey];
          }
          localStorage.setItem('rr_checklist_items', JSON.stringify(store));
        } catch (_e) {}
        updateHomeKpiStrip();
      });
    });

    // 4. Planilhas interativas embutidas dentro de aulas (.interactive-sheet)
    container.querySelectorAll('.interactive-sheet input, .interactive-sheet select').forEach((inp) => {
      inp.addEventListener('input', () => {
        recalculatePricing();
        runCrossAudit();
      });
    });
  }

  async function copyText(text, btnElement) {
    const clean = sanitizeCleanText(text);
    try {
      await navigator.clipboard.writeText(clean);
    } catch (_err) {
      const ta = document.createElement('textarea');
      ta.value = clean;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }

    if (btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.classList.add('copied');
      btnElement.innerHTML = `${SVG_ICONS.check}<span>Copiado</span>`;
      setTimeout(() => {
        btnElement.classList.remove('copied');
        btnElement.innerHTML = originalHtml;
      }, 2000);
    }
    showToast('Copiado para a área de transferência.');
  }

  async function toggleCurrentLessonComplete() {
    const mod = state.currentModule;
    if (!mod || !mod.lessons[state.currentLessonIndex]) return;
    const lesson = mod.lessons[state.currentLessonIndex];

    const res = await apiFetch('/api/auth', {
      method: 'PUT',
      body: JSON.stringify({
        action: 'toggle_lesson',
        lessonId: lesson.id
      })
    });

    if (res.ok && res.data && Array.isArray(res.data.progresso_aulas)) {
      if (state.user) state.user.progresso_aulas = res.data.progresso_aulas;
    } else if (state.user) {
      const list = Array.isArray(state.user.progresso_aulas) ? [...state.user.progresso_aulas] : [];
      const idx = list.indexOf(lesson.id);
      if (idx >= 0) list.splice(idx, 1);
      else list.push(lesson.id);
      state.user.progresso_aulas = list;
    }

    updateHeaderAndProfile();
    renderClassroomSidebarLessons();
    renderActiveLessonContent();
    renderTracks();
    updateHomeKpiStrip();
    updateCertificateSummaryUi();
    if (state.currentView === 'certificate') {
      renderCertificateView({ syncInputs: false });
    }
    showToast('Progresso atualizado.');
  }

  function prevLesson() {
    if (!state.currentModule) return;
    if (state.currentLessonIndex > 0) {
      selectLesson(state.currentLessonIndex - 1);
    }
  }

  function nextLesson() {
    const mod = state.currentModule;
    if (!mod) return;
    if (state.currentLessonIndex < mod.lessons.length - 1) {
      selectLesson(state.currentLessonIndex + 1);
      return;
    }
    const currentIdx = state.modules.findIndex((m) => m.id === mod.id);
    const nextUnlocked = state.modules.slice(currentIdx + 1).find((m) => m.unlocked);
    if (nextUnlocked) {
      openModule(nextUnlocked.id, 0);
    } else {
      navigate('home');
      showToast('Módulo concluído.');
    }
  }

  function openModulePdf() {
    const mod = state.currentModule;
    if (mod && mod.pdfUrl) {
      window.open(mod.pdfUrl, '_blank', 'noopener');
    } else {
      window.print();
    }
  }

  /* ========================================================================
     ABA "FERRAMENTAS E PLANILHAS" (6 PLANILHAS INTERATIVAS + GRAFICOS SVG + CSV)
     ======================================================================== */
  const TOOLS_STORAGE_KEY = 'rr_tools_v2';
  const CRM_CONS_STORAGE_KEY = 'rr_crm_cons_v2';
  const CRM_PROP_STORAGE_KEY = 'rr_crm_prop_v2';

  const AGRARIAN_UNITS = [
    {
      key: 'alq_paulista',
      label: 'Alqueire Paulista',
      plural: 'Alqueires Paulistas',
      regions: 'SP, PR, SC, MS e Norte do PR',
      factorHa: 2.42,
      inTable: true
    },
    {
      key: 'alq_mineiro',
      label: 'Alqueire Mineiro / Goiano',
      plural: 'Alqueires Mineiros / Goianos',
      regions: 'MG, GO, TO, DF e RJ',
      factorHa: 4.84,
      inTable: true
    },
    {
      key: 'alq_norte',
      label: 'Alqueire do Norte',
      plural: 'Alqueires do Norte',
      regions: 'PA, AM, MA e Região Norte',
      factorHa: 2.72,
      inTable: true
    },
    {
      key: 'alq_baiano',
      label: 'Alqueire Baiano',
      plural: 'Alqueires Baianos',
      regions: 'BA (interior e Chapada)',
      factorHa: 9.68,
      inTable: true
    },
    {
      key: 'tarefa_ba',
      label: 'Tarefa Baiana',
      plural: 'Tarefas Baianas',
      regions: 'Bahia e Recôncavo',
      factorHa: 0.4356,
      inTable: true
    },
    {
      key: 'tarefa_ce',
      label: 'Tarefa Nordestina',
      plural: 'Tarefas Nordestinas',
      regions: 'CE, SE, AL e RN',
      factorHa: 0.3025,
      inTable: true
    },
    {
      key: 'quadra_rs',
      label: 'Quadra Gaúcha',
      plural: 'Quadras Gaúchas',
      regions: 'Rio Grande do Sul (RS)',
      factorHa: 1.7424,
      inTable: true
    },
    {
      key: 'litro',
      label: 'Litro Rural',
      plural: 'Litros Rurais',
      regions: 'Sul, MG e interior de SP',
      factorHa: 0.0605,
      inTable: true
    },
    {
      key: 'hectare',
      label: 'Hectare Oficial (ha)',
      plural: 'Hectares Oficiais (ha)',
      regions: 'Padrão nacional INCRA, ITR e CAR',
      factorHa: 1.0,
      inTable: true
    },
    {
      key: 'm2',
      label: 'Metro Quadrado (m2)',
      plural: 'Metros Quadrados (m2)',
      regions: 'Chácaras e desmembramentos',
      factorHa: 0.0001,
      inTable: false
    }
  ];

  const ITR_RATES_MATRIX = [
    { maxHa: 50, label: 'Até 50 ha', rates: [0.03, 0.2, 0.4, 0.7, 1.0] },
    { maxHa: 200, label: 'Acima de 50 a 200 ha', rates: [0.07, 0.4, 0.8, 1.4, 2.0] },
    { maxHa: 500, label: 'Acima de 200 a 500 ha', rates: [0.1, 0.6, 1.3, 2.3, 3.3] },
    { maxHa: 1000, label: 'Acima de 500 a 1.000 ha', rates: [0.15, 0.85, 1.9, 3.3, 4.7] },
    { maxHa: 5000, label: 'Acima de 1.000 a 5.000 ha', rates: [0.3, 1.6, 3.4, 6.0, 8.6] },
    { maxHa: Infinity, label: 'Acima de 5.000 ha', rates: [0.45, 3.0, 6.4, 12.0, 20.0] }
  ];

  const GOAL_SEASONAL_MONTHS = [
    { short: 'Jan', mult: 1.0, focus: 'Planejamento anual e pastas rurais' },
    { short: 'Fev', mult: 1.0, focus: 'Atualização de matrículas e CCIR' },
    { short: 'Mar', mult: 1.0, focus: 'Custeio safra e certidões negativas' },
    { short: 'Abr', mult: 1.0, focus: 'Saneamento cadastral SNCR e CAR' },
    { short: 'Mai', mult: 1.0, focus: 'Abertura da emissão anual do CCIR' },
    { short: 'Jun', mult: 1.0, focus: 'Quitação de CCIR e vínculo CNIR' },
    { short: 'Jul', mult: 1.0, focus: 'Pré-conferência documental de ITR/ADA' },
    { short: 'Ago', mult: 1.35, focus: 'Abertura da temporada anual DITR (1,35x)' },
    { short: 'Set', mult: 1.5, focus: 'Pico final de entrega do ITR e DARF (1,50x)' },
    { short: 'Out', mult: 1.25, focus: 'Regularização pós-prazo, CCIR e crédito (1,25x)' },
    { short: 'Nov', mult: 1.2, focus: 'Renovação de certidões e crédito rural (1,20x)' },
    { short: 'Dez', mult: 1.0, focus: 'Revisão patrimonial e contratos anuais' }
  ];

  function getDefaultCrmItems(isProp) {
    if (isProp) {
      return [
        {
          id: 'prop-1',
          name: 'Gleba Principal - Sítio São José',
          doc: 'Matr. 14.820 · CCIR e CIB',
          ha: 42.5,
          value: 280,
          status: 'Em Dia',
          paidMode: 'full'
        },
        {
          id: 'prop-2',
          name: 'Gleba 02 - Pasto da Serra',
          doc: 'Matr. 19.104 · Atualizar DCR',
          ha: 26.0,
          value: 195,
          status: 'Em Atualização',
          paidMode: 'pending'
        },
        {
          id: 'prop-3',
          name: 'Reserva Legal Averbada / CAR',
          doc: 'Recibo SICAR + ADA IBAMA',
          ha: 14.0,
          value: 110,
          status: 'Em Dia',
          paidMode: 'full'
        }
      ];
    }
    return [
      {
        id: 'cons-1',
        name: 'Fazenda Santa Helena - Sr. João',
        doc: 'DCR INCRA + ITR + CAR',
        ha: 145,
        value: 2400,
        status: 'Em Protocolo',
        paidMode: 'partial'
      },
      {
        id: 'cons-2',
        name: 'Sítio Boa Vista - Espólio Família Lima',
        doc: 'CCIR Falecido + CAFIR/CNIR',
        ha: 38,
        value: 1450,
        status: 'Aguardando Órgão',
        paidMode: 'partial'
      },
      {
        id: 'cons-3',
        name: 'Chácara Recanto Verde - Dona Marta',
        doc: 'Emissão CCIR + CND ITR',
        ha: 14,
        value: 650,
        status: 'Concluído',
        paidMode: 'full'
      },
      {
        id: 'cons-4',
        name: 'Estância São Pedro - Irmãos Souza',
        doc: 'Pacote 4 Órgãos + Pasta Crédito',
        ha: 210,
        value: 2900,
        status: 'Triagem',
        paidMode: 'pending'
      }
    ];
  }

  function saveToolsState() {
    if (isRestoringTools) return;
    try {
      const textIds = [
        'calc-client-name',
        'calc-hectares',
        'calc-complexity',
        'aud-mat-nome',
        'aud-mat-cpf',
        'aud-mat-area',
        'aud-ccir-nome',
        'aud-ccir-cpf',
        'aud-ccir-area',
        'aud-itr-nome',
        'aud-itr-cpf',
        'aud-itr-area',
        'aud-car-nome',
        'aud-car-cpf',
        'aud-car-area',
        'goal-target-input',
        'goal-ticket-avulso',
        'goal-ticket-inter',
        'goal-ticket-pack',
        'goal-retention-rate',
        'conv-qty',
        'conv-unit',
        'conv-uf-preset',
        'conv-modulo-fiscal',
        'itr-area-total',
        'itr-area-ambiental',
        'itr-area-utilizada',
        'itr-vtn-ha'
      ];
      const checkIds = ['srv-ccir', 'srv-itr', 'srv-car', 'srv-ret', 'itr-pequena-gleba'];
      const payload = {
        activeToolTab: state.activeToolTab,
        values: {},
        checks: {}
      };
      textIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) payload.values[id] = el.value;
      });
      checkIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) payload.checks[id] = Boolean(el.checked);
      });
      localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(payload));
    } catch (_e) {}
  }

  function restoreToolsState() {
    isRestoringTools = true;
    try {
      const raw = localStorage.getItem(TOOLS_STORAGE_KEY);
      if (!raw) {
        isRestoringTools = false;
        return;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        isRestoringTools = false;
        return;
      }
      if (parsed.activeToolTab && typeof parsed.activeToolTab === 'string') {
        state.activeToolTab = parsed.activeToolTab;
      }
      if (parsed.values && typeof parsed.values === 'object') {
        Object.keys(parsed.values).forEach((id) => {
          const el = document.getElementById(id);
          if (el && parsed.values[id] !== undefined && parsed.values[id] !== null) {
            el.value = String(parsed.values[id]);
          }
        });
      }
      if (parsed.checks && typeof parsed.checks === 'object') {
        Object.keys(parsed.checks).forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.checked = Boolean(parsed.checks[id]);
        });
      }
      const haEl = document.getElementById('calc-hectares');
      const rangeEl = document.getElementById('calc-hectares-range');
      if (haEl && rangeEl) {
        rangeEl.value = String(Math.min(1500, Math.max(5, Number(haEl.value) || 45)));
      }
    } catch (_e) {}
    isRestoringTools = false;
  }

  function switchToolTab(tabId) {
    const isProp = isProprietarioMode();
    const validTabs = [
      'tab-honorarios',
      'tab-auditoria',
      'tab-meta',
      'tab-conversor',
      'tab-itr',
      'tab-crm'
    ];

    let targetTab = validTabs.includes(tabId)
      ? tabId
      : isProp
        ? 'tab-auditoria'
        : 'tab-honorarios';

    if (isProp && (targetTab === 'tab-honorarios' || targetTab === 'tab-meta')) {
      targetTab = 'tab-auditoria';
    }

    state.activeToolTab = targetTab;

    const pillNodes = document.querySelectorAll('#tools-nav-pills .tool-pill-btn[data-tool-tab]');
    pillNodes.forEach((btn) => {
      const btnTab = btn.getAttribute('data-tool-tab');
      const isActive = btnTab === targetTab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    const panelNodes = document.querySelectorAll('#view-tools [data-tool-panel]');
    if (panelNodes.length > 0) {
      panelNodes.forEach((panel) => {
        const panelTab = panel.getAttribute('data-tool-panel');
        const shouldHide =
          panelTab !== targetTab ||
          (isProp && (panelTab === 'tab-honorarios' || panelTab === 'tab-meta'));
        panel.classList.toggle('hidden', shouldHide);
      });
    } else {
      // Fallback para markup anterior sem data-tool-panel
      const calcSheet = document.getElementById('tool-calc-honorarios');
      const goalSheet = document.getElementById('tool-meta-financeira');
      if (calcSheet) calcSheet.classList.toggle('hidden', isProp);
      if (goalSheet) goalSheet.classList.toggle('hidden', isProp);
    }

    if (targetTab === 'tab-honorarios') recalculatePricing();
    else if (targetTab === 'tab-auditoria') runCrossAudit();
    else if (targetTab === 'tab-meta') recalculateGoal();
    else if (targetTab === 'tab-conversor') recalculateConverter();
    else if (targetTab === 'tab-itr') recalculateItr();
    else if (targetTab === 'tab-crm') renderCrmSheet();

    saveToolsState();
  }

  /* ------------------------------------------------------------------------
     PLANILHA 01: CALCULADORA DE HONORARIOS E PACOTES RURAIS
     ------------------------------------------------------------------------ */
  function syncHectaresInput(val, source) {
    const num = Math.max(1, Number(val) || 1);
    const rangeEl = document.getElementById('calc-hectares-range');
    const numEl = document.getElementById('calc-hectares');
    if (source === 'range' && numEl) numEl.value = String(num);
    if (source === 'number' && rangeEl) rangeEl.value = String(Math.min(1500, num));
    recalculatePricing();
  }

  function computePricingData() {
    const clientName =
      (document.getElementById('calc-client-name')?.value || '').trim() || 'Produtor Rural';
    const ha = Math.max(1, Number(document.getElementById('calc-hectares')?.value || 45));
    const complexity = Number(document.getElementById('calc-complexity')?.value || 1);

    const hasCcir = Boolean(document.getElementById('srv-ccir')?.checked);
    const hasItr = Boolean(document.getElementById('srv-itr')?.checked);
    const hasCar = Boolean(document.getElementById('srv-car')?.checked);
    const hasRet = Boolean(document.getElementById('srv-ret')?.checked);

    let tierLabel = 'Pequeno Porte (até 50 ha)';
    let baseFactor = 1.0;
    if (ha > 500) {
      tierLabel = 'Grande Porte (acima de 500 ha)';
      baseFactor = 2.6;
    } else if (ha > 150) {
      tierLabel = 'Médio-Grande Porte (151 a 500 ha)';
      baseFactor = 1.85;
    } else if (ha > 50) {
      tierLabel = 'Médio Porte (51 a 150 ha)';
      baseFactor = 1.35;
    }

    const items = [];
    if (hasCcir) {
      items.push({
        short: 'CCIR / Atualização DCR no INCRA',
        full: 'Emissão/Atualização de CCIR no INCRA (SNCR/DCR)',
        base: 320
      });
    }
    if (hasItr) {
      items.push({
        short: 'ITR (DITR) + Vínculo CIB/CNIR e CND',
        full: 'Regularização de ITR (DITR), vínculo CIB/CNIR e CND',
        base: 420
      });
    }
    if (hasCar) {
      items.push({
        short: 'CAR / SICAR (Inscrição ou Retificação)',
        full: 'Inscrição ou Retificação de Cadastro Ambiental Rural (CAR/SICAR)',
        base: 680
      });
    }
    if (hasRet) {
      items.push({
        short: 'Dossiê de Retificação / Pasta Bancária',
        full: 'Organização de Dossiê para Retificação / Pasta Bancária',
        base: 750
      });
    }
    if (items.length === 0) {
      items.push({
        short: 'Diagnóstico Documental 4 Órgãos',
        full: 'Diagnóstico Documental Completo do Imóvel Rural',
        base: 320
      });
    }

    const rawSum = items.reduce((acc, it) => acc + it.base, 0);
    const itemsWithSubtotal = items.map((it) => ({
      ...it,
      subtotal: Math.round((it.base * baseFactor * complexity) / 10) * 10
    }));

    const avulso = Math.round((280 * baseFactor * complexity) / 10) * 10;
    const essencial = Math.round((740 * baseFactor * complexity) / 10) * 10;
    const completo = Math.round((rawSum * baseFactor * complexity) / 10) * 10;
    const entrada = Math.round(completo / 2);
    const saldo = completo - entrada;

    return {
      clientName,
      ha,
      complexity,
      tierLabel,
      baseFactor,
      rawSum,
      items: itemsWithSubtotal,
      avulso,
      essencial,
      completo,
      entrada,
      saldo
    };
  }

  function renderPricingChartSvg(d) {
    const maxVal = Math.max(d.completo, d.essencial, d.avulso, 100);
    const bars = [
      { label: 'Serviço Avulso', val: d.avulso, fill: '#22c55e', opacity: '0.82' },
      { label: 'Entrada 50%', val: d.entrada, fill: '#16a34a', opacity: '0.92' },
      { label: 'Pacote Essencial', val: d.essencial, fill: '#0f766e', opacity: '0.95' },
      { label: 'Pacote Completo', val: d.completo, fill: 'url(#prcBarGrad)', opacity: '1' }
    ];
    const x0 = 136;
    const maxW = 272;

    const gridLines = [0.25, 0.5, 0.75, 1]
      .map((ratio) => {
        const gx = Math.round(x0 + maxW * ratio);
        return `<line x1="${gx}" y1="14" x2="${gx}" y2="182" stroke="var(--hairline-table)" stroke-width="1" stroke-dasharray="3 3"/>`;
      })
      .join('');

    const rowsSvg = bars
      .map((b, i) => {
        const y = 20 + i * 42;
        const w = Math.max(10, Math.round((b.val / maxVal) * maxW));
        const isFeatured = i === 3;
        return `
          <text x="8" y="${y + 16}" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="${isFeatured ? '700' : '600'}">${escapeHtml(b.label)}</text>
          <rect x="${x0}" y="${y}" width="${maxW}" height="24" rx="7" fill="var(--canvas-parchment)"/>
          <rect x="${x0}" y="${y}" width="${w}" height="24" rx="7" fill="${b.fill}" opacity="${b.opacity}"/>
          <text x="512" y="${y + 16}" fill="${isFeatured ? 'var(--primary)' : 'var(--ink)'}" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" text-anchor="end">${escapeHtml(formatBRL(b.val))}</text>
        `;
      })
      .join('');

    return `
      <svg viewBox="0 0 520 196" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, sans-serif" role="img" aria-label="Gráfico comparativo de honorários">
        <defs>
          <linearGradient id="prcBarGrad" x1="${x0}" y1="0" x2="${x0 + maxW}" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#15803d"/>
            <stop offset="100%" stop-color="#16a34a"/>
          </linearGradient>
        </defs>
        ${gridLines}
        ${rowsSvg}
      </svg>
    `;
  }

  function recalculatePricing() {
    if (!document.getElementById('calc-hectares')) return;
    const d = computePricingData();

    setText('calc-hectares-badge', `${d.ha} ha · ${d.tierLabel}`);
    setText('res-val-avulso', formatBRL(d.avulso));
    setText('res-val-essencial', formatBRL(d.essencial));
    setText('res-val-completo', formatBRL(d.completo));
    setText('res-val-entrada', formatBRL(d.entrada));
    setText(
      'res-val-saldo',
      `50% na abertura (${formatBRL(d.entrada)}) + ${formatBRL(d.saldo)} na entrega`
    );

    const tbody = document.getElementById('pricing-breakdown-tbody');
    if (tbody) {
      const factorText = `${d.baseFactor.toFixed(2)}x porte · ${d.complexity.toFixed(2)}x complexidade`;
      const itemRowsHtml = d.items
        .map(
          (it) => `
          <tr>
            <td><strong>${escapeHtml(it.short)}</strong></td>
            <td>${escapeHtml(formatBRL(it.base))}</td>
            <td>${escapeHtml(factorText)}</td>
            <td><strong>${escapeHtml(formatBRL(it.subtotal))}</strong></td>
          </tr>
        `
        )
        .join('');
      const totalRowHtml = `
        <tr style="background-color: var(--primary-soft);">
          <td><strong>Total Pacote Completo (50% + 50%)</strong></td>
          <td><strong>${escapeHtml(formatBRL(d.rawSum))}</strong></td>
          <td>Multiplicador ${(d.baseFactor * d.complexity).toFixed(2)}x</td>
          <td><strong style="color: var(--primary);">${escapeHtml(formatBRL(d.completo))}</strong></td>
        </tr>
      `;
      tbody.innerHTML = itemRowsHtml + totalRowHtml;
    }

    setHtml('pricing-svg-chart', renderPricingChartSvg(d));

    const proposalText = [
      'PROPOSTA DE ASSESSORIA CADASTRAL DE IMÓVEL RURAL',
      `Cliente / Propriedade: ${d.clientName}`,
      `Área declarada: ${d.ha} hectares (${d.tierLabel})`,
      '',
      'ESCOPO DOS SERVIÇOS SELECIONADOS:',
      ...d.items.map((it, idx) => `${idx + 1}. ${it.full}`),
      '',
      'OPÇÕES DE INVESTIMENTO:',
      `- Opção 1 (Diagnóstico e Demanda Avulsa): ${formatBRL(d.avulso)}`,
      `- Opção 2 (Pacote Essencial 2 Órgãos): ${formatBRL(d.essencial)}`,
      `- Opção 3 (Pacote Completo Recomendado): ${formatBRL(d.completo)}`,
      '',
      'CONDIÇÃO DE PAGAMENTO (PACOTE COMPLETO):',
      `Entrada de 50% (${formatBRL(d.entrada)}) na abertura dos protocolos + saldo de ${formatBRL(d.saldo)} na entrega dos certificados e recibos.`,
      '',
      'Valores referenciais de assessoria cadastral administrativa; taxas oficiais de órgãos/cartórios são pagas via guia própria pelo titular.'
    ].join('\n');

    setText('calc-proposal-preview', proposalText);
    saveToolsState();
  }

  function copyPricingProposal(btn) {
    const previewEl = document.getElementById('calc-proposal-preview');
    if (!previewEl) return;
    copyText(previewEl.textContent, btn);
  }

  function exportPricingCsv() {
    const d = computePricingData();
    const headers = [
      'Cliente / Propriedade',
      'Item / Modalidade',
      'Porte Declarado',
      'Fator Porte x Complexidade',
      'Valor Base (R$)',
      'Valor Calculado (R$)'
    ];
    const factorStr = `${d.baseFactor.toFixed(2)}x porte / ${d.complexity.toFixed(2)}x complexidade`;
    const rows = d.items.map((it) => [
      d.clientName,
      `Serviço: ${it.full}`,
      `${d.ha} ha (${d.tierLabel})`,
      factorStr,
      formatBRL(it.base),
      formatBRL(it.subtotal)
    ]);
    rows.push([
      d.clientName,
      'Opção 1 - Serviço Avulso',
      `${d.ha} ha`,
      factorStr,
      formatBRL(280),
      formatBRL(d.avulso)
    ]);
    rows.push([
      d.clientName,
      'Opção 2 - Pacote Essencial (2 Órgãos)',
      `${d.ha} ha`,
      factorStr,
      formatBRL(740),
      formatBRL(d.essencial)
    ]);
    rows.push([
      d.clientName,
      'Opção 3 - Pacote Completo Recomendado',
      `${d.ha} ha`,
      factorStr,
      formatBRL(d.rawSum),
      formatBRL(d.completo)
    ]);
    rows.push([
      d.clientName,
      'Condição 50/50 - Entrada na Abertura (50%)',
      `${d.ha} ha`,
      '50% inicial',
      '-',
      formatBRL(d.entrada)
    ]);
    rows.push([
      d.clientName,
      'Condição 50/50 - Saldo na Entrega (50%)',
      `${d.ha} ha`,
      '50% final',
      '-',
      formatBRL(d.saldo)
    ]);
    downloadCsvFile('planilha-01-orcamento-honorarios-rurais.csv', headers, rows);
  }

  /* ------------------------------------------------------------------------
     PLANILHA 02: AUDITORIA CRUZADA DOS 4 ORGAOS
     ------------------------------------------------------------------------ */
  function normStr(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function fmtCommaNum(val, decimals = 2) {
    return Number(val || 0)
      .toFixed(decimals)
      .replace('.', ',');
  }

  function computeAuditData() {
    const matNome = document.getElementById('aud-mat-nome')?.value || '';
    const matCpf = document.getElementById('aud-mat-cpf')?.value || '';
    const matArea = Math.max(
      0,
      parseFloat(document.getElementById('aud-mat-area')?.value || '0') || 0
    );

    const checksDef = [
      {
        prefix: 'ccir',
        shortLabel: 'CCIR / INCRA',
        orgao: 'CCIR / INCRA (SNCR)',
        fixTitular:
          'Protocolar DCR no SNCR/INCRA para atualizar titularidade (anexar matrícula ou inventário).',
        fixArea: 'Atualizar área via DCR no SNCR para igualar à matrícula.'
      },
      {
        prefix: 'itr',
        shortLabel: 'ITR / Receita',
        orgao: 'ITR / Receita Federal (CAFIR/CNIR)',
        fixTitular: 'Atualizar titular no CAFIR/CNIR via portal e-CAC e ajustar DIAC.',
        fixArea:
          'Corrigir área total no CAFIR/CNIR e transmitir DITR retificadora se necessário.'
      },
      {
        prefix: 'car',
        shortLabel: 'CAR / SICAR',
        orgao: 'CAR / SICAR Ambiental',
        fixTitular: 'Acessar Central do Proprietário no SICAR e atualizar titular/possuidor.',
        fixArea:
          'Retificar perímetro vetorizado no módulo de cadastro do CAR para alinhar com a matrícula.'
      }
    ];

    let totalIssues = 0;
    let maxDiffHa = 0;
    const organs = checksDef.map((item) => {
      const nome = document.getElementById(`aud-${item.prefix}-nome`)?.value || '';
      const cpf = document.getElementById(`aud-${item.prefix}-cpf`)?.value || '';
      const area = Math.max(
        0,
        parseFloat(document.getElementById(`aud-${item.prefix}-area`)?.value || '0') || 0
      );

      const sameTitular = normStr(nome) === normStr(matNome) && normStr(cpf) === normStr(matCpf);
      const signedDiff = area - matArea;
      const areaDiff = Math.abs(signedDiff);
      const signedPct = matArea > 0 ? (signedDiff / matArea) * 100 : 0;
      const areaPct = Math.abs(signedPct);
      const sameArea = areaPct <= 2.0;

      if (areaDiff > maxDiffHa) maxDiffHa = areaDiff;

      let statusLabel = 'Compatível';
      let actionText = 'Dados alinhados com a matrícula. Manter certidão/recibo arquivado.';
      const isOk = sameTitular && sameArea;

      if (!isOk) {
        totalIssues += 1;
        statusLabel = 'Divergente';
        const actions = [];
        if (!sameTitular) actions.push(item.fixTitular);
        if (!sameArea) {
          actions.push(`${item.fixArea} (Diferença de ${fmtCommaNum(areaDiff, 2)} ha)`);
        }
        actionText = actions.join(' ');
      }

      return {
        ...item,
        nome,
        cpf,
        area,
        sameTitular,
        sameArea,
        isOk,
        signedDiff,
        areaDiff,
        signedPct,
        areaPct,
        statusLabel,
        actionText
      };
    });

    const scorePct = Math.round(((4 - totalIssues) / 4) * 100);
    return {
      matNome,
      matCpf,
      matArea,
      totalIssues,
      maxDiffHa,
      scorePct,
      organs
    };
  }

  function renderAuditChartSvg(d) {
    const allAreas = [d.matArea, ...d.organs.map((o) => o.area)];
    const maxArea = Math.max(...allAreas, 10) * 1.15;
    const x0 = 114;
    const maxW = 264;

    const minTolX = d.matArea > 0 ? x0 + ((d.matArea * 0.98) / maxArea) * maxW : x0;
    const maxTolX = d.matArea > 0 ? x0 + ((d.matArea * 1.02) / maxArea) * maxW : x0;
    const baseLineX = d.matArea > 0 ? x0 + (d.matArea / maxArea) * maxW : x0;

    const rows = [
      {
        label: 'Matrícula',
        area: d.matArea,
        color: '#15803d',
        rightLabel: `${fmtCommaNum(d.matArea, 2)} ha (Base)`
      },
      ...d.organs.map((o) => {
        const sign = o.signedPct > 0.04 ? '+' : '';
        const pctTxt = `${sign}${fmtCommaNum(o.signedPct, 1)}%`;
        const barColor = !o.sameArea ? '#dc2626' : !o.sameTitular ? '#f59e0b' : '#16a34a';
        return {
          label: o.shortLabel,
          area: o.area,
          color: barColor,
          rightLabel: `${fmtCommaNum(o.area, 2)} ha (${pctTxt})`
        };
      })
    ];

    const barsSvg = rows
      .map((r, i) => {
        const y = 30 + i * 40;
        const w = r.area > 0 ? Math.max(8, Math.round((r.area / maxArea) * maxW)) : 4;
        return `
          <text x="8" y="${y + 16}" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="${i === 0 ? '700' : '600'}">${escapeHtml(r.label)}</text>
          <rect x="${x0}" y="${y}" width="${maxW}" height="24" rx="6" fill="var(--canvas-parchment)"/>
          <rect x="${x0}" y="${y}" width="${w}" height="24" rx="6" fill="${r.color}"/>
          <text x="532" y="${y + 16}" fill="${r.color === '#dc2626' ? '#dc2626' : 'var(--ink)'}" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="700" text-anchor="end">${escapeHtml(r.rightLabel)}</text>
        `;
      })
      .join('');

    const tolBandSvg =
      d.matArea > 0
        ? `
          <rect x="${minTolX.toFixed(1)}" y="24" width="${Math.max(5, maxTolX - minTolX).toFixed(1)}" height="158" rx="3" fill="rgba(21, 128, 61, 0.16)"/>
          <line x1="${baseLineX.toFixed(1)}" y1="22" x2="${baseLineX.toFixed(1)}" y2="184" stroke="#15803d" stroke-width="1.5" stroke-dasharray="3 3"/>
        `
        : '';

    return `
      <svg viewBox="0 0 540 196" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, sans-serif" role="img" aria-label="Comparativo de áreas declaradas nos 4 órgãos">
        <text x="${x0}" y="15" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="600">Faixa verde: margem operacional de +-2% da Matrícula</text>
        ${barsSvg}
        ${tolBandSvg}
      </svg>
    `;
  }

  function runCrossAudit() {
    if (!document.getElementById('aud-mat-nome')) return;
    const d = computeAuditData();

    d.organs.forEach((o) => {
      const statusEl = document.getElementById(`aud-${o.prefix}-status`);
      const actionEl = document.getElementById(`aud-${o.prefix}-action`);
      if (statusEl) {
        statusEl.className = o.isOk ? 'audit-pill audit-ok' : 'audit-pill audit-err';
        statusEl.textContent = o.statusLabel;
      }
      if (actionEl) {
        actionEl.textContent = o.actionText;
      }
    });

    setText('audit-score-pct', `${d.scorePct}%`);
    setText(
      'audit-score-sub',
      d.totalIssues === 0
        ? '4 de 4 documentos consistentes na margem operacional de 2%'
        : `${4 - d.totalIssues} de 4 documentos alinhados com a Matrícula Imobiliária`
    );
    setText('audit-issues-count', `${d.totalIssues} de 3`);
    setText('audit-max-diff-ha', `${fmtCommaNum(d.maxDiffHa, 2)} ha`);
    setText('audit-base-ha', `${fmtCommaNum(d.matArea, 2)} ha`);

    setHtml('audit-svg-chart', renderAuditChartSvg(d));

    const summaryBanner = document.getElementById('audit-summary-banner');
    if (summaryBanner) {
      if (d.totalIssues === 0) {
        summaryBanner.innerHTML = `
          <strong style="color: var(--status-ok-text);">Diagnóstico: 100% Compatível nos 4 Órgãos.</strong>
          <span style="display:block; margin-top:4px; color: var(--ink-secondary);">Titularidade, CPF/CNPJ e área estão consistentes entre Matrícula, INCRA, Receita Federal e CAR. Imóvel organizado para escritura e crédito rural.</span>
        `;
      } else {
        summaryBanner.innerHTML = `
          <strong style="color: var(--status-err-text);">Atenção: ${d.totalIssues} ${d.totalIssues === 1 ? 'órgão apresenta' : 'órgãos apresentam'} divergência em relação à Matrícula.</strong>
          <span style="display:block; margin-top:4px; color: var(--ink-secondary);">Ordem recomendada de correção: 1º Conferir Matrícula no Cartório · 2º Atualizar DCR/SNCR no INCRA · 3º Vincular CNIR/CAFIR na Receita Federal · 4º Retificar SICAR/CAR.</span>
        `;
      }
    }

    const reportLines = [
      'DIAGNÓSTICO CADASTRAL CRUZADO DE IMÓVEL RURAL',
      `Titular Base (Matrícula): ${d.matNome || 'Não informado'} | CPF/CNPJ: ${d.matCpf || 'Não informado'}`,
      `Área Base na Matrícula: ${fmtCommaNum(d.matArea, 2)} ha | Índice de Conformidade: ${d.scorePct}%`,
      '',
      ...d.organs.map(
        (o, idx) =>
          `${idx + 1}. ${o.orgao}: [${o.statusLabel}] | Área: ${fmtCommaNum(o.area, 2)} ha | Titular: ${o.nome || '-'} - ${o.actionText}`
      ),
      '',
      d.totalIssues === 0
        ? 'Conclusão Cadastral: Dados compatíveis entre Matrícula, CCIR, ITR e CAR.'
        : 'Sequência Operacional Recomendada: 1º Matrícula no Cartório -> 2º DCR/SNCR no INCRA -> 3º CAFIR/CNIR e DITR na Receita Federal -> 4º Central do CAR/SICAR.',
      '',
      'Nota: Diagnóstico cadastral informativo baseado nos dados declarados. Confira sempre a situação atualizada diretamente nas certidões e portais oficiais de cada órgão.'
    ];
    setText('audit-report-preview', reportLines.join('\n'));
    saveToolsState();
  }

  function loadAuditPreset(mode) {
    if (!document.getElementById('aud-mat-nome')) return;
    if (mode === 'clean') {
      document.getElementById('aud-mat-nome').value = 'José Carlos Oliveira';
      document.getElementById('aud-mat-cpf').value = '142.850.910-00';
      document.getElementById('aud-mat-area').value = '64.50';

      ['ccir', 'itr', 'car'].forEach((p) => {
        const n = document.getElementById(`aud-${p}-nome`);
        const c = document.getElementById(`aud-${p}-cpf`);
        const a = document.getElementById(`aud-${p}-area`);
        if (n) n.value = 'José Carlos Oliveira';
        if (c) c.value = '142.850.910-00';
        if (a) a.value = '64.50';
      });
    } else {
      document.getElementById('aud-mat-nome').value = 'José Carlos Oliveira';
      document.getElementById('aud-mat-cpf').value = '142.850.910-00';
      document.getElementById('aud-mat-area').value = '64.50';

      document.getElementById('aud-ccir-nome').value = 'Espólio de Sebastião Oliveira';
      document.getElementById('aud-ccir-cpf').value = '018.442.110-49';
      document.getElementById('aud-ccir-area').value = '60.00';

      document.getElementById('aud-itr-nome').value = 'José Carlos Oliveira';
      document.getElementById('aud-itr-cpf').value = '142.850.910-00';
      document.getElementById('aud-itr-area').value = '60.00';

      document.getElementById('aud-car-nome').value = 'José Carlos Oliveira';
      document.getElementById('aud-car-cpf').value = '142.850.910-00';
      document.getElementById('aud-car-area').value = '64.80';
    }
    runCrossAudit();
  }

  function copyAuditReport(btn) {
    const previewEl = document.getElementById('audit-report-preview');
    if (previewEl && previewEl.textContent.trim()) {
      copyText(previewEl.textContent, btn);
      return;
    }
    runCrossAudit();
    const updated = document.getElementById('audit-report-preview');
    if (updated) copyText(updated.textContent, btn);
  }

  function exportAuditCsv() {
    const d = computeAuditData();
    const headers = [
      'Documento / Órgão',
      'Titular no Documento',
      'CPF ou CNPJ',
      'Área Declarada (ha)',
      'Diferença vs Matrícula (ha)',
      'Diferença (%)',
      'Status na Auditoria',
      'Ação Administrativa Recomendada'
    ];
    const rows = [
      [
        '1. Matrícula / Registro de Imóveis',
        d.matNome,
        d.matCpf,
        fmtCommaNum(d.matArea, 2),
        '0,00',
        '0,0%',
        'Documento Base',
        'Certidão de Inteiro Teor atualizada (referência de domínio).'
      ],
      ...d.organs.map((o, i) => [
        `${i + 2}. ${o.orgao}`,
        o.nome,
        o.cpf,
        fmtCommaNum(o.area, 2),
        fmtCommaNum(o.signedDiff, 2),
        `${fmtCommaNum(o.signedPct, 1)}%`,
        o.statusLabel,
        o.actionText
      ])
    ];
    downloadCsvFile('planilha-02-diagnostico-4-orgaos.csv', headers, rows);
  }

  /* ------------------------------------------------------------------------
     PLANILHA 03: SIMULADOR DE META MENSAL E PROJECAO 12 MESES
     ------------------------------------------------------------------------ */
  function setMonthlyGoal(amount) {
    const input = document.getElementById('goal-target-input');
    if (input) input.value = String(amount);
    document.querySelectorAll('.goal-preset-pills button, .goal-preset-pills .chip-option').forEach((btn) => {
      btn.classList.toggle('active', btn.textContent.includes(amount.toLocaleString('pt-BR')));
    });
    recalculateGoal();
  }

  function resetGoalDefaults() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = String(val);
    };
    setVal('goal-target-input', 5000);
    setVal('goal-ticket-avulso', 300);
    setVal('goal-ticket-inter', 950);
    setVal('goal-ticket-pack', 1850);
    setVal('goal-retention-rate', 65);
    setMonthlyGoal(5000);
    showToast('Padrão restaurado na planilha de 12 meses.');
  }

  function computeGoalData() {
    const goal = Math.max(500, Number(document.getElementById('goal-target-input')?.value || 5000));
    const tAvulso = Math.max(50, Number(document.getElementById('goal-ticket-avulso')?.value || 300));
    const tInter = Math.max(100, Number(document.getElementById('goal-ticket-inter')?.value || 950));
    const tPack = Math.max(200, Number(document.getElementById('goal-ticket-pack')?.value || 1850));
    const retentionEl = document.getElementById('goal-retention-rate');
    const retentionRate = Math.min(
      100,
      Math.max(0, retentionEl ? Number(retentionEl.value || 65) : 65)
    );

    const qtdAvulso = Math.ceil(goal / tAvulso);
    const qtdInter = Math.ceil(goal / tInter);
    const qtdPack = Math.ceil(goal / tPack);

    const mixPacks = Math.max(1, Math.floor((goal * 0.55) / tPack));
    const remAfterPacks = Math.max(0, goal - mixPacks * tPack);
    const mixInter = Math.max(1, Math.ceil(remAfterPacks / tInter));
    const baseMonthlyClients = mixPacks + mixInter;

    let annualTotal = 0;
    let totalClientsYear = 0;

    const months = GOAL_SEASONAL_MONTHS.map((m, idx) => {
      const baseRev = goal;
      const totalRev = Math.round((goal * m.mult) / 10) * 10;
      const extraSeasonal = Math.max(0, totalRev - baseRev);
      const clientsCount = Math.max(1, Math.round(baseMonthlyClients * m.mult));
      annualTotal += totalRev;
      totalClientsYear += clientsCount;
      return {
        num: String(idx + 1).padStart(2, '0'),
        short: m.short,
        focus: m.focus,
        mult: m.mult,
        clientsCount,
        baseRev,
        extraSeasonal,
        totalRev
      };
    });

    const retainedClientsYear2 = Math.round(totalClientsYear * (retentionRate / 100));
    const recurringYear2 = retainedClientsYear2 * 350;

    return {
      goal,
      tAvulso,
      tInter,
      tPack,
      retentionRate,
      qtdAvulso,
      qtdInter,
      qtdPack,
      mixPacks,
      mixInter,
      annualTotal,
      totalClientsYear,
      retainedClientsYear2,
      recurringYear2,
      months
    };
  }

  function formatCompactBRL(value) {
    const n = Number(value) || 0;
    if (n >= 1000) {
      const k = n / 1000;
      return 'R$ ' + (k % 1 === 0 ? k.toFixed(0) : k.toFixed(1).replace('.', ',')) + 'k';
    }
    return 'R$ ' + Math.round(n);
  }

  function renderGoalChartSvg(d) {
    const maxVal = Math.max(...d.months.map((m) => m.totalRev), d.goal * 1.55, 1000);
    const xStart = 54;
    const plotW = 492;
    const yBottom = 168;
    const plotH = 132;
    const slotW = plotW / 12;
    const barW = 24;

    const gridRatios = [0.5, 1.0];
    const gridsSvg = gridRatios
      .map((r) => {
        const gy = Math.round(yBottom - plotH * r);
        const gVal = maxVal * r;
        return `
          <line x1="${xStart}" y1="${gy}" x2="${xStart + plotW}" y2="${gy}" stroke="var(--hairline-table)" stroke-width="1" stroke-dasharray="3 3"/>
          <text x="${xStart - 6}" y="${gy + 4}" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="600" text-anchor="end">${escapeHtml(formatCompactBRL(gVal))}</text>
        `;
      })
      .join('');

    const goalY = Math.round(yBottom - (d.goal / maxVal) * plotH);

    const colsSvg = d.months
      .map((m, idx) => {
        const cx = xStart + idx * slotW + slotW / 2;
        const bx = Math.round(cx - barW / 2);
        const totalH = Math.max(8, Math.round((m.totalRev / maxVal) * plotH));
        const baseH = Math.max(6, Math.round((m.baseRev / maxVal) * plotH));
        const extraH = Math.max(0, totalH - baseH);
        const baseY = yBottom - baseH;
        const topY = yBottom - totalH;

        return `
          <rect x="${bx}" y="${baseY}" width="${barW}" height="${baseH}" rx="4" fill="#15803d"/>
          ${
            extraH > 0
              ? `<rect x="${bx}" y="${topY}" width="${barW}" height="${extraH + 3}" rx="4" fill="#f59e0b"/>
                 <text x="${cx.toFixed(1)}" y="${topY - 5}" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="700" text-anchor="middle">${escapeHtml(formatCompactBRL(m.totalRev))}</text>`
              : ''
          }
          <text x="${cx.toFixed(1)}" y="188" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="600" text-anchor="middle">${escapeHtml(m.short)}</text>
        `;
      })
      .join('');

    return `
      <svg viewBox="0 0 560 205" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, sans-serif" role="img" aria-label="Projeção de faturamento em 12 meses">
        <rect x="54" y="6" width="10" height="10" rx="3" fill="#15803d"/>
        <text x="68" y="15" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="600">Meta Base Mensal</text>
        <rect x="190" y="6" width="10" height="10" rx="3" fill="#f59e0b"/>
        <text x="204" y="15" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="600">Demanda Sazonal ITR / CCIR</text>
        ${gridsSvg}
        <line x1="${xStart}" y1="${yBottom}" x2="${xStart + plotW}" y2="${yBottom}" stroke="var(--hairline-table)" stroke-width="1"/>
        ${colsSvg}
        <line x1="${xStart}" y1="${goalY}" x2="${xStart + plotW}" y2="${goalY}" stroke="#16a34a" stroke-width="1.3" stroke-dasharray="4 3"/>
      </svg>
    `;
  }

  function recalculateGoal() {
    if (!document.getElementById('goal-target-input')) return;
    const d = computeGoalData();

    const exactGoalLabel = 'R$ ' + d.goal.toLocaleString('pt-BR');
    document
      .querySelectorAll('.goal-preset-pills button, .goal-preset-pills .chip-option')
      .forEach((btn) => {
        btn.classList.toggle('active', btn.textContent.trim().endsWith(exactGoalLabel));
      });

    setText('goal-annual-total', formatBRL(d.annualTotal));
    setText('goal-clients-pack', `${d.qtdPack} ${d.qtdPack === 1 ? 'cliente' : 'clientes'}`);
    setText('goal-clients-mix', `${d.mixPacks} compl. + ${d.mixInter} inter.`);
    setText('goal-recurring-year2', formatBRL(d.recurringYear2));

    setHtml('goal-svg-chart', renderGoalChartSvg(d));

    const grid = document.getElementById('goal-results-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="topic-card">
          <div class="topic-card-top">
            <span class="topic-card-num">A</span>
            <span class="sheet-value-pill">${formatBRL(d.tAvulso)} / cliente</span>
          </div>
          <h4>Apenas Serviços Rápidos</h4>
          <p>Fechar <strong>${d.qtdAvulso} serviços no mês</strong> (cerca de ${Math.ceil(d.qtdAvulso / 4)} por semana) de emissão de CCIR, ITR ou certidão.</p>
        </div>

        <div class="topic-card">
          <div class="topic-card-top">
            <span class="topic-card-num">B</span>
            <span class="sheet-value-pill">${formatBRL(d.tInter)} / cliente</span>
          </div>
          <h4>Regularizações de 2 Órgãos</h4>
          <p>Fechar <strong>${d.qtdInter} clientes no mês</strong> (cerca de ${Math.max(1, Math.round(d.qtdInter / 4))} por semana) atualizando DCR/INCRA + ITR/CNIR.</p>
        </div>

        <div class="topic-card">
          <div class="topic-card-top">
            <span class="topic-card-num">C</span>
            <span class="sheet-value-pill">${formatBRL(d.tPack)} / cliente</span>
          </div>
          <h4>Apenas Pacotes Completos</h4>
          <p>Fechar <strong>${d.qtdPack} ${d.qtdPack === 1 ? 'fazenda/sítio' : 'fazendas/sítios'} no mês</strong> com regularização completa dos 3 órgãos.</p>
        </div>

        <div class="topic-card" style="background-color: var(--primary-soft); border-color: var(--primary-border);">
          <div class="topic-card-top">
            <span class="topic-card-num">MIX</span>
            <span class="sheet-value-pill">Plano Equilibrado</span>
          </div>
          <h4>Meta de ${formatBRL(d.goal)} / mês</h4>
          <p>Combine <strong>${d.mixPacks} ${d.mixPacks === 1 ? 'Pacote Completo' : 'Pacotes Completos'}</strong> + <strong>${d.mixInter} ${d.mixInter === 1 ? 'Regularização Intermediária' : 'Regularizações Intermediárias'}</strong> no mês.</p>
        </div>
      `;
    }

    const tbody12m = document.getElementById('goal-12m-tbody');
    if (tbody12m) {
      tbody12m.innerHTML = d.months
        .map(
          (m) => `
          <tr>
            <td><strong>Mês ${m.num} (${escapeHtml(m.short)})</strong></td>
            <td>${escapeHtml(m.focus)}</td>
            <td>${m.clientsCount} atendimentos</td>
            <td>${escapeHtml(formatBRL(m.baseRev))}</td>
            <td>${m.extraSeasonal > 0 ? '<strong style="color: var(--primary);">+ ' + escapeHtml(formatBRL(m.extraSeasonal)) + '</strong>' : 'Mês padrão (1,0x)'}</td>
            <td><strong>${escapeHtml(formatBRL(m.totalRev))}</strong></td>
          </tr>
        `
        )
        .join('');
    }

    saveToolsState();
  }

  function exportGoalCsv() {
    const d = computeGoalData();
    const headers = [
      'Mês',
      'Foco Sazonal no Campo',
      'Atendimentos Estimados (Mix)',
      'Meta Base Mensal (R$)',
      'Adicional Sazonal ITR/CCIR (R$)',
      'Total Projetado no Mês (R$)'
    ];
    const rows = d.months.map((m) => [
      `Mês ${m.num} (${m.short})`,
      m.focus,
      `${m.clientsCount} imóveis`,
      formatBRL(m.baseRev),
      formatBRL(m.extraSeasonal),
      formatBRL(m.totalRev)
    ]);
    rows.push([
      'Total Acumulado 12 Meses',
      `Taxa de renovação anual considerada: ${d.retentionRate}%`,
      `${d.totalClientsYear} atendimentos no ano`,
      formatBRL(d.goal * 12),
      formatBRL(d.annualTotal - d.goal * 12),
      formatBRL(d.annualTotal)
    ]);
    rows.push([
      'Carteira Recorrente Ano 2',
      `${d.retainedClientsYear2} clientes renovando ITR + CCIR + CND (R$ 350/ano)`,
      `${d.retainedClientsYear2} renovações`,
      '-',
      '-',
      formatBRL(d.recurringYear2)
    ]);
    downloadCsvFile('planilha-03-meta-12-meses.csv', headers, rows);
  }

  /* ------------------------------------------------------------------------
     PLANILHA 04: CONVERSOR OFICIAL DE MEDIDAS RURAIS E MODULOS FISCAIS
     ------------------------------------------------------------------------ */
  function applyUfModuloPreset(preset) {
    const presetMap = {
      SP: 18,
      MG: 26,
      GO: 35,
      BA: 30,
      MT: 75
    };
    const mfEl = document.getElementById('conv-modulo-fiscal');
    if (mfEl && presetMap[preset] !== undefined) {
      mfEl.value = String(presetMap[preset]);
    }
    recalculateConverter();
  }

  function computeConverterData() {
    const qty = Math.max(
      0.01,
      parseFloat(document.getElementById('conv-qty')?.value || '12') || 12
    );
    const unitKey = document.getElementById('conv-unit')?.value || 'alq_paulista';
    const moduloFiscal = Math.max(
      1,
      parseFloat(document.getElementById('conv-modulo-fiscal')?.value || '20') || 20
    );

    const unitObj = AGRARIAN_UNITS.find((u) => u.key === unitKey) || AGRARIAN_UNITS[0];
    const ha = qty * unitObj.factorHa;
    const m2 = ha * 10000;
    const mf = ha / moduloFiscal;

    let classification = 'Grande (> 15 MF)';
    let shortClass = 'Grande Propriedade';
    if (mf <= 4) {
      classification = 'Pequena (até 4 MF)';
      shortClass = 'Pequena Propriedade';
    } else if (mf <= 15) {
      classification = 'Média (4 a 15 MF)';
      shortClass = 'Média Propriedade';
    }

    const regionalRows = AGRARIAN_UNITS.filter((u) => u.inTable).map((u) => ({
      ...u,
      unitM2: Math.round(u.factorHa * 10000),
      equiv: ha / u.factorHa
    }));

    return {
      qty,
      unitKey,
      unitObj,
      moduloFiscal,
      ha,
      m2,
      mf,
      classification,
      shortClass,
      regionalRows
    };
  }

  function renderConverterChartSvg(d) {
    let pinX = 20;
    if (d.mf <= 4) {
      pinX = 20 + (Math.max(0, d.mf) / 4) * 136;
    } else if (d.mf <= 15) {
      pinX = 160 + ((d.mf - 4) / 11) * 196;
    } else {
      const ratio = Math.min(1, (d.mf - 15) / 15);
      pinX = 360 + ratio * 140;
    }
    const clampedBadgeX = Math.min(430, Math.max(90, pinX));
    const alqPaulista = d.ha / 2.42;
    const alqMineiro = d.ha / 4.84;

    return `
      <svg viewBox="0 0 520 186" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, sans-serif" role="img" aria-label="Escala de classificação em Módulos Fiscais">
        <!-- Pin indicador superior -->
        <rect x="${(clampedBadgeX - 74).toFixed(1)}" y="8" width="148" height="24" rx="12" fill="#15803d"/>
        <text x="${clampedBadgeX.toFixed(1)}" y="24" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" text-anchor="middle">Imóvel: ${fmtCommaNum(d.mf, 2)} MF</text>
        <line x1="${pinX.toFixed(1)}" y1="32" x2="${pinX.toFixed(1)}" y2="50" stroke="#15803d" stroke-width="2"/>

        <!-- Regua Fundiaria Segmentada -->
        <rect x="20" y="48" width="136" height="26" rx="6" fill="#15803d"/>
        <text x="88" y="65" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">0 a 4 MF · Pequena</text>

        <rect x="160" y="48" width="196" height="26" rx="6" fill="#d97706"/>
        <text x="258" y="65" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">4 a 15 MF · Média</text>

        <rect x="360" y="48" width="140" height="26" rx="6" fill="#0f766e"/>
        <text x="430" y="65" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="10.5" font-weight="700" text-anchor="middle">15+ MF · Grande</text>

        <circle cx="${pinX.toFixed(1)}" cy="61" r="7" fill="#ffffff" stroke="#1d1d1f" stroke-width="2.5"/>

        <text x="20" y="90" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="600">0 MF</text>
        <text x="158" y="90" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="600" text-anchor="middle">4 MF</text>
        <text x="358" y="90" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="600" text-anchor="middle">15 MF</text>
        <text x="500" y="90" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="600" text-anchor="end">30+ MF</text>

        <!-- 3 Blocos Visuais de Equivalencia -->
        <rect x="20" y="106" width="152" height="66" rx="10" fill="var(--canvas-parchment)" stroke="var(--hairline-table)"/>
        <text x="32" y="127" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.05em">HECTARES OFICIAIS</text>
        <text x="32" y="154" fill="var(--primary)" font-family="Plus Jakarta Sans, sans-serif" font-size="15.5" font-weight="700">${fmtCommaNum(d.ha, 2)} ha</text>

        <rect x="184" y="106" width="152" height="66" rx="10" fill="var(--canvas-parchment)" stroke="var(--hairline-table)"/>
        <text x="196" y="127" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.05em">ALQ. PAULISTA (2,42)</text>
        <text x="196" y="154" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="15.5" font-weight="700">${fmtCommaNum(alqPaulista, 2)} alq</text>

        <rect x="348" y="106" width="152" height="66" rx="10" fill="var(--canvas-parchment)" stroke="var(--hairline-table)"/>
        <text x="360" y="127" fill="var(--ink-secondary)" font-family="Plus Jakarta Sans, sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.05em">ALQ. MINEIRO (4,84)</text>
        <text x="360" y="154" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="15.5" font-weight="700">${fmtCommaNum(alqMineiro, 2)} alq</text>
      </svg>
    `;
  }

  function recalculateConverter() {
    if (!document.getElementById('conv-qty')) return;
    const d = computeConverterData();

    const haFormatted = d.ha.toLocaleString('pt-BR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
    const qtyFormatted = d.qty.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
    const unitDisplay = d.qty === 1 ? d.unitObj.label : d.unitObj.plural;

    setText('conv-res-ha', `${haFormatted} ha`);
    setText(
      'conv-res-sub',
      `${qtyFormatted} ${unitDisplay} convertidos com precisão de 4 casas decimais`
    );
    setText('conv-res-m2', `${Math.round(d.m2).toLocaleString('pt-BR')} m2`);
    setText('conv-res-mf', `${fmtCommaNum(d.mf, 2)} MF`);
    setText('conv-res-class', d.classification);

    setHtml('converter-svg-chart', renderConverterChartSvg(d));

    const tbody = document.getElementById('converter-all-tbody');
    if (tbody) {
      tbody.innerHTML = d.regionalRows
        .map(
          (r) => `
          <tr${r.key === d.unitKey ? ' style="background-color: var(--primary-soft);"' : ''}>
            <td><strong>${escapeHtml(r.label)}</strong></td>
            <td>${escapeHtml(r.regions)}</td>
            <td>${fmtCommaNum(r.factorHa, 4)} ha</td>
            <td>${r.unitM2.toLocaleString('pt-BR')} m2</td>
            <td><strong>${fmtCommaNum(r.equiv, 4)}</strong></td>
          </tr>
        `
        )
        .join('');
    }

    saveToolsState();
  }

  function copyConverterSummary(btn) {
    const d = computeConverterData();
    const summary = [
      'QUADRO DE CONVERSÃO DE MEDIDA AGRÁRIA E MÓDULOS FISCAIS',
      `Medida original informada: ${d.qty.toLocaleString('pt-BR')} ${d.qty === 1 ? d.unitObj.label : d.unitObj.plural}`,
      `Área oficial padronizada (INCRA / ITR / CAR): ${fmtCommaNum(d.ha, 4)} ha (${Math.round(d.m2).toLocaleString('pt-BR')} m2)`,
      `Módulo Fiscal adotado: ${d.moduloFiscal} ha | Enquadramento: ${fmtCommaNum(d.mf, 2)} MF - ${d.classification}`,
      '',
      'Equivalências Regionais:',
      `- Alqueire Paulista (2,42 ha): ${fmtCommaNum(d.ha / 2.42, 4)}`,
      `- Alqueire Mineiro / Goiano (4,84 ha): ${fmtCommaNum(d.ha / 4.84, 4)}`,
      `- Alqueire Baiano (9,68 ha): ${fmtCommaNum(d.ha / 9.68, 4)}`,
      `- Tarefa Baiana (0,4356 ha): ${fmtCommaNum(d.ha / 0.4356, 2)}`
    ].join('\n');
    copyText(summary, btn);
  }

  function exportConverterCsv() {
    const d = computeConverterData();
    const headers = [
      'Unidade Agrária Regional',
      'Regiões de Uso Tradicional',
      'Fator Oficial (1 un. em ha)',
      'Metragem de 1 un. (m2)',
      'Equivalência para Este Imóvel'
    ];
    const rows = d.regionalRows.map((r) => [
      r.label,
      r.regions,
      fmtCommaNum(r.factorHa, 4),
      String(r.unitM2),
      fmtCommaNum(r.equiv, 4)
    ]);
    rows.push([
      'Enquadramento Fundiário Calculado',
      `Módulo Fiscal municipal: ${d.moduloFiscal} ha`,
      `${fmtCommaNum(d.ha, 4)} ha`,
      `${Math.round(d.m2)} m2`,
      `${fmtCommaNum(d.mf, 2)} MF - ${d.classification}`
    ]);
    downloadCsvFile('planilha-04-conversao-medidas-rurais.csv', headers, rows);
  }

  /* ------------------------------------------------------------------------
     PLANILHA 05: SIMULADOR PRATICO DE ITR E ECONOMIA LEGAL (LEI 9.393/96)
     ------------------------------------------------------------------------ */
  function resetItrDefaults() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = String(val);
    };
    setVal('itr-area-total', 180);
    setVal('itr-area-ambiental', 54);
    setVal('itr-area-utilizada', 110);
    setVal('itr-vtn-ha', 14500);
    const chk = document.getElementById('itr-pequena-gleba');
    if (chk) chk.checked = false;
    recalculateItr();
    showToast('Exemplo padrão do ITR restaurado.');
  }

  function computeItrData() {
    const areaTotal = Math.max(
      1,
      parseFloat(document.getElementById('itr-area-total')?.value || '180') || 180
    );
    const rawAmb = parseFloat(document.getElementById('itr-area-ambiental')?.value || '0') || 0;
    const rawUtil = parseFloat(document.getElementById('itr-area-utilizada')?.value || '0') || 0;
    const vtnHa = Math.max(
      100,
      parseFloat(document.getElementById('itr-vtn-ha')?.value || '14500') || 14500
    );
    const pequenaGlebaChecked = Boolean(document.getElementById('itr-pequena-gleba')?.checked);

    const areaAmbiental = Math.min(areaTotal, Math.max(0, rawAmb));
    const areaTributavel = Math.max(0, areaTotal - areaAmbiental);
    const areaUtilizada = Math.min(areaTributavel, Math.max(0, rawUtil));
    const gu = areaTributavel > 0 ? (areaUtilizada / areaTributavel) * 100 : 100;

    let guColIdx = 4;
    let guBracketLabel = 'Até 30%';
    if (gu > 80) {
      guColIdx = 0;
      guBracketLabel = 'Acima de 80%';
    } else if (gu > 65) {
      guColIdx = 1;
      guBracketLabel = '65% a 80%';
    } else if (gu > 50) {
      guColIdx = 2;
      guBracketLabel = '50% a 65%';
    } else if (gu > 30) {
      guColIdx = 3;
      guBracketLabel = '30% a 50%';
    }

    const rowBracket =
      ITR_RATES_MATRIX.find((r) => areaTotal <= r.maxHa) ||
      ITR_RATES_MATRIX[ITR_RATES_MATRIX.length - 1];

    const aliquota = rowBracket.rates[guColIdx];
    const worstRate = rowBracket.rates[4];

    const vtnTotal = areaTotal * vtnHa;
    const vtnTributavel = areaTributavel * vtnHa;

    const isIsento = pequenaGlebaChecked && areaTotal <= 30;
    const impostoRegularizado = isIsento
      ? 0
      : areaTributavel === 0
        ? 10
        : Math.max(10, vtnTributavel * (aliquota / 100));

    const impostoSemRegularizar = Math.max(10, vtnTotal * (worstRate / 100));
    const economia = Math.max(0, impostoSemRegularizar - impostoRegularizado);
    const reductionPct =
      impostoSemRegularizar > 0 ? Math.round((economia / impostoSemRegularizar) * 100) : 0;

    return {
      areaTotal,
      areaAmbiental,
      areaTributavel,
      areaUtilizada,
      vtnHa,
      pequenaGlebaChecked,
      isIsento,
      gu,
      guBracketLabel,
      rowBracket,
      aliquota,
      worstRate,
      vtnTotal,
      vtnTributavel,
      impostoRegularizado,
      impostoSemRegularizar,
      economia,
      reductionPct
    };
  }

  function renderItrChartSvg(d) {
    const maxItr = Math.max(d.impostoSemRegularizar, d.impostoRegularizado, 100);
    const maxBarW = 480;
    const unoptW = Math.max(12, Math.round((d.impostoSemRegularizar / maxItr) * maxBarW));
    const optW =
      d.impostoRegularizado === 0
        ? 8
        : Math.max(10, Math.round((d.impostoRegularizado / maxItr) * maxBarW));

    return `
      <svg viewBox="0 0 520 190" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, sans-serif" role="img" aria-label="Comparativo entre ITR sem regularização e ITR com CAR/ADA e GU real">
        <!-- Barra 1: Sem Isencao / GU Baixo -->
        <text x="20" y="24" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="600">Sem Isenção / GU Baixo (&lt;=30% · ${fmtCommaNum(d.worstRate, 2)}%)</text>
        <text x="500" y="24" fill="#dc2626" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" text-anchor="end">${escapeHtml(formatBRLCents(d.impostoSemRegularizar))}</text>
        <rect x="20" y="32" width="${maxBarW}" height="24" rx="7" fill="var(--canvas-parchment)"/>
        <rect x="20" y="32" width="${unoptW}" height="24" rx="7" fill="#dc2626"/>

        <!-- Barra 2: Declarado com CAR/ADA + GU Real -->
        <text x="20" y="80" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="11.5" font-weight="700">Declarado com CAR/ADA + GU Real (${fmtCommaNum(d.gu, 1)}%)</text>
        <text x="500" y="80" fill="#15803d" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700" text-anchor="end">${escapeHtml(d.isIsento ? 'Isento (R$ 0,00)' : formatBRLCents(d.impostoRegularizado))}</text>
        <rect x="20" y="88" width="${maxBarW}" height="24" rx="7" fill="var(--canvas-parchment)"/>
        <rect x="20" y="88" width="${optW}" height="24" rx="7" fill="#15803d"/>

        <!-- Selo de Economia Anual -->
        <rect x="20" y="130" width="480" height="46" rx="11" fill="rgba(21, 128, 61, 0.12)" stroke="rgba(21, 128, 61, 0.32)"/>
        <rect x="32" y="141" width="118" height="24" rx="12" fill="#15803d"/>
        <text x="91" y="157" fill="#ffffff" font-family="Plus Jakarta Sans, sans-serif" font-size="10" font-weight="700" text-anchor="middle">ECONOMIA LEGAL</text>
        <text x="162" y="157" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="12" font-weight="700">${escapeHtml(formatBRLCents(d.economia))} / ano (-${d.reductionPct}% no imposto)</text>
      </svg>
    `;
  }

  function recalculateItr() {
    if (!document.getElementById('itr-area-total')) return;
    const d = computeItrData();

    setText(
      'itr-res-imposto',
      d.isIsento ? 'Isento (R$ 0,00)' : formatBRLCents(d.impostoRegularizado)
    );

    if (d.isIsento) {
      setText(
        'itr-res-sub',
        'Imunidade de Pequena Gleba até 30 ha (art. 2º da Lei 9.393/96, quando único imóvel explorado pela família)'
      );
    } else if (d.pequenaGlebaChecked && d.areaTotal > 30) {
      setText(
        'itr-res-sub',
        'Regra geral de Pequena Gleba exige até 30 ha (50 ha Polígono das Secas/Amaz. Oriental ou 100 ha Amaz. Ocidental/Pantanal). Cálculo normal aplicado.'
      );
    } else {
      setText(
        'itr-res-sub',
        'Cálculo referencial conforme Anexo da Lei Federal 9.393/96 (mínimo DARF R$ 10,00)'
      );
    }

    setText('itr-res-gu', `${fmtCommaNum(d.gu, 1)}%`);
    setText('itr-res-aliquota', d.isIsento ? 'Isento (0%)' : `${fmtCommaNum(d.aliquota, 2)}%`);
    setText('itr-res-economia', formatBRL(d.economia));

    setHtml('itr-svg-chart', renderItrChartSvg(d));

    const memTbody = document.getElementById('itr-memory-tbody');
    if (memTbody) {
      const memRows = [
        [
          '01. Área Total do Imóvel',
          'Matrícula / CIB / CNIR',
          `${fmtCommaNum(d.areaTotal, 2)} ha`
        ],
        [
          '02. (-) Áreas Ambientais Isentas',
          'APP + Reserva Legal + RPPN (Recibo CAR + ADA IBAMA)',
          `${fmtCommaNum(d.areaAmbiental, 2)} ha`
        ],
        [
          '03. (=) Área Tributável do Imóvel',
          'Área Total menos Áreas Ambientais',
          `${fmtCommaNum(d.areaTributavel, 2)} ha`
        ],
        [
          '04. Grau de Utilização (GU)',
          `${fmtCommaNum(d.areaUtilizada, 2)} ha utilizados / ${fmtCommaNum(d.areaTributavel, 2)} ha tributáveis`,
          `${fmtCommaNum(d.gu, 1)}% (${d.guBracketLabel})`
        ],
        [
          '05. Valor da Terra Nua Tributável (VTNt)',
          `${fmtCommaNum(d.areaTributavel, 2)} ha x ${formatBRL(d.vtnHa)} / ha`,
          formatBRLCents(d.vtnTributavel)
        ],
        [
          '06. Alíquota Oficial (Lei 9.393/96)',
          `Faixa: ${d.rowBracket.label} x GU ${d.guBracketLabel}`,
          d.isIsento ? 'Isento (Art. 2º)' : `${fmtCommaNum(d.aliquota, 2)}%`
        ],
        [
          '07. ITR Anual Estimado vs. Sem Exclusão',
          `Sem CAR/ADA e GU baixo: ${formatBRLCents(d.impostoSemRegularizar)} | Economia: ${formatBRLCents(d.economia)}`,
          d.isIsento ? 'Isento (R$ 0,00)' : formatBRLCents(d.impostoRegularizado)
        ]
      ];
      memTbody.innerHTML = memRows
        .map(
          (r, i) => `
          <tr${i === 6 ? ' style="background-color: var(--primary-soft);"' : ''}>
            <td><strong>${escapeHtml(r[0])}</strong></td>
            <td>${escapeHtml(r[1])}</td>
            <td><strong>${escapeHtml(r[2])}</strong></td>
          </tr>
        `
        )
        .join('');
    }

    saveToolsState();
  }

  function exportItrCsv() {
    const d = computeItrData();
    const headers = [
      'Campo na Ficha DIAT (PGD ITR)',
      'Base / Fórmula de Apuração',
      'Valor Apurado na Simulação'
    ];
    const rows = [
      ['01. Área Total do Imóvel', 'Matrícula / CIB / CNIR', `${fmtCommaNum(d.areaTotal, 2)} ha`],
      [
        '02. Áreas Ambientais Isentas',
        'APP + Reserva Legal + RPPN (CAR + ADA)',
        `${fmtCommaNum(d.areaAmbiental, 2)} ha`
      ],
      [
        '03. Área Tributável',
        'Área Total menos Áreas Ambientais',
        `${fmtCommaNum(d.areaTributavel, 2)} ha`
      ],
      [
        '04. Área Efetivamente Utilizada',
        'Lavoura, pastagem plantada/nativa ou manejo',
        `${fmtCommaNum(d.areaUtilizada, 2)} ha`
      ],
      [
        '05. Grau de Utilização (GU)',
        `Faixa: ${d.guBracketLabel}`,
        `${fmtCommaNum(d.gu, 1)}%`
      ],
      [
        '06. VTN Tributável (VTNt)',
        `VTN/ha informado: ${formatBRL(d.vtnHa)}`,
        formatBRLCents(d.vtnTributavel)
      ],
      [
        '07. Alíquota Lei 9.393/96',
        d.rowBracket.label,
        d.isIsento ? 'Isento (0%)' : `${fmtCommaNum(d.aliquota, 2)}%`
      ],
      [
        '08. ITR Anual Declarado Corretamente',
        'Mínimo legal DARF R$ 10,00',
        d.isIsento ? 'Isento (R$ 0,00)' : formatBRLCents(d.impostoRegularizado)
      ],
      [
        '09. Comparativo Sem CAR/ADA e GU <= 30%',
        `Alíquota comparativa ${fmtCommaNum(d.worstRate, 2)}% sobre VTN total`,
        formatBRLCents(d.impostoSemRegularizar)
      ],
      [
        '10. Economia Legal Anual Estimada',
        `Redução de ${d.reductionPct}%`,
        formatBRLCents(d.economia)
      ]
    ];
    downloadCsvFile('planilha-05-memoria-simulacao-itr.csv', headers, rows);
  }

  /* ------------------------------------------------------------------------
     PLANILHA 06: CARTEIRA CRM (CONSULTOR) / FICHA DA MINHA TERRA (PROPRIETARIO)
     ------------------------------------------------------------------------ */
  function getCrmStorageKey() {
    return isProprietarioMode() ? CRM_PROP_STORAGE_KEY : CRM_CONS_STORAGE_KEY;
  }

  function loadCrmItems() {
    const isProp = isProprietarioMode();
    const key = getCrmStorageKey();
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_e) {}
    const defaults = getDefaultCrmItems(isProp);
    saveCrmItems(defaults);
    return defaults;
  }

  function saveCrmItems(items) {
    try {
      localStorage.setItem(getCrmStorageKey(), JSON.stringify(items));
    } catch (_e) {}
  }

  function getCrmReceivedAmount(row) {
    const val = Math.max(0, Number(row.value) || 0);
    if (row.paidMode === 'full') return val;
    if (row.paidMode === 'partial') return Math.round(val / 2);
    return 0;
  }

  function renderCrmChartSvg(rows, isProp, totalVal, receivedVal, pendingVal) {
    const safeTotal = Math.max(totalVal, 1);
    const recPct = totalVal > 0 ? Math.round((receivedVal / safeTotal) * 100) : 0;
    const pendPct = Math.max(0, 100 - recPct);
    const barTotalW = 504;
    const recW = totalVal > 0 ? Math.round((receivedVal / safeTotal) * barTotalW) : 0;
    const pendW = Math.max(0, barTotalW - recW);

    const statusStages = isProp
      ? [
          { key: 'Em Dia', color: '#15803d' },
          { key: 'Em Atualização', color: '#f59e0b' },
          { key: 'Pendente', color: '#dc2626' }
        ]
      : [
          { key: 'Triagem', color: '#6e6e73' },
          { key: 'Em Protocolo', color: '#0f766e' },
          { key: 'Aguardando Órgão', color: '#f59e0b' },
          { key: 'Concluído', color: '#15803d' }
        ];

    const stageStats = statusStages.map((st) => {
      const matched = rows.filter((r) => r.status === st.key);
      const sum = matched.reduce((acc, r) => acc + (Number(r.value) || 0), 0);
      return { ...st, count: matched.length, sum };
    });
    const maxStageCount = Math.max(...stageStats.map((s) => s.count), 1);
    const rowSpacing = isProp ? 31 : 24;
    const barH = isProp ? 18 : 15;

    const stageBarsSvg = stageStats
      .map((st, idx) => {
        const y = 82 + idx * rowSpacing;
        const w = st.count > 0 ? Math.max(14, Math.round((st.count / maxStageCount) * 230)) : 4;
        return `
          <text x="18" y="${y + 12}" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600">${escapeHtml(st.key)}</text>
          <rect x="148" y="${y}" width="230" height="${barH}" rx="5" fill="var(--canvas-parchment)"/>
          <rect x="148" y="${y}" width="${w}" height="${barH}" rx="5" fill="${st.color}"/>
          <text x="522" y="${y + 12}" fill="var(--ink)" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" text-anchor="end">${st.count} · ${escapeHtml(formatBRL(st.sum))}</text>
        `;
      })
      .join('');

    return `
      <svg viewBox="0 0 540 190" fill="none" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, sans-serif" role="img" aria-label="Resumo financeiro e etapas da carteira">
        <text x="18" y="21" fill="#15803d" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700">${isProp ? 'Quitado' : 'Recebido'}: ${escapeHtml(formatBRL(receivedVal))} (${recPct}%)</text>
        <text x="522" y="21" fill="#d97706" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="700" text-anchor="end">${isProp ? 'Em Aberto' : 'A Receber'}: ${escapeHtml(formatBRL(pendingVal))} (${pendPct}%)</text>

        <rect x="18" y="30" width="${barTotalW}" height="22" rx="7" fill="var(--canvas-parchment)"/>
        ${recW > 0 ? `<rect x="18" y="30" width="${recW}" height="22" rx="7" fill="#15803d"/>` : ''}
        ${pendW > 0 ? `<rect x="${18 + recW}" y="30" width="${pendW}" height="22" rx="7" fill="#f59e0b"/>` : ''}

        <line x1="18" y1="66" x2="522" y2="66" stroke="var(--hairline-table)" stroke-width="1"/>
        ${stageBarsSvg}
      </svg>
    `;
  }

  function renderCrmSheet() {
    const tbody = document.getElementById('crm-tbody');
    const thead = document.getElementById('crm-thead');
    if (!tbody || !thead) return;

    const isProp = isProprietarioMode();
    const rows = loadCrmItems();

    const totalVal = rows.reduce((acc, r) => acc + (Number(r.value) || 0), 0);
    const receivedVal = rows.reduce((acc, r) => acc + getCrmReceivedAmount(r), 0);
    const pendingVal = Math.max(0, totalVal - receivedVal);

    setText('crm-kpi-main', formatBRL(totalVal));
    setText('crm-kpi-sub1', formatBRL(receivedVal));
    setText('crm-kpi-sub2', formatBRL(pendingVal));
    setText(
      'crm-kpi-sub3',
      isProp
        ? `${rows.length} ${rows.length === 1 ? 'gleba' : 'glebas'}`
        : `${rows.length} ${rows.length === 1 ? 'imóvel' : 'imóveis'}`
    );

    setHtml(
      'crm-svg-chart',
      renderCrmChartSvg(rows, isProp, totalVal, receivedVal, pendingVal)
    );

    thead.innerHTML = isProp
      ? `
        <tr>
          <th>Gleba / Imóvel</th>
          <th>Matrícula / Cadastros</th>
          <th>Área</th>
          <th>Taxa / Imposto</th>
          <th>Situação</th>
          <th>Quitação (Clique)</th>
          <th>Ação</th>
        </tr>
      `
      : `
        <tr>
          <th>Cliente / Propriedade</th>
          <th>Órgãos / Escopo</th>
          <th>Área</th>
          <th>Honorários</th>
          <th>Etapa Atual</th>
          <th>Pagamento (Clique)</th>
          <th>Ação</th>
        </tr>
      `;

    const statusOptions = isProp
      ? ['Em Dia', 'Em Atualização', 'Pendente']
      : ['Triagem', 'Em Protocolo', 'Aguardando Órgão', 'Concluído'];

    if (rows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--ink-secondary); padding: 24px;">
            Nenhum registro cadastrado. Use os campos acima para adicionar ou clique em "Restaurar Exemplo".
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = rows
      .map((row) => {
        const selectHtml = `
          <select class="crm-inline-select" onchange="window.RRApp.updateCrmRowStatus('${escapeHtml(row.id)}', this.value)" aria-label="Alterar etapa">
            ${statusOptions
              .map(
                (opt) =>
                  `<option value="${escapeHtml(opt)}"${row.status === opt ? ' selected' : ''}>${escapeHtml(opt)}</option>`
              )
              .join('')}
          </select>
        `;

        let paidClass = '';
        let paidLabel = '0% Pendente';
        if (isProp) {
          if (row.paidMode === 'full') {
            paidClass = 'is-paid';
            paidLabel = 'Quitado';
          } else {
            paidClass = 'is-partial';
            paidLabel = 'Em Aberto';
          }
        } else if (row.paidMode === 'full') {
          paidClass = 'is-paid';
          paidLabel = '100% Quitado';
        } else if (row.paidMode === 'partial') {
          paidClass = 'is-partial';
          paidLabel = '50% Entrada';
        }

        const haTxt = `${Number(row.ha || 0).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;

        return `
          <tr>
            <td><strong>${escapeHtml(row.name)}</strong></td>
            <td>${escapeHtml(row.doc)}</td>
            <td>${escapeHtml(haTxt)}</td>
            <td><strong>${escapeHtml(formatBRL(row.value))}</strong></td>
            <td>${selectHtml}</td>
            <td>
              <button type="button" class="btn-paid-toggle ${paidClass}" onclick="window.RRApp.toggleCrmRowPaid('${escapeHtml(row.id)}')">
                ${escapeHtml(paidLabel)}
              </button>
            </td>
            <td>
              <button type="button" class="btn-row-del" onclick="window.RRApp.deleteCrmRow('${escapeHtml(row.id)}')" title="Remover linha" aria-label="Remover registro">
                ${SVG_ICONS.trash}
              </button>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  function addCrmRow() {
    const isProp = isProprietarioMode();
    const nameEl = document.getElementById('crm-name');
    const docEl = document.getElementById('crm-doc');
    const haEl = document.getElementById('crm-ha');
    const valEl = document.getElementById('crm-value');
    const statusEl = document.getElementById('crm-status');

    const name = sanitizeCleanText(nameEl ? nameEl.value : '').trim();
    if (!name) {
      if (nameEl) nameEl.focus();
      showToast(isProp ? 'Informe o nome da gleba ou imóvel.' : 'Informe o nome do cliente ou imóvel.');
      return;
    }

    const doc =
      sanitizeCleanText(docEl ? docEl.value : '').trim() ||
      (isProp ? 'Matrícula + CCIR + ITR' : 'DCR INCRA + ITR + CAR');
    const ha = Math.max(0.1, parseFloat(haEl ? haEl.value : '0') || 25);
    const value = Math.max(0, parseFloat(valEl ? valEl.value : '0') || (isProp ? 220 : 1500));
    const status =
      (statusEl ? statusEl.value : '') || (isProp ? 'Em Dia' : 'Triagem');

    const paidMode =
      status === 'Concluído' || status === 'Em Dia'
        ? 'full'
        : isProp
          ? 'pending'
          : 'partial';

    const rows = loadCrmItems();
    rows.unshift({
      id: `crm-${Date.now()}`,
      name,
      doc,
      ha,
      value,
      status,
      paidMode
    });
    saveCrmItems(rows);

    if (nameEl) nameEl.value = '';
    if (docEl) docEl.value = '';
    if (haEl) haEl.value = '';
    if (valEl) valEl.value = '';

    renderCrmSheet();
    showToast('Registro adicionado com sucesso.');
  }

  function updateCrmRowStatus(id, newStatus) {
    const rows = loadCrmItems();
    const target = rows.find((r) => r.id === id);
    if (!target) return;
    target.status = sanitizeCleanText(newStatus);
    if (target.status === 'Concluído' || target.status === 'Em Dia') {
      target.paidMode = 'full';
    }
    saveCrmItems(rows);
    renderCrmSheet();
  }

  function toggleCrmRowPaid(id) {
    const isProp = isProprietarioMode();
    const rows = loadCrmItems();
    const target = rows.find((r) => r.id === id);
    if (!target) return;

    if (isProp) {
      target.paidMode = target.paidMode === 'full' ? 'pending' : 'full';
    } else if (target.paidMode === 'pending') {
      target.paidMode = 'partial';
    } else if (target.paidMode === 'partial') {
      target.paidMode = 'full';
    } else {
      target.paidMode = 'pending';
    }

    saveCrmItems(rows);
    renderCrmSheet();
  }

  function deleteCrmRow(id) {
    const rows = loadCrmItems().filter((r) => r.id !== id);
    saveCrmItems(rows);
    renderCrmSheet();
    showToast('Registro removido da planilha.');
  }

  function resetCrmDemo() {
    const defaults = getDefaultCrmItems(isProprietarioMode());
    saveCrmItems(defaults);
    renderCrmSheet();
    showToast('Dados de exemplo restaurados.');
  }

  function exportCrmCsv() {
    const isProp = isProprietarioMode();
    const rows = loadCrmItems();
    const headers = isProp
      ? [
          'Gleba / Imóvel',
          'Matrícula / Cadastros',
          'Área (ha)',
          'Taxa / Imposto Anual (R$)',
          'Situação Cadastral',
          'Status de Quitação',
          'Valor Quitado (R$)',
          'Saldo em Aberto (R$)'
        ]
      : [
          'Cliente / Propriedade',
          'Órgãos / Escopo',
          'Área (ha)',
          'Honorários Totais (R$)',
          'Etapa Operacional',
          'Status de Recebimento',
          'Já Recebido (R$)',
          'Saldo a Receber (R$)'
        ];

    const csvRows = rows.map((r) => {
      const val = Math.max(0, Number(r.value) || 0);
      const rec = getCrmReceivedAmount(r);
      const pend = Math.max(0, val - rec);
      const paidText = isProp
        ? r.paidMode === 'full'
          ? 'Quitado'
          : 'Em Aberto'
        : r.paidMode === 'full'
          ? '100% Quitado'
          : r.paidMode === 'partial'
            ? '50% Entrada Recebida'
            : '0% Pendente';
      return [
        r.name,
        r.doc,
        fmtCommaNum(r.ha, 2),
        formatBRL(val),
        r.status,
        paidText,
        formatBRL(rec),
        formatBRL(pend)
      ];
    });

    downloadCsvFile(
      isProp ? 'planilha-04-ficha-minha-terra.csv' : 'planilha-06-carteira-crm-rural.csv',
      headers,
      csvRows
    );
  }

  /* ========================================================================
     MODAIS DE CADEADO E TRAVA DE 7 DIAS
     ======================================================================== */
  function openPurchaseModal(mod) {
    state.modalModule = mod;
    const backdrop = document.getElementById('modal-backdrop');
    const purchaseModal = document.getElementById('modal-purchase');
    const dripModal = document.getElementById('modal-drip');

    if (dripModal) dripModal.classList.add('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
    if (purchaseModal) purchaseModal.classList.remove('hidden');

    document.getElementById('modal-purchase-badge').textContent = `MÓDULO ${mod.number} · BLOQUEADO`;
    document.getElementById('modal-purchase-title').textContent = mod.title;
    document.getElementById('modal-purchase-email').textContent =
      (state.user && state.user.email) || 'aluno@rural.com';

    const lessonsList = document.getElementById('modal-purchase-lessons');
    const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
    if (lessonsList) {
      lessonsList.innerHTML = lessons
        .map(
          (l, i) => `
          <li>
            ${SVG_ICONS.check}
            <span>Aula ${String(i + 1).padStart(2, '0')}: ${escapeHtml(l.title)}</span>
          </li>
        `
        )
        .join('');
    }

    const ctaLink = document.getElementById('modal-purchase-cta');
    const ctaLabel = document.getElementById('modal-purchase-cta-label');
    const comboLink = document.getElementById('modal-purchase-combo-cta');

    if (ctaLink) {
      ctaLink.href = buildCheckoutLinkWithEmail(mod.checkoutUrl);
    }
    if (ctaLabel) {
      ctaLabel.textContent =
        mod.numInt >= 12 && mod.numInt <= 20
          ? 'Destravar Apenas Este Pacote Agora'
          : 'Destravar Módulo Agora';
    }
    if (comboLink) {
      const isOrderBumpModule = mod.numInt >= 12 && mod.numInt <= 20;
      const comboBaseUrl =
        (state.checkoutUrls && (state.checkoutUrls.combo3obs || state.checkoutUrls.acesso_combo_3obs)) ||
        'https://pay.novarkbr.com/fotl08p9';
      comboLink.href = buildCheckoutLinkWithEmail(comboBaseUrl);
      comboLink.classList.toggle('hidden', !isOrderBumpModule);
    }
  }

  function openDripModal(mod) {
    state.modalModule = mod;
    const backdrop = document.getElementById('modal-backdrop');
    const purchaseModal = document.getElementById('modal-purchase');
    const dripModal = document.getElementById('modal-drip');

    if (purchaseModal) purchaseModal.classList.add('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
    if (dripModal) dripModal.classList.remove('hidden');

    const daysRem = mod.daysRemaining || 7;
    document.getElementById('modal-drip-title').textContent = `Módulo ${mod.number}: ${mod.title}`;
    document.getElementById('modal-drip-explanation').textContent =
      `Este módulo avançado já faz parte da sua inscrição e será liberado automaticamente em ${daysRem} dias (no 8º dia de acesso).`;

    const lessonsList = document.getElementById('modal-drip-lessons');
    const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
    if (lessonsList) {
      lessonsList.innerHTML = lessons
        .map(
          (l, i) => `
          <li>
            ${SVG_ICONS.clock}
            <span>Aula ${String(i + 1).padStart(2, '0')}: ${escapeHtml(l.title)}</span>
          </li>
        `
        )
        .join('');
    }
  }

  function closeModals() {
    const backdrop = document.getElementById('modal-backdrop');
    const purchaseModal = document.getElementById('modal-purchase');
    const dripModal = document.getElementById('modal-drip');
    if (backdrop) backdrop.classList.add('hidden');
    if (purchaseModal) purchaseModal.classList.add('hidden');
    if (dripModal) dripModal.classList.add('hidden');
  }

  function closeModalOnBackdrop(event) {
    if (event.target && event.target.id === 'modal-backdrop') {
      closeModals();
    }
  }

  async function simulatePass7DaysNow() {
    closeModals();
    await quickSwitch('aluno8dias@rural.com', 'dia8');
  }

  async function unlockCurrentModalTrackForTest() {
    const mod = state.modalModule;
    closeModals();
    if (!mod) {
      await quickSwitch('vip@rural.com', 'vip');
      return;
    }
    await quickSwitch('vip@rural.com', 'vip');
    openModule(mod.id, 0);
  }

  /* ========================================================================
     ABA "CONSULTOR IA" (MINIMALISTA ESTILO APPLE INTELLIGENCE)
     ======================================================================== */
  function updateAiAccessState() {
    const hasAi = Boolean(
      state.user && (state.user.isAdmin || state.user.acesso_ia_consultor === true)
    );
    const lockedBanner = document.getElementById('ai-locked-banner');
    if (lockedBanner) {
      lockedBanner.classList.toggle('hidden', hasAi);
    }
    const checkoutLink = document.getElementById('ai-unlock-checkout-link');
    if (checkoutLink) {
      const iaUrl =
        (state.checkoutUrls && (state.checkoutUrls.ia || state.checkoutUrls.acesso_ia_consultor)) ||
        'https://pay.novarkbr.com/p0ptqz86';
      checkoutLink.href = buildCheckoutLinkWithEmail(iaUrl);
    }
  }

  function initAiWelcomeMessage() {
    state.aiMessages = [
      {
        role: 'assistant',
        sender: 'Consultor Rural IA',
        text: [
          'Olá! Descreva o caso do imóvel rural do seu cliente ou selecione uma das 4 sugestões acima.',
          'Eu entrego na hora:',
          '- Diagnóstico técnico e qual órgão resolver primeiro (INCRA, Receita Federal, Cartório ou Órgão Ambiental).',
          '- Checklist de documentos necessários.',
          '- Passo a passo nos sistemas (SNCR, PGD ITR, CNIR, e-CAC e SICAR).',
          '- Sugestão de honorários e mensagem pronta para enviar ao cliente.'
        ].join('\n')
      }
    ];
    renderAiMessages();
  }

  function formatAiTextToHtml(rawText) {
    const clean = sanitizeCleanText(rawText);
    const lines = clean.split('\n');
    let html = '<div class="ai-formatted-body">';
    let inList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        return;
      }

      if (/^BLOCO\s+\d+/i.test(trimmed) || /^###?\s+/.test(trimmed)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const headingText = trimmed.replace(/^###?\s+/, '');
        html += `<h4>${escapeHtml(headingText)}</h4>`;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s+/.test(trimmed)) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        const itemText = trimmed.replace(/^(-|\*|\d+\.)\s+/, '');
        html += `<li>${escapeHtml(itemText)}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p>${escapeHtml(trimmed)}</p>`;
      }
    });

    if (inList) html += '</ul>';
    html += '</div>';
    return html;
  }

  function renderAiMessages() {
    const stream = document.getElementById('ai-chat-messages');
    if (!stream) return;

    stream.innerHTML = state.aiMessages
      .map((msg, idx) => {
        if (msg.role === 'user') {
          return `
            <div class="ai-msg msg-user">
              <div class="ai-msg-avatar">AL</div>
              <div class="ai-msg-bubble">
                <p style="margin:0;">${escapeHtml(msg.text)}</p>
              </div>
            </div>
          `;
        }

        return `
          <div class="ai-msg msg-assistant">
            <div class="ai-msg-avatar">IA</div>
            <div class="ai-msg-bubble">
              <div class="ai-msg-header">
                <span class="ai-msg-sender">${escapeHtml(msg.sender || 'Consultor Rural IA')}</span>
                <button type="button" class="btn-copy-ai" onclick="window.RRApp.copyAiReply(${idx}, this)">
                  ${SVG_ICONS.copy}
                  <span>Copiar</span>
                </button>
              </div>
              ${formatAiTextToHtml(msg.text)}
            </div>
          </div>
        `;
      })
      .join('');

    stream.scrollTop = stream.scrollHeight;
  }

  function copyAiReply(index, btn) {
    const msg = state.aiMessages[index];
    if (!msg) return;
    copyText(msg.text, btn);
  }

  function clearAiChat() {
    initAiWelcomeMessage();
    showToast('Conversa reiniciada.');
  }

  function handleAiKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAiSubmit(event);
    }
  }

  function askPresetCase(caseIndex) {
    const activeCases = isProprietarioMode() ? PRESET_AI_CASES_PROPRIETARIO : PRESET_AI_CASES;
    const question = activeCases[caseIndex];
    if (!question) return;
    const input = document.getElementById('ai-question-input');
    if (input) input.value = question;
    sendAiQuestion(question);
  }

  async function handleAiSubmit(event) {
    if (event) event.preventDefault();
    const input = document.getElementById('ai-question-input');
    const question = input ? input.value.trim() : '';
    if (!question) return;
    input.value = '';
    await sendAiQuestion(question);
  }

  async function sendAiQuestion(question) {
    if (state.aiMessages.length === 0) initAiWelcomeMessage();

    state.aiMessages.push({
      role: 'user',
      text: question
    });
    renderAiMessages();

    const sendBtn = document.getElementById('ai-send-btn');
    if (sendBtn) sendBtn.disabled = true;

    const res = await apiFetch('/api/ai-consultant', {
      method: 'POST',
      body: JSON.stringify({
        question
      })
    });

    if (sendBtn) sendBtn.disabled = false;

    if (res.status === 403 && res.data && res.data.lockReason === 'PURCHASE_IA') {
      state.aiMessages.push({
        role: 'assistant',
        sender: 'Consultor Rural IA',
        text: 'Este perfil de demonstração não possui o Consultor IA habilitado. Clique em "Testar como Aluno VIP" acima ou no menu de perfil no canto superior direito para liberar.'
      });
      renderAiMessages();
      return;
    }

    if (!res.ok) {
      state.aiMessages.push({
        role: 'assistant',
        sender: 'Consultor Rural IA',
        text:
          (res.data && (res.data.reason || res.data.error)) ||
          'Envie apenas dúvidas técnicas e comerciais sobre regularização de imóveis rurais.'
      });
      renderAiMessages();
      return;
    }

    state.aiMessages.push({
      role: 'assistant',
      sender: 'Consultor Rural IA',
      text: sanitizeCleanText(res.data.answer || res.data.reply || '')
    });
    renderAiMessages();
  }

  /* ========================================================================
     SISTEMA DE CERTIFICADO DE CONCLUSAO DE CURSO LIVRE (FRENTE E VERSO A4)
     Lei Federal n. 9.394/1996 (art. 42) e Decreto n. 5.154/2004
     ======================================================================== */
  const CERT_FONT = 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, sans-serif';

  const CERT_LOCKED_TOAST =
    "Conclua as 34 aulas da Trilha Principal (ou use o botão de simulação local) para baixar o certificado oficial sem marca d'água.";

  const CERT_MAIN_MODULES_CURRICULUM = [
    '01. Fundamentos e Limites Legais (CCIR, ITR e CAR)',
    '02. Emissão e Atualização de CCIR/DCR no INCRA',
    '03. Declaração de ITR, CAFIR, CNIR e CND Rural',
    '04. Cadastro Ambiental Rural (CAR e SICAR)',
    '05. Retificação Administrativa e Noções de SIGEF',
    '06. Organização Documental para Crédito Rural',
    '07. Checklists Operacionais por Objetivo',
    '08. Calendário Anual de Obrigações Rurais',
    '09. Diagnóstico e Correção de Divergências',
    '10. Resolução de Sobreposições CAR/CEFIR',
    '11. Portal e-CAC Aplicado ao Imóvel Rural'
  ];

  const CERT_EXTRA_TRACKS_DEFS = [
    {
      key: 'ob1',
      range: [12, 14],
      hours: 6,
      title: 'Consultor Rural Profissional (Prospecção e Precificação)'
    },
    {
      key: 'ob2',
      range: [15, 17],
      hours: 6,
      title: 'Modelos Operacionais, Propostas e Contratos Rurais'
    },
    {
      key: 'ob3',
      range: [18, 20],
      hours: 6,
      title: 'Guia Técnico de 20 Serviços Rurais Cadastrais'
    },
    {
      key: 'upsell',
      range: [21, 23],
      hours: 6,
      title: 'Estruturação de Negócio Rural e Parcerias Recorrentes'
    }
  ];

  const FALLBACK_MAIN_LESSON_IDS = [
    'mod-01-aula-00',
    'mod-01-aula-01',
    'mod-01-aula-02',
    'mod-01-aula-03',
    'mod-02-aula-01',
    'mod-02-aula-02',
    'mod-02-aula-03',
    'mod-03-aula-01',
    'mod-03-aula-02',
    'mod-03-aula-03',
    'mod-04-aula-01',
    'mod-04-aula-02',
    'mod-04-aula-03',
    'mod-05-aula-01',
    'mod-05-aula-02',
    'mod-05-aula-03',
    'mod-06-aula-01',
    'mod-06-aula-02',
    'mod-06-aula-03',
    'mod-07-aula-01',
    'mod-07-aula-02',
    'mod-07-aula-03',
    'mod-08-aula-01',
    'mod-08-aula-02',
    'mod-08-aula-03',
    'mod-09-aula-01',
    'mod-09-aula-02',
    'mod-09-aula-03',
    'mod-10-aula-01',
    'mod-10-aula-02',
    'mod-10-aula-03',
    'mod-11-aula-01',
    'mod-11-aula-02',
    'mod-11-aula-03'
  ];

  function cleanStudentNameForCert(rawName) {
    return sanitizeCleanText(rawName || '')
      .replace(
        /\s+-\s+(Aluno\s+VIP|Aluno\s+Dia\s*\d+\+?|Propriet[aá]rio\s+Rural|Conta\s+Demo.*|Modo\s+Teste.*)$/i,
        ''
      )
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function formatPortugueseDate(isoDateStr) {
    const months = [
      'janeiro',
      'fevereiro',
      'março',
      'abril',
      'maio',
      'junho',
      'julho',
      'agosto',
      'setembro',
      'outubro',
      'novembro',
      'dezembro'
    ];
    const raw = String(isoDateStr || '').slice(0, 10);
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
      const now = new Date();
      const d = String(now.getDate()).padStart(2, '0');
      const m = months[now.getMonth()] || 'janeiro';
      return `${d} de ${m} de ${now.getFullYear()}`;
    }
    const year = Number(match[1]);
    const monthIdx = Math.max(0, Math.min(11, Number(match[2]) - 1));
    const day = String(Number(match[3])).padStart(2, '0');
    return `${day} de ${months[monthIdx]} de ${year}`;
  }

  function computeCertVerificationCode(user) {
    const seed =
      String((user && user.id) || '') +
      '|' +
      String((user && user.email) || 'demo@rural.com').toLowerCase() +
      '|IRD2026';
    let hash = 0x811c9dc5;
    for (let i = 0; i < seed.length; i += 1) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    const hashHex = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');
    return `IRD-2026-${hashHex}`;
  }

  function extractCertTagsFromProgress(progressoArr) {
    let savedMaskedDoc = '';
    let savedIssuedDate = '';
    if (Array.isArray(progressoArr)) {
      progressoArr.forEach((item) => {
        const str = String(item || '');
        if (str.startsWith('__cert_doc:')) {
          const val = str.slice('__cert_doc:'.length).trim();
          if (/^\*{3}\.\d{3}\.\d{3}-\*{2}$/.test(val)) {
            savedMaskedDoc = val;
          }
        } else if (str.startsWith('__cert_issued:')) {
          const val = str.slice('__cert_issued:'.length).trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
            savedIssuedDate = val;
          }
        }
      });
    }
    return { savedMaskedDoc, savedIssuedDate };
  }

  function computeCertificateStatus() {
    const completed = getCompletedLessonsSet();
    const mainMods = state.modules.filter((m) => m.numInt >= 1 && m.numInt <= 11);

    let mainTotal = 0;
    let mainDone = 0;
    if (mainMods.length > 0) {
      mainMods.forEach((mod) => {
        const lessons = Array.isArray(mod.lessons) ? mod.lessons : [];
        lessons.forEach((lesson) => {
          mainTotal += 1;
          if (completed.has(lesson.id)) mainDone += 1;
        });
      });
    }

    if (mainTotal === 0) {
      mainTotal = 34;
      FALLBACK_MAIN_LESSON_IDS.forEach((id) => {
        if (completed.has(id)) mainDone += 1;
      });
    }

    const mainPct = mainTotal > 0 ? Math.min(100, Math.round((mainDone / mainTotal) * 100)) : 0;
    const lessonsOk = mainTotal > 0 && mainDone >= mainTotal;
    const daysSince = Number(state.daysSincePurchase || 0);
    const daysOk = Boolean(
      state.user && (state.user.isAdmin || state.user.liberar_trava_7dias_manual || daysSince >= 7)
    );
    const daysRemaining = daysOk ? 0 : Math.max(1, 7 - daysSince);
    const eligible = lessonsOk && daysOk;

    let hours = 24;
    const extraTracksDone = [];
    CERT_EXTRA_TRACKS_DEFS.forEach((def) => {
      const trackMods = state.modules.filter(
        (m) => m.numInt >= def.range[0] && m.numInt <= def.range[1]
      );
      if (trackMods.length >= 3) {
        let trackLessonTotal = 0;
        let trackLessonDone = 0;
        trackMods.forEach((mod) => {
          (mod.lessons || []).forEach((l) => {
            trackLessonTotal += 1;
            if (completed.has(l.id)) trackLessonDone += 1;
          });
        });
        if (trackLessonTotal > 0 && trackLessonDone >= trackLessonTotal) {
          hours += def.hours;
          extraTracksDone.push(def.title);
        }
      }
    });

    const rawProg = state.user && Array.isArray(state.user.progresso_aulas)
      ? state.user.progresso_aulas
      : [];
    const { savedMaskedDoc, savedIssuedDate } = extractCertTagsFromProgress(rawProg);
    const cleanDefaultName = cleanStudentNameForCert(state.user && state.user.nome);

    const holderName = sanitizeCleanText(
      state.certPreviewName || cleanDefaultName || 'Nome Completo do Aluno'
    )
      .replace(/[<>]/g, '')
      .trim() || 'Nome Completo do Aluno';

    const maskedDoc = state.certDocEdited
      ? state.certPreviewDoc || ''
      : state.certPreviewDoc !== undefined &&
          state.certPreviewDoc !== null &&
          state.certPreviewDoc !== ''
        ? state.certPreviewDoc
        : savedMaskedDoc;

    const issueDateIso = savedIssuedDate || new Date().toISOString().slice(0, 10);
    const issueDateLabel = formatPortugueseDate(issueDateIso);
    const code = computeCertVerificationCode(state.user);

    return {
      mainTotal,
      mainDone,
      mainPct,
      lessonsOk,
      daysSince,
      daysOk,
      daysRemaining,
      eligible,
      hours,
      extraTracksDone,
      cleanDefaultName,
      savedMaskedDoc,
      savedIssuedDate,
      holderName,
      maskedDoc,
      issueDateIso,
      issueDateLabel,
      code
    };
  }

  function formatMaskedCpfInput(rawVal) {
    const trimmed = String(rawVal || '').trim();
    if (!trimmed) {
      return { valid: true, masked: '', shouldReplaceInput: false };
    }
    if (/^\*{3}\.\d{3}\.\d{3}-\*{2}$/.test(trimmed)) {
      return { valid: true, masked: trimmed, shouldReplaceInput: false };
    }
    const digits = trimmed.replace(/\D/g, '');
    if (!trimmed.includes('*') && digits.length === 11) {
      const masked = `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
      return { valid: true, masked, shouldReplaceInput: true };
    }
    return { valid: false, masked: '', shouldReplaceInput: false };
  }

  function handleCertDocInput(inputEl) {
    if (!inputEl) return;
    const parsed = formatMaskedCpfInput(inputEl.value);
    if (parsed.shouldReplaceInput) {
      inputEl.value = parsed.masked;
    }
    state.certDocEdited = true;
    state.certPreviewDoc = parsed.valid ? parsed.masked : '';
    renderCertificateStageOnly();
  }

  function handleCertNamePreview(val) {
    state.certPreviewName = sanitizeCleanText(val || '').replace(/[<>]/g, '');
    renderCertificateStageOnly();
  }

  function setCertificateSide(side) {
    const allowed = ['front', 'back', 'both'];
    state.certSide = allowed.includes(side) ? side : 'front';
    const frontBtn = document.getElementById('cert-side-front-btn');
    const backBtn = document.getElementById('cert-side-back-btn');
    const bothBtn = document.getElementById('cert-side-both-btn');
    if (frontBtn) frontBtn.classList.toggle('active', state.certSide === 'front');
    if (backBtn) backBtn.classList.toggle('active', state.certSide === 'back');
    if (bothBtn) bothBtn.classList.toggle('active', state.certSide === 'both');
    renderCertificateStageOnly();
  }

  function updateCertificateSummaryUi() {
    if (isProprietarioMode()) return;
    const status = computeCertificateStatus();

    const dropPill = document.getElementById('dropdown-cert-pill');
    if (dropPill) {
      dropPill.textContent = status.eligible
        ? 'Liberado'
        : `${status.mainDone}/${status.mainTotal}`;
      dropPill.classList.toggle('is-ready', status.eligible);
    }

    setText(
      'home-cert-title',
      status.eligible
        ? 'Certificado Oficial Liberado para Emissão'
        : 'Certificado Oficial de Conclusão'
    );
    setText(
      'home-cert-desc',
      status.eligible
        ? 'Parabéns! Você concluiu 100% da Trilha Principal e cumpriu o cronograma de liberação. Emita agora seu certificado nominal em PDF A4 Paisagem (Frente e Verso) ou PNG de alta resolução.'
        : 'Conclua as 34 aulas obrigatórias da Trilha Principal (Módulos 01 a 11) após o cronograma de 7 dias para emitir seu certificado nominal em PDF A4 Paisagem (Frente e Verso) e imagem PNG de alta resolução.'
    );
    setText(
      'home-cert-progress-label',
      status.lessonsOk && !status.daysOk
        ? `${status.mainDone} de ${status.mainTotal} aulas concluídas · Libera em ${status.daysRemaining} ${status.daysRemaining === 1 ? 'dia' : 'dias'}`
        : `${status.mainDone} de ${status.mainTotal} aulas obrigatórias concluídas`
    );
    setText('home-cert-progress-pct', `${status.mainPct}%`);
    const homeBar = document.getElementById('home-cert-progress-bar');
    if (homeBar) homeBar.style.width = `${status.mainPct}%`;
    setText(
      'home-cert-cta-label',
      status.eligible ? 'Emitir Certificado Agora' : 'Ver Modelo e Progresso'
    );
  }

  function buildCertificateCornerAccentsSvg() {
    return `
      <g stroke="#8A6D3B" stroke-width="1.3" fill="none" opacity="0.72">
        <path d="M52 72 V52 H72"/>
        <rect x="49" y="49" width="4" height="4" fill="#8A6D3B" stroke="none"/>
        <path d="M1071 72 V52 H1051"/>
        <rect x="1070" y="49" width="4" height="4" fill="#8A6D3B" stroke="none"/>
        <path d="M52 722 V742 H72"/>
        <rect x="49" y="741" width="4" height="4" fill="#8A6D3B" stroke="none"/>
        <path d="M1071 722 V742 H1051"/>
        <rect x="1070" y="741" width="4" height="4" fill="#8A6D3B" stroke="none"/>
      </g>
    `;
  }

  function buildPreviewWatermarkSvg() {
    return `
      <g transform="rotate(-18 561 397)" pointer-events="none">
        <rect x="166" y="363" width="790" height="68" rx="14" fill="rgba(180, 83, 9, 0.10)" stroke="rgba(180, 83, 9, 0.45)" stroke-width="2" stroke-dasharray="8 5"/>
        <text x="561" y="403" fill="rgba(146, 64, 14, 0.72)" font-family="${CERT_FONT}" font-size="16.5" font-weight="800" letter-spacing="0.08em" text-anchor="middle">MODELO DE PRÉ-VISUALIZAÇÃO · CONCLUA A TRILHA PRINCIPAL PARA EMITIR</text>
      </g>
    `;
  }

  function buildCertificateHeaderCrestSvg() {
    return `
      <g aria-hidden="true">
        <rect x="68" y="63" width="42" height="42" rx="10" fill="url(#certFrontCrestGrad)" stroke="#C8AD73" stroke-width="1.2"/>
        <rect x="71.5" y="66.5" width="35" height="35" rx="7" fill="none" stroke="#DFC997" stroke-opacity="0.38" stroke-width="0.8"/>
        <path d="M89 70.5 L100.2 74.8 V84.6 C100.2 91.6 95.4 96.3 89 98.7 C82.6 96.3 77.8 91.6 77.8 84.6 V74.8 Z" fill="rgba(223, 201, 151, 0.10)" stroke="#E5D1A1" stroke-width="1.25" stroke-linejoin="round"/>
        <path d="M89 92.6 V79.6" stroke="#FCFBF7" stroke-width="1.35" stroke-linecap="round"/>
        <path d="M89 87 C84.5 87 82.7 83.8 83.1 80.3 C86.5 80.3 89 82.6 89 87 Z" fill="#FCFBF7"/>
        <path d="M89 85.2 C93.3 85.2 95.1 82.1 94.7 78.7 C91.4 78.7 89 81 89 85.2 Z" fill="#86EFAC"/>
        <path d="M82.6 92.2 Q89 90.2 95.4 92.2" fill="none" stroke="#DFC997" stroke-width="1.1" stroke-linecap="round"/>
      </g>
    `;
  }

  function buildFourPointStarPath(cx, cy, outerR, innerR) {
    const pts = [];
    for (let i = 0; i < 8; i += 1) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / 4 - Math.PI / 2;
      pts.push(
        `${i === 0 ? 'M' : 'L'}${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`
      );
    }
    return `${pts.join(' ')} Z`;
  }

  function buildCertificateMedallionSvg() {
    const cx = 561.5;
    const cy = 574;

    const rosettePts = [];
    const totalSamples = 224;
    const lobes = 28;
    for (let i = 0; i < totalSamples; i += 1) {
      const angle = (i / totalSamples) * Math.PI * 2;
      const r = 42.2 + 1.85 * Math.cos(lobes * angle);
      const px = (cx + Math.cos(angle) * r).toFixed(2);
      const py = (cy + Math.sin(angle) * r).toFixed(2);
      rosettePts.push(`${i === 0 ? 'M' : 'L'}${px} ${py}`);
    }
    const rosettePath = `${rosettePts.join(' ')} Z`;

    const wreathRadius = 54.5;
    const phiStations = [0.84, 1.18, 1.52, 1.86, 2.2, 2.5];
    const leafShape = 'M0 0 C3.4 -3.1, 8.6 -2.8, 12.2 0 C8.6 2.8, 3.4 3.1, 0 0 Z';
    let wreathSvg = '';

    [-1, 1].forEach((side) => {
      const stemPts = [];
      for (let s = 0; s <= 28; s += 1) {
        const phi = 0.44 + (s / 28) * (2.64 - 0.44);
        const sx = (cx + side * Math.sin(phi) * wreathRadius).toFixed(2);
        const sy = (cy + Math.cos(phi) * wreathRadius).toFixed(2);
        stemPts.push(`${s === 0 ? 'M' : 'L'}${sx} ${sy}`);
      }
      wreathSvg += `<path d="${stemPts.join(' ')}" fill="none" stroke="#A6894C" stroke-width="1.15" stroke-linecap="round"/>`;

      phiStations.forEach((phi, idx) => {
        const lx = (cx + side * Math.sin(phi) * wreathRadius).toFixed(2);
        const ly = (cy + Math.cos(phi) * wreathRadius).toFixed(2);
        const tangentDeg = (Math.atan2(-Math.sin(phi), side * Math.cos(phi)) * 180) / Math.PI;
        const scale = (1 - idx * 0.045).toFixed(3);
        const outerDeg = (tangentDeg + side * 31).toFixed(2);
        const innerDeg = (tangentDeg - side * 27).toFixed(2);
        wreathSvg += `<path d="${leafShape}" transform="translate(${lx},${ly}) rotate(${outerDeg}) scale(${scale})" fill="#DEC997" stroke="#9B7E43" stroke-width="0.65"/>`;
        wreathSvg += `<path d="${leafShape}" transform="translate(${lx},${ly}) rotate(${innerDeg}) scale(${(Number(scale) * 0.9).toFixed(3)})" fill="#EAE0C4" stroke="#9B7E43" stroke-width="0.65"/>`;
      });

      const tipPhi = 2.66;
      const tx = (cx + side * Math.sin(tipPhi) * wreathRadius).toFixed(2);
      const ty = (cy + Math.cos(tipPhi) * wreathRadius).toFixed(2);
      const tipDeg = (
        (Math.atan2(-Math.sin(tipPhi), side * Math.cos(tipPhi)) * 180) / Math.PI +
        side * 4
      ).toFixed(2);
      wreathSvg += `<path d="${leafShape}" transform="translate(${tx},${ty}) rotate(${tipDeg}) scale(0.82)" fill="#DEC997" stroke="#9B7E43" stroke-width="0.65"/>`;
    });

    const topCrownStar = buildFourPointStarPath(cx, cy - 53.5, 4.2, 1.45);
    const innerStarCenter = buildFourPointStarPath(cx, 551.8, 2.9, 1.0);
    const innerStarLeft = buildFourPointStarPath(cx - 9.2, 553.8, 2.1, 0.75);
    const innerStarRight = buildFourPointStarPath(cx + 9.2, 553.8, 2.1, 0.75);

    return `
      <g aria-hidden="true">
        <!-- Ramos de Louro Simetricos em Ouro Antigo -->
        ${wreathSvg}
        <path d="${topCrownStar}" fill="#B39556"/>

        <!-- Roseta de Lacre Metalico Champagne-Gold (28 Ondas Suaves) -->
        <path d="${rosettePath}" fill="url(#certFrontGoldFoilGrad)" stroke="#9B7E43" stroke-width="1.15"/>

        <!-- Aneis Concentricos Guilloche -->
        <circle cx="${cx}" cy="${cy}" r="36.8" fill="#FCFBF7" stroke="#0F291A" stroke-width="1.25"/>
        <circle cx="${cx}" cy="${cy}" r="33.6" fill="none" stroke="#B39556" stroke-width="1" stroke-dasharray="1.35 2.25"/>
        <circle cx="${cx}" cy="${cy}" r="29.8" fill="url(#certFrontCoreGrad)" stroke="#9B7E43" stroke-width="0.85"/>

        <!-- Estrelas Superiores e Filetes Laterais -->
        <path d="${innerStarCenter}" fill="#9B7E43"/>
        <path d="${innerStarLeft}" fill="#B39556"/>
        <path d="${innerStarRight}" fill="#B39556"/>

        <line x1="536.2" y1="572.5" x2="545.5" y2="572.5" stroke="#B39556" stroke-width="0.9" stroke-linecap="round"/>
        <line x1="538.8" y1="575.5" x2="545.5" y2="575.5" stroke="#B39556" stroke-width="0.8" stroke-linecap="round"/>
        <line x1="577.5" y1="572.5" x2="586.8" y2="572.5" stroke="#B39556" stroke-width="0.9" stroke-linecap="round"/>
        <line x1="577.5" y1="575.5" x2="584.2" y2="575.5" stroke="#B39556" stroke-width="0.8" stroke-linecap="round"/>

        <!-- Brasao Central Esmeralda e Ouro -->
        <path d="M561.5 558.8 L573.5 563.3 V574 C573.5 581.7 568.3 586.6 561.5 589.2 C554.7 586.6 549.5 581.7 549.5 574 V563.3 Z" fill="url(#certFrontCrestGrad)" stroke="#C8AD73" stroke-width="1.15" stroke-linejoin="round"/>
        <path d="M553.2 565.3 L561.5 562.2 L569.8 565.3" fill="none" stroke="#DFC997" stroke-width="0.75" stroke-linecap="round" opacity="0.75"/>
        <polyline points="556.2,573.8 559.9,577.5 567.3,569.2" fill="none" stroke="#FCFBF7" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Faixa Heráldica Dobrada na Base -->
        <path d="M465 617 H445 L451.5 626 L445 635 H469 V617 Z" fill="#E6DCC3" stroke="#9B7E43" stroke-width="1" stroke-linejoin="round"/>
        <path d="M461 632 L469 635 V632 Z" fill="#8A6D3B"/>
        <path d="M658 617 H678 L671.5 626 L678 635 H654 V617 Z" fill="#E6DCC3" stroke="#9B7E43" stroke-width="1" stroke-linejoin="round"/>
        <path d="M662 632 L654 635 V632 Z" fill="#8A6D3B"/>

        <rect x="461" y="612" width="201" height="20" rx="3" fill="url(#certFrontRibbonGrad)" stroke="#9B7E43" stroke-width="1.1"/>
        <line x1="466" y1="614.5" x2="657" y2="614.5" stroke="#D8C8A3" stroke-width="0.6"/>
        <line x1="466" y1="629.5" x2="657" y2="629.5" stroke="#D8C8A3" stroke-width="0.6"/>
        <text x="${cx}" y="625" fill="#0F291A" font-family="${CERT_FONT}" font-size="8.1" font-weight="800" letter-spacing="0.09em" text-anchor="middle">IMÓVEL RURAL EM DIA · CURSO LIVRE</text>
      </g>
    `;
  }

  function buildCertificateFrontSvg(certData) {
    const rawName = String(certData.holderName || 'Nome Completo do Aluno').trim();
    const safeName = escapeHtml(rawName);
    const safeDoc = certData.maskedDoc ? escapeHtml(certData.maskedDoc) : '';
    const safeCode = escapeHtml(certData.code || 'IRD-2026-00000000');
    const safeHours = escapeHtml(String(certData.hours || 24));
    const safeDate = escapeHtml(certData.issueDateLabel || '');

    const nameLen = rawName.length;
    const nameFontSize = nameLen <= 28 ? 38 : nameLen <= 40 ? 32 : nameLen <= 56 ? 25 : 20;
    const nameFitAttr = nameLen > 62 ? ' textLength="940" lengthAdjust="spacingAndGlyphs"' : '';

    const docNode = safeDoc
      ? `<text x="561.5" y="378" fill="#526056" font-family="${CERT_FONT}" font-size="13" font-weight="600" letter-spacing="0.04em" text-anchor="middle">CPF: ${safeDoc}</text>`
      : '';

    const watermarkNode = certData.eligible ? '' : buildPreviewWatermarkSvg();

    return `<svg viewBox="0 0 1123 794" width="1123" height="794" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Certificado de Conclusão - Frente">
      <defs>
        <clipPath id="certFrontInnerClip">
          <rect x="41" y="41" width="1041" height="712" rx="6"/>
        </clipPath>
        <linearGradient id="certFrontCrestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#184029"/>
          <stop offset="100%" stop-color="#0B2014"/>
        </linearGradient>
        <linearGradient id="certFrontGoldFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FCF8EE"/>
          <stop offset="38%" stop-color="#EADAB4"/>
          <stop offset="72%" stop-color="#D7C08B"/>
          <stop offset="100%" stop-color="#F6EFE0"/>
        </linearGradient>
        <linearGradient id="certFrontCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FCFBF6"/>
          <stop offset="100%" stop-color="#EFE8D4"/>
        </linearGradient>
        <linearGradient id="certFrontRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FDFBF6"/>
          <stop offset="100%" stop-color="#F1E9D4"/>
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1123" height="794" fill="#FCFBF7"/>
      <rect x="1" y="1" width="1121" height="792" fill="none" stroke="#E5E2D9" stroke-width="2"/>

      <g clip-path="url(#certFrontInnerClip)" opacity="0.045" fill="none" stroke="#0F291A" stroke-width="1.35">
        <path d="M20 620 C240 540, 440 670, 720 575 C900 515, 1020 560, 1110 520"/>
        <path d="M20 652 C250 575, 455 700, 735 605 C910 545, 1025 590, 1110 552"/>
        <path d="M20 155 C230 95, 470 205, 760 125 C925 80, 1030 120, 1110 95"/>
        <circle cx="1015" cy="128" r="95"/>
        <circle cx="1015" cy="128" r="135"/>
        <circle cx="108" cy="618" r="88"/>
        <circle cx="108" cy="618" r="126"/>
      </g>

      <rect x="28" y="28" width="1067" height="738" rx="10" fill="none" stroke="#0F291A" stroke-width="3"/>
      <rect x="40" y="40" width="1043" height="714" rx="6" fill="none" stroke="#8A6D3B" stroke-width="1"/>
      ${buildCertificateCornerAccentsSvg()}

      <!-- Barra Institucional Superior -->
      ${buildCertificateHeaderCrestSvg()}

      <text x="122" y="81" fill="#0F291A" font-family="${CERT_FONT}" font-size="12" font-weight="800" letter-spacing="0.14em">FORMAÇÃO IMÓVEL RURAL EM DIA</text>
      <text x="122" y="96" fill="#526056" font-family="${CERT_FONT}" font-size="10.5" font-weight="600" letter-spacing="0.04em">CAPACITAÇÃO PRÁTICA INDEPENDENTE EM DOCUMENTAÇÃO RURAL</text>

      <rect x="765" y="69" width="290" height="30" rx="6" fill="#F4F2EA" stroke="#DFDAC6" stroke-width="1"/>
      <text x="1041" y="88" fill="#526056" font-family="${CERT_FONT}" font-size="11.5" font-weight="700" letter-spacing="0.03em" text-anchor="end">REGISTRO INTERNO: ${safeCode}</text>

      <line x1="68" y1="116" x2="1055" y2="116" stroke="#E5E2D9" stroke-width="1"/>

      <!-- Titulo Principal e Subtitulo Legal -->
      <text x="561.5" y="178" fill="#0F291A" font-family="${CERT_FONT}" font-size="40" font-weight="800" letter-spacing="-0.02em" text-anchor="middle">CERTIFICADO DE CONCLUSÃO</text>

      <rect x="166.5" y="196" width="790" height="28" rx="14" fill="#ECFDF3" stroke="#BBF7D0" stroke-width="1"/>
      <text x="561.5" y="214" fill="#15803D" font-family="${CERT_FONT}" font-size="12.5" font-weight="700" letter-spacing="0.07em" text-anchor="middle">CURSO LIVRE DE CAPACITAÇÃO E ATUALIZAÇÃO PRÁTICA · LEI FEDERAL Nº 9.394/1996 (ART. 42)</text>

      <!-- Texto Introdutorio e Identificacao do Aluno -->
      <text x="561.5" y="282" fill="#4A5550" font-family="${CERT_FONT}" font-size="16" font-weight="500" text-anchor="middle">Certificamos, para os devidos fins de comprovação de estudos livres, que</text>

      <text x="561.5" y="340" fill="#0F291A" font-family="${CERT_FONT}" font-size="${nameFontSize}" font-weight="800" letter-spacing="-0.015em" text-anchor="middle"${nameFitAttr}>${safeName}</text>
      <line x1="251.5" y1="356" x2="871.5" y2="356" stroke="#C8B996" stroke-width="1.3"/>
      <rect x="558.5" y="353" width="6" height="6" transform="rotate(45 561.5 356)" fill="#8A6D3B"/>
      ${docNode}

      <!-- Descricao do Escopo Educacional e Carga Horaria -->
      <text x="561.5" y="414" fill="#2F3B34" font-family="${CERT_FONT}" font-size="15.5" font-weight="500" text-anchor="middle">concluiu integralmente a <tspan font-weight="700" fill="#0F291A">Formação Prática em Organização Documental e Rotinas Cadastrais</tspan></text>
      <text x="561.5" y="440" fill="#2F3B34" font-family="${CERT_FONT}" font-size="15.5" font-weight="500" text-anchor="middle"><tspan font-weight="700" fill="#0F291A">de Imóveis Rurais</tspan> (Matrícula, CCIR/INCRA, ITR/Receita Federal, CNIR, ADA e CAR/SICAR),</text>
      <text x="561.5" y="466" fill="#2F3B34" font-family="${CERT_FONT}" font-size="15.5" font-weight="500" text-anchor="middle">perfazendo carga horária total estimada de <tspan font-weight="800" fill="#15803D">${safeHours} horas</tspan> de estudos teóricos e práticos.</text>

      <!-- Linha de Data, Selo Heráldico e Assinatura -->
      <!-- Coluna Esquerda: Data -->
      <text x="210" y="582" fill="#0F291A" font-family="${CERT_FONT}" font-size="16" font-weight="700" text-anchor="middle">${safeDate}</text>
      <line x1="85" y1="598" x2="335" y2="598" stroke="#BDB7A6" stroke-width="1.2"/>
      <text x="210" y="618" fill="#0F291A" font-family="${CERT_FONT}" font-size="11" font-weight="800" letter-spacing="0.1em" text-anchor="middle">DATA DE CONCLUSÃO</text>
      <text x="210" y="635" fill="#526056" font-family="${CERT_FONT}" font-size="11" font-weight="500" text-anchor="middle">Modalidade Online · Estudo Prático</text>

      <!-- Centro: Medalhao Dourado com Ramos de Louro e Brasao -->
      ${buildCertificateMedallionSvg()}

      <!-- Coluna Direita: Assinatura Monolinha -->
      <path d="M838 584 C848 548, 864 538, 865 568 C866 584, 879 554, 888 564 C894 571, 891 583, 902 577 C916 569, 932 544, 939 566 C944 581, 956 566, 968 571 C978 575, 988 569, 1002 565" fill="none" stroke="#0F291A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M844 589 C888 582, 942 580, 992 585" fill="none" stroke="#8A6D3B" stroke-width="1.1" stroke-linecap="round" opacity="0.75"/>
      <line x1="787" y1="598" x2="1037" y2="598" stroke="#BDB7A6" stroke-width="1.2"/>
      <text x="912" y="618" fill="#0F291A" font-family="${CERT_FONT}" font-size="11" font-weight="800" letter-spacing="0.1em" text-anchor="middle">COORDENAÇÃO PEDAGÓGICA</text>
      <text x="912" y="635" fill="#526056" font-family="${CERT_FONT}" font-size="11" font-weight="500" text-anchor="middle">Plataforma Educacional Imóvel Rural em Dia</text>

      <!-- Rodape Juridico Obrigatorio Dentro da Moldura -->
      <rect x="64" y="682" width="995" height="54" rx="6" fill="#F4F2EA" stroke="#E2DEC9" stroke-width="1"/>
      <text x="561.5" y="704" fill="#4A5550" font-family="${CERT_FONT}" font-size="9.4" font-weight="600" text-anchor="middle">Natureza Jurídica: Curso Livre privado estritamente educacional (Lei Federal nº 9.394/96, art. 42 e Decreto nº 5.154/04), sem vínculo com INCRA, Receita Federal, SICAR, IBAMA, cartórios ou MEC.</text>
      <text x="561.5" y="722" fill="#4A5550" font-family="${CERT_FONT}" font-size="9.1" font-weight="500" text-anchor="middle">Comprova conclusão de estudos livres em rotinas declaratórias; não confere grau acadêmico, habilitação técnica nem substitui registro em conselhos de classe (CREA, CFT, OAB ou CRC) em atos privativos.</text>

      ${watermarkNode}
    </svg>`;
  }

  function buildCertificateBackSvg(certData) {
    const rawName = String(certData.holderName || 'Nome Completo do Aluno').trim();
    const maxBackLen = certData.maskedDoc ? 32 : 44;
    const truncatedName = rawName.length > maxBackLen ? `${rawName.slice(0, maxBackLen - 2)}...` : rawName;
    const safeName = escapeHtml(truncatedName);
    const safeDoc = certData.maskedDoc ? escapeHtml(certData.maskedDoc) : '';
    const safeCode = escapeHtml(certData.code || 'IRD-2026-00000000');
    const safeHours = escapeHtml(String(certData.hours || 24));
    const safeDate = escapeHtml(certData.issueDateLabel || '');

    const mainRowsSvg = CERT_MAIN_MODULES_CURRICULUM.map((item, idx) => {
      const y = 240 + idx * 38;
      return `
        <g>
          <circle cx="90" cy="${y - 4}" r="7" fill="#ECFDF3" stroke="#86EFAC" stroke-width="1"/>
          <polyline points="${86.8},${y - 4} ${89.2},${y - 1.5} ${93.5},${y - 6.5}" fill="none" stroke="#15803D" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          <text x="106" y="${y}" fill="#1E2B23" font-family="${CERT_FONT}" font-size="12.2" font-weight="600">${escapeHtml(item)}</text>
        </g>
      `;
    }).join('');

    const extras = Array.isArray(certData.extraTracksDone) ? certData.extraTracksDone : [];
    let extraSectionSvg = '';
    if (extras.length > 0) {
      extraSectionSvg = extras
        .map((title, idx) => {
          const y = 242 + idx * 30;
          return `
            <g>
              <circle cx="598" cy="${y - 4}" r="7" fill="#ECFDF3" stroke="#86EFAC" stroke-width="1"/>
              <polyline points="594.8,${y - 4} 597.2,${y - 1.5} 601.5,${y - 6.5}" fill="none" stroke="#15803D" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              <text x="614" y="${y}" fill="#1E2B23" font-family="${CERT_FONT}" font-size="11.5" font-weight="600">${escapeHtml(title)}</text>
              <text x="1040" y="${y}" fill="#15803D" font-family="${CERT_FONT}" font-size="11.5" font-weight="800" text-anchor="end">+6h</text>
            </g>
          `;
        })
        .join('');
    } else {
      extraSectionSvg = `
        <rect x="592" y="228" width="449" height="114" rx="6" fill="#F9F8F3" stroke="#E6E2D3" stroke-width="1"/>
        <text x="610" y="258" fill="#0F291A" font-family="${CERT_FONT}" font-size="12.8" font-weight="700">Formação base concluída integralmente (24 horas)</text>
        <text x="610" y="282" fill="#526056" font-family="${CERT_FONT}" font-size="11.2" font-weight="500">Trilha Principal de 11 módulos e 34 aulas práticas cumprida integralmente.</text>
        <text x="610" y="304" fill="#526056" font-family="${CERT_FONT}" font-size="11.2" font-weight="500">Pacotes complementares concluídos posteriormente adicionam +6h cada</text>
        <text x="610" y="324" fill="#526056" font-family="${CERT_FONT}" font-size="11.2" font-weight="500">ao histórico curricular automaticamente.</text>
      `;
    }

    const legalItems = [
      {
        head: '1. Modalidade Curso Livre (Lei Federal nº 9.394/96, art. 42):',
        body: 'Capacitação privada de atualização prática (Decreto nº 5.154/04), livre de autorização MEC.'
      },
      {
        head: '2. Ausência de Vínculo Público ou Governamental:',
        body: 'Plataforma privada independente, sem vínculo com INCRA, RFB, SICAR, IBAMA ou MEC.'
      },
      {
        head: '3. Escopo Administrativo e Declaratório:',
        body: 'Abrange organização documental e rotinas declaratórias em portais públicos abertos.'
      },
      {
        head: '4. Atos Privativos Excluídos (CREA, CFT, OAB e CRC):',
        body: 'Não habilita para SIGEF, plantas/memoriais com ART/TRT, PRADA ou atos jurídicos.'
      },
      {
        head: '5. Autenticidade Vinculada ao Titular e Código Interno:',
        body: `Vinculado ao registro ${safeCode}; vedada adulteração ou uso fora deste escopo.`
      }
    ];

    const legalItemsSvg = legalItems
      .map((item, idx) => {
        const y = 446 + idx * 48;
        return `
          <g>
            <text x="592" y="${y}" fill="#0F291A" font-family="${CERT_FONT}" font-size="10.8" font-weight="800">${escapeHtml(item.head)}</text>
            <text x="592" y="${y + 16}" fill="#4A5550" font-family="${CERT_FONT}" font-size="9.6" font-weight="500">${escapeHtml(item.body)}</text>
          </g>
        `;
      })
      .join('');

    const watermarkNode = certData.eligible ? '' : buildPreviewWatermarkSvg();

    return `<svg viewBox="0 0 1123 794" width="1123" height="794" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Certificado de Conclusão - Verso">
      <rect x="0" y="0" width="1123" height="794" fill="#FCFBF7"/>
      <rect x="1" y="1" width="1121" height="792" fill="none" stroke="#E5E2D9" stroke-width="2"/>
      <rect x="28" y="28" width="1067" height="738" rx="10" fill="none" stroke="#0F291A" stroke-width="3"/>
      <rect x="40" y="40" width="1043" height="714" rx="6" fill="none" stroke="#8A6D3B" stroke-width="1"/>
      ${buildCertificateCornerAccentsSvg()}

      <!-- Cabecalho do Verso -->
      <text x="64" y="76" fill="#15803D" font-family="${CERT_FONT}" font-size="10.5" font-weight="800" letter-spacing="0.12em">HISTÓRICO DE ESTUDOS LIVRES · VERSO DO CERTIFICADO</text>
      <text x="64" y="101" fill="#0F291A" font-family="${CERT_FONT}" font-size="20" font-weight="800" letter-spacing="-0.015em">CONTEÚDO PROGRAMÁTICO CONCLUÍDO E CONFORMIDADE LEGAL</text>

      <rect x="64" y="114" width="995" height="38" rx="6" fill="#F4F2EA" stroke="#E2DEC9" stroke-width="1"/>
      <text x="80" y="138" fill="#0F291A" font-family="${CERT_FONT}" font-size="11.2" font-weight="700">Titular: ${safeName}${safeDoc ? '  ·  CPF: ' + safeDoc : ''}</text>
      <text x="1043" y="138" fill="#526056" font-family="${CERT_FONT}" font-size="11.2" font-weight="700" text-anchor="end">Carga Horária: ${safeHours}h  ·  Data: ${safeDate}  ·  Registro: ${safeCode}</text>

      <!-- Coluna Esquerda: Trilha Principal Obrigatoria -->
      <rect x="64" y="168" width="492" height="524" rx="8" fill="#FFFFFF" stroke="#E2DEC9" stroke-width="1.2"/>
      <text x="84" y="195" fill="#0F291A" font-family="${CERT_FONT}" font-size="12" font-weight="800" letter-spacing="0.05em">TRILHA PRINCIPAL OBRIGATÓRIA (MÓDULOS 01 A 11 · 24H)</text>
      <line x1="64" y1="212" x2="556" y2="212" stroke="#EAE6D7" stroke-width="1"/>
      ${mainRowsSvg}
      <line x1="84" y1="654" x2="536" y2="654" stroke="#EAE6D7" stroke-width="1"/>
      <text x="84" y="675" fill="#526056" font-family="${CERT_FONT}" font-size="11" font-weight="600">34 aulas práticas e checklists operacionais · Carga base: 24 horas</text>

      <!-- Coluna Direita Topo: Formacao Complementar -->
      <rect x="574" y="168" width="485" height="196" rx="8" fill="#FFFFFF" stroke="#E2DEC9" stroke-width="1.2"/>
      <text x="592" y="195" fill="#0F291A" font-family="${CERT_FONT}" font-size="12" font-weight="800" letter-spacing="0.05em">FORMAÇÃO COMPLEMENTAR CONCLUÍDA</text>
      <line x1="574" y1="212" x2="1059" y2="212" stroke="#EAE6D7" stroke-width="1"/>
      ${extraSectionSvg}

      <!-- Coluna Direita Base: Quadro Juridico -->
      <rect x="574" y="380" width="485" height="312" rx="8" fill="#F4F2EA" stroke="#DFDAC6" stroke-width="1.2"/>
      <text x="592" y="407" fill="#0F291A" font-family="${CERT_FONT}" font-size="11.5" font-weight="800" letter-spacing="0.04em">QUADRO DE ENQUADRAMENTO JURÍDICO E LIMITES PROFISSIONAIS</text>
      <line x1="574" y1="422" x2="1059" y2="422" stroke="#DFDAC6" stroke-width="1"/>
      ${legalItemsSvg}

      <!-- Rodape do Verso -->
      <line x1="64" y1="708" x2="1059" y2="708" stroke="#E5E2D9" stroke-width="1"/>
      <text x="64" y="728" fill="#526056" font-family="${CERT_FONT}" font-size="10.5" font-weight="600">Plataforma Educacional Imóvel Rural em Dia · Curso Livre (Lei nº 9.394/96, art. 42)</text>
      <text x="1059" y="728" fill="#526056" font-family="${CERT_FONT}" font-size="10.5" font-weight="700" text-anchor="end">Verso integrante do Certificado ${safeCode} · Página 2 de 2</text>

      ${watermarkNode}
    </svg>`;
  }

  function renderCertificateStageOnly(precomputedStatus) {
    const stageEl = document.getElementById('cert-svg-stage');
    if (!stageEl) return;
    const status = precomputedStatus || computeCertificateStatus();

    const modeTag = document.getElementById('cert-preview-mode-tag');
    if (modeTag) {
      modeTag.textContent = status.eligible
        ? 'Certificado Oficial Liberado'
        : 'Modelo de Pré-visualização';
      modeTag.classList.toggle('is-official', status.eligible);
      modeTag.classList.toggle('is-preview', !status.eligible);
    }

    if (state.certSide === 'back') {
      stageEl.innerHTML = `<div class="cert-paper-frame">${buildCertificateBackSvg(status)}</div>`;
    } else if (state.certSide === 'both') {
      stageEl.innerHTML = `
        <div class="cert-paper-frame">${buildCertificateFrontSvg(status)}</div>
        <div class="cert-paper-frame">${buildCertificateBackSvg(status)}</div>
      `;
    } else {
      stageEl.innerHTML = `<div class="cert-paper-frame">${buildCertificateFrontSvg(status)}</div>`;
    }
  }

  function renderCertificateView(opts = { syncInputs: false }) {
    if (isProprietarioMode()) return;

    if (opts && opts.syncInputs) {
      const rawProg = state.user && Array.isArray(state.user.progresso_aulas)
        ? state.user.progresso_aulas
        : [];
      const { savedMaskedDoc } = extractCertTagsFromProgress(rawProg);
      const defaultName = cleanStudentNameForCert(state.user && state.user.nome);

      if (!state.certPreviewName) {
        state.certPreviewName = defaultName;
      }
      if (!state.certDocEdited) {
        state.certPreviewDoc = savedMaskedDoc || '';
      }

      const nameInput = document.getElementById('cert-holder-name');
      const docInput = document.getElementById('cert-holder-doc');
      if (nameInput) nameInput.value = state.certPreviewName || defaultName || '';
      if (docInput) docInput.value = state.certDocEdited ? state.certPreviewDoc : savedMaskedDoc || '';
    }

    const status = computeCertificateStatus();
    updateCertificateSummaryUi();

    const badgeEl = document.getElementById('cert-elig-badge');
    if (badgeEl) {
      badgeEl.textContent = status.eligible ? 'Liberado para Emissão' : 'Em andamento';
      badgeEl.classList.toggle('is-ready', status.eligible);
      badgeEl.classList.toggle('is-pending', !status.eligible);
    }

    setText('cert-main-pct-label', `${status.mainDone} de ${status.mainTotal} aulas concluídas`);
    setText('cert-main-pct-num', `${status.mainPct}%`);
    const mainBar = document.getElementById('cert-main-bar');
    if (mainBar) mainBar.style.width = `${status.mainPct}%`;

    const reqLessonsItem = document.getElementById('cert-req-lessons-item');
    const reqLessonsDot = document.getElementById('cert-req-lessons-dot');
    if (reqLessonsItem) reqLessonsItem.classList.toggle('done', status.lessonsOk);
    if (reqLessonsDot) {
      reqLessonsDot.innerHTML = status.lessonsOk ? SVG_ICONS.check : SVG_ICONS.clock;
    }
    const missingLessons = Math.max(0, status.mainTotal - status.mainDone);
    setText(
      'cert-req-lessons-text',
      status.lessonsOk
        ? `Concluídas 100% das ${status.mainTotal} aulas obrigatórias da Trilha Principal.`
        : `Concluir 100% das ${status.mainTotal} aulas da Trilha Principal (faltam ${missingLessons} ${missingLessons === 1 ? 'aula' : 'aulas'}).`
    );

    const reqDaysItem = document.getElementById('cert-req-days-item');
    const reqDaysDot = document.getElementById('cert-req-days-dot');
    if (reqDaysItem) reqDaysItem.classList.toggle('done', status.daysOk);
    if (reqDaysDot) {
      reqDaysDot.innerHTML = status.daysOk ? SVG_ICONS.check : SVG_ICONS.clock;
    }
    setText(
      'cert-req-days-text',
      status.daysOk
        ? 'Cronograma integral de liberação de 7 dias cumprido.'
        : `Cumprir o cronograma de 7 dias pós-compra (libera em ${status.daysRemaining} ${status.daysRemaining === 1 ? 'dia' : 'dias'}).`
    );

    const reqExtraDot = document.getElementById('cert-req-extra-dot');
    if (reqExtraDot) reqExtraDot.innerHTML = SVG_ICONS.check;
    setText(
      'cert-req-extra-text',
      status.extraTracksDone.length > 0
        ? `${status.extraTracksDone.length} ${status.extraTracksDone.length === 1 ? 'trilha complementar averbada' : 'trilhas complementares averbadas'} no verso (+${status.extraTracksDone.length * 6}h).`
        : 'Trilhas complementares concluídas entram automaticamente no verso (+6h cada).'
    );

    setText('cert-hours-val', `${status.hours} horas`);
    setText('cert-code-val', status.code);

    const lockHint = document.getElementById('cert-lock-hint');
    if (lockHint) {
      lockHint.classList.toggle('hidden', status.eligible);
      if (!status.eligible) {
        if (!status.lessonsOk && !status.daysOk) {
          lockHint.textContent = `Faltam ${missingLessons} ${missingLessons === 1 ? 'aula obrigatória' : 'aulas obrigatórias'} e ${status.daysRemaining} ${status.daysRemaining === 1 ? 'dia' : 'dias'} do cronograma para liberar a exportação oficial sem marca d'água.`;
        } else if (!status.lessonsOk) {
          lockHint.textContent = `Conclua as ${missingLessons} ${missingLessons === 1 ? 'aula restante' : 'aulas restantes'} da Trilha Principal (Módulos 01 a 11) para liberar a exportação oficial sem marca d'água.`;
        } else {
          lockHint.textContent = `Aulas obrigatórias 100% concluídas! A exportação oficial sem marca d'água abre automaticamente em ${status.daysRemaining} ${status.daysRemaining === 1 ? 'dia' : 'dias'} (8º dia de acesso).`;
        }
      }
    }

    ['btn-cert-pdf', 'btn-cert-png-front', 'btn-cert-png-back'].forEach((btnId) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.setAttribute('aria-disabled', String(!status.eligible));
        btn.style.opacity = status.eligible ? '1' : '0.62';
      }
    });

    const devBox = document.getElementById('cert-dev-box');
    if (devBox) {
      devBox.classList.toggle('hidden', !isDemoEnvironment());
    }
    setText(
      'btn-cert-dev-label',
      status.eligible
        ? 'Reverter Simulação (Voltar ao Progresso Inicial)'
        : 'Simular 100% Concluído (Liberar Agora)'
    );

    const frontBtn = document.getElementById('cert-side-front-btn');
    const backBtn = document.getElementById('cert-side-back-btn');
    const bothBtn = document.getElementById('cert-side-both-btn');
    if (frontBtn) frontBtn.classList.toggle('active', state.certSide === 'front');
    if (backBtn) backBtn.classList.toggle('active', state.certSide === 'back');
    if (bothBtn) bothBtn.classList.toggle('active', state.certSide === 'both');

    renderCertificateStageOnly(status);
  }

  async function saveCertificateProfile(btnEl) {
    const nameEl = document.getElementById('cert-holder-name');
    const docEl = document.getElementById('cert-holder-doc');

    const fullName = sanitizeCleanText(nameEl ? nameEl.value : '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 90);

    if (fullName.length < 4) {
      showToast('Informe seu nome completo com pelo menos 4 caracteres.');
      if (nameEl) nameEl.focus();
      return;
    }

    const rawDoc = docEl ? docEl.value : '';
    const parsedDoc = formatMaskedCpfInput(rawDoc);
    if (!parsedDoc.valid) {
      showToast('Informe os 11 números do CPF para mascaramento automático ou deixe em branco.');
      if (docEl) docEl.focus();
      return;
    }

    if (parsedDoc.shouldReplaceInput && docEl) {
      docEl.value = parsedDoc.masked;
    }

    const status = computeCertificateStatus();
    if (btnEl) btnEl.disabled = true;

    const res = await apiFetch('/api/auth', {
      method: 'PUT',
      body: JSON.stringify({
        action: 'update_certificate_profile',
        fullName,
        maskedDoc: parsedDoc.masked,
        markIssued: status.eligible
      })
    });

    if (btnEl) btnEl.disabled = false;

    if (res.ok && res.data && res.data.user) {
      state.user = res.data.user;
    } else if (state.user) {
      state.user.nome = fullName;
      const nextProg = Array.isArray(state.user.progresso_aulas)
        ? state.user.progresso_aulas.filter((i) => !String(i).startsWith('__cert_doc:'))
        : [];
      if (parsedDoc.masked) nextProg.push(`__cert_doc:${parsedDoc.masked}`);
      if (status.eligible && !nextProg.some((i) => String(i).startsWith('__cert_issued:'))) {
        nextProg.push(`__cert_issued:${new Date().toISOString().slice(0, 10)}`);
      }
      state.user.progresso_aulas = nextProg;
    }

    state.certPreviewName = fullName;
    state.certPreviewDoc = parsedDoc.masked;
    state.certDocEdited = true;

    updateHeaderAndProfile();
    renderCertificateView({ syncInputs: false });
    showToast('Dados salvos no certificado.');
  }

  function ensureCertificateIssuedRecorded(status) {
    if (!status.eligible || status.savedIssuedDate || !state.user) return;
    const todayIso = new Date().toISOString().slice(0, 10);
    const list = Array.isArray(state.user.progresso_aulas)
      ? [...state.user.progresso_aulas]
      : [];
    if (!list.some((item) => String(item).startsWith('__cert_issued:'))) {
      list.push(`__cert_issued:${todayIso}`);
      state.user.progresso_aulas = list;
    }
    apiFetch('/api/auth', {
      method: 'PUT',
      body: JSON.stringify({
        action: 'update_certificate_profile',
        fullName: status.holderName,
        maskedDoc: status.maskedDoc || '',
        markIssued: true
      })
    }).then((res) => {
      if (res && res.ok && res.data && res.data.user) {
        state.user = res.data.user;
      }
    });
  }

  function downloadCertificatePng(side = 'front') {
    let status = computeCertificateStatus();
    if (!status.eligible) {
      showToast(CERT_LOCKED_TOAST);
      return;
    }

    ensureCertificateIssuedRecorded(status);
    status = computeCertificateStatus();

    const targetSide = side === 'back' ? 'back' : 'front';
    const rawSvg =
      targetSide === 'back'
        ? buildCertificateBackSvg(status)
        : buildCertificateFrontSvg(status);

    const hiResSvg = rawSvg.replace(
      'width="1123" height="794"',
      'width="2400" height="1697"'
    );

    const svgBlob = new Blob([hiResSvg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 2400;
      canvas.height = 1697;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        showToast('Não foi possível renderizar a imagem neste navegador.');
        return;
      }
      ctx.fillStyle = '#FCFBF7';
      ctx.fillRect(0, 0, 2400, 1697);
      ctx.drawImage(img, 0, 0, 2400, 1697);
      URL.revokeObjectURL(svgUrl);

      canvas.toBlob(
        (pngBlob) => {
          if (!pngBlob) {
            showToast('Erro ao exportar arquivo PNG.');
            return;
          }
          const pngUrl = URL.createObjectURL(pngBlob);
          const link = document.createElement('a');
          link.href = pngUrl;
          link.setAttribute(
            'download',
            `certificado-imovel-rural-${targetSide}-${status.code.toLowerCase()}.png`
          );
          document.body.appendChild(link);
          link.click();
          link.remove();
          setTimeout(() => URL.revokeObjectURL(pngUrl), 1800);
          showToast(
            targetSide === 'back'
              ? 'Verso do certificado baixado em PNG de alta resolução.'
              : 'Frente do certificado baixada em PNG de alta resolução.'
          );
        },
        'image/png',
        1.0
      );
    };

    img.onerror = function () {
      URL.revokeObjectURL(svgUrl);
      showToast('Erro ao preparar imagem PNG do certificado.');
    };

    img.src = svgUrl;
  }

  function printCertificatePdf() {
    let status = computeCertificateStatus();
    if (!status.eligible) {
      showToast(CERT_LOCKED_TOAST);
      return;
    }

    ensureCertificateIssuedRecorded(status);
    status = computeCertificateStatus();

    const frontSvg = buildCertificateFrontSvg(status);
    const backSvg = buildCertificateBackSvg(status);

    const win = window.open('', '_blank');
    if (!win) {
      showToast('Permita a abertura de nova aba para salvar ou imprimir o PDF A4.');
      return;
    }

    const docTitle = `Certificado Imovel Rural em Dia - ${escapeHtml(status.holderName)} (${escapeHtml(status.code)})`;
    const printHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${docTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    html, body {
      background: #e9e7df;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .print-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1123px;
      margin: 18px auto 12px;
      padding: 12px 18px;
      background: #0F291A;
      color: #FCFBF7;
      border-radius: 12px;
      font-size: 13px;
    }
    .print-toolbar button {
      background: #15803D;
      color: #ffffff;
      border: 0;
      border-radius: 999px;
      padding: 8px 18px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .print-page {
      width: 297mm;
      height: 210mm;
      margin: 0 auto 18px;
      background: #FCFBF7;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14);
    }
    .print-page:last-of-type {
      page-break-after: auto;
      break-after: auto;
    }
    .print-page svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    @media print {
      html, body {
        background: #FCFBF7;
      }
      .print-toolbar {
        display: none !important;
      }
      .print-page {
        margin: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <span>Certificado A4 Paisagem (2 páginas: Frente e Verso) · Selecione "Salvar como PDF" na janela de impressão.</span>
    <button type="button" onclick="window.print()">Imprimir / Salvar PDF</button>
  </div>
  <div class="print-page">${frontSvg}</div>
  <div class="print-page">${backSvg}</div>
  <script>
    (function () {
      var readyPromise = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
      readyPromise.then(function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 350);
      });
    })();
  <\/script>
</body>
</html>`;

    win.document.open();
    win.document.write(printHtml);
    win.document.close();
  }

  async function toggleDemoCertificateReady() {
    if (!isDemoEnvironment()) {
      showToast('Simulação disponível apenas em ambiente local ou administrativo.');
      return;
    }

    const res = await apiFetch('/api/auth', {
      method: 'PUT',
      body: JSON.stringify({ action: 'demo_toggle_certificate_ready' })
    });

    if (res.ok && res.data && res.data.user) {
      state.user = res.data.user;
      if (res.data.daysSincePurchase !== undefined) {
        state.daysSincePurchase = res.data.daysSincePurchase;
      }
      state.modules = mergeModulesCatalog(state.modules);
      updateHeaderAndProfile();
      renderTracks();
      renderCertificateView({ syncInputs: false });
      showToast(
        res.data.simulatedComplete
          ? 'Simulação ativada: Certificado Oficial 100% liberado!'
          : 'Simulação revertida para o progresso inicial.'
      );
      return;
    }

    // Fallback instantaneo client-side caso offline em localhost
    if (!state.user) return;
    const statusBefore = computeCertificateStatus();
    const mainLessonIds = [];
    state.modules
      .filter((m) => m.numInt >= 1 && m.numInt <= 11)
      .forEach((m) => {
        (m.lessons || []).forEach((l) => mainLessonIds.push(l.id));
      });
    const effectiveMainIds =
      mainLessonIds.length > 0 ? mainLessonIds : FALLBACK_MAIN_LESSON_IDS;

    const currentList = Array.isArray(state.user.progresso_aulas)
      ? [...state.user.progresso_aulas]
      : [];

    let simulatedComplete = false;
    if (statusBefore.eligible) {
      const mainSet = new Set(effectiveMainIds);
      state.user.progresso_aulas = currentList.filter(
        (id) => !mainSet.has(id) && !String(id).startsWith('__cert_issued:')
      );
      state.user.liberar_trava_7dias_manual = false;
      if (state.currentSimKey === 'dia1') {
        state.daysSincePurchase = 0;
      }
      simulatedComplete = false;
    } else {
      const merged = new Set(currentList);
      effectiveMainIds.forEach((id) => merged.add(id));
      if (!Array.from(merged).some((id) => String(id).startsWith('__cert_issued:'))) {
        merged.add(`__cert_issued:${new Date().toISOString().slice(0, 10)}`);
      }
      state.user.progresso_aulas = Array.from(merged);
      state.user.liberar_trava_7dias_manual = true;
      state.daysSincePurchase = Math.max(10, Number(state.daysSincePurchase || 0));
      simulatedComplete = true;
    }

    state.modules = mergeModulesCatalog(state.modules);
    updateHeaderAndProfile();
    renderTracks();
    renderCertificateView({ syncInputs: false });
    showToast(
      simulatedComplete
        ? 'Simulação ativada: Certificado Oficial 100% liberado!'
        : 'Simulação revertida para o progresso inicial.'
    );
  }

  /* ========================================================================
     INICIALIZACAO
     ======================================================================== */
  function isDemoEnvironment() {
    const host = (window.location.hostname || '').toLowerCase();
    return (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      Boolean(state.canSimulateDemo) ||
      Boolean(state.user && state.user.isAdmin)
    );
  }

  function syncDemoUiVisibility() {
    const showDemo = isDemoEnvironment();
    const quickSwitchLogin = document.querySelector('.login-quick-switch');
    if (quickSwitchLogin) quickSwitchLogin.classList.toggle('hidden', !showDemo);

    document.querySelectorAll('.btn-modal-test-link').forEach((btn) => {
      btn.classList.toggle('hidden', !showDemo);
    });

    const aiTestVipBtn = document.querySelector('#ai-locked-banner button[onclick*="quickSwitch"]');
    if (aiTestVipBtn) aiTestVipBtn.classList.toggle('hidden', !showDemo);

    const certDevBox = document.getElementById('cert-dev-box');
    if (certDevBox) certDevBox.classList.toggle('hidden', !showDemo);

    document.querySelectorAll('#profile-dropdown .dropdown-section').forEach((sec) => {
      if (sec.textContent.includes('Trocar conta de teste')) {
        sec.classList.toggle('hidden', !showDemo);
        const nextDivider = sec.nextElementSibling;
        if (nextDivider && nextDivider.classList.contains('dropdown-divider')) {
          nextDivider.classList.toggle('hidden', !showDemo);
        }
      }
    });
  }

  async function init() {
    initTheme();
    initAiWelcomeMessage();

    const path = (window.location.pathname || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    const wantsProprietarioUrl =
      path.includes('/proprietario') || search.includes('modo=proprietario');

    if (wantsProprietarioUrl) {
      state.activeToolTab = 'tab-auditoria';
      const loginEyebrow = document.querySelector('.login-eyebrow');
      const loginTitle = document.querySelector('.login-title');
      const loginSub = document.querySelector('.login-subtitle');
      if (loginEyebrow) loginEyebrow.textContent = 'PORTAL DO PROPRIETÁRIO RURAL';
      if (loginTitle) loginTitle.textContent = 'Imóvel Rural em Dia (Entenda)';
      if (loginSub) {
        loginSub.textContent =
          'Digite o mesmo e-mail usado na sua compra para acessar os guias passo a passo da sua propriedade.';
      }
    }

    restoreToolsState();
    recalculatePricing();
    runCrossAudit();
    recalculateGoal();
    recalculateConverter();
    recalculateItr();
    renderCrmSheet();
    applyRoleUiTheme();
    updateHomeKpiStrip();
    syncDemoUiVisibility();

    try {
      localStorage.removeItem('rr_token');
    } catch (_e) {}

    const authRes = await apiFetch('/api/auth');
    if (authRes.ok && authRes.data && authRes.data.authenticated && authRes.data.user) {
      state.user = authRes.data.user;
      state.canSimulateDemo = Boolean(authRes.data.canSimulateDemo);
      state.daysSincePurchase = authRes.data.daysSincePurchase ?? 0;
      state.dripConfig = authRes.data.dripConfig || [];
      state.checkoutUrls = authRes.data.checkoutUrls || {};
      syncDemoUiVisibility();
      document.getElementById('login-view').classList.add('hidden');
      document.getElementById('app-shell').classList.remove('hidden');
      const email = state.user.email;
      const simKey =
        state.user.perfil === 'proprietario' || email === 'proprietario@rural.com'
          ? 'proprietario'
          : email === 'aluno@rural.com'
            ? 'dia1'
            : email === 'aluno8dias@rural.com'
              ? 'dia8'
              : 'vip';
      highlightSimMenu(simKey);
      await loadCatalogAndSession();
      if ((window.location.hash || '').toLowerCase() === '#certificado' && !isProprietarioMode()) {
        navigate('certificate');
      }
    } else if (isDemoEnvironment()) {
      if (wantsProprietarioUrl) {
        await quickSwitch('proprietario@rural.com', 'proprietario');
      } else {
        await quickSwitch('vip@rural.com', 'vip');
        if ((window.location.hash || '').toLowerCase() === '#certificado' && !isProprietarioMode()) {
          navigate('certificate');
        }
      }
    } else {
      showLoginScreen();
    }
  }

  window.RRApp = {
    quickSwitch,
    showLoginScreen,
    togglePasswordVisibility,
    handleLoginSubmit,
    logout,
    toggleTheme,
    toggleProfileMenu,
    navigate,
    continueStudying,
    handleSearch,
    clearSearch,
    scrollCarousel,
    handleModuleCardClick,
    openModule,
    selectLesson,
    copyText,
    downloadCsvFile,
    updateHomeKpiStrip,
    toggleCurrentLessonComplete,
    prevLesson,
    nextLesson,
    openModulePdf,
    switchToolTab,
    syncHectaresInput,
    recalculatePricing,
    exportPricingCsv,
    copyPricingProposal,
    runCrossAudit,
    loadAuditPreset,
    exportAuditCsv,
    copyAuditReport,
    setMonthlyGoal,
    recalculateGoal,
    exportGoalCsv,
    resetGoalDefaults,
    recalculateConverter,
    applyUfModuloPreset,
    exportConverterCsv,
    copyConverterSummary,
    recalculateItr,
    exportItrCsv,
    resetItrDefaults,
    renderCrmSheet,
    addCrmRow,
    updateCrmRowStatus,
    toggleCrmRowPaid,
    deleteCrmRow,
    exportCrmCsv,
    resetCrmDemo,
    closeModals,
    closeModalOnBackdrop,
    simulatePass7DaysNow,
    unlockCurrentModalTrackForTest,
    clearAiChat,
    handleAiKeydown,
    askPresetCase,
    handleAiSubmit,
    copyAiReply,
    openCertificateFromMenu,
    setCertificateSide,
    handleCertNamePreview,
    handleCertDocInput,
    saveCertificateProfile,
    printCertificatePdf,
    downloadCertificatePng,
    toggleDemoCertificateReady
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
