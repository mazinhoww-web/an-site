import { useState, useRef } from "react";
import { Search, Upload, BookOpen, X, Check, FileText, Video, Link2, BookMarked, Heart, ExternalLink, Filter } from "lucide-react";

const CATS=["Todos","Carreira","Técnico","Soft Skills","Liderança"];
const FORMATS={PDF:{label:"PDF",bg:"#FEE2E2",color:"#991B1B"},Video:{label:"Vídeo",bg:"#DBEAFE",color:"#1E40AF"},Link:{label:"Link",bg:"#E1E6E1",color:"#323C32"},Artigo:{label:"Artigo",bg:"#D7E6C8",color:"#146E37"}};
const MOCK_MATERIALS=[
  {id:1,title:"Liderança Situacional",format:"PDF",category:"Liderança",author:"Ana Costa",date:"15 mai 2026",saved:false},
  {id:2,title:"Python para Análise de Dados",format:"Video",category:"Técnico",author:"Pedro Lima",date:"10 mai 2026",saved:true},
  {id:3,title:"Como dar e receber feedback",format:"Artigo",category:"Soft Skills",author:"Fernanda Luz",date:"05 mai 2026",saved:false},
  {id:4,title:"Guia de Entrevistas em Produto",format:"Link",category:"Carreira",author:"Roberto Silva",date:"28 abr 2026",saved:false},
  {id:5,title:"OKRs na Prática",format:"PDF",category:"Liderança",author:"Julia Matos",date:"20 abr 2026",saved:true},
  {id:6,title:"SQL Avançado",format:"Video",category:"Técnico",author:"Diego Souza",date:"12 abr 2026",saved:false},
];

function FormatChip({format}){
  const f=FORMATS[format]||FORMATS.Link;
  return <span style={{ background:f.bg, color:f.color, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:"var(--radius-chip)" }}>{f.label}</span>;
}

function MaterialCard({id,title,format,category,author,date,saved,onSave}){
  const icons={PDF:<FileText size={28}/>,Video:<Video size={28}/>,Link:<Link2 size={28}/>,Artigo:<BookMarked size={28}/>};
  const colors={PDF:"var(--red)",Video:"var(--accent)",Link:"var(--text-muted)",Artigo:"var(--green)"};
  return(
    <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", overflow:"hidden", transition:"transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="var(--shadow-md)"; e.currentTarget.style.borderColor="var(--border-accent)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="var(--border)";}}>
      {/* Thumbnail area */}
      <div style={{ height:80, background:"var(--surface)", display:"flex", alignItems:"center", justifyContent:"center", borderBottom:"1px solid var(--border)", color:colors[format] }}>
        {icons[format]}
      </div>
      <div style={{ padding:"14px 16px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:8, marginBottom:8 }}>
          <FormatChip format={format}/>
          <button onClick={()=>onSave(id)} style={{ background:"none", border:"none", cursor:"pointer", color:saved?"#EF4444":"var(--text-muted)", transition:"color 0.15s ease", padding:2, display:"flex" }}>
            <Heart size={14} fill={saved?"#EF4444":"none"}/>
          </button>
        </div>
        <div style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:6, lineHeight:"18px", fontFamily:"var(--font-body)" }}>{title}</div>
        <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"var(--font-body)" }}>{author} · {date}</div>
        <button style={{ marginTop:12, width:"100%", background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)", padding:"7px", borderRadius:"var(--radius-btn)", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", justifyContent:"center", gap:5, transition:"all 0.15s ease" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border-accent)"; e.currentTarget.style.color="var(--accent-alt)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.color="var(--text-muted)";}}>
          <ExternalLink size={11}/> Abrir material
        </button>
      </div>
    </div>
  );
}

