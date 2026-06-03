import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, stringifyJson, parseJson } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ lessonId: string; sectionId: string }> }
) {
  const { lessonId, sectionId } = await params
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

  const updated = await prisma.section.update({
    where: { id: sectionId },
    data: {
      ...(config !== undefined && { config: stringifyJson(config) }),
    },
    include: { blocks: true },
  })

  return NextResponse.json({
    ...updated,
    config: parseJson(updated.config, {}),
    blocks: updated.blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) })),
  })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ lessonId: string; sectionId: string }> }
) {
  const { lessonId, sectionId } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson || lesson.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.section.delete({ where: { id: sectionId } })

  const remainingSections = await prisma.section.findMany({
    where: { lessonId },
    orderBy: { orderIndex: "asc" },
  })

  await prisma.$transaction(
    remainingSections.map((s, index) =>
      prisma.section.update({
        where: { id: s.id },
        data: { orderIndex: index },
      })
    )
  )

  return NextResponse.json({ success: true })
}
