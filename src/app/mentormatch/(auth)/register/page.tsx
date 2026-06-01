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

function readQueryParam(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  return new URLSearchParams(window.location.search).get(name) ?? undefined;
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
      body: JSON.stringify({ ...values, invitationToken: readQueryParam('invitation') }),
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
    <main className="mx-auto" style={{ maxWidth: 420, padding: '80px 24px' }}>
      <h1 className="mm-h1" style={{ marginBottom: 24 }}>Criar conta</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label className="mm-field">
          <span className="mm-label">Nome</span>
          <input autoComplete="name" className="mm-input" {...register('name')} />
          {errors.name && <span className="mm-field__error">{errors.name.message}</span>}
        </label>
        <label className="mm-field">
          <span className="mm-label">Email</span>
          <input type="email" autoComplete="email" className="mm-input" {...register('email')} />
          {errors.email && <span className="mm-field__error">{errors.email.message}</span>}
        </label>
        <label className="mm-field">
          <span className="mm-label">Senha</span>
          <input type="password" autoComplete="new-password" className="mm-input" {...register('password')} />
          {errors.password && <span className="mm-field__error">{errors.password.message}</span>}
        </label>
        {error && <p className="mm-body-small" style={{ color: 'var(--danger)' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting} className="mm-btn mm-btn--primary">
          {isSubmitting ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
      <p className="mm-body-small" style={{ marginTop: 24, color: 'var(--text-secondary)' }}>
        Ja tem conta?{' '}
        <Link href="/mentormatch/login" style={{ color: 'var(--brand)' }}>
          Entrar
        </Link>
      </p>
    </main>
  );
}
