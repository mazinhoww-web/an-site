# PROMPTS.md — Prompts copy/paste por sprint

Use estes prompts sequencialmente no Claude Code. Cada um eh autocontido (assumindo que `CLAUDE.md` esta no projeto). Cole, deixe rodar, revise, commit.

Ordem: M1 -> M2 -> M3 -> M4 -> M5. NAO pular slices.

---

## Prompts iniciais (setup unico)

### Prompt 0.1 — Bootstrap

```
Estou comecando o projeto AN. Personal Site. Leia CLAUDE.md, PROJECT.md, REQUIREMENTS.md e ROADMAP.md antes de comecar.

Agora execute o Milestone M1, Slice 1.1 (Setup do repo e Next.js) seguindo as tasks T1.1.1 ate T1.1.6 do ROADMAP.md.

Critérios:
- pnpm como gerenciador
- TypeScript estrito (strict + noUncheckedIndexedAccess)
- App Router com src/ directory
- Tailwind ja configurado
- ESLint + Prettier + lint-staged + husky pre-commit
- .gitignore completo
- next.config.js com images.remotePatterns vazio (vamos adicionar Supabase depois)

Ao final, commite com mensagem padrao GSD2 e me mostre o estado do repo.
```

### Prompt 0.2 — Design tokens

```
Execute Slice 1.2 (Design tokens e tipografia) do ROADMAP.md.

Use DESIGN.md como fonte de verdade. Configure:
1. next/font/google para Space Grotesk (500, 700, 800), Inter (400, 500, 600), JetBrains Mono (400, 500)
2. tailwind.config.ts com todos os tokens da secao 2 do DESIGN.md (cores, escalas tipograficas, espacamentos)
3. globals.css com as variaveis CSS (:root) exatas do brand book
4. Pagina /dev/tokens visualizando paleta, escala tipografica e exemplos de Label, LabelMono, Hairline

Variaveis CSS obrigatorias: --bone, --paper, --ink, --graphite, --smoke, --hairline, --lime, --lime-deep.

NAO use cores fora destes tokens. NAO use fontes fora das tres familias definidas.

Commite e me mostre prints da pagina /dev/tokens em desktop e mobile.
```

### Prompt 0.3 — Componentes shell

```
Execute Slice 1.3 (Componentes shell) do ROADMAP.md.

Crie em src/components/brand/:
- Mark.tsx (props: size 'sm' | 'md' | 'lg' | 'xl', renderiza "AN." com lime no ".")
- Label.tsx (variants: default, mono; props: as ('span' | 'div'), uppercase letter-spaced)
- Hairline.tsx (1px hairline, prop dark para ink sections)

Crie em src/components/layout/:
- Nav.tsx (fixed top, blur background, links: Sobre, Projetos, Skills, Noticias, Contato; mark esquerda, version badge direita)
- Footer.tsx (mark grande, tagline "Onde estrategia vira sistema.", descritor "LOYALTY × FINTECH × INNOVATION", links sociais, ano corrente)
- Container.tsx (max-width 1280, padding lateral responsivo)

Aplique em src/app/layout.tsx.

Pronto quando layout renderiza em 375, 768 e 1280 sem CLS.
```

### Prompt 0.4 — Supabase init

```
Execute Slice 1.4 (Supabase init e schema) do ROADMAP.md.

Pre-requisito: voce vai me pedir os 2 projetos Supabase (URL + ANON + SERVICE) que eu vou colar.

Etapas:
1. Crie .env.local copiando de .env.example, deixe campos para eu preencher
2. Crie supabase/migrations/00000000000001_initial_schema.sql com todo o SQL do DATABASE.md secoes 3 e 4
3. Crie supabase/seed.sql com o conteudo da secao 7 do DATABASE.md
4. Crie src/lib/supabase/server.ts (createServerClient), client.ts (createBrowserClient), admin.ts (createServiceRoleClient)
5. Use @supabase/ssr (mais recente, nao auth-helpers)
6. Crie src/types/database.types.ts (placeholder, atualizamos com supabase gen types depois)
7. Crie src/middleware.ts esqueleto para rotas /admin (vamos implementar auth depois)

Me peca para rodar supabase db reset apos voce gerar os arquivos. Apos rodar, voce gera os tipos com supabase gen types.
```

