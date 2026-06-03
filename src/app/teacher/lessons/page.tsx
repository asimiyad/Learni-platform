import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { LessonsClient } from "./lessons-client"

export default async function LessonsPage() {
  const session = await auth()
  const lessons = await prisma.lesson.findMany({
    where: { teacherId: session?.user?.id },
    include: {
      subject: true,
      sections: {
        include: {
          _count: { select: { blocks: true } },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Serialize before passing to client
  const serialized = JSON.parse(JSON.stringify(lessons))

  return <LessonsClient lessons={serialized} />
}
