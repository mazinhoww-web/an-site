# M6-POLIMENTO.md — Polimento pós-launch

> Milestone M6. Corrige problemas reais detectados em produção após M5: trajetória factualmente errada, copy com informalidades e falta de acentuação, lime ilegível em vários pontos, hover states que quebram leitura, favicon ausente, fluxo de admin flagged pelo Safe Browsing.
>
> Este arquivo é a fonte de verdade da milestone M6. Cada slice é um commit isolado.

---

## Decisões travadas (não negociar)

- **1WIN Performance LATAM NÃO entra na trajetória.** Pular esse capítulo. Sem menções no site (nem em /sobre, nem em /trajetoria, nem em meta tags).
- **Foto editorial em /sobre continua placeholder.** Manter o componente PhotoFrame com lucide User icon e legenda "EM BREVE".
- **Auth rota visível ao usuário é `/admin/login`.** Endpoints `/api/auth/*` nunca aparecem em links clicáveis do site.
- **Lime nunca é cor de texto sobre fundo bone sem mitigação.** Regras de uso na slice 6.2.

---

## SLICE 6.1 — Conteúdo verídico

### Objetivo

Corrigir todos os pontos onde o site está factualmente errado ou com português ruim.

### Tasks

**T6.1.1 — Reescrever página /trajetoria com 5 capítulos reais (sem 1WIN)**

Substituir todo o conteúdo de capítulos atual (que cita "TAG Investimentos") por estes 5 capítulos. Conteúdo abaixo é o texto final, não rascunho.

