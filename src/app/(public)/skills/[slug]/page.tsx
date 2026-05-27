import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { SkillDetailClient } from './SkillDetailClient';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [skill] = await db.select().from(skills).where(eq(skills.slug, params.slug)).limit(1);
  if (!skill) return { title: 'Skill' };
  return { title: skill.name, description: skill.description };
}

export default async function SkillDetailPage({ params }: Props) {
  const [skill] = await db.select().from(skills).where(eq(skills.slug, params.slug)).limit(1);
  if (!skill) notFound();

  const related = await db
    .select({ slug: skills.slug, name: skills.name, description: skills.description, category: skills.category, downloads: skills.downloads })
    .from(skills)
    .where(eq(skills.category, skill.category))
    .limit(4);
  const relatedFiltered = related.filter((r) => r.slug !== skill.slug).slice(0, 3);

  const formatLabel: Record<string, string> = {
    skill: 'Baixar .skill',
    zip: 'Baixar .zip',
    md: 'Baixar SKILL.md',
  };

  return (
    <>
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            <Link href="/skills" className="transition-colors hover:text-ink">SKILLS</Link>
            {' / '}
            <span className="text-ink">{skill.name}</span>
          </p>
          <Label className="mb-3 block">{skill.category}</Label>
          <h1 className="max-w-3xl font-heading text-display-l">{skill.name}</h1>
          <p className="mt-4 text-body-l text-graphite">{skill.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            {skill.author && (
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                {skill.isCurated ? 'Curado por ' : 'Por '}
                {skill.sourceUrl ? (
                  <a href={skill.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-lime">{skill.author}</a>
                ) : (
                  <span className="text-ink">{skill.author}</span>
                )}
              </span>
            )}
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
              {(skill.downloads ?? 0).toLocaleString('pt-BR')} downloads
            </span>
            {skill.assetFormat && (
              <span className="bg-ink px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-lime">
                {skill.assetFormat}
              </span>
            )}
            {skill.assetSizeKb && (
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                {skill.assetSizeKb}KB
              </span>
            )}
          </div>

          <Hairline className="mt-8" />
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <div className="max-w-prose whitespace-pre-wrap text-body text-graphite">
            {skill.content}
          </div>

          <div className="mt-12">
            <SkillDetailClient
              skillSlug={skill.slug}
              skillName={skill.name}
              downloadLabel={formatLabel[skill.assetFormat ?? 'skill'] ?? 'Baixar'}
            />
          </div>
        </div>
      </section>

      {relatedFiltered.length > 0 && (
        <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
          <div className="mx-auto max-w-container">
            <Eyebrow className="mb-6 block">SKILLS RELACIONADAS</Eyebrow>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFiltered.map((r) => (
                <Link
                  key={r.slug}
                  href={`/skills/${r.slug}`}
                  className="border border-hairline p-6 transition-colors duration-200 hover:border-lime"
                >
                  <Label className="mb-2 block">{r.category}</Label>
                  <h3 className="font-heading text-h3">{r.name}</h3>
                  <p className="mt-2 text-body-s text-graphite line-clamp-2">{r.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Hairline className="mb-8" />
          <Link
            href="/skills"
            className="group inline-flex items-center gap-2 text-body-s text-graphite transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Ver todas as skills
          </Link>
        </div>
      </section>
    </>
  );
}
