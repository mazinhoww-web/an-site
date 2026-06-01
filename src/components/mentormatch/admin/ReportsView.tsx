'use client';

import { useEffect, useState } from 'react';
import { MentorMatchThemeRoot, Reveal, Stagger, StaggerItem } from '@/mentormatch/design-system';

type Reports = {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  activeConnections: number;
  connectionsByMonth: { month: string; count: number }[];
  acceptanceRate: number;
  topSkills: { name: string; count: number }[];
};

interface Props {
  tenantId: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

export function ReportsView(props: Props) {
  return (
    <MentorMatchThemeRoot brand={props.brandColor} theme={props.theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <Inner tenantId={props.tenantId} />
    </MentorMatchThemeRoot>
  );
}

function Inner({ tenantId }: { tenantId: string }) {
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

  if (state === 'loading') return <p className="mm-body-small">Carregando...</p>;
  if (state === 'error' || !data)
    return (
      <p className="mm-field__error" role="alert">
        Falha ao carregar relatorios.
      </p>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <Reveal>
        <h1 className="mm-h1">Relatorios</h1>
        <p className="mm-body-small">Indicadores do programa.</p>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        <Stat label="Usuarios" value={data.totalUsers} />
        <Stat label="Mentores" value={data.totalMentors} />
        <Stat label="Mentorados" value={data.totalMentees} />
        <Stat label="Conexoes ativas" value={data.activeConnections} />
      </Stagger>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 className="mm-h3">Conexoes por mes</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data.connectionsByMonth.map((m) => (
            <span key={m.month} className="mm-chip">
              <span className="mm-mono" style={{ color: 'var(--text-muted)' }}>{m.month}</span> · {m.count}
            </span>
          ))}
        </div>
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 className="mm-h3">Top habilidades</h2>
        {data.topSkills.length === 0 ? (
          <p className="mm-body-small" style={{ color: 'var(--text-muted)' }}>
            Sem dados.
          </p>
        ) : (
          data.topSkills.map((s) => (
            <p key={s.name} className="mm-body">
              {s.name} <span className="mm-body-small">· {s.count}</span>
            </p>
          ))
        )}
      </section>

      <p className="mm-body-small">Taxa de aceite: {data.acceptanceRate}%</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <StaggerItem>
      <div className="mm-card" style={{ padding: 22 }}>
        <div className="mm-h1" style={{ color: 'var(--brand)', lineHeight: 1.1 }}>
          {value}
        </div>
        <div className="mm-label" style={{ marginTop: 6 }}>
          {label}
        </div>
      </div>
    </StaggerItem>
  );
}
