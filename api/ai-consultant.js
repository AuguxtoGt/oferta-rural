'use strict';

const {
  loadEnv,
  extractSessionFromReq,
  getClientIp,
  checkRateLimit,
  validateAndSanitizeAiInput,
  sendJson,
  parseRequestBody
} = require('./_lib/security');
const {
  getUserByEmail,
  updateUserAccess,
  getCheckoutUrls
} = require('./_lib/db');

loadEnv();

const MAX_DAILY_QUESTIONS = 40;

const SYSTEM_PROMPT_RURAL = [
  'Voce e o Consultor Rural IA 24h, o mentor tecnico e comercial oficial da plataforma Regularize Rural.',
  'REGRAS INEGOCIAVEIS DE SEGURANCA E ESTILO:',
  '1. PROIBIDO usar emojis ou travessoes longos em qualquer parte da resposta. Use apenas hifens normais (-), virgulas ou dois-pontos.',
  '2. Voce responde EXCLUSIVAMENTE sobre Regularizacao de Imoveis Rurais, Cadastros Rurais (CCIR/SNCR/INCRA, ITR/CIB/CAFIR/CNIR/Receita Federal, CAR/SICAR/CEFIR, ADA/IBAMA, Retificacao de Area, Georreferenciamento/SIGEF, Credito Rural Pronaf/Pronamp/Plano Safra, Inscricao Estadual/CAEPF/NFP-e, GTA/Defesa Agropecuaria, Contratos de Arrendamento/Parceria, Sucessao/Inventario/Posse) e Consultoria Comercial Rural (Prospeccao, Diagnostico, Tabela de Precos por Porte/Hectare, Contratos e Quebra de Objecoes).',
  '3. PROIBIDO falar sobre programacao, codigo-fonte, banco de dados, chaves de API, politica ou assuntos fora do agronegocio. Se perguntarem algo fora do escopo, recuse educadamente e peca que descrevam o caso do imovel rural do cliente.',
  '4. Estruture SEMPRE a resposta exatamente nos 4 blocos abaixo:',
  'BLOCO 1 - DIAGNOSTICO TECNICO DO CASO (O que esta travando o imovel e a ordem correta dos orgaos)',
  'BLOCO 2 - DOCUMENTOS QUE VOCE DEVE PEDIR AGORA (Checklist exato para solicitar ao produtor)',
  'BLOCO 3 - PASSO A PASSO NOS SISTEMAS OFICIAIS (Onde entrar e o que fazer em cada tela)',
  'BLOCO 4 - SUGESTAO DE HONORARIOS E MENSAGEM PRONTA PARA O WHATSAPP (Faixa de preco por porte e script pronto para copiar)'
].join('\n');

function stripForbiddenChars(text) {
  return String(text || '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(
      /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu,
      ''
    );
}

