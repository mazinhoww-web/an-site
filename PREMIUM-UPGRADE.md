# PREMIUM-UPGRADE.md — v4 Premium Upgrade (complemento de REFINAMENTO-V3.md)

> Upgrade complementar ao REFINAMENTO-V3.md já existente. Onde REFINAMENTO-V3 entrega o spec técnico (schema 005, analytics com Clarity, componentes premium), este arquivo aprofunda:
> - Motion design em **6 camadas** (sistema, hover, entrada, interação avançada, feedback, page transitions)
> - Estratégia de imagens em **8 tipos** catalogados dentro do brand
> - **Copy completo** da home reformulada em PT-BR redigido
> - Catálogo expandido de lime (de 3% para 7% com pontos novos)
> - Detalhes premium adicionais (404/500, skeletons, microcopy, easter eggs)
>
> Lidos juntos, são a fonte de verdade da experiência premium. STITCH-AJUSTES.md v2 consolida ambos no prompt one-shot.

---

## 1. Filosofia: "cara de milhões sem ser pretensioso"

Premium silencioso. Não vem de mais cor, vem de:

- **Precisão tipográfica:** kerning, tracking, leading em cada heading
- **Animação que confirma intenção:** cada hover, scroll, click reage
- **Detalhes que só aparecem ao interagir:** microcopy, tooltips, easter eggs sutis
- **Performance imperceptível:** LCP < 1.5s, zero CLS, transições suaves
- **Conteúdo que respeita o leitor:** sem floreio, sem auto-bajulação
- **Densidade controlada:** mais informação por viewport que sites de marketing, organizada com hierarquia rígida
- **Lime presente, nunca decorativo:** mais pontos de aparecimento, sempre com função

---

## 2. DownloadGate expandido (3 campos)

### 2.1 Mudança

Antes: apenas email.
Agora: **nome + email + WhatsApp**, com checkbox opt-in para newsletter e opt-in separado para receber novidades por WhatsApp.

### 2.2 Layout do modal

```
[Backdrop ink 60% opacity, sem blur]
[Modal centralizado 480px desktop, 100%-48px mobile, paper bg, 8px radius]
  [Botão X close superior direito - hover rotate 90deg]
  [Hero do modal]:
    Lucide Lock icon 32px ink em frame hairline 64x64px
    H2 Space Grotesk weight 600: "Antes de baixar"
    Body Inter: "Pra eu saber quem é você e te avisar quando uma skill nova sair."
  [Form 3 campos stacked, 16px gap]:
    Campo 1: Label mono uppercase "NOME"
             Input text, hairline border, focus ring lime
             Validação: min 3 caracteres
    Campo 2: Label mono uppercase "EMAIL"
             Input email, hairline border, focus ring lime
             Validação: regex email + check de domínio
    Campo 3: Label mono uppercase "WHATSAPP"
             Input tel com flag Brasil 🇧🇷 prefixada (não emoji visual, ícone customizado)
             Placeholder: "(00) 00000-0000"
             Validação: regex BR (5511999999999) + máscara automática
             Suporte a internacional opcional
  [Checkboxes 12px gap]:
    [ ] "Quero receber newsletter quando novas skills saírem" (default checked, lime)
    [ ] "Quero receber novidades por WhatsApp" (default unchecked, lime quando marcado)
  [Botão BAIXAR AGORA full width primário]:
    Mono uppercase, JetBrains Mono weight 500
    Lucide Download icon que pulsa antes do click
    No click: ícone faz fly-out + spinner + checkmark
  [Footer microcopy]:
    Smoke 11px: "Seus dados ficam comigo. Não compartilho com ninguém. LGPD aplicada."
    Link "Política de privacidade" com lime underline
```

### 2.3 Estados

- **Default:** Lock icon, form vazio
- **Validating:** ícone do campo ativo (Mail, User, MessageCircle) substitui Lock com cross-fade
- **Submitting:** Loader2 girando, botão disabled, fields disabled
- **Success:** CheckCircle lime + texto "Pronto. Skill em download e WhatsApp confirmado."
- **Error de validação:** AlertCircle no campo + shake animation + msg em error color
- **Error de servidor:** banner topo do modal com retry button

### 2.4 Backend

