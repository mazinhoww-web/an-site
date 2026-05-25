# Análise Comparativa de Stack — AN. Site

Documento de decisão. Justifica por que a stack escolhida foi **Next.js 14 + Supabase + Vercel + Claude Code**, e por que outras opções (Manus, Lovable, v0, WordPress, Webflow, Framer) foram descartadas.

---

## Critérios de avaliação

| Critério | Peso | Por quê |
|---|---|---|
| Controle de código | Alto | Site é vitrine profissional e evolui para hub de skills, podcast, prévias. Não pode ficar refém de plataforma. |
| Custo recorrente | Alto | V1 precisa rodar em free tier. Margem para escalar sem replatform. |
| Performance (Lighthouse ≥90) | Alto | Critério de aceite do PRD. Posicionamento "estratégia vira sistema" exige UX impecável. |
| Lock-in | Alto | Exportação dos dados (skills, subscribers, projetos) tem que ser trivial. |
| Integração com workflow GSD2 | Alto | Aurimar trabalha com Milestone > Slice > Task, spec-before-code, Claude Code. |
| Custo de manutenção | Médio | Aurimar é o único mantenedor. Não pode virar trabalho extra. |
| Evolução para PWA / app | Médio | Roadmap inclui app móvel das skills no futuro. |
| Velocidade de v1 | Médio | Importante, mas não pode comprometer os critérios acima. |
| Identidade visual customizada | Alto | Brand book AN. tem regras rígidas (lime cirúrgico, sem sombra, sem gradiente, tipografia exata). Templates genéricos quebram a identidade. |
| Painel admin nativo | Médio | V1 precisa de CRUD próprio com auth. |

---

## Opções avaliadas

### 1. Next.js 14 + Supabase + Vercel + Claude Code ✅ ESCOLHIDA

**Prós:**
- Controle total do código, deploy e dados
- Free tier real (Vercel Hobby + Supabase Free + Resend Free) cobre v1 inteiro
- Lighthouse 95+ alcançável com SSG e RSC corretos
- Stack idêntica ao Cia do Visto, Visto com Lê e outros projetos Aurimar (reuso de conhecimento)
- Supabase RLS resolve segurança do admin sem código adicional
- Claude Code é nativo do workflow Aurimar, prompts já existem em `PROMPTS.md`
- Zero lock-in: Postgres exportável, código no GitHub, deploy migrável
- PWA com next-pwa em uma dependência
- Brand book aplicável 100% via Tailwind tokens
- Server Actions resolvem CRUD admin sem API REST separada

**Contras:**
- Setup inicial mais lento que low-code (compensado por `PROMPTS.md`)
- Aurimar precisa rodar comandos no terminal (já faz em outros projetos)

**Veredito:** atende todos os 10 critérios. Stack vencedora.

---

### 2. Manus ❌ DESCARTADA

**O que é:** plataforma de agentes autônomos que executam tarefas e podem gerar/hospedar sites.

**Prós:**
- Geração rápida de protótipos
- Agente faz tarefas operacionais sem código

**Contras:**
- **Não é uma plataforma de site de produção.** Manus é orientado a execução de tarefas, não a hospedar site institucional com SEO, performance e admin.
- Sem controle do código gerado ou onde fica hospedado de forma estável
- Sem suporte nativo a Postgres com RLS, magic link auth, signed URLs de storage
- Custo por consumo de agente, imprevisível para site sempre-online
- Lock-in alto: tirar de lá significa reescrever
- Identidade visual passa por interpretação do agente, sem garantia de fidelidade ao brand book
- Sem fit com GSD2 (sem spec-before-code, sem milestones, sem versionamento estruturado)

**Veredito:** ferramenta poderosa para outros usos (research, automação operacional), errada para site institucional de produção.

---

### 3. Lovable ❌ DESCARTADA

**O que é:** plataforma AI que gera apps full-stack com Supabase backend.

**Prós:**
- Gera código real (React + Supabase)
- Stack parecida com a escolhida
- Visual editor decente

**Contras:**
- Editor próprio prende Aurimar a fluxo Lovable (sai do Claude Code)
- Iteração via chat na plataforma é mais lenta que prompts diretos no Claude Code com `CLAUDE.md` carregado
- Brand book customizado é trabalhoso de aplicar (Lovable tende a gerar UI genérica primeiro, refatorar depois)
- Pricing por crédito escalona rápido em projeto com múltiplas slices
- Migração para fora gera código que precisa ser reorganizado

**Veredito:** ótimo para protótipo rápido descartável, errado para projeto com 5 milestones e roadmap pós-v1.

---

### 4. v0 (Vercel) ❌ DESCARTADA como plataforma principal

**O que é:** gerador de componentes React/shadcn da Vercel.

**Prós:**
- Output em código real (Next.js + shadcn)
- Integração nativa com Vercel
- Bom para componentes isolados

**Contras:**
- Não é plataforma de site completo, é gerador de componentes
- Não resolve backend, auth, admin, banco

