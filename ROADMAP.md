# ROADMAP.md — AN. Personal Site

Estrutura GSD2: **Milestone → Slice → Task**.
Cada task tem owner (Claude Code) e critério de pronto verificável.
Ordem de execução é estrita: nenhum slice avança com tasks pendentes do anterior.

---

## Milestone M1 — Foundation (semana 1)

**Goal:** Repo, infra, design system e shell pronto para receber conteúdo.

### Slice 1.1 — Setup do repo e Next.js

- [ ] T1.1.1 Criar repo `mazinhoww-web/an-website` (privado).
- [ ] T1.1.2 `npx create-next-app@latest` com TypeScript estrito, Tailwind, App Router, ESLint, src/ dir.
- [ ] T1.1.3 Configurar `eslint`, `prettier`, `lint-staged`, `husky` pre-commit.
- [ ] T1.1.4 Criar `.env.example`, `.gitignore` (Next.js + Drizzle + macOS).
- [ ] T1.1.5 Configurar `next.config.js` com `images.remotePatterns` para Vercel Blob.
- [ ] T1.1.6 Primeiro commit `chore: bootstrap project`.

**Pronto quando:** `pnpm dev` roda na 3000, type-check verde, primeiro deploy preview Vercel rodando "Hello".

### Slice 1.2 — Design tokens e tipografia

- [ ] T1.2.1 Configurar `next/font/google` para Space Grotesk, Inter, JetBrains Mono.
- [ ] T1.2.2 Adicionar `tailwind.config.ts` com cores, fontes, espaçamentos do DESIGN.md.
- [ ] T1.2.3 Criar `globals.css` com variáveis CSS exatas do brand book.
- [ ] T1.2.4 Criar página `/dev/tokens` (apenas em dev) para visualizar paleta, escala tipográfica e componentes base.

**Pronto quando:** página `/dev/tokens` renderiza paleta completa e três escalas de fonte conforme brand book.

### Slice 1.3 — Componentes shell

- [ ] T1.3.1 Componente `<Mark>` (renderiza `AN.` com lime no ponto, props de tamanho).
- [ ] T1.3.2 Componente `<Label>` (uppercase, letter-spaced, mono variant).
- [ ] T1.3.3 Componente `<Hairline>` (divisor 1px).
- [ ] T1.3.4 Componente `<Nav>` (fixed top, blur, links com underline lime no hover/active).
- [ ] T1.3.5 Componente `<Footer>` (mark, tagline, descritor, links sociais, ano).
- [ ] T1.3.6 Layout root aplicando nav + footer + container 1280max.

**Pronto quando:** layout shell renderiza em todas viewports (375, 768, 1280) sem CLS.

### Slice 1.4 — Vercel Postgres + Drizzle init

- [ ] T1.4.1 Provisionar Vercel Postgres (an-site-db) + KV + Blob via dashboard Vercel.
- [ ] T1.4.2 Criar `src/db/schema.ts` com schema Drizzle completo conforme STACK-V5.md secao 4.2.
- [ ] T1.4.3 Criar `src/db/index.ts` com Drizzle client conectando via @vercel/postgres.
- [ ] T1.4.4 Configurar `drizzle.config.ts` apontando para POSTGRES_URL.
- [ ] T1.4.5 Rodar `pnpm db:generate` e `pnpm db:migrate` para aplicar schema.
- [ ] T1.4.6 Configurar `src/lib/auth.ts` com Auth.js v5 + DrizzleAdapter + Resend provider.

**Pronto quando:** `pnpm db:migrate` aplica sem erro e `db.select().from(skills)` retorna [].

---

## Milestone M2 — Site Público Estático (semana 2)

**Goal:** Páginas públicas read-only navegáveis.

### Slice 2.1 — Home

- [ ] T2.1.1 Implementar hero conforme DESIGN.md seção Home.
- [ ] T2.1.2 Bloco "Em destaque" lendo `projects` onde `is_featured = true` ordenado por `published_at`.
- [ ] T2.1.3 Bloco "Skills em destaque" lendo `skills` onde `is_featured = true`.
- [ ] T2.1.4 Bloco "Últimas notícias" lendo `news` ordenado por `published_at` (limit 3).
- [ ] T2.1.5 Bloco newsletter signup (form sem submit funcional ainda).
- [ ] T2.1.6 CTA "Trabalhar comigo" linkando para `/contato`.

