import { NextResponse } from "next/server"
import { requireStudent } from "@/lib/auth"
import { prisma } from "@/lib/db"

function getCurrentTerm(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  let term: number
  if (month <= 4) term = 1
  else if (month <= 8) term = 2
  else term = 3
  return `${year}-T${term}`
}

export async function GET() {
  const session = await requireStudent()

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()
  const currentTerm = getCurrentTerm()

  const totalPoints = await prisma.studentLesson.aggregate({
    where: { studentId: session.user.id },
    _sum: { score: true },
  })

  const completedLessons = await prisma.studentLesson.count({
    where: { studentId: session.user.id, status: "COMPLETED", score: { gte: 90 } },
  })

  const points = totalPoints._sum.score ?? 0

  const approvedCoupons = await prisma.couponRequest.findMany({
    where: { studentId: session.user.id, status: "APPROVED" },
    select: { pointsCost: true },
  })
  const spentPoints = approvedCoupons.reduce((s, c) => s + c.pointsCost, 0)
  const spendablePoints = points - spentPoints

  const existingCoupon = await prisma.couponRequest.findUnique({
    where: { studentId_month_year: { studentId: session.user.id, month: currentMonth, year: currentYear } },
  })

  const activities = await prisma.dailyActivity.findMany({
    where: { studentId: session.user.id },
    orderBy: { date: "desc" },
  })

  let currentStreak = 0
  if (activities.length > 0) {
    const todayStr = new Date().toISOString().split("T")[0]
    const latestDate = activities[0].date.toISOString().split("T")[0]
    if (latestDate >= todayStr) {
      currentStreak = 1
      for (let i = 1; i < activities.length; i++) {
        const prev = new Date(activities[i - 1].date)
        const curr = new Date(activities[i].date)
        const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
        if (diff === 1) currentStreak++
        else break
      }
    }
  }

  const existingTermly = await prisma.termlyRewardRequest.findUnique({
    where: { studentId_term: { studentId: session.user.id, term: currentTerm } },
  })

  const termEligible = points >= 2000 && currentStreak >= 20 && completedLessons >= 5

  return NextResponse.json({
    points,
    spendablePoints,
    couponAvailable: !existingCoupon || existingCoupon.status === "REJECTED",
    couponPending: existingCoupon?.status === "PENDING",
    couponApproved: existingCoupon?.status === "APPROVED",
    couponBarcode: existingCoupon?.barcode ?? null,
    couponPointsCost: 500,
    termEligible,
    termPending: existingTermly?.status === "PENDING",
    termApproved: existingTermly?.status === "APPROVED" || existingTermly?.status === "REDEEMED",
    termRequirements: {
      points: { current: points, needed: 2000, met: points >= 2000 },
      streak: { current: currentStreak, needed: 20, met: currentStreak >= 20 },
      mastery: { current: completedLessons, needed: 5, met: completedLessons >= 5 },
    },
  })
}
