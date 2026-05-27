# EVENTOS-CHANGE.md — Pivot de /projetos para /eventos

> Documento de mudança formal. A seção/página `/projetos` foi removida e substituída por `/eventos`. Este arquivo é o source of truth do pivot e indica onde editar em cada doc impactado. Lido antes de qualquer slice que envolva eventos ou que mencione projetos no contexto antigo.

---

## 1. Decisão

**Antes:** site teria página `/projetos` com cards de iniciativas (LATAM Wallet, Cia do Visto, CERC, Pátio Estúdios, etc).

**Depois:** site tem página `/eventos` com cards de **aparições públicas** onde Aurimar atuou como palestrante, painelista, jurado, mediador ou mentor.

**Por quê.** Trajetória já cobre a carreira interna e o trabalho dentro de empresas. Eventos é a camada externa: prova social de autoridade pública, com data, organizador, público e papel exatos. Mais útil para SEO (Schema.org Event ranqueia bem em "aurimar nogueira palestrante", "aurimar nogueira embedded credit", "aurimar nogueira summit"), mais útil para prospecção (organizadores podem buscar speakers), e mais autêntico (mostra onde a voz pública dele apareceu).

**Projetos pessoais e iniciativas internas seguem aparecendo:**
- Projetos da carreira → na Trajetória (LATAM Wallet, CPR Registry, etc, já estão nos capítulos)
- Empreendimentos pessoais (Cia do Visto, Pátio Estúdios, Visto com Lê) → bloco lateral no Sobre ou no Contato como "Também em", já contemplado

---

## 2. Schema da página

### 2.1 `/eventos` — lista

```
[Nav]
[Page header]
  Eyebrow mono: "ONDE FALEI"
  H1 "Eventos"
  Subtitle: "Painéis, palestras, mentorias e mesas em que estive como representante de uma frente que defendo."
[Filter pills horizontal]
  TODOS / PALESTRANTE / PAINELISTA / JURADO / MEDIADOR / MENTOR
[Lista vertical de cards de evento (não grid)]
  Cada card ocupa largura total ou 2/3 do container
  Layout horizontal: data à esquerda, conteúdo no meio, papel à direita
[Paginação]
[Footer]
```

**Por que lista vertical (não grid):**
- Eventos têm peso temporal: data importa mais que categoria
- Permite descrição mais longa por item
- Reforça leitura cronológica
- Mais editorial, menos catálogo

### 2.2 Card de evento (lista)

```
[Linha hairline superior]
[Linha horizontal com 3 zonas]:

Zona 1 (esquerda, 2/12):
  Data em mono uppercase grande: "21 MAI 2026"
  Logo abaixo, papel em mono uppercase com cor lime se for palestrante/jurado:
  "PALESTRANTE"

Zona 2 (meio, 7/12):
  Eyebrow mono "TIPO" (ex: SUMMIT / PAINEL / MEETUP / CONFERÊNCIA / WORKSHOP)
  H3 Space Grotesk: nome do evento (ex: "Summit de Inovação Sicredi Central Centro-Norte")
  Caption Inter: assunto da fala (ex: "Inovação aplicada em cooperativismo financeiro")
  Body-s 2 linhas: descrição do contexto e do que foi apresentado
  Tags em mono uppercase 10px no final

Zona 3 (direita, 3/12):
  Localização: lucide MapPin + "Cuiabá, MT" em mono uppercase
  Organizador: lucide Building + "Sicredi" em mono uppercase
  Link: lucide ArrowUpRight icon clicável para /eventos/[slug] ou para link externo

[Linha hairline inferior]
```

Hover do card: a zona 3 ganha lime accent no ArrowUpRight.

### 2.3 `/eventos/[slug]` — detalhe

