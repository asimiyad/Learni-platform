import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { LibraryClient } from "./library-client"

export default async function LibraryPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const savedBlocks = await prisma.teacherLibraryBlock.findMany({
    where: { teacherId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const templates = await prisma.teacherLibraryTemplate.findMany({
    where: { teacherId: session.user.id },
    include: { blocks: { orderBy: { orderIndex: "asc" } } },
    orderBy: { createdAt: "desc" },
  })

  return <LibraryClient savedBlocks={savedBlocks} templates={templates} />
}
