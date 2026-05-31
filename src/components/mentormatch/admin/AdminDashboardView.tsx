'use client';

import { CheckCircle2, Clock, Download, Send, UserCheck, Users, UserX, type LucideIcon } from 'lucide-react';
import { MentorMatchThemeRoot, Reveal, Stagger, StaggerItem } from '@/mentormatch/design-system';

type MetricKey =
  | 'activeUsers'
  | 'requestsSent'
  | 'matchesAccepted'
  | 'mentorsAvailable'
  | 'mentorsFull'
  | 'waitlist';

const ICON: Record<MetricKey, LucideIcon> = {
  activeUsers: Users,
  requestsSent: Send,
  matchesAccepted: CheckCircle2,
  mentorsAvailable: UserCheck,
  mentorsFull: UserX,
  waitlist: Clock,
};

export interface AdminMetric {
  key: MetricKey;
  label: string;
  value: number;
}

interface Props {
  tenantId: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
  metrics: AdminMetric[];
}

export function AdminDashboardView({ tenantId, brandColor, theme = 'light', metrics }: Props) {
  const exports: { type: string; label: string }[] = [
    { type: 'users', label: 'Usuarios' },
    { type: 'connections', label: 'Conexoes' },
    { type: 'skills', label: 'Skills' },
  ];

  return (
    <MentorMatchThemeRoot brand={brandColor} theme={theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <Reveal>
        <h1 className="mm-h1">Painel do programa</h1>
        <p className="mm-body-small">Visao geral da mentoria neste tenant.</p>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-6 lg:grid-cols-4" >
        {metrics.map((m) => {
          const Icon = ICON[m.key];
          return (
            <StaggerItem key={m.key}>
              <div
                className="mm-card"
                style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                <Icon size={24} color="var(--brand)" />
                <div className="mm-h1" style={{ lineHeight: 1.1 }}>
                  {m.value}
                </div>
                <div className="mm-body-small">{m.label}</div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="mm-card" style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <span className="mm-label" style={{ marginRight: 'auto' }}>
          Exportar dados (CSV)
        </span>
        {exports.map((e) => (
          <a
            key={e.type}
            href={`/api/mentormatch/admin/export?type=${e.type}&tenantId=${tenantId}`}
            className="mm-btn mm-btn--secondary"
          >
            <Download size={16} />
            {e.label}
          </a>
        ))}
      </div>
    </MentorMatchThemeRoot>
  );
}
