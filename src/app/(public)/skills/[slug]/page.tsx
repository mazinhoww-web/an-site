import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import matter from 'gray-matter';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Label } from '@/components/brand/Label';
import { Hairline } from '@/components/brand/Hairline';
import { SkillDetailClient } from './SkillDetailClient';
import { SkillContentAccordion } from './SkillContentAccordion';
import { StarButton } from '@/components/skills/StarButton';

export const dynamic = 'force-dynamic';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [skill] = await db.select().from(skills).where(eq(skills.slug, params.slug)).limit(1);
  if (!skill) return { title: 'Skill' };
  return { title: skill.name, description: skill.description };
}

function extractSummary(content: string): string {
  const lines = content.split('\n');
  const paragraphs: string[] = [];
  let foundFirstHeading = false;

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (foundFirstHeading) break;
      foundFirstHeading = true;
      continue;
    }
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('---')) {
      paragraphs.push(trimmed);
    }
    if (paragraphs.length >= 4) break;
  }

  return paragraphs.join('\n\n');
}

const INSTALL_INSTRUCTIONS: Record<string, string> = {
  skill: 'Arraste para o Claude Cowork ou cole em ~/.claude/skills/',
  zip: 'Extraia para ~/.claude/skills/ e reinicie o Claude Code',
  md: 'Copie o conteudo e cole em uma conversa do Claude',
};

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

  const { content: bodyContent } = matter(skill.content);
  const summary = extractSummary(bodyContent);

  return (
    <div className="overflow-x-hidden">
      {/* Breadcrumb */}
      <section className="px-6 pt-20 md:px-12 md:pt-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <p className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
            <Link href="/skills" className="transition-colors hover:text-ink">SKILLS</Link>
            {' / '}
            <span className="text-ink">{skill.name}</span>
          </p>
        </div>
      </section>

      {/* Main: 2 columns */}
      <section className="px-6 pb-20 md:px-12 md:pb-32 lg:px-16">
        <div className="mx-auto grid max-w-container gap-8 lg:grid-cols-[1fr_400px]">

          {/* LEFT: content */}
          <div className="min-w-0">
            {/* Header */}
            <Label className="mb-3 block">{skill.category}</Label>
            <h1 className="max-w-3xl break-words font-heading text-display-l">{skill.name}</h1>
            <p className="mt-4 text-body-l text-graphite" style={{ overflowWrap: 'anywhere' }}>{skill.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {skill.author && (
                <span className="inline-flex items-center gap-1 border border-hairline px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-smoke">
                  {skill.isCurated ? 'Curado por ' : 'Por '}
                  {skill.sourceUrl ? (
                    <a href={skill.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-ink underline decoration-lime">{skill.author}</a>
                  ) : (
                    <span className="text-ink">{skill.author}</span>
                  )}
                </span>
              )}
              {skill.assetFormat && (
                <span className="border border-lime px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
                  .{skill.assetFormat}
                </span>
              )}
            </div>

            <Hairline className="my-8" />

            {/* Sobre essa skill */}
            <Eyebrow className="mb-4 block">SOBRE ESSA SKILL</Eyebrow>
            <div className="max-w-prose space-y-4 text-body text-graphite">
              {summary.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Accordion: SKILL.md completo */}
            <div className="mt-8">
              <SkillContentAccordion content={bodyContent} />
            </div>
          </div>

          {/* RIGHT: sidebar sticky */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-hairline bg-paper p-6">
              {/* Download + Star buttons */}
              <SkillDetailClient
                skillSlug={skill.slug}
                skillName={skill.name}
                downloadLabel={formatLabel[skill.assetFormat ?? 'skill'] ?? 'Baixar'}
              />
              <div className="mt-3">
                <StarButton slug={skill.slug} initialStars={skill.stars ?? 0} />
              </div>

              <Hairline className="my-6" />

              {/* Metadata */}
              <div className="space-y-3">
                {skill.assetFormat && (
                  <div className="flex justify-between font-mono text-[10px] font-medium uppercase tracking-[0.08em]">
                    <span className="text-smoke">Formato</span>
                    <span className="text-ink">.{skill.assetFormat}</span>
                  </div>
                )}
                {skill.assetSizeKb && (
                  <div className="flex justify-between font-mono text-[10px] font-medium uppercase tracking-[0.08em]">
                    <span className="text-smoke">Tamanho</span>
                    <span className="text-ink">{skill.assetSizeKb} KB</span>
                  </div>
                )}
                {skill.version && (
                  <div className="flex justify-between font-mono text-[10px] font-medium uppercase tracking-[0.08em]">
                    <span className="text-smoke">Versao</span>
                    <span className="text-ink">{skill.version}</span>
                  </div>
                )}
                {skill.author && (
                  <div className="flex justify-between font-mono text-[10px] font-medium uppercase tracking-[0.08em]">
                    <span className="text-smoke">Autor</span>
                    <span className="text-ink">{skill.author}</span>
                  </div>
                )}
                <div className="flex justify-between font-mono text-[10px] font-medium uppercase tracking-[0.08em]">
                  <span className="text-smoke">Downloads</span>
                  <span className="text-ink">{(skill.downloads ?? 0).toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <Hairline className="my-6" />

              {/* Como instalar */}
              <Eyebrow className="mb-3 block">COMO INSTALAR</Eyebrow>
              <p className="text-body-s text-graphite">
                {INSTALL_INSTRUCTIONS[skill.assetFormat ?? 'skill'] ?? 'Baixe e siga as instrucoes do arquivo.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedFiltered.length > 0 && (
        <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
          <div className="mx-auto max-w-container">
            <Eyebrow className="mb-6 block">SKILLS RELACIONADAS</Eyebrow>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedFiltered.map((r) => (
                <Link
                  key={r.slug}
                  href={`/skills/${r.slug}`}
                  className="border border-hairline p-6 transition-colors duration-200 hover:border-ink"
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

      {/* Back */}
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
    </div>
  );
}