---

## Milestone M2 — Site publico

### Prompt 2.1 — Home

```
Execute Slice 2.1 (Home) do ROADMAP.md.

Implemente src/app/(public)/page.tsx seguindo:
- DESIGN.md secao 4.1 (layout Home)
- DESIGN.md secao 3.3 (componente Hero)
- REQUIREMENTS.md R5.1 ate R5.7

Detalhes:
- Hero ocupa 100vh, mark "AN." 72px no topo esquerdo, meta no canto sup direito
- h1 display-xl com a palavra "sistema" com highlight lime (linear-gradient)
- Tagline graphite max 640px
- Wordmark "AURIMAR NOGUEIRA" + descritor no rodape do hero
- Secao "Em destaque" com query a projects where is_featured=true (server component, sem useEffect)
- Secao "Skills" com query a skills where is_featured=true (max 4)
- Secao ink "Ultimas noticias" com news (limit 3)
- Bloco newsletter signup (componente NewsletterSignup, form sem submit funcional ainda, so UI)
- CTA "Trabalhar comigo" para /contato

Use Container + SectionHead components. SectionHead recebe num="01/05" e title.

Commite.
```

### Prompt 2.2 — Sobre

```
Execute Slice 2.2 (Sobre) do ROADMAP.md.

Conteudo da bio: pegue do userMemories do Aurimar (LATAM Pass como Coordenador Senior eLoyalty/New Business, frameworks Jet Ski/Innovation2Business/GSD2, CERC, Stone, CRDC).

Implemente:
- /sobre page com hero compacto + grid 2 col (PhotoFrame esquerda | bio markdown direita)
- Componente PhotoFrame conforme DESIGN.md secao 3.10 (frame 1:1, border 2px ink, mark canto sup dir, tag inf esq, lime bar 4px na base)
- Use placeholder de foto em /public/photo-placeholder.jpg por enquanto
- Secao "Trajetoria" com timeline (LATAM Pass, CERC, Stone, CRDC) usando Hairline divider
- Secao "Frameworks" com 3 cards (Jet Ski, Innovation2Business, GSD2)
- Secao "Conecte-se" com links externos (LinkedIn /in/mazinho, GitHub /mazinhoww-web, email)

Tudo server component. Texto bio em src/data/about.md (depois migra para DB se quiser editar via admin).

Commite.
```

### Prompt 2.3 — Projetos

```
Execute Slice 2.3 (Projetos lista + detalhe).

Implemente:

/projetos (lista):
- Server component que busca projects where is_published=true, order by published_at desc
- Filtro por tag via searchParams ?tag=fintech (re-query no server)
- Componente ProjectCard (thumbnail 16:9 com next/image, titulo display-m, tags mono, ano mono)
- Pagination minimal (max 12 per page) com cursor ou offset

/projetos/[slug]:
- Server component que busca project pelo slug
- generateMetadata com OG image (use /api/og/projeto/[slug] route — implementaremos OG dynamic na M5)
- Hero compacto: meta mono ano + tags | h1 titulo | summary
- Cover image 16:9 (next/image)
- Body markdown renderizado (use react-markdown + remark-gfm)
- Secao "Projetos relacionados": 3 projetos com tag em comum, excluindo o atual

NotFound em src/app/(public)/projetos/[slug]/not-found.tsx.

Commite.
```

### Prompt 2.4 — Noticias

```
Execute Slice 2.4 (Noticias).

Implemente:
- /noticias lista cronologica reversa, ItemCard com meta mono data + display-m titulo + summary 2-3 linhas + hairline + label categoria + "Ler →"
- /noticias/[slug] detalhe com body markdown, share buttons (LinkedIn, X, copy link)
- Share buttons sao client component pequeno, usam navigator.share quando disponivel, fallback para abrir URLs
- generateMetadata por noticia (title, description, OG)

Use react-markdown + remark-gfm para renderizar body.

Commite.
```

