'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Entry = {
  id: string;
  position: number;
  mentee: { id: string; name: string | null; headline: string | null } | null;
};

// Mentor's waitlist with move up/down (PATCH /waitlist) and remove (DELETE).
// No drag-and-drop lib; positions stay contiguous server-side (R7).
export function WaitlistManager({ initial }: { initial: Entry[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function reorder(next: Entry[]) {
    setBusy(true);
    setError('');
    const payload = next.map((e, i) => ({ id: e.id, position: i + 1 }));
    try {
      const res = await fetch('/api/mentormatch/waitlist', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ entries: payload }),
      });
      if (!res.ok) {
        setError('Falha ao reordenar.');
        return;
      }
      setEntries(next.map((e, i) => ({ ...e, position: i + 1 })));
    } catch {
      setError('Erro de rede.');
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= entries.length) return;
    const next = [...entries];
    [next[index], next[target]] = [next[target]!, next[index]!];
    void reorder(next);
  }

  async function remove(id: string) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/mentormatch/waitlist', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setError('Falha ao remover.');
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, position: i + 1 })));
      router.refresh();
    } catch {
      setError('Erro de rede.');
    } finally {
      setBusy(false);
    }
  }

  if (entries.length === 0) {
    return <p className="text-body-s text-graphite">Fila de espera vazia.</p>;
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-body-s text-error">{error}</p>}
      <ol className="space-y-2">
        {entries.map((e, i) => (
          <li
            key={e.id}
            className="flex items-center justify-between rounded border border-hairline bg-paper px-3 py-2"
          >
            <span className="text-body-s">
              <span className="font-mono text-mono-meta text-graphite">#{e.position}</span>{' '}
              {e.mentee?.name ?? 'Mentee'} <span className="text-graphite">{e.mentee?.headline ?? ''}</span>
            </span>
            <span className="flex items-center gap-1">
              <button type="button" disabled={busy || i === 0} onClick={() => move(i, -1)} className={btn}>
                ↑
              </button>
              <button
                type="button"
                disabled={busy || i === entries.length - 1}
                onClick={() => move(i, 1)}
                className={btn}
              >
                ↓
              </button>
              <button type="button" disabled={busy} onClick={() => void remove(e.id)} className={btn}>
                Remover
              </button>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const btn =
  'rounded border border-hairline px-2 py-1 text-body-s text-ink hover:border-ink disabled:opacity-40';
