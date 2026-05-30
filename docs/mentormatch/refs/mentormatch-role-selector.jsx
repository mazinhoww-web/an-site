import { useState } from "react";
import {
  BookOpen, ArrowRight, Check, Rocket, Award,
  Users, TrendingUp, Network, Target, Star
} from "lucide-react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identical to landing + dashboard
   ───────────────────────────────────────────── */
const T = {
  bgDeep:       "#08080d",
  bgBase:       "#0d0d14",
  surface:      "rgba(255,255,255,0.04)",
  glass:        "rgba(255,255,255,0.07)",
  border:       "rgba(255,255,255,0.07)",
  borderAccent: "rgba(99,102,241,0.45)",
  accent:       "#4F46E5",
  accentAlt:    "#6366F1",
  accentGlow:   "rgba(79,70,229,0.30)",
  violet:       "#7C3AED",
  violetGlow:   "rgba(124,58,237,0.28)",
  green:        "#10B981",
  text:         "#EDEDEF",
  textMuted:    "#6B7280",
  textSub:      "#9CA3AF",
  radius:       "16px",
};

/* ─────────────────────────────────────────────
   ROLE CONFIG
   ───────────────────────────────────────────── */
const ROLES = [
  {
    id:      "mentee",
    icon:    <Rocket size={28} />,
    title:   "Quero ser Mentorado",
    tagline: "Acelere sua carreira com orientação especializada",
    desc:    "Busco orientação de especialistas para desenvolver novas habilidades, superar desafios e alcançar meus objetivos profissionais.",
    perks:   [
      { icon: <Users size={13} />,       text: "Acesso à rede de especialistas" },
      { icon: <Target size={13} />,      text: "Sessões 1:1 focadas nos seus objetivos" },
      { icon: <TrendingUp size={13} />,  text: "Acompanhamento de progresso" },
      { icon: <BookOpen size={13} />,    text: "Biblioteca de materiais exclusivos" },
    ],
    color:    T.accent,
    colorAlt: T.accentAlt,
    glow:     T.accentGlow,
    badge:    "Para quem quer crescer",
  },
  {
    id:      "mentor",
    icon:    <Award size={28} />,
    title:   "Quero ser Mentor",
    tagline: "Compartilhe sua experiência e impacte carreiras",
    desc:    "Desejo guiar novos talentos, compartilhar minha experiência e contribuir ativamente para o desenvolvimento da comunidade.",
    perks:   [
      { icon: <Star size={13} />,        text: "Impacte carreiras ativamente" },
      { icon: <Network size={13} />,     text: "Expanda seu networking" },
      { icon: <Award size={13} />,       text: "Reconhecimento como especialista" },
      { icon: <TrendingUp size={13} />,  text: "Desenvolva habilidades de liderança" },
    ],
    color:    T.violet,
    colorAlt: "#8B5CF6",
    glow:     T.violetGlow,
    badge:    "Para quem quer ensinar",
  },
];

/* ─────────────────────────────────────────────
   ROLE CARD
   ───────────────────────────────────────────── */
function RoleCard({ role, selected, onSelect }) {
  const { id, icon, title, tagline, desc, perks, color, colorAlt, glow, badge } = role;
  const [hovered, setHovered] = useState(false);
  const active = selected || hovered;

  return (
    <button
      onClick={() => onSelect(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:       "relative",
        background:     selected
          ? `linear-gradient(160deg, ${color}12, ${colorAlt}08)`
          : hovered ? T.glass : T.surface,
        backdropFilter: "blur(16px)",
        border:         `1.5px solid ${selected ? color : hovered ? `${color}44` : T.border}`,
        borderRadius:   T.radius,
        padding:        "28px 28px 24px",
        cursor:         "pointer",
        textAlign:      "left",
        width:          "100%",
        fontFamily:     "inherit",
        color:          T.text,
        transition:     "all 0.22s cubic-bezier(0.16,1,0.3,1)",
        transform:      selected ? "translateY(-4px)" : hovered ? "translateY(-2px)" : "none",
        boxShadow:      selected
          ? `0 12px 40px ${glow}, inset 0 1px 0 ${color}20`
          : hovered ? `0 8px 24px ${glow}` : "none",
        outline:        "none",
      }}
    >
      {/* Selection indicator */}
      <div style={{
        position:     "absolute",
        top:          16,
        right:        16,
        width:        22,
        height:       22,
        borderRadius: "50%",
        background:   selected ? color : "transparent",
        border:       `1.5px solid ${selected ? color : "rgba(255,255,255,0.15)"}`,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        transition:   "all 0.2s ease",
        boxShadow:    selected ? `0 0 12px ${glow}` : "none",
      }}>
        {selected && <Check size={12} color="#fff" strokeWidth={3} />}
      </div>

      {/* Badge */}
      <div style={{
        display:     "inline-flex",
        alignItems:  "center",
        background:  `${color}14`,
        border:      `1px solid ${color}28`,
        borderRadius: 20,
        padding:     "3px 10px",
        fontSize:    10,
        fontWeight:  600,
        color:       `${color}CC`,
        marginBottom: 20,
        letterSpacing: "0.03em",
      }}>
        {badge}
      </div>

      {/* Icon */}
      <div style={{
        width:        56,
        height:       56,
        borderRadius: 14,
        background:   selected
          ? `linear-gradient(135deg, ${color}, ${colorAlt})`
          : `${color}18`,
        border:       `1px solid ${selected ? "transparent" : `${color}28`}`,
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        color:        selected ? "#fff" : color,
        marginBottom: 18,
        transition:   "all 0.22s ease",
        boxShadow:    selected ? `0 8px 20px ${glow}` : "none",
      }}>
        {icon}
      </div>

      {/* Title + tagline */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4, letterSpacing: "-0.01em" }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: active ? `${color}BB` : T.textMuted, fontWeight: 500, transition: "color 0.2s ease" }}>
          {tagline}
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: T.textSub, lineHeight: 1.65, marginBottom: 20 }}>
        {desc}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: selected ? `${color}20` : T.border, marginBottom: 18, transition: "background 0.2s ease" }} />

      {/* Perks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {perks.map(({ icon: pIcon, text }) => (
          <div key={text} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width:        22,
              height:       22,
              borderRadius: "50%",
              background:   selected ? `${color}18` : T.surface,
              border:       `1px solid ${selected ? `${color}30` : "rgba(255,255,255,0.08)"}`,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              color:        selected ? color : T.textMuted,
              flexShrink:   0,
              transition:   "all 0.2s ease",
            }}>
              {pIcon}
            </div>
            <span style={{ fontSize: 12, color: selected ? T.textSub : T.textMuted, transition: "color 0.2s ease" }}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom glow line when selected */}
      <div style={{
        position:     "absolute",
        bottom:       0,
        left:         "20%",
        right:        "20%",
        height:       1,
        background:   selected ? `linear-gradient(90deg, transparent, ${color}, transparent)` : "transparent",
        transition:   "all 0.3s ease",
        borderRadius: 1,
      }} />
    </button>
  );
}

