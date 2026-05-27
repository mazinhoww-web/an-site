# DATABASE.md — AN. Personal Site

Schema completo Supabase. Single source of truth. Qualquer alteração exige:
1. PR contra este arquivo
2. Migration nova em `/supabase/migrations/<timestamp>_<descricao>.sql`
3. Atualização de tipos TS via `supabase gen types`

---

## 1. Convenções

- Nomes em `snake_case`.
- Toda tabela tem: `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`.
- Trigger `set_updated_at` em todas tabelas com `updated_at`.
- Slug field unique constraint quando aplicável.
- Soft-delete via `deleted_at timestamptz null` quando necessário (subscribers para LGPD).
- RLS sempre ativada. Policy default: deny. Policies explícitas por tabela.

---

## 2. Diagrama lógico

```
profiles (admin)            contacts                 newsletter_campaigns
                                                    └─ logs de envio

projects ──┐                subscribers ──┬── downloads ── skills
news ──────┤                              └── newsletter_recipients
skills ────┘
```

---

## 3. Schema SQL

### 3.1 Extensions

```sql
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
```

### 3.2 Function: set_updated_at

```sql
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

### 3.3 Table: profiles

Espelho de `auth.users` para Aurimar. Não usado por público.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at
before update on profiles
for each row execute function set_updated_at();
```

### 3.4 Table: projects

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body_md text not null default '',
  tags text[] not null default '{}',
  cover_url text,
  external_url text,
  year int,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_at_idx on projects(published_at desc) where is_published;
create index projects_tags_idx on projects using gin(tags);
create index projects_featured_idx on projects(is_featured) where is_featured and is_published;

create trigger projects_updated_at
before update on projects
for each row execute function set_updated_at();
```

### 3.5 Table: skill_categories

Categorias fechadas (não free-form) para consistência.

```sql
create table skill_categories (
  id text primary key,
  label text not null,
  sort_order int not null default 0
);

insert into skill_categories (id, label, sort_order) values
  ('go-to-market', 'Go-to-Market', 10),
  ('operations',   'Operations',   20),
  ('product',      'Product',      30),
  ('data',         'Data',         40),
  ('agile',        'Agile',        50),
  ('design',       'Design',       60),
  ('latam',        'LATAM Pass',   70),
  ('research',     'Research',     80),
  ('framework',    'Framework',    90);
```

### 3.6 Table: skills

```sql
create table skills (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text not null,
  long_description_md text not null default '',
  category_id text not null references skill_categories(id),
  tags text[] not null default '{}',
  file_url text,
  file_name text,
  file_size_bytes int,
  thumbnail_url text,
  badge text not null default 'FREE' check (badge in ('FREE', 'PRO')),
  download_count int not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index skills_category_idx on skills(category_id);
create index skills_published_idx on skills(is_published, published_at desc);
create index skills_featured_idx on skills(is_featured) where is_featured and is_published;
create index skills_tags_idx on skills using gin(tags);

create trigger skills_updated_at
before update on skills
for each row execute function set_updated_at();
```

### 3.7 Table: news

```sql
create table news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  body_md text not null default '',
  category text,
  cover_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index news_published_idx on news(is_published, published_at desc);

create trigger news_updated_at
before update on news
for each row execute function set_updated_at();
```

### 3.8 Table: subscribers

```sql
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'unknown' check (source in ('newsletter_form', 'skill_gate', 'manual', 'unknown')),
  consent_newsletter boolean not null default false,
  consent_lgpd boolean not null default false,
  confirmed boolean not null default false,
  confirmation_token text unique,
  confirmation_sent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed boolean not null default false,
  unsubscribe_token text not null default encode(gen_random_bytes(24), 'hex') unique,
  unsubscribed_at timestamptz,
  ip_address inet,
  user_agent text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index subscribers_confirmed_idx on subscribers(confirmed, unsubscribed) where deleted_at is null;
create index subscribers_email_idx on subscribers(email) where deleted_at is null;

create trigger subscribers_updated_at
before update on subscribers
for each row execute function set_updated_at();
```

### 3.9 Table: downloads

```sql
create table downloads (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  skill_id uuid not null references skills(id) on delete cascade,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index downloads_subscriber_idx on downloads(subscriber_id);
create index downloads_skill_idx on downloads(skill_id);
create index downloads_created_idx on downloads(created_at desc);
```

### 3.10 Table: contacts

```sql
create table contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  subject text not null,
  message text not null,
  ip_address inet,
  user_agent text,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index contacts_read_idx on contacts(is_read, created_at desc);

create trigger contacts_updated_at
before update on contacts
for each row execute function set_updated_at();
```

### 3.11 Table: newsletter_campaigns

```sql
create table newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body_md text not null,
  body_html text not null,
  status text not null default 'draft' check (status in ('draft', 'sending', 'sent', 'failed')),
  recipient_count int not null default 0,
  delivered_count int not null default 0,
  bounced_count int not null default 0,
  scheduled_at timestamptz,
  sent_at timestamptz,
  error_message text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index newsletter_status_idx on newsletter_campaigns(status, created_at desc);

create trigger newsletter_campaigns_updated_at
before update on newsletter_campaigns
for each row execute function set_updated_at();
```

### 3.12 Table: newsletter_recipients

Log granular por destinatário (para retry e tracking).

```sql
create table newsletter_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references newsletter_campaigns(id) on delete cascade,
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'bounced')),
  resend_message_id text,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create index nr_campaign_idx on newsletter_recipients(campaign_id, status);