- Tabela `downloads` ganha: `name text`, `phone text`, `whatsapp_optin boolean`
- Tabela `subscribers` ganha: `name text`, `phone text`, `whatsapp_optin boolean`
- Após submit: registra em downloads, cria/atualiza subscriber, dispara email de confirmação via Resend
- Se whatsapp_optin = true: registra na fila de WhatsApp (Z-API ou Twilio, já mapeado em Pátio Estúdios)
- Cookie de 30 dias para não pedir novamente
- Server Action `submitDownloadGate` com validação Zod estrita

### 2.5 SQL delta

```sql
alter table public.downloads 
  add column name text,
  add column phone text,
  add column whatsapp_optin boolean default false;

alter table public.subscribers
  add column name text,
  add column phone text,
  add column whatsapp_optin boolean default false;

-- Index para busca por phone (LGPD: nunca expor, só usar internamente)
create index idx_subscribers_phone on public.subscribers (phone) where phone is not null;
```

---

## 3. Lime ampliado (estratégia revisada)

### 3.1 Mudança de regra

Antes: max 3% da viewport, "cirúrgico".
Agora: **max 7% da viewport**, presente em mais pontos com função.

### 3.2 Onde aparecer (catálogo expandido)

**Sempre lime:**
- Ponto do mark "AN."
- Active nav indicator (4px lime square)
- Lime underline em links de destaque (não em todos os links inline, ainda)
- CTA primário no hover
- Lime dots na timeline da Trajetória
- "ATUAL" pill no capítulo corrente
- "PARALELO" pill em capítulos paralelos
- Border do modal de DownloadGate quando focused
- Send icon background no botão de newsletter
- Lime accent square ao lado de PhotoFrame
- PALESTRANTE e JURADO role labels em /eventos

**Novos pontos lime (expansão):**
- **Lime tab indicator no topo de seções importantes** (3px lime square 16x16 antes do eyebrow)
- **Highlight do número** em cada card de KPI no admin (number em ink, label mono em lime quando hover)
- **Border lime no card de Skill em destaque** (top 3 skills mais baixadas)
- **Lime accent em ícones de framework autoral** (Sparkle, Trophy quando aplicável)
- **Lime line vertical 2px** no canto esquerdo de blockquotes ou citações
- **Pulse lime** em pequeno dot ao lado de "ATIVO", "AO VIVO" ou "EM ANDAMENTO"
- **Hover state em todos os cards:** border passa de hairline para lime (não só no ArrowUpRight)
- **Lime accent em focus rings** (já era assim, mas reforçar visualmente)
- **Lime sublinhado em texto-âncora editorial** (1-2 por parágrafo importante, manualmente curado)
- **Lime cursor** customizado em desktop (opcional, atrás de feature flag)
- **Lime trail** no scroll progress indicator (barra fina no topo da página)

### 3.3 Onde NÃO usar lime

- Cor de texto principal (segue ink)
- Background de seção grande
- Borda de cards padrão (sempre hairline)
- Ícones decorativos
- Estados de erro (usa error color, não lime)

### 3.4 Verificação

Use o quebra-galho de auditoria: tire screenshot, abra no Photoshop ou figma, mede área lime real. Se passar de 7%, reduzir.

---

## 4. Motion Design premium (ampliado)

### 4.1 Camadas de animação

**Camada 1 — Sistema (sempre presente, sutil):**
- Scroll progress bar lime fina no topo da página, 2px, cresce de 0 a 100% conforme scroll
- Smooth scroll ativado em todo o site
- Grid hairline background com pulse suave 8s (já existe)

**Camada 2 — Hover (todo elemento interativo reage):**
- Cards: border hairline → border ink, sombra zero permanece, transition 200ms
- Cards com link externo: ArrowUpRight x+4 y-4 + cor passa de ink para lime
- Links em texto editorial: underline lime cresce de 0 a 100% width 200ms
- Botão primário: bg ink → bg ink + lime text appears 200ms
- Botão secundário: border ink → border lime 200ms
- Ícone em qualquer botão: pulse scale 1 → 1.08 200ms
- Mark "AN.": ponto lime pulsa 1x ao hover (não loop)

