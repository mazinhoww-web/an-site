'use client';

import { useRef, useState } from 'react';

type Settings = {
  name: string;
  slug: string;
  brandColor: string;
  secondaryColor: string | null;
  logoUrl: string | null;
  themeKey: string;
  maxMenteesPerMentor: number;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [form, setForm] = useState<Settings>(initial);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function uploadLogo() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/mentormatch/upload', { method: 'POST', body: fd });
    if (res.ok) {
      const { url } = (await res.json()) as { url: string };
      set('logoUrl', url);
    }
  }

  async function save() {
    setState('saving');
    setError('');
    const res = await fetch('/api/mentormatch/admin/settings', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        slug: form.slug,
        name: form.name,
        brandColor: form.brandColor,
        secondaryColor: form.secondaryColor ?? undefined,
        logoUrl: form.logoUrl ?? '',
        themeKey: form.themeKey,
        maxMenteesPerMentor: form.maxMenteesPerMentor,
      }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? 'Falha ao salvar.');
      setState('error');
      return;
    }
    setState('saved');
  }

  return (
    <div className="max-w-xl space-y-5">
      <Field label="Nome do programa">
        <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} />
      </Field>
      <div className="flex gap-4">
        <Field label="Cor principal">
          <input type="color" value={form.brandColor} onChange={(e) => set('brandColor', e.target.value)} />
        </Field>
        <Field label="Cor secundaria">
          <input
            type="color"
            value={form.secondaryColor ?? '#000000'}
            onChange={(e) => set('secondaryColor', e.target.value)}
          />
        </Field>
      </div>
      <Field label="Max. mentorados por mentor">
        <input
          type="number"
          min={1}
          max={50}
          className={input}
          value={form.maxMenteesPerMentor}
          onChange={(e) => set('maxMenteesPerMentor', Number(e.target.value))}
        />
      </Field>
      <Field label="Logo">
        <div className="flex items-center gap-3">
          <input ref={fileRef} type="file" accept="image/*" className="text-body-s" onChange={() => void uploadLogo()} />
          {form.logoUrl && <span className="text-body-s text-graphite">enviado</span>}
        </div>
      </Field>
      {error && <p className="text-body-s text-error">{error}</p>}
      {state === 'saved' && <p className="text-body-s text-success">Salvo.</p>}
      <button type="button" disabled={state === 'saving'} onClick={() => void save()} className={btnPrimary}>
        {state === 'saving' ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-mono-meta uppercase tracking-wide text-graphite">{label}</span>
      {children}
    </label>
  );
}

const input = 'w-full rounded border border-hairline bg-paper px-3 py-2 text-body text-ink outline-none focus:border-ink';
const btnPrimary = 'rounded bg-ink px-6 py-2 text-body text-paper hover:bg-graphite disabled:opacity-60';
