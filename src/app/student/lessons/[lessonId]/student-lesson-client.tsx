"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { BlockContent, shortLabel } from "@/components/preview/BlockContent"

interface Props {
  lesson: {
    id: string
    title: string
    blockGap: number
    sections: { id: string; blocks: { id: string; blockType: string; config: any; stepOrder: number }[] }[]
    subject: { name: string; grade: number }
    teacher: { name: string }
  }
  enrollment: {
    id: string
    status: string
    score: number
    currentStepIndex: number
    totalSteps: number
    completedAt: string | null
  } | null
  userId: string
}

export function StudentLessonClient({ lesson, enrollment: initialEnrollment, userId }: Props) {
  const [enrollment, setEnrollment] = useState(initialEnrollment)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [viewedSteps, setViewedSteps] = useState<Set<number>>(new Set())
  const blockRefs = useRef<(HTMLElement | null)[]>([])
  const [submittedBlocks, setSubmittedBlocks] = useState<Set<string>>(new Set())

  const sections = lesson.sections || []
  const allBlocks = sections.flatMap((s) => s.blocks || [])
  const stepBlocks = allBlocks.filter((b) => b.stepOrder >= 0).sort((a, b) => a.stepOrder - b.stepOrder)
  const decorativeBlocks = allBlocks.filter((b) => b.stepOrder < 0)

  const isCompleted = enrollment?.status === "COMPLETED"
  const progress = stepBlocks.length > 0 ? Math.round((viewedSteps.size / stepBlocks.length) * 100) : 0

  const enroll = useCallback(async () => {
    if (enrollment) return
    setLoading(true)
    try {
      const res = await fetch(`/api/student/lessons/${lesson.id}/enroll`, { method: "POST" })
      const data = await res.json()
      setEnrollment(data.enrollment)
    } catch (e) {
      console.error("Enroll failed", e)
    } finally {
      setLoading(false)
    }
  }, [enrollment, lesson.id])

  useEffect(() => { enroll() }, [enroll])

  useEffect(() => {
    fetch("/api/student/daily-activity", { method: "POST" }).catch(() => {})
  }, [])

  useEffect(() => {
    if (stepBlocks.length === 0) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-step-index"))
          if (entry.isIntersecting) {
            setActiveStep(index)
            setViewedSteps((prev) => { const n = new Set(prev); n.add(index); return n })
          }
        })
      },
      { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" }
    )
    blockRefs.current.forEach((el) => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [stepBlocks.length])

  const scrollToStep = (i: number) => blockRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })

  const submitAnswer = async (blockId: string, answerJson: any, isCorrect: boolean, pointsEarned: number) => {
    const res = await fetch(`/api/student/lessons/${lesson.id}/blocks/${blockId}/attempt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answerJson, isCorrect, pointsEarned }),
    })
    if (res.ok) {
      setEnrollment((prev) => prev ? { ...prev, score: (prev.score ?? 0) + pointsEarned } : prev)
      setSubmittedBlocks((prev) => new Set(prev).add(blockId))
    }
  }

  const completeLesson = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/student/lessons/${lesson.id}/complete`, { method: "POST" })
      const data = await res.json()
      setEnrollment(data.enrollment)
    } finally {
      setLoading(false)
    }
  }

  if (isCompleted) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-4xl shadow-lg">
          <span className="material-symbols-outlined fill text-primary" style={{ fontSize: "40px" }}>emoji_events</span>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-on-background">Lesson Complete!</h1>
        <div className="mx-auto mb-4 flex items-center justify-center gap-3">
          <span className="text-3xl font-bold text-primary">{enrollment?.score ?? 0}</span>
          <span className="text-sm text-on-surface-variant">points earned</span>
        </div>
        {enrollment?.completedAt && (
          <p className="mb-8 text-xs text-on-surface-variant">
            Completed {new Date(enrollment.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        <a href="/student" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg">
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
          Back to Dashboard
        </a>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 w-full h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-4 z-50">
        <button className="text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="text-center flex-1 mx-4">
          <h1 className="text-sm font-semibold truncate">{lesson.title}</h1>
          <p className="text-label-caps text-label-caps text-secondary uppercase">{progress}% Complete</p>
        </div>
        <button className="text-on-surface hover:bg-surface-container-low p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">menu_open</span>
        </button>
      </header>

      {/* Left Sidebar */}
      <aside className="max-md:hidden md:flex flex-col w-[320px] bg-surface-container-lowest border-r border-outline-variant h-full flex-shrink-0 relative z-20">
        <div className="px-6 pt-6 pb-4">
          <a href="/student" className="inline-flex items-center text-secondary hover:text-primary transition-colors mb-4 group" style={{ textDecoration: "none" }}>
            <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform" style={{ fontSize: "20px" }}>arrow_back</span>
            <span className="text-sm font-medium">Back to Course</span>
          </a>
          <div className="space-y-2">
            <span className="text-label-caps text-label-caps text-secondary uppercase tracking-wider block">{lesson.subject.name} / Form {lesson.subject.grade} / {lesson.teacher.name}</span>
            <h1 className="text-headline-md font-headline-md text-on-surface leading-tight">{lesson.title}</h1>
          </div>
        </div>

        {/* Progress */}
        <div className="px-6 pb-4 border-b border-outline-variant">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-on-surface">{progress}%</span>
            <span className="text-sm text-secondary">Progress</span>
          </div>
          <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Section Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {sections.map((section) => {
            const sectionSteps = section.blocks.filter((b) => b.stepOrder >= 0).sort((a, b) => a.stepOrder - b.stepOrder)
            if (sectionSteps.length === 0) return null
            return (
              <div key={section.id} className="mb-4">
                {sectionSteps.map((block) => {
                  const stepIndex = stepBlocks.indexOf(block)
                  const isActive = activeStep === stepIndex
                  const isViewed = viewedSteps.has(stepIndex)
                  return (
                    <button
                      key={block.id}
                      onClick={() => scrollToStep(stepIndex)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        isActive ? "bg-secondary-container border-l-4 border-primary" : "hover:bg-surface-container-low"
                      }`}
                    >
                      <span className={`material-symbols-outlined ${
                        isViewed ? "text-primary fill" : isActive ? "text-primary" : "text-outline"
                      }`} style={{ fontSize: "20px" }}>
                        {isViewed ? "check_circle" : isActive ? "play_circle" : "lock"}
                      </span>
                      <span className={`flex-1 text-sm ${
                        isActive ? "font-semibold text-on-secondary-container" : isViewed ? "text-on-surface" : "text-outline"
                      }`}>
                        {block.stepOrder}. {shortLabel(block.blockType)}
                      </span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col h-full bg-background relative pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto relative pb-[100px]">
          <div className="max-w-[800px] mx-auto w-full px-5 md:px-8 py-6 md:py-10 space-y-6">
            {stepBlocks.length === 0 && decorativeBlocks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-on-surface-variant">
                {loading ? "Loading..." : "No content in this lesson yet."}
              </div>
            ) : (
              <>
                {stepBlocks.map((block, i) => (
                  <section
                    key={block.id}
                    ref={(el) => { blockRefs.current[i] = el }}
                    data-step-index={i}
                    className={`scroll-mt-28 bg-surface-container-lowest rounded-xl p-6 ambient-glow ${
                      activeStep === i ? "ring-2 ring-primary relative overflow-hidden" : "border border-outline-variant"
                    }`}
                  >
                    {activeStep === i && <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>}
                    <header className="flex items-center gap-3 mb-4">
                      <span className={`material-symbols-outlined ${viewedSteps.has(i) ? "text-primary fill" : "text-on-surface-variant"}`} style={{ fontSize: "28px" }}>
                        {viewedSteps.has(i) ? "check_circle" : activeStep === i ? "play_circle" : "radio_button_unchecked"}
                      </span>
                      <h2 className="text-headline-md font-headline-md text-on-surface">{block.stepOrder}. {shortLabel(block.blockType)}</h2>
                    </header>
                    <BlockContent
                      block={block}
                      onAnswer={(answerJson, correct, points) => submitAnswer(block.id, answerJson, correct, points)}
                    />
                  </section>
                ))}

                {decorativeBlocks.length > 0 && (
                  <div className="pt-8 border-t border-outline-variant space-y-6">
                    {decorativeBlocks.map((block) => (
                      <section key={block.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6">
                        <BlockContent block={block} />
                      </section>
                    ))}
                  </div>
                )}

                {viewedSteps.size === stepBlocks.length && stepBlocks.length > 0 && (
                  <div className="mt-8 text-center rounded-xl border border-success/20 bg-success/5 p-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                      <span className="material-symbols-outlined fill text-success" style={{ fontSize: "32px" }}>check_circle</span>
                    </div>
                    <h2 className="text-lg font-bold text-on-background">All Steps Viewed</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">You&apos;ve viewed all {stepBlocks.length} steps. Complete the lesson to save your progress.</p>
                    <button
                      onClick={completeLesson}
                      disabled={loading}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Completing..." : "Complete Lesson"}
                      <span className="material-symbols-outlined fill" style={{ fontSize: "18px" }}>check_circle</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant px-4 md:px-8 py-4 flex justify-between items-center z-30">
          <button
            onClick={() => scrollToStep(Math.max(0, activeStep - 1))}
            disabled={activeStep <= 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-primary hover:bg-surface-container-low transition-colors font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform" style={{ fontSize: "20px" }}>chevron_left</span>
            Previous
          </button>
          <button
            disabled={viewedSteps.size < stepBlocks.length}
            onClick={completeLesson}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              viewedSteps.size === stepBlocks.length && stepBlocks.length > 0
                ? "bg-primary text-on-primary hover:bg-primary/90"
                : "bg-surface-variant text-outline cursor-not-allowed"
            }`}
          >
            Complete Lesson
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{viewedSteps.size === stepBlocks.length ? "check_circle" : "lock"}</span>
          </button>
        </div>
      </main>
    </div>
  )
}