**Camada 3 — Entrada (carregamento e scroll):**
- Hero da home: h1 com letras stagger 60ms cada
- Subtítulo do hero: fade + y após h1 completar
- CTAs do hero: fade + y após subtítulo
- Hairlines de seção: scaleX 0 → 1 de 800ms ao entrar no viewport
- Cards em grid: stagger 80ms entre cards
- Timeline da Trajetória: hairline vertical cresce + dots aparecem com stagger 120ms
- Números em highlights: counter animation de 0 ao valor final em 1.4s ease-out
- Imagens: blur-up de 20px para 0 enquanto carrega

**Camada 4 — Interação avançada:**
- **Magnetic buttons:** botões primários puxam levemente cursor próximo (raio 80px)
- **3D card tilt:** SkillCard rotaciona até 4deg conforme posição do mouse
- **Glitch lime micro:** chevron icons piscam lime 1x ao primeiro hover da sessão
- **Parallax sutil:** PhotoFrame em /sobre tem parallax 5% no scroll
- **Cursor halo:** desktop opcional, círculo 32px hairline acompanha cursor

**Camada 5 — Feedback (estado e sucesso):**
- Send icon no submit: fly-out (x+40, y-40, opacity 0) em 500ms, depois CheckCircle aparece com draw + scale
- Loader2 em qualquer submit: rotate infinito 1200ms linear
- Toast de sucesso: slide-in da direita 320ms, fade-out após 4s
- Form field success: pequeno Check icon lime aparece no canto direito do input

**Camada 6 — Page transitions:**
- Entre páginas: fade-out 200ms + fade-in 280ms com slight y-translate
- Não usar transitions agressivas (slide horizontal completo, etc)
- Manter nav fixa sem reload visual

### 4.2 Performance hard limits

- Nenhuma animação > 1200ms (loops infinitos isentos)
- Nenhum framerate drop em mid-tier mobile (testar em iPhone SE)
- `prefers-reduced-motion: reduce` desabilita TUDO da camada 2, 4, 5; mantém camada 1 só com fade
- Sem animação em first paint (LCP não pode atrasar)

### 4.3 Implementação

- **Framer Motion** para 90% das animações
- **CSS transitions** puras para hover simples (mais performático)
- **GSAP** opcional só se Framer não der conta de algo específico (não usar em v1)
- **Web Animations API** para counter animations dos números
- **CSS `@property` + `view-timeline`** para scroll progress (suporte moderno)

---

## 5. Estratégia de imagens dentro do brand

### 5.1 Princípio

Brand AN. proíbe foto stock e decoração. Mas pode (e deve) ter imagens com função:

### 5.2 Tipos de imagem permitidos

**Tipo 1 — Foto editorial do Aurimar (Sobre)**
- PB ou alto contraste, sem polish CG
- Aurimar em postura natural, fundo neutro ou ambiente real
- Frame hairline com lime square accent no canto
- Resolução mínima 1200x1200, formato WebP
- Não usar enquanto não houver foto real. Placeholder: PhotoFrame com lucide User icon

**Tipo 2 — Capturas de evento (/eventos detalhe)**
- Foto do Aurimar palestrando ou painel
- Tratamento monocromático automático: filter grayscale + slight bone tint
- Frame hairline, sem border-radius, sem sombra
- Caption mono uppercase abaixo: "FOTO / [evento]"

**Tipo 3 — Vídeo embed (/eventos detalhe)**
- YouTube ou Vimeo embed
- Custom player skin opcional (mais "cara")
- Thumbnail PB com lime Play button overlay
- Aspect ratio 16:9 ou 21:9

**Tipo 4 — Mockup de skill (/skills)**
- Cada skill tem uma "capa" gerada estaticamente
- Fundo bone, ícone Box grande 80px, nome em Space Grotesk, categoria em mono
- Gerados via Next.js Image API ou script de build
- Funciona como OG image e como visual da página

**Tipo 5 — OG images dinâmicas**
- Já no SEO.md, gerados via `@vercel/og`
- Templates por tipo de página
- Sempre bone + ink + lime accent

**Tipo 6 — Capa de notícia**
- Opcional, imagem ilustrativa em PB
- Frame hairline

**Tipo 7 — Background editorial em seções de destaque**
- NÃO é stock photo
- É uma textura sutil em opacidade 5-8%:
  - Grid hairline (já existe)
  - Linhas de gráfico abstratas
  - Padrão de pontos espaçados
