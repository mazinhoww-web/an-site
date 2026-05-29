'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mmRegisterSchema, type MmRegisterInput } from '@/lib/mentormatch/validators';

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : undefined;
}

export default function MmRegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MmRegisterInput>({ resolver: zodResolver(mmRegisterSchema) });

  async function onSubmit(values: MmRegisterInput) {
    setError('');
    const res = await fetch('/api/mentormatch/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.status === 409) {
      setError('Este email ja esta cadastrado.');
      return;
    }
    if (!res.ok) {
      setError('Nao foi possivel criar a conta.');
      return;
    }
    // Auto sign-in, then dispatch.
    const signRes = await signIn('credentials', {
      email: values.email,
      password: values.password,
      tenantSlug: readCookie('mm-tenant'),
      redirect: false,
    });
    if (!signRes || signRes.error) {
      router.push('/mentormatch/login');
      return;
    }
    router.push('/mentormatch/continue');
  }

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-6 font-heading text-display-m">Criar conta</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <label className="block space-y-1.5">
          <span className={labelCls}>Nome</span>
          <input autoComplete="name" className={inputCls} {...register('name')} />
          {errors.name && <span className="block text-body-s text-error">{errors.name.message}</span>}
        </label>
        <label className="block space-y-1.5">
          <span className={labelCls}>Email</span>
          <input type="email" autoComplete="email" className={inputCls} {...register('email')} />
          {errors.email && <span className="block text-body-s text-error">{errors.email.message}</span>}
        </label>
        <label className="block space-y-1.5">
          <span className={labelCls}>Senha</span>
          <input type="password" autoComplete="new-password" className={inputCls} {...register('password')} />
          {errors.password && <span className="block text-body-s text-error">{errors.password.message}</span>}
        </label>
        {error && <p className="text-body-s text-error">{error}</p>}
        <button type="submit" disabled={isSubmitting} className={btnCls}>
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
      <p className="mt-6 text-body-s text-graphite">
        Ja tem conta?{' '}
        <Link href="/mentormatch/login" className="text-ink underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}

const labelCls = 'font-mono text-mono-meta uppercase tracking-wide text-graphite';
const inputCls =
  'w-full rounded border border-hairline bg-paper px-3 py-2 text-body text-ink outline-none focus:border-ink';
const btnCls =
  'rounded bg-ink px-6 py-3 font-heading text-body text-paper transition hover:bg-graphite disabled:opacity-60';
