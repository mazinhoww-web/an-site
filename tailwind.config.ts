import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
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
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      maxWidth: {
        container: '1280px',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        snug: '-0.01em',
        wide: '0.04em',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
