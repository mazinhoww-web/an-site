# M9 - Ampliação UX

> Milestone opcional após M8. Foco: ampliar engajamento e UX com features que não são críticas para o core do site, mas elevam a percepção de produto.

---

## Contexto

Após M8, o site funciona ponta a ponta: download real, admin CRUD, newsletter, performance e acessibilidade auditados. Restam 3 frentes de ampliação que ficaram fora do escopo crítico: discussão em torno do conteúdo (comentários), distribuição cross-platform (LinkedIn) e adaptação de tema (dark mode).

## Objetivo

Adicionar 3 features de ampliação que aumentam tempo de engajamento, alcance e personalização, sem aumentar significativamente a superfície de manutenção.

## Dependências

- M8 completo e em produção
- Repositório GitHub `mazinhoww-web/an-site` público (Giscus precisa de discussions habilitadas)
- Conta LinkedIn pessoal `/in/mazinho/` ativa
- Aurimar logado como admin em produção

## Decisões travadas (NÃO renegociar)

1. **Comentários só em `/noticias/[slug]` e `/eventos/[slug]`**, não em `/skills/[slug]` ou pages institucionais. Razão: conteúdo editorial gera discussão; assets baixáveis e bio não.
2. **Giscus em vez de Disqus ou similar**: zero tracking, dados próprios (GitHub Discussions), tema custom respeita brand.
3. **LinkedIn começa como share helper manual**. Auto-post via OAuth API fica como subslice opcional 9.2b, não bloqueante.
4. **Dark mode preserva regras de brand**, só inverte papéis: ink vira fundo, bone vira foreground. Lime continua accent. Sem cor nova.
5. **Toggle de tema usa mono caption switch** `[BONE | INK]`, não icon de sol/lua (icon convencional não bate com a linguagem do site).
6. **Tema padrão é light (bone)**. Dark é opt-in via toggle, persistido em localStorage. Não respeitar `prefers-color-scheme` automaticamente (decisão deliberada: bone é a identidade, dark é exceção).
7. **Foto editorial e hero photo NÃO mudam em dark mode**. Continuam grayscale. Mudar foto por tema duplicaria asset sem ganho real.
8. **Marquee de logos em dark mode**: `filter: grayscale(1) brightness(0) invert(1)` para virar bone puro sobre ink.

---

## Slice 9.1 - Comentários via Giscus

### Objetivo

Adicionar seção de comentários no rodapé de cada `/noticias/[slug]` e `/eventos/[slug]`, com tema customizado que respeita a brand AN.

### Setup externo (manual, fora do código)

**9.1.0 GitHub Discussions**

1. Abrir `https://github.com/mazinhoww-web/an-site/settings`
2. Em "General", habilitar `Discussions`
3. Em `Discussions > Categories`, criar categoria `Comments`:
   - Type: `Announcement` (apenas mantenedor cria a discussão raiz, comentários ficam abertos)
   - Description: `Comentários do site aurimarnogueira.com.br`

**9.1.1 Configurar giscus.app**

1. Acessar `https://giscus.app/pt-BR`
2. Informar repositório: `mazinhoww-web/an-site`
3. Categoria: `Comments`
4. Mapeamento: `pathname` (cada slug = uma discussão)
5. Recursos: habilitar reactions
6. Tema: `Custom` (será criado em 9.1.3)
7. Copiar `data-repo-id` e `data-category-id` para usar no componente

### Tasks

**9.1.2 Componente Giscus**

```tsx
// src/components/Giscus.tsx
'use client'
import { useEffect, useRef } from 'react'

interface GiscusProps {
  slug: string
}

export function Giscus({ slug }: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', 'mazinhoww-web/an-site')
    script.setAttribute('data-repo-id', process.env.NEXT_PUBLIC_GISCUS_REPO_ID!)
    script.setAttribute('data-category', 'Comments')
    script.setAttribute('data-category-id', process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID!)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '1')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'https://aurimarnogueira.com.br/giscus-bone.css')
    script.setAttribute('data-lang', 'pt')
    script.setAttribute('data-loading', 'lazy')

    ref.current.appendChild(script)
  }, [slug])

  return (
    <section className="comments" aria-label="Comentários">
      <div className="comments__header">
        <span className="comments__caption">COMENTÁRIOS</span>
      </div>
      <div ref={ref} />
    </section>
  )
}
```

