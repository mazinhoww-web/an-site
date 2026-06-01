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
    <main
      className="mx-auto flex flex-col"
      style={{ maxWidth: 640, gap: 32, padding: '80px 24px' }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 className="mm-h1">Como voce quer participar?</h1>
        <p className="mm-body" style={{ color: 'var(--text-secondary)' }}>
          Escolha seu papel no programa de mentoria.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => choose('MENTOR')}
          disabled={pending !== null}
          className="mm-card mm-card--interactive"
          style={{ textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="mm-h3">Quero ser Mentor</span>
          <span className="mm-body-small" style={{ display: 'block', marginTop: 8, color: 'var(--text-secondary)' }}>
            Compartilhar experiencia e orientar mentorados.
          </span>
        </button>
        <button
          type="button"
          onClick={() => choose('MENTEE')}
          disabled={pending !== null}
          className="mm-card mm-card--interactive"
          style={{ textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="mm-h3">Quero ser Mentorado</span>
          <span className="mm-body-small" style={{ display: 'block', marginTop: 8, color: 'var(--text-secondary)' }}>
            Encontrar um mentor e evoluir na carreira.
          </span>
        </button>
      </div>
    </main>
  );
}
