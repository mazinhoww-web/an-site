'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Loader2, CheckCircle, Download, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { requestDownload } from '@/server-actions/download';

const COOKIE_NAME = 'consent_lgpd_email';

type GateState = 'idle' | 'submitting' | 'success' | 'error';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

type DownloadGateProps = {
  skillSlug: string;
  skillName: string;
  hasAsset: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export function DownloadGate({ skillSlug, skillName, hasAsset, isOpen, onClose }: DownloadGateProps) {
  const [state, setState] = useState<GateState>('idle');
  const [savedEmail, setSavedEmail] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');
  const [consentLgpd, setConsentLgpd] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedEmail(getCookie(COOKIE_NAME));
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consentLgpd) { setErrorMsg('Aceite os termos para continuar.'); return; }
    setState('submitting');
    setErrorMsg('');
    try {
      await requestDownload({ email, skillSlug, consentLgpd: true });
      setState('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar';
      setErrorMsg(msg);
      setState('error');
    }
  }

  async function handleBypassSubmit() {
    if (!savedEmail) return;
    setState('submitting');
    setErrorMsg('');
    try {
      await requestDownload({ email: savedEmail, skillSlug, consentLgpd: true });
      setState('success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar';
      setErrorMsg(msg);
      setState('error');
    }
  }

  if (!isOpen) return null;

  if (!hasAsset) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6">
        <div className="relative w-full max-w-md border border-hairline bg-paper p-8">
          <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 text-smoke transition-colors hover:text-ink">
            <X size={20} strokeWidth={1.5} />
          </button>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Download size={32} strokeWidth={1.5} className="text-smoke" />
            <h3 className="font-heading text-h2">Em breve</h3>
            <p className="text-body-s text-graphite">O arquivo para {skillName} ainda esta sendo preparado. Volte em breve.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6" role="dialog" aria-modal="true" aria-label={`Download ${skillName}`}>
      <div ref={modalRef} className={cn(
        'relative w-full max-w-md border bg-paper p-8',
        state === 'success' ? 'border-lime' : 'border-hairline',
      )}>
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 text-smoke transition-colors hover:text-ink">
          <X size={20} strokeWidth={1.5} />
        </button>

        {state === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Mail size={32} strokeWidth={1.5} className="text-lime" />
            <h3 className="font-heading text-h2">Link enviado</h3>
            <p className="text-body-s text-graphite">
              Enviamos o link de download para {savedEmail || email}. Confira sua caixa de entrada.
            </p>
          </div>
        ) : savedEmail ? (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <Eyebrow>DOWNLOAD</Eyebrow>
            <h3 className="font-heading text-h2">{skillName}</h3>
            <p className="text-body-s text-graphite">Enviar link de download para {savedEmail}?</p>
            {errorMsg && <p className="text-body-s text-error">{errorMsg}</p>}
            <button type="button" onClick={handleBypassSubmit} disabled={state === 'submitting'}
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-50">
              {state === 'submitting' ? <Loader2 size={16} strokeWidth={1.5} className="animate-spin" /> : <><Download size={16} strokeWidth={1.5} />ENVIAR LINK</>}
            </button>
          </div>
        ) : (
          <>
            <Eyebrow className="mb-4 block">DOWNLOAD</Eyebrow>
            <h3 className="font-heading text-h2">{skillName}</h3>
            <p className="mt-2 text-body-s text-graphite">Informe seu email. Enviaremos o link de download.</p>
            {errorMsg && <p className="mt-2 text-body-s text-error">{errorMsg}</p>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="gate-email" className="mb-1 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">EMAIL</label>
                <input id="gate-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" disabled={state === 'submitting'}
                  className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50" />
              </div>

              <label className="flex items-start gap-2">
                <input type="checkbox" checked={consentLgpd} onChange={e => setConsentLgpd(e.target.checked)} className="mt-1 accent-lime" />
                <span className="text-body-s text-graphite">
                  Concordo com a <a href="/privacidade" className="underline decoration-lime">politica de privacidade</a> e tratamento de dados (obrigatorio)
                </span>
              </label>

              <button type="submit" disabled={state === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-50">
                {state === 'submitting' ? <><Loader2 size={16} strokeWidth={1.5} className="animate-spin" />ENVIANDO</> : <><Mail size={16} strokeWidth={1.5} />ENVIAR LINK DE DOWNLOAD</>}
              </button>
            </form>

            <p className="mt-4 text-center text-body-s text-smoke">
              Seus dados ficam comigo. Não compartilho com ninguem.{' '}
              <a href="/privacidade" className="underline decoration-lime transition-colors hover:text-ink">LGPD aplicada</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
