# ICONS-MOTION.md — Catálogo de Ícones Animados AN.

> Todos os ícones do site são animados. Este documento é a fonte única de verdade. Cada ícone tem comportamento default, hover, active, loading, success quando aplicável.

---

## 1. Stack

- **Biblioteca:** `lucide-react` (stroke 1.5px, size 20px padrão)
- **Animação:** `framer-motion` (`motion` wrapper)
- **Componente base:** `<AnimatedIcon>` (descrito na seção 3)
- **Acessibilidade:** todos respeitam `prefers-reduced-motion` (fallback estático)

---

## 2. Princípios

1. **Animação revela função.** Download "puxa para baixo", Send "voa", Lock "estala" ao destravar
2. **Curva padrão:** `cubic-bezier(0.22, 1, 0.36, 1)` em entradas, `easeInOut` em loops
3. **Duração:**
   - Hover: 200ms
   - Click/Active: 280-400ms
   - Loading: loop infinito 1200ms
   - Success: one-shot 600ms
4. **Cor:** segue o contexto (ink default, lime ao ativar, smoke quando disabled)
5. **Sem rotação contínua decorativa.** Spinners só durante loading real

---

## 3. Componente base

Arquivo: `src/components/brand/AnimatedIcon.tsx`

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  size?: number;
  className?: string;
  state?: "default" | "hover" | "active" | "loading" | "success";
  animation?: "pulse" | "bounce" | "rotate" | "shake" | "fly" | "scale" | "draw" | "none";
  ariaLabel?: string;
};

