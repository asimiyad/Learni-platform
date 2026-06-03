"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import gsap from "gsap"

interface Subject {
  id: string
  name: string
  grade: number
  _count: { lessons: number }
}

export function SubjectsClient({ subjects: initial }: { subjects: Subject[] }) {
  const router = useRouter()
  const [subjects, setSubjects] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [grade, setGrade] = useState("5")
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const initialMount = useRef(true)

  useEffect(() => {
    if (containerRef.current && initialMount.current) {
      initialMount.current = false
      const cards = containerRef.current.querySelectorAll(".gsap-subject-card")
      gsap.fromTo(cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" })
    }
  }, [])

  useEffect(() => {
    if (showForm && formRef.current) {
      gsap.fromTo(formRef.current, { height: 0, opacity: 0, overflow: "hidden" }, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" })
    }
  }, [showForm])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), grade: parseInt(grade) }),
      })
      if (!res.ok) throw new Error()
      const subject = await res.json()
      setSubjects([...subjects, { ...subject, _count: { lessons: 0 } }])
      setName("")
      setShowForm(false)
      toast.success("Subject created")
    } catch {
      toast.error("Failed to create subject")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm("Delete this subject and all its lessons?")) return
    try {
      const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      setSubjects(subjects.filter((s) => s.id !== id))
      toast.success("Subject deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-end justify-between mb-6 pb-4 border-b border-outline-variant gap-6">
        <div>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-background">Curriculum Index</h1>
          <p className="text-sm mt-2 text-on-surface-variant">Manage your subjects and organize your lessons.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-sm">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>
          Add Subject
        </button>
      </div>

      {showForm && (
        <div ref={formRef} className="mb-6 overflow-hidden">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-end gap-6">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold mb-2 text-on-background">Subject Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface transition-all"
                  placeholder="e.g., Advanced Mathematics"
                  autoFocus
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-sm font-semibold mb-2 text-on-background">Grade</label>
                <div className="relative">
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2.5 border border-outline-variant rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface appearance-none cursor-pointer"
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <button type="submit" disabled={!name.trim() || loading} className="w-full sm:w-auto px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm">
                {loading ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="w-full sm:w-auto p-2.5 text-on-surface-variant bg-surface border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col items-center shadow-sm">
          <div className="w-20 h-20 mb-6 bg-primary/10 text-primary flex items-center justify-center rounded-full">
            <span className="material-symbols-outlined" style={{ fontSize: "40px" }}>auto_stories</span>
          </div>
          <h3 className="text-headline-md font-headline-md text-on-background mb-3">Blank Canvas</h3>
          <p className="text-sm text-on-surface-variant max-w-lg mx-auto">Your curriculum is currently empty. Begin by framing your first subject area.</p>
        </div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => router.push(`/teacher/subjects/${subject.id}`)}
              className="gsap-subject-card group cursor-pointer relative bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-primary/50 transition-all duration-200 p-6 flex flex-col h-full overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center text-primary rounded-bl-xl">
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>auto_stories</span>
                </div>
                <div className="flex flex-col items-end gap-2 z-10">
                  <span className="text-xs font-semibold bg-primary text-on-primary px-3 py-1 rounded-full">Grade {subject.grade}</span>
                  <button
                    onClick={(e) => handleDelete(subject.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-md hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                  </button>
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-lesson-title font-lesson-title text-on-background mb-4 pr-6 line-clamp-2">{subject.name}</h3>
                <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-4">
                  <p className="text-sm font-medium text-on-surface-variant">{subject._count.lessons} {subject._count.lessons === 1 ? "Lesson" : "Lessons"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
