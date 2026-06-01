'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button, Field, Input, MentorMatchThemeRoot, Reveal, ToastProvider, useToast } from '@/mentormatch/design-system';

interface Props {
  brandColor?: string | null;
  theme?: 'light' | 'dark';
}

export function ChangePasswordForm({ brandColor, theme = 'light' }: Props) {
  return (
    <MentorMatchThemeRoot brand={brandColor} theme={theme} style={{ minHeight: '100%', padding: '8px 0 40px' }}>
      <ToastProvider>
        <Inner />
      </ToastProvider>
    </MentorMatchThemeRoot>
  );
}

function Inner() {
  const { toast } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!current) e.current = 'Informe a senha atual';
    if (next.length < 8) e.next = 'Minimo de 8 caracteres';
    else if (next === current) e.next = 'A nova senha deve ser diferente da atual';
    if (confirm !== next) e.confirm = 'As senhas nao coincidem';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setSaving(true);
    const res = await fetch('/api/mentormatch/users/me/password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    });
    setSaving(false);
    if (!res.ok) {
      const d = (await res.json().catch(() => null)) as { error?: string } | null;
      const msg = d?.error ?? 'Falha ao trocar a senha';
      // Erro de senha atual -> helper sob o campo; resto -> toast.
      if (msg.toLowerCase().includes('atual')) setErrors((p) => ({ ...p, current: msg }));
      else toast({ title: msg, tone: 'danger' });
      return;
    }
    setCurrent('');
    setNext('');
    setConfirm('');
    setErrors({});
    toast({ title: 'Senha atualizada', description: 'Use a nova senha no proximo login.', tone: 'success' });
  }

  return (
    <div style={{ maxWidth: 460 }}>
      <Reveal>
        <h1 className="mm-h1">Seguranca</h1>
        <p className="mm-body-small">Troque sua senha. Confirmamos a senha atual antes de alterar.</p>
      </Reveal>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 20 }}
        noValidate
      >
        <Field label="Senha atual" error={errors.current}>
          {({ id, invalid }) => (
            <Input
              id={id}
              type="password"
              autoComplete="current-password"
              invalid={invalid}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          )}
        </Field>
        <Field label="Nova senha" error={errors.next}>
          {({ id, invalid }) => (
            <Input
              id={id}
              type="password"
              autoComplete="new-password"
              invalid={invalid}
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          )}
        </Field>
        <Field label="Confirmar nova senha" error={errors.confirm}>
          {({ id, invalid }) => (
            <Input
              id={id}
              type="password"
              autoComplete="new-password"
              invalid={invalid}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          )}
        </Field>
        <div>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Salvando...
              </>
            ) : (
              'Trocar senha'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
