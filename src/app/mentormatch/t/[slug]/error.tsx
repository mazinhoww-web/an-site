'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { MentorMatchThemeRoot } from '@/mentormatch/design-system';

// Error boundary do subtree do tenant (UX states: estado de erro premium no DS).
// Captura falhas de render/query e oferece tentar de novo, sem tela branca.
export default function TenantError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log client-side; a observabilidade server-side ja cobre os 5xx das APIs.
    console.error('[mm] tenant route error', error);
  }, [error]);

  return (
    <MentorMatchThemeRoot
      style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 'var(--r-xl)',
            background: 'var(--surface-2)',
            color: 'var(--warning)',
          }}
        >
          <AlertTriangle size={36} />
        </span>
        <h2 className="mm-h2">Algo deu errado</h2>
        <p className="mm-body" style={{ color: 'var(--text-secondary)', maxWidth: 420 }}>
          Nao foi possivel carregar esta area agora. Tente novamente; se persistir,
          recarregue a pagina.
        </p>
        <button type="button" className="mm-btn mm-btn--primary" onClick={reset}>
          Tentar de novo
        </button>
      </div>
    </MentorMatchThemeRoot>
  );
}
