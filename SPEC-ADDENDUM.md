# SPEC-ADDENDUM.md — Adendo v2

> Atualizações consolidadas após aplicação das skills `design-intelligence` e `tripled-ui`, adição da página de Trajetória e camada de SEO analítico. Este documento estende `REQUIREMENTS.md`, `ROADMAP.md`, `DATABASE.md`, `PROMPTS.md` e `STITCH-PROMPTS.md`. Ler em conjunto com os originais.

---

## 1. Novos REQUIREMENTS (adicionar a `REQUIREMENTS.md`)

### R15 — Página Trajetória (`/trajetoria`)

Must-haves verificáveis:

- [ ] Página renderiza em `/trajetoria` com layout descrito em `DESIGN.md` seção 6.3
- [ ] Hero com eyebrow mono, h1 "Trajetória" e subtítulo editorial
- [ ] Bloco de 6 highlights de impacto em grid 3x2 (desktop) / 1x6 (mobile)
- [ ] Timeline narrativa com no mínimo 4 capítulos (LATAM Pass, CERC, Stone, CRDC)
- [ ] Cada capítulo tem as 5 seções: Contexto, Mandato, Movimento, Resultado, Aprendizado
- [ ] Hairline vertical anima com scroll, pontos lime crescem um a um (ver `ICONS-MOTION.md` 4.10)
- [ ] Seção Frameworks Autorais com 3 cards (Método Jet Ski, GSD2, Innovation2Business)
- [ ] CTA final para `/contato` e LinkedIn
- [ ] Conteúdo vem das tabelas `career_chapters`, `career_highlights`, `frameworks` (admin editável)
- [ ] Página tem JSON-LD `ProfilePage` conforme `SEO.md` seção 5.3
- [ ] Lighthouse mobile >= 90 nesta página

### R16 — SEO Analítico

Must-haves verificáveis:

- [ ] `sitemap.xml` dinâmico em `/sitemap.xml` cobrindo todas páginas públicas + entries de projetos, skills, notícias
- [ ] `robots.txt` em `/robots.txt` com disallow de `/admin` e `/api`
- [ ] Toda página pública tem `metadata` exportado com `title`, `description`, `openGraph`, `twitter`, `alternates.canonical`
- [ ] OG images dinâmicas geradas via `/api/og?type=...` com `@vercel/og` (1200x630)
- [ ] JSON-LD presente em todas as páginas públicas (mínimo `Person` global no layout root)
- [ ] JSON-LD específico nas páginas: `ProfilePage` em trajetoria, `CreativeWork` em projetos, `SoftwareApplication` em skills, `NewsArticle` em notícias, `BreadcrumbList` em detalhes
- [ ] Plausible Analytics integrado com script via `next/script`
- [ ] Custom events configurados: `Newsletter Submit`, `Skill Download Gate Opened`, `Skill Downloaded`, `Contact Form Submitted`, `External Link Click`
- [ ] Vercel Analytics e Speed Insights ativos
- [ ] Web Vitals reportados ao Plausible via `useReportWebVitals`
- [ ] Search Console verificado e sitemap submetido em produção
- [ ] Validação de JSON-LD em validator.schema.org passa sem erro
- [ ] Lighthouse SEO score >= 95 em todas as páginas públicas
- [ ] Titles únicos por página (verificado por script ou Screaming Frog)
- [ ] Página 404 e 500 customizadas com brand

### R17 — Motion Design (ícones e componentes)

Must-haves verificáveis:

