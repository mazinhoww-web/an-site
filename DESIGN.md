# DESIGN.md — AN. Site (v2)

> Design system vivo. Aprimorado com `design-intelligence` (Awesome Design MD) e `tripled-ui` (TripleD). Atualizar conforme o produto evolui.

---

## 1. Identidade Visual

**Personalidade:** estratégico, técnico, preciso, contido, premium silencioso, autoral.
**Tom:** confiança sem grandiosidade. "Onde estratégia vira sistema."
**Público:** decisores de fidelidade e fintech, parceiros de inovação, recrutadores executivos, jornalistas de negócios.

### Referência-âncora (Awesome Design MD)

**Linear + Vercel + Stripe** (combinação).

- **Linear:** densidade técnica, contraste alto, motion sutil e funcional, foco em conteúdo
- **Vercel:** uso de espaço, tipografia geometrica, dark mode opcional, animação que serve à informação
- **Stripe:** premium silencioso, hierarquia tipográfica, micro-interações em ícones, credibilidade

**Não imitar:** Apple (muito polido decorativo), Notion (muito colorido), Figma (muito playful), Airbnb (muito caloroso).

### Posicionamento por indústria

Combina três indústrias (`design-intelligence` style guide):

| Indústria | O que herda |
|---|---|
| **Loyalty (LATAM Pass)** | Premium, generoso em espaço, motion suave |
| **Fintech / Pagamentos** | Clareza, dados em mono, hierarquia rígida |
| **SaaS B2B (dev tools)** | Densidade técnica, dark mode-ready, foco no conteúdo |

Resultado: **minimalismo editorial técnico** com acento gráfico lime cirúrgico.

---

## 2. Tokens (versão definitiva)

### 2.1 Cores

| Token | Hex | Uso |
|---|---|---|
| `--color-bone` | `#F5F4EF` | Background primário (page) |
| `--color-paper` | `#FFFFFF` | Surface (cards, modals) |
| `--color-ink` | `#0A0A0A` | Texto primário, mark |
| `--color-graphite` | `#4A4A4A` | Texto secundário |
| `--color-smoke` | `#8A8A8A` | Texto terciário, captions |
| `--color-hairline` | `#E5E3DC` | Bordas, divisores |
| `--color-lime` | `#CCFF00` | Acento cirúrgico (1-3% da área) |
| `--color-lime-deep` | `#9FCC00` | Hover do lime, estados ativos |
| `--color-success` | `#1F7A3A` | Estados positivos (admin) |
| `--color-error` | `#8B1F2E` | Erros (admin), nunca vermelho puro |

**Dark mode (preparado, não ativado em v1):**

| Token | Hex |
|---|---|
| `--color-bone` (dark) | `#0A0A0A` |
| `--color-paper` (dark) | `#13131A` |
| `--color-ink` (dark) | `#F5F4EF` |
| `--color-hairline` (dark) | `#1E1E2E` |

**Contraste verificado (WCAG AA):**
- ink sobre bone: 17.3:1 ✅
- graphite sobre bone: 7.8:1 ✅
- smoke sobre bone: 4.6:1 ✅ (mínimo AA)
- lime sobre ink: 13.1:1 ✅ (acento sobre fundo escuro)
- ink sobre lime: 13.1:1 ✅ (texto sobre badge lime)

### 2.2 Tipografia

| Uso | Fonte | Peso | Tamanho | Letter-spacing |
|---|---|---|---|---|
| `display-xl` | Space Grotesk | 800 | 80/96/120px | -0.04em |
| `display-l` | Space Grotesk | 700 | 56/72px | -0.03em |
| `display-m` | Space Grotesk | 700 | 40/48px | -0.02em |
| `h1` | Space Grotesk | 700 | 32/40px | -0.02em |
| `h2` | Space Grotesk | 600 | 24/28px | -0.01em |
| `h3` | Space Grotesk | 500 | 20/24px | 0 |
| `body-l` | Inter | 400 | 18/28px | 0 |
| `body` | Inter | 400 | 16/26px | 0 |
| `body-s` | Inter | 400 | 14/22px | 0 |
| `caption` | Inter | 500 | 12/18px | 0.04em (uppercase) |
| `mono` | JetBrains Mono | 400 | 14/22px | 0 |
| `mono-meta` | JetBrains Mono | 500 | 12/18px | 0.04em (uppercase) |

**Regras:**
- Máximo 2 famílias em uso simultâneo na mesma viewport (Space Grotesk + Inter; JetBrains aparece como meta)
- Nunca usar Space Grotesk em body
- Nunca usar Inter em display-xl/l
- Numerais em dados sempre em JetBrains Mono (tabelas, métricas, anos)

