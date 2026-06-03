-- CreateTable
CREATE TABLE "DailyActivity" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pointsEarned" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyBadge" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "pointsCost" INTEGER NOT NULL DEFAULT 500,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "barcode" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TermlyRewardRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "redeemedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TermlyRewardRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyActivity_studentId_idx" ON "DailyActivity"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyActivity_studentId_date_key" ON "DailyActivity"("studentId", "date");

-- CreateIndex
CREATE INDEX "WeeklyBadge_weekStart_idx" ON "WeeklyBadge"("weekStart");

-- CreateIndex
CREATE INDEX "WeeklyBadge_studentId_idx" ON "WeeklyBadge"("studentId");

-- CreateIndex
CREATE INDEX "CouponRequest_status_idx" ON "CouponRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CouponRequest_studentId_month_year_key" ON "CouponRequest"("studentId", "month", "year");

-- CreateIndex
CREATE INDEX "TermlyRewardRequest_status_idx" ON "TermlyRewardRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TermlyRewardRequest_studentId_term_key" ON "TermlyRewardRequest"("studentId", "term");

-- AddForeignKey
ALTER TABLE "DailyActivity" ADD CONSTRAINT "DailyActivity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyBadge" ADD CONSTRAINT "WeeklyBadge_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponRequest" ADD CONSTRAINT "CouponRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TermlyRewardRequest" ADD CONSTRAINT "TermlyRewardRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