- [ ] Componente base `AnimatedIcon` implementado conforme `ICONS-MOTION.md` seção 3
- [ ] Todo ícone interativo do site respeita o catálogo de `ICONS-MOTION.md` seção 4
- [ ] Mark "AN." com ponto lime que pulsa 1x ao mount
- [ ] Hero da home tem entrada animada (fade + y) com curva `cubic-bezier(0.22, 1, 0.36, 1)`
- [ ] Hairlines de seção crescem com `scaleX` ao entrar no viewport
- [ ] Scroll reveal em seções principais via componente `Reveal` (`DESIGN.md` 4.2)
- [ ] Lime underline anima width 0 → 100% em hover de links
- [ ] DownloadGate modal anima Lock → Mail → CheckCircle conforme catálogo
- [ ] Newsletter Send anima fly-out + CheckCircle no sucesso
- [ ] Timeline de Trajetória tem pontos lime que aparecem com stagger ao scroll
- [ ] `prefers-reduced-motion` testado e fallback funciona (animações viram instantâneo)
- [ ] Nenhuma animação > 1200ms (exceto loops)
- [ ] Nenhuma animação puramente decorativa em produção

---

## 2. Adições ao ROADMAP

### Slice M2.6 — Página Trajetória (nova)

**Milestone:** M2 Site Público

Tasks:
- T1: Criar rota `/trajetoria` em `(public)` com layout base
- T2: Implementar componente Timeline vertical com Framer Motion
- T3: Renderizar highlights, capítulos e frameworks via Supabase
- T4: Implementar JSON-LD ProfilePage
- T5: Validar Lighthouse e CWV

**Definição de pronto:**
- R15 totalmente satisfeito
- Conteúdo de pelo menos 4 capítulos seed (LATAM Pass com texto completo, CERC com texto completo, Stone e CRDC com placeholders editáveis no admin)

---

### Slice M4.5 — Admin Trajetória (nova)

**Milestone:** M4 Admin

Tasks:
- T1: CRUD de `career_chapters` (lista, criar, editar, despublicar)
- T2: CRUD de `career_highlights` (com drag-to-reorder via `order_index`)
- T3: CRUD de `frameworks`
- T4: Preview no admin antes de publicar

---

### Slice M5.1.B — SEO técnico (expansão da M5.1)

**Milestone:** M5 Polish & Launch

Sub-tasks (a serem feitas dentro da slice M5.1 SEO+OG original):

- T1: Implementar `sitemap.ts` dinâmico
- T2: Implementar `robots.ts`
- T3: Criar `/api/og` com `@vercel/og`
- T4: Adicionar `metadata` em todas as pages
- T5: Implementar componente `JsonLd` e adicionar schema apropriado em cada página
- T6: Validar JSON-LD em validator.schema.org
- T7: Verificar Search Console e Bing Webmaster Tools
- T8: Submeter sitemap
- T9: Integrar Plausible com custom events
- T10: Integrar Vercel Analytics e Speed Insights
- T11: Implementar Web Vitals reporting via Plausible
- T12: Verificar Lighthouse SEO >= 95 em todas as páginas

**Definição de pronto:**
- R16 totalmente satisfeito

---

### Slice M1.3.B — Componente AnimatedIcon (expansão da M1.3)

**Milestone:** M1 Foundation

Sub-tasks (dentro da slice M1.3 componentes shell):

- T1: Implementar `<AnimatedIcon>` conforme `ICONS-MOTION.md` seção 3
- T2: Implementar `<MarkDot>` (ponto lime animado do logo)
- T3: Implementar `<Reveal>` (scroll reveal)
- T4: Implementar `<HairlineGrow>`
- T5: Testar `prefers-reduced-motion` em todos

---

## 3. Adições ao DATABASE

Adicionar a `DATABASE.md` migration nova:

