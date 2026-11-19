import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../env.js';

if (!env.databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env in the project root and set it (see README).'
  );
}

export const db = drizzle(env.databaseUrl);