function UploadModal({onClose}){
  const [drag,setDrag]=useState(false);
  const [file,setFile]=useState(null);
  const [title,setTitle]=useState("");
  const [cat,setCat]=useState("Carreira");
  const ref=useRef();
  const drop=(e)=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)setFile(f);};
  return(
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", backdropFilter:"blur(6px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:"var(--bg-elevated)", border:"1px solid var(--border)", borderRadius:"var(--radius-card)", width:"100%", maxWidth:480, overflow:"hidden" }}>
        <div style={{ padding:"18px 22px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ fontSize:15, fontWeight:700, color:"var(--text)", fontFamily:"var(--font-display)" }}>Enviar Material</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"var(--text-muted)", cursor:"pointer", display:"flex" }}><X size={17}/></button>
        </div>
        <div style={{ padding:22, display:"flex", flexDirection:"column", gap:16 }}>
          <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={drop} onClick={()=>ref.current.click()}
            style={{ border:`2px dashed ${drag?"var(--accent)":file?"var(--green)":"var(--border)"}`, borderRadius:"var(--radius-btn)", padding:"28px 20px", textAlign:"center", cursor:"pointer", background:drag?"var(--accent)08":file?"rgba(16,185,129,0.05)":"var(--surface)", transition:"all 0.2s ease" }}>
            <input ref={ref} type="file" style={{ display:"none" }} onChange={e=>{if(e.target.files[0])setFile(e.target.files[0]);}}/>
            {file ? (
              <div><Check size={28} color="var(--green)" style={{ margin:"0 auto 8px" }}/><div style={{ fontSize:13, fontWeight:600, color:"var(--green)", fontFamily:"var(--font-body)" }}>{file.name}</div><div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>Clique para trocar</div></div>
            ) : (
              <div><Upload size={28} color="var(--text-muted)" style={{ margin:"0 auto 8px" }}/><div style={{ fontSize:13, fontWeight:600, color:"var(--text)", fontFamily:"var(--font-body)" }}>Arraste aqui ou clique</div><div style={{ fontSize:11, color:"var(--text-muted)", marginTop:4 }}>PDF, MP4, URL · até 50MB</div></div>
            )}
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"var(--text-sub)", display:"block", marginBottom:5, fontFamily:"var(--font-body)" }}>Título *</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Ex: Guia de Liderança Situacional" style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:"9px 12px", color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)", outline:"none" }}/>
          </div>
          <div>
            <label style={{ fontSize:12, fontWeight:600, color:"var(--text-sub)", display:"block", marginBottom:5, fontFamily:"var(--font-body)" }}>Categoria</label>
            <select value={cat} onChange={e=>setCat(e.target.value)} style={{ width:"100%", background:"var(--surface)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:"9px 12px", color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)", outline:"none", cursor:"pointer" }}>
              {CATS.filter(c=>c!=="Todos").map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ padding:"14px 22px", borderTop:"1px solid var(--border)", display:"flex", justifyContent:"flex-end", gap:10 }}>
          <button onClick={onClose} style={{ background:"var(--surface)", border:"1px solid var(--border)", color:"var(--text-muted)", padding:"9px 18px", borderRadius:"var(--radius-btn)", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)" }}>Cancelar</button>
          <button disabled={!file||!title} style={{ background:!file||!title?"var(--surface)":"linear-gradient(135deg,var(--accent),var(--accent-alt))", border:"none", color:!file||!title?"var(--text-muted)":"#fff", padding:"9px 20px", borderRadius:"var(--radius-btn)", fontSize:13, fontWeight:700, cursor:!file||!title?"not-allowed":"pointer", fontFamily:"var(--font-body)" }}>
            Enviar material
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BibliotecaUpload(){
  const [cat,setCat]=useState("Todos");
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(false);
  const [materials,setMaterials]=useState(MOCK_MATERIALS);
  const filtered=materials.filter(m=>(cat==="Todos"||m.category===cat)&&(m.title.toLowerCase().includes(search.toLowerCase())||m.author.toLowerCase().includes(search.toLowerCase())));
  const toggleSave=(id)=>setMaterials(ms=>ms.map(m=>m.id===id?{...m,saved:!m.saved}:m));
  return(
    <div style={{ background:"var(--bg-base)", minHeight:"100vh", padding:"32px 36px", fontFamily:"var(--font-body)", color:"var(--text)" }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4, fontFamily:"var(--font-display)" }}>Biblioteca de Materiais</h1>
          <p style={{ fontSize:13, color:"var(--text-muted)" }}>Explore recursos selecionados para impulsionar seu desenvolvimento.</p>
        </div>
        <button onClick={()=>setModal(true)} style={{ background:"linear-gradient(135deg,var(--accent),var(--accent-alt))", border:"none", color:"#fff", padding:"10px 18px", borderRadius:"var(--radius-btn)", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:7 }}>
          <Upload size={14}/> Enviar material
        </button>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <div style={{ flex:1, position:"relative" }}>
          <Search size={14} color="var(--text-muted)" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar por título, assunto ou formato..." style={{ width:"100%", background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--radius-btn)", padding:"10px 12px 10px 36px", color:"var(--text)", fontSize:14, fontFamily:"var(--font-body)", outline:"none" }}/>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ background:cat===c?"linear-gradient(135deg,var(--accent),var(--accent-alt))":"var(--surface)", border:`1px solid ${cat===c?"transparent":"var(--border)"}`, color:cat===c?"#fff":"var(--text-muted)", padding:"6px 16px", borderRadius:"var(--radius-chip)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)", transition:"all 0.15s ease" }}>
            {c}
          </button>
        ))}
      </div>
      {filtered.length===0 ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 24px", textAlign:"center" }}>
          <BookOpen size={40} color="var(--text-muted)" style={{ marginBottom:12, opacity:0.5 }}/>
          <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>Nenhum material encontrado</div>
          <div style={{ fontSize:13, color:"var(--text-muted)", marginBottom:18 }}>A biblioteca ainda não possui materiais nessa categoria.</div>
          <button onClick={()=>setModal(true)} style={{ background:"linear-gradient(135deg,var(--accent),var(--accent-alt))", border:"none", color:"#fff", padding:"10px 20px", borderRadius:"var(--radius-btn)", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"var(--font-body)", display:"flex", alignItems:"center", gap:7 }}>
            <Upload size={13}/> Enviar primeiro material
          </button>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
          {filtered.map(m=><MaterialCard key={m.id} {...m} onSave={toggleSave}/>)}
        </div>
      )}
      {modal && <UploadModal onClose={()=>setModal(false)}/>}
    </div>
  );
}
