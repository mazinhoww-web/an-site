# STITCH-PROMPTS.md — Mockups no Google Stitch (v2)

> Google Stitch (stitch.withgoogle.com) gera mockups de UI a partir de prompt + imagens de referência. Use estes prompts para iterar a UI antes de codar. Versão v2 alinhada com DESIGN.md, ICONS-MOTION.md, TRAJETORIA.md e SEO.md.

---

## Setup do Stitch

1. Abra https://stitch.withgoogle.com
2. New project: `AN. Personal Site`
3. Em "Style guide" cole o bloco DESIGN-SYSTEM-FOR-STITCH abaixo
4. Anexe como reference image:
   - brand-book.html exportado em PNG (print da página inteira)
   - Screenshots da SCIENT Skill Gallery (referência da seção /skills)
5. Use os prompts por tela em ordem S1 → S10
6. Para cada tela, depois de gerar, valide contra o checklist no fim deste doc

---

## Arquivos para enviar ao Stitch

Você não envia código para o Stitch. Envia:

| O que | De onde | Para onde no Stitch |
|---|---|---|
| Bloco DESIGN-SYSTEM-FOR-STITCH (texto) | Este arquivo, seção logo abaixo | Aba "Style guide" |
| Brand book PNG | Print do `brand-book.html` em A4 | Reference images |
| Screenshots SCIENT (2 PDFs) | Anexos originais Aurimar | Reference images, só para tela /skills |
| Foto editorial do Aurimar (se houver) | Aurimar fornece | Reference image, só para /sobre |
| Prompt da tela específica | Este arquivo, S1 a S10 | Caixa de prompt principal |

**Não envie ao Stitch:** código fonte, PROJECT.md, SEO.md, DATABASE.md. Stitch é ferramenta de mockup visual, não conhece backend.

---

## DESIGN-SYSTEM-FOR-STITCH (cole em "Style guide" no Stitch)

```
DESIGN SYSTEM AN. (Aurimar Nogueira)

REFERENCE PRODUCTS:
Visual feel of Linear + Vercel + Stripe combined. Editorial minimalism with surgical lime accent. No Apple polish, no Notion warmth, no Figma playfulness.

PALETTE (only these colors, no others):
- Bone background: #F5F4EF (dominant 60-70% of every screen)
- Paper white: #FFFFFF (cards and modals only, never as page background)
- Ink: #0A0A0A (primary text, mark, ink-themed sections)
- Graphite: #4A4A4A (secondary text)
- Smoke: #8A8A8A (tertiary text, metadata)
- Hairline: #E5E3DC (1px dividers, card borders)
- Lime accent: #CCFF00 (surgical use only, max 3% of viewport: dot in mark, lime underline on links, 4px lime bar in active state, lime dot in timeline, primary CTA background)
- Lime-deep: #9FCC00 (hover of lime)

TYPOGRAPHY:
- Display: Space Grotesk weights 700-800, tight letter-spacing -0.02 to -0.04em, used for h1/h2/h3 and hero text
- Body: Inter weight 400-500, normal letter-spacing, used for all paragraph text
- Mono: JetBrains Mono weights 400-500, uppercase with 0.04em letter-spacing, used for metadata, dates, numbers, eyebrows, labels
- Never mix Space Grotesk and Inter in the same heading. Never use Inter for display sizes. Always use JetBrains Mono for any number or date or year.

SPACING:
- Base unit 8px
- Section vertical padding desktop 128-160px, mobile 80-96px
- Card internal padding 32px
- Element gap 16-24px
- Container max-width 1280px with horizontal padding 24/48/64px (mobile/tablet/desktop)
- Reading text max-width 65 characters

BORDERS, RADIUS, SHADOW:
- All borders 1px hairline only, never thicker
- Border-radius 0 by default, 4px on inputs and small badges, 8px on modals. Never 12px or more
- Zero box-shadow anywhere. Use hairline borders for separation
- Focus ring 2px solid lime with 2px offset, visible on every interactive element

ICONS:
- Lucide icon family only, stroke 1.5px, size 20px default
- All icons animated subtly (hover scale 1.1, button send icon flies on click, lock icon morphs to mail then to checkmark on success, chevron rotates, etc)

LAYOUT PRINCIPLES:
- Editorial over decorative
- Hairlines never shadows
- Mono font carries authority for any data
- Lime is surgical, never decorative blocks
- No gradients, ever
- No box shadows, ever
- Generous vertical breathing room between sections
- Mobile-first, fluid from 320px to 1440px

WHAT TO NEVER DO:
- No em-dash anywhere
- No emoji in UI
- No gradient backgrounds
- No shadows
- No colors outside the palette
- No fonts outside Space Grotesk + Inter + JetBrains Mono
- No photographic decoration, no stock illustrations
- No round avatars in headers
- No glassmorphism, no neumorphism
- No animated background blobs or auroras (substitute with subtle 80px hairline grid with low opacity)

TAGLINE OF THE BRAND: "Onde estratégia vira sistema."
DESCRIPTOR: LOYALTY × FINTECH × INNOVATION (always with multiplication sign ×, never + or &)
MARK: "AN." where the period is in lime color #CCFF00
```

