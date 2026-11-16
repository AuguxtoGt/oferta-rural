# Projeto Entendimento: Oferta 13 (Imóvel Rural em Dia)

> Documento central de referência para entender o produto, o funil, a Área de Membros, a blindagem jurídica e a arquitetura técnica do projeto.
> Atualizado em: 2026-11-16

---

## 1. Visão Geral

Ecossistema de venda direta e entrega educacional de **regularização documental e cadastral de imóveis rurais (Matrícula, CCIR/INCRA, ITR/Receita Federal, CNIR, ADA/IBAMA e CAR/SICAR)**, operando com **duas ofertas complementares**:

1. **Oferta Principal ("Formação Consultor Rural", rotas `/`, `/v2`, `/2`, `/w`, `/an`, `/consultor`):** focada em capacitar pessoas comuns (sem necessidade de faculdade) para organizar documentação rural e prestar serviços administrativos/declaratórios para produtores rurais. Entrega realizada no portal **`/membros`**.
2. **Oferta Secundária ("Entenda sem se perder", rotas `/entenda` e `/entenda-sem-se-perder`):** focada diretamente no proprietário rural que deseja entender e regularizar os próprios documentos sem promessa de renda extra. Entrega realizada no portal dedicado **`/proprietario`**.

### Estrutura de Pastas, Repositório e Domínios
- **Pasta local raiz (Área de Membros + APIs + Funil):** `/Volumes/External HD/-OFERTAS/---LOW TICKECT/consultor-rural`
- **Pasta isolada de deploy das páginas de vendas:** `/Volumes/External HD/-OFERTAS/---LOW TICKECT/consultor-rural/consultorrural` (sincronizada via `consultorrural/atualizar-deploy.sh`)
- **Repositório Git:** https://github.com/AuguxtoGt/oferta-rural (branch `main`)
- **Hospedagem em 2 projetos independentes na Vercel (`vercel.json` com `cleanUrls`):**
  1. **Domínio exclusivo das páginas de vendas (`gutto/consultorrural`):** https://consultorrural.vercel.app/ (`/`, `/v2`, `/2`, `/w`, `/an`, `/consultor`, `/entenda`, `/upsell`, `/upclientes`), com redirecionamento automático de `/membros` e `/proprietario` para `regularizerural.vercel.app`.
  2. **Domínio da Área de Membros + Webhook + APIs (`gutto/oferta-rural`):** https://regularizerural.vercel.app/ (`/membros`, `/proprietario`, `/termos-de-uso`, `/politica-privacidade`, `/api/auth`, `/api/content`, `/api/webhook`).
- **Servidor local de desenvolvimento:** `node server-membros.js` rodando em `http://localhost:8090` (`/membros` e `/proprietario`).
- **Rastreamento:** 100% Wexor.fy (`pix-1794022936290` no dashboard `low-br` com 5 Pixels Meta + CAPI + `utms.js` v3.1) nas 10 páginas ativas do funil.
- **Gateway de pagamento:** Novark (`pay.novarkbr.com`) + variante de teste Wiven na rota `/w`.

---

## 2. Público-Alvo e Produto

### Ângulo 1: Consultor Rural (`/` e variantes -> entrega em `/membros`)
- **Público:** pessoas que buscam uma fonte de renda prestando serviço administrativo/declaratório para donos de terras (emitir CCIR, declarar ITR, tirar CND, diagnosticar pendências de CAR/CAFIR/CNIR e organizar pastas para bancos ou cartórios).
- **Promessa comercial:** aprender passo a passo na tela como regularizar imóveis rurais e cobrar pelos atendimentos (`R$ 800 a R$ 2.400/mês` na copy nova da `/`, ou `R$ 300 a R$ 1.500` por serviço avulso).
- **Entrega principal na Área de Membros (`/membros`):**
  - **Trilha Principal Obrigatória (Módulos 01 a 11, 34 aulas, 24h base):** fundamentos e limites legais (o que não exige faculdade vs. as 3 exceções técnicas de CREA/CFT), CCIR/DCR no INCRA, ITR/CAFIR/CND na Receita Federal, CNIR, ADA/IBAMA, CAR/SICAR, diagnóstico completo, passo a passo por estado, retificação administrativa, crédito rural pós-regularização e precificação inicial. Inclui **5 vídeo-aulas no YouTube Não Listado** nos Módulos 01 a 05 (`vkfm83l7etM`, `oX35mlvcQ_0`, `zH9O5e1-ycw`, `NG791XF23_w`, `3Mjgfs6Aebk`).
  - **Central Operacional com 6 Planilhas Interativas** (com gráficos SVG ao vivo e exportação `.CSV`).
  - **Certificado de Conclusão de Curso Livre (Frente e Verso A4 Paisagem)** liberado após 100% das 34 aulas principais + 7 dias de compra.
