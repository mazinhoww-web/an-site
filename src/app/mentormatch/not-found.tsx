import { SearchX } from 'lucide-react';
import Link from 'next/link';
import { ColorSchemeToggle, MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';

export const dynamic = 'force-dynamic';

/**
 * 404 premium do MentorMatch (tenant inexistente/inativo ou rota invalida).
 * Empty state com icone + H2 + body + CTA voltar, no design system canonico.
 * Inclui o toggle light/dark para validar dark mode nesta superficie.
 */
export default async function MentorMatchNotFound() {
  const theme = await resolveColorScheme();
  return (
    <MentorMatchThemeRoot
      theme={theme}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
        <ColorSchemeToggle initial={theme} />
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 16,
          padding: '24px 24px 80px',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: 'var(--r-xl)',
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
          }}
        >
          <SearchX size={40} />
        </span>
        <h2 className="mm-h2">Tenant nao encontrado</h2>
        <p className="mm-body" style={{ color: 'var(--text-secondary)', maxWidth: 460 }}>
          A organizacao que voce procura nao existe, foi desativada ou o endereco
          esta incorreto. Verifique o link ou volte para o inicio.
        </p>
        <Link href="/mentormatch" className="mm-btn mm-btn--secondary" style={{ marginTop: 8 }}>
          Voltar para o MentorMatch
        </Link>
      </div>
    </MentorMatchThemeRoot>
  );
}
