CREATE TYPE "public"."priority" AS ENUM('LOW', 'MEDIUM', 'HIGH');--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "currentTrip" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "finishedTrip" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "upcomingTrip" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "destination" ADD COLUMN "priority" "priority" DEFAULT 'LOW';