- **Pacotes Complementares (Order Bumps e Upsell integrados na mesma conta):**
  - **Order Bump 1 (`acesso_ob1`, Módulos 12 a 14, +6h):** Consultor Profissional (Prospecção e Captação, Diagnóstico e Apresentação, Tabela de Precificação e Pacotes).
  - **Order Bump 2 (`acesso_ob2`, Módulos 15 a 17, +6h):** Kit de Modelos Prontos (Fichas e Checklists, Propostas/Orçamentos/Recibos, Procurações/Termos/Contratos referenciais).
  - **Order Bump 3 (`acesso_ob3`, Módulos 18 a 20, +6h):** Guia dos 20 Serviços Rurais Lucrativos (Cadastrais/Fiscais, Ambientais/Produtor e Crédito/Contratos/Recorrência).
  - **Combo dos 3 Order Bumps (`fotl08p9`):** desbloqueia `OB1 + OB2 + OB3` simultaneamente dentro da área de membros.
  - **Upsell 1 (`acesso_upsell`, Módulos 21 a 23, +6h):** Kit Primeiros Clientes / Estrutura Comercial e Escala.

### Ângulo 2: Proprietário Rural (`/entenda` -> entrega em `/proprietario`)
- **Público:** donos, herdeiros e posseiros de imóveis rurais que querem entender CCIR, ITR e CAR por conta própria, sem pular de portal em portal e sem promessa de renda como consultor.
- **Entrega no Portal do Proprietário (`/proprietario`):**
  - Mesma base técnica rigorosa adaptada 100% para a linguagem do dono da terra (oculta referências a prospecção, cobrança de honorários e certificado profissionalizante).
  - **4 Ferramentas Interativas adaptadas** (`Diagnóstico nos 4 Órgãos`, `Conversor de Área`, `Simulador Meu ITR` e `Ficha da Minha Terra`).

### Acervo Histórico de PDFs (`entregaveis-lucre/` e `fonte-pdfs/`)
- Mantidos localmente (fora do pacote público da Vercel via `.vercelignore`) os PDFs originais da oferta Entenda (`Manual_Pratico_CCIR_ITR_CAR_2026.pdf`, `Bonus_01` a `Bonus_05`, etc.) e os 9 PDFs dos 3 Order Bumps (`99 páginas` em `Plus Jakarta Sans`). Todo esse conteúdo já foi expandido e consolidado dentro dos 23 módulos web de `api/_lib/courses-db.js`.

---

## 3. Planos, Rotas de Vendas e Preços

| Rota / Página | Arquivo | Oferta e Layout | Mídia Hero | Ticket | Checkout | Rastreamento |
|---|---|---|---|---|---|---|
| `/` | `index.html` | Principal Nova (Consultor) | `nova-hero.mp3` (1.2x) | **R$ 27,90** | Novark `jxiib47t` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1) |
| `/v2` | `v2/index.html` | Variante Área de Membros + VSL 9:16 | `v2/vsl-rural.mp4` (9,7 MB) | **R$ 37,90** | Novark `kg1a7jgt` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1 + Clarity) |
| `/w` | `w.html` | Cópia da Principal Nova (teste Wiven) | `nova-hero.mp3` | **R$ 27,90** | Wiven `0RSKIQY` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1) |
| `/an` | `an.html` | Layout Antigo (Dave) | `vdave.mp3` | **R$ 27,90** | Novark `jxiib47t` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1) |
| `/consultor` | `consultor.html` | Layout Antigo (Dave) | `vdave.mp3` | **R$ 37,90** | Novark `kg1a7jgt` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1) |
| `/2` | `2.html` | Layout Antigo (Dave) | `vdave.mp3` | **R$ 37,90** | Novark `kg1a7jgt` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1) |
| `/entenda` | `entenda.html` / `entenda-sem-se-perder.html` | Dono da Terra (sem promessa de renda) | `audio-pagina-entendasemseperder.mp3` | **R$ 27,90** | Novark `agwfds26` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1) |
| `/upsell` / `/upclientes` | `upsell.html` / `upclientes.html` | Upsell 1: Kit Primeiros Clientes | - | **R$ 67,00** | Novark `bet5bxrw` | Wexor.fy (`pix-1794022936290` + `utms.js` v3.1) |
| Combo Interno | Vitrine `/membros` | Combo dos 3 Order Bumps (`OB1+OB2+OB3`) | - | Oferta interna | Novark `fotl08p9` | Webhook Novark `WEBH - RURAL` |
| Rascunho | `upsell2.html` | Upsell 2: Negócio Rural do Zero | - | *A definir* | *Sem checkout* | Rascunho não vinculado |

