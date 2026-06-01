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
    <div className="flex items-center" style={{ gap: 8 }}>
      <button
        type="button"
        disabled={pending}
        onClick={() => respond('ACCEPTED')}
        className="mm-btn mm-btn--primary"
      >
        Aceitar
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => respond('REJECTED')}
        className="mm-btn mm-btn--secondary"
      >
        Recusar
      </button>
      {error && (
        <span className="mm-body-small" style={{ color: 'var(--danger)' }}>
          {error}
        </span>
      )}
    </div>
  );
}
