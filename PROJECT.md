# PROJECT.md — AN. Personal Site

**Owner:** Aurimar Nogueira
**Versão:** 1.0
**Data:** 2026-05-24
**Tagline:** Onde estratégia vira sistema.

---

## 1. Visão

Site pessoal e hub de conteúdo que:

1. Apresenta Aurimar Nogueira (Loyalty × Fintech × Innovation) com identidade do brand book AN. v1.0.
2. Centraliza projetos públicos e ativos compartilháveis (skills do Claude, frameworks, decks).
3. Captura leads via email obrigatório para download de skills, alimentando uma newsletter futura.
4. Permite gestão sem código de conteúdo (projetos, notícias, skills, subscribers) por um painel admin simples.

Não é um blog tradicional, nem um portfólio passivo. É uma **plataforma de distribuição** de IP pessoal com loop de relacionamento (email gate → newsletter).

---

## 2. Objetivos Mensuráveis

| ID | Objetivo | Métrica | Meta v1 |
|---|---|---|---|
| O1 | Capturar assinantes qualificados | Subscribers únicos | 100 em 90 dias |
| O2 | Distribuir skills | Downloads | 300 em 90 dias |
| O3 | Gerar leads de negócio | Mensagens via contato | 10 em 90 dias |
| O4 | Operação sem código | % conteúdo gerenciado via admin | 100% |
| O5 | Performance | Lighthouse Performance | ≥90 |

---

## 3. Público

| Persona | Cenário | O que busca |
|---|---|---|
| **Recrutador exec / VC** | Pesquisa Aurimar antes de reunião | Sobre, projetos, contato |
| **Operador GTM / Fintech** | Viu LinkedIn ou painel, quer aprofundar | Skills, frameworks, artigos |
| **Mentee / Estudante** | Buscou Método Jet ou GSD2 | Skills baixáveis + Como Usar |
| **Imprensa / Evento** | Material para divulgar palestra | Bio, foto frame, descritor |

---

## 4. Escopo v1 (in)

### Site público
- Home com hero, descritor, prova social
- Sobre (bio longa + timeline de carreira)
- Projetos (lista + detalhe, com tags e link externo opcional)
- Skills hub (lista filtrável + página detalhe + email gate de download)
- Como Instalar (página estática educativa, modelo SCIENT)
- Notícias / Atualizações (lista cronológica curta)
- Contato (form → DB + email para Aurimar)
- Newsletter signup standalone (rodapé)

### Admin
- Auth via magic link Supabase (allow-list de email)
- CRUD projetos
- CRUD skills (upload de `.skill` para Supabase Storage)
- CRUD notícias
- Visualizar subscribers + exportar CSV
- Visualizar mensagens de contato
- Disparar newsletter (Resend, broadcast simples)

### Infra
- Vercel (hosting)
- Supabase (Postgres + Auth + Storage)
- Resend (transactional + broadcast)
- Domínio: `aurimar.com.br` (a confirmar)

## 4.1 Escopo v1 (out)

- Comentários públicos
- Likes / reações
- Comércio (cobrança de skills)
- Multi-idioma (PT only no v1; EN opcional v1.1)
- App mobile
- RSS feed (v1.1)
- Comunidade / fórum

---

## 5. Constraints

| Tipo | Constraint |
|---|---|
| **Brand** | Brand book AN. v1.0 obrigatório. Sem em-dash, sem emoticon, sem azul/dourado/vermelho, sem serif, sem gradientes. |
| **Tom** | Style "Aurimar PROF": objetivo, direto, contexto → solução → ação. |
| **Stack** | Next.js 14 App Router, TypeScript estrito, Tailwind, shadcn/ui. |
| **Database** | Supabase Postgres com RLS ativado em todas tabelas. |
| **LGPD** | Email gate exibe finalidade clara; opt-in explícito para newsletter; opção de descadastro em todo email. |
| **Performance** | LCP <2.5s, CLS <0.1, Lighthouse ≥90. |
| **Acessibilidade** | WCAG AA. Contraste ink/bone ok; lime nunca como única indicação de estado. |
| **Custo** | Tier gratuito Vercel + Supabase + Resend até 1.000 subs. |

---

## 6. Stack Decidido

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR/ISR, RSC, mesma stack do Cia do Visto |
| Linguagem | TypeScript estrito | Padrão pessoal |
| Estilização | Tailwind CSS | Token-friendly, mapeia brand book direto |
| UI Kit | shadcn/ui | Headless, customizável, sem lock-in |
| DB + Auth + Storage | Supabase | Mesma stack já usada, RLS nativo |
| Email | Resend | Broadcast + transactional, API simples |
| Forms | React Hook Form + Zod | Validação client/server compartilhada |
| Analytics | Vercel Analytics | Zero config, privacy-friendly |
| Deploy | Vercel | CI/CD via Git, preview deploys |
| Build IA | Claude Code | Worked spec, mesma metodologia GSD2 |
| Mockups | Google Stitch | Iteração visual antes do código |

---

## 7. Decisões de Arquitetura (lock)

1. **App Router only**, sem Pages Router. Server Components por padrão.
2. **Server Actions** para mutations em vez de API Routes onde possível.
3. **Supabase RLS** em todas tabelas. Service role apenas em Server Actions sensíveis.
4. **Email gate** com cookie de 30 dias por skill: após informar email uma vez, próximas skills baixam direto.
5. **Admin único**: allow-list em variável de ambiente, sem registro público.
6. **Sem CMS externo** (não-Sanity, não-Strapi). Tudo no Postgres + UI admin própria.
7. **Imagens** servidas via Next/Image apontando para Supabase Storage com transformação.
8. **Mark AN.** presente em todo material gerado (favicon, OG, footer fixo).

---

## 8. Riscos & Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Spam no form contato | Alta | Baixo | Rate limit + Turnstile (Cloudflare) free |
| Spam no newsletter signup | Alta | Médio | Double opt-in obrigatório |
| LGPD em subscribers | Média | Alto | Política de privacidade publicada, opt-in claro, export e delete por solicitação |
| Custo Supabase Storage | Baixa | Médio | Comprimir `.skill` é nativo; alerta em 80% do free tier |
| Email entregabilidade | Média | Alto | DKIM + SPF via Resend; warmup gradual |
| Bloat do schema | Baixa | Médio | Definição de DATABASE.md como single source; sem migration sem PR |

---

## 9. Definição de Pronto (v1)

O v1 está pronto quando:

- [ ] Todas páginas do escopo v1 entregues com identidade do brand book aplicada
- [ ] Lighthouse ≥90 em Performance, Accessibility, SEO, Best Practices
- [ ] LGPD: política de privacidade publicada e linkada em todo form
- [ ] Email gate funcional com double opt-in
- [ ] Admin permite CRUD completo de projects, skills, news, subscribers
- [ ] Disparo de newsletter via admin chega na inbox de teste sem ir para spam
- [ ] Deploy em produção sob domínio definitivo
- [ ] Aurimar consegue publicar um novo projeto sem ajuda técnica em <5min