```sql
-- 003_career.sql

-- Tabela: capítulos de carreira
create table public.career_chapters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  role text,
  company text not null,
  period_start date,
  period_end date,
  is_current boolean default false,
  order_index int default 0,
  context_md text,
  mandate_md text,
  movement_md text,
  result_md text,
  learning_md text,
  tags text[] default '{}',
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_career_chapters_order on public.career_chapters (order_index desc);
create index idx_career_chapters_published on public.career_chapters (published);

-- Tabela: highlights de impacto
create table public.career_highlights (
  id uuid primary key default gen_random_uuid(),
  metric text not null,
  label text not null,
  description text not null,
  order_index int default 0,
  icon_name text,
  published boolean default true,
  created_at timestamptz default now()
);

create index idx_career_highlights_order on public.career_highlights (order_index);

-- Tabela: frameworks autorais
create table public.frameworks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  purpose text not null,
  phases text[] default '{}',
  applied_in text,
  order_index int default 0,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.career_chapters enable row level security;
alter table public.career_highlights enable row level security;
alter table public.frameworks enable row level security;

-- Policies: leitura pública dos publicados, admin tudo
create policy "Public read published career_chapters" on public.career_chapters
  for select using (published = true);
create policy "Admin all career_chapters" on public.career_chapters
  for all using (is_admin()) with check (is_admin());

create policy "Public read published career_highlights" on public.career_highlights
  for select using (published = true);
create policy "Admin all career_highlights" on public.career_highlights
  for all using (is_admin()) with check (is_admin());

create policy "Public read published frameworks" on public.frameworks
  for select using (published = true);
create policy "Admin all frameworks" on public.frameworks
  for all using (is_admin()) with check (is_admin());

-- Trigger updated_at
create trigger career_chapters_updated_at before update on public.career_chapters
  for each row execute function update_updated_at_column();
create trigger frameworks_updated_at before update on public.frameworks
  for each row execute function update_updated_at_column();
```

### Seed inicial (dados reais validados via histórico LinkedIn)