```
[Nav]
[Breadcrumb: EVENTOS / NOME DO EVENTO]
[Hero do evento]:
  Eyebrow mono: tipo do evento + papel
  H1 Space Grotesk: nome do evento
  Subtitle body-l: assunto da fala
  Metadata row em mono uppercase:
    lucide Calendar + DATA
    lucide MapPin + LOCAL
    lucide Building + ORGANIZADOR
    lucide Users + PÚBLICO ESTIMADO (opcional)
[Hairline]
[Layout 1 coluna max-w-prose]:
  H2 "Contexto"
  Body editorial
  H2 "O que apresentei"
  Body editorial com bullets se necessário
  H2 "Conclusões e takeaways" (opcional)
  Body editorial
[Hairline]
[Bloco lateral fixo ou seção: Material]:
  Se houver vídeo: embed do YouTube/Vimeo em frame hairline
  Se houver deck: link "Baixar deck" com Download icon
  Se houver foto: PhotoFrame com captura
  Se houver matéria/release: link externo com ArrowUpRight
[Hairline]
[CTA]: "Convidar para um evento" → /contato com assunto pré-selecionado "Fala em evento"
[Próximo evento] e [Evento anterior] em rodapé
```

---

## 3. Schema Supabase (substitui a tabela `projects`)

### Migration 004_events.sql

```sql
-- Remove a tabela projects (se já existir, drop com cascade)
drop table if exists public.projects cascade;

-- Cria tabela events
create type public.event_role as enum (
  'palestrante',
  'painelista',
  'jurado',
  'mediador',
  'mentor',
  'host',
  'convidado'
);

create type public.event_type as enum (
  'summit',
  'painel',
  'meetup',
  'conferencia',
  'workshop',
  'webinar',
  'mesa-redonda',
  'mentoria',
  'demoday'
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,                          -- nome do evento
  event_type public.event_type not null,
  role public.event_role not null,
  topic text not null,                          -- assunto da fala
  description_short text not null,              -- 2 linhas para card da lista
  description_md text,                          -- editorial completo da página de detalhe
  context_md text,                              -- seção contexto
  presentation_md text,                         -- seção "o que apresentei"
  takeaways_md text,                            -- seção conclusões (opcional)
  event_date date not null,
  event_end_date date,                          -- se for evento de múltiplos dias
  city text,
  state text,
  country text default 'BR',
  venue text,                                   -- local físico ou "online"
  organizer text not null,                      -- "Sicredi", "Cubo Itaú", "BCG"
  audience_size int,                            -- público estimado
  external_url text,                            -- link para o evento
  video_url text,                               -- gravação no YouTube/Vimeo
  deck_url text,                                -- link para deck publicado
  image_url text,                               -- foto do evento
  tags text[] default '{}',
  order_index int default 0,                    -- para empate de datas
  featured boolean default false,               -- destaque na home
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_events_date on public.events (event_date desc);
create index idx_events_published on public.events (published);
create index idx_events_featured on public.events (featured) where featured = true;
create index idx_events_role on public.events (role);

-- RLS
alter table public.events enable row level security;

create policy "Public read published events" on public.events
  for select using (published = true);
create policy "Admin all events" on public.events
  for all using (is_admin()) with check (is_admin());

create trigger events_updated_at before update on public.events
  for each row execute function update_updated_at_column();
```

### Seed inicial (eventos reais)

