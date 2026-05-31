import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, animate } from "framer-motion";
import {
  Sparkles, Moon, Sun, ArrowRight, Check, Users, Target, CalendarCheck,
  Shield, Zap, Star, Menu, X, Search, Bell, LayoutGrid, User, Briefcase,
  ChevronRight, Clock, TrendingUp
} from "lucide-react";

/* ============================================================
   MentorMatch — Landing v2
   - Secao 2 = app preview navegavel (tabs internas reais)
   - White-label via --brand. Troque o tenant no topo.
   - Motion em camadas, personalidade visual (grid, glow, hover real)
   ============================================================ */

const TENANTS = {
  Indigo:  { name: "MentorMatch", brand: "#4F46E5", hover: "#4338CA", soft: "#EEF2FF", ring: "rgba(79,70,229,0.32)", contrast: "#FFFFFF" },
  Sicredi: { name: "Sicredi",     brand: "#3FA110", hover: "#347F0D", soft: "#EBF6E6", ring: "rgba(63,161,16,0.30)",  contrast: "#FFFFFF" },
  Ocean:   { name: "Ocean Corp",  brand: "#0E7490", hover: "#0B5E74", soft: "#E4F4F8", ring: "rgba(14,116,144,0.30)", contrast: "#FFFFFF" },
  Sunset:  { name: "Sunset",      brand: "#C2410C", hover: "#9A330A", soft: "#FCEEE6", ring: "rgba(194,65,12,0.30)",  contrast: "#FFFFFF" },
};
const EASE = [0.16, 1, 0.3, 1];

