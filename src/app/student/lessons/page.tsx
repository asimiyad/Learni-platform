import { prisma } from "@/lib/db"
import { requireStudent } from "@/lib/auth"
import Link from "next/link"

export default async function StudentLessonsPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const session = await requireStudent()
  const params = await searchParams

  const where: any = { status: "PUBLISHED" }
  if (params.subject) {
    where.subject = { name: params.subject }
  }

  const lessons = await prisma.lesson.findMany({
    where,
    include: {
      subject: true,
      teacher: { select: { name: true } },
      sections: { include: { blocks: { select: { id: true } } } },
      enrollments: {
        where: { studentId: session.user.id },
        select: { status: true, score: true, totalSteps: true, currentStepIndex: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const subjectName = params.subject || "All Lessons"

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-glow">
        <div>
          <Link href="/student/subjects" className="text-sm text-primary flex items-center gap-1 mb-2 no-underline hover:underline">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_back</span>
            Back to Subjects
          </Link>
          <h2 className="text-headline-md font-headline-md text-on-background mb-1">{subjectName}</h2>
          <p className="text-body-main font-body-main text-on-secondary-container">{lessons.length} lessons available</p>
        </div>
      </section>

      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2" style={{ fontSize: "48px" }}>menu_book</span>
          <p className="text-sm text-center">No lessons found for this subject</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {lessons.map((lesson) => {
            const enrollment = lesson.enrollments[0]
            const blockCount = lesson.sections.reduce((s, sec) => s + sec.blocks.length, 0)
            const isCompleted = enrollment?.status === "COMPLETED"
            const isInProgress = enrollment?.status === "IN_PROGRESS"
            const progress = enrollment && enrollment.totalSteps > 0 ? Math.round((enrollment.currentStepIndex / enrollment.totalSteps) * 100) : 0

            return (
              <Link
                key={lesson.id}
                href={`/student/lessons/${lesson.id}`}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-primary transition-colors ambient-glow group"
                style={{ textDecoration: "none" }}
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <span className="text-label-caps font-label-caps text-primary uppercase bg-surface px-2 py-1 rounded">{lesson.subject.name}</span>
                    <span className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>view_module</span>
                      {blockCount} blocks
                    </span>
                  </div>
                  <h3 className="text-lesson-title font-lesson-title text-on-background group-hover:text-primary transition-colors">{lesson.title}</h3>
                  <p className="text-sm text-on-secondary-container">{lesson.teacher.name}</p>
                  {isInProgress && (
                    <div className="mt-1">
                      <div className="flex justify-between text-label-caps text-[10px] text-on-surface-variant mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-secondary-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center sm:pl-4 sm:border-l border-outline-variant">
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-primary font-medium text-sm">
                      <span className="material-symbols-outlined fill">check_circle</span>
                      <span>{enrollment.score} pts</span>
                    </div>
                  ) : isInProgress ? null : (
                    <button className="px-6 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:opacity-90 transition-opacity">
                      Begin
                    </button>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