**9.1.3 Tema customizado bone**

Criar `public/giscus-bone.css` com overrides para alinhar Giscus à brand:

```css
/* public/giscus-bone.css */
main {
  --color-prettylights-syntax-comment: #6b6b6b;
  --color-fg-default: #0A0A0A;
  --color-fg-muted: #6b6b6b;
  --color-fg-subtle: #9a9a9a;
  --color-canvas-default: #F5F4EF;
  --color-canvas-subtle: #F5F4EF;
  --color-border-default: #E5E3DC;
  --color-border-muted: #E5E3DC;
  --color-neutral-muted: rgba(10, 10, 10, 0.05);
  --color-accent-fg: #0A0A0A;
  --color-accent-emphasis: #CCFF00;
  --color-accent-muted: #CCFF00;
  --color-accent-subtle: #F5F4EF;
  --color-success-fg: #0A0A0A;
  --color-attention-fg: #0A0A0A;
  --color-danger-fg: #0A0A0A;

  font-family: 'Inter', system-ui, sans-serif;
}

main .gsc-comment-box,
main .gsc-comments {
  border-color: #E5E3DC;
  border-radius: 0;
}

main .gsc-comment-box-bottom,
main .gsc-comment-header,
main .gsc-comment-content {
  border-radius: 0;
}

main .gsc-reactions-popover {
  border-radius: 0;
}

main button {
  border-radius: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

main .gsc-comment-author-avatar {
  border-radius: 0;
  border: 1px solid #E5E3DC;
}
```

Notas:
- Giscus usa CSS variables internas
- Override aplica via URL no `data-theme`
- Restrição de borda 0 garante alinhamento com o resto do site
- Mono em buttons mantém identidade

**9.1.4 Inserção nas páginas**

```tsx
// src/app/noticias/[slug]/page.tsx
import { Giscus } from '@/components/Giscus'

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // ... fetch da notícia
  return (
    <article>
      {/* corpo do artigo */}
      <Giscus slug={slug} />
    </article>
  )
}
```

Idem para `src/app/eventos/[slug]/page.tsx`.

**9.1.5 Versão dark do tema**

Criar `public/giscus-ink.css` com paleta invertida (preparação para 9.3):

```css
main {
  --color-fg-default: #F5F4EF;
  --color-canvas-default: #0A0A0A;
  --color-border-default: #2A2A2A;
  /* ... etc */
}
```

Componente Giscus lê tema ativo via classe no `html` e troca URL do CSS dinamicamente:

```tsx
const theme = document.documentElement.classList.contains('theme-ink') ? 'ink' : 'bone'
script.setAttribute('data-theme', `https://aurimarnogueira.com.br/giscus-${theme}.css`)
```

Adicionar listener para mudança de tema que dispara `IFrameMessage` para o Giscus iframe:

```ts
function postGiscusTheme(theme: 'bone' | 'ink') {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme: `https://aurimarnogueira.com.br/giscus-${theme}.css` } } },
    'https://giscus.app'
  )
}
```

### Must-haves verificáveis

- [ ] Comentários carregam em `/noticias/[slug]` e `/eventos/[slug]`
- [ ] Cada slug gera uma discussão própria em GitHub Discussions
- [ ] Tema bone respeita paleta (bone bg, ink text, lime accent, hairline border)
- [ ] Fonte Inter no corpo, JetBrains Mono em buttons
- [ ] Sem border-radius arredondado em nenhum elemento
- [ ] Lazy load: comentários só carregam quando entram no viewport
- [ ] Lighthouse Performance da página com comentários ainda 90+
- [ ] Reactions habilitadas e funcionais
- [ ] Tema troca dinamicamente quando dark mode ativado (validar após 9.3)

### Commit proposto

```
feat(comments): integrar Giscus em noticias e eventos com tema customizado

