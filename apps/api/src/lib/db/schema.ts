import {
  boolean,
  index,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const todos = pgTable(
  'todos',
  {
    id: serial('id').primaryKey(),
    /** Clerk user ID of the owner. */
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    completed: boolean('completed').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => [index('todos_user_id_idx').on(t.userId)]
);
