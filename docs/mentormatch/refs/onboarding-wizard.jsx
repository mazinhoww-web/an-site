import { useState } from "react";
import { ArrowRight, Check, BookOpen, User, Calendar, ChevronRight, SkipForward } from "lucide-react";
const STEPS_META=[{id:1,label:"Perfil"},{id:2,label:"Disponibilidade"},{id:3,label:"Dashboard"}];
const DAYS=[{id:"seg",l:"Seg"},{id:"ter",l:"Ter"},{id:"qua",l:"Qua"},{id:"qui",l:"Qui"},{id:"sex",l:"Sex"},{id:"sab",l:"Sáb"},{id:"dom",l:"Dom"}];
export default function OnboardingWizard(){
  const [step,setStep]=useState(1);
  const [name,setName]=useState("Teste MentorMatch");
  const [bio,setBio]=useState("");
  const [linkedin,setLinkedin]=useState("");
  const [days,setDays]=useState({seg:true,ter:true,qua:true,qui:true,sex:true,sab:false,dom:false});
  const toggle=(d)=>setDays(ds=>({...ds,[d]:!ds[d]}));
  const Input=({label,value,onChange,placeholder,optional})=>(
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <label style={{ fontSize:12, fontWeight:600, color:"var(--text-sub)", fontFamily:"var(--font-body)" }}>{label}</label>
        {optional&&<span style={{ fontSize:10, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>Opcional</span>}
      </div>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:"10px 12px", color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)", outline:"none" }} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
    </div>
  );
  return(
    <div style={{ background:"var(--bg-deep)", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", fontFamily:"var(--font-body)", color:"var(--text)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"50%", height:"50%", borderRadius:"50%", background:"radial-gradient(circle,var(--accent-glow) 0%,transparent 65%)" }}/>
        <div style={{ position:"absolute", bottom:"-10%", right:"-8%", width:"40%", height:"40%", borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 65%)" }}/>
      </div>
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:480 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:36 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,var(--accent),var(--accent-alt))", display:"flex", alignItems:"center", justifyContent:"center" }}><BookOpen size={15} color="#fff"/></div>
          <span style={{ fontWeight:800, fontSize:18, fontFamily:"var(--font-display)" }}>MentorMatch</span>
        </div>
        {/* Stepper */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:36 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:"var(--radius-chip)", background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)" }}>
            <Check size={11} color="var(--green)"/><span style={{ fontSize:11, color:"var(--green)", fontWeight:600 }}>Papel selecionado</span>
          </div>
          {STEPS_META.map((s,i)=>(
            <div key={s.id} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <ChevronRight size={12} color="var(--text-muted)"/>
              <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:"var(--radius-chip)", background:step===s.id?"var(--accent)14":step>s.id?"rgba(16,185,129,0.1)":"var(--surface)", border:`1px solid ${step===s.id?"var(--border-accent)":step>s.id?"rgba(16,185,129,0.25)":"var(--border)"}` }}>
                {step>s.id&&<Check size={11} color="var(--green)"/>}
                <span style={{ fontSize:11, fontWeight:600, color:step===s.id?"var(--accent-alt)":step>s.id?"var(--green)":"var(--text-muted)" }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Card */}
        <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", overflow:"hidden", backdropFilter:"blur(16px)" }}>
          <div style={{ padding:"22px 26px", borderBottom:"1px solid var(--border)" }}>
            <h2 style={{ fontSize:20, fontWeight:700, fontFamily:"var(--font-display)", marginBottom:4 }}>
              {step===1?"Complete seu perfil":"Configure sua disponibilidade"}
            </h2>
            <p style={{ fontSize:13, color:"var(--text-muted)" }}>
              {step===1?"Ajuda mentores a te encontrarem mais facilmente.":"Quando você está disponível para sessões?"}
            </p>
          </div>
          <div style={{ padding:"22px 26px", display:"flex", flexDirection:"column", gap:16 }}>
            {step===1&&(
              <>
                <Input label="Nome Completo" value={name} onChange={setName} placeholder="Seu nome"/>
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"var(--text-sub)", fontFamily:"var(--font-body)" }}>Bio curta</label>
                    <span style={{ fontSize:10, color:"var(--text-muted)" }}>{bio.length}/280</span>
                  </div>
                  <textarea value={bio} onChange={e=>setBio(e.target.value.slice(0,280))} placeholder="Fale sobre sua experiência e objetivos..." rows={3} style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:"10px 12px", color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)", outline:"none", resize:"none" }} onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
                </div>
                <Input label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." optional/>
              </>
            )}
            {step===2&&(
              <div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {DAYS.map(d=>(
                    <button key={d.id} onClick={()=>toggle(d.id)} style={{ width:52, height:52, borderRadius:"var(--radius-btn)", border:`1.5px solid ${days[d.id]?"var(--accent)":"var(--border)"}`, background:days[d.id]?"var(--accent)14":"var(--surface)", color:days[d.id]?"var(--accent)":"var(--text-muted)", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-display)", transition:"all 0.15s ease", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
                      {d.l}{days[d.id]&&<Check size={9}/>}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop:14, fontSize:12, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>
                  {Object.values(days).filter(Boolean).length} dias selecionados · Horários editáveis no perfil
                </div>
              </div>
            )}
          </div>
          <div style={{ padding:"16px 26px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button onClick={()=>{}} style={{ background:"none", border:"none", color:"var(--text-muted)", fontSize:12, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:5 }}>
              <SkipForward size={12}/> Pular por agora
            </button>
            <button onClick={()=>{ if(step<2) setStep(s=>s+1); }} style={{ background:"linear-gradient(135deg,var(--accent),var(--accent-alt))", border:"none", color:"#fff", padding:"11px 22px", borderRadius:"var(--radius-btn)", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:7, boxShadow:"0 4px 14px var(--accent-glow)" }}>
              {step===2?"Ir para o Dashboard":"Próximo"} <ArrowRight size={15}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
