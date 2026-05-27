import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
const client = postgres(url);
const db = drizzle(client);

async function main() {
  await db.execute(sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS stars integer DEFAULT 0 NOT NULL`);
  await db.execute(sql`ALTER TABLE skills ADD COLUMN IF NOT EXISTS usage_rank integer`);
  console.log('columns stars + usage_rank added');
  await client.end();
}

main().catch((e) => { console.error(e); process.exit(1); });
