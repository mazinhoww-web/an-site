import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getDbUrl } from '@/lib/db-url';
import * as schema from './schema';

const client = postgres(getDbUrl());
export const db = drizzle(client, { schema });
