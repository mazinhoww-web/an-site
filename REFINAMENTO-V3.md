# REFINAMENTO-V3.md — Captação ampliada, analytics premium e premium feel

> Specs técnicos que acompanham STITCH-AJUSTES.md v2. Define schema novo de subscribers/downloads, stack de analytics expandido (Plausible + Microsoft Clarity + opcionalmente PostHog), componentes premium (cursor follower, count up, brackets, parallax), validação de WhatsApp e LGPD ampliada.

---

## 1. Captação ampliada de leads

### 1.1 Campos novos no DownloadGate

O modal de download passa de 1 campo (email) para 3 campos + 2 consents:

| Campo | Tipo | Validação | Obrigatório |
|---|---|---|---|
| Nome completo | text | min 2 palavras, max 80 chars | sim |
| Email | email | RFC 5322 + check de domínio existente (DNS MX) | sim |
| WhatsApp | tel | formato BR com DDD, +55 prefixo opcional | sim |
| Newsletter consent | checkbox | LGPD explícito | default checked |
| WhatsApp consent | checkbox | LGPD explícito | default checked |

Mesma estrutura no form de **Newsletter inline** da home e do footer.

### 1.2 Schema Supabase atualizado

Migration **005_capture_expanded.sql**:

```sql
-- Expandir tabela subscribers
alter table public.subscribers
  add column name text,
  add column phone_whatsapp text,
  add column consent_newsletter boolean default true,
  add column consent_whatsapp boolean default true,
  add column source text,                       -- 'newsletter-inline', 'newsletter-footer', 'skill-gate'
  add column utm_source text,
  add column utm_medium text,
  add column utm_campaign text;

create index idx_subscribers_phone on public.subscribers (phone_whatsapp);
create index idx_subscribers_source on public.subscribers (source);

-- Expandir tabela downloads
alter table public.downloads
  add column name text,
  add column phone_whatsapp text,
  add column consent_newsletter boolean default false,
  add column consent_whatsapp boolean default false,
  add column download_source text,              -- 'direct', 'home', 'skill-detail', 'related'
  add column utm_source text,
  add column utm_medium text,
  add column utm_campaign text;

create index idx_downloads_phone on public.downloads (phone_whatsapp);

-- Tabela analytics_events (espelho local do Plausible para dashboards próprios)
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  page_title text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  user_agent text,
  ip_anonymized text,                           -- últimos 2 octets zerados, LGPD
  country text,
  region text,
  city text,
  device_type text,                             -- desktop, mobile, tablet
  browser text,
  os text,
  screen_resolution text,
  session_id text,                              -- gerado client-side, anonimo
  session_duration_seconds int,
  is_new_visitor boolean,
  custom_props jsonb,                           -- props extras do evento
  created_at timestamptz default now()
);

create index idx_events_name on public.analytics_events (event_name);
create index idx_events_path on public.analytics_events (page_path);
create index idx_events_session on public.analytics_events (session_id);
create index idx_events_created on public.analytics_events (created_at desc);
create index idx_events_country on public.analytics_events (country);

-- RLS
alter table public.analytics_events enable row level security;

create policy "Service role insert events" on public.analytics_events
  for insert with check (true);                 -- Server Action insere

create policy "Admin read events" on public.analytics_events
  for select using (is_admin());
```

### 1.3 Validação WhatsApp (Zod + mask)

Server-side (`src/lib/validators/contact.ts`):

```typescript
import { z } from "zod";

const phoneBR = z.string()
  .regex(/^(\+55\s?)?\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/, "WhatsApp inválido. Use formato BR")
  .transform(v => v.replace(/\D/g, "").replace(/^55/, ""))  // normaliza
  .refine(v => v.length === 11, "WhatsApp deve ter DDD + 9 dígitos");

const nameFull = z.string()
  .min(3, "Nome muito curto")
  .max(80)
  .refine(v => v.trim().split(/\s+/).length >= 2, "Informe nome completo");

export const downloadGateSchema = z.object({
  name: nameFull,
  email: z.string().email("Email inválido"),
  phone_whatsapp: phoneBR,
  consent_newsletter: z.boolean().default(true),
  consent_whatsapp: z.boolean().default(true),
  skill_slug: z.string(),
  source: z.string().optional(),
});
```

Client-side mask (`react-input-mask` ou `imask`):

```tsx
<InputMask
  mask="(99) 99999-9999"
  placeholder="(65) 99999-9999"
  {...register("phone_whatsapp")}
/>
```

### 1.4 LGPD ampliada

Política de privacidade precisa explicitar:

- Que dados coletamos: nome, email, WhatsApp (opcional newsletter, opcional contato)
- Para que usamos: enviar skills, notificar lançamentos, responder dúvidas
- Onde guardamos: Supabase no Brasil
- Com quem compartilhamos: Resend (envio email), nenhum outro
- Por quanto tempo: 5 anos ou até pedido de exclusão
- Como exclui: link em todo email + endpoint público `/api/privacy/delete?token=...`
- Direitos do titular: acesso, correção, exclusão, portabilidade

Form precisa de checkboxes separados por canal (newsletter por email vs WhatsApp), não um único "concordo com tudo".

---

## 2. Stack de analytics expandido

### 2.1 Comparação de ferramentas

| Ferramenta | O que faz | Custo | LGPD | Heatmap | Eventos | Decisão |
|---|---|---|---|---|---|---|
| Plausible | Tráfego, eventos, sources, top pages | $9/mo após trial | ✅ Excelente | ❌ | ✅ | **Mantém** |
| Microsoft Clarity | Heatmap, session recording | **Grátis** | ✅ Bom (anonimizar) | ✅ | Limitado | **Adicionar** |
| PostHog | Funis, retenção, A/B, feature flags | Free 1M events/mo | ✅ Bom | ✅ | ✅ Top | **Opcional** |
| Vercel Analytics | Web Vitals, RUM | Grátis Hobby | ✅ Anônimo | ❌ | Limitado | **Mantém** |
| Vercel Speed Insights | Core Web Vitals detalhado | Grátis | ✅ | ❌ | ❌ | **Mantém** |

**Stack final v1:**
- Plausible (tráfego + eventos custom)
- Microsoft Clarity (heatmap + session recording)
- Vercel Analytics + Speed Insights (Web Vitals)

PostHog fica para v2 se Aurimar quiser funis avançados e A/B test.

### 2.2 Setup Microsoft Clarity

1. Criar conta em clarity.microsoft.com (grátis, sem limite)
2. Adicionar site `aurimar.com.br`
3. Em Settings > Masking: configurar "Mask all text" para LGPD compliance
4. Em Settings > IP Masking: ativar
5. Pegar Project ID
6. Adicionar env var: `NEXT_PUBLIC_CLARITY_ID=...`

Componente (`src/components/analytics/Clarity.tsx`):

```tsx
import Script from "next/script";

export function Clarity() {
  if (!process.env.NEXT_PUBLIC_CLARITY_ID) return null;
  return (
    <Script id="clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
      `}
    </Script>
  );
}
```

Heatmap fica acessível no dashboard do Clarity. No admin do AN. site, fazemos embed via iframe ou link externo no bloco "Mapa de Calor".

### 2.3 Custom events expandidos

Eventos Plausible (e espelho local em `analytics_events`):

| Evento | Quando | Props |
|---|---|---|
| `Page View` | toda navegação | path, title |
| `Newsletter Submit` | submit do form newsletter | source (home/footer/skill) |
| `Newsletter Confirmed` | confirmação double opt-in | source |
| `Skill Gate Opened` | abre DownloadGate | skill_slug |
| `Skill Gate Submitted` | submit do gate | skill_slug, source |
| `Skill Downloaded` | download efetivado | skill_slug, source |
| `Contact Form Submitted` | submit form contato | subject |
| `External Link Click` | clique em link externo | target, page |
| `Event Click` | clique em card de evento | event_slug |
| `CTA Click` | clique em CTA primário | cta_label, page |
| `Scroll Depth` | scroll passou 25/50/75/100% | depth, page |
| `Time On Page` | a cada 30s na página | seconds, page |
| `Skill Card View` | card de skill entrou no viewport | skill_slug |
| `Event Card View` | card de evento entrou no viewport | event_slug |

### 2.4 Coleta de dados geo, device, session

Server Action que recebe evento e salva em `analytics_events`:

```tsx
"use server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function trackEvent(eventName: string, props: Record<string, any> = {}) {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") ?? "0.0.0.0";
  const country = headersList.get("x-vercel-ip-country") ?? null;
  const region = headersList.get("x-vercel-ip-country-region") ?? null;
  const city = headersList.get("x-vercel-ip-city") ?? null;
  const ua = headersList.get("user-agent") ?? "";

  // IP anonimizado (zera últimos 2 octets)
  const ipAnon = ip.split(".").slice(0, 2).concat(["0", "0"]).join(".");

  const supabase = createClient();
  await supabase.from("analytics_events").insert({
    event_name: eventName,
    ip_anonymized: ipAnon,
    country,
    region,
    city,
    user_agent: ua,
    custom_props: props,
  });
}
```

Client-side helper:

```tsx
"use client";
export function plausible(event: string, props?: Record<string, any>) {
  if (typeof window.plausible === "function") {
    window.plausible(event, { props });
  }
  // Espelho local
  fetch("/api/track", {
    method: "POST",
    body: JSON.stringify({ event, props }),
  });
}
```

---

## 3. Dashboard admin expandido (queries e componentes)

### 3.1 Estrutura de queries

`src/lib/queries/analytics.ts`:

```tsx
import { createClient } from "@/lib/supabase/server";

