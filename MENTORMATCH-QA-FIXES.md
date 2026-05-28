# MentorMatch — QA dos Fixes

**URL base:** https://aurimarnogueira.com.br/mentormatch
**Total de fixes:** 18
**Ultima atualizacao:** 2026-05-28

---

## Pre-condicoes para QA

- Limpar cookies do dominio aurimarnogueira.com.br antes de iniciar
- Usar email novo formato: `qa.mm.YYYYMMDD.HHmm@gmail.com` quando precisar registrar
- Reutilizar conta de teste apos primeiro registro para os fluxos pos-onboarding

---

## FIX #1 — Landing reconhece sessao ativa

**Bug original:** Landing exibia "Entrar" e "Comecar agora" mesmo com sessao ativa.
**Esperado:** Header mostra "Ir para o Dashboard" quando logado.

### Teste
1. Fazer login com conta existente
2. Navegar para `/mentormatch`
3. Verificar:
   - [ ] Header NAO mostra "Entrar"
   - [ ] Header mostra botao "Ir para o Dashboard"
   - [ ] Hero CTA tambem mostra "Ir para o Dashboard" em vez de "Criar conta gratuita"
4. Clicar "Ir para o Dashboard"
   - [ ] Redireciona para `/mentormatch/t/{slug}/{mentor|mentee}`

---

## FIX #2 — Login NAO forca re-onboarding

**Bug original:** Login redirecionava sempre para `/select-profile`, mesmo com onboarding completo.
**Esperado:** Apos login, redirecionar direto para dashboard se onboarding completo.

### Teste
1. Pre-condicao: ter uma conta com onboarding completo (role e tenantSlug definidos)
2. Logout
3. Login com a conta
4. Verificar:
   - [ ] NAO passa por `/select-profile`
   - [ ] NAO passa por `/onboarding/*`
   - [ ] Vai direto para `/mentormatch/t/{slug}/{mentor|mentee}`

---

## FIX #4 — Tema light consistente

**Bug original:** Login/dashboard/welcome eram dark, restante era light. Mudanca abrupta de tema.
**Esperado:** Light theme em todas as paginas.

### Teste
1. Navegar pelo fluxo completo:
   - `/mentormatch` (landing) — [ ] light theme
   - `/mentormatch/register` — [ ] light theme
   - `/mentormatch/login` — [ ] light theme (NAO dark azul-marinho)
   - `/mentormatch/forgot-password` — [ ] light theme
   - `/mentormatch/select-profile` — [ ] light theme
   - `/mentormatch/onboarding/mentor` ou `/mentee` — [ ] light theme
   - `/mentormatch/welcome` — [ ] light theme (NAO dark)
   - `/mentormatch/t/{slug}/mentor` ou `/mentee` (dashboard) — [ ] light theme
   - `/mentormatch/t/{slug}/profile` — [ ] light theme
   - `/mentormatch/t/{slug}/mentors` — [ ] light theme
   - `/mentormatch/t/{slug}/notifications` — [ ] light theme
2. Verificar:
   - [ ] Backgrounds claros em toda a navegacao
   - [ ] Texto sempre escuro em fundo claro (contraste OK)
   - [ ] Nenhuma pagina em fundo azul-marinho

---

## FIX #5 — Menu Mentor sem "Buscar Mentores"

**Bug original:** Mentor tinha "Buscar Mentores" no menu, sem sentido semantico.
**Esperado:** Menu Mentor sem essa opcao.

### Teste
1. Logar com conta Mentor
2. Acessar dashboard `/mentormatch/t/{slug}/mentor`
3. Verificar sidebar (desktop) e bottom nav (mobile):
   - [ ] NAO tem "Buscar Mentores"
   - [ ] Menu Mentor: Dashboard, Solicitacoes, Minhas Conexoes, Biblioteca, Notificacoes, Perfil
4. Logar com conta Mentorado
5. Verificar:
   - [ ] Menu Mentee TEM "Buscar Mentores"

---

## FIX #6 — Dashboards sem dados mockados

