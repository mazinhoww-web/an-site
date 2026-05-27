'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { contactSchema, type ContactFormData } from '@/lib/validators/contact';
import { submitContact } from '@/server-actions/contacts';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const VALID_SUBJECTS = ['contato', 'evento', 'consultoria', 'imersao-lovable', 'imersao-claude', 'outro'] as const;

export function ContactForm() {
  const searchParams = useSearchParams();
  const assuntoParam = searchParams.get('assunto');
  const defaultSubject = VALID_SUBJECTS.includes(assuntoParam as typeof VALID_SUBJECTS[number])
    ? (assuntoParam as typeof VALID_SUBJECTS[number])
    : '';
  const [formState, setFormState] = useState<FormState>('idle');
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      subject: defaultSubject as ContactFormData['subject'],
    },
  });

  async function onSubmit(data: ContactFormData) {
    setFormState('submitting');
    setServerError('');

    const fd = new FormData();
    fd.set('name', data.name);
    fd.set('email', data.email);
    fd.set('subject', data.subject);
    fd.set('message', data.message);

    const result = await submitContact(fd);
    if (result.success) {
      setFormState('success');
    } else {
      setServerError(result.error ?? 'Erro ao enviar. Tente novamente.');
      setFormState('error');
    }
  }

  if (formState === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 border border-lime p-12 text-center">
        <CheckCircle size={32} strokeWidth={1.5} className="text-lime" />
        <h2 className="font-heading text-h2">Mensagem enviada.</h2>
        <p className="text-body text-graphite">Vou responder em breve.</p>
      </div>
    );
  }

  const inputClass =
    'w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50';
  const labelClass =
    'mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke';
  const errorClass = 'mt-1 text-body-s text-error';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <p className="border border-error/20 bg-error/5 p-3 text-body-s text-error">
          {serverError}
        </p>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>NOME</label>
        <input
          id="name"
          type="text"
          placeholder="Seu nome"
          disabled={formState === 'submitting'}
          className={inputClass}
          {...register('name')}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>EMAIL</label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          disabled={formState === 'submitting'}
          className={inputClass}
          {...register('email')}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>ASSUNTO</label>
        <select
          id="subject"
          disabled={formState === 'submitting'}
          className={inputClass}
          {...register('subject')}
        >
          <option value="">Selecione</option>
          <option value="contato">Contato pessoal</option>
          <option value="evento">Proposta de evento</option>
          <option value="consultoria">Consultoria</option>
          <option value="imersao-lovable">Imersão Corporativa Lovable</option>
          <option value="imersao-claude">Imersão Corporativa Claude</option>
          <option value="outro">Outro</option>
        </select>
        {errors.subject && <p className={errorClass}>{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>MENSAGEM</label>
        <textarea
          id="message"
          rows={5}
          placeholder="Conte mais..."
          disabled={formState === 'submitting'}
          className={`${inputClass} resize-none`}
          {...register('message')}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={formState === 'submitting'}
        className="inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-50"
      >
        {formState === 'submitting' ? (
          <>
            <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
            ENVIANDO
          </>
        ) : (
          <>
            ENVIAR MENSAGEM
            <Send size={16} strokeWidth={1.5} />
          </>
        )}
      </button>

      <p className="text-body-s text-smoke">
        Seus dados ficam comigo. Não compartilho com ninguém.{' '}
        <a href="/privacidade" className="underline decoration-lime transition-colors hover:text-ink">LGPD aplicada</a>.
      </p>
    </form>
  );
}
