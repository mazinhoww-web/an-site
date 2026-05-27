# STITCH-AJUSTES.md — Prompt único de correção v2 (one-shot consolidado)

> Cole este prompt UMA ÚNICA VEZ no Stitch, no projeto AN. já aberto. Reprocessa todas as 10 telas aplicando: correções da v1 (que não foram feitas) + upgrade premium v4 (DownloadGate 3 campos, lime ampliado, motion premium, imagens, home reformulada, admin analytics). Substitui o STITCH-AJUSTES anterior.

---

## Como usar

1. Abra o projeto AN. no Stitch
2. **Não** apague os mockups atuais
3. Cole o prompt da seção "PROMPT ÚNICO" abaixo no campo principal
4. Aguarde a re-geração de todas as telas
5. Para qualquer tela que continuar fora do brand depois de 2 iterações, peça HTML direto ao Claude no chat (fallback descrito no fim)

Se Stitch só aceitar correções por tela e não global, use o índice no fim deste arquivo.

---

## PROMPT ÚNICO (copy / paste no Stitch)

```
Refine all 10 screens of the AN. Personal Site project applying these comprehensive corrections globally and per-screen. Goal: production-grade site that looks like it cost millions to develop. Premium, editorial, technical, lime accent surgical-yet-present, motion design rich, images strategic.

==============================================================
GLOBAL BRAND CORRECTIONS (apply everywhere)
==============================================================

1. Replace every "+" between LOYALTY, FINTECH and INNOVATION with the multiplication sign "×". Always "LOYALTY × FINTECH × INNOVATION", never with plus or ampersand.

2. Footer copyright on every page: "© 2026 Aurimar Nogueira. Cuiabá, MT. Onde estratégia vira sistema."

3. All buttons standardized: UPPERCASE label in JetBrains Mono weight 500, 12px, letter-spacing 0.04em. Primary: ink background (#0A0A0A) with bone text (#F5F4EF); on hover the text becomes lime (#CCFF00). Secondary: hairline border, ink text; on hover the border becomes lime. Every button has the relevant lucide icon to the right with 8px gap.

4. ALL CONTENT IN BRAZILIAN PORTUGUESE. Replace any English with Portuguese.

5. No em-dash (—) anywhere. Use comma, period or parentheses.

6. No emoji in UI.

7. No gradient. No box shadow. Only the 8-color palette (bone, paper, ink, graphite, smoke, hairline, lime, lime-deep).

==============================================================
LIME AMPLIFIED (new strategy — was too sparse)
==============================================================

Lime now appears in MORE places, still functional, never decorative. Target: up to 7% of viewport (was 3%). Add lime to:

- 3px lime square 16x16 BEFORE every eyebrow on every section (lime tab indicator at section top)
- Border lime on hover for ALL cards (not just ArrowUpRight)
- Lime focus ring 2px on all inputs and buttons (already exists, reinforce)
- Lime underline that grows from 0 to 100% width on hover of ALL editorial links
- Lime pulse dot next to "ATUAL", "ATIVO", "AO VIVO" labels
- Lime accent on framework icons (Sparkle in lime when over Method Jet, GSD2, Innovation2Business)
- Lime vertical line 2px on left of blockquotes
- Lime trail bar 2px at top of page showing scroll progress (0% to 100% as user scrolls)
- Lime mini square 4x4 BEFORE each list item in editorial content
- PALESTRANTE and JURADO role labels in /eventos in lime color (others in ink)

==============================================================
MOTION DESIGN PREMIUM (richly animated everywhere)
==============================================================

Show motion intent in every interactive element. Stitch can't truly animate but draw visual cues:

- Every card: subtle "hover ready" indicator (slight inner shadow simulated with hairline 1px offset, that becomes lime on hover)
- Every icon button: pulse halo around it on hover (lime ring 1px scaling from 100% to 120%)
- Every link: underline already growing visible (line drawn at 40% width to suggest animation)
- Hero h1 of home: subtle ghost of next-state (letters slightly offset showing stagger entrance)
- Numbers in highlights cards: with subtle "counting from 0" feel — show with slight motion blur or duplicated faded number behind
- Send button on forms: arrow leaning forward 4 degrees ready to "fly"
- Lock icon in DownloadGate modal: with slight separator showing it's about to morph
- Scroll progress bar at the very top of every page, 2px lime, partially filled
- Timeline dots in Trajetória: drawn with a soft lime halo around them, suggesting "pulsing"
- Box icons in skill cards: drawn with slight perspective tilt (4 degrees) suggesting 3D ready
- Background of hero: subtle 80px hairline grid (existing) with one cell slightly lime-tinted suggesting "alive"

==============================================================
IMAGES STRATEGY (add visual depth)
==============================================================

Brand allows certain images. Add them strategically:

- Sobre page: PhotoFrame with placeholder (User lucide icon centered, bone background, hairline frame, lime accent square top-right outside frame). Caption mono "FOTO EM BREVE" below. NEVER use AI-generated CG portraits like the current rendering.

- Eventos detail pages: video embed placeholder (16:9 frame with lucide Play icon overlay, hairline border), photo gallery placeholder (3 thumbnail frames in row with hairline), deck download card

- Skills cards (lista): each skill card should feel like a small "instructional card", with the Box icon prominent (32px ink, sometimes lime on hover) and the card itself drawn with paper bg + hairline + clear hierarchy

- Eventos cards (lista): tiny organizer logo at right side, monochrome treatment, 24px height max

- Sections with editorial weight (Home blocks, Trajetoria chapters): subtle SVG pattern overlay 5-8% opacity in background — abstract dots or thin lines suggesting "data" or "infrastructure"

- Hero of home: behind text, very subtle hairline grid 80x80px + one micro lime dot pulsing in lower right area suggesting "alive system"

==============================================================
PER-SCREEN OVERRIDES
==============================================================

S1 HOME DESKTOP — REWRITE COMPLETELY with this new structure:

Section 1 — Hero (100vh):
- Eyebrow mono "LOYALTY × FINTECH × INNOVATION" with lime 3px square before it
- H1 Space Grotesk weight 800, 96-120px desktop: "Onde estratégia vira sistema." with lime underline below "vira"
- Subtitle Inter body-l, max 65ch: "Aurimar Nogueira. Coordenador Sênior de Negócios Financeiros na LATAM Pass. Loyalty, fintech e inovação aplicada em ecossistemas regulados."
- 2 buttons: CONHECER (primary) + FALAR COMIGO (secondary)
- Scroll progress bar 2px lime at the very top of viewport (partially filled to suggest progress)
- Background: subtle 80px hairline grid with low opacity + one lime-tinted cell in lower right

Section 2 — Quem sou eu:
- Eyebrow "QUEM" with lime 3px square before
- H2 Space Grotesk: "Construo produto em mercados que não perdoam improviso."
- 2 paragraphs of editorial body (max 65ch):
  Paragraph A: "Comecei em operação no agro, passei por adquirência, mercados de capitais e hoje trabalho na maior companhia aérea da América Latina. O que muda entre uma fase e outra é a indústria. O que segue igual é o triângulo: produto que entende o usuário, parceria que destrava capital, regulação que cabe no desenho."
  Paragraph B: "A pegada autoral começou cedo. Frameworks como Método Jet, GSD2 e Innovation2Business foram construídos para sair da teoria e operar em squad real, com OKR mensurável e profit share por iniciativa."
- Link with lime underline: "Ler trajetória completa →" going to /trajetoria
- Right side: small PhotoFrame placeholder with User icon

Section 3 — Cenário atual:
- Eyebrow "AGORA"
- H2 Space Grotesk: "Coordenando novas frentes na LATAM Pass."
- Body: "Trabalho na squad eLoyalty / New Business, combinando produtos financeiros próprios, parcerias estratégicas e inovação aplicada. O foco é destravar camadas de receita que loyalty pode operar quando deixa de ser benefício de marketing e vira ativo financeiro de fato."
- Grid 3 cards horizontal:
  Card A: Label "PRODUTOS FINANCEIROS" / H3 "Estruturação de produtos próprios" / Body-s "Modelagem de unit economics, escolha de stack, integração regulatória e desenho de produto para escalar dentro de ecossistema loyalty."
  Card B: Label "PARCERIAS ESTRATÉGICAS" / H3 "Negociação com infraestrutura financeira" / Body-s "Discovery e seleção de vendors, modelos de profit share, governança de risco e contratos estruturados para parceiros nacionais e internacionais."
  Card C: Label "INTELIGÊNCIA COMPETITIVA" / H3 "Monitoramento contínuo de mercado" / Body-s "Acompanhamento de programas concorrentes com metodologia proprietária, leitura de movimentos do setor e geração de insumos para decisão executiva."
- Do NOT mention any specific product names (no LATAM Wallet, no Cartão PF, no AstroPay, etc). Confidentiality.

Section 4 — Skills:
- Eyebrow "FERRAMENTAS"
- H2 Space Grotesk: "Métodos transformados em código que o Claude executa."
- Body: "Cada skill abaixo é um framework de trabalho, empacotado para ser carregado dentro do Claude Cowork ou Claude Code. Quando ativada, ensina o Claude a executar tarefas com o método específico."
- Grid of 4 SkillCards (Método Jet, GSD2, Innovation2Business, LATAM Deck)
- Each card: Box icon 32px (with slight 3D tilt drawn), name in Space Grotesk weight 600, description 2 lines in Inter, category in mono uppercase at bottom-left, download count in mono at bottom-right ("↓ 127 BAIXADAS"). Border becomes lime on hover.
- DO NOT WRITE "criadas por mim" or "para download". Just present them.
- Link: "Ver todas as skills →"

Section 5 — Trajetória resumida:
- Eyebrow "EM NÚMEROS"
- H2 Space Grotesk: "Uma década de execução."
- Grid 4 highlight cards horizontal (not 6 like in Trajetoria page):
  - R$ 70B+ / ATIVOS REGISTRADOS / TrendingUp icon
  - 60% / MARKET SHARE CPR / BarChart3 icon
  - 1ª / CPR VERDE DO BRASIL / Award icon
  - R$ 88M / NPV CASE TAG / Trophy icon
- Each number in JetBrains Mono weight 500, 48-56px
- Link with lime underline: "Ver trajetória completa →"

Section 6 — Eventos recentes:
- Eyebrow "ONDE FALEI"
- H2 Space Grotesk: "Painéis, palestras e mesas recentes."
- List of 2-3 event cards (horizontal layout same as /eventos page but condensed):
  - Sicredi Summit (21 MAI 2026, PALESTRANTE in lime)
  - Embedded Credit Cubo Itaú (15 ABR 2026, PAINELISTA)
- Link with lime underline: "Ver todos os eventos →"

Section 7 — Newsletter inline:
- ink background (only dark section of home)
- Eyebrow mono smoke: "NEWSLETTER"
- H2 white on ink: "Recebe quando algo novo sai."
- Body graphite: "No máximo 2 emails por mês. Skill nova, fala em evento, leitura recomendada."
- Inline form with 3 fields (NOME / EMAIL / WHATSAPP) + button INSCREVER (lime bg ink text, Send icon)
- Microcopy in smoke: "Dados ficam comigo. LGPD aplicada."

Section 8 — Footer (same as before but with correct 2026 copyright)


S2 HOME MOBILE — CRITICAL: discard the current English content completely ("Precision Engineering At Scale", "Initiate Sequence", etc). Regenerate as vertical stack of the SAME sections as S1 Home Desktop above. Mobile is desktop stacked, same content, never different content.


S3 SOBRE — REPLACE all English paragraphs with these Portuguese paragraphs in this exact order:
P1: "Loyalty, fintech e inovação não são para mim disciplinas separadas. São um triângulo: produto que entende milhas, parceria que destrava capital, regulação que cabe no desenho. Quando uma das três pernas falha, o produto inteiro emperra."
P2: "A trajetória começou em operação no agro e em marketplace, passou por adquirência na Stone, pelo CPR Registry da CERC contra a B3, e hoje está na LATAM Pass coordenando novos negócios financeiros da squad eLoyalty."
P3: "O foco atual está em produtos financeiros próprios, parcerias estratégicas com infraestrutura financeira e inteligência competitiva. Os nomes dos produtos em andamento ficam reservados até o lançamento."
P4: "Este site existe para registrar essas frentes e compartilhar os frameworks que uso. Método Jet, GSD2 e Innovation2Business estão na seção Ferramentas."
- REPLACE the AI-generated CG portrait with a PhotoFrame placeholder: hairline square frame, bone background, lucide User icon 64px centered in ink color, lime 16x16 square accent at top-right outside the frame. Caption mono uppercase below: "FOTO EM BREVE".


S4 TRAJETÓRIA — Already mostly correct but apply these fixes:
- Highlights: ensure exactly these 6 with correct icons:
  1. R$ 70B+ / ATIVOS REGISTRADOS / TrendingUp
  2. 60% / MARKET SHARE CPR / BarChart3
  3. R$ 88M / NPV CASE TAG / Trophy
  4. 1ª / CPR VERDE DO BRASIL / Award
  5. 30% / CONVERSÃO DE LEADS / TrendingUp
  6. 3 / FRAMEWORKS AUTORAIS / Sparkle
- Chapter LATAM Pass body content corrected:
  CONTEXTO: "LATAM Pass é o programa de fidelidade do maior grupo aéreo da América Latina. O passageiro brasileiro tem uma relação madura com milhas, mas a infraestrutura de produtos financeiros adjacentes ao programa estava amarrada a um co-branded único."
  MANDATO: "Liderar a frente de novos negócios da squad eLoyalty: parcerias estratégicas, produtos financeiros próprios e inovação aplicada."
  MOVIMENTO: "MVP de wallet com parceiro internacional até LOI assinado. Discovery de stack BaaS + FIDC para produto de crédito. Business case com NPV de R$ 88M. Inteligência competitiva contínua. Painéis no Cubo Itaú, Segundo Voo, Summit Sicredi."
  RESULTADO: "LOI assinado em parceria estratégica. Stack Phase 1 travado. 30% de crescimento em conversão de leads. Squad Innovation2Business reconhecida como motor de novos negócios."
  APRENDIZADO: "Em loyalty, spread, interchange, float e IOF se comportam diferente em wallet versus cartão versus white label. Modelagem só funciona quando produto e regulação caminham juntos."
- CHAPTERS MUST BE 6 SEPARATE BLOCKS, NOT 4 + collapsed. List: LATAM Pass / CRDC / 1WIN (com pill "PARALELO") / CERC / Stone / Início. Each fully visible.
- Frameworks section: phases MUST be correct. Method Jet phases: "01 Diagnóstico da Oportunidade / 02 Prototipação Ágil / 03 Visão Transformadora" (NOT manobrabilidade, NOT velocidade de validação, NOT redução de arrasto). GSD2 phases: "01 Milestone / 02 Slice / 03 Task" (NOT goal setting, NOT shit done). Innovation2Business phases: "01 OKR por iniciativa / 02 Profit share / 03 Cadência semanal".


S5 EVENTOS (replaces old S5 Projetos) — Generate a NEW screen for /eventos following this spec:
- Header: eyebrow "ONDE FALEI" with lime 3px square before / H1 "Eventos" / subtitle "Painéis, palestras, mentorias e mesas em que estive como representante de uma frente que defendo. Em ordem cronológica reversa."
- Filter pills: TODOS, PALESTRANTE, PAINELISTA, JURADO, MEDIADOR, MENTOR (TODOS active with lime bg ink text)
- VERTICAL list (not grid) with cards layout in 3 zones:
  Zone 1 (2/12): big date in JetBrains Mono uppercase 32-40px (e.g. "21 MAI 2026") + role below in mono uppercase smaller (LIME COLOR if PALESTRANTE or JURADO, ink otherwise)
  Zone 2 (7/12): eyebrow event type (SUMMIT/PAINEL/etc), H3 event name, caption topic in graphite, body 2 lines description, tag chips in mono uppercase 10px at bottom
  Zone 3 (3/12, right-aligned): MapPin + city, Building + organizer (with tiny monochrome logo if available), ArrowUpRight icon as link to detail
- Each card separated by hairline above/below, not card border
- Show 3 seed events in this exact order:
  1. 21 MAI 2026 / PALESTRANTE (lime) / SUMMIT / "Summit de Inovação Sicredi Central Centro-Norte" / "Inovação aplicada em cooperativismo financeiro" / Cuiabá, MT / Sicredi / tags COOPERATIVISMO INOVAÇÃO LOYALTY FINTECH
  2. 20 MAI 2026 / PAINELISTA (ink) / PAINEL / "Inclusão Produtiva e o programa Segundo Voo" / "Reuso de tecido e inclusão produtiva em escala" / São Paulo, SP / LATAM Airlines / tags IMPACTO-SOCIAL INCLUSAO LOYALTY
  3. 15 ABR 2026 / PAINELISTA (ink) / PAINEL / "Embedded Credit no Cubo Itaú" / "Crédito embarcado em marketplaces e plataformas" / São Paulo, SP / Cubo Itaú / tags EMBEDDED-CREDIT FINTECH BAAS LOYALTY


S6 SKILLS HUB — Apply these fixes:
- DO NOT WRITE "criadas por mim" or "disponíveis para download". Just present the skills cleanly.
- Replace skill card descriptions with these (concise, accurate):
  Método Jet: "Framework de 3 fases para acelerar inovação. Diagnóstico, Prototipação, Visão."
  GSD2 — Get Shit Done: "Spec-before-code com hierarquia Milestone > Slice > Task."
  Innovation2Business: "Squad de inovação como motor de receita. OKR e profit share por iniciativa."
  LATAM Deck: "Decks executivos no padrão LATAM Pass ELEVATE 2025."
  Radar Concorrência: "Inteligência competitiva com metodologia VPP."
  Market Research Reports: "Relatórios estilo McKinsey, BCG e Bain. 50+ páginas."
  Brand Kit Pro: "Sistema completo de identidade. Auditoria automática."
  Design Intelligence: "Inteligência de design. Paletas, tipografia, UX patterns."
- Skill cards: Box icon with slight 3D tilt (4 degrees rotation), border becomes lime on hover (not just icon)


S7 SKILL DETALHE — Replace skill content:
- "O que faz": "O Método Jet é um framework autoral de três fases para acelerar oportunidades de inovação. Sai do diagnóstico de uma oportunidade vaga e chega num protótipo testável em ciclos curtos. Aplicado dentro da squad Innovation2Business da LATAM Pass."
- "Quando usar": "Use quando a oportunidade ainda está mal definida, quando o backlog tradicional não cabe, ou quando o ciclo de validação precisa ser muito mais curto que o de desenvolvimento de produto comum."
- "Três fases": exactly "01 Diagnóstico da Oportunidade / 02 Prototipação Ágil / 03 Visão Transformadora" (NOT manobrabilidade/velocidade/arrasto)
- REMOVE any mention of "sprints de 5 dias", "Ugly But Functional", "UBF", "Next.js Supabase Vercel" (these belong to other contexts)


S8 DOWNLOAD GATE MODAL — MAJOR CHANGE: now has 3 fields instead of 1:
- Same modal frame (paper bg, 8px radius, X close top-right with rotate-90 hover, backdrop ink 60% opacity)
- Header: Lock icon 32px in hairline frame 64x64
- H2 "Antes de baixar"
- Body: "Pra eu saber quem é você e te avisar quando uma skill nova sair."
- Form with 3 stacked fields, 16px gap:
  Field 1: Label mono uppercase "NOME" / text input with hairline border, focus ring lime
  Field 2: Label mono uppercase "EMAIL" / email input with hairline border, focus ring lime
  Field 3: Label mono uppercase "WHATSAPP" / tel input with small Brazil flag icon at left (lucide-style, not emoji), placeholder "(00) 00000-0000", focus ring lime
- 2 checkboxes (lime when checked):
  [x] "Quero receber newsletter quando novas skills saírem" (default checked)
  [ ] "Quero receber novidades por WhatsApp" (default unchecked)
- Primary button full width: "BAIXAR AGORA" with Download icon
- Footer microcopy in smoke 11px: "Seus dados ficam comigo. Não compartilho com ninguém. LGPD aplicada." + lime underline link "Política de privacidade"


S9 CONTATO — Apply these fixes:
- Subject select: keep options Parceria comercial, Fala em evento, Advisoria, Imprensa, Outro
- Cards "Também em": translate to Portuguese:
  Pátio Estúdios: "Estúdio de podcast e vídeo"
  Cia do Visto: "Consultoria digital de vistos EUA"
  LATAM Pass: "Função atual"
- Send button: "ENVIAR MENSAGEM" in mono uppercase with Send icon ready to fly


S10 ADMIN DASHBOARD — REWRITE COMPLETELY with rich analytics:

Sidebar updates:
- Rename "Usuários" to "Subscribers"
- Rename "Envios" to "Newsletter"
- Add new section "ANALYTICS" with sub-items: Audiência, Conteúdo, Conversões, Tempo Real, Heatmaps
- Active sidebar item has 4px lime square indicator clearly visible to the left of text

Main area structure:

ROW 1 — 6 KPI cards (instead of 4):
1. VISITANTES ÚNICOS / 1.247 / +12% vs anterior
2. PAGE VIEWS / 4.892 / +18% vs anterior
3. SUBSCRIBERS / 89 / +4% vs anterior
4. DOWNLOADS / 312 / +22% vs anterior
5. MENSAGENS / 14 (with lime badge "3 NOVAS") / -2% vs anterior
6. TEMPO MÉDIO / 3:42 / +8% vs anterior

Each card: paper bg, hairline, 24px padding. Number HUGE in JetBrains Mono. Label mono uppercase. Sparkline 7 dias no canto inferior direito (mini line chart hairline cor smoke with lime endpoint).

ROW 2 — Big traffic chart:
- Line chart of visitantes únicos x dias (30 days)
- Toggle pills: 7D / 30D / 90D (30D active, lime bg)
- Lime line, hairline grid, ink dots on data points, lime tooltip on hover

ROW 3 — Two blocks side by side:

Block left (8/12) — Top páginas:
- H3 "Páginas mais acessadas"
- Table: # (mono) / página / views (mono) / tempo médio (mono mm:ss) / bounce % (mono with color: ink if >50%, lime if <50%)
- Top 10 rows

Block right (4/12) — Atividade recente:
- H3 "Atividade recente"
- List of 8 items, each with lucide icon + text + tempo relativo mono (HÁ 2 HORAS):
  - MessageSquare "Nova mensagem de contato@empresa.com"
  - Download "Skill 'Método Jet' baixada"
  - UserPlus "Novo subscriber na newsletter"
  - Eye "Página /trajetoria recebeu 12 views"
  - Calendar "Evento 'Sicredi Summit' publicado"

ROW 4 — Mapa de visitantes:
- H3 "Origem geográfica" with toggle BRASIL / MUNDO
- Map of Brazil (or world) with color density (lime gradient from light to deep based on density)
- Side panel right: Top 5 states/countries with mono uppercase names and visitor counts

ROW 5 — Próximas publicações:
- H3 "Próximas notícias e eventos"
- Tabela: data / título / tipo (mono chip: NOTÍCIA ou EVENTO) / status (mono chip: RASCUNHO / AGENDADA / PUBLICADO with different bg)
- Replace fake AI titles with realistic:
  Row 1: "2026-06-15" / "Resumo do Summit Sicredi Central Centro-Norte" / NOTÍCIA / AGENDADA
  Row 2: "2026-06-20" / "Painel Embedded Credit no Cubo Itaú" / NOTÍCIA / RASCUNHO
  Row 3: "2026-07-10" / "Mesa-redonda Loyalty Summit Brasil" / EVENTO / AGENDADA


==============================================================
GLOBAL DOUBLE-CHECK BEFORE FINALIZING
==============================================================

- Lime appears in: mark dot, lime tabs before eyebrows, active nav indicator, button hover, focus rings, link underlines, framework icons, palestrante/jurado role labels, "ATUAL" pill, "PARALELO" pill, scroll progress bar, accent next to PhotoFrame, card border on hover. Target up to 7% of viewport.
- Motion intent visible in every interactive element (hover state hint, ready-to-animate icon)
- Images are strategic (PhotoFrame placeholder, event embeds, skill cards) never decorative
- Home reformulated with 8 sections in new structure (Hero / Quem sou / Cenário / Skills / Trajetória resumida / Eventos / Newsletter / Footer)
- DownloadGate has 3 fields (Nome, Email, WhatsApp) + 2 checkboxes
- Admin dashboard has 6 KPI cards, scroll progress, geo map, real-time, heatmaps in sidebar
- All content in Portuguese
- Year is 2026 in copyright
- × not + in descriptor
- Zero em-dash, zero emoji, zero gradient, zero shadow

Output: regenerate all 10 screens with these corrections fully applied. Keep the overall AN. brand visual identity. Make it look like the site cost millions to develop.
```