### Prompt 2.5 — Contato

```
Execute Slice 2.5 (Contato).

Implemente:
- /contato com layout grid 2 col: form esquerda | "Outros canais" direita (LinkedIn, email, GitHub)
- Form com React Hook Form + Zod
- Schema em src/lib/validators/contact.ts (name min 2, email valido, subject min 3, message 20-2000)
- Server Action submitContact em src/server-actions/contacts.ts:
  1. Valida com Zod
  2. Rate limit por IP (use @upstash/ratelimit se UPSTASH_REDIS_REST_URL setado; senao log warn e segue)
  3. Insere em tabela contacts (usa supabase server client com service role apenas se necessario)
  4. Dispara email via Resend para CONTACT_TO_EMAIL com template
- Sucesso renderiza confirmacao inline, reset form
- Erro mostra mensagem
- Aviso LGPD inline com link para /privacidade

Crie src/lib/resend/index.ts com helper sendEmail({to, subject, html}).

Commite.
```

---

## Milestone M3 — Skills Hub

### Prompt 3.1 — Skills lista e detalhe

```
Execute Slice 3.1 (Skills lista e detalhe).

Implemente:

/skills:
- Hero compacto "Skills" + tagline pessoal
- Filter chips por categoria (query a skill_categories), busca via searchParams ?cat=go-to-market
- Grid 2 cols desktop / 1 mobile de SkillCard (componente conforme DESIGN.md secao 3.12)
- SkillCard: badge FREE com border lime, titulo display-m, descricao 2 linhas, tags mono, rodape com nome do arquivo + download_count, botao ghost "Baixar skill" leva para /skills/[slug]
- CTA inferior "Nao sabe como instalar? Veja o guia" → /skills/como-usar

/skills/[slug]:
- Hero: meta mono categoria | h1 nome | summary
- Grid 2 col: long_description_md esquerda | sidebar direita com tags, badge, arquivo, downloads count, botao primary "Baixar skill" (abre modal DownloadGate)
- Secao ink "O que esta incluido" (extrair da descricao ou campo dedicado se quiser estender DATABASE)
- CTA "Como usar esta skill" → /skills/como-usar

Modal DownloadGate ainda nao funcional, so UI. Sera implementado no proximo prompt.

Commite.
```

### Prompt 3.2 — Email gate de download

```
Execute Slice 3.2 (Email gate de download).

Implemente:

1. Componente DownloadGate (client) conforme DESIGN.md secao 3.13
2. Server Action requestSkillDownload em src/server-actions/downloads.ts:
   - Input: skillId, email, consentNewsletter (bool), consentLgpd (bool)
   - Valida com Zod
   - Verifica consentLgpd true (obrigatorio)
   - Upsert subscriber por email; se novo, marca source=skill_gate, consent_newsletter conforme input, gera confirmation_token se consent_newsletter=true
   - Cria row em downloads (subscriber_id, skill_id, IP, user_agent)
   - Incrementa skill.download_count via RPC increment_skill_download
   - Gera signed URL do Supabase Storage (bucket skills) valida 10min
   - Se consent_newsletter true e subscriber novo, dispara email de confirmacao via Resend com link contendo confirmation_token
   - Retorna { downloadUrl, requiresConfirmation }
3. Cookie 'an_email_verified' httpOnly secure 30d setado apos primeira submissao
4. No abre da modal, se cookie presente, exibe botao "Baixar agora" que chama Server Action sem perguntar email novamente

Endpoint de confirmacao /api/confirm/[token]/route.ts:
- Chama RPC confirm_subscriber(token)
- Redireciona para /confirmado (pagina de obrigado)

Commite.
```

### Prompt 3.3 — Como Instalar

