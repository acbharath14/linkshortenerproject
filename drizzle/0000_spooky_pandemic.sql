CREATE TABLE "click_analytics" (
	"id" text PRIMARY KEY NOT NULL,
	"shortened_url_id" text NOT NULL,
	"user_agent" text,
	"ip_address" varchar(45),
	"referer" text,
	"country" varchar(2),
	"clicked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shortened_urls" (
	"id" text PRIMARY KEY NOT NULL,
	"short_code" varchar(12) NOT NULL,
	"original_url" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"custom_alias" varchar(50),
	"description" text,
	"clicks" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shortened_urls_short_code_unique" UNIQUE("short_code"),
	CONSTRAINT "shortened_urls_custom_alias_unique" UNIQUE("custom_alias")
);
--> statement-breakpoint
CREATE INDEX "idx_url_id" ON "click_analytics" USING btree ("shortened_url_id");--> statement-breakpoint
CREATE INDEX "idx_clicked_at" ON "click_analytics" USING btree ("clicked_at");--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "shortened_urls" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_short_code" ON "shortened_urls" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "idx_custom_alias" ON "shortened_urls" USING btree ("custom_alias");--> statement-breakpoint
CREATE INDEX "idx_created_at" ON "shortened_urls" USING btree ("created_at");