import { db } from '@/db';

// Serializable transaction with a small retry on Postgres serialization
// failures (SQLSTATE 40001). Capacity and waitlist position must be atomic
// (D-09): under concurrency, two requests could otherwise exceed maxMentees or
// duplicate a position.
const SERIALIZATION_FAILURE = '40001';

export async function runSerializable<T>(
  fn: Parameters<typeof db.transaction<T>>[0],
  retries = 3,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await db.transaction(fn, { isolationLevel: 'serializable' });
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      if (code === SERIALIZATION_FAILURE && attempt < retries) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}
