# STACK-V5.md — Migração para stack 100% Vercel

> Decisão v5: substituir Supabase por serviços nativos Vercel. Single-provider para infra, com única exceção justificada (Resend para email transacional). Este arquivo sobrescreve as referências a Supabase em todos os docs anteriores.

---

## 1. Nova stack final

| Camada | Antes (v4) | Agora (v5) | Por quê |
|---|---|---|---|
| Hosting + Edge | Vercel | **Vercel** | mantido |
| Framework | Next.js 14 App Router | **Next.js 14 App Router** | mantido |
| Database | Supabase Postgres | **Vercel Postgres** (powered by Neon) | mesmo Postgres, billing Vercel, conexão serverless nativa |
| Auth | Supabase Auth (magic link) | **Auth.js v5 + Vercel Postgres adapter + Resend magic link** | controle total, sem vendor lock-in fora Vercel |
| Storage (arquivos) | Supabase Storage | **Vercel Blob** | nativo, signed URLs, CDN edge |
| Cache / Rate limit / Sessions | Upstash Redis | **Vercel KV** (Upstash by Vercel) | mesma tech, billing Vercel |
| Feature flags / config | env vars | **Vercel Edge Config** | toggle sem redeploy |
| Cron jobs | nenhum | **Vercel Cron** | nativo |
| Analytics simples | Plausible | **Vercel Web Analytics** | nativo, privacy-first, sem cookies |
| Analytics avançado | Plausible API + Clarity | **Vercel Postgres `analytics_events` custom** + canvas heatmap próprio | tudo dentro Vercel |
| Speed Insights | Plausible web-vitals | **Vercel Speed Insights** | nativo |
| Email transacional | Resend | **Resend** | única exceção, sem alternativa Vercel direta |

**Resultado:** 1 provedor para tudo (Vercel) + 1 exceção (Resend) + 0 dashboards externos para monitorar.

---

## 2. Quanto custa em escala v1

| Serviço | Free tier | Quando paga |
|---|---|---|
| Vercel Hobby | 1 projeto + 100GB bandwidth/mês | só se virar Pro ($20/mês) |
| Vercel Postgres | 256MB storage, 60h compute/mês | a partir de tráfego médio |
| Vercel Blob | 500MB + 1GB transfer | tráfego alto de downloads |
| Vercel KV | 256MB + 30K commands/dia | tráfego alto |
| Vercel Analytics | 2.500 events/mês no Hobby | mais que isso = Pro |
| Resend | 100 emails/dia + 3K/mês | mais que isso |

Em v1 com até 100 subscribers/mês, 300 downloads/mês, 5K visitas/mês: **custo recorrente = R$ 0**.

A partir de ~10K visitas/mês ou 100+ downloads/dia, vira **~$20/mês** (Vercel Pro). Aceitável.

---

## 3. O que muda no código

### 3.1 Database — de Supabase para Vercel Postgres

**Antes (Supabase):**
```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(URL, KEY);
const { data } = await supabase.from("skills").select();
```

**Depois (Vercel Postgres):**
```ts
import { sql } from "@vercel/postgres";
const { rows } = await sql`SELECT * FROM skills WHERE published = true`;
```

Para queries mais elaboradas, usar **Drizzle ORM** (recomendado, vai TS-first com Vercel Postgres):
```ts
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { skills } from "@/db/schema";
const db = drizzle(sql);
const result = await db.select().from(skills).where(eq(skills.published, true));
```

### 3.2 RLS desaparece, vira RBAC server-side

Supabase usa Row Level Security no Postgres. Vercel Postgres não tem isso por padrão.

**Solução:** controle de acesso no Server Action ou Route Handler:

```ts
// src/server-actions/skills.ts
"use server";
import { auth } from "@/lib/auth";

export async function deleteSkill(id: string) {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Unauthorized");
  await db.delete(skills).where(eq(skills.id, id));
}
```

A função `auth()` valida a sessão. `isAdmin` vem do allow-list em `ADMIN_EMAILS`.

