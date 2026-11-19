import { env } from './lib/env.js';

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { bodyLimit } from 'hono/body-limit';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { healthRoute } from './routes/health.js';
import { todosRoute } from './routes/todos.js';
import { usersRoute } from './routes/users.js';

const app = new Hono()
  .use(logger())
  .use(secureHeaders())
  .use('/api/*', cors({ origin: env.allowedOrigins }))
  .use('/api/*', bodyLimit({ maxSize: 100 * 1024 }))
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse();
    }
    console.error(err);
    return c.json({ error: 'Internal Server Error' }, 500);
  })
  // Chain routes so their types flow into AppType (and the frontend client).
  .route('/api', healthRoute)
  .route('/api', todosRoute)
  .route('/api', usersRoute);

export type AppType = typeof app;

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`Hono API listening on http://localhost:${info.port}`);
});
