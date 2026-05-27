# REQUIREMENTS.md — AN. Personal Site

Must-haves verificáveis. Cada requisito é binário (atende / não atende). Organizado por área. Usado por GSD `plan-checker` e `verifier`.

---

## R1. Identidade Visual (Brand)

- **R1.1** Cores aplicadas via tokens CSS: `--bone #F5F4EF`, `--paper #FFFFFF`, `--ink #0A0A0A`, `--graphite #4A4A4A`, `--smoke #8A8A8A`, `--hairline #E5E3DC`, `--lime #CCFF00`, `--lime-deep #9FCC00`.
- **R1.2** Tipografia: Space Grotesk (display, 500/700/800), Inter (body, 400/500/600), JetBrains Mono (labels, números, 400/500).
- **R1.3** Mark `AN.` (com lime no ponto) presente em: nav, footer, favicon, OG image, frame de foto.
- **R1.4** Tagline `Onde estratégia vira sistema.` em rodapé.
- **R1.5** Descritor `LOYALTY × FINTECH × INNOVATION` em hero e footer (com `×`, não `+` nem `&`).
- **R1.6** Hairlines 1px como divisores de seção (`var(--hairline)`).
- **R1.7** Labels uppercase com letter-spacing 0.06em–0.16em.
- **R1.8** Lime usado SOMENTE como acento (highlight de keyword, dot do mark, hover state, bar do photo frame). Nunca como CTA principal preenchido.
- **R1.9** Zero em-dashes (`—`) em qualquer texto de UI.
- **R1.10** Zero emoticons em qualquer texto de UI.

## R2. Performance & Tech

- **R2.1** Lighthouse Performance ≥90 (mobile e desktop, em produção).
- **R2.2** Lighthouse Accessibility ≥95.
- **R2.3** Lighthouse SEO ≥95.
- **R2.4** LCP <2.5s no 4G simulado.
- **R2.5** CLS <0.1 em todas páginas.
- **R2.6** Imagens via `next/image` com `priority` apenas em hero LCP.
- **R2.7** Fonts auto-hospedadas via `next/font/google`, sem CDN externo.
- **R2.8** Tree-shaking ativo, `bundle analyzer` sem dependências >100kb não justificadas.

## R3. SEO & Social

- **R3.1** `<title>` único por página, formato `<Page> · AN. Aurimar Nogueira`.
- **R3.2** `<meta description>` ≤155 chars por página.
- **R3.3** OG image 1200×630 com mark AN., título e descritor.
- **R3.4** Twitter Card `summary_large_image`.
- **R3.5** `sitemap.xml` gerado automaticamente.
- **R3.6** `robots.txt` permite tudo exceto `/admin`.
- **R3.7** Structured data `Person` (Schema.org) na home.
- **R3.8** Structured data `Article` em cada notícia.

## R4. Acessibilidade

- **R4.1** WCAG AA em contraste (ink/bone OK; testar lime/ink em hover).
- **R4.2** Navegação por teclado em 100% dos componentes interativos.
- **R4.3** `aria-label` em todo ícone sem texto.
- **R4.4** `prefers-reduced-motion` desativa animações.
- **R4.5** Focus ring visível (não usar `outline:none` sem alternativa).
- **R4.6** Skip-link para conteúdo principal.

## R5. Home

- **R5.1** Hero com `AN.` (72px+), descritor, h1 grande (clamp 64–144px) e tagline em graphite.
- **R5.2** Highlight de keyword com lime (estilo do brand book hero).
- **R5.3** Seção "Em destaque" com 3 projetos mais recentes (`is_featured = true`).
- **R5.4** Seção "Skills" com 4 skills em destaque + link para hub.
- **R5.5** Seção "Últimas notícias" com 3 itens mais recentes.
- **R5.6** Bloco de newsletter signup com finalidade clara.
- **R5.7** CTA "Trabalhar comigo" → contato.

## R6. Sobre

- **R6.1** Bio longa (markdown editável via admin) com timeline.
- **R6.2** Foto principal usando o frame especificado no brand book seção 07.
- **R6.3** Lista de empresas/papéis (LATAM Pass, CERC, Stone, CRDC) com ano e descritor.
- **R6.4** Lista de frameworks criados (Método Jet, Innovation2Business, GSD2).
- **R6.5** Lista de links externos: LinkedIn, GitHub `mazinhoww-web`, email.

## R7. Projetos

- **R7.1** Lista paginada (12 por página) com card: thumbnail, título, tags, ano.
- **R7.2** Filtro por tag (LATAM, fintech, loyalty, side-project etc).
- **R7.3** Página de detalhe com: título, sumário, descrição (markdown), tags, links externos, galeria opcional, projetos relacionados.
- **R7.4** Sem comentários, sem likes.
- **R7.5** OG image por projeto.