### 3.3 Auth — Auth.js v5 com magic link

```ts
// src/lib/auth.ts
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const adminEmails = process.env.ADMIN_EMAILS?.split(",") ?? [];
      session.user.isAdmin = adminEmails.includes(user.email);
      return session;
    },
  },
});
```

### 3.4 Storage — Vercel Blob

**Upload de skill .zip:**
```ts
import { put } from "@vercel/blob";
const blob = await put(`skills/${slug}.zip`, file, {
  access: "public", // ou "private" para signed URLs
});
// blob.url é a URL final
```

**Para arquivos privados (gate de email):**
```ts
import { put } from "@vercel/blob";
const blob = await put(`skills/${slug}.zip`, file, { access: "public" });
// guardar blob.url no DB, gerar signed URLs no servidor antes de servir
```

Vercel Blob serve por CDN edge automaticamente.

### 3.5 KV — Vercel KV

**Rate limit no contato:**
```ts
import { kv } from "@vercel/kv";
const key = `rate:contact:${ip}`;
const count = await kv.incr(key);
if (count === 1) await kv.expire(key, 3600);
if (count > 5) throw new Error("Too many requests");
```

**Cookie de skill download (anti-gate):**
```ts
import { kv } from "@vercel/kv";
await kv.set(`skill-cookie:${visitorId}`, true, { ex: 60 * 60 * 24 * 30 });
const hasGate = await kv.get(`skill-cookie:${visitorId}`);
```

### 3.6 Analytics custom — Vercel Postgres em vez de Supabase

Mesma estrutura de tabelas (`page_analytics`, `custom_events`, `click_events`) descrita em PREMIUM-UPGRADE.md, mas hospedada no Vercel Postgres com Drizzle.

Vercel Web Analytics oficial fica para tráfego geral (page views, top pages, top referrers). Custom tracking no Postgres fica para heatmap, scroll depth, custom events específicos.

### 3.7 Edge Config — feature flags

```ts
import { get } from "@vercel/edge-config";
const showEvents = await get("show_events_page");
```

Edge Config gerencia flags sem redeploy (ex: ligar/desligar página, controlar A/B test, mudar copy de hero).

### 3.8 Cron jobs

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/cleanup-rate-limits",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/aggregate-analytics-daily",
      "schedule": "30 3 * * *"
    }
  ]
}
```

Crons rodam em horários definidos. Útil para: agregar analytics diários, limpar rate limits velhos, recalcular contadores de download, enviar newsletter agendada.

---

## 4. Schema atualizado (Drizzle ORM)

### 4.1 Setup

```bash
pnpm add drizzle-orm @vercel/postgres
pnpm add -D drizzle-kit
```

### 4.2 Arquivo `src/db/schema.ts`

```ts
import { pgTable, text, uuid, timestamp, boolean, integer, json, pgEnum } from "drizzle-orm/pg-core";

// Enums
export const eventRoleEnum = pgEnum("event_role", [
  "palestrante", "painelista", "jurado", "mediador", "mentor", "host", "convidado"
]);

export const eventTypeEnum = pgEnum("event_type", [
  "summit", "painel", "meetup", "conferencia", "workshop", "webinar", "mesa-redonda", "mentoria", "demoday"
]);