- Componente Giscus com lazy load e mapping por pathname
- Tema bone e ink em public/giscus-{bone,ink}.css
- Reactions habilitadas, sem border-radius, fonte Inter+Mono
- Switch dinâmico de tema via postMessage no iframe
```

---

## Slice 9.2 - LinkedIn share helper

### Objetivo

Facilitar a distribuição manual de novas publicações (news, events) no LinkedIn pessoal, com texto pré-formatado e URL com tracking.

### Escopo de 9.2

Versão MVP: helper em `/admin` que gera copy + link pronto para publicação manual. Aurimar copia, cola no LinkedIn, publica.

Versão auto-post (subslice opcional 9.2b): integração via LinkedIn API com OAuth. Não bloqueante.

### Tasks

**9.2.1 Helper de copy generation**

Em `/admin/news/[id]` e `/admin/events/[id]`, adicionar painel lateral "Compartilhar no LinkedIn":

```tsx
// src/components/LinkedInShareHelper.tsx
'use client'
import { useState } from 'react'

interface Props {
  title: string
  excerpt: string
  slug: string
  type: 'news' | 'event'
}

export function LinkedInShareHelper({ title, excerpt, slug, type }: Props) {
  const [copied, setCopied] = useState(false)
  const url = `https://aurimarnogueira.com.br/${type === 'news' ? 'noticias' : 'eventos'}/${slug}?utm_source=linkedin&utm_medium=share&utm_campaign=${type}`

  const text = [
    title,
    '',
    excerpt,
    '',
    url,
    '',
    type === 'news'
      ? '#fintech #loyalty #inovacao'
      : '#fintech #loyalty #eventos',
  ].join('\n')

  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  async function copyToClipboard() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside className="share-helper">
      <h3 className="share-helper__title">COMPARTILHAR NO LINKEDIN</h3>
      <pre className="share-helper__preview">{text}</pre>
      <div className="share-helper__actions">
        <button onClick={copyToClipboard}>
          {copied ? 'COPIADO' : 'COPIAR TEXTO'}
        </button>
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          ABRIR LINKEDIN
        </a>
      </div>
    </aside>
  )
}
```

CSS:

```css
.share-helper {
  border: 1px solid #E5E3DC;
  padding: 16px;
  background: #F5F4EF;
}

.share-helper__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  margin: 0 0 12px;
}

.share-helper__preview {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  white-space: pre-wrap;
  background: white;
  padding: 12px;
  border: 1px solid #E5E3DC;
  margin: 0 0 12px;
  max-height: 240px;
  overflow-y: auto;
}

.share-helper__actions {
  display: flex;
  gap: 8px;
}

.share-helper__actions button,
.share-helper__actions a {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  padding: 8px 16px;
  background: #0A0A0A;
  color: #F5F4EF;
  border: none;
  text-decoration: none;
  cursor: pointer;
}

.share-helper__actions a {
  background: #CCFF00;
  color: #0A0A0A;
}
```

**9.2.2 UTM tracking em todos os links**

Padronizar UTM em todos os links externos do site para o LinkedIn:

```
utm_source=linkedin
utm_medium=share
utm_campaign={news|event}
```

Validar que a tabela `page_analytics` ou `custom_events` capta `utm_source` ao carregar a página.

**9.2.3 Subslice opcional 9.2b: auto-post via LinkedIn API**

Não executar a não ser que Aurimar peça explicitamente. Estrutura prevista:

1. App LinkedIn criado em `developer.linkedin.com`
2. OAuth scope: `w_member_social`
3. Flow:
   - `/admin/linkedin/connect` → redireciona para LinkedIn OAuth
   - Callback `/admin/linkedin/callback` salva access_token e refresh_token em tabela `linkedin_credentials`
   - Em `/admin/news/[id]`, novo botão `PUBLICAR NO LINKEDIN`
   - Server action `publishToLinkedIn(newsId)` chama LinkedIn UGC API
4. Token refresh automático antes de expirar

Custo de implementação: ~2 dias. Custo de manutenção: tokens, scope renewal a cada 60 dias, possíveis breaking changes da API. Por isso fica como opcional.

### Must-haves verificáveis

- [ ] Painel "Compartilhar no LinkedIn" aparece em `/admin/news/[id]` e `/admin/events/[id]`
- [ ] Botão "COPIAR TEXTO" copia para clipboard
- [ ] Botão "ABRIR LINKEDIN" abre janela de share do LinkedIn com URL pré-populada
- [ ] URL gerada contém UTM correto (linkedin/share/{news|event})
- [ ] `page_analytics` registra visitas com `utm_source=linkedin` corretamente
- [ ] Sem 9.2b implementado por default

### Commit proposto

```
feat(share): adicionar helper de compartilhamento LinkedIn em /admin

