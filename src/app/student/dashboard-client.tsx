"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const BADGE_LABELS: Record<string, string> = {
  POINTS_CHAMPION: "Points Champion",
  ACCURACY_CHAMPION: "Accuracy Champion",
  PERSISTENCE_CHAMPION: "Persistence Champion",
  MOST_IMPROVED: "Most Improved",
}

interface Badge {
  id: string
  title: string
  weekStart: string
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    let start = 0
    const duration = 900
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])

  return <>{display}</>
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 bg-secondary-container rounded-full overflow-hidden">
      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
    </div>
  )
}

export function StudentDashboardClient({
  lessons,
  stats,
  subjects,
  studentName,
}: {
  lessons: any[]
  stats: { totalLessons: number; completed: number; inProgress: number; totalPoints: number }
  subjects: string[]
  studentName: string
}) {
  const [activeSubject, setActiveSubject] = useState("")
  const [badges, setBadges] = useState<Badge[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    fetch("/api/student/badges").then((r) => r.json()).then((d) => setBadges(d.badges ?? [])).catch(() => {})
    fetch("/api/student/streak").then((r) => r.json()).then((d) => setStreak(d.currentStreak ?? 0)).catch(() => {})
  }, [])

  const filtered = activeSubject ? lessons.filter((l) => l.subject.name === activeSubject) : lessons
  const recentBadges = badges.slice(0, 4)
  const firstName = studentName.split(" ")[0]

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-glow relative overflow-hidden" style={{ marginBottom: "0" }}>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary-container rounded-full opacity-50 blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-background mb-1" style={{ fontSize: "32px", fontWeight: 800, lineHeight: 1.2 }}>
            Selamat Pagi, {firstName}!
          </h2>
          <p className="text-body-main font-body-main text-on-secondary-container">Ready to conquer your goals today?</p>
        </div>
        <div className="relative z-10 flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-outline-variant w-fit">
          <span className="material-symbols-outlined text-primary">calendar_month</span>
          <span className="text-lesson-title font-lesson-title text-sm text-on-background">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-3 ambient-glow hover:-translate-y-1 transition-transform duration-300">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Lessons</p>
            <p className="text-stat-value font-stat-value text-on-background"><AnimatedNumber value={stats.totalLessons} /></p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-3 ambient-glow hover:-translate-y-1 transition-transform duration-300">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">task_alt</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Completed</p>
            <p className="text-stat-value font-stat-value text-on-background"><AnimatedNumber value={stats.completed} /></p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-tertiary-fixed flex flex-col gap-3 ambient-glow hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: "80px" }}>local_fire_department</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
            <span className="material-symbols-outlined fill">local_fire_department</span>
          </div>
          <div className="relative z-10">
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Day Streak</p>
            <div className="flex items-end gap-1">
              <p className="text-stat-value font-stat-value text-on-background"><AnimatedNumber value={streak} /></p>
              <span className="text-sm text-tertiary font-bold mb-1">Days</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant flex flex-col gap-3 ambient-glow hover:-translate-y-1 transition-transform duration-300">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
            <span className="material-symbols-outlined">stars</span>
          </div>
          <div>
            <p className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Total Points</p>
            <p className="text-stat-value font-stat-value text-on-background"><AnimatedNumber value={stats.totalPoints} /></p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Lessons */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
            <button
              onClick={() => setActiveSubject("")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all ${
                !activeSubject ? "bg-primary text-on-primary" : "bg-transparent border border-outline-variant text-on-secondary-container hover:border-primary hover:text-primary"
              }`}
            >
              All
            </button>
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSubject(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeSubject === s ? "bg-primary text-on-primary shadow-sm" : "bg-transparent border border-outline-variant text-on-secondary-container hover:border-primary hover:text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Lesson Cards */}
          <div className="flex flex-col gap-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2" style={{ fontSize: "48px" }}>{lessons.length === 0 ? "eco" : "search"}</span>
                <p className="text-sm text-center">{lessons.length === 0 ? "No lessons yet — check back soon!" : "No lessons in this subject"}</p>
              </div>
            ) : (
              filtered.map((lesson, i) => {
                const isCompleted = lesson.enrollment?.status === "COMPLETED"
                const isInProgress = lesson.enrollment?.status === "IN_PROGRESS"
                const subjectIcon = lesson.subject.name === "Mathematics" ? "calculate" : lesson.subject.name === "Science" ? "science" : lesson.subject.name === "History" ? "history_edu" : "menu_book"

                return (
                  <Link
                    key={lesson.id}
                    href={`/student/lessons/${lesson.id}`}
                    className={`bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-primary transition-colors ambient-glow group cursor-pointer ${
                      isCompleted ? "opacity-80" : ""
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="w-16 h-16 rounded-lg bg-surface flex items-center justify-center border border-outline-variant flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: "32px" }}>{subjectIcon}</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-label-caps font-label-caps text-primary uppercase bg-surface px-2 py-1 rounded">{lesson.subject.name}</span>
                          <span className="text-label-caps font-label-caps text-on-surface-variant flex items-center gap-1">
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>view_module</span>
                            {lesson.blockCount} blocks
                          </span>
                        </div>
                        <h3 className="text-lesson-title font-lesson-title text-on-background group-hover:text-primary transition-colors">{lesson.title}</h3>
                        <p className="text-sm text-on-secondary-container">{lesson.teacher.name}</p>
                      </div>
                      {isInProgress && (
                        <div className="mt-4 sm:mt-2">
                          <div className="flex justify-between text-label-caps text-[10px] text-on-surface-variant mb-1">
                            <span>Progress</span>
                            <span>{lesson.progress}%</span>
                          </div>
                          <ProgressBar progress={lesson.progress} />
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 flex items-center">
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-primary font-medium text-sm">
                          <span className="material-symbols-outlined fill">check_circle</span>
                          <span>Completed ({lesson.enrollment.score} pts)</span>
                        </div>
                      ) : isInProgress ? null : (
                        <button className="px-6 py-2 bg-primary text-on-primary font-medium text-sm rounded-lg hover:opacity-90 transition-opacity">
                          Begin
                        </button>
                      )}
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Badge Shelf & Milestone */}
        <div className="flex flex-col gap-6">
          {/* Badge Shelf */}
          {recentBadges.length > 0 && (
            <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 ambient-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lesson-title font-lesson-title text-on-background">Recent Badges</h3>
                <button className="text-primary hover:underline text-sm font-body-main">View All</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recentBadges.map((b) => (
                  <div key={b.id} className="flex flex-col items-center p-4 border-2 border-primary-container rounded-lg bg-surface text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center mb-2 shadow-sm">
                      <span className="material-symbols-outlined fill text-on-primary-fixed-variant" style={{ fontSize: "28px" }}>emoji_events</span>
                    </div>
                    <p className="text-xs font-semibold leading-tight text-on-background">{BADGE_LABELS[b.title] || b.title}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next Milestone */}
          <section className="bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden shadow-sm">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined" style={{ fontSize: "120px" }}>workspace_premium</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-lesson-title font-lesson-title mb-2">Next Milestone</h3>
              <p className="text-sm mb-4 opacity-90">Earn 250 more points to unlock the Silver Scholar avatar frame!</p>
              <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(100, (stats.totalPoints / 1500) * 100)}%` }}></div>
              </div>
              <p className="text-[10px] mt-2 text-right opacity-80 font-semibold">{stats.totalPoints} / 1,500 pts</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
