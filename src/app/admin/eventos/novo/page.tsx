'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createEvent } from '@/server-actions/admin/events';

const EVENT_TYPES = [
  'summit',
  'painel',
  'meetup',
  'conferencia',
  'workshop',
  'webinar',
  'mesa-redonda',
  'mentoria',
  'demoday',
] as const;

const ROLES = [
  'palestrante',
  'painelista',
  'jurado',
  'mediador',
  'mentor',
  'host',
  'convidado',
] as const;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminNovoEventoPage() {
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
      const result = await createEvent(formData);
      if (result.success) {
        router.push('/admin/eventos');
      } else {
        setError(result.error ?? 'Erro desconhecido');
      }
    });
  }

  return (
    <>
      <Link
        href="/admin/eventos"
        className="group mb-4 inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft
          size={14}
          strokeWidth={1.5}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        Voltar
      </Link>
      <h1 className="font-heading text-h1 mb-8">Novo Evento</h1>

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
            placeholder="Título do evento"
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
            placeholder="titulo-do-evento"
          />
        </div>

        {/* Event Type */}
        <div>
          <label htmlFor="eventType" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Tipo de Evento
          </label>
          <select
            id="eventType"
            name="eventType"
            required
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink focus:border-lime focus:outline-none"
          >
            <option value="">Selecione</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Role
          </label>
          <select
            id="role"
            name="role"
            required
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink focus:border-lime focus:outline-none"
          >
            <option value="">Selecione</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Topic */}
        <div>
          <label htmlFor="topic" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Tema
          </label>
          <input
            id="topic"
            name="topic"
            type="text"
            required
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Tema principal"
          />
        </div>

        {/* Description Short */}
        <div>
          <label htmlFor="descriptionShort" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Descrição Curta
          </label>
          <textarea
            id="descriptionShort"
            name="descriptionShort"
            required
            rows={3}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Descrição curta do evento"
          />
        </div>

        {/* Event Date */}
        <div>
          <label htmlFor="eventDate" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Data do Evento
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            required
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink focus:border-lime focus:outline-none"
          />
        </div>

        {/* City + State (side by side) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              Cidade
            </label>
            <input
              id="city"
              name="city"
              type="text"
              className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
              placeholder="São Paulo"
            />
          </div>
          <div>
            <label htmlFor="state" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              Estado
            </label>
            <input
              id="state"
              name="state"
              type="text"
              className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
              placeholder="SP"
            />
          </div>
        </div>

        {/* Organizer */}
        <div>
          <label htmlFor="organizer" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Organizador
          </label>
          <input
            id="organizer"
            name="organizer"
            type="text"
            required
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="Nome do organizador"
          />
        </div>

        {/* Audience Size */}
        <div>
          <label htmlFor="audienceSize" className="mb-2 block font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            Tamanho da Audiência
          </label>
          <input
            id="audienceSize"
            name="audienceSize"
            type="number"
            min={0}
            className="w-full border border-hairline bg-paper px-4 py-3 text-body text-ink placeholder:text-smoke/40 focus:border-lime focus:outline-none"
            placeholder="500"
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
            placeholder="loyalty, fintech, inovação"
          />
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <input
            id="published-checkbox"
            type="checkbox"
            defaultChecked
            onChange={(e) => {
              const hidden = document.getElementById('published-hidden') as HTMLInputElement;
              if (hidden) hidden.value = e.target.checked ? 'true' : 'false';
            }}
            className="h-4 w-4 border border-hairline accent-lime"
          />
          <input id="published-hidden" name="published" type="hidden" defaultValue="true" />
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
          {isPending ? 'Salvando...' : 'Criar Evento'}
        </button>
      </form>
    </>
  );
}
