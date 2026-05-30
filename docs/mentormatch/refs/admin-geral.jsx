import { useState, useRef } from "react";
import {
  Plus, Settings, Users, BarChart2, Globe, Upload,
  CheckCircle, Clock, AlertCircle, ChevronRight,
  BookOpen, Trash2, Eye, MoreVertical, FileText, X
} from "lucide-react";

/* ─── Tokens base (dark) ─── */
const T = {
  bgDeep:"#08080d", bgBase:"#0d0d14", bgElevated:"#13131e",
  surface:"rgba(255,255,255,0.04)", glass:"rgba(255,255,255,0.07)",
  border:"rgba(255,255,255,0.07)", borderAccent:"rgba(99,102,241,0.35)",
  accent:"#4F46E5", accentAlt:"#6366F1", accentGlow:"rgba(79,70,229,0.28)",
  green:"#10B981", amber:"#F59E0B", red:"#EF4444",
  text:"#EDEDEF", textMuted:"#6B7280", textSub:"#9CA3AF",
  radius:"14px", radiusSm:"8px",
};

/* ─── Tenants data (mock) ─── */
const TENANTS = [
  {
    id: "base",
    name: "MentorMatch Base",
    slug: "mentormatch",
    url: "aurimarnogueira.com.br/mentormatch",
    theme: "dark",
    themeColor: "#4F46E5",
    status: "active",
    users: 12,
    mentors: 3,
    sessions: 8,
    createdAt: "Jan 2026",
    hasDesignMd: false,
  },
  {
    id: "sicredi",
    name: "MentorMatch Sicredi",
    slug: "sicredi/mentormatch",
    url: "aurimarnogueira.com.br/sicredi/mentormatch",
    theme: "sicredi",
    themeColor: "#33820D",
    status: "active",
    users: 47,
    mentors: 9,
    sessions: 31,
    createdAt: "Mai 2026",
    hasDesignMd: true,
    designFile: "Sicredimentormatchdesign.md",
  },
];

/* ─── Status chip ─── */
function StatusChip({ status }) {
  const map = {
    active:   { label:"Ativo",      bg:"rgba(16,185,129,0.12)", color:"#10B981", border:"rgba(16,185,129,0.3)" },
    building: { label:"Provisionando", bg:"rgba(245,158,11,0.12)", color:"#F59E0B", border:"rgba(245,158,11,0.3)" },
    inactive: { label:"Inativo",    bg:"rgba(107,114,128,0.12)", color:"#6B7280", border:"rgba(107,114,128,0.3)" },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{ background:s.bg, border:`1px solid ${s.border}`, color:s.color, fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:5 }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:s.color, display:"inline-block" }}/>
      {s.label}
    </span>
  );
}

