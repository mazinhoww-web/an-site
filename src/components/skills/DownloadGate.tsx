'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, CheckCircle, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { requestDownload } from '@/server-actions/download';

const COOKIE_NAME = 'an_email_verified';
const COOKIE_DAYS = 30;

type GateState = 'idle' | 'submitting' | 'success' | 'error';

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
  hasAsset: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export function DownloadGate({ skillSlug, skillName, hasAsset, isOpen, onClose }: DownloadGateProps) {
  const [state, setState] = useState<GateState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consentLgpd, setConsentLgpd] = useState(false);
  const [consentNewsletter, setConsentNewsletter] = useState(true);
  const [consentWhatsapp, setConsentWhatsapp] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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
    if (!name.trim() || name.trim().length < 2) { setErrorMsg('Informe seu nome.'); return; }
    setState('submitting');
    setErrorMsg('');
    try {
      const result = await requestDownload({
        email,
        name: name.trim(),
        phone: phone.trim(),
        skillSlug,
        consentLgpd: true as const,
        consentNewsletter,
        consentWhatsapp,
      });
      if (result.success && result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        setCookie(COOKIE_NAME, email, COOKIE_DAYS);
        setState('success');
      } else {
        setErrorMsg('Erro inesperado. Tente novamente.');
        setState('error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar. Tente novamente.';
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
            <p className="text-body-s text-graphite">O arquivo para {skillName} ainda esta sendo preparado.</p>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50';
  const labelClass = 'mb-1 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6" role="dialog" aria-modal="true" aria-label={`Download ${skillName}`}>
      <div ref={modalRef} className={cn(
        'relative w-full max-w-md border bg-paper p-8 max-h-[90vh] overflow-y-auto',
        state === 'success' ? 'border-lime' : 'border-hairline',
      )}>
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-4 top-4 text-smoke transition-colors hover:text-ink">
          <X size={20} strokeWidth={1.5} />
        </button>

        {state === 'success' ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle size={32} strokeWidth={1.5} className="text-lime" />
            <h3 className="font-heading text-h2">Pronto para baixar</h3>
            <p className="text-body-s text-graphite">
              Clique no botao abaixo para baixar {skillName}.
            </p>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-lime px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:bg-lime-deep"
            >
              <Download size={16} strokeWidth={1.5} />
              BAIXAR AGORA
            </a>
          </div>
        ) : (
          <>
            <Eyebrow className="mb-4 block">DOWNLOAD</Eyebrow>
            <h3 className="font-heading text-h2">{skillName}</h3>
            <p className="mt-2 text-body-s text-graphite">Preencha para liberar o download.</p>
            {errorMsg && <p className="mt-2 text-body-s text-error">{errorMsg}</p>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="gate-name" className={labelClass}>NOME *</label>
                <input id="gate-name" type="text" required minLength={2} value={name} onChange={e => setName(e.target.value)}
                  placeholder="Seu nome" disabled={state === 'submitting'} className={inputClass} />
              </div>

              <div>
                <label htmlFor="gate-email" className={labelClass}>EMAIL *</label>
                <input id="gate-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com" disabled={state === 'submitting'} className={inputClass} />
              </div>

              <div>
                <label htmlFor="gate-phone" className={labelClass}>TELEFONE</label>
                <input id="gate-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="(65) 99999-9999" disabled={state === 'submitting'} className={inputClass} />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={consentLgpd} onChange={e => setConsentLgpd(e.target.checked)} className="mt-1 accent-lime" />
                  <span className="text-body-s text-graphite">
                    Concordo com a <a href="/privacidade" className="underline decoration-lime">politica de privacidade</a> (obrigatorio) *
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={consentNewsletter} onChange={e => setConsentNewsletter(e.target.checked)} className="mt-1 accent-lime" />
                  <span className="text-body-s text-graphite">Quero receber newsletter quando novas skills sairem</span>
                </label>

                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={consentWhatsapp} onChange={e => setConsentWhatsapp(e.target.checked)} className="mt-1 accent-lime" />
                  <span className="text-body-s text-graphite">Quero receber novidades por WhatsApp</span>
                </label>
              </div>

              <button type="submit" disabled={state === 'submitting'}
                className="inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-50">
                {state === 'submitting' ? (
                  <><Loader2 size={16} strokeWidth={1.5} className="animate-spin" />PROCESSANDO</>
                ) : (
                  <><Download size={16} strokeWidth={1.5} />LIBERAR DOWNLOAD</>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-body-s text-smoke">
              Seus dados ficam comigo. Nao compartilho com ninguem.{' '}
              <a href="/privacidade" className="underline decoration-lime transition-colors hover:text-ink">LGPD aplicada</a>.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