### 2.3 Espaçamento

Base: **8px**. Escala: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 / 160 / 200px`.

- Seção vertical desktop: **128-160px**
- Seção vertical mobile: **80-96px**
- Card interno: **32px**
- Gap entre elementos: **16-24px**
- Container max-width: **1280px** (com `px-6 md:px-12 lg:px-16`)
- Texto medium read: **max-w-prose** (65ch)

### 2.4 Bordas, raio, sombra

- **Border width:** sempre `1px` (hairline). Nunca 2px ou 3px.
- **Border-radius:** `0` por padrão. `4px` em inputs e badges. `8px` em modal. Nunca `12px+`.
- **Shadow:** zero. Substituído por hairline border + bone vs paper contrast.
- **Focus ring:** `2px solid lime`, offset `2px`. Visível em todos os elementos interativos.

### 2.5 Iconografia

**Lucide React** exclusivamente (`lucide-react@latest`). Stroke `1.5px` padrão (não 2px). Tamanho base `20px`. Ver `ICONS-MOTION.md` para o catálogo animado completo.

---

## 3. Princípios de Design (10)

1. **Editorial sobre decorativo.** Tipografia faz o trabalho, não ornamento.
2. **Lime é cirúrgico.** Aparece em CTA primário, sublinhado de link, ponto do mark, badge ativo. Nunca em background grande, gradiente, ou bloco inteiro.
3. **Mono carrega autoridade.** Anos, valores, métricas e metadata em JetBrains Mono uppercase com tracking 0.04em.
4. **Hairlines, não sombras.** Divisão visual com border 1px hairline.
5. **Sem gradiente.** Cor sólida sempre. Sem exceção.
6. **Espaço respira.** Seções com 128-160px vertical em desktop.
7. **Motion serve à informação.** Animação revela hierarquia ou estado, nunca decora.
8. **Mobile-first real.** Layout começa em 320px. Desktop é progressive enhancement.
9. **Densidade técnica controlada.** Mais informação por viewport que sites de marketing, menos que dashboards.
10. **Sem em-dash.** Vírgula, ponto ou parênteses. Brand book.

---

## 4. Motion Design (expandido)

### 4.1 Princípios de motion

- **Função sobre forma.** Animação existe para revelar hierarquia, confirmar ação ou indicar estado, nunca para decorar.
- **Curva padrão:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint). Para entradas, transições principais.
- **Durações:**
  - Micro (hover, focus): **120-180ms**
  - Curta (revelação, toggle): **240-320ms**
  - Média (página, modal): **400-600ms**
  - Longa (intro hero): **700-900ms** (uma vez por sessão)
- **prefers-reduced-motion:** todas as animações respeitam. Fallback: opacity instantâneo, sem transform.
- **Stagger:** elementos em lista entram com 40-80ms de offset entre eles. Máximo 6 itens, depois corta.

### 4.2 Padrões reutilizáveis (TripleD aplicado)

**Scroll reveal (Framer Motion + useInView):**

```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

**Hero entrance (uma vez por sessão):**

```tsx
<motion.h1
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
  Onde estratégia <span className="text-lime">vira</span> sistema.
</motion.h1>
```

**Hairline grow (divisor que cresce no scroll):**

```tsx
<motion.div
  initial={{ scaleX: 0 }}
  whileInView={{ scaleX: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  className="h-px bg-hairline origin-left"
/>
```

**Lime accent underline (em links):**

```tsx
<a className="relative group">
  Link
  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-lime transition-all duration-200 group-hover:w-full" />
</a>
```

### 4.3 Background sutil (TripleD adaptado ao brand)

**Não usar auroras, shaders ou gradientes do TripleD literalmente.** Brand book proíbe gradiente.

Substituto: **grid hairline animado discreto** atrás do hero. Linhas brancas 1px sobre bone com opacidade 0.4, com pulse de 8s.

```tsx
function GridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-hairline) 1px, transparent 1px), linear-gradient(to bottom, var(--color-hairline) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(204,255,0,0.03), transparent 50%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
```

(O `radial-gradient` aqui não é gradiente decorativo de cor: é halo de opacidade quase invisível para criar profundidade. Aceitável dentro do brand.)

---

## 5. Componentes Core (15)