**Pronto quando:** home renderiza com seed data, mobile e desktop ok, Lighthouse Performance ≥90 em preview.

### Slice 2.2 — Sobre

- [ ] T2.2.1 Página `/sobre` com bio em markdown.
- [ ] T2.2.2 Componente `<PhotoFrame>` (frame 1:1 com mark, tag, lime bar conforme brand book).
- [ ] T2.2.3 Timeline de empresas como lista com hairline divider.
- [ ] T2.2.4 Lista de frameworks criados (Jet Ski, Innovation2Business, GSD2).
- [ ] T2.2.5 Bloco de links externos.

**Pronto quando:** `/sobre` renderiza com foto em frame especificado, todos elementos do brand book.

### Slice 2.3 — Projetos lista + detalhe

- [ ] T2.3.1 Página `/projetos` (lista paginada, card com thumb + tags + ano).
- [ ] T2.3.2 Filtro por tag (querystring `?tag=fintech`).
- [ ] T2.3.3 Página `/projetos/[slug]` (detalhe).
- [ ] T2.3.4 `generateMetadata` por projeto (OG, twitter card).
- [ ] T2.3.5 Bloco "Projetos relacionados" (3 mais recentes com tag em comum).

**Pronto quando:** seed com 6 projetos, navegação lista <-> detalhe sem broken state.

### Slice 2.4 — Notícias

- [ ] T2.4.1 Página `/noticias` lista cronológica.
- [ ] T2.4.2 Página `/noticias/[slug]` detalhe com share buttons.
- [ ] T2.4.3 Markdown renderer (`@next/mdx` ou `react-markdown` com `remark-gfm`).
- [ ] T2.4.4 OG image gerada via `@vercel/og` por notícia.

**Pronto quando:** seed com 3 notícias renderiza com share funcional.

### Slice 2.5 — Contato

- [ ] T2.5.1 Página `/contato` com form (RHF + Zod).
- [ ] T2.5.2 Server Action `submitContact` valida, grava em `contacts`, dispara email via Resend.
- [ ] T2.5.3 Confirmação inline, reset form em sucesso.
- [ ] T2.5.4 Rate limit por IP (middleware Upstash ou Redis).
- [ ] T2.5.5 Aviso LGPD inline com link para `/privacidade`.

**Pronto quando:** form rejeita inválido, aceita válido, Aurimar recebe email de teste.

---

## Milestone M3 — Skills Hub (semana 3)

**Goal:** Loop de download com email gate funcional.

### Slice 3.1 — Skills lista e detalhe

- [ ] T3.1.1 Página `/skills` (grid card com badge FREE, contador downloads, tags).
- [ ] T3.1.2 Filtro por categoria via querystring.
- [ ] T3.1.3 Página `/skills/[slug]` com descrição longa, tags, botão "Baixar skill".
- [ ] T3.1.4 Componente `<SkillCard>` reutilizável.

**Pronto quando:** seed com 8 skills SCIENT + skills próprias renderiza.

### Slice 3.2 — Email gate de download

- [ ] T3.2.1 Modal `<DownloadGate>` aberto pelo botão de download.
- [ ] T3.2.2 Se cookie `an_email_verified` válido (30d), exibe botão direto.
- [ ] T3.2.3 Senão, form com email + checkbox `consent_newsletter` (opcional) + checkbox `consent_lgpd` (obrigatório).
- [ ] T3.2.4 Server Action `requestSkillDownload`: upserta `subscribers`, cria `downloads` row, gera signed URL Vercel Blob valida 10min.
- [ ] T3.2.5 Set cookie `an_email_verified` httpOnly 30d.
- [ ] T3.2.6 Disparar email de confirmação (double opt-in) se `consent_newsletter = true`.
- [ ] T3.2.7 Incrementar `download_count` na skill.

**Pronto quando:** primeiro download exige email, segundo download (mesmo browser) baixa direto, contador incrementa.

