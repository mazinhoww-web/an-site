'use client';

import { useState } from 'react';
import Link from 'next/link';

function readQueryParam(name: string): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(name) ?? '';
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');

  async function submit() {
    const token = readQueryParam('token');
    if (!token) {
      setError('Token ausente.');
      return;
    }
    if (password.length < 8) {
      setError('A senha deve ter ao menos 8 caracteres.');
      return;
    }
    setState('submitting');
    setError('');
    const res = await fetch('/api/mentormatch/auth/reset-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(d?.error ?? 'Nao foi possivel redefinir a senha.');
      setState('error');
      return;
    }
    setState('done');
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 font-heading text-display-m">Redefinir senha</h1>
      {state === 'done' ? (
        <p className="text-body text-success">
          Senha redefinida.{' '}
          <Link href="/mentormatch/login" className="text-ink underline">
            Entrar
          </Link>
        </p>
      ) : (
        <div className="space-y-5">
          <label className="block space-y-1.5">
            <span className={labelCls}>Nova senha</span>
            <input
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="text-body-s text-error">{error}</p>}
          <button type="button" disabled={state === 'submitting'} onClick={() => void submit()} className={btnCls}>
            {state === 'submitting' ? 'Salvando...' : 'Redefinir'}
          </button>
        </div>
      )}
    </main>
  );
}

const labelCls = 'font-mono text-mono-meta uppercase tracking-wide text-graphite';
const inputCls =
  'w-full rounded border border-hairline bg-paper px-3 py-2 text-body text-ink outline-none focus:border-ink';
const btnCls = 'rounded bg-ink px-6 py-3 font-heading text-body text-paper hover:bg-graphite disabled:opacity-60';
