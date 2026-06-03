import { NextResponse } from "next/server"
import { requireStudent } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST() {
  const session = await requireStudent()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const totalPoints = await prisma.studentLesson.aggregate({
    where: { studentId: session.user.id },
    _sum: { score: true },
  })
  const points = totalPoints._sum.score ?? 0

  const approvedCoupons = await prisma.couponRequest.findMany({
    where: { studentId: session.user.id, status: "APPROVED" },
    select: { pointsCost: true },
  })
  const spentPoints = approvedCoupons.reduce((s, c) => s + c.pointsCost, 0)
  const spendablePoints = points - spentPoints

  const cost = 500

  if (spendablePoints < cost) {
    return NextResponse.json({ error: "Not enough points" }, { status: 400 })
  }

  const existing = await prisma.couponRequest.findUnique({
    where: { studentId_month_year: { studentId: session.user.id, month, year } },
  })

  if (existing && existing.status !== "REJECTED") {
    return NextResponse.json({ error: "Already requested this month" }, { status: 400 })
  }

  const request = await prisma.couponRequest.upsert({
    where: { studentId_month_year: { studentId: session.user.id, month, year } },
    create: { studentId: session.user.id, month, year, pointsCost: cost },
    update: { status: "PENDING", barcode: null, approvedAt: null, approvedBy: null },
  })

  return NextResponse.json({ request })
}