```sql
insert into public.events (
  slug, title, event_type, role, topic,
  description_short, context_md, presentation_md, takeaways_md,
  event_date, event_end_date, city, state, venue,
  organizer, audience_size,
  tags, featured
) values

-- Sicredi Summit Centro-Norte
('summit-sicredi-centro-norte-2026',
  'Summit de Inovação Sicredi Central Centro-Norte',
  'summit', 'palestrante',
  'Inovação aplicada em cooperativismo financeiro',
  'Speaker no summit anual da Sicredi Central Centro-Norte. Tema: como aplicar frameworks de inovação testados em empresas de capital aberto dentro de cooperativas regionais.',
  'O Sistema Sicredi tem na cooperatividade um diferencial estratégico, mas enfrenta o desafio comum de toda instituição financeira: balancear inovação com regulação e cultura. A Central Centro-Norte convidou o Summit como espaço de debate entre líderes do sistema e provocadores externos.',
  'Apresentação cobriu três frentes: 1) por que loyalty e fintech são pernas inseparáveis na próxima onda de bancarização cooperativa, 2) como o Método Jet pode ser adaptado para ciclos de inovação dentro de cooperativas regionais, 3) cases recentes da LATAM Pass que se aplicam ao contexto Sicredi.',
  'A inovação em cooperativas só escala quando respeita a governança regional. Framework precisa ser adaptável, não importável puro.',
  '2026-05-21', '2026-05-22',
  'Cuiabá', 'MT', 'Sicredi Central Centro-Norte',
  'Sicredi Central Centro-Norte', 250,
  '{"cooperativismo","inovação","loyalty","fintech"}', true),

-- Embedded Credit Cubo Itaú
('embedded-credit-cubo-itau-2026',
  'Embedded Credit no Cubo Itaú',
  'painel', 'painelista',
  'Crédito embarcado em marketplaces e plataformas',
  'Painelista no encontro Embedded Credit organizado pelo Cubo Itaú durante o evento GYRA+. Discussão sobre o que muda para originadores quando o crédito vira feature embutida em produto não-financeiro.',
  'Embedded credit deixou de ser tendência e virou commodity técnica em 2025. A discussão agora é regulatória, de unit economics e de quem fica com o cliente quando a fricção desaparece. O painel reuniu originadores, BaaS e plataformas para mapear esse novo equilíbrio.',
  'Trouxe a leitura da LATAM Pass sobre estruturação do Cartão PF como caso de embedded credit em ecossistema loyalty. Pontos discutidos: separação BaaS + FIDC, escolha de cota subordinada ou não, governança de risco quando a marca dona é a do programa de fidelidade.',
  'Quando o crédito é embutido em loyalty, o ativo de marca compensa o custo de aquisição. Mas só funciona se o desenho regulatório acompanha o desenho de produto desde o dia 1.',
  '2026-04-15', null,
  'São Paulo', 'SP', 'Cubo Itaú',
  'Cubo Itaú (GYRA+)', 80,
  '{"embedded-credit","fintech","BaaS","FIDC","loyalty"}', true),

-- Segundo Voo / Inclusão Produtiva
('inclusao-produtiva-segundo-voo-2026',
  'Inclusão Produtiva e o programa Segundo Voo',
  'painel', 'painelista',
  'Reuso de tecido e inclusão produtiva em escala',
  'Painelista em conversa sobre como grandes empresas podem operar programas de inclusão produtiva integrados à cadeia. Foco no programa Segundo Voo da LATAM, que reusa tecido de uniformes em projetos sociais.',
  'Inclusão produtiva costuma ser CSR de baixa escala. O programa Segundo Voo da LATAM nasceu da intenção de transformar resíduos têxteis em insumo de cooperativas, com governança real e métricas de impacto.',
  'Como representante da squad eLoyalty / New Business, contei o ponto de contato entre fidelização e inclusão: pontos LATAM Pass podem ser ativos de impacto social, não só de marketing. O programa Segundo Voo é uma das pernas dessa hipótese.',
  null,
  '2026-05-20', null,
  'São Paulo', 'SP', 'LATAM Pass',
  'LATAM Airlines', 60,
  '{"impacto-social","inclusao-produtiva","loyalty","CSR"}', false);
```

Aurimar adiciona via admin outros eventos passados conforme se lembrar.

---

## 4. SEO específico de /eventos

### 4.1 URLs
- Lista: `https://aurimar.com.br/eventos`
- Detalhe: `https://aurimar.com.br/eventos/[slug]`
- Filtros via query: `?papel=palestrante`, `?tipo=summit`

### 4.2 Metadata por página

**`/eventos` (lista):**
- Title: `Eventos | Aurimar Nogueira — Palestrante, Painelista, Jurado`
- Description: `Aparições públicas de Aurimar Nogueira como palestrante, painelista e jurado. Summit Sicredi, Embedded Credit no Cubo Itaú, Inclusão Produtiva LATAM e mais.`

**`/eventos/[slug]` (detalhe):**
- Title: `{title} | Aurimar Nogueira`
- Description: `{description_short}` truncado a 160 caracteres

### 4.3 JSON-LD