### Slice 3.3 — Página "Como Instalar"

- [ ] T3.3.1 Página `/skills/como-usar` com 5 passos conforme PDF da SCIENT, identidade AN.
- [ ] T3.3.2 Bloco FAQ (accordion) com perguntas: funciona no claude.ai web, múltiplas skills simultâneas, atualizações, compatibilidade, troubleshooting.
- [ ] T3.3.3 CTA inferior para galeria de skills.

**Pronto quando:** página renderiza estática, navegação por teclado ok, sem JS bloqueante.

---

## Milestone M4 — Admin (semana 4)

**Goal:** Aurimar publica conteúdo sem código.

### Slice 4.1 — Auth e shell admin

- [ ] T4.1.1 Pagina `/admin/login` (magic link via Auth.js v5 + Resend).
- [ ] T4.1.2 Middleware `middleware.ts` protege `/admin/*` e checa allow-list `ADMIN_EMAILS`.
- [ ] T4.1.3 Layout `/admin/layout.tsx` com sidebar (Dashboard, Projetos, Skills, Notícias, Subscribers, Mensagens, Newsletter).
- [ ] T4.1.4 Logout via Server Action.

**Pronto quando:** apenas email em `ADMIN_EMAILS` consegue entrar.

### Slice 4.2 — Dashboard

- [ ] T4.2.1 Cards de métricas: subscribers confirmados, downloads totais, mensagens não-lidas.
- [ ] T4.2.2 Tabela "Últimas mensagens" (5 mais recentes).
- [ ] T4.2.3 Tabela "Últimos downloads" (5 mais recentes).

**Pronto quando:** dashboard reflete dados reais sem refresh manual (revalidate 60s).

### Slice 4.3 — CRUD Projetos

- [ ] T4.3.1 `/admin/projetos` lista com busca e filtro por status.
- [ ] T4.3.2 `/admin/projetos/novo` com form (título, slug auto, sumário, body MD, tags, links, thumbnail upload).
- [ ] T4.3.3 `/admin/projetos/[id]/editar` reutiliza form.
- [ ] T4.3.4 Toggle `is_featured` e `is_published`.
- [ ] T4.3.5 Delete com confirmação dupla.

**Pronto quando:** criar/editar/publicar/despublicar/deletar funciona end-to-end.

### Slice 4.4 — CRUD Skills

- [ ] T4.4.1 `/admin/skills` lista com download_count.
- [ ] T4.4.2 Form de skill com upload de arquivo `.skill` (até 5MB) para bucket `skills` privado.
- [ ] T4.4.3 Form de skill com upload de thumbnail para `media` público.
- [ ] T4.4.4 Validação extensão `.skill` no client e server.
- [ ] T4.4.5 Toggle published.

**Pronto quando:** upload de `.skill` real entra no Storage e download via site público funciona.

### Slice 4.5 — CRUD Notícias

- [ ] T4.5.1 `/admin/noticias` lista.
- [ ] T4.5.2 Form com title, slug, body MD, categoria, cover image, published_at.
- [ ] T4.5.3 Preview ao lado do editor.

**Pronto quando:** publicação aparece em `/noticias` em <60s (ISR revalidate).

### Slice 4.6 — Subscribers e Mensagens

- [ ] T4.6.1 `/admin/subscribers` tabela com busca, filtro confirmed/unsub, export CSV.
- [ ] T4.6.2 `/admin/mensagens` tabela com marcar-como-lido, responder via link `mailto`.
- [ ] T4.6.3 Soft-delete (LGPD) para subscriber via botão "Apagar dados".

**Pronto quando:** export CSV abre no Excel, marcar-como-lido persiste.

### Slice 4.7 — Newsletter

- [ ] T4.7.1 `/admin/newsletter/nova` editor markdown + subject + preview HTML.
- [ ] T4.7.2 Server Action `dispatchNewsletter` lê subscribers `confirmed=true AND unsubscribed=false`, dispara em batches de 100 via Resend.
- [ ] T4.7.3 Grava em `newsletter_campaigns` log com `recipient_count`, `status`, `sent_at`.
- [ ] T4.7.4 `/admin/newsletter` lista campanhas anteriores.
- [ ] T4.7.5 Unsubscribe endpoint `/unsubscribe/[token]` marca `unsubscribed=true`.

