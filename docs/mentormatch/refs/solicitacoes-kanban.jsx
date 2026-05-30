import { useState } from "react";
import { Inbox, Users, Clock, Check, X, ChevronDown, AlertCircle, Plus, MoreVertical } from "lucide-react";

const useT = () => ({
  bgBase:"var(--bg-base)", bgElevated:"var(--bg-elevated)",
  surface:"var(--surface)", glass:"var(--glass)", border:"var(--border)",
  borderAccent:"var(--border-accent)", accent:"var(--accent)", accentAlt:"var(--accent-alt)",
  green:"var(--green)", amber:"var(--amber)", red:"var(--red)",
  text:"var(--text)", textMuted:"var(--text-muted)", textSub:"var(--text-sub)",
  radius:"var(--radius-card)", radiusSm:"var(--radius-btn)", radiusChip:"var(--radius-chip)",
  shadow:"var(--shadow-card)", shadowMd:"var(--shadow-md)",
  fontDisplay:"var(--font-display)", fontBody:"var(--font-body)",
});

/* Slot Capacity Ring */
function SlotCapacityRing({ used, total }) {
  const r = 32; const circ = 2 * Math.PI * r;
  const filled = circ * (1 - used / total);
  const color = used === total ? "var(--red)" : used >= total - 1 ? "var(--amber)" : "var(--accent)";
  return (
    <div style={{ position:"relative", width:80, height:80, flexShrink:0 }}>
      <svg width={80} height={80} viewBox="0 0 80 80" style={{ transform:"rotate(-90deg)" }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke="var(--border)" strokeWidth={6}/>
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={filled}
          strokeLinecap="round" style={{ transition:"stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"var(--font-display)", fontWeight:700, fontSize:16, color:"var(--text)", lineHeight:1 }}>{used}/{total}</span>
        <span style={{ fontSize:9, color:"var(--text-muted)", marginTop:2 }}>slots</span>
      </div>
    </div>
  );
}

/* Status Chip */
function Chip({ variant, label }) {
  const map = {
    novo:      { bg:"var(--chip-info-bg,#B4EBFF)",     color:"var(--chip-info-tx,#323C32)" },
    aguardando:{ bg:"var(--chip-warn-bg,#FFEB8C)",     color:"var(--chip-warn-tx,#5A3C1E)" },
    ativo:     { bg:"var(--chip-ok-bg,#A0DC8C)",       color:"var(--chip-ok-tx,#146E37)"   },
    encerrado: { bg:"var(--chip-neu-bg,#E1E6E1)",      color:"var(--chip-neu-tx,#323C32)"  },
  };
  const s = map[variant] || map.encerrado;
  return <span style={{ background:s.bg, color:s.color, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:"var(--radius-chip)", whiteSpace:"nowrap" }}>{label}</span>;
}

/* Request Card */
function RequestCard({ name, role, company, skills, date, onAccept, onReject }) {
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2);
  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", padding:16, transition:"border-color 0.2s ease" }}
      onMouseEnter={e=>e.currentTarget.style.borderColor="var(--border-accent)"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
    >
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0, fontFamily:"var(--font-display)" }}>{initials}</div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", fontFamily:"var(--font-body)" }}>{name}</div>
          <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{role} · {company}</div>
        </div>
        <Chip variant="novo" label="Novo"/>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
        {skills.map(s=>(
          <span key={s} style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)", fontSize:10, padding:"2px 7px", borderRadius:"var(--radius-chip)", fontFamily:"var(--font-body)" }}>{s}</span>
        ))}
      </div>
      <div style={{ fontSize:10, color:"var(--text-muted)", marginBottom:12, fontFamily:"var(--font-body)" }}>Enviado em {date}</div>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onAccept} style={{ flex:1, background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.3)", color:"var(--green)", padding:"7px", borderRadius:"var(--radius-btn)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:5, transition:"all 0.15s ease" }}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--green)"; e.currentTarget.style.color="#fff";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(16,185,129,0.12)"; e.currentTarget.style.color="var(--green)";}}>
          <Check size={12}/> Aceitar
        </button>
        <button onClick={onReject} style={{ flex:1, background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", color:"var(--red)", padding:"7px", borderRadius:"var(--radius-btn)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:5, transition:"all 0.15s ease" }}
          onMouseEnter={e=>{e.currentTarget.style.background="var(--red)"; e.currentTarget.style.color="#fff";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.08)"; e.currentTarget.style.color="var(--red)";}}>
          <X size={12}/> Recusar
        </button>
      </div>
    </div>
  );
}

/* Waitlist Card */
function WaitlistCard({ name, role, position, date }) {
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2);
  return (
    <div style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--accent-alt)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0, fontFamily:"var(--font-display)" }}>{initials}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontFamily:"var(--font-body)" }}>{name}</div>
        <div style={{ fontSize:10, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{role} · {date}</div>
      </div>
      <span style={{ background:"rgba(245,158,11,0.15)", color:"var(--amber)", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:"var(--radius-chip)", whiteSpace:"nowrap" }}>#{position}</span>
    </div>
  );
}

