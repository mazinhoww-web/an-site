'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { markContactRead } from '@/server-actions/admin/subscribers';

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleMarkRead() {
    startTransition(async () => {
      await markContactRead(id);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleMarkRead}
      disabled={isPending}
      className="font-mono text-[10px] uppercase tracking-[0.08em] text-graphite transition-colors hover:text-ink disabled:opacity-40"
    >
      {isPending ? '...' : 'Marcar lido'}
    </button>
  );
}