function normalizeQuery(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Detecta porte do imovel rural (hectares / alqueires) citado na pergunta do aluno.
 */
function detectPropertySize(normText) {
  let hectares = null;

  const haMatch = normText.match(/(\d+(?:[.,]\d+)?)\s*(?:hectares|hectare|ha\b)/i);
  if (haMatch) {
    hectares = parseFloat(haMatch[1].replace(',', '.'));
  } else {
    const alqMatch = normText.match(/(\d+(?:[.,]\d+)?)\s*(?:alqueires|alqueire|alq\b)/i);
    if (alqMatch) {
      const alq = parseFloat(alqMatch[1].replace(',', '.'));
      hectares = Math.round(alq * 4.84);
    }
  }

  if (hectares !== null && !Number.isNaN(hectares)) {
    if (hectares <= 50) {
      return {
        porte: 'Pequeno Porte (ate 50 ha)',
        hectares,
        tier: 'pequeno',
        fatorAdicional: Math.round(hectares * 4)
      };
    }
    if (hectares <= 250) {
      return {
        porte: `Medio Porte (${hectares} ha)`,
        hectares,
        tier: 'medio',
        fatorAdicional: Math.round(hectares * 5)
      };
    }
    return {
      porte: `Grande Porte (${hectares} ha)`,
      hectares,
      tier: 'grande',
      fatorAdicional: Math.round(Math.min(hectares * 6, 4500))
    };
  }

  if (normText.includes('grande porte') || normText.includes('fazenda grande')) {
    return { porte: 'Grande Porte (acima de 250 ha)', hectares: 300, tier: 'grande', fatorAdicional: 1500 };
  }
  if (normText.includes('medio porte')) {
    return { porte: 'Medio Porte (50 a 250 ha)', hectares: 120, tier: 'medio', fatorAdicional: 500 };
  }
  return { porte: 'Pequeno a Medio Porte (Referencia Base)', hectares: null, tier: 'padrao', fatorAdicional: 0 };
}

/**
 * Base de Conhecimento Especialista em Regularizacao de Imoveis Rurais (2026).
 */
const KNOWLEDGE_MODULES = [
  {
    id: 'ccir_sncr',
    name: 'CCIR e Atualizacao Cadastral no SNCR / INCRA',
    keywords: ['ccir', 'incra', 'sncr', 'dcr', 'certificado de cadastro', 'codigo do imovel', 'taxa incra', 'gru incra'],
    diagnostico:
      'O imovel apresenta pendencia cadastral ou necessidade de emissao/atualizacao no Sistema Nacional de Cadastro Rural (SNCR/INCRA). Sem o CCIR 2026 quitado e com status Regular, o produtor fica impedido de registrar compra e venda, desmembrar, partilhar heranca em cartorio ou contratar financiamento bancario.',
    documentos: [
      'Matricula atualizada do imovel (ou Certidao de Inteiro Teor emitida ha menos de 30 dias) ou documento de posse justa',
      'RG, CPF e comprovante de endereco do titular (e do conjuge, com Certidao de Casamento, se casado)',
      'CCIR anterior (ou numero do codigo do imovel no INCRA com 13 digitos)',
      'Acesso a conta Gov.br do proprietario (nivel Prata ou Ouro) ou Procuracao assinada digitalmente pelo Gov.br'
    ],
    passos: [
      'Acesse o portal oficial do SNCR/INCRA (sncr.serpro.gov.br) ou o sistema DCR (Declaracao para Cadastro de Imoveis Rurais) entrando com a conta Gov.br.',
      'Caso os dados de titularidade, area ou exploracao estejam desatualizados, preencha uma nova DCR informando as abas: Estrutura (area total e matricula), Uso (exploracao agricola/pecuaria/reserva) e Pessoas (titular e conjuge).',
      'Se a DCR exigir comprovacao documental (ex.: troca de proprietario ou alteracao de area), anexe o PDF legivel da matricula atualizada e acompanhe o protocolo na Sala da Cidadania Digital do INCRA.',
      'Emita o CCIR no portal de emissao, gere a GRU da Taxa de Servico Cadastral e oriente o pagamento exclusivo via Pix ou Banco do Brasil. Apos a compensacao, baixe o CCIR com status Quitado.'
    ],
    preco: { pequeno: [250, 450], medio: [450, 850], grande: [850, 1600] },
    resumoServico: 'Emissao e Atualizacao Cadastral do CCIR no SNCR/INCRA'
  },
  {
    id: 'itr_cib_cnir',
    name: 'ITR, CIB (antigo NIRF), Vinculacao CNIR e CND na Receita Federal',
    keywords: ['itr', 'cib', 'nirf', 'cafir', 'cnir', 'ditr', 'receita federal', 'cnd', 'malha', 'vtn', 'diac', 'diat', 'ecac', 'e-cac', 'imposto territorial'],
    diagnostico:
      'Existe pendencia fiscal no Imposto sobre a Propriedade Territorial Rural (ITR), no Cadastro Imobiliario Brasileiro (CIB/CAFIR) ou falta de vinculacao obrigatoria no CNIR (Cadastro Nacional de Imoveis Rurais). Pela regra vigente, imoveis sem vinculacao entre o codigo INCRA e o CIB na plataforma CNIR sofrem restricao cadastral e bloqueio na Certidao Negativa de Debitos (CND).',
    documentos: [
      'Numero do CIB (antigo NIRF de 8 digitos) e codigo do imovel no INCRA (13 digitos)',
      'Recibos e declaracoes do ITR (DITR) dos ultimos 5 anos',
      'Recibo de inscricao no CAR (para abater areas isentas de APP e Reserva Legal) e Ato Declaratorio Ambiental (ADA/IBAMA), se houver',
      'Laudo ou tabela municipal oficial de VTN (Valor da Terra Nua) do ano-calendario correspondente',
      'Procuracao Eletronica no Portal e-CAC ou acesso Gov.br Prata/Ouro do titular'
    ],
    passos: [
      'Entre no Portal e-CAC da Receita Federal (cav.receita.fazenda.gov.br) e consulte a situacao fiscal do CIB (antigo NIRF) em Cadastros -> CAFIR/CIB e Certidoes.',
      'Acesse o portal CNIR (cnir.serpro.gov.br) com o login Gov.br e realize o pareamento (vinculacao) entre o codigo do imovel no INCRA e o numero do CIB da Receita Federal.',
      'Caso existam declaracoes DITR em atraso ou retificadoras, baixe o Programa Gerador da Declaracao (PGD ITR) ou utilize o servico Meu Imposto de Renda / ITR Online, preenchendo corretamente a ficha DIAC (dados cadastrais) e DIAT (areas tributaveis, abatendo APP e Reserva Legal respaldadas por CAR/ADA).',
      'Emita o DARF das cotas ou diferencas apuradas e, apos compensacao bancaria (2 a 5 dias uteis), emita a Certidao Negativa de Debitos de Imovel Rural (CND) na Receita Federal.'
    ],
    preco: { pequeno: [300, 600], medio: [600, 1200], grande: [1200, 2500] },
    resumoServico: 'Regularizacao de ITR, Vinculacao CNIR/CIB e Emissao de CND Rural'
  },
  {
    id: 'car_sicar_sobreposicao',
    name: 'CAR, SICAR Estadual, CEFIR e Resolucao de Sobreposicao Ambiental',
    keywords: ['car', 'sicar', 'cefir', 'sobreposicao', 'reserva legal', 'app', 'ambiental', 'poligono', 'mapa', 'pendente', 'cancelado', 'suspenso', 'ada', 'ibama'],
    diagnostico:
      'O Cadastro Ambiental Rural (CAR/SICAR ou CEFIR na Bahia) encontra-se desatualizado, com status Pendente/Suspenso ou apresentando conflito geometrico (sobreposicao de perimetro com vizinho, unidade de conservacao ou assentamento). Sem o recibo do CAR Ativo/Analisado, o banco bloqueia imediatamente qualquer operacao de credito rural.',
    documentos: [
      'Recibo de Inscricao no CAR atual e arquivo digital do projeto (.car ou shapefile/KML), se disponivel',
      'Matricula atualizada ou documento de posse com descricao dos confrontantes',
      'Coordenadas de vertice, planta topografica ou croqui georreferenciado da propriedade',
      'Notificacao ou parecer tecnico emitido pelo orgao ambiental estadual na Central do Proprietario/Possuidor'
    ],
    passos: [
      'Acesse a Central do Proprietario/Possuidor no portal do SICAR Nacional (car.gov.br) ou no sistema estadual especifico (ex.: CEFIR/SEIA na Bahia, SIMLAM no MT/MS, SIGAM/SICAR-SP).',
      'Baixe o demonstrativo da situacao do CAR e identifique a causa exata da pendencia: se e sobreposicao com imovel vizinho, falta de Reserva Legal minima ou divergencia com a area documental.',
      'Quando o erro for no desenho do proprio cliente (vetorizacao antiga por imagem de satelite deslocada), abra o modulo de Retificacao do CAR, ajuste os vertices do perimetro da propriedade, recalcule as camadas de Uso Consolidado, APP e Reserva Legal, e transmita o arquivo retificado.',
      'Se a invasao grafica vier do cadastro do vizinho sobre a terra real do seu cliente, gere o Relatorio de Sobreposicao, envie a Notificacao Amigavel Extrajudicial ao confrontante para que ele retifique o poligono dele ou protocole a Defesa Tecnica com a matricula/planta na Central do Proprietario.'
    ],
    preco: { pequeno: [450, 900], medio: [900, 1800], grande: [1800, 3800] },
    resumoServico: 'Retificacao Tecnica de CAR/SICAR e Resolucao de Sobreposicao'
  },
  {
    id: 'retificacao_divergencia_geo',
    name: 'Divergencia de Area, Retificacao Administrativa e Georreferenciamento (SIGEF)',
    keywords: ['divergencia', 'diferenca de area', 'retificacao', 'matricula', 'cartorio', 'georreferenciamento', 'sigef', 'topografo', 'medida', 'area maior', 'area menor'],
    diagnostico:
      'Existe divergencia entre a area registrada na Matricula do Cartorio e as areas declaradas no CCIR/INCRA, no CIB/ITR e no CAR. A regra de ouro da regularizacao e alinhar todos os cadastros pela realidade fisica e juridica: quando a matricula esta certa e os cadastros administrativos erraram na digitacao, corrige-se via requerimento administrativo; quando a matricula antiga esta errada em relacao ao perimetro real medido em campo, aplica-se a retificacao de registro ou certificacao SIGEF.',
    documentos: [
      'Certidao de Inteiro Teor da Matricula atualizada (Cartorio de Registro de Imoveis)',
      'CCIR atual, Espelho do CIB/ITR e Recibo do CAR para montar o Quadro de Auditoria Cruzada',
      'Planta e Memorial Descritivo assinados por responsavel tecnico (com ART/TRT), caso haja alteracao fisica de perimetro no cartorio',
      'Requerimentos Administrativos de Retificacao de Area (Modelos do Modulo 05)'
    ],
    passos: [
      'Monte o Quadro de Auditoria Cruzada comparando lado a lado: Area da Matricula x Area do CCIR x Area do ITR x Area do CAR.',
      'Cenario A (Matricula correta e erro apenas no INCRA/Receita): Protocole a DCR de atualizacao no SNCR anexando a matricula atualizada; em seguida, atualize a area no CIB/ITR e sincronize no CNIR.',
      'Cenario B (Matricula antiga com area incorreta ou descricao precaria): Verifique se a diferenca exige Retificacao Administrativa de Matricula no Cartorio (Art. 213 da Lei 6.015/73) e se o imovel exige certificacao no SIGEF/INCRA.',
      'Caso precise de medicao em campo/SIGEF, atue como gestor da pasta documental e acione um agrimensor/topografo parceiro, cobrando seus honorarios pela coordenacao documental e atualizacao posterior do CCIR, ITR e CAR.'
    ],
    preco: { pequeno: [600, 1200], medio: [1200, 2400], grande: [2400, 4800] },
    resumoServico: 'Auditoria Cruzada e Retificacao de Divergencia de Area (Cartorio / INCRA / Receita / CAR)'
  },
  {
    id: 'heranca_espolio_posse',
    name: 'Imovel de Heranca (Espolio), Inventario ou Posse / Contrato de Gaveta',
    keywords: ['heranca', 'espolio', 'inventario', 'falecido', 'morreu', 'herdeiro', 'posse', 'posseiro', 'contrato de gaveta', 'sem escritura', 'sem matricula', 'usucapiao'],
    diagnostico:
      'O imovel encontra-se em situacao de Espolio (proprietario falecido com ou sem inventario concluido) ou Posse a Justo Titulo (contrato particular de compra e venda / posse mansa sem matricula definitiva). Mesmo sem escritura definitiva ou antes do fim do inventario, a legislacao permite e exige manter o CCIR, o ITR e o CAR regulares em nome do Espolio ou do Possuidor.',
    documentos: [
      'Para Espolio: Certidao de Obito do titular, Termo de Inventariante (ou documentos de todos os herdeiros) e matricula original em nome do falecido',
      'Para Posse: Contrato Particular de Compra e Venda (cessao de direitos possessorios), recibos de quitacao, contas de energia rural ou declaracao de posse',
      'CPF e RG do inventariante ou do possuidor atual',
      'Historico de CCIR, ITR e CAR anteriores da gleba'
    ],
    passos: [
      'No caso de Espolio antes da partilha: atualize a condicao da pessoa no SNCR/INCRA e no CIB/ITR vinculando o CPF do Inventariante como administrador provisorio do espolio, permitindo emitir CCIR e CND para destravar o proprio inventario.',
      'No caso de Inventario ja concluido (Formal de Partilha ou Escritura Publica de Inventario): leve o formal a registro na Matricula do Cartorio e, com a matricula averbada, transfira a titularidade definitiva no SNCR, no CIB e no CAR.',
      'No caso de Posse sem matricula: cadastre o imovel no SNCR/INCRA na modalidade Posse a Justo Titulo ou Posse por Simples Ocupacao, inscreva o CIB na Receita Federal e o CAR como Possuidor, formando a Pasta Base que servira inclusive para futura Usucapiao ou Regularizacao Fundiaria.',
      'Se o cliente desejar converter a posse em matricula definitiva, estruture a Pasta Pre-Inventario/Usucapiao (Servico 13 da Trilha 4) em parceria com advogado.'
    ],
    preco: { pequeno: [650, 1300], medio: [1300, 2500], grande: [2500, 4500] },
    resumoServico: 'Regularizacao Cadastral de Espolio / Heranca ou Posse Rural'
  },
  {
    id: 'credito_rural_banco',
    name: 'Dossie Pre-Credito Rural (Pronaf, Pronamp e Plano Safra)',
    keywords: ['credito rural', 'pronaf', 'pronamp', 'plano safra', 'financiamento', 'banco', 'custeio', 'investimento', 'banco do brasil', 'sicoob', 'sicredi', 'caixa', 'caf'],
    diagnostico:
      'O produtor precisa aprovar financiamento bancario (Custeio ou Investimento no Plano Safra / Pronaf / Pronamp), mas os bancos exigem a Pasta Documental 100% limpa e sincronizada. Qualquer divergencia entre Matricula, CCIR, ITR/CND e CAR trava a analise juridica da agencia.',
    documentos: [
      'Matricula atualizada (validade maxima de 30 dias exigida pelo banco) ou Contrato de Arrendamento/Parceria vigente',
      'CCIR 2026 com status Quitado',
      'Recibo do CAR com status Ativo (sem pendencias impeditivas) + CND do ITR válida',
      'Certidoes pessoais do produtor (CND Federal PF, Regularidade do CPF e consulta de embargos IBAMA)',
      'CAF (Cadastro Nacional da Agricultura Familiar) ativo, caso a linha seja Pronaf'
    ],
    passos: [
      'Execute o Check-up dos 5 Pilares do Credito Rural: 1) Matricula ou Arrendamento valido; 2) CCIR 2026 Quitado; 3) CIB vinculado ao INCRA no CNIR e CND do ITR emitida; 4) CAR Ativo sem sobreposicao bloqueante; 5) Certidoes negativas pessoais e ambientais (IBAMA).',
      'Corrija imediatamente qualquer divergencia de titularidade ou area antes que o gerente ou projetista submeta a proposta ao comite de credito.',
      'Monte o Dossie Pre-Credito Rural organizado em PDF unico com Folha de Rosto Tecnica (Modelo do OB2), pronto para o produtor entregar na agencia ou ao engenheiro projetista.'
    ],
    preco: { pequeno: [500, 950], medio: [950, 1900], grande: [1900, 3500] },
    resumoServico: 'Montagem de Dossie Completo Pre-Credito Rural (Pronaf / Pronamp / Plano Safra)'
  },
  {
    id: 'ie_nfpe_gta',
    name: 'Inscricao Estadual de Produtor, Nota Fiscal Eletronica (NFP-e) e GTA',
    keywords: ['inscricao estadual', 'caepf', 'nota fiscal', 'nfp-e', 'nfpe', 'sefaz', 'gta', 'rebanho', 'defesa agropecuaria', 'bloco de produtor', 'vender gado', 'vender safra'],
    diagnostico:
      'O produtor precisa comercializar sua producao com seguranca fiscal (emitir Nota Fiscal Eletronica de Produtor Rural - NFP-e e Guia de Transito Animal - GTA), o que exige Inscricao Estadual (IE) ativa na SEFAZ, CAEPF na Receita Federal e cadastro atualizado na Defesa Agropecuaria Estadual.',
    documentos: [
      'CCIR Quitado, CIB/ITR regular e Recibo do CAR do imovel onde ocorre a exploracao',
      'Matricula atualizada ou Contrato de Arrendamento/Comodato registrado/assinado',
      'RG, CPF, comprovante de residencia e acesso Gov.br do produtor',
      'Inventario de rebanho por faixa etaria e comprovantes de vacinacao/declaracao semestral (para pecuaria/GTA)'
    ],
    passos: [
      'No Portal e-CAC da Receita Federal, cadastre ou atualize o CAEPF (Cadastro de Atividade Economica da Pessoa Fisica) vinculado ao CPF do produtor e ao endereco da propriedade.',
      'No portal da SEFAZ Estadual (ou Redesim/Junta Comercial conforme a UF), solicite a abertura ou reativacao da Inscricao Estadual de Produtor Rural anexando o CCIR, a matricula/arrendamento e o CAR.',
      'Habilite o emissor de Nota Fiscal Eletronica (NFP-e) da SEFAZ Estadual (ou aplicativo oficial) e configure os produtos (ex.: bovinos, soja, milho, leite, cafe) com os respectivos CFOPs de saida.',
      'Se houver pecuaria, acesse o sistema estadual de Defesa Agropecuaria (ex.: GEDAVE-SP, SIDAGO-GO, INDEA-MT, IAGRO-MS, ADAB-BA, IMA-MG), atualize a declaracao de rebanho e habilite a emissao de GTA.'
    ],
    preco: { pequeno: [350, 650], medio: [650, 1200], grande: [1200, 2200] },
    resumoServico: 'Abertura/Regularizacao de Inscricao Estadual, CAEPF, NFP-e e Cadastro GTA'
  },
  {
    id: 'contratos_compra_venda',
    name: 'Contratos Agrarios (Arrendamento e Parceria) e Auditoria de Compra e Venda',
    keywords: ['arrendamento', 'parceria', 'comodato', 'contrato rural', 'alugar terra', 'compra e venda', 'due diligence', 'comprar sitio', 'comprar fazenda'],
    diagnostico:
      'Operacoes de exploracao da terra por terceiros (Arrendamento ou Parceria Rural) ou negociacoes de Compra e Venda exigem blindagem contratual segundo o Estatuto da Terra (Lei 4.504/64 e Decreto 59.566/66) e auditoria previa de passivos fiscais e ambientais.',
    documentos: [
      'Dados completos (RG, CPF, estado civil e endereco) do proprietario (arrendador/parceiro-outorgante) e do produtor (arrendatario/parceiro-outorgado)',
      'Matricula, CCIR, CIB/ITR e Recibo do CAR do imovel objeto do contrato',
      'Definicao clara da area cedida (em hectares), atividade permitida, prazo minimo legal (minimo de 3 anos para lavoura temporaria/pecuaria de pequeno porte, 5 anos para lavoura permanente/pecuaria de grande porte) e forma de pagamento'
    ],
    passos: [
      'Defina com o cliente a modalidade tributaria correta: no Arrendamento ha valor fixo e liquido (tributado como aluguel de ate 27,5% no IRPF do proprietario); na Parceria Rural ha partilha de frutos e riscos (tributada como atividade rural, muito mais vantajosa fiscalmente quando aplicavel).',
      'Preencha a minuta estruturada (Modulo 17 - OB2) respeitando a proibicao legal de fixar preco em quantidade fixa de produto no arrendamento (o preco deve ser fixado em moeda corrente, podendo a liquidacao ocorrer em produto pelo preco de mercado).',
      'Colha a assinatura das partes e de 2 testemunhas (ou assinatura eletronica Gov.br) para que o contrato seja aceito pela SEFAZ (abertura de IE), pelo INCRA e pelos bancos no Credito Rural.'
    ],
    preco: { pequeno: [350, 600], medio: [600, 1100], grande: [1100, 2200] },
    resumoServico: 'Elaboracao de Contrato Agrario (Arrendamento / Parceria) e Auditoria Documental'
  },
  {
    id: 'comercial_precificacao_objecoes',
    name: 'Estrategia Comercial, Precificacao de Pacotes e Quebra de Objecoes',
    keywords: ['preco', 'quanto cobrar', 'valor', 'honorarios', 'orcamento', 'pacote', 'caro', 'objecao', 'contador', 'sindicato', 'cliente', 'prospectar', 'fechar'],
    diagnostico:
      'Para fechar servicos com margem alta e seguranca, nunca passe um preco solto no WhatsApp antes de apontar o diagnostico. A estrategia que mais converte no agro e oferecer o Check-up Documental e apresentar o orcamento em 3 opcoes (Regularizacao Pontual, Pacote Imovel 100% em Dia e Plano de Manutencao Anual), separando sempre seus honorarios das taxas oficiais do governo (GRU/DARF).',
    documentos: [
      'CPF do produtor e foto/PDF do ultimo CCIR, ITR, CAR ou Matricula para fazer a triagem rapida de 10 minutos',
      'Ficha de Triagem e Quadro de Auditoria Cruzada (Modulo 15 - OB2)',
      'Minuta de Proposta Comercial em 3 Opcoes + Ordem de Servico 50/50 (Modulo 16 - OB2)'
    ],
    passos: [
      'Aplique a Regra de Ouro da Precificacao: some o Valor Base dos servicos necessarios + Adicional de Porte por Hectare (R$ 3 a R$ 6 por hectare acima de 50 ha) + Grau de Complexidade (ex.: espolio ou sobreposicao).',
      'Ancore o valor mostrando o custo da inacao: uma unica multa de ITR atrasado, bloqueio de CND, perda de prazo de financiamento do Plano Safra ou viagem perdida ate a cidade custa de 5 a 20 vezes mais do que os seus honorarios.',
      'Quando o cliente disser que o contador ou sindicato ja faz, responda com elegancia tecnica: explique que o contador cuida da contabilidade tributaria geral, enquanto voce faz a gestao integrada dos 4 orgaos territoriais (Cartorio + INCRA/SNCR + CNIR/CIB + SICAR/Ambiental), onde um erro de area em um trava todos os outros.',
      'Trabalhe sempre com a Regra 50/50: 50% de entrada na aprovacao da Ordem de Servico para iniciar os protocolos e 50% na entrega da Pasta Digital Regularizada.'
    ],
    preco: { pequeno: [450, 950], medio: [950, 1950], grande: [1950, 3900] },
    resumoServico: 'Pacote Completo Imovel Rural 100% em Dia (CCIR + ITR/CNIR + CAR)'
  }
];

function buildNativeConsultantResponse(cleanQuestion) {
  const norm = normalizeQuery(cleanQuestion);
  const sizeInfo = detectPropertySize(norm);

  const matchedModules = [];
  for (const mod of KNOWLEDGE_MODULES) {
    for (const kw of mod.keywords) {
      if (norm.includes(kw)) {
        matchedModules.push(mod);
        break;
      }
    }
  }

  // Se nao bateu em palavra especifica, entrega o diagnostico completo dos 3 Pilares (CCIR + ITR/CNIR + CAR) + Precificacao
  if (matchedModules.length === 0) {
    matchedModules.push(
      KNOWLEDGE_MODULES[0],
      KNOWLEDGE_MODULES[1],
      KNOWLEDGE_MODULES[2]
    );
  }

  // 1. Diagnostico Tecnico consolidado + Ordem oficial dos orgaos
  const diagnosticoParagraphs = matchedModules.map(
    (m, i) => `${i + 1}. **${m.name}:** ${m.diagnostico}`
  );
  diagnosticoParagraphs.push(
    '**Ordem Oficial de Execucao (Regra de Ouro):** Sempre confira primeiro a base juridica (**1o Cartorio/Matricula ou Contrato de Posse**), depois atualize o cadastro territorial (**2o SNCR/INCRA - CCIR**), em seguida sincronize o cadastro fiscal (**3o Receita Federal - CIB, CNIR e DITR/CND**) e feche com a validacao ambiental (**4o SICAR/CAR e Orgao Estadual**).'
  );

  // 2. Checklist de Documentos sem duplicatas
  const docsSet = new Set();
  for (const m of matchedModules) {
    for (const d of m.documentos) {
      docsSet.add(d);
    }
  }
  const documentosList = Array.from(docsSet);

  // 3. Passo a Passo nos Sistemas Oficiais
  const passosList = [];
  for (const m of matchedModules) {
    for (const p of m.passos) {
      passosList.push(`[${m.name}] ${p}`);
    }
  }

  // 4. Calculo inteligente de Honorarios Sugeridos + Script WhatsApp
  const tierKey =
    sizeInfo.tier === 'grande'
      ? 'grande'
      : sizeInfo.tier === 'medio'
        ? 'medio'
        : 'pequeno';

  let minTotal = 0;
  let maxTotal = 0;
  for (const m of matchedModules) {
    const [pMin, pMax] = m.preco[tierKey] || m.preco.pequeno;
    minTotal += pMin;
    maxTotal += pMax;
  }

  // Se combinou multiplos servicos, aplica desconto de combo (pacote fechado) de ~20% para ficar competitivo
  if (matchedModules.length > 1) {
    minTotal = Math.round((minTotal * 0.8) / 50) * 50;
    maxTotal = Math.round((maxTotal * 0.85) / 50) * 50;
  }

  const servicosNomes = matchedModules.map((m) => m.resumoServico).join(' + ');
  const recorrenciaAnualMin = tierKey === 'grande' ? 1200 : tierKey === 'medio' ? 750 : 450;
  const recorrenciaAnualMax = tierKey === 'grande' ? 2400 : tierKey === 'medio' ? 1400 : 800;

  const honorariosTexto = [
    `- **Porte Identificado para o Caso:** ${sizeInfo.porte}`,
    `- **Escopo Recomendado:** ${servicosNomes}`,
    `- **Faixa de Honorarios Sugerida (Pacote Fechado):** R$ ${minTotal.toLocaleString('pt-BR')},00 a R$ ${maxTotal.toLocaleString('pt-BR')},00 (recebendo 50% de entrada na assinatura da Ordem de Servico e 50% na entrega dos certificados emitidos).`,
    `- **Observacao Importante:** Deixe claro na proposta que taxas governamentais (GRU do INCRA, DARF de ITR ou emolumentos de cartorio) sao pagas a parte diretamente em nome do produtor.`,
    `- **Sugestao de Recorrencia Anual (Pos-Venda):** Ofereca o acompanhamento anual (renovacao de CCIR, entrega de DITR, monitoramento de e-CAC e CAR) por R$ ${recorrenciaAnualMin},00 a R$ ${recorrenciaAnualMax},00/ano.`
  ].join('\n');

  const scriptWhatsapp = [
    'Ola, [Nome do Produtor], tudo bem? Finalizei a analise tecnica preliminar da documentacao do seu imovel rural.',
    '',
    `Identifiquei o ponto exato que precisamos regularizar (${servicosNomes}) para deixar a propriedade 100% destravada, evitando multas e garantindo liberacao imediata para credito bancario, emissao de nota e cartorio.`,
    '',
    'Para eu dar entrada nos sistemas oficiais para voce ainda hoje, me envie por gentileza foto ou PDF de:',
    ...documentosList.slice(0, 4).map((d, idx) => `${idx + 1}) ${d}`),
    '',
    `Meus honorarios para executar todo o processo e te entregar a Pasta do Imovel Regularizada ficam em R$ ${Math.round((minTotal + maxTotal) / 2).toLocaleString('pt-BR')},00 (sendo 50% na abertura do protocolo e 50% na entrega final concluida). Posso gerar a nossa Ordem de Servico para comecarmos agora?`
  ].join('\n');

  const formattedMarkdown = [
    '### 1. Diagnostico Tecnico do Caso',
    ...diagnosticoParagraphs,
    '',
    '### 2. Documentos que Voce Deve Pedir Agora',
    ...documentosList.map((d) => `- ${d}`),
    '',
    '### 3. Passo a Passo nos Sistemas Oficiais',
    ...passosList.map((p, idx) => `${idx + 1}. ${p}`),
    '',
    '### 4. Sugestao de Honorarios + Mensagem Pronta para o Cliente',
    honorariosTexto,
    '',
    '**Mensagem Pronta para Copiar e Enviar no WhatsApp do Cliente:**',
    '```text',
    scriptWhatsapp,
    '```'
  ].join('\n');

  return {
    provider: 'motor-especialista-rural-nativo',
    matchedTopics: matchedModules.map((m) => m.name),
    propertySize: sizeInfo.porte,
    answer: stripForbiddenChars(formattedMarkdown),
    sections: {
      diagnostico: diagnosticoParagraphs.map(stripForbiddenChars),
      documentos: documentosList.map(stripForbiddenChars),
      passoAPasso: passosList.map(stripForbiddenChars),
      honorarios: {
        porte: sizeInfo.porte,
        escopo: servicosNomes,
        min: minTotal,
        max: maxTotal,
        sugerido: Math.round((minTotal + maxTotal) / 2),
        texto: stripForbiddenChars(honorariosTexto)
      },
      scriptWhatsapp: stripForbiddenChars(scriptWhatsapp)
    }
  };
}

async function tryExternalAiProvider(cleanQuestion, nativeResult) {
  loadEnv();
  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();
  const openaiKey = (process.env.OPENAI_API_KEY || '').trim();

  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT_RURAL }]
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Caso relatado pelo aluno consultor rural: "${cleanQuestion}"\n\nResponda nos 4 blocos oficiais (Diagnostico Tecnico, Documentos a Pedir, Passo a Passo nos Sistemas e Sugestao de Honorarios + Script de WhatsApp), sem emojis e sem travessoes.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1200
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text =
          data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (text && text.trim().length > 80) {
          return {
            ...nativeResult,
            provider: 'gemini-2.0-flash',
            answer: stripForbiddenChars(text.trim())
          };
        }
      }
    } catch (_err) {
      // Usa o Motor Especialista Rural Nativo automaticamente
    }
  }

  if (openaiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.3,
          max_tokens: 1200,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT_RURAL },
            {
              role: 'user',
              content: `Caso relatado pelo aluno consultor rural: "${cleanQuestion}"`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content || '';
        if (text && text.trim().length > 80) {
          return {
            ...nativeResult,
            provider: 'openai-gpt-4o-mini',
            answer: stripForbiddenChars(text.trim())
          };
        }
      }
    } catch (_err) {
      // Usa o Motor Especialista Rural Nativo automaticamente
    }
  }

  return nativeResult;
}