---

## Sequência recomendada de geração no Stitch

| Ordem | Tela | Tempo estimado | Prioridade |
|---|---|---|---|
| 1 | S1 Home | 15min iteração | crítica |
| 2 | S10 Trajetória | 15min | crítica (validar narrativa visual) |
| 3 | S2 Sobre | 10min | alta |
| 4 | S4 Skills hub | 10min | alta |
| 5 | S5 Skill detalhe + DownloadGate | 10min | alta |
| 6 | S3 Projetos lista | 10min | média |
| 7 | S6 Como Instalar | 10min | média |
| 8 | S7 Contato | 8min | média |
| 9 | S8 Admin shell | 10min | baixa (admin pode ser ajustado direto no código) |
| 10 | S9 Admin form | 8min | baixa |

Total: aproximadamente 2 horas de iteração no Stitch.

---

## S1 — Home (`/`)

```
Generate a desktop and mobile home page following the AN. design system.

STRUCTURE (top to bottom):

1. Fixed navigation bar:
- Bone background with 1px hairline bottom border
- Left: mark "AN." where the period is in lime color
- Right: nav links "Sobre", "Trajetória", "Projetos", "Skills", "Notícias", "Contato"
- All nav text in Inter weight 500, 14px
- Active link has a tiny 4px lime square below it
- Mobile: nav collapses into a Menu icon (lucide Menu, 20px)

2. Hero section (full viewport height minus nav):
- Background: bone with very subtle 80px hairline grid pattern at 40% opacity, fading to none
- Centered content, max-width 1280px
- Top: eyebrow "LOYALTY × FINTECH × INNOVATION" in JetBrains Mono uppercase 12px with 0.04em tracking
- Then: H1 in Space Grotesk weight 800, size 80-120px on desktop, "Onde estratégia vira sistema." where the word "vira" has a lime underline 2px below it
- Then: subtitle in Inter weight 400, 18px, max-width 65 characters: "Coordenador Sênior de Negócios Financeiros na LATAM Pass. Loyalty, fintech e inovação aplicada. Frameworks autorais e skills do Claude para download."
- Two buttons below: primary "Ver trabalho" in ink background with lime text on hover, secondary "Falar comigo" with ink border only
- Bottom of hero: small ChevronDown icon (lucide) with subtle bounce animation indicator

3. Hairline divider (1px hairline, full width)

4. Section "Destaques" (Highlights):
- Eyebrow in mono uppercase: "EM DESTAQUE"
- H2 in Space Grotesk: "Três frentes ativas"
- Grid 3 columns desktop, 1 column mobile
- Each card:
  - Label in mono uppercase 12px (e.g. "LOYALTY")
  - H3 in Space Grotesk weight 700 (e.g. "LATAM Pass")
  - Body description 2-3 lines in Inter
  - Link "Saiba mais" with lime underline that grows on hover, plus tiny ArrowRight lucide icon
- Cards: paper white background, 1px hairline border, 32px padding, no shadow, no border radius
- The three: LATAM Pass (loyalty/fintech), CERC (mercado regulado), Cia do Visto (empreendedorismo)

5. Hairline divider

6. Section "Skills em destaque":
- Eyebrow "PARA BAIXAR"
- H2 "Skills do Claude criadas por mim"
- Grid 4 cards in desktop, 2 in tablet, 1 in mobile
- Each SkillCard:
  - Top: small lucide Box icon, 24px, ink color
  - Name in Space Grotesk weight 600
  - Description 1 line in Inter body-s
  - Tag in mono uppercase at bottom (e.g. "INOVAÇÃO")
  - Download lucide icon on top-right corner that animates pull-down on hover
- Featured skills: Método Jet, GSD2, Innovation2Business, LATAM Deck
- Link at the bottom: "Ver todas as skills" with lime underline

7. Hairline divider

8. Newsletter inline section:
- Background: ink color (the only dark section of the page)
- Centered content
- Eyebrow in mono uppercase, smoke color: "NEWSLETTER"
- H2 in Space Grotesk white on ink: "Recebe quando algo novo sai"
- Subtitle in graphite color
- Inline form: email input (ink background, hairline-darker border, white text) + button "Inscrever" in lime background with ink text, with lucide Send icon
- Privacy note below in smoke color very small Inter

9. Footer:
- Bone background
- Hairline top border
- 3 columns: brand left ("AN." mark + tagline + descriptor), nav center (links), social right (LinkedIn, GitHub lucide icons)
- Bottom: very small smoke text "© 2026 Aurimar Nogueira. Cuiabá, MT. Onde estratégia vira sistema."

CONSTRAINTS:
- Lime appears in 5 places only: the period of the mark, the underline below "vira" in h1, the active nav indicator, the button hover, the Send icon background in newsletter button
- No gradients
- No shadows
- All sections separated by hairline 1px dividers
- Mono uppercase eyebrows on every section
- Space Grotesk for all headings, Inter for all body, JetBrains Mono for all metadata
```