```sql
-- Highlights
insert into public.career_highlights (metric, label, description, order_index, icon_name) values
  ('R$ 70B+', 'ATIVOS REGISTRADOS', 'Volume sob gestão no CERC CPR Registry no período em que liderou os produtos', 1, 'TrendingUp'),
  ('60%', 'MARKET SHARE CPR', 'Participação do CERC contra a B3 no registro de Cédula de Produto Rural', 2, 'BarChart3'),
  ('R$ 88M', 'NPV CASE TAG', 'Valor presente líquido do business case TAG LATAM Pass com pricing Taggy revisado', 3, 'Trophy'),
  ('1ª', 'CPR VERDE DO BRASIL', 'Primeira CPR Verde registrada no país, conduzida na CERC', 4, 'Award'),
  ('30%', 'CONVERSÃO DE LEADS', 'Crescimento mensurado em ações de produto e parcerias na LATAM Pass', 5, 'TrendingUp'),
  ('3', 'FRAMEWORKS AUTORAIS', 'Método Jet Ski, GSD2 e Innovation2Business, aplicados em squads reais', 6, 'Sparkle');

-- Capítulos (ordem desc = mais recente primeiro). Conteúdo completo em TRAJETORIA.md seção 3
insert into public.career_chapters (slug, title, role, company, period_start, period_end, is_current, order_index, context_md, mandate_md, movement_md, result_md, learning_md, tags) values
  ('latam-pass',
    'LATAM Pass / LATAM Airlines',
    'Coordenador Sênior de Negócios Financeiros',
    'LATAM Pass',
    '2024-08-01',
    null,
    true,
    6,
    'LATAM Pass é o programa de fidelidade do maior grupo aéreo da América Latina. O passageiro brasileiro tem uma relação madura com milhas, mas a infraestrutura de produtos financeiros adjacentes ao programa estava amarrada a um co-branded com instituição única. O setor de loyalty global vem se reposicionando como ativo financeiro, não como benefício de marketing, e a LATAM precisava destravar essa camada no Brasil.',
    'Liderar a frente de novos negócios da squad eLoyalty: parcerias estratégicas, produtos financeiros próprios e inovação aplicada. Em paralelo, coordenar Innovation2Business, transformando inovação em motor de receita com OKRs claros.',
    '- Conduziu a definição do MVP da LATAM Wallet com AstroPay até LOI assinado, profit share 50/50 pós-milhas, green light condicional Opice Blum\n- Liderou a discovery do Cartão PF LATAM Pass com 8 vendors avaliados (SWAP, CSU, Pomelo, Dock, Celcoin, Stark, SUAP, Just), elegendo stack Phase 1 BaaS + FIDC\n- Construiu o business case da TAG LATAM Pass com NPV de R$ 88M\n- Atuou como interlocutor de contexto Brasil no projeto LATAM Pay BCG\n- Lançou Radar Concorrência (inteligência competitiva LATAM Pass vs Smiles vs Azul com metodologia VPP)\n- Apresentou em Embedded Credit no Cubo Itaú, Segundo Voo, Summit Sicredi Central Centro-Norte',
    '- LATAM Wallet em LOI assinado, MVP de 150-200 usuários definido\n- Cartão PF com stack Phase 1 travado, FIDC sem cota subordinada (zero risco inicial)\n- 30% de crescimento em conversão de leads, 25% em engajamento de clientes\n- Innovation2Business reconhecida internamente como motor de novos negócios',
    'Em loyalty, a unidade econômica não cabe em planilha de produto isolado. Spread, interchange, float e IOF se comportam diferente em wallet versus cartão versus white label. Modelagem só funciona quando o desenho de produto e o desenho regulatório andam juntos.',
    '{"loyalty","fintech","partnerships","innovation","regulado"}'),

  ('crdc',
    'CRDC | Central de Registros',
    'Product Owner — Recebíveis Agro',
    'CRDC',
    '2023-10-01',
    '2024-08-31',
    false,
    5,
    'O mercado de registro de recebíveis no Brasil consolidava sua segunda onda de competição. Após a CERC romper o monopólio da B3 anos antes, novas centrais como a CRDC entravam em operação e expandiam o foco para o agro digital. CPR e CDCA passavam por uma onda de digitalização acelerada, com fintechs do agro pressionando por integrações mais rápidas.',
    'Atuar como Product Owner da vertical agro, garantindo que o backlog técnico se traduzisse em entregas de produto alinhadas com a estratégia comercial da casa.',
    '- Gestão de backlog e priorização de roadmap em formato ágil, com Jira, Confluence e Miro\n- Redação de histórias de usuário e critérios de aceite para comunicação fluida entre design, desenvolvimento e produto\n- Definição e monitoramento de OKRs e KPIs do produto agro\n- Interface com áreas regulatórias e jurídicas para aderência regulatória das novas funcionalidades',
    'Roadmap de produto agro entregue com ciclos previsíveis, OKRs documentados e mensurados, redução do tempo de onboarding de novas integrações.',
    'PO em central de registros é função de equilíbrio: do lado do cliente, fintechs do agro pressionando por velocidade; do lado regulatório, BCB exigindo precisão. O trabalho do bom PO é traduzir esse tensionamento em backlog priorizado, sem sacrificar nenhuma das pontas.',
    '{"product-management","agro","regulado","agil"}'),

  ('1win',
    '1WIN | Performance LATAM (paralelo)',
    'Senior Performance and Affiliate Manager LATAM',
    '1WIN',
    '2022-08-01',
    '2024-08-31',
    false,
    4,
    'O setor de iGaming no Brasil e LATAM vivia explosão de demanda e fragmentação de canais. Operadoras internacionais montavam estruturas locais, com forte demanda por gestão de afiliados, performance marketing e parcerias com criadores de conteúdo.',
    'Liderar a operação de afiliados e performance da 1Win nos mercados Brasil e LATAM, com reporte direto à diretoria global de performance.',
    '- Gestão direta de canais de afiliados, redes e influencers em Brasil e LATAM\n- Responsável por FTD, tráfego, novos usuários, ticket médio, ROI e taxa de conversão\n- Definição e alocação mensal de verbas nos canais de mídia de performance\n- Prospecção e desenvolvimento de redes em newsletters, portais de notícias, cupons, redes sociais, influencers, YouTubers\n- Coordenação com pares globais responsáveis por outras regiões\n- Estruturação de campanhas conjuntas e otimização contínua de funis',
    'Operação consolidada de afiliados Brasil/LATAM com canais de aquisição diversificados e indicadores rastreados em tempo real.',
    'Performance marketing em mercados grayzone exige uma camada extra de governança que produto puro não exige: compliance dos canais, transparência com afiliados, distribuição justa de comissões. O CAC só faz sentido quando se entende o LTV real de cada vertical de afiliado, não da média.',
    '{"performance-marketing","affiliate","igaming","LATAM","growth"}'),

  ('cerc',
    'CERC Central de Recebíveis',
    'Officer de Produtos e Clientes + Product Manager de Recebíveis',
    'CERC',
    '2021-05-01',
    '2023-09-30',
    false,
    3,
    'O mercado de registro de recebíveis no Brasil estava se reabrindo após anos de monopólio efetivo da B3. A regulamentação do BCB abriu espaço para entradas autorizadas, e a CERC se posicionou como o desafiante. CPR (Cédula de Produto Rural) era um instrumento em expansão, especialmente com o agro digitalizando.',
    'Liderar, executar e propor estratégias relacionadas aos produtos de cédulas e agro da CERC. Construir o CPR Registry da CERC do zero e tomar share da B3.',
    '- Elaboração de roadmap de desenvolvimento e evolução de produtos\n- Modelagem, implementação, acompanhamento e suporte comercial dos produtos\n- Mapeamento de oportunidades de negócio, tendências de mercado e movimentos de concorrentes\n- Tradução de necessidades dos clientes em requisitos de negócio e produto\n- Fomento de parcerias estratégicas\n- PM responsável pela implantação dos produtos CCB, CPR, CPR Verde, CDCA e Registro Digital de Garantias\n- Análise de métricas com ciclos PDCA para melhoria contínua',
    '- 60% de market share alcançado contra a B3 no produto CPR\n- R$ 70B+ em ativos registrados sob gestão dos produtos\n- Primeira CPR Verde do Brasil registrada na plataforma\n- Plataforma de Registro Digital de Garantias lançada e operacional',
    'Em mercados regulados, "produto" e "compliance" não são departamentos separados. A vantagem competitiva está em interpretar a regulação a tempo, antes do concorrente. E em mercados de infraestrutura, share não vem de marketing: vem de integração técnica com o cliente.',
    '{"fintech","mercado-de-capitais","agro","cpr","regulado","produto"}'),

  ('stone',
    'Stone',
    'Key Account Manager + Especialista em Produtos',
    'Stone',
    '2019-04-01',
    '2021-05-31',
    false,
    2,
    'Stone consolidando posição em adquirência e expandindo para crédito, banking e software para PMEs. O setor de pagamentos no Brasil vivia o pós-CIP e o início real do open banking. Redes e franquias eram um segmento estratégico para crescimento de receita.',
    'Como KAM, liderar o relacionamento com os principais clientes de Redes e Franquias. Como Especialista em Produtos, garantir adoção e engajamento, evitar churn, suportar novos negócios e propor melhorias de receita.',
    '- Gestão de carteira de redes e franquias com foco em engajamento e planos integrados\n- Prospecção de novos clientes no segmento de franquias para ativação na plataforma ABC\n- Interface com tecnologia, comercial, middle e back-office\n- Elaboração de business cases e business plans para aprovação de ações e projetos\n- Apoio em decisões de investimento e avaliação de risco em novos produtos\n- Promoção de parcerias comerciais e institucionais\n- Estruturação de ações Go-To-Market, gestão de P&L e KPIs de vendas\n- Atuação em comitês com outros players do setor',
    'Carteira de redes e franquias com engajamento elevado, contas-chave estabilizadas, novos clientes ativados na plataforma ABC, fluxos internos aprimorados e business cases aprovados para investimentos estratégicos.',
    'Pagamentos é commodity técnico; o diferencial está na borda (crédito embutido, software, atendimento). Toda discussão sobre take rate é, no fundo, sobre o que mais você consegue empacotar com o pagamento. KAM bem-feito não é gestão de relacionamento: é estruturação de unit economics conjunta com o cliente.',
    '{"pagamentos","fintech","key-account","franquias","go-to-market"}'),

  ('inicio',
    'Início internacional e formação',
    '99Taxis, Syngenta, HarkHark (Brisbane) + Formação acadêmica',
    'Múltiplas empresas',
    '2014-01-01',
    '2020-12-31',
    false,
    1,
    'Os anos iniciais aconteceram em paralelo à graduação em Administração na Universidade de Cuiabá. O eixo escolhido cedo foi combinar operação, comercial e marketing num mesmo papel, em vez de virar puro analista financeiro ou puro vendedor.',
    'Construir base operacional sólida em mercados diferentes (mobilidade, agro, vendas internacionais) antes de migrar para produto e parcerias em mercados regulados.',
    '- 99Taxis (2015-2016, Cuiabá): Analista de operações, coordenação de marketing off-line para captação de taxistas e passageiros, gestão de filial\n- Syngenta (2016-2017, Cuiabá): Analista de negócios em multinacional do agro, SAP R/3, controle de pedidos, faturamento, garantias, SEAC e CASA\n- HarkHark (2018, Brisbane): Sales Account Executive em startup australiana, parcerias com 264+ restaurantes, Salesforce, USD 2 milhões+ em receita, liderança de time de 10+ representantes\n- International House Brisbane (2018-2019): imersão em Business English\n- MBA UniC Gestão de Negócios e Vendas (2018-2019)\n- Tera Digital Product Leadership (2020)\n- FGV Gestão de Força de Vendas (2019)\n- Certificações: Power BI, SAP R/3, English Second Language',
    'Base operacional consolidada em três contextos distintos: marketplace brasileiro, multinacional do agro e startup B2B internacional. Graduação em Administração concluída, MBA cursado, formação digital em product complementada.',
    'Início em operação dá um chão que ninguém perde depois. Quem entendeu como funciona uma campanha de marketing offline em Cuiabá, uma planilha SAP de pedidos no agro, e uma negociação por Salesforce em Brisbane, chega no produto financeiro complexo com vocabulário operacional intacto. É essa base que permite, hoje, traduzir spread e interchange para gente que vive em planejamento e gente que vive em backoffice ao mesmo tempo.',
    '{"operacoes","agro","marketplaces","internacional","formacao"}');

-- Frameworks
insert into public.frameworks (slug, name, purpose, phases, applied_in, order_index) values
  ('metodo-jet-ski',
    'Método Jet Ski',
    'Acelerar oportunidades de inovação de oportunidade vaga até protótipo testável em ciclos curtos.',
    '{"Diagnóstico da Oportunidade","Prototipação Ágil","Visão Transformadora"}',
    'Innovation2Business squad da LATAM Pass',
    1),
  ('gsd2',
    'GSD2 (Get Shit Done 2)',
    'Desenvolvimento de produto com spec-before-code, evitando context rot em projetos com IA. Hierarquia Milestone > Slice > Task, com PROJECT.md, REQUIREMENTS.md e ROADMAP.md como artefatos vivos.',
    '{"Milestone","Slice","Task"}',
    'Cia do Visto, Visto com Lê, Pátio Estúdios CRM, ListaCerta, este próprio site',
    2),
  ('innovation2business',
    'Innovation2Business',
    'Transformar squad de inovação em motor de negócios mensuráveis, com OKRs claros e modelo de profit share por iniciativa.',
    '{"OKR por iniciativa","Profit share","Cadência semanal","Demo bimestral"}',
    'Squad eLoyalty / New Business da LATAM Pass',
    3);
```

