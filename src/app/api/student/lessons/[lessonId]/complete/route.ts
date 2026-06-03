import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireStudent } from "@/lib/auth"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await requireStudent()
  const { lessonId } = await params

  const enrollment = await prisma.studentLesson.findUnique({
    where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
  })
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 400 })
  }
  if (enrollment.status === "COMPLETED") {
    return NextResponse.json({ enrollment })
  }

  const completed = await prisma.studentLesson.update({
    where: { id: enrollment.id },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
    },
  })

  return NextResponse.json({ enrollment: completed })
}
