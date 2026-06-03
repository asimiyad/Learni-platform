import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lessons = await prisma.lesson.findMany({
    where: { teacherId: session.user.id },
    include: {
      subject: true,
      sections: {
        include: { _count: { select: { blocks: true } } },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  const parsed = lessons.map((l) => ({
    ...l,
    blockCount: l.sections.reduce((sum, s) => sum + s._count.blocks, 0),
  }))

  return NextResponse.json(parsed)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, subjectId } = body

  if (!title || !subjectId) {
    return NextResponse.json({ error: "Title and subjectId are required" }, { status: 400 })
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      subjectId,
      teacherId: session.user.id,
    },
  })

  return NextResponse.json(lesson, { status: 201 })
}
