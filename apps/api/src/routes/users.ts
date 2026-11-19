import { Hono } from 'hono';
import { requireAuth, type AuthEnv } from '../middleware/auth.js';

/** Returns the signed-in user's Clerk ID. Handy for checking auth end-to-end. */
export const usersRoute = new Hono<AuthEnv>().get('/me', requireAuth, (c) =>
  c.json({ userId: c.var.userId })
);
