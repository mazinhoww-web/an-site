'use client';

import { Button } from '@/mentormatch/design-system';
import { Badge } from '@/mentormatch/design-system';
import { capacityOf, type MatchMentor } from './types';

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
        width: 64,
        height: 64,
        flexShrink: 0,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--brand-soft)',
        color: 'var(--brand)',
        fontWeight: 700,
        fontSize: 20,
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

export function MentorCard({ mentor, onView }: { mentor: MatchMentor; onView: () => void }) {
  const cap = capacityOf(mentor);
  const visibleSkills = mentor.skills.slice(0, 3);
  const extra = mentor.skills.length - visibleSkills.length;

  return (
    <div
      className="mm-card mm-card--interactive"
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
          <Avatar name={mentor.name} image={mentor.image} />
          <div style={{ minWidth: 0 }}>
            <h3 className="mm-h3" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {mentor.name ?? 'Mentor'}
            </h3>
            {mentor.headline && (
              <p className="mm-body-small" style={{ marginTop: 2 }}>
                {mentor.headline}
              </p>
            )}
          </div>
        </div>
        <Badge tone={cap.full ? 'danger' : 'success'}>{cap.full ? 'Lotado' : 'Disponivel'}</Badge>
      </div>

      {visibleSkills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {visibleSkills.map((s) => (
            <span key={s} className="mm-chip">
              {s}
            </span>
          ))}
          {extra > 0 && <span className="mm-chip">+{extra}</span>}
        </div>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="mm-body-small">Mentorados</span>
          <span className="mm-body-small mm-mono" style={{ color: 'var(--text)' }}>
            {cap.used}/{cap.max}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 'var(--r-pill)', background: 'var(--surface-2)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, cap.ratio * 100)}%`,
              background: cap.color,
              borderRadius: 'var(--r-pill)',
              transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>
      </div>

      <Button onClick={onView} style={{ width: '100%' }}>
        Ver perfil
      </Button>
    </div>
  );
}