- Renderizado em SVG ou Canvas, não imagem raster

**Tipo 8 — Logo de organização (em /eventos)**
- Logo do organizador (Sicredi, LATAM, Cubo Itaú)
- Tratamento PB ou monocromático
- Apenas como mini-thumbnail (24-32px) ao lado do nome do organizador
- Nunca em destaque, sempre auxiliar

### 5.3 Onde NÃO usar imagem

- Decoração de hero (hero é texto + grid sutil, ponto)
- Plano de fundo de seções grandes
- Avatares circulares (nunca circular)
- Ilustrações genéricas de IA
- Stock photo de gente sorrindo

### 5.4 Quando faltar imagem real

Placeholder sempre dentro do brand:
- PhotoFrame com ícone lucide centralizado (User, Image, Video, etc)
- Caption mono uppercase: "EM BREVE" ou "FOTO PENDENTE"
- Nunca usar imagem genérica AI

---

## 6. Home reformulada (novo copy + estrutura)

### 6.1 Estrutura nova

```
[Nav]
[Hero]
[Bloco 1: Quem sou eu (curto, editorial)]
[Bloco 2: Cenário atual (sem revelar confidencial)]
[Bloco 3: Skills (sem dizer "criei" nem "para download")]
[Bloco 4: Trajetória resumida (números)]
[Bloco 5: Eventos (próximos ou recentes)]
[Bloco 6: Newsletter inline]
[Footer]
```

### 6.2 Copy completo (PT-BR)

**Hero:**
```
[Eyebrow mono] LOYALTY × FINTECH × INNOVATION

[H1 display-xl] Onde estratégia vira sistema.

[Subtítulo body-l, max 65ch]
Aurimar Nogueira. Coordenador Sênior de Negócios 
Financeiros na LATAM Pass. Loyalty, fintech 
e inovação aplicada em ecossistemas regulados.

[CTAs]
[Primary] CONHECER → /sobre
[Secondary] FALAR COMIGO → /contato
```

**Bloco 1 — Quem sou eu:**
```
[Eyebrow mono] QUEM

[H2 Space Grotesk] Construo produto em mercados que 
não perdoam improviso.

[Body Inter, max 65ch, 2 parágrafos curtos]
Comecei em operação no agro, passei por adquirência, 
mercados de capitais e hoje trabalho na maior 
companhia aérea da América Latina. O que muda 
entre uma fase e outra é a indústria. O que segue 
igual é o triângulo: produto que entende o usuário, 
parceria que destrava capital, regulação que cabe 
no desenho.

A pegada autoral começou cedo. Frameworks como 
Método Jet Ski, GSD2 e Innovation2Business foram 
construídos para sair da teoria e operar em squad 
real, com OKR mensurável e profit share por 
iniciativa.

[Link com lime underline] Ler trajetória completa → /trajetoria
```

Imagem opcional: foto editorial pequena à direita ou abaixo.

**Bloco 2 — Cenário atual:**
```
[Eyebrow mono] AGORA

[H2 Space Grotesk] Coordenando novas frentes na 
LATAM Pass.

[Body Inter, max 65ch]
Trabalho na squad eLoyalty / New Business, 
combinando produtos financeiros próprios, parcerias 
estratégicas e inovação aplicada. O foco é destravar 
camadas de receita que loyalty pode operar quando 
deixa de ser benefício de marketing e vira ativo 
financeiro de fato.

[Grid de 3 cards horizontais, cada um sem nome 
de produto específico, só categorias]

[Card 1]
[Label mono] PRODUTOS FINANCEIROS
[H3] Estruturação de produtos próprios
[Body-s] Modelagem de unit economics, escolha de 
stack, integração regulatória e desenho de produto 
para escalar dentro de ecossistema loyalty.

[Card 2]
[Label mono] PARCERIAS ESTRATÉGICAS
[H3] Negociação com infraestrutura financeira
[Body-s] Discovery e seleção de vendors, modelos 
de profit share, governança de risco e contratos 
estruturados para parceiros nacionais e internacionais.

[Card 3]
[Label mono] INTELIGÊNCIA COMPETITIVA
[H3] Monitoramento contínuo de mercado
[Body-s] Acompanhamento de programas concorrentes 
com metodologia proprietária, leitura de movimentos 
do setor e geração de insumos para decisão executiva.
```

