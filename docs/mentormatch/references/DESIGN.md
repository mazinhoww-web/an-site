# DESIGN.md — MentorMatch

> Sistema de design vivo. White-label multi-tenant. Atualizar conforme o produto evolui.
> Versao 1.0 — 2026-05-30. Substitui a adocao verbatim do DESIGN.md do Solu.

---

## 0. Por que nao o Solu

O DESIGN.md do Solu e o sistema de uma plataforma de recrutamento, ancorado em amarelo puro `#FFFF00` e sombras offset com zero blur. Tres problemas para o MentorMatch:

1. **Amarelo puro nao escala como cor de produto.** Falha contraste como texto, vibra na retina em volume e comunica alerta, nao confianca. Mentoria corporativa precisa de calma e credibilidade.
2. **Sombra offset sem blur e assinatura do Solu.** Copiar isso e vestir a marca de outro produto. Premium pede profundidade sutil, nao um efeito hand-drawn especifico.
3. **Cor de marca fixa quebra white-label.** O MentorMatch e multi-tenant via CSS custom properties. A cor primaria precisa ser um TOKEN substituivel por tenant, nao uma constante.

Aproveitamos do Solu apenas o que e bom e neutro: disciplina de escala 4px, generosidade de whitespace, pill em CTAs, foco em acessibilidade. O resto e proprio.

---

## 1. Identidade Visual

**Personalidade**: Confiavel, humano, premium, calmo, focado.
**Referencia de ancora**: Linear (rigor e profundidade) + Stripe (clareza B2B) + calor humano no acento.
**Publico**: B2B2C. Comprador e RH/L&D corporativo. Usuario final e o colaborador (mentor e mentee).
**Tom**: Adulto e sobrio sem ser frio. Conexao sem gamificacao infantil.

**Caracteristicas chave**
- Base neutra fria e arejada, com UMA cor de marca por tenant como protagonista pontual
- Profundidade por sombra suave com blur (nao offset duro)
- Tipografia geometrica com hierarquia real por proporcao, nao por salto bruto
- Raio de borda moderado e consistente (premium e contido, nao bolha)
- Motion sutil e proposital, sempre com reduced-motion
- Dark mode nativo (mentoria acontece tambem fora do horario comercial)

---

## 2. Cores

### 2.1 Arquitetura white-label (CRITICO)

A cor de marca NAO e fixa. E injetada por tenant via CSS custom property. O default abaixo (`Indigo`) e o fallback do tenant demo. Cada tenant sobrescreve `--brand-*` no runtime.

```css
:root {
  /* === BRAND (substituivel por tenant) === */
  --brand: #4F46E5;            /* default Indigo 600 — protagonista */
  --brand-hover: #4338CA;      /* Indigo 700 */
  --brand-soft: #EEF2FF;       /* Indigo 50 — fundos de destaque */
  --brand-ring: rgba(79,70,229,0.32); /* focus ring derivado do brand */
  --brand-contrast: #FFFFFF;   /* texto sobre o brand */

  /* === NEUTRAL (fixo, nao muda por tenant) === */
  --bg: #FBFBFD;               /* fundo da pagina, levemente frio */
  --surface: #FFFFFF;          /* cards, paineis */
  --surface-2: #F4F4F7;        /* fundos secundarios, hover de linha */
  --border: #E6E6EC;           /* divisores e outlines 1px */
  --border-strong: #D3D3DC;    /* outline de input em repouso */

  --text: #121217;            /* titulos e texto forte */
  --text-secondary: #5B5B66;   /* descricoes, labels */
  --text-muted: #9A9AA6;       /* metadados, placeholders */

  /* === SEMANTIC (fixo) === */
  --success: #16A34A;          /* match aceito, mentor disponivel */
  --warning: #D97706;          /* waitlist, atencao */
  --danger:  #DC2626;          /* erro, mentor lotado, recusa */
  --info:    #2563EB;          /* informativo, scores */
}
```

### 2.2 Dark mode

```css
[data-theme="dark"] {
  --bg: #0B0B0F;
  --surface: #15151B;
  --surface-2: #1E1E26;
  --border: #26262F;
  --border-strong: #34343F;
  --text: #F5F5F8;
  --text-secondary: #B0B0BC;
  --text-muted: #71717F;
  --brand-soft: rgba(79,70,229,0.14);
  /* --brand permanece o do tenant; apenas reduzir saturacao se necessario */
}
```

### 2.3 Tabela de tokens

