-- CreateTable
CREATE TABLE "GlobalTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'BEGINNER',
    "thumbnailUrl" TEXT,
    "estimatedMinutes" INTEGER,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT NOT NULL DEFAULT '',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "popularity" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTemplateSection" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "GlobalTemplateSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalTemplateBlock" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "blockType" TEXT NOT NULL,
    "config" TEXT NOT NULL DEFAULT '{}',
    "gridColumn" INTEGER NOT NULL DEFAULT 1,
    "gridWidth" INTEGER NOT NULL DEFAULT 12,

    CONSTRAINT "GlobalTemplateBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GlobalTemplate_subject_grade_idx" ON "GlobalTemplate"("subject", "grade");

-- CreateIndex
CREATE INDEX "GlobalTemplate_category_idx" ON "GlobalTemplate"("category");

-- CreateIndex
CREATE INDEX "GlobalTemplateSection_templateId_orderIndex_idx" ON "GlobalTemplateSection"("templateId", "orderIndex");

-- CreateIndex
CREATE INDEX "GlobalTemplateBlock_sectionId_idx" ON "GlobalTemplateBlock"("sectionId");

-- AddForeignKey
ALTER TABLE "GlobalTemplateSection" ADD CONSTRAINT "GlobalTemplateSection_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "GlobalTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalTemplateBlock" ADD CONSTRAINT "GlobalTemplateBlock_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "GlobalTemplateSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
