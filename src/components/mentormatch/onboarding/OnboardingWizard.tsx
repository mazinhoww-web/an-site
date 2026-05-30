'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { mmOnboardingFormSchema, type MmOnboardingFormInput } from '@/lib/mentormatch/validators';
import type { MMRole } from '@/types/mentormatch';

type SkillOption = { id: string; name: string };

export function OnboardingWizard({
  role,
  skills,
  defaultName,
}: {
  role: Extract<MMRole, 'MENTOR' | 'MENTEE'>;
  skills: SkillOption[];
  defaultName: string;
}) {
  const router = useRouter();
  const { update } = useSession();
  const [selected, setSelected] = useState<string[]>([]);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function uploadAvatar(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/mentormatch/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = (await res.json()) as { url: string };
        setImage(url);
      }
      // best-effort: avatar is optional, a failed upload does not block onboarding
    } finally {
      setUploading(false);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MmOnboardingFormInput>({
    resolver: zodResolver(mmOnboardingFormSchema),
    defaultValues: { name: defaultName },
  });

  function toggleSkill(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function onSubmit(values: MmOnboardingFormInput) {
    setError('');
    if (selected.length < 1) {
      setError('Selecione ao menos uma habilidade.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/mentormatch/auth/complete-profile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, role, skills: selected, image }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? 'Nao foi possivel concluir o cadastro.');
        setSubmitting(false);
        return;
      }
      const data = (await res.json()) as { redirectTo?: string };
      // Refresh the JWT claims (role/tenant/onboardingDone) before navigating
      // so the session UI is consistent (D-16: go straight to the dashboard).
      await update();
      router.push(data.redirectTo ?? '/mentormatch/continue');
    } catch {
      setError('Erro de rede. Tente novamente.');
      setSubmitting(false);
    }
  }

  const label = role === 'MENTOR' ? 'Mentor' : 'Mentorado';

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-8 space-y-2">
        <h1 className="font-mmdisplay text-display-m">Perfil de {label}</h1>
        <p className="text-body text-mm-muted">Complete seu perfil para continuar.</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Field label="Nome" error={errors.name?.message}>
          <input className={inputCls} {...register('name')} />
        </Field>
        <Field label="Headline" error={errors.headline?.message}>
          <input className={inputCls} placeholder="Ex: Head de Produto" {...register('headline')} />
        </Field>
        <Field label="Bio" error={errors.bio?.message}>
          <textarea rows={4} className={inputCls} {...register('bio')} />
        </Field>
        <Field label="LinkedIn" error={errors.linkedin?.message}>
          <input className={inputCls} placeholder="https://linkedin.com/in/..." {...register('linkedin')} />
        </Field>
        <Field label="WhatsApp" error={errors.whatsapp?.message}>
          <input className={inputCls} placeholder="+55 11 90000-0000" {...register('whatsapp')} />
        </Field>
        <Field label="Foto (opcional)">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              className="text-body-s"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void uploadAvatar(f);
              }}
            />
            {uploading && <span className="text-body-s text-mm-muted">enviando...</span>}
            {image && !uploading && <span className="text-body-s text-mm-success">enviada</span>}
          </div>
        </Field>

        <fieldset className="space-y-3">
          <legend className="font-mono text-mono-meta uppercase tracking-wide text-mm-muted">
            Habilidades {role === 'MENTOR' ? '(que voce ensina)' : '(que quer desenvolver)'}
          </legend>
          {skills.length === 0 ? (
            <p className="text-body-s text-mm-muted">Nenhuma habilidade disponivel neste tenant.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => {
                const active = selected.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSkill(s.id)}
                    aria-pressed={active}
                    className={
                      active
                        ? 'rounded border border-mm-primary bg-mm-primary px-3 py-1.5 text-body-s text-mm-primaryfg'
                        : 'rounded border border-mm-border bg-mm-card px-3 py-1.5 text-body-s text-mm-text hover:border-mm-primary'
                    }
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          )}
        </fieldset>

        {error && <p className="text-body-s text-mm-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-mm-primary px-6 py-3 font-mmdisplay text-body text-mm-primaryfg transition hover:bg-mm-primary2 disabled:opacity-60"
        >
          {submitting ? 'Salvando...' : 'Concluir'}
        </button>
      </form>
    </main>
  );
}

const inputCls =
  'w-full rounded border border-mm-border bg-mm-card px-3 py-2 text-body text-mm-text outline-none focus:border-mm-primary';

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-mono-meta uppercase tracking-wide text-mm-muted">{label}</span>
      {children}
      {error && <span className="block text-body-s text-mm-danger">{error}</span>}
    </label>
  );
}
