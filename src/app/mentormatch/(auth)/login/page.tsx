'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mmLoginSchema, type MmLoginInput } from '@/lib/mentormatch/validators';

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : undefined;
}

export default function MmLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MmLoginInput>({ resolver: zodResolver(mmLoginSchema) });

  async function onSubmit(values: MmLoginInput) {
    setError('');
    const res = await signIn('credentials', {
      ...values,
      tenantSlug: readCookie('mm-tenant'),
      redirect: false,
    });
    if (!res || res.error) {
      setError('Credenciais invalidas.');
      return;
    }
    router.push('/mentormatch/continue');
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 font-mmdisplay text-display-m">Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="block space-y-1.5">
          <span className={labelCls}>Email</span>
          <input type="email" autoComplete="email" className={inputCls} {...register('email')} />
          {errors.email && <span className="block text-body-s text-mm-danger">{errors.email.message}</span>}
        </label>
        <label className="block space-y-1.5">
          <span className={labelCls}>Senha</span>
          <input type="password" autoComplete="current-password" className={inputCls} {...register('password')} />
          {errors.password && <span className="block text-body-s text-mm-danger">{errors.password.message}</span>}
        </label>
        {error && <p className="text-body-s text-mm-danger">{error}</p>}
        <button type="submit" disabled={isSubmitting} className={btnCls}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mt-6 text-body-s text-mm-muted">
        Nao tem conta?{' '}
        <Link href="/mentormatch/register" className="text-mm-text underline">
          Criar conta
        </Link>
      </p>
      <p className="mt-2 text-body-s text-mm-muted">
        <Link href="/mentormatch/forgot-password" className="text-mm-text underline">
          Esqueci a senha
        </Link>
      </p>
    </main>
  );
}

const labelCls = 'font-mono text-mono-meta uppercase tracking-wide text-mm-muted';
const inputCls =
  'w-full rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary';
const btnCls =
  'rounded bg-mm-primary px-6 py-3 font-mmdisplay text-body text-mm-primaryfg transition hover:bg-mm-primary2 disabled:opacity-60';
