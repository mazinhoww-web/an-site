import { drizzle as drizzleVercel } from 'drizzle-orm/vercel-postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { sql } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';
import { getDbUrl } from '@/lib/db-url';
import * as schema from './schema';

function createDb() {
  if (process.env.POSTGRES_URL) {
    return drizzleVercel(sql, { schema });
  }
  const client = neon(getDbUrl());
  return drizzleNeon(client, { schema });
}

export const db = createDb();
