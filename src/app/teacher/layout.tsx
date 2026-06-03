import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { TeacherShell } from "./teacher-shell"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== "TEACHER") {
    redirect("/login")
  }

  return <TeacherShell user={session.user}>{children}</TeacherShell>
}