/* ---------- animated counter ---------- */
function Counter({ to, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setVal(to); return; }
    const controls = animate(0, to, { duration: 1.1, ease: EASE, onUpdate: v => setVal(v) });
    return () => controls.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

/* ---------- reveal with variants ---------- */
function Reveal({ children, delay = 0, y = 24, className, style }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/* ============================================================
   APP PREVIEW — the navegavel internal screens
   ============================================================ */
const PREVIEW_MENTORS = [
  { n: "Carla Menezes", r: "Head de Produto", s: "Disponivel", c: "var(--success)", cap: 50, taken: "2/4", sk: ["Discovery", "Roadmap"] },
  { n: "Diego Antunes", r: "Staff Data Scientist", s: "Disponivel", c: "var(--success)", cap: 75, taken: "3/4", sk: ["ML", "Carreira"] },
  { n: "Marcos Vinicius", r: "Designer Principal", s: "Disponivel", c: "var(--success)", cap: 0, taken: "0/4", sk: ["UX", "DS"] },
  { n: "Beatriz Lemos", r: "VP de Operacoes", s: "Waitlist", c: "var(--warning)", cap: 100, taken: "4/4", sk: ["Escala", "Cultura"] },
];

function Initials({ name, size = 44, fs = 15 }) {
  return (
    <div className="flex items-center justify-center rounded-full font-bold shrink-0"
      style={{ width: size, height: size, fontSize: fs, background: "var(--brand-soft)", color: "var(--brand)" }}>
      {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
    </div>
  );
}

function PreviewMatch({ brand }) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 left-3" style={{ color: "var(--text-muted)" }} />
          <div className="w-full" style={{ height: 38, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", paddingLeft: 34, display: "flex", alignItems: "center", fontSize: 13, color: "var(--text-muted)" }}>Buscar por skill ou cargo</div>
        </div>
        <div style={{ height: 38, padding: "0 14px", borderRadius: 8, background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", fontSize: 13, fontWeight: 600 }}>Produto</div>
      </div>
      <motion.div className="grid grid-cols-2 gap-3"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="show">
        {PREVIEW_MENTORS.map((m, i) => (
          <motion.div key={i}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } } }}
            whileHover={{ y: -3 }}
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 12, boxShadow: "var(--shadow-xs)", cursor: "pointer" }}>
            <div className="flex items-center justify-between mb-2">
              <Initials name={m.n} size={36} fs={12} />
              <span className="inline-flex items-center gap-1 rounded-full font-semibold" style={{ fontSize: 10, padding: "2px 7px", color: m.c, background: `color-mix(in srgb, ${m.c} 12%, transparent)` }}>
                <span style={{ width: 4, height: 4, borderRadius: 99, background: m.c }} />{m.s}
              </span>
            </div>
            <p className="font-semibold truncate" style={{ fontSize: 13 }}>{m.n}</p>
            <p className="truncate" style={{ fontSize: 11, color: "var(--text-secondary)" }}>{m.r}</p>
            <div className="w-full rounded-full mt-2.5" style={{ height: 4, background: "var(--surface-2)" }}>
              <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${m.cap}%` }} transition={{ duration: 0.7, ease: EASE, delay: 0.3 + i * 0.06 }}
                style={{ background: m.cap === 100 ? "var(--warning)" : "var(--brand)" }} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function PreviewProfile({ brand }) {
  return (
    <div className="p-5">
      <div className="flex items-start gap-3 mb-4">
        <Initials name="Carla Menezes" size={56} fs={20} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-bold" style={{ fontSize: 18 }}>Carla Menezes</p>
            <span className="inline-flex items-center gap-1 rounded-full font-semibold" style={{ fontSize: 11, padding: "3px 8px", color: "var(--success)", background: "color-mix(in srgb, var(--success) 12%, transparent)" }}>
              <span style={{ width: 5, height: 5, borderRadius: 99, background: "var(--success)" }} />Disponivel
            </span>
          </div>
          <p className="flex items-center gap-1.5" style={{ fontSize: 13, color: "var(--text-secondary)" }}><Briefcase size={12} /> Head de Produto</p>
        </div>
      </div>
      <div style={{ background: "var(--surface-2)", borderRadius: 10, padding: 14, marginBottom: 12 }}>
        <p style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text-secondary)" }}>15 anos liderando produto em fintech e marketplace. Foco em discovery, priorizacao e desenvolvimento de PMs em inicio de carreira.</p>
      </div>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 8 }}>Skills</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {["Discovery", "Roadmap", "OKRs", "Pesquisa", "Lideranca"].map(s => (
          <span key={s} className="rounded-full font-medium" style={{ fontSize: 11, padding: "3px 10px", background: "var(--brand-soft)", color: "var(--brand)" }}>{s}</span>
        ))}
      </div>
      <button className="w-full flex items-center justify-center gap-2 font-semibold" style={{ height: 40, borderRadius: 10, fontSize: 13, background: brand, color: "var(--brand-contrast)" }}>
        Solicitar mentoria <ArrowRight size={14} />
      </button>
    </div>
  );
}

function PreviewMentor({ brand }) {
  const reqs = [
    { n: "Pedro Sanches", g: "Transicao para lideranca", t: "ha 2h" },
    { n: "Marina Costa", g: "Estruturar discovery", t: "ha 5h" },
  ];
  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[{ v: "2", l: "Mentees" }, { v: "2", l: "Pendentes" }, { v: "50%", l: "Capacidade" }].map((s, i) => (
          <div key={i} style={{ background: "var(--surface-2)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
            <p className="font-bold" style={{ fontSize: 20, color: "var(--brand)" }}>{s.v}</p>
            <p style={{ fontSize: 10, color: "var(--text-secondary)" }}>{s.l}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: 8 }}>Solicitacoes</p>
      <div className="flex flex-col gap-2.5">
        {reqs.map((r, i) => (
          <div key={i} className="flex items-center gap-3" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 10 }}>
            <Initials name={r.n} size={34} fs={11} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate" style={{ fontSize: 12 }}>{r.n}</p>
              <p className="truncate" style={{ fontSize: 11, color: "var(--text-secondary)" }}>{r.g}</p>
            </div>
            <button className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 30, height: 30, background: "color-mix(in srgb, var(--success) 14%, transparent)", color: "var(--success)" }}><Check size={15} strokeWidth={2.5} /></button>
            <button className="flex items-center justify-center rounded-lg shrink-0" style={{ width: 30, height: 30, background: "var(--surface-2)", color: "var(--text-muted)" }}><X size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

const TABS = [
  { key: "match", label: "Match", icon: LayoutGrid, Comp: PreviewMatch },
  { key: "profile", label: "Perfil", icon: User, Comp: PreviewProfile },
  { key: "mentor", label: "Mentor", icon: Users, Comp: PreviewMentor },
];

function AppPreview({ brand, name }) {
  const [tab, setTab] = useState("match");
  const reduce = useReducedMotion();
  const Active = TABS.find(t => t.key === tab).Comp;
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, boxShadow: "var(--shadow-lg)", overflow: "hidden", maxWidth: 460, margin: "0 auto" }}>
      {/* browser chrome */}
      <div className="flex items-center gap-2 px-4" style={{ height: 38, borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}>
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "#FF5F57" }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "#FEBC2E" }} />
        <span style={{ width: 9, height: 9, borderRadius: 99, background: "#28C840" }} />
        <div className="mx-auto flex items-center gap-1.5 rounded-md px-3" style={{ height: 22, background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11, color: "var(--text-muted)" }}>
          <Shield size={10} /> {name.toLowerCase().replace(/\s/g, "")}.mentormatch.app
        </div>
      </div>
      {/* app header */}
      <div className="flex items-center justify-between px-4" style={{ height: 44, borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center rounded-md" style={{ width: 22, height: 22, background: brand }}><Zap size={12} style={{ color: "var(--brand-contrast)" }} fill="var(--brand-contrast)" /></div>
          <span className="font-bold" style={{ fontSize: 13 }}>{name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative"><Bell size={15} style={{ color: "var(--text-secondary)" }} /><span className="absolute -top-1 -right-1" style={{ width: 6, height: 6, borderRadius: 99, background: brand }} /></div>
          <Initials name="Voce" size={24} fs={9} />
        </div>
      </div>
      {/* tabs */}
      <div className="flex items-center gap-1 px-3 pt-2.5">
        {TABS.map(t => {
          const Icon = t.icon; const on = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className="relative flex items-center gap-1.5 font-medium" style={{ fontSize: 12, padding: "6px 12px", color: on ? "var(--brand)" : "var(--text-secondary)" }}>
              <Icon size={13} /> {t.label}
              {on && <motion.div layoutId="preview-tab" className="absolute left-0 right-0" style={{ bottom: -3, height: 2, borderRadius: 99, background: brand }} />}
            </button>
          );
        })}
      </div>
      <div style={{ borderTop: "1px solid var(--border)", minHeight: 308 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: EASE }}>
            <Active brand={brand} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function MentorMatchLandingV2() {
  const reduce = useReducedMotion();
  const [tenantKey, setTenantKey] = useState("Indigo");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = TENANTS[tenantKey];

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const themeVars = dark
    ? { "--bg": "#0A0A0E", "--surface": "#15151B", "--surface-2": "#1E1E26", "--border": "#26262F", "--border-strong": "#34343F", "--text": "#F5F5F8", "--text-secondary": "#B0B0BC", "--text-muted": "#71717F", "--brand-soft": "color-mix(in srgb, var(--brand) 18%, transparent)", "--grid": "rgba(255,255,255,0.04)" }
    : { "--bg": "#FBFBFD", "--surface": "#FFFFFF", "--surface-2": "#F4F4F7", "--border": "#E6E6EC", "--border-strong": "#D3D3DC", "--text": "#121217", "--text-secondary": "#5B5B66", "--text-muted": "#9A9AA6", "--brand-soft": t.soft, "--grid": "rgba(17,17,23,0.04)" };

  const vars = {
    "--brand": t.brand, "--brand-hover": t.hover, "--brand-ring": t.ring, "--brand-contrast": t.contrast,
    "--success": "#16A34A", "--warning": "#D97706", "--danger": "#DC2626",
    "--shadow-xs": "0 1px 2px rgba(17,17,23,0.06)", "--shadow-sm": "0 2px 8px rgba(17,17,23,0.08)",
    "--shadow-md": dark ? "0 8px 24px rgba(0,0,0,0.5)" : "0 8px 24px rgba(17,17,23,0.10)",
    "--shadow-lg": dark ? "0 24px 60px rgba(0,0,0,0.6)" : "0 24px 60px rgba(17,17,23,0.16)",
    "--shadow-brand": `0 10px 30px ${t.ring}`,
    ...themeVars,
  };

  const Pill = ({ children, big, variant = "primary" }) => {
    const base = { height: big ? 52 : 44, borderRadius: 999, padding: big ? "0 28px" : "0 22px", fontSize: big ? 16 : 15 };
    if (variant === "primary") return (
      <button className="inline-flex items-center justify-center gap-2 font-semibold transition-all" style={{ ...base, background: t.brand, color: "var(--brand-contrast)", boxShadow: "var(--shadow-xs)" }}
        onMouseEnter={e => { e.currentTarget.style.background = t.hover; e.currentTarget.style.boxShadow = "var(--shadow-brand)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = t.brand; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; e.currentTarget.style.transform = "translateY(0)"; }}>{children}</button>
    );
    return (
      <button className="inline-flex items-center justify-center gap-2 font-semibold transition-all" style={{ ...base, background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border-strong)" }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = t.brand; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}>{children}</button>
    );
  };

  return (
    <div style={{ ...vars, background: "var(--bg)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: "var(--text)" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Demo bar */}
      <div className="flex flex-wrap items-center gap-3 px-6 py-2.5" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <span className="flex items-center gap-1.5 font-semibold" style={{ fontSize: 13, color: "var(--text-secondary)" }}><Sparkles size={14} style={{ color: "var(--brand)" }} /> Demo white-label</span>
        {Object.entries(TENANTS).map(([k, v]) => (
          <button key={k} onClick={() => setTenantKey(k)} title={v.name} className="rounded-full transition-all"
            style={{ width: 24, height: 24, background: v.brand, border: tenantKey === k ? "2px solid var(--text)" : "2px solid transparent", outline: tenantKey === k ? "2px solid var(--bg)" : "none", outlineOffset: -4 }} />
        ))}
        <button onClick={() => setDark(d => !d)} className="ml-auto flex items-center gap-1.5 rounded-full font-medium" style={{ fontSize: 13, padding: "5px 12px", background: "var(--surface-2)", color: "var(--text-secondary)" }}>
          {dark ? <Sun size={14} /> : <Moon size={14} />} {dark ? "Light" : "Dark"}
        </button>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40" style={{ background: "color-mix(in srgb, var(--bg) 72%, transparent)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--border)" }}>
        <nav className="max-w-[1180px] mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, background: t.brand }}><Zap size={18} style={{ color: "var(--brand-contrast)" }} fill="var(--brand-contrast)" /></div>
            <span className="font-extrabold" style={{ fontSize: 18, letterSpacing: "-0.02em" }}>{t.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {["Produto", "Para mentores", "Para empresas", "Precos"].map(l => (
              <a key={l} href="#" className="font-medium px-3 py-2 rounded-lg" style={{ fontSize: 15, color: "var(--text-secondary)" }} onMouseEnter={e => e.currentTarget.style.color = "var(--text)"} onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}>{l}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="font-semibold" style={{ fontSize: 15 }}>Entrar</a>
            <Pill>Comecar agora</Pill>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(o => !o)} style={{ color: "var(--text)" }}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </nav>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-1" style={{ borderTop: "1px solid var(--border)" }}>
            {["Produto", "Para mentores", "Para empresas", "Precos"].map(l => <a key={l} href="#" className="font-medium py-2.5" style={{ fontSize: 16, color: "var(--text-secondary)" }}>{l}</a>)}
            <div className="mt-2"><Pill>Comecar agora</Pill></div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section ref={heroRef} className="relative overflow-hidden">
        {/* grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)", backgroundSize: "44px 44px", maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)", WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)" }} />
        {/* animated glow */}
        <motion.div className="absolute pointer-events-none" style={{ top: -120, left: "50%", x: "-50%", y: glowY, width: 720, height: 480, background: `radial-gradient(ellipse at center, ${t.soft} 0%, transparent 65%)`, opacity: dark ? 0.5 : 0.9 }} />

        <motion.div style={{ opacity: heroFade }} className="relative max-w-[1180px] mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* left copy */}
          <div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 14 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
              className="inline-flex items-center gap-2 rounded-full mb-6" style={{ padding: "6px 14px", background: "var(--brand-soft)", color: t.brand, fontSize: 13, fontWeight: 600, border: `1px solid color-mix(in srgb, ${t.brand} 24%, transparent)` }}>
              <span className="relative flex" style={{ width: 7, height: 7 }}><span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping" style={{ background: t.brand }} /><span className="relative rounded-full" style={{ width: 7, height: 7, background: t.brand }} /></span>
              Mentoria corporativa white-label
            </motion.div>
            <motion.h1 initial={reduce ? false : { opacity: 0, y: 22 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE, delay: 0.05 }}
              style={{ fontSize: "clamp(36px, 5.2vw, 58px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.025em" }}>
              Mentoria interna<br />com a <span style={{ color: t.brand }}>cara da sua marca</span>
            </motion.h1>
            <motion.p initial={reduce ? false : { opacity: 0, y: 22 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE, delay: 0.12 }}
              className="mt-6" style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: 460 }}>
              Conecte mentores e mentees por objetivo, com controle de capacidade e a identidade visual da sua empresa. Lance em dias, nao em meses.
            </motion.p>
            <motion.div initial={reduce ? false : { opacity: 0, y: 22 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: EASE, delay: 0.18 }}
              className="flex flex-wrap items-center gap-3 mt-9">
              <Pill big>Comecar agora <ArrowRight size={18} /></Pill>
              <Pill big variant="secondary">Ver demo ao vivo</Pill>
            </motion.div>
            <motion.div initial={reduce ? false : { opacity: 0 }} animate={reduce ? undefined : { opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center gap-4 mt-8" style={{ fontSize: 13, color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1.5"><Check size={14} style={{ color: "var(--success)" }} /> Sem cartao</span>
              <span className="flex items-center gap-1.5"><Check size={14} style={{ color: "var(--success)" }} /> Dados isolados por tenant</span>
            </motion.div>
          </div>

          {/* right: live app preview */}
          <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }} animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}>
            <AppPreview brand={t.brand} name={t.name} />
            <p className="text-center mt-4 flex items-center justify-center gap-1.5" style={{ fontSize: 12, color: "var(--text-muted)" }}>
              <span className="relative flex" style={{ width: 6, height: 6 }}><span className="absolute inline-flex w-full h-full rounded-full opacity-60 animate-ping" style={{ background: "var(--success)" }} /><span className="relative rounded-full" style={{ width: 6, height: 6, background: "var(--success)" }} /></span>
              Preview interativo. Clique nas abas Match, Perfil e Mentor.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* Logos */}
      <section className="py-9" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-center mb-5" style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>Times que desenvolvem talento com o {t.name}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {["Sicredi", "Ocean Corp", "Northwind", "Vertex", "Lumen", "Apex"].map(l => <span key={l} className="font-bold" style={{ fontSize: 17, color: "var(--text-muted)", opacity: 0.6 }}>{l}</span>)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1180px] mx-auto px-6 py-24">
        <Reveal className="mb-14" style={{ maxWidth: 560 }}>
          <span className="font-semibold" style={{ fontSize: 13, color: t.brand, textTransform: "uppercase", letterSpacing: "0.05em" }}>Como funciona</span>
          <h2 className="mt-3" style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Do cadastro ao primeiro encontro em tres passos</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ icon: Users, t: "Monte seu perfil", d: "Skills, objetivos e disponibilidade em minutos. Seja mentor, mentee ou os dois." },
            { icon: Target, t: "Encontre o match", d: "Navegue pela vitrine e escolha quem esta alinhado com onde voce quer chegar." },
            { icon: CalendarCheck, t: "Cresca junto", d: "Solicitacao aceita, conversa iniciada, jornada acompanhada no mesmo lugar." }].map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div whileHover={reduce ? undefined : { y: -4 }} className="h-full relative overflow-hidden"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 28, boxShadow: "var(--shadow-xs)" }}>
                  <span className="absolute font-extrabold" style={{ top: 12, right: 18, fontSize: 64, lineHeight: 1, color: "var(--brand-soft)", opacity: dark ? 0.4 : 1 }}>0{i + 1}</span>
                  <div className="relative flex items-center justify-center rounded-xl mb-5" style={{ width: 48, height: 48, background: "var(--brand-soft)" }}><Icon size={22} style={{ color: t.brand }} /></div>
                  <h3 className="relative" style={{ fontSize: 20, fontWeight: 700 }}>{s.t}</h3>
                  <p className="relative mt-2" style={{ fontSize: 15, lineHeight: 1.6, color: "var(--text-secondary)" }}>{s.d}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24" style={{ background: "var(--surface-2)" }}>
        <div className="max-w-[1180px] mx-auto px-6">
          <Reveal className="mb-14 text-center">
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em" }}>Feito para os dois lados</h2>
            <p className="mx-auto mt-3" style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 500 }}>Mentee ou mentor, a experiencia respeita o tempo e o objetivo de cada um.</p>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {[{ tag: "Para mentees", icon: Target, list: ["Acesso aos mentores certos para seu objetivo", "Vitrine clara com skills e disponibilidade", "Solicitacao simples, sem burocracia", "Acompanhamento da sua evolucao"] },
              { tag: "Para mentores", icon: Users, list: ["Controle total de quantos mentees aceitar", "Pedidos chegam com contexto e objetivo", "Agenda respeitada com limite de capacidade", "Impacto mensuravel no time"] }].map((col, i) => {
              const Icon = col.icon;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="h-full" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 18, padding: 32, boxShadow: "var(--shadow-xs)" }}>
                    <div className="flex items-center gap-2.5 mb-6">
                      <div className="flex items-center justify-center rounded-lg" style={{ width: 36, height: 36, background: "var(--brand-soft)" }}><Icon size={18} style={{ color: t.brand }} /></div>
                      <span className="font-bold" style={{ fontSize: 16 }}>{col.tag}</span>
                    </div>
                    <ul className="flex flex-col gap-4">
                      {col.list.map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ width: 22, height: 22, background: "color-mix(in srgb, var(--success) 14%, transparent)" }}><Check size={13} style={{ color: "var(--success)" }} strokeWidth={3} /></span>
                          <span style={{ fontSize: 16, lineHeight: 1.5 }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-[1180px] mx-auto px-6 py-24">
        <div className="grid sm:grid-cols-3 gap-8">
          {[{ to: 92, suffix: "%", d: "dos pares seguem ativos apos 3 meses", icon: TrendingUp },
            { to: 4.8, suffix: "", decimals: 1, d: "nota media de satisfacao dos mentees", icon: Star },
            { to: 2, suffix: "x", d: "mais rapido para fechar o primeiro match", icon: Clock }].map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={i} delay={i * 0.1} className="text-center">
                <Icon size={22} className="mx-auto mb-3" style={{ color: t.brand }} />
                <p style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text)", lineHeight: 1 }}>
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
                </p>
                <p className="mt-3 mx-auto" style={{ fontSize: 15, color: "var(--text-secondary)", maxWidth: 220 }}>{s.d}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-[1180px] mx-auto px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 24, padding: "clamp(28px, 5vw, 56px)", boxShadow: "var(--shadow-sm)" }}>
            <span className="absolute font-serif" style={{ top: -20, right: 24, fontSize: 160, lineHeight: 1, color: "var(--brand-soft)", opacity: dark ? 0.4 : 1 }}>&rdquo;</span>
            <div className="relative">
              <div className="flex gap-1 mb-5">{[...Array(5)].map((_, i) => <Star key={i} size={18} style={{ color: t.brand }} fill={t.brand} />)}</div>
              <p style={{ fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 500, lineHeight: 1.45, letterSpacing: "-0.01em", maxWidth: 760 }}>
                Estruturamos o programa em duas semanas. A vitrine com controle de capacidade resolveu o problema de mentor sobrecarregado que a gente arrastava ha um ano.
              </p>
              <div className="flex items-center gap-3 mt-7">
                <Initials name="Larice Pereira" size={48} fs={16} />
                <div><p className="font-semibold" style={{ fontSize: 15 }}>Larice Pereira</p><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Lider de L&D</p></div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="max-w-[1180px] mx-auto px-6 pb-24">
        <Reveal>
          <div className="text-center relative overflow-hidden" style={{ background: t.brand, borderRadius: 28, padding: "clamp(44px, 6vw, 76px)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px", maskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, black, transparent)", WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, black, transparent)" }} />
            <div className="absolute pointer-events-none" style={{ top: -80, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.22) 0%, transparent 70%)" }} />
            <div className="relative">
              <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--brand-contrast)" }}>Pronto para desenvolver seu time?</h2>
              <p className="mx-auto mt-4" style={{ fontSize: 18, lineHeight: 1.6, color: "var(--brand-contrast)", opacity: 0.9, maxWidth: 500 }}>Lance seu programa de mentoria com a sua marca. Comece pela demo, sem cartao.</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-9">
                <button className="inline-flex items-center justify-center gap-2 font-semibold transition-transform" style={{ height: 52, borderRadius: 999, padding: "0 28px", fontSize: 16, background: "var(--brand-contrast)", color: t.brand }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>Comecar agora <ArrowRight size={18} /></button>
                <button className="inline-flex items-center justify-center gap-2 font-semibold" style={{ height: 52, borderRadius: 999, padding: "0 28px", fontSize: 16, background: "transparent", color: "var(--brand-contrast)", border: "1px solid color-mix(in srgb, var(--brand-contrast) 40%, transparent)" }}>Falar com vendas</button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-[1180px] mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, background: t.brand }}><Zap size={15} style={{ color: "var(--brand-contrast)" }} fill="var(--brand-contrast)" /></div>
              <span className="font-extrabold" style={{ fontSize: 16 }}>{t.name}</span>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3">{["Produto", "Para empresas", "Precos", "Seguranca", "Contato"].map(l => <a key={l} href="#" className="font-medium" style={{ fontSize: 14, color: "var(--text-secondary)" }}>{l}</a>)}</div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-8 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>2026 {t.name}. Plataforma de mentoria white-label.</p>
            <div className="flex items-center gap-2" style={{ fontSize: 13, color: "var(--text-muted)" }}><Shield size={14} /> Dados isolados por tenant. LGPD-ready.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
