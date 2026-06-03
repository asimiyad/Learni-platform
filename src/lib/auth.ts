import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"
import { redirect } from "next/navigation"

export async function auth() {
  const session = await getServerSession(authOptions)
  return session
}

export async function requireAuth() {
  const session = await auth()
  if (!session) redirect("/login")
  return session
}

export async function requireTeacher() {
  const session = await requireAuth()
  if (session.user.role !== "TEACHER") redirect("/")
  return session
}

export async function requireStudent() {
  const session = await requireAuth()
  if (session.user.role !== "STUDENT") redirect("/")
  return session
}
