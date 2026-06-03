import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireTeacher()
  const { id } = await params

  const request = await prisma.termlyRewardRequest.findUnique({ where: { id } })
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.termlyRewardRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      redeemedAt: new Date(),
      approvedBy: session.user.id,
    },
  })

  return NextResponse.json({ request: updated })
}
