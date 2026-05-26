'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toggleSkillPublished, deleteSkill } from '@/server-actions/admin/skills';

export function TogglePublishedButton({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleSkillPublished(id, !published);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className="font-mono text-[10px] uppercase tracking-[0.08em] text-graphite transition-colors hover:text-ink disabled:opacity-40"
    >
      {isPending ? '...' : published ? 'Sim' : 'Nao'}
    </button>
  );
}

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Deletar "${name}"?`)) return;
    startTransition(async () => {
      await deleteSkill(id);
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
