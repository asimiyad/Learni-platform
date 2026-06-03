import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, stringifyJson } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const template = await prisma.teacherLibraryTemplate.findUnique({
    where: { id },
    include: { blocks: { orderBy: { orderIndex: "asc" } } },
  })

  if (!template || template.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const body = await req.json()
  const { title, subjectId } = body

  if (!title || !subjectId) {
    return NextResponse.json({ error: "title and subjectId are required" }, { status: 400 })
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      subjectId,
      teacherId: session.user.id,
    },
  })

  // Create a default section and add template blocks to it
  const section = await prisma.section.create({
    data: {
      lessonId: lesson.id,
      orderIndex: 0,
      config: "{}",
    },
  })

  await prisma.lessonBlock.createMany({
    data: template.blocks.map((b, i) => ({
      sectionId: section.id,
      blockType: b.blockType,
      config: b.config,
      gridColumn: 1,
      gridRow: i + 1,
      gridWidth: 12,
      gridHeight: 1,
      stepOrder: i,
    })),
  })

  const lessonWithSections = await prisma.lesson.findUnique({
    where: { id: lesson.id },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          blocks: { orderBy: [{ gridRow: "asc" }, { gridColumn: "asc" }] },
        },
      },
    },
  })

  return NextResponse.json(lessonWithSections, { status: 201 })
}
