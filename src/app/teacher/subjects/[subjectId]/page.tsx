import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { SubjectLessonsClient } from "./subject-lessons-client"

export default async function SubjectLessonsPage({
  params,
}: {
  params: Promise<{ subjectId: string }>
}) {
  const { subjectId } = await params
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") redirect("/login")

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      _count: { select: { lessons: true } },
      lessons: {
        orderBy: { updatedAt: "desc" },
        include: {
          sections: {
            include: { _count: { select: { blocks: true } } },
          },
        },
      },
    },
  })

  if (!subject || subject.teacherId !== session.user.id) redirect("/teacher/subjects")

  const parsed = {
    ...subject,
    lessons: subject.lessons.map((l) => ({
      ...l,
      blockCount: l.sections.reduce((sum, s) => sum + s._count.blocks, 0),
    })),
  }

  return <SubjectLessonsClient subject={JSON.parse(JSON.stringify(parsed))} />
}
