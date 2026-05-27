import { db } from '@/db';
import { skills } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { SkillsGrid } from './SkillsGrid';
import { PageHero } from '@/components/PageHero';

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
      <PageHero
        eyebrow="SKILLS"
        title="Metodologias empacotadas para Claude"
        lead="Frameworks de trabalho transformados em codigo executavel. Cada skill ensina o Claude a executar tarefas com o metodo especifico."
      />

      <SkillsGrid skills={allSkills} categories={categories} />
    </>
  );
}
