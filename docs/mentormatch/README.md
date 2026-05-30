# MentorMatch — Design e Wireframes

Artefatos de design extraídos por engenharia reversa do app MentorMatch, para apoiar a reconstrução "dentro de casa". Ver `MENTORMATCH-BLUEPRINT.md` (raiz) para o blueprint completo.

## `design/` — tokens (fonte da verdade dos temas)
- `default.md` — tema `theme-dark` (default / telas sem tenant). Espelha `base.css`. Indigo `#4F46E5`, Inter, cantos 14px, dark.
- `sicredi.md` — tema `theme-sicredi` (tenant `sicredi`). Espelha `sicredi.css`. Verde `#33820D`, Exo 2 + Nunito, cantos 4px, light.

Formato compatível com o `theme-parser` do MentorMatch (cores `**Nome** \`#hex\``; Display/Body font; Shape/Elevation → radius/shadow). Servem tanto como documentação quanto como upload de `design.md` ao criar tenant.

## `wireframes/` — mock visual por tema
- `wireframe-default.png` / `.svg` — 4 telas no tema default (dark).
- `wireframe-sicredi.png` / `.svg` — as mesmas 4 telas no tema Sicredi (verde).
- Telas: 01 Landing · 02 Login · 03 Dashboard (Mentorado) · 04 Admin Geral.
- `generate.py` — gerador (SVG→PNG via cairosvg). Editar os dicts `THEMES` para novos tenants/telas e rodar `python3 generate.py`.

## Observação de consistência
O schema define `Tenant.themeKey` default `"dark"`, mas `app/layout.tsx` usa fallback `"light"` e não há `.theme-light` em `styles/themes/` (cai no `:root` do `globals.css`). Alinhar o default antes de reconstruir (ver defeitos no blueprint).