```
CAPÍTULO 1 — LATAM Pass Brasil
Período: agosto 2024 — presente
Localização: São Paulo, SP (remoto Cuiabá)
Cargo: Coordenador Sênior de Negócios Financeiros
Squad: eLoyalty / New Business

Contexto:
Maior programa de fidelidade da América Latina opera dentro de uma companhia
aérea com 30 anos de operação regulada. O desafio é fazer loyalty deixar de
ser benefício de marketing e virar ativo financeiro, com receita recorrente,
unit economics defensável e produtos próprios.

Mandato:
Coordenar discovery, modelagem e estruturação de novas frentes de negócio
financeiro dentro do programa, conectando produto, parcerias e regulação.
Reporto diretamente para a liderança de New Business e atuo como interlocutor
com áreas legais, tecnologia, riscos e produto.

Movimento:
Estruturação de produtos financeiros próprios em parceria com infraestrutura
nacional e internacional. Modelagem completa de unit economics. Discovery de
vendors com critérios técnicos e regulatórios. Frameworks autorais aplicados
no dia a dia (Método Jet, GSD2, Innovation2Business).

Resultado:
Frentes de negócio ativas em estágio avançado de validação. Pipeline de
parcerias estratégicas em curso. Inteligência competitiva contínua sobre o
mercado de loyalty no Brasil.

Aprendizado:
Em ecossistema regulado, parceria não é commodity. Quem entra antes na
modelagem regulatória trava vantagem estrutural difícil de reverter.

---

CAPÍTULO 2 — CRDC Central de Recebíveis e Direitos Creditórios
Período: outubro 2023 — agosto 2024 (11 meses)
Localização: São Paulo, SP
Cargo: Product Owner Recebíveis Agro

Contexto:
Registradora autorizada pelo Banco Central operando no segmento de recebíveis
do agronegócio. O setor vinha da consolidação regulatória que tornou o
registro de duplicatas e CPRs obrigatório, abrindo nova fronteira de produto
para o mercado financeiro agro.

Mandato:
Owner do produto de Recebíveis Agro. Responsável pela visão, roadmap,
priorização e entrega das funcionalidades que conectam emissores, registradoras
e financiadores no fluxo de CPR e títulos do agro.

Movimento:
Discovery com bancos, traders e produtores. Especificação de requisitos
funcionais e regulatórios. Coordenação de squad técnica em desenvolvimento.
Documentação de fluxos para áreas de compliance.

Resultado:
Produto entregue em condição de operar registro de recebíveis do agro dentro
da regulação BCB vigente, com fluxo auditável e integrável a sistemas
externos de bancos parceiros.

Aprendizado:
Em produtos regulados, especificação não é luxo. É o que separa entrega que
opera de entrega que precisa ser refeita após auditoria.

---

CAPÍTULO 3 — CERC Central de Recebíveis
Período: maio 2021 — setembro 2023 (2 anos e 5 meses)
Localização: São Paulo, SP
Cargo: Officer de Produtos / Product Manager Recebíveis

Contexto:
Registradora autorizada pelo BCB disputando market share contra a B3 no
registro de recebíveis. Mercado novo, regulação em construção, oportunidade
de moldar produto e categoria ao mesmo tempo.

Mandato:
Owner de produtos no eixo de recebíveis e títulos: CCB, CPR, CPR Verde, CDCA
e Registro Digital. Liderar discovery, estruturar produto, coordenar área
comercial e operar relacionamento com bancos, registradoras e órgãos
reguladores.

Movimento:
Lançamento do primeiro registro de CPR Verde do Brasil. Construção do produto
CPR Registry de ponta a ponta. Crescimento de market share contra incumbente
até atingir 60% do segmento. Articulação regulatória contínua com BCB e
participantes do mercado.

Resultado:
R$ 70 bilhões em ativos registrados sob o produto CPR Registry. Market share
de 60% no segmento de CPR contra a B3. Primeira CPR Verde do Brasil
registrada. Reconhecimento como referência no segmento de recebíveis agro.

Aprendizado:
Marca não vence por marketing em mercado regulado. Vence por entrega de
produto que opera dentro da norma, com tempo de processamento menor e
documentação rastreável.

---

CAPÍTULO 4 — Stone Pagamentos
Período: abril 2019 — maio 2021 (2 anos e 2 meses)
Localização: São Paulo, SP
Cargo: Key Account Manager / Especialista em Produtos

Contexto:
Adquirente em alta velocidade de crescimento operando contra incumbentes
(Cielo, Rede) com proposta de atendimento humano e tecnologia direta.
Plataforma ABC concentrava redes de franquias e grandes varejistas como
camada estratégica de receita.

Mandato:
Gerenciar carteira de redes e franquias na plataforma ABC. Estruturar
produtos sob medida para grandes varejistas com volumes acima da média do
mercado. Operar como ponte entre cliente, produto e tecnologia.

Movimento:
Negociação de condições comerciais com redes nacionais. Customização de
produto para necessidades específicas. Atendimento técnico e comercial
integrado. Suporte a decisões de roadmap de produto a partir de demanda real
do varejo.

Resultado:
Carteira de redes e franquias ativa e crescente. Casos de sucesso usados
internamente como referência para estruturação de novos produtos para
varejistas de grande porte.

Aprendizado:
Atendimento técnico não é despesa. Em varejo de alto volume, é o que
sustenta a relação além do preço.

---

CAPÍTULO 5 — Início internacional e formação
Período: 2014 — 2020
Localização: Cuiabá MT, Brisbane Austrália, São Paulo SP

Contexto:
Comecei a carreira ainda na graduação, alternando operação no agro com
formação técnica e experiência internacional. Esses anos formaram a base de
três competências centrais: negócios financeiros, operação no agro e
construção de produto em ambiente de incerteza.

Movimento:
- 99Taxis em Cuiabá: operação local de expansão da plataforma de mobilidade
  em mercado regional. Aprendizado de aquisição, operação e relação com
  motoristas em mercado emergente.
- Syngenta em Cuiabá: experiência inicial em agronegócio com foco em
  distribuição e operação comercial regional.
- HarkHark em Brisbane (Austrália): coordenação operacional de plataforma de
  delivery com USD 2M+ em GMV e 264+ restaurantes parceiros. Primeiro contato
  com gestão internacional e produto digital de marketplace.
- Formação: graduação em Administração na UniC (Cuiabá), MBA, curso na Tera,
  curso na FGV, intercâmbio na IH Brisbane.

Aprendizado:
A combinação de operação no agro, mobilidade e marketplace internacional
montou um repertório raro: regulação, distribuição física e produto digital
no mesmo currículo. Foi o que destravou as próximas fases.
```

**Implementação:** se existe seed file `supabase/seed.sql` ou `drizzle/seed.ts` com `career_chapters`, atualizar os registros. Se está hardcoded em `src/data/trajetoria.ts` ou similar, substituir. Se está na tabela do banco, gerar SQL migration para `UPDATE career_chapters SET ...` por slug ou id, ou um seed script novo que limpa e reinsere.

