import { requireStudent } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SubjectsClient } from "./subjects-client"

export default async function StudentSubjectsPage() {
  const session = await requireStudent()

  const lessons = await prisma.lesson.findMany({
    where: { status: "PUBLISHED" },
    include: {
      subject: true,
      teacher: { select: { name: true } },
      enrollments: {
        where: { studentId: session.user.id },
        select: { status: true, score: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const subjectMap = new Map<string, { name: string; lessons: typeof lessons; totalPoints: number }>()
  for (const lesson of lessons) {
    const key = lesson.subject.name
    if (!subjectMap.has(key)) {
      subjectMap.set(key, { name: key, lessons: [], totalPoints: 0 })
    }
    const entry = subjectMap.get(key)!
    entry.lessons.push(lesson)
    entry.totalPoints += lesson.enrollments[0]?.score ?? 0
  }

  const subjects = Array.from(subjectMap.values())

  return <SubjectsClient subjects={subjects} studentName={session.user.name ?? "Student"} />
}