create unique index nr_unique_per_campaign on newsletter_recipients(campaign_id, subscriber_id);
```

---

## 4. RLS Policies

### 4.1 Habilitar RLS

```sql
alter table profiles                enable row level security;
alter table projects                enable row level security;
alter table skill_categories        enable row level security;
alter table skills                  enable row level security;
alter table news                    enable row level security;
alter table subscribers             enable row level security;
alter table downloads               enable row level security;
alter table contacts                enable row level security;
alter table newsletter_campaigns    enable row level security;
alter table newsletter_recipients   enable row level security;
```

### 4.2 Helper: is_admin

```sql
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer set search_path = public;
```

### 4.3 Policies de leitura pública (anon)

```sql
-- projects publicados
create policy "public read published projects"
on projects for select
to anon, authenticated
using (is_published = true);

-- skills publicadas (sem expor file_url para anon - tratado em app layer)
create policy "public read published skills"
on skills for select
to anon, authenticated
using (is_published = true);

-- news publicadas
create policy "public read published news"
on news for select
to anon, authenticated
using (is_published = true);

-- skill_categories sempre legível
create policy "public read skill categories"
on skill_categories for select
to anon, authenticated
using (true);
```

### 4.4 Policies de inserção pública

```sql
-- contacts: qualquer um pode inserir
create policy "public insert contacts"
on contacts for insert
to anon
with check (true);

-- subscribers: qualquer um pode inserir/upsert
create policy "public insert subscribers"
on subscribers for insert
to anon
with check (true);

-- downloads: apenas via service role (Server Action faz auth do email)
-- nenhuma policy para anon → deny
```

### 4.5 Policies de admin

Padrão para todas tabelas: admin pode tudo.

```sql
-- macro replicar para cada tabela:
create policy "admin all projects"      on projects               for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin all skills"        on skills                 for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin all news"          on news                   for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin all subscribers"   on subscribers            for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin all downloads"     on downloads              for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin all contacts"      on contacts               for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin all campaigns"     on newsletter_campaigns   for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin all recipients"    on newsletter_recipients  for all to authenticated using (is_admin()) with check (is_admin());
create policy "admin read profiles"     on profiles               for select to authenticated using (id = auth.uid() or is_admin());
```

### 4.6 Trigger: criar profile automaticamente quando user vira admin

```sql
create or replace function handle_new_admin()
returns trigger as $$
begin
  insert into profiles (id, email, role)
  values (new.id, new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- trigger ativado manualmente em Server Action quando confirmamos
-- que o email está em ADMIN_EMAILS (não automatizar todos os signups)
```

---

## 5. Storage Buckets

### 5.1 Bucket `skills` (privado)

```sql
-- via Supabase UI:
-- Name: skills
-- Public: false
-- File size limit: 5 MB
-- Allowed mime types: application/octet-stream, application/zip
```

Acesso: apenas Server Actions com service role. Public obtém via signed URL temporária (10min).

### 5.2 Bucket `media` (público)

```sql
-- Name: media
-- Public: true
-- File size limit: 2 MB
-- Allowed mime types: image/jpeg, image/png, image/webp, image/avif
```

Usado para thumbnails de projetos, skills, news, cover de OG.

### 5.3 Storage RLS

```sql
-- media: leitura pública
create policy "public read media"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'media');

-- media: upload apenas admin
create policy "admin upload media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'media' and is_admin());

create policy "admin update media"
on storage.objects for update
to authenticated
using (bucket_id = 'media' and is_admin());

