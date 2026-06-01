'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { mmForgotPasswordSchema, type MmForgotPasswordInput } from '@/lib/mentormatch/validators';

export default function ForgotPasswordPage() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MmForgotPasswordInput>({ resolver: zodResolver(mmForgotPasswordSchema) });

  async function onSubmit(values: MmForgotPasswordInput) {
    // Always succeeds (server never reveals existence).
    await fetch('/api/mentormatch/auth/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(values),
    }).catch(() => {});
    setDone(true);
  }

  return (
    <main className="mx-auto" style={{ maxWidth: 420, padding: '80px 24px' }}>
      <h1 className="mm-h1" style={{ marginBottom: 24 }}>Esqueci a senha</h1>
      {done ? (
        <p className="mm-body">
          Se houver uma conta com esse email, enviamos um link para redefinir a senha.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <label className="mm-field">
            <span className="mm-label">Email</span>
            <input type="email" autoComplete="email" className="mm-input" {...register('email')} />
            {errors.email && <span className="mm-field__error">{errors.email.message}</span>}
          </label>
          <button type="submit" disabled={isSubmitting} className="mm-btn mm-btn--primary">
            {isSubmitting ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
      )}
      <p className="mm-body-small" style={{ marginTop: 24, color: 'var(--text-secondary)' }}>
        <Link href="/mentormatch/login" style={{ color: 'var(--brand)' }}>
          Voltar ao login
        </Link>
      </p>
    </main>
  );
}