// Tabela skills
export const skills = pgTable("skills", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  version: text("version").default("1.0.0"),
  blobUrl: text("blob_url").notNull(),       // URL do Vercel Blob
  downloads: integer("downloads").default(0),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela subscribers
export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  phone: text("phone"),
  consentNewsletter: boolean("consent_newsletter").default(true),
  consentWhatsapp: boolean("consent_whatsapp").default(false),
  source: text("source"),
  confirmed: boolean("confirmed").default(false),
  confirmationToken: text("confirmation_token"),
  unsubscribeToken: text("unsubscribe_token"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela downloads
export const downloads = pgTable("downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  skillId: uuid("skill_id").notNull().references(() => skills.id),
  email: text("email").notNull(),
  name: text("name"),
  phone: text("phone"),
  consentNewsletter: boolean("consent_newsletter").default(false),
  consentWhatsapp: boolean("consent_whatsapp").default(false),
  ipAnonymized: text("ip_anonymized"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela events (substitui projects)
export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  eventType: eventTypeEnum("event_type").notNull(),
  role: eventRoleEnum("role").notNull(),
  topic: text("topic").notNull(),
  descriptionShort: text("description_short").notNull(),
  descriptionMd: text("description_md"),
  contextMd: text("context_md"),
  presentationMd: text("presentation_md"),
  takeawaysMd: text("takeaways_md"),
  eventDate: timestamp("event_date").notNull(),
  eventEndDate: timestamp("event_end_date"),
  city: text("city"),
  state: text("state"),
  country: text("country").default("BR"),
  venue: text("venue"),
  organizer: text("organizer").notNull(),
  audienceSize: integer("audience_size"),
  externalUrl: text("external_url"),
  videoUrl: text("video_url"),
  deckUrl: text("deck_url"),
  imageUrl: text("image_url"),
  tags: json("tags").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela news
export const news = pgTable("news", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  contentMd: text("content_md").notNull(),
  publishedAt: timestamp("published_at"),
  status: text("status").default("draft"), // draft | scheduled | published
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela contacts (mensagens)
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"), // new | read | replied | archived
  ipAnonymized: text("ip_anonymized"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela career_chapters
export const careerChapters = pgTable("career_chapters", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  role: text("role"),
  company: text("company").notNull(),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  isCurrent: boolean("is_current").default(false),
  orderIndex: integer("order_index").default(0),
  contextMd: text("context_md"),
  mandateMd: text("mandate_md"),
  movementMd: text("movement_md"),
  resultMd: text("result_md"),
  learningMd: text("learning_md"),
  tags: json("tags").$type<string[]>().default([]),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tabela career_highlights
export const careerHighlights = pgTable("career_highlights", {
  id: uuid("id").primaryKey().defaultRandom(),
  metric: text("metric").notNull(),
  label: text("label").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").default(0),
  iconName: text("icon_name"),
  published: boolean("published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela frameworks
export const frameworks = pgTable("frameworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  purpose: text("purpose").notNull(),
  phases: json("phases").$type<string[]>().default([]),
  appliedIn: text("applied_in"),
  orderIndex: integer("order_index").default(0),
  published: boolean("published").default(true),
});

// Tabelas Auth.js (gerenciadas pelo DrizzleAdapter)
// users, accounts, sessions, verification_tokens

// Analytics tables
export const pageAnalytics = pgTable("page_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  visitorId: text("visitor_id"),
  path: text("path").notNull(),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  userAgent: text("user_agent"),
  deviceType: text("device_type"),
  browser: text("browser"),
  os: text("os"),
  country: text("country"),
  region: text("region"),
  city: text("city"),
  ipAnonymized: text("ip_anonymized"),
  timeOnPage: integer("time_on_page"),
  scrollDepth: integer("scroll_depth"),
  bounce: boolean("bounce").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customEvents = pgTable("custom_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  visitorId: text("visitor_id"),
  eventName: text("event_name").notNull(),
  eventProps: json("event_props").default({}),
  path: text("path"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clickEvents = pgTable("click_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  path: text("path").notNull(),
  elementSelector: text("element_selector"),
  xPct: text("x_pct"),
  yPct: text("y_pct"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 4.3 Migrations

Drizzle gera SQL automaticamente:

```bash
pnpm drizzle-kit generate     # gera migrations
pnpm drizzle-kit migrate      # aplica no DB
```

`drizzle.config.ts`:
```ts
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.POSTGRES_URL! },
} satisfies Config;
```

---

## 5. Variáveis de ambiente atualizadas

Substituir `.env.example` por:

```bash
# Vercel Postgres (autocomplete pela Vercel após criar o database)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Vercel KV
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Vercel Edge Config
EDGE_CONFIG=

# Auth.js
AUTH_SECRET=                           # gerar com: openssl rand -base64 32
AUTH_URL=https://aurimar.com.br
ADMIN_EMAILS=espindolanogueira@yahoo.com.br

# Resend (única dependência externa)
RESEND_API_KEY=
RESEND_FROM="Aurimar Nogueira <hello@aurimar.com.br>"
RESEND_REPLY_TO=espindolanogueira@yahoo.com.br

# Site config
NEXT_PUBLIC_SITE_URL=https://aurimar.com.br
NEXT_PUBLIC_SITE_NAME="Aurimar Nogueira"

# Z-API (opcional, se WhatsApp opt-in)
ZAPI_INSTANCE=
ZAPI_TOKEN=
```

---

## 6. Diffs por arquivo afetado

| Arquivo | Mudança principal |
|---|---|
| `PROJECT.md` | Stack updated: trocar referências a Supabase por Vercel Postgres/Blob/KV. Adicionar Auth.js. |
| `DATABASE.md` | SQL CREATE TABLE vira schema Drizzle TypeScript. RLS some, vira RBAC server-side. Migrations passam por Drizzle Kit. |
| `REQUIREMENTS.md` | R8 Skills hub: storage agora Vercel Blob. R12 Admin: auth via Auth.js + magic link Resend. |
| `CLAUDE.md` | Stack atualizada na primeira seção. Comandos de migration mudam para `pnpm drizzle-kit`. |
| `PROMPTS.md` | P1.4 (Supabase init) vira P1.4 (Vercel Postgres + Drizzle + Auth.js init). Outros prompts ajustam imports. |
| `ANALISE-COMPARATIVA.md` | Adicionar nota: "v5 migrou de Supabase para stack Vercel completa, simplificando ops para single-provider." |
| `PLAYBOOK.md` | Fase 4: criar Vercel Postgres + KV + Blob em vez de Supabase. Fase 5: bootstrap inclui Drizzle setup. |
| `REFINAMENTO-V3.md` | Schema 005 vira migration Drizzle. Microsoft Clarity removido (era externo), heatmap implementado custom em Vercel Postgres. |
| `PREMIUM-UPGRADE.md` | Tabelas analytics passam para Vercel Postgres via Drizzle. |
| `EVENTOS-CHANGE.md` | Migration 004 vira schema Drizzle de `events`. |

---

## 7. O que SOME do projeto

- Conta Supabase
- Pasta `supabase/migrations/` (vira `drizzle/`)
- `@supabase/supabase-js` no package.json
- RLS policies SQL (vira validação server-side)
- Plausible script (vira Vercel Web Analytics)
- Microsoft Clarity script (vira heatmap custom)

---

## 8. O que ADICIONA

```bash
pnpm add @vercel/postgres @vercel/kv @vercel/blob @vercel/edge-config
pnpm add @auth/drizzle-adapter next-auth@beta
pnpm add drizzle-orm
pnpm add -D drizzle-kit
pnpm add @vercel/analytics @vercel/speed-insights
```

---

## 9. Trade-offs

**Ganhos:**
- 1 dashboard só (Vercel) em vez de 4 (Vercel + Supabase + Plausible + Clarity)
- 1 conta para gerenciar
- Tudo no mesmo billing
- Edge-native (storage, KV, postgres todos na borda)
- Sem dor de DNS de outro fornecedor

**Perdas:**
- Supabase tem Realtime nativo, Vercel Postgres não tem (não usamos em v1)
- Supabase Studio UI vs Vercel Postgres Studio: Vercel é mais simples (Drizzle Studio supre)
- RLS no Postgres é mais "blindado" que validação no Server Action (mas atinge mesmo objetivo)
- Free tier do Supabase tem 500MB de DB, Vercel Postgres tem 256MB (mas é serverless, dorme)

**Conclusão:** trade-off favorável para single-provider em v1. Se virar gargalo, migrar parte para Neon direto (sai do Vercel Postgres mas mantém o mesmo Postgres) ou voltar para Supabase é trivial (mesmo SQL).
