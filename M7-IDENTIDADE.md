# M7 - Identidade Visual e Provas Sociais

> Milestone seguinte ao M6 (Polimento). Foco: trocar placeholders por prova visual concreta, corrigir URL pessoal do LinkedIn e introduzir um marquee de logos de parceiros na página de eventos.

---

## Contexto

M1 a M5 em produção. M6 cuidou de conteúdo verídico, legibilidade do lime, hover states, favicon, admin via `/admin/login` e refatoração da seção QUEM na home. Restou trazer prova visual ao site: foto editorial real no `/sobre`, hero photo na home, capas reais nos cards de `/eventos`, link correto do LinkedIn em todo o repo e um marquee horizontal de logos de marcas com as quais Aurimar atuou ou se apresentou.

## Objetivo

Substituir todo placeholder visual remanescente por conteúdo real e adicionar uma camada de prova social em `/eventos` por meio de logos de parceiros em movimento.

## Dependências

- M6 completo e em produção
- Fotos editoriais já em mãos (7 arquivos enviados na sessão de handover)
- Logos SVG dos parceiros a serem sourcing manual antes de executar 7.3

## Decisões travadas (NÃO renegociar)

1. Hero da home recebe a foto Sicredi Summit (palestrando, braço estendido para o slide). Crop deslocado à direita, overlay bone gradient à esquerda para legibilidade do h1.
2. `/sobre` recebe a foto frontal do painel branco (camisa branca, microfone, fundo azul claro). Crop 4:5 portrait.
3. Tratamento global de fotos: grayscale com contraste levemente elevado, frame hairline 1px `#E5E3DC`, sem sombra, sem rounded corner além do que o frame impõe, sem gradiente sobre as próprias fotos (gradiente só no overlay da hero).
4. Logos do marquee em monocromia ink `#0A0A0A`, opacity 0.6 default, 1 no hover. Nunca em cor original. Nunca lime.
5. Marquee respeita `prefers-reduced-motion`: vira grid estático quando o usuário pediu motion reduzido.
6. Pause on hover é obrigatório no marquee (acessibilidade).
7. URL pessoal do LinkedIn em todo o repo é exatamente `https://www.linkedin.com/in/mazinho/`. Qualquer variação é bug.
8. Logos NÃO entram com fundo branco recortado. Devem ser SVGs com fill `currentColor` ou path puro para receber filtro de monocromia consistente.

---

## Slice 7.1 - Fotos editoriais reais

### Objetivo

Eliminar o `lucide User` placeholder no `/sobre`, adicionar hero photo na home e popular cards e corpo de artigos em `/eventos` com imagens reais.

### Mapa de uso das 7 fotos

| Foto original | Destino | Crop | Tratamento |
|---|---|---|---|
| Sicredi Summit palestrando (braço estendido) | Home hero | 21:9 ou 16:9, deslocada à direita | Grayscale + overlay bone à esquerda |
| Painel branco frontal (camisa branca) | `/sobre` PhotoFrame | 4:5 portrait | Grayscale + frame hairline + lime square accent |
| CRMBonus Meet wide do palco | Card de evento CRMBonus | 16:9 | Grayscale + frame hairline |
| CRMBonus Meet foto de grupo | Corpo do artigo CRMBonus | 3:2 | Grayscale, secundária |
| GYRA+ Cubo wide (3 painelistas) | Card de evento GYRA+ | 16:9 | Grayscale + frame hairline |
| GYRA+ Cubo perfil (microfone) | Corpo do artigo GYRA+ | 4:5 portrait | Grayscale, secundária |
| Sicredi Summit colagem em strips | Card de evento Sicredi | 16:9 ou 3:4 (decidir) | Grayscale leve, frame hairline |

### Arquivos esperados em `public/photos/`

```
public/photos/
  aurimar-hero.jpg              (max 2400px de largura, qualidade 85)
  aurimar-editorial.jpg         (max 1200px de largura, qualidade 90)
  evento-crmbonus-meet.jpg      (max 1600px)
  evento-crmbonus-grupo.jpg     (max 1600px)
  evento-gyra-cubo.jpg          (max 1600px)
  evento-gyra-detail.jpg        (max 1200px)
  evento-sicredi-summit.jpg     (max 1600px)
  evento-sicredi-stage.jpg      (max 1600px, crop alternativo da hero)
```

