"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import gsap from "gsap"

interface Template {
  id: string
  name: string
  description: string | null
  subject: string
  grade: number
  difficulty: string
  thumbnailUrl: string | null
  estimatedMinutes: number | null
  totalPoints: number
  tags: string
  isFeatured: boolean
  category: string
  _count: { sections: number }
}

interface Subject {
  id: string
  name: string
  grade: number
}

const SUBJECTS = ["Mathematics", "Science", "English", "Bahasa Melayu", "History", "Art", "Music", "Geography"]
const GRADES = [5, 6, 7, 8]
const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: "bg-green-50 text-green-700 border-green-200",
  INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
  ADVANCED: "bg-red-50 text-red-700 border-red-200",
}

const SUBJECT_ICONS: Record<string, string> = {
  Mathematics: "calculate",
  Science: "science",
  English: "book",
  "Bahasa Melayu": "translate",
  History: "history_edu",
  Art: "palette",
  Music: "music_note",
  Geography: "public",
}

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "from-[#00171f] to-[#002b3d]",
  Science: "from-[#002b3d] to-[#00405c]",
  English: "from-[#00405c] to-[#00557a]",
  "Bahasa Melayu": "from-[#00171f] to-[#00354d]",
  History: "from-[#002b3d] to-[#004b6b]",
  Art: "from-[#00405c] to-[#00608a]",
  Music: "from-[#002b3d] to-[#00405c]",
  Geography: "from-[#00354d] to-[#005070]",
}

function TemplateCard({ template, onUse }: { template: Template; onUse: (id: string) => void }) {
  const gradient = SUBJECT_COLORS[template.subject] || "from-primary to-primary-container"
  const icon = SUBJECT_ICONS[template.subject] || "book"

  return (
    <div className="gsap-template-card group relative bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col h-full hover:border-primary hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className={`h-40 bg-gradient-to-br ${gradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-3 right-3 flex gap-2">
          {template.isFeatured && (
            <span className="bg-primary text-on-primary text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
              <span className="material-symbols-outlined fill" style={{ fontSize: "12px" }}>star</span>
              Editor's Choice
            </span>
          )}
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${DIFFICULTY_COLORS[template.difficulty] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
            {template.difficulty === "BEGINNER" ? "Beginner" : template.difficulty === "INTERMEDIATE" ? "Intermediate" : "Advanced"}
          </span>
        </div>
        <div className="mt-8 relative z-10">
          <div className="flex items-center gap-2 text-white/80 text-xs mb-2 font-medium tracking-wide">
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>{icon}</span>
            <span>Grade {template.grade} &middot; {template.subject}</span>
          </div>
          <h3 className="text-lesson-title font-lesson-title text-white" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
            {template.name}
          </h3>
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-4 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4 pb-4 border-b border-outline-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px" }}>schedule</span>
            {template.estimatedMinutes || "?"} min
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px" }}>stars</span>
            {template.totalPoints} pts
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: "14px" }}>layers</span>
            {template._count.sections} sect
          </span>
        </div>
        <p className="text-sm text-on-surface line-clamp-2 mb-4 flex-1">
          {template.description || "No description provided."}
        </p>
        <button
          onClick={() => onUse(template.id)}
          className="w-full py-2.5 text-sm font-semibold rounded-lg border border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 flex items-center justify-center gap-2"
        >
          Use Template
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
        </button>
      </div>
    </div>
  )
}

export function TemplateGallery({ templates: initialTemplates, subjects }: { templates: Template[]; subjects: Subject[] }) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedGrade, setSelectedGrade] = useState<number | "">("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [usingId, setUsingId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const filtered = initialTemplates.filter((t) => {
    if (search) {
      const q = search.toLowerCase()
      if (!t.name.toLowerCase().includes(q) && !(t.description || "").toLowerCase().includes(q) && !t.tags.toLowerCase().includes(q)) return false
    }
    if (selectedSubject && t.subject !== selectedSubject) return false
    if (selectedGrade !== "" && t.grade !== selectedGrade) return false
    if (selectedDifficulty && t.difficulty !== selectedDifficulty) return false
    return true
  })

  const featured = filtered.filter((t) => t.isFeatured)
  const others = filtered.filter((t) => !t.isFeatured)

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll(".gsap-template-card")
      gsap.fromTo(cards, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power3.out" })
    }
  }, [search, selectedSubject, selectedGrade, selectedDifficulty])

  async function useTemplate(id: string) {
    setUsingId(id)
    try {
      const res = await fetch(`/api/templates/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      toast.success("Template applied! Opening editor...")
      router.push(`/teacher/lessons/${data.lessonId}/edit`)
    } catch {
      toast.error("Failed to apply template")
      setUsingId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-outline-variant">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-background">Template Gallery</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Accelerate your curriculum development with premium, pre-built lesson structures.</p>
      </div>

      {/* Filters */}
      <div className="mb-6 p-6 rounded-xl bg-surface-container-lowest border border-outline-variant shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="w-full">
            <label className="block text-label-caps font-label-caps text-on-surface-variant uppercase mb-2">Search Templates</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: "18px" }}>search</span>
              <input
                type="text"
                placeholder="Keywords, subjects, or topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border border-outline-variant rounded-xl bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-48">
              <label className="block text-label-caps font-label-caps text-on-surface-variant uppercase mb-2">Subject</label>
              <div className="relative">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="">All Subjects</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-label-caps font-label-caps text-on-surface-variant uppercase mb-2">Grade</label>
              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : "")}
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="">All Grades</option>
                  {GRADES.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <label className="block text-label-caps font-label-caps text-on-surface-variant uppercase mb-2">Difficulty</label>
              <div className="relative">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-outline-variant rounded-xl text-sm bg-surface outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="">All Levels</option>
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d === "BEGINNER" ? "Beginner" : d === "INTERMEDIATE" ? "Intermediate" : "Advanced"}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {usingId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface-container-lowest rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl border border-primary">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-headline-md font-headline-md text-on-background">Provisioning Template...</p>
          </div>
        </div>
      )}

      <div ref={containerRef}>
        {filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-outline-variant bg-surface">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-50 mb-4" style={{ fontSize: "48px" }}>filter_alt</span>
            <h3 className="text-headline-md font-headline-md text-on-background mb-2">No templates found</h3>
            <p className="text-on-surface-variant">Adjust your filters to discover more resources.</p>
            <button
              onClick={() => { setSearch(""); setSelectedSubject(""); setSelectedGrade(""); setSelectedDifficulty("") }}
              className="mt-6 px-6 py-2 rounded-lg text-sm font-semibold text-primary border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div className="mb-12">
                <h2 className="text-headline-md font-headline-md text-on-background mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined fill text-amber-500">star</span>
                  Curated Collections
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featured.map((t) => <TemplateCard key={t.id} template={t} onUse={useTemplate} />)}
                </div>
              </div>
            )}
            {others.length > 0 && (
              <div>
                <h2 className="text-headline-md font-headline-md text-on-background mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  All Templates <span className="text-lg font-normal text-on-surface-variant">({others.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {others.map((t) => <TemplateCard key={t.id} template={t} onUse={useTemplate} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
