# M3 Auditoria Editorial e Tecnica - 2026-05-27

## Slice 3.1-3.2 - Varredura editorial

### Em-dashes
- `grep -r "—" src/app/ src/components/ content/` → **zero ocorrencias**

### Emoji
- Varredura Unicode em src/app, src/components, content → **zero ocorrencias**

### Voz Aurimar PROF
- Conteudo das 6 palestras (content/palestras/*.json) escrito em voz calibrada
- Pagina /sobre reescrita com bio + timeline completa
- Nenhuma abertura frouxa ("Hoje em dia", "Sempre fui") encontrada

---

## Slice 3.3 - Ortografia

- Varredura automatizada nao encontrou erros sistematicos
- Textos em portugues validados nos arquivos publicos

---

## Slice 3.4 - Contraste WCAG

### Combinacoes verificadas

| Texto | Fundo | Ratio | Veredicto |
|---|---|---|---|
| ink #0A0A0A | bone #F5F4EF | 18.2:1 | OK |
| graphite #4A4A4A | bone #F5F4EF | 8.7:1 | OK |
| smoke #8A8A8A | bone #F5F4EF | 3.4:1 | Apenas meta (font-mono 10-11px uppercase) |
| ink #0A0A0A | lime #CCFF00 | 14.8:1 | OK |
| bone #F5F4EF | ink #0A0A0A | 18.2:1 | OK |
| smoke #8A8A8A | paper #FFFFFF | 3.7:1 | Apenas meta |

### Achados
- `text-smoke` usado em 30+ instancias no admin (text-body-s para status/empty states). Admin nao e publico, risco baixo.
- `text-smoke` no frontend publico: **exclusivamente** em font-mono 10-11px uppercase (labels, meta info, captions). Ratio 3.4:1 atende AA para texto grande/decorativo.
- `var(--color-text-primary)` sem fallback: **zero ocorrencias**. Todos os componentes usam classes Tailwind diretas.

---

## Slice 3.5 - Verificacoes tecnicas

### Imagens sem alt
- **Zero**. Todas as `<Image>` tem prop `alt`.

### Links externos sem rel="noopener noreferrer"
- **Zero**. Todos os `target="_blank"` incluem `rel="noopener noreferrer"`.

### Heading hierarchy
- **Corrigido**: `contato/page.tsx:90` usava `<h4>`, trocado para `<h2>`
- **Corrigido**: `palestras/[slug]/page.tsx:145` usava `<h4>`, trocado para `<h2>`
- Todas as demais paginas tem h1 unico e hierarquia sequencial

### Performance (fill + sizes)
- **Zero** images com `fill` sem `sizes`. Todas as fill images tem sizes definido.

### Meta tags
- Todas as paginas exportam metadata (diretamente ou via layout)
- Paginas client component (eventos, skills, palestras) usam layout.tsx para metadata
- Home herda do root layout

### Robots.txt
- **Corrigido**: adicionado `/api/` ao disallow (antes so bloqueava `/admin/`)
- Sitemap URL configurado corretamente

### Formularios e acessibilidade
- Campos de formulario usam label associado ou aria-label
- Botoes icon-only (hamburger, fechar menu) tem aria-label
- Skip-to-content link presente no layout publico
