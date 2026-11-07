# 📊 Projeto Entendimento — Oferta 13 (Imóvel Rural em Dia)

> Documento de referência rápida para entender o projeto, a oferta e a estrutura.
> Atualizado em: 2026-11-06

---

## 🧭 Visão Geral

Funil de venda direta de infoprodutos de **regularização de imóvel rural (CCIR, ITR e CAR)**, com **duas ofertas** no mesmo site: a principal, com ângulo de **renda extra como Consultor Rural** (`/`), e a nova **"Entenda sem se perder"** (`/entenda`), com ângulo de **entender e organizar os próprios documentos**. Site estático (HTML/CSS/JS puro), sem framework.

- **Pasta local:** `/Users/gustavoaugusto/Desktop/oferta13`
- **Repositório:** https://github.com/AuguxtoGt/oferta-rural (branch `main`)
- **Hospedagem:** Vercel (`vercel.json` com `cleanUrls`)
- **Site no ar:** https://regularizerural.vercel.app/ (página `/`, versão nova, com Utmify, R$ 27,90), https://regularizerural.vercel.app/w (cópia da principal nova, com Utmify, R$ 27,90, para teste de checkout), https://regularizerural.vercel.app/an (versão antiga com áudio do Dave, Utmify, R$ 27,90), https://regularizerural.vercel.app/consultor (versão antiga com áudio do Dave, Utmify, R$ 37,90), https://regularizerural.vercel.app/2 (versão antiga com áudio do Dave, Meta Pixel nativo, R$ 37,90) e https://regularizerural.vercel.app/entenda (nova oferta foco no dono da terra, com Utmify, rota via rewrite no `vercel.json`)
- **Checkout:** Novark (`pay.novarkbr.com`)

---

## 👤 Público-Alvo e Produto

**Para quem:** pessoas comuns que querem uma nova fonte de renda sem faculdade, e também donos de imóvel rural com documentos irregulares (venda, herança ou crédito bloqueados).

**Produto (acesso único):**
- Material Completo CCIR, ITR e CAR (90+ páginas, com prints reais dos sistemas)
- Manual Prático CCIR, ITR e CAR 2026 (31 páginas, rota dos 26 estados + DF)
- Tabela Sugerida de Preços de Serviços
- Modelo de Solicitação de Retificação de Área
- Guia de Acesso ao Crédito Rural pós-regularização
- Bônus: Modelo de Contrato para Consultores
- Bônus Especial: Modelo de Contrato de Prestação de Serviço

**Promessa:** "Aprenda a lucrar de R$ 800 a R$ 3.000 como Consultor Rural".

### Oferta nova: "Entenda sem se perder" (`/entenda`)
**Para quem:** donos de imóvel rural que querem entender CCIR, ITR e CAR sozinhos, sem pular de site em site. **Sem promessa de lucro.**

**Entregáveis** (PDFs em `entregaveis-lucre/`, fonte HTML em `_antigos_backup/fonte_html/`):
- `Manual_Pratico_CCIR_ITR_CAR_2026.pdf` (9 págs)
- `Modelo_Solicitacao_Retificacao_Area.pdf` (5 págs)
- `Guia_Acesso_Credito_Rural_Pos_Regularizacao.pdf` (5 págs)
- `passo car.pdf`, `passo ccir.pdf`, `passo itr.pdf`
- **Novos bônus (20/10/2026, ainda NÃO listados na página `/entenda`)**, fonte HTML em `fonte-pdfs/entenda/` (renderizados com Chrome headless):
  - `Bonus_01_Checklist_Documentos_Imovel_Rural.pdf` (11 págs)
  - `Bonus_02_Calendario_Anual_Prazos.pdf` (9 págs)
  - `Bonus_03_Guia_Erros_Comuns_e_Como_Corrigir.pdf` (10 págs)
  - `Bonus_04_Sobreposicao_CEFIR_Como_Resolver.pdf` (16 págs; CEFIR é específico da Bahia/INEMA/SEIA)
  - `Bonus_05_eCAC_para_Imovel_Rural.pdf` (15 págs; e-CAC, gov.br, ITR, CAFIR, certidão, procuração, golpes)
- `UPSELL_Negocio_Rural_do_Zero.pdf`
- **Entregáveis dos 3 Order Bumps da Oferta Principal (30/10/2026, 9 PDFs com 11 páginas cada = 99 páginas no total)**, fonte HTML em `fonte-pdfs/order-bumps/` (`style.css` + 9 HTMLs em Plus Jakarta Sans e paleta verde):
  - **Order Bump 1 (`entregaveis-lucre/ob1-consultor-profissional/`):**
    - `01_Manual_Prospeccao_e_Captacao_Clientes_Rurais.pdf` (11 págs)
    - `02_Guia_Atendimento_Diagnostico_e_Apresentacao.pdf` (11 págs)
    - `03_Tabela_Precificacao_Pacotes_e_Fechamento.pdf` (11 págs)
  - **Order Bump 2 (`entregaveis-lucre/ob2-modelos-prontos/`):**
    - `01_Caderno_Fichas_Atendimento_e_Checklists.pdf` (11 págs)
    - `02_Kit_Propostas_Orcamentos_e_Recibos_Prontos.pdf` (11 págs)
    - `03_Modelos_Procuracoes_Termos_e_Contratos.pdf` (11 págs)
  - **Order Bump 3 (`entregaveis-lucre/ob3-guia-20-servicos/`):**
    - `01_Servicos_Rurais_Lucrativos_Vol1_Cadastrais_e_Fiscais.pdf` (11 págs, Serviços 01 a 07)
    - `02_Servicos_Rurais_Lucrativos_Vol2_Ambientais_e_Produtor.pdf` (11 págs, Serviços 08 a 14)
    - `03_Servicos_Rurais_Lucrativos_Vol3_Credito_Contratos_e_Recorrencia.pdf` (11 págs, Serviços 15 a 20 + Esteira + Calendário Sazonal)

**Preço:** R$ 27,90 (de R$ 68,91), garantia de 7 dias. Os dados de 2026 do manual (ITR de 10/08 a 30/09/2026, multa de 1% ao mês com mínimo de R$ 50, CCIR liberado em 19/05 com taxa até 17/06) vêm de pesquisa web. A parte de Plano Safra ficou sem valores fixos, de propósito.

