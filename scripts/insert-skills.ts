import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFileSync } from 'fs';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/db/schema';

async function main() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) { console.error('No DATABASE_URL'); process.exit(1); }

  const client = postgres(url);
  const db = drizzle(client, { schema });

  const skills = JSON.parse(readFileSync('.planning/skills-metadata.json', 'utf-8'));
  const toInsert = skills.filter((s: any) => s.blob_url && !s.upload_error);

  console.log(`Inserting ${toInsert.length} skills...`);

  let inserted = 0;
  for (const s of toInsert) {
    try {
      await db.insert(schema.skills).values({
        slug: s.slug,
        name: s.name,
        description: s.description,
        content: s.content,
        category: s.category,
        version: s.version || '1.0.0',
        blobUrl: s.blob_url,
        assetBlobKey: s.asset_blob_key,
        assetFilename: s.asset_filename,
        assetFormat: s.asset_format,
        assetSizeKb: s.asset_size_kb,
        author: s.author,
        sourceUrl: s.source_url || null,
        isCurated: s.is_curated,
        published: s.published,
      });
      inserted++;
      console.log(`[${inserted}/${toInsert.length}] OK: ${s.slug}`);
    } catch (err: any) {
      console.error(`FAIL: ${s.slug} - ${err.message}`);
    }
  }

  // Validate
  const rows = await db.select().from(schema.skills);
  const byCat = rows.reduce((a: any, s) => { a[s.category] = (a[s.category] || 0) + 1; return a; }, {} as Record<string, number>);
  const withBlob = rows.filter(r => r.blobUrl).length;

  console.log(`\n--- RESULTADO ---`);
  console.log(`Total no banco: ${rows.length}`);
  console.log(`Com blob_url: ${withBlob}`);
  console.log(`Por categoria:`, JSON.stringify(byCat));

  await client.end();
  process.exit(0);
}

main();