- **Garantia incondicional:** 7 dias em todas as ofertas.
- **Métricas históricas de referência:** ARPU `R$ 33,03` e CPA `R$ 24,00` (em 08/10/2026); base importada + ativa superior a **908 alunos** na tabela `alunos_membros` do Supabase.

---

## 4. Como Funciona (Fluxo Principal Ponta a Ponta)

1. **Aquisição:** Anúncios no Meta Ads (`criativos/` e `criativos-entenda/`) levam o visitante para as páginas em `consultorrural.vercel.app` (ou `regularizerural.vercel.app`). O script do **Wexor.fy** registra `PageView`, `ViewContent`, `InitiateCheckout` (com 5 Pixels + CAPI deduplicados) e decora os botões de checkout com `leadId` e `UTMs`.
2. **Conversão e Webhook Automático:** Ao aprovar o pagamento na Novark (`Pedido Aprovado`), o endpoint `POST /api/webhook` (`regularizerural.vercel.app/api/webhook`) valida o segredo do webhook, identifica os produtos comprados (Oferta Principal vs. `Entenda`, `OB1`, `OB2`, `OB3`, Combo `fotl08p9` ou `Upsell`), cria ou atualiza o aluno no **Supabase (`alunos_membros`)** com hash `scrypt` da senha inicial `rural123` e registra a `data_primeira_compra`. Em caso de reembolso ou estorno (`Pedido Cancelado`), bloqueia automaticamente os acessos correspondentes.
3. **Acesso e Estudo:** O aluno acessa `/membros` (Consultor) ou `/proprietario` (Dono da Terra), faz login com o mesmo e-mail da compra e senha `rural123` (podendo alterá-la no menu de perfil), estuda os módulos liberados, marca aulas e checklists concluídos (sincronizados em `progresso_aulas`) e utiliza as planilhas operacionais.
4. **Liberação Progressiva (Drip 7 Dias) e Certificação:** Após completar o período de garantia (`7 dias` desde `data_primeira_compra`) e concluir 100% das 34 aulas da Trilha Principal (`Módulos 01 a 11`), o aluno do modo Consultor (`/membros`) libera a emissão oficial sem marca d'água do **Certificado de Conclusão de Curso Livre (Frente e Verso A4 Paisagem)** em PDF e PNG de alta resolução.

---

## 5. Funcionalidades e Abas da Área de Membros (`/membros` e `/proprietario`)

Toda a interface compartilha o mesmo motor (`membros/styles.css` + `membros/app.js`) com design executivo claro/escuro em paleta Verde Floresta (`#0F291A` / `#15803D`), tipografia exclusiva **`Plus Jakarta Sans`** e zero emojis ou travessões.

### 5.1. Tela de Login (`#login-view`)
- Identidade visual com o **escudo rural simétrico** (escudo heráldico com broto de duas folhas), campo de e-mail e senha (`rural123` inicial com botão mostrar/ocultar), aviso legal discreto com links para `/termos-de-uso` e `/politica-privacidade`, proteção anti-enumeração por rate limit (`8 tentativas / 10 min`) e cookie de sessão assinado (`rr_session` `HttpOnly; Secure; SameSite=Lax`).
- Em `localhost` (ou sessão originalmente autenticada como Admin), exibe pílulas de troca rápida entre contas de demonstração (`vip@rural.com`, `aluno@rural.com` Dia 1 e `aluno8dias@rural.com` Dia 8+). Em produção para alunos comuns, o modo demo fica 100% bloqueado no servidor.

