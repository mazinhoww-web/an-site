import Link from 'next/link';
import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { db } from '@/db';
import { mmPlan } from '@/lib/mentormatch/db/schema';
import { ClearTenantCookie } from '@/components/mentormatch/landing/ClearTenantCookie';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MentorMatch — Programas de Mentoria que Escalam',
  description:
    'Plataforma white-label para empresas criarem programas internos de mentoria com matching inteligente, fila de espera e relatorios.',
  openGraph: {
    title: 'MentorMatch — Programas de Mentoria que Escalam',
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

  return (
    <div className="theme-dark min-h-screen bg-mm-bg text-mm-text">
      <ClearTenantCookie />

      {/* HERO */}
      <section className="mx-auto max-w-container px-6 py-24">
        <h1 className="max-w-3xl font-mmdisplay text-display-xl">
          MentorMatch — Programas de Mentoria que Escalam
        </h1>
        <p className="mt-6 max-w-2xl text-body-l text-mm-muted">
          Plataforma white-label para empresas criarem programas internos de mentoria com matching
          inteligente, fila de espera e relatorios.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/mentormatch/default" className="rounded bg-mm-primary px-6 py-3 font-mmdisplay text-body text-mm-primaryfg hover:bg-mm-primary2">
            Ver demonstracao
          </Link>
          <Link href="/contato" className="rounded border border-mm-border px-6 py-3 font-mmdisplay text-body text-mm-text hover:border-mm-primary">
            Solicitar demonstracao
          </Link>
        </div>
      </section>

      {/* RECURSOS */}
      <section className="mx-auto max-w-container px-6 py-16">
        <h2 className="mb-8 font-mmdisplay text-h1">Recursos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([title, desc]) => (
            <article key={title} className="rounded border border-mm-border bg-mm-card p-6">
              <h3 className="font-mmdisplay text-h3">{title}</h3>
              <p className="mt-2 text-body-s text-mm-muted">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-container px-6 py-16">
        <h2 className="mb-8 font-mmdisplay text-h1">Como funciona</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, desc]) => (
            <li key={n} className="rounded border border-mm-border bg-mm-card p-6">
              <span className="font-mmdisplay text-display-m">{n}</span>
              <p className="mt-2 text-body-s text-mm-muted">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* PLANOS */}
      <section className="mx-auto max-w-container px-6 py-16">
        <h2 className="mb-8 font-mmdisplay text-h1">Planos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => {
            const popular = p.slug === 'starter';
            return (
              <article
                key={p.slug}
                className={`rounded border bg-mm-card p-6 ${popular ? 'border-mm-primary' : 'border-mm-border'}`}
              >
                {popular && (
                  <span className="mb-2 inline-block rounded bg-mm-secondary px-2 py-0.5 font-mono text-mono-meta text-mm-text">
                    Mais popular
                  </span>
                )}
                <h3 className="font-mmdisplay text-h3">{p.name}</h3>
                <p className="mt-2 font-mmdisplay text-h2">{priceLabel(p.slug, p.priceMonthly)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* CONTATO */}
      <section className="mx-auto max-w-container px-6 py-16">
        <h2 className="mb-4 font-mmdisplay text-h1">Quer levar o MentorMatch para sua empresa?</h2>
        <p className="mb-6 text-body text-mm-muted">Fale com a gente e configuramos seu programa.</p>
        <Link href="/contato" className="rounded bg-mm-primary px-6 py-3 font-mmdisplay text-body text-mm-primaryfg hover:bg-mm-primary2">
          Solicitar demonstracao
        </Link>
      </section>

      <footer className="border-t border-mm-border">
        <div className="mx-auto max-w-container px-6 py-8 text-body-s text-mm-muted">
          <Link href="/" className="hover:underline">
            Aurimar Nogueira
          </Link>
        </div>
      </footer>
    </div>
  );
}
