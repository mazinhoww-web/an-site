# Prompt Claude Code — M6 Polimento

Cole o conteúdo abaixo dentro do Claude Code com `cd ~/Projects/an-site && claude`:

---

```
Vou executar o Milestone M6 (Polimento) do projeto AN. Site.

Antes de começar, leia EXATAMENTE estes arquivos do projeto:
1. CLAUDE.md (regras gerais do projeto e brand)
2. M6-POLIMENTO.md (spec completa desta milestone — fonte de verdade)

Depois, leia DESIGN.md e REQUIREMENTS.md apenas como referência de tokens
e regras de brand, mas use M6-POLIMENTO.md como fonte primária das decisões.

Princípios obrigatórios para M6:

1. Spec-before-code: leia a spec inteira primeiro, planeje, depois execute
2. Slice-by-slice: execute 6.1, depois commit, depois push, depois 6.2, etc
3. Nada de em-dash (—), nada de emoji, nada de cor fora do brand
4. Nada de invenção: se a spec diz "5 capítulos", são exatamente esses 5,
   na ordem definida, com o texto exato fornecido
5. Não adicionar features novas (admin real, DownloadGate funcional etc).
   Isso é M7+. Aqui é polimento.

Decisões já travadas (NÃO renegociar):
- 1WIN não entra na trajetória, sem menção em lugar nenhum
- Foto editorial em /sobre continua placeholder com lucide User icon
- Rota de auth visível é /admin/login. /api/auth/* nunca aparece em link
  clicável do site público

Execute na ordem:

SLICE 6.1 — Conteúdo verídico
- T6.1.1: Substituir capítulos da trajetória pelos 5 capítulos exatos
  do M6-POLIMENTO.md (LATAM Pass, CRDC, CERC, Stone, Formação)
- T6.1.2: Corrigir bio em /sobre (sem "TAG Investimentos")
- T6.1.3: Auditoria global de acentuação em todos os arquivos .tsx e .ts
  de copy. Lista de substituições está em M6-POLIMENTO.md tabela do T6.1.3.
- Commit: feat(M6.1): corrigir trajetoria com 5 capitulos reais e
  auditoria de copy
- git push origin main
- Aguardar deploy Vercel ficar verde antes de prosseguir

SLICE 6.2 — Legibilidade do lime
- T6.2.1: Audit visual e mapeamento (gere lista em texto no terminal,
  comente onde tem lime ilegível)
- T6.2.2: Aplicar as 4 regras do M6-POLIMENTO.md
- T6.2.3: Criar componente <Eyebrow> reutilizável
- Substituir todos os labels lime puros por <Eyebrow>
- Substituir highlight de keyword no hero pela REGRA 1 (background bar)
- Filter pills "TODOS / PALESTRANTE / etc" para o padrão da spec
- Commit: feat(M6.2): legibilidade do lime - regras 1-4 aplicadas
- git push origin main

SLICE 6.3 — Hover states
- Refatorar botões primary, ghost, link-arrow, filter pills, cards
- Aplicar as classes CSS exatas da spec
- Commit: feat(M6.3): hover states sem perda de contraste
- git push origin main

SLICE 6.4 — Favicon
- Criar src/app/icon.tsx, src/app/apple-icon.tsx, src/app/manifest.ts
- Confirmar metadata em src/app/layout.tsx
- Commit: feat(M6.4): favicon AN. e web manifest
- git push origin main

SLICE 6.5 — Admin Safe Browsing
- Confirmar pages.signIn em src/lib/auth.ts apontando para /admin/login
- Remover qualquer link visível para /api/auth/*
- Commit: feat(M6.5): admin via /admin/login, sem links para /api/auth/*
- git push origin main
- (Pedido de revisão Safe Browsing é manual, fora do código)

SLICE 6.6 — Layout seção QUEM
- Refazer src/app/(public)/page.tsx seção QUEM com estrutura 2 colunas
- Garantir consistência com outras seções (AGORA, FERRAMENTAS, etc)
- Commit: feat(M6.6): refazer secao QUEM na home
- git push origin main

Após cada commit:
- Mostre o diff resumido do que foi alterado
- Confirme que git push foi feito
- Pause e me peça para validar o deploy no browser antes de seguir

Se em qualquer ponto encontrar algo ambíguo ou que não está claro na spec,
PARE e me pergunte. Não invente. Não improvise.

Se algum arquivo de seed ou tabela do banco precisar ser atualizado
(career_chapters), gere o SQL ou script Drizzle correspondente. Se preferir
fazer via script TypeScript, crie scripts/update-trajetoria.ts e me mostre
antes de rodar. Não rode migration nova sem me avisar.

Comece agora pela leitura do M6-POLIMENTO.md.
```

---

## Como rodar

```bash
cd ~/Projects/an-site

# Move o arquivo de spec pra raiz do projeto (vou te entregar)
# Vai estar em /mnt/user-data/outputs/M6-POLIMENTO.md
# Copie pra raiz do projeto antes de abrir o Claude Code

# Abra o Claude Code
claude

# Cole o prompt acima
```

## Checkpoints

Pare entre cada slice (o prompt já pede isso). Em cada checkpoint, abra:
- https://aurimarnogueira.com.br (produção)
- ou https://an-site-five.vercel.app (preview Vercel)

E confira visualmente. Se algo estiver errado, peça correção antes de seguir
pra próxima slice.

## Se algo travar

Cenários possíveis:

1. **Trajetória está hardcoded em arquivo TS/TSX, não em DB:**
   - Claude Code vai detectar e editar o arquivo direto
   - Sem migration necessária

2. **Trajetória está em career_chapters do Neon:**
   - Claude Code vai gerar `scripts/update-trajetoria.ts` ou SQL puro
   - Vai te mostrar o script antes de rodar
   - Você executa com `pnpm tsx scripts/update-trajetoria.ts`

3. **Favicon não aparece após deploy:**
   - Cmd+Shift+R força reload sem cache
   - Pode levar 5-10 min pro Vercel CDN propagar

4. **Hover state continua ruim:**
   - Pause, tire print, me mostre
   - Vamos refinar a regra específica