Cada evento usa Schema.org `Event` (não `CreativeWork`):

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Summit de Inovação Sicredi Central Centro-Norte",
  "startDate": "2026-05-21",
  "endDate": "2026-05-22",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Sicredi Central Centro-Norte",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cuiabá",
      "addressRegion": "MT",
      "addressCountry": "BR"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Sicredi Central Centro-Norte"
  },
  "performer": {
    "@type": "Person",
    "name": "Aurimar Nogueira",
    "url": "https://aurimar.com.br"
  },
  "description": "Speaker no summit anual..."
}
```

Lista de eventos vira `ItemList` no JSON-LD da página `/eventos`.

### 4.4 Keywords-âncora novas

- "aurimar nogueira palestrante"
- "aurimar nogueira painelista"
- "aurimar embedded credit"
- "aurimar sicredi summit"
- "aurimar segundo voo latam"

---

## 5. Diffs por arquivo (o que mudar em cada doc)

| Arquivo | O que mudar |
|---|---|
| `PROJECT.md` | Trocar todas as referências de "projetos" como página por "eventos". Atualizar lista de páginas v1. |
| `REQUIREMENTS.md` | Substituir requisito R7 Projetos por R7 Eventos. Critérios novos: filtro por papel, ordem cronológica reversa, schema Event no JSON-LD. |
| `ROADMAP.md` | Slice M2.3 "Projetos lista + detalhe" vira "Eventos lista + detalhe". M4.3 ajusta CRUD para events. |
| `DESIGN.md` | Substituir seção 6.4 e 6.5 (layouts de projetos) por layouts de /eventos (lista vertical com 3 zonas, detalhe com material embed). Mencionado neste arquivo na seção 2 acima. |
| `DATABASE.md` | Remover tabela `projects` do schema e seed. Adicionar tabela `events` conforme migration 004 acima. Atualizar policies. |
| `PROMPTS.md` | Renomear prompt P2.3 para "Eventos lista + detalhe" e P4.3 para "Admin CRUD Eventos". Conteúdo do prompt aponta para este arquivo. |
| `STITCH-PROMPTS.md` | Substituir prompt S3 (Projetos lista) pelo novo S3 Eventos (especificado na seção 6 abaixo). |
| `STITCH-AJUSTES.md` | Já obsoleto pra parte de Projetos. Marcar S5 Projetos como descartado e usar o S3 Eventos abaixo. |
| `SEO.md` | Atualizar tabela de URLs (linha 2.1): trocar `/projetos` por `/eventos`. Trocar JSON-LD `CreativeWork` por `Event`. Adicionar keywords da seção 4.4 acima. |
| `TRAJETORIA.md` | Onde diz "linka para projetos relacionados em /projetos", trocar por "linka para eventos relacionados em /eventos quando houver". Pequeno ajuste. |
| `PLAYBOOK.md` | Atualizar Fase 7 (ordem de slices): M2.3 vira "Eventos" e não "Projetos". Mencionar este EVENTOS-CHANGE.md como leitura obrigatória da slice. |
| `README.md` | Linha que menciona "Projetos" na lista de páginas, trocar por "Eventos". |
| `STATE.md` | Atualizar (já vou fazer agora). |
| `DECISIONS.md` | Adicionar decisão (já vou fazer agora). |

**Como aplicar:** Claude Code vai aplicar todos esses diffs automaticamente na slice M2.3 se receber o prompt P2.3 atualizado, que aponta pra este arquivo. Não precisa editar manualmente cada um agora.

---

## 6. Prompt Stitch novo S3 Eventos (substitui S3 Projetos)

Cole em STITCH-PROMPTS.md substituindo o S3 atual:

```
Generate /eventos list page following AN. design system.

STRUCTURE:

1. Same navigation as home

2. Page header:
- Eyebrow mono uppercase: "ONDE FALEI"
- H1 Space Grotesk weight 700: "Eventos"
- Subtitle Inter body-l, max-width 65 characters: "Painéis, palestras, mentorias e mesas em que estive como representante de uma frente que defendo. Em ordem cronológica reversa."

3. Filter pills horizontal:
- "Todos" (active by default, lime border + lime text)
- "Palestrante", "Painelista", "Jurado", "Mediador", "Mentor"
- Pills with 8px border-radius, mono uppercase 11px, padding 8px 16px

4. Vertical list of event cards (NOT a grid). Each card occupies full container width, 24px gap between cards.

Each event card layout (horizontal split into 3 zones):

