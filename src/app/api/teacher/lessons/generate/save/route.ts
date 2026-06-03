import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stringifyJson } from "@/lib/db"

export async function POST(req: Request) {
  const session = await requireTeacher()

  const body = await req.json()
  const { title, subjectId, grade, sections } = body as {
    title: string
    subjectId: string
    grade: number
    sections: { title: string; blocks: { blockType: string; config: any }[] }[]
  }

  if (!title || !subjectId || !Array.isArray(sections) || sections.length === 0) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } })
  if (!subject) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 })
  }

  const totalPoints = sections.reduce(
    (sum, sec) =>
      sum +
      sec.blocks.reduce((s, b) => {
        const pts = (b.config as any)?.points ?? 0
        return s + pts
      }, 0),
    0
  )

  const NON_STEP_BLOCK_TYPES = new Set(["SECTION_DIVIDER", "CONDITIONAL_LOCK", "BONUS_POINTS"])
  let stepCounter = 0

  const lesson = await prisma.lesson.create({
    data: {
      title,
      teacherId: session.user.id,
      subjectId,
      status: "DRAFT",
      totalPoints,
      sections: {
        create: sections.map((sec) => ({
          orderIndex: sections.indexOf(sec),
          config: "{}",
          blocks: {
            create: sec.blocks.map((blk) => {
              const isStep = !NON_STEP_BLOCK_TYPES.has(blk.blockType)
              return {
                blockType: blk.blockType,
                config: stringifyJson(blk.config),
                gridColumn: 1,
                gridWidth: 12,
                gridHeight: 1,
                stepOrder: isStep ? stepCounter++ : -1,
              }
            }),
          },
        })),
      },
    },
    select: { id: true },
  })

  return NextResponse.json({ lessonId: lesson.id })
}
