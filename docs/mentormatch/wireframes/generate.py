#!/usr/bin/env python3
# Gera wireframes (SVG->PNG) das telas do MentorMatch em 2 temas (default dark + sicredi).
import cairosvg

THEMES = {
    "default": {
        "label": "TEMA DEFAULT  (theme-dark)",
        "board": "#050509",
        "bg_base": "#0D0D14", "bg_elev": "#13131E", "surface": "#1A1A26",
        "border": "#23232f", "sidebar": "#0B0B11",
        "accent": "#4F46E5", "accent_alt": "#6366F1",
        "primary": "#4F46E5", "primary_fg": "#FFFFFF",
        "secondary": "#1B1B2B", "secondary_fg": "#C7C7FF",
        "text": "#EDEDEF", "text_sub": "#9CA3AF", "text_muted": "#6B7280",
        "green": "#10B981",
        "font_display": "Inter, sans-serif", "font_body": "Inter, sans-serif",
        "hw": 700, "rcard": 14, "rbtn": 10, "badge": "WHITE-LABEL",
        "input_bg": "#13131E",
    },
    "sicredi": {
        "label": "TEMA SICREDI  (theme-sicredi)",
        "board": "#E6E9E6",
        "bg_base": "#FFFFFF", "bg_elev": "#FFFFFF", "surface": "#FAFAFA",
        "border": "#CDD3CD", "sidebar": "#FAFAFA",
        "accent": "#33820D", "accent_alt": "#26610A",
        "primary": "#33820D", "primary_fg": "#FFFFFF",
        "secondary": "#D7E6C8", "secondary_fg": "#26610A",
        "text": "#323C32", "text_sub": "#828A82", "text_muted": "#5A645A",
        "green": "#33820D",
        "font_display": "'Exo 2', sans-serif", "font_body": "Nunito, sans-serif",
        "hw": 300, "rcard": 4, "rbtn": 8, "badge": "SICREDI",
        "input_bg": "#FFFFFF",
    },
}

def esc(s): return s.replace("&", "&amp;")

class SVG:
    def __init__(self, w, h): self.w, self.h, self.e = w, h, []
    def rect(self, x, y, w, h, fill, rx=0, stroke=None, sw=1, opacity=None):
        s = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"'
        if stroke: s += f' stroke="{stroke}" stroke-width="{sw}"'
        if opacity is not None: s += f' opacity="{opacity}"'
        self.e.append(s + '/>')
    def line(self, x1,y1,x2,y2,stroke,sw=1,dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ''
        self.e.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{d}/>')
    def circ(self, cx, cy, r, fill, stroke=None, sw=1):
        s=f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}"'
        if stroke: s+=f' stroke="{stroke}" stroke-width="{sw}"'
        self.e.append(s+'/>')
    def text(self, x, y, t, fill, size=14, weight=400, font="Inter, sans-serif", anchor="start", spacing=None):
        sp = f' letter-spacing="{spacing}"' if spacing else ''
        self.e.append(f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-weight="{weight}" '
                      f'font-family="{font}" text-anchor="{anchor}"{sp}>{esc(t)}</text>')
    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" '
                f'viewBox="0 0 {self.w} {self.h}">' + "".join(self.e) + "</svg>")

def frame(s, t, ox, oy, w, h, title):
    s.rect(ox, oy-26, 300, 20, "none")
    s.text(ox+2, oy-12, title, t["text_sub"] if t["board"]=="#050509" else "#3a463a", 13, 700, t["font_body"], spacing="1.5")
    s.rect(ox, oy, w, h, t["bg_base"], t["rcard"], t["border"], 1.5)

def btn(s, t, x, y, w, h, label, primary=True):
    fill = t["primary"] if primary else "none"
    s.rect(x, y, w, h, fill, t["rbtn"], None if primary else t["accent"], 1.5)
    s.text(x+w/2, y+h/2+4, label, t["primary_fg"] if primary else t["accent"], 12, 600, t["font_body"], "middle")

