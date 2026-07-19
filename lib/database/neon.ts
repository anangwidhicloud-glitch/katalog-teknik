import { neon } from '@neondatabase/serverless';

let databaseClient: ReturnType<typeof neon> | null = null;

export function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL belum tersedia di .env.local.');
  }

  if (!databaseClient) {
    databaseClient = neon(databaseUrl);
  }

  return databaseClient;
}
