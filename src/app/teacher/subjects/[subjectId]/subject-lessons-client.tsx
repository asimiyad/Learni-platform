"use client"

import { useRouter } from "next/navigation"
import { Plus, ArrowLeft, FileText, Edit, Eye, BookOpen } from "lucide-react"
import { Button, ButtonLink } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface Lesson {
  id: string
  title: string
  status: string
  totalPoints: number
  blockCount: number
}

interface Subject {
  id: string
  name: string
  grade: number
  _count: { lessons: number }
  lessons: Lesson[]
}

export function SubjectLessonsClient({ subject }: { subject: Subject }) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/teacher/subjects")}
        className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors self-start"
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
        Back to Subjects
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>auto_stories</span>
          </div>
          <div>
            <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-primary" style={{ fontSize: "32px" }}>
              {subject.name}
            </h1>
            <p className="text-sm text-on-surface-variant font-medium mt-1 uppercase tracking-wider">
              Grade {subject.grade} &bull; {subject._count.lessons} {subject._count.lessons === 1 ? "lesson" : "lessons"}
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push(`/teacher/lessons/new?subjectId=${subject.id}`)}
          className="bg-primary text-on-primary font-lesson-title text-sm px-6 py-3 rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 self-start md:self-auto"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add</span>
          New Lesson
        </button>
      </div>

      {subject.lessons.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4" style={{ fontSize: "48px" }}>menu_book</span>
          <p className="text-lg font-bold text-on-background mb-4">No lessons yet.</p>
          <button
            onClick={() => router.push(`/teacher/lessons/new?subjectId=${subject.id}`)}
            className="bg-primary text-on-primary font-medium px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add</span>
            Add your first lesson
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.lessons.map((lesson) => (
            <div key={lesson.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:border-primary hover:shadow-[0_4px_20px_rgba(0,104,95,0.06)] transition-all duration-300 group cursor-pointer" onClick={() => router.push(`/teacher/lessons/${lesson.id}/edit`)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>edit_note</span>
                  </div>
                  <h3 className="font-semibold text-on-background group-hover:text-primary transition-colors line-clamp-2">{lesson.title}</h3>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold shrink-0 ${
                  lesson.status === "PUBLISHED" ? "bg-primary-container text-on-primary-container" : "bg-surface-variant text-on-surface-variant"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${lesson.status === "PUBLISHED" ? "bg-primary" : "bg-outline"}`}></span>
                  {lesson.status}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-on-surface-variant font-medium mb-6 mt-auto">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>view_comfy</span>
                  {lesson.blockCount} blocks
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>star</span>
                  {lesson.totalPoints} pts
                </span>
              </div>
              
              <div className="flex items-center gap-2 border-t border-outline-variant pt-4 mt-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/teacher/lessons/${lesson.id}/edit`) }}
                  className="flex-1 bg-surface-variant text-on-surface-variant hover:bg-secondary-container hover:text-on-secondary-container font-medium text-sm px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                  Edit
                </button>
                {lesson.status === "PUBLISHED" && (
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(`/preview/${lesson.id}`, "_blank") }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>visibility</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