---

## 💰 Planos e Preços

| Rota / Página | Arquivo | Oferta e Layout | Áudio | Ticket | Checkout Novark | Rastreamento |
|---|---|---|---|---|---|---|
| `/` | `index.html` | Principal Nova (Consultor) | `nova-hero.mp3` | **R$ 27,90** | `jxiib47t` | Utmify (Pixel 3 RURAL + UTMs) |
| `/v2` | `v2/index.html` | Variante Área de Membros + VSL 9:16 | `v2/vsl-rural.mp4` (9,7 MB H.264) | **R$ 37,90** | `kg1a7jgt` | Utmify (Pixel 3 RURAL + UTMs + Clarity) |
| `/w` | `w.html` | Cópia da Principal Nova | `nova-hero.mp3` | **R$ 27,90** | Wiven (`0RSKIQY`) | Utmify (Pixel 3 RURAL + UTMs) |
| `/an` | `an.html` | Layout Antigo (Dave) | `vdave.mp3` | **R$ 27,90** | `jxiib47t` | Utmify (Pixel 3 RURAL + UTMs) |
| `/consultor` | `consultor.html` | Layout Antigo (Dave) | `vdave.mp3` | **R$ 37,90** | `kg1a7jgt` | Utmify (Pixel 3 RURAL + UTMs) |
| `/2` | `2.html` | Layout Antigo (Dave) | `vdave.mp3` | **R$ 37,90** | `kg1a7jgt` | Meta Pixel Nativo (Rural 4, Rural 5 e Rural Dolar, sem Utmify) |
| `/entenda` | `entenda.html` / `entenda-sem-se-perder.html` | Dono da Terra (sem lucro) | `audio-pagina-...mp3` | **R$ 27,90** | `agwfds26` | Utmify (Pixel 3 RURAL + UTMs) |
| Upsell 1 | `upsell.html` / `upclientes.html` | Kit de Prospecção | - | **R$ 67,00** | `bet5bxrw` | Gateway Novark direto |
| Upsell 2 | `upsell2.html` | Negócio Rural do Zero | - | *A definir* | *Sem checkout* | Sem pixel (rascunho não vinculado) |

- **ARPU real:** R$ 33,03 (em 08/10/2026)
- **CPA real:** R$ 24 (em 08/10/2026)
- **Garantia:** 7 dias em todas as ofertas

---

## 🔄 Como Funciona (Fluxo Principal)

1. Tráfego (anúncios Meta, em `criativos/` e `criativos-entenda/`) leva à **página de vendas** (`index.html`, `w.html`, `an.html`, `consultor.html`, `2.html` ou `entenda.html`). Orçamento acima de R$ 200/dia.
2. O visitante ouve o áudio do hero (`nova-hero.mp3` na `/` e `/w`; `vdave.mp3` na `/an`, `/consultor` e `/2`), lê os benefícios, depoimentos e o passo a passo.
3. Clica no botão de checkout da oferta (R$ 27,90 ou R$ 37,90) e vai ao checkout Novark.
4. Após a compra, é apresentado ao **upsell** (`upsell.html` / `upclientes.html`).
5. A entrega é feita com os arquivos de `entregaveis-lucre/` (PDFs).

---

## 📱 Páginas e Seções

| Arquivo | Rota | Função e Configuração |
|---|---|---|
| `index.html` | `/` | **Página de vendas principal (versão nova)**: copy reescrita (25/10/2026), áudio `nova-hero.mp3` em 1.2x com autoplay, depoimentos na 2ª dobra, entrega de 3 itens + seção de bônus (`mockup-bonus.webp`). Ticket **R$ 27,90**, checkout Novark `jxiib47t`. Pixel Utmify e UTMs. Sem emojis |
| `w.html` | `/w` | **Duplicação da página principal nova (`index.html`) com checkout Wiven**: mantém layout novo, áudio `nova-hero.mp3`, ticket **R$ 27,90** e Pixel Utmify/UTMs. Checkout Wiven (`https://checkout.wiven.com.br/checkout/cmvtzzy2y07e701q3pwyg0mj3?offer=0RSKIQY`) |
| `an.html` | `/an` | **Versão com layout antigo (do Dave) no ticket de R$ 27,90**: áudio `vdave.mp3`, copy anterior, mockup clássico, checkout Novark `jxiib47t`. Pixel Utmify e UTMs |
| `consultor.html` | `/consultor` | **Versão com layout antigo (do Dave) no ticket de R$ 37,90**: áudio `vdave.mp3`, copy anterior, mockup clássico, checkout Novark `kg1a7jgt`. Pixel Utmify e UTMs |
| `2.html` | `/2` | **Versão com layout antigo (do Dave) isolada para teste de Meta Pixel nativo**: áudio `vdave.mp3`, copy anterior, ticket **R$ 37,90**, checkout Novark `kg1a7jgt`. **Sem Utmify**, com 3 Meta Pixels nativos (`2794376007657993`, `1088370370664674` e `1495289149453037`) e `InitiateCheckout` nativo no botão |
| `entenda.html` / `entenda-sem-se-perder.html` | `/entenda` | **Oferta "Entenda sem se perder"**: foco direto no dono da terra que quer regularizar seus próprios documentos (sem promessa de renda como consultor). Áudio `audio-pagina-entendasemseperder.mp3`, carrossel de 8 depoimentos de donos de terra, ticket **R$ 27,90**, checkout Novark `agwfds26`. Pixel Utmify e UTMs |
| `upsell.html` | Oferta especial pós-compra |
| `upclientes.html` | Upsell do kit para conseguir clientes |
| `upsell2.html` | **Upsell "Negócio Rural do Zero"** (página de oferta pós-compra, entregável `UPSELL_Negocio_Rural_do_Zero.pdf`). Ver seção abaixo |
| `membros/index.html` | `/membros` | **Área de Membros Web ("Formação Consultor Rural" - Ofertas de Lucrar)**: design minimalista estilo Apple Light/Dark em paleta Verde Floresta e `Plus Jakarta Sans`, **23 módulos ativos (70 aulas densas)** em 6 trilhas (com passo a passo completo tela a tela de emissão de Matrícula ONR, CCIR/DCR, CAFIR/CNIR/ITR/CND, ADA/IBAMA, CAR/SICAR, SIGEF, CAF e Certidões, modelos editáveis/copiáveis e 23 mensagens finais únicas sobre Jesus), ferramentas interativas (Calculadora de Honorários, Auditoria Cruzada e Simulador de Meta), trava de 7 dias (`dripDays: 7`) pós-compra e vitrine de Order Bumps/Combo (`fotl08p9`)/Upsell |
| `proprietario/index.html` | `/proprietario` | **Portal do Proprietário Rural ("Imóvel Rural em Dia - Entenda")**: área de membros dedicada para compradores do checkout `agwfds26` (`/entenda`), com OpenGraph próprio, linguagem 100% focada no dono da terra (sem falar de prospecção ou honorários), 3 trilhas adaptadas e ferramenta interativa "Diagnóstico do Meu Imóvel" |
| `api/auth.js`, `api/webhook.js`, `api/content.js`, `api/ai-consultant.js` | `/api/*` | **Backend Serverless (Vercel Functions) + Servidor Local (`server-membros.js` na porta `8090`)**: login por e-mail de compra + senha padrão `rural123`, webhook automático Novark ativo em produção (`Pedido Aprovado`, `Pedido Cancelado`, `Mudança de Status`, incluindo Combo dos 3 Order Bumps `fotl08p9`), banco dual Supabase REST (`ijozopseljwuoloqucvn`) + fallback local JSON (`data/members-db.json`). Endpoints de IA desativados por trava de ambiente até o lançamento futuro |
| `supabase-setup.sql` | - | **Setup SQL completo do Supabase**: tabelas `alunos_membros`, `webhook_logs` e `config_modulos_drip`, políticas RLS e `GRANT SELECT, INSERT, UPDATE, DELETE` no esquema `public` |
| `politica-privacidade.html` / `termos-de-uso.html` | Páginas legais |
| `entregaveis-lucre/` | Material entregue ao cliente (PDFs novos da oferta Entenda). As pastas antigas m1 a m5, OB e guia HTML foram para `_antigos_backup/` (ignorada no git) |
| `criativos/` | Criativos de anúncio da oferta principal (ignorada no git) |
| `criativos-entenda/` | Criativos da oferta Entenda: `1.jpg` a `15.jpg` (numeração própria), mais `descartados/` |
| `roteiro-audio-entenda.txt` / `depoimentos-index.txt` | Roteiro do áudio da `/entenda` e textos de depoimentos |

