"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

interface NavItem {
  label: string
  href: string
  icon: string
}

interface LayoutShellProps {
  children: React.ReactNode
  navItems: NavItem[]
  brand?: string
  brandTagline?: string
  user?: { name?: string | null; email?: string | null; image?: string | null }
  userInitial?: string
  onSignOut?: () => void
  role?: "teacher" | "student"
  topRight?: React.ReactNode
  sidebarTop?: React.ReactNode
  ctaButton?: React.ReactNode
}

export function LayoutShell({
  children,
  navItems,
  brand = "Learni",
  brandTagline,
  user,
  userInitial,
  onSignOut,
  role = "teacher",
  topRight,
  sidebarTop,
  ctaButton,
}: LayoutShellProps) {
  const pathname = usePathname()
  const initial = userInitial ?? (user?.name ?? user?.email ?? "U")[0].toUpperCase()
  const [mobileOpen, setMobileOpen] = useState(false)

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="max-md:hidden md:flex flex-col fixed left-0 top-0 h-screen bg-surface-container-lowest border-r border-outline-variant z-40" style={{ width: "280px" }}>
        <div className="flex flex-col h-full py-8">
          {sidebarTop}

          <div style={{ margin: "0 24px 16px", height: 1, background: "var(--outline-variant)" }} />

          <nav className="flex-1 overflow-y-auto px-2">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/teacher" && item.href !== "/student" && pathname.startsWith(item.href + "/"))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive ? "text-on-primary-container bg-primary-container font-bold" : "text-on-secondary-container hover:bg-surface-container-low"
                      }`}
                      style={{ textDecoration: "none" }}
                    >
                      <span className={`material-symbols-outlined ${isActive ? "fill" : ""}`} style={{ fontSize: "20px" }}>{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {ctaButton && <div style={{ marginTop: "auto", padding: "16px 24px 0" }}>{ctaButton}</div>}

          {onSignOut && (
            <div style={{ padding: "16px 24px 0" }}>
              <button
                onClick={onSignOut}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50" onClick={closeMobile}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 h-full bg-surface-container-lowest border-r border-outline-variant shadow-2xl flex flex-col overflow-y-auto"
            style={{ width: "280px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-outline-variant">
              <h2 className="text-headline-md font-headline-md font-bold text-primary">{brand}</h2>
              <button onClick={closeMobile} className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col flex-1 py-4">
              {sidebarTop && <div className="mb-4">{sidebarTop}</div>}
              <nav className="flex-1 px-2">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/teacher" && item.href !== "/student" && pathname.startsWith(item.href + "/"))
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeMobile}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                            isActive ? "text-on-primary-container bg-primary-container font-bold" : "text-on-secondary-container hover:bg-surface-container-low"
                          }`}
                          style={{ textDecoration: "none" }}
                        >
                          <span className={`material-symbols-outlined ${isActive ? "fill" : ""}`} style={{ fontSize: "20px" }}>{item.icon}</span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              {ctaButton && <div style={{ marginTop: "auto", padding: "16px 24px 0" }}>{ctaButton}</div>}
              {onSignOut && (
                <div style={{ padding: "16px 24px 0" }}>
                  <button
                    onClick={() => { closeMobile(); onSignOut() }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop header */}
      <header className="fixed top-0 flex items-center h-16 max-md:hidden md:flex ml-[280px] right-0 bg-surface border-b border-outline-variant z-30" style={{ padding: "0 32px", left: "280px" }}>
        <div className="flex items-center gap-6 flex-1">
          <h1 className="text-headline-md font-headline-md font-bold text-primary shrink-0">{brand}</h1>
          <div className="relative max-w-md w-full max-md:hidden">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: "20px" }}>search</span>
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 text-sm text-on-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              placeholder="Search lessons, subjects..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {topRight}
          <button className="relative text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container-low">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container-low">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>help_outline</span>
          </button>
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between h-14 bg-surface border-b border-outline-variant z-30 px-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>menu</span>
          </button>
          <h1 className="text-headline-md font-headline-md font-bold text-primary">{brand}</h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>{initial}</span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="mt-14 md:mt-16 md:ml-[280px] min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)]" style={{ padding: "16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {children}
        </div>
      </main>
    </>
  )
}