create policy "admin delete media"
on storage.objects for delete
to authenticated
using (bucket_id = 'media' and is_admin());

-- skills: nada para anon
create policy "admin all skills bucket"
on storage.objects for all
to authenticated
using (bucket_id = 'skills' and is_admin())
with check (bucket_id = 'skills' and is_admin());
```

---

## 6. Funções RPC

### 6.1 increment_skill_download

```sql
create or replace function increment_skill_download(p_skill_id uuid)
returns void as $$
begin
  update skills set download_count = download_count + 1 where id = p_skill_id;
end;
$$ language plpgsql security definer set search_path = public;
```

### 6.2 confirm_subscriber

```sql
create or replace function confirm_subscriber(p_token text)
returns boolean as $$
declare
  v_found boolean;
begin
  update subscribers
    set confirmed = true,
        confirmed_at = now(),
        confirmation_token = null
    where confirmation_token = p_token
      and confirmed = false
      and deleted_at is null;
  get diagnostics v_found = found;
  return v_found;
end;
$$ language plpgsql security definer set search_path = public;
```

### 6.3 unsubscribe_by_token

```sql
create or replace function unsubscribe_by_token(p_token text)
returns boolean as $$
declare
  v_found boolean;
begin
  update subscribers
    set unsubscribed = true,
        unsubscribed_at = now()
    where unsubscribe_token = p_token
      and deleted_at is null;
  get diagnostics v_found = found;
  return v_found;
end;
$$ language plpgsql security definer set search_path = public;
```

---

## 7. Seed Data

### 7.1 Skills iniciais (referência SCIENT + próprias)

```sql
insert into skills (slug, name, short_description, category_id, tags, badge, is_featured, is_published, published_at) values
  ('gtm-engineering',
   'GTM Engineering',
   'Arquitetura de sistemas de receita, ICP e Ideal Customer Signals (ICS), stack moderno (Clay, HubSpot, N8N) e implementacao de AI-Led Growth.',
   'go-to-market',
   array['ICP', 'ICS', 'Stack GTM', 'AI Agents', 'Outbound', 'Theory of Constraints'],
   'FREE', true, true, now()),

  ('gtm-automation-ai-agents',
   'GTM Automation & AI Agents',
   'SDR IA com workflow completo de nodes N8N, processamento automatico de transcricoes (Fathom, Fireflies), agente de higiene de CRM, alerta de churn e enriquecimento de lead inbound.',
   'go-to-market',
   array['N8N', 'SDR IA', 'Transcricoes', 'CRM Hygiene', 'Lead Enrichment'],
   'FREE', true, true, now()),

  ('revops-gtm-strategy',
   'RevOps GTM Strategy',
   'Revenue Operations end-to-end: jornada unificada do cliente, modelo de dados de receita, BANT/MEDDIC, pipeline management, forecasting e metricas GTM-5.',
   'go-to-market',
   array['NRR/GRR', 'CAC/LTV', 'Pipeline', 'Forecast', 'BANT/MEDDIC'],
   'FREE', false, true, now()),

  ('customer-success-operations',
   'Customer Success Operations',
   'Frameworks de onboarding com milestones, health score composto, playbooks de retencao e expansao, QBR e gestao de carteira por segmento.',
   'operations',
   array['Health Score', 'Onboarding', 'QBR', 'Churn Prevention', 'NRR'],
   'FREE', false, true, now()),

  ('agile-project-management',
   'Agile Project Management',
   'SCRUM completo, Dual Track Agile (Discovery + Delivery paralelos) e documentacao executiva acionavel.',
   'agile',
   array['SCRUM', 'Sprints', 'Roadmap', 'Status Reports', 'Dual Track'],
   'FREE', false, true, now()),

  ('automation-data-platforms',
   'Automation & Data Platforms',
   'Automacoes N8N/Make, integracoes via API, Customer Data Platform (CDP), Revenue Data Platform (RDP) e arquitetura de Data Lake com Medallion.',
   'data',
   array['N8N', 'CDP', 'RDP', 'ETL/ELT', 'Webhooks'],
   'FREE', true, true, now()),

  ('product-management-digital',
   'Product Management Digital',
   'OKRs e North Star Metric, Google HEART framework, Jobs-to-be-Done, Continuous Discovery Habits, Product-Led Growth (PLG), priorizacao RICE/ICE.',
   'product',
   array['OKRs', 'JTBD', 'Discovery', 'PLG', 'RICE Score'],
   'FREE', false, true, now()),

  ('data-engineering-senior',
   'Data Engineering Senior',
   'Arquitetura Medallion Bronze/Silver/Gold com PySpark, pipelines ETL/ELT, orquestracao com Airflow, modelagem dimensional com SCD e streaming Kafka.',
   'data',
   array['Medallion', 'PySpark', 'Airflow', 'dbt', 'Kafka'],
   'FREE', false, true, now()),

  -- skills proprias do Aurimar
  ('metodo-jet',
   'Metodo Jet',
   'Framework de inovacao em 3 fases: Diagnostico da Oportunidade, Prototipacao Agil, Visao Transformadora. Aplicado em squads de inovacao corporativa.',
   'framework',
   array['Inovacao', 'Discovery', 'Squad', 'Prototipo'],
   'FREE', true, true, now()),

  ('gsd2-methodology',
   'GSD2 Methodology',
   'Get Shit Done 2: Milestone > Slice > Task com spec-before-code, PROJECT.md / REQUIREMENTS.md / ROADMAP.md. Anti-context-rot para projetos com IA.',
   'framework',
   array['GSD', 'Spec-driven', 'Claude Code', 'Workflow'],
   'FREE', true, true, now()),

  ('latam-deck-template',
   'LATAM Deck Template',
   'Identidade visual LATAM Pass e ELEVATE 2025 aplicada a PPTX/HTML/PDF para decks executivos, status reports e propostas.',
   'latam',
   array['PPTX', 'LATAM Pass', 'Executive Review', 'Templates'],
   'FREE', false, true, now()),

  ('innovation2business',
   'Innovation2Business Framework',
   'Metodologia para transformar ideias em negocios viaveis dentro de squads corporativas, conectando Discovery, Business Case e Go-to-Market.',
   'framework',
   array['Inovacao', 'Business Case', 'Squad', 'eLoyalty'],
   'FREE', false, true, now());
