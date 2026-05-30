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
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 font-mmdisplay text-display-m">Esqueci a senha</h1>
      {done ? (
        <p className="text-body text-mm-text">
          Se houver uma conta com esse email, enviamos um link para redefinir a senha.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block space-y-1.5">
            <span className={labelCls}>Email</span>
            <input type="email" autoComplete="email" className={inputCls} {...register('email')} />
            {errors.email && <span className="block text-body-s text-mm-danger">{errors.email.message}</span>}
          </label>
          <button type="submit" disabled={isSubmitting} className={btnCls}>
            {isSubmitting ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>
      )}
      <p className="mt-6 text-body-s text-mm-muted">
        <Link href="/mentormatch/login" className="text-mm-text underline">
          Voltar ao login
        </Link>
      </p>
    </main>
  );
}

const labelCls = 'font-mono text-mono-meta uppercase tracking-wide text-mm-muted';
const inputCls =
  'w-full rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary';
const btnCls = 'rounded bg-mm-primary px-6 py-3 font-mmdisplay text-body text-mm-primaryfg hover:bg-mm-primary2 disabled:opacity-60';
