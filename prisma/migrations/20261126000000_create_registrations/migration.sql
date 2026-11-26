CREATE TABLE "registrations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "country_code" VARCHAR(10) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "full_phone" VARCHAR(25) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "source" VARCHAR(30) NOT NULL DEFAULT 'direct',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "idx_registrations_unique_phone" ON "registrations"("full_phone");
CREATE INDEX "idx_registrations_created_at" ON "registrations"("created_at" DESC);