/* ─── Tenant Card ─── */
function TenantCard({ tenant, onManage }) {
  const [menu, setMenu] = useState(false);
  return (
    <div style={{ background:T.glass, backdropFilter:"blur(14px)", border:`1px solid ${T.border}`, borderRadius:T.radius, overflow:"hidden", transition:"border-color 0.2s ease, transform 0.2s ease" }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=T.borderAccent; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=T.border; e.currentTarget.style.transform="none"; }}
    >
      {/* Color bar */}
      <div style={{ height:4, background:`linear-gradient(90deg, ${tenant.themeColor}, ${tenant.themeColor}aa)` }}/>

      <div style={{ padding:"20px 22px" }}>
        {/* Header row */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:14 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <div style={{ width:28, height:28, borderRadius:6, background:tenant.themeColor, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <BookOpen size={13} color="#fff"/>
              </div>
              <span style={{ fontSize:15, fontWeight:700, color:T.text }}>{tenant.name}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <Globe size={11} color={T.textMuted}/>
              <span style={{ fontSize:11, color:T.textMuted }}>{tenant.url}</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <StatusChip status={tenant.status}/>
            <div style={{ position:"relative" }}>
              <button onClick={()=>setMenu(!menu)} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", padding:4, borderRadius:6, display:"flex" }}>
                <MoreVertical size={15}/>
              </button>
              {menu && (
                <div style={{ position:"absolute", right:0, top:"100%", background:T.bgElevated, border:`1px solid ${T.border}`, borderRadius:T.radiusSm, padding:"4px 0", zIndex:50, minWidth:140, boxShadow:"0 8px 24px rgba(0,0,0,0.4)" }}>
                  {[{icon:<Eye size={13}/>, label:"Ver landing"},{icon:<Settings size={13}/>, label:"Configurações"},{icon:<Trash2 size={13}/>, label:"Remover", danger:true}].map(({icon,label,danger})=>(
                    <button key={label} onClick={()=>setMenu(false)} style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"8px 14px", background:"none", border:"none", color:danger?"#EF4444":T.textSub, fontSize:12, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                      {icon}{label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme badge */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
          <span style={{ background:T.surface, border:`1px solid ${T.border}`, color:T.textMuted, fontSize:9, fontWeight:600, padding:"2px 8px", borderRadius:100, letterSpacing:"0.05em" }}>
            TEMA {tenant.theme.toUpperCase()}
          </span>
          {tenant.hasDesignMd && (
            <span style={{ background:"rgba(16,185,129,0.1)", border:"rgba(16,185,129,0.25) 1px solid", color:T.green, fontSize:9, fontWeight:600, padding:"2px 8px", borderRadius:100, display:"inline-flex", alignItems:"center", gap:4 }}>
              <FileText size={9}/> design.md
            </span>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:18 }}>
          {[{icon:<Users size={13}/>, val:tenant.users, lbl:"usuários"},{icon:<BarChart2 size={13}/>, val:tenant.sessions, lbl:"sessões"},{icon:<BookOpen size={13}/>, val:tenant.mentors, lbl:"mentores"}].map(({icon,val,lbl})=>(
            <div key={lbl} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radiusSm, padding:"10px 10px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3, color:T.textMuted }}>{icon}</div>
              <div style={{ fontSize:18, fontWeight:800, color:T.text, letterSpacing:"-0.02em", lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:10, color:T.textMuted, marginTop:2 }}>{lbl}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:11, color:T.textMuted }}>Criado em {tenant.createdAt}</span>
          <button onClick={()=>onManage(tenant)} style={{ background:`${T.accent}18`, border:`1px solid ${T.borderAccent}`, color:"#A5B4FC", padding:"7px 14px", borderRadius:T.radiusSm, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:5, transition:"all 0.15s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.background=T.accent; e.currentTarget.style.color="#fff";}}
            onMouseLeave={e=>{e.currentTarget.style.background=`${T.accent}18`; e.currentTarget.style.color="#A5B4FC";}}
          >
            Gerenciar <ChevronRight size={12}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── New Tenant Modal ─── */
function NewTenantModal({ onClose }) {
  const [step, setStep]         = useState(1); // 1=info, 2=design, 3=confirming
  const [name, setName]         = useState("");
  const [slug, setSlug]         = useState("");
  const [designFile, setDesign] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.name.endsWith(".md")) setDesign(f);
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:T.bgElevated, border:`1px solid ${T.border}`, borderRadius:T.radius, width:"100%", maxWidth:520, overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:T.text }}>Novo Tenant</div>
            <div style={{ fontSize:12, color:T.textMuted, marginTop:2 }}>Passo {step} de 2</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:T.textMuted, cursor:"pointer", display:"flex" }}><X size={18}/></button>
        </div>

        {/* Progress */}
        <div style={{ height:3, background:T.surface }}>
          <div style={{ height:"100%", width:`${(step/2)*100}%`, background:`linear-gradient(90deg, ${T.accent}, ${T.accentAlt})`, transition:"width 0.4s ease" }}/>
        </div>

        <div style={{ padding:"24px" }}>
          {step === 1 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:T.textSub, display:"block", marginBottom:6 }}>Nome do tenant *</label>
                <input value={name} onChange={e=>{setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""));}}
                  placeholder="Ex: MentorMatch Sicredi"
                  style={{ width:"100%", background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radiusSm, padding:"10px 12px", color:T.text, fontSize:14, fontFamily:"inherit", outline:"none" }}
                />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:T.textSub, display:"block", marginBottom:6 }}>Slug da URL *</label>
                <div style={{ display:"flex", alignItems:"center", gap:0, background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radiusSm, overflow:"hidden" }}>
                  <span style={{ padding:"10px 12px", fontSize:13, color:T.textMuted, borderRight:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>aurimarnogueira.com.br/</span>
                  <input value={slug} onChange={e=>setSlug(e.target.value)}
                    style={{ flex:1, background:"transparent", border:"none", padding:"10px 12px", color:T.text, fontSize:14, fontFamily:"inherit", outline:"none" }}
                    placeholder="slug-do-tenant"
                  />
                </div>
                <div style={{ fontSize:11, color:T.textMuted, marginTop:5 }}>URL final: aurimarnogueira.com.br/{slug || "slug"}/mentormatch</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize:13, color:T.textSub, marginBottom:16, lineHeight:1.6 }}>
                Faça upload do arquivo <strong style={{ color:T.text }}>design.md</strong> do tenant. O sistema irá gerar automaticamente o design system, tokens CSS e todas as páginas no padrão do tenant.
              </div>
              <div
                onDragOver={e=>{e.preventDefault(); setDragging(true);}}
                onDragLeave={()=>setDragging(false)}
                onDrop={handleDrop}
                onClick={()=>fileRef.current.click()}
                style={{
                  border:`2px dashed ${dragging ? T.accent : designFile ? T.green : T.border}`,
                  borderRadius:T.radiusSm, padding:"32px 24px", textAlign:"center",
                  background: dragging ? `${T.accent}08` : designFile ? `${T.green}08` : T.surface,
                  cursor:"pointer", transition:"all 0.2s ease",
                }}
              >
                <input ref={fileRef} type="file" accept=".md" style={{ display:"none" }} onChange={e=>{if(e.target.files[0]) setDesign(e.target.files[0]);}}/>
                {designFile ? (
                  <div>
                    <CheckCircle size={32} color={T.green} style={{ margin:"0 auto 10px" }}/>
                    <div style={{ fontSize:14, fontWeight:600, color:T.green }}>{designFile.name}</div>
                    <div style={{ fontSize:11, color:T.textMuted, marginTop:4 }}>Clique para trocar o arquivo</div>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} color={T.textMuted} style={{ margin:"0 auto 10px" }}/>
                    <div style={{ fontSize:14, fontWeight:600, color:T.text }}>Arraste o design.md aqui</div>
                    <div style={{ fontSize:12, color:T.textMuted, marginTop:4 }}>ou clique para selecionar · apenas .md</div>
                  </div>
                )}
              </div>
              {!designFile && (
                <div style={{ marginTop:12, padding:"10px 14px", background:T.surface, border:`1px solid ${T.border}`, borderRadius:T.radiusSm }}>
                  <div style={{ fontSize:11, color:T.textMuted, display:"flex", alignItems:"flex-start", gap:8 }}>
                    <AlertCircle size={13} color={T.amber} style={{ flexShrink:0, marginTop:1 }}/>
                    <span>Sem design.md o tenant usará o tema base (dark). Você poderá adicionar depois em Configurações.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding:"16px 24px", borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"flex-end", gap:10 }}>
          {step > 1 && (
            <button onClick={()=>setStep(s=>s-1)} style={{ background:T.surface, border:`1px solid ${T.border}`, color:T.textSub, padding:"10px 20px", borderRadius:T.radiusSm, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
              Voltar
            </button>
          )}
          <button onClick={()=>{ if(step < 2) setStep(s=>s+1); else { onClose(); }}}
            disabled={step===1 && !name.trim()}
            style={{ background:step===1&&!name.trim() ? T.surface : `linear-gradient(135deg,${T.accent},${T.accentAlt})`, border:"none", color:step===1&&!name.trim()?T.textMuted:"#fff", padding:"10px 24px", borderRadius:T.radiusSm, fontSize:13, fontWeight:700, cursor:step===1&&!name.trim()?"not-allowed":"pointer", fontFamily:"inherit", boxShadow:step===1&&!name.trim()?"none":`0 4px 14px ${T.accentGlow}` }}
          >
            {step === 2 ? (designFile ? "Criar tenant com design" : "Criar com tema base") : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function AdminGeral() {
  const [tenants, setTenants] = useState(TENANTS);
  const [newModal, setNewModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const totalUsers    = tenants.reduce((a,t)=>a+t.users,0);
  const totalSessions = tenants.reduce((a,t)=>a+t.sessions,0);
  const activeTenants = tenants.filter(t=>t.status==="active").length;

  return (
    <div style={{ background:T.bgDeep, minHeight:"100vh", fontFamily:"Inter, system-ui, sans-serif", color:T.text }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Topbar */}
      <div style={{ background:T.bgBase, borderBottom:`1px solid ${T.border}`, padding:"0 40px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:`linear-gradient(135deg,${T.accent},${T.accentAlt})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <BookOpen size={13} color="#fff"/>
          </div>
          <span style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.01em" }}>MentorMatch</span>
          <span style={{ background:T.surface, border:`1px solid ${T.border}`, color:T.textMuted, fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:100, letterSpacing:"0.06em" }}>ADMIN GERAL</span>
        </div>
        <div style={{ fontSize:12, color:T.textMuted }}>aurimarnogueira.com.br · admin</div>
      </div>

      <div style={{ maxWidth:1160, margin:"0 auto", padding:"40px" }}>

        {/* Page header */}
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4 }}>Gestão de Tenants</h1>
            <p style={{ fontSize:13, color:T.textMuted }}>Administre todos os ambientes MentorMatch em uma só tela.</p>
          </div>
          <button onClick={()=>setNewModal(true)} style={{ background:`linear-gradient(135deg,${T.accent},${T.accentAlt})`, border:"none", color:"#fff", padding:"11px 20px", borderRadius:T.radiusSm, fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:7, boxShadow:`0 4px 14px ${T.accentGlow}` }}>
            <Plus size={15}/> Novo Tenant
          </button>
        </div>

        {/* Global stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
          {[
            { icon:<Globe size={17}/>,    label:"Tenants ativos",     val:activeTenants, accent:T.accentAlt },
            { icon:<Users size={17}/>,    label:"Usuários totais",    val:totalUsers,    accent:"#06B6D4" },
            { icon:<BarChart2 size={17}/>,label:"Sessões realizadas", val:totalSessions, accent:T.green },
            { icon:<FileText size={17}/>, label:"Com design.md",      val:tenants.filter(t=>t.hasDesignMd).length, accent:T.amber },
          ].map(({icon,label,val,accent})=>(
            <div key={label} style={{ background:T.glass, backdropFilter:"blur(14px)", border:`1px solid ${T.border}`, borderRadius:T.radius, padding:"18px 22px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${accent}18`, display:"flex", alignItems:"center", justifyContent:"center", color:accent }}>{icon}</div>
              </div>
              <div style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.02em", lineHeight:1, color:T.text }}>{val}</div>
              <div style={{ fontSize:12, color:T.textMuted, marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tenant grid */}
        <div style={{ marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:T.text }}>Todos os Tenants</h2>
          <span style={{ fontSize:12, color:T.textMuted }}>{tenants.length} ambientes</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:20 }}>
          {tenants.map(t=><TenantCard key={t.id} tenant={t} onManage={setSelected}/>)}

          {/* Add new card */}
          <button onClick={()=>setNewModal(true)} style={{ background:T.surface, border:`2px dashed ${T.border}`, borderRadius:T.radius, padding:"32px 24px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, color:T.textMuted, fontFamily:"inherit", transition:"all 0.2s ease" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accentAlt; e.currentTarget.style.color="#A5B4FC";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border; e.currentTarget.style.color=T.textMuted;}}
          >
            <div style={{ width:44, height:44, borderRadius:"50%", border:`2px dashed currentColor`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Plus size={20}/>
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>Adicionar Tenant</div>
              <div style={{ fontSize:12, color:T.textMuted }}>Faça upload do design.md para gerar</div>
            </div>
          </button>
        </div>

        {/* Instructions */}
        <div style={{ marginTop:32, background:T.glass, backdropFilter:"blur(14px)", border:`1px solid ${T.border}`, borderRadius:T.radius, padding:"20px 24px" }}>
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <AlertCircle size={16} color={T.accent} style={{ flexShrink:0, marginTop:2 }}/>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:T.text, marginBottom:6 }}>Como criar um novo tenant</div>
              <ol style={{ fontSize:12, color:T.textMuted, lineHeight:1.8, paddingLeft:16 }}>
                <li>Clique em "Novo Tenant" e defina o nome e slug da URL</li>
                <li>Faça upload do arquivo <code style={{ background:T.surface, padding:"1px 5px", borderRadius:4, color:"#A5B4FC" }}>design.md</code> do cliente com tokens de cor, tipografia e identidade</li>
                <li>O sistema provisiona automaticamente: tema CSS, landing page, dashboard e todas as páginas no padrão do cliente</li>
                <li>O tenant fica disponível em <code style={{ background:T.surface, padding:"1px 5px", borderRadius:4, color:"#A5B4FC" }}>aurimarnogueira.com.br/[slug]/mentormatch</code></li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {newModal && <NewTenantModal onClose={()=>setNewModal(false)}/>}
    </div>
  );
}