**Pronto quando:** teste de envio para 3 emails de Aurimar chega na inbox com unsubscribe funcional.

---

## Milestone M5 — Polish & Launch (semana 5)

**Goal:** Produção pronta para divulgação.

### Slice 5.1 — SEO + OG

- [ ] T5.1.1 `app/sitemap.ts` dinâmico com todas páginas + projetos + notícias + skills.
- [ ] T5.1.2 `app/robots.ts` permite tudo exceto `/admin`.
- [ ] T5.1.3 OG image dinâmica para projetos, notícias, skills via `@vercel/og`.
- [ ] T5.1.4 Structured data `Person` em home + `Article` em notícias.
- [ ] T5.1.5 Validar com Lighthouse SEO ≥95.

### Slice 5.2 — Performance

- [ ] T5.2.1 Bundle analyzer, remover deps não-utilizadas.
- [ ] T5.2.2 `next/image` em 100% das imagens.
- [ ] T5.2.3 Static generation onde possível, ISR onde dinâmico.
- [ ] T5.2.4 Confirmar LCP <2.5s em mobile real (PageSpeed Insights).

### Slice 5.3 — Acessibilidade

- [ ] T5.3.1 Auditoria axe-core, zero erros AA.
- [ ] T5.3.2 Testes manuais de teclado em todos forms e modais.
- [ ] T5.3.3 `prefers-reduced-motion` desativa animações da nav e photo frame.

### Slice 5.4 — LGPD

- [ ] T5.4.1 Página `/privacidade` redigida (Aurimar revisa).
- [ ] T5.4.2 Link visível em todos forms.
- [ ] T5.4.3 Endpoints admin export/delete para subscribers.

### Slice 5.5 — Deploy

- [ ] T5.5.1 Domínio configurado (DNS para Vercel).
- [ ] T5.5.2 Variáveis de produção configuradas em Vercel.
- [ ] T5.5.3 Resend domain verified (DKIM, SPF).
- [ ] T5.5.4 Backup Vercel Postgres verificado (managed by Neon).
- [ ] T5.5.5 Smoke test em produção (todos forms, download, magic link).
- [ ] T5.5.6 Tag `v1.0.0`.

---

## Milestone M7 — Funcional Core (semana 7-8)

**Goal:** Admin e downloads funcionando de verdade, conectados ao banco e storage.

### Slice 7.1 — DownloadGate real

- [ ] T7.1.1 Server Action `requestSkillDownload`: upsert em `subscribers`, cria row em `downloads`, gera signed URL Vercel Blob (10 min).
- [ ] T7.1.2 Set cookie `an_email_verified` httpOnly 30d no response.
- [ ] T7.1.3 Se `consent_newsletter = true`, disparar email de confirmacao (double opt-in) via Resend.
- [ ] T7.1.4 Incrementar `download_count` na skill apos download concluido.
- [ ] T7.1.5 Conectar `<DownloadGate>` ao Server Action real (remover setTimeout mock).

**Pronto quando:** primeiro download exige email, segundo download (mesmo browser) baixa direto, contador incrementa no banco.

### Slice 7.2 — Admin CRUDs reais

- [ ] T7.2.1 CRUD Projetos: `/admin/projetos` lista + `/admin/projetos/novo` form + `/admin/projetos/[id]/editar`. Server Actions para create/update/delete. Toggle `is_featured`, `is_published`.
- [ ] T7.2.2 CRUD Skills: `/admin/skills` lista + form com upload `.skill` (ate 5MB) para Vercel Blob bucket privado + thumbnail para bucket publico. Validacao extensao.
- [ ] T7.2.3 CRUD Noticias: `/admin/noticias` lista + form com title, slug, body MD, categoria, cover image, published_at. Preview ao lado do editor.
- [ ] T7.2.4 CRUD Eventos: `/admin/eventos` lista + form com campos do schema atual.
- [ ] T7.2.5 Dashboard real: cards lendo `count(*)` de subscribers confirmados, downloads totais, mensagens nao-lidas. Tabelas com 5 ultimas mensagens e 5 ultimos downloads.
- [ ] T7.2.6 Delete com confirmacao dupla em todos os CRUDs.