---

## S2 — Sobre (`/sobre`)

```
Generate the /sobre page following AN. design system.

STRUCTURE:

1. Same navigation bar as home

2. Page header:
- Bone background, generous vertical space 96px top
- Eyebrow mono uppercase "QUEM"
- H1 Space Grotesk weight 700, size 56-72px: "Sobre"
- No subtitle here

3. Two-column layout (1 column on mobile, stacked):
- Left column 5/12 width: PhotoFrame component
  - Paper background, 1px hairline border, square aspect ratio
  - Photo of Aurimar inside with slight zoom on hover
  - Lime accent: a 16px lime square in the top-right outside the frame
- Right column 7/12: editorial text
  - H2 Space Grotesk: "Aurimar Nogueira"
  - Caption mono uppercase: "COORDENADOR SÊNIOR DE NEGÓCIOS FINANCEIROS, LATAM PASS BRASIL"
  - 3-4 paragraphs in Inter body-l, max-width 65 characters
  - Topics covered in paragraphs: 1) the angle (loyalty + fintech + innovation as inseparable), 2) the path so far (operations to product, regulated markets), 3) the current focus (LATAM Wallet, Cartão PF, Innovation2Business), 4) the framing (frameworks authored, skill sharing via this site)

4. Metadata block below the text:
- Hairline divider
- Grid of 4 small items in mono uppercase 12px, with label in smoke and value in ink:
  - LOCALIZAÇÃO / CUIABÁ, MT
  - FUNÇÃO / COORDENADOR SÊNIOR, LATAM PASS
  - LEMA / ONDE ESTRATÉGIA VIRA SISTEMA
  - DISPONÍVEL PARA / PARCERIAS, FALAS, ADVISORIA

5. Hairline divider

6. CTA: H2 "Ver trajetória completa" + link with lime underline that grows on hover, going to /trajetoria. Also a smaller "Falar comigo" link to /contato.

7. Same footer as home
```

---

## S3 — Projetos lista (`/projetos`)

```
Generate /projetos list page following AN. design system.

STRUCTURE:

1. Same navigation

2. Page header:
- Eyebrow mono "O QUE"
- H1 "Projetos"
- Subtitle Inter body-l: "Iniciativas em produto, parcerias e inovação. Algumas estão ativas, algumas concluídas, todas aqui porque ensinaram algo."

3. Filter pills (horizontal row):
- "Todos" (active by default, lime border + lime text)
- "Loyalty" (hairline border, ink text)
- "Fintech"
- "Inovação"
- "Empreendedorismo"
- Pills: 8px border-radius, mono uppercase 11px, padding 8px 16px, hover changes border to lime

4. Grid of project cards: 3 columns desktop, 2 tablet, 1 mobile, 24px gap

Each card:
- Paper background, 1px hairline border, no border radius
- 32px padding
- Top row: label mono uppercase (category, e.g. "LOYALTY") + year mono uppercase (e.g. "2026")
- H3 Space Grotesk weight 600: project name
- Body-s Inter: 2 lines description
- Bottom: tag chips in mono uppercase 10px (e.g. "LATAM", "AstroPay", "Wallet")
- Top-right corner: lucide ArrowUpRight icon, ink color, becomes lime on card hover
- Hover state: border becomes ink (darker), ArrowUpRight moves up-right 4px

Seed projects to show:
- LATAM Wallet com AstroPay (Loyalty, 2025)
- Cartão PF LATAM Pass (Fintech, 2025)
- CERC CPR Registry (Fintech, 2021)
- Cia do Visto (Empreendedorismo, 2025)
- Pátio Estúdios (Empreendedorismo, 2024)
- Método Jet (Inovação, 2025)

Pagination at bottom: simple "Anterior" / "1 2 3" / "Próxima" in mono uppercase
```

