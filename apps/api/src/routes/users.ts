import { Hono } from 'hono';
import { db } from '../lib/db/index.js';
import { users } from '../lib/db/schema.js';

export const usersRoute = new Hono()
  .get('/users', async (c) => {
    const result = await db.select().from(users);
    return c.json(result);
  });