**Critério:** página /trajetoria renderiza exatamente esses 5 capítulos, na ordem reverse-chronological (LATAM Pass primeiro, formação por último).

**T6.1.2 — Corrigir bio em /sobre**

Substituir o texto atual de bio (que cita "TAG Investimentos") por:

```
Comecei em operação no agro em Mato Grosso, passei por adquirência na Stone,
mercados de capitais na CERC (registradora de recebíveis com R$ 70B+ em
ativos, liderando expansão comercial e fechando 60% de market share em CPR)
e CRDC. Hoje coordeno novas frentes de negócios financeiros na LATAM Pass,
combinando produtos próprios, parcerias estratégicas e inovação aplicada ao
maior programa de fidelidade da América Latina.

O case do registro da primeira CPR Verde do Brasil, ainda na CERC, ilustra
o tipo de entrega que persigo: produto que cria categoria nova dentro da
regulação existente, com participantes alinhados desde o desenho.

O fio condutor é sempre o mesmo: produto que entende o usuário, parceria
que destrava capital, regulação que cabe no desenho. Frameworks autorais
como Método Jet, GSD2 e Innovation2Business traduzem essa visão em
execução de squad.
```

**Critério:** página /sobre não menciona "TAG Investimentos" nem "TAG" como empresa em lugar nenhum.

**T6.1.3 — Auditoria de acentuação e copy em todas as páginas**

Buscar e corrigir em TODOS os arquivos `.tsx` e `.ts` de `src/app/(public)/`, `src/components/`, `src/data/` (e qualquer arquivo de seed do banco):

| Trocar | Por |
|--------|-----|
| `eh` (como verbo "é") | `é` |
| ` he ` (como verbo "é" em PT) | ` é ` |
| `nao` | `não` |
| `operacao`, `operacoes` | `operação`, `operações` |
| `estrategia`, `estrategico` | `estratégia`, `estratégico` |
| `Onde estrategia vira sistema` | `Onde estratégia vira sistema` |
| `gestao` | `gestão` |
| `cronologica reversa` | `cronológica reversa` |
| `painelista` (manter, está correto) | `painelista` |
| `Loyalty como ativo financeiro em cooperativas de credito` | `Loyalty como ativo financeiro em cooperativas de crédito` |
| `Credito embarcado` | `Crédito embarcado` |
| `originadores de valor financeiro` (ok) | (ok) |
| `Participacao` | `Participação` |
| `gravado em parceria` (ok) | (ok) |
| `Apresentacao` | `Apresentação` |
| `Recebo newsletter` ou `recebo newsletter` (em forms) | `Quero receber novidades` |
| `inscreva-se` (em CTA) | `Inscrever-se` ou `Quero receber` |
| `Quem eh Aurimar Nogueira` | `Quem é Aurimar Nogueira` |
| `Sao Paulo` | `São Paulo` |
| `voce`, `voces` | `você`, `vocês` |
| `nucleo`, `nucleos` | `núcleo`, `núcleos` |
| `principios` | `princípios` |
| `metricas` | `métricas` |
| `decada` | `década` |
| `numeros` | `números` |
| `noticia`, `noticias` (em copy de título) | `notícia`, `notícias` |
| `proximo`, `proxima` | `próximo`, `próxima` |
| `proximos`, `proximas` | `próximos`, `próximas` |
| `tambem` | `também` |
| `ja` (advérbio) | `já` |
| `nos` (pronome) | `nós` |
| `voce`, `voces` | `você`, `vocês` |
| `ate` (preposição) | `até` |
| `apos` | `após` |
| `comecei`, `comecou` | `comecei`, `começou` (com ç) |
| `comecar` | `começar` |
| `unico`, `unica` | `único`, `única` |
| `historia` | `história` |
| `categoria` (ok) | (ok) |
| `pratica`, `praticas` | `prática`, `práticas` |
| `metodo`, `metodos` | `método`, `métodos` |
| `politica` | `política` |
| `analise` | `análise` |

**Importante:** NÃO trocar acentos em URLs, slugs, ou nomes de arquivos. Apenas em strings de copy (visível ao usuário).

**Importante:** preservar a regra de brand: NUNCA usar em-dash (`—`). Usar hyphen (`-`), vírgula ou ponto.

**Importante:** NÃO usar emojis em copy de UI.