export function AnimatedIcon({
  icon: Icon,
  size = 20,
  className = "",
  state = "default",
  animation = "none",
  ariaLabel,
}: Props) {
  const reduce = useReducedMotion();

  const variants = {
    pulse: { scale: [1, 1.1, 1], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" } },
    bounce: { y: [0, -4, 0], transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    rotate: { rotate: 360, transition: { duration: 1.2, repeat: Infinity, ease: "linear" } },
    shake: { x: [0, -2, 2, -2, 2, 0], transition: { duration: 0.4 } },
    fly: { x: 40, y: -40, opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    scale: { scale: 1.15, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
    draw: { pathLength: [0, 1], transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    none: {},
  };

  if (reduce) {
    return <Icon size={size} className={className} aria-label={ariaLabel} strokeWidth={1.5} />;
  }

  return (
    <motion.span
      animate={variants[animation]}
      className={`inline-flex ${className}`}
      aria-label={ariaLabel}
    >
      <Icon size={size} strokeWidth={1.5} />
    </motion.span>
  );
}
```

---

## 4. Catálogo completo

Todos os ícones em uso no site, agrupados por contexto.

### 4.1 Navegação

| Ícone (lucide) | Onde | Default | Hover | Active |
|---|---|---|---|---|
| `Menu` | Nav mobile fechado | estático | scale 1.1 | rotate -90 (transforma em X) |
| `X` | Nav mobile aberto | estático | scale 1.1 | rotate 90 (transforma em Menu) |
| `ChevronDown` | Submenu / accordion | estático | y +2 | rotate 180 |
| `ArrowUp` | Botão "voltar ao topo" | aparece com fade no scroll > 600px | y -4 | scroll to top |
| `ArrowRight` | Link interno "saiba mais" | estático | x +4 | x +8 |
| `ArrowUpRight` | Link externo | estático | x +4, y -4 | igual hover |
| `ExternalLink` | Link externo em texto | estático | scale 1.1 | igual hover |

### 4.2 Hero e Home

| Ícone | Onde | Comportamento |
|---|---|---|
| `ChevronDown` | Scroll indicator no hero | bounce loop 2s (y 0 → 8 → 0) com pausa de 1s entre ciclos |
| `Sparkles` | Eyebrow "LOYALTY × FINTECH × INNOVATION" | pulse sutil 0.95-1.05 loop 4s |
| `ArrowRight` | CTA primário "Ver trabalho" | x +4 no hover |

### 4.3 Mark (logo)

O ponto lime do "AN." pulsa scale 1 → 1.3 → 1 uma vez ao mount da página (480ms). Não loop.

```tsx
<motion.span
  className="text-lime"
  initial={{ scale: 0.7, opacity: 0 }}
  animate={{ scale: [0.7, 1.3, 1], opacity: 1 }}
  transition={{ duration: 0.48, times: [0, 0.6, 1], ease: [0.22, 1, 0.36, 1] }}
>.</motion.span>
```

### 4.4 Skills Hub

| Ícone | Onde | Comportamento |
|---|---|---|
| `Box` | SkillCard ícone principal | hover: rotate Y 12deg + scale 1.05 (efeito 3D leve via CSS transform-style preserve-3d) |
| `Download` | Botão "Baixar skill" | hover: y +2 (puxa para baixo). Click: y +20 + opacity 0, depois reset |
| `FileText` | Skill detalhe (preview de conteúdo) | hover: scale 1.05 |
| `Layers` | Categoria de skill | estático |
| `Filter` | Filtro de skills | hover: rotate 8deg |
| `Search` | Busca de skills (futuro) | hover: scale 1.1, focus do input: scale 1.15 + cor lime |

### 4.5 DownloadGate (modal de captura)

| Ícone | Onde | Comportamento |
|---|---|---|
| `Lock` | Estado inicial do modal | ao abrir: scale 0.5 → 1 + rotate -10 → 0 em 400ms |
| `Mail` | Após inserir email válido | substitui Lock com cross-fade 280ms |
| `CheckCircle` | Sucesso após envio | draw (pathLength 0 → 1) + scale 0.8 → 1.1 → 1 em 600ms, cor lime |
| `X` | Botão fechar modal | hover: rotate 90deg + scale 1.1 |
| `Loader2` | Loading durante envio | rotate infinito 1200ms linear |
| `AlertCircle` | Erro de validação | shake (x: 0, -2, 2, -2, 2, 0) em 400ms, cor error |

### 4.6 Newsletter (rodapé e inline)

| Ícone | Onde | Comportamento |
|---|---|---|
| `Send` | Botão submit | hover: x +2, y -2 (decola). Click: fly (x +40, y -40, opacity 0) em 500ms, depois aparece CheckCircle |
| `CheckCircle` | Pós-submit sucesso | draw + scale, lime, mostra por 3s depois fade out |
| `Mail` | Input de email (ícone à esquerda) | focus do input: cor passa de smoke para ink |
| `Loader2` | Durante submit | rotate infinito |

### 4.7 Contato

| Ícone | Onde | Comportamento |
|---|---|---|
| `Send` | Botão "Enviar mensagem" | mesmo padrão Newsletter |
| `Phone` | Meta de contato | hover: shake leve (sugere "ligando") |
| `MessageSquare` | Meta WhatsApp | hover: scale 1.1 + rotate 4deg |
| `MapPin` | Localização (Cuiabá) | hover: y -2 |
| `Linkedin` | Social | hover: scale 1.15 + cor lime |
| `Github` | Social | hover: scale 1.15 + cor lime |

### 4.8 Projetos

| Ícone | Onde | Comportamento |
|---|---|---|
| `ArrowUpRight` | Card de projeto (canto superior direito) | hover do card inteiro: ícone x +4, y -4 + cor lime |
| `ExternalLink` | Link "Ver projeto ao vivo" | hover: scale 1.1 |
| `Github` | Link "Ver repositório" | hover: scale 1.15 |
| `Calendar` | Ano do projeto | estático |
| `Tag` | Categoria | estático |

### 4.9 Notícias

| Ícone | Onde | Comportamento |
|---|---|---|
| `Calendar` | Data da notícia | estático |
| `ArrowRight` | "Ler mais" | hover: x +4 |
| `Newspaper` | Empty state | pulse 0.95-1.05 loop |
| `Clock` | "Há X dias" (futuro) | estático |

### 4.10 Trajetória

| Ícone | Onde | Comportamento |
|---|---|---|
| `MapPin` | Marcador de capítulo na timeline | scroll: scale 0 → 1 + pulse uma vez (lime). Hover: scale 1.2 |
| `Briefcase` | Capítulo "função/empresa" | estático |
| `Trophy` | Highlights/conquistas | hover: rotate 8deg + scale 1.1 |
| `Award` | Prêmios | scroll: draw lateral (svg) |
| `TrendingUp` | Métricas de impacto | scroll: path desenha em 600ms |
| `Sparkle` | Frameworks autorais | pulse loop 3s |
| `BookOpen` | "Ler mais sobre este capítulo" | hover: rotate -4deg |

### 4.11 Admin

| Ícone | Onde | Comportamento |
|---|---|---|
| `Plus` | Botão "Novo" | hover: rotate 90deg (vira X visual) |
| `Pencil` | Editar | hover: rotate -10deg + scale 1.1 |
| `Trash2` | Excluir | hover: shake leve (sugere alerta) |
| `Save` | Salvar | hover: scale 1.1. Loading: pulse |
| `Eye` | Visualizar | hover: scale 1.1 |
| `EyeOff` | Despublicar | toggle com Eye |
| `Settings` | Config | hover: rotate 45deg |
| `LogOut` | Sair | hover: x +4 (sugere "saindo") |
| `Upload` | Upload de arquivo | hover: y -4 |
| `Download` | Export | hover: y +4 |
| `Send` | Enviar newsletter | mesmo padrão das outras Send |
| `Users` | Subscribers | hover: scale 1.1 |
| `BarChart3` | Analytics | hover: bars stagger up |
| `Loader2` | Loading global | rotate infinito |

### 4.12 Estados gerais

| Ícone | Onde | Comportamento |
|---|---|---|
| `Check` | Validação inline (form OK) | draw + lime, 280ms |
| `CheckCircle` | Sucesso de ação | draw + scale, 600ms |
| `AlertCircle` | Erro de validação | shake, cor error |
| `Info` | Tooltip | pulse 1x ao aparecer |
| `Loader2` | Loading | rotate infinito |
| `WifiOff` | Offline | shake 1x ao aparecer |

---

## 5. Casos especiais

### 5.1 Logo mark "AN."

O ponto é o único elemento que se anima ao mount. Resto do "AN" entra com fade.

### 5.2 Hairline animado

Não é ícone, mas é tratado aqui pela natureza visual: linhas hairline crescem de 0 para 100% de largura quando entram no viewport, em 800ms ease-out-quint.

### 5.3 SVG customizados (frameworks autorais)

Método Jet Ski, GSD2, Innovation2Business têm SVGs próprios. Cada um anima 1 vez ao entrar no viewport (path draw em 800ms). Hover: scale 1.05.

---

## 6. Implementação

### 6.1 Estrutura de arquivos

```
src/components/brand/
  AnimatedIcon.tsx           # Componente base
  icons/
    MarkDot.tsx              # Ponto lime do logo
    HairlineGrow.tsx         # Hairline que cresce
    FrameworkSvg.tsx         # SVGs autorais animados
```

### 6.2 Uso

```tsx
import { Download, Mail, CheckCircle } from "lucide-react";
import { AnimatedIcon } from "@/components/brand/AnimatedIcon";

// Estático com hover via Tailwind
<Download className="transition-transform group-hover:translate-y-1" />

// Animação programática
<AnimatedIcon icon={Mail} animation="pulse" ariaLabel="Email" />

// Estado controlado por React
const [submitting, setSubmitting] = useState(false);
<AnimatedIcon
  icon={submitting ? Loader2 : Send}
  animation={submitting ? "rotate" : "none"}
/>
```

### 6.3 Acessibilidade

- `prefers-reduced-motion: reduce` → todos os animations viram `none`
- Ícone decorativo: `aria-hidden="true"`
- Ícone com função: `aria-label="..."` descritivo
- Estados de loading: `aria-live="polite"` no container
- Estados de sucesso/erro: `role="status"` ou `role="alert"`

---

## 7. Validação

Antes de marcar uma slice de UI como pronta:

- [ ] Todo ícone está animado conforme este catálogo (não pode haver ícone estático em interativo)
- [ ] `prefers-reduced-motion` testado (DevTools > Rendering > Emulate)
- [ ] Nenhuma animação dura mais que 1200ms (exceto loops)
- [ ] Nenhuma animação é puramente decorativa sem revelar estado/função
- [ ] Ícones sem texto têm `aria-label`
- [ ] Estados (loading, success, error) têm ARIA apropriado

---

## 8. Anti-padrões

- Nunca usar `animate-bounce` ou `animate-spin` do Tailwind em ícones decorativos
- Nunca animar mais de 1 ícone por viewport simultaneamente (cria ruído)
- Nunca fazer ícone girar continuamente sem loading real (parece broken)
- Nunca aplicar lime em ícone que não está em estado ativo ou hover
- Nunca usar duração > 600ms em hover (parece lag)
- Nunca esquecer de respeitar `prefers-reduced-motion`
