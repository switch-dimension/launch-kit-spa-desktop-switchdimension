import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Load the root .env (two levels above apps/api/{src,dist}). Real environment
// variables always win, so hosts that inject env vars don't need a .env file.
const envPath = resolve(import.meta.dirname, '../../../../.env');
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5167'];

function list(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function isRealKey(value: string | undefined, prefix: string): value is string {
  return !!value && value.startsWith(prefix) && value.length > prefix.length + 5;
}

const allowedOrigins = list(process.env.ALLOWED_ORIGINS);

export const env = {
  port: Number(process.env.PORT) || 3834,
  databaseUrl: process.env.DATABASE_URL,
  /** Origins allowed to call the API (CORS) and to mint session tokens for it (Clerk `azp`). */
  allowedOrigins: allowedOrigins.length > 0 ? allowedOrigins : DEFAULT_ALLOWED_ORIGINS,
  clerkSecretKey: isRealKey(process.env.CLERK_SECRET_KEY, 'sk_')
    ? process.env.CLERK_SECRET_KEY
    : undefined,
  /** Optional PEM public key for networkless token verification (Clerk Dashboard → API Keys → JWT public key). */
  clerkJwtKey: process.env.CLERK_JWT_KEY || undefined,
  // Same value as the frontend key, so fall back to it — one less thing to configure.
  clerkPublishableKey: [process.env.CLERK_PUBLISHABLE_KEY, process.env.VITE_CLERK_PUBLISHABLE_KEY].find(
    (k) => isRealKey(k, 'pk_')
  ),
};
