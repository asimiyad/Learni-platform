"use client"

import { create } from "zustand"
import type { LessonBlock, BlockType, BlockConfig, Section, SectionConfig } from "@/types/block"
import type { Lesson } from "@/types/lesson"

interface BuilderState {
  lesson: Lesson | null
  sections: Section[]
  isDirty: boolean
  selectedBlockId: string | null
  selectedSectionId: string | null
  isSettingsOpen: boolean

  setLesson: (lesson: Lesson) => void
  setSections: (sections: Section[]) => void
  addSection: (section: Section) => void
  updateSection: (sectionId: string, config: Partial<SectionConfig>) => void
  removeSection: (sectionId: string) => void
  reorderSections: (sections: Section[]) => void
  addBlock: (sectionId: string, block: LessonBlock) => void
  updateBlock: (blockId: string, config: Partial<BlockConfig>) => void
  updateBlockGrid: (blockId: string, grid: Partial<Pick<LessonBlock, "gridColumn" | "gridRow" | "gridWidth" | "gridHeight">>) => void
  updateBlockStepOrder: (blockId: string, stepOrder: number) => void
  updateBlockType: (blockId: string, blockType: BlockType) => void
  removeBlock: (blockId: string) => void
  moveBlock: (blockId: string, targetSectionId: string, newGridRow?: number) => void
  reorderBlocksInSection: (sectionId: string, blockIds: string[]) => void
  selectBlock: (blockId: string | null) => void
  selectSection: (sectionId: string | null) => void
  setDirty: (dirty: boolean) => void
  setLessonField: (field: string, value: any) => void
  toggleSettings: () => void
  setEstimatedDuration: (duration: number | null) => void
  setBlockGap: (gap: number) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
  lesson: null,
  sections: [],
  isDirty: false,
  selectedBlockId: null,
  selectedSectionId: null,
  isSettingsOpen: false,

  setLesson: (lesson) => set({ lesson }),

  setSections: (sections) => set({ sections }),

  addSection: (section) =>
    set((state) => ({ sections: [...state.sections, section], isDirty: true })),

  updateSection: (sectionId, config) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, config: { ...s.config, ...config } } : s
      ),
      isDirty: true,
    })),

  removeSection: (sectionId) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== sectionId),
      selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
      isDirty: true,
    })),

  reorderSections: (sections) => set({ sections, isDirty: true }),

  addBlock: (sectionId, block) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId ? { ...s, blocks: [...s.blocks, block] } : s
      ),
      isDirty: true,
    })),

  updateBlock: (blockId, config) =>
    set((state) => ({
      sections: state.sections.map((s) => ({
        ...s,
        blocks: s.blocks.map((b) =>
          b.id === blockId ? { ...b, config: { ...b.config, ...config } as BlockConfig } : b
        ),
      })),
      isDirty: true,
    })),

  updateBlockGrid: (blockId, grid) =>
    set((state) => ({
      sections: state.sections.map((s) => ({
        ...s,
        blocks: s.blocks.map((b) =>
          b.id === blockId ? { ...b, ...grid } : b
        ),
      })),
      isDirty: true,
    })),

  updateBlockStepOrder: (blockId, stepOrder) =>
    set((state) => ({
      sections: state.sections.map((s) => ({
        ...s,
        blocks: s.blocks.map((b) =>
          b.id === blockId ? { ...b, stepOrder } : b
        ),
      })),
      isDirty: true,
    })),

  updateBlockType: (blockId, blockType) =>
    set((state) => ({
      sections: state.sections.map((s) => ({
        ...s,
        blocks: s.blocks.map((b) =>
          b.id === blockId ? { ...b, blockType } : b
        ),
      })),
      isDirty: true,
    })),

  removeBlock: (blockId) =>
    set((state) => ({
      sections: state.sections.map((s) => ({
        ...s,
        blocks: s.blocks.filter((b) => b.id !== blockId),
      })),
      selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
      isDirty: true,
    })),

  moveBlock: (blockId, targetSectionId, newGridRow) =>
    set((state) => {
      let movedBlock: LessonBlock | null = null
      const cleaned = state.sections.map((s) => {
        const idx = s.blocks.findIndex((b) => b.id === blockId)
        if (idx === -1) return s
        movedBlock = s.blocks[idx]
        return { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) }
      })
      if (!movedBlock) return state
      const updated = cleaned.map((s) => {
        if (s.id !== targetSectionId) return s
        const maxRow = s.blocks.length > 0
          ? Math.max(...s.blocks.map((b) => b.gridRow + b.gridHeight), 1)
          : 1
        return {
          ...s,
          blocks: [
            ...s.blocks,
            { ...movedBlock!, sectionId: targetSectionId, gridRow: newGridRow ?? maxRow },
          ],
        }
      })
      return { sections: updated, isDirty: true }
    }),

  reorderBlocksInSection: (sectionId, blockIds) =>
    set((state) => ({
      sections: state.sections.map((s) => {
        if (s.id !== sectionId) return s
        const blockMap = new Map(s.blocks.map((b) => [b.id, b]))
        const reordered = blockIds
          .map((id, i) => {
            const b = blockMap.get(id)
            if (!b) return null
            return { ...b, gridRow: i + 1 }
          })
          .filter(Boolean) as LessonBlock[]
        return { ...s, blocks: reordered }
      }),
      isDirty: true,
    })),

  selectBlock: (blockId) => set({ selectedBlockId: blockId }),
  selectSection: (sectionId) => set({ selectedSectionId: sectionId }),

  setDirty: (dirty) => set({ isDirty: dirty }),

  setLessonField: (field, value) =>
    set((state) => ({
      lesson: state.lesson ? { ...state.lesson, [field]: value } : null,
      isDirty: true,
    })),

  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),

  setEstimatedDuration: (duration) =>
    set((state) => ({
      lesson: state.lesson ? { ...state.lesson, estimatedDuration: duration } : null,
      isDirty: true,
    })),

  setBlockGap: (gap) =>
    set((state) => ({
      lesson: state.lesson ? { ...state.lesson, blockGap: gap } : null,
      isDirty: true,
    })),
}))
