'use client';

import type { CSSProperties, ReactNode } from 'react';
import './tokens.css';
import './components.css';
import { brandStyle } from './brand';
import { mmMono, mmSans } from './fonts';

interface MentorMatchThemeRootProps {
  children: ReactNode;
  /** tema visual; default light. */
  theme?: 'light' | 'dark';
  /** cor de marca do tenant (hex). Sem valor usa o default Indigo. */
  brand?: string | null;
  className?: string;
  style?: CSSProperties;
}

/**
 * Raiz do MentorMatch DS. Aplica a classe escopada .mm, o tema via data-theme,
 * as fontes (variaveis CSS do next/font) e a injecao de --brand do tenant.
 * NAO toca no <body> nem no :root do an-site: todo o tema vive dentro deste no.
 *
 * Os componentes do DS devem ser renderizados dentro deste wrapper.
 */
export function MentorMatchThemeRoot({
  children,
  theme = 'light',
  brand,
  className,
  style,
}: MentorMatchThemeRootProps) {
  return (
    <div
      className={`mm ${mmSans.variable} ${mmMono.variable}${className ? ` ${className}` : ''}`}
      data-theme={theme}
      style={{ ...brandStyle(brand), ...style }}
    >
      {children}
    </div>
  );
}
