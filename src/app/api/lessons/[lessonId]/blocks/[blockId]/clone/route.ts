import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, stringifyJson, parseJson } from "@/lib/db"

export async function POST(
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

  const original = await prisma.lessonBlock.findUnique({ where: { id: blockId } })
  if (!original) {
    return NextResponse.json({ error: "Block not found" }, { status: 404 })
  }

  const cloned = await prisma.lessonBlock.create({
    data: {
      sectionId: original.sectionId,
      blockType: original.blockType,
      config: stringifyJson(parseJson(original.config, {})),
      gridColumn: original.gridColumn + 1,
      gridRow: original.gridRow,
      gridWidth: original.gridWidth,
      gridHeight: original.gridHeight,
      stepOrder: -1,
    },
  })

  return NextResponse.json({ ...cloned, config: parseJson(cloned.config, {}) }, { status: 201 })
}
