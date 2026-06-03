"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useBuilderStore } from "@/store/lessonBuilder"
import type { LessonBlock, BlockType, SectionConfig } from "@/types/block"
import { BuilderTopBar } from "@/components/builder/BuilderTopBar"
import { BlockToolbox } from "@/components/builder/BlockToolbox"
import { BuilderCanvas } from "@/components/builder/BuilderCanvas"
import { BlockProperties } from "@/components/builder/BlockProperties"
import { SectionSettings } from "@/components/builder/SectionSettings"
import { BottomBar } from "@/components/builder/BottomBar"
import { LessonSettingsModal } from "@/components/builder/LessonSettingsModal"
import { AiAssistant } from "@/components/builder/AiAssistant"
import { LivePreview } from "@/components/preview/LivePreview"
import { toast } from "sonner"

interface Props {
  lesson: any
}

export function BuilderClient({ lesson }: Props) {
  const router = useRouter()
  const [showPreview, setShowPreview] = useState(false)
  const {
    setLesson,
    setSections,
    lesson: storeLesson,
    sections,
    isDirty,
    selectedBlockId,
    selectedSectionId,
    isSettingsOpen,
    toggleSettings,
    setDirty,
    addSection,
    removeSection,
    reorderSections,
    updateSection,
    addBlock: addBlockToStore,
    removeBlock,
    moveBlock,
    reorderBlocksInSection,
    selectBlock,
    selectSection,
  } = useBuilderStore()

  useEffect(() => {
    setLesson(lesson)
    setSections(lesson.sections || [])
  }, [lesson, setLesson, setSections])

  const calculateTotalPoints = useCallback(() => {
    let sum = 0
    for (const section of sections) {
      for (const block of section.blocks) {
        const config = block.config as any
        if (["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "ORDERING", "MATCHING"].includes(block.blockType)) {
          sum += config.points || 0
        }
        if (block.blockType === "BONUS_POINTS") {
          sum += config.points || 0
        }
        if (["DRAWING", "HOMEWORK_UPLOAD"].includes(block.blockType)) {
          sum += config.completionPoints || 0
        }
      }
    }
    return sum
  }, [sections])

  const allBlocks = sections.flatMap((s) => s.blocks)
  const blockCount = allBlocks.length

  async function handleSave() {
    try {
      const totalPoints = calculateTotalPoints()
      const res = await fetch(`/api/lessons/${storeLesson?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: storeLesson?.title,
          totalPoints,
          estimatedDuration: storeLesson?.estimatedDuration,
        }),
      })
      if (!res.ok) throw new Error()
      setDirty(false)
      toast.success("Lesson saved")
    } catch {
      toast.error("Failed to save lesson")
    }
  }

  async function handlePublish() {
    try {
      const totalPoints = calculateTotalPoints()
      await fetch(`/api/lessons/${storeLesson?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: storeLesson?.title, totalPoints }),
      })
      await fetch(`/api/lessons/${storeLesson?.id}/publish`, { method: "POST" })
      setDirty(false)
      toast.success("Lesson published!")
      router.refresh()
    } catch {
      toast.error("Failed to publish lesson")
    }
  }

  async function handleUnpublish() {
    try {
      await fetch(`/api/lessons/${storeLesson?.id}/publish`, { method: "POST" })
      toast.success("Lesson unpublished")
      router.refresh()
    } catch {
      toast.error("Failed to unpublish")
    }
  }

  async function handleAddSection() {
    try {
      const res = await fetch(`/api/lessons/${storeLesson?.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: {} }),
      })
      if (!res.ok) throw new Error()
      const section = await res.json()
      addSection(section)
      selectSection(section.id)
      toast.success("Section added")
    } catch {
      toast.error("Failed to add section")
    }
  }

  async function handleAddBlock(blockType: BlockType) {
    const targetSectionId = selectedSectionId || sections[0]?.id
    if (!targetSectionId) {
      toast.error("Add a section first")
      return
    }
    try {
      const section = sections.find((s) => s.id === targetSectionId)
      const nextRow = section ? Math.max(...section.blocks.map((b) => b.gridRow + b.gridHeight), 1) : 1
      const res = await fetch(`/api/lessons/${storeLesson?.id}/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockType,
          sectionId: targetSectionId,
          gridColumn: 1,
          gridRow: nextRow,
          gridWidth: 12,
          gridHeight: 1,
        }),
      })
      if (!res.ok) throw new Error()
      const block = await res.json()
      addBlockToStore(targetSectionId, block)
      selectBlock(block.id)
    } catch {
      toast.error("Failed to add block")
    }
  }

  async function handleDeleteBlock(blockId: string) {
    try {
      const res = await fetch(`/api/lessons/${storeLesson?.id}/blocks/${blockId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      removeBlock(blockId)
      toast("Block deleted", {
        action: { label: "Undo", onClick: () => console.log("Undo not implemented") },
        duration: 5000,
      })
    } catch {
      toast.error("Failed to delete block")
    }
  }

  async function handleDeleteSection(sectionId: string) {
    try {
      const res = await fetch(`/api/lessons/${storeLesson?.id}/sections/${sectionId}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error()
      removeSection(sectionId)
      toast("Section deleted")
    } catch {
      toast.error("Failed to delete section")
    }
  }

  async function handleReorderSections(orderedSections: any[]) {
    const updated = orderedSections.map((s, i) => ({ id: s.id, orderIndex: i }))
    reorderSections(orderedSections)
    try {
      await fetch(`/api/lessons/${storeLesson?.id}/sections/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: updated }),
      })
    } catch {
      toast.error("Failed to reorder sections")
    }
  }

  async function handleMoveBlock(blockId: string, targetSectionId: string) {
    moveBlock(blockId, targetSectionId)
    try {
      const block = allBlocks.find((b) => b.id === blockId)
      if (!block) return
      await fetch(`/api/lessons/${storeLesson?.id}/blocks/${blockId}/move`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetSectionId }),
      })
    } catch {
      toast.error("Failed to move block")
    }
  }

  async function handleReorderBlocks(sectionId: string, blockIds: string[]) {
    reorderBlocksInSection(sectionId, blockIds)
    try {
      await fetch(`/api/lessons/${storeLesson?.id}/sections/${sectionId}/blocks/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockIds }),
      })
    } catch {
      toast.error("Failed to reorder blocks")
    }
  }

  const selectedBlock = selectedBlockId
    ? allBlocks.find((b) => b.id === selectedBlockId)
    : undefined

  return (
    <div className="h-[100dvh] flex flex-col">
      <BuilderTopBar
        onSave={handleSave}
        onPublish={handlePublish}
        onUnpublish={handleUnpublish}
        onSettings={toggleSettings}
        isDirty={isDirty}
        lessonId={storeLesson?.id}
        lessonStatus={storeLesson?.status}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />

      <div className="flex-1 flex overflow-hidden">

        <BlockToolbox
          onAddBlock={handleAddBlock}
          onAddSection={handleAddSection}
        />

          {showPreview ? (
          <div className="flex-1 flex">
            <div className="flex-1 overflow-hidden border-r border-border">
              <BuilderCanvas
                sections={sections}
                selectedBlockId={selectedBlockId}
                selectedSectionId={selectedSectionId}
                onSelectBlock={(id) => selectBlock(id)}
                onSelectSection={(id) => selectSection(id)}
                onDeleteBlock={handleDeleteBlock}
                onDeleteSection={handleDeleteSection}
                onReorderSections={handleReorderSections}
                onMoveBlock={handleMoveBlock}
                onReorderBlocks={handleReorderBlocks}
              />
            </div>
            <div className="flex-1 overflow-hidden border-l border-border">
              <LivePreview />
            </div>
          </div>
        ) : (
          <BuilderCanvas
            sections={sections}
            selectedBlockId={selectedBlockId}
            selectedSectionId={selectedSectionId}
            onSelectBlock={(id) => selectBlock(id)}
            onSelectSection={(id) => selectSection(id)}
            onDeleteBlock={handleDeleteBlock}
            onDeleteSection={handleDeleteSection}
            onReorderSections={handleReorderSections}
            onMoveBlock={handleMoveBlock}
            onReorderBlocks={handleReorderBlocks}
          />
        )}

        {selectedBlock && (
          <BlockProperties
            block={selectedBlock}
            lessonId={storeLesson?.id!}
          />
        )}

        {selectedSectionId && !selectedBlockId && (
          <SectionSettings
            section={sections.find((s) => s.id === selectedSectionId)!}
          />
        )}
      </div>

      <BottomBar
        totalPoints={calculateTotalPoints()}
        blockCount={blockCount}
        estimatedDuration={storeLesson?.estimatedDuration ?? null}
        onDurationChange={(d) => useBuilderStore.getState().setEstimatedDuration(d)}
      />

      {isSettingsOpen && <LessonSettingsModal />}
      <AiAssistant lessonId={storeLesson?.id!} />
    </div>
  )
}
