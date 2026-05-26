'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { dispatchNewsletter, saveDraft } from '@/server-actions/newsletter';
import { Hairline } from '@/components/brand/Hairline';

export default function AdminNovaCampanhaPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [contentMd, setContentMd] = useState('');

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set('subject', subject);
    fd.set('contentMd', contentMd);
    return fd;
  }

  function handleSaveDraft() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await saveDraft(buildFormData());
      if (result.success) {
        setSuccess('Rascunho salvo.');
      } else {
        setError(result.error ?? 'Erro ao salvar rascunho');
      }
    });
  }

  function handleDispatch() {
    if (!subject.trim() || !contentMd.trim()) {
      setError('Preencha assunto e conteúdo antes de disparar.');
      return;
    }
    if (!confirm('Confirma o disparo da newsletter para todos subscribers confirmados?')) {
      return;
    }

    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await dispatchNewsletter(buildFormData());
      if (result.success) {
        setSuccess(`Newsletter disparada para ${result.recipientCount ?? 0} destinatários.`);
        setTimeout(() => router.push('/admin/newsletter'), 2000);
      } else {
        setError(result.error ?? 'Erro ao disparar newsletter');
      }
    });
  }

  // Simple markdown-to-HTML preview
  function renderPreview(): string {
    if (!contentMd.trim()) return '<p style="color:#9B9B9B">Preview aparece aqui...</p>';
    return contentMd
      .split('\n\n')
      .map((p) => `<p style="margin-bottom:12px;line-height:1.6;color:#4A4A4A">${p}</p>`)
      .join('');
  }

  return (
    <>
      <Link
        href="/admin/newsletter"
        className="group mb-4 inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        Voltar
      </Link>
      <h1 className="font-heading text-h1 mb-8">Nova Campanha</h1>

      {error && (
        <div className="mb-6 border border-red-300 bg-red-50 px-4 py-3 text-body-s text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 border border-lime/30 bg-lime/5 px-4 py-3 text-body-s text-ink">
          {success}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6">
          <div>
            <label htmlFor="subject" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              Assunto
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
              placeholder="Assunto do email"
            />
          </div>

          <div>
            <label htmlFor="contentMd" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              Conteúdo (Markdown)
            </label>
            <textarea
              id="contentMd"
              value={contentMd}
              onChange={(e) => setContentMd(e.target.value)}
              rows={16}
              className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
              placeholder="Corpo do email em texto. Separe paragrafos com linha em branco."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isPending}
              className="border border-hairline px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors duration-200 hover:bg-ink hover:text-bone disabled:opacity-40"
            >
              {isPending ? '...' : 'Salvar Rascunho'}
            </button>
            <button
              type="button"
              onClick={handleDispatch}
              disabled={isPending}
              className="bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-40"
            >
              {isPending ? 'Disparando...' : 'Disparar Newsletter'}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <p className="mb-2 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Preview
          </p>
          <div className="border border-hairline bg-paper p-6">
            {subject && (
              <p className="mb-4 font-heading text-h4 text-ink">{subject}</p>
            )}
            <Hairline />
            <div
              className="mt-4 text-body"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