/* ─────────────────────────────────────────────
   MAIN
   ───────────────────────────────────────────── */
export default function RoleSelector() {
  const [selected, setSelected] = useState(null);
  const canContinue = selected !== null;
  const selectedRole = ROLES.find(r => r.id === selected);

  return (
    <div style={{
      background:  T.bgDeep,
      minHeight:   "100vh",
      display:     "flex",
      flexDirection: "column",
      alignItems:  "center",
      justifyContent: "center",
      padding:     "40px 24px",
      fontFamily:  "Inter, system-ui, sans-serif",
      color:       T.text,
      position:    "relative",
      overflow:    "hidden",
    }}>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes auroraA { 0%,100%{transform:translate(0,0) scale(1);opacity:.45} 50%{transform:translate(20px,-15px) scale(1.06);opacity:.7} }
        @keyframes auroraB { 0%,100%{transform:translate(0,0) scale(1);opacity:.35} 50%{transform:translate(-15px,20px) scale(1.05);opacity:.6} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up   { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both }
        .fade-up-2 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both }
        .fade-up-3 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both }
        .fade-up-4 { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.3s both }
      `}</style>

      {/* Aurora */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 65%)", animation: "auroraA 16s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-8%", width: "45%", height: "45%", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)", animation: "auroraB 20s ease-in-out infinite" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 740 }}>

        {/* Logo */}
        <div className="fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, marginBottom: 36 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${T.accent}, ${T.accentAlt})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px ${T.accentGlow}` }}>
            <BookOpen size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.015em" }}>MentorMatch</span>
        </div>

        {/* Headline */}
        <div className="fade-up-2" style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 10, lineHeight: 1.2 }}>
            Qual é o seu objetivo?
          </h1>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
            Selecione como deseja participar da nossa comunidade para personalizarmos sua experiência.
          </p>
        </div>

        {/* Cards */}
        <div className="fade-up-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
          {ROLES.map(role => (
            <RoleCard
              key={role.id}
              role={role}
              selected={selected === role.id}
              onSelect={setSelected}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="fade-up-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <button
            disabled={!canContinue}
            style={{
              width:          "100%",
              maxWidth:       360,
              padding:        "14px",
              borderRadius:   12,
              border:         "none",
              fontFamily:     "inherit",
              fontSize:       15,
              fontWeight:     700,
              cursor:         canContinue ? "pointer" : "not-allowed",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            8,
              transition:     "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              background:     canContinue
                ? selectedRole
                  ? `linear-gradient(135deg, ${selectedRole.color}, ${selectedRole.colorAlt})`
                  : `linear-gradient(135deg, ${T.accent}, ${T.accentAlt})`
                : "rgba(255,255,255,0.06)",
              color:          canContinue ? "#fff" : T.textMuted,
              boxShadow:      canContinue
                ? `0 8px 28px ${selectedRole ? selectedRole.glow : T.accentGlow}`
                : "none",
              transform:      canContinue ? "translateY(0)" : "none",
            }}
            onMouseEnter={e => { if (canContinue) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { if (canContinue) e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {canContinue
              ? <>Continuar como {selected === "mentor" ? "Mentor" : "Mentorado"} <ArrowRight size={16} /></>
              : "Selecione uma opção para continuar"
            }
          </button>

          <p style={{ fontSize: 12, color: T.textMuted, textAlign: "center" }}>
            Você poderá alterar sua função depois nas configurações.
          </p>
        </div>
      </div>
    </div>
  );
}