**Seções do `index.html` (versão nova):** Hero (H1 com "R$800 a R$2.400 por mês" e "sem precisar de experiência" em verde, subtítulo curto, áudio com autoplay em 1.2x, seta "Veja quem já está faturando"; sem botão e sem mockup) → Depoimentos (carrossel, 2ª dobra) → Por que esse serviço (6 cards) + "O que você perde" → Como funciona (3 passos) → A entrega principal (3 itens) → Bônus (4 itens, `mockup-bonus.webp`) → Oferta (preço e botão) → Garantia 7 dias → FAQ → Autor → Rodapé. Textos centralizados, sem emojis, sem navbar fixa e sem faixa animada. Roteiro do áudio antigo em `roteiro-audio-hero-consultor.txt`.

---

## 🚀 Upsell "Negócio Rural do Zero" (`upsell2.html`)

Página pós-compra para quem comprou o **ângulo consultor** (`/`). Entregável: `entregaveis-lucre/UPSELL_Negocio_Rural_do_Zero.pdf`.

- **Promessa:** quem aprendeu a regularizar mas não tem estrutura vai continuar vendendo serviço avulso e começando do zero todo mês.
- **O que entrega:** marca de Consultor Rural e perfil profissional no Instagram; WhatsApp Business, catálogo e pacotes de serviços; como cobrar, receber e fazer o pós-venda; parcerias com imobiliárias, contadores e corretores; indicações, carteira de clientes e renda recorrente.
- **Estrutura da página:** banner vermelho fixo ("Sua compra pode não estar completa") → pill "Última chance" → H1 → carrossel de 3 depoimentos estilo Instagram DM (nomes borrados) → caixa de oferta → botão **QUERO ADICIONAR** → link de recusa → botão fixo no rodapé.
- **Garantia:** 7 dias.
- **Pendências do arquivo (conferir antes de usar):**
  - **Não mostra preço** em lugar nenhum.
  - Os botões apontam para `?pagar=1` e `?pular=1`, e **não há script** que trate esses parâmetros nem link de checkout. Hoje o botão não leva a lugar nenhum.
  - **Sem pixel** e sem Utmify.
  - O `<html>` não tem `<meta charset>` nem `viewport`, o que pode quebrar acentos e o layout no celular.
  - Os depoimentos citam resultados (3 clientes na semana, R$ 1.200) e têm cara de roteiro. Só manter se forem reais e autorizados.

---

## Recurso Salvo para Lancamento Futuro: Consultor Rural IA 24h

A pedido do usuario (03/11/2026), o **Consultor Rural IA 24h** (chat tira-duvidas de regularizacao rural planejado como assinatura mensal recorrente de R$ 19,90/mes) foi **100% ocultado e desativado** nas interfaces `/membros` e `/proprietario` e nas APIs `/api/content` e `/api/ai-consultant`, mas **todo o codigo foi preservado intacto** para ser lancado em breve sem retrabalho.