---

## Índice de correções por tela (fallback se Stitch não aceitar global)

| Tela | Seção para colar |
|---|---|
| S1 Home Desktop | GLOBAL + LIME AMPLIFIED + MOTION PREMIUM + IMAGES + S1 + GLOBAL DOUBLE-CHECK |
| S2 Home Mobile | GLOBAL + S2 + (estrutura igual S1) |
| S3 Sobre | GLOBAL + IMAGES + S3 |
| S4 Trajetória | GLOBAL + LIME AMPLIFIED + S4 |
| S5 Eventos | GLOBAL + LIME AMPLIFIED + IMAGES + S5 |
| S6 Skills Hub | GLOBAL + S6 |
| S7 Skill Detalhe | GLOBAL + S7 |
| S8 DownloadGate Modal | GLOBAL + S8 |
| S9 Contato | GLOBAL + S9 |
| S10 Admin Dashboard | GLOBAL + S10 |

---

## Fallback: HTML direto no Claude chat

Se mesmo após esta v2 alguma tela seguir desviando, peça aqui no chat do Claude:

```
Gere o HTML completo de [S1 Home / S2 Mobile / S3 Sobre / etc] seguindo:
1. DESIGN-SYSTEM-FOR-STITCH do STITCH-PROMPTS.md
2. Todas as correções desta STITCH-AJUSTES.md
3. PREMIUM-UPGRADE.md (lime ampliado, motion premium, imagens)
4. Para a Home: HOME-COPY do PREMIUM-UPGRADE.md seção 6

Arquivo único HTML+CSS inline, sem JavaScript, pronto pra preview no navegador.
```

Claude gera direto, 100% fiel ao brand. Você usa esse HTML como referência para o Claude Code depois.

---

## Resumo do que mudou da v1 para esta v2

| Categoria | v1 (insuficiente) | v2 (premium) |
|---|---|---|
| Lime | 3% cirúrgico | 7%, em mais pontos com função |
| Motion | Pouco visível em mockup | Intent visual em todo interativo |
| Imagens | Sem estratégia clara | 8 tipos catalogados, sempre com função |
| DownloadGate | 1 campo (email) | 3 campos (nome, email, whatsapp) + 2 checkboxes |
| Home | Estrutura genérica | 8 seções com copy específico, sem confidencial LATAM |
| Admin | KPIs simples (4) | 6 KPIs + scroll progress + mapa geo + heatmaps + real-time |
| Skills | "Criadas por mim" e "para download" | Presentação neutra, sem auto-bajulação |
| Português/Inglês | Misto | 100% PT-BR |
| Ano | 2024 | 2026 |
| Multiplicação | + | × |
