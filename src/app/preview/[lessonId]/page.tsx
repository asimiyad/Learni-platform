import { prisma, parseJson } from "@/lib/db"
import { notFound } from "next/navigation"
import { PreviewClient } from "./preview-client"

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ lessonId: string }>
}) {
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      sections: {
        orderBy: { orderIndex: "asc" },
        include: {
          blocks: { orderBy: [{ gridRow: "asc" }, { gridColumn: "asc" }] },
        },
      },
    },
  })

  if (!lesson) notFound()

  const parsed = {
    ...lesson,
    sections: lesson.sections.map((s) => ({
      ...s,
      config: parseJson(s.config, {}),
      blocks: s.blocks.map((b) => ({ ...b, config: parseJson(b.config, {}) })),
    })),
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-indigo-600 text-white text-center py-2 text-xs font-medium">
        Preview Mode — No data will be saved
      </div>
      <PreviewClient lesson={JSON.parse(JSON.stringify(parsed))} />
    </div>
  )
}