**Critério:**
- [ ] Search global no projeto por ` eh ` (com espaços) retorna zero ocorrências em arquivos de copy
- [ ] Search por ` nao ` retorna zero ocorrências
- [ ] Search por `estrategia` (sem acento) retorna zero ocorrências
- [ ] Heading h1 do hero da home mostra "Onde estratégia vira sistema." (com acento)
- [ ] Heading h1 de /sobre mostra "Quem é Aurimar Nogueira" (com acento)
- [ ] Heading h1 de /eventos mostra "Palestras, painéis e mesas" (com acentos)

---

## SLICE 6.2 — Legibilidade do lime

### Objetivo

Lime sobre fundo bone (#F5F4EF) tem contraste ~2.3:1 contra ink — falha WCAG AA. Lime como cor de texto fica ilegível, especialmente em corpo de texto. Vamos refazer as 4 regras de uso.

### Regras travadas

**REGRA 1 — Lime como background bar (highlight de keyword)**
Permitido. Texto sobre o lime deve ser ink (#0A0A0A). Background lime cobre 60-90% da altura da letra, criando efeito marca-texto.

Aplicar em: palavra "sistema" no hero, palavra "vira" se tiver, qualquer keyword editorial onde queremos destaque tipográfico.

**Implementação CSS:**
```css
.lime-highlight {
  background: linear-gradient(transparent 60%, var(--lime) 60%, var(--lime) 90%, transparent 90%);
  padding: 0 0.04em;
  color: var(--ink);
}
```

**REGRA 2 — Lime como dot prefix**
Permitido. Eyebrows e labels recebem um lime dot antes do texto. Texto continua em graphite (#4A4A4A) ou ink.

Aplicar em: eyebrows como "QUEM", "AGORA", "EM NÚMEROS", "ONDE FALEI", "EVENTOS", "SOBRE", "TRAJETÓRIA".

**Implementação:**
```tsx
<span className="eyebrow">
  <span className="lime-dot">•</span>
  <span className="label-text">QUEM</span>
</span>
```

```css
.eyebrow { display: inline-flex; gap: 8px; align-items: center; }
.lime-dot {
  color: var(--lime);
  font-size: 1em;
  line-height: 1;
}
.label-text {
  font-family: var(--m); /* JetBrains Mono */
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--graphite);
  font-weight: 500;
}
```

**REGRA 3 — Lime como underline animada**
Permitido. Links e CTAs ghost recebem underline lime que cresce no hover. Texto continua em ink.

```css
.link-editorial {
  color: var(--ink);
  text-decoration: none;
  background-image: linear-gradient(var(--lime), var(--lime));
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0 2px;
  transition: background-size 200ms ease-out;
  padding-bottom: 2px;
}
.link-editorial:hover {
  background-size: 100% 2px;
}
```

**REGRA 4 — Lime como border de elemento small**
Permitido. Border 1-2px lime ao redor de badges, focus rings, lime bar 4px na base do PhotoFrame, scroll progress bar.

### Tasks

**T6.2.1 — Audit visual e mapeamento**

Em desenvolvimento local, abrir cada página, identificar todo texto puramente lime (cor da fonte = lime). Listar em comentário no commit:

```
Página /eventos:
- "Loyalty como ativo financeiro em cooperativas de credito" (subtítulo do evento) → lime puro, ilegível
- "Credito embarcado e programas de fidelidade como originadores de valor" → lime puro, ilegível
- Botão "TODOS" ativo → texto graphite em bg lime, ilegível

Página home (/):
- Eyebrow "QUEM" → lime puro, ilegível
- Palavra "vira" no h1 → atualmente lime puro como texto, mudar para REGRA 1 (background bar)
- Footer link "trajetoria completa →" → lime puro, mudar para REGRA 3

[continuar para todas as páginas]
```

**T6.2.2 — Aplicar regras**

Para cada ocorrência identificada, aplicar a regra correta:
- Highlight de keyword no hero → REGRA 1
- Eyebrow → REGRA 2
- Link editorial inline → REGRA 3
- Border de badge/focus → REGRA 4

**Caso especial: subtítulos de eventos**
Os textos `Loyalty como ativo financeiro em cooperativas de credito` e `Credito embarcado e programas de fidelidade como originadores de valor` estão em lime puro. Trocar para:
- **Cor:** `var(--ink)` (preto)
- **Peso:** 500 (em vez de o que está agora)
- **Adicionar lime dot prefix** se quiser manter sinalização visual

**Caso especial: filter pills ("TODOS", "PALESTRANTE", etc)**
- Estado inativo: bg transparent, border 1px hairline, text graphite, mono uppercase
- Estado ativo: bg transparent, border 1px ink, text ink, underline lime 2px na base (não bg lime)
- Hover inativo: border passa de hairline para ink, sem mudança de cor

**T6.2.3 — Criar componente `<Eyebrow>` reutilizável**

`src/components/brand/Eyebrow.tsx`:

```tsx
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] font-medium text-graphite ${className}`}>
      <span className="text-lime leading-none">•</span>
      <span>{children}</span>
    </span>
  );
}
```

Substituir em todo lugar onde tem texto label/eyebrow lime puro.

**Critério:**
- [ ] Nenhum texto puramente lime sobre bone background
- [ ] Eyebrows usam o padrão `<Eyebrow>` (lime dot + ink/graphite text)
- [ ] Highlight de keyword usa background bar lime, não texto lime
- [ ] Filter pills ativas têm contraste ≥ 4.5:1
- [ ] Lighthouse Accessibility na home ≥ 95

---

## SLICE 6.3 — Hover states e botões

### Objetivo

Eliminar todo hover state que reduz contraste abaixo de 4.5:1.

### Tasks

**T6.3.1 — Botão primário (ink)**

Estado default e hover:
```css
.btn-primary {
  background: var(--ink);
  color: var(--bone);
  border: 1px solid var(--ink);
  font-family: var(--m);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  padding: 14px 24px;
  transition: all 200ms ease-out;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-primary:hover {
  background: var(--ink);
  color: var(--lime); /* lime no hover é OK pois bg ink dá contraste ≥ 7:1 */
  border-color: var(--ink);
}
.btn-primary .arrow {
  transition: transform 200ms ease-out;
}
.btn-primary:hover .arrow {
  transform: translateX(4px);
}
```

**T6.3.2 — Botão secundário (ghost)**

```css
.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
  /* mesmas tipografias do primary */
}
.btn-ghost:hover {
  background: transparent;
  color: var(--ink); /* mantém ink, não vira lime */
  border-color: var(--ink);
  /* lime aparece como underline interno */
  box-shadow: inset 0 -2px 0 var(--lime);
}
```

**T6.3.3 — Link arrow / external**

```css
.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--ink);
  font-family: var(--m);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
}
.link-arrow .arrow-icon {
  transition: transform 200ms ease-out;
}
.link-arrow:hover .arrow-icon {
  transform: translate(4px, -4px);
  color: var(--lime); /* só o ícone vira lime, texto continua ink */
}
```

**T6.3.4 — Filter pills**

Conforme T6.2.2. Reforçando:
- Default: text graphite, border hairline
- Active: text ink, border ink, underline lime 2px
- Hover (não-ativo): text ink, border ink, sem underline

**T6.3.5 — Card hover**

Cards de evento, skill, etc:
```css
.card {
  border: 1px solid var(--hairline);
  transition: border-color 200ms ease-out;
}
.card:hover {
  border-color: var(--ink); /* nunca lime na border principal */
}
.card:hover .external-arrow {
  color: var(--lime); /* lime apenas no ícone */
  transform: translate(4px, -4px);
}
```

**Critério:**
- [ ] Botão primário: ink bg + lime text apenas no hover (contraste OK)
- [ ] Botão ghost: nunca tem bg lime; lime aparece como underline interno
- [ ] Filter pills ativas: text ink + underline lime, não bg lime
- [ ] Cards: border vira ink no hover, lime aparece só no ícone arrow

---

## SLICE 6.4 — Favicon e manifesto

### Objetivo

Adicionar favicon AN. e configurar metadados do site.

### Tasks

**T6.4.1 — Gerar favicons**

Como o ambiente local pode não ter ImageMagick, gerar via Next.js `icon.tsx` (App Router):

`src/app/icon.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "#F5F4EF",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          color: "#0A0A0A",
          letterSpacing: "-0.02em",
        }}
      >
        AN<span style={{ color: "#CCFF00" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
```

Next.js detecta `src/app/icon.tsx` automaticamente e gera o favicon.

**T6.4.2 — Apple touch icon**

`src/app/apple-icon.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "#F5F4EF",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 800,
          color: "#0A0A0A",
          letterSpacing: "-0.02em",
        }}
      >
        AN<span style={{ color: "#CCFF00" }}>.</span>
      </div>
    ),
    { ...size }
  );
}
```

**T6.4.3 — Web manifest**

`src/app/manifest.ts`:
```ts
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AN. Aurimar Nogueira",
    short_name: "AN.",
    description: "Onde estratégia vira sistema.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F4EF",
    theme_color: "#0A0A0A",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
