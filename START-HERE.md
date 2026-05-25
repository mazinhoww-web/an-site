# START-HERE.md — Guia executivo final

> Tudo o que você precisa fazer, na ordem exata, para sair do zero até preview ao vivo. Stack 100% Vercel. Tempo estimado total: 3 horas focadas. Cada passo numerado. Comandos copy/paste prontos.

---

## Antes de tudo: pré-requisitos (15 min)

### Contas a criar (todas free)

- [ ] **GitHub** (você já tem `mazinhoww-web`)
- [ ] **Vercel** (vercel.com, login com GitHub)
- [ ] **Resend** (resend.com, login com email)
- [ ] **Domínio** aurimar.com.br no registrar (registro.br ou Cloudflare como DNS)

**Não precisa mais de:** Supabase, Plausible, Microsoft Clarity, Upstash standalone. Tudo agora vem dentro da Vercel.

### Ferramentas locais (no seu Mac)

```bash
# Verificar versões
node --version          # precisa >= 20
pnpm --version          # precisa >= 9
git --version           # qualquer versão recente
claude --version        # Claude Code CLI

# Se faltar algo:
brew install node@20 pnpm git
npm install -g @anthropic-ai/claude-code
```

### Configurar git (se ainda não)

```bash
git config --global user.name "Aurimar Nogueira"
git config --global user.email "espindolanogueira@yahoo.com.br"
```

---

## Passo 1 — Baixar os arquivos da especificação (5 min)

Você precisa baixar **24 arquivos** que estão prontos. Crie uma pasta no seu Mac e baixe todos lá.

### 1.1 Criar pasta local

```bash
mkdir -p ~/Projects/an-site
cd ~/Projects/an-site
```

### 1.2 Lista completa de arquivos a baixar

Da pasta `/mnt/user-data/outputs/an-website/` (acima nesta conversa):

**Documentos raiz (vão direto em `~/Projects/an-site/`):**

| # | Arquivo | Função |
|---|---|---|
| 1 | `PROJECT.md` | PRD do projeto |
| 2 | `REQUIREMENTS.md` | Must-haves verificáveis |
| 3 | `ROADMAP.md` | Milestones e slices |
| 4 | `DESIGN.md` | Sistema de design |
| 5 | `ICONS-MOTION.md` | Catálogo de ícones animados |
| 6 | `DATABASE.md` | Schema do banco (será migrado para Drizzle) |
| 7 | `TRAJETORIA.md` | Conteúdo da página /trajetoria |
| 8 | `SEO.md` | Estratégia SEO + analytics |
| 9 | `CLAUDE.md` | Regras para Claude Code |
| 10 | `PROMPTS.md` | Prompts copy/paste por slice |
| 11 | `STITCH-PROMPTS.md` | Prompts originais Stitch |
| 12 | `STITCH-AJUSTES.md` | Prompt one-shot de correção |
| 13 | `SPEC-ADDENDUM.md` | Adendo de specs (R15-R17, slices novas) |
| 14 | `EVENTOS-CHANGE.md` | Pivot de /projetos para /eventos |
| 15 | `REFINAMENTO-V3.md` | Captação ampliada + analytics |
| 16 | `PREMIUM-UPGRADE.md` | Motion, imagens, copy da home |
| 17 | `STACK-V5.md` | Migração para stack 100% Vercel |
| 18 | `ANALISE-COMPARATIVA.md` | Justificativa da stack |
| 19 | `PLAYBOOK.md` | Sequência geral de execução |
| 20 | `README.md` | Overview para devs |
| 21 | `STATE.md` | Estado atual do projeto |
| 22 | `DECISIONS.md` | Log de decisões |
| 23 | `START-HERE.md` | Este arquivo |

**Arquivos especiais:**

| # | Arquivo | Local |
|---|---|---|
| 24 | `.env.example` | direto em `~/Projects/an-site/` (arquivo oculto) |

**Skill de contexto** (pasta separada):

```
~/Projects/an-site/skills/context-skill/SKILL.md
```

### 1.3 Como baixar

Clique nos cartões de arquivo que apareceram nas mensagens anteriores. Cada um abre um download. Salve todos em `~/Projects/an-site/`.

Para o `SKILL.md`:

```bash
mkdir -p ~/Projects/an-site/skills/context-skill
# Mover o SKILL.md baixado para essa pasta
```

### 1.4 Verificar

```bash
cd ~/Projects/an-site
ls *.md | wc -l        # deve mostrar 22 (todos exceto .env.example e SKILL.md)
ls .env.example         # deve existir
ls skills/context-skill/SKILL.md  # deve existir
```