**Pronto quando:** criar/editar/publicar/deletar funciona end-to-end para projetos, skills, noticias e eventos. Dashboard reflete dados reais.

### Slice 7.3 — Newsletter dispatch

- [ ] T7.3.1 `/admin/newsletter/nova` editor markdown + subject + preview HTML renderizado.
- [ ] T7.3.2 Server Action `dispatchNewsletter`: le subscribers `confirmed=true AND unsubscribed=false`, dispara em batches de 100 via Resend.
- [ ] T7.3.3 Grava em `newsletter_campaigns` log com `recipient_count`, `status`, `sent_at`.
- [ ] T7.3.4 `/admin/newsletter` lista campanhas anteriores com status.
- [ ] T7.3.5 Unsubscribe endpoint `/api/unsubscribe/[token]` marca `unsubscribed=true` e renderiza pagina de confirmacao.

**Pronto quando:** teste de envio para 3 emails chega na inbox com unsubscribe funcional.

### Slice 7.4 — Subscribers e LGPD

- [ ] T7.4.1 `/admin/subscribers` tabela com busca, filtro confirmed/unsubscribed, paginacao.
- [ ] T7.4.2 Export CSV (Server Action gera CSV, retorna como download).
- [ ] T7.4.3 `/admin/mensagens` tabela com marcar-como-lido, link `mailto` para responder.
- [ ] T7.4.4 Soft-delete subscriber via botao "Apagar dados" (LGPD Art. 18).

**Pronto quando:** export CSV abre no Excel, marcar-como-lido persiste, soft-delete remove dados pessoais.

### Slice 7.5 — Pagina /projetos

- [ ] T7.5.1 Pagina `/projetos` lista paginada (12 por pagina) com card: thumbnail, titulo, tags, ano.
- [ ] T7.5.2 Filtro por tag via querystring `?tag=fintech`.
- [ ] T7.5.3 Pagina `/projetos/[slug]` detalhe com sumario, descricao MD, tags, links, galeria, projetos relacionados.
- [ ] T7.5.4 `generateMetadata` e OG image por projeto.

**Pronto quando:** seed com 6 projetos, navegacao lista <-> detalhe funcional.

---

## Milestone M8 — Qualidade e Integracao (semana 9-10)

**Goal:** Performance, acessibilidade, comentarios e integracao LinkedIn.

### Slice 8.1 — Performance audit

- [ ] T8.1.1 Bundle analyzer (`@next/bundle-analyzer`), remover deps nao utilizadas ou >100kb sem justificativa.
- [ ] T8.1.2 Confirmar `next/image` em 100% das imagens.
- [ ] T8.1.3 Static generation onde possivel, ISR onde dinamico (`revalidate: 60`).
- [ ] T8.1.4 Confirmar LCP <2.5s em mobile real (PageSpeed Insights).
- [ ] T8.1.5 Lighthouse Performance >= 90 em mobile e desktop.

**Pronto quando:** Lighthouse Performance >= 90, LCP <2.5s, CLS <0.1 em producao.

### Slice 8.2 — Acessibilidade audit

- [ ] T8.2.1 Auditoria axe-core em todas as paginas publicas, zero erros AA.
- [ ] T8.2.2 Testes manuais de teclado em todos forms, modais, accordion, filtros.
- [ ] T8.2.3 Confirmar `prefers-reduced-motion` desativa animacoes (nav, hero, hairline, photo frame).
- [ ] T8.2.4 Confirmar alvos de toque >= 44x44px em mobile.
- [ ] T8.2.5 Lighthouse Accessibility >= 95 em todas as paginas.

**Pronto quando:** axe-core zero erros, Lighthouse Accessibility >= 95, navegacao 100% por teclado.

### Slice 8.3 — Comentarios via Giscus

