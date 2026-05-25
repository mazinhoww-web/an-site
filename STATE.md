# AN. Site — Estado Atual

**Última atualização:** 2026-05-24 23:55
**Atualizado por:** Sessão v5 (stack 100% Vercel + guia executivo final)

---

## Sprint atual

- **Milestone:** M0 Spec (concluído v5)
- **Próximo:** seguir START-HERE.md passo a passo, começando por baixar os 24 arquivos
- **Status:** documentação consolidada. Stack mudou para 100% Vercel (sem Supabase). START-HERE.md é o guia executivo final.

---

## ENTRADA: leia START-HERE.md primeiro

`START-HERE.md` é o guia operacional definitivo. Tudo que precisa fazer está lá em 7 passos numerados:

1. Pré-requisitos (contas + ferramentas)
2. Baixar 24 arquivos para `~/Projects/an-site/`
3. git init + GitHub
4. Stitch (correção + download mockups)
5. Provisionar Vercel (Postgres + KV + Blob + Edge Config) + Resend
6. Claude Code (bootstrap)
7. Deploy de produção

---

## Stack final v5 (100% Vercel + Resend)

| Camada | Serviço |
|---|---|
| Hosting + Edge | Vercel |
| Framework | Next.js 14 App Router |
| Database | Vercel Postgres (Neon) |
| ORM | Drizzle |
| Auth | Auth.js v5 + magic link via Resend |
| Storage | Vercel Blob |
| Cache/KV | Vercel KV (Upstash) |
| Feature flags | Vercel Edge Config |
| Cron | Vercel Cron |
| Analytics simples | Vercel Web Analytics |
| Analytics avançado | Vercel Postgres custom (analytics_events, page_analytics, click_events) |
| Speed Insights | Vercel Speed Insights |
| Email | Resend (única exceção) |

**Removidos:** Supabase, Plausible, Microsoft Clarity, Upstash standalone.

---

## Fonte de verdade por tópico

| Tópico | Arquivo principal |
|---|---|
| **Como começar HOJE** | **START-HERE.md** |
| Stack atual | STACK-V5.md |
| Visão e PRD | PROJECT.md |
| Must-haves | REQUIREMENTS.md + SPEC-ADDENDUM.md |
| Slices e tasks | ROADMAP.md + SPEC-ADDENDUM.md |
| Design system | DESIGN.md + ICONS-MOTION.md + PREMIUM-UPGRADE.md |
| Schema banco | STACK-V5.md seção 4 (Drizzle) sobrescreve DATABASE.md |
| SEO | SEO.md |
| Trajetória | TRAJETORIA.md |
| Eventos (substitui Projetos) | EVENTOS-CHANGE.md |
| Captação + Analytics + Premium | REFINAMENTO-V3.md + PREMIUM-UPGRADE.md |
| Stitch | STITCH-PROMPTS.md (original) + STITCH-AJUSTES.md (correção v2) |
| Sequência de execução | PLAYBOOK.md + START-HERE.md |
| Decisões | DECISIONS.md |
| Contexto entre sessões | skills/context-skill/SKILL.md |

---

## Próxima ação imediata

Abrir START-HERE.md e executar do Passo 1.

---

## Pendências Aurimar

- [ ] Confirmar domínio aurimar.com.br (ou outro) registrado e acessível para mudar DNS
- [ ] Aprovar copy da home (PREMIUM-UPGRADE seção 6.2)
- [ ] Aprovar pedido de WhatsApp no DownloadGate (3 campos: nome+email+wpp)
- [ ] Foto editorial para /sobre (ou aceita placeholder)
- [ ] Decidir confidencialidade Trajetória (manter nomes, redatar, ou toggle)
- [ ] Eventos adicionais para enriquecer seed (mentorias, bancas, podcasts)

---

## Bloqueios

- Domínio
- Contas (GitHub mazinhoww-web ok, Vercel/Resend novas)

---

## Concluído

- v1: docs base
- v2: design + motion + SEO
- v2.1: Trajetória com dados reais
- v2.2: PLAYBOOK + STITCH-AJUSTES inicial
- v3: pivot Eventos
- v3.1: captação ampliada + analytics + premium
- v4: consolidação premium (motion 6 camadas, imagens 8 tipos, copy home)
- **v5 (esta sessão):** stack 100% Vercel (sem Supabase) + START-HERE.md guia executivo final