| Token | Light | Uso |
|---|---|---|
| `--brand` | #4F46E5 (default) | CTA primario, links, selo de marca, progress fill |
| `--brand-soft` | #EEF2FF | Fundo de chip ativo, highlight de card selecionado |
| `--bg` | #FBFBFD | Fundo geral |
| `--surface` | #FFFFFF | Cards, modais |
| `--surface-2` | #F4F4F7 | Hover de linha de tabela, fundo de secao alternada |
| `--border` | #E6E6EC | Divisores 1px |
| `--text` | #121217 | Titulos |
| `--text-secondary` | #5B5B66 | Corpo e labels |
| `--text-muted` | #9A9AA6 | Metadados, placeholder |
| `--success` | #16A34A | Estados positivos |
| `--warning` | #D97706 | Waitlist, atencao |
| `--danger` | #DC2626 | Erro e lotado |

**Regra de contraste**: `--text` sobre `--bg` = 16:1. `--text-secondary` sobre `--surface` >= 7:1. `--brand-contrast` sobre `--brand` deve ser validado por tenant no momento do upload da cor (ver Secao 9).

---

## 3. Tipografia

**Familia unica**: `Plus Jakarta Sans` (geometrica, humanista, premium, otima em peso medio). Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
**Mono** (apenas dados/numeros densos): `"JetBrains Mono", ui-monospace, monospace`.

Por que trocar Poppins: Poppins e excelente mas saturadissimo no mercado, "cara de template". Plus Jakarta entrega o mesmo apelo amigavel com mais sofisticacao e melhor leitura em corpo pequeno.

### Escala (proporcao ~1.25, premium nao grita)

| Uso | Tamanho desktop | Mobile | Peso | Line-height | Tracking |
|---|---|---|---|---|---|
| Display / Hero | 60px | 38px | 700 | 1.05 | -0.02em |
| H1 | 40px | 30px | 700 | 1.15 | -0.015em |
| H2 | 30px | 24px | 600 | 1.2 | -0.01em |
| H3 | 20px | 18px | 600 | 1.35 | -0.005em |
| Body | 16px | 16px | 400 | 1.6 | 0 |
| Body strong | 16px | 16px | 500 | 1.6 | 0 |
| Body small | 14px | 14px | 400 | 1.5 | 0 |
| Label / Caption | 12px | 12px | 600 | 1.3 | 0.04em (uppercase) |
| Button | 15px | 15px | 600 | 1 | 0 |

### Principios
- Hierarquia por PROPORCAO e PESO, nunca por salto gigante. Display 60px e suficiente; 88px e exagero de landing de startup.
- Tracking negativo sutil nos titulos grandes (premium aperta levemente o display).
- Corpo sempre 16px minimo, alinhado a esquerda, line-height 1.6 para leitura confortavel.
- Maximo 2 pesos por tela. Titulo 600/700, corpo 400/500.

---

## 4. Espacamento e Grid

**Base**: 4px. **Escala**: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px.

| Contexto | Valor |
|---|---|
| Padding interno de card | 24px (compacto) a 32px (padrao). 40px so em paineis grandes |
| Gap entre cards em grid | 20px a 24px |
| Espaco vertical entre secoes (landing) | 96px desktop / 64px mobile |
| Espaco vertical entre secoes (app) | 32px a 48px |
| Max width de conteudo (landing) | 1200px |
| Max width de leitura (texto) | 680px |
| Margem lateral | 24px mobile / 48px tablet / 64px+ desktop |

**Densidade**: confortavel no app (nao espacosa demais, e ferramenta de trabalho), arejada na landing (vende confianca).

---

## 5. Bordas, Raio e Sombra

### Raio

| Token | Valor | Uso |
|---|---|---|
| `--r-sm` | 8px | Inputs, chips, badges retangulares |
| `--r-md` | 12px | Botoes, cards pequenos |
| `--r-lg` | 16px | Cards principais, modais |
| `--r-xl` | 24px | Paineis hero, containers de destaque |
| `--r-pill` | 999px | Pills, avatares, toggle, CTA pill |

Premium e contido: raio moderado. Evitar o 34px universal do Solu (vira "tudo bolha").

### Sombra (com blur, sutil — o oposto do offset duro do Solu)

```css
--shadow-xs: 0 1px 2px rgba(17,17,23,0.06);
--shadow-sm: 0 2px 8px rgba(17,17,23,0.08);
--shadow-md: 0 8px 24px rgba(17,17,23,0.10);
--shadow-lg: 0 16px 48px rgba(17,17,23,0.14);
--shadow-brand: 0 8px 24px var(--brand-ring); /* hover de CTA primario */
```

