'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Field, Input } from '@/mentormatch/design-system';
import { mmRegisterSchema, type MmRegisterInput } from '@/lib/mentormatch/validators';

/**
 * Form de cadastro branded (D007: registro aberto por tenant). O campo opcional
 * "codigo de convite" mapeia para o invitationToken (Fase 7). Pos-cadastro faz
 * login automatico e cai no dispatcher /mentormatch/continue (redirect por role).
 */
export function BrandedRegisterForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MmRegisterInput>({ resolver: zodResolver(mmRegisterSchema) });

  async function onSubmit(values: MmRegisterInput) {
    setFormError('');
    const payload = { ...values, invitationToken: values.invitationToken || undefined };
    const res = await fetch('/api/mentormatch/auth/register', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setFormError(data?.error ?? 'Nao foi possivel criar a conta.');
      return;
    }
    const si = await signIn('credentials', {
      email: values.email,
      password: values.password,
      tenantSlug: slug,
      redirect: false,
    });
    router.push(si && !si.error ? '/mentormatch/continue' : `/mentormatch/${slug}/login`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <h1 className="mm-h2">Criar conta</h1>
        <p className="mm-body-small">Participe do programa de mentoria.</p>
      </div>

      <Field label="Nome" error={errors.name?.message}>
        {({ id, invalid }) => (
          <Input id={id} type="text" autoComplete="name" invalid={invalid} {...register('name')} />
        )}
      </Field>

      <Field label="Email" error={errors.email?.message}>
        {({ id, invalid }) => (
          <Input id={id} type="email" autoComplete="email" invalid={invalid} {...register('email')} />
        )}
      </Field>

      <Field label="Senha" error={errors.password?.message}>
        {({ id, invalid }) => (
          <Input
            id={id}
            type="password"
            autoComplete="new-password"
            invalid={invalid}
            {...register('password')}
          />
        )}
      </Field>

      <Field label="Codigo de convite (opcional)" error={errors.invitationToken?.message}>
        {({ id, invalid }) => (
          <Input id={id} type="text" placeholder="Se a empresa enviou um codigo" invalid={invalid} {...register('invitationToken')} />
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
            Criando conta...
          </>
        ) : (
          'Criar conta'
        )}
      </Button>

      <Link href={`/mentormatch/${slug}/login`} className="mm-btn mm-btn--ghost" style={{ width: '100%' }}>
        Ja tenho conta
      </Link>
    </form>
  );
}
