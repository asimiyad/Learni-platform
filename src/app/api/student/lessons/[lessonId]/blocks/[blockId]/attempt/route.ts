import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireStudent } from "@/lib/auth"
import { parseJson } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ lessonId: string; blockId: string }> }
) {
  const session = await requireStudent()
  const { lessonId, blockId } = await params

  const body = await req.json()
  const { answerJson, isCorrect, pointsEarned } = body

  const enrollment = await prisma.studentLesson.findUnique({
    where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
  })
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled in this lesson" }, { status: 400 })
  }

  if (enrollment.status === "COMPLETED") {
    return NextResponse.json({ error: "Lesson already completed" }, { status: 400 })
  }

  const prevAttempts = await prisma.blockAttempt.count({
    where: { studentLessonId: enrollment.id, blockId },
  })

  const attempt = await prisma.blockAttempt.create({
    data: {
      studentLessonId: enrollment.id,
      blockId,
      attemptNumber: prevAttempts + 1,
      answerJson: typeof answerJson === "string" ? answerJson : JSON.stringify(answerJson ?? {}),
      isCorrect: isCorrect ?? false,
      pointsEarned: pointsEarned ?? 0,
    },
  })

  if (isCorrect && pointsEarned > 0) {
    await prisma.studentLesson.update({
      where: { id: enrollment.id },
      data: { score: { increment: pointsEarned } },
    })
  }

  return NextResponse.json({ attempt })
}