```
Execute Slice 3.3 (Pagina Como Instalar).

Implemente /skills/como-usar conforme DESIGN.md secao 4.7.

Conteudo dos 5 passos (espelho da SCIENT, adaptado a identidade AN.):

1. Baixe o arquivo .SKILL da galeria
   "Acesse /skills, escolha a skill e clique em Baixar skill. O download gera um arquivo .skill no seu computador, normalmente na pasta Downloads. Cada skill eh autocontida com todas as instrucoes, frameworks e metodologias ja configuradas."

2. Abra o Claude Cowork no seu Mac
   "Skills funcionam no Claude Cowork, o app desktop do Claude para Mac. Se ainda nao tem instalado, baixe em claude.ai/download."
   Bloco REQUISITO com border lime: "Voce precisa do Claude Cowork (Desktop). O site claude.ai nao suporta skills. O app esta disponivel para macOS."

3. Instale a skill no Cowork
   A. Arrastar e soltar: arraste o arquivo .skill direto para a janela do Cowork.
   B. Via menu: clique no icone de extensoes/plugins no canto superior > Instalar skill > selecione o arquivo .skill
   "Apos instalar, a skill aparece na lista disponiveis. Nao precisa reiniciar o app."

4. Ative a skill em uma conversa
   A. Ativacao automatica: descreva a tarefa relacionada a skill, o Claude detecta e aplica.
   B. Ativacao manual: no inicio da conversa, clique no icone de skills e selecione antes de enviar a primeira mensagem.

5. Comece a usar
   "A skill carrega frameworks, metodologias e instrucoes especificas. Voce so precisa descrever o que quer fazer."

Bloco EXEMPLO: "Ao ativar GTM Engineering e perguntar 'Como estruturo o ICP da minha empresa de SaaS B2B?', o Claude usa o framework ICP/ICS completo, Theory of Constraints aplicado ao GTM, e o modelo de capacity planning, entregando uma analise estruturada pronta para executar."

Accordion FAQ:
- As skills funcionam no claude.ai (web)?
  Nao. Apenas no Claude Cowork desktop.
- Posso instalar mais de uma skill ao mesmo tempo?
  Sim. As skills relevantes serao ativadas automaticamente conforme o contexto.
- Preciso reinstalar quando a skill for atualizada?
  Sim, baixe a nova versao e arraste para o Cowork. A versao antiga eh substituida.
- As skills sao compativeis com qualquer tipo de empresa?
  Sao genericas o suficiente para servir qualquer setor; ajustam-se ao contexto da conversa.
- Minha skill baixou mas nao aparece no Cowork. O que fazer?
  Confirme que o arquivo eh .skill (nao .zip). Tente abrir o Cowork e arrastar de novo. Em ultima instancia, reinicie o Cowork.

CTA final: bloco lime claro "Pronto para comecar? Acesse a galeria e baixe suas primeiras skills." → botao ghost "Ver todas as skills →" linkando /skills.

Commite.
```

---

## Milestone M4 — Admin

### Prompt 4.1 — Auth admin

```
Execute Slice 4.1 (Auth e shell admin).

1. /admin/login: pagina centralizada com form de email + botao "Receber magic link"
   - Server Action signIn em src/server-actions/auth.ts
   - Valida que email esta em process.env.ADMIN_EMAILS (split por virgula)
   - Se nao esta, retorna erro generico ("Email nao autorizado") sem revelar a lista
   - Se esta, chama supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: NEXT_PUBLIC_SITE_URL + '/admin' }})
   - Mostra confirmacao "Verifique seu email"

2. middleware.ts:
   - Match /admin/* exceto /admin/login
   - Le sessao do Supabase via cookies
   - Se nao autenticado, redireciona para /admin/login
   - Se autenticado mas email nao em ADMIN_EMAILS, redireciona para / com toast (cookie flash)

3. /admin/layout.tsx:
   - Sidebar 240px esquerda fixed (Dashboard, Projetos, Skills, Noticias, Subscribers, Mensagens, Newsletter)
   - Mark AN. compacto no topo
   - Footer sidebar: email do admin + botao Sair (logout via Server Action signOut)
   - Main padding 40px
   - Item active com border-left 2px lime, color ink

4. /admin/page.tsx (placeholder Dashboard): "Bem-vindo, Aurimar."

Commite.
```

