import { Hono } from 'hono';
import { validate } from '../lib/validate.js';
import { z } from 'zod';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../lib/db/index.js';
import { todos } from '../lib/db/schema.js';
import { requireAuth, type AuthEnv } from '../middleware/auth.js';

const createTodoSchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(500),
});

const updateTodoSchema = z.object({
  completed: z.boolean(),
});

const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Every query is scoped to the signed-in user, so users can only see and
// change their own todos.
export const todosRoute = new Hono<AuthEnv>()
  .use('/todos', requireAuth)
  .use('/todos/*', requireAuth)
  .get('/todos', async (c) => {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, c.var.userId))
      .orderBy(desc(todos.createdAt));
    return c.json(result);
  })
  .post('/todos', validate('json', createTodoSchema), async (c) => {
    const { title } = c.req.valid('json');
    const [inserted] = await db
      .insert(todos)
      .values({ title, userId: c.var.userId })
      .returning();
    return c.json(inserted!, 201);
  })
  .patch(
    '/todos/:id',
    validate('param', idParamSchema),
    validate('json', updateTodoSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const { completed } = c.req.valid('json');
      const [updated] = await db
        .update(todos)
        .set({ completed })
        .where(and(eq(todos.id, id), eq(todos.userId, c.var.userId)))
        .returning();
      if (!updated) {
        return c.json({ error: 'not found' }, 404);
      }
      return c.json(updated, 200);
    }
  )
  .delete('/todos/:id', validate('param', idParamSchema), async (c) => {
    const { id } = c.req.valid('param');
    const [deleted] = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, c.var.userId)))
      .returning({ id: todos.id });
    if (!deleted) {
      return c.json({ error: 'not found' }, 404);
    }
    return c.json(deleted, 200);
  });
