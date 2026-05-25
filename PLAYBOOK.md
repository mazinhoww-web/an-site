# PLAYBOOK.md — Como executar o projeto AN. Site

> Sequência de execução do zero até primeiro deploy em produção. Diz exatamente o que fazer primeiro, quais arquivos enviar para cada ferramenta (Stitch, Claude Code, Vercel, GitHub, Supabase, Resend) e em que ordem. Siga linearmente nas fases 0 a 7; depois itere por slice.

---

## Visão geral das fases

```
FASE 0  Pré-código        contas e domínio prontos
FASE 1  GitHub            repo criado
FASE 2  Local             docs commitados
FASE 3  Stitch            mockups (paralelo, não bloqueante)
FASE 4  Provisionar       Supabase + Resend + Plausible
FASE 5  Claude Code       Bootstrap Next.js (Slice M1.1)
FASE 6  Vercel            Conectar e deploy preview
FASE 7  Iteração          M1 → M5 via PROMPTS.md
```

Tempo estimado até primeiro deploy preview: **2-3 horas focadas**. Tempo até v1 completa: **2-3 semanas em ritmo de slice por dia**.

---

## FASE 0 — Pré-código (você, sem código)

Antes de tocar qualquer terminal. 30 minutos.

**Checklist:**

- [ ] Conta GitHub ativa (org `mazinhoww-web` já existe)
- [ ] Conta Vercel (free Hobby tier) conectada ao GitHub
- [ ] Conta Supabase (free tier) com email de admin definido
- [ ] Conta Resend (free tier, 100 emails/dia) com domínio aurimar.com.br pendente de verificação
- [ ] Conta Plausible Analytics (opcional v1, 30 dias trial)
- [ ] Domínio aurimar.com.br registrado (ou outro confirmado)
- [ ] Cloudflare ou registrar.br com DNS gerenciável
- [ ] Node.js 20+ instalado localmente (`node --version`)
- [ ] pnpm 9+ instalado (`pnpm --version`)
- [ ] Claude Code instalado (`claude --version`)
- [ ] Git configurado com user.name e user.email globais

**Decisão prévia (responda você mesmo):**
1. Domínio final: aurimar.com.br ou outro?
2. Email admin: o seu pessoal ou um @aurimar.com.br novo?

Não avance enquanto não tiver tudo acima.

---

## FASE 1 — GitHub (5 min)

1. Vá em github.com/mazinhoww-web (ou seu perfil)
2. Clique em "New repository"
3. Nome: `an-site`
4. Visibilidade: **Privado**
5. **Não** adicionar README, .gitignore ou license (vai vir do local)
6. Create repository
7. Copie a URL: `git@github.com:mazinhoww-web/an-site.git`

---

## FASE 2 — Local com docs commitadas (10 min)

No terminal:

```bash
# Criar pasta
mkdir an-site && cd an-site

# Inicializar git
git init
git branch -M main
git remote add origin git@github.com:mazinhoww-web/an-site.git
```

Agora copie **todos os arquivos** do output desta sessão para a raiz do repo:

```
an-site/
├── PROJECT.md
├── REQUIREMENTS.md
├── ROADMAP.md
├── DESIGN.md
├── ICONS-MOTION.md
├── DATABASE.md
├── TRAJETORIA.md
├── SEO.md
├── CLAUDE.md
├── PROMPTS.md
├── STITCH-PROMPTS.md
├── SPEC-ADDENDUM.md
├── ANALISE-COMPARATIVA.md
├── PLAYBOOK.md           ← este arquivo
├── README.md
├── STATE.md
├── DECISIONS.md
├── .env.example
└── skills/
    └── context-skill/
        └── SKILL.md
```

Adicionar `.gitignore` mínimo (Claude Code vai expandir no bootstrap):

```bash
cat > .gitignore << 'EOF'
.env
.env.local
node_modules
.next
.vercel
.DS_Store
EOF
```

Commit e push:

```bash
git add .
git commit -m "docs: project specification v2.1 (base)"
git push -u origin main
```

Verifique no GitHub que tudo está lá. **Esta é a fundação documental.**

---

## FASE 3 — Stitch (paralelo, opcional bloqueante)

Pode rodar em paralelo às próximas fases. Não bloqueia código.

### O que enviar ao Stitch

**Você não envia arquivos .md ao Stitch.** Você envia:

| Item | Onde está | O que fazer com ele |
|---|---|---|
| Bloco `DESIGN-SYSTEM-FOR-STITCH` (texto) | `STITCH-PROMPTS.md`, seção logo após "Setup do Stitch" | Copiar todo o bloco e colar na aba "Style guide" do Stitch |
| Brand book PNG | Você gera: abre `brand-book.html` no navegador, faz print da página inteira em PNG | Anexar como "Reference image" no projeto Stitch |
| SCIENT Skill Gallery PDF | Você já tem o PDF original | Anexar como reference só nas telas S4 (Skills hub) e S6 (Como Instalar) |
| Foto editorial (opcional) | Se tiver | Anexar como reference só em S2 (Sobre) |
| Prompts S1, S2, S3, ..., S10 | `STITCH-PROMPTS.md`, seções S1 a S10 | Colar o prompt da tela atual no campo principal de geração |

### Ordem recomendada de geração

Seguir a tabela em `STITCH-PROMPTS.md`. Resumo:

1. **S1 Home** (gera primeiro, é a tela de verdade do brand)
2. **S10 Trajetória** (segunda, valida a narrativa visual mais complexa)
3. **S2 Sobre**, **S4 Skills hub**, **S5 Skill detalhe + DownloadGate**
4. **S3 Projetos**, **S6 Como Instalar**, **S7 Contato**
5. **S8 Admin shell**, **S9 Admin form** (baixa prioridade, podem ser pulados e desenhados direto no código)

### Validação de cada mockup

Antes de "aprovar" e usar como referência para o Claude Code, rode o **checklist de validação por tela** que está no fim de `STITCH-PROMPTS.md`.

Se Stitch desviar em 3 iterações, use o **fallback HTML no Claude chat** descrito no fim do `STITCH-PROMPTS.md`.

### Output da Fase 3

- Imagens PNG dos 10 mockups exportados do Stitch
- Salvar em `docs/mockups/s1-home.png`, `s2-sobre.png`, etc no repo
- Commit: `git add docs/mockups && git commit -m "docs: stitch mockups v1"`

---

## FASE 4 — Provisionar serviços (30 min)

### 4.1 Supabase

1. Acesse supabase.com, clique "New project"
2. Org: a sua. Nome: `an-site`. Senha do DB: gerar forte e guardar
3. Região: South America (São Paulo)
4. Plano: Free
5. Após criar (leva 2 min), pegue em Settings > API:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role secret → `SUPABASE_SERVICE_ROLE_KEY`
6. Em Settings > Database, pegue Connection string (URI) → `DATABASE_URL`

**Não rode migrations ainda.** Claude Code vai fazer isso na Fase 5.

### 4.2 Resend

1. Acesse resend.com, criar conta
2. Domains > Add domain: `aurimar.com.br`
3. Resend mostra 3 DNS records (TXT MX SPF DKIM). Copie todos
4. No painel do registrar (Cloudflare ou registrar.br), adicione os 3 records
5. Volte ao Resend e clique "Verify" (pode levar 5-30 min para propagar)
6. API Keys > Create API key, nome `an-site-prod` → `RESEND_API_KEY`

### 4.3 Plausible (opcional v1)

1. Acesse plausible.io
2. Add site: `aurimar.com.br`
3. Trial de 30 dias automático; depois 9 USD/mês ou usar self-hosted
4. Guarde a chave do site (não precisa de API key, só do data-domain)

### 4.4 Cloudflare ou DNS

Configure os records:

- `A` apex (`aurimar.com.br`) → IP Vercel (a definir na Fase 6)
- `CNAME` www → `cname.vercel-dns.com`
- Records MX, SPF, DKIM do Resend

Se usar Cloudflare, **desligue proxy (nuvem laranja)** para os records da Vercel; deixe DNS only.

### 4.5 Preparar variáveis

Não crie o `.env.local` ainda. Anote num lugar seguro:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URL=postgresql://...
RESEND_API_KEY=re_...
RESEND_FROM="Aurimar Nogueira <hello@aurimar.com.br>"
RESEND_TO=espindolanogueira@yahoo.com.br
NEXT_PUBLIC_SITE_URL=https://aurimar.com.br
NEXT_PUBLIC_SITE_NAME="Aurimar Nogueira"
ADMIN_EMAILS=espindolanogueira@yahoo.com.br
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=aurimar.com.br
```

---

## FASE 5 — Claude Code: Bootstrap (1h)

Esta é a fase de virar specs em código. Tudo via terminal local.

### O que enviar ao Claude Code

**Claude Code lê os arquivos do filesystem.** Você não "anexa" arquivos manualmente. Você inicia uma sessão no diretório do repo e instrui o Claude a carregar os contextos certos.

### Ordem de leitura obrigatória (no início de cada sessão)

Quando abrir o Claude Code pela primeira vez no projeto, faça **a Skill `an-site-context` ativar automaticamente** (o description dela já está calibrada). Caso não ative, mande o prompt manual:

```
Antes de qualquer coisa, leia nesta ordem:
1. STATE.md
2. PROJECT.md
3. CLAUDE.md
4. REQUIREMENTS.md
5. ROADMAP.md
6. DESIGN.md
7. ICONS-MOTION.md
8. DATABASE.md
9. SPEC-ADDENDUM.md