**Filosofia**: sombra comunica elevacao real, com blur suave e tom frio do `--text`. Cards em repouso usam `--shadow-xs` ou apenas borda. Elevacao cresce com interatividade (hover) e prioridade (modal). Nunca sombra dura sem blur.

---

## 6. Componentes Chave

### 6.1 Botoes

**Primary (CTA)**
- bg `--brand`, texto `--brand-contrast`, sem borda
- padding 12px 24px, height 44px, raio `--r-md`
- shadow `--shadow-xs` em repouso
- hover: bg `--brand-hover` + `--shadow-brand`, translateY(-1px)
- active: translateY(0), shadow xs
- focus-visible: outline 2px `--brand`, offset 2px
- transition 0.18s cubic-bezier(0.4,0,0.2,1)

**Secondary**
- bg `--surface`, texto `--text`, borda 1px `--border-strong`
- mesmas medidas do primary
- hover: bg `--surface-2`, borda `--brand`

**Ghost** (acoes terciarias, toolbars)
- bg transparente, texto `--text-secondary`
- hover: bg `--surface-2`, texto `--text`

**Pill CTA** (landing hero) — primary com raio `--r-pill`.

**Icon button** — 40x40, raio `--r-md`, ghost por padrao, alvo de toque >= 44px com area de clique.

### 6.2 Cards

**Card padrao**
- bg `--surface`, borda 1px `--border`, raio `--r-lg`, padding 24px, shadow `--shadow-xs`
- hover (se clicavel): `--shadow-md`, borda `--border-strong`, translateY(-2px)

**Card de mentor (vitrine de match)** — o componente mais importante do produto
- bg `--surface`, raio `--r-lg`, padding 20px, shadow `--shadow-sm`
- avatar 64px circular no topo, nome H3, cargo body-small `--text-secondary`
- chips de skill (ver 6.4) em linha, max 3 visiveis + "+N"
- barra de capacidade: progress fina mostrando vagas (ex: 2/4 mentees)
- status badge no canto (Disponivel / Lotado / Waitlist)
- CTA primary "Ver perfil" no rodape
- hover: eleva para `--shadow-md`

**Card selecionado** — borda 2px `--brand`, fundo `--brand-soft` sutil.

### 6.3 Inputs e Forms

- bg `--surface`, borda 1px `--border-strong`, raio `--r-sm`, padding 12px 14px
- texto 16px (nunca menos, evita zoom no iOS), label 12px uppercase `--text-secondary`
- focus: borda `--brand` + ring 0 0 0 3px `--brand-ring`
- erro: borda `--danger` + helper text `--danger`
- disabled: bg `--surface-2`, texto `--text-muted`
- altura minima 44px

### 6.4 Chips / Tags de Skill

- bg `--surface-2`, texto `--text-secondary`, raio `--r-pill`, padding 4px 12px, 13px peso 500
- selecionado: bg `--brand-soft`, texto `--brand`, borda 1px `--brand`
- removivel: x icon 14px a direita

### 6.5 Badges de Status

Raio `--r-pill`, 12px peso 600, padding 3px 10px, com dot 6px a esquerda.
- Disponivel / Aceito: dot `--success`, texto `--success`, bg success a 10%
- Waitlist / Pendente: dot `--warning`, texto `--warning`, bg warning a 10%
- Lotado / Recusado: dot `--danger`, texto `--danger`, bg danger a 10%
- Info / Score: dot `--info`, texto `--info`, bg info a 10%

Badge "tonal" (texto colorido sobre fundo translucido) e mais premium que badge solido berrante.

### 6.6 Navegacao

**App sidebar** — bg `--surface`, borda direita 1px `--border`, largura 248px. Item ativo: bg `--brand-soft`, texto `--brand`, indicador 3px `--brand` a esquerda. Item inativo: `--text-secondary`, hover `--surface-2`.

**Landing navbar** — transparente sobre hero, vira `--surface` com `--shadow-xs` ao rolar. Links `--text-secondary`, hover `--text`. CTA pill a direita.

### 6.7 Progress / Capacidade

- track `--surface-2`, fill `--brand`, height 6px, raio pill
- variante semantica: fill muda para `--warning` perto do limite, `--danger` no limite

### 6.8 Modais

- overlay rgba(11,11,15,0.48) com backdrop-blur 4px
- painel `--surface`, raio `--r-lg`, padding 32px, shadow `--shadow-lg`, max-width 480px
- entrada: fade + scale 0.96 -> 1, 0.2s

### 6.9 Toasts

