import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Projetos',
  description: 'Projetos de Aurimar Nogueira em loyalty, fintech e inovação.',
};

export const revalidate = 60;

export default async function ProjetosPage() {
  let allProjects: (typeof projects.$inferSelect)[] = [];
  try {
    allProjects = await db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(desc(projects.year));
  } catch {
    // DB not available
  }

  return (
    <>
      <PageHero
        eyebrow="PROJETOS"
        title="O que construí"
        lead="Projetos em loyalty, fintech, produto e inovação aplicada."
      />

      <section className="px-6 pb-16 md:px-12 md:pb-24 lg:px-16">
        <div className="mx-auto max-w-container">
          {allProjects.length === 0 ? (
            <p className="py-12 text-center text-body text-smoke">
              Projetos em breve.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projetos/${project.slug}`}
                  className="group border border-hairline p-8 transition-colors duration-200 hover:border-ink"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                      {project.year}
                    </span>
                    {project.isFeatured && (
                      <span className="border border-lime px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
                        DESTAQUE
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-heading text-h3">{project.title}</h3>
                  <p className="mt-2 text-body-s text-graphite line-clamp-3">{project.summary}</p>
                  {project.tags && (project.tags as string[]).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(project.tags as string[]).map((tag) => (
                        <span key={tag} className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center justify-end">
                    <ArrowUpRight size={16} strokeWidth={1.5} className="text-graphite transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
