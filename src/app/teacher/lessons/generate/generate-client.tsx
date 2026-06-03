"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const BLOCK_LABELS: Record<string, string> = {
  RICH_TEXT: "Reading", QUOTE: "Quote",
  MULTIPLE_CHOICE: "Multiple Choice", TRUE_FALSE: "True/False",
  FILL_BLANK: "Fill Blank", ORDERING: "Ordering",
  MATCHING: "Matching", VIDEO: "Video",
  IMAGE: "Image", PDF: "PDF", AUDIO: "Audio",
  DRAWING: "Drawing", HOMEWORK_UPLOAD: "Homework",
}

const BLOCK_COLORS: Record<string, string> = {
  RICH_TEXT: "bg-secondary-container text-primary",
  QUOTE: "bg-purple-100 text-purple-700",
  MULTIPLE_CHOICE: "bg-emerald-100 text-emerald-700",
  TRUE_FALSE: "bg-teal-100 text-teal-700",
  FILL_BLANK: "bg-cyan-100 text-cyan-700",
  ORDERING: "bg-orange-100 text-orange-700",
  MATCHING: "bg-pink-100 text-pink-700",
  VIDEO: "bg-red-100 text-red-700",
  IMAGE: "bg-amber-100 text-amber-700",
  PDF: "bg-rose-100 text-rose-700",
  AUDIO: "bg-indigo-100 text-indigo-700",
  DRAWING: "bg-violet-100 text-violet-700",
  HOMEWORK_UPLOAD: "bg-slate-100 text-slate-700",
}