### Onde o codigo esta salvo
1. **Backend do Chat e Firewall (`api/ai-consultant.js`):** contem o firewall de 7 camadas (bloqueio de payloads binarios/hex, SQLi, XSS, prompt injection e limite de tamanho), o motor especialista nativo de regularizacao rural (CCIR, DCR, ITR, CAFIR, CNIR, ADA, CAR/SICAR, SIGEF, Pronaf e precificacao) e a integracao pronta com Gemini ou OpenAI. Atualmente retorna `HTTP 503` ate que `ENABLE_AI_CONSULTANT=true` seja definido nas variaveis de ambiente.
2. **Filtro de Catalogo (`api/content.js`):** oculta automaticamente a trilha `ia` e o `mod-24` (`acesso_ia_consultor`) enquanto `process.env.ENABLE_AI_CONSULTANT !== 'true'`.
3. **Webhook de Assinatura Mensal (`api/webhook.js`):** ja contem toda a regra de ativacao e cancelamento recorrente via `CHECKOUT_IA_URL` / coluna `acesso_ia_consultor` no Supabase (se o aluno nao renovar a mensalidade da IA, perde apenas o acesso ao chat da IA e mantem todos os outros modulos ativos).
4. **Logica Frontend (`membros/app.js`):** controlada pela constante `const ENABLE_AI_CONSULTANT = false;` (linha 9). Todo o chat estilo Apple Intelligence, pilulas de casos prontos (Consultor e Proprietario), banner de desbloqueio e redirecionamento continuam prontos no arquivo.
5. **Interface HTML (`membros/index.html` e `proprietario/index.html`):** a secao `#view-ai` e o botao `#nav-btn-ai` permanecem salvos no DOM com a classe `hidden`.
6. **Modulo 24 Completo (`build_rich_courses_db.py`):** as 3 aulas completas do Modulo 24 ("Guia Oficial do Consultor Rural IA 24h") e sua mensagem final exclusiva estao salvas na funcao `build_custom_ia_module()` controlada pela flag `ENABLE_AI_MODULE = False`.

### Passo a passo rapido para reativar quando for lancar
1. **Na Novark e Vercel:** criar o produto de assinatura mensal (ex: R$ 19,90/mes), marcar no Webhook `WEBH - RURAL` e adicionar na Vercel `CHECKOUT_IA_URL=<link_novark>` e `ENABLE_AI_CONSULTANT=true` (opcionalmente `GEMINI_API_KEY` ou `OPENAI_API_KEY`).
2. **No banco de aulas (`api/_lib/courses-db.js`):** alterar `ENABLE_AI_MODULE = True` no gerador `build_rich_courses_db.py` e rodar `python3` para republicar o `mod-24`.
3. **No Frontend (`membros/app.js` e HTMLs):** mudar `const ENABLE_AI_CONSULTANT = true;` na linha 9 de `membros/app.js`, remover `hidden` de `#nav-btn-ai` em `membros/index.html` e `proprietario/index.html`, e restaurar o botao secundario do hero caso deseje destaque no topo.
4. **Deploy:** fazer `git commit` e `git push origin main`.

---

## 📈 Rastreamento

**Aprendizado:** vários scripts de pixel da Utmify na mesma página se sobrescrevem, porque todos usam o mesmo `window.pixelId`. Por isso o IC e o page view falhavam. A solução foi usar **um único pixel da Utmify** com os pixels da Meta vinculados no painel.

### Página `/` (`index.html`)
- **Utmify (ativo):** 1 script de pixel ("3 RURAL", ID `6ac42ec78067b4499c7d80ba`) e o script de UTMs (`latest.js`), no `<head>`.
- **A `/entenda` usa o mesmo pixel e as mesmas UTMs da `/`** (commit `df38231` restaurou o head idêntico ao do `index.html`).
- **Pixels da Meta vinculados na Utmify:** `1395221742238189`, `885028918027856 (Rural 2)` e `1495289149453037 (Rural Dolar)`.
- **IC:** regra "Contém texto" com `REGULARIZAR POR R$27,90`, que deve bater **exatamente** com o texto do botão `#btn-checkout`. Se mudar o texto do botão, atualize a regra na Utmify. A classe `btn-checkout-utmfy` continua no botão, mas não é usada por essa regra.

### Página `/2` (`2.html`)
- **Sem Utmify e sem UTMs.** As vendas dessa página chegam sem atribuição de campanha.
- **Meta Pixel nativo (ativo):** um único código base com 3 pixels, **RURAL 4** (`2794376007657993`), **RURAL 5** (`1088370370664674`) e **RURAL DOLAR** (`1495289149453037`), e um só `fbq('track','PageView')` (evita PageView duplicado), mais os `noscript` dos três.
- **IC:** `onclick="fbq('track','InitiateCheckout');"` no botão `#btn-checkout`, que vale para os 3 pixels. Na Novark, a opção **"Disparar InitiateCheckout na abertura"** deve ficar **desligada**, para não contar o IC em dobro.
- **Compra:** os pixels (`1088370370664674`, `2794376007657993` e `1495289149453037`) devem estar cadastrados na Novark no produto `kg1a7jgt` com "Disparar InitiateCheckout na abertura" desligado para enviar a compra de volta para todos.

### Aprendizado importante para próxima instalação do Wexor.fy junto com Utmify (06/11/2026)
- As páginas foram **restauradas para o backup pré-Wexor (`27a56d5`)**.
- **Regra obrigatória quando reinstalarmos o Wexor.fy junto com a Utmify:** se a Utmify (ou o HTML da `/2`) já dispara os Pixels da Meta no navegador, o Wexor.fy **NÃO PODE** ter IDs de Pixel da Meta nem no `CFG.metaPixelIds` (painel do Wexor.fy) nem no `window.wexorMetaPixels` (dentro do snippet HTML). Se tiver, o Wexor.fy injeta o `fbevents.js` e dispara `fbq('init', ...)` + `fbq('track', ...)` por conta própria com outro `eventID`, gerando eventos duplicados na Meta e disparando o detector `MetaPixelDetector` da Utmify.

### Desativados / removidos
- Pixels 1, 2 e 3 (Dólar) separados da Utmify: removidos (substituídos pelo pixel único).
- Meta Pixel antigo (`1395221742238189` e `885028918027856`) comentado no `index.html`: removido.

---

## 🎨 Criativos e Ideias de Anúncio

**Pastas:** `criativos/` → `imagens/novos`, `imagens/rodados` (e `rodados/venderam bem`) e `videos/` (`V01 - RURAL.mp4`, `V02 - RURAL.mp4`); e `criativos-entenda/` (oferta nova).

