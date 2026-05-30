import { useState } from "react";
import { Check, Clock, X, Calendar, ChevronRight, Users } from "lucide-react";

function ConnectionCard({ mentor, mentee, sessions, lastSession, startDate, status }) {
  const node = status==="active" ? { icon:<Check size={11}/>, color:"var(--green)" }
             : status==="pending" ? { icon:<Clock size={11}/>, color:"var(--amber)" }
             : { icon:<X size={11}/>, color:"var(--text-muted)" };
  const borderColor = status==="active" ? "var(--green)" : status==="pending" ? "var(--amber)" : "var(--border)";
  const Avatar = ({name,color})=>{
    const i=name.split(" ").map(w=>w[0]).join("").slice(0,2);
    return <div style={{ width:40, height:40, borderRadius:"50%", background:color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", border:"2px solid var(--bg-base)", fontFamily:"var(--font-display)", flexShrink:0 }}>{i}</div>;
  };
  return (
    <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", borderLeft:`3px solid ${borderColor}`, overflow:"hidden", transition:"transform 0.2s ease, border-color 0.2s ease" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.borderColor=borderColor;}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.borderColor="var(--border)";}}>
      <div style={{ padding:"18px 20px" }}>
        {/* Avatar pair */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, marginBottom:14 }}>
          <Avatar name={mentor.name} color="var(--accent)"/>
          <div style={{ width:28, height:28, borderRadius:"50%", background:node.color, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 -4px", zIndex:1, border:"2px solid var(--bg-base)", color:"#fff" }}>{node.icon}</div>
          <Avatar name={mentee.name} color="var(--accent-alt)"/>
        </div>
        {/* Names */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14, textAlign:"center" }}>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", fontFamily:"var(--font-body)" }}>{mentor.name}</div>
            <div style={{ fontSize:10, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{mentor.role}</div>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:600, color:"var(--text)", fontFamily:"var(--font-body)" }}>{mentee.name}</div>
            <div style={{ fontSize:10, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{mentee.role}</div>
          </div>
        </div>
        {/* Stats */}
        <div style={{ display:"flex", justifyContent:"space-around", padding:"10px 0", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", marginBottom:14 }}>
          {[{val:`${sessions} sessões`,lbl:null},{val:lastSession||"—",lbl:"Última"},{val:startDate,lbl:"Desde"}].map(({val,lbl},i)=>(
            <div key={i} style={{ textAlign:"center" }}>
              {lbl && <div style={{ fontSize:9, color:"var(--text-muted)", marginBottom:2, fontFamily:"var(--font-body)", textTransform:"uppercase", letterSpacing:"0.05em" }}>{lbl}</div>}
              <div style={{ fontSize:11, fontWeight:600, color:"var(--text)", fontFamily:"var(--font-body)" }}>{val}</div>
            </div>
          ))}
        </div>
        {/* Actions */}
        <div style={{ display:"flex", gap:8 }}>
          {status==="active" && (
            <button style={{ flex:1, background:"linear-gradient(135deg,var(--accent),var(--accent-alt))", border:"none", color:"#fff", padding:"8px", borderRadius:"var(--radius-btn)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
              <Calendar size={12}/> Agendar
            </button>
          )}
          <button style={{ flex:status==="active"?0:1, background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)", padding:"8px 14px", borderRadius:"var(--radius-btn)", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
            Detalhes <ChevronRight size={11}/>
          </button>
        </div>
      </div>
    </div>
  );
}

const MOCK = [
  { mentor:{name:"Ana Costa",role:"Gerente de Marketing"}, mentee:{name:"Pedro Lima",role:"Analista de Dados"}, sessions:8, lastSession:"20 mai", startDate:"jan 2026", status:"active" },
  { mentor:{name:"Fernanda Luz",role:"Head de Produto"}, mentee:{name:"Lucas Ramos",role:"Dev Júnior"}, sessions:3, lastSession:"15 mai", startDate:"mar 2026", status:"active" },
  { mentor:{name:"Roberto Silva",role:"Dir. Comercial"}, mentee:{name:"Julia Matos",role:"Analista Comercial"}, sessions:0, lastSession:null, startDate:"mai 2026", status:"pending" },
  { mentor:{name:"Carla Neves",role:"Especialista RH"}, mentee:{name:"Diego Souza",role:"Analista RH"}, sessions:12, lastSession:"dez 2025", startDate:"ago 2025", status:"ended" },
];

export default function MinhasConexoes() {
  const [tab, setTab] = useState("active");
  const tabs=[{id:"active",label:"Ativos",count:MOCK.filter(c=>c.status==="active").length},{id:"pending",label:"Pendentes",count:MOCK.filter(c=>c.status==="pending").length},{id:"ended",label:"Histórico",count:MOCK.filter(c=>c.status==="ended").length}];
  const items = MOCK.filter(c=>c.status===tab);
  return (
    <div style={{ background:"var(--bg-base)", minHeight:"100vh", padding:"32px 36px", fontFamily:"var(--font-body)", color:"var(--text)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4, fontFamily:"var(--font-display)" }}>Minhas Conexões</h1>
      <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:24 }}>Gerencie suas mentorias ativas e histórico.</p>
      {/* Tabs */}
      <div style={{ display:"flex", gap:2, marginBottom:24, background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:4, width:"fit-content" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:"8px 20px", borderRadius:"calc(var(--radius-btn) - 2px)", border:"none", background:tab===t.id?"linear-gradient(135deg,var(--accent),var(--accent-alt))":"transparent", color:tab===t.id?"#fff":"var(--text-muted)", fontFamily:"var(--font-body)", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s ease" }}>
            {t.label}
            {t.count>0 && <span style={{ background:tab===t.id?"rgba(255,255,255,0.25)":"var(--border)", color:tab===t.id?"#fff":"var(--text-muted)", fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:"var(--radius-chip)" }}>{t.count}</span>}
          </button>
        ))}
      </div>
      {items.length===0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", textAlign:"center" }}>
          <Users size={40} color="var(--text-muted)" style={{ marginBottom:12, opacity:0.5 }}/>
          <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>Nenhuma conexão {tab==="active"?"ativa":tab==="pending"?"pendente":"no histórico"}</div>
          <div style={{ fontSize:13, color:"var(--text-muted)" }}>
            {tab==="active" ? "Encontre um mentor para começar." : tab==="pending" ? "Suas solicitações enviadas aparecerão aqui." : "Mentorias encerradas aparecerão aqui."}
          </div>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
          {items.map((c,i)=><ConnectionCard key={i} {...c}/>)}
        </div>
      )}
    </div>
  );
}
