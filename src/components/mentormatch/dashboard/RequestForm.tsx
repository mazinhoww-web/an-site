'use client';

import { useState } from 'react';

// Single request path (D-02): POST /api/mentormatch/connections. Shows whether
// a connection was created or the user was placed on the waitlist.
export function RequestForm({ mentorId }: { mentorId: string }) {
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'created' | 'waitlisted' | 'error'>('idle');
  const [error, setError] = useState('');
  const [position, setPosition] = useState<number | null>(null);

  async function submit() {
    if (message.length < 10 || message.length > 500) {
      setError('A mensagem deve ter entre 10 e 500 caracteres.');
      return;
    }
    setState('submitting');
    setError('');
    try {
      const res = await fetch('/api/mentormatch/connections', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mentorId, message }),
      });
      const data = (await res.json().catch(() => null)) as
        | { waitlisted?: boolean; position?: number; error?: string }
        | null;
      if (!res.ok) {
        setError(data?.error ?? 'Falha ao enviar a solicitacao.');
        setState('error');
        return;
      }
      if (data?.waitlisted) {
        setPosition(data.position ?? null);
        setState('waitlisted');
      } else {
        setState('created');
      }
    } catch {
      setError('Erro de rede.');
      setState('error');
    }
  }

  if (state === 'created') {
    return <p className="text-body text-success">Solicitacao enviada. Aguarde a resposta do mentor.</p>;
  }
  if (state === 'waitlisted') {
    return (
      <p className="text-body text-ink">
        Mentor lotado. Voce entrou na fila de espera{position ? ` na posicao ${position}` : ''}.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Apresente-se e diga o que busca na mentoria (10 a 500 caracteres)."
        className="w-full rounded border border-hairline bg-paper px-3 py-2 text-body text-ink outline-none focus:border-ink"
      />
      <div className="flex items-center justify-between">
        <span className="font-mono text-mono-meta text-graphite">{message.length}/500</span>
        <button
          type="button"
          disabled={state === 'submitting'}
          onClick={() => void submit()}
          className="rounded bg-ink px-6 py-2 text-body text-paper hover:bg-graphite disabled:opacity-60"
        >
          {state === 'submitting' ? 'Enviando...' : 'Enviar solicitacao'}
        </button>
      </div>
      {error && <p className="text-body-s text-error">{error}</p>}
    </div>
  );
}