Zone 1 (left, 2/12 width):
- Large date in JetBrains Mono uppercase, 32-40px ink: "21 MAI 2026"
- Right below, role in mono uppercase smaller (12px) with lime color if role is Palestrante or Jurado, ink otherwise: "PALESTRANTE"

Zone 2 (middle, 7/12 width, with 32px padding left from zone 1):
- Eyebrow mono uppercase 11px: event type ("SUMMIT", "PAINEL", "MEETUP", etc)
- H3 Space Grotesk weight 600: event name (e.g. "Summit de Inovação Sicredi Central Centro-Norte")
- Caption Inter body-s graphite: topic of the talk (e.g. "Inovação aplicada em cooperativismo financeiro")
- Body-s Inter 2 lines: short description
- Tag chips at bottom in mono uppercase 10px

Zone 3 (right, 3/12 width, right-aligned text):
- Each item on its own line, vertically stacked, mono uppercase 11px:
  - lucide MapPin (16px) + "Cuiabá, MT"
  - lucide Building (16px) + "Sicredi"
  - lucide ArrowUpRight (20px ink) as a clickable button to event detail

Each card separated by 1px hairline above and below (not card border).

Hover state: the entire card has subtle bone-darker background, ArrowUpRight in zone 3 becomes lime and moves up-right 4px.

5. Show these 3 real events seeded:

EVENT 1:
- Date: "21 MAI 2026"
- Role: PALESTRANTE (lime color)
- Type: SUMMIT
- Title: "Summit de Inovação Sicredi Central Centro-Norte"
- Topic: "Inovação aplicada em cooperativismo financeiro"
- Description: "Speaker no summit anual da Sicredi Central Centro-Norte. Tema: como aplicar frameworks de inovação testados em empresas de capital aberto dentro de cooperativas regionais."
- Location: "Cuiabá, MT"
- Organizer: "Sicredi"
- Tags: COOPERATIVISMO, INOVAÇÃO, LOYALTY, FINTECH

EVENT 2:
- Date: "15 ABR 2026"
- Role: PAINELISTA (ink color)
- Type: PAINEL
- Title: "Embedded Credit no Cubo Itaú"
- Topic: "Crédito embarcado em marketplaces e plataformas"
- Description: "Painelista no encontro Embedded Credit organizado pelo Cubo Itaú durante o evento GYRA+. Discussão sobre o que muda para originadores quando o crédito vira feature embutida em produto não-financeiro."
- Location: "São Paulo, SP"
- Organizer: "Cubo Itaú"
- Tags: EMBEDDED-CREDIT, FINTECH, BAAS, LOYALTY

EVENT 3:
- Date: "20 MAI 2026"
- Role: PAINELISTA (ink color)
- Type: PAINEL
- Title: "Inclusão Produtiva e o programa Segundo Voo"
- Topic: "Reuso de tecido e inclusão produtiva em escala"
- Description: "Painelista em conversa sobre como grandes empresas podem operar programas de inclusão produtiva integrados à cadeia. Foco no programa Segundo Voo da LATAM."
- Location: "São Paulo, SP"
- Organizer: "LATAM Airlines"
- Tags: IMPACTO-SOCIAL, INCLUSAO-PRODUTIVA, LOYALTY

6. Pagination at bottom: simple "Anterior" / "1 2 3" / "Próxima" in mono uppercase

7. Same footer as home

CONSTRAINTS:
- Vertical list, never grid
- Date is the largest typography element of each card (mono uppercase, 32-40px)
- PALESTRANTE and JURADO roles get lime color text. PAINELISTA, MEDIADOR, MENTOR get ink color.
- Only 3 lime accents per card maximum: role color (if applicable), ArrowUpRight on hover, a tiny lime hairline accent if needed
```

---

## 7. Prompt Stitch novo S3b Evento detalhe (extra, opcional)

Se quiser ter o detalhe também:

```
Generate /eventos/[slug] detail page for the Sicredi Summit event, following AN. design system.

STRUCTURE:

1. Same nav

2. Breadcrumb mono uppercase: "EVENTOS / SUMMIT DE INOVAÇÃO SICREDI CENTRAL CENTRO-NORTE"

