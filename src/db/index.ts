import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDbUrl } from '@/lib/db-url';
import * as schema from './schema';
import * as mmSchema from '@/lib/mentormatch/db/schema';

const client = postgres(getDbUrl());
// Both the an-site schema and the MentorMatch (mm_*) schema live in the same
// Postgres database; registering both here enables db.query.mm* access.
export const db = drizzle(client, { schema: { ...schema, ...mmSchema } });
