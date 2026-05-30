import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: 'rgb(var(--color-bone) / <alpha-value>)',
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        graphite: 'rgb(var(--color-graphite) / <alpha-value>)',
        smoke: 'rgb(var(--color-smoke) / <alpha-value>)',
        hairline: 'rgb(var(--color-hairline) / <alpha-value>)',
        lime: 'rgb(var(--color-lime) / <alpha-value>)',
        'lime-deep': 'rgb(var(--color-lime-deep) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        // MentorMatch white-label tokens (defined in src/styles/mentormatch/*.css).
        mm: {
          bg: 'var(--mm-bg)',
          card: 'var(--mm-card)',
          surface: 'var(--mm-surface)',
          text: 'var(--mm-text)',
          muted: 'var(--mm-muted)',
          sub: 'var(--mm-sub)',
          border: 'var(--mm-border)',
          primary: 'var(--mm-primary)',
          primary2: 'var(--mm-primary-2)',
          primaryfg: 'var(--mm-primary-fg)',
          secondary: 'var(--mm-secondary)',
          success: 'var(--mm-success)',
          warning: 'var(--mm-warning)',
          danger: 'var(--mm-danger)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        mmdisplay: ['var(--mm-font-display)'],
        mmbody: ['var(--mm-font-body)'],
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
        DEFAULT: 'rgb(var(--color-hairline))',
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
