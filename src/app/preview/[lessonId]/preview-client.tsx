"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { CheckCircle, Circle, Clock, Trophy, BookOpen, ChevronRight, ChevronLeft } from "lucide-react"
import { BlockContent, shortLabel } from "@/components/preview/BlockContent"

interface Props { lesson: any }

export function PreviewClient({ lesson }: Props) {
  const sections = lesson.sections || []
  const allBlocks = sections.flatMap((s: any) => s.blocks || [])

  const stepBlocks = useMemo(() => {
    return allBlocks
      .filter((b: any) => b.stepOrder >= 0)
      .sort((a: any, b: any) => a.stepOrder - b.stepOrder)
  }, [allBlocks])

  const decorativeBlocks = allBlocks.filter((b: any) => b.stepOrder < 0)

  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (stepBlocks.length === 0) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-step-index"))
          if (entry.isIntersecting) {
            setActiveStep(index)
            setCompletedSteps((prev) => { const n = new Set(prev); n.add(index); return n })
          }
        })
      },
      { threshold: 0.35, rootMargin: "-80px 0px -40% 0px" }
    )
    blockRefs.current.forEach((el) => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [stepBlocks.length])

  const scrollToStep = (i: number) => blockRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })

  const progress = stepBlocks.length > 0 ? Math.round((completedSteps.size / stepBlocks.length) * 100) : 0

  return (
    <div className="flex h-[calc(100vh-2rem)]">
      {/* Left Sidebar — Step Sequence Navigation */}
      <aside className="w-64 lg:w-72 shrink-0 border-r border-outline-variant bg-surface-container-lowest overflow-y-auto max-md:hidden md:flex flex-col">
        <div className="p-5 border-b border-border">
          <h2 className="text-sm font-semibold text-card-foreground truncate">{lesson.title}</h2>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-muted-foreground font-medium tabular-nums">{progress}%</span>
          </div>
          {lesson.estimatedDuration && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {lesson.estimatedDuration} min
            </div>
          )}
          {stepBlocks.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {stepBlocks.length} steps in this lesson
            </p>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {sections.map((section: any) => {
            const sectionStepBlocks = section.blocks
              .filter((b: any) => b.stepOrder >= 0)
              .sort((a: any, b: any) => a.stepOrder - b.stepOrder)
            if (sectionStepBlocks.length === 0) return null
            return (
              <div key={section.id} className="mb-3">
                <div className="eyebrow px-3 py-1.5">Section {sections.indexOf(section) + 1}</div>
                {sectionStepBlocks.map((block: any) => {
                  const stepIndex = stepBlocks.indexOf(block)
                  const isActive = activeStep === stepIndex
                  const isViewed = completedSteps.has(stepIndex)
                  return (
                    <button
                      key={block.id}
                      onClick={() => scrollToStep(stepIndex)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-left text-sm transition-all-200 ${
                        isActive ? "bg-primary-light text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                        {isViewed ? <CheckCircle className="w-3.5 h-3.5 text-success" /> : <Circle className="w-3.5 h-3.5 text-border" />}
                      </span>
                      <span className="truncate">{block.stepOrder}. {shortLabel(block.blockType)}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToStep(Math.max(0, activeStep - 1))}
              disabled={activeStep <= 0}
              className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground disabled:opacity-30 transition-all-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted-foreground font-medium">
              {activeStep + 1} / {stepBlocks.length}
            </span>
            <button
              onClick={() => scrollToStep(Math.min(stepBlocks.length - 1, activeStep + 1))}
              disabled={activeStep >= stepBlocks.length - 1}
              className="p-1.5 rounded-sm hover:bg-muted text-muted-foreground disabled:opacity-30 transition-all-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile progress bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-muted-foreground font-medium tabular-nums">{progress}%</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background">
        {stepBlocks.length === 0 && decorativeBlocks.length === 0 ? (
          <div className="max-w-lg mx-auto px-6 py-20 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-40" />
            <h2 className="text-lg font-semibold text-card-foreground mb-2">This lesson is empty</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The teacher hasn&apos;t added any content yet. Check back later or ask them to publish this lesson.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-5 md:px-8 py-8 md:py-12">
            {stepBlocks.map((block: any, i: number) => (
              <div
                key={block.id}
                ref={(el) => { blockRefs.current[i] = el }}
                data-step-index={i}
                className="scroll-mt-24"
              >
                <div className={i < stepBlocks.length - 1 ? "mb-12 md:mb-16" : ""}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs text-muted-foreground font-mono tabular-nums">
                      {String(block.stepOrder).padStart(2, "0")}
                    </span>
                    {completedSteps.has(i) && (
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                    )}
                  </div>
                  <BlockContent block={block} />
                </div>
              </div>
            ))}

            {decorativeBlocks.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                {decorativeBlocks.map((block: any, i: number) => (
                  <div key={block.id} className="mb-8">
                    <BlockContent block={block} />
                  </div>
                ))}
              </div>
            )}

            {completedSteps.size === stepBlocks.length && stepBlocks.length > 0 && (
              <div className="mt-16 card-base p-8 text-center border-success/30">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-success" />
                </div>
                <h2 className="text-xl font-bold text-card-foreground mb-1">Lesson Complete!</h2>
                <p className="text-sm text-muted-foreground">
                  You&apos;ve completed all {stepBlocks.length} steps in this lesson.
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {lesson.estimatedDuration ? `Estimated ${lesson.estimatedDuration} min` : "Great work!"}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
