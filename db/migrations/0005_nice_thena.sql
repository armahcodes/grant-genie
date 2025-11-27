CREATE TABLE "genie_executions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" integer NOT NULL,
	"execution_number" integer NOT NULL,
	"input_snapshot" jsonb,
	"output_snapshot" text,
	"duration_ms" integer,
	"tokens_used" integer,
	"status" text DEFAULT 'success' NOT NULL,
	"error_message" text,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genie_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"genie_type" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"config" jsonb DEFAULT '{}' NOT NULL,
	"input_data" jsonb,
	"output_content" text,
	"output_metadata" jsonb,
	"conversation_history" jsonb,
	"execution_count" integer DEFAULT 0,
	"last_executed_at" timestamp,
	"grant_application_id" integer,
	"donor_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"session_token" text NOT NULL,
	"device" text,
	"browser" text,
	"os" text,
	"location" text,
	"ip_address" text,
	"user_agent" text,
	"is_current" boolean DEFAULT false,
	"last_active" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
ALTER TABLE "genie_executions" ADD CONSTRAINT "genie_executions_session_id_genie_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."genie_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genie_sessions" ADD CONSTRAINT "genie_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genie_sessions" ADD CONSTRAINT "genie_sessions_grant_application_id_grant_applications_id_fk" FOREIGN KEY ("grant_application_id") REFERENCES "public"."grant_applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genie_sessions" ADD CONSTRAINT "genie_sessions_donor_id_donors_id_fk" FOREIGN KEY ("donor_id") REFERENCES "public"."donors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;