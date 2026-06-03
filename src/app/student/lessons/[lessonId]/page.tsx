import { requireStudent } from "@/lib/auth"
import { prisma, parseJson } from "@/lib/db"
import { StudentLessonClient } from "./student-lesson-client"

export default async function StudentLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const session = await requireStudent()
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      subject: true,
      teacher: { select: { name: true } },
      sections: {
        include: { blocks: { orderBy: [{ stepOrder: "asc" }, { createdAt: "asc" }] } },
        orderBy: { orderIndex: "asc" },
      },
      enrollments: {
        where: { studentId: session.user.id },
      },
    },
  })

  if (!lesson || lesson.status !== "PUBLISHED") {
    return (
      <div className="flex items-center justify-center p-16 text-neutral-400">
        Lesson not found or not available.
      </div>
    )
  }

  const parsed = JSON.parse(JSON.stringify({
    ...lesson,
    sections: lesson.sections.map((s) => ({
      ...s,
      config: parseJson(s.config, {}),
      blocks: s.blocks.map((b) => ({
        ...b,
        config: parseJson(b.config, {}),
      })),
    })),
  }))

  const enrollment = lesson.enrollments[0] ? JSON.parse(JSON.stringify(lesson.enrollments[0])) : null

  return <StudentLessonClient lesson={parsed} enrollment={enrollment} userId={session.user.id} />
}