```

### 7.2 Projetos iniciais (placeholder)

```sql
insert into projects (slug, title, summary, tags, year, is_featured, is_published, published_at) values
  ('cia-do-visto',
   'Cia do Visto',
   'Plataforma digital de consultoria de visto americano com gestao de leads, contratos via ClickSign e checkout Stripe.',
   array['fintech', 'consultoria', 'side-project'],
   2026, true, true, now()),

  ('latam-wallet',
   'Conta Global LATAM Pass',
   'Carteira multimoeda em parceria com AstroPay com acumulo de milhas LATAM Pass como diferencial core. Modelo 50/50 post-miles profit share.',
   array['LATAM', 'fintech', 'loyalty'],
   2026, true, true, now()),

  ('cartao-pf-latam',
   'Cartao PF LATAM Pass',
   'White label credit card para individuos enquadrado como alavanca de negociacao com Itau, com stack BaaS Celcoin/Dock + FIDC QI Tech/Giro.Tech.',
   array['LATAM', 'fintech', 'cartao'],
   2026, true, true, now());
```

### 7.3 Notícias iniciais

```sql
insert into news (slug, title, summary, body_md, is_published, published_at) values
  ('summit-sicredi-2026',
   'Painel no Summit de Inovacao Sicredi Central Centro-Norte',
   'Participacao como speaker no Summit de Inovacao da Sicredi em 21-22 de maio, com video promocional gravado em parceria com LATAM Pass.',
   'Conteudo completo aqui.',
   true, now() - interval '3 days'),

  ('embedded-credit-cubo-itau',
   'Painel Embedded Credit no Cubo Itau',
   'Apresentacao no evento GYRA+ sobre tendencias de credito embarcado e o papel de programas de fidelidade como originadores de valor financeiro.',
   'Conteudo completo aqui.',
   true, now() - interval '14 days');
```

---

## 8. Migration Strategy

1. Toda alteração de schema vira `supabase/migrations/<timestamp>_<descricao>.sql`.
2. `supabase migration new <descricao>` cria o arquivo.
3. `supabase db push` aplica em dev.
4. PR para `main` revisado por Aurimar antes de aplicar em prod (`supabase db push --linked`).
5. Após cada migration: `supabase gen types typescript --linked > src/types/database.types.ts`.

---

## 9. Backup

- Supabase backup diário automático (incluso no free tier 7 dias).
- Dump manual antes de migration grande: `supabase db dump -f backup_<timestamp>.sql`.
- Backup mensal arquivado em Drive de Aurimar.

---

## 10. Observabilidade mínima

- Supabase Logs habilitado para queries lentas (>1s).
- Alertas Vercel para erros 5xx via Slack/email.
- Tabela `newsletter_recipients` serve como audit log de envios.
