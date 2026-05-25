# SEO.md — Estratégia de SEO e Analytics AN.

> SEO refinado, técnico e analítico. Cobre técnico, conteúdo, JSON-LD, Open Graph, sitemaps, monitoramento de Core Web Vitals, search console, indexação ativa e analytics privacidade-first.

---

## 1. Objetivos e KPIs

### 1.1 Objetivos de negócio

1. **Aurimar é encontrado quando buscado por nome.** Resultado #1 no Google para "Aurimar Nogueira", "Aurimar LATAM Pass", "Mazinho LATAM".
2. **Aparecer em buscas de tópico.** Top 20 em buscas como "método jet ski inovação", "GSD2 produto", "Innovation2Business squad", "CPR Verde Brasil pioneiro".
3. **Skills do Aurimar (Cowork) encontradas.** Cada skill com URL canônica indexada e ranqueada para a função que executa.
4. **Trafego direto qualificado para LinkedIn e contato.** Visitantes que chegam ao site têm probabilidade alta de virar conexão ou conversa.

### 1.2 KPIs mensuráveis (revisar a cada 90 dias)

| KPI | Meta v1 (90 dias pós-lançamento) | Como medir |
|---|---|---|
| Posição média "Aurimar Nogueira" | Top 3 | Search Console |
| Páginas indexadas | 100% das públicas | Search Console (Coverage) |
| LCP (mobile) | < 2.5s p75 | Vercel Analytics + Web Vitals |
| CLS | < 0.1 p75 | Web Vitals |
| INP | < 200ms p75 | Web Vitals |
| Taxa de rejeição em /trajetoria | < 60% | Plausible |
| Conversões em newsletter | 100 subscribers em 90 dias | Banco + Plausible |
| Downloads de skill via SEO | 50% do total | UTM + Plausible |

---

## 2. SEO Técnico

### 2.1 Estrutura de URLs

| Tipo | Padrão | Exemplo |
|---|---|---|
| Home | `/` | aurimar.com.br |
| Sobre | `/sobre` | aurimar.com.br/sobre |
| Trajetória | `/trajetoria` | aurimar.com.br/trajetoria |
| Projetos lista | `/projetos` | aurimar.com.br/projetos |
| Projeto detalhe | `/projetos/[slug]` | aurimar.com.br/projetos/cia-do-visto |
| Skills lista | `/skills` | aurimar.com.br/skills |
| Skill detalhe | `/skills/[slug]` | aurimar.com.br/skills/metodo-jet-ski |
| Como usar skill | `/skills/como-usar` | aurimar.com.br/skills/como-usar |
| Notícias lista | `/noticias` | aurimar.com.br/noticias |
| Notícia detalhe | `/noticias/[slug]` | aurimar.com.br/noticias/sumimt-sicredi-2026 |
| Contato | `/contato` | aurimar.com.br/contato |

**Regras de slug:**
- Sempre kebab-case, lowercase
- Sem acentos (`trajetoria` não `trajetória`)
- Máximo 60 caracteres
- Palavras-chave naturais no slug

### 2.2 Renderização

- **Páginas estáticas** (Home, Sobre, Trajetória, Contato, Como Usar): SSG com revalidate 24h
- **Páginas dinâmicas baseadas em CMS** (Projetos, Skills, Notícias): SSG com `revalidate` 60s + ISR on-demand quando admin publica via webhook
- **Admin** (`/admin/*`): SSR (não indexado, `robots: noindex`)

### 2.3 Sitemap.xml

Gerado dinamicamente em `/sitemap.xml` via `next-sitemap` ou rota custom.

Inclui:
- Todas as páginas estáticas
- Todas as `projects` com `published = true`
- Todas as `skills` com `published = true`
- Todas as `news` com `published = true`
- Todas as `career_chapters` (página única `/trajetoria` mas com fragmentos `#capitulo-x`)

Estrutura mínima por item:
```xml
<url>
  <loc>https://aurimar.com.br/skills/metodo-jet-ski</loc>
  <lastmod>2026-05-24</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 2.4 robots.txt

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /_next

Sitemap: https://aurimar.com.br/sitemap.xml
```

### 2.5 Canonical, hreflang, alternates

- Toda página com `<link rel="canonical" href="...">` apontando para versão sem query string
- Por padrão, idioma `pt-BR`. Se houver versão EN no futuro, adicionar `hreflang`
- Sem AMP

