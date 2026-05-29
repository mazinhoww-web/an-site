'use client';

import { useEffect, useState } from 'react';

type Reports = {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  activeConnections: number;
  connectionsByMonth: { month: string; count: number }[];
  acceptanceRate: number;
  topSkills: { name: string; count: number }[];
};

export function ReportsView({ tenantId }: { tenantId: string }) {
  const [data, setData] = useState<Reports | null>(null);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    fetch(`/api/mentormatch/admin/reports?tenantId=${tenantId}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error())))
      .then((d: Reports) => {
        setData(d);
        setState('ok');
      })
      .catch(() => setState('error'));
  }, [tenantId]);

  if (state === 'loading') return <p className="text-body-s text-graphite">Carregando...</p>;
  if (state === 'error' || !data) return <p className="text-body-s text-error">Falha ao carregar relatorios.</p>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Usuarios" value={data.totalUsers} />
        <Stat label="Mentores" value={data.totalMentors} />
        <Stat label="Mentorados" value={data.totalMentees} />
        <Stat label="Conexoes ativas" value={data.activeConnections} />
      </div>

      <section className="space-y-2">
        <h2 className="font-heading text-h3">Conexoes por mes</h2>
        <ul className="flex flex-wrap gap-3">
          {data.connectionsByMonth.map((m) => (
            <li key={m.month} className="rounded border border-hairline bg-paper px-3 py-2 text-body-s">
              <span className="font-mono text-mono-meta text-graphite">{m.month}</span> · {m.count}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-heading text-h3">Top habilidades</h2>
        {data.topSkills.length === 0 ? (
          <p className="text-body-s text-graphite">Sem dados.</p>
        ) : (
          <ul className="space-y-1">
            {data.topSkills.map((s) => (
              <li key={s.name} className="text-body-s">
                {s.name} <span className="text-graphite">· {s.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-body-s text-graphite">Taxa de aceite: {data.acceptanceRate}%</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-hairline bg-paper p-5">
      <p className="font-heading text-display-m">{value}</p>
      <p className="font-mono text-mono-meta uppercase tracking-wide text-graphite">{label}</p>
    </div>
  );
}
