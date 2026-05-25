# AN. Site — Log de Decisões

Decisões cronológicas. Sempre adicionar no topo (mais recente primeiro). Não editar entradas antigas.

---

## 2026-05-24 (sessão v5) — Stack 100% Vercel + START-HERE.md

**Mudança de stack:** sai Supabase, entra Vercel completo. Single-provider.

| Camada | Antes | Agora |
|---|---|---|
| Database | Supabase Postgres | Vercel Postgres (Neon) |
| ORM | Supabase client | Drizzle ORM |
| Auth | Supabase Auth magic link | Auth.js v5 + magic link via Resend |
| Storage | Supabase Storage | Vercel Blob |
| Cache/KV | Upstash standalone | Vercel KV |
| Feature flags | env vars | Vercel Edge Config |
| Cron | n/a | Vercel Cron |
| Analytics simples | Plausible | Vercel Web Analytics |
| Heatmap | Microsoft Clarity | Custom (Vercel Postgres + canvas) |
| Speed | Plausible web-vitals | Vercel Speed Insights |
| Email | Resend | Resend (única exceção justificada) |

**Por quê:**
- 1 dashboard só, 1 conta, 1 billing
- Sem dor de DNS de fornecedor externo
- Edge-native para storage, KV, DB
- Trade-off de RLS aceitável (vira validação server-side com Auth.js)
- Custo Hobby/free zera em v1, ~$20/mês a partir de 10K visitas

**Arquivo source-of-truth:** STACK-V5.md com diffs específicos por arquivo afetado e schema Drizzle completo.

**Mudanças no código:**
- `@supabase/supabase-js` sai do package.json
- `@vercel/postgres`, `@vercel/kv`, `@vercel/blob`, `@vercel/edge-config`, `drizzle-orm`, `next-auth@beta` entram
- Migrations vão para `drizzle/` (não `supabase/migrations/`)
- RLS sai do SQL, vira validação no Server Action via `auth()`

**START-HERE.md criado:**
Guia executivo final, 7 passos numerados, comandos copy/paste prontos. Cobre desde criar contas até primeiro deploy. Tempo total estimado 3 horas focadas. Substitui o PLAYBOOK.md como ponto de entrada (PLAYBOOK fica como referência detalhada de fases).

**O que Aurimar precisa fazer agora:** abrir START-HERE.md e seguir Passo 1.

---

## 2026-05-24 (sessão v4) — Premium upgrade

Três blocos de aprimoramentos consolidados em REFINAMENTO-V3.md e refletidos em STITCH-AJUSTES.md v2.

**Captação ampliada:**
- DownloadGate passa de 1 campo (email) para 3 campos (nome, email, WhatsApp BR) + 2 consents LGPD separados (newsletter, WhatsApp)
- Newsletter inline também captura os 3 campos
- Validação Zod server-side com regex BR + mask client-side
- Migration 005 expande subscribers e downloads (campos novos + UTMs)

**Analytics premium:**
- Plausible mantido para tráfego e eventos
- **Microsoft Clarity adicionado** (grátis, LGPD-friendly) para heatmap e session recording
- Vercel Analytics + Speed Insights mantidos
- Tabela `analytics_events` nova como espelho local do Plausible para queries customizadas no dashboard
- 14 custom events configurados (Page View, Newsletter Submit, Skill Gate Opened, Skill Downloaded, External Link Click, Scroll Depth, Time On Page, Skill Card View, Event Card View, etc)
- Server Action `trackEvent` com IP anonimizado (últimos 2 octets zerados)
- Dados geo via headers Vercel (country, region, city)

**Dashboard admin expandido (10 seções):**
- 6 KPIs no topo (era 4): Visitas, Únicos, Subscribers, Downloads, Mensagens, Tempo Médio
- Gráfico de tráfego 30 dias com toggle por métrica
- Mapa do Brasil com heatmap por estado
- Top localizações (cidade/estado/país)
- Top páginas e top fontes de tráfego
- 3 funis (Newsletter, Download, Contato)
- Heatmap embed Microsoft Clarity por página
- Log de eventos custom em tempo real
- Dispositivos e resoluções
- Próximas notícias e próximos eventos

**Premium feel (componentes novos):**
- CursorFollower: lime square 10px com glow seguindo cursor (desktop only, respeita reduced-motion)
- CountUp: números crescem de 0 ao final no scroll (highlights, KPIs)
- HoverBrackets: 4 cantos lime aparecem no hover de cards
- ScrollProgress: linha lime 4px lateral indicando progresso de scroll
- HeroParallax: background grid se move mais devagar que conteúdo
- Hairline grid em todas as seções principais (não só hero)
- Eyebrows com lime dot prefix
- Active states com lime mais visível (filter pills bg lime, sidebar 4px lime square)

