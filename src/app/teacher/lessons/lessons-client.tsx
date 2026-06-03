"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"

interface Lesson {
  id: string
  title: string
  status: string
  totalPoints: number
  subject: { name: string; grade: number } | null
  sections: { _count: { blocks: number } }[]
}

export function LessonsClient({ lessons }: { lessons: Lesson[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".gsap-lesson-card")
      gsap.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" })
    }
  }, [lessons.length])

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-4 border-b border-outline-variant gap-4">
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-background">My Lessons</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Create and manage your educational content.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/teacher/templates" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-outline-variant text-on-surface hover:bg-surface-container-low transition-all" style={{ textDecoration: "none" }}>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "16px" }}>dashboard_customize</span>
            Browse Templates
          </Link>
          <Link href="/teacher/lessons/new" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm" style={{ textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
            New Lesson
          </Link>
        </div>
      </div>

      <div ref={containerRef}>
        {lessons.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-outline-variant bg-surface">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-50 mb-4" style={{ fontSize: "48px" }}>menu_book</span>
            <h3 className="text-headline-md font-headline-md text-on-background mb-2">No lessons yet</h3>
            <p className="text-on-surface-variant mb-6">Start building your first interactive lesson.</p>
            <Link href="/teacher/lessons/new" className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm" style={{ textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
              Create Lesson
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const blockCount = lesson.sections.reduce((sum, s) => sum + s._count.blocks, 0)
              const isPublished = lesson.status === "PUBLISHED"
              return (
                <div key={lesson.id} className="gsap-lesson-card group flex flex-col bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:border-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4 gap-2">
                      <div className="flex-1">
                        <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 bg-surface text-primary border border-outline-variant">
                          {lesson.subject?.name ?? "No Subject"} &bull; Grade {lesson.subject?.grade ?? "?"}
                        </span>
                        <h3 className="text-lesson-title font-lesson-title text-on-background leading-tight">{lesson.title}</h3>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${
                        isPublished ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-6 mt-auto pt-4 border-t border-outline-variant">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px" }}>view_module</span>
                        {blockCount} Blocks
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px" }}>stars</span>
                        {lesson.totalPoints} pts
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link href={`/teacher/lessons/${lesson.id}/edit`} className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-semibold border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors" style={{ textDecoration: "none" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
                        Edit
                      </Link>
                      {isPublished && (
                        <Link href={`/preview/${lesson.id}`} className="flex justify-center items-center p-2.5 rounded-lg border border-outline-variant text-primary hover:bg-surface-container-low transition-colors" style={{ textDecoration: "none" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