def chip(s, t, x, y, w, label, fill, fg):
    s.rect(x, y, w, 18, fill, 9)
    s.text(x+w/2, y+12.5, label, fg, 9, 700, t["font_body"], "middle", spacing="1")

def avatar(s, cx, cy, r, fill, ring=None):
    if ring: s.circ(cx, cy, r+3, "none", ring, 2)
    s.circ(cx, cy, r, fill)
    s.circ(cx, cy-r*0.18, r*0.32, "#ffffff", )
    s.rect(cx-r*0.5, cy+r*0.15, r, r*0.6, "#ffffff", r*0.3)

# ---------- SCREEN: LANDING ----------
def landing(s, t, ox, oy):
    W,H=680,470; pad=26
    # navbar
    s.circ(ox+pad+8, oy+30, 8, t["accent"])
    s.text(ox+pad+24, oy+34, "MentorMatch", t["text"], 15, t["hw"], t["font_display"])
    chip(s, t, ox+pad+150, oy+22, 86, t["badge"], t["secondary"], t["secondary_fg"])
    btn(s, t, ox+W-pad-96, oy+18, 96, 28, "Começar", True)
    s.line(ox, oy+60, ox+W, oy+60, t["border"], 1)
    # hero left
    hx=ox+pad; hy=oy+120
    s.text(hx, hy, "Conecte ", t["text"], 30, t["hw"], t["font_display"])
    s.text(hx, hy+38, "mentores", t["accent"], 30, t["hw"], t["font_display"])
    s.text(hx+150, hy+38, " e", t["text"], 30, t["hw"], t["font_display"])
    s.text(hx, hy+76, "mentorados", t["accent"], 30, t["hw"], t["font_display"])
    s.text(hx, hy+108, "Programa de mentoria white-label, pronto", t["text_sub"], 13, 400, t["font_body"])
    s.text(hx, hy+126, "em minutos. Um app, todos os seus tenants.", t["text_sub"], 13, 400, t["font_body"])
    btn(s, t, hx, hy+150, 130, 38, "Comecar Gratis", True)
    btn(s, t, hx+142, hy+150, 110, 38, "Ver Demo", False)
    # trust bar
    ty=oy+H-58
    for i,(n,l) in enumerate([("2.400+","mentorias"),("98%","satisfacao"),("50+","empresas")]):
        cx=hx+i*120
        s.text(cx, ty, n, t["accent_alt"], 20, 700, t["font_display"])
        s.text(cx, ty+18, l, t["text_muted"], 11, 400, t["font_body"])
    # hero right: match preview card
    cx=ox+W-pad-210; cy=oy+96
    s.rect(cx, cy, 210, 250, t["bg_elev"], t["rcard"], t["border"], 1.5)
    avatar(s, cx+55, cy+70, 26, t["accent"])
    s.text(cx+55, cy+112, "Ana — Mentora", t["text"], 11, 600, t["font_body"], "middle")
    avatar(s, cx+155, cy+70, 26, t["accent_alt"])
    s.text(cx+155, cy+112, "Carlos — Dev", t["text"], 11, 600, t["font_body"], "middle")
    s.line(cx+81, cy+70, cx+129, cy+70, t["green"], 3, "5 5")
    s.rect(cx+55, cy+150, 100, 26, t["secondary"], 13)
    s.text(cx+105, cy+167, "Match realizado", t["secondary_fg"], 11, 700, t["font_body"], "middle")
    chip(s, t, cx+30, cy+210, 150, "SETUP EM 5 MIN", t["surface"], t["text_muted"])

