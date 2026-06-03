import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export default async function TeacherDashboard() {
  const session = await auth()
  const teacherId = session?.user?.id ?? ""

  const subjectCount = await prisma.subject.count({ where: { teacherId } })
  const publishedCount = await prisma.lesson.count({ where: { teacherId, status: "PUBLISHED" } })
  const draftCount = await prisma.lesson.count({ where: { teacherId, status: "DRAFT" } })
  const totalLessons = publishedCount + draftCount

  const latestLessons = await prisma.lesson.findMany({
    where: { teacherId },
    include: { subject: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 5,
  })

  const displayName = session?.user?.name?.split(" ")[0] ?? "Teacher"

  const subjectIcons: Record<string, string> = {
    Science: "science",
    Mathematics: "calculate",
    History: "history_edu",
    Geography: "public",
    English: "translate",
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div>
        <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-3 py-1.5 rounded-full text-label-caps font-label-caps mb-4 uppercase tracking-wider">
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>calendar_today</span>
          Today, {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </div>
        <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary">
          Welcome back,<br />
          <span style={{ display: "inline-flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <span className="text-on-background">{displayName}</span>
            <Link
              href="/teacher/lessons/new"
              className="bg-primary text-on-primary font-lesson-title text-sm px-5 py-2 rounded-lg shadow-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2 no-underline"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
              New Lesson
            </Link>
          </span>
        </h2>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: subjectCount, label: "Subjects", icon: "auto_stories", bg: "bg-secondary-container", color: "text-primary" },
          { value: publishedCount, label: "Published", icon: "check_circle", bg: "bg-[#E0F2FE]", color: "text-[#0369A1]" },
          { value: draftCount, label: "Drafts", icon: "draft", bg: "bg-[#FEF3C7]", color: "text-[#B45309]" },
          { value: totalLessons, label: "Total Lessons", icon: "layers", bg: "bg-[#F3E8FF]", color: "text-[#7E22CE]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center gap-4 hover:border-primary hover:shadow-[0_4px_20px_rgba(0,104,95,0.05)] transition-all duration-300">
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined fill">{stat.icon}</span>
            </div>
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-stat-value font-stat-value text-on-background">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Lessons */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden">
            <div className="px-4 py-4 border-b border-surface-variant flex justify-between items-center bg-surface-bright">
              <h3 className="text-lesson-title font-lesson-title text-on-background">Recent Lessons</h3>
              <Link href="/teacher/subjects" className="text-label-caps font-label-caps text-primary hover:underline uppercase tracking-wider" style={{ textDecoration: "none" }}>View All</Link>
            </div>
            {latestLessons.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4" style={{ fontSize: "48px" }}>menu_book</span>
                <p className="text-lg font-bold text-on-background mb-4">No lessons drafted.</p>
                <Link href="/teacher/subjects" className="bg-primary text-on-primary font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors" style={{ textDecoration: "none" }}>Create First Lesson</Link>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-surface-variant">
                {latestLessons.map((lesson) => {
                  const icon = subjectIcons[lesson.subject?.name ?? ""] || "menu_book"
                  return (
                    <div key={lesson.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-primary transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{icon}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-on-background mb-0.5">{lesson.title}</h4>
                          <p className="text-xs text-on-surface-variant">{lesson.subject?.name ?? "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold ${
                          lesson.status === "PUBLISHED" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface-variant"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${lesson.status === "PUBLISHED" ? "bg-primary" : "bg-outline"}`}></span>
                          {lesson.status}
                        </span>
                        <button className="text-outline hover:text-primary transition-colors p-1 rounded-md hover:bg-surface-variant">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Actions & Tips */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-primary rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <h3 className="text-lesson-title font-lesson-title text-on-primary mb-4 relative z-10">Quick Actions</h3>
            <div className="flex flex-col gap-3 relative z-10">
              {[
                { label: "AI Generate", icon: "magic_button", href: "/teacher/lessons/generate" },
                { label: "Library", icon: "local_library", href: "/teacher/library" },
                { label: "Rewards", icon: "workspace_premium", href: "/teacher/rewards" },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="w-full bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary border border-surface-container-lowest/20 flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group"
                  style={{ textDecoration: "none" }}
                >
                  <div className="w-8 h-8 rounded-md bg-surface-container-lowest/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{action.icon}</span>
                  </div>
                  <span className="text-sm font-semibold">{action.label}</span>
                  <span className="material-symbols-outlined ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ fontSize: "18px" }}>arrow_forward</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Teacher Tip */}
          <div className="bg-secondary-container border border-secondary-fixed-dim rounded-xl p-4 flex gap-4 items-start relative overflow-hidden group">
            <div className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-sm z-10">
              <span className="material-symbols-outlined fill">lightbulb</span>
            </div>
            <div className="z-10">
              <h4 className="text-sm font-semibold text-on-secondary-container mb-1">Teacher Tip</h4>
              <p className="text-sm text-on-secondary-container/80 mb-3 leading-relaxed">
                Try generating a quiz from a YouTube URL! It saves time and creates engaging interactive questions automatically.
              </p>
              <Link href="/teacher/lessons/generate" className="text-label-caps font-label-caps text-primary hover:underline uppercase tracking-wider flex items-center gap-1" style={{ textDecoration: "none" }}>
                Try it out
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
              </Link>
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-surface-container-lowest/40 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