### Prompt 4.2 — Dashboard admin

```
Execute Slice 4.2 (Dashboard).

Implemente /admin/page.tsx:
- Cards de metricas (grid 3 cols):
  1. Subscribers confirmados: count from subscribers where confirmed=true and unsubscribed=false and deleted_at is null
  2. Downloads totais: count from downloads
  3. Mensagens nao-lidas: count from contacts where is_read=false
- Tabela "Ultimas mensagens": 5 mais recentes de contacts (name, email, subject, created_at)
- Tabela "Ultimos downloads": 5 mais recentes de downloads, join com subscribers e skills (email, skill name, created_at)

Server components com revalidate=60s.

Commite.
```

### Prompt 4.3 — CRUD Projetos

```
Execute Slice 4.3 (CRUD Projetos).

Implemente:

/admin/projetos:
- Tabela com colunas: titulo, status (publicado/rascunho), featured, atualizado em, acoes
- Busca por titulo (querystring)
- Botao "Novo projeto" → /admin/projetos/novo

/admin/projetos/novo e /admin/projetos/[id]/editar:
- Form com:
  - title (required)
  - slug (auto-generated do title, editavel com lock toggle)
  - summary (required, textarea max 280 chars)
  - body_md (textarea grande, monospace)
  - tags (input chips, separados por virgula)
  - cover (upload para bucket media, mostra thumbnail apos upload)
  - external_url (opcional)
  - year (number)
  - is_featured (toggle)
  - is_published (toggle)
- Server Action upsertProject em src/server-actions/projects.ts
- Use revalidatePath('/projetos') e revalidatePath('/') apos save
- Delete com modal de confirmacao dupla (digite o slug para confirmar)

Componente reusavel ProjectForm em src/components/admin/ProjectForm.tsx.

Commite.
```

### Prompt 4.4 — CRUD Skills

```
Execute Slice 4.4 (CRUD Skills).

Implemente:

/admin/skills:
- Tabela com: nome, categoria, downloads, status, acoes

/admin/skills/novo e /admin/skills/[id]/editar:
- Form com:
  - name (required)
  - slug (auto, editavel)
  - short_description (max 280)
  - long_description_md (textarea grande)
  - category_id (select com query a skill_categories)
  - tags (chips)
  - file upload (.skill, ate 5MB):
    - Server Action uploadSkillFile recebe FormData
    - Valida extensao e tamanho
    - Faz upload para bucket 'skills' (privado) com path: {skill_id}/{filename}.skill
    - Retorna { file_url, file_name, file_size_bytes }
  - thumbnail upload (bucket 'media' publico)
  - badge (FREE | PRO, default FREE)
  - is_featured (toggle)
  - is_published (toggle)
- Server Action upsertSkill

Apos save, revalidatePath('/skills') e revalidatePath('/').

Commite.
```

### Prompt 4.5 — CRUD Noticias

```
Execute Slice 4.5 (CRUD Noticias).

Implemente:

/admin/noticias:
- Tabela com titulo, categoria, publicado em, acoes

/admin/noticias/novo e /admin/noticias/[id]/editar:
- Form com title, slug auto, summary, body_md, categoria, cover, is_published, published_at
- Editor markdown com preview side-by-side (pode ser textarea + preview react-markdown ao lado)
- Server Action upsertNews
- revalidatePath('/noticias') apos save

Commite.
```

### Prompt 4.6 — Subscribers e mensagens

```
Execute Slice 4.6 (Subscribers e Mensagens).

/admin/subscribers:
- Tabela paginada: email, source, consent_newsletter, confirmed, unsubscribed, created_at, acoes
- Busca por email
- Filtros: confirmed (true/false), unsubscribed (true/false)
- Botao "Exportar CSV" → Server Action exportSubscribersCSV que retorna text/csv com header Content-Disposition
- Botao "Apagar dados" (LGPD): marca deleted_at = now() e zera campos PII (email = 'deleted_' || id, ip_address = null, user_agent = null)

/admin/mensagens:
- Tabela com name, email, subject, created_at, is_read, acoes
- Click expande row mostrando message full
- Botao "Marcar como lido" (toggle)
- Botao "Responder" abre mailto:

Commite.
```

