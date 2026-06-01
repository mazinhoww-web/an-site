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
    <main className="mx-auto" style={{ maxWidth: 420, padding: '80px 24px' }}>
      <h1 className="mm-h1" style={{ marginBottom: 24 }}>Entrar</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label className="mm-field">
          <span className="mm-label">Email</span>
          <input type="email" autoComplete="email" className="mm-input" {...register('email')} />
          {errors.email && <span className="mm-field__error">{errors.email.message}</span>}
        </label>
        <label className="mm-field">
          <span className="mm-label">Senha</span>
          <input type="password" autoComplete="current-password" className="mm-input" {...register('password')} />
          {errors.password && <span className="mm-field__error">{errors.password.message}</span>}
        </label>
        {error && <p className="mm-body-small" style={{ color: 'var(--danger)' }}>{error}</p>}
        <button type="submit" disabled={isSubmitting} className="mm-btn mm-btn--primary">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="mm-body-small" style={{ marginTop: 24, color: 'var(--text-secondary)' }}>
        Nao tem conta?{' '}
        <Link href="/mentormatch/register" style={{ color: 'var(--brand)' }}>
          Criar conta
        </Link>
      </p>
      <p className="mm-body-small" style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
        <Link href="/mentormatch/forgot-password" style={{ color: 'var(--brand)' }}>
          Esqueci a senha
        </Link>
      </p>
    </main>
  );
}