## R8. Skills Hub

- **R8.1** Lista filtrável por categoria (GTM, Data, Product, Operations etc).
- **R8.2** Card de skill com: nome, descrição curta, tags, badge `FREE`, contador de downloads.
- **R8.3** Página detalhe com: nome, descrição longa, tags, instruções, botão "Baixar skill".
- **R8.4** Botão de download abre modal: se email já está em cookie, baixa direto. Senão, exige email + checkbox de consentimento newsletter (opt-in opcional separado do download).
- **R8.5** Após submissão, link de download válido por 10 minutos (assinado) é gerado.
- **R8.6** Counter de download incrementa em cada conclusão.
- **R8.7** Skills semeadas: GTM Engineering, GTM Automation, RevOps GTM Strategy, Customer Success Operations, Agile Project Management, Automation & Data Platforms, Product Management Digital, Data Engineering Senior, e as skills do próprio Aurimar conforme database seed.
- **R8.8** Página "Como Instalar" idêntica em estrutura à da SCIENT (5 passos + dúvidas frequentes), com identidade AN.

## R9. Notícias

- **R9.1** Lista cronológica reversa.
- **R9.2** Item com: título, data, sumário curto (180 chars), categoria opcional.
- **R9.3** Detalhe com body markdown + share buttons (LinkedIn, X, copy link).
- **R9.4** Slug único por título.

## R10. Contato

- **R10.1** Form com: nome, email, empresa (opcional), assunto, mensagem.
- **R10.2** Validação Zod: nome ≥2 chars, email válido, mensagem 20–2000 chars.
- **R10.3** Submit grava em tabela `contacts` + dispara email para Aurimar via Resend.
- **R10.4** Sucesso renderiza confirmação inline, sem redirect.
- **R10.5** Rate limit 3 envios/IP/hora via Upstash ou middleware.
- **R10.6** Aviso LGPD inline.

## R11. Newsletter

- **R11.1** Signup em rodapé + bloco em home.
- **R11.2** Double opt-in: ao submeter, envia email de confirmação via Resend; só vira `confirmed=true` após clicar.
- **R11.3** Cada email tem unsubscribe link único (token).
- **R11.4** Aurimar consegue compor newsletter no admin (markdown editor), pré-visualizar e disparar.
- **R11.5** Disparo grava log na tabela `newsletter_campaigns` (sent_at, recipient_count, status).
- **R11.6** Disparo respeita `confirmed=true` e `unsubscribed=false`.

## R12. Admin

- **R12.1** Rota `/admin` protegida por middleware: redireciona não-autenticados para `/admin/login`.
- **R12.2** Login via magic link Supabase. Email precisa estar em allow-list (env `ADMIN_EMAILS`).
- **R12.3** Dashboard com cards: total subscribers (confirmed), total downloads, mensagens não-lidas, último deploy.
- **R12.4** CRUD completo para: projects, skills, news.
- **R12.5** Upload de arquivo `.skill` (até 5MB) e thumbnail.
- **R12.6** Lista de subscribers com busca, filtro (confirmed/unsub), export CSV.
- **R12.7** Lista de mensagens de contato com marcar-como-lido.
- **R12.8** Composer de newsletter com preview.
- **R12.9** Confirmação dupla para deletes destrutivos.

## R13. Database & LGPD

- **R13.1** Schema implementado conforme DATABASE.md.
- **R13.2** RLS ativada em todas tabelas. Policy default: deny.
- **R13.3** Service role usado apenas em Server Actions de admin autenticado.
- **R13.4** Cookies essenciais (sessão admin) sem consentimento; cookies de analytics requerem opt-in.
- **R13.5** Política de privacidade em `/privacidade` com: dados coletados, finalidade, base legal, retenção, contato DPO.
- **R13.6** Endpoint admin "Exportar dados do usuário" e "Deletar usuário" para atendimento LGPD.

## R14. Deploy & Operação

- **R14.1** Repo em GitHub privado de Aurimar.
- **R14.2** Branches: `main` (produção), `dev` (preview). PR obrigatório para `main`.
- **R14.3** Vercel conectado: `main` → produção, demais branches → preview deploy.
- **R14.4** Variáveis de ambiente sincronizadas entre `.env.local`, Vercel e documentadas em `.env.example`.
- **R14.5** Supabase com backup diário ativado.
- **R14.6** Health check `/api/health` retorna 200 + timestamp + versão git.
