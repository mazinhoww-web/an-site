'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, CheckCircle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/brand/Label';

const COOKIE_NAME = 'an_email_verified';
const COOKIE_DAYS = 30;

const gateSchema = z.object({
  email: z.string().email('Email invalido'),
  consent_lgpd: z.literal(true, 'Aceite os termos para continuar'),
  consent_newsletter: z.boolean().optional(),
});

type GateFormData = z.infer<typeof gateSchema>;
type GateState = 'idle' | 'submitting' | 'success';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

type DownloadGateProps = {
  skillSlug: string;
  skillName: string;
  isOpen: boolean;
  onClose: () => void;
};

export function DownloadGate({ skillSlug, skillName, isOpen, onClose }: DownloadGateProps) {
  const [state, setState] = useState<GateState>('idle');
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    const cookie = getCookie(COOKIE_NAME);
    if (cookie) setHasVerified(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GateFormData>({
    resolver: zodResolver(gateSchema),
    defaultValues: { consent_newsletter: true },
  });

  async function onSubmit(_data: GateFormData) {
    setState('submitting');
    // Server Action requestSkillDownload sera conectada com DB+Blob
    await new Promise((r) => setTimeout(r, 1200));
    setCookie(COOKIE_NAME, 'true', COOKIE_DAYS);
    setHasVerified(true);
    setState('success');
  }

  async function handleDirectDownload() {
    setState('submitting');
    await new Promise((r) => setTimeout(r, 800));
    setState('success');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6">
      <div
        className={cn(
          'relative w-full max-w-md border bg-paper p-8',
          state === 'success' ? 'border-lime' : 'border-hairline',
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-4 top-4 text-smoke transition-colors hover:text-ink"
        >
          <X size={20} strokeWidth={1.5} />
        </button>

        {state === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle size={32} strokeWidth={1.5} className="text-lime" />
            <h3 className="font-heading text-h2">Download iniciado.</h3>
            <p className="text-body-s text-graphite">
              O arquivo {skillName} sera baixado em instantes.
            </p>
            <p className="text-body-s text-smoke">
              Link valido por 10 minutos.
            </p>
          </div>
        ) : hasVerified ? (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <Label withTab>DOWNLOAD</Label>
            <h3 className="font-heading text-h2">{skillName}</h3>
            <p className="text-body-s text-graphite">
              Email ja verificado. Clique para baixar.
            </p>
            <button
              type="button"
              onClick={handleDirectDownload}
              disabled={state === 'submitting'}
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink disabled:opacity-50"
            >
              {state === 'submitting' ? (
                <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
              ) : (
                <>
                  <Download size={16} strokeWidth={1.5} />
                  BAIXAR SKILL
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <Label withTab className="mb-4 block">DOWNLOAD</Label>
            <h3 className="font-heading text-h2">{skillName}</h3>
            <p className="mt-2 text-body-s text-graphite">
              Informe seu email para baixar. Voce nao precisara informar novamente por 30 dias.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="gate-email"
                  className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                >
                  EMAIL
                </label>
                <input
                  id="gate-email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={state === 'submitting'}
                  className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-body-s text-error">{errors.email.message}</p>
                )}
              </div>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-lime"
                  {...register('consent_newsletter')}
                />
                <span className="text-body-s text-graphite">
                  Quero receber newsletter quando novas skills sairem (opcional)
                </span>
              </label>

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1 accent-lime"
                  {...register('consent_lgpd', { required: true })}
                />
                <span className="text-body-s text-graphite">
                  Concordo com a politica de privacidade e tratamento de dados (obrigatorio)
                </span>
              </label>
              {errors.consent_lgpd && (
                <p className="text-body-s text-error">Aceite os termos para continuar</p>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink disabled:opacity-50"
              >
                {state === 'submitting' ? (
                  <>
                    <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                    VALIDANDO
                  </>
                ) : (
                  <>
                    <Download size={16} strokeWidth={1.5} />
                    BAIXAR SKILL
                  </>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-body-s text-smoke">
              Seus dados ficam comigo. Nao compartilho com ninguem. LGPD aplicada.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
