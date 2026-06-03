import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await requireTeacher()

  const coupons = await prisma.couponRequest.findMany({
    where: { status: "PENDING" },
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  const termly = await prisma.termlyRewardRequest.findMany({
    where: { status: "PENDING" },
    include: { student: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ coupons, termly })
}
