import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit loads this file as CommonJS, where import.meta.dirname is unavailable.
const configDir = typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;
const envPath = resolve(configDir, '../../.env');
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add it to the .env file in the project root.');
}

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
