'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { subscribeNewsletter } from '@/server-actions/subscribers';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function NewsletterForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    const fd = new FormData(e.currentTarget);
    const result = await subscribeNewsletter(fd);

    if (result.success) {
      setState('success');
    } else {
      setErrorMsg(result.error ?? 'Erro ao registrar');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="mt-8 flex items-center gap-3">
        <CheckCircle size={20} strokeWidth={1.5} className="text-lime" />
        <p className="text-body text-bone">Inscrito. Você receberá um email de confirmação.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        name="email"
        required
        placeholder="seu@email.com"
        disabled={state === 'submitting'}
        className="flex-1 border border-hairline/20 bg-transparent px-4 py-3 text-body text-bone placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="inline-flex items-center justify-center gap-2 bg-lime px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
      >
        {state === 'submitting' ? (
          <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
        ) : (
          <>
            INSCREVER
            <Send size={14} strokeWidth={1.5} />
          </>
        )}
      </button>
      {state === 'error' && (
        <p className="text-body-s text-error sm:hidden">{errorMsg}</p>
      )}
    </form>
  );
}
