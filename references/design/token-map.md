# Token Map — an-site → MentorMatch DS

Equivalência **100%** dos tokens an-site usados nas telas MentorMatch para o
design system canônico (D022, `.mm` / `var(--*)`). Sem "TBD". Regra: ao migrar,
zero token an-site remanescente na tela (`grep` limpo) e tudo sob
`MentorMatchThemeRoot` (responde a `--brand` + light/dark).

> A tela migrada deve ser envolvida por `<MentorMatchThemeRoot brand={tenant.brandColor} theme={cookieScheme}>`.
> Cores via `var(--*)`; tipografia via classes `mm-*`.

## 1. Cores (Tailwind an-site → token DS)

| an-site | Papel | DS |
|---|---|---|
| `bg-bone` | fundo da página | `background: var(--bg)` |
| `bg-paper` | fundo de card/superfície | `background: var(--surface)` |
| `bg-smoke` / `bg-graphite` (raros) | superfície 2 / muted | `var(--surface-2)` |
| `text-ink` | texto principal | `color: var(--text)` |
| `text-graphite` | texto secundário | `color: var(--text-secondary)` |
| `text-smoke` | texto muted/metadado | `color: var(--text-muted)` |
| `text-paper` | texto claro sobre cor/escuro | `color: var(--brand-contrast)` (sobre `--brand`) |
| `border-hairline` | divisor/borda 1px | `border-color: var(--border)` (input em repouso: `--border-strong`) |
| `text-error` | erro | `color: var(--danger)` |
| `text-success` (raro) | sucesso | `color: var(--success)` |
| `bg-ink` / botão escuro | CTA primário | `mm-btn mm-btn--primary` (`--brand` / `--brand-contrast`) |
| `bg-mm-primary` / `var(--mm-primary)` | marca (legado tenant) | `var(--brand)` |

> O sistema legado `--mm-*` (`src/styles/mentormatch/*.css`) é **substituído** por `--brand`/neutros do DS. Não usar `--mm-primary` em tela migrada.

## 2. Tipografia (classe an-site → classe DS)

| an-site | Tamanho (an-site) | DS |
|---|---|---|
| `font-heading` | família heading | (use as classes `mm-h*`; a fonte do DS é Plus Jakarta) |
| `font-mono` | mono | `mm-mono` (`var(--mm-font-mono)`) |
| `text-display-l` | clamp 36–56px /700 | `mm-display` |
| `text-display-m` | clamp 28–40px /700 | `mm-h1` (40/30) |
| `text-h2` | clamp 24–34px /700 | `mm-h2` |
| `text-h3` | ~20px /600 | `mm-h3` |
| `text-body-l` | 18px /400 | `mm-body` |
| `text-body` | 16px /400 | `mm-body` |
| `text-body-s` | 14px /400 | `mm-body-small` |
| `text-mono-meta` | 12px /500 uppercase tracking | `mm-label` (uppercase) ou `mm-body-small` + `mm-mono` |

## 3. Estrutura / layout (não são tokens de marca — manter)

| an-site | Decisão |
|---|---|
| `max-w-container` (1280px) | layout, não-marca. Manter como Tailwind **ou** `style={{ maxWidth: 1200 }}`. Não bloqueia grep de marca. |
| `space-y-*`, `flex`, `grid`, `gap-*`, `px/py`, `rounded` (sem cor) | utilitários estruturais — manter (Tailwind), opcional trocar `rounded` por `var(--r-*)`. |
| `hover:underline` etc. | manter; cores de hover via `var(--*)`. |

## 4. Componentes (trocar markup an-site por componente DS)

| Padrão an-site | DS |
|---|---|
| `<input className="rounded border border-hairline bg-paper ...">` | `<Input>` (`.mm-input`) + `<Field>` para label/erro |
| `<button className="rounded bg-ink ... text-paper">` | `<Button>` (primary/secondary/ghost) |
| card `rounded border border-hairline bg-paper p-5` | `mm-card` (ou `<Card>`) |
| chip `rounded border border-hairline px-2 ... text-graphite` | `mm-chip` |
| tabela (header/linha hairline) | `mm-card` + `mm-row` (hover `--surface-2`) + header `--surface-2`/`mm-label` |
| toast/erro inline `text-error` | `useToast` (DS) / helper `mm-field__error` |
| modal inline | `<Modal>` (DS) |

## 5. Estados / interação

| an-site | DS |
|---|---|
| `focus:border-ink` | `.mm-input` já faz focus `--brand` + ring `--brand-ring` |
| `hover:border-ink` | `border-color: var(--brand)` ou variante secondary |
| `disabled:opacity-60` | `.mm-btn:disabled` (já tratado) |

## 6. Checklist por tela (must-haves)

- [ ] Envolta em `MentorMatchThemeRoot` (brand do tenant + tema do cookie).
- [ ] Responde a `--brand`: `default` (#6366F1) ≠ `sicredi` (#33820D) no preview.
- [ ] Light e dark corretos.
- [ ] `grep -E "bg-bone|bg-paper|text-ink|text-graphite|text-paper|border-hairline|font-heading|text-(display|h2|h3|body|mono-meta)|text-error|text-smoke"` na tela → **zero**.
- [ ] `typecheck` 0 / `build` ok / E2E da tela verde.
- [ ] Sem regressão de layout em 320/768/1024/1440 (observar no Vercel preview).

## 7. Ordem de migração (por alavancagem white-label)

1. Admin do tenant: `skills`, `library`, `reports`, `invitations`, `export` (+ `AdminNav`).
2. Vitrine de match + perfil + modal request.
3. Mentorado: `/mentee`, `/library`.
4. Headers `DashboardShell` + `AdminNav` → DS.
5. Remover legados redundantes `/requests` e `/confirm/[mentorId]` (confirmar zero links antes).
