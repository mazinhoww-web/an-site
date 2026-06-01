import { redirect } from 'next/navigation';
import { Clock } from 'lucide-react';
import { ColorSchemeToggle, MentorMatchThemeRoot } from '@/mentormatch/design-system';
import { getMmUserFromDb } from '@/lib/mentormatch/auth-helpers';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { mmSignOut } from '@/lib/mentormatch/auth';

export const dynamic = 'force-dynamic';

// Tela de "conta aguardando aprovacao". Destino do auto-cadastro (sem convite)
// em tenant real: a conta fica PENDING ate o admin aprovar. Fora do subtree
// guardado /t/[slug] para nao gerar loop de redirect com o guard de pendencia.
export default async function MentorMatchPendingPage() {
  const user = await getMmUserFromDb();
  if (!user) redirect('/mentormatch/login');
  // Ja aprovado (ou conta default/demo): segue o fluxo normal.
  if (user.status !== 'PENDING') redirect('/mentormatch/continue');

  const theme = await resolveColorScheme();

  async function signOut() {
    'use server';
    await mmSignOut({ redirectTo: '/mentormatch/login' });
  }

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
            color: 'var(--brand)',
          }}
        >
          <Clock size={40} />
        </span>
        <h2 className="mm-h2">Conta aguardando aprovacao</h2>
        <p className="mm-body" style={{ color: 'var(--text-secondary)', maxWidth: 460 }}>
          Seu cadastro foi recebido. Um administrador da organizacao precisa
          aprovar seu acesso antes de voce entrar no programa. Voce sera avisado
          por email quando a aprovacao acontecer.
        </p>
        <form action={signOut} style={{ marginTop: 8 }}>
          <button type="submit" className="mm-btn mm-btn--secondary">
            Sair
          </button>
        </form>
      </div>
    </MentorMatchThemeRoot>
  );
}
