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

## Pós-v1 (backlog priorizado)

| Prioridade | Item |
|---|---|
| Alta | Versão EN dos textos (i18n com `next-intl`) |
| Alta | RSS feed para notícias |
| Média | Comentários em notícias (Giscus via GitHub Discussions) |
| Média | Página `/agora` (now page) |
| Média | Integração LinkedIn auto-post de notícias |
| Baixa | Search global (Algolia ou Postgres full-text) |
| Baixa | Tema dark explícito (hoje é "ink section") |