- Painel em /admin/news/[id] e /admin/events/[id]
- Copy gerado com title, excerpt, URL e hashtags
- Botões "copiar texto" e "abrir LinkedIn share"
- UTM padronizado (source=linkedin, medium=share)
```

---

## Slice 9.3 - Dark mode (tema ink)

### Objetivo

Adicionar tema alternativo ink (paleta invertida) com toggle persistido, respeitando as regras de brand.

### Mapeamento de tokens

| Token | Light (bone) | Dark (ink) |
|---|---|---|
| `--color-bg` | `#F5F4EF` | `#0A0A0A` |
| `--color-fg` | `#0A0A0A` | `#F5F4EF` |
| `--color-accent` | `#CCFF00` | `#CCFF00` |
| `--color-hairline` | `#E5E3DC` | `#2A2A2A` |
| `--color-fg-muted` | `rgba(10,10,10,0.6)` | `rgba(245,244,239,0.7)` |

Lime continua sendo accent em ambos. Não mudar.

### Tasks

**9.3.1 Refatorar CSS para tokens**

Migrar valores hard-coded de cor (`#F5F4EF`, `#0A0A0A`, `#E5E3DC`) para variáveis CSS em `:root` e `html.theme-ink`:

```css
/* src/styles/tokens.css */
:root {
  --color-bg: #F5F4EF;
  --color-fg: #0A0A0A;
  --color-accent: #CCFF00;
  --color-hairline: #E5E3DC;
  --color-fg-muted: rgba(10, 10, 10, 0.6);
}

html.theme-ink {
  --color-bg: #0A0A0A;
  --color-fg: #F5F4EF;
  --color-accent: #CCFF00;
  --color-hairline: #2A2A2A;
  --color-fg-muted: rgba(245, 244, 239, 0.7);
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
}
```

Audit do repo:

```bash
grep -rn "#F5F4EF\|#0A0A0A\|#E5E3DC\|#CCFF00" src/ --include="*.css" --include="*.tsx"
```

Substituir matches por `var(--color-*)` exceto em assets exportáveis (giscus-bone.css fica como está, giscus-ink.css é a versão dark).

**9.3.2 Tratamento de fotos em dark mode**

Fotos continuam `grayscale(1) contrast(1.05)`. Em dark mode, adicionar opacity menor para suavizar:

```css
.photo-frame__media img,
.home-hero__photo img,
.event-card__cover img {
  filter: grayscale(1) contrast(1.05);
  opacity: 1;
}

html.theme-ink .photo-frame__media img,
html.theme-ink .home-hero__photo img,
html.theme-ink .event-card__cover img {
  opacity: 0.85;
}
```

Overlay da hero também precisa adaptar:

```css
.home-hero__overlay {
  background: linear-gradient(to right, var(--color-bg) 0%, var(--color-bg) 35%, transparent 100%);
}
```

**9.3.3 Marquee de logos em dark mode**

```css
.logo-marquee__item img {
  filter: grayscale(1) brightness(0);
}

html.theme-ink .logo-marquee__item img {
  filter: grayscale(1) brightness(0) invert(1);
}
```

**9.3.4 Toggle component**

```tsx
// src/components/ThemeToggle.tsx
'use client'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'bone' | 'ink'>('bone')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'bone' | 'ink' | null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle('theme-ink', stored === 'ink')
    }
  }, [])

  function toggle() {
    const next = theme === 'bone' ? 'ink' : 'bone'
    setTheme(next)
    document.documentElement.classList.toggle('theme-ink', next === 'ink')
    localStorage.setItem('theme', next)
    // notifica Giscus iframe se presente
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }))
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Mudar para tema ${theme === 'bone' ? 'ink' : 'bone'}`}
      className="theme-toggle"
    >
      <span className={theme === 'bone' ? 'theme-toggle__active' : ''}>BONE</span>
      <span aria-hidden> | </span>
      <span className={theme === 'ink' ? 'theme-toggle__active' : ''}>INK</span>
    </button>
  )
}
```

CSS:

```css
.theme-toggle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  background: none;
  border: 1px solid var(--color-hairline);
  padding: 6px 12px;
  color: var(--color-fg-muted);
  cursor: pointer;
}

