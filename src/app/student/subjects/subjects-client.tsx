"use client"

import { useState } from "react"
import Link from "next/link"

interface SubjectEntry {
  name: string
  lessons: any[]
  totalPoints: number
}

const SUBJECT_ICONS: Record<string, string> = {
  Mathematics: "calculate",
  Science: "science",
  English: "book",
  "Bahasa Melayu": "translate",
  History: "history_edu",
  Geography: "public",
  Art: "palette",
  Music: "music_note",
}

const SUBJECT_COLORS: Record<string, { bg: string; icon: string }> = {
  Mathematics: { bg: "var(--primary-fixed)", icon: "var(--primary)" },
  Science: { bg: "var(--secondary-container)", icon: "var(--secondary)" },
  English: { bg: "var(--tertiary-fixed)", icon: "var(--tertiary)" },
  History: { bg: "var(--primary)", icon: "var(--on-primary)" },
  Geography: { bg: "var(--surface-container)", icon: "var(--on-surface)" },
  Art: { bg: "var(--tertiary-container)", icon: "var(--on-tertiary-container)" },
}

export function SubjectsClient({ subjects, studentName }: { subjects: SubjectEntry[]; studentName: string }) {
  const [search, setSearch] = useState("")

  const filtered = search
    ? subjects.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : subjects

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-glow">
        <div>
          <h2 className="text-headline-md font-headline-md text-on-background mb-1">My Subjects</h2>
          <p className="text-body-main font-body-main text-on-secondary-container">Browse and study all available subjects</p>
        </div>
        <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-outline-variant w-fit">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          <span className="text-lesson-title font-lesson-title text-sm text-on-background">{subjects.length} subjects</span>
        </div>
      </section>

      {/* Search */}
      <div className="relative w-full max-w-md">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: "18px" }}>search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subjects..."
          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-background outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Subject Cards */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2" style={{ fontSize: "48px" }}>search_off</span>
          <p className="text-sm text-center">{subjects.length === 0 ? "No subjects available yet" : "No subjects match your search"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((subject) => {
            const colors = SUBJECT_COLORS[subject.name] || { bg: "var(--surface-container)", icon: "var(--on-surface)" }
            const icon = SUBJECT_ICONS[subject.name] || "menu_book"
            const completed = subject.lessons.filter((l) => l.enrollments[0]?.status === "COMPLETED").length
            const inProgress = subject.lessons.filter((l) => l.enrollments[0]?.status === "IN_PROGRESS").length

            return (
              <Link
                key={subject.name}
                href={`/student/lessons?subject=${encodeURIComponent(subject.name)}`}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
                style={{ textDecoration: "none" }}
              >
                <div className="p-6 pb-4" style={{ background: `${colors.bg}20` }}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: colors.bg }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "24px", color: colors.icon }}>{icon}</span>
                    </div>
                    <div>
                      <h3 className="text-lesson-title font-lesson-title text-on-background">{subject.name}</h3>
                      <p className="text-xs text-on-secondary-container">{subject.lessons.length} lessons</p>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px" }}>check_circle</span>
                      {completed} done
                    </span>
                    {inProgress > 0 && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-tertiary" style={{ fontSize: "14px" }}>hourglass_top</span>
                        {inProgress} in progress
                      </span>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ fontSize: "18px" }}>arrow_forward</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