---

## S4 — Skills hub (`/skills`)

```
Generate /skills hub page following AN. design system AND inspired by the SCIENT Skill Gallery reference image.

STRUCTURE:

1. Same navigation

2. Page header:
- Eyebrow mono "INTELIGÊNCIA"
- H1 "Skills do Claude"
- Subtitle: "Pacotes de instrução que ensinam o Claude a executar tarefas com meu jeito de trabalhar. Baixe, instale, use. Funcionam em Claude Cowork e em Claude Code."
- Below subtitle: small link with arrow "Como instalar uma skill →" going to /skills/como-usar

3. Filter pills row (categories):
- "Todas" (active)
- "Inovação", "Produto", "Fintech", "Design", "Comunicação"

4. Grid of SkillCard 3 columns desktop, 2 tablet, 1 mobile

Each SkillCard:
- Paper background, 1px hairline border, 32px padding, no border radius
- Top: lucide Box icon 32px in ink color (this is THE skill icon)
- Below icon: H3 Space Grotesk weight 600: skill name (e.g. "Método Jet")
- Body-s Inter: 2-3 lines description
- Tag chip mono uppercase: category (e.g. "INOVAÇÃO")
- Bottom row: lucide Download icon left + "Baixar" text in mono + download count in mono (e.g. "127 BAIXADAS")
- Hover: border becomes ink, Box icon rotates 8 degrees and scales 1.05

Skills to show:
- Método Jet (Inovação)
- GSD2 — Get Shit Done (Produto)
- Innovation2Business (Inovação)
- LATAM Deck (Comunicação)
- Radar Concorrência (Fintech)
- Market Research Reports (Fintech)
- Brand Kit Pro (Design)
- Design Intelligence (Design)

REFERENCE: This page should feel similar to the SCIENT Skill Gallery PDF attached, but with AN. brand applied (bone instead of dark background, lime instead of green, Space Grotesk instead of system font).
```

---

## S5 — Skill detalhe + DownloadGate modal (`/skills/[slug]`)

```
Generate the skill detail page following AN. design system. Show TWO states:

STATE A: page without modal

1. Breadcrumb: mono uppercase "SKILLS / MÉTODO JET" with hairline separator and chevron icons

2. Hero of the skill:
- Two-column layout
- Left 4/12: large lucide Box icon, 80px, ink color, with a subtle hairline border square around it as a frame
- Right 8/12:
  - Eyebrow mono uppercase: "INOVAÇÃO"
  - H1 Space Grotesk weight 700: "Método Jet"
  - Subtitle Inter body-l: "Framework de 3 fases para acelerar oportunidades de inovação de oportunidade vaga até protótipo testável."
  - Metadata row in mono uppercase 11px (icons + label + value):
    - lucide Tag + AUTOR / AURIMAR NOGUEIRA
    - lucide GitBranch + VERSÃO / 1.2.0
    - lucide Calendar + ATUALIZADA / MAI 2026
    - lucide Download + BAIXADAS / 127
  - Primary button "Baixar skill" in ink background, lime text on hover, with lucide Download icon

3. Hairline divider

4. Content section (single column, max-width 65 characters):
- H2 "O que faz"
- Body paragraphs in Inter
- H2 "Quando usar"
- Body paragraphs
- H2 "Três fases"
- Numbered list with mono numbers + Space Grotesk titles + Inter description
  - 01 Diagnóstico da Oportunidade
  - 02 Prototipação Ágil
  - 03 Visão Transformadora
- H2 "Como instalar"
- Body with link to /skills/como-usar

5. Hairline divider

6. Related skills section:
- Eyebrow "RELACIONADAS"
- Grid of 3 SkillCards (smaller versions): GSD2, Innovation2Business, Radar Concorrência

STATE B: same page with DownloadGate modal open

The modal:
- Centered, paper background, 8px border-radius (the only place 8px is allowed)
- Backdrop: ink at 60% opacity (no blur)
- Modal width: 480px desktop, full width mobile with 24px margin
- Top-right: lucide X close icon, hover rotates 90deg
- Inside:
  - Top: lucide Lock icon 32px ink with subtle hairline frame
  - H2 Space Grotesk: "Antes de baixar"
  - Body Inter: "Deixa seu email pra eu te avisar quando uma nova skill sair. Você recebe no máximo 2 emails por mês."
  - Email input (full width, 4px border-radius, hairline border, ink text)
  - Optional checkbox: "Quero receber a newsletter" (default checked)
  - Primary button full width "Baixar agora" with lucide Download icon
  - Bottom small smoke text: "Seus dados ficam comigo, não compartilho com ninguém. Política de privacidade."

CONSTRAINTS:
- No shadow on modal (uses hairline border)
- Lock icon should look like it could morph into Mail then to CheckCircle on success states
```