### Tasks

**7.1.1 Preparar arquivos**

- Baixar as 7 fotos para `~/Projects/an-site/.tmp/photos-raw/`
- Renomear conforme mapa acima
- Recortar e redimensionar com `sips` (macOS) ou ImageMagick
- Mover versões finais para `public/photos/`
- NÃO commitar `.tmp/`

Comandos de referência (macOS, ajustar crops manualmente):

```bash
mkdir -p public/photos
cd .tmp/photos-raw

# Hero (16:9, max 2400px de largura)
sips --resampleWidth 2400 sicredi-palestrando.jpeg --out ../../public/photos/aurimar-hero.jpg
sips --setProperty format jpeg --setProperty formatOptions 85 ../../public/photos/aurimar-hero.jpg

# Editorial (4:5, max 1200px)
sips --resampleWidth 1200 painel-branco-frontal.jpeg --out ../../public/photos/aurimar-editorial.jpg
sips --setProperty format jpeg --setProperty formatOptions 90 ../../public/photos/aurimar-editorial.jpg

# Cards de evento (16:9, max 1600px)
sips --resampleWidth 1600 crmbonus-palco.jpeg --out ../../public/photos/evento-crmbonus-meet.jpg
sips --resampleWidth 1600 crmbonus-grupo.jpeg --out ../../public/photos/evento-crmbonus-grupo.jpg
sips --resampleWidth 1600 gyra-cubo-wide.jpeg --out ../../public/photos/evento-gyra-cubo.jpg
sips --resampleWidth 1200 gyra-perfil.jpeg --out ../../public/photos/evento-gyra-detail.jpg
sips --resampleWidth 1600 sicredi-colagem.jpeg --out ../../public/photos/evento-sicredi-summit.jpg
sips --resampleWidth 1600 sicredi-palestrando-alt.jpeg --out ../../public/photos/evento-sicredi-stage.jpg
```

**7.1.2 Atualizar PhotoFrame em `/sobre`**

- Localizar componente `PhotoFrame` (ou criar se ainda não existir)
- Trocar `<User />` lucide icon por `<Image>` do next/image
- Manter caption mono: `AURIMAR NOGUEIRA · LOYALTY × FINTECH × INNOVATION`
- Manter frame hairline e lime square accent (8px no canto inferior esquerdo)

Implementação de referência:

```tsx
import Image from 'next/image'

export function PhotoFrame() {
  return (
    <figure className="photo-frame">
      <div className="photo-frame__media">
        <Image
          src="/photos/aurimar-editorial.jpg"
          alt="Aurimar Nogueira"
          width={800}
          height={1000}
          priority={false}
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <span className="photo-frame__accent" aria-hidden />
      </div>
      <figcaption className="photo-frame__caption">
        AURIMAR NOGUEIRA · LOYALTY × FINTECH × INNOVATION
      </figcaption>
    </figure>
  )
}
```

CSS:

```css
.photo-frame__media {
  position: relative;
  border: 1px solid #E5E3DC;
  background: #F5F4EF;
  aspect-ratio: 4 / 5;
  overflow: hidden;
}
.photo-frame__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
}
.photo-frame__accent {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 8px;
  height: 8px;
  background: #CCFF00;
}
.photo-frame__caption {
  margin-top: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #0A0A0A;
  opacity: 0.7;
}
```

**7.1.3 Adicionar hero photo na home**

- Inserir `<Image>` absoluto dentro da seção hero
- Overlay com `linear-gradient(to right, #F5F4EF 0%, #F5F4EF 35%, transparent 100%)` por cima
- Foto fica à direita, gradient garante que o h1 e tagline à esquerda permaneçam legíveis
- Mobile: foto ocupa background completo com overlay vertical (bone de cima até 70% e transparent até embaixo) para preservar legibilidade

Implementação de referência:

```tsx
<section className="home-hero">
  <div className="home-hero__photo">
    <Image
      src="/photos/aurimar-hero.jpg"
      alt=""
      fill
      priority
      sizes="100vw"
    />
    <div className="home-hero__overlay" aria-hidden />
  </div>
  <div className="home-hero__content">
    <h1>Onde estratégia <span className="underline-lime">vira</span> sistema.</h1>
    <p>LOYALTY × FINTECH × INNOVATION</p>
  </div>
</section>
```

CSS:

```css
.home-hero {
  position: relative;
  min-height: 80vh;
  overflow: hidden;
  background: #F5F4EF;
}
.home-hero__photo {
  position: absolute;
  inset: 0;
}
.home-hero__photo img {
  object-fit: cover;
  object-position: right center;
  filter: grayscale(1) contrast(1.05);
}
.home-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    #F5F4EF 0%,
    #F5F4EF 35%,
    rgba(245, 244, 239, 0) 100%
  );
}
.home-hero__content {
  position: relative;
  z-index: 1;
  max-width: 720px;
  padding: 120px 24px;
}
@media (max-width: 768px) {
  .home-hero__overlay {
    background: linear-gradient(
      to bottom,
      #F5F4EF 0%,
      #F5F4EF 50%,
      rgba(245, 244, 239, 0.7) 100%
    );
  }
}
```

**7.1.4 Popular cards de evento**

- Localizar template de card em `src/components/EventCard.tsx` (ou path equivalente)
- Trocar placeholder por `<Image>` com src do mapa acima
- Adicionar `cover` field no MDX/frontmatter de cada evento se ainda não existir
- Sicredi Summit, CRMBonus Meet, GYRA+ Cubo apontam para suas respectivas fotos

**7.1.5 Inserir fotos secundárias no corpo dos artigos**

- Em `/eventos/sicredi-summit-inovacao` (slug a confirmar): incluir `evento-sicredi-stage.jpg` no corpo
- Em `/eventos/crmbonus-meet`: incluir `evento-crmbonus-grupo.jpg` no corpo
- Em `/eventos/gyra-cubo-embedded-credit`: incluir `evento-gyra-detail.jpg` no corpo
- Todas com mesmo tratamento grayscale + frame hairline

### Must-haves verificáveis

- [ ] `/sobre` não tem mais `lucide User` icon, exibe foto real
- [ ] Home tem hero photo com h1 e tagline legíveis (contraste mínimo AA no h1)
- [ ] Mobile da home preserva legibilidade do h1 sobre a foto
- [ ] Todos os cards em `/eventos` exibem imagem real, zero placeholder
- [ ] Cada artigo de evento tem ao menos 1 foto no corpo
- [ ] Todas as imagens passam por `next/image` (validar via grep por `<img` tag manual)
- [ ] Lighthouse mobile LCP segue 90+ na home
- [ ] Console limpo, zero warning de aspect-ratio do next/image

### Commit proposto

```
feat(visual): integrar fotos editoriais em /sobre, hero e /eventos

- Substitui PhotoFrame placeholder por foto real em /sobre
- Adiciona hero photo na home com overlay bone
- Popula cards de evento (Sicredi, CRMBonus, GYRA+) com capas reais
- Inclui fotos secundárias no corpo dos artigos de evento
- Aplica tratamento global: grayscale, contraste +5%, frame hairline #E5E3DC
```

---

## Slice 7.2 - LinkedIn URL correta (mazinho)

### Objetivo

Garantir que todo link para o LinkedIn pessoal de Aurimar no repo aponta para `https://www.linkedin.com/in/mazinho/`.

### Tasks

**7.2.1 Auditoria completa**

```bash
grep -rn "linkedin.com" src/ public/ content/ --include="*.tsx" \
  --include="*.ts" --include="*.md" --include="*.mdx" \
  --include="*.json" --include="*.yml"
```

Listar cada ocorrência. Separar:
- Links pessoais de Aurimar (corrigir para `/in/mazinho/`)
- Links de outras pessoas citadas (validar individualmente, manter)
- Referências a empresas (URLs `/company/` separadas, manter)

**7.2.2 Substituir ocorrências pessoais**

Suspeitos prováveis (validar):

