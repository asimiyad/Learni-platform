import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

  const template = await prisma.globalTemplate.findUnique({
    where: { id },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          blocks: true,
        },
      },
    },
  })

  if (!template) return new NextResponse("Template not found", { status: 404 })

  const body = await req.json()
  const { subjectId } = body

  let targetSubjectId = subjectId

  if (!targetSubjectId) {
    const subject = await prisma.subject.findFirst({
      where: {
        teacherId: session.user.id,
        name: template.subject,
        grade: template.grade,
      },
    })
    if (subject) {
      targetSubjectId = subject.id
    } else {
      const created = await prisma.subject.create({
        data: {
          name: template.subject,
          grade: template.grade,
          teacherId: session.user.id,
        },
      })
      targetSubjectId = created.id
    }
  }

  const NON_STEP_BLOCK_TYPES = new Set(["SECTION_DIVIDER", "CONDITIONAL_LOCK", "BONUS_POINTS"])
  let stepCounter = 0

  const lesson = await prisma.lesson.create({
    data: {
      title: template.name,
      teacherId: session.user.id,
      subjectId: targetSubjectId,
      status: "DRAFT",
      totalPoints: template.totalPoints,
      estimatedDuration: template.estimatedMinutes ?? null,
      sections: {
        create: template.sections.map((sec) => ({
          orderIndex: sec.orderIndex,
          config: "{}",
          blocks: {
            create: sec.blocks.map((blk) => {
              const isStepBlock = !NON_STEP_BLOCK_TYPES.has(blk.blockType)
              const order = isStepBlock ? stepCounter++ : -1
              return {
                blockType: blk.blockType,
                config: blk.config,
                gridColumn: blk.gridColumn,
                gridWidth: blk.gridWidth,
                gridHeight: 1,
                stepOrder: order,
              }
            }),
          },
        })),
      },
    },
  })

  return NextResponse.json({ lessonId: lesson.id })
}
