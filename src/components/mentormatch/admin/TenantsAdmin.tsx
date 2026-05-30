'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

type Row = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  planName: string | null;
  users: number;
  mentors: number;
  activeConnections: number;
};
type Overview = { totals: { tenants: number; users: number; activeConnections: number }; tenants: Row[] };
type Plan = { id: string; name: string };

export function TenantsAdmin({ initial, plans }: { initial: Overview; plans: Plan[] }) {
  const [data, setData] = useState<Overview>(initial);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [brandColor, setBrandColor] = useState('#6366f1');
  const [planId, setPlanId] = useState(plans[0]?.id ?? '');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/mentormatch/admin/tenants', { cache: 'no-store' });
    if (res.ok) setData((await res.json()) as Overview);
  }, []);

  useEffect(() => {
    // keep the SSR snapshot but pick up changes done elsewhere
    void refresh();
  }, [refresh]);

  async function create() {
    setError('');
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setError('Slug invalido (use a-z, 0-9, -).');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/mentormatch/admin/tenants', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name, slug, brandColor, planId }),
      });
      if (res.status === 409) {
        setError('Slug ja existe.');
        return;
      }
      if (!res.ok) {
        const d = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(d?.error ?? 'Falha ao criar.');
        return;
      }
      setName('');
      setSlug('');
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function toggleActive(t: Row) {
    await fetch('/api/mentormatch/admin/tenants', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: t.id, active: !t.active }),
    }).catch(() => {});
    void refresh();
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Tenants" value={data.totals.tenants} />
        <Stat label="Usuarios" value={data.totals.users} />
        <Stat label="Conexoes ativas" value={data.totals.activeConnections} />
      </section>

      <section className="space-y-4">
        <h2 className="font-mmdisplay text-h2">Criar tenant</h2>
        <div className="flex flex-wrap items-end gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className={input} />
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" className={input} />
          <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} />
          <select value={planId} onChange={(e) => setPlanId(e.target.value)} className={input}>
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="button" disabled={busy} onClick={() => void create()} className={btnPrimary}>
            {busy ? 'Criando...' : 'Criar'}
          </button>
        </div>
        {error && <p className="text-body-s text-mm-danger">{error}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="font-mmdisplay text-h2">Tenants</h2>
        <ul className="space-y-2">
          {data.tenants.map((t) => (
            <li
              key={t.id}
              className={`flex flex-wrap items-center justify-between gap-2 rounded border border-mm-border bg-mm-card px-4 py-3 ${t.active ? '' : 'opacity-60'}`}
            >
              <span className="text-body-s">
                <strong>{t.name}</strong> <span className="font-mono text-mono-meta text-mm-muted">/{t.slug}</span>{' '}
                <span className="text-mm-muted">{t.planName ?? 'sem plano'}</span> · {t.users} users · {t.mentors} mentores ·{' '}
                {t.activeConnections} ativas
              </span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-mono-meta uppercase text-mm-muted">{t.active ? 'ativo' : 'inativo'}</span>
                <button type="button" onClick={() => void toggleActive(t)} className={btn}>
                  {t.active ? 'Desativar' : 'Ativar'}
                </button>
                <Link href={`/mentormatch/t/${t.slug}/admin/users`} className={btn}>
                  Entrar como admin
                </Link>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-mm-border bg-mm-card p-5">
      <p className="font-mmdisplay text-display-m">{value}</p>
      <p className="font-mono text-mono-meta uppercase tracking-wide text-mm-muted">{label}</p>
    </div>
  );
}

const input = 'rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary';
const btn = 'rounded border border-mm-border px-3 py-1.5 text-body-s text-mm-text hover:border-mm-primary';
const btnPrimary = 'rounded bg-mm-primary px-4 py-2 text-body-s text-mm-primaryfg hover:bg-mm-primary2 disabled:opacity-60';