**Home reformulada:**
- Bloco "Quem sou eu" novo (sem revelar projetos específicos LATAM)
- Bloco "O que faço hoje" com 3 frentes genéricas (produtos financeiros embarcados, parcerias estratégicas, inovação como receita)
- Skills apresentadas como **conteúdo**, sem dizer "criei" e sem CTA "baixar" na home
- "Saiba mais" em vez de "Baixar" nos cards de skill da home

**Confidencialidade LATAM:**
- Home agora redatada
- Trajetória mantém os nomes específicos (decisão tentativa A): assumir que info é parcialmente pública via LinkedIn e painéis
- Aurimar tem 3 opções (A manter, B redatar Trajetória também, C toggle público/privado)
- Decisão final pendente

**R18, R19, R20 adicionados aos REQUIREMENTS** (Captação ampliada, Analytics premium, Premium feel).

**Imagens necessárias listadas** (Aurimar fornece via admin pós-deploy):
- Fotos editoriais para Home, Sobre, Trajetória
- Fotos dos 3+ eventos
- Capas visuais para 8 skills

---

## 2026-05-24 (sessão v3) — Pivot de /projetos para /eventos

A página /projetos foi removida do escopo v1. Substituída por /eventos.

**Por quê:** Trajetória já cobre a camada interna da carreira (empresas, papéis, resultados dentro de cada uma). /eventos cobre a camada externa: aparições públicas como palestrante, painelista, jurado, mediador ou mentor. É prova social de autoridade, melhor para SEO (Schema.org Event ranqueia bem para queries como "aurimar nogueira palestrante"), e mais útil para prospecção (organizadores buscam speakers).

**Como fica o conteúdo de projetos antigo:**
- Iniciativas dentro de empresas (LATAM Wallet, CPR Registry, Cartão PF) → continuam aparecendo na Trajetória, dentro do capítulo da empresa
- Empreendimentos pessoais (Cia do Visto, Pátio Estúdios, Visto com Lê) → bloco "Também em" na página de Contato

**Mudanças técnicas:**
- Tabela `projects` removida, substituída por `events` (migration 004_events.sql)
- Schema events tem enums event_type (summit, painel, meetup, etc) e event_role (palestrante, painelista, jurado, etc)
- JSON-LD muda de CreativeWork para Event
- Layout da lista é vertical (não grid), data é o elemento tipográfico mais forte
- Lime aparece apenas em PALESTRANTE e JURADO como roles destacados
- 3 eventos reais já no seed: Summit Sicredi (mai 2026), Embedded Credit Cubo Itaú (abr 2026), Inclusão Produtiva Segundo Voo (mai 2026)

Documento de change formal: EVENTOS-CHANGE.md. Inclui diffs por arquivo, novo prompt Stitch S3 Eventos, schema SQL e seed.

---

## 2026-05-24 (sessão v2.1) — Trajetória completa com dados reais

PDF do LinkedIn anexado. TRAJETORIA.md atualizado com 6 capítulos completos baseados em histórico validado:

1. LATAM Pass (ago/2024-presente) - já estava
2. CRDC Central de Registros (out/2023-ago/2024, 11 meses) - Product Owner Recebíveis Agro
3. 1WIN Performance LATAM (ago/2022-ago/2024, paralelo) - Senior Affiliate Manager
4. CERC (mai/2021-set/2023, 2a5m) - Officer Produtos + PM Recebíveis (CCB, CPR, CPR Verde, CDCA, Registro Digital)
5. Stone (abr/2019-mai/2021, 2a2m) - KAM + Especialista em Produtos (plataforma ABC, redes/franquias)
6. Início internacional e formação (2014-2020) - 99Taxis Cuiabá + Syngenta Cuiabá + HarkHark Brisbane (USD 2M+, 264+ restaurantes) + UniC Adm + MBA + Tera + FGV + IH Brisbane

Decisão importante: incluir o 1WIN como capítulo paralelo (não esconder), pois mostra dimensão adicional (performance marketing internacional grayzone) e adiciona keywords úteis para SEO.

Highlights de impacto refinados: incluído "30% conversão de leads" do resumo LinkedIn da LATAM. Removido "150-200 usuários MVP" (menos icônico).

Seed da migration 003_career.sql atualizado no SPEC-ADDENDUM com texto narrativo completo de cada capítulo. Datas em formato ISO. Tags ajustadas por capítulo.

---

## 2026-05-24 (sessão v2) — Aplicação das skills design-intelligence + tripled-ui