Depois confirme em 3 linhas o que você entendeu sobre o projeto e qual a próxima slice. Não escreva código ainda.
```

### Sequência de leitura por contexto de slice

Por slice trabalhada, Claude Code deve carregar adicionalmente:

| Slice atual | Leitura adicional necessária |
|---|---|
| M1.1 Bootstrap | (nada extra além do core) |
| M1.2 Design tokens | DESIGN.md seções 2, 3 |
| M1.3 Componentes shell | DESIGN.md seção 5 + ICONS-MOTION.md inteiro |
| M1.4 Supabase init | DATABASE.md + SPEC-ADDENDUM seção 3 |
| M2.1 Home | DESIGN.md 6.1 + SEO.md (metadata pattern) |
| M2.6 Trajetória | TRAJETORIA.md + DESIGN.md 6.3 + SEO.md 5.3 |
| M3.* Skills | (anexar SCIENT PDFs como referência se útil) |
| M4.* Admin | DATABASE.md (todas as tabelas) |
| M5.1.B SEO | SEO.md inteiro |

### Bootstrap (Slice M1.1)

No terminal, no diretório `an-site/`:

```bash
claude
```

Quando abrir a sessão, cole o prompt de PROMPTS.md identificado como **P0.1 Bootstrap**. Se não souber qual é, mande:

```
Abra PROMPTS.md, encontre o prompt P0.1 (Bootstrap) e execute-o exatamente como está escrito.
```

Claude Code vai:
- Criar `package.json` e dependências
- Inicializar Next.js 14 + TypeScript + Tailwind
- Configurar tokens AN. no `tailwind.config.ts`
- Configurar fontes via `next/font`
- Criar estrutura de pastas
- Configurar ESLint + Prettier
- Adicionar scripts

Após o bootstrap:

```bash
cp .env.example .env.local
# Edite .env.local com os valores reais (Fase 4.5)
pnpm install
pnpm dev
# Confira em http://localhost:3000 que carrega uma página em branco com a fonte certa
```

Commit e push:

```bash
git add .
git commit -m "feat(M1.1): bootstrap Next.js 14 + AN. tokens"
git push
```

### Continuar com Slices M1.2 → M1.4

Mesmo padrão: identifique a slice, peça ao Claude Code para rodar o prompt correspondente em PROMPTS.md. Commit por slice.

---

## FASE 6 — Vercel: conectar e deploy preview (15 min)

1. Acesse vercel.com/new
2. Import Git Repository: selecione `mazinhoww-web/an-site`
3. Framework Preset: Next.js (auto-detect)
4. Root Directory: `./`
5. Environment Variables: cole TODAS as variáveis da Fase 4.5
6. Deploy

Após primeiro deploy:

7. Project Settings > Domains: adicionar `aurimar.com.br` e `www.aurimar.com.br`
8. Vercel mostra os DNS records que precisa configurar. Volte na Fase 4.4 e ajuste se necessário
9. Aguarde propagação DNS (até 30 min)

**Preview URL** disponível em `an-site-{hash}.vercel.app` imediatamente após deploy.

Verifique que o preview carrega. Como ainda só temos bootstrap, vai ser uma página em branco com fonte correta.

---

## FASE 7 — Iteração por slice (semanas)

Daqui em diante, ritmo de **1 slice por dia útil** é confortável. Rotina:

### Por slice

1. Abra Claude Code: `claude`
2. Confirme com o Claude qual slice é a próxima (`STATE.md` aponta)
3. Cole o prompt correspondente de PROMPTS.md
4. Acompanhe a execução, valide localmente
5. Rode `pnpm typecheck && pnpm lint && pnpm build` antes de commitar
6. Commit com convenção: `feat(M2.3): adicionar página /projetos/[slug]`
7. Push
8. Vercel faz deploy preview automático
9. Valide no preview
10. Atualize `STATE.md` com o avanço
11. Merge no main quando pronto

### Ordem das slices

Conforme `ROADMAP.md` + `SPEC-ADDENDUM.md` seção 2:

```
M1 Foundation
  M1.1 Bootstrap            (feito na Fase 5)
  M1.2 Design tokens
  M1.3 Componentes shell
    M1.3.B AnimatedIcon + Reveal + HairlineGrow
  M1.4 Supabase init

