'use client';

import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

const COOKIE = 'mm-color-scheme';

interface ColorSchemeToggleProps {
  /** valor inicial vindo do cookie no servidor. */
  initial?: 'light' | 'dark';
}

/**
 * Alterna light/dark do MentorMatch DS. Persiste a escolha em cookie (1 ano,
 * SameSite=Lax) e atualiza ao vivo o atributo data-theme de todos os wrappers
 * .mm na pagina. Sem localStorage.
 */
export function ColorSchemeToggle({ initial = 'light' }: ColorSchemeToggleProps) {
  const [scheme, setScheme] = useState<'light' | 'dark'>(initial);

  const toggle = () => {
    const next = scheme === 'dark' ? 'light' : 'dark';
    setScheme(next);
    document.cookie = `${COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
    document.querySelectorAll('.mm').forEach((el) => el.setAttribute('data-theme', next));
  };

  return (
    <button
      type="button"
      className="mm-icon-btn"
      aria-label={scheme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
      aria-pressed={scheme === 'dark'}
      onClick={toggle}
    >
      {scheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
