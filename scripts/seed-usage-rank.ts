import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
const client = postgres(url);
const db = drizzle(client);

const ranks: [string, number][] = [
  ['gtm-engineering', 1],
  ['revops-gtm-strategy', 2],
  ['gtm-automation-ai-agents', 3],
  ['market-sizing', 4],
  ['wshobson-agents-competitive-landscape', 5],
  ['product-management-digital', 6],
  ['affaan-m-everything-claude-code-research-ops', 7],
  ['gsd-2-main', 8],
  ['market-research-reports', 9],
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