DESIGN.md reformado com referência-âncora **Linear + Vercel + Stripe** (do Awesome Design MD), motion design expandido (curva ease-out-quint, durações por categoria, scroll reveal, hairline grow, lime underline), seção de background sutil (grid hairline animado, não aurora literal porque brand proíbe gradiente).

Criado ICONS-MOTION.md como fonte única de verdade de todos os ícones do site. Componente base `<AnimatedIcon>` com 8 animações catalogadas (pulse, bounce, rotate, shake, fly, scale, draw, none). Catálogo cobre nav, hero, mark, skills, downloadgate, newsletter, contato, projetos, notícias, trajetória, admin, estados gerais (~60 ícones mapeados). `prefers-reduced-motion` obrigatório em todos.

---

## 2026-05-24 (sessão v2) — Página Trajetória adicionada

Criado TRAJETORIA.md. Página `/trajetoria` não é currículo cronológico chapado: é narrativa com 5 seções por capítulo (Contexto / Mandato / Movimento / Resultado / Aprendizado). Highlights de impacto em grid 3x2 (R$ 70B+, 60%, 3, R$ 88M, 150-200, 1ª). Frameworks autorais em 3 cards (Método Jet Ski, GSD2, Innovation2Business).

Conteúdo vem de 3 tabelas novas no Supabase: `career_chapters`, `career_highlights`, `frameworks`. Migration 003_career.sql + seed completo no SPEC-ADDENDUM.md.

Slices novas: M2.6 (página pública), M4.5 (admin CRUD).

---

## 2026-05-24 (sessão v2) — Camada de SEO analítico

Criado SEO.md. KPIs claros (top 3 para "Aurimar Nogueira" em 90d, LCP <2.5s p75, 100 subscribers em 90d).

Decisões técnicas:
- Sitemap dinâmico via Next.js MetadataRoute
- robots.ts com disallow de /admin e /api
- OG images dinâmicas via @vercel/og em /api/og
- JSON-LD em todas as páginas: Person global, ProfilePage em /trajetoria, CreativeWork em /projetos, SoftwareApplication em /skills, NewsArticle em /noticias, BreadcrumbList em detalhes

Stack de analytics privacy-first (não Google Analytics em v1):
- Plausible (sem cookies, LGPD-friendly, sem banner)
- Vercel Analytics + Speed Insights
- Web Vitals reportados ao Plausible via useReportWebVitals
- Custom events: Newsletter Submit, Skill Download Gate Opened, Skill Downloaded, Contact Form Submitted, External Link Click

Slice nova: M5.1.B (SEO técnico completo dentro da milestone Polish & Launch).

---

## 2026-05-24 — Documentação inicial completa

Geradas todas as specs em uma sessão: PRD, REQUIREMENTS, ROADMAP, DESIGN, DATABASE, prompts Claude Code e Stitch, README, análise comparativa, context skill.

Pronto para iniciar M1.

---

## 2026-05-24 — Context skill criada

Decidido manter rastreabilidade do projeto via skill `an-site-context` no Claude Cowork, com `STATE.md` e `DECISIONS.md` atualizados ao fim de cada sessão.

Padrão inspirado na skill `mentormatch-context` que Aurimar já usa.

---

## 2026-05-24 — Email gate em skills

Skills protegidas por cookie de 30 dias após primeiro download. Captura de email com double opt-in (Resend). Signed URL do Supabase Storage com validade de 10 minutos.

Balance entre captura de leads para newsletter e fricção mínima no acesso.

---

## 2026-05-24 — Admin via magic link

Auth do admin por Supabase magic link, sem senha. Allow-list em `ADMIN_EMAILS` no `.env.local`. Helper `is_admin()` em SQL para RLS.

Reduz superfície de ataque (sem senha vazável) e custo de manutenção.

---

## 2026-05-24 — Stack travada: Next.js 14 + Supabase + Vercel + Resend + Claude Code

Comparativo completo em `ANALISE-COMPARATIVA.md`. Score 9/9 nos critérios. Manus, Lovable, WordPress, Webflow, Framer descartados com justificativa.

v0 fica como auxiliar opcional. Stitch fica como ferramenta de mockup antes de codar.

---

## 2026-05-24 — Identidade visual travada (AN. v1.0)

Brand book completo. Cores: bone #F5F4EF, paper #FFFFFF, ink #0A0A0A, graphite #4A4A4A, smoke #8A8A8A, hairline #E5E3DC, lime #CCFF00, lime-deep #9FCC00.

Fontes: Space Grotesk (display), Inter (body), JetBrains Mono (mono).

Restrições: sem em-dash, sem emoji, sem gradiente, sem sombra, sem outras cores.

Tagline oficial: "Onde estratégia vira sistema."
Descritor: "LOYALTY × FINTECH × INNOVATION" (com sinal × de multiplicação).
