import { redirect } from "next/navigation"
import { prisma, parseJson } from "@/lib/db"
import { auth } from "@/lib/auth"
import { BuilderClient } from "./builder-client"

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          blocks: { orderBy: [{ gridRow: "asc" }, { gridColumn: "asc" }] },
        },
      },
      subject: true,
    },
  })

  if (!lesson || lesson.teacherId !== session.user.id) {
    redirect("/teacher/lessons")
  }

  const parsed = {
    ...lesson,
    sections: lesson.sections.map((s) => ({
      ...s,
      config: parseJson(s.config, {}),
      blocks: s.blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) })),
    })),
  }

  return <BuilderClient lesson={JSON.parse(JSON.stringify(parsed))} />
}