3. Hero of the event (single column, max-width 65 characters centered):
- Eyebrow mono uppercase: "SUMMIT · PALESTRANTE" (with lime color on PALESTRANTE)
- H1 Space Grotesk weight 700, 56-72px: "Summit de Inovação Sicredi Central Centro-Norte"
- Subtitle Inter body-l: "Inovação aplicada em cooperativismo financeiro"
- Metadata row in mono uppercase 11px with lucide icons (Calendar, MapPin, Building, Users):
  - DATA / 21-22 MAI 2026
  - LOCAL / CUIABÁ, MT
  - ORGANIZADOR / SICREDI CENTRAL CENTRO-NORTE
  - PÚBLICO / 250 PARTICIPANTES

4. Hairline divider

5. Editorial content (single column max-w-prose):
- H2 "Contexto"
- 2-3 paragraphs about the cooperative sector and the moment
- H2 "O que apresentei"
- 2-3 paragraphs + 1 bulleted list of 3 points covered
- H2 "Conclusões"
- 1 paragraph with the takeaway

6. Hairline divider

7. Material section (right side or below text):
- Eyebrow mono uppercase: "MATERIAL"
- If video: H3 "Gravação" + frame hairline with placeholder video thumbnail + lucide Play icon overlay
- If deck: H3 "Deck" + small card with lucide FileText icon + "Baixar deck" link with Download icon
- If photo: PhotoFrame with photo placeholder
- If external article: link with ArrowUpRight icon

8. Hairline divider

9. CTA:
- H2 "Tem um evento? Vamos conversar."
- Body small: "Posso participar como palestrante, painelista, jurado ou mentor em iniciativas alinhadas com loyalty, fintech ou inovação."
- Button "Convidar para um evento" (primary ink bg lime text on hover, lucide Send icon) linking to /contato

10. Bottom nav between events:
- Left: lucide ArrowLeft + small label "EVENTO ANTERIOR" + name in graphite
- Right: small label "PRÓXIMO EVENTO" + name in graphite + lucide ArrowRight

11. Same footer
```

---

## 8. Atualização da S5 do STITCH-AJUSTES

O bloco S5 PROJETOS do arquivo STITCH-AJUSTES.md fica **obsoleto**. Substituir por:

```
S5 EVENTOS (substitui Projetos):
- Discard the previous Projetos mockup entirely
- Use S3 prompt from EVENTOS-CHANGE.md section 6
- Confirm vertical list (not grid), date as largest element of each card, lime color for PALESTRANTE and JURADO roles only
```

---

## 9. Checklist de validação para /eventos

**Conteúdo**
- [ ] Eventos em ordem cronológica reversa (mais recente em cima)
- [ ] Cada evento tem data, tipo, papel, título, organizador e local
- [ ] Pelo menos 3 eventos reais no seed (Sicredi, Cubo Itaú, Segundo Voo)
- [ ] Admin pode adicionar evento futuro com data prospectiva

**Brand**
- [ ] Data como elemento tipográfico mais forte de cada card (mono uppercase grande)
- [ ] Lime apenas em PALESTRANTE e JURADO (não em PAINELISTA, MEDIADOR, MENTOR)
- [ ] Cards separados por hairline, não por borda fechada
- [ ] Lista vertical, nunca grid

**SEO**
- [ ] JSON-LD Event em cada página de detalhe
- [ ] JSON-LD ItemList em /eventos
- [ ] Title pattern correto
- [ ] Sitemap inclui todos os eventos publicados

**Acessibilidade**
- [ ] Cada card é um link semanticamente correto (`<article>` ou `<a>`)
- [ ] Filtros são radio buttons ou similar com aria-pressed
- [ ] Ordem do tab key linear top-down

---

## 10. Notas para Aurimar

**Eventos pendentes de complemento ou adição via admin:**

- [ ] Mentoria em [acelerador/iniciativa] - se houve
- [ ] Bancas, jurados ou avaliações - se houve
- [ ] Aparições em podcast - se houve
- [ ] Apresentações internas da LATAM Pass que viraram conteúdo público
- [ ] Eventos anteriores em Stone, CERC ou CRDC se houveram

Tudo isso entra como evento novo via admin, sem precisar de deploy.
