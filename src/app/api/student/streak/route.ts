import { NextResponse } from "next/server"
import { requireStudent } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await requireStudent()

  const activities = await prisma.dailyActivity.findMany({
    where: { studentId: session.user.id },
    orderBy: { date: "desc" },
  })

  let currentStreak = 0
  if (activities.length > 0) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split("T")[0]
    const latestDate = activities[0].date.toISOString().split("T")[0]
    if (latestDate < todayStr) {
      currentStreak = 0
    } else {
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

  let longestStreak = currentStreak
  for (let i = 0; i < activities.length; i++) {
    let s = 1
    for (let j = i + 1; j < activities.length; j++) {
      const prev = new Date(activities[j - 1].date)
      const curr = new Date(activities[j].date)
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      if (diff === 1) s++
      else break
    }
    if (s > longestStreak) longestStreak = s
  }

  const todayActive = activities.length > 0 && activities[0].date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]

  return NextResponse.json({
    currentStreak,
    longestStreak,
    todayActive,
    totalDays: activities.length,
  })
}
