# 📊 Projeto Entendimento — Oferta 13 (Imóvel Rural em Dia)

> Documento de referência rápida para entender o projeto, a oferta e a estrutura.
> Atualizado em: 2026-10-19

---

## 🧭 Visão Geral

Funil de venda direta de infoprodutos de **regularização de imóvel rural (CCIR, ITR e CAR)**, com **duas ofertas** no mesmo site: a principal, com ângulo de **renda extra como Consultor Rural** (`/`), e a nova **"Entenda sem se perder"** (`/entenda`), com ângulo de **entender e organizar os próprios documentos**. Site estático (HTML/CSS/JS puro), sem framework.

- **Pasta local:** `/Users/gustavoaugusto/Desktop/oferta13`
- **Repositório:** https://github.com/AuguxtoGt/oferta-rural (branch `main`)
- **Hospedagem:** Vercel (`vercel.json` com `cleanUrls`)
- **Site no ar:** https://regularizerural.vercel.app/ (página `/`, com Utmify), https://regularizerural.vercel.app/2 (página `/2`, com Meta Pixel) e https://regularizerural.vercel.app/entenda (nova oferta, com Utmify, rota via rewrite no `vercel.json`)
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

**Preço:** R$ 27,90 (de R$ 68,91), garantia de 7 dias. Os dados de 2026 do manual (ITR de 10/08 a 30/09/2026, multa de 1% ao mês com mínimo de R$ 50, CCIR liberado em 19/05 com taxa até 17/06) vêm de pesquisa web. A parte de Plano Safra ficou sem valores fixos, de propósito.

---

## 💰 Planos e Preços

| Item | Valor |
|---|---|
| Oferta principal | **R$ 27,90** (de R$ 68,91), pagamento único |
| **ARPU real** | **R$ 33,03** (informado em 08/10/2026) |
| **CPA real** | **R$ 24** (média, informado em 08/10/2026) |
| Sobra por venda | ~R$ 5,88 (18%), CPA de empate ~R$ 29,88 (taxa do gateway estimada) |
| Garantia | 7 dias, devolução de 100% |
| Upsell | Kit de Prospecção por R$ 67 (de R$ 147), `upsell.html` e `upclientes.html`, checkout `bet5bxrw`. **Vendeu só 3 até agora**; teste de melhoria previsto para 09/10 |

---

## 🔄 Como Funciona (Fluxo Principal)

1. Tráfego (anúncios Meta, em `criativos/` e `criativos-entenda/`) leva à **página de vendas** (`index.html` ou `entenda.html`). Orçamento acima de R$ 200/dia.
2. O visitante ouve o áudio (`vdave.mp3`), lê os benefícios, depoimentos e o passo a passo.
3. Clica em **"REGULARIZAR POR R$27,90"** e vai ao checkout Novark.
4. Após a compra, é apresentado ao **upsell** (`upsell.html` / `upclientes.html`).
5. A entrega é feita com os arquivos de `entregaveis-lucre/` (PDFs; a pasta se chamava `entregaveis/`).

---

## 📱 Páginas e Seções

