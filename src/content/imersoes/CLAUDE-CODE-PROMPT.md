# Claude Code · Página de Imersões Corporativas no aurimarnogueira.com.br

## 0. Contexto

Repositório existente em Next.js 14 App Router, TypeScript estrito, Tailwind, shadcn/ui, Supabase. Brand book em `docs/DESIGN.md` (AN. v2). Tokens, fontes e regras de marca já configurados via `next/font/google` e CSS variables.

Esta tarefa adiciona uma seção nova ao site: hub `/imersoes` e duas páginas de detalhe `/imersoes/lovable` e `/imersoes/claude`. As páginas reproduzem dois produtos existentes (Imersão Corporativa Lovable e Imersão Corporativa Claude), preservando integralmente conteúdo, blocos, instrutores e valores, com a identidade visual AN. aplicada por completo.

Não alterar nav, footer ou layout root. Esta página entra dentro do shell já existente.

## 1. Objetivo

Entregar três rotas estáticas (SSG) com identidade AN. aplicada, conteúdo em data layer tipado, componentes reutilizáveis entre as duas imersões e CTA conectado ao form `/contato` existente.

## 2. Escopo (in)

- Rotas: `/imersoes` (hub), `/imersoes/lovable` (detalhe), `/imersoes/claude` (detalhe)
- Componentes em `src/components/imersoes/`
- Content em `src/content/imersoes/` com tipo compartilhado
- Metadata SEO por página (next/metadata)
- Schema.org Course em cada detalhe
- CTA "Solicitar proposta" pré-preenche `/contato?assunto=imersao-lovable` ou `?assunto=imersao-claude`
- Sitemap atualizado com as três rotas
- Nav existente recebe um item "Imersões" (se já não tem)

## 3. Escopo (out)

- Pagamento online (compra continua via contato)
- Calendário de turmas abertas
- Sistema de inscrição
- Multi-idioma

## 4. Stack e padrões

- Server Components por padrão. Apenas componentes com motion ou interatividade marcados `"use client"`.
- Content em arquivos `.ts` com objeto tipado, exportado, importado pelas pages.
- Animações em Framer Motion seguindo `docs/ICONS-MOTION.md`. Reveal on scroll com `useInView`.
- Ícones: `lucide-react`, stroke `1.5`, size `20px` padrão.
- Imagens via `next/image`, hospedadas em Supabase Storage (`/instructors/messina.webp`, `/instructors/voss.webp`).
- Sem CSS-in-JS extra. Usar Tailwind com classes apoiadas em CSS variables do brand.

## 5. Arquitetura de arquivos a criar

```
src/
  app/
    imersoes/
      page.tsx                      hub
      lovable/
        page.tsx                    detalhe Lovable
      claude/
        page.tsx                    detalhe Claude
  components/
    imersoes/
      ImmersionHub.tsx              renderiza grid de 2 cards
      ImmersionHubCard.tsx          card individual no hub
      ImmersionHero.tsx             hero da página de detalhe
      WhySection.tsx                bloco "Por que esta imersão"
      ResultsGrid.tsx               grid 3-4 métricas de resultado
      InstructorsSection.tsx        wrapper
      InstructorCard.tsx            card individual de instrutor
      ProgramSection.tsx            wrapper "Programa Completo"
      ProgramSessionBanner.tsx      banner MANHÃ ou TARDE
      ProgramBlock.tsx              card de bloco numerado
      ProgramInterval.tsx           "10h30 às 10h45 · Intervalo"
      DeliverySection.tsx           "O que você leva"
      AudienceSection.tsx           "Para quem é"
      PriceSection.tsx              4 modalidades
      ImmersionCTA.tsx              CTA final com botões
  content/
    imersoes/
      types.ts                      tipos compartilhados
      lovable.ts                    conteúdo Imersão Lovable
      claude.ts                     conteúdo Imersão Claude
      index.ts                      registry com getImmersion(slug)
```

## 6. Tipos a usar (em `src/content/imersoes/types.ts`)