// Top KPIs
export async function getDashboardKPIs(daysBack: number = 30) {
  const supabase = createClient();
  const since = new Date(Date.now() - daysBack * 86400_000).toISOString();
  
  const [visits, uniqueVisitors, subscribers, downloads, messages, avgTime] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact" }).gte("created_at", since).eq("event_name", "Page View"),
    supabase.from("analytics_events").select("session_id", { count: "exact" }).gte("created_at", since).not("session_id", "is", null),
    supabase.from("subscribers").select("id", { count: "exact" }).gte("created_at", since).eq("confirmed", true),
    supabase.from("downloads").select("id", { count: "exact" }).gte("created_at", since),
    supabase.from("contacts").select("id", { count: "exact" }).gte("created_at", since),
    supabase.rpc("get_avg_session_duration", { days_back: daysBack }),
  ]);

  return {
    visits: visits.count ?? 0,
    uniqueVisitors: uniqueVisitors.count ?? 0,
    subscribers: subscribers.count ?? 0,
    downloads: downloads.count ?? 0,
    messages: messages.count ?? 0,
    avgTimeSeconds: avgTime.data ?? 0,
  };
}

// Top localizações
export async function getTopLocations(daysBack: number = 30) {
  // RPC com aggregation
}

// Top páginas
export async function getTopPages(daysBack: number = 30) {
  // RPC com aggregation
}

// Funil newsletter
export async function getNewsletterFunnel(daysBack: number = 30) {
  // 4 stages: visited home, viewed form, submitted, confirmed
}

// Funil download skill
export async function getSkillDownloadFunnel(skillSlug?: string) {
  // 4 stages: viewed skill, opened gate, submitted, downloaded
}
```

### 3.2 RPCs Postgres necessários

Migration **006_analytics_rpcs.sql**:

```sql
create or replace function get_avg_session_duration(days_back int default 30)
returns int language sql security definer as $$
  select coalesce(avg(session_duration_seconds)::int, 0)
  from analytics_events
  where session_duration_seconds is not null
    and created_at >= now() - (days_back || ' days')::interval;
$$;

create or replace function get_top_locations(days_back int default 30, limit_n int default 10)
returns table (city text, region text, country text, sessions bigint, downloads bigint)
language sql security definer as $$
  select 
    e.city, e.region, e.country,
    count(distinct e.session_id) as sessions,
    count(distinct d.id) as downloads
  from analytics_events e
  left join downloads d on d.created_at >= now() - (days_back || ' days')::interval
  where e.created_at >= now() - (days_back || ' days')::interval
    and e.city is not null
  group by e.city, e.region, e.country
  order by sessions desc
  limit limit_n;
$$;

create or replace function get_top_pages(days_back int default 30, limit_n int default 10)
returns table (page_path text, visits bigint, avg_time_seconds int, bounce_rate numeric)
language sql security definer as $$
  -- Implementação completa do top pages com tempo médio e bounce rate
  select 
    page_path,
    count(*) as visits,
    coalesce(avg(session_duration_seconds)::int, 0) as avg_time_seconds,
    0::numeric as bounce_rate  -- calcular separado
  from analytics_events
  where event_name = 'Page View'
    and created_at >= now() - (days_back || ' days')::interval
    and page_path is not null
  group by page_path
  order by visits desc
  limit limit_n;
$$;

create or replace function get_newsletter_funnel(days_back int default 30)
returns table (stage text, count bigint)
language sql security definer as $$
  select 'visited_home', count(distinct session_id)::bigint from analytics_events 
    where event_name = 'Page View' and page_path = '/' and created_at >= now() - (days_back || ' days')::interval
  union all
  select 'viewed_form', count(distinct session_id)::bigint from analytics_events 
    where event_name = 'Newsletter Form View' and created_at >= now() - (days_back || ' days')::interval
  union all
  select 'submitted', count(*)::bigint from subscribers 
    where created_at >= now() - (days_back || ' days')::interval
  union all
  select 'confirmed', count(*)::bigint from subscribers 
    where confirmed = true and created_at >= now() - (days_back || ' days')::interval;
