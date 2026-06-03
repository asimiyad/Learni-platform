import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireStudent } from "@/lib/auth"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await requireStudent()
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      sections: {
        include: { blocks: { where: { stepOrder: { gt: -1 } } } },
      },
    },
  })
  if (!lesson || lesson.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Lesson not found or not published" }, { status: 404 })
  }

  const totalSteps = lesson.sections.reduce(
    (sum, s) => sum + s.blocks.length, 0
  )

  const existing = await prisma.studentLesson.findUnique({
    where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
  })
  if (existing) {
    return NextResponse.json({ enrollment: existing })
  }

  const enrollment = await prisma.studentLesson.create({
    data: {
      studentId: session.user.id,
      lessonId,
      status: "IN_PROGRESS",
      totalSteps,
      startedAt: new Date(),
    },
  })

  return NextResponse.json({ enrollment })
}
