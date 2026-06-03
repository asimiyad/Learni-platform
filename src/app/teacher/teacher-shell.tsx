"use client"

import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutShell } from "@/components/LayoutShell"

const navItems = [
  { label: "Dashboard", href: "/teacher", icon: "analytics" },
  { label: "Lessons", href: "/teacher/lessons", icon: "edit_note" },
  { label: "Subjects", href: "/teacher/subjects", icon: "auto_stories" },
  { label: "Library", href: "/teacher/library", icon: "local_library" },
  { label: "Templates", href: "/teacher/templates", icon: "dashboard_customize" },
  { label: "Rewards", href: "/teacher/rewards", icon: "workspace_premium" },
]

export function TeacherShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null }
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname?.match(/\/teacher\/lessons\/[^\/]+\/edit/)) {
    return <>{children}</>
  }

  const displayName = user.name ?? "Teacher"
  const role = "Senior Educator"

  return (
    <LayoutShell
      navItems={navItems}
      user={user}
      brand="Learni"
      role="teacher"
      onSignOut={() => signOut()}
      sidebarTop={
        <div className="flex flex-col items-center text-center" style={{ padding: "0 24px", marginBottom: "32px" }}>
          <div className="w-20 h-20 rounded-full bg-surface-container-high overflow-hidden mb-4 border-2 border-primary flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
            {user.image ? (
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              displayName[0]
            )}
          </div>
          <p className="text-sm text-on-surface-variant mb-1">Welcome back,</p>
          <h2 className="text-headline-md font-headline-md text-primary">{displayName}</h2>
          <p className="text-sm text-on-surface-variant mt-1">{role}</p>
        </div>
      }
    >
      {children}
    </LayoutShell>
  )
}