**Bug original:** Dashboard Mentee mostrava "Roberto Almeida @ CloudTech", "Frameworks de Feedback 1:1", "Mentor Disponivel" — dados hardcoded.
**Esperado:** Empty states reais.

### Teste Mentee
1. Logar com conta Mentorado nova (sem conexoes)
2. Acessar `/mentormatch/t/{slug}/mentee`
3. Verificar:
   - [ ] NAO aparece "Roberto Almeida"
   - [ ] NAO aparece "Engineering Manager @ CloudTech"
   - [ ] NAO aparece "Hoje, 14:30"
   - [ ] NAO aparece "Frameworks de Feedback 1:1"
   - [ ] NAO aparece "Transicao para Gestao"
   - [ ] Box "Sua Proxima Sessao" mostra "Voce ainda nao tem sessoes agendadas." + link "Encontre um mentor"
   - [ ] Biblioteca mostra "Nenhum material disponivel ainda."
   - [ ] Mentores em Destaque mostra "Voce ainda nao tem mentores conectados." + link "Explore a plataforma"

### Teste Mentor
1. Logar com conta Mentor nova
2. Acessar `/mentormatch/t/{slug}/mentor`
3. Verificar:
   - [ ] Card "Nota Media" mostra "0" ou "--", NAO "4.9"
   - [ ] Card "Horas de Mentoria" mostra "0h", NAO multiplo aleatorio
   - [ ] Card "Total de Mentorados" sem incremento fake (`+2` etc)
   - [ ] Sem badges hardcoded "Em dia", "Aguardando", "Ativo" em mentees
   - [ ] Sem texto "85% Concluido" hardcoded
   - [ ] Sem "Proxima reuniao: Amanha as 14:00" hardcoded

---

## FIX #7 — Perfil persiste dados do onboarding

**Bug original:** Apos logout/login, perfil mostrava WhatsApp/LinkedIn/skills em branco.
**Esperado:** Profile page carrega dados persistidos.

### Teste
1. Criar conta nova e completar onboarding como Mentor com:
   - WhatsApp: `11999999999`
   - LinkedIn: vazio ou URL valida
   - Bio, Headline, Education preenchidos
   - Skills: React, Node.js
2. Acessar Perfil `/mentormatch/t/{slug}/profile`
3. Verificar (apos refresh da pagina):
   - [ ] Nome aparece preenchido
   - [ ] WhatsApp aparece preenchido
   - [ ] Bio aparece preenchido
   - [ ] LinkedIn aparece preenchido (se foi preenchido)
4. Fazer logout
5. Login novamente
6. Acessar Perfil
7. Verificar:
   - [ ] Todos os dados PERSISTEM (nao zeram)

---

## FIX #8 — Rotas auth redirecionam autenticados

**Bug original:** `/login` e `/register` acessiveis com sessao ativa.
**Esperado:** Auto-redirect para dashboard.

### Teste
1. Logar com conta existente
2. Tentar acessar `/mentormatch/login` na barra de URL
3. Verificar:
   - [ ] Redireciona automaticamente para dashboard (NAO mostra form de login)
4. Tentar acessar `/mentormatch/register`
5. Verificar:
   - [ ] Redireciona automaticamente para dashboard

---

## FIX #9 — Welcome text contextualizado por role

**Bug original:** Welcome dizia "explorar mentores" mesmo para Mentor.
**Esperado:** Texto diferente por role.

### Teste Mentor
1. Criar conta Mentor e completar onboarding
2. Chegar em `/mentormatch/welcome`
3. Verificar:
   - [ ] Texto: "Seu perfil de mentor foi criado. Comece a receber mentorados e compartilhe sua experiencia!"
   - [ ] NAO diz "explorar mentores"

### Teste Mentorado
1. Criar conta Mentorado e completar onboarding
2. Chegar em `/mentormatch/welcome`
3. Verificar:
   - [ ] Texto: "Seu perfil foi criado com sucesso. Explore mentores e agende sua primeira sessao!"

---

## FIX #10 — Contraste em cards de metricas