---

## 4. Novos prompts (adicionar a `PROMPTS.md`)

### P2.6 — Página Trajetória

```
Implemente a slice M2.6 conforme TRAJETORIA.md, DESIGN.md seção 6.3 e ICONS-MOTION.md seção 4.10.

Crie:
1. Rota app/(public)/trajetoria/page.tsx (Server Component, SSG)
2. Componentes:
   - components/trajetoria/Highlights.tsx (grid 3x2 desktop / 1x6 mobile)
   - components/trajetoria/Timeline.tsx (linha vertical com pontos lime que animam no scroll)
   - components/trajetoria/Chapter.tsx (capítulo com 5 seções markdown)
   - components/trajetoria/FrameworksGrid.tsx (3 cards)
3. Funções de fetch em lib/queries/career.ts
4. JSON-LD ProfilePage conforme SEO.md 5.3
5. Metadata exportada conforme SEO.md 6.1
6. revalidate = 60

Critérios de pronto:
- R15 e R17 (motion) satisfeitos
- Lighthouse mobile >= 90
- prefers-reduced-motion respeitado
- Conteúdo vem do Supabase (career_chapters, career_highlights, frameworks)

Importante: zero em-dash, lime cirúrgico, sem gradiente, hairline crescer no scroll.
```

### P4.5 — Admin Trajetória