### 5.2. Aba 1: Módulos e Vitrine Principal (`#view-home`, `#view-module`, `#view-lesson`)
- **Hero adaptativo por perfil** (`Formação Consultor Rural` em `/membros` vs. `Portal do Proprietário Rural` em `/proprietario`) + botão `Continuar Estudando` que retoma exatamente da última aula pendente.
- **Faixa Executiva de Indicadores (`#home-kpi-strip`):** 4 cards em tempo real com Progresso Geral (`%`), Aulas Concluídas (`X / 70`), Checklists Práticos marcados e atalho direto para a Central de Planilhas.
- **Banner Executivo de Progresso do Certificado (`#home-certificate-banner`):** exibido exclusivamente no modo Consultor (`/membros`), mostrando barra de progresso das 34 aulas obrigatórias e status de liberação.
- **Catálogo de 23 Módulos e 70 Aulas (`api/_lib/courses-db.js`):**
  - Entregue exclusivamente via endpoint autenticado `GET /api/content` (nunca exposto como arquivo estático público).
  - **70 infográficos e gráficos SVG 100% exclusivos** (1 por aula), **214 tabelas técnicas e comparativas** (mínimo de 2 por aula, todas com busca instantânea `Filtrar na tabela...` e botão `Baixar .CSV`), **70 Estudos de Caso Reais ("Antes x Depois")**, caixas de modelos copiáveis em 1 clique, checklists interativos salvos no navegador e **23 mensagens finais inspiradoras sobre Jesus** no encerramento de cada módulo.
  - Suporte a blocos condicionais por perfil (`data-role-only="consultor"` vs. `proprietario`), garantindo que na Aula 01 (`mod-01-aula-00`, *"Precisa de Faculdade para Emitir CCIR, ITR ou CAR?"*) e demais módulos cada público veja exemplos compatíveis com sua realidade.

### 5.3. Aba 2: Ferramentas e Planilhas Operacionais (`#view-tools`)
- **No modo Consultor (`/membros`, 6 Planilhas Interativas):**
  1. `01` Calculadora de Honorários, Custos e Pacotes (Básico, Completo e Premium) com gráfico de margem líquida.
  2. `02` Matriz de Auditoria e Cruzamento nos 4 Órgãos (Matrícula x INCRA x Receita x CAR) com score de risco cadastral.
  3. `03` Planejador de Meta Mensal e Projeção Anual de 12 Meses com curva acumulada.
  4. `04` Conversor Rural Oficial de Área (`ha`, `m²`, Alqueire Paulista `2,42 ha`, Mineiro/Goiano `4,84 ha`, Nortista `2,72 ha`, Baiano `9,68 ha`) + cálculo de Módulos Fiscais e enquadramento fundiário (Minifúndio, Pequena, Média ou Grande Propriedade).
  5. `05` Simulador de ITR e Grau de Utilização (`Lei nº 9.393/1996`), cruzando Área Total, áreas ambientais isentas (`APP`, Reserva Legal, etc.), VTN, GU (`%`) e alíquota oficial da tabela progressiva (economia legal vs. punitiva).
  6. `06` Carteira de Clientes e Recorrência Anual (CRM `50%` entrada / `50%` entrega + alerta de renovação anual de ITR/CCIR).
- **No modo Proprietário (`/proprietario`, 4 Ferramentas adaptadas):** `Diagnóstico nos 4 Órgãos`, `Conversor da Minha Terra`, `Simulador do Meu ITR` e `Ficha Documental das Minhas Propriedades`.
- Todas possuem gráficos SVG reativos (Light/Dark), gavetas `<details>` com a memória de cálculo oficial, persistência local automática e exportação `.CSV` com `UTF-8 BOM` + separador `;` (abre direto acentuado no Excel brasileiro).

