import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, parseJson } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          blocks: { orderBy: [{ gridRow: "asc" }, { gridColumn: "asc" }] },
        },
      },
      subject: true,
    },
  })

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 })
  }

  if (lesson.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = {
    ...lesson,
    sections: lesson.sections.map((s) => ({
      ...s,
      config: parseJson(s.config, {}),
      blocks: s.blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) })),
    })),
  }

  return NextResponse.json(parsed)
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson || lesson.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const { title, passThreshold, timeLimit, thumbnail, tags, status, estimatedDuration, totalPoints } = body

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      ...(title !== undefined && { title }),
      ...(passThreshold !== undefined && { passThreshold }),
      ...(timeLimit !== undefined && { timeLimit }),
      ...(thumbnail !== undefined && { thumbnail }),
      ...(tags !== undefined && { tags }),
      ...(status !== undefined && { status }),
      ...(estimatedDuration !== undefined && { estimatedDuration }),
      ...(totalPoints !== undefined && { totalPoints }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson || lesson.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.lesson.delete({ where: { id: lessonId } })
  return NextResponse.json({ success: true })
}
