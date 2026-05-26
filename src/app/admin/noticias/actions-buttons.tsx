'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { deleteNews } from '@/server-actions/admin/news';

export function DeleteNewsButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Deletar "${title}"?`)) return;
    startTransition(async () => {
      await deleteNews(id);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="font-mono text-[10px] uppercase tracking-[0.08em] text-smoke transition-colors hover:text-ink disabled:opacity-40"
    >
      {isPending ? '...' : 'Deletar'}
    </button>
  );
}