- card `--surface`, raio `--r-md`, shadow `--shadow-lg`, borda-esquerda 3px na cor semantica
- icone semantico + titulo body-strong + descricao body-small

### 6.10 Empty states

- icone Lucide 40px `--text-muted`, H3, body `--text-secondary`, CTA secondary
- nunca tela vazia sem orientacao de proximo passo

### 6.11 Skeletons (loading)

- bg `--surface-2`, raio do componente alvo, shimmer suave (nao pulse berrante)

---

## 7. Motion

**Eases**
- standard (UI): `cubic-bezier(0.4, 0, 0.2, 1)`
- entrance (reveal): `cubic-bezier(0.16, 1, 0.3, 1)` — out-expo suave
- emphasis: `cubic-bezier(0.34, 1.56, 0.64, 1)` — leve overshoot, so em confirmacao de match

**Duracoes**
- micro (hover, toggle): 0.15s
- ui (modal, dropdown): 0.2s
- entrance (reveal, stagger item): 0.5s
- nunca exceder 0.6s

**Distancia de reveal**: y 16px a 24px, sempre com opacity 0 -> 1.

**Stagger**: 0.06s a 0.08s entre filhos em grids e listas.

**Regras (inviolaveis)**
1. `prefers-reduced-motion` FIRST. Todo componente de motion checa `useReducedMotion()`.
2. Reveal ONCE: nao re-animar a cada scroll.
3. Opacity SEMPRE acompanha transform.
4. Motion serve a compreensao (de onde veio, para onde foi), nao decoracao.
5. Momento de deleite unico: animacao de "match confirmado" pode usar emphasis ease. Em todo o resto, sobriedade.

---

## 8. Responsivo

| Breakpoint | Largura | Mudancas |
|---|---|---|
| Mobile | 320–767px | 1 coluna, margem 24px, sidebar vira drawer, fontes mobile da Secao 3 |
| Tablet | 768–1023px | 2 colunas em grids, margem 48px, sidebar colapsavel |
| Desktop | 1024px+ | grid completo, sidebar fixa 248px, max-width 1200px conteudo |

- Grid de match: 1 col mobile / 2 col tablet / 3 col desktop / 4 col >= 1440px
- Alvos de toque >= 44x44px sempre
- Body >= 16px sempre

---

## 9. White-label — regras de tenant

1. Tenant define apenas `--brand`, `--brand-hover` (auto-derivavel) e logo. Neutros e semanticos NUNCA mudam.
2. No upload da cor de marca, validar contraste de `--brand-contrast` (branco ou `--text`) sobre `--brand` >= 4.5:1. Se falhar, sugerir escurecer a cor ou trocar o texto para escuro automaticamente.
3. `--brand-soft` e `--brand-ring` derivam do `--brand` por opacidade, nao sao escolhidos manualmente.
4. Logo: area segura, fundo transparente PNG/SVG, altura normalizada a 32px no header.
5. Default (tenant demo) = Indigo `#4F46E5`. Isso garante que mesmo sem branding o produto parece premium, nao quebrado.

---

## 10. Principios de Design

1. **Branca de marca e convidada, neutro e anfitriao.** A cor do tenant aparece em CTA, links e destaques pontuais. O resto respira em neutro frio.
2. **Profundidade sutil.** Sombra com blur, elevacao proporcional a interatividade. Nunca efeito duro decorativo.
3. **Hierarquia por proporcao.** Tamanhos calmos, peso e espaco fazem o trabalho que a cor nao precisa fazer.
4. **Confianca sobre hype.** Mentoria corporativa nao e growth-hack de consumer. Sobrio, adulto, claro.
5. **Acessibilidade nao e opcional.** 4.5:1 texto, foco visivel, 44px touch, reduced-motion. Sem excecao.
6. **Um momento de deleite.** O "match confirmado" pode brilhar. O resto e ferramenta limpa.

---

## 11. Anti-padroes (nunca fazer)

- Nunca usar amarelo puro `#FFFF00` como cor de produto ou de texto.
- Nunca sombra offset com zero blur (assinatura de outro produto).
- Nunca raio universal de 34px em tudo.
- Nunca cor de marca hardcoded — sempre token `--brand`.
- Nunca corpo de texto abaixo de 16px ou centralizado em paragrafos.
- Nunca mais de 2 pesos de fonte por tela.
- Nunca gamificacao infantil (rankings berrantes, confetti em tudo, badges de jogo).
- Nunca animar `y` sem `opacity`, nunca ignorar reduced-motion.
- Nunca mais de 1 CTA primario por secao.