---

## S6 — Como Instalar (`/skills/como-usar`)

```
Generate /skills/como-usar following AN. design system AND inspired by SCIENT "Como Instalar" PDF reference.

STRUCTURE:

1. Same navigation

2. Page header:
- Eyebrow mono "INSTALAÇÃO"
- H1 "Como instalar uma skill"
- Subtitle: "Cinco passos. Funciona em Claude Cowork via web e em Claude Code via terminal."

3. Five steps section, each a separate horizontal block separated by hairlines:

Step structure (repeats 5 times):
- Left side: number "01" in JetBrains Mono uppercase 64px ink color
- Right side: H2 Space Grotesk + body paragraph + a small screenshot inside a hairline frame

The 5 steps:
01 Baixe a skill (button download + zip file)
02 Acesse Claude Cowork ou Claude Code
03 No Cowork: Settings > Capabilities > Skills > Upload
04 No Code: cole na pasta .claude/skills do projeto
05 Pronto. A skill ativa quando você usar palavras-chave que ela escuta.

4. Hairline divider

5. FAQ section:
- Eyebrow "DÚVIDAS"
- H2 "Perguntas frequentes"
- Accordion list of 5-6 questions with lucide ChevronDown icon that rotates 180 when open
- Questions: "A skill funciona em qual versão do Claude?", "Posso editar a skill depois?", "Como saber se a skill ativou?", "Posso usar várias skills no mesmo projeto?", "E se quebrar algo?"

6. CTA section at bottom:
- Eyebrow "PRECISA DE AJUDA?"
- H2 "Manda mensagem que eu respondo"
- Button "Falar comigo" linking to /contato

REFERENCE: visually similar to the SCIENT "Como Instalar" PDF attached but with AN. branding applied (bone instead of dark, lime accent, Space Grotesk for titles).
```

---

## S7 — Contato (`/contato`)

```
Generate /contato page following AN. design system.

STRUCTURE:

1. Same navigation

2. Page header:
- Eyebrow mono "CONVERSAR"
- H1 "Contato"
- Subtitle: "Para parcerias comerciais, falas em eventos, advisoria. Tempo de resposta: 48h em dias úteis."

3. Two-column layout (1 column mobile):

Left column 7/12: contact form
- Labels in mono uppercase 11px above each field
- Input fields:
  - Nome (text input)
  - Email (email input)
  - Empresa ou organização (text input, optional)
  - Assunto (select dropdown with options: Parceria comercial, Fala em evento, Advisoria, Imprensa, Outro)
  - Mensagem (textarea, 6 rows)
- Each input: hairline border, 4px border-radius, 12px vertical 16px horizontal padding, focus state shows lime ring 2px with 2px offset
- Submit button full width: "Enviar mensagem" in ink background, lime text on hover, with lucide Send icon that animates fly-out on click
- Privacy note in smoke text below: "Seus dados ficam comigo. Política de privacidade."

Right column 5/12: meta info
- H3 Space Grotesk: "Outros caminhos"
- List items, each with lucide icon on left:
  - Mail icon + email link (in ink with lime underline on hover)
  - Linkedin icon + linkedin.com/in/mazinho
  - Github icon + github.com/mazinhoww-web
  - MapPin icon + "Cuiabá, MT, Brasil"
  - Clock icon + "Respondo em até 48h dias úteis"
- Below: small note in graphite "Se for emergência ou imprensa com prazo, prefere LinkedIn."

4. Hairline divider

5. Bottom section with "outras frentes":
- Eyebrow "TAMBÉM EM"
- 3 small cards horizontally: "Pátio Estúdios" (podcast studio), "Cia do Visto" (US visa consulting), "LATAM Pass" (current role)
- Each card with link

Show empty state of the form (no validation errors). Show success state after submit: success toast bottom-right in paper background with lucide CheckCircle in lime + message "Mensagem enviada. Te respondo em até 48h."
```

