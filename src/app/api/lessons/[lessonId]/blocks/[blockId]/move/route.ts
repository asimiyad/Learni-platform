import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function PATCH(req: Request, { params }: { params: Promise<{ lessonId: string; blockId: string }> }) {
  const { blockId } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { targetSectionId } = body

  if (!targetSectionId) return new NextResponse("Missing targetSectionId", { status: 400 })

  const block = await prisma.lessonBlock.findUnique({ where: { id: blockId } })
  if (!block) return new NextResponse("Block not found", { status: 404 })

  const updated = await prisma.lessonBlock.update({
    where: { id: blockId },
    data: { sectionId: targetSectionId },
  })

  return NextResponse.json(updated)
}
