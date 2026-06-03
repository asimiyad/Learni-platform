import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

  const { searchParams } = new URL(req.url)
  const subject = searchParams.get("subject")
  const grade = searchParams.get("grade")
  const category = searchParams.get("category")
  const difficulty = searchParams.get("difficulty")
  const search = searchParams.get("search")

  const where: any = {}

  if (subject) where.subject = subject
  if (grade) where.grade = parseInt(grade)
  if (category) where.category = category
  if (difficulty) where.difficulty = difficulty
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { contains: search, mode: "insensitive" } },
    ]
  }

  const templates = await prisma.globalTemplate.findMany({
    where,
    orderBy: [{ isFeatured: "desc" }, { popularity: "desc" }],
    select: {
      id: true,
      name: true,
      description: true,
      subject: true,
      grade: true,
      difficulty: true,
      thumbnailUrl: true,
      estimatedMinutes: true,
      totalPoints: true,
      tags: true,
      isFeatured: true,
      category: true,
      _count: { select: { sections: true } },
    },
  })

  return NextResponse.json(templates)
}
