-- Restore blockGap column to Lesson
ALTER TABLE "Lesson" ADD COLUMN IF NOT EXISTS "blockGap" INTEGER DEFAULT 24;

-- Re-create SiteSetting table
CREATE TABLE IF NOT EXISTS "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SiteSetting_key_key" ON "SiteSetting"("key");