export function GenerateLessonClient({ subjects }: { subjects: { id: string; name: string; grade: number }[] }) {
  const router = useRouter()
  const [sourceType, setSourceType] = useState<"text" | "topic" | "url">("text")
  const [source, setSource] = useState("")
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "")
  const [grade, setGrade] = useState(subjects[0]?.grade ?? 5)
  const [generating, setGenerating] = useState(false)
  const [provider, setProvider] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState(false)

  const toggleSection = (i: number) => {
    const next = new Set(expandedSections)
    if (next.has(i)) next.delete(i)
    else next.add(i)
    setExpandedSections(next)
  }

  const handleGenerate = async () => {
    if (!source.trim()) return
    setGenerating(true)
    setError("")
    setResult(null)
    setProvider("")
    try {
      const res = await fetch("/api/teacher/lessons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: source.trim(), sourceType }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Generation failed")
      } else {
        setResult(json.lesson)
        setProvider(json.provider)
        setExpandedSections(new Set(json.lesson.sections.map((_: any, i: number) => i)))
      }
    } catch {
      setError("Network error — check your connection")
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!result) return
    setSaving(true)
    try {
      const res = await fetch("/api/teacher/lessons/generate/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: result.title, subjectId, grade, sections: result.sections }),
      })
      const json = await res.json()
      if (res.ok) {
        router.push(`/teacher/lessons/${json.lessonId}/edit`)
      } else {
        setError(json.error ?? "Failed to save")
      }
    } catch {
      setError("Network error saving lesson")
    } finally {
      setSaving(false)
    }
  }

  const sourcePlaceholder = sourceType === "text"
    ? "Paste your lesson content here — text, notes, or an article..."
    : sourceType === "topic"
      ? "Enter a topic name, e.g. 'Photosynthesis' or 'World War II'..."
      : "Enter a URL, e.g. https://en.wikipedia.org/wiki/Photosynthesis..."

  const tabs = [
    { key: "text" as const, label: "From Text" },
    { key: "topic" as const, label: "From Topic" },
    { key: "url" as const, label: "From URL" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-headline-md font-headline-md text-on-surface mb-2">Lesson Generator</h1>
        <p className="text-on-surface-variant font-body-main">Create structured, engaging learning materials instantly.</p>
      </div>

      {/* Two Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Input */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-outline-variant bg-surface-container-low/50">
              {tabs.map((tab) => {
                const isActive = sourceType === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setSourceType(tab.key); setResult(null) }}
                    className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${
                      isActive ? "text-primary border-b-2 border-primary bg-surface-container-lowest" : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Form Body */}
            <div className="p-4 flex flex-col flex-1 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Target Subject</label>
                <div className="relative">
                  <select
                    value={subjectId}
                    onChange={(e) => {
                      const s = subjects.find((s) => s.id === e.target.value)
                      setSubjectId(e.target.value)
                      if (s) setGrade(s.grade)
                    }}
                    className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (Grade {s.grade})</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex justify-between items-center">
                  <label className="text-label-caps font-label-caps text-on-surface-variant uppercase">Source Material</label>
                  <span className="text-xs text-on-surface-variant">{source.length} / 5000 chars</span>
                </div>
                {sourceType === "url" ? (
                  <input
                    type="url"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder={sourcePlaceholder}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  />
                ) : (
                  <textarea
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full flex-1 min-h-[300px] bg-surface border border-outline-variant rounded-lg p-4 text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                    placeholder={sourcePlaceholder}
                    rows={sourceType === "topic" ? 2 : 8}
                  />
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant">
              <button
                onClick={handleGenerate}
                disabled={generating || !source.trim() || subjects.length === 0}
                className="w-full bg-primary text-on-primary font-semibold py-3 rounded-lg hover:bg-surface-tint hover:shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><span className="material-symbols-outlined group-hover:rotate-12 transition-transform" style={{ fontSize: "20px" }}>magic_button</span> Generate Lesson</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0_4px_20px_rgba(0,104,95,0.05)] overflow-hidden flex flex-col h-full relative">
            {/* Decorative header bar */}
            <div className="h-2 bg-primary w-full absolute top-0 left-0"></div>

            {generating ? (
              <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="text-sm font-medium text-on-surface">Generating your lesson...</p>
                <p className="mt-1 text-xs text-on-surface-variant">AI is analyzing your source and building sections with quizzes</p>
              </div>
            ) : result ? (
              <>
                {/* Preview Header */}
                <div className="p-6 border-b border-surface-container-high pt-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-surface-container-low text-primary border border-primary/20 rounded-full text-label-caps font-label-caps uppercase tracking-wider">Preview Generated</span>
                    <div className="flex gap-2">
                      <span className="rounded-full bg-primary-fixed px-2.5 py-0.5 text-xs font-medium text-on-primary-fixed-variant">via {provider}</span>
                    </div>
                  </div>
                  <h2 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface mb-2">{result.title}</h2>
                  <p className="text-on-surface-variant">{result.subject} &middot; Grade {result.grade} &middot; {result.estimatedMinutes} min &middot; {result.totalPoints} pts &middot; {result.sections.length} sections</p>
                </div>

                {/* Preview Content (Accordions) */}
                <div className="p-4 flex-1 overflow-y-auto bg-surface flex flex-col gap-4">
                  {result.sections.map((section: any, si: number) => {
                    const isOpen = expandedSections.has(si)
                    const quizBlocks = section.blocks.filter((b: any) => ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "ORDERING", "MATCHING"].includes(b.blockType))
                    const contentBlocks = section.blocks.filter((b: any) => !["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "ORDERING", "MATCHING"].includes(b.blockType))

                    return (
                      <div key={si} className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(si)}
                          className="w-full px-5 py-4 flex justify-between items-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors text-left"
                        >
                          <span className="text-lesson-title font-lesson-title text-on-surface">{section.title}</span>
                          <span className="material-symbols-outlined text-on-surface-variant">{isOpen ? "expand_less" : "expand_more"}</span>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-2 border-t border-surface-container flex flex-col gap-3">
                            {contentBlocks.map((block: any, bi: number) => (
                              <div key={bi} className="p-4 rounded-lg bg-surface-container border border-surface-container-high flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-secondary-container text-primary flex items-center justify-center shrink-0 mt-1">
                                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                                    {block.blockType === "RICH_TEXT" ? "article" : block.blockType === "QUOTE" ? "format_quote" : block.blockType === "VIDEO" ? "videocam" : block.blockType === "IMAGE" ? "image" : "article"}
                                  </span>
                                </div>
                                <div>
                                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mb-1 ${BLOCK_COLORS[block.blockType] || "bg-gray-100 text-gray-700"}`}>{BLOCK_LABELS[block.blockType] || block.blockType}</span>
                                  {block.blockType === "RICH_TEXT" ? (
                                    <div className="text-sm text-on-surface-variant line-clamp-2" dangerouslySetInnerHTML={{ __html: block.config.content?.slice(0, 200) || "" }} />
                                  ) : block.blockType === "QUOTE" ? (
                                    <p className="text-sm italic text-on-surface-variant line-clamp-1">"{block.config.text}"</p>
                                  ) : (
                                    <p className="text-sm text-on-surface-variant">{block.config.fileId || block.config.url || block.config.searchQuery || "Configured"}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {quizBlocks.map((block: any, bi: number) => (
                              <div key={bi} className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex gap-4 items-start">
                                <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center shrink-0 mt-1">
                                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>help_center</span>
                                </div>
                                <div>
                                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mb-1 ${BLOCK_COLORS[block.blockType] || "bg-gray-100 text-gray-700"}`}>{BLOCK_LABELS[block.blockType] || block.blockType}</span>
                                  <p className="text-sm font-medium text-on-surface">{block.config.question || block.config.statement || block.config.instruction || block.config.sentenceWithBlanks?.slice(0, 100)}</p>
                                  <p className="mt-0.5 text-xs text-on-surface-variant">{block.config.points} pts</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-on-primary font-semibold py-3 px-8 rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><span className="material-symbols-outlined" style={{ fontSize: "20px" }}>save</span> Save to Drafts</>}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center flex-1 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-30 mb-4" style={{ fontSize: "64px" }}>auto_stories</span>
                <p className="text-on-surface-variant">Your generated lesson preview will appear here.</p>
                <p className="text-xs text-on-surface-variant mt-2">Fill in the source material and click generate.</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border-t border-red-200">
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <span className="material-symbols-outlined text-red-500" style={{ fontSize: "18px" }}>error</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
