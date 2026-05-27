# Skills Inventory - Fase 2

Gerado em 2026-05-26.

## Inventario dos 36 arquivos

| # | Arquivo original | Formato | Tamanho | SKILL.md? | Autor inferido | Possivel duplicata? |
|---|---|---|---|---|---|---|
| 1 | Agile Project Management.skill | skill | 3KB | SIM | Aurimar Nogueira | - |
| 2 | Automation & Data Platforms.skill | skill | 4KB | SIM | Aurimar Nogueira | - |
| 3 | Customer Success Operations.skill | skill | 4KB | SIM | Aurimar Nogueira | - |
| 4 | Data Engineering Senior.skill | skill | 5KB | SIM | Aurimar Nogueira | - |
| 5 | GTM Automation & AI Agents.skill | skill | 6KB | SIM | Aurimar Nogueira | - |
| 6 | GTM Engineering.skill | skill | 6KB | SIM | Aurimar Nogueira | - |
| 7 | Product Management Digital.skill | skill | 5KB | SIM | Aurimar Nogueira | - |
| 8 | RevOps GTM Strategy.skill | skill | 5KB | SIM | Aurimar Nogueira | - |
| 9 | affaan-m-everything-claude-code-council.zip | zip | 2KB | SIM | affaan-m | Par com #21? |
| 10 | affaan-m-everything-claude-code-research-ops.zip | zip | 1KB | SIM | affaan-m | DUP #21 |
| 11 | bill-gates.zip | zip | 36KB | SIM | comunidade | - |
| 12 | claude-code-templates-ceo-advisor.zip | zip | 4KB | SIM | comunidade | - |
| 13 | claude-code-templates-product-strategist.zip | zip | 0KB | SIM | comunidade | - |
| 14 | competitive-landscape.zip | zip | 11KB | SIM | comunidade | DUP #24 |
| 15 | get-shit-done-main.zip | zip | 626KB | README (sem SKILL.md) | comunidade | Par com #16 |
| 16 | gsd-2-main.zip | zip | 6980KB | SIM | comunidade | Par com #15 |
| 17 | idea-refine.zip | zip | 39KB | SIM | comunidade | - |
| 18 | market-research-reports.zip | zip | 201KB | SIM | comunidade | - |
| 19 | market-sizing.zip | zip | 10KB | SIM | comunidade | Par com #25 |
| 20 | research-assistant.zip | zip | 2KB | SIM | comunidade | - |
| 21 | research-ops.zip | zip | 3KB | SIM | comunidade | DUP #10 |
| 22 | ui-ux-pro-max-skill-main.zip | zip | 4871KB | NAO (tem README) | comunidade | - |
| 23 | user-identity-hub-main.zip | zip | 354KB | NAO (tem README) | comunidade | - |
| 24 | wshobson-agents-competitive-landscape.zip | zip | 4KB | SIM | wshobson | DUP #14 |
| 25 | wshobson-agents-market-sizing-analysis.zip | zip | 12KB | SIM | wshobson | Par com #19 |
| 26 | analise-legislacao-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 27 | analise-risco-processual-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 28 | analise-sentenca-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 29 | follow-up-inteligente-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 30 | gerador-minutas-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 31 | onboarding-cliente-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 32 | pesquisa-jurisprudencia-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 33 | qualificacao-perfil-financeiro-SKILL.md | md | 2KB | E o proprio | Chat Juridico | - |
| 34 | resumo-pecas-SKILL.md | md | 1KB | E o proprio | Chat Juridico | - |
| 35 | revisao-contratos-SKILL.md | md | 2KB | E o proprio | Chat Juridico | - |
| 36 | triagem-whatsapp-ia-SKILL.md | md | 2KB | E o proprio | Chat Juridico | - |

## Duplicatas detectadas

### Par 1: competitive-landscape (#14) vs wshobson-agents-competitive-landscape (#24)
- **Diff:** IDENTICO (514 linhas em ambos, diff vazio)
- **Proposta:** Manter `wshobson-agents-competitive-landscape` (mais recente, autoria clara). Descartar `competitive-landscape`.

### Par 2: market-sizing (#19) vs wshobson-agents-market-sizing-analysis (#25)
- **Diff:** DIFERENTE. Ambos sobre TAM/SAM/SOM mas abordagens distintas. #19 foca em dual methodology (top-down/bottom-up) com reconciliacao, 260 linhas. #25 foca em 3 metodologias com framework completo para startups, 430 linhas.
- **Proposta:** Manter AMBAS como variantes. #19 como `market-sizing` e #25 como `market-sizing-analysis`.

### Par 3: research-ops (#21) vs affaan-m-everything-claude-code-research-ops (#10)
- **Diff:** IDENTICO (112 linhas em ambos, diff vazio)
- **Proposta:** Manter `affaan-m-everything-claude-code-research-ops` (autoria clara). Descartar `research-ops`.

### Par 4: get-shit-done-main (#15) vs gsd-2-main (#16)
- **Diff:** DIFERENTES. #15 eh "GET SHIT DONE" original (705 linhas README, meta-prompting system). #16 eh "GSD2 Orchestrator" (215 linhas SKILL.md, autonomous build lifecycle). Projetos distintos.
- **Proposta:** Manter AMBAS. #15 como `get-shit-done` e #16 como `gsd2-orchestrator`.

## Erros de extracao

| Arquivo | Problema | Impacto |
|---|---|---|
| ui-ux-pro-max-skill-main.zip | Extraiu OK mas sem SKILL.md (tem README.md) | Usar README.md como fallback |
| user-identity-hub-main.zip | Extraiu OK mas sem SKILL.md (tem README.md) | Usar README.md como fallback |
| get-shit-done-main.zip | Sem SKILL.md (tem README.md) | Usar README.md como fallback |

## Resumo de decisoes

Apos resolucao de duplicatas:
- **2 descartadas** (competitive-landscape, research-ops) por serem duplicatas identicas
- **34 skills finais** para INSERT
- 8 autorais (.skill)
- 15 comunidade (.zip, descontando 2 duplicatas)
- 11 juridicas (.md)

## Notas de observacao (Fase 1)

1. Blob token 63 chars (nao 62). Nao bloqueia.
2. blob_url agora nullable. Validar na Fase 7 que todos INSERTs preenchem blob_url.
3. Schema atualizado em src/db/schema.ts com 5 colunas novas (asset_format, asset_size_kb, author, source_url, is_curated). Migration aplicada via SQL direto.