**Veredito:** **usar como ferramenta auxiliar**, não como base. Pode acelerar componentes pontuais (ex: hero, card de projeto) que entram no projeto Next.js principal. Stitch + Claude Code já cobrem o caso.

---

### 5. WordPress ❌ DESCARTADA

**Prós:**
- Admin nativo (wp-admin)
- Ecossistema gigante
- Familiar

**Contras:**
- PHP, MySQL, tema, plugins, atualizações de segurança constantes
- Performance baixa por padrão (precisa cache, CDN, otimização manual para chegar a Lighthouse 90)
- Plugin de newsletter (Mailpoet) custa caro pago, limita free
- Plugin de skills/downloads com email gate é Frankenstein (3 plugins encadeados)
- Brand book customizado exige tema do zero ou child theme pesado
- Sem fit com GSD2 e Claude Code
- Manutenção é trabalho recorrente

**Veredito:** ferramenta errada para a era atual deste projeto.

---

### 6. Webflow ❌ DESCARTADA

**Prós:**
- Editor visual maduro
- Performance boa
- CMS nativo

**Contras:**
- Custo: plano CMS começa em USD 23/mês, plano Business USD 39/mês (necessário para forms decentes)
- Lock-in total. Não há export de código funcional Webflow para Next.js, só HTML estático
- CMS limitado para skills com email gate, download tracking e newsletter automation
- Sem admin de subscribers e envio de campanhas integrado
- Brand book aplicável, mas com limitações em interações customizadas

**Veredito:** ótimo para site institucional de empresa que não quer código, errado para Aurimar (quer código + admin + automação).

---

### 7. Framer ❌ DESCARTADA

**Prós:**
- Design system robusto
- Animações de primeira
- Performance boa

**Contras:**
- Mesmo problema do Webflow: lock-in, sem código portável
- CMS bom para blog, fraco para skills com gate + tracking + newsletter
- Pricing escala com tráfego
- Backend customizado (admin de subscribers, envio de newsletter) inviável

**Veredito:** errado pelos mesmos motivos do Webflow.

---

### 8. Custom Ruby on Rails / Django ❌ DESCARTADA

**Prós:**
- Controle absoluto
- Admin nativo (Rails Admin, Django Admin)

**Contras:**
- Stack fora da zona de domínio de Aurimar (Next.js + Supabase é a stack home)
- Hosting Postgres + Rails server mais caro que Vercel + Supabase
- Sem reuso de código com Cia do Visto, Visto com Lê, ListaCerta
- Sem fit com Claude Code (funciona, mas é menos otimizado)

**Veredito:** boa stack em outros contextos, errada aqui.

---

## Matriz de decisão

| Critério | Next.js+Supabase | Manus | Lovable | WordPress | Webflow | Framer |
|---|---|---|---|---|---|---|
| Controle de código | ✅ | ❌ | 🟡 | 🟡 | ❌ | ❌ |
| Custo v1 free | ✅ | ❌ | ❌ | 🟡 | ❌ | ❌ |
| Lighthouse ≥90 | ✅ | ❓ | 🟡 | ❌ | ✅ | ✅ |
| Lock-in baixo | ✅ | ❌ | 🟡 | 🟡 | ❌ | ❌ |
| Fit GSD2 + Claude Code | ✅ | ❌ | 🟡 | ❌ | ❌ | ❌ |
| Brand book fiel | ✅ | 🟡 | 🟡 | 🟡 | ✅ | ✅ |
| Admin nativo | ✅ | ❌ | ✅ | ✅ | 🟡 | ❌ |
| Newsletter + skills gate | ✅ | ❌ | ✅ | 🟡 | ❌ | ❌ |
| Evolução PWA | ✅ | ❌ | 🟡 | 🟡 | ❌ | ❌ |
| **Score** | **9/9** | 0/9 | 3/9 | 1/9 | 2/9 | 2/9 |

---

## Decisão final

**Next.js 14 + Supabase + Vercel + Resend + Claude Code.**

Stack alinhada com:
- Brand book AN. (controle total da UI)
- GSD2 (spec-before-code, milestones, slices)
- Workflow Aurimar (Claude Code é a IDE primária)
- Reuso de conhecimento (mesma stack do Cia do Visto e Visto com Lê)
- Free tier real (zero custo recorrente em v1)
- Zero lock-in (Postgres + GitHub + Vercel = exportável a qualquer momento)

**v0 fica como auxiliar opcional** para gerar componentes shadcn pontuais quando útil.
**Stitch (Google) fica como ferramenta de mockup** antes de codar, sem entrar no runtime.

---

## Sinais de que a decisão precisará ser revista

- Aurimar não conseguir manter cadência de slices (sinal de que stack é overkill)
- Free tier estourar antes de 12 meses (validar pricing real vs estimativa)
- Slice de admin demorar mais de 2 semanas (revisar se shadcn admin templates aceleram)
- Brand book mudar para algo mais visual/animado (avaliar Framer Motion ou Webflow)

Nenhum desses sinais existe hoje. Decisão travada.
