# AN. — Site Pessoal Aurimar Nogueira

Site pessoal de Aurimar Nogueira. Vitrine profissional, hub de skills do Claude, captura de newsletter, contato e painel admin.

**Tagline:** Onde estratégia vira sistema.
**Domínio (a confirmar):** aurimar.com.br

---

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript estrito
- **Estilo:** Tailwind CSS + shadcn/ui (sem cores default, só design tokens AN.)
- **Backend:** Supabase (Postgres + Auth + Storage + RLS)
- **Email:** Resend (newsletter, double opt-in, contato)
- **Hosting:** Vercel
- **Forms:** React Hook Form + Zod
- **Rate limit:** Upstash Redis (opcional)

---

## Documentação do projeto

Antes de escrever qualquer linha de código, leia os documentos abaixo nesta ordem.

| Documento | Quem usa | Quando |
|---|---|---|
| `PROJECT.md` | Dev / IA | PRD: o que construir, objetivos, escopo, decisões travadas |
| `REQUIREMENTS.md` | Dev / IA | Must-haves verificáveis por categoria |
| `ROADMAP.md` | Aurimar + IA | Milestones, slices e tasks GSD2 |
| `DESIGN.md` | Dev / IA | Design system: tokens, componentes, layouts |
| `DATABASE.md` | Dev / IA | Schema Supabase, RLS, RPCs, seed |
| `.env.example` | Aurimar | Variáveis de ambiente |
| `CLAUDE.md` | Nova sessão IA | Contexto e regras para Claude Code |
| `PROMPTS.md` | Aurimar | Prompts copy/paste por slice |
| `STITCH-PROMPTS.md` | Aurimar | Prompts para Google Stitch (mockups) |
| `ANALISE-COMPARATIVA.md` | Aurimar | Justificativa da stack escolhida |
| `skills/context-skill/SKILL.md` | Sistema | Tracking automático do projeto |

---

## Getting started

### 1. Pré-requisitos

- Node.js 20+
- pnpm 9+ (ou npm)
- Conta Supabase (free tier)
- Conta Resend (free tier)
- Conta Vercel
- Domínio configurado no Cloudflare (DNS)

### 2. Setup local

```bash
git clone https://github.com/mazinhoww-web/an-site.git
cd an-site
pnpm install
cp .env.example .env.local
# preencher .env.local com chaves reais
```

### 3. Banco de dados

Rodar as migrations Supabase na ordem listada em `supabase/migrations/`. Schema completo em `DATABASE.md`.

```bash
pnpm supabase db push
pnpm supabase db seed
```

### 4. Rodar local

```bash
pnpm dev
# http://localhost:3000
```

### 5. Deploy

Push para `main` faz deploy automático na Vercel. Branch preview disponível para PRs.

---

## Scripts

```bash
pnpm dev              # dev server
pnpm build            # production build
pnpm start            # production server local
pnpm lint             # eslint
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest
pnpm supabase:types   # gera types do schema
```

---

## Estrutura

```
src/
  app/
    (public)/         # site público
    admin/            # painel admin (auth required)
    api/              # route handlers
  components/
    brand/            # Mark, Hairline, Label, PhotoFrame
    layout/           # Nav, Footer, SectionHead
    ui/               # shadcn customizado com tokens AN.
  lib/
    supabase/         # client, server, admin
    resend/           # email templates
    validators/       # zod schemas
  server-actions/     # mutations (contato, newsletter, admin)
  types/              # generated + manual
supabase/
  migrations/
  seed.sql
```

---

## Convenções

- **Commits:** `feat(M2.3): adicionar página /projetos/[slug]`
- **Branches:** `feat/m2-projetos`, `fix/contact-rate-limit`
- **PRs:** fechar slice inteira, com checklist do REQUIREMENTS.md
- **Idioma do código:** inglês (variáveis, funções, comentários técnicos)
- **Idioma do conteúdo:** português (copy, labels visíveis)
- **Sem em-dash em nenhum lugar (—).** Use vírgula, ponto ou parênteses.

---

## Workflow GSD2

Todo trabalho segue Milestone > Slice > Task.

1. Abrir `ROADMAP.md`, identificar slice atual
2. Abrir `PROMPTS.md`, achar prompt da slice
3. Colar no Claude Code com `CLAUDE.md` carregado
4. Validar contra `REQUIREMENTS.md` (must-haves daquela slice)
5. Commit e push
6. Atualizar `skills/context-skill/STATE.md`

---

## Anti-padrões

- Não usar cores fora dos tokens definidos em `DESIGN.md`
- Não usar fontes fora de Space Grotesk, Inter e JetBrains Mono
- Não usar gradientes, sombras, emoji ou em-dash
- Não fazer commit direto em `main`
- Não escrever código antes de ler `REQUIREMENTS.md` da slice
- Não criar tabela nova sem atualizar `DATABASE.md` primeiro

---

## Owner

Aurimar Nogueira
- LinkedIn: linkedin.com/in/mazinho
- GitHub: github.com/mazinhoww-web

---

## Licença

Privado. Todos os direitos reservados.