Nada de nomes confidenciais.

**Bloco 3 — Skills:**
```
[Eyebrow mono] FERRAMENTAS

[H2 Space Grotesk] Métodos transformados em código 
que o Claude executa.

[Body Inter]
Cada skill abaixo é um framework de trabalho, 
empacotado para ser carregado dentro do Claude 
Cowork ou Claude Code. Quando ativada, ela ensina 
o Claude a executar tarefas com o método específico.

[Grid 4 SkillCards: Método Jet Ski, GSD2, 
Innovation2Business, LATAM Deck]
[Link com lime underline] Ver todas as skills → /skills
```

Sem "criei", sem "para download". Mostra e deixa o usuário descobrir clicando.

**Bloco 4 — Trajetória resumida:**
```
[Eyebrow mono] EM NÚMEROS

[H2 Space Grotesk] Uma década de execução.

[Grid 4 highlights horizontais (não 6 como em Trajetória)]
- R$ 70B+ ATIVOS REGISTRADOS
- 60% MARKET SHARE CPR
- 1ª CPR VERDE BRASIL
- R$ 88M NPV CASE TAG

[Link com lime underline] Ver trajetória completa → /trajetoria
```

**Bloco 5 — Eventos:**
```
[Eyebrow mono] ONDE FALEI

[H2 Space Grotesk] Painéis, palestras e mesas 
recentes.

[Lista 2-3 eventos mais recentes, layout horizontal 
similar à página /eventos mas reduzido]

[Link com lime underline] Ver todos os eventos → /eventos
```

**Bloco 6 — Newsletter:**
```
[Seção full-width com ink background, único bloco 
escuro da home]

[Eyebrow mono smoke] NEWSLETTER

[H2 white on ink] Recebe quando algo novo sai.

[Body graphite] No máximo 2 emails por mês. 
Skill nova, fala em evento, leitura recomendada.

[Form inline]
Nome + Email + WhatsApp + INSCREVER (botão lime)
[Microcopy: dados ficam comigo, LGPD aplicada]
```

Newsletter agora também pede WhatsApp (consistência com DownloadGate).

### 6.3 Confidencialidade LATAM

Lista do que **NÃO** mencionar na home:
- Nomes de parceiros específicos (AstroPay, Celcoin, Dock, etc)
- Nomes de produtos em desenvolvimento (LATAM Wallet, Cartão PF, etc)
- Números internos da LATAM
- Roadmap interno
- Vendors em discovery

Como falar: usar categorias amplas ("estruturação de produtos próprios", "parcerias com infraestrutura financeira") sem nomear.

Trajetória pode citar nominalmente porque é capítulo profissional. Home, não.

---

## 7. Admin Analytics robusto

### 7.1 Estrutura nova do admin

```
/admin/                         → Dashboard overview
/admin/analytics/audiencia      → Visitantes, geo, devices, navegadores
/admin/analytics/conteudo       → Top páginas, tempo, bounce, scroll depth
/admin/analytics/conversoes     → Funis, eventos custom, UTM, fontes
/admin/analytics/tempo-real     → Real-time visitors com map ao vivo
/admin/analytics/heatmaps       → Heatmaps por página
/admin/projetos                 → (removido, virou eventos)
/admin/eventos                  → CRUD eventos
/admin/skills                   → CRUD skills
/admin/noticias                 → CRUD notícias
/admin/trajetoria               → CRUD capítulos, highlights, frameworks
/admin/subscribers              → Lista, segmentação, export
/admin/mensagens                → Inbox de contato
/admin/newsletter               → Compose, send, métricas
/admin/configuracoes            → Settings, integrações, perfil
```

### 7.2 Dashboard overview (`/admin`)

**Linha 1 — KPIs principais (6 cards, não 4):**
1. VISITANTES ÚNICOS (últimos 30 dias) com comparação % vs anterior
2. PAGE VIEWS totais
3. SUBSCRIBERS (com taxa de crescimento)
4. DOWNLOADS DE SKILL (total acumulado)
5. MENSAGENS DE CONTATO (com badge "X NOVAS" em lime se houver)
6. TEMPO MÉDIO DE SESSÃO (em mm:ss mono)

