ALTER TABLE "registrations"
  ALTER COLUMN "category" DROP NOT NULL,
  ADD COLUMN "company" VARCHAR(100),
  ADD COLUMN "interests" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "description" VARCHAR(1000);
