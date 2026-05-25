---
name: an-site-context
description: Contexto e tracking do projeto AN. (site pessoal de Aurimar Nogueira em Next.js 14 + Supabase + Vercel). Ative sempre que o usuário trabalhar no site AN., mencionar slices/milestones do roadmap AN., pedir para continuar uma slice, fizer perguntas sobre o schema, design system ou prompts do projeto, ou disser "AN. site", "site pessoal", "aurimar.com.br", "skill hub do site", "admin do AN.", ou similar. Esta skill carrega o estado atual do projeto (sprint, slice ativa, decisões travadas) e indica quais documentos abrir antes de qualquer ação. Permite handoff entre sessões sem perda de contexto.
---

# AN. Site — Context Skill

Skill de continuidade do projeto **AN. Site** (site pessoal de Aurimar Nogueira). Função: garantir que toda nova sessão do Claude (web ou Cowork) parta do mesmo estado, sem perder contexto entre dias e sem retrabalho.

---

## O que este projeto é

Site pessoal de Aurimar Nogueira, Coordenador Sênior de Negócios Financeiros na LATAM Pass.

- **Domínio (a confirmar):** aurimar.com.br
- **Stack:** Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui + Supabase + Resend + Vercel
- **Branding:** identidade visual AN. v1.0 (bone/ink/lime, Space Grotesk + Inter + JetBrains Mono)
- **Tagline:** "Onde estratégia vira sistema."
- **Metodologia:** GSD2 (Milestone > Slice > Task, spec-before-code)
- **Repo:** github.com/mazinhoww-web/an-site

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `PROJECT.md` | PRD: visão, objetivos, escopo, decisões travadas |
| `REQUIREMENTS.md` | Must-haves verificáveis por categoria |
| `ROADMAP.md` | 5 milestones com slices e tasks |
| `DESIGN.md` | Tokens, componentes, layouts |
| `DATABASE.md` | Schema Supabase, RLS, RPCs, seed |
| `CLAUDE.md` | Regras para Claude Code |
| `PROMPTS.md` | Prompts copy/paste por slice |
| `STITCH-PROMPTS.md` | Prompts para Google Stitch |
| `ANALISE-COMPARATIVA.md` | Por que esta stack |
| `README.md` | Overview para devs |
| `STATE.md` | **Estado atual do projeto (sempre ler primeiro)** |
| `DECISIONS.md` | Log de decisões cronológico |

---

## Ao ativar esta skill, o Claude deve

### 1. Ler o estado atual

Abrir `STATE.md` e identificar:
- Milestone ativo
- Slice em andamento
- Última task concluída
- Próxima task
- Bloqueios abertos

### 2. Carregar contexto mínimo

Para qualquer ação, ler **sempre**:
1. `STATE.md` (estado)
2. `PROJECT.md` (visão e constraints)
3. `CLAUDE.md` (regras de código e estilo)

Para ação em slice específica, ler **adicionalmente**:
- `ROADMAP.md` (tasks da slice)
- `REQUIREMENTS.md` (must-haves daquela área)
- `DESIGN.md` se a slice envolve UI
- `DATABASE.md` se a slice envolve dados
- `PROMPTS.md` para achar o prompt já escrito daquela slice

### 3. Respeitar regras de comunicação

- **Estilo:** Aurimar PROF (objetivo, direto, contexto → solução → ação)
- **Zero em-dash** em qualquer output (—)
- **Zero emoticons**
- **Listas só quando necessárias**
- **Bilíngue PT/EN** apenas se solicitado, padrão PT

### 4. Aplicar regras de código (quando codar)

- TypeScript estrito sempre
- Tailwind com tokens AN. apenas (sem `bg-blue-500`, etc)
- Server Components por padrão, "use client" só quando necessário
- React Hook Form + Zod em todos os forms
- Server Actions para mutations
- RLS em todas as tabelas Supabase
- Commit: `feat(M2.3): descrição` (referenciar slice)

### 5. Atualizar STATE.md ao fim da sessão

Sempre que uma task ou slice avançar, atualizar `STATE.md` com:
- Data
- O que foi feito
- O que ficou pendente
- Próxima ação clara

---

## Template do STATE.md

```markdown
# AN. Site — Estado Atual

**Última atualização:** YYYY-MM-DD HH:MM
**Atualizado por:** [sessão Claude / Aurimar]

## Sprint atual
- Milestone: M1 Foundation
- Slice: M1.2 Design tokens
- Task: T3 Configurar fontes via next/font

## Concluído nesta sessão
- [x] Bootstrap Next.js 14
- [x] Tailwind config com tokens AN.

## Próxima ação imediata
Rodar prompt P1.3 do PROMPTS.md no Claude Code.

## Bloqueios
- Nenhum

## Decisões novas
- Nenhuma (ver DECISIONS.md se houver)
```

---

## Template do DECISIONS.md

```markdown
# AN. Site — Log de Decisões

## 2026-05-24 — Stack travada
Next.js 14 + Supabase + Vercel + Resend + Claude Code.
Justificativa em ANALISE-COMPARATIVA.md.

## 2026-05-24 — Email gate em skills
Cookie de 30 dias após primeiro download. Validação por double opt-in.
Justificativa: balance entre captura de leads e fricção mínima.

## [data] — [decisão]
...
```

---

## Fluxo de uma sessão típica

1. **Aurimar abre nova conversa** e menciona "vou trabalhar no AN. site"
2. **Esta skill ativa** automaticamente
3. **Claude lê `STATE.md`** e responde: "Estado atual: M1.2, próxima task T3. Quer rodar P1.3 ou outra coisa?"
4. **Aurimar confirma** ou redireciona
5. **Claude carrega contexto adicional** conforme a tarefa (DESIGN.md, ROADMAP.md, etc)
6. **Trabalho acontece**
7. **Ao final, Claude atualiza `STATE.md`** com o avanço

---

## Anti-padrões desta skill

- Começar a codar sem ler `STATE.md`
- Pular leitura de `REQUIREMENTS.md` da slice
- Sugerir tecnologia fora da stack (ex: "vamos usar Prisma")
- Quebrar regras de brand (cor fora dos tokens, fonte diferente, em-dash)
- Esquecer de atualizar `STATE.md` ao fim
- Inventar slice ou milestone que não existe no `ROADMAP.md`

---

## Donos e contatos

- **Owner:** Aurimar Nogueira
- **LinkedIn:** linkedin.com/in/mazinho
- **Email admin:** definir em `ADMIN_EMAILS` no `.env.local`

---

## Versão da skill

v1.0 — 2026-05-24
Criada na sessão inicial de especificação do projeto.
