import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, stringifyJson, parseJson } from "@/lib/db"

export async function POST(
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
  const { blockType, config, sectionId, gridColumn, gridRow, gridWidth, gridHeight } = body

  if (!sectionId) {
    return NextResponse.json({ error: "sectionId is required" }, { status: 400 })
  }

  const section = await prisma.section.findFirst({
    where: { id: sectionId, lessonId },
  })
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 })
  }

  const block = await prisma.lessonBlock.create({
    data: {
      sectionId,
      blockType,
      config: stringifyJson(config || {}),
      gridColumn: gridColumn ?? 1,
      gridRow: gridRow ?? 1,
      gridWidth: gridWidth ?? 12,
      gridHeight: gridHeight ?? 1,
      stepOrder: -1,
    },
  })

  return NextResponse.json({ ...block, config: parseJson(block.config, {}) }, { status: 201 })
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson || lesson.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const blocks = await prisma.lessonBlock.findMany({
    where: { section: { lessonId } },
    orderBy: [{ gridRow: "asc" }, { gridColumn: "asc" }],
  })

  const parsed = blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) }))

  return NextResponse.json(parsed)
}
