import { NextResponse } from "next/server"
import { requireStudent } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await requireStudent()

  const badges = await prisma.weeklyBadge.findMany({
    where: { studentId: session.user.id },
    orderBy: { weekStart: "desc" },
    take: 20,
  })

  return NextResponse.json({ badges })
}