**Bug original:** Numero "0" em "Total de Mentorados" em azul muito escuro sobre azul-marinho (WCAG fail).
**Esperado:** Contraste >= 4.5:1.

### Teste
1. Logar como Mentor
2. Acessar `/mentormatch/t/{slug}/mentor`
3. Verificar os 3 cards de metricas:
   - [ ] Card "Total de Mentorados" — numero legivel
   - [ ] Card "Horas de Mentoria" — numero legivel
   - [ ] Card "Nota Media" — numero legivel
   - [ ] Todos os numeros tem contraste WCAG AA (4.5:1) sobre o fundo

---

## FIX #11 — Erro email duplicado com CTA

**Bug original:** "Um usuario com este email ja existe" sem link para login.
**Esperado:** Mensagem + link "Fazer login".

### Teste
1. Navegar para `/mentormatch/register`
2. Tentar registrar com email JA EXISTENTE
3. Submeter formulario
4. Verificar:
   - [ ] Mensagem: "Um usuario com este email ja existe"
   - [ ] Link "Fazer login" aparece inline na mensagem de erro
5. Clicar "Fazer login"
   - [ ] Redireciona para `/mentormatch/login`

---

## FIX #12 — Disponibilidade com 7 dias

**Bug original:** Perfil mostrava apenas Segunda e Terca.
**Esperado:** 7 dias da semana.

### Teste
1. Logar como Mentor
2. Acessar `/mentormatch/t/{slug}/profile`
3. Rolar ate secao "Disponibilidade"
4. Verificar lista de dias:
   - [ ] Segunda-feira
   - [ ] Terca-feira
   - [ ] Quarta-feira
   - [ ] Quinta-feira
   - [ ] Sexta-feira
   - [ ] Sabado
   - [ ] Domingo
5. Cada dia tem:
   - [ ] Toggle individual habilitar/desabilitar
   - [ ] Default Sabado e Domingo desabilitados
   - [ ] Default seg-sex habilitados 09:00-18:00

---

## FIX #13 — Texto "corporativo" removido

**Bug original:** "E-mail corporativo", "seu@empresa.com", "senha corporativa" excluindo usuarios com email pessoal.
**Esperado:** Labels e placeholders neutros.

### Teste
1. Acessar `/mentormatch/register`
2. Verificar campo email:
   - [ ] Label: "E-mail" (NAO "E-mail corporativo")
   - [ ] Placeholder: "seu@email.com" (NAO "seu@empresa.com")
3. Acessar `/mentormatch/login`
4. Verificar:
   - [ ] Label: "E-mail" (sem "corporativo")
5. Acessar `/mentormatch/forgot-password`
6. Verificar:
   - [ ] Label: "E-mail"
   - [ ] Texto NAO menciona "senha corporativa"

---

---

## FIX #14 — Landing redesign cinematica + theme toggle

**Mudanca:** Landing redesenhada (dark cinema + glass) com hero MatchPreview animado, trust bar com counters, como funciona em 3 passos, features, CTA final. Theme toggle no navbar permite alternar light/dark, com light como default no app interno.

### Teste de visual da landing
1. Acessar `/mentormatch` em janela anonima (logout)
2. Verificar elementos no topo (Navbar):
   - [ ] Logo "MentorMatch" com badge "WHITE-LABEL"
   - [ ] Botao "Comecar Gratis" (usuario nao logado) com gradient roxo
   - [ ] Icone de tema (lua) no navbar
3. Verificar Hero (left):
   - [ ] Pill "50+ empresas ativas na plataforma" com dot verde pulsante
   - [ ] H1 com gradient nas palavras "mentores" e "mentorados"
   - [ ] CTAs "Comecar Gratis" e "Ver Demo"
   - [ ] Avatares circulares sobrepostos e texto "2.400+ mentorias realizadas"
4. Verificar Hero (right) - MatchPreview animado:
   - [ ] Dois cards (Ana Mentor / Carlos Dev) aparecem
   - [ ] Cards se afastam e voltam em ciclo
   - [ ] No final do ciclo: linha conectora verde + pill "Match realizado"
   - [ ] Badges flutuantes "98% satisfacao" e "Setup em 5 min"
