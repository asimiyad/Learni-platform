import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StudentShell } from "./student-shell"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== "STUDENT") redirect("/login")

  return <StudentShell user={session.user}>{children}</StudentShell>
}