- `src/lib/constants.ts` (variável `LINKEDIN_URL` ou similar)
- `src/components/Footer.tsx`
- `src/components/Header.tsx`
- `src/components/SocialLinks.tsx`
- `src/app/contato/page.tsx`
- `src/app/sobre/page.tsx`
- Frontmatter de qualquer MDX que cite "meu LinkedIn"
- JSON-LD em `src/app/layout.tsx` ou similar (Person schema `sameAs`)
- `public/robots.txt` ou `public/humans.txt` se existirem

**7.2.3 Validar atributos de link externo**

Para cada link externo confirmar:

```tsx
<a
  href="https://www.linkedin.com/in/mazinho/"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="LinkedIn de Aurimar Nogueira"
>
```

**7.2.4 Atualizar JSON-LD Person schema**

Confirmar em `src/app/layout.tsx` (ou onde o JSON-LD vive):

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Aurimar Nogueira",
  "url": "https://aurimarnogueira.com.br",
  "sameAs": [
    "https://www.linkedin.com/in/mazinho/",
    "https://github.com/mazinhoww-web"
  ]
}
```

### Must-haves verificáveis

- [ ] `grep -rn "linkedin.com/in/" src/ public/ content/` retorna apenas matches com `mazinho`
- [ ] Link no Footer abre LinkedIn correto em nova aba
- [ ] Link no Header (se houver) abre LinkedIn correto em nova aba
- [ ] JSON-LD Person `sameAs` aponta para `/in/mazinho/`
- [ ] Todos os links externos têm `target="_blank"` e `rel="noopener noreferrer"`
- [ ] Console de DevTools no Lighthouse não acusa link com `target=_blank` sem `rel=noopener`

### Commit proposto

```
fix(seo): padronizar LinkedIn pessoal para /in/mazinho/

- Audita repo, corrige todas as ocorrências de URL antiga
- Atualiza JSON-LD Person sameAs
- Garante target=_blank rel=noopener noreferrer em todos os links externos
```

---

## Slice 7.3 - Logo marquee em /eventos

### Objetivo

Adicionar uma faixa horizontal animada com logos de marcas/parceiros relevantes acima do grid de eventos em `/eventos`, fortalecendo a prova social sem depender de embed de LinkedIn ou screenshots externos.

### Pré-requisito manual (fora do código)

Antes de executar a slice, Aurimar precisa fazer sourcing dos 8 logos SVG:

| Marca | Fonte sugerida | Filename esperado |
|---|---|---|
| LATAM Airlines | Brand resources oficial ou Wikipedia SVG | `latam.svg` |
| 99 | Brand kit da 99app ou Wikipedia SVG | `99.svg` |
| CERC | Site cerc.inc ou material institucional | `cerc.svg` |
| CRDC | Site crdc.com.br ou material institucional | `crdc.svg` |
| JUSPAY | Site juspay.in (footer) | `juspay.svg` |
| Sicredi | Brand center Sicredi | `sicredi.svg` |
| GYRA+ | Site gyramais.com.br | `gyra-plus.svg` |
| Impact Hub | Impact Hub global brand assets | `impact-hub.svg` |

Pré-processamento: cada SVG deve ter `fill="currentColor"` ou path único, sem cor embarcada. Se vier colorido, abrir no Figma ou Inkscape e converter para monocromia.

Destino: `public/logos/parceiros/`

### Tasks

**7.3.1 Estruturar diretório e arquivos**

```bash
mkdir -p public/logos/parceiros
```

Mover os 8 SVGs sourcing para essa pasta com os filenames exatos da tabela acima.

**7.3.2 Criar componente LogoMarquee**

Arquivo: `src/components/LogoMarquee.tsx`

```tsx
import Image from 'next/image'

const logos = [
  { src: '/logos/parceiros/latam.svg', alt: 'LATAM Airlines' },
  { src: '/logos/parceiros/99.svg', alt: '99' },
  { src: '/logos/parceiros/cerc.svg', alt: 'CERC' },
  { src: '/logos/parceiros/crdc.svg', alt: 'CRDC' },
  { src: '/logos/parceiros/juspay.svg', alt: 'JUSPAY' },
  { src: '/logos/parceiros/sicredi.svg', alt: 'Sicredi' },
  { src: '/logos/parceiros/gyra-plus.svg', alt: 'GYRA+' },
  { src: '/logos/parceiros/impact-hub.svg', alt: 'Impact Hub' },
] as const