### 5.4. Aba 3: Certificado de Conclusão Blindado (`#view-certificate` / `#certificado`)
- **Escopo exclusivo:** visível apenas para o perfil Consultor (`/membros`); oculto automaticamente na navegação, menu e Home de `/proprietario`.
- **Dupla trava real de emissão em produção:** exige simultaneamente **100% das 34 aulas da Trilha Principal** (`Módulos 01 a 11`) + **cronograma de 7 dias pós-compra cumprido** (`daysSincePurchase >= 7`, `isAdmin` ou `liberar_trava_7dias_manual`). Antes disso, exibe o certificado com selo diagonal tracejado `MODELO DE PRÉ-VISUALIZAÇÃO` e bloqueia a exportação final.
- **Carga horária dinâmica auditável:** base de **24 horas** pela Trilha Principal, somando **+6 horas** automaticamente no verso e na frente para cada trilha complementar 100% concluída (`OB1`, `OB2`, `OB3` e `Upsell`, chegando até **48 horas**).
- **Identificação e LGPD (`PUT /api/auth` `update_certificate_profile`):**
  - Edição ao vivo do nome completo (4 a 90 caracteres, com redução inteligente de fonte e `textLength` automático em nomes extensos).
  - Campo de **CPF opcional mascarado**: aceita 11 dígitos e converte imediatamente no cliente e em memória no servidor para `***.XXX.XXX-**` (gravado como tag `__cert_doc:***.XXX.XXX-**` em `progresso_aulas`, sem migração de banco e **jamais armazenando o CPF bruto**). A data da primeira emissão oficial fica registrada em `__cert_issued:YYYY-MM-DD` (validada no servidor). A ação `toggle_lesson` bloqueia qualquer tentativa de injetar strings iniciadas por `__`.
- **Design Executivo A4 Paisagem (`1123x794`, Frente e Verso):**
  - **Frente:** fundo papel algodão (`#FCFBF7`), curvas topográficas sutis, moldura dupla em verde-floresta (`#0F291A`) e ouro oliva (`#8A6D3B`), **brasão institucional superior esquerdo** com escudo rural simétrico, código único determinístico FNV-1a (`IRD-2026-XXXXXXXX`), **medalhão central dourado champagne de 28 ondas com ramos de louro simétricos, anéis *guilloché*, escudo esmeralda com check e faixa dobrada 3D**, assinatura monolinha da Coordenação Pedagógica e caixa de enquadramento jurídico dentro da arte.
  - **Verso:** cabeçalho de vínculo ao titular e registro, grade completa dos 11 módulos obrigatórios, box de trilhas complementares averbadas e **Quadro de Enquadramento Jurídico e Limites Profissionais em 5 itens**.
- **Blindagem Jurídica contra OAB, CREA, CFT, CRC, Órgãos Públicos e MEC:**
  - Enquadrado expressamente como **Curso Livre de Capacitação e Atualização Privada** (`Lei Federal nº 9.394/1996, art. 42` e `Decreto Federal nº 5.154/2004`).
  - Declara ausência de vínculo com `INCRA`, `Receita Federal`, `SICAR`, `IBAMA`, cartórios ou `MEC`, e explicita que comprova estudos livres em rotinas declaratórias, **não conferindo grau acadêmico nem substituindo registro em `CREA`, `CFT`, `OAB` ou `CRC`** para atos privativos (SIGEF, plantas/memoriais com ART/TRT, PRADA ou assessoria jurídica/contábil).
- **Exportação e Simulação Local:**
  - **PDF A4 Paisagem (2 páginas exatas):** janela de impressão dedicada com `@page { size: A4 landscape; margin: 0; }` e `print-color-adjust: exact` (Página 1 Frente + Página 2 Verso).
  - **PNG Alta Resolução (`2400x1697`):** renderização limpa via `<canvas>` separado para Frente e Verso.
  - **Botão de Simulação Rápida (`demo_toggle_certificate_ready`):** visível apenas em `localhost` ou conta Admin, alterna em 1 clique entre 100% liberado e o estado original sem sobrescrever `data_primeira_compra`.

