import { NextResponse } from "next/server"
import { requireStudent } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST() {
  const session = await requireStudent()

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await prisma.dailyActivity.findUnique({
    where: { studentId_date: { studentId: session.user.id, date: today } },
  })

  if (existing) return NextResponse.json({ alreadyRecorded: true })

  const activity = await prisma.dailyActivity.create({
    data: { studentId: session.user.id, date: today },
  })

  return NextResponse.json({ activity })
}
