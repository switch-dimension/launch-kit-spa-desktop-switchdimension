import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';
import { db } from '../lib/db/index.js';
import { todos } from '../lib/db/schema.js';

export const todosRoute = new Hono()
  .get('/todos', async (c) => {
    const result = await db.select().from(todos).orderBy(desc(todos.createdAt));
    return c.json(result);
  })
  .post('/todos', async (c) => {
    const body = await c.req.json<{ title: string }>();
    const title = body?.title?.trim();
    if (!title) {
      return c.json({ error: 'title is required' }, 400);
    }
    const [inserted] = await db
      .insert(todos)
      .values({ title })
      .returning();
    return c.json(inserted!, 201);
  })
  .patch('/todos/:id', async (c) => {
    const id = Number(c.req.param('id'));
    if (Number.isNaN(id)) {
      return c.json({ error: 'invalid id' }, 400);
    }
    const body = await c.req.json<{ completed?: boolean }>();
    const [updated] = await db
      .update(todos)
      .set({ completed: body.completed ?? true })
      .where(eq(todos.id, id))
      .returning();
    if (!updated) {
      return c.json({ error: 'not found' }, 404);
    }
    return c.json(updated);
  });
