import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireStudent } from "@/lib/auth"

export async function GET() {
  const session = await requireStudent()

  const lessons = await prisma.lesson.findMany({
    where: { status: "PUBLISHED" },
    include: {
      subject: true,
      teacher: { select: { name: true } },
      sections: {
        include: { blocks: true },
        orderBy: { orderIndex: "asc" },
      },
      enrollments: {
        where: { studentId: session.user.id },
        select: { status: true, score: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ lessons })
}