5. Verificar TrustBar:
   - [ ] 3 contadores animam ao entrar no viewport (rolar a pagina)
   - [ ] Numeros chegam em "2400+", "98%", "50+"
   - [ ] 5 estrelas amarelas + "4.9 / 5.0"
6. Verificar Como Funciona:
   - [ ] Section label "Como funciona"
   - [ ] H2 "Pronto em 3 passos"
   - [ ] 3 cards numerados 01, 02, 03 com icones
7. Verificar Features:
   - [ ] 3 cards glass: Matching Inteligente, Biblioteca de Materiais, White-Label Multitenant
   - [ ] Hover: card sobe e ganha shadow indigo
8. Verificar CTA Final:
   - [ ] Bloco grande com gradient roxo/violeta
   - [ ] H2 "Pronto para transformar sua empresa?"
   - [ ] CTA "Criar Programa Gratis" + "Falar com especialista"
9. Verificar Footer:
   - [ ] Logo + copyright

### Teste do theme toggle
1. Estando na landing (`/mentormatch`)
2. Clicar no icone de lua/sol no navbar
3. Verificar:
   - [ ] Pagina ainda fica visualmente correta (landing cinematica e fundo escuro)
   - [ ] Classe `dark` aparece no `<html>` (DevTools > Elements)
4. Navegar para `/mentormatch/login`
5. Verificar:
   - [ ] Login agora em DARK theme (toggle persiste pelo localStorage)
6. Clicar no toggle novamente para voltar a light
7. Verificar:
   - [ ] Login volta a light theme
8. Recarregar a pagina
   - [ ] Preferencia de tema persiste (localStorage `mm-theme`)
9. Limpar localStorage e recarregar `/mentormatch/login`
   - [ ] Volta para light (default)

### Teste de animacao (prefers-reduced-motion)
1. Ativar "Reduce motion" no SO (macOS: Settings > Accessibility > Display)
2. Recarregar `/mentormatch`
3. Verificar:
   - [ ] Aurora background NAO anima (estatico)
   - [ ] Fade-up animations NAO disparam
   - [ ] MatchPreview ainda funciona (logica de fase)

### Teste responsivo
1. Abrir `/mentormatch` em 375px (mobile)
   - [ ] Hero vira coluna unica (texto em cima, MatchPreview embaixo)
   - [ ] Cards de "Como funciona" e "Features" empilham em uma coluna
2. Em 768px (tablet)
   - [ ] Layout intermediario
3. Em 1440px (desktop)
   - [ ] Hero em 2 colunas

---

---

## FIX #15 — Session refresh + switch entre Mentor/Mentorado

**Bug original:** Apesar do FIX #2, usuario que completava onboarding continuava sendo enviado para `/select-profile` no proximo login pois o JWT da sessao nao era atualizado (so era populado no signIn inicial). Alem disso, nao havia forma de trocar entre Mentor e Mentorado depois de escolher um perfil.

**Esperado:**
- Apos completar onboarding, sessao atualiza imediatamente e usuario nao precisa relogar para ir ao dashboard
- Usuario pode trocar de perfil (Mentor <-> Mentorado) a qualquer momento via sidebar
- Dados do perfil sao preservados; UserSkill ja suporta isTeaching boolean (skills de ensino e aprendizado podem coexistir)

### Teste de session refresh
1. Criar conta nova e completar onboarding como Mentor
2. Apos clicar Finalizar:
   - [ ] Vai direto para `/welcome` (sem voltar para login)
   - [ ] Welcome page mostra texto de Mentor
3. Clicar "Ir para Dashboard"
   - [ ] Vai direto para `/t/{slug}/mentor` (sem passar por `/select-profile`)
4. Fazer logout
5. Login novamente
   - [ ] Vai DIRETO para `/t/{slug}/mentor` (NAO passa por `/select-profile`)
   - [ ] NAO pede para preencher onboarding novamente

