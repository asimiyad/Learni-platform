import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireStudent } from "@/lib/auth"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await requireStudent()
  const { lessonId } = await params

  const enrollment = await prisma.studentLesson.findUnique({
    where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
    include: {
      attempts: {
        include: { block: true },
        orderBy: { createdAt: "desc" },
      },
      submissions: {
        include: { block: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      sections: {
        include: { blocks: { orderBy: [{ stepOrder: "asc" }, { createdAt: "asc" }] } },
        orderBy: { orderIndex: "asc" },
      },
    },
  })

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
  }

  return NextResponse.json({ enrollment, lesson })
}
