-- Todos are now owned by a Clerk user. Rows created before this migration have no
-- owner, so they're tagged 'unassigned' (hidden from everyone) instead of failing
-- or being deleted. Remove them with: DELETE FROM "todos" WHERE "user_id" = 'unassigned';
ALTER TABLE "todos" ADD COLUMN "user_id" text NOT NULL DEFAULT 'unassigned';--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "user_id" DROP DEFAULT;--> statement-breakpoint
CREATE INDEX "todos_user_id_idx" ON "todos" USING btree ("user_id");