### Prompt 4.7 — Newsletter

```
Execute Slice 4.7 (Newsletter).

/admin/newsletter (lista campanhas):
- Tabela com subject, status, recipient_count, sent_at

/admin/newsletter/nova:
- Form com subject + body_md (textarea grande)
- Preview HTML side-by-side
- Botao "Enviar teste" (envia para process.env.RESEND_FROM_EMAIL ou para o email do admin atual)
- Botao "Disparar" abre modal de confirmacao: "Voce vai enviar para X subscribers. Confirma?"
- Server Action dispatchNewsletter:
  1. Cria row em newsletter_campaigns (status=draft)
  2. Lê subscribers where confirmed=true and unsubscribed=false and deleted_at is null
  3. Cria rows em newsletter_recipients (status=pending) em batch
  4. Atualiza campaign para status=sending
  5. Em batches de 100, dispara via Resend (use Promise.allSettled)
  6. Atualiza cada recipient para sent/failed conforme resposta
  7. Atualiza campaign: status=sent (se nenhuma falha) ou failed (se houve), preenche sent_at, delivered_count, bounced_count
- Use template de email com:
  - Header com Mark AN.
  - Body do markdown renderizado para HTML
  - Footer com unsubscribe link: NEXT_PUBLIC_SITE_URL + '/api/unsubscribe/' + subscriber.unsubscribe_token

/api/unsubscribe/[token]/route.ts:
- GET chama RPC unsubscribe_by_token(token)
- Redireciona para /descadastrado (pagina simples)

Commite.
```

---

## Milestone M5 — Polish & Launch

### Prompt 5.1 — SEO + OG

```
Execute Slice 5.1 (SEO + OG).

1. app/sitemap.ts dinamico: home, sobre, projetos lista + cada projeto, skills lista + cada skill, noticias lista + cada noticia, /skills/como-usar, /contato, /privacidade
2. app/robots.ts: allow all exceto /admin
3. /api/og/projeto/[slug]/route.tsx, /api/og/noticia/[slug]/route.tsx, /api/og/skill/[slug]/route.tsx usando @vercel/og:
   - Background bone
   - Mark AN. canto sup direito
   - Titulo display em Space Grotesk 800 com highlight lime
   - Subtitulo em graphite
   - Descritor + URL no rodape
4. generateMetadata em cada rota detalhe usando essas OG images
5. Structured data Person em /:
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Aurimar Nogueira",
     "jobTitle": "Coordenador Senior de Negocios Financeiros",
     "worksFor": { "@type": "Organization", "name": "LATAM Pass Brasil" },
     "url": "https://aurimar.com.br",
     "sameAs": ["https://linkedin.com/in/mazinho", "https://github.com/mazinhoww-web"]
   }
6. Structured data Article em /noticias/[slug]

Validar Lighthouse SEO >=95 e Twitter Card Validator + LinkedIn Post Inspector apos deploy.

Commite.
```

### Prompt 5.2 — Performance

```
Execute Slice 5.2 (Performance).

1. Rodar pnpm build e @next/bundle-analyzer:
   ANALYZE=true pnpm build
2. Identificar deps >100kb e remover/lazy load
3. Verificar todas <img> trocadas para next/image
4. Confirmar priority apenas no LCP (hero mark) por pagina
5. Adicionar generateStaticParams onde aplicavel para SSG de projetos/skills/noticias
6. Headers de cache no next.config.js para /_next/static/* e imagens
7. Rodar Lighthouse mobile em preview, ajustar ate >=90 em Performance

Documente o resultado em commit message.
```

### Prompt 5.3 — Acessibilidade

