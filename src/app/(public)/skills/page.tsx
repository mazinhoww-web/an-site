import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Eyebrow } from '@/components/brand/Eyebrow';
import { Hairline } from '@/components/brand/Hairline';
import { SkillsGrid } from './SkillsGrid';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const allSkills = await db
    .select({
      slug: skills.slug,
      name: skills.name,
      description: skills.description,
      category: skills.category,
      downloads: skills.downloads,
      stars: skills.stars,
      usageRank: skills.usageRank,
      author: skills.author,
      isCurated: skills.isCurated,
      assetFormat: skills.assetFormat,
    })
    .from(skills)
    .where(eq(skills.published, true));

  const categories = ['TODOS', ...new Set(allSkills.map((s) => s.category))];

  return (
    <>
      <section className="px-6 py-20 md:px-12 md:py-32 lg:px-16">
        <div className="mx-auto max-w-container">
          <Eyebrow className="mb-4 block">SKILLS</Eyebrow>
          <h1 className="font-heading text-display-m">Metodologias empacotadas para Claude</h1>
          <p className="mt-4 max-w-prose text-body-l text-graphite">
            Frameworks de trabalho transformados em codigo executavel.
            Cada skill ensina o Claude a executar tarefas com o metodo especifico.
          </p>
          <Hairline className="mt-8" />
        </div>
      </section>

      <SkillsGrid skills={allSkills} categories={categories} />
    </>
  );
}
