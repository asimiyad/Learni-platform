import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subjects = await prisma.subject.findMany({
    where: { teacherId: session.user.id },
    include: { _count: { select: { lessons: true } } },
    orderBy: [{ grade: "asc" }, { name: "asc" }],
  })

  return NextResponse.json(subjects)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, grade } = body

  if (!name || grade === undefined) {
    return NextResponse.json({ error: "Name and grade are required" }, { status: 400 })
  }

  const subject = await prisma.subject.create({
    data: {
      name,
      grade: parseInt(grade),
      teacherId: session.user.id,
    },
  })

  return NextResponse.json(subject, { status: 201 })
}
