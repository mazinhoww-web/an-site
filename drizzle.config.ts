import type { Config } from 'drizzle-kit';
import { getDbUrl } from './src/lib/db-url';

export default {
  schema: ['./src/db/schema.ts', './src/lib/mentormatch/db/schema.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDbUrl(),
  },
} satisfies Config;