```

**T6.4.4 — Metadata em layout root**

Em `src/app/layout.tsx`, garantir que `metadata` tem:
```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://aurimarnogueira.com.br"),
  title: { default: "AN. Aurimar Nogueira", template: "%s · AN." },
  description: "Loyalty, fintech e inovação aplicada em ecossistemas regulados. Site pessoal de Aurimar Nogueira.",
  // icons gerados automaticamente por src/app/icon.tsx e apple-icon.tsx
};
```

**Critério:**
- [ ] Favicon AN. aparece na aba do navegador em produção (forçar Cmd+Shift+R)
- [ ] `/icon` e `/apple-icon` retornam 200 com PNG
- [ ] `/manifest.json` retorna JSON válido

---

## SLICE 6.5 — Admin fora do Safe Browsing flag

### Objetivo

Garantir que o admin é acessível mesmo enquanto o flag "Dangerous site" não cai. Mover qualquer URL visível de `/api/auth/*` para um caminho friendly.

### Tasks

**T6.5.1 — Confirmar que `/admin/login` é a rota visível**

A página `/admin/login` já existe (criada em M4.1). Confirmar:
- Botão "Receber magic link" chama Server Action que internamente faz signIn do NextAuth, mas a URL no browser fica `/admin/login` (não vai para `/api/auth/signin`)
- Email do magic link aponta para `${NEXT_PUBLIC_SITE_URL}/admin` (que após auth manda para dashboard)

Se atualmente algum link clicável (no rodapé do site, footer, ou botão "Entrar" qualquer) leva para `/api/auth/signin`, REMOVER esse link. Substituir por `/admin/login` ou simplesmente remover (admin não precisa de link público).

**T6.5.2 — Verificar callbacks do NextAuth**

Em `src/lib/auth.ts`, conferir:
```ts
pages: {
  signIn: "/admin/login",       // página customizada, não default /api/auth/signin
  verifyRequest: "/admin/login?check=email",  // página de "verifique email"
  error: "/admin/login?error=",
}
```

Se `pages.signIn` não está setado, NextAuth usa `/api/auth/signin` (default). Setar explicitamente para `/admin/login`.

**T6.5.3 — Submit pedido de revisão Safe Browsing**

Não é uma task técnica, é externa. Documentar em `M6-POLIMENTO.md` (este arquivo):

```
Aurimar deve manualmente:
1. Abrir https://safebrowsing.google.com/safebrowsing/report_error/?hl=pt-BR
2. Informar URL: https://aurimarnogueira.com.br/
3. Marcar "Este site não é perigoso"
4. Justificar: "Site pessoal recém-lançado, domínio registrado em maio 2026,
   sem conteúdo malicioso. Flag falso positivo provavelmente por DNS
   propagation incompleta e endpoint de auth /api/auth/signin."
5. Enviar
```

**Critério:**
- [ ] Nenhum link clicável do site público leva para `/api/auth/*`
- [ ] `/admin/login` é a única rota de entrada do admin
- [ ] NextAuth `pages.signIn` setado para `/admin/login`
- [ ] Pedido de revisão Safe Browsing enviado (manual, fora do código)

---

## SLICE 6.6 — Layout da seção "Quem" na home

### Objetivo

A seção "QUEM / Construo produto em mercados que não perdoam improviso" na home está com layout estranho. Refazer com hierarquia editorial mais clara.

### Estrutura nova

```
[Eyebrow]            • QUEM

[H2 display-xl]      Construo produto em mercados que
                     não perdoam improviso.

[Hairline 1px full-width]

[Grid 2 colunas, gap 64px desktop, stack mobile]:

  LEFT (1fr):
    Body Inter 17px line-height 1.6:
    
    "Comecei em operação no agro, passei por adquirência,
    mercados de capitais e hoje trabalho na maior companhia
    aérea da América Latina. O que muda entre uma fase e outra
    é a indústria. O que segue igual é o triângulo: produto
    que entende o usuário, parceria que destrava capital,
    regulação que cabe no desenho."
    
    [margin-top 24px]
    
    "A pegada autoral começou cedo. Frameworks como Método
    Jet, GSD2 e Innovation2Business foram construídos
    para sair da teoria e operar em squad real, com OKR
    mensurável e profit share por iniciativa."
    
    [margin-top 32px]
    
    [Link editorial com lime underline animada]
    LER TRAJETÓRIA COMPLETA →    (link para /trajetoria)
  
  RIGHT (1fr):
    [Stack vertical com hairline separators]:
    
    Linha 1:
      [Mono 11px graphite]  ATUAL
      [Display 20px ink]    LATAM Pass Brasil
      [Mono 11px smoke]     desde 2024
    
    Linha 2:
      [Mono 11px graphite]  ANTERIORES
      [Display 20px ink]    CRDC · CERC · Stone
    
    Linha 3:
      [Mono 11px graphite]  BASE
      [Display 20px ink]    Cuiabá, MT
      [Mono 11px smoke]     remoto para SP
```

### Tasks

**T6.6.1 — Refazer `src/app/(public)/page.tsx` seção "QUEM"**

Substituir o bloco atual da seção QUEM por essa estrutura. Manter Container, SectionHead helpers se existirem.

**T6.6.2 — Garantir mobile**

Em mobile (< 768px):
- Grid vira stack vertical
- LEFT vem primeiro (texto)
- RIGHT vem depois (metadados)
- Gap vertical 48px entre os dois

**T6.6.3 — Verificar que outras seções da home seguem padrão consistente**

Conferir que AGORA, FERRAMENTAS, EM NÚMEROS, ONDE FALEI todas usam:
- Eyebrow com lime dot prefix (REGRA 2)
- H2 display em Space Grotesk 800
- Hairline divider após o H2
- Conteúdo da seção
- Hairline divider antes da próxima

**Critério:**
- [ ] Seção QUEM tem 2 colunas em desktop, stack em mobile
- [ ] Link "LER TRAJETÓRIA COMPLETA" usa REGRA 3 (lime underline animada)
- [ ] Outras seções da home têm estrutura consistente

---

## Ordem de execução

Execute as slices na ordem 6.1 → 6.2 → 6.3 → 6.4 → 6.5 → 6.6.

Cada slice é um commit isolado:
- `feat(M6.1): corrigir trajetoria com 5 capitulos reais e auditoria de copy`
- `feat(M6.2): legibilidade do lime - regras 1-4 aplicadas`
- `feat(M6.3): hover states sem perda de contraste`
- `feat(M6.4): favicon AN. e web manifest`
- `feat(M6.5): admin via /admin/login, sem links para /api/auth/*`
- `feat(M6.6): refazer secao QUEM na home`

Após cada commit, fazer `git push origin main` para disparar deploy Vercel.

---

## Definição de pronto (M6 completo)

- [ ] Site não menciona "TAG Investimentos" em lugar nenhum
- [ ] /trajetoria mostra 5 capítulos reais (LATAM Pass, CRDC, CERC, Stone, Formação)
- [ ] Não há menção a "1WIN" ou "Performance LATAM" em lugar nenhum
- [ ] Search global por ` eh `, ` nao `, `estrategia` (sem acento) retorna zero ocorrências em copy
- [ ] Nenhum texto puramente lime sobre fundo bone
- [ ] Hover states de botões mantêm contraste ≥ 4.5:1
- [ ] Favicon AN. aparece na aba
- [ ] /api/auth/* nunca aparece como URL visível ao usuário
- [ ] Seção QUEM na home tem layout 2 colunas + hierarquia editorial
- [ ] Lighthouse Accessibility ≥ 95 em todas as páginas
- [ ] Vercel deploy verde após cada commit

---

## Notas finais

- NÃO mexer no DNS, no banco, no Resend, nem em variáveis de ambiente nesta milestone
- NÃO adicionar features novas (admin CRUDs reais, DownloadGate funcional, etc) — isso é M7+
- NÃO mudar o brand book — apenas aplicar corretamente o que já está definido
- Se descobrir algo que não consegue resolver, parar e perguntar antes de inventar solução