Cada card: paper bg, hairline border, 24px padding, sem sombra. Número grande em JetBrains Mono. Label mono uppercase. Mini sparkline 7 dias no canto inferior direito.

**Linha 2 — Gráfico principal:**
- Line chart de visitantes únicos x dias (30 dias)
- Toggle: 7d / 30d / 90d
- Lime line, ink dots, hairline grid
- Hover: tooltip com data + valor mono

**Linha 3 — Dois blocos lado a lado:**

Bloco esquerda (8/12): **Top páginas**
- Tabela ranqueada: posição mono, slug da página, views (mono), tempo médio (mono), bounce rate (mono colorido: verde < 50%, ink > 50%)
- Top 10

Bloco direita (4/12): **Atividade recente**
- Lista das últimas 8 ações: nova mensagem, novo subscriber, novo download, etc
- Cada item: lucide icon + texto + tempo relativo em mono ("HÁ 2 HORAS")

**Linha 4 — Mapa de visitantes:**
- Mapa do Brasil colorido por densidade de visitantes (heatmap leve)
- Toggle Brasil / Mundo
- Sidebar com top 5 estados ou países

**Linha 5 — Próximas publicações:**
- Tabela: notícias e eventos com status (rascunho, agendado, publicado)

### 7.3 `/admin/analytics/audiencia`

**Métricas:**
- Visitantes únicos
- Sessões totais
- Sessões por visitante (retention)
- Novos vs recorrentes

**Visualizações:**
- Mapa-mundi com densidade (Mapbox ou Leaflet leve)
- Tabela top países, top estados (Brasil), top cidades
- Distribuição por device: Desktop / Mobile / Tablet (donut chart)
- Distribuição por OS: Windows, macOS, iOS, Android, Linux
- Distribuição por browser
- Screen resolutions mais comuns
- Idiomas dos visitantes

**Filtros:**
- Range de datas
- País
- Device
- Fonte de tráfego

### 7.4 `/admin/analytics/conteudo`

**Métricas:**
- Top páginas por views
- Top páginas por tempo médio
- Top páginas por bounce rate (inverso, menos bounce = melhor)
- Scroll depth por página (50%, 75%, 100%)
- Páginas de entrada (landing)
- Páginas de saída (exit)
- Profundidade média de scroll por página

**Visualizações:**
- Tabela completa com sort por coluna
- Heatmap de scroll depth: barra horizontal por página mostrando % que chegou ao fim

### 7.5 `/admin/analytics/conversoes`

**Métricas:**
- Conversão de visita → newsletter signup
- Conversão de visita → skill download
- Conversão de visita → contato enviado
- Conversão de visita → page view de Trajetória (engajamento profundo)
- Top fontes que convertem

**Visualizações:**
- Funil visual: Visitantes → Engajados (>30s) → Convertidos (newsletter/download/contato)
- Tabela de UTM source/medium/campaign com conversões por canal
- Lista de eventos custom rastreados pelo Plausible

### 7.6 `/admin/analytics/tempo-real`

**Dados ao vivo (refresh 5s):**
- Visitantes online agora (número grande)
- Páginas mais ativas neste momento
- Mapa-mundi com pontos pulsando lime onde há visitante
- Lista de últimos 20 events (page view, click, download) em tempo real

**Implementação:**
- WebSocket ou Server-Sent Events via Vercel Edge
- Plausible API + custom event stream
- Cache leve em Redis Upstash

### 7.7 `/admin/analytics/heatmaps`

**Por página:**
- Seletor de página
- Heatmap de clicks renderizado em canvas overlay da screenshot da página
- Toggle: clicks / movimentos / scrolls
- Filtro por período

**Implementação:**
- Tracker leve no client lib custom (não usar Hotjar comercial em v1)
- Coordenadas relativas ao viewport, normalizadas
- Render via canvas com gradient lime → ink

### 7.8 Schema novo: `page_analytics`