```
Execute Slice 5.3 (Acessibilidade).

1. Adicionar @axe-core/cli como devDep
2. Rodar npx axe http://localhost:3000 em cada pagina key
3. Corrigir erros AA encontrados
4. Adicionar skip-link em layout.tsx
5. Confirmar focus ring visivel em todos interativos (outline 2px lime offset 2px)
6. Aria-labels em todos botoes icon-only
7. Testar teclado: tab por toda nav, abrir modal de download, navegar form de contato
8. Adicionar @media (prefers-reduced-motion: reduce) desabilitando transforms

Commite.
```

### Prompt 5.4 — LGPD

```
Execute Slice 5.4 (LGPD).

1. Pagina /privacidade redigida (vou revisar):
   - Quem coleta: Aurimar Nogueira (pessoa fisica)
   - Dados coletados: email, IP, user agent
   - Finalidade: distribuir skills, envio de newsletter, contato comercial
   - Base legal: consentimento + legitimo interesse
   - Direitos do titular: acesso, retificacao, eliminacao
   - Como exercer: contato@aurimar.com.br
   - Retencao: subscribers indefinidamente ate solicitacao de delete; contacts por 5 anos; downloads por 2 anos
   - Compartilhamento: Resend (envio email), Supabase (armazenamento)
   - Atualizacao: data da ultima atualizacao
2. Link visivel em footer e em todos forms
3. Cookie banner minimo (apenas se adicionar analytics que precise opt-in; para v1 Vercel Analytics que eh privacy-friendly nao precisa)
4. Endpoint admin "Exportar dados" gera CSV com todos os registros relacionados a um subscriber (subscribers, downloads, contacts com mesmo email)
5. Endpoint admin "Deletar dados" faz soft delete + anonimizacao

Commite.
```

### Prompt 5.5 — Deploy

```
Execute Slice 5.5 (Deploy).

Walk me through:
1. Configurar dominio no Vercel (apontar DNS A/AAAA ou CNAME conforme registrar)
2. Adicionar todas variaveis de .env.example ao Vercel (production + preview)
3. Configurar Resend:
   - Adicionar dominio aurimar.com.br
   - Verificar DKIM, SPF, DMARC
4. Configurar Supabase prod:
   - Backup diario ativado
   - PITR se possivel
5. Smoke test em producao:
   - Home renderiza
   - Submeter form de contato → recebo email
   - Baixar uma skill → recebo email de confirmacao
   - Confirmar email → vira confirmed=true
   - Login admin → consigo entrar
   - Criar novo projeto via admin → aparece em /projetos
   - Disparar newsletter teste → chega na inbox
   - Unsubscribe → marca unsubscribed=true
6. git tag v1.0.0 e push

Apos checklist completo, anunciar v1 no LinkedIn (texto a definir).

Commite.
```

---

## Prompts utilitarios (avulsos)

### Prompt U.1 — Atualizar tipos do Supabase

```
Rode supabase gen types typescript --linked > src/types/database.types.ts e me mostre o diff.
```

### Prompt U.2 — Adicionar nova skill

```
Quero adicionar a skill {nome}. Categoria: {cat}. Descricao curta: {desc}.

Crie a row no banco via Server Action no admin OU me de o SQL de insert para colar no Supabase. Depois, gere um arquivo skeleton SKILL.md para essa skill que eu posso editar e empacotar como .skill.
```

### Prompt U.3 — Investigar bug

```
Estou vendo {comportamento}. Esperado: {esperado}. Reproduzir: {passos}.

Use GSD debug: 
1. Identifique 3 hipoteses provaveis
2. Para cada, descreva como verificar
3. Verifique a mais provavel primeiro
4. Antes de mudar codigo, me mostre o que vai mudar e por que
```

### Prompt U.4 — Refactor com seguranca

```
Quero refatorar {arquivo/componente} para {motivo}.

Antes de mudar:
1. Liste todos os lugares que usam isso
2. Proponha o novo design
3. Liste os passos do refactor em ordem segura
4. Espere meu OK antes de comecar
```