M2 Site Público
  M2.1 Home
  M2.2 Sobre
  M2.3 Projetos lista + detalhe
  M2.4 Notícias
  M2.5 Contato
  M2.6 Trajetória (nova v2)

M3 Skills Hub
  M3.1 Lista + detalhe
  M3.2 Email gate
  M3.3 Como Instalar

M4 Admin
  M4.1 Auth + shell
  M4.2 Dashboard
  M4.3 CRUD Projetos/Skills/Notícias
  M4.4 Subscribers + Mensagens
  M4.5 Trajetória (nova v2)
  M4.6 Newsletter

M5 Polish & Launch
  M5.1 SEO + OG
    M5.1.B SEO técnico completo (nova v2)
  M5.2 Performance
  M5.3 A11y
  M5.4 LGPD
  M5.5 Deploy final
```

---

## Resumo: qual arquivo vai para onde

| Ferramenta | Arquivos enviados / consumidos | Forma |
|---|---|---|
| **GitHub** | Todos os .md + skills/context-skill/SKILL.md + .gitignore + .env.example | git push |
| **Stitch** | DESIGN-SYSTEM-FOR-STITCH (texto, copy/paste), brand-book.html (PNG), prompts S1-S10 (copy/paste), SCIENT PDFs (anexar em telas específicas) | manual no Stitch UI |
| **Claude Code** | TODOS os .md (lê do filesystem). Ordem inicial: STATE → PROJECT → CLAUDE → REQUIREMENTS → ROADMAP → DESIGN → ICONS-MOTION → DATABASE → SPEC-ADDENDUM. Por slice carrega adicionais conforme tabela na Fase 5 | `claude` no terminal do repo |
| **Supabase** | Migrations SQL (Claude Code gera em supabase/migrations/). Você roda `pnpm supabase db push` | comandos CLI |
| **Resend** | Templates de email (Claude Code gera em src/lib/resend/templates/). Configuração via API | API |
| **Vercel** | Repo inteiro via integração Git. Env vars via dashboard | push automático |
| **Plausible** | Apenas snippet de script (Claude Code injeta no layout) | nada manual |

---

## O que fazer PRIMEIRO

Resposta direta:

1. **GitHub primeiro.** É grátis, leva 5 min, vira a fonte de verdade do projeto desde o começo
2. **Depois local + push da documentação.** Tem todos os specs no GitHub antes de uma linha de código
3. **Stitch em paralelo** quando der tempo (não bloqueia)
4. **Supabase + Resend + Plausible em sequência** (Fase 4, 30 min)
5. **Claude Code com Bootstrap (Fase 5)** depois de ter as env vars prontas
6. **Vercel por último** (Fase 6), conectando ao repo que já existe

**Não comece pela Vercel.** Vercel sem repo é inútil. Não comece pelo Claude Code sem doc commitada. Não comece pelo Stitch antes de ter STITCH-PROMPTS.md disponível.

---

## Marcos de validação

| Marco | Critério |
|---|---|
| Fim da Fase 2 | Todos os MDs visíveis no GitHub no branch main |
| Fim da Fase 4 | `.env.local` preenchido e domínio com DNS apontando |
| Fim da Fase 5 | `pnpm dev` mostra página em branco com fonte Space Grotesk no localhost:3000 |
| Fim da Fase 6 | Preview URL Vercel acessível, domínio aurimar.com.br resolve |
| Fim da Slice M2.1 | Home renderiza corretamente em preview com todas as seções |
| Fim da Slice M2.6 | Trajetória renderiza com 6 capítulos vindos do Supabase |
| Fim da M5 | Lighthouse mobile >= 90 em todas as páginas públicas |

---

## Sinais de que algo está errado

- Stitch gera UI com gradiente, sombra, fonte errada → revisar style guide
- Claude Code começa a inventar tecnologia (ex: Prisma) → recarregue CLAUDE.md
- Vercel build falha → cheque env vars
- Supabase rejeita migration → cheque ordem (RLS depois de criar tabelas)
- Domínio não resolve → DNS não propagou ainda (até 24h, normalmente 30 min)
- Email do Resend não chega → domínio não verificado, ou DKIM faltando

---

## Quando pedir socorro ao Claude

Quando travar em qualquer fase, inicie nova conversa no Claude (web ou Code) e diga:

```
Estou na Fase X do PLAYBOOK.md do projeto AN. Site.
Travei em: [descreva]
Erro/output: [cole]
O que sugere?
```

Claude com a skill `an-site-context` ativa vai carregar STATE.md e te orientar dali.