# ---------- SCREEN: LOGIN ----------
def login(s, t, ox, oy):
    W,H=680,470
    cw,ch=300,330; cx=ox+(W-cw)/2; cy=oy+(H-ch)/2
    s.rect(cx, cy, cw, ch, t["bg_elev"], t["rcard"], t["border"], 1.5)
    s.circ(cx+cw/2, cy+44, 14, t["accent"])
    s.text(cx+cw/2, cy+82, "MentorMatch", t["text"], 16, t["hw"], t["font_display"], "middle")
    s.text(cx+cw/2, cy+108, "Acesse sua conta", t["text_sub"], 12, 400, t["font_body"], "middle")
    # fields
    fx=cx+28; fw=cw-56
    for i,(lab,ph) in enumerate([("E-mail","seu@email.com"),("Senha","••••••••")]):
        y=cy+134+i*64
        s.text(fx, y, lab, t["text"], 11, 600, t["font_body"])
        s.rect(fx, y+8, fw, 34, t["input_bg"], t["rbtn"], t["border"], 1)
        s.text(fx+12, y+30, ph, t["text_muted"], 12, 400, t["font_body"])
    btn(s, t, fx, cy+278, fw, 38, "Entrar", True)
    s.text(cx+cw/2, cy+ch-14, "Nao tem conta?  Criar conta", t["accent"], 11, 600, t["font_body"], "middle")

# ---------- SCREEN: DASHBOARD MENTEE ----------
def dashboard(s, t, ox, oy):
    W,H=680,470; sw=150
    # sidebar
    s.rect(ox, oy, sw, H, t["sidebar"], 0)
    s.line(ox+sw, oy, ox+sw, oy+H, t["border"], 1)
    s.circ(ox+22, oy+28, 9, t["accent"]); s.text(ox+38, oy+32, "MentorMatch", t["text"], 11, t["hw"], t["font_display"])
    items=["Dashboard","Conexoes","Buscar Mentores","Biblioteca","Notificacoes","Perfil"]
    for i,it in enumerate(items):
        y=oy+70+i*34
        if i==0:
            s.rect(ox+12, y-16, sw-24, 28, t["secondary"], t["rbtn"])
            s.text(ox+24, y+3, it, t["secondary_fg"], 11, 700, t["font_body"])
        else:
            s.text(ox+24, y+3, it, t["text_sub"], 11, 400, t["font_body"])
    s.line(ox+12, oy+H-58, ox+sw-12, oy+H-58, t["border"],1)
    avatar(s, ox+26, oy+H-32, 11, t["accent"]); s.text(ox+44, oy+H-28, "Ana Costa", t["text"], 10, 600, t["font_body"])
    # main
    mx=ox+sw+24; my=oy+30
    s.text(mx, my, "Ola, Ana", t["text"], 20, t["hw"], t["font_display"])
    s.text(mx, my+20, "Seu painel de mentorado", t["text_muted"], 11, 400, t["font_body"])
    # próxima sessão (empty)
    s.rect(mx, my+38, W-sw-48, 78, t["surface"], t["rcard"], t["border"], 1)
    s.text(mx+16, my+66, "Sua Proxima Sessao", t["text"], 12, 700, t["font_body"])
    s.text(mx+16, my+88, "Voce ainda nao tem sessoes agendadas.", t["text_muted"], 11, 400, t["font_body"])
    s.text(mx+16, my+104, "Encontre um mentor", t["accent"], 11, 600, t["font_body"])
    # biblioteca cards
    s.text(mx, my+150, "Biblioteca", t["text"], 13, 700, t["font_body"])
    cwid=(W-sw-48-16)/2
    for i in range(2):
        x=mx+i*(cwid+16)
        s.rect(x, my+162, cwid, 70, t["bg_elev"], t["rcard"], t["border"], 1)
        s.rect(x+12, my+176, 26, 26, t["secondary"], 6)
        s.text(x+48, my+186, "Material "+str(i+1), t["text"], 11, 600, t["font_body"])
        s.text(x+48, my+202, "PDF • guia", t["text_muted"], 10, 400, t["font_body"])
    # mentores destaque (empty)
    s.text(mx, my+262, "Mentores em Destaque", t["text"], 13, 700, t["font_body"])
    s.rect(mx, my+274, W-sw-48, 56, t["surface"], t["rcard"], t["border"], 1)
    s.text(mx+16, my+300, "Voce ainda nao tem mentores conectados.", t["text_muted"], 11, 400, t["font_body"])
    s.text(mx+16, my+316, "Explore a plataforma", t["accent"], 11, 600, t["font_body"])