```
Implemente a slice M4.5: CRUD admin de career_chapters, career_highlights e frameworks.

Padrão admin já estabelecido (drawer lateral, form com RHF+Zod, toast de feedback).
Inclua drag-and-drop para reordenar highlights via order_index (usar @dnd-kit).
Preview de markdown com biblioteca leve (react-markdown + remark-gfm).
```

### P5.1.B — SEO técnico completo

```
Implemente a slice M5.1.B conforme SEO.md.

Tarefas:
1. src/app/sitemap.ts dinâmico (SEO.md 6.3)
2. src/app/robots.ts (SEO.md 6.4)
3. src/app/api/og/route.tsx usando @vercel/og (SEO.md 4.3)
4. src/components/seo/JsonLd.tsx (SEO.md 6.2)
5. Adicionar metadata + JsonLd em todas as páginas conforme tabela
6. Integrar Plausible script (SEO.md 7.2)
7. Componente WebVitals com useReportWebVitals (SEO.md 7.3)
8. Verificar Lighthouse SEO >= 95 em todas as páginas

Critérios de pronto:
- R16 totalmente satisfeito
- JSON-LD valida em validator.schema.org
- Sitemap acessível em /sitemap.xml com todas as URLs
```

### P0.2.B — AnimatedIcon e componentes de motion

