import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { GenerateLessonClient } from "./generate-client"

export default async function GenerateLessonPage() {
  const session = await requireTeacher()

  const subjects = await prisma.subject.findMany({
    where: { teacherId: session.user.id },
    orderBy: [{ grade: "asc" }, { name: "asc" }],
  })

  return <GenerateLessonClient subjects={subjects} />
}