---

## S8 — Admin shell + Dashboard (`/admin`)

```
Generate the admin shell layout following AN. design system. This is internal facing, denser than the public site, but still on-brand.

STRUCTURE:

1. Sidebar fixed left, 240px wide:
- Bone background, 1px hairline right border
- Top: mark "AN." with lime period, smaller than public
- Below mark: tiny mono text "ADMIN"
- Nav items (vertical list, each with lucide icon):
  - LayoutDashboard + "Dashboard" (active state has 4px lime square left of text)
  - FolderKanban + "Projetos"
  - Box + "Skills"
  - Newspaper + "Notícias"
  - History + "Trajetória"
  - Users + "Subscribers"
  - MessageSquare + "Mensagens"
  - Send + "Newsletter"
  - Settings + "Configurações"
- At bottom: small avatar with name "Aurimar Nogueira" + lucide LogOut icon

2. Top bar (right of sidebar):
- 56px height, hairline bottom
- Left: breadcrumb mono uppercase "ADMIN / DASHBOARD"
- Right: lucide Bell icon + Search icon

3. Main content (Dashboard):
- 48px padding
- H1 Space Grotesk "Dashboard"
- Subtitle "Visão geral dos últimos 30 dias"

4. KPI cards row (4 cards, paper background, 1px hairline, 24px padding, no border radius):
- Each card has: small label mono uppercase + huge number in JetBrains Mono ink + small comparison line in smoke ("+12% vs anterior")
- The 4 cards: VISITAS / 1.247, SUBSCRIBERS / 89, DOWNLOADS / 312, MENSAGENS / 14

5. Two columns below cards (60/40 split):
- Left: line chart of visits over 30 days (hairline grid, ink line, lime hover dot)
- Right: list of recent activity (last 5-8 items, each: mono date + icon + text describing event)

6. Bottom: table of "Próximas notícias para publicar" with columns: Data, Título, Status (chips: Rascunho/Agendada), Ações (lucide Pencil/Eye icons)

CONSTRAINTS:
- Admin should feel denser than public (less whitespace) but still bone + paper + hairline + mono numbers
- No charts with multiple colors, only ink + one accent
- All numbers in JetBrains Mono
```

---

## S9 — Admin form Novo Projeto (`/admin/projetos/novo`)

```
Generate the admin form for creating a new project. Inside the same shell as S8.

STRUCTURE:

1. Same sidebar and top bar as S8 (with breadcrumb "ADMIN / PROJETOS / NOVO")

2. Main content:
- H1 Space Grotesk "Novo projeto"
- Subtitle in graphite Inter body-s: "Os dados ficam visíveis em /projetos/[slug] após publicar"

3. Two-column form layout:

Left column 8/12: main fields stacked
- Label mono uppercase + input below for each:
  - Nome (text input)
  - Slug (text input with prefix "aurimar.com.br/projetos/" in smoke before the input)
  - Categoria (select: Loyalty, Fintech, Inovação, Empreendedorismo)
  - Ano (text input small width)
  - Descrição curta (textarea 3 rows)
  - Descrição completa (textarea 8 rows with simple markdown toolbar above: Bold, Italic, Link, List)
  - Stack/Tags (chip input, type and enter to add)
  - Link externo (text input for URL)
  - GitHub (text input for URL)

Right column 4/12: side panel
- Card 1: "Imagem destaque"
  - Square frame with hairline border
  - Drag and drop area with lucide ImagePlus icon and text "Solta a imagem aqui ou clique"
  - Below: small mono text "PNG, JPG, WebP. Máx 2MB. Recomendado 1200x900px"
- Card 2: "Status"
  - Radio group: Rascunho (default selected), Publicado, Arquivado
- Card 3: "Visibilidade"
  - Checkbox: "Aparecer na home em destaque"
  - Checkbox: "Aparecer no /trajetoria como projeto relacionado"

4. Bottom sticky action bar:
- Hairline top border
- Left: lucide Trash2 icon "Descartar" in smoke
- Right: two buttons "Salvar rascunho" (secondary, ink border) + "Publicar" (primary, ink background lime text on hover, with lucide Send icon)

CONSTRAINTS:
- Inputs have 4px border-radius, hairline border, focus state with lime ring 2px and 2px offset
- All labels in mono uppercase 11px, color smoke
- Validation errors appear below the input in error color with lucide AlertCircle icon (shake animation)
```