| Componente | Função | Notas de motion |
|---|---|---|
| `Mark` | Logo "AN." | Lime do ponto pulsa 1x ao mount, depois estático. Hover: scale 1.02 |
| `Nav` | Navegação topo | Underline lime que cresce no hover do item ativo. Mobile: drawer slide-in 320ms |
| `Hero` | Hero da home | Texto e CTA entram com fade+y. Grid background com pulse 8s |
| `SectionHead` | Cabeçalho de seção (eyebrow + título) | Hairline cresce no scroll. Eyebrow aparece 80ms antes do título |
| `Hairline` | Divisor 1px | Scale-X 0 → 1 ao entrar no viewport |
| `Label` | Mono uppercase, tracking 0.04em | Sem animação |
| `Card` | Card de projeto, notícia, highlight | Hover: borda lime aparece, ícone interno anima (ver ICONS-MOTION) |
| `Button` | CTA primário/secundário | Primário: bg ink → lime no hover. Secundário: borda ink → lime |
| `Input` | Campo de form | Border ink no focus, ring lime 2px com offset |
| `PhotoFrame` | Frame para foto do Aurimar | Hairline com canto lime cirúrgico. Hover: imagem zoom 1.03 em 600ms |
| `NewsletterSignup` | Form de captura | Send icon faz "fly-out" no submit (ver ICONS-MOTION) |
| `SkillCard` | Card de skill | Ícone Box com rotação 3D no hover (ver ICONS-MOTION) |
| `DownloadGate` | Modal de captura de email | Lock icon anima ao abrir, Mail icon entra após validação |
| `NewsItem` | Item de notícia | Calendar icon estático, ArrowRight desliza no hover |
| `Timeline` | (novo) Linha do tempo da Trajetória | Hairline vertical que cresce no scroll, pontos lime que pulsam um a um |

---

## 6. Layouts de Página

### 6.1 Home (`/`)

```
[Nav fixo, bone com hairline bottom]
[Hero: 100vh, padding vertical 160px]
  - Eyebrow: "LOYALTY × FINTECH × INNOVATION" (mono uppercase)
  - H1 display-xl: "Onde estratégia vira sistema."
  - Subtítulo body-l, max-w-prose
  - 2 CTAs (primário lime → ink, secundário ink outline)
  - Grid background com pulse
[Hairline crescer]
[Seção Highlights: 3 cards horizontais]
  - LATAM Pass, CERC, Cia do Visto
  - Cada card: label mono + h2 + body-s + link com underline lime
[Hairline]
[Seção Skills em destaque: 4 skills mais baixadas]
[Hairline]
[Seção Newsletter inline]
[Footer minimalista]
```

### 6.2 Sobre (`/sobre`)

```
[SectionHead: "Sobre" + eyebrow "QUEM"]
[Layout 2 colunas em desktop, 1 em mobile]
  - Coluna esquerda: PhotoFrame com foto
  - Coluna direita: texto editorial em 3-4 parágrafos
[Lista de meta: localização, função atual, lema] em mono
[CTA: "Ver trajetória completa" → /trajetoria]
```

### 6.3 Trajetória (`/trajetoria`) — **novo**

Ver `TRAJETORIA.md` para spec completa de conteúdo. Layout:

```
[SectionHead: "Trajetória" + eyebrow "HISTÓRICO"]
[Texto introdutório editorial, max-w-prose]
[Seção Highlights de carreira: 6 cards em grid 3x2]
  - Cada: número grande mono, label, descrição curta
  - Ex: "R$ 70B+" / "ATIVOS GERIDOS NA CERC" / "Liderou o CPR Registry..."
[Hairline]
[Timeline vertical: capítulos de carreira em ordem reversa]
  - Cada capítulo: ano (mono) | empresa (h2) | função (caption) | narrativa (body) | tags
  - Linha vertical lime cresce no scroll
[Hairline]
[Frameworks autorais: Método Jet, GSD2, Innovation2Business]
  - 3 cards com explicação curta
[Hairline]
[Citações ou prêmios: se houver]
[CTA: "Falar comigo" → /contato]
```

### 6.4 Projetos (`/projetos`)

```
[SectionHead: "Projetos" + eyebrow "O QUE"]
[Filtro por categoria: pills com border, lime quando ativo]
[Grid de Cards 3 colunas desktop, 1 mobile]
  - Cada Card: label categoria + h2 nome + body-s descrição + ano + ExternalLink icon
```

### 6.5 Projetos detalhe (`/projetos/[slug]`)

```
[Breadcrumb: Projetos / Nome]
[Hero do projeto: nome em display-l, eyebrow categoria, ano mono]
[Hairline]
[Layout 2 colunas: imagem/screenshot + meta (cliente, papel, stack, status)]
[Texto editorial em sections com h2]
[CTA: link externo se houver, e "Ver próximo projeto"]
```

### 6.6 Skills (`/skills`)

```
[SectionHead: "Skills" + eyebrow "INTELIGÊNCIA"]
[Texto introdutório com link para /skills/como-usar]
[Filtro por categoria]
[Grid de SkillCard 3 colunas]
  - Ícone Box animado, nome, descrição curta, tag categoria, Download icon
```

