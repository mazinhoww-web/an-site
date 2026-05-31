# MentorMatch - Architectural Decisions

> Record of all architectural and product decisions with rationale.
> Add new decisions as they are made.

## Format

Each decision follows this format:
```
## [ID] - [Title] (Status: [proposed|accepted|deprecated])

**Date**: [YYYY-MM-DD]
**Context**: [Why this decision was needed]
**Decision**: [What was decided]
**Rationale**: [Why this choice]
**Consequences**: [Impact of this decision]
```

---

## [D001] - Tech Stack Selection (Status: proposed)

**Date**: 2026-05-23
**Context**: Need to choose stack that works entirely within Vercel ecosystem for beginner-friendly deployment
**Decision**: Next.js 15 + TypeScript + Tailwind + shadcn/ui + Prisma + Vercel Postgres
**Rationale**:
- Next.js: Full-stack framework, works seamlessly on Vercel
- TypeScript: Type safety for maintainable code
- Tailwind + shadcn/ui: Rapid UI development with consistent design system
- Prisma: Type-safe ORM with excellent Vercel Postgres integration
- Vercel Postgres: Managed database, zero config on Vercel platform
- NextAuth.js: Auth ready-to-use with magic link support
- Resend: Email delivery via Vercel marketplace
**Consequences**: Single platform deployment, but locked into Vercel ecosystem

## [D002] - Multi-Tenancy Strategy (Status: proposed)

**Date**: 2026-05-23
**Context**: Need to support multiple companies with isolation
**Decision**: Subdomain-based multi-tenancy with shared database
**Rationale**:
- Subdomain approach (`empresa.mentormatch.app`) is clean and user-friendly
- Shared database with `tenantId` column on relevant tables is simpler for MVP
- Row-level security via middleware ensures data isolation
**Alternatives considered**: Separate database per tenant (too complex), path-based (`/empresa/...`) (less professional)
**Consequences**: All tenant data in one DB - need strict RLS; easier backup/maintenance

## [D003] - Authentication Strategy (Status: accepted)

**Date**: 2026-05-23
**Context**: User requested simplest and most secure auth
**Decision**: NextAuth.js with email/password + magic link option
**Rationale**:
- NextAuth.js provides both credential and email/magic-link providers
- Passwordless magic link is simplest for end users
- Email/password available as fallback
- Free registration with company-specific invitation codes for association
**Consequences**: Need email service (Resend) configured for magic links

## [D004] - Domain Strategy (Status: accepted)

**Date**: 2026-05-23
**Context**: User does not have custom domain yet
**Decision**: Start with Vercel default URL; multi-tenancy via path-based routing (`/t/[tenant-slug]`) instead of subdomain
**Rationale**:
- Subdomains require DNS configuration on custom domain
- Path-based is simpler for Vercel free tier
- Can migrate to subdomain later when custom domain is acquired
- Each tenant gets: `projeto.vercel.app/t/nome-da-empresa`
**Consequences**: Less "branded" feel until custom domain; simpler deployment

## [D005] - Billing Architecture (Status: accepted)

**Date**: 2026-05-23
**Context**: User wants 100% free now but full SaaS billing ready
**Decision**: Build complete billing architecture from day one with a FREE plan as default
**Rationale**:
- Building billing later is harder than including it from start
- All tenants start on FREE plan (unlimited for now)
- Schema includes: Plan, Subscription, Usage, Invoice tables
- When ready to charge, just flip a switch
**Consequences**: More tables initially, but zero friction to monetize later

## [D006] - Match Flow (Status: accepted)

**Date**: 2026-05-23
**Context**: How mentor-mentee connection works
**Decision**: Mentee sends request → Mentor receives and accepts/rejects → Connection created
**Rationale**:
- Mentor has control over who they mentor
- Enables 4-mentee limit enforcement
- Waitlist only activates after mentor accepts someone
**Consequences**: Need notification system for real-time request alerts

## [D007] - Registration Flow (Status: accepted)