.theme-toggle__active {
  color: var(--color-fg);
}
```

**9.3.5 FOUC prevention**

Adicionar script inline no `<head>` antes de qualquer CSS para aplicar tema antes do render:

```tsx
// src/app/layout.tsx
<head>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        try {
          var theme = localStorage.getItem('theme');
          if (theme === 'ink') document.documentElement.classList.add('theme-ink');
        } catch (e) {}
      `,
    }}
  />
</head>
```

**9.3.6 Posicionamento do toggle**

- Header: à direita, depois do menu principal
- Mobile: dentro do menu hambúrguer, primeira opção

**9.3.7 Sincronizar Giscus**

Listener no componente Giscus para o evento `themechange`:

```tsx
useEffect(() => {
  function onThemeChange(e: CustomEvent) {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (!iframe?.contentWindow) return
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: `https://aurimarnogueira.com.br/giscus-${e.detail}.css` } } },
      'https://giscus.app'
    )
  }
  window.addEventListener('themechange', onThemeChange as EventListener)
  return () => window.removeEventListener('themechange', onThemeChange as EventListener)
}, [])
```

### Must-haves verificáveis

- [ ] Toggle no header alterna entre bone e ink
- [ ] Tema escolhido persiste em localStorage
- [ ] Recarregar página mantém tema sem flash (FOUC)
- [ ] Contraste em dark mode passa AA (validar com axe DevTools)
- [ ] Lime continua legível como accent em ambos os temas
- [ ] Hairline em dark é `#2A2A2A`, visível mas discreto
- [ ] Fotos em dark mode com opacity 0.85
- [ ] Marquee de logos em dark mode com invert
- [ ] Giscus troca para tema ink dinamicamente
- [ ] Lighthouse Accessibility 100 em ambos os temas
- [ ] Toggle alcançável via Tab
- [ ] `aria-label` no toggle anuncia transição

### Commit proposto

```
feat(theme): adicionar dark mode (ink) com toggle persistido

- Tokens CSS em :root e html.theme-ink
- Refatora cores hard-coded para var(--color-*)
- Toggle mono [BONE | INK] no header
- Persistência em localStorage com FOUC prevention
- Sincronização do tema Giscus via postMessage
- Tratamento de fotos com opacity 0.85 em dark
- Marquee de logos com invert em dark
```

---

## Critérios de aceite do milestone

- [ ] Comentários funcionais em `/noticias/[slug]` e `/eventos/[slug]`
- [ ] Helper de compartilhamento LinkedIn presente em admin com copy gerado
- [ ] Dark mode funcional com toggle persistido e respeito a contraste AA
- [ ] Nenhuma das 3 features regrediu performance abaixo dos thresholds de M8
- [ ] Tag `v0.9.0` aplicada após push da última slice

## Plano de commits

```
1. feat(comments): integrar Giscus em noticias e eventos com tema customizado
2. feat(share): adicionar helper de compartilhamento LinkedIn em /admin
3. feat(theme): adicionar dark mode (ink) com toggle persistido
```

## Ordem de execução sugerida

1. **9.1 Giscus** (menor risco, isolado, sem dependência interna)
2. **9.2 LinkedIn share** (também isolado, valor direto pra distribuição de conteúdo)
3. **9.3 Dark mode** (refator maior, mexe em CSS de todo o site, melhor por último para não conflitar com 9.1 e 9.2)

## Pendências antes de executar M9

- [ ] M8 completo em produção
- [ ] GitHub Discussions habilitado no repo
- [ ] Categoria `Comments` criada em Discussions
- [ ] `NEXT_PUBLIC_GISCUS_REPO_ID` e `NEXT_PUBLIC_GISCUS_CATEGORY_ID` configurados em env vars Vercel

## Não-objetivos do M9

- Auto-post automatizado para LinkedIn (subslice 9.2b opcional, fora do escopo default)
- Cross-posting para Twitter, Instagram, BlueSky (backlog)
- Moderação de comentários via webhook (Giscus já oferece pelo GitHub, sem UI customizada)
- Tema customizado por usuário (só bone e ink, sem terceira opção)
- Sincronizar tema com `prefers-color-scheme` automático (decisão deliberada)
- A/B testing entre temas
- Animação de transição entre temas (mudança é instantânea para preservar performance)
