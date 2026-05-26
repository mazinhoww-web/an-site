import type { Metadata } from 'next';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Envie sua mensagem, proposta ou dúvida para Aurimar Nogueira.',
};

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
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Eyebrow className="mb-4 block">CONTATO</Eyebrow>
          <h1 className="font-heading text-display-m">Vamos conversar</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            Envie sua mensagem, proposta ou dúvida.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      {/* Form + Info */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto grid max-w-container gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <ContactForm />
          </div>

          {/* Info sidebar */}
          <div className="md:col-span-5">
            <div className="border border-hairline bg-paper p-6">
              <Eyebrow className="mb-4 block">OUTRAS FORMAS DE CONTATO</Eyebrow>
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
              <h4 className="font-heading text-body-s font-medium">Horário de resposta</h4>
              <p className="mt-1 text-body-s text-graphite">
                Seg a Sex, 9h às 18h (horário de Brasília).
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
