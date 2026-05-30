'use client';

import { useCallback, useEffect, useState } from 'react';

type Row = {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
  status: string;
};

const STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];

export function UsersTable({ tenantId }: { tenantId: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ tenantId });
    if (status) params.set('status', status);
    if (q.trim()) params.set('q', q.trim());
    try {
      const res = await fetch(`/api/mentormatch/admin/users?${params}`, { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setRows((await res.json()) as Row[]);
    } catch {
      setError('Falha ao carregar usuarios.');
    } finally {
      setLoading(false);
    }
  }, [tenantId, status, q]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
  }, [load]);

  async function setUserStatus(userId: string, next: string) {
    await fetch('/api/mentormatch/admin/users', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId, status: next }),
    }).catch(() => {});
    void load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome ou email"
          className={input}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={input}>
          <option value="">Todos os status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-body-s text-mm-muted">Carregando...</p>}
      {error && <p className="text-body-s text-mm-danger">{error}</p>}
      {!loading && rows.length === 0 && <p className="text-body-s text-mm-muted">Nenhum usuario.</p>}

      <ul className="space-y-2">
        {rows.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-mm-border bg-mm-card px-4 py-3"
          >
            <span className="text-body-s">
              {u.name ?? '—'} <span className="text-mm-muted">{u.email}</span>{' '}
              <span className="font-mono text-mono-meta text-mm-muted">{u.role ?? 'sem papel'}</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-mono text-mono-meta uppercase text-mm-muted">{u.status}</span>
              <select
                value={u.status}
                onChange={(e) => void setUserStatus(u.id, e.target.value)}
                className="rounded border border-mm-border px-2 py-1 text-body-s"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const input =
  'rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary';