$$;
```

### 3.3 Componente Heatmap embed

`src/components/admin/HeatmapEmbed.tsx`:

```tsx
"use client";
import { useState } from "react";

const PAGES = ["/", "/sobre", "/trajetoria", "/skills", "/eventos", "/contato"];

export function HeatmapEmbed() {
  const [active, setActive] = useState("/");
  
  // Microsoft Clarity não tem API pública para embed direto.
  // Solução: print do heatmap via Clarity (manual ou via headless browser cron)
  // Ou: link externo direto pro Clarity dashboard com filtro por path
  
  return (
    <div className="border border-hairline p-8">
      <div className="flex gap-2 mb-4">
        {PAGES.map(p => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border ${
              active === p ? "bg-ink text-bone border-ink" : "border-hairline text-graphite hover:border-ink"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
      <div className="aspect-video bg-bone border border-hairline relative overflow-hidden">
        <img src={`/admin/heatmaps/${active.replace("/", "_") || "home"}.png`} alt="Heatmap" className="w-full h-full object-cover opacity-90" />
        <div className="absolute bottom-4 right-4">
          <a 
            href={`https://clarity.microsoft.com/projects/view/${process.env.NEXT_PUBLIC_CLARITY_ID}`}
            target="_blank"
            className="text-xs font-mono uppercase tracking-wider text-graphite hover:text-lime"
          >
            VER COMPLETO NO CLARITY →
          </a>
        </div>
      </div>
    </div>
  );
}
```

### 3.4 Componente mapa do Brasil

Usar `react-simple-maps` com TopoJSON do Brasil:

```bash
pnpm add react-simple-maps
pnpm add -D @types/react-simple-maps
```

Componente em `src/components/admin/BrazilHeatmap.tsx` que recebe array `{state: "MT", value: 124}` e colore os estados com gradiente bone → lime.

---

## 4. Premium feel: componentes novos

### 4.1 Cursor follower

`src/components/motion/CursorFollower.tsx`:

```tsx
"use client";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 150, damping: 25 });
  const springY = useSpring(y, { stiffness: 150, damping: 25 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch devices

    const move = (e: MouseEvent) => {
      x.set(e.clientX - 5);
      y.set(e.clientY - 5);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        position: "fixed",
        width: 10,
        height: 10,
        background: "#CCFF00",
        boxShadow: "0 0 12px rgba(204,255,0,0.4)",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
      }}
    />
  );
}
```

Usar em layouts seletivos (não global), tipo só em /, /sobre, /trajetoria.

### 4.2 Count up on scroll

`src/components/motion/CountUp.tsx`:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function CountUp({ to, duration = 2000, prefix = "", suffix = "" }: {
  to: number; duration?: number; prefix?: string; suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setValue(Math.floor(to * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  }, [inView, to, duration]);

  return <span ref={ref} className="font-mono">{prefix}{value}{suffix}</span>;
}
```

Usar nos 6 highlights da Trajetória e nos 6 KPIs do dashboard.

### 4.3 Lime corner brackets

`src/components/motion/HoverBrackets.tsx`:

```tsx
"use client";
import { ReactNode } from "react";

export function HoverBrackets({ children }: { children: ReactNode }) {
  return (
    <div className="relative group">
      {children}
      {/* 4 brackets que aparecem no hover */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-lime opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-lime opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-lime opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-lime opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
    </div>
  );
}
```

Wrap em cards principais (skills, eventos, projetos).

### 4.4 Scroll progress indicator

`src/components/motion/ScrollProgress.tsx`:

```tsx
"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{
        scaleY,
        position: "fixed",
        left: 0,
        top: 0,
        width: 4,
        height: "100vh",
        background: "#CCFF00",
        transformOrigin: "top",
        zIndex: 50,
      }}
    />
  );
}
```

Aparece sutilmente na lateral esquerda durante scroll.

### 4.5 Hero parallax

`src/components/motion/HeroParallax.tsx`:

```tsx
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function HeroParallax({ children, bg }: { children: React.ReactNode; bg?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <div ref={ref} className="relative h-screen overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">{bg}</motion.div>
      <motion.div style={{ y: fgY }} className="relative h-full">{children}</motion.div>
    </div>
  );
}
```

---

## 5. Atualização dos REQUIREMENTS

Adicionar R18, R19, R20 ao REQUIREMENTS.md:

### R18 — Captação ampliada

