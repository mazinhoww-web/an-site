import Link from 'next/link';
import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { mmPlan } from '@/lib/mentormatch/db/schema';
import { MentorMatchThemeRoot, Badge } from '@/mentormatch/design-system';
import { resolveColorScheme } from '@/lib/mentormatch/color-scheme';
import { ClearTenantCookie } from '@/components/mentormatch/landing/ClearTenantCookie';

const SECTION: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '64px 24px' };

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MentorMatch: Programas de Mentoria que Escalam',
  description:
    'Plataforma white-label para empresas criarem programas internos de mentoria com matching inteligente, fila de espera e relatorios.',
  openGraph: {
    title: 'MentorMatch: Programas de Mentoria que Escalam',
    description:
      'Plataforma white-label para empresas criarem programas internos de mentoria.',
  },
};

const FEATURES: [string, string][] = [
  ['Matching Inteligente', 'Conecta mentees a mentores por habilidades e capacidade.'],
  ['Fila de Espera', 'Mentor lotado? Fila automatica com promocao FIFO.'],
  ['White-Label', 'Cada empresa com sua marca, cores e dominio.'],
  ['Relatorios em Tempo Real', 'Acompanhe metricas do programa.'],
  ['Biblioteca', 'Materiais exclusivos por programa.'],
  ['Multi-Tenant', 'Um deploy, infinitos programas.'],
];

const STEPS: [string, string][] = [
  ['1', 'A empresa configura seu programa.'],
  ['2', 'Mentores se cadastram e definem habilidades.'],
  ['3', 'Mentorados encontram o mentor ideal.'],
  ['4', 'Conexao e acompanhamento via WhatsApp.'],
];

// Static fallback if the plans table is empty (prices in BRL cents).
const FALLBACK_PLANS = [
  { name: 'Free', slug: 'free', priceMonthly: 0 },
  { name: 'Starter', slug: 'starter', priceMonthly: 29900 },
  { name: 'Pro', slug: 'pro', priceMonthly: 79900 },
  { name: 'Enterprise', slug: 'enterprise', priceMonthly: 99999900 },
];

function priceLabel(slug: string, cents: number): string {
  if (slug === 'enterprise' || cents >= 1_000_000) return 'Sob consulta';
  if (cents === 0) return 'R$ 0';
  return `R$ ${Math.round(cents / 100)}/mes`;
}

export default async function MentorMatchLandingPage() {
  const rows = await db.select().from(mmPlan).orderBy(asc(mmPlan.priceMonthly));
  const plans = rows.length
    ? rows.map((p) => ({ name: p.name, slug: p.slug, priceMonthly: p.priceMonthly }))
    : FALLBACK_PLANS;
  const theme = await resolveColorScheme();

  return (
    <MentorMatchThemeRoot
      theme={theme}
      style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}
    >
      <ClearTenantCookie />

      {/* HERO */}
      <section style={{ ...SECTION, paddingTop: 96, paddingBottom: 96 }}>
        <h1 className="mm-display" style={{ maxWidth: 760 }}>
          MentorMatch: programas de mentoria que escalam
        </h1>
        <p className="mm-body" style={{ marginTop: 24, maxWidth: 640, color: 'var(--text-secondary)', fontSize: 18 }}>
          Plataforma white-label para empresas criarem programas internos de mentoria com matching
          inteligente, fila de espera e relatorios.
        </p>
        <div className="flex flex-wrap" style={{ marginTop: 32, gap: 12 }}>
          <Link href="/mentormatch/default" className="mm-btn mm-btn--primary" style={{ textDecoration: 'none' }}>
            Ver demonstracao
          </Link>
          <Link href="/contato" className="mm-btn mm-btn--secondary" style={{ textDecoration: 'none' }}>
            Solicitar demonstracao
          </Link>
        </div>
      </section>

      {/* RECURSOS */}
      <section style={SECTION}>
        <h2 className="mm-h1" style={{ marginBottom: 32 }}>Recursos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([title, desc]) => (
            <article key={title} className="mm-card">
              <h3 className="mm-h3">{title}</h3>
              <p className="mm-body-small" style={{ marginTop: 8, color: 'var(--text-secondary)' }}>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={SECTION}>
        <h2 className="mm-h1" style={{ marginBottom: 32 }}>Como funciona</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {STEPS.map(([n, desc]) => (
            <li key={n} className="mm-card">
              <span className="mm-display" style={{ color: 'var(--brand)' }}>{n}</span>
              <p className="mm-body-small" style={{ marginTop: 8, color: 'var(--text-secondary)' }}>{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* PLANOS */}
      <section style={SECTION}>
        <h2 className="mm-h1" style={{ marginBottom: 32 }}>Planos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const popular = p.slug === 'starter';
            return (
              <article key={p.slug} className="mm-card" style={popular ? { borderColor: 'var(--brand)' } : undefined}>
                {popular && (
                  <span style={{ display: 'inline-block', marginBottom: 8 }}>
                    <Badge tone="info">Mais popular</Badge>
                  </span>
                )}
                <h3 className="mm-h3">{p.name}</h3>
                <p className="mm-h2" style={{ marginTop: 8 }}>{priceLabel(p.slug, p.priceMonthly)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* CONTATO */}
      <section style={SECTION}>
        <h2 className="mm-h1" style={{ marginBottom: 16 }}>Quer levar o MentorMatch para sua empresa?</h2>
        <p className="mm-body" style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
          Fale com a gente e configuramos seu programa.
        </p>
        <Link href="/contato" className="mm-btn mm-btn--primary" style={{ textDecoration: 'none' }}>
          Solicitar demonstracao
        </Link>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{ ...SECTION, padding: '32px 24px' }}>
          <Link href="/" className="mm-body-small" style={{ color: 'var(--text-secondary)' }}>
            Aurimar Nogueira
          </Link>
        </div>
      </footer>
    </MentorMatchThemeRoot>
  );
}
