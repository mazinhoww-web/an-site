'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, Check, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { Button, EASE, MentorMatchThemeRoot, Reveal } from '@/mentormatch/design-system';

type RoleChoice = 'MENTOR' | 'MENTEE' | 'BOTH';
interface SkillOption {
  id: string;
  name: string;
}

interface MmOnboardingWizardProps {
  brandColor?: string | null;
  theme?: 'light' | 'dark';
  skills: SkillOption[];
  defaultName?: string;
  defaultRole?: 'MENTOR' | 'MENTEE';
}

const STEPS = ['Perfil', 'Formacao', 'Skills', 'Objetivos'] as const;
const MAX_SUGGESTED_SKILLS = 8;

export function MmOnboardingWizard({
  brandColor,
  theme = 'light',
  skills,
  defaultName = '',
  defaultRole = 'MENTEE',
}: MmOnboardingWizardProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(defaultName);
  const [headline, setHeadline] = useState('');
  const [education, setEducation] = useState('');
  const [department, setDepartment] = useState('');
  const [bio, setBio] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [skillQuery, setSkillQuery] = useState('');
  const [roleChoice, setRoleChoice] = useState<RoleChoice>(defaultRole);
  const [maxMentees, setMaxMentees] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const canMentor = roleChoice !== 'MENTEE';
  const filteredSkills = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    return q ? skills.filter((s) => s.name.toLowerCase().includes(q)) : skills;
  }, [skills, skillQuery]);

  const stepValid =
    step === 0 ? name.trim().length >= 2 : step === 2 ? selected.size >= 1 : true;

  function toggleSkill(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/mentormatch/upload', { method: 'POST', body: fd });
    setUploading(false);
    if (!res.ok) {
      setError('Falha no upload da foto.');
      return;
    }
    const data = (await res.json()) as { url: string };
    setImage(data.url);
  }

  async function handleFinish() {
    setSubmitting(true);
    setError('');
    const role = roleChoice === 'MENTOR' ? 'MENTOR' : 'MENTEE'; // BOTH -> primario MENTEE
    const payload = {
      role,
      canMentor,
      canMentee: roleChoice !== 'MENTOR',
      name,
      headline: headline || undefined,
      department: department || undefined,
      bio: bio || undefined,
      education: education || undefined,
      image: image || undefined,
      skills: [...selected],
      maxMentees: canMentor ? maxMentees : undefined,
    };
    const res = await fetch('/api/mentormatch/auth/complete-profile', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(d?.error ?? 'Nao foi possivel concluir.');
      setSubmitting(false);
      return;
    }
    const d = (await res.json()) as { redirectTo?: string };
    setDone(true);
    setTimeout(() => router.push(d.redirectTo ?? '/mentormatch/continue'), 700);
  }

  return (
    <MentorMatchThemeRoot
      brand={brandColor}
      theme={theme}
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 24px' }}
    >
      <div style={{ width: '100%', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Stepper step={step} reduced={Boolean(reduced)} />

        <div className="mm-card" style={{ padding: 32 }}>
          <Reveal key={step}>
            {step === 0 && (
              <Section title="Quem e voce" subtitle="Foto, nome e cargo atual.">
                <PhotoDropzone
                  image={image}
                  uploading={uploading}
                  onPick={() => fileRef.current?.click()}
                  onFile={handleFile}
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                />
                <LabeledInput label="Nome completo" value={name} onChange={setName} placeholder="Seu nome" />
                <LabeledInput label="Cargo" value={headline} onChange={setHeadline} placeholder="Ex: Product Manager" />
              </Section>
            )}

            {step === 1 && (
              <Section title="Formacao e area" subtitle="Conte sua trajetoria.">
                <LabeledInput label="Formacao" value={education} onChange={setEducation} placeholder="Ex: Administracao, FGV" />
                <LabeledInput label="Area / departamento" value={department} onChange={setDepartment} placeholder="Ex: Produto, Marketing" />
              </Section>
            )}

            {step === 2 && (
              <Section title="Habilidades" subtitle={`Selecione as suas. Sugerido ate ${MAX_SUGGESTED_SKILLS}.`}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
                  <input
                    className="mm-input"
                    style={{ paddingLeft: 36 }}
                    placeholder="Buscar habilidade"
                    value={skillQuery}
                    onChange={(e) => setSkillQuery(e.target.value)}
                  />
                </div>
                <p className="mm-body-small">Selecionadas: {selected.size}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {filteredSkills.map((s) => {
                    const on = selected.has(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`mm-chip${on ? ' mm-chip--selected' : ''}`}
                        aria-pressed={on}
                        onClick={() => toggleSkill(s.id)}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                  {filteredSkills.length === 0 && (
                    <p className="mm-body-small">Nenhuma habilidade encontrada.</p>
                  )}
                </div>
              </Section>
            )}

            {step === 3 && (
              <Section title="Objetivos e papel" subtitle="Como voce quer participar.">
                <div>
                  <span className="mm-label" style={{ display: 'block', marginBottom: 8 }}>
                    Papel
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <RoleCard label="Mentor" desc="Compartilhar" active={roleChoice === 'MENTOR'} onClick={() => setRoleChoice('MENTOR')} />
                    <RoleCard label="Mentorado" desc="Aprender" active={roleChoice === 'MENTEE'} onClick={() => setRoleChoice('MENTEE')} />
                    <RoleCard label="Ambos" desc="Os dois" active={roleChoice === 'BOTH'} onClick={() => setRoleChoice('BOTH')} />
                  </div>
                </div>

                <LabeledTextarea label="Objetivos" value={bio} onChange={setBio} placeholder="O que voce busca no programa?" />

                {canMentor && (
                  <div className="mm-field">
                    <span className="mm-label">Vagas de mentoria: {maxMentees}</span>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      value={maxMentees}
                      onChange={(e) => setMaxMentees(Number(e.target.value))}
                      style={{ accentColor: 'var(--brand)' }}
                    />
                  </div>
                )}

                <Summary
                  name={name}
                  headline={headline}
                  department={department}
                  skillCount={selected.size}
                  roleChoice={roleChoice}
                />
              </Section>
            )}
          </Reveal>

          {error && (
            <p className="mm-field__error" role="alert" style={{ marginTop: 16 }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || submitting}
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>

            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!stepValid}>
                Continuar
                <ArrowRight size={16} />
              </Button>
            ) : (
              <motion.button
                type="button"
                className="mm-btn mm-btn--primary"
                onClick={handleFinish}
                disabled={submitting || done}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                animate={done && !reduced ? { scale: [1, 1.06, 1] } : undefined}
                transition={{ duration: 0.4, ease: EASE.emphasis }}
              >
                {done ? (
                  <>
                    <Check size={16} />
                    Pronto!
                  </>
                ) : submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Concluindo...
                  </>
                ) : (
                  'Concluir'
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </MentorMatchThemeRoot>
  );
}

function Stepper({ step, reduced }: { step: number; reduced: boolean }) {
  const pct = (step / (STEPS.length - 1)) * 100;
  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ position: 'absolute', top: 13, left: 0, right: 0, height: 2, background: 'var(--border)' }} />
      <motion.div
        style={{ position: 'absolute', top: 13, left: 0, height: 2, background: 'var(--brand)' }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE.entrance }}
      />
      {STEPS.map((label, i) => {
        const filled = i <= step;
        return (
          <div key={label} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
                background: filled ? 'var(--brand)' : 'var(--surface)',
                color: filled ? 'var(--brand-contrast)' : 'var(--text-muted)',
                border: filled ? 'none' : '1px solid var(--border)',
                transition: 'background 0.3s, color 0.3s',
              }}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </span>
            <span className="mm-body-small" style={{ color: filled ? 'var(--text)' : 'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h1 className="mm-h2">{title}</h1>
        <p className="mm-body-small">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="mm-field">
      <span className="mm-label">{label}</span>
      <input className="mm-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function LabeledTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="mm-field">
      <span className="mm-label">{label}</span>
      <textarea
        className="mm-input"
        style={{ minHeight: 88, resize: 'vertical' }}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function PhotoDropzone({
  image,
  uploading,
  onPick,
  onFile,
}: {
  image: string;
  uploading: boolean;
  onPick: () => void;
  onFile: (f: File) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span
        style={{
          width: 96,
          height: 96,
          flexShrink: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-2)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
        }}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Camera size={28} />
        )}
      </span>
      <div
        onClick={onPick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        style={{
          flex: 1,
          cursor: 'pointer',
          borderRadius: 'var(--r-md)',
          border: '1px dashed var(--border-strong)',
          background: 'var(--surface-2)',
          padding: '18px 16px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="mm-body-small">
          {uploading ? 'Enviando...' : 'Arraste uma foto ou clique para enviar'}
        </span>
      </div>
    </div>
  );
}

function RoleCard({ label, desc, active, onClick }: { label: string; desc: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="mm-card"
      style={{
        padding: 14,
        textAlign: 'center',
        cursor: 'pointer',
        border: active ? '2px solid var(--brand)' : '1px solid var(--border)',
        background: active ? 'var(--brand-soft)' : 'var(--surface)',
        color: active ? 'var(--brand)' : 'var(--text)',
      }}
    >
      <span className="mm-body-strong" style={{ display: 'block', color: 'inherit' }}>
        {label}
      </span>
      <span className="mm-body-small" style={{ color: active ? 'var(--brand)' : 'var(--text-muted)' }}>
        {desc}
      </span>
    </button>
  );
}

function Summary({
  name,
  headline,
  department,
  skillCount,
  roleChoice,
}: {
  name: string;
  headline: string;
  department: string;
  skillCount: number;
  roleChoice: RoleChoice;
}) {
  const roleLabel = roleChoice === 'MENTOR' ? 'Mentor' : roleChoice === 'MENTEE' ? 'Mentorado' : 'Mentor e Mentorado';
  const rows: [string, string][] = [
    ['Nome', name || '-'],
    ['Cargo', headline || '-'],
    ['Area', department || '-'],
    ['Habilidades', String(skillCount)],
    ['Papel', roleLabel],
  ];
  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="mm-label">Resumo</span>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span className="mm-body-small">{k}</span>
          <span className="mm-body-small" style={{ color: 'var(--text)', textAlign: 'right' }}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}