### 5.5. Rodapé Jurídico Global e Páginas Legais (`/termos-de-uso` e `/politica-privacidade`)
- **Rodapé interno (`#app-legal-footer`):** exibido em todas as abas logadas, com texto adaptado automaticamente ao perfil (em `/membros` inclui ressalva sobre exemplos de honorários e não garantia de faturamento; em `/proprietario` mantém texto focado na documentação do imóvel).
- **`termos-de-uso.html`:** página legal completa em `Plus Jakarta Sans` com OpenGraph próprio e **10 cláusulas** detalhadas (caráter educacional, ausência de vínculo governamental, fronteira de atos privativos CREA/CFT/OAB/CRC, minutas referenciais, não garantia de resultado financeiro, uso pessoal, **Cláusula 9 específica sobre Certificado de Curso Livre e vedação à adulteração ou apresentação enganosa**, e Cláusula 10 de garantia de 7 dias).
- **`politica-privacidade.html`:** conformidade LGPD clara explicando dados cadastrais de compra/acesso, uso de cookies e pixels de tráfego pago (Meta Ads / Wexor.fy) e não armazenamento de documentos sensíveis completos.

### 5.6. Painel Administrativo Integrado e Consultor IA Reservado
- **Modal Admin (`isAdmin === true`):** gerenciamento direto de alunos, liberação manual de trilhas/trava de 7 dias e ajuste global de dias de drip (`GET/PUT /api/auth`).
- **Consultor Rural IA 24h (Oculto para Lançamento Futuro):** todo o código de chat especialista + firewall de 7 camadas (`api/ai-consultant.js`), filtro em `api/content.js`, regra de assinatura recorrente em `api/webhook.js`, `mod-24` em `build_rich_courses_db.py` e `#view-ai` em `membros/app.js` permanece **preservado e 100% desativado** (`ENABLE_AI_CONSULTANT = false` / `HTTP 503`) até decisão de lançamento comercial.

---

## 6. Rastreamento de Tráfego Pago (100% Wexor.fy)

Todas as **10 páginas ativas de vendas e upsell** (`index.html`, `v2/index.html`, `2.html`, `w.html`, `an.html`, `consultor.html`, `entenda.html`, `entenda-sem-se-perder.html`, `upsell.html` e `upclientes.html`) utilizam exclusivamente os **2 scripts oficiais do Wexor.fy** no `<head>`:

1. **Pixel + CAPI (`pix-1794022936290`, dashboard `low-br`):**
   - `https://wexorfy.vercel.app/api/scripts/pixel.js?id=pix-1794022936290&d=low-br`
   - Dispara os **5 Pixels Meta + CAPI Server-Side** com deduplicação por `eventID`: `1395221742238189`, `885028918027856`, `1495289149453037`, `2794376007657993` e `1088370370664674`.
   - Eventos automáticos: `PageView`, `ViewContent` (8s ou scroll > 120px) e `InitiateCheckout` nos botões de checkout.
2. **Decorador de UTMs (`utms.js` v3.1, `data-wexor-platform="novark_outra"`):**
   - Gera `wexor_lead_id` e injeta `utm_source=FBjLj<leadId>`, `utm_campaign`, `utm_medium`, `utm_content`, `utm_term`, `fbclid`, `xcod`, `sck`, `src` e `subid` nos links da Novark e Wiven.
3. **Regra na Novark:** manter ativos apenas o **Webhook do Wexor.fy** e o **Webhook da Área de Membros (`WEBH - RURAL`)** (manter Utmify desativada para evitar duplicidade de `Purchase`).

---

## 7. Criativos de Anúncio (`criativos/` e `criativos-entenda/`)

- **Regras fixas (`/criativos-meta-ads`):** formato obrigatório **1:1 (`1080x1080`)**, nunca inserir datas, nunca usar estilo bloco de notas (Apple Notes), evitar formato notícia pura (baixa conversão) e limitar Twitter/X a 1 ou 2 peças por lote.
- **Formatos campeões validados (`rodados/venderam bem`):** Produto Mockup (`19`), Bold Overlay (`20`), Flatlay Documentos (`22`) e Twitter/X (`17`).
- **Numeração atual:**
  - `criativos/imagens/` (Oferta Consultor): produzidos até **`261.jpg`** (próximo livre: **`262`**).
  - `criativos-entenda/` (Oferta Dono da Terra): produzidos até **`39.jpg`** (próximo livre: **`40`**).

---

## 8. Arquitetura e Tech Stack

