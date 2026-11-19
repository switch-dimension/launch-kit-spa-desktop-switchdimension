import { createClerkClient } from '@clerk/backend';
import { createMiddleware } from 'hono/factory';
import { env } from '../lib/env.js';

export type AuthEnv = {
  Variables: {
    /** Clerk user ID of the signed-in user. Set by `requireAuth`. */
    userId: string;
  };
};

const clerk =
  env.clerkSecretKey && env.clerkPublishableKey
    ? createClerkClient({
        secretKey: env.clerkSecretKey,
        publishableKey: env.clerkPublishableKey,
        jwtKey: env.clerkJwtKey,
      })
    : null;

if (!clerk) {
  console.warn(
    '[auth] CLERK_SECRET_KEY and/or VITE_CLERK_PUBLISHABLE_KEY are not set. ' +
      'Protected API routes will return 401 until they are added to .env.'
  );
}

/**
 * Verifies the Clerk session token sent as `Authorization: Bearer <token>`
 * and exposes the user ID as `c.var.userId`. Responds 401 otherwise.
 */
export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  if (!clerk) {
    return c.json({ error: 'Auth is not configured on the server' }, 401);
  }

  const state = await clerk.authenticateRequest(c.req.raw, {
    acceptsToken: 'session_token',
    // Reject tokens minted for any other site.
    authorizedParties: env.allowedOrigins,
  });
  const auth = state.toAuth();

  if (!state.isAuthenticated || !auth?.userId) {
    // Helps debug common setup issues (e.g. the web origin missing from ALLOWED_ORIGINS).
    if (process.env.NODE_ENV !== 'production' && state.reason && c.req.header('authorization')) {
      console.warn(`[auth] Rejected session token: ${state.reason}${state.message ? ` — ${state.message}` : ''}`);
    }
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('userId', auth.userId);
  await next();
});
