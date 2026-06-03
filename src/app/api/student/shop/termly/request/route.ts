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

export async function POST() {
  const session = await requireStudent()

  const totalPoints = await prisma.studentLesson.aggregate({
    where: { studentId: session.user.id },
    _sum: { score: true },
  })
  const points = totalPoints._sum.score ?? 0

  const completedLessons = await prisma.studentLesson.count({
    where: { studentId: session.user.id, status: "COMPLETED", score: { gte: 90 } },
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

  if (points < 2000 || currentStreak < 20 || completedLessons < 5) {
    return NextResponse.json({ error: "Requirements not met" }, { status: 400 })
  }

  const term = getCurrentTerm()

  const existing = await prisma.termlyRewardRequest.findUnique({
    where: { studentId_term: { studentId: session.user.id, term } },
  })

  if (existing && existing.status !== "REJECTED") {
    return NextResponse.json({ error: "Already requested this term" }, { status: 400 })
  }

  const request = await prisma.termlyRewardRequest.upsert({
    where: { studentId_term: { studentId: session.user.id, term } },
    create: { studentId: session.user.id, term },
    update: { status: "PENDING" },
  })

  return NextResponse.json({ request })
}