### 2.6 Performance (Core Web Vitals como SEO)

Performance é fator de rank desde 2021. Metas (`REQUIREMENTS.md` R2):

- **LCP < 2.5s** (p75 mobile)
- **CLS < 0.1**
- **INP < 200ms**
- **FCP < 1.8s**
- **TBT < 200ms**

Estratégias:
- `next/image` com `priority` no LCP
- `next/font` com `display: swap`
- CSS crítico inline (Next.js handle isso)
- Preload de fontes principais
- Lazy load de componentes abaixo do fold
- Sem JavaScript bloqueante de terceiros (Plausible é leve, < 1kb)
- Edge runtime para rotas que beneficiam

### 2.7 Indexação ativa

- **Google Search Console:** propriedade verificada, sitemap submetido
- **Bing Webmaster Tools:** mesma coisa, importa Search Console
- **IndexNow:** integração para notificar Bing/Yandex automaticamente quando admin publicar
- **Google Indexing API:** opcional, para forçar indexação de notícias

### 2.8 Erros e redirecionamentos

- 404 customizado com brand, CTA para home e nav
- 500 customizado
- Redirects 301 documentados em `next.config.js` se mudar slug
- Sem 302 para conteúdo permanente
- Sem chains de redirect (máximo 1 salto)

---

## 3. SEO de Conteúdo

### 3.1 Title tags (regra por página)

| Página | Pattern |
|---|---|
| Home | `Aurimar Nogueira | Onde estratégia vira sistema` |
| Sobre | `Sobre | Aurimar Nogueira` |
| Trajetória | `Trajetória | Aurimar Nogueira — Loyalty × Fintech × Innovation` |
| Projetos lista | `Projetos | Aurimar Nogueira` |
| Projeto detalhe | `{nome} | Projetos | Aurimar Nogueira` |
| Skills lista | `Skills do Claude | Aurimar Nogueira` |
| Skill detalhe | `{nome} — Skill do Claude | Aurimar Nogueira` |
| Notícias | `Notícias | Aurimar Nogueira` |
| Contato | `Contato | Aurimar Nogueira` |

Máximo 60 caracteres. Brand sempre ao final.

### 3.2 Meta description (regra por página)

- Máximo 160 caracteres
- Inclui keyword principal da página + benefício/contexto
- Nunca duplicada entre páginas
- Sem clickbait

Exemplos:
- **Home:** `Coordenador Sênior de Negócios Financeiros na LATAM Pass. Loyalty, fintech e inovação aplicada. Frameworks autorais e skills do Claude para download.`
- **Trajetória:** `Histórico contextual: LATAM Pass, CERC (60% market share em CPR Registry, R$ 70B+), Stone, CRDC. Frameworks Método Jet Ski, GSD2, Innovation2Business.`

### 3.3 Headings

- 1 H1 por página (já é o título da SectionHead)
- H2 para seções principais
- H3 para subseções
- Nunca pular nível (H1 → H3)
- Keywords naturais em H2/H3 quando contextual

### 3.4 Conteúdo

- **Densidade de keyword:** natural, sem stuffing. Foco em entidades relacionadas (loyalty, fidelidade, milhas, LATAM Pass, fintech, inovação)
- **Tamanho mínimo de página:** 300 palavras para indexar bem. Páginas curtas (skills lista, projetos lista) compensam com cards ricos em texto
- **Páginas longas (Trajetória, Skill detalhe):** estruturadas com H2/H3 e listas para escaneabilidade
- **Linking interno:** cada página principal linka para 2-4 outras páginas relevantes. Trajetória linka para projetos que menciona. Projetos linkam para skills usadas
- **Texto âncora:** descritivo ("ver método Jet Ski") não genérico ("clique aqui")

### 3.5 Imagens

- `alt` descritivo em toda imagem (não "imagem", não "foto")
- Lazy loading exceto LCP
- `next/image` sempre
- WebP/AVIF automático
- Nome de arquivo descritivo: `aurimar-nogueira-latam-pass.webp`

---

## 4. Open Graph e Twitter Cards

### 4.1 Open Graph (todas as páginas)

```html
<meta property="og:type" content="profile" />  <!-- ou "article" em notícias -->
<meta property="og:site_name" content="Aurimar Nogueira" />
<meta property="og:title" content="{title}" />
<meta property="og:description" content="{description}" />
<meta property="og:url" content="{canonical}" />
<meta property="og:image" content="{og-image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:locale" content="pt_BR" />
```

