import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  await requireTeacher()

  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const badges = await prisma.weeklyBadge.findMany({
    where: { weekStart: monday },
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ badges, weekStart: monday })
}