export function LogoMarquee() {
  const items = [...logos, ...logos] // duplicado para loop seamless

  return (
    <section
      className="logo-marquee"
      aria-label="Empresas e marcas com as quais Aurimar atuou ou apresentou"
    >
      <div className="logo-marquee__caption">
        <span>PARCEIROS</span>
        <span aria-hidden>·</span>
        <span>EVENTOS</span>
        <span aria-hidden>·</span>
        <span>PALESTRAS</span>
      </div>

      <div className="logo-marquee__viewport">
        <ul className="logo-marquee__track">
          {items.map((logo, i) => (
            <li
              key={`${logo.alt}-${i}`}
              className="logo-marquee__item"
              aria-hidden={i >= logos.length}
            >
              <Image
                src={logo.src}
                alt={i < logos.length ? logo.alt : ''}
                width={120}
                height={40}
                unoptimized
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

**7.3.3 Estilizar marquee**

Arquivo: `src/styles/logo-marquee.css` (ou append ao globals.css)

```css
.logo-marquee {
  border-top: 1px solid #E5E3DC;
  border-bottom: 1px solid #E5E3DC;
  padding: 32px 0;
  background: #F5F4EF;
  overflow: hidden;
}

.logo-marquee__caption {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #0A0A0A;
  opacity: 0.6;
  margin-bottom: 24px;
}

.logo-marquee__viewport {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 80px,
    black calc(100% - 80px),
    transparent
  );
}

.logo-marquee__track {
  display: flex;
  gap: 80px;
  list-style: none;
  margin: 0;
  padding: 0;
  width: max-content;
  animation: logo-marquee-scroll 30s linear infinite;
}

.logo-marquee__track:hover {
  animation-play-state: paused;
}

.logo-marquee__item {
  display: flex;
  align-items: center;
  height: 40px;
  flex-shrink: 0;
}

.logo-marquee__item img {
  height: 32px;
  width: auto;
  opacity: 0.6;
  filter: grayscale(1) brightness(0);
  transition: opacity 200ms ease;
}

.logo-marquee__item:hover img {
  opacity: 1;
}

@keyframes logo-marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo-marquee__track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }
  .logo-marquee__viewport {
    mask-image: none;
  }
}

@media (max-width: 768px) {
  .logo-marquee__track {
    gap: 40px;
    animation-duration: 20s;
  }
  .logo-marquee__item img {
    height: 24px;
  }
  .logo-marquee__caption {
    font-size: 10px;
    gap: 8px;
  }
}
```

Notas técnicas:

- `mask-image` aplica fade nas bordas SEM usar gradiente colorido (não viola regra de paleta, é máscara de opacidade)
- `filter: grayscale(1) brightness(0)` força os logos a virarem ink puro independente da cor de origem do SVG
- Duplicação do array + `transform: translateX(-50%)` cria loop seamless
- `unoptimized` no `<Image>` evita que next/image tente otimizar SVG (que não precisa)

**7.3.4 Inserir em `/eventos`**

Localizar `src/app/eventos/page.tsx`. Inserir `<LogoMarquee />` entre o cabeçalho da página e o grid de cards:

```tsx
import { LogoMarquee } from '@/components/LogoMarquee'

export default function EventosPage() {
  return (
    <main>
      <section className="eventos-header">
        <h1>Eventos</h1>
        <p>Palestras, painéis e conversas em fintech, loyalty e inovação.</p>
      </section>

      <LogoMarquee />

      <section className="eventos-grid">
        {/* grid de cards existente */}
      </section>
    </main>
  )
}
```

**7.3.5 Validar acessibilidade**

- Confirmar que `aria-label` está em pt-BR
- Confirmar que apenas os 8 primeiros logos têm `alt` real (os 8 duplicados ficam vazios via `aria-hidden`)
- Testar com prefers-reduced-motion ligado no DevTools
- Testar hover pause em desktop
- Testar mobile (gap menor, velocidade menor)

### Must-haves verificáveis

- [ ] 8 logos SVG presentes em `public/logos/parceiros/`
- [ ] Componente `LogoMarquee` renderiza em `/eventos` entre header e grid
- [ ] Animação roda da direita para a esquerda, loop seamless (sem corte visível)
- [ ] Hover em qualquer logo pausa toda a esteira
- [ ] `prefers-reduced-motion: reduce` desliga animação e vira grid estático
- [ ] Todos os logos exibidos em monocromia ink, opacity 0.6 default
- [ ] Mobile com gap 40px e animação 20s funciona sem overflow horizontal
- [ ] Lighthouse acessibilidade 100 em `/eventos`
- [ ] Caption mono `PARCEIROS · EVENTOS · PALESTRAS` visível e legível

### Commit proposto

```
feat(eventos): adicionar marquee de logos de parceiros

- Cria componente LogoMarquee com 8 marcas (LATAM, 99, CERC, CRDC, JUSPAY, Sicredi, GYRA+, Impact Hub)
- Animação CSS pura, loop seamless via duplicação + translateX
- Pause on hover, respeita prefers-reduced-motion
- Logos em monocromia ink via grayscale + brightness 0
- Mask-image para fade nas bordas sem violar regra de paleta
- Caption mono "PARCEIROS · EVENTOS · PALESTRAS"
```

---

## Critérios de aceite do milestone

M7 só fecha quando todos os itens abaixo estiverem verdadeiros em produção (`https://aurimarnogueira.com.br`):

- [ ] Home renderiza com foto real em hero, h1 e tagline legíveis em mobile e desktop
- [ ] `/sobre` exibe foto editorial real (sem lucide User icon)
- [ ] `/eventos` exibe marquee de logos animado acima do grid
- [ ] Cada card de evento em `/eventos` tem capa real
- [ ] Cada artigo de evento tem ao menos uma foto secundária no corpo
- [ ] Todos os links para LinkedIn pessoal apontam para `/in/mazinho/`
- [ ] JSON-LD Person `sameAs` correto
- [ ] Lighthouse mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100
- [ ] Console sem warnings de imagens, links externos ou acessibilidade
- [ ] `prefers-reduced-motion` respeitado no marquee
- [ ] Zero placeholder visual no site

## Plano de commits e release

Cada slice = 1 commit atômico, push direto em `main`, deploy automático Vercel.

```
1. feat(visual): integrar fotos editoriais em /sobre, hero e /eventos
2. fix(seo): padronizar LinkedIn pessoal para /in/mazinho/
3. feat(eventos): adicionar marquee de logos de parceiros
```

Após o terceiro commit, validar visualmente em mobile (iOS Safari real) e desktop (Chrome + Firefox). Se passar, tag `v0.7.0` e atualizar `CHANGELOG.md` se existir.

## Ordem de execução sugerida

1. **7.2 primeiro** (URL LinkedIn): trivial, zero prep, fecha um bug. Tira do caminho.
2. **7.1 segundo** (fotos): fotos já em mão, maior impacto visual visível.
3. **7.3 por último** (marquee): depende de sourcing manual dos 8 logos antes de o Claude Code rodar.

## Pendências antes de executar a M7

- [ ] Baixar as 7 fotos do upload da sessão de handover para `~/Projects/an-site/.tmp/photos-raw/`
- [ ] Renomear conforme a tabela em 7.1
- [ ] Sourcing dos 8 logos SVG para `public/logos/parceiros/`
- [ ] Confirmar resolução de DNS apex se ainda em aberto (M6 issue)
- [ ] Confirmar que senha Neon e AUTH_SECRET já foram rotacionados (pendência crítica do M6)

## Não-objetivos do M7

Para evitar scope creep, NÃO entram em M7:

- Galeria full-screen de fotos em página dedicada (vai para backlog M8 se virar prioridade)
- Embed de LinkedIn em qualquer lugar (decisão travada)
- Página `/parceiros` dedicada com case studies (backlog)
- Animação shader ou WebGL no hero (fora do brand)
- Vídeos no `/eventos` (precisa autorização das marcas, backlog)
- Lightbox em fotos do corpo dos artigos (avaliar em M8)