### Regras de produção (também na skill `/criativos-meta-ads`)
- **Sempre 1:1 (1080x1080)**, sem exceção.
- **Nunca colocar data** em nenhum criativo.
- **Sem estilo bloco de notas / Apple Notes** (o usuário não quer).
- **Notícia não vendeu**: não usar como aposta principal.
- **Twitter/X vendeu mais**, mas nunca 100% nele (máximo 1 a 2 por lote).
- **Formatos que venderam bem** (`rodados/venderam bem`): 17 Twitter/X, **19 Produto Mockup**, **20 Bold Overlay**, **22 Flatlay Documentos**. Priorizar variações desses.
- **Numeração sequencial**: cada criativo vira `NN.jpg` com o próximo número da sequência. **Pasta `criativos/imagens`: último número rodado foi 162** (em `rodados/`). Novos criativos na raiz de `criativos/imagens/`: **162 a 166** (lote estilo post de notícia de Instagram, 28/10), **167 a 171** (lote estilo Geração de Criativo Advantage+ Meta Ads, 28/10), **172 a 181** (lote 10 formatos campeões variados, 29/10), **182 a 186** (lote 5 conceitos inéditos: Pasta Acorrentada vs. Regularizado, Mural de Cortiça com Post-it, Drone com Pins de Preço por Propriedade, Caderno Espiral Manuscrito e História Dividida Produtor vs. Consultor, 29/10), **187 a 236** (sessão de 50 criativos 1:1 distintos para a oferta principal, 02/11, divididos em 10 lotes de 5: 35 sem preço e 15 com preço R$ 27,90 nos números 188, 193, 194, 201, 206, 211, 214, 221, 223, 230, 232, 233, 234, 235 e 236, cobrindo adaptações das 20 referências de `criativos/inspiracoes/`, jornal impresso e notícia sem marcas reais, UGC nativo com seta, Instagram Stories, Twitter/X, Feed/Comparativo/Checklist, prints de WhatsApp, notificações Pix e Oferta Direta com Mockups) e **237 a 256** (lote de 20 releituras criativas 1:1 a partir das ideias de `criativos/inspiracoes/` em novos cenários e objetos sem copiar a aparência literal, 02/11: 14 sem preço e 6 com R$ 27,90 nos números 238, 243, 248, 251, 255 e 256) e **257 a 261** (lote de 5 criativos 1:1 1080x1080 sem preço focados exclusivamente na nova plataforma e área de membros online, 04/11, inspirados nos mecanismos de `insp22`, `insp3`, `insp16`, `insp12` e `insp21`). Próximo número livre: 262.
- **Pasta `criativos-entenda/`: numeração própria, começa em 1. Último número rodado foi 19** (em `rodados/`). Criativos prontos para rodar na raiz: **20 e 21**, e novos adicionados: **22 a 39**. Próximo número livre: 40.
- Garantia correta: **7 dias**.

### Histórico de lotes
| Números | Conteúdo | Resultado |
|---|---|---|
| 30 a 52 | Lotes anteriores (inclui `rodados/` 48 a 52) | Parte vendeu (pasta `venderam bem`) |
| `criativos-noticia` e `-v2` (Downloads, 10 peças) | Estilo notícia (portal, TV, jornal, app, reportagem) | **Não vendeu** |
| **53 a 57** | Twitter/X renda (53), Twitter/X dor (54), bloco de notas (55, rejeitado), comparação advogado vs passo a passo (56), curiosidade contadores (57) | A testar |
| **58 a 62** | Mockup casa (58), mockup herança/venda (59), bold overlay aperto de mão (60), flatlay ITR recorrente (61), pilha de produtos (62) | A testar |
| **90 a 94** | PNGs em `rodados/` (nomes de campanha IMG-9x na Utmify) | Rodados |
| **95 a 99** | Bold Overlay primeiro cliente (95), Produto Mockup consultor (96), Flatlay herança travada (97), WhatsApp depoimento fictício (98), Stories sem faculdade (99) | A testar |
| **105 a 109** | Stories com foto (estilo 18) | A testar |
| **120 a 129** | Twitter/X renda (120) e comparação com despachante (129), Produto Mockup kit (121) e tabela de preços (127), Bold Overlay fazendeiro paga (122) e sem faculdade (124), Flatlay ITR recorrente (123) e herança travada (128), Antes e Depois (125), lista de objeções (126). Sem prints reais (não havia). Cópia em `~/Downloads/criativos-board-4/` | A testar |
| **136 a 140** | Nativos: UGC foto com seta (136), print de post de grupo do Facebook (137), lista de preços escrita à mão (138), card de story só texto (139), notificações de WhatsApp e Pix (140). Valores e nomes são ilustrativos | A testar |
| **141 a 146** | Estilo Pixar 3D com copy direta: fazendeiro paga até R$ 1.500 (141), seu vizinho precisa de você (142), antes e depois da papelada (143), trabalhe de casa com o campo (144), imóvel sem regularização (145), seu primeiro cliente (146). No 144 aparece a logo da Apple no laptop | A testar |
| **Entenda 1 a 5** | Formatos que vendem: Produto Mockup (1 e 4), Bold Overlay (2), Flatlay com painel preto (3) e UGC com seta (5) | A testar |
| **Entenda 6 a 10** | Stories naturais (caixinha de perguntas, enquete, quiz, slider, resposta). **Usuário reprovou a copy da 6 (caixinha) e a enquete da 7; gostou da ideia da 7, mas não da execução**; a 10 foi refeita mais realista | A testar |
| **Entenda 11 a 15** | Stories com slider de emoji (estilo do 9, **aprovado pelo usuário**), cada um com pergunta, cena e resposta diferentes | A testar |

Copias em `~/Downloads/criativos-board/` (53 a 57), `~/Downloads/criativos-board-2/` (58 a 62) e `~/Downloads/criativos-board-3/` (95 a 99).

