"use client"

import { useMemo } from "react"
import { useBuilderStore } from "@/store/lessonBuilder"
import { BookOpen } from "lucide-react"
import { BlockContent } from "./BlockContent"

export function LivePreview() {
  const lesson = useBuilderStore((s) => s.lesson)
  const sections = useBuilderStore((s) => s.sections)
  const blockGap = lesson?.blockGap ?? 24

  const allBlocks = useMemo(() => sections.flatMap((s) => s.blocks), [sections])

  const stepBlocks = useMemo(() => {
    return allBlocks
      .filter((b) => b.stepOrder >= 0)
      .sort((a, b) => a.stepOrder - b.stepOrder)
  }, [allBlocks])

  const decorativeBlocks = allBlocks.filter((b) => b.stepOrder < 0)

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Preview header bar */}
      <div className="bg-indigo-600 text-white text-center py-1.5 text-[10px] font-medium shrink-0">
        Live Preview — updates as you edit
      </div>

      <div className="flex-1 overflow-y-auto">
        {stepBlocks.length === 0 && decorativeBlocks.length === 0 ? (
          <div className="max-w-lg mx-auto px-6 py-16 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <h2 className="text-base font-semibold text-card-foreground mb-1">Empty lesson</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add blocks and assign step orders to see the student preview here.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Blocks with step order &ge; 0 appear in the focused sequence.
              Blocks with -1 are decorative.
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-5 md:px-8 py-6 md:py-8">
            {lesson && (
              <div className="mb-6">
                <h1 className="text-lg font-bold text-card-foreground">{lesson.title}</h1>
                {stepBlocks.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stepBlocks.length} step{stepBlocks.length > 1 ? "s" : ""}
                    {decorativeBlocks.length > 0 && ` + ${decorativeBlocks.length} decorative`}
                  </p>
                )}
              </div>
            )}

            {/* Step-ordered blocks */}
            {stepBlocks.map((block, i) => (
              <div key={block.id} style={{ marginBottom: i < stepBlocks.length - 1 ? `${blockGap}px` : 0 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    {String(block.stepOrder).padStart(2, "0")}
                  </span>
                </div>
                <BlockContent block={block} />
              </div>
            ))}

            {/* Decorative blocks */}
            {decorativeBlocks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                {decorativeBlocks.map((block) => (
                  <div key={block.id} style={{ marginBottom: `${blockGap}px` }}>
                    <BlockContent block={block} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
