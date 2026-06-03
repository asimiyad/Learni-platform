"use client"

import { useState, useRef, useCallback } from "react"
import type { Section, LessonBlock } from "@/types/block"
import { BlockCard } from "./BlockCard"
import { cn } from "@/lib/utils"
import { GripVertical, Plus, Trash2, Layers } from "lucide-react"
import { useBuilderStore } from "@/store/lessonBuilder"

interface Props {
  sections: Section[]
  selectedBlockId: string | null
  selectedSectionId: string | null
  onSelectBlock: (id: string) => void
  onSelectSection: (id: string) => void
  onDeleteBlock: (id: string) => void
  onDeleteSection: (id: string) => void
  onReorderSections: (sections: Section[]) => void
  onMoveBlock: (blockId: string, targetSectionId: string) => void
  onReorderBlocks: (sectionId: string, blockIds: string[]) => void
}

export function BuilderCanvas({
  sections, selectedBlockId, selectedSectionId,
  onSelectBlock, onSelectSection, onDeleteBlock, onDeleteSection,
  onReorderSections, onMoveBlock, onReorderBlocks,
}: Props) {
  const updateBlockGrid = useBuilderStore((s) => s.updateBlockGrid)
  const lesson = useBuilderStore((s) => s.lesson)
  const blockGap = lesson?.blockGap ?? 24

  function handleWidthChange(blockId: string, delta: number) {
    const block = sections.flatMap((s) => s.blocks).find((b) => b.id === blockId)
    if (!block) return
    updateBlockGrid(blockId, { gridWidth: Math.max(1, Math.min(12, block.gridWidth + delta)) })
  }

  function handleHeightChange(blockId: string, delta: number) {
    const block = sections.flatMap((s) => s.blocks).find((b) => b.id === blockId)
    if (!block) return
    updateBlockGrid(blockId, { gridHeight: Math.max(1, Math.min(6, block.gridHeight + delta)) })
  }

  // ---- Section drag (HTML5) ----
  function handleSectionDragStart(e: React.DragEvent, index: number) {
    e.dataTransfer.setData("text/plain", `section:${index}`)
    e.dataTransfer.effectAllowed = "move"
  }

  function handleSectionDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  function handleSectionDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault()
    const data = e.dataTransfer.getData("text/plain")
    if (!data.startsWith("section:")) return
    const sourceIndex = parseInt(data.split(":")[1])
    if (isNaN(sourceIndex) || sourceIndex === targetIndex) return
    const newSections = [...sections]
    const [moved] = newSections.splice(sourceIndex, 1)
    newSections.splice(targetIndex, 0, moved)
    onReorderSections(newSections)
  }

  // ---- Block drag (pointer-based, refs to avoid stale closures) ----
  const dragRef = useRef<{
    blockId: string
    sourceSectionId: string
    sourceIndex: number
    startY: number
  } | null>(null)
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [dropBeforeId, setDropBeforeId] = useState<string | null>(null)
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())

  const getDropTarget = useCallback((cursorY: number) => {
    let bestSection: string | null = null
    let bestBlockIndex = 0
    let bestBlockId: string | null = null
    let bestDist = Infinity
    let bestIsAfter = true

    for (const sec of sections) {
      const secEl = sectionRefs.current.get(sec.id)
      if (!secEl) continue
      const rect = secEl.getBoundingClientRect()
      if (cursorY < rect.top - 40 || cursorY > rect.bottom + 40) continue

      const blocks = sec.blocks
      if (blocks.length === 0) {
        return { sectionId: sec.id, blockId: null as string | null, isAfter: true }
      }

      const items = secEl.querySelectorAll<HTMLElement>("[data-block-el]")
      items.forEach((el) => {
        const r = el.getBoundingClientRect()
        const midY = r.top + r.height / 2
        const d = Math.abs(cursorY - midY)
        const bid = el.dataset.blockId || ""
        const idx = parseInt(el.dataset.blockIndex || "0")
        if (d < bestDist) {
          bestDist = d
          bestSection = sec.id
          bestBlockId = bid
          bestBlockIndex = idx
          bestIsAfter = cursorY > midY
        }
      })
    }

    if (!bestSection) return null
    return { sectionId: bestSection, blockId: bestBlockId, isAfter: bestIsAfter, blockIndex: bestBlockIndex }
  }, [sections])

  const handleBlockPointerDown = useCallback((e: React.PointerEvent, block: LessonBlock, sectionId: string, index: number) => {
    if (e.button !== 0) return
    e.preventDefault()

    dragRef.current = {
      blockId: block.id,
      sourceSectionId: sectionId,
      sourceIndex: index,
      startY: e.clientY,
    }

    setActiveDragId(block.id)
    document.body.style.cursor = "grabbing"
    document.body.style.userSelect = "none"

    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return
      const target = getDropTarget(ev.clientY)
      if (target && target.blockId !== dragRef.current.blockId) {
        const beforeId = target.isAfter ? null : target.blockId
        setDropBeforeId(beforeId)
      } else {
        setDropBeforeId(null)
      }
    }

    const onUp = (ev: PointerEvent) => {
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerup", onUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""

      const drag = dragRef.current
      if (drag) {
        const target = getDropTarget(ev.clientY)
        if (target) {
          const sec = sections.find((s) => s.id === target.sectionId)
          if (sec && drag.sourceSectionId === target.sectionId) {
            const blocks = [...sec.blocks]
            const srcIdx = blocks.findIndex((b) => b.id === drag.blockId)
            if (srcIdx !== -1) {
              let destIdx = target.blockIndex ?? blocks.length - 1
              if (target.isAfter) destIdx++
              if (srcIdx < destIdx) destIdx--
              const [moved] = blocks.splice(srcIdx, 1)
              blocks.splice(Math.min(destIdx, blocks.length), 0, moved)
              onReorderBlocks(target.sectionId, blocks.map((b) => b.id))
            }
          } else if (sec && drag.sourceSectionId !== target.sectionId) {
            onMoveBlock(drag.blockId, target.sectionId)
          }
        }
      }

      dragRef.current = null
      setActiveDragId(null)
      setDropBeforeId(null)
    }

    document.addEventListener("pointermove", onMove)
    document.addEventListener("pointerup", onUp)
  }, [sections, getDropTarget, onReorderBlocks, onMoveBlock])

  return (
    <div className="flex-1 overflow-y-auto bg-muted/30 builder-canvas p-4 md:p-6">
      {sections.length === 0 ? (
        <div className="text-center py-16 bg-white border border-border shadow-sm rounded-xl max-w-2xl mx-auto mt-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <Layers className="h-8 w-8" />
          </div>
          <p className="text-xl font-bold text-foreground mb-2">
            Start by adding a section
          </p>
          <p className="text-sm text-muted-foreground px-8 max-w-md">
            Sections are structural containers that hold your lesson blocks in a grid layout.
          </p>
        </div>
      ) : (
        <div className="py-4 space-y-6 w-full max-w-5xl mx-auto">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              ref={(el) => { if (el) sectionRefs.current.set(section.id, el) }}
              draggable
              onDragStart={(e) => handleSectionDragStart(e, sectionIndex)}
              onDragOver={handleSectionDragOver}
              onDrop={(e) => handleSectionDrop(e, sectionIndex)}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                "bg-white border rounded-xl overflow-hidden transition-all shadow-sm",
                selectedSectionId === section.id && !selectedBlockId ? "border-primary ring-1 ring-primary" : "border-border"
              )}
            >
              {/* Section Header */}
              <div className={cn(
                "flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20",
                selectedSectionId === section.id && !selectedBlockId && "bg-primary/5 border-primary/20"
              )}>
                <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                  <GripVertical className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">
                  Section {sectionIndex + 1}
                </span>
                <span className="text-xs font-medium text-muted-foreground border-l border-border pl-3">
                  {section.blocks.length} blocks
                </span>
                {section.config?.columns && section.config.columns !== 12 && (
                  <span className="text-xs font-medium text-muted-foreground border-l border-border pl-3">
                    {section.config.columns} cols
                  </span>
                )}
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectSection(section.id) }}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    title="Add block to section"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteSection(section.id) }}
                    className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Section Grid */}
              <div
                className="relative"
                style={{
                  backgroundColor: section.config?.backgroundColor || "transparent",
                  padding: section.config?.padding || "0.75rem",
                  maxHeight: "480px",
                  overflowY: "auto",
                }}
              >
                <div
                  className="absolute inset-0 grid pointer-events-none opacity-[0.04]"
                  style={{
                    gridTemplateColumns: `repeat(${section.config?.columns || 12}, 1fr)`,
                    gap: `${blockGap}px`,
                  }}
                >
                  {Array.from({ length: section.config?.columns || 12 }).map((_, i) => (
                    <div key={i} className="h-full" style={{ borderRight: i < (section.config?.columns || 12) - 1 ? "1px solid currentColor" : "none" }} />
                  ))}
                </div>

                {/* Blocks grid */}
                <div
                  className="relative"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${section.config?.columns || 12}, 1fr)`,
                    gap: `${blockGap}px`,
                    minHeight: "3rem",
                  }}
                >
                  {section.blocks.length === 0 ? (
                    <div
                      className="col-span-full border-2 border-dashed border-border rounded-lg bg-muted/20 flex items-center justify-center py-8 text-sm font-medium text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                      onPointerDown={(e) => {
                        if (activeDragId) {
                          e.preventDefault()
                          const drag = dragRef.current
                          if (drag && drag.sourceSectionId !== section.id) {
                            onMoveBlock(drag.blockId, section.id)
                            dragRef.current = null
                            setActiveDragId(null)
                          }
                        }
                      }}
                    >
                      {activeDragId ? "Drop block here" : "Drop blocks here"}
                    </div>
                  ) : (
                    section.blocks.map((block, blockIdx) => {
                      const showDropBefore = dropBeforeId === block.id && activeDragId !== block.id

                      return (
                        <div key={block.id} className="contents">
                          {showDropBefore && (
                            <div className="col-span-full h-1 bg-primary/50 rounded-full animate-in fade-in" />
                          )}
                          <div
                            data-block-el
                            data-block-id={block.id}
                            data-block-index={blockIdx}
                            onClick={(e) => { e.stopPropagation(); onSelectBlock(block.id) }}
                            onPointerDown={(e) => handleBlockPointerDown(e, block, section.id, blockIdx)}
                            className={cn(
                              activeDragId === block.id ? "opacity-30" : "",
                              "h-full"
                            )}
                            style={{
                              gridColumn: `${block.gridColumn || 1} / span ${block.gridWidth || 12}`,
                              gridRow: `${block.gridRow || 1} / span ${block.gridHeight || 1}`
                            }}
                          >
                            <BlockCard
                              block={block}
                              isSelected={selectedBlockId === block.id}
                              onDelete={() => onDeleteBlock(block.id)}
                              onClone={() => {}}
                              onWidthChange={(delta) => handleWidthChange(block.id, delta)}
                              onHeightChange={(delta) => handleHeightChange(block.id, delta)}
                            />
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