### Teste de switch de perfil
1. Logar como Mentor (com onboarding completo)
2. Acessar dashboard `/t/{slug}/mentor`
3. Localizar sidebar (desktop) -> secao de usuario no rodape
4. Verificar:
   - [ ] Botao "Mudar para Mentorado" visivel acima de "Sair"
5. Clicar "Mudar para Mentorado"
   - [ ] Loading aparece no botao
   - [ ] Em segundos, redireciona para `/t/{slug}/mentee`
   - [ ] Sidebar agora mostra menu de Mentorado (Dashboard, Conexoes, Buscar Mentores, Biblioteca, etc.)
   - [ ] Sidebar agora mostra "Mudar para Mentor" no rodape
6. Recarregar a pagina
   - [ ] Permanece como Mentorado
7. Clicar "Mudar para Mentor" novamente
   - [ ] Volta para dashboard de Mentor

### Teste de preservacao de skills
1. Logar como Mentor com skills de ensino: React, Node.js
2. Acessar Perfil
3. Verificar skills preenchidas
4. Trocar para Mentorado
5. Voltar para Mentor
6. Acessar Perfil
   - [ ] Skills de ensino persistiram (React, Node.js)

---

---

## FIX #16 — Admin role para espindolanogueira@yahoo.com.br + redirect admin

**Mudanca:** Usuario espindolanogueira@yahoo.com.br criado como ADMIN no tenant default. Helper `getDashboardHref` centralizada para redirecionar ADMIN para `/t/{slug}/admin/users`.

**Credenciais:**
- Email: `espindolanogueira@yahoo.com.br`
- Senha: `Facil022@`

### Teste de login admin
1. Limpar cookies e localStorage
2. Acessar `/mentormatch/login`
3. Login com email e senha acima
4. Verificar:
   - [ ] Login bem-sucedido (sem erro de credenciais)
   - [ ] Redirecionamento automatico para `/mentormatch/t/default/admin/users`
   - [ ] NAO redirecionou para `/select-profile`
   - [ ] NAO redirecionou para `/mentor` ou `/mentee`

### Teste de menu admin
1. Apos login, verificar sidebar (desktop):
   - [ ] Dashboard
   - [ ] Usuarios
   - [ ] Habilidades
   - [ ] Biblioteca
   - [ ] Relatorios
   - [ ] Configuracoes
2. Verificar bottom nav (mobile):
   - [ ] Mesmas opcoes responsivas
3. No rodape do sidebar:
   - [ ] NAO aparece "Mudar para Mentor/Mentorado" (admin nao alterna)
   - [ ] Botao "Sair" disponivel

### Teste de acesso a paginas admin
1. Clicar "Usuarios" no sidebar
   - [ ] Carrega `/mentormatch/t/default/admin/users`
   - [ ] Lista de usuarios do tenant
2. Clicar "Relatorios"
   - [ ] Carrega `/mentormatch/t/default/admin/reports`
3. Clicar "Configuracoes"
   - [ ] Carrega `/mentormatch/t/default/admin/settings`

### Teste de seguranca
1. Logar como Mentor ou Mentorado (conta diferente)
2. Tentar acessar `/mentormatch/t/default/admin/users` na URL
3. Verificar:
   - [ ] Redirecionado para dashboard do role atual
   - [ ] NAO consegue acessar paginas admin

---

---

## FIX #17 — Admin Geral (Super Admin) para gestao de tenants

**Feature:** Painel central em `/mentormatch/admin` para SUPER_ADMIN gerenciar todos os tenants da plataforma. Lista tenants com stats (usuarios, mentores, sessoes), permite criar novos tenants (com upload opcional de design.md no Vercel Blob) e desativar tenants existentes.

**Credenciais SUPER_ADMIN:**
- Email: `espindolanogueira@yahoo.com.br`
- Senha: `Facil022@`
- Role: `SUPER_ADMIN`

### Teste de acesso
1. Limpar cookies, acessar `/mentormatch/login`
2. Login com credenciais acima
3. Verificar:
   - [ ] Redirecionamento automatico para `/mentormatch/admin` (NAO para `/t/default/admin`)
   - [ ] Header mostra logo + "MentorMatch" + badge "ADMIN GERAL"
   - [ ] Pagina em dark theme cinematica consistente com landing

