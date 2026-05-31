'use client';

import { Search, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  EmptyState,
  MentorMatchThemeRoot,
  Skeleton,
  Stagger,
  StaggerItem,
} from '@/mentormatch/design-system';
import { MentorCard } from './MentorCard';
import type { MatchMentor, SkillOption } from './types';

const PAGE_SIZE = 12;
const GRID_CLASS = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 min-[1440px]:grid-cols-4';

interface MatchGridProps {
  slug: string;
  tenantId: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
  skills: SkillOption[];
}

export function MatchGrid({ slug, tenantId, brandColor, theme = 'light', skills }: MatchGridProps) {
  return (
    <MentorMatchThemeRoot brand={brandColor} theme={theme} style={{ minHeight: '100%' }}>
      <MatchGridInner slug={slug} tenantId={tenantId} skills={skills} />
    </MentorMatchThemeRoot>
  );
}

function MatchGridInner({ slug, tenantId, skills }: { slug: string; tenantId: string; skills: SkillOption[] }) {
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState('');
  const [area, setArea] = useState('');
  const [avail, setAvail] = useState<'all' | 'available' | 'full'>('all');
  const [page, setPage] = useState(1);

  const [mentors, setMentors] = useState<MatchMentor[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [scrolled, setScrolled] = useState(false);

  // Server-side filters: q (debounced) + skill.
  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams({ tenantId });
      if (q.trim()) params.set('q', q.trim());
      if (skill) params.set('skill', skill);
      setState('loading');
      fetch(`/api/mentormatch/mentors?${params.toString()}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('fetch'))))
        .then((data: MatchMentor[]) => {
          setMentors(data);
          setState('ok');
        })
        .catch(() => setState('error'));
    }, 300);
    return () => clearTimeout(handle);
  }, [q, skill, tenantId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reset para a primeira pagina quando qualquer filtro muda.
  useEffect(() => {
    setPage(1);
  }, [q, skill, area, avail]);

  const areas = useMemo(
    () => [...new Set(mentors.map((m) => m.department).filter((d): d is string => Boolean(d)))].sort(),
    [mentors],
  );

  // Filtros client-side: area (department) + disponibilidade.
  const filtered = useMemo(
    () =>
      mentors.filter((m) => {
        if (area && m.department !== area) return false;
        const full = m.activeConnections >= Math.max(1, m.maxMentees);
        if (avail === 'available' && full) return false;
        if (avail === 'full' && !full) return false;
        return true;
      }),
    [mentors, area, avail],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function clearFilters() {
    setQ('');
    setSkill('');
    setArea('');
    setAvail('all');
  }

  const selectStyle = { minWidth: 150 } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--surface)',
          borderRadius: 'var(--r-md)',
          padding: 12,
          boxShadow: scrolled ? 'var(--shadow-xs)' : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-muted)' }} />
            <input
              className="mm-input"
              style={{ paddingLeft: 36 }}
              placeholder="Buscar por nome, cargo ou bio"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <select className="mm-input" style={selectStyle} value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Todas as areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <select className="mm-input" style={selectStyle} value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="">Todas as habilidades</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            className="mm-input"
            style={selectStyle}
            value={avail}
            onChange={(e) => setAvail(e.target.value as 'all' | 'available' | 'full')}
          >
            <option value="all">Qualquer disponibilidade</option>
            <option value="available">Disponiveis</option>
            <option value="full">Lotados</option>
          </select>
        </div>
      </div>

      {state === 'loading' && (
        <div className={GRID_CLASS}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="mm-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Skeleton width={64} height={64} radius="50%" />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
                  <Skeleton width="50%" height={12} />
                </div>
              </div>
              <Skeleton height={20} />
              <Skeleton height={6} radius="var(--r-pill)" />
              <Skeleton height={44} radius="var(--r-md)" />
            </div>
          ))}
        </div>
      )}

      {state === 'error' && (
        <EmptyState
          icon={<Users size={40} />}
          title="Falha ao carregar mentores"
          description="Tente novamente em instantes."
          action={{ label: 'Recarregar', onClick: () => setQ((v) => v) }}
        />
      )}

      {state === 'ok' && filtered.length === 0 && (
        <EmptyState
          icon={<Users size={40} />}
          title="Nenhum mentor encontrado"
          description="Ajuste a busca ou os filtros para ver mais mentores."
          action={{ label: 'Limpar filtros', onClick: clearFilters }}
        />
      )}

      {state === 'ok' && filtered.length > 0 && (
        <>
          <Stagger key={`${page}-${q}-${skill}-${area}-${avail}`} className={GRID_CLASS}>
            {visible.map((m) => (
              <StaggerItem key={m.id}>
                <MentorCard mentor={m} href={`/mentormatch/t/${slug}/mentors/${m.id}`} />
              </StaggerItem>
            ))}
          </Stagger>

          {pageCount > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Button variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Anterior
              </Button>
              <span className="mm-body-small">
                Pagina {page} de {pageCount}
              </span>
              <Button variant="ghost" disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
                Proxima
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
