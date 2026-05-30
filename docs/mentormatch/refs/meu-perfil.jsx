import { useState } from "react";
import { Camera, Check, Linkedin, Phone, Shield, Calendar, User, Save } from "lucide-react";

const DAYS=[{id:"seg",label:"Seg"},{id:"ter",label:"Ter"},{id:"qua",label:"Qua"},{id:"qui",label:"Qui"},{id:"sex",label:"Sex"},{id:"sab",label:"Sáb"},{id:"dom",label:"Dom"}];

function DayChip({day,active,start,end,onToggle}){
  return(
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <button onClick={onToggle} style={{ width:48, height:48, borderRadius:"var(--radius-btn)", border:`1.5px solid ${active?"var(--accent)":"var(--border)"}`, background:active?"var(--accent)18":"var(--surface)", color:active?"var(--accent)":"var(--text-muted)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, cursor:"pointer", transition:"all 0.18s ease", fontFamily:"var(--font-display)" }}>
        <span style={{ fontSize:10, fontWeight:700 }}>{day.label}</span>
        {active && <Check size={10}/>}
      </button>
      {active && <div style={{ fontSize:9, color:"var(--text-muted)", fontFamily:"var(--font-body)", textAlign:"center", lineHeight:"12px" }}>{start}<br/>{end}</div>}
    </div>
  );
}

function ProfileCompletion({pct}){
  const color = pct===100?"var(--green)":pct>=60?"var(--amber)":"var(--accent)";
  return(
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>Completude do perfil</span>
        <span style={{ fontSize:11, fontWeight:700, color, fontFamily:"var(--font-body)" }}>{pct}%</span>
      </div>
      <div style={{ height:5, background:"var(--border)", borderRadius:"var(--radius-chip)", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:"var(--radius-chip)", transition:"width 0.6s cubic-bezier(0.16,1,0.3,1)" }}/>
      </div>
      {pct<100&&<div style={{ fontSize:10, color:"var(--text-muted)", marginTop:5, fontFamily:"var(--font-body)" }}>
        {pct<40?"Adicione bio, LinkedIn e disponibilidade":pct<80?"Quase lá! Complete sua disponibilidade":"Adicione suas habilidades para completar"}
      </div>}
    </div>
  );
}

export default function MeuPerfil(){
  const [tab,setTab]=useState("pessoal");
  const [name,setName]=useState("Teste MentorMatch");
  const [bio,setBio]=useState("");
  const [linkedin,setLinkedin]=useState("");
  const [whatsapp,setWhatsapp]=useState("43243434234");
  const [days,setDays]=useState({seg:{active:true,start:"09:00",end:"18:00"},ter:{active:true,start:"09:00",end:"18:00"},qua:{active:true,start:"09:00",end:"18:00"},qui:{active:true,start:"09:00",end:"18:00"},sex:{active:true,start:"09:00",end:"18:00"},sab:{active:false,start:"",end:""},dom:{active:false,start:"",end:""}});
  const completion = [name,bio,linkedin,whatsapp,Object.values(days).some(d=>d.active)].filter(Boolean).length;
  const pct = Math.round((completion/5)*100);
  const toggleDay=(id)=>setDays(d=>({...d,[id]:{...d[id],active:!d[id].active,start:d[id].active?"":"09:00",end:d[id].active?"":"18:00"}}));
  const tabs=[{id:"pessoal",label:"Informações Pessoais",icon:<User size={14}/>},{id:"disponibilidade",label:"Disponibilidade",icon:<Calendar size={14}/>},{id:"seguranca",label:"Segurança",icon:<Shield size={14}/>}];
  const Input=({label,value,onChange,placeholder,type="text"})=>(
    <div>
      <label style={{ fontSize:12, fontWeight:600, color:"var(--text-sub)", display:"block", marginBottom:5, fontFamily:"var(--font-body)" }}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:"10px 12px", color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)", outline:"none", transition:"border-color 0.15s ease" }} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
    </div>
  );
  return(
    <div style={{ background:"var(--bg-base)", minHeight:"100vh", padding:"32px 36px", fontFamily:"var(--font-body)", color:"var(--text)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4, fontFamily:"var(--font-display)" }}>Meu Perfil</h1>
      <p style={{ fontSize:13, color:"var(--text-muted)", marginBottom:28 }}>Gerencie suas informações pessoais, segurança e disponibilidade.</p>
      <div style={{ display:"grid", gridTemplateColumns:"240px 1fr", gap:24 }}>
        {/* Profile card */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", padding:24, textAlign:"center" }}>
            <div style={{ position:"relative", width:80, height:80, margin:"0 auto 14px" }}>
              <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,var(--accent),var(--accent-alt))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, color:"#fff", fontFamily:"var(--font-display)" }}>TM</div>
              <button style={{ position:"absolute", bottom:0, right:0, width:26, height:26, borderRadius:"50%", background:"var(--accent)", border:"2px solid var(--bg-base)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#fff" }}><Camera size={12}/></button>
            </div>
            <div style={{ fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:3, fontFamily:"var(--font-body)" }}>{name||"Sem nome"}</div>
            <div style={{ fontSize:11, color:"var(--text-muted)", marginBottom:16 }}>Mentor de Carreira</div>
            <ProfileCompletion pct={pct}/>
            {linkedin&&<a href={linkedin} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginTop:14, fontSize:11, color:"var(--accent)", textDecoration:"none", fontFamily:"var(--font-body)" }}><Linkedin size={12}/> LinkedIn</a>}
          </div>
        </div>
        {/* Content */}
        <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", overflow:"hidden" }}>
          {/* Tabs */}
          <div style={{ display:"flex", borderBottom:"1px solid var(--border)" }}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"14px 16px", border:"none", background:tab===t.id?"var(--accent)0a":"transparent", color:tab===t.id?"var(--accent)":"var(--text-muted)", fontFamily:"var(--font-body)", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, borderBottom:tab===t.id?"2px solid var(--accent)":"2px solid transparent", transition:"all 0.18s ease" }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:16 }}>
            {tab==="pessoal"&&(
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <Input label="Nome Completo" value={name} onChange={setName} placeholder="Seu nome completo"/>
                  <Input label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..."/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"80px 1fr", gap:8 }}>
                  <Input label="País" value="+55" onChange={()=>{}} placeholder="+55"/>
                  <Input label="WhatsApp" value={whatsapp} onChange={setWhatsapp} placeholder="11999999999"/>
                </div>
                <div>
                  <label style={{ fontSize:12, fontWeight:600, color:"var(--text-sub)", display:"block", marginBottom:5, fontFamily:"var(--font-body)" }}>Biografia Curta</label>
                  <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Conte um pouco sobre sua experiência e como pode ajudar..." rows={4} style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:"10px 12px", color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)", outline:"none", resize:"vertical" }} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
                  <div style={{ fontSize:10, color:"var(--text-muted)", textAlign:"right", marginTop:4, fontFamily:"var(--font-body)" }}>{bio.length}/280</div>
                </div>
              </>
            )}
            {tab==="disponibilidade"&&(
              <div>
                <div style={{ fontSize:13, color:"var(--text-muted)", marginBottom:20, fontFamily:"var(--font-body)" }}>Selecione os dias e horários em que você está disponível para sessões de mentoria.</div>
                <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  {DAYS.map(d=><DayChip key={d.id} day={d} active={days[d.id].active} start={days[d.id].start} end={days[d.id].end} onToggle={()=>toggleDay(d.id)}/>)}
                </div>
                <div style={{ marginTop:20, padding:"14px", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)" }}>
                  <div style={{ fontSize:12, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>
                    <strong style={{ color:"var(--text)" }}>{Object.values(days).filter(d=>d.active).length}</strong> dias selecionados · Clique em um dia para ativar ou desativar
                  </div>
                </div>
              </div>
            )}
            {tab==="seguranca"&&(
              <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:400 }}>
                <Input label="Senha Atual" value="" onChange={()=>{}} placeholder="••••••••" type="password"/>
                <Input label="Nova Senha" value="" onChange={()=>{}} placeholder="••••••••" type="password"/>
                <Input label="Confirmar Nova Senha" value="" onChange={()=>{}} placeholder="••••••••" type="password"/>
              </div>
            )}
          </div>
          <div style={{ padding:"14px 24px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"flex-end" }}>
            <button style={{ background:"linear-gradient(135deg,var(--accent),var(--accent-alt))", border:"none", color:"#fff", padding:"10px 22px", borderRadius:"var(--radius-btn)", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 14px var(--accent-glow)" }}>
              <Save size={14}/> Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
