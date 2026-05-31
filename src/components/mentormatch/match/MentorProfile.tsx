'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  Badge,
  Button,
  MentorMatchThemeRoot,
  Modal,
  Reveal,
  Stagger,
  StaggerItem,
  ToastProvider,
  useToast,
} from '@/mentormatch/design-system';

interface ProfileMentor {
  id: string;
  name: string | null;
  headline: string | null;
  department: string | null;
  bio: string | null;
  education: string | null;
  experience: string | null;
  image: string | null;
  languages: string[];
  skills: string[];
  activeConnections: number;
  maxMentees: number;
  totalConnections: number;
}

interface MentorProfileProps {
  slug: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
  canRequest: boolean;
  alreadyRequested: boolean;
  mentor: ProfileMentor;
}

export function MentorProfile(props: MentorProfileProps) {
  return (
    <MentorMatchThemeRoot brand={props.brandColor} theme={props.theme} style={{ minHeight: '100vh' }}>
      <ToastProvider>
        <Inner {...props} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function Inner({ mentor, canRequest, alreadyRequested, slug }: MentorProfileProps) {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [requested, setRequested] = useState(alreadyRequested);
  const [objetivo, setObjetivo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sending, setSending] = useState(false);

  const max = Math.max(1, mentor.maxMentees);
  const used = mentor.activeConnections;
  const full = used >= max;
  const ratio = used / max;
  const capColor = full ? 'var(--danger)' : ratio >= 0.75 ? 'var(--warning)' : 'var(--brand)';

  async function send() {
    setSending(true);
    const parts: string[] = [];
    if (objetivo.trim()) parts.push(`Objetivo: ${objetivo.trim()}`);
    if (mensagem.trim()) parts.push(mensagem.trim());
    const combined = parts.join('\n\n');
    const body: { mentorId: string; message?: string } = { mentorId: mentor.id };
    if (combined.length >= 10) body.message = combined;

    const res = await fetch('/api/mentormatch/connections', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSending(false);
    if (res.ok) {
      toast({
        title: full ? 'Voce entrou na lista de espera' : 'Solicitacao enviada',
        description: full
          ? 'O mentor sera notificado quando abrir vaga.'
          : `${mentor.name ?? 'O mentor'} foi notificado.`,
        tone: 'success',
      });
      setRequested(true);
      setModalOpen(false);
      return;
    }
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    toast({ title: data?.error ?? 'Nao foi possivel enviar', tone: 'danger' });
  }

  const cta = (
    <ActionButton
      canRequest={canRequest}
      requested={requested}
      full={full}
      onOpen={() => setModalOpen(true)}
    />
  );

  const capacityBlock = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span className="mm-body-small">Capacidade</span>
        <span className="mm-body-small mm-mono" style={{ color: 'var(--text)' }}>
          {used}/{max}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 'var(--r-pill)', background: 'var(--surface-2)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${Math.min(100, ratio * 100)}%`, background: capColor, borderRadius: 'var(--r-pill)' }} />
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 96 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <Reveal>
          <a href={`/mentormatch/t/${slug}/mentors`} className="mm-body-small" style={{ color: 'var(--text-secondary)' }}>
            &larr; Voltar para mentores
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
            <Avatar name={mentor.name} image={mentor.image} />
            <div style={{ minWidth: 0 }}>
              <h1 className="mm-h1">{mentor.name ?? 'Mentor'}</h1>
              {mentor.headline && (
                <p className="mm-h3" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {mentor.headline}
                </p>
              )}
              <div style={{ marginTop: 8 }}>
                <Badge tone={full ? 'danger' : 'success'}>{full ? 'Lotado' : 'Disponivel'}</Badge>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <Stagger className="flex flex-col gap-6">
            {mentor.bio && (
              <StaggerItem>
                <SectionCard title="Sobre">
                  <p className="mm-body">{mentor.bio}</p>
                </SectionCard>
              </StaggerItem>
            )}

            {mentor.skills.length > 0 && (
              <StaggerItem>
                <SectionCard title="Especialidades">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {mentor.skills.map((s) => (
                      <span key={s} className="mm-chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </SectionCard>
              </StaggerItem>
            )}

            {(mentor.education || mentor.experience || mentor.department) && (
              <StaggerItem>
                <SectionCard title="Formacao e experiencia">
                  {mentor.department && <Field label="Area" value={mentor.department} />}
                  {mentor.education && <Field label="Formacao" value={mentor.education} />}
                  {mentor.experience && <Field label="Experiencia" value={mentor.experience} />}
                </SectionCard>
              </StaggerItem>
            )}

            <StaggerItem>
              <SectionCard title="Disponibilidade">
                <p className="mm-body">{full ? 'Sem vagas no momento.' : 'Aceitando novos mentorados.'}</p>
                {mentor.languages.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    {mentor.languages.map((l) => (
                      <span key={l} className="mm-chip">
                        {l}
                      </span>
                    ))}
                  </div>
                )}
              </SectionCard>
            </StaggerItem>

            <StaggerItem>
              <SectionCard title="Estatisticas">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <Stat label="Ativos" value={`${used}`} />
                  <Stat label="Vagas" value={`${Math.max(0, max - used)}`} />
                  <Stat label="Conexoes" value={`${mentor.totalConnections}`} />
                </div>
              </SectionCard>
            </StaggerItem>
          </Stagger>

          <aside className="hidden lg:block">
            <div className="mm-card" style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {capacityBlock}
              {cta}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile: barra de acao fixa no rodape */}
      <div
        className="lg:hidden"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          padding: 16,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span className="mm-body-small mm-mono" style={{ color: 'var(--text)' }}>
          {used}/{max}
        </span>
        <div style={{ flex: 1 }}>{cta}</div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 className="mm-h2">Solicitar mentoria</h2>
            <p className="mm-body-small">Conte seu objetivo para {mentor.name ?? 'o mentor'}.</p>
          </div>
          <label className="mm-field">
            <span className="mm-label">Objetivo</span>
            <input
              className="mm-input"
              placeholder="Ex: evoluir em lideranca"
              value={objetivo}
              onChange={(e) => setObjetivo(e.target.value)}
            />
          </label>
          <label className="mm-field">
            <span className="mm-label">Mensagem</span>
            <textarea
              className="mm-input"
              style={{ minHeight: 96, resize: 'vertical' }}
              placeholder="Apresente-se e diga o que busca"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)} disabled={sending}>
              Cancelar
            </Button>
            <Button onClick={send} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar solicitacao'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ActionButton({
  canRequest,
  requested,
  full,
  onOpen,
}: {
  canRequest: boolean;
  requested: boolean;
  full: boolean;
  onOpen: () => void;
}) {
  if (!canRequest) {
    return (
      <p className="mm-body-small" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
        Apenas mentorados podem solicitar.
      </p>
    );
  }
  if (requested) {
    return (
      <Button variant="ghost" disabled style={{ width: '100%' }}>
        Solicitacao enviada
      </Button>
    );
  }
  if (full) {
    return (
      <button
        type="button"
        className="mm-btn mm-btn--secondary"
        style={{ width: '100%', borderColor: 'var(--warning)', color: 'var(--warning)' }}
        onClick={onOpen}
      >
        Entrar na waitlist
      </button>
    );
  }
  return (
    <Button onClick={onOpen} style={{ width: '100%' }}>
      Solicitar mentoria
    </Button>
  );
}

function Avatar({ name, image }: { name: string | null; image: string | null }) {
  const initials = (name ?? '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
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
        background: 'var(--brand-soft)',
        color: 'var(--brand)',
        fontWeight: 700,
        fontSize: 28,
      }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name ?? 'Mentor'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </span>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mm-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 className="mm-h3">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mm-label">{label}</span>
      <p className="mm-body" style={{ marginTop: 2 }}>
        {value}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: 12, textAlign: 'center' }}>
      <div className="mm-h2" style={{ color: 'var(--brand)' }}>
        {value}
      </div>
      <div className="mm-body-small">{label}</div>
    </div>
  );
}
