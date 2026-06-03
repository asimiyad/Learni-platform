"use client"

import { signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { LayoutShell } from "@/components/LayoutShell"

const navItems = [
  { label: "Dashboard", href: "/student", icon: "dashboard" },
  { label: "Subjects", href: "/student/subjects", icon: "menu_book" },
  { label: "Schedule", href: "/student/schedule", icon: "calendar_today" },
  { label: "Resources", href: "/student/resources", icon: "folder_open" },
  { label: "Performance", href: "/student/performance", icon: "trending_up" },
  { label: "Shop", href: "/student/shop", icon: "shopping_bag" },
]

export function StudentShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const firstName = user.name?.split(" ")[0] ?? "Student"
  const formInfo = "Form 5 - Science"

  // Hide the global navigation shell completely when in a lesson
  if (pathname?.startsWith("/student/lessons/")) {
    return <>{children}</>
  }

  return (
    <LayoutShell
      navItems={navItems}
      user={user}
      brand="Learni"
      role="student"
      onSignOut={() => signOut()}
      sidebarTop={
        <div className="flex items-center gap-4" style={{ padding: "0 24px", marginBottom: "32px" }}>
          <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {user.image ? (
              <img src={user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              user.name?.[0] ?? "S"
            )}
          </div>
          <div>
            <h2 className="text-lesson-title font-lesson-title text-on-background">{firstName}</h2>
            <p className="text-sm text-on-surface-variant">{formInfo}</p>
          </div>
        </div>
      }
      ctaButton={
        <button className="w-full bg-primary text-on-primary font-lesson-title text-sm py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>play_arrow</span>
          Start Daily Quiz
        </button>
      }
    >
      {children}
    </LayoutShell>
  )
}