- [ ] T8.3.1 Criar repositorio GitHub Discussions (ou ativar no repo existente).
- [ ] T8.3.2 Instalar e configurar `@giscus/react` com tema customizado (bone/ink, sem sombra).
- [ ] T8.3.3 Adicionar bloco de comentarios em `/noticias/[slug]` abaixo do conteudo.
- [ ] T8.3.4 Estilizar iframe do Giscus para alinhar com design system (hairline borders, fontes do brand).
- [ ] T8.3.5 `prefers-color-scheme` sincroniza tema do Giscus.

**Pronto quando:** comentarios aparecem em noticias, login via GitHub, tema visual alinhado ao brand.

### Slice 8.4 — LinkedIn auto-post

- [ ] T8.4.1 Server Action `postToLinkedIn` usando LinkedIn API v2 (OAuth 2.0, scope `w_member_social`).
- [ ] T8.4.2 Armazenar tokens OAuth em Vercel KV (access_token + refresh_token).
- [ ] T8.4.3 Botao "Publicar no LinkedIn" no admin de noticias (post-publish trigger).
- [ ] T8.4.4 Template de post: titulo + excerpt + link + hashtags automaticos a partir das tags.
- [ ] T8.4.5 Log de posts enviados em tabela `linkedin_posts` (noticia_id, posted_at, linkedin_post_id).

**Pronto quando:** publicar noticia no admin dispara post no LinkedIn com link correto e hashtags.

---

## Milestone M9 — Expansao (backlog)

**Goal:** Features de longo prazo que expandem alcance e experiencia.

### Slice 9.1 — Dark mode

- [ ] T9.1.1 Adicionar tokens dark no `tailwind.config.ts` conforme DESIGN.md secao 2.1.
- [ ] T9.1.2 Toggle de tema no nav (sun/moon icon) com persistencia em localStorage.
- [ ] T9.1.3 `prefers-color-scheme: dark` como default se nao ha preferencia salva.
- [ ] T9.1.4 Auditar todas as paginas em dark mode: contraste, borders, lime sobre dark bone.
- [ ] T9.1.5 Giscus e OG images respeitam tema.

**Pronto quando:** toggle funciona, dark mode legivel em todas paginas, sem regressao visual.

### Slice 9.2 — i18n (EN)

- [ ] T9.2.1 Instalar e configurar `next-intl` com routing `/en/...` e `/pt/...` (default PT).
- [ ] T9.2.2 Extrair todas strings de copy para arquivos de mensagens `messages/pt.json` e `messages/en.json`.
- [ ] T9.2.3 Traduzir conteudo estatico (home, sobre, trajetoria, contato, privacidade, como-usar).
- [ ] T9.2.4 Conteudo dinamico (projetos, noticias, skills) mantem PT por enquanto, com campo `locale` no schema para futuro.
- [ ] T9.2.5 Switcher de idioma no nav.

**Pronto quando:** `/en` renderiza site completo em ingles, `/pt` em portugues, default PT.

### Slice 9.3 — RSS feed

- [ ] T9.3.1 `app/feed.xml/route.ts` gera RSS 2.0 com noticias.
- [ ] T9.3.2 `<link rel="alternate" type="application/rss+xml">` no head.
- [ ] T9.3.3 Link para RSS no footer.

**Pronto quando:** feed valida no W3C Feed Validator, readers (Feedly, etc) conseguem se inscrever.

### Slice 9.4 — Search global

- [ ] T9.4.1 Postgres full-text search com `tsvector` em projetos, noticias, skills.
- [ ] T9.4.2 Componente `<SearchModal>` (Cmd+K) com resultados agrupados por tipo.
- [ ] T9.4.3 Highlight de termos nos resultados.
- [ ] T9.4.4 Debounce de 300ms no input.

**Pronto quando:** Cmd+K abre modal, busca retorna resultados relevantes em <200ms.

### Slice 9.5 — Pagina /agora

- [ ] T9.5.1 Pagina `/agora` (now page) com conteudo editavel via admin.
- [ ] T9.5.2 Secoes: no que estou trabalhando, o que estou lendo, proximos eventos, foco do trimestre.
- [ ] T9.5.3 Formato markdown editavel no admin.

**Pronto quando:** pagina renderiza, editavel via admin, link no nav.
