# 📊 Projeto Entendimento — Oferta 13 (Imóvel Rural em Dia)

> Documento de referência rápida para entender o projeto, a oferta e a estrutura.
> Atualizado em: 2026-10-13 (noite)

---

## 🧭 Visão Geral

Funil de venda direta de um infoproduto de **regularização de imóvel rural (CCIR, ITR e CAR)**, com ângulo de **renda extra como Consultor Rural**. Site estático (HTML/CSS/JS puro), sem framework.

- **Pasta local:** `/Users/gustavoaugusto/Desktop/oferta13`
- **Repositório:** https://github.com/AuguxtoGt/oferta-rural (branch `main`)
- **Hospedagem:** Vercel (`vercel.json` com `cleanUrls`)
- **Site no ar:** https://regularizerural.vercel.app/ (página `/`, com Utmify) e https://regularizerural.vercel.app/2 (página `/2`, com Meta Pixel)
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

1. Tráfego (anúncios Meta, em `criativos/`) leva à **página de vendas** (`index.html`). Orçamento acima de R$ 200/dia.
2. O visitante ouve o áudio (`vdave.mp3`), lê os benefícios, depoimentos e o passo a passo.
3. Clica em **"REGULARIZAR POR R$27,90"** e vai ao checkout Novark.
4. Após a compra, é apresentado ao **upsell** (`upsell.html` / `upclientes.html`).
5. A entrega é feita com os arquivos de `entregaveis/` (PDFs, vídeos e guia HTML).

---

## 📱 Páginas e Seções

| Arquivo | Função |
|---|---|
| `index.html` | Página de vendas (`/`), com pixel único da Utmify e UTMs |
| `2.html` | Cópia da página de vendas (`/2`), sem Utmify, com Meta Pixel nativo. **Mudanças no `index.html` precisam ser repetidas aqui** |
| `upsell.html` | Oferta especial pós-compra |
| `upclientes.html` | Upsell do kit para conseguir clientes |
| `politica-privacidade.html` / `termos-de-uso.html` | Páginas legais |
| `entregaveis/` | Material entregue ao cliente (m1 a m5, OB, passo a passo) |
| `criativos/` | Criativos de anúncio |

**Seções do `index.html`:** Hero (H1, subtítulo, áudio, mockup) → Faixa de prova → Benefícios (bento grid) → Depoimentos (carrossel) → Como funciona (3 passos) → O que você recebe → Oferta (preço e botão) → Garantia 7 dias → FAQ → Autor → Rodapé. Botão fixo no rodapé no mobile.

---

## 📈 Rastreamento

**Aprendizado:** vários scripts de pixel da Utmify na mesma página se sobrescrevem, porque todos usam o mesmo `window.pixelId`. Por isso o IC e o page view falhavam. A solução foi usar **um único pixel da Utmify** com os pixels da Meta vinculados no painel.

### Página `/` (`index.html`)
- **Utmify (ativo):** 1 script de pixel ("3 RURAL", ID `6ac42ec78067b4499c7d80ba`) e o script de UTMs (`latest.js`), no `<head>`.
- **Pixels da Meta vinculados na Utmify:** `1395221742238189`, `885028918027856 (Rural 2)` e `1495289149453037 (Rural Dolar)`.
- **IC:** regra "Contém texto" com `REGULARIZAR POR R$27,90`, que deve bater **exatamente** com o texto do botão `#btn-checkout`. Se mudar o texto do botão, atualize a regra na Utmify. A classe `btn-checkout-utmfy` continua no botão, mas não é usada por essa regra.

### Página `/2` (`2.html`)
- **Sem Utmify e sem UTMs.** As vendas dessa página chegam sem atribuição de campanha.
- **Meta Pixel nativo (ativo):** um único código base com 2 pixels, **RURAL 4** (`2794376007657993`) e `1088370370664674`, e um só `fbq('track','PageView')` (evita PageView duplicado), mais os `noscript` dos dois.
- **IC:** `onclick="fbq('track','InitiateCheckout');"` no botão `#btn-checkout`, que vale para os 2 pixels. Na Novark, a opção **"Disparar InitiateCheckout na abertura"** deve ficar **desligada**, para não contar o IC em dobro.
- **Compra:** os dois pixels (`1088370370664674` e RURAL 4 `2794376007657993`) estão cadastrados na Novark, que envia a compra para ambos. Em cada um, a opção "Disparar InitiateCheckout na abertura" deve ficar desligada.

### Desativados / removidos
- Pixels 1, 2 e 3 (Dólar) separados da Utmify: removidos (substituídos pelo pixel único).
- Meta Pixel antigo (`1395221742238189` e `885028918027856`) comentado no `index.html`: removido.

---

## 🎨 Criativos e Ideias de Anúncio

**Pasta:** `criativos/` → `imagens/novos`, `imagens/rodados` (e `rodados/venderam bem`) e `videos/` (`V01 - RURAL.mp4`, `V02 - RURAL.mp4`).

### Regras de produção (também na skill `/criativos-meta-ads`)
- **Sempre 1:1 (1080x1080)**, sem exceção.
- **Nunca colocar data** em nenhum criativo.
- **Sem estilo bloco de notas / Apple Notes** (o usuário não quer).
- **Notícia não vendeu**: não usar como aposta principal.
- **Twitter/X vendeu mais**, mas nunca 100% nele (máximo 1 a 2 por lote).
- **Formatos que venderam bem** (`rodados/venderam bem`): 17 Twitter/X, **19 Produto Mockup**, **20 Bold Overlay**, **22 Flatlay Documentos**. Priorizar variações desses.
- **Numeração sequencial**: cada criativo vira `NN.jpg` com o próximo número da sequência. **Último número usado: 104** (próximo lote começa em 105).
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
- **Ainda não testados:** prova com prints reais de clientes e antes e depois.

---

## 🏗️ Arquitetura e Tech Stack

| Camada | Tecnologia |
|---|---|
| Front | HTML + CSS + JS vanilla |
| Deploy | GitHub → Vercel |
| Pagamento | Novark |
| Tracking | Utmify (pixel único) na `/` e Meta Pixel nativo na `/2` |

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
| 13/10/2026 | **Página `/2`** (`2.html`) sem Utmify, com Meta Pixel RURAL 4 (`2794376007657993`) e `1088370370664674`, PageView e IC no botão |
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

- `entregaveis/` (produto pago) ainda **não está no `.gitignore`**: evite `git add -A` para não publicar o material no GitHub.
- `index.html`: comentário mal formado na linha ~668 (`<!-9. OFERTA->`) e um `</div>` sobrando na linha ~694. Não afetam o funcionamento.
- **Próximos passos:** (1) teste do upsell em 09/10, e depois recalcular o conselho; (2) subir os criativos 53 a 62 em teste e cortar os piores em 3 a 4 dias; (3) confirmar a taxa real do gateway Novark; (4) entender de onde vem o ARPU de R$ 33,03, que é maior que o front.
- As pastas `founder/` e `entregaveis/` não devem ir para o GitHub. Os criativos 53 a 62 e 95 a 99, e o relatório, ainda não foram commitados.
- `2.html` é uma cópia do `index.html`: qualquer mudança de conteúdo precisa ser repetida nos dois arquivos.
- Na Novark, "Disparar InitiateCheckout na abertura" deve ficar **desligado** (o IC da `/2` sai do botão, e o da `/` sai da Utmify).

---

*Gerado pelo Antigravity — `/projeto-entendimento`*