---

## S10 — Trajetória (`/trajetoria`)

```
Generate the /trajetoria page following AN. design system. This is the most narrative page, with timeline of career chapters.

STRUCTURE:

1. Same navigation

2. Page header:
- Eyebrow mono "HISTÓRICO"
- H1 Space Grotesk weight 700, size 56-72px: "Trajetória"
- Subtitle Inter body-l, max-width 65 characters: "Uma década entre operações no agro, fidelização aérea, mercados regulados e performance marketing internacional. Cada capítulo abaixo está aqui porque mudou algo, não só porque aconteceu."

3. Hairline divider

4. Highlights of impact section:
- Eyebrow mono "EM NÚMEROS"
- H2 "Impacto verificável"
- Grid 3 columns desktop x 2 rows (so 6 cards), 1 column mobile

Each highlight card:
- Paper background, 1px hairline border, 32px padding
- Top: small lucide icon (TrendingUp, BarChart3, Trophy, Award, Sparkle) in ink, 20px
- Then huge number in JetBrains Mono weight 500, 48-56px, ink color (e.g. "R$ 70B+")
- Below number: label in mono uppercase 12px smoke color (e.g. "ATIVOS REGISTRADOS")
- Below label: 2 lines description in Inter body-s graphite color

The 6 highlights:
1. "R$ 70B+" / ATIVOS REGISTRADOS / Volume sob gestão no CERC CPR Registry no período em que liderou os produtos
2. "60%" / MARKET SHARE CPR / Participação do CERC contra a B3 no registro de Cédula de Produto Rural
3. "R$ 88M" / NPV CASE TAG / Valor presente líquido do business case TAG LATAM Pass
4. "1ª" / CPR VERDE DO BRASIL / Primeira CPR Verde registrada no país, conduzida na CERC
5. "30%" / CONVERSÃO DE LEADS / Crescimento mensurado em iniciativas na LATAM Pass
6. "3" / FRAMEWORKS AUTORAIS / Método Jet, GSD2 e Innovation2Business

5. Hairline divider

6. Timeline section, this is the heart of the page:
- Eyebrow mono "CAPÍTULOS"
- H2 "Por onde passei"

- Layout: vertical timeline. A 1px hairline runs vertically on the left side of the content (40px from left edge desktop, fixed 16px mobile)
- Along the line, lime dots (10x10px filled lime square, not circle) at each chapter
- 6 chapters total, each is a vertical block with breathing space 80px between them

Each chapter block:
- Lime dot on the vertical line, with a horizontal hairline 24px going right toward content
- Right of the line, content starts:
  - Top: mono uppercase metadata row: PERIOD (e.g. "AGO 2024 — PRESENTE") and COMPANY (e.g. "LATAM PASS")
  - H3 Space Grotesk weight 700: chapter title (e.g. "LATAM Pass / LATAM Airlines")
  - Caption in graphite Inter: role (e.g. "Coordenador Sênior de Negócios Financeiros")
  - Below: 5 mini sub-sections, each with its own H4 in mono uppercase (CONTEXTO, MANDATO, MOVIMENTO, RESULTADO, APRENDIZADO) followed by body Inter paragraphs or bullets
  - Bottom of chapter: tag chips in mono uppercase 10px (e.g. "LOYALTY", "FINTECH", "PARTNERSHIPS", "INNOVATION", "REGULADO")
- For the current chapter (LATAM Pass), add a small lime pill in the top metadata saying "ATUAL"

The 6 chapters in order (most recent first):
1. LATAM Pass / LATAM Airlines (AGO 2024 — PRESENTE, current)
2. CRDC | Central de Registros (OUT 2023 — AGO 2024)
3. 1WIN | Performance LATAM (AGO 2022 — AGO 2024, paralelo) — show a small "PARALELO" chip
4. CERC Central de Recebíveis (MAI 2021 — SET 2023)
5. Stone (ABR 2019 — MAI 2021)
6. Início internacional e formação (2014 — 2020)

Mock the first 2 chapters with full content visible. Other 4 can be collapsed with a "Ler mais" link in lime underline.

7. Hairline divider

8. Frameworks autorais section:
- Eyebrow mono "AUTORIA"
- H2 "Frameworks que eu criei e uso"
- 3 cards horizontal (1 column mobile):

Card structure:
- Paper background, 1px hairline, 32px padding
- Top: lucide Sparkle icon (small) + name in Space Grotesk weight 700
- Body: 2-3 lines purpose in Inter
- Bottom: list of phases in mono uppercase numbered (01, 02, 03)
- Last line in graphite Inter: "Aplicado em: [contextos]"

The 3 frameworks:
- Método Jet (phases: Diagnóstico da Oportunidade, Prototipação Ágil, Visão Transformadora)
- GSD2 — Get Shit Done (phases: Milestone, Slice, Task)
- Innovation2Business (phases: OKR por iniciativa, Profit share, Cadência semanal)

9. Hairline divider

10. CTA section at bottom:
- Eyebrow mono "PRÓXIMOS PASSOS"
- H2 Space Grotesk: "Quer conversar sobre alguma dessas frentes?"
- Body Inter: "Recebo melhor por email ou LinkedIn. Para parceria comercial, prefira o formulário."
- Two buttons: "Falar comigo" (primary, ink bg lime text on hover, lucide Send icon) + "LinkedIn" (secondary, ink border, lucide Linkedin icon)

11. Same footer as home

CONSTRAINTS:
- Vertical timeline line is a single 1px hairline running through the entire chapters section
- Each lime dot must appear as if it "grew" into place on scroll (Stitch can't animate, but draw them as filled squares with a subtle glow halo, signaling animation intent)
- No icons inside chapter body, only the H4 subsection labels in mono
- Tag chips at the end of each chapter, never inside text
- Lime appears ONLY in: timeline dots, hyperlinks underline, "ATUAL" pill, button hover
```

