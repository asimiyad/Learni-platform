import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireTeacher()
  const { id } = await params

  const request = await prisma.termlyRewardRequest.findUnique({ where: { id } })
  if (!request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await prisma.termlyRewardRequest.update({
    where: { id },
    data: { status: "REJECTED" },
  })

  return NextResponse.json({ request: updated })
}
