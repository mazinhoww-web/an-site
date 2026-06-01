'use client';

import type { ReactNode } from 'react';

interface CtaConfig {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  steps?: string[];
  primaryCta?: CtaConfig;
  secondaryCta?: { label: string; onClick: () => void };
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  steps,
  primaryCta,
  secondaryCta,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 12,
        padding: compact ? '24px 16px' : '48px 24px',
        background: 'var(--glass)',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-card)',
        color: 'var(--text)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: compact ? 40 : 52,
          height: compact ? 40 : 52,
          borderRadius: 12,
          background: 'var(--surface)',
          color: 'var(--text-muted)',
        }}
      >
        {icon}
      </div>
      <h3 style={{ margin: 0, fontSize: compact ? 14 : 16, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', maxWidth: 360 }}>{description}</p>

      {steps && steps.length > 0 && (
        <ol
          style={{
            margin: '4px 0 0',
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            textAlign: 'left',
          }}
        >
          {steps.map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12.5, color: 'var(--text-sub)' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: 'var(--brand)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}

      {(primaryCta || secondaryCta) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
          {primaryCta && (
            <button
              type="button"
              onClick={primaryCta.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 'var(--radius-btn)',
                border: 'none',
                background: 'var(--brand)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
              }}
            >
              {primaryCta.icon}
              {primaryCta.label}
            </button>
          )}
          {secondaryCta && (
            <button
              type="button"
              onClick={secondaryCta.onClick}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-btn)',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
              }}
            >
              {secondaryCta.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