### Teste de UI do painel
1. Verificar 4 cards de stats no topo:
   - [ ] Tenants ativos (numero)
   - [ ] Usuarios totais (numero)
   - [ ] Sessoes realizadas (numero)
   - [ ] Com design.md (numero)
2. Grid de tenants (default deve aparecer ao menos):
   - [ ] Card do tenant "MentorMatch Demo" / slug "default"
   - [ ] Barra colorida no topo do card (cor do brandColor)
   - [ ] Logo + nome + URL `aurimarnogueira.com.br/mentormatch/t/default`
   - [ ] StatusChip "Ativo" verde
   - [ ] Stats em 3 cards (usuarios, sessoes, mentores)
   - [ ] Botao "Gerenciar" com chevron
3. Card de "Adicionar Tenant" com borda dashed e icone +

### Teste de criar tenant
1. Clicar "Novo Tenant" (top-right) ou no card dashed
2. Modal abre com Passo 1/2
3. Preencher:
   - Nome: `Tenant Teste`
   - Slug: deve auto-gerar como `tenant-teste`
   - Cor primaria: escolher uma
4. Clicar "Proximo"
5. Passo 2 mostra area de upload de design.md
6. Clicar "Criar com tema base" (sem upload)
7. Verificar:
   - [ ] Modal fecha
   - [ ] Novo tenant aparece na lista
   - [ ] URL e `/mentormatch/t/tenant-teste`

### Teste de gerenciar tenant
1. No card de um tenant, clicar "..." (menu)
   - [ ] Opcoes: Ver dashboard, Configuracoes, Desativar
2. Clicar "Ver dashboard"
   - [ ] Abre `/mentormatch/t/{slug}/mentor` em nova aba
3. Voltar e clicar "Gerenciar" no card
   - [ ] Vai para `/mentormatch/t/{slug}/admin/users`
4. Desativar tenant via menu:
   - [ ] Status muda para "Inativo" (chip cinza)
   - [ ] Card permanece na lista mas marcado como inativo

### Teste de seguranca
1. Logar como conta nao-super-admin
2. Tentar acessar `/mentormatch/admin` direto na URL
3. Verificar:
   - [ ] Redireciona para dashboard do role (mentor/mentee) ou login
   - [ ] NAO acessa pagina admin geral

### Teste responsivo
1. Em mobile (375px):
   - [ ] Cards de stats em 2 colunas
   - [ ] Grid de tenants em 1 coluna
2. Em desktop (1440px):
   - [ ] Cards de stats em 4 colunas
   - [ ] Grid de tenants em 2 colunas

---

---

## FIX #18 — Tenant Sicredi (primeira landing branded)

