import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { TemplateGallery } from "./template-gallery"

export const dynamic = "force-dynamic"

export default async function TemplatesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "TEACHER") redirect("/login")

  const templates = await prisma.globalTemplate.findMany({
    orderBy: [{ isFeatured: "desc" }, { popularity: "desc" }],
    include: { _count: { select: { sections: true } } },
  })

  const subjects = await prisma.subject.findMany({
    where: { teacherId: session.user.id },
    select: { id: true, name: true, grade: true },
    orderBy: [{ name: "asc" }, { grade: "asc" }],
  })

  return <TemplateGallery templates={templates} subjects={subjects} />
}
