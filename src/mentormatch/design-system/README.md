# MentorMatch — Design System (Fase 0)

Sistema de design proprio do MentorMatch. Fonte de verdade: `DESIGN.md v1.0`
(decisao **D022**, accepted). Premium, calmo, B2B, white-label multi-tenant.

## Isolamento (regra de ouro)

**Nao altera o an-site.** Todos os tokens sao escopados sob a classe `.mm`
(nao em `:root`), a fonte e aplicada so no wrapper, e o Tailwind global do
an-site nao foi tocado. Use sempre dentro de `MentorMatchThemeRoot`.

```tsx
import { MentorMatchThemeRoot, Button, Card } from '@/mentormatch/design-system';

export default function Page() {
  return (
    <MentorMatchThemeRoot theme="light" brand="#33820D">
      <Card>
        <h1 className="mm-h1">Onde mentoria vira sistema</h1>
        <Button pill>Comecar</Button>
      </Card>
    </MentorMatchThemeRoot>
  );
}
```

## O que tem

| Area | Arquivo | Notas |
|---|---|---|
| Tokens | `tokens.css` | brand (injetavel) + neutral/semantic fixos + raio + sombra. Dark via `.mm[data-theme="dark"]`. |
| Tipografia + componentes (CSS) | `components.css` | classes `mm-display/h1/h2/h3/body/label`, `mm-btn`, `mm-card`, `mm-input`, `mm-chip`, `mm-badge`, `mm-progress`, modal/toast/skeleton/empty. |
| Fontes | `fonts.ts` | Plus Jakarta Sans (400-700) + JetBrains Mono, `display:swap`, escopadas. |
| Brand white-label | `brand.ts` | injeta `--brand`; escolhe `--brand-contrast` por contraste WCAG (>=4.5:1). `hover/soft/ring` derivam por `color-mix`. |
| Tema/wrapper | `ThemeRoot.tsx` | aplica `.mm`, `data-theme`, fontes e brand. |
| Motion | `motion.tsx` | `Reveal`, `Stagger`, `StaggerItem`, `EASE`, `DUR`. `useReducedMotion()` em todos. |
| Componentes React | `components/` | Button/IconButton, Card, Input/Field, Chip, Badge, Progress, Modal, Toast, Skeleton, EmptyState. |

## White-label

Tenant define apenas `--brand` (+ logo). `brandStyle(hex)` calcula o contraste do
texto e injeta no wrapper. Neutros e semanticos nunca mudam.

```tsx
<MentorMatchThemeRoot brand={tenant.brandHex} theme={tenant.theme}>
```

## Desvios conscientes da spec (para nao alterar o an-site)

- Tokens em `.mm` em vez de `:root`; dark em `.mm[data-theme]` em vez de global.
- Fonte aplicada no escopo `.mm`, sem mexer em `fontFamily` do `tailwind.config.ts`.
- `--brand-hover/soft/ring` derivados por `color-mix` (a spec permite auto-derivar).

## Relacao com o Sprint 1 (deprecado)

O Sprint 1 (`src/styles/themes/*`, `src/components/mentormatch/ui/*`, tokens
`.theme-dark`/`--accent`/Inter) foi a primeira tentativa e e **superado** por
este DS conforme D022. Migrar as telas para este sistema; o Sprint 1 deve ser
removido quando nada mais o referenciar.