```ts
export type ImmersionSlug = "lovable" | "claude";

export type ProgramBlock = {
  number: string;             // "01"
  time: string;               // "08h30 às 09h15"
  title: string;
  body: string;               // markdown leve permitido (**bold**)
  comparison?: {
    before: { head: string; body: string };
    now:    { head: string; body: string };
  };
  bullets?: string[];
  quote?: string;
  exercise?: string;
};

export type ProgramSession = {
  label: string;              // "MANHÃ" | "TARDE"
  schedule: string;           // "08h30 às 12h30"
  subtitle: string;           // "Fundamentos e Estratégia Corporativa com Alexandre Messina"
  blocks: ProgramBlock[];
};

export type Instructor = {
  name: string;
  role: string;               // "Manhã" | "Tarde"
  photo: string;              // path no Supabase Storage
  bio: string;
  credentials: string[];
};

export type ResultMetric = {
  label: string;              // "MEMED"
  value: string;              // "66%"
  description: string;
};

export type PriceTier = {
  label: string;              // "REMOTO"
  price: string;              // "R$20.000,00"
  note: string;
};

export type Immersion = {
  slug: ImmersionSlug;
  title: string;              // "Imersão Corporativa Lovable"
  subtitle: string;
  highlightWord: string;      // palavra que ganha bg lime no título
  descriptor: string;         // "VIBE CODING × CORPORATE × IA"
  whyTitle: string;
  whyBody: string;            // markdown leve
  whyAccents: string[];       // palavras que ganham bg lime no whyBody
  results: ResultMetric[];
  instructors: Instructor[];
  program: {
    morning: ProgramSession;
    afternoon: ProgramSession;
    intervalText: string;     // "10h30 às 10h45 · Intervalo"
  };
  deliverables: string[];     // strings com **strong** permitido
  audience: string[];
  duration: string;
  includes: string;
  prices: PriceTier[];
  priceDisclaimer: string;
  ctaTitle: string;
  ctaBody: string;
  metaTitle: string;          // SEO
  metaDescription: string;    // SEO
};
```

## 7. Estilo visual (DESIGN.md aplicado)

Toda página segue tokens. Reforço dos pontos críticos:

- Background da page: `--bone (#F5F4EF)`
- Surfaces (cards, blocos): `--paper (#FFFFFF)`
- Hairlines 1px `--hairline (#E5E3DC)` como divisores, nunca sombras
- Lime `--lime (#CCFF00)` aparece como bloco destaque em UMA palavra do título, no ponto do mark AN., no check icon dos deliverables e no hover do CTA primário. Nada além.
- Tipografia: Space Grotesk display, Inter body, JetBrains Mono em labels uppercase com tracking `0.08em`
- Numerais grandes em métricas: Space Grotesk 800 (não JetBrains aqui, pois fica pequeno em hierarquia)
- Border-radius 0 por padrão, 4px em badges, nunca 12px+
- Sem em-dash. Sem emoji. Sem gradiente. Sem shadow.

## 8. Padrões de componente

### Hero
- 96px padding mobile, 160px desktop
- Grid hairline sutil no background com opacity 0.4 e mask radial
- Descritor mono uppercase
- H1 display-xl (clamp 48 a 120px), uma palavra com bg lime
- Tagline body-l em graphite, max 720px
- Meta row com mono uppercase: "8 HORAS · 10 BLOCOS · TESE PRONTA"

### Section head
- Eyebrow mono uppercase
- H2 display-l (clamp 32 a 56px)
- Lead body-l opcional em graphite, max 720px

### ProgramBlock
- Número 01 a 10 dentro de box 32x32 com borda ink
- Meta mono uppercase ("BLOCO 1 · 08h30 às 09h15")
- Title display-h3
- Body em graphite, bullets com hairline em vez de bullet point
- Quote box com border-left 2px lime, bg bone, italic
- Comparison grid com duas células (ANTES vs AGORA), célula "AGORA" com border ink

### Price grid
- 4 modalidades em grid 2x2 (desktop) ou 1 coluna (mobile)
- Cada célula: label mono uppercase, price display 36px, note mono uppercase pequena

### CTA section
- Bg `--ink`, texto `--paper`
- H2 com palavra em lime bloco
- Body em rgba(255,255,255,0.7)
- Botão primário: bg lime, color ink, hover bg lime-deep
- Botão secundário: outline branco com 0.4 opacity, hover lime

## 9. Animações (ICONS-MOTION.md aplicado)

- Hero entrance: H1 fade-in com y 40 → 0 em 800ms, ease `cubic-bezier(0.22, 1, 0.36, 1)`
- Mark `AN.`: ponto lime com scale 0.7 → 1.3 → 1 em 480ms uma vez ao mount
- Reveal on scroll: opacity 0 → 1 + y 24 → 0 em 600ms quando entra no viewport, once
- Hairlines: scaleX 0 → 1 em 800ms ao entrar
- Block hover: border-color transition para ink em 200ms
- CTA primário hover: bg lime → lime-deep em 200ms
- Todos respeitam `prefers-reduced-motion`: fallback instantâneo

## 10. SEO e Schema

Em cada page detalhe:

```ts
export const metadata: Metadata = {
  title: `${immersion.title} · AN. Aurimar Nogueira`,
  description: immersion.metaDescription,
  openGraph: {
    title: `${immersion.title} · AN.`,
    description: immersion.metaDescription,
    type: "website",
    url: `https://aurimarnogueira.com.br/imersoes/${slug}`,
    images: [`/og/imersao-${slug}.png`],
  },
  twitter: { card: "summary_large_image" },
};
```

Schema.org Course em JSON-LD em cada detail page, com `provider: Aurimar Nogueira`, `instructor` populado dos cards, `offers` com price tiers.

## 11. Must-haves verificáveis

**M1** Rotas `/imersoes`, `/imersoes/lovable`, `/imersoes/claude` retornam 200 em build de produção.
**M2** Hub `/imersoes` lista as duas imersões com card clicável que navega para o detalhe.
**M3** Estrutura das duas páginas de detalhe é idêntica em ordem de seções: Hero, Por que, Resultados, Instrutores, Programa Completo (Manhã + Tarde + Intervalo), O que você leva, Para quem, Valores, CTA.
**M4** Todo conteúdo das duas imersões vem dos arquivos em `src/content/imersoes/`. Nenhuma string hardcoded em JSX dentro dos componentes (exceto labels estruturais como "RESULTADOS REAIS DE QUEM JÁ ADOTOU").
**M5** Tokens de cor usados: apenas os definidos em `docs/DESIGN.md`. Sem cor Tailwind default.
**M6** Tipografia: apenas Space Grotesk, Inter, JetBrains Mono.
**M7** Zero em-dash. Zero emoji. Zero gradiente. Zero shadow.
**M8** Lime cobre menos de 3% da área visível em qualquer viewport.
**M9** Lighthouse mobile em produção: Performance ≥90, Accessibility ≥95, SEO ≥95 nas três rotas.
**M10** LCP <2.5s no 4G simulado, CLS <0.1.
**M11** Metadata e OG image presentes nas três rotas.
**M12** Schema.org Course válido (testado em validator.schema.org) nas duas páginas de detalhe.
**M13** CTA "Solicitar proposta" navega para `/contato?assunto=imersao-lovable` ou `imersao-claude` e pré-popula o campo "assunto" do form via searchParams.
**M14** `prefers-reduced-motion: reduce` desativa todas as animações de reveal e mantém apenas opacity instantânea.
**M15** Mobile-first: testado em 320px, 768px, 1024px, 1440px sem overflow horizontal.
**M16** Acessibilidade: heading hierarchy correta (h1 único por página), aria-labels em ícones decorativos, focus ring visível em todos os interativos com offset 2px lime.

## 12. Execução faseada (GSD2)

### Slice 1 · Content layer e tipos
1. Criar `src/content/imersoes/types.ts` com os tipos da seção 6.
2. Criar `src/content/imersoes/lovable.ts` e `src/content/imersoes/claude.ts` com conteúdo já fornecido em `content-lovable.ts` e `content-claude.ts` (anexos desta tarefa).
3. Criar `src/content/imersoes/index.ts` com `getImmersion(slug)` e `getAllImmersions()`.
4. Verificar tsc sem erros.

### Slice 2 · Componentes base
1. `ImmersionHero`, `WhySection`, `ResultsGrid`, `InstructorCard`, `InstructorsSection`.
2. `ProgramSessionBanner`, `ProgramBlock`, `ProgramInterval`, `ProgramSection`.
3. `DeliverySection`, `AudienceSection`, `PriceSection`, `ImmersionCTA`.
4. Storybook ou rota `/imersoes/preview` opcional para validar isolado (deletar antes de merge).

### Slice 3 · Pages
1. `app/imersoes/lovable/page.tsx` montando todos os componentes a partir de `lovable.ts`.
2. `app/imersoes/claude/page.tsx` idem.
3. `app/imersoes/page.tsx` com hub listando ambas.
4. `sitemap.ts` atualizado.
5. `robots.txt` confere se as rotas são permitidas.

### Slice 4 · SEO, Schema e CTA wiring
1. Metadata por página.
2. Schema.org JSON-LD.
3. CTA conectado ao `/contato?assunto=...`.
4. OG images geradas via `next/og` em `app/og/imersao-[slug]/route.tsx`.

### Slice 5 · Polish e verificação
1. Rodar Lighthouse local com `npx unlighthouse` ou `npm run lh`.
2. Testar `prefers-reduced-motion`.
3. Verificar todos os M1 a M16 acima.
4. PR aberto contra `dev`.

## 13. Comandos

```bash
git checkout -b feat/imersoes-corporativas
# implementar conforme slices acima
npm run lint
npm run typecheck
npm run build
npm run dev  # validar em http://localhost:3000/imersoes
git add .
git commit -m "feat(imersoes): add corporate immersions hub + lovable + claude pages"
git push -u origin feat/imersoes-corporativas
```

## 14. Anexos

Esta tarefa vem acompanhada de três arquivos de conteúdo já estruturados, para serem copiados direto em `src/content/imersoes/`:

- `types.ts`
- `lovable.ts`
- `claude.ts`

Esses arquivos contêm o conteúdo integral das duas imersões. Não reescrever. Apenas copiar.

## 15. Critério de pronto

A tarefa está pronta quando:

- [ ] Todos os M1 a M16 atendidos
- [ ] PR aberto contra `dev` com descrição apontando esses checks
- [ ] Preview deploy do Vercel funcionando em ambos os detalhes
- [ ] Aurimar consegue abrir a página `/imersoes/lovable` no mobile e fazer o fluxo até clicar em "Solicitar proposta" sem ver glitch visual ou erro

Fim do prompt. Cole isto direto no Claude Code junto com os três arquivos anexos.
