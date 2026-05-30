import { useState, useEffect, useRef } from "react";
import { Users, BookOpen, Building2, ArrowRight, Check, Star, Zap, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────
   SICREDI DESIGN TOKENS
   Fonte: Sicredi Empresas Design System
   ───────────────────────────────────────────── */
const S = {
  /* Primary */
  green:        "#33820D",
  greenDark:    "#26610A",
  greenDeep:    "#0A4B1E",
  greenLight:   "#D7E6C8",
  greenMid:     "#A0DC8C",

  /* Neutrals */
  text:         "#323C32",
  textMed:      "#5A645A",
  textSoft:     "#828A82",
  border:       "#CDD3CD",
  surface:      "#FAFAFA",
  white:        "#FFFFFF",

  /* Status */
  warning:      "#E6A500",
  warningBg:    "#FFEB8C",
  error:        "#AA003C",
  info:         "#28B9FF",
  chipSuccess:  "#A0DC8C",
  chipSuccessTx:"#146E37",
  chipNeutral:  "#E1E6E1",

  /* Elevation */
  shadow:       "0 2px 4px 0 #CDD3CD",
  shadowMd:     "0 3px 10px 0 rgba(50,60,50,0.1)",
  shadowLg:     "0px 4px 8px rgba(50,60,50,0.2)",

  /* Typography */
  fontDisplay:  "'Exo 2', sans-serif",
  fontBody:     "'Nunito', sans-serif",

  /* Radius */
  radiusCard:   "4px",
  radiusBtn:    "8px",
  radiusChip:   "100px",
};

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
   ───────────────────────────────────────────── */
function useCounter(target, duration, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return val;
}

/* ─────────────────────────────────────────────
   MATCH PREVIEW — Sicredi aesthetic (light cards)
   ───────────────────────────────────────────── */
function MatchPreview() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const run = () => {
      setPhase(0);
      const t1 = setTimeout(() => setPhase(1), 1400);
      const t2 = setTimeout(() => setPhase(2), 3000);
      const t3 = setTimeout(() => run(), 5600);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    };
    const t = setTimeout(run, 800);
    return () => clearTimeout(t);
  }, []);

  const offset = phase === 2 ? 56 : phase === 1 ? 28 : 0;
  const lineW  = phase >= 1 ? 20 : 0;

  const ProfileCard = ({ side, initials, name, role, tags, color }) => (
    <div style={{
      position:    "absolute",
      [side]:      0,
      background:  S.white,
      border:      `1px solid ${phase === 2 ? S.green : S.border}`,
      borderRadius: "8px",
      boxShadow:   phase === 2 ? `0 4px 16px rgba(51,130,13,0.15)` : S.shadow,
      padding:     "16px 18px",
      width:       152,
      transition:  "all 0.6s cubic-bezier(0.16,1,0.3,1)",
      transform:   side === "left" ? `translateX(${offset}px)` : `translateX(-${offset}px)`,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: S.white, marginBottom: 10, fontFamily: S.fontBody }}>
        {initials}
      </div>
      <div style={{ fontFamily: S.fontBody, fontWeight: 700, fontSize: 13, color: S.text, marginBottom: 2 }}>{name}</div>
      <div style={{ fontFamily: S.fontBody, fontSize: 11, color: S.textMed, marginBottom: 10 }}>{role}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {tags.map(t => (
          <span key={t} style={{ background: S.chipNeutral, color: S.text, fontSize: 9, padding: "2px 6px", borderRadius: S.radiusChip, fontFamily: S.fontBody, fontWeight: 600 }}>{t}</span>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 400, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ProfileCard side="left"  initials="AM" name="Ana Mentor"  role="Product Manager" tags={["PM","UX"]}      color="#33820D" />
      <ProfileCard side="right" initials="CM" name="Carlos Dev"  role="Dev Júnior"       tags={["React","Node"]} color="#26610A" />

      {/* Connection node */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", gap: 0 }}>
        <div style={{ width: lineW, height: 2, background: phase === 2 ? S.green : S.border, borderRadius: 2, transition: "all 0.4s ease" }} />
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: phase === 2 ? S.greenLight : S.surface,
          border: `2px solid ${phase === 2 ? S.green : S.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.35s ease",
          transform: phase === 2 ? "scale(1.15)" : "scale(1)",
          boxShadow: phase === 2 ? `0 4px 12px rgba(51,130,13,0.25)` : "none",
        }}>
          {phase === 2
            ? <Check size={13} color={S.green} strokeWidth={2.5} />
            : <Zap size={13} color={phase === 1 ? S.green : S.textSoft} />}
        </div>
        <div style={{ width: lineW, height: 2, background: phase === 2 ? S.green : S.border, borderRadius: 2, transition: "all 0.4s ease" }} />
      </div>

      {/* Match badge */}
      <div style={{
        position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
        background: S.greenLight, border: `1px solid ${S.green}`,
        borderRadius: S.radiusChip, padding: "3px 12px",
        fontSize: 10, fontWeight: 700, color: S.greenDeep,
        fontFamily: S.fontBody, whiteSpace: "nowrap",
        opacity: phase === 2 ? 1 : 0, transition: "opacity 0.3s ease",
      }}>
        Match realizado
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────── */
export default function SicrediMentorMatchLanding() {
  const [scrolled, setScrolled]     = useState(false);
  const [countersOn, setCountersOn] = useState(false);
  const trustRef = useRef(null);

  const mentorias  = useCounter(2400, 1800, countersOn);
  const satisfacao = useCounter(98,   1400, countersOn);
  const empresas   = useCounter(50,   1600, countersOn);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setCountersOn(true); }, { threshold: 0.4 });
    if (trustRef.current) io.observe(trustRef.current);
    return () => io.disconnect();
  }, []);

  const features = [
    { icon: <Users size={22} color={S.green} />,     title: "Matching Inteligente",    desc: "Conecte mentores e mentorados por habilidades, objetivos e disponibilidade com precisão." },
    { icon: <BookOpen size={22} color={S.green} />,  title: "Biblioteca de Materiais", desc: "Compartilhe artigos, PDFs e recursos formativos diretamente na plataforma." },
    { icon: <Building2 size={22} color={S.green} />, title: "White-Label Multitenant",  desc: "Programa próprio para cada empresa com subdomain, logo e cores personalizados." },
  ];

  const steps = [
    { n: "01", title: "Configure sua empresa",  desc: "Subdomain, logo e brand em 5 minutos. Totalmente no padrão Sicredi." },
    { n: "02", title: "Conecte as pessoas",     desc: "Mentores e mentorados entram pelo link da organização. O algoritmo faz o match." },
    { n: "03", title: "Acompanhe o impacto",    desc: "Sessões, progresso e métricas do programa em tempo real no dashboard." },
  ];

  const stats = [
    { val: mentorias,  suf: "+", lbl: "Mentorias realizadas" },
    { val: satisfacao, suf: "%", lbl: "Satisfação dos usuários" },
    { val: empresas,   suf: "+", lbl: "Cooperativas ativas" },
  ];

  /* ── Button helpers ── */
  const btnPrimary = {
    background: S.green, color: S.white,
    border: `1px solid ${S.green}`, borderRadius: S.radiusBtn,
    fontFamily: S.fontBody, fontSize: 16, fontWeight: 700,
    height: 48, padding: "0 24px", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    transition: "background 0.2s ease",
    lineHeight: "24px",
  };
  const btnSecondary = {
    background: S.white, color: S.green,
    border: `1px solid ${S.green}`, borderRadius: S.radiusBtn,
    fontFamily: S.fontBody, fontSize: 16, fontWeight: 700,
    height: 48, padding: "0 24px", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    transition: "all 0.2s ease",
  };
  const btnTransparent = {
    background: "transparent", color: S.white,
    border: `1px solid ${S.white}`, borderRadius: S.radiusBtn,
    fontFamily: S.fontBody, fontSize: 16, fontWeight: 700,
    height: 48, padding: "0 24px", cursor: "pointer",
    display: "inline-flex", alignItems: "center", gap: 8,
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ background: S.white, minHeight: "100vh", fontFamily: S.fontBody, color: S.text }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600&family=Nunito:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up   { animation: fadeUp 0.55s ease both; }
        .fade-up-2 { animation: fadeUp 0.55s ease 0.1s both; }
        .fade-up-3 { animation: fadeUp 0.55s ease 0.2s both; }
        .fade-up-4 { animation: fadeUp 0.55s ease 0.3s both; }
        .btn-primary:hover  { background: #26610A !important; }
        .btn-secondary:hover { background: #26610A !important; color: #fff !important; }
        .btn-transparent:hover { background: #33820D !important; }
        .feature-card:hover { box-shadow: 0 4px 16px rgba(51,130,13,0.12) !important; transform: translateY(-2px); }
        .step-card:hover { border-color: #33820D !important; }
        .nav-link:hover { color: #26610A !important; background: #FAFAFA !important; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: S.white,
        borderBottom: `1px solid ${scrolled ? S.border : "transparent"}`,
        boxShadow: scrolled ? S.shadow : "none",
        transition: "all 0.2s ease",
        padding: "0 40px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: S.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={16} color={S.white} />
          </div>
          <div>
            <span style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 18, color: S.text, letterSpacing: "-0.01em" }}>MentorMatch</span>
            <span style={{ fontFamily: S.fontBody, fontSize: 10, color: S.green, fontWeight: 700, marginLeft: 6, background: S.greenLight, padding: "1px 7px", borderRadius: S.radiusChip, letterSpacing: "0.04em" }}>SICREDI</span>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {["Como funciona", "Recursos", "Sobre"].map(link => (
            <a key={link} className="nav-link" href="#" style={{ fontFamily: S.fontBody, fontWeight: 700, fontSize: 14, color: S.green, padding: "8px 14px", borderRadius: S.radiusBtn, textDecoration: "none", transition: "all 0.2s ease" }}>
              {link}
            </a>
          ))}
          <button className="btn-primary" style={{ ...btnPrimary, height: 40, fontSize: 14, marginLeft: 8 }}>
            Acessar plataforma <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 40px 64px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>

        {/* Left */}
        <div className="fade-up">
          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: S.greenLight, border: `1px solid ${S.green}22`, borderRadius: S.radiusChip, padding: "4px 12px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: S.green }} />
            <span style={{ fontFamily: S.fontBody, fontSize: 12, color: S.greenDeep, fontWeight: 700 }}>Programa de Mentoria Sicredi</span>
          </div>

          <h1 style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 44, lineHeight: "52px", color: S.text, marginBottom: 20, letterSpacing: "-0.01em" }}>
            Conecte{" "}
            <span style={{ color: S.green, fontWeight: 600 }}>mentores</span>
            {" "}e{" "}
            <span style={{ color: S.green, fontWeight: 600 }}>mentorados</span>
            {" "}na sua cooperativa
          </h1>

          <p style={{ fontFamily: S.fontBody, fontSize: 16, color: S.textMed, lineHeight: "24px", marginBottom: 32, maxWidth: 440 }}>
            Plataforma white-label de mentoria para cooperativas e empresas Sicredi. Crie programas internos de desenvolvimento com matching inteligente.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 36 }}>
            <button className="btn-primary" style={btnPrimary}>
              Começar agora <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" style={btnSecondary}>
              Ver demonstração
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex" }}>
              {["AM","JB","CL","RS","FT"].map((init, i) => (
                <div key={init} style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: i % 2 === 0 ? S.green : S.greenDark,
                  border: `2px solid ${S.white}`,
                  marginLeft: i > 0 ? -9 : 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: S.white,
                  fontFamily: S.fontBody,
                }}>
                  {init}
                </div>
              ))}
            </div>
            <span style={{ fontFamily: S.fontBody, fontSize: 13, color: S.textMed }}>
              <strong style={{ color: S.text }}>2.400+</strong> mentorias realizadas
            </span>
          </div>
        </div>

        {/* Right: Match preview */}
        <div className="fade-up-2" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{
            background: S.surface, border: `1px solid ${S.border}`,
            borderRadius: 12, padding: "40px 28px 36px",
            position: "relative", width: "100%",
          }}>
            {/* Header label */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span style={{ fontFamily: S.fontBody, fontSize: 11, fontWeight: 700, color: S.textMed, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Matching em tempo real
              </span>
            </div>

            <MatchPreview />

            {/* Floating stats */}
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${S.border}` }}>
              {[
                { val: "98%", lbl: "Satisfação" },
                { val: "5 min", lbl: "Setup" },
                { val: "4.9★", lbl: "Avaliação" },
              ].map(({ val, lbl }) => (
                <div key={lbl} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: S.fontDisplay, fontWeight: 600, fontSize: 18, color: S.green }}>{val}</div>
                  <div style={{ fontFamily: S.fontBody, fontSize: 11, color: S.textMed, marginTop: 2 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <div ref={trustRef} style={{ background: S.greenDeep, padding: "36px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 28 }}>
          {stats.map(({ val, suf, lbl }) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 40, color: S.white, lineHeight: 1 }}>
                {val}<span style={{ fontWeight: 600 }}>{suf}</span>
              </div>
              <div style={{ fontFamily: S.fontBody, fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>{lbl}</div>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: S.fontBody, fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>Avaliação média</div>
            <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={S.white} color={S.white} opacity={i <= 5 ? 1 : 0.3} />)}
            </div>
            <div style={{ fontFamily: S.fontBody, fontWeight: 700, fontSize: 14, color: S.white, marginTop: 4 }}>4.9 / 5.0</div>
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <section style={{ background: S.surface, padding: "72px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }} className="fade-up">
            <div style={{ fontFamily: S.fontBody, fontSize: 11, fontWeight: 700, color: S.green, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              Como funciona
            </div>
            <h2 style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 32, lineHeight: "40px", color: S.text }}>
              Pronto em <span style={{ color: S.green, fontWeight: 600 }}>3 passos</span>
            </h2>
            <p style={{ fontFamily: S.fontBody, fontSize: 16, color: S.textMed, marginTop: 10 }}>Do cadastro ao primeiro match em minutos</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className={`step-card fade-up`} style={{
                background: S.white, border: `1px solid ${S.border}`,
                borderRadius: S.radiusCard, padding: 28,
                boxShadow: S.shadow, position: "relative", overflow: "hidden",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                animationDelay: `${i * 0.1}s`,
              }}>
                {/* Step number watermark */}
                <div style={{ position: "absolute", top: 16, right: 20, fontFamily: S.fontDisplay, fontSize: 52, fontWeight: 300, color: `${S.green}10`, lineHeight: 1, userSelect: "none" }}>
                  {n}
                </div>
                {/* Step indicator */}
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: S.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.fontDisplay, fontWeight: 600, fontSize: 15, color: S.white, marginBottom: 18 }}>
                  {parseInt(n)}
                </div>
                <h4 style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 20, lineHeight: "28px", color: S.text, marginBottom: 10 }}>
                  {title}
                </h4>
                <p style={{ fontFamily: S.fontBody, fontSize: 14, color: S.textMed, lineHeight: "20px" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "72px 40px", background: S.white }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontFamily: S.fontBody, fontSize: 11, fontWeight: 700, color: S.green, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              Recursos
            </div>
            <h2 style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 32, lineHeight: "40px", color: S.text }}>
              Tudo que seu programa precisa
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="feature-card" style={{
                background: S.white, border: `1px solid ${S.border}`,
                borderRadius: S.radiusCard, padding: 28,
                boxShadow: S.shadow,
                transition: "all 0.2s ease",
              }}>
                {/* Icon with green left border accent */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 4, alignSelf: "stretch", background: S.green, borderRadius: 2, flexShrink: 0 }} />
                  <div style={{ width: 44, height: 44, borderRadius: S.radiusCard, background: S.greenLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {icon}
                  </div>
                </div>
                <h4 style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 20, lineHeight: "28px", color: S.text, marginBottom: 10 }}>
                  {title}
                </h4>
                <p style={{ fontFamily: S.fontBody, fontSize: 14, color: S.textMed, lineHeight: "20px" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonial strip ── */}
      <section style={{ background: S.surface, borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}`, padding: "40px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {[
            { quote: "Transformou nosso programa de desenvolvimento interno. Setup em menos de 10 minutos.", name: "Coordenadora de RH", org: "Sicredi Sul Brasil" },
            { quote: "Os gestores conseguem acompanhar o progresso dos mentorados em tempo real.", name: "Gerente de Pessoas",  org: "Sicredi Centro-Norte" },
            { quote: "Facilitou muito a conexão entre colaboradores de diferentes agências.", name: "Analista de T&D",     org: "Sicredi Nordeste" },
          ].map(({ quote, name, org }) => (
            <div key={name} style={{ background: S.white, border: `1px solid ${S.border}`, borderRadius: S.radiusCard, padding: "20px 22px", boxShadow: S.shadow }}>
              {/* Green accent top bar */}
              <div style={{ height: 3, background: S.green, borderRadius: "2px 2px 0 0", margin: "-20px -22px 16px", borderTopLeftRadius: S.radiusCard, borderTopRightRadius: S.radiusCard }} />
              <p style={{ fontFamily: S.fontBody, fontSize: 14, color: S.text, lineHeight: "20px", marginBottom: 14, fontStyle: "italic" }}>
                "{quote}"
              </p>
              <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={12} fill={S.green} color={S.green} />)}
              </div>
              <div style={{ fontFamily: S.fontBody, fontWeight: 700, fontSize: 13, color: S.text }}>{name}</div>
              <div style={{ fontFamily: S.fontBody, fontSize: 12, color: S.green, fontWeight: 600 }}>{org}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ background: S.greenDeep, padding: "72px 40px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 32, lineHeight: "40px", color: S.white, marginBottom: 16 }}>
            Pronto para transformar sua <span style={{ fontWeight: 600 }}>cooperativa</span>?
          </h2>
          <p style={{ fontFamily: S.fontBody, fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: "24px", marginBottom: 36 }}>
            Configure seu programa de mentoria em minutos e conecte talentos dentro da sua organização Sicredi.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ ...btnPrimary, background: S.green, border: `1px solid ${S.green}` }}>
              Criar programa gratuitamente <ArrowRight size={16} />
            </button>
            <button className="btn-transparent" style={btnTransparent}>
              Falar com especialista
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: S.white, borderTop: `1px solid ${S.border}`, padding: "28px 40px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: S.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={12} color={S.white} />
            </div>
            <span style={{ fontFamily: S.fontDisplay, fontWeight: 300, fontSize: 15, color: S.text }}>
              MentorMatch <span style={{ color: S.green, fontWeight: 600 }}>Sicredi</span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacidade", "Termos", "Suporte"].map(link => (
              <a key={link} href="#" style={{ fontFamily: S.fontBody, fontSize: 13, color: S.green, fontWeight: 700, textDecoration: "none" }}>{link}</a>
            ))}
          </div>
          <span style={{ fontFamily: S.fontBody, fontSize: 12, color: S.textSoft }}>
            © 2026 MentorMatch · aurimarnogueira.com.br/sicredi/mentormatch
          </span>
        </div>
      </footer>

    </div>
  );
}
