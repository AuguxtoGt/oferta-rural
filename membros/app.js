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
    aiMessages: []
  };

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
        videoCode: dripRow.codigo_video || m.videoCode || localMod.videoCode || '',
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

    // Ajusta visibilidade das planilhas na aba de Ferramentas conforme o perfil
    const calcSheet = document.getElementById('tool-calc-honorarios');
    const goalSheet = document.getElementById('tool-meta-financeira');
    const toolsEyebrow = document.getElementById('tools-eyebrow');
    const toolsTitle = document.getElementById('tools-title');
    const toolsSubtitle = document.getElementById('tools-subtitle');
    const toolsNavPills = document.getElementById('tools-nav-pills');

    if (calcSheet) calcSheet.classList.toggle('hidden', isProp);
    if (goalSheet) goalSheet.classList.toggle('hidden', isProp);
    if (toolsNavPills) toolsNavPills.classList.toggle('hidden', isProp);

    if (toolsEyebrow) {
      toolsEyebrow.textContent = isProp
        ? 'DIAGNÓSTICO DOCUMENTAL DO PROPRIETÁRIO'
        : 'FERRAMENTAS OPERACIONAIS';
    }
    if (toolsTitle) {
      toolsTitle.textContent = isProp
        ? 'Conferência dos 4 Documentos da Sua Terra.'
        : 'Planilhas e Calculadoras de Campo.';
    }
    if (toolsSubtitle) {
      toolsSubtitle.textContent = isProp
        ? 'Digite abaixo o nome, CPF e área que constam na sua Matrícula, no seu CCIR, no seu ITR e no seu CAR para descobrir na hora se há divergência travando o seu imóvel.'
        : 'Simule honorários por hectare, faça a auditoria cruzada dos 4 documentos do imóvel e planeje sua meta mensal.';
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
    let totalLessons = 0;
    let doneCount = 0;

    state.modules.forEach((mod) => {
      if (mod.unlocked && Array.isArray(mod.lessons)) {
        mod.lessons.forEach((lesson) => {
          totalLessons += 1;
          if (completed.has(lesson.id)) doneCount += 1;
        });
      }
    });

    const pct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;
    return { totalLessons, doneCount, pct };
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
    updateAiAccessState();
  }

  /* ========================================================================
     NAVEGACAO ENTRE AS VISÕES (HOME, CLASSROOM, TOOLS, AI)
     ======================================================================== */
  function navigate(viewName) {
    if (viewName === 'ai' && !ENABLE_AI_CONSULTANT) {
      viewName = 'tools';
    }
    state.currentView = viewName;
    const views = ['home', 'classroom', 'tools', 'ai'];
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
    } else if (viewName === 'ai') {
      updateAiAccessState();
      if (state.aiMessages.length === 0) {
        initAiWelcomeMessage();
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
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

          if (mod.unlocked) {
            if (prog.pct === 100) {
              captionHtml = `<span class="book-caption caption-done">${SVG_ICONS.check}<span>${prog.total} aulas · Concluído</span></span>`;
            } else if (prog.done > 0) {
              captionHtml = `<span class="book-caption">${prog.done} de ${prog.total} aulas</span>`;
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

    const code = String(mod.videoCode || '').trim();
    const isDirectVideo =
      code.endsWith('.mp4') ||
      code.endsWith('.webm') ||
      code.startsWith('http') ||
      code.startsWith('/');

    if (isDirectVideo) {
      stage.innerHTML = `
        <div class="apple-video-frame">
          <video controls preload="metadata" src="${escapeHtml(code)}">
            Seu navegador não suporta vídeo HTML5.
          </video>
        </div>
      `;
    } else {
      stage.innerHTML = `
        <div class="video-coming-soon-card">
          <div class="video-coming-left">
            <span class="video-coming-icon">${SVG_ICONS.play}</span>
            <div class="video-coming-text">
              <strong>Vídeo complementar em breve</strong>
              <span>Estude pelo guia visual estruturado, tabelas e modelos copiáveis abaixo.</span>
            </div>
          </div>
          <span class="video-coming-tag">Módulo ${mod.number}</span>
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
          .replace(/^Parte\s+\d+:\s*/i, '')
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
    // 1. Envolve tabelas soltas em .apple-table-wrap
    container.querySelectorAll('table').forEach((tbl) => {
      if (!tbl.parentElement.classList.contains('apple-table-wrap')) {
        const wrap = document.createElement('div');
        wrap.className = 'apple-table-wrap';
        tbl.parentNode.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
      }
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
    const savedChecks = JSON.parse(localStorage.getItem('rr_checklist_items') || '{}');
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
        const store = JSON.parse(localStorage.getItem('rr_checklist_items') || '{}');
        if (nowChecked) {
          store[itemKey] = true;
        } else {
          delete store[itemKey];
        }
        localStorage.setItem('rr_checklist_items', JSON.stringify(store));
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
     ABA "FERRAMENTAS E PLANILHAS" (3 PLANILHAS INTERATIVAS)
     ======================================================================== */
  function syncHectaresInput(val, source) {
    const num = Math.max(1, Number(val) || 1);
    const rangeEl = document.getElementById('calc-hectares-range');
    const numEl = document.getElementById('calc-hectares');
    if (source === 'range' && numEl) numEl.value = String(num);
    if (source === 'number' && rangeEl) rangeEl.value = String(Math.min(1500, num));
    recalculatePricing();
  }

  function recalculatePricing() {
    const haEl = document.getElementById('calc-hectares');
    if (!haEl) return;

    const clientName = (document.getElementById('calc-client-name')?.value || '').trim() || 'Produtor Rural';
    const ha = Math.max(1, Number(haEl.value) || 45);
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

    const badgeEl = document.getElementById('calc-hectares-badge');
    if (badgeEl) badgeEl.textContent = `${ha} ha · ${tierLabel}`;

    let rawSum = 0;
    const selectedNames = [];
    if (hasCcir) {
      rawSum += 320;
      selectedNames.push('Emissão/Atualização de CCIR no INCRA (SNCR/DCR)');
    }
    if (hasItr) {
      rawSum += 420;
      selectedNames.push('Regularização de ITR (DITR), vínculo CIB/CNIR e CND');
    }
    if (hasCar) {
      rawSum += 680;
      selectedNames.push('Inscrição ou Retificação de Cadastro Ambiental Rural (CAR/SICAR)');
    }
    if (hasRet) {
      rawSum += 750;
      selectedNames.push('Organização de Dossiê para Retificação / Pasta Bancária');
    }

    if (rawSum === 0) {
      rawSum = 320;
      selectedNames.push('Diagnóstico Documental Completo do Imóvel Rural');
    }

    const avulso = Math.round((280 * baseFactor * complexity) / 10) * 10;
    const essencial = Math.round((740 * baseFactor * complexity) / 10) * 10;
    const completo = Math.round((rawSum * baseFactor * complexity) / 10) * 10;
    const entrada = Math.round(completo / 2);
    const saldo = completo - entrada;

    document.getElementById('res-val-avulso').textContent = formatBRL(avulso);
    document.getElementById('res-val-essencial').textContent = formatBRL(essencial);
    document.getElementById('res-val-completo').textContent = formatBRL(completo);
    document.getElementById('res-val-entrada').textContent = formatBRL(entrada);
    document.getElementById('res-val-saldo').textContent =
      `50% na abertura (${formatBRL(entrada)}) + ${formatBRL(saldo)} na entrega`;

    const proposalText = [
      `PROPOSTA DE REGULARIZAÇÃO DE IMÓVEL RURAL`,
      `Cliente / Propriedade: ${clientName}`,
      `Área declarada: ${ha} hectares (${tierLabel})`,
      ``,
      `ESCOPO DOS SERVIÇOS TÉCNICOS:`,
      ...selectedNames.map((s, idx) => `${idx + 1}. ${s}`),
      ``,
      `OPÇÕES DE INVESTIMENTO:`,
      `- Opção 1 (Diagnóstico e Demanda Avulsa): ${formatBRL(avulso)}`,
      `- Opção 2 (Pacote Essencial 2 Órgãos): ${formatBRL(essencial)}`,
      `- Opção 3 (Pacote Completo Recomendado): ${formatBRL(completo)}`,
      ``,
      `CONDIÇÃO DE PAGAMENTO (PACOTE COMPLETO):`,
      `Entrada de 50% (${formatBRL(entrada)}) no início dos protocolos + saldo de ${formatBRL(saldo)} na entrega dos certificados e recibos oficiais.`
    ].join('\n');

    const previewEl = document.getElementById('calc-proposal-preview');
    if (previewEl) previewEl.textContent = proposalText;
  }

  function copyPricingProposal(btn) {
    const previewEl = document.getElementById('calc-proposal-preview');
    if (!previewEl) return;
    copyText(previewEl.textContent, btn);
  }

  function normStr(s) {
    return String(s || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function runCrossAudit() {
    const matNome = document.getElementById('aud-mat-nome')?.value || '';
    const matCpf = document.getElementById('aud-mat-cpf')?.value || '';
    const matArea = parseFloat(document.getElementById('aud-mat-area')?.value || '0') || 0;

    if (!document.getElementById('aud-mat-nome')) return;

    const checks = [
      {
        prefix: 'ccir',
        orgao: 'CCIR / INCRA',
        fixTitular: 'Protocolar DCR no SNCR/INCRA para atualizar titularidade (anexar matrícula ou inventário).',
        fixArea: 'Atualizar área via DCR no SNCR para igualar à matrícula.'
      },
      {
        prefix: 'itr',
        orgao: 'ITR / Receita Federal',
        fixTitular: 'Atualizar titular no CAFIR/CNIR via portal e-CAC e ajustar DIAC.',
        fixArea: 'Corrigir área total no CAFIR/CNIR e transmitir DITR retificadora se necessário.'
      },
      {
        prefix: 'car',
        orgao: 'CAR / SICAR',
        fixTitular: 'Acessar Central do Proprietário no SICAR e atualizar titular/possuidor.',
        fixArea: 'Retificar perímetro vetorizado no módulo de cadastro do CAR para alinhar com a matrícula.'
      }
    ];

    let totalIssues = 0;
    const issueDetails = [];

    checks.forEach((item) => {
      const nome = document.getElementById(`aud-${item.prefix}-nome`)?.value || '';
      const cpf = document.getElementById(`aud-${item.prefix}-cpf`)?.value || '';
      const area = parseFloat(document.getElementById(`aud-${item.prefix}-area`)?.value || '0') || 0;

      const sameTitular = normStr(nome) === normStr(matNome) && normStr(cpf) === normStr(matCpf);
      const areaDiff = Math.abs(area - matArea);
      const areaPct = matArea > 0 ? (areaDiff / matArea) * 100 : 0;
      const sameArea = areaPct <= 2.0;

      const statusEl = document.getElementById(`aud-${item.prefix}-status`);
      const actionEl = document.getElementById(`aud-${item.prefix}-action`);

      if (sameTitular && sameArea) {
        if (statusEl) {
          statusEl.className = 'audit-pill audit-ok';
          statusEl.textContent = 'Compatível';
        }
        if (actionEl) {
          actionEl.textContent = 'Dados alinhados com a matrícula. Manter certidão/recibo arquivado.';
        }
      } else {
        totalIssues += 1;
        if (statusEl) {
          statusEl.className = 'audit-pill audit-err';
          statusEl.textContent = 'Divergente';
        }
        const actions = [];
        if (!sameTitular) actions.push(item.fixTitular);
        if (!sameArea) actions.push(`${item.fixArea} (Diferença de ${areaDiff.toFixed(2)} ha)`);
        const combined = actions.join(' ');
        if (actionEl) actionEl.textContent = combined;
        issueDetails.push(`${item.orgao}: ${combined}`);
      }
    });

    const summaryBanner = document.getElementById('audit-summary-banner');
    if (summaryBanner) {
      if (totalIssues === 0) {
        summaryBanner.innerHTML = `
          <strong style="color: var(--status-ok-text);">Diagnóstico: 100% Compatível nos 4 Órgãos.</strong>
          <span style="display:block; margin-top:4px; color: var(--ink-secondary);">Titularidade, CPF/CNPJ e área estão consistentes entre Matrícula, INCRA, Receita Federal e CAR. Imóvel apto para escritura e crédito rural.</span>
        `;
      } else {
        summaryBanner.innerHTML = `
          <strong style="color: var(--status-err-text);">Atenção: ${totalIssues} ${totalIssues === 1 ? 'órgão apresenta' : 'órgãos apresentam'} divergência em relação à Matrícula.</strong>
          <span style="display:block; margin-top:4px; color: var(--ink-secondary);">Ordem recomendada de correção: 1º Conferir Matrícula no Cartório · 2º Atualizar DCR/SNCR no INCRA · 3º Vincular CNIR/CAFIR na Receita Federal · 4º Retificar SICAR/CAR.</span>
        `;
      }
    }
  }

  function loadAuditPreset(mode) {
    if (mode === 'clean') {
      document.getElementById('aud-mat-nome').value = 'José Carlos Oliveira';
      document.getElementById('aud-mat-cpf').value = '142.850.910-00';
      document.getElementById('aud-mat-area').value = '64.50';

      ['ccir', 'itr', 'car'].forEach((p) => {
        document.getElementById(`aud-${p}-nome`).value = 'José Carlos Oliveira';
        document.getElementById(`aud-${p}-cpf`).value = '142.850.910-00';
        document.getElementById(`aud-${p}-area`).value = '64.50';
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
    const matNome = document.getElementById('aud-mat-nome')?.value || '';
    const matArea = document.getElementById('aud-mat-area')?.value || '';
    const ccirStatus = document.getElementById('aud-ccir-status')?.textContent || '';
    const ccirAction = document.getElementById('aud-ccir-action')?.textContent || '';
    const itrStatus = document.getElementById('aud-itr-status')?.textContent || '';
    const itrAction = document.getElementById('aud-itr-action')?.textContent || '';
    const carStatus = document.getElementById('aud-car-status')?.textContent || '';
    const carAction = document.getElementById('aud-car-action')?.textContent || '';

    const text = [
      `LAUDO DE AUDITORIA CRUZADA DE IMÓVEL RURAL`,
      `Titular na Matrícula: ${matNome} | Área Base: ${matArea} ha`,
      ``,
      `1. CCIR / INCRA: [${ccirStatus}] - ${ccirAction}`,
      `2. ITR / Receita Federal: [${itrStatus}] - ${itrAction}`,
      `3. CAR / Ambiental: [${carStatus}] - ${carAction}`
    ].join('\n');

    copyText(text, btn);
  }

  function setMonthlyGoal(amount) {
    const input = document.getElementById('goal-target-input');
    if (input) input.value = String(amount);
    document.querySelectorAll('.goal-preset-pills .chip-option').forEach((btn) => {
      btn.classList.toggle('active', btn.textContent.includes(amount.toLocaleString('pt-BR')));
    });
    recalculateGoal();
  }

  function recalculateGoal() {
    const goal = Math.max(500, Number(document.getElementById('goal-target-input')?.value || 5000));
    const tAvulso = Math.max(50, Number(document.getElementById('goal-ticket-avulso')?.value || 300));
    const tInter = Math.max(100, Number(document.getElementById('goal-ticket-inter')?.value || 950));
    const tPack = Math.max(200, Number(document.getElementById('goal-ticket-pack')?.value || 1850));

    const grid = document.getElementById('goal-results-grid');
    if (!grid) return;

    const qtdAvulso = Math.ceil(goal / tAvulso);
    const qtdInter = Math.ceil(goal / tInter);
    const qtdPack = Math.ceil(goal / tPack);

    const mixPacks = Math.max(1, Math.floor((goal * 0.55) / tPack));
    const remAfterPacks = Math.max(0, goal - mixPacks * tPack);
    const mixInter = Math.max(1, Math.ceil(remAfterPacks / tInter));

    grid.innerHTML = `
      <div class="topic-card">
        <div class="topic-card-top">
          <span class="topic-card-num">A</span>
          <span class="sheet-value-pill">${formatBRL(tAvulso)} / cliente</span>
        </div>
        <h4>Apenas Serviços Rápidos</h4>
        <p>Fechar <strong>${qtdAvulso} serviços no mês</strong> (cerca de ${Math.ceil(qtdAvulso / 4)} por semana) de emissão de CCIR, ITR ou certidão.</p>
      </div>

      <div class="topic-card">
        <div class="topic-card-top">
          <span class="topic-card-num">B</span>
          <span class="sheet-value-pill">${formatBRL(tInter)} / cliente</span>
        </div>
        <h4>Regularizações de 2 Órgãos</h4>
        <p>Fechar <strong>${qtdInter} clientes no mês</strong> (cerca de ${Math.max(1, Math.round(qtdInter / 4))} por semana) atualizando DCR/INCRA + ITR/CNIR.</p>
      </div>

      <div class="topic-card">
        <div class="topic-card-top">
          <span class="topic-card-num">C</span>
          <span class="sheet-value-pill">${formatBRL(tPack)} / cliente</span>
        </div>
        <h4>Apenas Pacotes Completos</h4>
        <p>Fechar <strong>${qtdPack} ${qtdPack === 1 ? 'fazenda/sítio' : 'fazendas/sítios'} no mês</strong> com regularização completa dos 3 órgãos.</p>
      </div>

      <div class="topic-card" style="background-color: var(--primary-soft); border-color: var(--primary-border);">
        <div class="topic-card-top">
          <span class="topic-card-num">MIX</span>
          <span class="sheet-value-pill">Plano Equilibrado</span>
        </div>
        <h4>Meta de ${formatBRL(goal)} / mês</h4>
        <p>Combine <strong>${mixPacks} ${mixPacks === 1 ? 'Pacote Completo' : 'Pacotes Completos'}</strong> + <strong>${mixInter} ${mixInter === 1 ? 'Regularização Intermediária' : 'Regularizações Intermediárias'}</strong> no mês.</p>
      </div>
    `;
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

    const dropdownDemoSection = document.querySelector('#profile-dropdown .dropdown-section');
    if (dropdownDemoSection && dropdownDemoSection.textContent.includes('Trocar conta de teste')) {
      dropdownDemoSection.classList.toggle('hidden', !showDemo);
      const nextDivider = dropdownDemoSection.nextElementSibling;
      if (nextDivider && nextDivider.classList.contains('dropdown-divider')) {
        nextDivider.classList.toggle('hidden', !showDemo);
      }
    }
  }

  async function init() {
    initTheme();
    initAiWelcomeMessage();
    recalculatePricing();
    runCrossAudit();
    recalculateGoal();
    syncDemoUiVisibility();

    const path = (window.location.pathname || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    const wantsProprietarioUrl =
      path.includes('/proprietario') || search.includes('modo=proprietario');

    if (wantsProprietarioUrl) {
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
    } else if (isDemoEnvironment()) {
      if (wantsProprietarioUrl) {
        await quickSwitch('proprietario@rural.com', 'proprietario');
      } else {
        await quickSwitch('vip@rural.com', 'vip');
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
    toggleCurrentLessonComplete,
    prevLesson,
    nextLesson,
    openModulePdf,
    syncHectaresInput,
    recalculatePricing,
    copyPricingProposal,
    runCrossAudit,
    loadAuditPreset,
    copyAuditReport,
    setMonthlyGoal,
    recalculateGoal,
    closeModals,
    closeModalOnBackdrop,
    simulatePass7DaysNow,
    unlockCurrentModalTrackForTest,
    clearAiChat,
    handleAiKeydown,
    askPresetCase,
    handleAiSubmit,
    copyAiReply
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
