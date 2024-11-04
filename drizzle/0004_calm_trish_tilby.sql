DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "task" (
	"id" text PRIMARY KEY NOT NULL,
	"workspaceId" text NOT NULL,
	"projectId" text NOT NULL,
	"assigneeId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "status" NOT NULL,
	"position" integer NOT NULL,
	"dueDate" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_workspaceId_workspace_id_fk" FOREIGN KEY ("workspaceId") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "task" ADD CONSTRAINT "task_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
