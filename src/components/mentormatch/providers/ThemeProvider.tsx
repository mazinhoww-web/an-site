'use client';

import { useEffect } from 'react';

interface ThemeProviderProps {
  themeClass: string; // ex: "theme-sicredi" | "theme-dark"
  fontFaces?: string; // URL de Google Fonts a injetar no <head>
  children: React.ReactNode;
}

/**
 * Injeta a classe de tema do tenant no <body> e, opcionalmente, as fontes
 * do tenant via <link> no <head>. Remove qualquer tema anterior ao trocar,
 * de modo que a navegacao entre areas com temas diferentes nao acumule classes.
 */
export function ThemeProvider({ themeClass, fontFaces, children }: ThemeProviderProps) {
  useEffect(() => {
    const body = document.body;
    Array.from(body.classList)
      .filter((c) => c.startsWith('theme-'))
      .forEach((c) => body.classList.remove(c));
    body.classList.add(themeClass);
    return () => {
      body.classList.remove(themeClass);
    };
  }, [themeClass]);

  useEffect(() => {
    if (!fontFaces) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontFaces;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [fontFaces]);

  return <>{children}</>;
}
