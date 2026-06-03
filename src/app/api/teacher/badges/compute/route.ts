import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"

function getMonday(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = (day + 6) % 7
  date.setDate(date.getDate() - diff)
  date.setHours(0, 0, 0, 0)
  return date
}

function getPreviousMonday(d: Date): Date {
  const monday = getMonday(d)
  const prev = new Date(monday)
  prev.setDate(prev.getDate() - 7)
  return prev
}

const QUIZ_BLOCK_TYPES = new Set(["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "ORDERING", "MATCHING"])

export async function POST() {
  await requireTeacher()

  const now = new Date()
  const weekStart = getMonday(now)
  const prevWeekStart = getPreviousMonday(now)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 7)
  const prevWeekEnd = new Date(prevWeekStart)
  prevWeekEnd.setDate(prevWeekEnd.getDate() + 7)

  const existing = await prisma.weeklyBadge.findMany({ where: { weekStart } })
  if (existing.length > 0) {
    return NextResponse.json({ error: "Badges already computed for this week" }, { status: 400 })
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, name: true },
  })

  const studentStats: Record<string, { points: number; accuracy: number; attempts: number; streak: number; prevPoints: number }> = {}

  for (const student of students) {
    const thisWeekAttempts = await prisma.blockAttempt.findMany({
      where: {
        studentLesson: { studentId: student.id },
        createdAt: { gte: weekStart, lt: weekEnd },
        block: { blockType: { in: Array.from(QUIZ_BLOCK_TYPES) } },
      },
      select: { pointsEarned: true, isCorrect: true },
    })

    const prevWeekAttempts = await prisma.blockAttempt.findMany({
      where: {
        studentLesson: { studentId: student.id },
        createdAt: { gte: prevWeekStart, lt: prevWeekEnd },
        block: { blockType: { in: Array.from(QUIZ_BLOCK_TYPES) } },
      },
      select: { pointsEarned: true },
    })

    const points = thisWeekAttempts.reduce((s, a) => s + a.pointsEarned, 0)
    const prevPoints = prevWeekAttempts.reduce((s, a) => s + a.pointsEarned, 0)
    const correct = thisWeekAttempts.filter((a) => a.isCorrect).length
    const total = thisWeekAttempts.length
    const accuracy = total > 0 ? correct / total : 0

    const activities = await prisma.dailyActivity.findMany({
      where: { studentId: student.id },
      orderBy: { date: "desc" },
      select: { date: true },
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

    studentStats[student.id] = { points, accuracy, attempts: total, streak: currentStreak, prevPoints }
  }

  const entries = Object.entries(studentStats)

  const pointsChamp = entries.sort((a, b) => b[1].points - a[1].points)[0]
  const accuracyEntries = entries.filter((e) => e[1].attempts >= 5)
  const accuracyChamp = accuracyEntries.length > 0
    ? accuracyEntries.sort((a, b) => b[1].accuracy - a[1].accuracy)[0]
    : null
  const persistenceChamp = entries.sort((a, b) => b[1].streak - a[1].streak)[0]
  const improvedEntries = entries
    .filter((e) => e[1].prevPoints > 0)
    .sort((a, b) => (b[1].points - b[1].prevPoints) - (a[1].points - a[1].prevPoints))
  const improvedChamp = improvedEntries.length > 0 ? improvedEntries[0] : null

  const badges: { studentId: string; weekStart: Date; title: string }[] = []

  if (pointsChamp && pointsChamp[1].points > 0) {
    badges.push({ studentId: pointsChamp[0], weekStart, title: "POINTS_CHAMPION" })
  }
  if (accuracyChamp) {
    badges.push({ studentId: accuracyChamp[0], weekStart, title: "ACCURACY_CHAMPION" })
  }
  if (persistenceChamp && persistenceChamp[1].streak > 0) {
    badges.push({ studentId: persistenceChamp[0], weekStart, title: "PERSISTENCE_CHAMPION" })
  }
  if (improvedChamp) {
    badges.push({ studentId: improvedChamp[0], weekStart, title: "MOST_IMPROVED" })
  }

  if (badges.length > 0) {
    await prisma.weeklyBadge.createMany({ data: badges })
  }

  const created = await prisma.weeklyBadge.findMany({
    where: { weekStart },
    include: { student: { select: { id: true, name: true, email: true } } },
  })

  return NextResponse.json({ badges: created })
}