```sql
create table public.page_analytics (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  visitor_id text,                              -- hash anônimo persistente 30d
  path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  user_agent text,
  device_type text,                             -- 'mobile' | 'tablet' | 'desktop'
  browser text,
  os text,
  screen_width int,
  screen_height int,
  viewport_width int,
  viewport_height int,
  country text,
  state text,
  city text,
  latitude numeric(9,6),
  longitude numeric(9,6),
  ip_anonymized text,                           -- IP truncado (últimos 2 octets zerados)
  language text,
  time_on_page int,                             -- segundos
  scroll_depth int,                             -- % máximo de scroll
  bounce boolean default true,                  -- se houve apenas 1 page view na sessão
  entry_page boolean default false,
  exit_page boolean default false,
  created_at timestamptz default now()
);

create index idx_page_analytics_session on public.page_analytics (session_id);
create index idx_page_analytics_visitor on public.page_analytics (visitor_id);
create index idx_page_analytics_path on public.page_analytics (path);
create index idx_page_analytics_created on public.page_analytics (created_at desc);
create index idx_page_analytics_country on public.page_analytics (country);

-- Particionamento por mês para escala (opcional v1, recomendado v2)

create table public.custom_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  visitor_id text,
  event_name text not null,                     -- 'newsletter_submit', 'skill_download', 'cta_click', etc
  event_props jsonb default '{}',               -- metadados livres do evento
  path text,
  created_at timestamptz default now()
);

create index idx_custom_events_session on public.custom_events (session_id);
create index idx_custom_events_name on public.custom_events (event_name);
create index idx_custom_events_created on public.custom_events (created_at desc);

create table public.click_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  path text not null,
  element_selector text,                        -- CSS selector do elemento clicado
  x_pct numeric(5,2),                           -- % horizontal do viewport
  y_pct numeric(5,2),                           -- % vertical
  viewport_width int,
  viewport_height int,
  created_at timestamptz default now()
);

create index idx_click_events_path on public.click_events (path);
create index idx_click_events_created on public.click_events (created_at desc);

-- RLS: admin all, public insert via Server Action sanitizada
alter table public.page_analytics enable row level security;
alter table public.custom_events enable row level security;
alter table public.click_events enable row level security;

create policy "Admin read all page_analytics" on public.page_analytics
  for select using (is_admin());
create policy "Admin read all custom_events" on public.custom_events
  for select using (is_admin());
create policy "Admin read all click_events" on public.click_events
  for select using (is_admin());

-- Insert via Server Action com Service Role (não anon)
-- Nenhuma policy de insert public, tudo passa por backend
```

### 7.9 Coleta no client

Componente client `<AnalyticsTracker />` no layout root:

```tsx
"use client";
import { useEffect } from "react";
import { trackPageView, trackClick } from "@/lib/analytics";

export function AnalyticsTracker({ path }: { path: string }) {
  useEffect(() => {
    // Track page view
    trackPageView(path);

    // Track scroll depth
    let maxScroll = 0;
    const onScroll = () => {
      const scrolled = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      maxScroll = Math.max(maxScroll, Math.round(scrolled * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Track time on page (envia ao sair)
    const start = Date.now();
    const onUnload = () => {
      const time = Math.round((Date.now() - start) / 1000);
      navigator.sendBeacon("/api/analytics/exit", JSON.stringify({ path, time, scrollDepth: maxScroll }));
    };
    window.addEventListener("beforeunload", onUnload);

    // Track clicks
    const onClick = (e: MouseEvent) => trackClick(e, path);
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeunload", onUnload);
      document.removeEventListener("click", onClick);
    };
  }, [path]);

  return null;
}
```

### 7.10 LGPD e privacidade

- IP sempre anonimizado (truncado a /16 IPv4)
- Visitor ID: hash de IP+UA com salt rotacionado mensalmente, válido 30 dias
- Cookie de visitor opcional, expira 30d
- Banner de cookie? **Não em v1**, pois sem GA e sem cookies de tracking pessoal. Só anonymous analytics, dentro da LGPD.
- Política de privacidade explica a coleta
- Endpoint `/api/privacy/delete-my-data` por email (LGPD direito ao esquecimento)

---

## 8. Outras micro-mudanças premium

### 8.1 Loading skeletons

Em vez de spinner, mostrar skeleton da estrutura da página com hairlines pulsando suavemente. Detalhe que dá "cara cara".

### 8.2 Custom 404 e 500