### Ângulos já usados e ideias novas
- **Renda:** fazendeiro paga de R$ 300 a R$ 1.500 pelo serviço (base: pesquisa de mercado).
- **Dor do dono de terra:** CCIR, ITR e CAR em dia destravam venda, herança e crédito.
- **Quebra de objeção:** sem faculdade, sem advogado, 100% online.
- **Recorrência:** o ITR vence todo ano, o cliente volta.
- **Comparação:** advogado/despachante (R$ 300 a R$ 1.500) vs passo a passo (R$ 27,90).
- **Valor:** pilha de produtos e bônus.
- **Sem faculdade / sem escritório:** trabalho direto do celular (criativo 99).
- **Herança travada:** CCIR bloqueando herança (criativo 97).
- **Primeiro cliente:** onde achar o primeiro cliente (criativo 95) e depoimento de WhatsApp fictício (criativo 98).
- **Entenda (sem promessa de lucro):** entender e organizar, "pare de pular de site em site", "cada documento parece falar uma língua diferente", CCIR/ITR/CAR sem enrolação. Não reaproveitar o que o concorrente (Descomplica Rural) usa: a referência foi só de formato, sem copiar a marca.
- **Ainda não testados:** prova com prints reais de clientes e antes e depois.

---

## 🏗️ Arquitetura e Tech Stack

| Camada | Tecnologia |
|---|---|
| Front | HTML + CSS + JS vanilla |
| Deploy | GitHub → Vercel |
| Pagamento | Novark |
| Tracking | Utmify (pixel único) na `/` e na `/entenda`, e Meta Pixel nativo na `/2` |

---

## 🧠 Conselho de Marketing (`founder/`)

Rodado com `/marketing-board-completo` em 08/10/2026. Relatório completo: `founder/RELATORIO-COMPLETO.md` (cálculo em `founder/cfo.md` e `founder/numbers.json`).

- **Veredito: APERTADO** (lucrativo, pouca folga) com CPA R$ 24 e ARPU R$ 33,03.
- **Alavanca nº 1:** subir o ARPU (o upsell quase não vende). **Nº 2:** baixar o CPA com os criativos novos. **Nº 3:** testar preço do front (R$ 37 a R$ 47).
- **Recomendação:** não escalar agora; baixar o CPA para ~R$ 20 e testar o upsell antes.
- Os "clientes simulados" são estimativa de IA, não dado real.

---

## 🧩 Skills usadas neste projeto

| Skill | Uso |
|---|---|
| `/criativos-meta-ads` | Gera criativos 1:1 com as regras acima |
| `/copywriting` | Copy (headline, subtítulo, CTA) dos criativos |
| `/marketing-board-completo` | Conselho completo (11 skills `founder-*`) com relatório |
| `/analista-trafego` | Agora é o Claude Ads (substituiu a antiga); análise de tráfego pago |
| `/motion-video-site` | Vídeo de lançamento a partir do site (instalada, ainda não usada) |
| `/produto-checkout-botao` | Classe de tracking `btn-checkout-utmfy` no botão final (hoje o IC da Utmify usa a regra de texto) |

---

## 📋 Últimas Atualizações

