import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Inbox, Users, BookOpen, Bell, User,
  LogOut, ArrowRight, Check, Star, Clock, ChevronRight,
  Plus, Calendar, TrendingUp, Award, Zap, Search,
  MessageCircle, Target, AlertCircle, BookMarked
} from "lucide-react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identical to landing page
   ───────────────────────────────────────────── */
const T = {
  bgDeep:      "#08080d",
  bgBase:      "#0d0d14",
  bgElevated:  "#13131e",
  surface:     "rgba(255,255,255,0.04)",
  glass:       "rgba(255,255,255,0.07)",
  border:      "rgba(255,255,255,0.07)",
  borderAccent:"rgba(99,102,241,0.35)",
  accent:      "#4F46E5",
  accentAlt:   "#6366F1",
  accentGlow:  "rgba(79,70,229,0.28)",
  green:       "#10B981",
  greenGlow:   "rgba(16,185,129,0.2)",
  amber:       "#F59E0B",
  text:        "#EDEDEF",
  textMuted:   "#6B7280",
  textSub:     "#9CA3AF",
  radius:      "14px",
  radiusSm:    "8px",
  sidebar:     "#0b0b11",
};

/* ─────────────────────────────────────────────
   SIDEBAR
   ───────────────────────────────────────────── */
function Sidebar({ active, role, onNav, badges }) {
  const nav = [
    { id: "dashboard",  label: "Dashboard",       icon: <LayoutDashboard size={16} /> },
    { id: "requests",   label: "Solicitações",     icon: <Inbox size={16} />,   badge: badges.requests },
    { id: "conexoes",   label: "Minhas Conexões",  icon: <Users size={16} /> },
    { id: "biblioteca", label: "Biblioteca",       icon: <BookOpen size={16} /> },
    { id: "notifs",     label: "Notificações",     icon: <Bell size={16} />,    badge: badges.notifs },
    { id: "perfil",     label: "Perfil",           icon: <User size={16} />,    progress: 75 },
  ];

  return (
    <aside style={{
      width: 228, minHeight: "100vh", flexShrink: 0,
      background: T.sidebar,
      borderRight: `1px solid ${T.border}`,
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.accentAlt})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={13} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", color: T.text }}>MentorMatch</span>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, #8B5CF6)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            TM
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Teste MentorMatch</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
              <span style={{ fontSize: 11, color: T.textMuted }}>
                {role === "mentor" ? "Mentor Ativo" : "Mentorado"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(({ id, label, icon, badge, progress }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
              background: isActive ? "rgba(99,102,241,0.14)" : "transparent",
              color: isActive ? "#A5B4FC" : T.textMuted,
              transition: "all 0.15s ease",
            }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ color: isActive ? T.accentAlt : "inherit", display: "flex" }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {badge > 0 && (
                  <span style={{ background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 20, minWidth: 18, textAlign: "center" }}>
                    {badge}
                  </span>
                )}
                {progress && (
                  <span style={{ fontSize: 10, color: progress < 100 ? T.amber : T.green, fontWeight: 600 }}>
                    {progress}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.border}` }}>
        <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 10, border: "none", background: "transparent", color: T.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "inherit", transition: "all 0.15s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#FCA5A5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; }}
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
   ───────────────────────────────────────────── */
function StatCard({ icon, label, value, sub, accent, progress, total }) {
  return (
    <div style={{
      background: T.glass, backdropFilter: "blur(14px)",
      border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: "22px 24px", flex: 1,
      transition: "border-color 0.2s ease, transform 0.2s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderAccent; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${accent}18`, border: `1px solid ${accent}28`, display: "flex", alignItems: "center", justifyContent: "center", color: accent }}>
          {icon}
        </div>
        {progress !== undefined && (
          <span style={{ fontSize: 10, color: T.textMuted, background: T.surface, padding: "3px 8px", borderRadius: 20, fontWeight: 500 }}>
            {value} / {total} slots
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: T.text, letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 4 }}>
        {value}{progress !== undefined ? "" : ""}
      </div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: progress !== undefined ? 12 : 0 }}>{label}</div>
      {progress !== undefined && (
        <div>
          <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                width: 20, height: 20, borderRadius: "50%", fontSize: 9, fontWeight: 700,
                background: i < value ? `${accent}22` : T.surface,
                border: `1.5px solid ${i < value ? accent : "rgba(255,255,255,0.1)"}`,
                color: i < value ? accent : T.textMuted,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {i < value ? <Check size={9} /> : ""}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: T.textMuted }}>
            {total - value > 0 ? `${total - value} vagas disponíveis` : "Capacidade completa"}
          </div>
        </div>
      )}
      {sub && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
   ───────────────────────────────────────────── */
function EmptyState({ icon, title, desc, cta, ctaSecondary, steps }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "32px 24px" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.textMuted, marginBottom: 14 }}>
        {icon}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, maxWidth: 320, marginBottom: steps ? 20 : (cta ? 18 : 0) }}>{desc}</div>
      {steps && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, width: "100%", maxWidth: 320, textAlign: "left" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${T.accent}18`, border: `1px solid ${T.borderAccent}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 9, fontWeight: 700, color: "#A5B4FC" }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: T.textSub, lineHeight: 1.5, paddingTop: 2 }}>{s}</span>
            </div>
          ))}
        </div>
      )}
      {cta && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          <button style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accentAlt})`, border: "none", color: "#fff", padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit", boxShadow: `0 4px 14px ${T.accentGlow}` }}>
            {cta} <ArrowRight size={12} />
          </button>
          {ctaSecondary && (
            <button style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.textSub, padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              {ctaSecondary}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MENTOR CARD (para mentee dashboard)
   ───────────────────────────────────────────── */
function MentorCard({ name, role, tags, rating, available }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2);
  const colors = [["#6366F1","#4F46E5"], ["#8B5CF6","#7C3AED"], ["#06B6D4","#0891B2"]];
  const [c1, c2] = colors[name.length % 3];

  return (
    <div style={{
      background: T.glass, backdropFilter: "blur(14px)",
      border: `1px solid ${T.border}`, borderRadius: T.radius,
      padding: "20px", display: "flex", flexDirection: "column", gap: 12,
      transition: "border-color 0.2s ease, transform 0.2s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderAccent; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${c1}, ${c2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{name}</div>
          <div style={{ fontSize: 11, color: T.textMuted, marginTop: 1 }}>{role}</div>
        </div>
        {available && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
            <span style={{ fontSize: 10, color: T.green }}>Disponível</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {tags.map(t => (
          <span key={t} style={{ background: `${c1}18`, color: `${c1}CC`, fontSize: 10, padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>{t}</span>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={11} fill={i <= Math.floor(rating) ? T.amber : "none"} color={i <= Math.floor(rating) ? T.amber : "#374151"} />
          ))}
          <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 3 }}>{rating}</span>
        </div>
        <button style={{ background: `${T.accent}18`, border: `1px solid ${T.borderAccent}`, color: "#A5B4FC", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s ease" }}
          onMouseEnter={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = `${T.accent}18`; e.currentTarget.style.color = "#A5B4FC"; }}
        >
          Conectar
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ONBOARDING PROGRESS BAR (mentee only)
   ───────────────────────────────────────────── */
function OnboardingBar({ step }) {
  const steps = ["Perfil criado", "Encontrar mentor", "1ª sessão"];
  const pct = Math.round((step / steps.length) * 100);

  return (
    <div style={{ background: T.glass, backdropFilter: "blur(14px)", border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "18px 24px", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Sua jornada de desenvolvimento</div>
        <div style={{ fontSize: 12, color: T.textMuted }}>{pct}% concluído</div>
      </div>

      {/* Progress track */}
      <div style={{ position: "relative", height: 4, background: T.surface, borderRadius: 4, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.accentAlt})`, borderRadius: 4, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {steps.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <div key={s} style={{ flex: 1, display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: 8, background: done ? "rgba(16,185,129,0.08)" : current ? `${T.accent}12` : T.surface, border: `1px solid ${done ? "rgba(16,185,129,0.2)" : current ? T.borderAccent : T.border}` }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, background: done ? T.green : current ? T.accent : T.surface, border: `1.5px solid ${done ? T.green : current ? T.accentAlt : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {done ? <Check size={9} color="#fff" /> : <span style={{ fontSize: 8, fontWeight: 700, color: current ? "#fff" : T.textMuted }}>{i + 1}</span>}
              </div>
              <span style={{ fontSize: 11, fontWeight: done || current ? 500 : 400, color: done ? T.green : current ? "#A5B4FC" : T.textMuted, whiteSpace: "nowrap" }}>{s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUICK ACTIONS GRID
   ───────────────────────────────────────────── */
function QuickActions() {
  const actions = [
    { icon: <BookOpen size={18} />,   label: "Biblioteca",    color: "#6366F1" },
    { icon: <Calendar size={18} />,   label: "Agenda",        color: "#06B6D4" },
    { icon: <Bell size={18} />,       label: "Notificações",  color: "#F59E0B" },
    { icon: <User size={18} />,       label: "Perfil",        color: "#10B981" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {actions.map(({ icon, label, color }) => (
        <button key={label} style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: T.radiusSm, padding: "14px 12px",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.15s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.background = `${color}0a`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.surface; }}
        >
          <div style={{ color, display: "flex" }}>{icon}</div>
          <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MENTOR DASHBOARD
   ───────────────────────────────────────────── */
function MentorDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", background: T.bgBase }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
          {greeting}, Teste
        </h1>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Pronto para impactar carreiras hoje?</p>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <StatCard icon={<Users size={17} />}     label="Mentorados ativos"  value={0} progress={0} total={4}  accent={T.accentAlt} />
        <StatCard icon={<Clock size={17} />}     label="Horas de mentoria"  value="0h" sub="Este mês: 0h · Total: 0h" accent="#06B6D4" />
        <StatCard icon={<Award size={17} />}     label="Nota média"         value="—"  sub="Sem avaliações ainda"      accent={T.amber} />
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* Solicitações pendentes */}
        <div style={{ background: T.glass, backdropFilter: "blur(14px)", border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Inbox size={15} color={T.accentAlt} />
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Solicitações Pendentes</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, boxShadow: `0 0 8px ${T.green}` }} />
              <span style={{ fontSize: 11, color: T.green, fontWeight: 500 }}>Aceitando mentorados</span>
            </div>
          </div>
          <EmptyState
            icon={<Inbox size={22} />}
            title="Nenhuma solicitação pendente"
            desc="Quando mentorados enviarem pedidos de conexão, eles aparecerão aqui."
            cta="Completar meu perfil"
            ctaSecondary="Como funciona o matching?"
          />
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Próxima sessão */}
          <div style={{ background: T.glass, backdropFilter: "blur(14px)", border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <Calendar size={14} color={T.accentAlt} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Próxima Sessão</span>
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, textAlign: "center", padding: "8px 0" }}>
              Nenhuma sessão agendada.
            </div>
            <button style={{ width: "100%", marginTop: 10, background: `${T.accent}14`, border: `1px solid ${T.borderAccent}`, color: "#A5B4FC", padding: "8px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Ver agenda
            </button>
          </div>

          {/* Acesso rápido */}
          <div style={{ background: T.glass, backdropFilter: "blur(14px)", border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "18px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
              <Zap size={14} color={T.amber} />
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Acesso Rápido</span>
            </div>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MENTEE DASHBOARD
   ───────────────────────────────────────────── */
function MenteeDashboard() {
  const mentors = [
    { name: "Ana Rodrigues",  role: "Product Manager · Nubank",     tags: ["Product","Estratégia","UX"],  rating: 4.9, available: true  },
    { name: "João Barcelos",  role: "Engineering Manager · iFood",  tags: ["Liderança","React","Node"],   rating: 5.0, available: true  },
    { name: "Camila Luz",     role: "Designer Sênior · Globo",      tags: ["Design","Figma","Branding"], rating: 4.7, available: false },
  ];

  return (
    <div style={{ flex: 1, padding: "32px 36px", overflowY: "auto", background: T.bgBase }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: "-0.02em" }}>
          Olá, Teste
        </h1>
        <p style={{ fontSize: 13, color: T.textMuted, marginTop: 4 }}>Pronto para continuar seu desenvolvimento profissional?</p>
      </div>

      {/* Onboarding progress */}
      <OnboardingBar step={1} />

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, marginBottom: 24 }}>

        {/* Próxima sessão */}
        <div style={{ background: T.glass, backdropFilter: "blur(14px)", border: `1px solid ${T.border}`, borderRadius: T.radius }}>
          <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={15} color={T.accentAlt} />
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Sua Próxima Sessão</span>
          </div>
          <EmptyState
            icon={<Calendar size={22} />}
            title="Nenhuma sessão agendada"
            desc="Para ter sua primeira sessão siga os passos:"
            steps={[
              "Encontre um mentor compatível com seus objetivos",
              "Envie uma solicitação de conexão",
              "Agendem juntos a primeira sessão",
            ]}
            cta="Encontrar Mentor"
          />
        </div>

        {/* Biblioteca recomendada */}
        <div style={{ background: `linear-gradient(135deg, ${T.accent}, #7C3AED)`, borderRadius: T.radius, padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <BookMarked size={15} color="rgba(255,255,255,0.9)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.95)" }}>Biblioteca</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>Recomendados para você</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>
            Nenhum material disponível ainda.
          </div>
          <button style={{ marginTop: 16, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", width: "100%", transition: "all 0.15s ease" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            Ver biblioteca completa
          </button>
        </div>
      </div>

      {/* Mentores disponíveis */}
      <div style={{ background: T.glass, backdropFilter: "blur(14px)", border: `1px solid ${T.border}`, borderRadius: T.radius }}>
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={15} color={T.accentAlt} />
            <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Mentores Disponíveis para Você</span>
          </div>
          <button style={{ background: "none", border: "none", color: T.accentAlt, fontSize: 12, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit" }}>
            Ver todos <ChevronRight size={12} />
          </button>
        </div>
        <div style={{ padding: "20px 22px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {mentors.map(m => <MentorCard key={m.name} {...m} />)}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT — preview com toggle mentor/mentee
   ───────────────────────────────────────────── */
export default function MentorMatchDashboard() {
  const [role, setRole] = useState("mentor");
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div style={{ background: T.bgDeep, minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: T.text, display: "flex", flexDirection: "column" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      {/* Role toggle bar */}
      <div style={{ background: T.bgDeep, borderBottom: `1px solid ${T.border}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, zIndex: 50 }}>
        <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 500 }}>Visualizar como:</span>
        {["mentor","mentee"].map(r => (
          <button key={r} onClick={() => { setRole(r); setActiveNav("dashboard"); }} style={{
            background: role === r ? `${T.accent}20` : "transparent",
            border: `1px solid ${role === r ? T.borderAccent : T.border}`,
            color: role === r ? "#A5B4FC" : T.textMuted,
            padding: "4px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
            transition: "all 0.15s ease",
          }}>
            {r === "mentor" ? "Mentor" : "Mentorado"}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 11, color: T.textMuted }}>
          MentorMatch · Dashboard Preview
        </div>
      </div>

      {/* Layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          active={activeNav}
          role={role}
          onNav={setActiveNav}
          badges={{ requests: role === "mentor" ? 0 : 0, notifs: 0 }}
        />
        {role === "mentor" ? <MentorDashboard /> : <MenteeDashboard />}
      </div>
    </div>
  );
}