module.exports = async function handler(req, res) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip, 'ai_consultant', 20, 60000);
  if (!rl.allowed) {
    return sendJson(res, 429, {
      ok: false,
      error: `Muitas mensagens enviadas em curto intervalo. Aguarde ${rl.retryAfterSec} segundos.`
    });
  }

  if (req.method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  // Consultor IA desativado ate o lancamento futuro (para reativar, defina ENABLE_AI_CONSULTANT=true no ambiente)
  loadEnv();
  if (process.env.ENABLE_AI_CONSULTANT !== 'true') {
    return sendJson(res, 503, {
      ok: false,
      disabled: true,
      error: 'O Consultor Rural IA esta reservado para lancamento futuro.'
    });
  }

  const session = extractSessionFromReq(req);

  if (req.method === 'GET') {
    if (!session || !session.email) {
      return sendJson(res, 401, {
        ok: false,
        authenticated: false,
        error: 'Faca login para acessar o Consultor Rural IA 24h.'
      });
    }
    const user = await getUserByEmail(session.email);
    const hasAccess = Boolean(user && (user.isAdmin || user.acesso_ia_consultor));
    const todayStr = new Date().toISOString().slice(0, 10);
    const usedToday =
      user && user.data_ultimo_uso_ia === todayStr
        ? Number(user.perguntas_ia_hoje || 0)
        : 0;

    return sendJson(res, 200, {
      ok: true,
      unlocked: hasAccess,
      lockReason: hasAccess ? null : 'PURCHASE_IA',
      quota: {
        usedToday,
        maxDaily: MAX_DAILY_QUESTIONS,
        remaining: Math.max(0, MAX_DAILY_QUESTIONS - usedToday)
      },
      checkoutUrl: getCheckoutUrls(user ? user.email : '').ia
    });
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, {
      ok: false,
      error: 'Metodo nao permitido. Use POST.'
    });
  }

  let body = {};
  try {
    body = await parseRequestBody(req);
  } catch (err) {
    return sendJson(res, 400, {
      ok: false,
      error: err.message || 'Corpo da requisicao invalido.'
    });
  }

  // 1. Verifica autenticacao
  const fallbackEmail =
    body.email && typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';
  const targetEmail = (session && session.email) || fallbackEmail;

  if (!targetEmail) {
    return sendJson(res, 401, {
      ok: false,
      error: 'Sessao nao autenticada. Faca login na Area de Membros para usar o Consultor IA.'
    });
  }

  const user = await getUserByEmail(targetEmail);
  if (!user || user.status !== 'ativo') {
    return sendJson(res, 401, {
      ok: false,
      error: 'Conta de aluno nao encontrada ou inativa.'
    });
  }

  // 2. Verifica se o aluno tem o acesso ao Agente Consultor Rural IA 24h liberado
  if (!user.acesso_ia_consultor && !user.isAdmin) {
    const checkoutUrls = getCheckoutUrls(user.email);
    return sendJson(res, 403, {
      ok: false,
      unlocked: false,
      lockReason: 'PURCHASE_IA',
      checkoutUrl: checkoutUrls.ia,
      error:
        'O Consultor Rural IA 24h esta bloqueado para esta conta. Destrave agora para diagnosticar casos reais de clientes, descobrir quanto cobrar e gerar scripts de fechamento 24 horas por dia.'
    });
  }

  // 3. Passa a pergunta pelo Firewall Anti-Hack, Anti-Binario, Anti-SQLi e Anti-Prompt Injection
  const rawQuestion =
    body.question !== undefined
      ? body.question
      : body.message !== undefined
        ? body.message
        : body.prompt;

  const firewall = validateAndSanitizeAiInput(rawQuestion);
  if (!firewall.ok) {
    return sendJson(res, 400, {
      ok: false,
      blocked: true,
      category: firewall.category,
      reason: firewall.reason,
      error: firewall.reason
    });
  }

  // 4. Verifica e incrementa a cota diaria (max 40 perguntas/dia)
  const todayStr = new Date().toISOString().slice(0, 10);
  const currentCount =
    user.data_ultimo_uso_ia === todayStr
      ? Number(user.perguntas_ia_hoje || 0)
      : 0;

  if (!user.isAdmin && currentCount >= MAX_DAILY_QUESTIONS) {
    return sendJson(res, 429, {
      ok: false,
      error:
        'Voce atingiu o limite de seguranca de 40 consultorias tecnicas por dia. Sua cota sera renovada automaticamente amanha.'
    });
  }

  const newCount = currentCount + 1;
  await updateUserAccess(user.email, {
    perguntas_ia_hoje: newCount,
    data_ultimo_uso_ia: todayStr
  });

  // 5. Executa o Motor Especialista Rural Nativo + Provedor LLM externo (se configurado no .env)
  const nativeResponse = buildNativeConsultantResponse(firewall.cleanText);
  const finalResult = await tryExternalAiProvider(
    firewall.cleanText,
    nativeResponse
  );

  return sendJson(res, 200, {
    ok: true,
    question: firewall.cleanText,
    provider: finalResult.provider,
    matchedTopics: finalResult.matchedTopics,
    propertySize: finalResult.propertySize,
    answer: finalResult.answer,
    reply: finalResult.answer,
    sections: finalResult.sections,
    quota: {
      usedToday: newCount,
      maxDaily: MAX_DAILY_QUESTIONS,
      remaining: Math.max(0, MAX_DAILY_QUESTIONS - newCount)
    }
  });
};