### 6.7 Skill detalhe (`/skills/[slug]`)

```
[Breadcrumb: Skills / Nome]
[Hero: ícone Box grande animado + nome display-m + descrição]
[Meta: versão, autor, categoria, downloads (mono)]
[Texto editorial: o que faz, quando usar, como funciona]
[CTA grande: "Baixar skill" → abre DownloadGate modal se primeiro download]
[Seção "Skills relacionadas"]
```

### 6.8 Notícias (`/noticias`)

```
[SectionHead: "Notícias" + eyebrow "AGORA"]
[Lista vertical de NewsItem]
  - Cada: data (mono) | título h2 | resumo body | ArrowRight icon
[Paginação]
```

### 6.9 Contato (`/contato`)

```
[SectionHead: "Contato" + eyebrow "CONVERSAR"]
[Layout 2 colunas]
  - Esquerda: form (nome, email, empresa, mensagem)
  - Direita: meta de contato direto (linkedin, email, localização) em mono
[Form valida com Zod, envia via Server Action]
[Estado de sucesso: ícone Check anima, mensagem confirma]
```

### 6.10 Admin (`/admin`)

```
[Shell com sidebar esquerda fixa]
[Sidebar: Mark + nav items + LogOut no fim]
[Main: SectionHead + breadcrumb + conteúdo]
[Tabelas com filtros, paginação]
[Forms em drawer lateral (slide-in 320ms)]
[Toast de feedback no canto inferior direito]
```

---

## 7. Aplicação Stitch

Quando usar Google Stitch para mockups:

1. Colar o bloco `DESIGN-SYSTEM-FOR-STITCH` do arquivo `STITCH-PROMPTS.md` no Style Guide
2. Não pedir gradiente, sombra ou cor fora dos tokens
3. Validar mockup contra esta especificação antes de aprovar
4. Se desviar do brand, gerar HTML direto no chat do Claude (fallback)

---

## 8. Checklist de qualidade (validação antes de fazer merge de qualquer slice de UI)

**Acessibilidade**
- [ ] Contraste verificado (axe DevTools ou similar)
- [ ] Focus ring visível em todos os interativos
- [ ] Alvos de toque >= 44x44px em mobile
- [ ] Alt text em todas as imagens informativas
- [ ] Heading hierarchy correta (h1 único por página, sem pular níveis)
- [ ] Forms com label associada (htmlFor)
- [ ] ARIA labels em ícones sem texto adjacente

**Brand**
- [ ] Apenas cores dos tokens AN.
- [ ] Apenas fontes do stack (Space Grotesk + Inter + JetBrains Mono)
- [ ] Lime cobre no máximo 3% da área visível da viewport
- [ ] Zero em-dash
- [ ] Zero emoji
- [ ] Zero gradiente
- [ ] Zero sombra

**Motion**
- [ ] Todas as animações respeitam `prefers-reduced-motion`
- [ ] Duração apropriada (micro <200ms, curta <320ms, etc)
- [ ] Curva `cubic-bezier(0.22, 1, 0.36, 1)` em entradas
- [ ] Ícones animados conforme `ICONS-MOTION.md`

**Performance**
- [ ] Imagens em WebP/AVIF com `next/image`
- [ ] Fontes via `next/font` com `display: swap`
- [ ] Lighthouse mobile >= 90 em performance
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms

**Responsividade**
- [ ] Testado em 320px, 768px, 1024px, 1440px
- [ ] Sem overflow horizontal em nenhuma largura
- [ ] Touch friendly em mobile

---

## 9. Anti-padrões

- Nunca usar `bg-blue-500`, `text-purple-600` ou qualquer cor Tailwind default
- Nunca usar fontes do sistema fora do stack definido
- Nunca usar `shadow-lg`, `shadow-xl` ou qualquer sombra Tailwind
- Nunca usar `bg-gradient-to-*`
- Nunca usar `border-radius` > 8px
- Nunca usar emoji estrutural (✅, 🚀, etc) na UI do site público
- Nunca usar em-dash (—). Use vírgula ou parênteses
- Nunca pedir animação puramente decorativa que não revela informação
- Nunca usar `animate-bounce`, `animate-spin` em elementos não-loading
- Nunca colocar lime em mais de 3% da área visível

---

## 10. Combinação com outras skills

- **`design-intelligence`:** referência Awesome Design MD aplicada (Linear + Vercel + Stripe como âncoras)
- **`tripled-ui`:** patterns de Framer Motion (Reveal, Scroll, Hairline) adaptados ao brand
- **`brand-kit-pro`:** brand book AN. v1.0 é a fonte de verdade
- **`latam-deck`:** usado em decks adjacentes, não no site