| Arquivo | Função |
|---|---|
| `index.html` | **Página de vendas principal (`/`)**, versão nova reescrita (25/10/2026): sem navbar fixa, sem botão no hero, headline "Lucre de R$800 a R$2.400 por mês...", áudio `nova-hero.mp3` em 1.2x com autoplay, depoimentos na 2ª dobra, bloco "O que você perde", entrega principal enxuta e seção de Bônus (`mockup-bonus.webp`). Sem emojis. Pixel Utmify e UTMs mantidos |
| `consultor.html` | **Versão antiga da página principal**, agora em `/consultor` (via `rewrite`). Mesmo pixel Utmify e UTMs; áudio `vdave.mp3`, faixa rolante e copy anterior |
| `2.html` | Cópia da página de vendas (`/2`), sem Utmify, com Meta Pixel nativo. **Mudanças no `index.html` precisam ser repetidas aqui** |
| `entenda-sem-se-perder.html` / `entenda.html` | Página da nova oferta (`/entenda`, via `rewrite` no `vercel.json`). `entenda.html` é cópia de `entenda-sem-se-perder.html`. Tem player de áudio no hero (`audio-pagina-entendasemseperder.mp3`), carrossel de 8 depoimentos (cards estilo Instagram DM, nome e foto borrados) e pixel/UTMs idênticos ao `index.html`. **Sem emojis na página.** |
| `upsell.html` | Oferta especial pós-compra |
| `upclientes.html` | Upsell do kit para conseguir clientes |
| `upsell2.html` | **Upsell "Negócio Rural do Zero"** (página de oferta pós-compra, entregável `UPSELL_Negocio_Rural_do_Zero.pdf`). Ver seção abaixo |
| `politica-privacidade.html` / `termos-de-uso.html` | Páginas legais |
| `entregaveis-lucre/` | Material entregue ao cliente (PDFs novos da oferta Entenda). As pastas antigas m1 a m5, OB e guia HTML foram para `_antigos_backup/` (ignorada no git) |
| `criativos/` | Criativos de anúncio da oferta principal (ignorada no git) |
| `criativos-entenda/` | Criativos da oferta Entenda: `1.jpg` a `15.jpg` (numeração própria), mais `descartados/` |
| `roteiro-audio-entenda.txt` / `depoimentos-index.txt` | Roteiro do áudio da `/entenda` e textos de depoimentos |

**Seções do `index.html`:** Hero (H1, subtítulo, áudio, mockup) → Faixa de prova → Benefícios (bento grid) → Depoimentos (carrossel) → Como funciona (3 passos) → O que você recebe → Oferta (preço e botão) → Garantia 7 dias → FAQ → Autor → Rodapé. Botão fixo no rodapé no mobile.

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

## 📈 Rastreamento

**Aprendizado:** vários scripts de pixel da Utmify na mesma página se sobrescrevem, porque todos usam o mesmo `window.pixelId`. Por isso o IC e o page view falhavam. A solução foi usar **um único pixel da Utmify** com os pixels da Meta vinculados no painel.

### Página `/` (`index.html`)
- **Utmify (ativo):** 1 script de pixel ("3 RURAL", ID `6ac42ec78067b4499c7d80ba`) e o script de UTMs (`latest.js`), no `<head>`.
- **A `/entenda` usa o mesmo pixel e as mesmas UTMs da `/`** (commit `df38231` restaurou o head idêntico ao do `index.html`).
- **Pixels da Meta vinculados na Utmify:** `1395221742238189`, `885028918027856 (Rural 2)` e `1495289149453037 (Rural Dolar)`.
- **IC:** regra "Contém texto" com `REGULARIZAR POR R$27,90`, que deve bater **exatamente** com o texto do botão `#btn-checkout`. Se mudar o texto do botão, atualize a regra na Utmify. A classe `btn-checkout-utmfy` continua no botão, mas não é usada por essa regra.

### Página `/2` (`2.html`)
- **Sem Utmify e sem UTMs.** As vendas dessa página chegam sem atribuição de campanha.
- **Meta Pixel nativo (ativo):** um único código base com 2 pixels, **RURAL 4** (`2794376007657993`) e **RURAL 5** (`1088370370664674`), e um só `fbq('track','PageView')` (evita PageView duplicado), mais os `noscript` dos dois.
- **IC:** `onclick="fbq('track','InitiateCheckout');"` no botão `#btn-checkout`, que vale para os 2 pixels. Na Novark, a opção **"Disparar InitiateCheckout na abertura"** deve ficar **desligada**, para não contar o IC em dobro.
- **Compra:** os dois pixels (RURAL 5 `1088370370664674` e RURAL 4 `2794376007657993`) estão cadastrados na Novark, que envia a compra para ambos. Em cada um, a opção "Disparar InitiateCheckout na abertura" deve ficar desligada.

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
- **Numeração sequencial**: cada criativo vira `NN.jpg` com o próximo número da sequência. **Pasta `criativos`: último número usado 146** (120 a 129 = lote de 19/10; 130 a 135 = lote seguinte, em `.png`; 136 a 146 = lotes de 20/10, em `.png`). Os números 110 a 119 em `criativos/imagens/novos` são cópias antigas do lote Entenda e foram pulados. Próximo: 147.
- **Pasta `criativos-entenda/`: numeração própria, começa em 1. Último usado: 15** (próximo é o 16).
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