**Date**: 2026-05-23
**Context**: How users join the platform
**Decision**: Open registration - users create profile freely, no pre-approval needed
**Rationale**:
- Lower barrier to entry
- Profile includes photo, bio, formation, skills, interests
- Admin can later deactivate users if needed
- Invitation system still available for company admins to invite directly
**Consequences**: Need content moderation considerations; admin deactivation feature required

## [D021] - Open Items Pending Decision (Status: proposed)

**Date**: 2026-05-30
**Context**: Refinement Q&A surfaced six architectural/product points that are not yet locked. Recording them as a tracked decision so they are not lost between sessions.
**Decision**: The following items remain OPEN and require explicit resolution before their respective features are built:

1. **Billing model (refines D005)** - Infra is built (Plan/Subscription/Usage/Invoice) and all tenants are FREE. The charging model itself (per seat vs per license vs per match) is undecided.
2. **Demo access mode** - Pre-populated demo tenant exists via seed. Not decided whether the public demo is read-only public (lead capture) or requires quick signup (email + name). Recommendation on record: public read-only with CTA to register for interaction.
3. **Dual role per tenant (refines existing behavior)** - A user can currently be mentor AND mentee by default. Whether this is configurable/disableable per tenant is not implemented and not decided.
4. **Tenant self-provisioning** - No automated new-tenant provisioning flow from the landing page exists yet. Today tenants are created via seed. Decision needed on whether landing signup auto-creates an empty tenant, a pre-populated demo, or requires a support call.
5. **Intra-tenant profile visibility (LGPD)** - Cross-tenant isolation is guaranteed by RLS. Undecided whether profiles inside a tenant are visible to all tenant users or only to participants in the same mentoring program.
6. **Admin dashboard metrics** - Company Admin has report access (req 10) but the specific metrics are not fixed. Proposed minimum viable set: active users, requests sent, matches accepted, mentors at capacity.

**Rationale**: These were explicitly flagged as not-yet-locked during refinement. Tracking prevents silent assumptions in PRD/code generation.
**Consequences**: Features tied to these items (billing UI, demo gating, tenant settings, onboarding flow, profile privacy, analytics dashboard) should not be built until the relevant item is resolved.

## [D022] - Design System Proprio (substitui DESIGN.md do Solu) (Status: accepted)

**Data**: 2026-05-30
**Contexto**: O guia de prompts fase 0 adotava o DESIGN.md do Solu (plataforma de recrutamento) verbatim: amarelo #FFFF00 fixo, Poppins, sombra offset zero blur, raio 34px universal. Isso gerava um clone do Solu, nao um produto premium, e a cor de marca fixa quebra o white-label multi-tenant.
**Decisao**: Sistema de design proprio do MentorMatch. Arquivos em references/design/:
- DESIGN.md — fonte de verdade do design system
- prompts-fases.md — guia de prompts refinado (fases 0-10) usando o sistema proprio

Decisoes centrais:
1. Cor de marca = token CSS --brand substituivel por tenant (casa com a arquitetura multi-tenant via CSS custom properties). Default = Indigo #4F46E5. Neutros e semanticos sao fixos.
2. Fonte = Plus Jakarta Sans (nao Poppins).
3. Sombra com blur sutil (nao offset duro do Solu).
4. Raio escalonado 8/12/16/24/pill (nao 34px universal).
5. Escala tipografica calma (Display 60px, nao 88px).
6. Dark mode nativo via [data-theme].
7. Validacao de contraste do brand por tenant no upload (>= 4.5:1).

**Componentes de referencia ja prototipados (JSX)**: MentorMatchGrid (Fase 4, vitrine de match), MentorMatchLandingV2 (landing com app preview navegavel no hero, white-label ao vivo, motion em camadas).
**Rationale**: Premium vem de decisoes proprias calibradas, nao de replicar o design system de outro produto. Token de marca e pre-requisito do white-label.
**Consequences**: Fase 0 deve configurar o sistema proprio antes de qualquer tela. Na implementacao no an-site, usar componentes reais do TripleD (ui.tripled.work) trocando os blocos prototipados. Itens em aberto: cor de marca default definitiva do produto institucional, e se adiciona aba Admin ao app preview da landing.
