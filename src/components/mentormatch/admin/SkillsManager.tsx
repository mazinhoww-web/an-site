'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button, Input, MentorMatchThemeRoot, Reveal, ToastProvider, useToast } from '@/mentormatch/design-system';

type Skill = { id: string; name: string; category: string | null; usageCount: number; isActive: boolean };

interface Props {
  tenantId: string;
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

export function SkillsManager(props: Props) {
  return (
    <MentorMatchThemeRoot brand={props.brandColor} theme={props.theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <ToastProvider>
        <Inner tenantId={props.tenantId} />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function Inner({ tenantId }: { tenantId: string }) {
  const { toast } = useToast();
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
    toast({ title: 'Habilidade adicionada', tone: 'success' });
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
    toast({ title: 'Habilidade removida', tone: 'info' });
    void load();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <Reveal>
        <h1 className="mm-h1">Habilidades</h1>
        <p className="mm-body-small">Catalogo de skills do tenant.</p>
      </Reveal>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 10 }}>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" style={{ maxWidth: 220 }} />
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria (opcional)" style={{ maxWidth: 220 }} />
        <Button onClick={() => void create()}>Adicionar</Button>
      </div>
      {error && (
        <p className="mm-field__error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mm-body-small">Carregando...</p>
      ) : skills.length === 0 ? (
        <p className="mm-body-small" style={{ color: 'var(--text-muted)' }}>
          Nenhuma habilidade ainda.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {skills.map((s) => (
            <div
              key={s.id}
              className="mm-card"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', opacity: s.isActive ? 1 : 0.6 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="mm-body-strong">{s.name}</span>{' '}
                {s.category && <span className="mm-body-small">{s.category}</span>}
              </div>
              <span className="mm-body-small mm-mono" style={{ color: 'var(--text-muted)' }}>
                uso {s.usageCount}
              </span>
              {s.isActive ? <Badge tone="success">Ativa</Badge> : <Badge tone="warning">Inativa</Badge>}
              <Button variant="ghost" onClick={() => void toggle(s)} style={{ height: 32, padding: '0 12px', fontSize: 13 }}>
                {s.isActive ? 'Desativar' : 'Ativar'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => void remove(s.id)}
                style={{ height: 32, padding: '0 12px', fontSize: 13, color: 'var(--danger)' }}
              >
                Excluir
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