**Feature:** Sicredi como primeiro tenant da plataforma. Landing branded em verde Sicredi (#33820D), fontes Exo 2 + Nunito, logo Sicredi no header e footer.

**URL publica:** `https://aurimarnogueira.com.br/sicredi/mentormatch`

### Teste de URL e rewrite
1. Acessar `https://aurimarnogueira.com.br/sicredi/mentormatch` em janela anonima
2. Verificar:
   - [ ] Pagina carrega com HTTP 200 (NAO 404)
   - [ ] URL na barra permanece `/sicredi/mentormatch` (rewrite, nao redirect)

### Teste de branding
1. Verificar Navbar:
   - [ ] Logo Sicredi visivel a esquerda
   - [ ] Texto "MentorMatch" + badge "SICREDI" verde
   - [ ] Links "Como funciona" e "Recursos" em verde
   - [ ] Botao "Acessar plataforma" verde
   - [ ] Fundo branco
2. Verificar Hero:
   - [ ] Badge "Programa de Mentoria Sicredi" com dot verde
   - [ ] Titulo H1 em fonte Exo 2 (light/300) com "lideres" e "talentos" em verde
   - [ ] CTAs "Comecar agora" (verde solid) e "Ver demonstracao" (outline verde)
   - [ ] Avatares com gradiente verde Sicredi
   - [ ] "2.400+ mentorias realizadas"
3. Verificar MatchPreview:
   - [ ] Card "Ana Costa - Gerente de Marketing" (esquerda)
   - [ ] Card "Pedro Lima - Analista de Dados" (direita)
   - [ ] Animacao em ciclo idle -> connecting -> matched
   - [ ] Pill "Match realizado" verde clara aparece no fim do ciclo
4. Verificar Trust Bar (verde escuro #0A4B1E):
   - [ ] Counters animam ao rolar a pagina (2400+, 98%, 50+)
   - [ ] 5 estrelas brancas + "4.9 / 5.0"
5. Verificar Como Funciona (fundo cinza claro):
   - [ ] Section label verde
   - [ ] H2 "Pronto em 3 passos" com "3 passos" verde
   - [ ] 3 cards numerados em circulos verdes
6. Verificar Features:
   - [ ] 3 cards: Matching Inteligente, Biblioteca, White-Label por Unidade
   - [ ] Cada card com barra lateral verde + icone verde sobre fundo verde claro
7. Verificar Testemunhos:
   - [ ] 3 cards de cooperativas Sicredi (Sul Brasil, Centro-Norte, Nordeste)
   - [ ] Estrelas verdes
8. Verificar CTA Final (verde escuro):
   - [ ] H2 "Pronto para transformar sua cooperativa?"
   - [ ] CTAs verde solid + outline branca
9. Verificar Footer:
   - [ ] Logo Sicredi + texto "MentorMatch Sicredi"
   - [ ] URL final: `aurimarnogueira.com.br/sicredi/mentormatch`

### Teste de fontes
1. Inspecionar elementos H1, H2, H4 (DevTools > Computed)
   - [ ] font-family inclui "Exo 2"
2. Inspecionar texto body
   - [ ] font-family inclui "Nunito"
3. Network tab:
   - [ ] Fonts carregadas de fonts.googleapis.com (Exo 2 + Nunito)

### Teste de Admin Geral (Sicredi aparece como tenant)
1. Logar como SUPER_ADMIN (espindolanogueira@yahoo.com.br / Facil022@)
2. Acessar `/mentormatch/admin`
3. Verificar:
   - [ ] Card do tenant "MentorMatch Sicredi" visivel
   - [ ] Slug: `sicredi`
   - [ ] Barra colorida verde (#33820D)
   - [ ] Stats inicializados (0 usuarios, 0 sessoes)
4. Clicar "Gerenciar" no card
   - [ ] Vai para `/mentormatch/t/sicredi/admin/users`
   - [ ] Lista admin do tenant (vazia inicialmente)

### Teste responsivo
1. Em mobile (375px):
   - [ ] Hero em coluna unica
   - [ ] Features e steps em uma coluna
2. Em desktop (1440px):
   - [ ] Hero em 2 colunas
   - [ ] Cards em 3 colunas

---

## Criterios de aceite globais

- [ ] Zero erros 500 no console durante todo o fluxo
- [ ] Zero redirects para `/admin` do an-site (sub-app isolado)
- [ ] Todas as paginas sob `/mentormatch/*`
- [ ] Cookies usam prefixo `mm.` (`mm.session-token`, `mm.csrf-token`)
- [ ] Email de boas-vindas recebido apos registro
- [ ] an-site (`aurimarnogueira.com.br`, `/palestras`, `/contato`) funciona normalmente

---

## Como executar o QA com Claude Extension

1. Abrir Chrome com Claude Extension instalado
2. Iniciar sessao no extension
3. Compartilhar este arquivo com o agente:
   > "Execute o roteiro de QA em MENTORMATCH-QA-FIXES.md e relate PASS/FAIL para cada item, com screenshots quando relevante."
4. O agente vai navegar pelo site e validar cada item da checklist.
5. Ao final, gerar relatorio: PASS/FAIL por FIX, observacoes, e link para deploys onde encontrar regressao.
