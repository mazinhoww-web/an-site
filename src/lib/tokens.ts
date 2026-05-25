export const tokens = {
  colors: {
    bone: '#F5F4EF',
    paper: '#FFFFFF',
    ink: '#0A0A0A',
    graphite: '#4A4A4A',
    smoke: '#8A8A8A',
    hairline: '#E5E3DC',
    lime: '#CCFF00',
    'lime-deep': '#9FCC00',
    success: '#1F7A3A',
    error: '#8B1F2E',
  },

  fonts: {
    heading: 'Space Grotesk',
    sans: 'Inter',
    mono: 'JetBrains Mono',
  },

  typography: {
    'display-xl': {
      fontFamily: 'heading',
      fontWeight: 700,
      fontSize: 'clamp(3rem, 5vw, 5rem)',
      lineHeight: 1.05,
      letterSpacing: '-0.04em',
    },
    'display-l': {
      fontFamily: 'heading',
      fontWeight: 700,
      fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
      lineHeight: 1.15,
      letterSpacing: '-0.03em',
    },
    'display-m': {
      fontFamily: 'heading',
      fontWeight: 700,
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h1: {
      fontFamily: 'heading',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: 'heading',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.17,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: 'heading',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: '0',
    },
    'body-l': {
      fontFamily: 'sans',
      fontWeight: 400,
      fontSize: '1.125rem',
      lineHeight: 1.56,
      letterSpacing: '0',
    },
    body: {
      fontFamily: 'sans',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.625,
      letterSpacing: '0',
    },
    'body-s': {
      fontFamily: 'sans',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0',
    },
    caption: {
      fontFamily: 'sans',
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.04em',
    },
    mono: {
      fontFamily: 'mono',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0',
    },
    'mono-meta': {
      fontFamily: 'mono',
      fontWeight: 500,
      fontSize: '0.75rem',
      lineHeight: 1.5,
      letterSpacing: '0.04em',
    },
  },

  motion: {
    easing: {
      quint: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
    duration: {
      micro: '150ms',
      short: '280ms',
      medium: '500ms',
      long: '800ms',
    },
  },

  spacing: {
    base: 8,
    scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160, 200] as const,
  },

  borders: {
    width: '1px',
    radius: {
      none: '0px',
      sm: '4px',
      md: '8px',
    },
  },
} as const;

export type Tokens = typeof tokens;