### 4.2 Twitter / X cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{title}" />
<meta name="twitter:description" content="{description}" />
<meta name="twitter:image" content="{og-image}" />
```

### 4.3 OG Images (geração)

Geradas via `@vercel/og` em runtime edge. Endpoint: `/api/og?title=...&type=...`

Templates por tipo:
- **Home/Sobre/Trajetória:** mark grande + título + descritor LOYALTY × FINTECH × INNOVATION em mono
- **Projeto:** nome + categoria + ano em mono
- **Skill:** nome + ícone Box + tag categoria
- **Notícia:** título + data + Newspaper icon

Todas em bone background, ink text, lime accent. Sem foto.

---

## 5. JSON-LD (Schema.org)

### 5.1 Em todas as páginas — Organization (no `<head>` global)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Aurimar Nogueira",
  "alternateName": "Mazinho",
  "url": "https://aurimar.com.br",
  "image": "https://aurimar.com.br/og/aurimar.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/mazinho",
    "https://github.com/mazinhoww-web"
  ],
  "jobTitle": "Coordenador Sênior de Negócios Financeiros",
  "worksFor": {
    "@type": "Organization",
    "name": "LATAM Pass Brasil",
    "url": "https://www.latampass.latam.com"
  },
  "knowsAbout": ["Loyalty Programs", "Fintech", "Innovation", "Product Strategy", "Partnerships"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cuiabá",
    "addressRegion": "MT",
    "addressCountry": "BR"
  }
}
```

### 5.2 Página `/` (Home) — adicionar WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aurimar Nogueira",
  "url": "https://aurimar.com.br",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://aurimar.com.br/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 5.3 Página `/trajetoria` — ProfilePage + alumniOf + award

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Aurimar Nogueira",
    "hasOccupation": [
      {
        "@type": "Occupation",
        "name": "Coordenador Sênior de Negócios Financeiros",
        "occupationLocation": { "@type": "Place", "name": "LATAM Pass Brasil" }
      }
    ],
    "alumniOf": [{ "@type": "EducationalOrganization", "name": "{instituição}" }]
  }
}
```

### 5.4 Página `/projetos/[slug]` — CreativeWork

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "{nome}",
  "creator": { "@type": "Person", "name": "Aurimar Nogueira" },
  "datePublished": "{ano}",
  "description": "{descrição}",
  "url": "https://aurimar.com.br/projetos/{slug}",
  "keywords": ["loyalty", "fintech", "..."]
}
```

### 5.5 Página `/skills/[slug]` — SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "{nome}",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Claude (Anthropic)",
  "author": { "@type": "Person", "name": "Aurimar Nogueira" },
  "description": "{descrição}",
  "downloadUrl": "https://aurimar.com.br/skills/{slug}",
  "softwareVersion": "{versão}",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "BRL" }
}
```

### 5.6 Página `/noticias/[slug]` — NewsArticle

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "{título}",
  "datePublished": "{data ISO}",
  "author": { "@type": "Person", "name": "Aurimar Nogueira" },
  "image": "{og-image}",
  "publisher": {
    "@type": "Organization",
    "name": "Aurimar Nogueira",
    "logo": { "@type": "ImageObject", "url": "https://aurimar.com.br/logo.png" }
  }
}
```

### 5.7 Breadcrumb em páginas internas

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://aurimar.com.br" },
    { "@type": "ListItem", "position": 2, "name": "Projetos", "item": "https://aurimar.com.br/projetos" },
    { "@type": "ListItem", "position": 3, "name": "{nome}" }
  ]
}
```

---

## 6. Implementação no Next.js

### 6.1 Metadata API (App Router)

Cada `page.tsx` exporta `metadata` ou `generateMetadata`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trajetória",
  description: "...",
  alternates: { canonical: "https://aurimar.com.br/trajetoria" },
  openGraph: {
    title: "...",
    description: "...",
    url: "https://aurimar.com.br/trajetoria",
    siteName: "Aurimar Nogueira",
    images: [{ url: "/api/og?type=trajetoria", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "...",
    description: "...",
    images: ["/api/og?type=trajetoria"],
  },
};
```

### 6.2 JSON-LD via componente