# ---------- SCREEN: SUPER ADMIN ----------
def admin(s, t, ox, oy):
    W,H=680,470; pad=24
    s.circ(ox+pad+8, oy+28, 8, t["accent"]); s.text(ox+pad+24, oy+32, "MentorMatch", t["text"], 14, t["hw"], t["font_display"])
    chip(s, t, ox+pad+150, oy+20, 92, "ADMIN GERAL", t["secondary"], t["secondary_fg"])
    s.line(ox, oy+54, ox+W, oy+54, t["border"], 1)
    # stat cards
    stats=[("3","Tenants ativos"),("128","Usuarios"),("64","Sessoes"),("1","Com design.md")]
    cwid=(W-2*pad-3*12)/4
    for i,(n,l) in enumerate(stats):
        x=ox+pad+i*(cwid+12)
        s.rect(x, oy+70, cwid, 64, t["bg_elev"], t["rcard"], t["border"], 1)
        s.text(x+14, oy+102, n, t["accent_alt"], 22, 700, t["font_display"])
        s.text(x+14, oy+120, l, t["text_muted"], 9.5, 400, t["font_body"])
    # tenant grid
    s.text(ox+pad, oy+162, "Tenants", t["text"], 13, 700, t["font_body"])
    tenants=[("MentorMatch Demo","/t/default","#6366F1","Ativo"),
             ("MentorMatch Sicredi","/t/sicredi","#33820D","Ativo")]
    twid=(W-2*pad-16)/2
    for i,(nm,slug,bar,st) in enumerate(tenants):
        x=ox+pad+i*(twid+16); y=oy+178
        s.rect(x, y, twid, 150, t["bg_elev"], t["rcard"], t["border"], 1)
        s.rect(x, y, twid, 6, bar, 0)  # colored top bar
        s.circ(x+24, y+38, 12, bar)
        s.text(x+44, y+34, nm, t["text"], 12, 700, t["font_body"])
        s.text(x+44, y+50, "aurimarnogueira.com.br"+slug, t["text_muted"], 9.5, 400, t["font_body"])
        chip(s, t, x+twid-70, y+22, 56, st, t["secondary"], t["secondary_fg"])
        # mini stats
        for j,(mn,ml) in enumerate([("42","users"),("18","sessoes"),("7","mentores")]):
            sx=x+20+j*(twid-40)/3
            s.text(sx, y+86, mn, t["text"], 14, 700, t["font_display"])
            s.text(sx, y+102, ml, t["text_muted"], 9, 400, t["font_body"])
        btn(s, t, x+16, y+114, twid-32, 28, "Gerenciar", True)

def build(theme_key):
    t=THEMES[theme_key]
    W,H=1480,1180
    s=SVG(W,H)
    s.rect(0,0,W,H,t["board"])
    s.text(40, 56, "MentorMatch — Wireframe", t["text"] if theme_key=="default" else "#1e261e", 30, 700, t["font_display"])
    s.text(40, 82, t["label"], t["accent_alt"], 15, 600, t["font_body"], spacing="1")
    frame(s,t,40,140,680,470,"01 · LANDING"); landing(s,t,40,140)
    frame(s,t,760,140,680,470,"02 · LOGIN"); login(s,t,760,140)
    frame(s,t,40,668,680,470,"03 · DASHBOARD (MENTORADO)"); dashboard(s,t,40,668)
    frame(s,t,760,668,680,470,"04 · ADMIN GERAL (SUPER ADMIN)"); admin(s,t,760,668)
    svg=s.svg()
    open(f"/tmp/wf_{theme_key}.svg","w").write(svg)
    cairosvg.svg2png(bytestring=svg.encode(), write_to=f"/tmp/wireframe_{theme_key}.png", output_width=1850)
    print("ok", theme_key)

for k in THEMES: build(k)
print("DONE")
