'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Input, MentorMatchThemeRoot, Reveal, ToastProvider, useToast } from '@/mentormatch/design-system';

type Invite = { id: string; email: string; role: string; used: boolean; expired: boolean };

interface Props {
  tenantId: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

const ROLE_LABEL: Record<string, string> = { MENTEE: 'Mentorado', MENTOR: 'Mentor', ADMIN: 'Admin' };

export function InvitationsManager(props: Props) {
  return (
    <MentorMatchThemeRoot brand={props.brandColor} theme={props.theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <ToastProvider>
        <Inner tenantId={props.tenantId} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function Inner({ tenantId }: { tenantId: string }) {
  const { toast } = useToast();
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MENTEE');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(`/api/mentormatch/invitations?tenantId=${tenantId}`, { cache: 'no-store' });
    if (res.ok) setInvites((await res.json()) as Invite[]);
  }, [tenantId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    setError('');
    const res = await fetch('/api/mentormatch/invitations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, role, tenantId }),
    });
    if (res.status === 409) {
      setError('Ja existe um convite pendente para este email.');
      return;
    }
    if (!res.ok) {
      setError('Falha ao convidar.');
      return;
    }
    setEmail('');
    toast({ title: 'Convite enviado', description: email, tone: 'success' });
    void load();
  }

  async function revoke(id: string) {
    await fetch(`/api/mentormatch/invitations?id=${id}`, { method: 'DELETE' }).catch(() => {});
    toast({ title: 'Convite revogado', tone: 'info' });
    void load();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <Reveal>
        <h1 className="mm-h1">Convites</h1>
        <p className="mm-body-small">Convide membros para o programa.</p>
      </Reveal>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 10 }}>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@empresa.com" style={{ maxWidth: 260 }} />
        <select className="mm-input" value={role} onChange={(e) => setRole(e.target.value)} style={{ maxWidth: 160 }}>
          <option value="MENTEE">Mentorado</option>
          <option value="MENTOR">Mentor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <Button onClick={() => void create()}>Convidar</Button>
      </div>
      {error && (
        <p className="mm-field__error" role="alert">
          {error}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {invites.length === 0 && (
          <p className="mm-body-small" style={{ color: 'var(--text-muted)' }}>
            Nenhum convite.
          </p>
        )}
        {invites.map((i) => (
          <div key={i.id} className="mm-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span className="mm-body-strong">{i.email}</span>{' '}
              <span className="mm-body-small">{ROLE_LABEL[i.role] ?? i.role}</span>
            </div>
            {i.used ? (
              <Badge tone="success">Usado</Badge>
            ) : i.expired ? (
              <Badge tone="danger">Expirado</Badge>
            ) : (
              <Badge tone="warning">Pendente</Badge>
            )}
            <Button variant="ghost" onClick={() => void revoke(i.id)} style={{ height: 32, padding: '0 12px', fontSize: 13, color: 'var(--danger)' }}>
              Revogar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
