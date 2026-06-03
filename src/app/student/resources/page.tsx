"use client"

import { useState } from "react"

interface Resource {
  id: string
  title: string
  type: "pdf" | "video" | "link" | "doc"
  subject: string
  description: string
  size?: string
  url: string
}

const RESOURCES: Resource[] = [
  { id: "1", title: "Algebra Fundamentals - Study Guide", type: "pdf", subject: "Mathematics", description: "Comprehensive guide covering linear equations, quadratic functions, and graphing techniques.", size: "2.4 MB", url: "#" },
  { id: "2", title: "Periodic Table Reference Sheet", type: "pdf", subject: "Science", description: "Interactive periodic table with element properties and electron configurations.", size: "1.8 MB", url: "#" },
  { id: "3", title: "Essay Writing Workshop Recording", type: "video", subject: "English Literature", description: "Recording of the essay structure and thesis development workshop.", size: "45 min", url: "#" },
  { id: "4", title: "World War II Timeline Visual", type: "doc", subject: "History", description: "Chronological overview of key events during World War II.", size: "3.1 MB", url: "#" },
  { id: "5", title: "Khan Academy - Calculus Playlist", type: "link", subject: "Mathematics", description: "Curated playlist of calculus tutorials from basic to advanced.", size: "12 videos", url: "#" },
  { id: "6", title: "Lab Safety Protocol Guide", type: "pdf", subject: "Science", description: "Mandatory safety procedures for all laboratory sessions.", size: "0.9 MB", url: "#" },
  { id: "7", title: "Arabic Vocabulary Flashcards", type: "doc", subject: "Arabic Language", description: "Digital flashcards for weekly vocabulary building exercises.", size: "1.2 MB", url: "#" },
  { id: "8", title: "Geography Map Reading Exercise", type: "pdf", subject: "Geography", description: "Practice exercises for topographic map reading and interpretation.", size: "4.6 MB", url: "#" },
  { id: "9", title: "Shakespeare - Macbeth Annotations", type: "doc", subject: "English Literature", description: "Line-by-line annotations and analysis of key scenes.", size: "2.7 MB", url: "#" },
  { id: "10", title: "Physics Formulas Quick Sheet", type: "pdf", subject: "Science", description: "Essential physics formulas for motion, forces, and energy.", size: "0.6 MB", url: "#" },
  { id: "11", title: "Python Coding Basics Tutorial", type: "video", subject: "ICT", description: "Introduction to Python programming with hands-on examples.", size: "32 min", url: "#" },
  { id: "12", title: "Art Techniques - Watercolor Guide", type: "pdf", subject: "Art", description: "Step-by-step watercolor painting techniques for beginners.", size: "5.2 MB", url: "#" },
]

const SUBJECTS = Array.from(new Set(RESOURCES.map((r) => r.subject)))

const TYPE_ICONS: Record<string, string> = {
  pdf: "description",
  video: "play_circle",
  link: "link",
  doc: "article",
}

const TYPE_COLORS: Record<string, string> = {
  pdf: "var(--tertiary)",
  video: "var(--primary)",
  link: "var(--secondary)",
  doc: "var(--inverse-primary)",
}

const TYPE_BG: Record<string, string> = {
  pdf: "var(--tertiary-fixed)",
  video: "var(--primary-fixed)",
  link: "var(--secondary-container)",
  doc: "var(--primary-fixed-dim)",
}

export default function ResourcesPage() {
  const [search, setSearch] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const filtered = RESOURCES.filter((r) => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    if (subjectFilter && r.subject !== subjectFilter) return false
    if (typeFilter && r.type !== typeFilter) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant ambient-glow">
        <div>
          <h2 className="text-headline-md font-headline-md text-on-background mb-1">Study Resources</h2>
          <p className="text-body-main font-body-main text-on-secondary-container">Access your study materials, guides, and references</p>
        </div>
        <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-outline-variant w-fit">
          <span className="material-symbols-outlined text-primary">folder_open</span>
          <span className="text-lesson-title font-lesson-title text-sm text-on-background">{RESOURCES.length} files</span>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: "18px" }}>search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-background outline-none focus:border-primary transition-colors"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-background outline-none focus:border-primary transition-colors"
        >
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-background outline-none focus:border-primary transition-colors"
        >
          <option value="">All Types</option>
          <option value="pdf">PDF</option>
          <option value="doc">Document</option>
          <option value="video">Video</option>
          <option value="link">Link</option>
        </select>
      </div>

      {/* Resources Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-xl border-2 border-dashed border-outline-variant text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2" style={{ fontSize: "48px" }}>search_off</span>
          <p className="text-sm text-center">No resources match your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resource) => (
            <a
              key={resource.id}
              href={resource.url}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary transition-colors ambient-glow group flex flex-col gap-3"
              style={{ textDecoration: "none" }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${TYPE_BG[resource.type]}` }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: TYPE_COLORS[resource.type] }}>{TYPE_ICONS[resource.type]}</span>
                </div>
                <span className="text-label-caps font-label-caps text-on-surface-variant">{resource.size}</span>
              </div>
              <div>
                <h3 className="text-lesson-title font-lesson-title text-sm text-on-background group-hover:text-primary transition-colors mb-1">{resource.title}</h3>
                <p className="text-xs text-on-secondary-container leading-relaxed">{resource.description}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-outline-variant">
                <span className="text-label-caps font-label-caps text-primary uppercase text-[10px]">{resource.subject}</span>
                <span className="text-label-caps font-label-caps text-on-surface-variant uppercase text-[10px]">{resource.type.toUpperCase()}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