| Camada | Tecnologia e Padrões |
|---|---|
| Frontend (Vendas e Portais) | HTML5 + CSS3 + JavaScript Vanilla (zero build step, carregamento instantâneo), gráficos e certificados em SVG vetorial puro + exportação `<canvas>` / `.CSV` |
| Tipografia e Regras de UI | **`Plus Jakarta Sans`** em todo o ecossistema moderno; proibidos emojis, travessões e fontes serifadas de alto contraste |
| Backend Serverless | Node.js (Vercel Serverless Functions em `api/auth.js`, `api/content.js`, `api/webhook.js`, `api/ai-consultant.js` e utilitários em `api/_lib/`) |
| Servidor Local | `server-membros.js` (`http://localhost:8090`, simula rotas limpas da Vercel e APIs serverless localmente) |
| Banco de Dados | **Supabase PostgreSQL REST** (`ijozopseljwuoloqucvn`: tabelas `alunos_membros`, `webhook_logs` e `config_modulos_drip`, RLS + `GRANT` configurados em `supabase-setup.sql`) com fallback automático para JSON local (`data/members-db.json`) em desenvolvimento |
| Segurança | Senhas com `crypto.scrypt` + salt individual, sessão `HMAC-SHA256` em cookie `HttpOnly; Secure; SameSite=Lax`, comparação em tempo constante, rate limiting por IP, sanitização anti-XSS/injeção, catálogo privado em `api/_lib/courses-db.js`, `.vercelignore` bloqueando arquivos internos e headers `CSP`, `HSTS`, `X-Frame-Options` e `Permissions-Policy` em `vercel.json` |
| Hospedagem e Deploy | GitHub (`AuguxtoGt/oferta-rural`) -> Vercel (`regularizerural.vercel.app` e `consultorrural.vercel.app`) |

---

## 9. Últimas Atualizações

