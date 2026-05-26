'use client';

import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'bone' | 'ink'>('bone');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'bone' | 'ink' | null;
    if (stored === 'ink') setTheme('ink');
  }, []);

  function toggle() {
    const next = theme === 'bone' ? 'ink' : 'bone';
    setTheme(next);
    document.documentElement.classList.toggle('theme-ink', next === 'ink');
    localStorage.setItem('theme', next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Mudar para tema ${theme === 'bone' ? 'ink' : 'bone'}`}
      className="inline-flex items-center gap-1 border border-hairline px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke transition-colors duration-150 hover:border-ink hover:text-ink"
    >
      <span className={theme === 'bone' ? 'text-ink' : ''}>BONE</span>
      <span aria-hidden="true">|</span>
      <span className={theme === 'ink' ? 'text-ink' : ''}>INK</span>
    </button>
  );
}