| Data | Mudança |
|---|---|
| 06/11/2026 | **Nova Aula 01 no Módulo 01 (`mod-01-aula-00` em `api/_lib/courses-db.js`):** Criada a aula de abertura *"Precisa de Faculdade para Emitir CCIR, ITR ou CAR?"* explicando que o preenchimento de rotina nos sistemas oficiais não exige diploma superior (proprietário ou prestador de serviços) e detalhando as únicas 3 exceções que exigem CREA/CFT com ART/TRT (Georreferenciamento no SIGEF, plantas/laudos técnicos assinados e PRADA), com blocos dinâmicos por perfil (`data-role-only` em `membros/app.js` para `/membros` e `/proprietario`), preservação dos IDs `mod-01-aula-01` a `03` dos 908 alunos e atualização de `33` para `34 aulas` em `v2/index.html` (total geral: 70 aulas). |
| 06/11/2026 | **Adição do 3º Meta Pixel nativo (`1495289149453037`) na página `/2` (`2.html`):** Incluído `fbq('init', '1495289149453037')` e respectivo `<noscript>` junto aos pixels `2794376007657993` e `1088370370664674`, mantendo disparo único de `PageView` e `InitiateCheckout` no botão `#btn-checkout`, além de OpenGraph próprio para `/2` e limpeza de travessão/emoji residuais. |
| 05/11/2026 | **Importação Histórica de 903 Compradores Rurais no Supabase (`alunos_membros` = 908 registros):** Processado o relatório completo da Novark (`vendas_2026-11-05.csv`, 944 linhas: 931 vendas rurais pagas desde 23/09/2026 e 13 vendas de outros nichos excluídas). Inseridos **853 alunos antigos faltantes** com senha padrão `rural123` (`scrypt` individual) e atualizados os **50 já existentes** sem sobrescrever senhas nem progresso, mapeando pelo produto e valor exato quem comprou `OB1` (236), `OB2` (249), `OB3` (250), `Upsell / Primeiros Clientes` (12) e `Entenda / proprietario` (20), além da `data_primeira_compra` real (772 alunos já com mais de 7 dias destravados na hora). Adicionado também reconhecimento automático de `Primeiros Clientes` e `Linha de Crédito Rural` no `api/webhook.js`. |
| 04/11/2026 | **Lote de 5 Criativos da Plataforma / Área de Membros (`257.jpg` a `261.jpg`) + VSL 9:16 na `/v2`:** Comprimida a VSL vertical em `v2/vsl-rural.mp4` (9,7 MB H.264 `yuv420p` + poster `vsl-poster.webp`) com player customizado na `/v2` publicada em produção. Gerados e auditados individualmente 5 novos criativos `1:1` (`1080x1080` JPEG, 100% sem preço na arte para uso tanto na `/v2` de R$ 37,90 quanto na `/` de R$ 27,90) em `criativos/imagens/`, focados exclusivamente nos módulos, ferramentas interativas e modelos copiáveis da área de membros (`257` inspirado em `insp22`, `258` em `insp3`, `259` em `insp16`, `260` em `insp12` e `261` em `insp21`; `257` regerado para remover marca na tampa do tablet). Próximo número livre atualizado para `262`. |
| 04/11/2026 | **Teste de conversao da pagina principal (`/v2`, R$ 37,90 -> `kg1a7jgt`):** funil Utmify de 7 dias (4.453 cliques, 4.046 views, 422 ICs = 10,4% das views, 232 vendas iniciadas, 128 aprovadas; CPA R$ 32,84, ROAS 1,06) mostrou 3 degraus fracos multiplicados: view para IC (10,4%), IC para venda iniciada (55%) e iniciada para aprovada (55%). Criada a variante `v2/index.html` (URL limpa `/v2`, `noindex`, OG proprio) configurada no ticket **R$ 37,90** com checkout Novark `https://pay.novarkbr.com/kg1a7jgt` (`REGULARIZAR POR R$37,90`), botao depois dos depoimentos levando para `#oferta`, secao `O que voce recebe` e oferta reescritas para descrever a area de membros (11 modulos, 33 aulas, 3 ferramentas) e FAQ corrigido (nao e mais PDF). Microsoft Clarity instalado em `/` e `/v2` com `Project ID` pendente (placeholder `SEU_ID_CLARITY`, variavel `variante` = `controle` ou `v2`). Adicionado cache de `mp4` no `vercel.json` aguardando upload da VSL. **Atencao no Utmify:** ajustar a regra de IC de `"REGULARIZAR POR R$27,90"` para `"REGULARIZAR POR R$"` para rastrear tanto `/` (R$ 27,90) quanto `/v2` e `/consultor` (R$ 37,90). **Pendencia de coerencia:** a pagina `/` promete `Tabela Sugerida de Precos`, `Bonus 1: Modelo de Contrato para Consultores` e `Bonus 2: Contrato de Prestacao de Servico`, mas na area de membros esses itens existem apenas nos Order Bumps (mod-14 e mod-17), nao na trilha principal. |
| 03/11/2026 | **Blindagem Completa de Seguranca (`/saas-1seguranca-total` + `/saas-seguranca-apipublic` + `/saas-seguranca-inicio-auth`):** Corrigidos todos os 12 achados de seguranca: (1) banco de aulas movido de rota estatica publica para `api/_lib/courses-db.js` (privado no servidor, entregue somente via `/api/content` autenticado); (2) removidos `entregaveis/*.pdf` e `founder/*` do indice Git e criado `.vercelignore` bloqueando `.env*`, `*.md`, `*.sql` e pastas internas; (3) bloqueados endpoints admin (`PUT /api/auth` `admin_save_user`, `admin_save_drip` e `GET /api/auth` `adminData`) com revalidacao de `isAdmin` no banco; (4) desativado `quick_switch` e contas demo para visitantes em producao; (5) removidos fallbacks hardcoded de `AUTH_SECRET`, `WEBHOOK_SECRET` e `ADMIN_PASSWORD`, e removidos bypasses por `?email=` / `body.email`; (6) cookies `rr_session` com `HttpOnly; Secure; SameSite=Lax` sem retorno de token em JSON ou query string; (7) protecao anti-enumeracao em tempo constante no login (`8 tentativas / 10 min`), log de eventos suspeitos (`logSecurityEvent`) e headers `CSP`, `HSTS` e `Permissions-Policy` em `vercel.json`. |
| 03/11/2026 | **Auditoria Completa dos 23 Módulos (69 Aulas) + Portal `/proprietario` no Ar + Ocultação Temporária do Consultor IA:** Revisados e expandidos todos os 23 módulos ativos (`api/_lib/courses-db.js`, 69 aulas completas sem páginas curtas ou resíduos de impressão), incluindo tutoriais passo a passo tela a tela de emissão de todos os documentos rurais nos sistemas oficiais (Matrícula ONR `registrodeimoveis.org.br`, CCIR e DCR `sncr.serpro.gov.br` / `dcr.incra.gov.br`, CNIR `cnir.serpro.gov.br`, CAFIR/e-CAC, PGD ITR e CND Rural `gov.br/receitafederal`, ADAWeb e Certidão de Embargos `servicos.ibama.gov.br`, CAR/SICAR `car.gov.br`, SIGEF `sigef.incra.gov.br` e CAF `caf.mda.gov.br`), além de 23 mensagens finais únicas sobre Jesus. Publicado `proprietario/index.html` (`/proprietario`), integrado Webhook Novark em produção e desativado/escondido 100% do Consultor Rural IA (`ENABLE_AI_CONSULTANT = false`), mantendo todo o código documentado para lançamento futuro. |
| 02/11/2026 | **Lote de 20 Releituras Criativas (237.jpg a 256.jpg):** Gerados e inspecionados visualmente 1 por 1 mais 20 criativos quadrados (1:1) em `criativos/imagens/`, extraindo os mecanismos visuais e persuasivos das 20 referências de `criativos/inspiracoes/` em novos cenários, objetos e paletas sem copiar a aparência literal (6 peças com `R$ 27,90` nos números 238, 243, 248, 251, 255 e 256, e 14 peças sem preço na tela; `250.jpg` e `255.jpg` regerados para eliminar rótulos em inglês). Próximo número livre atualizado para `257`. |
| 02/11/2026 | **Sessão de 50 Criativos Variados (187.jpg a 236.jpg):** Gerados e auditados individualmente 50 novos criativos quadrados (1:1) em `criativos/imagens/` para a oferta Consultor Rural, com 30% (15 peças) exibindo `R$ 27,90` e 70% (35 peças) sem preço na tela, cobrindo 10 famílias visuais distintas inspiradas em `criativos/inspiracoes/` e `/criativos-meta-ads` (zero marcas reais de imprensa, zero datas, zero travessões e 11 peças regeradas na auditoria visual). Próximo número livre atualizado para `237`. |
| 30/10/2026 | **Área de Membros Web (`/membros`) + Backend (`/api/*`) + Supabase SQL (`supabase-setup.sql`) + Consultor Rural IA 24h:** Criada a área de membros estilo Apple + Netflix em paleta verde com todos os 21 entregáveis transcritos em 24 módulos (`membros/data/courses-db.js`), login por e-mail de compra + senha `rural123`, webhook (`/api/webhook`), trava automática de 7 dias pós-compra, painel admin e chat de IA blindado contra payloads binários/hex/SQLi/XSS/prompt injection. |
| 30/10/2026 | **Entregáveis em PDF dos 3 Order Bumps (9 PDFs, 99 páginas no total):** Criados 3 PDFs de 11 páginas para cada Order Bump (`ob1-consultor-profissional`, `ob2-modelos-prontos` e `ob3-guia-20-servicos`) em `entregaveis-lucre/`, com fontes HTML e `style.css` em `fonte-pdfs/order-bumps/`. |
| 29/10/2026 | **Criação da rota `/w` (`w.html`):** Duplicação da página principal nova (`index.html`) com o mesmo layout novo, áudio `nova-hero.mp3`, ticket R$ 27,90 e Pixel Utmify, criada para teste de novo checkout. Rewrite adicionado no `vercel.json`. Tabela geral de páginas e tickets atualizada. |
| 28/10/2026 | **Criação da rota `/an` (`an.html`):** Cópia da versão com layout do Dave (`vdave.mp3`, mockup clássico) no ticket original de R$ 27,90, com o checkout `jxiib47t` e Pixel Utmify idêntico à principal. |
| 28/10/2026 | **Lotes de Criativos 162 a 186:** Criativos gerados para a oferta principal: 162 a 166 (estilo notícia Instagram), 167 a 171 (estilo Advantage+ Meta) e 172 a 186 (formatos campeões e 5 conceitos inéditos). Salvos em `criativos/imagens/`. |
| 22/10/2026 | **3 Vídeos Criativos (Abordagem 1 - Consultor Rural):** Gerados em 1080x1920 (9:16 vertical) com locução neural madura (`pt-BR-AntonioNeural`), b-roll real em câmera lenta, legendas contrastadas, trilha acústica e CTA com botão oficial `REGULARIZAR POR R$27,90`. Salvos em `criativos/videos/` e em `~/Downloads/`. |
| 20/10/2026 | **Criativos 136 a 146** (oferta principal, consultor): 136 a 140 nativos (UGC, post, lista à mão, story, notificações) e 141 a 146 estilo Pixar 3D |
| 19/10/2026 | **Criativos 120 a 129** (oferta principal, consultor): 10 formatos/ângulos, 123 e 128 refeitos para tirar data e texto em inglês |
| 16/10/2026 | **Upsell "Negócio Rural do Zero"** (`upsell2.html`) documentado; falta preço, checkout e tracking |
| 15/10/2026 | **Criativos Entenda**: lote 1 a 5 (formatos que vendem), 6 a 10 (Stories) e 11 a 15 (slider de emoji); pasta `criativos-entenda/` com numeração própria; skill `/criativos-meta-ads` atualizada |
| 15/10/2026 | **Página `/entenda`** no ar (áudio, 8 depoimentos, Utmify igual ao index), rota no `vercel.json` (commits `6b6cb6b`, `deff48b`, `df38231`) |
| 15/10/2026 | **Entregáveis novos em PDF** (Manual, Modelo de Retificação, Guia de Crédito Rural, passo a passo CCIR/ITR/CAR); pasta `entregaveis` virou `entregaveis-lucre`; antigos em `_antigos_backup/` |
| 13/10/2026 | **Página `/2`** (`2.html`) sem Utmify, com Meta Pixels RURAL 4 (`2794376007657993`) e RURAL 5 (`1088370370664674`), PageView e IC no botão |
| 13/10/2026 | **Pixel único da Utmify ("3 RURAL")** na `/`, com UTMs, no lugar dos 3 pixels separados (que se sobrescreviam) |
| 12/10/2026 | **Criativos 95 a 99** (5 formatos diferentes; 98 refeito com conversa mais natural) |
| Out/2026 | **Relatório do Conselho** com números reais (CPA R$ 24, ARPU R$ 33,03) |
| Out/2026 | **Criativos 53 a 62** (2 lotes de 5, sem notícia, formatos 19/20/22 e Twitter/X) |
| Out/2026 | Skill de criativos: sempre 1:1, sem data, sem bloco de notas, numeração sequencial |
| Out/2026 | Skills instaladas: `/marketing-board-completo`, `/motion-video-site`; `/analista-trafego` substituída pelo Claude Ads |
| Out/2026 | Classe `btn-checkout-utmfy` no botão de checkout |
| Out/2026 | Pixel 3 Dólar da Utmify |
| Out/2026 | Pixels Utmify (Rural 1, Rural 2, UTMs) e Meta Pixel desativado |
| Out/2026 | Criativos estilo notícia (2 lotes de 5), que não venderam |
| Set/2026 | Segundo pixel Meta (teste A/B), correção de acentuação, novo título e botão fixo no rodapé |

