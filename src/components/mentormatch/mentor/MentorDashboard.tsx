'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, Loader2, MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import {
  Badge,
  Button,
  EASE,
  MentorMatchThemeRoot,
  Stagger,
  StaggerItem,
  ToastProvider,
  useToast,
} from '@/mentormatch/design-system';

interface MenteeLite {
  name: string | null;
  headline: string | null;
  image: string | null;
  whatsapp?: string | null;
}
interface RequestItem {
  connectionId: string;
  message: string | null;
  createdAt: string | null;
  mentee: MenteeLite;
}
interface ActiveItem {
  connectionId: string;
  startedAt: string | null;
  mentee: MenteeLite;
}
interface WaitlistItem {
  id: string;
  position: number;
  mentee: { name: string | null; headline: string | null };
}

interface MentorDashboardProps {
  brandColor?: string | null;
  theme?: 'light' | 'dark';
  requests: RequestItem[];
  actives: ActiveItem[];
  waitlist: WaitlistItem[];
  maxMentees: number;
}

type Tab = 'requests' | 'actives' | 'waitlist';

export function MentorDashboard(props: MentorDashboardProps) {
  return (
    <MentorMatchThemeRoot brand={props.brandColor} theme={props.theme} style={{ minHeight: '100vh' }}>
      <ToastProvider>
        <Inner {...props} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function fmtDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function Inner({ requests: r0, actives: a0, waitlist, maxMentees }: MentorDashboardProps) {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('requests');
  const [requests, setRequests] = useState(r0);
  const [actives, setActives] = useState(a0);
  const [busyId, setBusyId] = useState<string | null>(null);

  const max = Math.max(1, maxMentees);
  const used = actives.length;
  const full = used >= max;
  const ratio = used / max;
  const capColor = full ? 'var(--danger)' : ratio >= 0.75 ? 'var(--warning)' : 'var(--brand)';

  async function respond(conn: string, status: 'ACCEPTED' | 'REJECTED') {
    const res = await fetch('/api/mentormatch/connections', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ connectionId: conn, status }),
    });
    return res;
  }

  async function accept(req: RequestItem) {
    if (full) {
      toast({ title: 'Sem vagas disponiveis', description: 'Libere uma vaga antes de aceitar.', tone: 'warning' });
      return;
    }
    setBusyId(req.connectionId);
    const res = await respond(req.connectionId, 'ACCEPTED');
    setBusyId(null);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      toast({ title: d?.error ?? 'Falha ao aceitar', tone: 'danger' });
      return;
    }
    toast({ title: 'Mentoria aceita', description: `${req.mentee.name ?? 'O mentorado'} entrou nos ativos.`, tone: 'success' });
    setRequests((list) => list.filter((x) => x.connectionId !== req.connectionId));
    setActives((list) => [
      { connectionId: req.connectionId, startedAt: new Date().toISOString(), mentee: req.mentee },
      ...list,
    ]);
  }

  async function reject(req: RequestItem) {
    setBusyId(req.connectionId);
    const res = await respond(req.connectionId, 'REJECTED');
    setBusyId(null);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      toast({ title: d?.error ?? 'Falha ao recusar', tone: 'danger' });
      return;
    }
    toast({ title: 'Solicitacao recusada', tone: 'info' });
    setRequests((list) => list.filter((x) => x.connectionId !== req.connectionId));
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'requests', label: 'Solicitacoes', count: requests.length },
    { id: 'actives', label: 'Mentorados ativos', count: actives.length },
    { id: 'waitlist', label: 'Fila de espera', count: waitlist.length },
  ];

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 className="mm-h1">Painel do mentor</h1>
        <p className="mm-body-small">Gerencie solicitacoes e mentorados.</p>
      </div>

      {/* Metricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Metric label="Mentorados ativos" value={used} />
        <Metric label="Solicitacoes" value={requests.length} />
        <Metric label="Capacidade" value={`${used}/${max}`} />
      </div>

      {/* Capacidade + alerta */}
      <div className="mm-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="mm-label">Capacidade</span>
          {full ? (
            <Badge tone="danger">Capacidade maxima</Badge>
          ) : used === max - 1 ? (
            <Badge tone="warning">Quase no limite</Badge>
          ) : (
            <Badge tone="success">Com vagas</Badge>
          )}
        </div>
        <div style={{ height: 8, borderRadius: 'var(--r-pill)', background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, ratio * 100)}%`, background: capColor, borderRadius: 'var(--r-pill)', transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)' }} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)' }}>
        {tabs.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '10px 14px',
                fontFamily: 'var(--mm-font-sans)',
                fontSize: 14,
                fontWeight: 600,
                color: on ? 'var(--text)' : 'var(--text-secondary)',
                borderBottom: on ? '2px solid var(--brand)' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              {t.label}
              {t.count > 0 && <span style={{ marginLeft: 6, color: 'var(--text-muted)' }}>({t.count})</span>}
            </button>
          );
        })}
      </div>

      {tab === 'requests' && (
        <RequestsTab requests={requests} busyId={busyId} onAccept={accept} onReject={reject} />
      )}
      {tab === 'actives' && <ActivesTab actives={actives} />}
      {tab === 'waitlist' && <WaitlistTab waitlist={waitlist} />}
    </div>
  );
}

function RequestsTab({
  requests,
  busyId,
  onAccept,
  onReject,
}: {
  requests: RequestItem[];
  busyId: string | null;
  onAccept: (r: RequestItem) => void;
  onReject: (r: RequestItem) => void;
}) {
  const reduced = useReducedMotion();
  if (requests.length === 0) {
    return <EmptyHint text="Nenhuma solicitacao pendente." />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <AnimatePresence initial={false}>
        {requests.map((req, i) => (
          <motion.div
            key={req.connectionId}
            layout={!reduced}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: EASE.entrance, delay: reduced ? 0 : i * 0.05 }}
          >
            <div className="mm-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={req.mentee.name} image={req.mentee.image} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="mm-body-strong">{req.mentee.name ?? 'Mentorado'}</p>
                  {req.mentee.headline && <p className="mm-body-small">{req.mentee.headline}</p>}
                </div>
                <span className="mm-body-small">{fmtDate(req.createdAt)}</span>
              </div>
              {req.message && (
                <p className="mm-body" style={{ background: 'var(--surface-2)', borderRadius: 'var(--r-md)', padding: 12, whiteSpace: 'pre-line' }}>
                  {req.message}
                </p>
              )}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="mm-btn mm-btn--ghost"
                  style={{ color: 'var(--danger)' }}
                  disabled={busyId === req.connectionId}
                  onClick={() => onReject(req)}
                >
                  <X size={16} />
                  Recusar
                </button>
                <button
                  type="button"
                  className="mm-btn mm-btn--secondary"
                  style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                  disabled={busyId === req.connectionId}
                  onClick={() => onAccept(req)}
                >
                  {busyId === req.connectionId ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Aceitar
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ActivesTab({ actives }: { actives: ActiveItem[] }) {
  if (actives.length === 0) return <EmptyHint text="Nenhum mentorado ativo ainda." />;
  return (
    <Stagger className="flex flex-col gap-3">
      {actives.map((a) => (
        <StaggerItem key={a.connectionId}>
          <div className="mm-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar name={a.mentee.name} image={a.mentee.image} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="mm-body-strong">{a.mentee.name ?? 'Mentorado'}</p>
              {a.mentee.headline && <p className="mm-body-small">{a.mentee.headline}</p>}
            </div>
            {a.mentee.whatsapp ? (
              <a href={a.mentee.whatsapp} target="_blank" rel="noreferrer" className="mm-btn mm-btn--primary">
                <MessageCircle size={16} />
                Conversar
              </a>
            ) : (
              <span className="mm-body-small" style={{ color: 'var(--text-muted)' }}>
                Sem WhatsApp
              </span>
            )}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function WaitlistTab({ waitlist }: { waitlist: WaitlistItem[] }) {
  if (waitlist.length === 0) return <EmptyHint text="Ninguem na fila de espera." />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {waitlist.map((e) => (
        <div key={e.id} className="mm-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--surface-2)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {e.position}
          </span>
          <div>
            <p className="mm-body-strong">{e.mentee.name ?? 'Mentorado'}</p>
            {e.mentee.headline && <p className="mm-body-small">{e.mentee.headline}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="mm-card" style={{ padding: 18 }}>
      <div className="mm-h1" style={{ color: 'var(--brand)' }}>
        {value}
      </div>
      <div className="mm-body-small">{label}</div>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="mm-body-small" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
      {text}
    </p>
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
        width: 44,
        height: 44,
        flexShrink: 0,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--brand-soft)',
        color: 'var(--brand)',
        fontWeight: 700,
        fontSize: 15,
      }}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name ?? 'Mentorado'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        initials
      )}
    </span>
  );
}
