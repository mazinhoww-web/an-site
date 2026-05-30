'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Accept/Reject buttons for a pending request. Mutates ONLY via the connections
// API (D-01/D-02) — no server actions.
export function RequestActions({ connectionId }: { connectionId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function respond(status: 'ACCEPTED' | 'REJECTED') {
    setPending(true);
    setError('');
    try {
      const res = await fetch('/api/mentormatch/connections', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ connectionId, status }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? 'Falha ao responder.');
        setPending(false);
        return;
      }
      router.refresh();
    } catch {
      setError('Erro de rede.');
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => respond('ACCEPTED')}
        className="rounded bg-mm-primary px-4 py-1.5 text-body-s text-mm-primaryfg hover:bg-mm-primary2 disabled:opacity-60"
      >
        Aceitar
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => respond('REJECTED')}
        className="rounded border border-mm-border px-4 py-1.5 text-body-s text-mm-text hover:border-mm-primary disabled:opacity-60"
      >
        Recusar
      </button>
      {error && <span className="text-body-s text-mm-danger">{error}</span>}
    </div>
  );
}