/* Kanban Column */
function Column({ icon, title, count, accent, children, empty }) {
  return (
    <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:0 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"14px 16px", background:"var(--glass)", borderRadius:"var(--radius-card) var(--radius-card) 0 0", border:"1px solid var(--border)", borderBottom:"none" }}>
        <span style={{ color:accent, display:"flex" }}>{icon}</span>
        <span style={{ fontSize:13, fontWeight:700, color:"var(--text)", fontFamily:"var(--font-body)", flex:1 }}>{title}</span>
        {count > 0 && <span style={{ background:accent, color:"#fff", fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:"var(--radius-chip)", minWidth:20, textAlign:"center" }}>{count}</span>}
      </div>
      <div style={{ border:"1px solid var(--border)", borderTop:"none", borderRadius:"0 0 var(--radius-card) var(--radius-card)", padding:12, display:"flex", flexDirection:"column", gap:10, minHeight:200, background:"var(--surface)" }}>
        {count === 0 ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 16px", textAlign:"center", opacity:0.6 }}>
            <AlertCircle size={22} color="var(--text-muted)" style={{ marginBottom:8 }}/>
            <div style={{ fontSize:12, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{empty}</div>
          </div>
        ) : children}
      </div>
    </div>
  );
}

/* MAIN */
export default function SolicitacoesKanban() {
  const [requests, setRequests] = useState([
    { id:1, name:"Fernanda Oliveira", role:"Analista de Marketing", company:"Sicredi", skills:["Brand","Conteúdo","Analytics"], date:"22 mai 2026" },
    { id:2, name:"Ricardo Moura",     role:"Coordenador de Projetos", company:"Sicredi", skills:["PMO","Agile","Excel"],       date:"24 mai 2026" },
  ]);
  const [waitlist] = useState([
    { id:1, name:"Juliana Santos", role:"Analista Financeira", position:1, date:"25 mai" },
    { id:2, name:"Carlos Neto",    role:"Dev Júnior",          position:2, date:"27 mai" },
  ]);
  const [active] = useState([
    { name:"Ana Costa",   role:"Gerente de Marketing", sessions:3, total:12 },
    { name:"Pedro Lima",  role:"Analista de Dados",    sessions:7, total:12 },
  ]);

  const accept = (id) => setRequests(r=>r.filter(x=>x.id!==id));
  const reject = (id) => setRequests(r=>r.filter(x=>x.id!==id));

  return (
    <div style={{ background:"var(--bg-base)", minHeight:"100vh", fontFamily:"var(--font-body)", color:"var(--text)", padding:"32px 36px" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4, fontFamily:"var(--font-display)" }}>Gestão de Mentoria</h1>
          <p style={{ fontSize:13, color:"var(--text-muted)" }}>Acompanhe solicitações, mentorados ativos e fila de espera.</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <SlotCapacityRing used={active.length} total={4}/>
          <div style={{ background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:"var(--radius-chip)", padding:"6px 14px", display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"var(--green)", boxShadow:"0 0 6px var(--green)" }}/>
            <span style={{ fontSize:12, color:"var(--green)", fontWeight:600, fontFamily:"var(--font-body)" }}>Aceitando mentorados</span>
          </div>
        </div>
      </div>

      {/* Kanban */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
        <Column icon={<Clock size={15}/>} title="Fila de Espera" count={waitlist.length} accent="var(--amber)" empty="Nenhum na fila de espera">
          {waitlist.map((w,i)=><WaitlistCard key={w.id} {...w} style={{ animationDelay:`${i*0.06}s` }}/>)}
        </Column>

        <Column icon={<Inbox size={15}/>} title="Solicitações Pendentes" count={requests.length} accent="var(--accent)" empty="Nenhuma solicitação pendente">
          {requests.map((r,i)=>(
            <RequestCard key={r.id} {...r} onAccept={()=>accept(r.id)} onReject={()=>reject(r.id)}/>
          ))}
        </Column>

        <Column icon={<Users size={15}/>} title="Mentorados Ativos" count={active.length} accent="var(--green)" empty="Nenhum mentorado ativo">
          {active.map((a,i)=>(
            <div key={a.name} style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", padding:14, borderLeft:"3px solid var(--green)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--green)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", fontFamily:"var(--font-display)" }}>
                  {a.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", fontFamily:"var(--font-body)" }}>{a.name}</div>
                  <div style={{ fontSize:10, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{a.role}</div>
                </div>
                <Chip variant="ativo" label="Ativo"/>
              </div>
              <div style={{ fontSize:10, color:"var(--text-muted)", marginBottom:5, fontFamily:"var(--font-body)" }}>{a.sessions} de {a.total} sessões</div>
              <div style={{ height:4, background:"var(--border)", borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(a.sessions/a.total)*100}%`, background:"var(--green)", borderRadius:2, transition:"width 0.8s cubic-bezier(0.16,1,0.3,1)" }}/>
              </div>
            </div>
          ))}
        </Column>
      </div>
    </div>
  );
}