`src/components/seo/JsonLd.tsx`:

```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Usar em cada page: `<JsonLd data={trajetoriaSchema} />`.

### 6.3 Sitemap dinâmico

`src/app/sitemap.ts`:

```tsx
import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const base = "https://aurimar.com.br";
  const now = new Date();

  const staticUrls = [
    { url: base, lastModified: now, priority: 1.0 },
    { url: `${base}/sobre`, lastModified: now, priority: 0.9 },
    { url: `${base}/trajetoria`, lastModified: now, priority: 0.9 },
    { url: `${base}/projetos`, lastModified: now, priority: 0.8 },
    { url: `${base}/skills`, lastModified: now, priority: 0.9 },
    { url: `${base}/skills/como-usar`, lastModified: now, priority: 0.7 },
    { url: `${base}/noticias`, lastModified: now, priority: 0.7 },
    { url: `${base}/contato`, lastModified: now, priority: 0.6 },
  ];

  const { data: projects } = await supabase.from("projects").select("slug, updated_at").eq("published", true);
  const { data: skills } = await supabase.from("skills").select("slug, updated_at").eq("published", true);
  const { data: news } = await supabase.from("news").select("slug, updated_at").eq("published", true);

  const projectUrls = (projects ?? []).map(p => ({ url: `${base}/projetos/${p.slug}`, lastModified: new Date(p.updated_at), priority: 0.7 }));
  const skillUrls = (skills ?? []).map(s => ({ url: `${base}/skills/${s.slug}`, lastModified: new Date(s.updated_at), priority: 0.8 }));
  const newsUrls = (news ?? []).map(n => ({ url: `${base}/noticias/${n.slug}`, lastModified: new Date(n.updated_at), priority: 0.6 }));

  return [...staticUrls, ...projectUrls, ...skillUrls, ...newsUrls];
}
```

### 6.4 robots.ts

`src/app/robots.ts`:

```tsx
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: "https://aurimar.com.br/sitemap.xml",
  };
}
```

---

## 7. Analytics

### 7.1 Stack

- **Plausible Analytics** (privacy-first, sem cookies, leve, LGPD-friendly)
- **Vercel Analytics** (Web Vitals direto na plataforma, sem opt-in necessário se anonimizado)
- **Vercel Speed Insights** (Real User Monitoring de CWV)

Não usar Google Analytics em v1 (cookies, banner de consentimento obrigatório por LGPD, peso de script). Avaliar em v2 se houver necessidade específica.

### 7.2 Plausible setup

- Conta em plausible.io
- Site adicionado: aurimar.com.br
- Script via `next/script` no layout root, `strategy="afterInteractive"`
- Custom events:
  - `Newsletter Submit`
  - `Skill Download Gate Opened`
  - `Skill Downloaded`
  - `Contact Form Submitted`
  - `External Link Click` (LinkedIn, GitHub)

```tsx
// src/components/analytics/Plausible.tsx
import Script from "next/script";

