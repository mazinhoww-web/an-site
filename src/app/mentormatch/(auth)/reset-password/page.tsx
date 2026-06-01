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
    <main className="mx-auto" style={{ maxWidth: 420, padding: '80px 24px' }}>
      <h1 className="mm-h1" style={{ marginBottom: 24 }}>Redefinir senha</h1>
      {state === 'done' ? (
        <p className="mm-body" style={{ color: 'var(--success)' }}>
          Senha redefinida.{' '}
          <Link href="/mentormatch/login" style={{ color: 'var(--brand)' }}>
            Entrar
          </Link>
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <label className="mm-field">
            <span className="mm-label">Nova senha</span>
            <input
              type="password"
              autoComplete="new-password"
              className="mm-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="mm-body-small" style={{ color: 'var(--danger)' }}>{error}</p>}
          <button type="button" disabled={state === 'submitting'} onClick={() => void submit()} className="mm-btn mm-btn--primary">
            {state === 'submitting' ? 'Salvando...' : 'Redefinir'}
          </button>
        </div>
      )}
    </main>
  );
}
