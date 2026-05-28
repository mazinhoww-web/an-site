import { config } from 'dotenv';
config({ path: '.env.local' });

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
const client = postgres(url);
const db = drizzle(client);

const ranks: [string, number][] = [
  ['market-research-reports', 1],
  ['gtm-engineering', 2],
  ['revops-gtm-strategy', 3],
  ['gtm-automation-agents', 4],
  ['market-sizing', 5],
  ['competitive-landscape', 6],
  ['product-management-digital', 7],
  ['research-ops', 8],
  ['get-shit-done', 9],
];

async function main() {
  for (const [slug, rank] of ranks) {
    const result = await db.execute(
      sql`UPDATE skills SET usage_rank = ${rank} WHERE slug = ${slug}`
    );
    console.log(`${slug} -> rank ${rank}`);
  }
  console.log('done');
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
