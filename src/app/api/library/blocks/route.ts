import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma, stringifyJson, parseJson } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const blocks = await prisma.teacherLibraryBlock.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const parsed = blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) }))

  return NextResponse.json(parsed)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, blockType, config } = body

  if (!name || !blockType || !config) {
    return NextResponse.json({ error: "name, blockType, and config are required" }, { status: 400 })
  }

  const block = await prisma.teacherLibraryBlock.create({
    data: {
      teacherId: session.user.id,
      name,
      blockType,
      config: stringifyJson(config),
    },
  })

  return NextResponse.json({ ...block, config: parseJson(block.config, {}) }, { status: 201 })
}
