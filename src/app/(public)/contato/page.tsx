'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

function LinkedinIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function ContatoPage() {
  const [formState, setFormState] = useState<FormState>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState('submitting');
    // Server Action sera conectada quando M4 for implementado
    await new Promise((r) => setTimeout(r, 1500));
    setFormState('success');
  }

  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Label withTab className="mb-4 block">CONTATO</Label>
          <h1 className="font-heading text-display-m">Vamos conversar</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            Envie sua mensagem, proposta ou duvida.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Form + Info */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto grid max-w-container gap-12 md:grid-cols-12">
          {/* Form */}
          <div className="md:col-span-7">
            {formState === 'success' ? (
              <div className="flex flex-col items-center gap-4 border border-lime p-12 text-center">
                <CheckCircle size={32} strokeWidth={1.5} className="text-lime" />
                <h2 className="font-heading text-h2">Mensagem enviada.</h2>
                <p className="text-body text-graphite">Vou responder em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                  >
                    NOME
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={3}
                    placeholder="Seu nome"
                    disabled={formState === 'submitting'}
                    className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                  >
                    EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    disabled={formState === 'submitting'}
                    className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                  >
                    ASSUNTO
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    disabled={formState === 'submitting'}
                    className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink focus:border-lime focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Selecione</option>
                    <option value="contato">Contato pessoal</option>
                    <option value="evento">Proposta de evento</option>
                    <option value="consultoria">Consultoria</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke"
                  >
                    MENSAGEM
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={20}
                    rows={5}
                    placeholder="Conte mais..."
                    disabled={formState === 'submitting'}
                    className="w-full resize-none border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="inline-flex w-full items-center justify-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-lime transition-colors duration-150 hover:bg-lime hover:text-ink disabled:opacity-50"
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
                  Seus dados ficam comigo. Nao compartilho com ninguem. LGPD aplicada.
                </p>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="md:col-span-5">
            <div className="border border-hairline bg-paper p-6">
              <Label withTab className="mb-4 block">OUTRAS FORMAS DE CONTATO</Label>
              <div className="space-y-4">
                <a
                  href="https://linkedin.com/in/aurimarnogueira"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir LinkedIn em nova aba"
                  className="flex items-center gap-3 text-body-s text-graphite transition-colors duration-150 hover:text-ink"
                >
                  <LinkedinIcon />
                  linkedin.com/in/aurimarnogueira
                </a>
                <a
                  href="https://github.com/mazinhoww-web"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir GitHub em nova aba"
                  className="flex items-center gap-3 text-body-s text-graphite transition-colors duration-150 hover:text-ink"
                >
                  <GithubIcon />
                  github.com/mazinhoww-web
                </a>
                <a
                  href="mailto:contato@aurimarnogueira.com.br"
                  aria-label="Enviar email"
                  className="flex items-center gap-3 text-body-s text-graphite transition-colors duration-150 hover:text-ink"
                >
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  contato@aurimarnogueira.com.br
                </a>
              </div>
              <Hairline className="my-6" />
              <h4 className="font-heading text-body-s font-medium">Horario de resposta</h4>
              <p className="mt-1 text-body-s text-graphite">
                Seg a Sex, 9h as 18h (horario de Brasilia).
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