Se todos os 24 estão lá, prossiga.

---

## Passo 2 — Criar `.gitignore` e fazer primeiro commit local (5 min)

### 2.1 Criar .gitignore

```bash
cd ~/Projects/an-site
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnpm-store

# Next.js
.next
out

# Production
build
dist

# Env
.env
.env.local
.env*.local

# Vercel
.vercel

# IDE
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Drizzle
drizzle/meta

# Mockups locais grandes (opcional, descomente se não quiser commitar)
# docs/mockups/*.png
EOF
```

### 2.2 Inicializar git e primeiro commit

```bash
cd ~/Projects/an-site
git init
git branch -M main
git add .
git commit -m "docs: project specification v5 (stack 100% vercel)"
```

---

## Passo 3 — Criar repositório no GitHub (3 min)

### 3.1 No GitHub

1. Vá em https://github.com/new
2. Owner: **`mazinhoww-web`** (ou seu user)
3. Repository name: **`an-site`**
4. Description: `Site pessoal Aurimar Nogueira — Loyalty × Fintech × Innovation`
5. Visibilidade: **Private**
6. **NÃO marque** "Add README", "Add .gitignore", "Add license" (já temos local)
7. Clique **Create repository**

### 3.2 Conectar local com GitHub

GitHub mostra um trecho de comandos. Use estes (substituindo a URL pela sua):

```bash
cd ~/Projects/an-site
git remote add origin git@github.com:mazinhoww-web/an-site.git
git push -u origin main
```

Se der erro de SSH, use HTTPS:

```bash
git remote set-url origin https://github.com/mazinhoww-web/an-site.git
git push -u origin main
```

Verifique no GitHub que os 23 arquivos `.md` + `.gitignore` + `.env.example` + `skills/context-skill/SKILL.md` estão lá.

---

## Passo 4 — Baixar e organizar mockups do Stitch (10 min)

### 4.1 Antes: rodar a correção do Stitch

Antes de baixar, refaça os mockups com o prompt corrigido:

