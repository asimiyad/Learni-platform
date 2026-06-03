import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, stringifyJson, parseJson } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const templates = await prisma.teacherLibraryTemplate.findMany({
    where: { teacherId: session.user.id },
    include: {
      blocks: { orderBy: { orderIndex: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  })

  const parsed = templates.map((t) => ({
    ...t,
    blocks: t.blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) })),
  }))

  return NextResponse.json(parsed)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, description, thumbnail, blocks } = body

  if (!name || !blocks || !blocks.length) {
    return NextResponse.json({ error: "name and blocks are required" }, { status: 400 })
  }

  const template = await prisma.teacherLibraryTemplate.create({
    data: {
      teacherId: session.user.id,
      name,
      description,
      thumbnail,
      blocks: {
        create: blocks.map((b: any, i: number) => ({
          orderIndex: i,
          blockType: b.blockType,
          config: stringifyJson(b.config),
        })),
      },
    },
    include: { blocks: { orderBy: { orderIndex: "asc" } } },
  })

  return NextResponse.json(template, { status: 201 })
}


