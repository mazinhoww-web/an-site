import { config } from 'dotenv';
config({ path: '.env.local' });

import { put, del } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join } from 'path';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { skills } from '../src/db/schema';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.POSTGRES_URL!);
const db = drizzle(sql);

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface SkillMeta {
  slug: string;
  original_file: string;
  asset_format: string;
  [key: string]: unknown;
}

async function main() {
  const metadata: SkillMeta[] = JSON.parse(
    readFileSync('.planning/skills-metadata.json', 'utf-8'),
  );
  const metaBySlug = new Map(metadata.map((m) => [m.slug, m]));

  const allSkills = await db.select().from(skills);
  const total = allSkills.length;
  let success = 0;
  let failed = 0;
  let skipped = 0;

  console.log(`Re-uploading ${total} skills as public...\n`);

  for (let i = 0; i < allSkills.length; i++) {
    const skill = allSkills[i];
    const meta = metaBySlug.get(skill.slug);

    if (!meta) {
      console.log(`[${i + 1}/${total}] SKIP: ${skill.slug} - sem metadata`);
      skipped++;
      continue;
    }

    const filePath = join('Skill', meta.original_file);
    const ext = meta.asset_format;
    const blobKey = `skills/${skill.slug}.${ext}`;

    try {
      const buffer = readFileSync(filePath);

      const result = await put(blobKey, buffer, {
        access: 'public',
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      const oldBlobUrl = skill.blobUrl;

      await db
        .update(skills)
        .set({
          blobUrl: result.url,
          assetBlobKey: result.pathname,
          updatedAt: new Date(),
        })
        .where(eq(skills.id, skill.id));

      if (oldBlobUrl && oldBlobUrl.includes('private.blob')) {
        try {
          await del(oldBlobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
        } catch {
          console.log(`  warn: falha ao deletar blob antigo de ${skill.slug}`);
        }
      }

      success++;
      console.log(
        `[${i + 1}/${total}] OK: ${skill.slug} (${Math.round(buffer.length / 1024)}KB) -> ${result.url.substring(0, 80)}...`,
      );

      if ((i + 1) % 10 === 0) {
        await sleep(1000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      failed++;
      console.log(`[${i + 1}/${total}] FAIL: ${skill.slug} - ${msg}`);
    }
  }

  console.log(`\n--- RESUMO ---`);
  console.log(`Sucesso: ${success}/${total}`);
  console.log(`Falha: ${failed}/${total}`);
  console.log(`Skip: ${skipped}/${total}`);

  process.exit(failed > 0 ? 1 : 0);
}

main();
