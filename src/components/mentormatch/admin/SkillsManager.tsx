'use client';

import { useCallback, useEffect, useState } from 'react';

type Skill = { id: string; name: string; category: string | null; usageCount: number; isActive: boolean };

export function SkillsManager({ tenantId }: { tenantId: string }) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mentormatch/skills?tenantId=${tenantId}`, { cache: 'no-store' });
      if (res.ok) setSkills((await res.json()) as Skill[]);
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    setError('');
    if (name.trim().length < 2) {
      setError('Nome muito curto.');
      return;
    }
    const res = await fetch(`/api/mentormatch/skills?tenantId=${tenantId}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), category: category.trim() || undefined }),
    });
    if (res.status === 409) {
      setError('Habilidade ja existe.');
      return;
    }
    if (!res.ok) {
      setError('Falha ao criar.');
      return;
    }
    setName('');
    setCategory('');
    void load();
  }

  async function toggle(skill: Skill) {
    await fetch(`/api/mentormatch/skills?id=${skill.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isActive: !skill.isActive }),
    }).catch(() => {});
    void load();
  }

  async function remove(id: string) {
    await fetch(`/api/mentormatch/skills?id=${id}`, { method: 'DELETE' }).catch(() => {});
    void load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className={input} />
        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria (opcional)" className={input} />
        <button type="button" onClick={() => void create()} className={btnPrimary}>
          Adicionar
        </button>
      </div>
      {error && <p className="text-body-s text-mm-danger">{error}</p>}
      {loading ? (
        <p className="text-body-s text-mm-muted">Carregando...</p>
      ) : (
        <ul className="space-y-2">
          {skills.map((s) => (
            <li
              key={s.id}
              className={`flex items-center justify-between rounded border border-mm-border bg-mm-card px-4 py-2 ${s.isActive ? '' : 'opacity-60'}`}
            >
              <span className="text-body-s">
                {s.name} <span className="text-mm-muted">{s.category ?? ''}</span>{' '}
                <span className="font-mono text-mono-meta text-mm-muted">uso {s.usageCount}</span>
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => void toggle(s)} className={btn}>
                  {s.isActive ? 'Desativar' : 'Ativar'}
                </button>
                <button type="button" onClick={() => void remove(s.id)} className={btn}>
                  Excluir
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const input = 'rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary';
const btn = 'rounded border border-mm-border px-3 py-1.5 text-body-s text-mm-text hover:border-mm-primary';
const btnPrimary = 'rounded bg-mm-primary px-4 py-2 text-body-s text-mm-primaryfg hover:bg-mm-primary2';