- 404: lucide MapPin grande, h1 "Página não encontrada", body editorial curto com humor seco, CTAs para home/contato
- 500: lucide AlertCircle grande, h1 "Algo quebrou aqui", body com link para LinkedIn caso urgente

### 8.3 Microcopy elegante

- Em forms: validação inline com texto que ajuda, não que pune
  - "Email parece incompleto, falta o @ ou o domínio"
  - "WhatsApp com DDD por favor, sem +55"
- Em botões: estados que falam
  - "ENVIAR MENSAGEM" → "ENVIANDO..." → "MENSAGEM ENVIADA"
  - "BAIXAR SKILL" → "PREPARANDO..." → "BAIXANDO..."
- Em links externos: aria-label completo
  - "Abrir LinkedIn em nova aba"

### 8.4 Easter eggs sutis

- Konami code abre um overlay com mensagem do Aurimar
- Triple click no mark "AN." mostra easter egg (créditos do site, "feito com cuidado em Cuiabá")
- View source: comentário HTML no `<head>` "construído com método (e com Claude). aurimar.com.br"

### 8.5 Cursor states

- Default: cursor normal
- Em interativos: pointer (padrão)
- Opcional v1.5: cursor halo lime customizado em desktop

### 8.6 Favicon e identidade

- Favicon SVG com mark "AN." com lime
- Apple touch icon
- Manifest PWA-ready (preparar terreno para v2)

### 8.7 Sound design (futuro v2)

- Subtle sounds em interações primárias (CTA click, success). Off by default, toggle no settings.

---

## 9. Pendências para Aurimar

- [ ] Aprovar copy da home (seção 6.2)
- [ ] Aprovar lista de categorias do Bloco 2 (Cenário atual) - confirmar que está dentro do confidencial OK
- [ ] Tirar foto editorial para `/sobre` (ou enviar foto existente boa)
- [ ] Decidir sobre cursor customizado (sim/não em v1)
- [ ] Decidir sobre easter eggs (mantém ou tira)
- [ ] Confirmar se quer Plausible + custom tracker, ou só custom tracker (custom analytics no Supabase já dá o suficiente, Plausible vira opcional)
- [ ] Decidir orçamento para mapa interativo: Mapbox (paid free tier) vs Leaflet+OpenStreetMap (free total)
- [ ] Aprovar pedido de WhatsApp no DownloadGate (alguns leads podem desistir por pedir WhatsApp; é trade-off de qualidade vs quantidade)

---

## 10. Files impacted (quem editar onde)

| Arquivo | Mudança |
|---|---|
| `DESIGN.md` | Atualizar seção lime (max 7% em vez de 3%), expandir seção motion com 6 camadas, adicionar seção 5 sobre imagens |
| `ICONS-MOTION.md` | Adicionar magnetic buttons, 3D tilt, counter animation, page transitions, parallax |
| `DATABASE.md` | Adicionar deltas em downloads/subscribers (name, phone, whatsapp_optin), criar tabela page_analytics, custom_events, click_events |
| `REQUIREMENTS.md` | R8 Skills hub: DownloadGate agora 3 campos. R11 Newsletter: idem. R12 Admin: ampliar com 6 sub-rotas de analytics. R16 SEO: sem mudança. Novo R18 Premium UI/Motion. Novo R19 Admin Analytics |
| `ROADMAP.md` | Slice nova M4.7 Admin Analytics avançado (5 sub-páginas). Slice M5.6 Performance budget + premium polish |
| `PROJECT.md` | Atualizar copy da home (seção 6 deste arquivo) |
| `SEO.md` | Adicionar JSON-LD ProfilePage estendido com `knowsAbout` mais rico. Sem outras mudanças. |
| `PROMPTS.md` | Adicionar P4.7 (Admin Analytics) e P5.6 (Performance budget) |
| `STITCH-PROMPTS.md` | Atualizar S1 Home com novo copy, S5 DownloadGate com 3 campos, S8 Admin com novas seções |
| `PLAYBOOK.md` | Atualizar Fase 7 (M4.7 e M5.6 adicionados) |
| `STATE.md` | Atualizar para v4 |
| `DECISIONS.md` | Adicionar decisão v4 |

Claude Code lê este arquivo e aplica os deltas conforme cada slice. Não precisa editar manualmente todos.