Must-haves:
- [ ] DownloadGate captura nome, email, WhatsApp e 2 consents
- [ ] Newsletter inline captura nome, email, WhatsApp e 2 consents
- [ ] Validação Zod server-side com schema de telefone BR
- [ ] Mask BR client-side no input WhatsApp
- [ ] LGPD: política atualizada explicitando coleta de WhatsApp
- [ ] LGPD: dois consents separados (newsletter, WhatsApp), não consent único
- [ ] Endpoint público `/api/privacy/delete?token=...` funcional
- [ ] Subscribers e downloads salvam UTMs

### R19 — Analytics premium

Must-haves:
- [ ] Plausible integrado e funcionando
- [ ] Microsoft Clarity integrado e configurado para mascarar dados sensíveis
- [ ] Vercel Analytics + Speed Insights ativos
- [ ] 14+ custom events configurados (lista na seção 2.3)
- [ ] Tabela `analytics_events` salvando espelho local
- [ ] Server Action `trackEvent` funcional, com IP anonimizado
- [ ] Dados de geo (country, region, city) via Vercel headers
- [ ] Dashboard admin consumindo de `analytics_events` + Plausible API quando aplicável
- [ ] Heatmap embed no admin (PNG export do Clarity ou link externo)
- [ ] Mapa do Brasil com heatmap de visitantes por estado
- [ ] 3 funis configurados (newsletter, download skill, contato)
- [ ] Tabela de eventos custom dos últimos 7 dias visível no admin

### R20 — Premium feel

Must-haves:
- [ ] Componente CursorFollower implementado e ativo em rotas principais (home, sobre, trajetoria)
- [ ] CountUp on scroll nos highlights da Trajetória e KPIs do dashboard
- [ ] HoverBrackets em cards (skills, eventos, projetos pessoais)
- [ ] ScrollProgress lateral sutil
- [ ] HeroParallax na home
- [ ] Hairline grid pattern atrás de todas as seções principais (não só hero)
- [ ] Lime cursor follower respeita prefers-reduced-motion e pointer:coarse (touch)
- [ ] Page transitions com fade + slight y entre rotas
- [ ] Stagger em listas de cards (eventos, skills, highlights) com 80ms offset
- [ ] Todos os ícones interativos com animação (conforme ICONS-MOTION.md)
- [ ] Eyebrows com lime dot prefix
- [ ] Active states com lime mais visível (filter pills bg lime, sidebar 4px lime, scroll progress)

---

## 6. Mudanças necessárias por arquivo

| Arquivo | O que mudar |
|---|---|
| `DATABASE.md` | Adicionar migration 005 (subscribers/downloads expandidos) e 006 (RPCs analytics) + tabela `analytics_events` |
| `REQUIREMENTS.md` | Adicionar R18, R19, R20 conforme seção 5 acima |
| `SEO.md` | Atualizar stack analytics: adicionar Microsoft Clarity (seção 7), expandir eventos custom (seção 7.4) |
| `DESIGN.md` | Adicionar seção 7 sobre Premium Feel components, ampliar uso de lime na seção 3 (princípios) |
| `ICONS-MOTION.md` | Confirmar todos os ícones tem hover state distinto e visível, não só estático |
| `ROADMAP.md` | Adicionar slice M5.6 "Captação ampliada e Analytics" antes do deploy final |
| `PROMPTS.md` | Adicionar prompt P5.6 referente à slice acima |
| `.env.example` | Adicionar `NEXT_PUBLIC_CLARITY_ID` |
| `PLAYBOOK.md` | Fase 4 inclui criar conta Microsoft Clarity |
| `STATE.md` + `DECISIONS.md` | Atualizar |

Como na pivot anterior, Claude Code aplica esses diffs automaticamente na slice correspondente se receber o prompt apontando para este arquivo.

---

## 7. Variáveis de ambiente adicionais

Adicionar ao `.env.example`:

```
# Microsoft Clarity (heatmap)
NEXT_PUBLIC_CLARITY_ID=

# PostHog (opcional, v2)
# NEXT_PUBLIC_POSTHOG_KEY=
# NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# WhatsApp Business API (opcional, v2 para envio direto)
# WHATSAPP_BUSINESS_TOKEN=
# WHATSAPP_PHONE_ID=
```

---

## 8. Próximos passos imediatos

1. Aurimar decide sobre confidencialidade da Trajetória (opção A, B ou C do STITCH-AJUSTES.md)
2. Aurimar reúne fotos profissionais (lista em STITCH-AJUSTES.md seção "Imagens necessárias")
3. Cria conta Microsoft Clarity (5 min)
4. Reroda Stitch com prompt único do STITCH-AJUSTES.md v2
5. Valida mockups regenerados
6. Avança para Claude Code com PLAYBOOK Fase 5

Tudo isso pode rolar em paralelo enquanto desenvolvimento avança.
