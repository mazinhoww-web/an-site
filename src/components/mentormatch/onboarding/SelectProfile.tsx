'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Role picker. Does NOT write to the DB — it only routes to the matching
// onboarding wizard, which persists everything in one transaction (one path).
export function SelectProfile() {
  const router = useRouter();
  const [pending, setPending] = useState<'MENTOR' | 'MENTEE' | null>(null);

  function choose(role: 'MENTOR' | 'MENTEE') {
    setPending(role);
    router.push(role === 'MENTOR' ? '/mentormatch/onboarding/mentor' : '/mentormatch/onboarding/mentee');
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-20">
      <header className="space-y-2">
        <h1 className="font-heading text-display-m">Como voce quer participar?</h1>
        <p className="text-body text-graphite">Escolha seu papel no programa de mentoria.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => choose('MENTOR')}
          disabled={pending !== null}
          className="rounded border border-hairline bg-paper p-6 text-left transition hover:border-ink disabled:opacity-60"
        >
          <span className="font-heading text-h3">Quero ser Mentor</span>
          <span className="mt-2 block text-body-s text-graphite">
            Compartilhar experiencia e orientar mentorados.
          </span>
        </button>
        <button
          type="button"
          onClick={() => choose('MENTEE')}
          disabled={pending !== null}
          className="rounded border border-hairline bg-paper p-6 text-left transition hover:border-ink disabled:opacity-60"
        >
          <span className="font-heading text-h3">Quero ser Mentorado</span>
          <span className="mt-2 block text-body-s text-graphite">
            Encontrar um mentor e evoluir na carreira.
          </span>
        </button>
      </div>
    </main>
  );
}
