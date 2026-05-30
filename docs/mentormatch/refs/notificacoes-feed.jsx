import { useState } from "react";
import { Bell, Inbox, Calendar, Settings, Check, CheckCheck } from "lucide-react";
const CATS={ Solicitacao:{ bg:"#D7E6C8", color:"#146E37", icon:<Inbox size={10}/> }, Sessao:{ bg:"#B4EBFF", color:"#323C32", icon:<Calendar size={10}/> }, Sistema:{ bg:"#E1E6E1", color:"#5A645A", icon:<Settings size={10}/> } };
const MOCK=[
  { id:1, type:"Solicitacao", text:"Fernanda Oliveira enviou uma solicitação de mentoria.", time:"há 2h",   read:false, group:"Hoje" },
  { id:2, type:"Sessao",      text:"Sessão com Ana Costa amanhã às 14h00.",               time:"há 5h",   read:false, group:"Hoje" },
  { id:3, type:"Sistema",     text:"Seu perfil foi visualizado 12 vezes esta semana.",     time:"há 8h",   read:true,  group:"Hoje" },
  { id:4, type:"Solicitacao", text:"Ricardo Moura enviou uma solicitação de mentoria.",    time:"20 mai",  read:true,  group:"Ontem" },
  { id:5, type:"Sessao",      text:"Sessão com Pedro Lima realizada com sucesso.",         time:"19 mai",  read:true,  group:"Esta semana" },
  { id:6, type:"Sistema",     text:"MentorMatch atualizou os termos de uso.",              time:"15 mai",  read:true,  group:"Esta semana" },
];
function NotifItem({notif,onRead}){
  const cat=CATS[notif.type]||CATS.Sistema;
  return(
    <div onClick={()=>onRead(notif.id)} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 18px", background:notif.read?"transparent":"var(--accent)04", borderBottom:"1px solid var(--border)", cursor:"pointer", transition:"background 0.15s ease" }} onMouseEnter={e=>e.currentTarget.style.background="var(--surface)"} onMouseLeave={e=>e.currentTarget.style.background=notif.read?"transparent":"var(--accent)04"}>
      <div style={{ width:8, height:8, borderRadius:"50%", background:notif.read?"var(--border)":"var(--accent)", marginTop:6, flexShrink:0, transition:"background 0.2s ease" }}/>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, color:"var(--text)", lineHeight:"18px", marginBottom:5, fontFamily:"var(--font-body)" }}>{notif.text}</div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ background:cat.bg, color:cat.color, fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:"var(--radius-chip)", display:"inline-flex", alignItems:"center", gap:3 }}>{cat.icon}{notif.type}</span>
          <span style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{notif.time}</span>
        </div>
      </div>
      {!notif.read&&<Check size={13} color="var(--accent)" style={{ marginTop:2, flexShrink:0 }}/>}
    </div>
  );
}
export default function NotificacoesFeed(){
  const [notifs,setNotifs]=useState(MOCK);
  const unread=notifs.filter(n=>!n.read).length;
  const markRead=(id)=>setNotifs(ns=>ns.map(n=>n.id===id?{...n,read:true}:n));
  const markAll=()=>setNotifs(ns=>ns.map(n=>({...n,read:true})));
  const groups=[...new Set(notifs.map(n=>n.group))];
  return(
    <div style={{ background:"var(--bg-base)", minHeight:"100vh", padding:"32px 36px", fontFamily:"var(--font-body)", color:"var(--text)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em", fontFamily:"var(--font-display)" }}>Notificações</h1>
          {unread>0&&<span style={{ background:"var(--accent)", color:"#fff", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:"var(--radius-chip)" }}>{unread} novas</span>}
        </div>
        {unread>0&&<button onClick={markAll} style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)", padding:"8px 14px", borderRadius:"var(--radius-btn)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:6 }}><CheckCheck size={13}/>Marcar todas como lidas</button>}
      </div>
      <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", overflow:"hidden" }}>
        {notifs.length===0?(
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", textAlign:"center" }}>
            <Bell size={36} color="var(--text-muted)" style={{ marginBottom:12, opacity:0.4 }}/>
            <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>Sem notificações</div>
            <div style={{ fontSize:13, color:"var(--text-muted)" }}>Você está em dia com tudo.</div>
          </div>
        ):groups.map(g=>(
          <div key={g}>
            <div style={{ padding:"10px 18px", fontSize:10, fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", background:"var(--surface)", borderBottom:"1px solid var(--border)", fontFamily:"var(--font-body)" }}>{g}</div>
            {notifs.filter(n=>n.group===g).map((n,i)=><NotifItem key={n.id} notif={n} onRead={markRead}/>)}
          </div>
        ))}
      </div>
    </div>
  );
}
