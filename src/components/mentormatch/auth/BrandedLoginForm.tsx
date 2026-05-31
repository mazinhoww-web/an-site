'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Field, Input } from '@/mentormatch/design-system';
import { mmLoginSchema, type MmLoginInput } from '@/lib/mentormatch/validators';

/**
 * Form de login branded. Reaproveita o NextAuth credentials (tenantSlug do path)
 * e o dispatcher /mentormatch/continue, que redireciona por role (D-06/D-16).
 */
export function BrandedLoginForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MmLoginInput>({ resolver: zodResolver(mmLoginSchema) });

  async function onSubmit(values: MmLoginInput) {
    setFormError('');
    const res = await signIn('credentials', { ...values, tenantSlug: slug, redirect: false });
    if (!res || res.error) {
      setFormError('Email ou senha incorretos.');
      return;
    }
    router.push('/mentormatch/continue');
  }

  const credInvalid = Boolean(formError);

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 className="mm-h2">Entrar</h1>
        <p className="mm-body-small">Acesse o programa de mentoria.</p>
      </div>

      <Field label="Email" error={errors.email?.message}>
        {({ id, invalid }) => (
          <Input id={id} type="email" autoComplete="email" invalid={invalid || credInvalid} {...register('email')} />
        )}
      </Field>

      <Field label="Senha" error={errors.password?.message}>
        {({ id, invalid }) => (
          <Input
            id={id}
            type="password"
            autoComplete="current-password"
            invalid={invalid || credInvalid}
            {...register('password')}
          />
        )}
      </Field>

      {formError && (
        <p className="mm-field__error" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </Button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <Link href={`/mentormatch/${slug}/cadastrar`} className="mm-btn mm-btn--ghost" style={{ width: '100%' }}>
          Criar conta
        </Link>
        <Link href="/mentormatch/forgot-password" className="mm-body-small" style={{ color: 'var(--text-secondary)' }}>
          Esqueci a senha
        </Link>
      </div>
    </form>
  );
}