```
Implemente os componentes de motion da slice M1.3.B conforme ICONS-MOTION.md e DESIGN.md seção 4.

Crie:
1. src/components/brand/AnimatedIcon.tsx (ICONS-MOTION 3)
2. src/components/brand/MarkDot.tsx (ponto lime animado)
3. src/components/motion/Reveal.tsx (DESIGN.md 4.2)
4. src/components/motion/HairlineGrow.tsx
5. src/components/motion/LimeUnderline.tsx

Testar prefers-reduced-motion em DevTools > Rendering.
Garantir que zero animação rode em ambientes com reduced-motion.
```

---

## 5. Novo prompt Stitch (adicionar a `STITCH-PROMPTS.md`)

### S10 — Página Trajetória (novo)

```
Crie a tela /trajetoria seguindo o style guide AN.

Estrutura (em ordem vertical):

1. Hero da página:
- Eyebrow mono uppercase "HISTÓRICO"
- H1 display-l "Trajetória"
- Subtítulo body-l max-w-prose:
"Quase uma década entre loyalty, fintech e mercados regulados. Cada capítulo abaixo está aqui porque mudou algo, não só porque aconteceu."

2. Hairline divisor

3. Bloco Highlights de Impacto (grid 3x2 desktop, 1x6 mobile):
6 cards, cada um com:
- Número grande em JetBrains Mono (ex: "R$ 70B+")
- Label mono uppercase com tracking 0.04em (ex: "ATIVOS REGISTRADOS")
- Descrição 2 linhas em Inter body-s

Os 6 highlights:
1) "R$ 70B+" / "ATIVOS REGISTRADOS" / Volume sob gestão no CERC CPR Registry
2) "60%" / "MARKET SHARE CPR" / Participação contra B3, partindo do zero
3) "3" / "FRAMEWORKS AUTORAIS" / Jet Ski, GSD2, Innovation2Business
4) "R$ 88M" / "NPV CASE TAG" / Business case TAG LATAM Pass
5) "150-200" / "USUÁRIOS MVP" / Tamanho-alvo MVP LATAM Wallet
6) "1ª" / "CPR VERDE DO BRASIL" / Primeira registrada no país

4. Hairline divisor

5. Seção Timeline (linha vertical hairline com pontos lime):
Mostre 4 capítulos, cada um com:
- Pequeno ponto lime à esquerda
- Linha vertical hairline conectando os pontos
- Ano em mono uppercase
- H2 nome do capítulo (ex: "LATAM Pass Brasil")
- Caption "Função"
- Body com texto editorial de 3-4 parágrafos divididos em sub-headings: Contexto, Mandato, Movimento, Resultado, Aprendizado
- Tags em mono uppercase no fim

Capítulos: LATAM Pass (atual), CERC, Stone, CRDC.

6. Hairline divisor

7. Seção Frameworks Autorais:
3 cards lado a lado em desktop:
- Método Jet Ski (3 fases)
- GSD2 (Milestone > Slice > Task)
- Innovation2Business

Cada card: ícone lucide pequeno (Sparkle, etc) + nome em h2 + propósito body + lista de fases/aplicações

8. CTA final:
- H2 "Quer conversar sobre alguma dessas frentes?"
- 2 botões: "Falar comigo" (primário lime fundo escuro) e "LinkedIn" (secundário borda ink)

Cores e tokens iguais ao style guide AN. Sem gradiente, sem sombra, hairline 1px. Lime aparece apenas em: ponto da timeline, sublinhado de link, ponto do mark, badge. Tipografia: Space Grotesk display, Inter body, JetBrains Mono mono.
```