---

## Checklist de validação por tela

Antes de aprovar qualquer mockup do Stitch:

**Brand**
- [ ] Apenas cores da paleta AN. (bone, paper, ink, graphite, smoke, hairline, lime, lime-deep)
- [ ] Apenas 3 fontes (Space Grotesk, Inter, JetBrains Mono)
- [ ] Lime presente em no máximo 3 lugares por viewport
- [ ] Sem gradiente
- [ ] Sem sombra
- [ ] Sem em-dash em qualquer texto
- [ ] Sem emoji

**Tipografia**
- [ ] H1 em Space Grotesk weight 700-800
- [ ] Body em Inter weight 400
- [ ] Eyebrows e números em JetBrains Mono uppercase com tracking 0.04em
- [ ] Anos, datas, métricas sempre em mono

**Layout**
- [ ] Container max 1280px com padding lateral
- [ ] Seções separadas por hairline 1px
- [ ] Espaço vertical entre seções 128-160px desktop
- [ ] Cards com paper background e hairline border (sem sombra)

**Ícones**
- [ ] Lucide icons stroke 1.5px
- [ ] Sem ícones decorativos sem função
- [ ] Estados de hover sugeridos (mesmo que mockup não anime)

**Mobile**
- [ ] Layout fluido 320px+
- [ ] Touch targets >= 44x44px
- [ ] Texto >= 16px em body

---

## Fallback: se Stitch desviar do brand

Se após 3 iterações o Stitch ainda gerar UI fora do brand (cores erradas, gradiente, sombra, fontes erradas), abandone e peça ao Claude no chat:

```
Gere o HTML completo da tela [S1/S2/etc] seguindo exatamente o DESIGN-SYSTEM-FOR-STITCH desta conversa, em arquivo único HTML+CSS inline, sem JavaScript, pronto para preview no navegador.
```

Claude gera HTML estático fiel ao brand, e você usa como mockup base para o Claude Code depois.
