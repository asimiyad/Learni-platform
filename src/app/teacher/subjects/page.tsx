import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SubjectsClient } from "./subjects-client"

export default async function SubjectsPage() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "TEACHER") redirect("/login")

  const subjects = await prisma.subject.findMany({
    where: { teacherId: session.user.id },
    include: { _count: { select: { lessons: true } } },
    orderBy: [{ grade: "asc" }, { name: "asc" }],
  })

  return <SubjectsClient subjects={JSON.parse(JSON.stringify(subjects))} />
}