1. Abra o projeto AN. no **Stitch** (https://stitch.withgoogle.com)
2. Cole o conteúdo da seção **"PROMPT ÚNICO"** do arquivo `STITCH-AJUSTES.md`
3. Aguarde a regeneração de todas as 10 telas
4. Verifique tela por tela:
   - Home Desktop (S1)
   - Home Mobile (S2) — esta era a mais problemática
   - Sobre (S3)
   - Trajetória (S4)
   - Eventos (S5)
   - Skills Hub (S6)
   - Skill Detalhe (S7)
   - DownloadGate Modal (S8)
   - Contato (S9)
   - Admin Dashboard (S10)

### 4.2 Baixar do Stitch

No Stitch, cada tela tem opções de export:

1. Clique no botão **Export** ou **Download** no canto da tela
2. Stitch oferece duas opções:
   - **Screenshot (PNG)** — imagem da tela renderizada
   - **HTML+CSS code** — código gerado da tela

**Baixe ambos para cada tela.** Stitch normalmente compacta tudo em um ZIP.

### 4.3 Onde colocar no repo

```bash
cd ~/Projects/an-site
mkdir -p docs/mockups
# Descompactar o ZIP do Stitch e mover para docs/mockups/
```

Estrutura desejada:

```
docs/mockups/
├── s1-home-desktop.png
├── s1-home-desktop.html
├── s2-home-mobile.png
├── s2-home-mobile.html
├── s3-sobre.png
├── s3-sobre.html
├── s4-trajetoria.png
├── s4-trajetoria.html
├── s5-eventos.png
├── s5-eventos.html
├── s6-skills-hub.png
├── s6-skills-hub.html
├── s7-skill-detalhe.png
├── s7-skill-detalhe.html
├── s8-download-gate.png
├── s8-download-gate.html
├── s9-contato.png
├── s9-contato.html
├── s10-admin-dashboard.png
└── s10-admin-dashboard.html
```

Renomeie conforme essa convenção. Vai facilitar para o Claude Code referenciar depois.

### 4.4 Commit dos mockups

```bash
cd ~/Projects/an-site
git add docs/mockups
git commit -m "docs: stitch mockups v2 (após correções)"
git push
```

### 4.5 Se alguma tela continuar fora do brand

Para Home Mobile e Trajetória especificamente, se Stitch não acertar mesmo após 2 tentativas, peça aqui no chat:

```
Gere o HTML completo de [Home Mobile / Trajetória / etc] seguindo
DESIGN.md + STITCH-AJUSTES.md + PREMIUM-UPGRADE.md.
Single file HTML + CSS inline, pronto pra preview.
```

Eu gero direto, 100% fiel ao brand. Salve como `docs/mockups/s2-home-mobile.html` por exemplo.

### 4.6 Você vai precisar dos mockups dentro do Claude Code?

**Não obrigatoriamente.** As specs em `.md` já dizem tudo o que o Claude Code precisa. Os mockups são:
- Referência visual para você comparar
- Opcional anexar no Claude Code quando pedir uma tela específica ("implemente essa tela [imagem anexada]")

Manter os mockups commitados no repo é boa prática para histórico e para se outro dev entrar no projeto.

---

## Passo 5 — Provisionar serviços Vercel (30 min)

### 5.1 Importar repo na Vercel

1. Acesse https://vercel.com/new
2. Clique **Import Git Repository**
3. Selecione `mazinhoww-web/an-site`
4. Framework Preset: **Next.js** (auto-detect)
5. Root Directory: `./`
6. **NÃO** clique Deploy ainda (vai falhar porque não tem código). Clique **Cancel** ou volte
7. O projeto está criado mesmo sem deploy

### 5.2 Criar Vercel Postgres

1. Vá no dashboard do projeto recém-criado
2. Aba **Storage** > **Create Database** > **Postgres**
3. Nome: `an-site-db`
4. Região: **São Paulo (gru1)** ou mais próxima
5. Plano: **Hobby** (free)
6. Clique **Create**
7. Vercel oferece "Connect to project" → conecte automaticamente

Após criar, **as env vars do Postgres são adicionadas automaticamente** ao projeto (todas as `POSTGRES_*`).

### 5.3 Criar Vercel KV

1. Storage > **Create Database** > **KV**
2. Nome: `an-site-kv`
3. Região: mesma do Postgres
4. Hobby
5. Connect to project

Adiciona automaticamente as env vars `KV_*`.

### 5.4 Criar Vercel Blob

1. Storage > **Create Database** > **Blob**
2. Nome: `an-site-blob`
3. Connect to project

Adiciona `BLOB_READ_WRITE_TOKEN`.

### 5.5 Criar Edge Config (opcional v1)

1. Storage > **Create Database** > **Edge Config**
2. Nome: `an-site-flags`
3. Connect to project

Adiciona `EDGE_CONFIG`.

### 5.6 Configurar Resend (única exceção externa)

1. Acesse https://resend.com e crie conta
2. **Domains** > **Add Domain** > digite `aurimar.com.br`
3. Resend mostra registros DNS (3 records: TXT, MX, DKIM)
4. **Copie esses 3 records**

### 5.7 Configurar DNS do domínio

No painel do **registro.br** (ou Cloudflare se estiver lá):

1. Adicione os 3 records do Resend (TXT, MX, DKIM)
2. Adicione apontamento para Vercel:
   - `A` apex (`aurimar.com.br`) → `76.76.21.21` (IP Vercel)
   - `CNAME` `www` → `cname.vercel-dns.com`

Salve e aguarde propagação (5-30 min).

### 5.8 Voltar ao Resend

1. Após DNS propagar, volte ao Resend e clique **Verify**
2. Vá em **API Keys** > **Create API Key**
3. Nome: `an-site-prod`
4. Permission: **Full access**
5. **Copie a key** (começa com `re_`), guarde

### 5.9 Adicionar env vars manuais na Vercel

No dashboard Vercel do projeto:

1. **Settings** > **Environment Variables**
2. Adicionar uma a uma:

```
AUTH_SECRET=<gerar com: openssl rand -base64 32>
AUTH_URL=https://aurimar.com.br
ADMIN_EMAILS=espindolanogueira@yahoo.com.br

RESEND_API_KEY=<a key que você copiou>
RESEND_FROM=Aurimar Nogueira <hello@aurimar.com.br>
RESEND_REPLY_TO=espindolanogueira@yahoo.com.br

NEXT_PUBLIC_SITE_URL=https://aurimar.com.br
NEXT_PUBLIC_SITE_NAME=Aurimar Nogueira
```

Para gerar o `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Copie o output e cole no Vercel.

### 5.10 Configurar domínio na Vercel

1. **Settings** > **Domains**
2. Add domain: `aurimar.com.br`
3. Vercel verifica DNS (pode levar minutos)
4. Add domain: `www.aurimar.com.br` com redirect para apex

### 5.11 Habilitar Analytics e Speed Insights

1. Aba **Analytics** > **Enable** (Web Analytics)
2. Aba **Speed Insights** > **Enable**

Ambos free no plano Hobby.

### 5.12 Puxar env vars para `.env.local`

No terminal local:

```bash
cd ~/Projects/an-site
npx vercel link            # vincula a pasta ao projeto Vercel
npx vercel env pull .env.local   # baixa todas as env vars para local
```

`.env.local` é criado automaticamente com tudo.

---

## Passo 6 — Claude Code: Bootstrap (1h)

Agora vem a parte do código. Tudo via Claude Code no terminal.

### 6.1 O que você manda para o Claude Code

**Resposta direta: nada.** Claude Code lê os arquivos do sistema de arquivos diretamente. Você só precisa estar no diretório certo e ter os arquivos lá.

Os arquivos que o Claude Code vai ler na primeira sessão (na ordem):

1. **STATE.md** (estado atual) — leitura primeira
2. **PROJECT.md** (visão geral)
3. **CLAUDE.md** (regras de código e estilo)
4. **STACK-V5.md** (stack atual com Vercel)
5. **REQUIREMENTS.md** (must-haves)
6. **ROADMAP.md** (slices)
7. **DESIGN.md** (tokens, componentes, layouts)
8. **ICONS-MOTION.md** (motion design)
9. **DATABASE.md** + **STACK-V5.md** seção 4 (schema Drizzle)
10. **SPEC-ADDENDUM.md** (deltas)
11. **REFINAMENTO-V3.md** (captação + analytics)
12. **PREMIUM-UPGRADE.md** (motion 6 camadas + copy home)
13. **EVENTOS-CHANGE.md** (eventos no lugar de projetos)
14. **SEO.md** (estratégia SEO)
15. **PROMPTS.md** (prompts copy/paste por slice)

Não precisa anexar nada à mão. Está tudo no diretório.

### 6.2 Iniciar Claude Code

```bash
cd ~/Projects/an-site
claude
```

### 6.3 Primeiro prompt (copy/paste)

Cole exatamente isto na primeira interação do Claude Code:

```
Você está iniciando o projeto AN. Site (site pessoal de Aurimar Nogueira).

Antes de qualquer ação, leia nesta ordem exata:
1. STATE.md
2. PROJECT.md
3. CLAUDE.md
4. STACK-V5.md (atenção: stack mudou para 100% Vercel, NÃO usar Supabase)
5. REQUIREMENTS.md
6. ROADMAP.md
7. DESIGN.md
8. ICONS-MOTION.md

Depois confirme em 3-5 linhas o que entendeu sobre:
- Stack (deve ser Vercel Postgres + Vercel KV + Vercel Blob + Auth.js + Resend, NUNCA Supabase)
- Qual é a próxima slice (M1.1 Bootstrap)
- Quais são as regras de brand e código

Não escreva código ainda. Apenas confirme entendimento.
```

Claude Code vai ler, processar, e confirmar. Quando confirmar corretamente, prossiga para 6.4.

Se confirmar coisa errada (ex: mencionar Supabase, ou esquecer brand), responda: "leia STACK-V5.md de novo, atenção: stack mudou".

### 6.4 Bootstrap (M1.1)

Depois da confirmação, cole:

```
Execute a slice M1.1 (Bootstrap) seguindo PROMPTS.md.

Adaptações importantes vs PROMPTS.md original (que ainda menciona Supabase):
- Em vez de @supabase/supabase-js, instale @vercel/postgres, drizzle-orm e drizzle-kit
- Em vez de @supabase/auth-helpers-nextjs, instale next-auth@beta e @auth/drizzle-adapter
- Configure Drizzle conforme STACK-V5.md seção 4
- Crie src/db/schema.ts conforme STACK-V5.md seção 4.2
- Configure Auth.js conforme STACK-V5.md seção 3.3
- Adicione @vercel/analytics e @vercel/speed-insights no layout root

Estrutura final esperada após bootstrap:
- Next.js 14 App Router + TypeScript estrito
- Tailwind configurado com tokens AN.
- Fontes Space Grotesk, Inter, JetBrains Mono via next/font
- src/db/ com schema Drizzle
- src/lib/auth.ts com Auth.js
- ESLint + Prettier
- scripts no package.json: dev, build, start, lint, typecheck, db:generate, db:migrate, db:studio

Após criar tudo, rode pnpm install e pnpm typecheck.
Depois faça commit com mensagem "feat(M1.1): bootstrap Next.js 14 + Drizzle + Auth.js + Vercel stack".
```

Claude Code vai executar. Pode demorar 5-15 minutos.

### 6.5 Após bootstrap

Verifique localmente:

```bash
cd ~/Projects/an-site
pnpm dev
# Abra http://localhost:3000 — deve mostrar página em branco com fonte Space Grotesk
```

Se carregar OK, faça push:

```bash
git push
```

Vercel detecta o push e faz **deploy automático**. Em 2-3 minutos seu preview está no ar:

`https://an-site-{hash}.vercel.app`

Acesse o preview e confirme que a página carrega.

### 6.6 Rodar primeira migration

No terminal local:

```bash
pnpm drizzle-kit generate    # gera SQL das migrations
pnpm drizzle-kit migrate     # aplica no Vercel Postgres
```

Se der erro de conexão, garanta que `.env.local` tem `POSTGRES_URL` (deve ter, vindo do `vercel env pull`).

### 6.7 Continuar com próximas slices

A partir daqui, é fluxo de **slice por dia** seguindo o ROADMAP:

```
Slice M1.2 Design tokens → prompt P1.2 de PROMPTS.md
Slice M1.3 Componentes shell → prompt P1.3 + ICONS-MOTION.md
Slice M2.1 Home → prompt P2.1 + DESIGN.md + PREMIUM-UPGRADE.md (copy)
Slice M2.6 Trajetória → prompt P2.6 + TRAJETORIA.md
Slice M2.5 Contato → prompt P2.5
Slice M3.* Skills → prompts P3.*
Slice M4.* Admin → prompts P4.*
Slice M5.* Polish → prompts P5.*
```

Para cada slice:
1. Abra Claude Code: `claude`
2. Cole o prompt da slice de PROMPTS.md
3. Valide localmente
4. `git commit && git push`
5. Vercel auto-deploy
6. Valide no preview
7. Atualize STATE.md (Claude Code faz isso)

---

## Passo 7 — Deploy de produção (5 min, ao fim de cada milestone)

Vercel já está fazendo deploys de preview automaticamente a cada push em `main`. Para promover um preview a produção:

1. No dashboard Vercel, aba **Deployments**
2. Clique no deploy do último commit
3. Clique **Promote to Production**

Ou crie um branch `production` e faça PRs de `main` para lá quando quiser controlar mais finamente. Em v1, não precisa: cada push em main vira preview, e você promove quando quiser.

---

## Resumo visual: o que faz primeiro?

```
1. Baixar 24 arquivos para ~/Projects/an-site/
2. git init + commit local
3. Criar repo GitHub vazio
4. git push
5. Rodar correção no Stitch (STITCH-AJUSTES.md)
6. Baixar mockups Stitch para docs/mockups/
7. Importar repo na Vercel (sem deploy ainda)
8. Criar Vercel Postgres, KV, Blob
9. Criar conta Resend, configurar DNS, pegar API key
10. Adicionar env vars manuais na Vercel
11. vercel env pull .env.local
12. cd ~/Projects/an-site && claude
13. Colar primeiro prompt (seção 6.3)
14. Confirmar entendimento
15. Colar prompt M1.1 Bootstrap (seção 6.4)
16. Aguardar Claude Code executar
17. pnpm install && pnpm dev — validar localhost
18. git push — Vercel faz auto-deploy
19. Validar preview no Vercel
20. drizzle-kit generate + migrate
21. Próxima slice
```

---

## FAQ rápido

**P: Preciso baixar os mockups do Stitch para o Claude Code?**
R: Não obrigatório. Specs em .md já cobrem tudo. Mockups são referência visual sua. Pode anexar à conversa do Claude Code quando útil ("implemente essa tela [imagem]").

**P: Como o Claude Code lê os arquivos?**
R: Do sistema de arquivos local. Você abre `claude` no diretório, ele tem acesso a tudo. Não precisa "upload".

**P: E se faltar uma env var?**
R: Adicione no painel Vercel e rode `vercel env pull .env.local` de novo.

**P: Posso pular o Stitch?**
R: Sim. Mockups ajudam mas não são obrigatórios. As specs .md são suficientes para o Claude Code.

**P: O que vai em produção primeiro?**
R: A página em branco com fonte Space Grotesk (M1.1 Bootstrap). Depois evolui slice por slice.

**P: Quando o site fica completo?**
R: Depende do ritmo. Em ritmo de 1 slice por dia útil, ~3 semanas. Em modo intensivo (3 slices/dia), ~7 dias.

**P: Tem custo recorrente?**
R: Zero em v1. Tudo no Hobby/free tier. A partir de tráfego médio (~10K visitas/mês), Vercel Pro $20/mês.

---

## Quando travar

Volte aqui no chat e me diga:

```
Estou no Passo X do START-HERE.md.
Travei em: [descreva]
Erro: [cole]
```

Eu retomo do exato ponto com a context-skill já carregada via STATE.md.
