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
  const { config } = body

  const lastSection = await prisma.section.findFirst({
    where: { lessonId },
    orderBy: { orderIndex: "desc" },
  })

  const section = await prisma.section.create({
    data: {
      lessonId,
      config: stringifyJson(config || {}),
      orderIndex: (lastSection?.orderIndex ?? -1) + 1,
    },
    include: { blocks: true },
  })

  return NextResponse.json({
    ...section,
    config: parseJson(section.config, {}),
    blocks: section.blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) })),
  }, { status: 201 })
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

  const sections = await prisma.section.findMany({
    where: { lessonId },
    orderBy: { orderIndex: "asc" },
    include: { blocks: { orderBy: { gridRow: "asc" } } },
  })

  const parsed = sections.map((s) => ({
    ...s,
    config: parseJson(s.config, {}),
    blocks: s.blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) })),
  }))

  return NextResponse.json(parsed)
}