---

## ⚠️ Pontos de Atenção

- **Checkout da `/entenda`:** configurado com checkout próprio da Novark (`https://pay.novarkbr.com/agwfds26`).
- **Depoimentos da `/entenda`:** foram inseridos a pedido do usuário, que afirmou serem de clientes reais e autorizados. Os textos têm cara de roteiro e citam "aulas"; vale validar a origem para não gerar risco de prova social falsa.
- **Git pendente:** `entregaveis/` aparece como apagada (os PDFs eram versionados) e `entregaveis-lucre/` e `criativos-entenda/` ainda não estão no `.gitignore`. Evite `git add -A` para não publicar material pago no GitHub.
- Criativos Entenda saem em 1024x1024 (limite do gerador), abaixo de 1080x1080.
- `index.html`: comentário mal formado na linha ~668 (`<!-9. OFERTA->`) e um `</div>` sobrando na linha ~694. Não afetam o funcionamento.
- **Próximos passos:** (1) teste do upsell em 09/10, e depois recalcular o conselho; (2) subir os criativos 53 a 62 em teste e cortar os piores em 3 a 4 dias; (3) confirmar a taxa real do gateway Novark; (4) entender de onde vem o ARPU de R$ 33,03, que é maior que o front.
- As pastas `founder/` e `entregaveis/` não devem ir para o GitHub. Os criativos 53 a 62 e 95 a 99, e o relatório, ainda não foram commitados.
- `2.html` é uma cópia do `index.html`: qualquer mudança de conteúdo precisa ser repetida nos dois arquivos.
- Na Novark, "Disparar InitiateCheckout na abertura" deve ficar **desligado** (o IC da `/2` sai do botão, e o da `/` sai da Utmify).

---

*Gerado pelo Antigravity — `/projeto-entendimento`*