---

## 6. Resumo das mudanças por arquivo

| Arquivo original | Mudança |
|---|---|
| `DESIGN.md` | Substituído por v2 com referência Awesome Design MD, motion expandido, seção layouts atualizada com `/trajetoria` |
| `REQUIREMENTS.md` | Adicionar R15 (Trajetória), R16 (SEO Analítico), R17 (Motion Design) conforme seção 1 deste adendo |
| `ROADMAP.md` | Adicionar slices M2.6, M4.5, M5.1.B, M1.3.B conforme seção 2 deste adendo |
| `DATABASE.md` | Adicionar migration 003_career.sql + seed conforme seção 3 deste adendo |
| `PROMPTS.md` | Adicionar P2.6, P4.5, P5.1.B, P0.2.B conforme seção 4 deste adendo |
| `STITCH-PROMPTS.md` | Adicionar S10 conforme seção 5 deste adendo |
| **Novos arquivos** | `ICONS-MOTION.md`, `TRAJETORIA.md`, `SEO.md` |

---

## 7. Ordem de leitura para Claude Code

Sequência atualizada (para CLAUDE.md):

1. `STATE.md`
2. `PROJECT.md`
3. `CLAUDE.md`
4. `REQUIREMENTS.md` + `SPEC-ADDENDUM.md` seção 1
5. `ROADMAP.md` + `SPEC-ADDENDUM.md` seção 2
6. `DESIGN.md` (v2)
7. `ICONS-MOTION.md` (sempre que envolver ícones ou animação)
8. `TRAJETORIA.md` (slice M2.6 e M4.5)
9. `SEO.md` (slice M5.1.B e qualquer slice que crie nova rota)
10. `DATABASE.md` + `SPEC-ADDENDUM.md` seção 3
11. `PROMPTS.md` + `SPEC-ADDENDUM.md` seção 4
