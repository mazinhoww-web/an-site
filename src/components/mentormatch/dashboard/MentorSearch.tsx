'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Mentor = {
  id: string;
  name: string | null;
  headline: string | null;
  bio: string | null;
  image: string | null;
  skills: string[];
  activeConnections: number;
};

type SkillOption = { id: string; name: string };

// Debounced (300ms) mentor search hitting GET /api/mentormatch/mentors.
export function MentorSearch({
  slug,
  tenantId,
  skills,
}: {
  slug: string;
  tenantId: string;
  skills: SkillOption[];
}) {
  const [q, setQ] = useState('');
  const [skill, setSkill] = useState('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams({ tenantId });
      if (q.trim()) params.set('q', q.trim());
      if (skill) params.set('skill', skill);
      setState('loading');
      fetch(`/api/mentormatch/mentors?${params.toString()}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error('fetch'))))
        .then((data: Mentor[]) => {
          setMentors(data);
          setState('ok');
        })
        .catch(() => setState('error'));
    }, 300);
    return () => clearTimeout(handle);
  }, [q, skill, tenantId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nome, headline ou bio"
          className="min-w-64 flex-1 rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary"
        />
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary"
        >
          <option value="">Todas as habilidades</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {state === 'loading' && <p className="text-body-s text-mm-muted">Carregando...</p>}
      {state === 'error' && <p className="text-body-s text-mm-danger">Falha ao buscar mentores.</p>}
      {state === 'ok' && mentors.length === 0 && (
        <p className="text-body-s text-mm-muted">Nenhum mentor encontrado.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {mentors.map((m) => (
          <article key={m.id} className="rounded border border-mm-border bg-mm-card p-5">
            <h3 className="font-mmdisplay text-h3">{m.name ?? 'Mentor'}</h3>
            {m.headline && <p className="text-body-s text-mm-muted">{m.headline}</p>}
            {m.bio && <p className="mt-2 line-clamp-3 text-body-s text-mm-text">{m.bio}</p>}
            {m.skills.length > 0 && (
              <p className="mt-3 flex flex-wrap gap-1">
                {m.skills.map((s) => (
                  <span key={s} className="rounded border border-mm-border px-2 py-0.5 text-mono-meta text-mm-muted">
                    {s}
                  </span>
                ))}
              </p>
            )}
            <p className="mt-3 font-mono text-mono-meta text-mm-muted">
              {m.activeConnections} conexao(oes) ativa(s)
            </p>
            <Link
              href={`/mentormatch/t/${slug}/confirm/${m.id}`}
              className="mt-4 inline-block rounded bg-mm-primary px-4 py-1.5 text-body-s text-mm-primaryfg hover:bg-mm-primary2"
            >
              Solicitar
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
