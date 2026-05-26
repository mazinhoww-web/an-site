'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createProject } from '@/server-actions/admin/projects';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminNovoProjetoPage() {
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
      const result = await createProject(formData);
      if (result.success) {
        router.push('/admin/projetos');
      } else {
        setError(result.error ?? 'Erro desconhecido');
      }
    });
  }

  return (
    <>
      <Link
        href="/admin/projetos"
        className="group mb-4 inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        Voltar
      </Link>
      <h1 className="font-heading text-h1 mb-8">Novo Projeto</h1>

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
            placeholder="Título do projeto"
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
            placeholder="titulo-do-projeto"
          />
        </div>

        {/* Summary */}
        <div>
          <label htmlFor="summary" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Resumo
          </label>
          <textarea
            id="summary"
            name="summary"
            required
            rows={3}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Resumo do projeto (min. 10 caracteres)"
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
            rows={10}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Descrição detalhada em Markdown (opcional)"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Tags (separadas por vírgula)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="loyalty, fintech, next.js"
          />
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Ano
          </label>
          <input
            id="year"
            name="year"
            type="number"
            min={2014}
            max={2030}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="2026"
          />
        </div>

        {/* External URL */}
        <div>
          <label htmlFor="externalUrl" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            URL Externa
          </label>
          <input
            id="externalUrl"
            name="externalUrl"
            type="url"
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="https://..."
          />
        </div>

        {/* Featured */}
        <div className="flex items-center gap-3">
          <input
            id="featured-checkbox"
            type="checkbox"
            onChange={(e) => {
              const hidden = document.getElementById('isFeatured-hidden') as HTMLInputElement;
              if (hidden) hidden.value = e.target.checked ? 'true' : 'false';
            }}
            className="h-4 w-4 border border-hairline accent-lime"
          />
          <input id="isFeatured-hidden" name="isFeatured" type="hidden" defaultValue="false" />
          <label htmlFor="featured-checkbox" className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Featured
          </label>
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <input
            id="published-checkbox"
            type="checkbox"
            onChange={(e) => {
              const hidden = document.getElementById('isPublished-hidden') as HTMLInputElement;
              if (hidden) hidden.value = e.target.checked ? 'true' : 'false';
            }}
            className="h-4 w-4 border border-hairline accent-lime"
          />
          <input id="isPublished-hidden" name="isPublished" type="hidden" defaultValue="false" />
          <label htmlFor="published-checkbox" className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Publicado
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-ink px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime disabled:opacity-40"
        >
          {isPending ? 'Salvando...' : 'Criar Projeto'}
        </button>
      </form>
    </>
  );
}
