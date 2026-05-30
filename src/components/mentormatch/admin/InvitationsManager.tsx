'use client';

import { useCallback, useEffect, useState } from 'react';

type Invite = { id: string; email: string; role: string; used: boolean; expired: boolean };

export function InvitationsManager({ tenantId }: { tenantId: string }) {
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
    void load();
  }

  async function revoke(id: string) {
    await fetch(`/api/mentormatch/invitations?id=${id}`, { method: 'DELETE' }).catch(() => {});
    void load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@empresa.com"
          className={input}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className={input}>
          <option value="MENTEE">Mentorado</option>
          <option value="MENTOR">Mentor</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="button" onClick={() => void create()} className={btnPrimary}>
          Convidar
        </button>
      </div>
      {error && <p className="text-body-s text-mm-danger">{error}</p>}
      <ul className="space-y-2">
        {invites.length === 0 && <li className="text-body-s text-mm-muted">Nenhum convite.</li>}
        {invites.map((i) => (
          <li key={i.id} className="flex items-center justify-between rounded border border-mm-border bg-mm-card px-4 py-2">
            <span className="text-body-s">
              {i.email} <span className="font-mono text-mono-meta text-mm-muted">{i.role}</span>{' '}
              <span className="text-mm-muted">{i.used ? 'usado' : i.expired ? 'expirado' : 'pendente'}</span>
            </span>
            <button type="button" onClick={() => void revoke(i.id)} className={btn}>
              Revogar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const input = 'rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary';
const btn = 'rounded border border-mm-border px-3 py-1.5 text-body-s text-mm-text hover:border-mm-primary';
const btnPrimary = 'rounded bg-mm-primary px-4 py-2 text-body-s text-mm-primaryfg hover:bg-mm-primary2';
