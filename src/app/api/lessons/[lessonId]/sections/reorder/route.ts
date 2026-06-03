import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function PATCH(
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
  const { sections } = body as { sections: Array<{ id: string; orderIndex: number }> }

  await prisma.$transaction(
    sections.map((s) =>
      prisma.section.update({
        where: { id: s.id },
        data: { orderIndex: s.orderIndex },
      })
    )
  )

  return NextResponse.json({ success: true })
}