export function Plausible() {
  return (
    <Script
      defer
      data-domain="aurimar.com.br"
      src="https://plausible.io/js/script.tagged-events.js"
      strategy="afterInteractive"
    />
  );
}
```

### 7.3 Web Vitals tracking

`src/app/layout.tsx` ou componente client:

```tsx
"use client";
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (window.plausible) {
      window.plausible(`Web Vital: ${metric.name}`, {
        props: { value: Math.round(metric.value), rating: metric.rating },
      });
    }
  });
  return null;
}
```

### 7.4 UTMs em links de saída

Padrão: `?utm_source=an-site&utm_medium=...&utm_campaign=...`

- LinkedIn share: `utm_medium=social&utm_campaign=linkedin-share`
- Email newsletter: `utm_medium=email&utm_campaign=newsletter-{id}`
- Em deck PDF: `utm_medium=deck&utm_campaign=elevate-2025`

### 7.5 Search Console

- Verificação via meta tag no `<head>` (gerada pelo Search Console)
- Submeter `sitemap.xml` na primeira semana
- Revisar cobertura semanalmente no primeiro mês
- Configurar alerta de erros de indexação por e-mail

---

## 8. Estratégia de Conteúdo

### 8.1 Keywords-âncora

**Pessoais (intent navegacional, prioridade máxima):**
- `aurimar nogueira`
- `aurimar nogueira latam`
- `aurimar mazinho`
- `mazinho latam pass`

**De autoridade (intent informacional, prioridade média):**
- `método jet ski inovação`
- `gsd2 metodologia`
- `innovation2business`
- `cpr verde brasil pioneiro`
- `cerc cpr registry`

**Long-tail (intent específico):**
- `como funciona latam pass conta global`
- `skill claude método jet ski download`
- `frameworks inovação loyalty fintech`

### 8.2 Tópicos pillar (priorizar como conteúdo profundo)

1. **Trajetória + cases:** /trajetoria + páginas de projetos (LATAM Wallet, CPR Registry)
2. **Skills do Claude:** cada skill é uma página de conteúdo SEO
3. **Notícias:** entradas curtas e datadas (participação em eventos, lançamentos)

### 8.3 Conteúdo evergreen (não datado)

- Trajetória
- Sobre
- Skills
- Projetos

### 8.4 Conteúdo periódico (datado)

- Notícias
- Notas curtas (se decidir incluir blog leve em v2)

---

## 9. Monitoramento contínuo

### 9.1 Dashboard de SEO (semanal nos primeiros 90 dias, depois mensal)

Métricas para acompanhar:

- **Search Console:** impressões, cliques, CTR, posição média por página
- **Plausible:** visitantes únicos, páginas por sessão, top páginas, top fontes
- **Vercel Speed Insights:** Core Web Vitals por página
- **Manual:** posição atual em buscas-âncora (planilha)

### 9.2 Alertas

- Queda de tráfego >20% semana sobre semana → investigar
- Página caindo de top 10 → investigar
- Web Vitals piorando → priorizar slice de performance
- Erro 404 com volume → criar redirect 301

### 9.3 Auditorias

- **Lighthouse CI** em PRs (configurar action no GitHub)
- **Auditoria semestral:** Screaming Frog ou similar para verificar links quebrados, meta duplicadas, etc

---

## 10. LGPD e SEO

Compatibilidade total:

- Plausible não usa cookies, não precisa de banner
- Vercel Analytics é anônimo por padrão
- Newsletter com double opt-in (R11 do REQUIREMENTS.md)
- Política de privacidade em `/privacidade` com links no footer
- Termos de uso em `/termos`
- Formulário de contato menciona uso do dado e LGPD

Banner de cookie só se em algum momento incluir GA, Hotjar, ou similar. Em v1, não há banner.

---

## 11. Checklist pré-lançamento

- [ ] Domínio configurado com SSL
- [ ] Search Console verificado
- [ ] Bing Webmaster Tools verificado
- [ ] Sitemap.xml gerado e submetido
- [ ] robots.txt correto
- [ ] Title e description únicos em todas as páginas
- [ ] OG images geradas para cada tipo de página
- [ ] JSON-LD validado em validator.schema.org
- [ ] Plausible script ativo
- [ ] Vercel Analytics e Speed Insights ativos
- [ ] Lighthouse mobile >= 90 em todas as páginas principais
- [ ] Core Web Vitals dentro das metas em ambiente de produção
- [ ] Política de privacidade publicada
- [ ] Termos publicados
- [ ] Todos os links internos funcionando (zero 404)
- [ ] Imagens com alt
- [ ] Headings hierarquia correta (h1 único)
- [ ] Página 404 customizada com brand
- [ ] Trajetória, Sobre, Projetos, Skills com conteúdo real (não lorem)

---

## 12. Roadmap pós-v1 (SEO)

- **Mês 3-6:** otimização baseada em dados reais (queries do Search Console)
- **Mês 6:** decidir sobre versão EN (`/en`) com hreflang
- **Mês 6-9:** considerar conteúdo de blog técnico/opinativo se houver bandwidth
- **Mês 9-12:** avaliar backlinks orgânicos e revisar estratégia

---

## 13. Anti-padrões

- Nunca usar keyword stuffing
- Nunca duplicar title/description entre páginas
- Nunca esconder texto para SEO (cloaking)
- Nunca usar imagem como substituto de texto importante (h1 deve ser texto)
- Nunca esquecer alt em imagem
- Nunca deixar admin indexável (`noindex` no `<head>` das rotas admin)
- Nunca usar `rel="nofollow"` em links internos
- Nunca expor query string em canonical
- Nunca usar redirect chain (mais de 1 salto)
- Nunca lançar página em produção sem Lighthouse 90+
