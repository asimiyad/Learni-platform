import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export default async function NewLessonPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string }>
}) {
  const { subjectId: preselectedId } = await searchParams
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const subjects = await prisma.subject.findMany({
    where: { teacherId: session.user.id },
    orderBy: [{ grade: "asc" }, { name: "asc" }],
  })

    return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <a href="/teacher/subjects" className="link-underline text-sm text-muted-foreground">&larr; Subjects</a>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-bold">New Lesson</h1>
      </div>
      <div className="card-base p-6">
        <form
          action={async (formData: FormData) => {
            "use server"
            const title = formData.get("title") as string
            const subjectId = formData.get("subjectId") as string
            if (!title || !subjectId) return

            const lesson = await prisma.lesson.create({
              data: { title, subjectId, teacherId: session.user.id },
            })

            redirect(`/teacher/lessons/${lesson.id}/edit`)
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Lesson Title</label>
            <input
              name="title"
              type="text"
              required
              className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., Introduction to Fractions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              name="subjectId"
              required
              defaultValue={preselectedId || ""}
              className="w-full px-3 py-2 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a subject...</option>
              {subjects.length === 0 && <option value="" disabled>No subjects — create one first</option>}
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (Grade {s.grade})
                </option>
              ))}
            </select>
            {subjects.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                No subjects yet.{" "}
                <a href="/teacher/subjects" className="link-underline text-primary font-medium">Create a subject first</a>.
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center font-medium leading-6 rounded-sm transition-all-200 bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm text-base px-6 py-2.5 gap-2"
            >
              Create & Start Building
            </button>
            <a
              href={preselectedId ? `/teacher/subjects/${preselectedId}` : "/teacher/subjects"}
              className="inline-flex items-center justify-center font-medium leading-6 rounded-sm transition-all-200 bg-transparent text-foreground border border-border hover:bg-muted hover:border-border-hover text-sm px-4 py-2 gap-2"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
