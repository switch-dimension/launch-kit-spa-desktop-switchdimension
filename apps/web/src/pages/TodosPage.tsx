import { useEffect, useState } from 'react';
import type { InferResponseType } from 'hono/client';
import { Trash2 } from 'lucide-react';
import { useApi } from '@/shared/lib/use-api';
import { api as publicApi } from '@/shared/lib/api-client';
import { Button } from '@/components/ui/button';

/** Inferred from the API route — no hand-written types to keep in sync. */
type Todo = InferResponseType<typeof publicApi.api.todos.$get, 200>[number];

function errorMessage(res: Response): string {
  return res.status === 401
    ? 'The API rejected your session. Check CLERK_SECRET_KEY in .env and restart the dev server.'
    : `Request failed (${res.status}).`;
}

export function TodosPage() {
  const api = useApi();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.api.todos
      .$get()
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setTodos(data);
        } else {
          setError(errorMessage(res));
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not reach the API. Is it running on port 3834?');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    if (!t || submitting) return;
    setSubmitting(true);
    const res = await api.api.todos.$post({ json: { title: t } });
    if (res.ok) {
      const created = await res.json();
      setTodos((prev) => [created, ...prev]);
      setTitle('');
    } else {
      setError(errorMessage(res));
    }
    setSubmitting(false);
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const res = await api.api.todos[':id'].$patch({
      param: { id: String(id) },
      json: { completed: !completed },
    });
    if (res.ok) {
      const updated = await res.json();
      setTodos((prev) => prev.map((todo) => (todo.id === id ? updated : todo)));
    } else {
      setError(errorMessage(res));
    }
  };

  const handleDelete = async (id: number) => {
    const res = await api.api.todos[':id'].$delete({ param: { id: String(id) } });
    if (res.ok) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } else {
      setError(errorMessage(res));
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-zinc-100">Todos</h1>
        <p className="mt-2 text-zinc-400">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-100">Todos</h1>
      <p className="mt-1 text-zinc-400">
        Minimal todo app — each user sees only their own todos (Drizzle + PostgreSQL).
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          maxLength={500}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting || !title.trim()}>
          Add
        </Button>
      </form>

      <ul className="mt-6 space-y-2">
        {todos.length === 0 ? (
          <li className="text-zinc-500">No todos yet. Add one above.</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar px-3 py-2"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
                className="size-4 rounded border-input"
                aria-label={`Mark "${todo.title}" as ${todo.completed ? 'not done' : 'done'}`}
              />
              <span
                className={
                  todo.completed ? 'flex-1 text-zinc-500 line-through' : 'flex-1 text-zinc-100'
                }
              >
                {todo.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(todo.id)}
                aria-label={`Delete "${todo.title}"`}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
