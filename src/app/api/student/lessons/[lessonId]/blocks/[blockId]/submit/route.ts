import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requireStudent } from "@/lib/auth"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ lessonId: string; blockId: string }> }
) {
  const session = await requireStudent()
  const { lessonId, blockId } = await params

  const body = await req.json()
  const { fileUrl, dataJson } = body

  const enrollment = await prisma.studentLesson.findUnique({
    where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
  })
  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled in this lesson" }, { status: 400 })
  }

  const submission = await prisma.blockSubmission.create({
    data: {
      studentLessonId: enrollment.id,
      blockId,
      fileUrl: fileUrl ?? null,
      dataJson: dataJson ? JSON.stringify(dataJson) : "{}",
    },
  })

  return NextResponse.json({ submission })
}
