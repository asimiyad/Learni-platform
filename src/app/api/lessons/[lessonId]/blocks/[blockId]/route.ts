import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, stringifyJson, parseJson } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ lessonId: string; blockId: string }> }
) {
  const { lessonId, blockId } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson || lesson.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const { config, blockType, gridColumn, gridRow, gridWidth, gridHeight, stepOrder } = body

  const updated = await prisma.lessonBlock.update({
    where: { id: blockId },
    data: {
      ...(config !== undefined && { config: stringifyJson(config) }),
      ...(blockType !== undefined && { blockType }),
      ...(gridColumn !== undefined && { gridColumn }),
      ...(gridRow !== undefined && { gridRow }),
      ...(gridWidth !== undefined && { gridWidth }),
      ...(gridHeight !== undefined && { gridHeight }),
      ...(stepOrder !== undefined && { stepOrder }),
    },
  })

  return NextResponse.json({ ...updated, config: parseJson(updated.config, {}) })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ lessonId: string; blockId: string }> }
) {
  const { lessonId, blockId } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson || lesson.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.lessonBlock.delete({ where: { id: blockId } })

  return NextResponse.json({ success: true })
}
