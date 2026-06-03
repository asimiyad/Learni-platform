import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function PATCH(req: Request, { params }: { params: Promise<{ lessonId: string; sectionId: string }> }) {
  const { sectionId } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { blockIds } = body as { blockIds: string[] }

  if (!Array.isArray(blockIds)) return new NextResponse("Invalid blockIds", { status: 400 })

  await prisma.$transaction(
    blockIds.map((id, index) =>
      prisma.lessonBlock.update({
        where: { id },
        data: { gridRow: index + 1, sectionId },
      })
    )
  )

  return NextResponse.json({ success: true })
}
