'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createNews } from '@/server-actions/admin/news';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminNovaNoticiaPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(slugify(value));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createNews(formData);
      if (result.success) {
        router.push('/admin/noticias');
      } else {
        setError(result.error ?? 'Erro desconhecido');
      }
    });
  }

  return (
    <>
      <Link
        href="/admin/noticias"
        className="group mb-4 inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        Voltar
      </Link>
      <h1 className="font-heading text-h1 mb-8">Nova Notícia</h1>

      {error && (
        <div className="mb-6 border border-red-300 bg-red-50 px-4 py-3 text-body-s text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Título da noticia"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="titulo-da-noticia"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Resumo
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
            maxLength={180}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Resumo de até 180 caracteres"
          />
        </div>

        {/* Content Markdown */}
        <div>
          <label htmlFor="contentMd" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Conteúdo (Markdown)
          </label>
          <textarea
            id="contentMd"
            name="contentMd"
            required
            rows={12}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Conteúdo completo em Markdown"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink focus:border-lime focus:outline-none"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-40"
        >
          {isPending ? 'Salvando...' : 'Criar Notícia'}
        </button>
      </form>
    </>
  );
}