| Data | Mudança |
|---|---|
| 16/11/2026 | **Certificado de Conclusão Blindado + Novos Brasões Vetoriais (`/membros`, `/proprietario` e `/termos-de-uso`, publicado em produção em `https://regularizerural.vercel.app`):** Construído e publicado sistema completo de emissão de Certificado de Conclusão exclusivo para o portal Consultor (`/membros`, oculto em `/proprietario`), amparado no art. 42 da Lei Federal nº 9.394/1996 (LDB) e Decreto nº 5.154/2004. Inclui dupla trava em produção (`100%` das `34` aulas da Trilha Principal + `7 dias` pós-compra), carga horária progressiva (`24h` a `48h`), nome editável (4 a 90 caracteres) + CPF opcional mascarado por LGPD (`***.XXX.XXX-**` em memória via `update_certificate_profile`, com bloqueio de tags `__` em `toggle_lesson`), SVGs A4 Paisagem (`1123x794`) Frente e Verso refinados com **brasão institucional superior em escudo rural simétrico** (aplicado também na navbar e tela de login) e **medalhão central dourado champagne de 28 ondas com ramos de louro simétricos, anéis *guilloché*, escudo esmeralda e faixa 3D**, código determinístico `IRD-2026-XXXXXXXX`, enquadramento jurídico contra riscos `CREA/CFT/OAB/CRC` e `MEC/INCRA/RFB/SICAR`, exportação em PDF A4 de 2 páginas e PNG `2400x1697`, simulação reversível em 1 clique em `localhost`/Admin (`demo_toggle_certificate_ready`) e nova **Cláusula 9** em `termos-de-uso.html` (sincronizada também em `consultorrural.vercel.app`). |
| 14/11/2026 | **Upgrade Total v7 da Área de Membros (`/membros` e `/proprietario`, publicado em `https://regularizerural.vercel.app`, commit `1ac23d2`):** (1) Nova faixa executiva de indicadores na Home (`#home-kpi-strip`); (2) Central Operacional expandida para **6 Planilhas Interativas** em `/membros` (`Honorários`, `Auditoria 4 Órgãos`, `Meta 12 Meses`, `Conversor de Área/MF`, `Simulador ITR Lei 9.393/96` e `Carteira CRM 50/50`) e **4 Ferramentas** em `/proprietario`, todas com gráficos SVG dinâmicos, memória de cálculo e download `.CSV`; (3) Substituição dos 69 SVGs genéricos por **70 infográficos SVG exclusivos**, expansão de 124 para **214 tabelas** (com busca ao vivo e download `.CSV`) e inclusão de **70 Estudos de Caso Reais ("Antes x Depois")** em `api/_lib/courses-db.js`. |
| 14/11/2026 | **Blindagem Jurídica Completa + Política de Privacidade (`/membros`, `/proprietario`, `/termos-de-uso` e `/politica-privacidade`, publicado em produção):** Frase de concordância legal no login, rodapé jurídico global (`#app-legal-footer`) adaptado por perfil (Consultor vs. Proprietário), reescrita de `termos-de-uso.html` em `Plus Jakarta Sans` com OpenGraph próprio e atualização de `politica-privacidade.html` detalhando coleta mínima de dados e pixels de tráfego pago. |
| 12/11/2026 | **Novo Domínio Exclusivo para Páginas de Vendas (`https://consultorrural.vercel.app/`):** Criada a subpasta isolada `consultorrural/` + script `consultorrural/atualizar-deploy.sh` publicando todas as páginas de vendas em `gutto/consultorrural` com OpenGraph atualizado, Wexor.fy completo e redirect automático de `/membros` e `/proprietario` para `https://regularizerural.vercel.app`. |
| 09/11/2026 | **Migração 100% para Wexor.fy nas 10 Páginas:** Removidos scripts antigos da Utmify e pixels isolados de `2.html`, padronizando todas as 10 páginas com `pix-1794022936290` (5 Pixels Meta + CAPI no painel `low-br`) e `utms.js` v3.1. |
| 06/11/2026 | **Nova Aula 01 no Módulo 01 (`mod-01-aula-00`):** Criada a aula *"Precisa de Faculdade para Emitir CCIR, ITR ou CAR?"* detalhando rotinas declaratórias livres vs. as 3 exceções de CREA/CFT (SIGEF, ART/TRT e PRADA), elevando a Trilha Principal para **34 aulas** e o curso completo para **70 aulas**. |
| 05/11/2026 | **Importação Histórica de 903 Compradores no Supabase (`alunos_membros` = 908 registros):** Importação completa de `vendas_2026-11-05.csv` mapeando acessos exatos (`OB1`, `OB2`, `OB3`, `Upsell` e `Entenda`) e `data_primeira_compra` real. |
| 04/11/2026 | **Variante `/v2` com VSL 9:16 (`R$ 37,90` -> `kg1a7jgt`) + Criativos `257.jpg` a `261.jpg`:** Publicada página `/v2` focada na apresentação visual da área de membros com `v2/vsl-rural.mp4` comprimido e 5 novos criativos `1:1` da plataforma. |
| 03/11/2026 | **Auditoria Completa de Segurança (`/saas-1seguranca-total`) + Revisão dos 23 Módulos + Portal `/proprietario`:** Catálogo movido para `api/_lib/courses-db.js` privado, autenticação blindada com `scrypt` + `HttpOnly`, headers de segurança em `vercel.json`, portal `/proprietario` publicado e Consultor IA ocultado para lançamento futuro. |
| 30/10/2026 | **Lançamento da Área de Membros Web (`/membros` + `/api/*` + `supabase-setup.sql`) e dos 9 PDFs dos 3 Order Bumps.** |

---

## 10. Pontos de Atenção Atuais

- **Comunicação em anúncios sobre o Certificado:** ao mencionar o certificado em criativos ou páginas de vendas, usar sempre o termo **"Certificado de Conclusão (Curso Livre de 24h)"**, jamais sugerindo reconhecimento pelo MEC, vínculo com INCRA/Receita ou habilitação substitutiva de advogado/engenheiro.
- **Coerência de bônus na página `/` (`index.html`):** a copy da `/` menciona tabela de preços e modelos de contrato como bônus, itens que na Área de Membros também aparecem aprofundados nos Order Bumps (`OB1` e `OB2`), embora a Trilha Principal já traga a calculadora de honorários e precificação no Módulo 11 e na aba `Ferramentas e Planilhas`.
- **Arquivo `upsell2.html`:** permanece como rascunho desconectado (sem preço, link de checkout e script de tracking). Não enviar tráfego para `/upsell2` sem finalizar essas configurações.
- **Cuidado com Git:** nunca rodar `git add -A` cegamente sem conferir `git status`, mantendo `entregaveis-lucre/`, `criativos/`, `criativos-entenda/`, `founder/` e `.env*` fora de commits públicos.

---

*Gerado e atualizado pelo Antigravity (`/projeto-entendimento`)*
