import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subject = await prisma.subject.findUnique({ where: { id } })
  if (!subject || subject.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.subject.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subject = await prisma.subject.findUnique({
    where: { id },
    include: {
      _count: { select: { lessons: true } },
      lessons: {
        orderBy: { updatedAt: "desc" },
        include: {
          sections: {
            include: { _count: { select: { blocks: true } } },
          },
        },
      },
    },
  })

  if (!subject || subject.teacherId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const parsed = {
    ...subject,
    lessons: subject.lessons.map((l) => ({
      ...l,
      blockCount: l.sections.reduce((sum, s) => sum + s._count.blocks, 0),
    })),
  }

  return NextResponse.json(parsed)
}
