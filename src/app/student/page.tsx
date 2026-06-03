import { requireStudent } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { StudentDashboardClient } from "./dashboard-client"

export default async function StudentPage() {
  const session = await requireStudent()

  const lessons = await prisma.lesson.findMany({
    where: { status: "PUBLISHED" },
    include: {
      subject: true,
      teacher: { select: { name: true } },
      sections: {
        include: { blocks: { select: { id: true } } },
      },
      enrollments: {
        where: { studentId: session.user.id },
        select: { status: true, score: true, totalSteps: true, currentStepIndex: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const totalLessons = lessons.length
  const completed = lessons.filter((l) => l.enrollments[0]?.status === "COMPLETED").length
  const inProgress = lessons.filter((l) => l.enrollments[0]?.status === "IN_PROGRESS").length
  const totalPoints = lessons.reduce((s, l) => s + (l.enrollments[0]?.score ?? 0), 0)

  const lessonsWithProgress = lessons.map((lesson) => {
    const enrollment = lesson.enrollments[0]
    const blockCount = lesson.sections.reduce((s, sec) => s + sec.blocks.length, 0)
    const progress = enrollment && enrollment.totalSteps > 0
      ? Math.round((enrollment.currentStepIndex / enrollment.totalSteps) * 100)
      : 0
    return { ...lesson, enrollment, blockCount, progress }
  })

  const subjects = [...new Set(lessons.map((l) => l.subject.name))]

  return (
    <StudentDashboardClient
      lessons={lessonsWithProgress as any}
      stats={{ totalLessons, completed, inProgress, totalPoints }}
      subjects={subjects}
      studentName={session.user.name ?? "Student"}
    />
  )
}
