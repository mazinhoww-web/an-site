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
      fontSize: {
        'display-xl': [
          'clamp(3rem, 5vw, 5rem)',
          { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '700' },
        ],
        'display-l': [
          'clamp(2.25rem, 4vw, 3.5rem)',
          { lineHeight: '1.15', letterSpacing: '-0.03em', fontWeight: '700' },
        ],
        'display-m': [
          'clamp(1.75rem, 3vw, 2.5rem)',
          { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h1: [
          '2rem',
          { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '700' },
        ],
        h2: [
          '1.5rem',
          { lineHeight: '1.17', letterSpacing: '-0.01em', fontWeight: '600' },
        ],
        h3: [
          '1.25rem',
          { lineHeight: '1.2', letterSpacing: '0em', fontWeight: '500' },
        ],
        'body-l': [
          '1.125rem',
          { lineHeight: '1.56', letterSpacing: '0em', fontWeight: '400' },
        ],
        body: [
          '1rem',
          { lineHeight: '1.625', letterSpacing: '0em', fontWeight: '400' },
        ],
        'body-s': [
          '0.875rem',
          { lineHeight: '1.57', letterSpacing: '0em', fontWeight: '400' },
        ],
        caption: [
          '0.75rem',
          { lineHeight: '1.5', letterSpacing: '0.04em', fontWeight: '500' },
        ],
        mono: [
          '0.875rem',
          { lineHeight: '1.57', letterSpacing: '0em', fontWeight: '400' },
        ],
        'mono-meta': [
          '0.75rem',
          { lineHeight: '1.5', letterSpacing: '0.04em', fontWeight: '500' },
        ],
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
      borderColor: {
        DEFAULT: '#E5E3DC',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-lime': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'scroll-progress': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-up': 'slide-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 400ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'pulse-lime': 'pulse-lime 2s ease-in-out infinite',
        'scroll-progress': 'scroll-progress linear',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
