import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let project: (typeof projects.$inferSelect) | undefined;
  try {
    const rows = await db.select().from(projects).where(eq(projects.slug, params.slug)).limit(1);
    project = rows[0];
  } catch { /* */ }
  if (!project) return { title: 'Projeto não encontrado' };
  return { title: project.title, description: project.summary };
}

export default async function ProjetoDetailPage({ params }: Props) {
  let project: (typeof projects.$inferSelect) | undefined;
  try {
    const rows = await db.select().from(projects).where(eq(projects.slug, params.slug)).limit(1);
    project = rows[0];
  } catch { /* */ }

  if (!project) notFound();

  return (
    <>
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            <Link href="/projetos" className="transition-colors hover:text-ink">PROJETOS</Link>
            {' / '}
            <span className="text-ink">{project.title}</span>
          </p>
          <div className="flex items-center gap-4">
            {project.year && (
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">{project.year}</span>
            )}
            {project.isFeatured && (
              <span className="border border-lime px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">DESTAQUE</span>
            )}
          </div>
          <h1 className="mt-4 max-w-3xl font-heading text-display-l">{project.title}</h1>
          <p className="mt-4 text-body-l text-graphite">{project.summary}</p>
          {project.tags && (project.tags as string[]).length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {(project.tags as string[]).map((tag) => (
                <span key={tag} className="border border-hairline px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">{tag}</span>
              ))}
            </div>
          )}
          <Hairline className="mt-8" />
        </div>
      </section>

      {project.contentMd && (
        <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
          <div className="mx-auto max-w-container">
            <div className="mx-auto max-w-prose space-y-6 text-body text-graphite">
              {project.contentMd.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {project.externalUrl && (
        <section className="px-6 pb-12 md:px-12 md:pb-20 lg:px-16">
          <div className="mx-auto max-w-container">
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ink px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-bone transition-colors duration-200 hover:text-lime"
            >
              VER PROJETO
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
          </div>
        </section>
      )}

      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-8" />
          <Link href="/projetos" className="group inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink">
            <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Ver todos os projetos
          </Link>
        </div>
      </section>
    </>
  );
}
