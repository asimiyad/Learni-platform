"use client"

import { useState } from "react"
import type { BlockType } from "@/types/block"
import { cn } from "@/lib/utils"
import { useBuilderStore } from "@/store/lessonBuilder"
import {
  Video, Image, FileText, Book, Headphones, Quote,
  CheckSquare, ToggleLeft, AlignLeft, ListOrdered, Columns,
  Brush, Upload, SeparatorHorizontal, Lock, Gift,   Search, Plus, Grid3X3
} from "lucide-react"

interface BlockCategory {
  name: string
  blocks: { type: BlockType; label: string; icon: React.ElementType }[]
}

const categories: BlockCategory[] = [
  {
    name: "Content",
    blocks: [
      { type: "VIDEO", label: "Video", icon: Video },
      { type: "IMAGE", label: "Image", icon: Image },
      { type: "RICH_TEXT", label: "Rich Text", icon: FileText },
      { type: "PDF", label: "PDF", icon: Book },
      { type: "AUDIO", label: "Audio", icon: Headphones },
      { type: "QUOTE", label: "Quote", icon: Quote },
    ],
  },
  {
    name: "Interaction",
    blocks: [
      { type: "MULTIPLE_CHOICE", label: "Multiple Choice", icon: CheckSquare },
      { type: "TRUE_FALSE", label: "True/False", icon: ToggleLeft },
      { type: "FILL_BLANK", label: "Fill in the Blank", icon: AlignLeft },
      { type: "ORDERING", label: "Ordering", icon: ListOrdered },
      { type: "MATCHING", label: "Matching", icon: Columns },
      { type: "DRAWING", label: "Drawing", icon: Brush },
      { type: "HOMEWORK_UPLOAD", label: "Homework Upload", icon: Upload },
    ],
  },
  {
    name: "Structural",
    blocks: [
      { type: "SECTION_DIVIDER", label: "Section Divider", icon: SeparatorHorizontal },
      { type: "CONDITIONAL_LOCK", label: "Conditional Lock", icon: Lock },
      { type: "BONUS_POINTS", label: "Bonus Points", icon: Gift },
    ],
  },
]

interface Props {
  onAddBlock: (type: BlockType) => void
  onAddSection: () => void
}

export function BlockToolbox({ onAddBlock, onAddSection }: Props) {
  const [search, setSearch] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Content: true,
    Interaction: true,
    Structural: true,
  })
  const lesson = useBuilderStore((s) => s.lesson)
  const blockGap = lesson?.blockGap ?? 24
  const setBlockGap = useBuilderStore((s) => s.setBlockGap)

  function toggleCategory(name: string) {
    setExpandedCategories((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="w-64 border-r border-border bg-white overflow-y-auto shrink-0 flex flex-col z-40">
      <div className="p-4 flex-1">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blocks..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/70 bg-transparent"
          />
        </div>

        {categories.map((category) => {
          const filteredBlocks = category.blocks.filter(
            (b) => b.label.toLowerCase().includes(search.toLowerCase())
          )
          if (filteredBlocks.length === 0) return null

          return (
            <div key={category.name} className="mb-4">
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex items-center justify-between w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                {category.name}
                <span className="text-sm font-normal">{expandedCategories[category.name] ? "−" : "+"}</span>
              </button>
              {expandedCategories[category.name] && (
                <div className="space-y-1 mt-1">
                  {filteredBlocks.map((block) => {
                    const Icon = block.icon
                    return (
                      <button
                        key={block.type}
                        onClick={() => onAddBlock(block.type)}
                        className={cn(
                          "flex items-center gap-3 w-full px-3 py-2 rounded-md transition-colors",
                          "text-muted-foreground hover:text-foreground hover:bg-muted text-sm font-medium"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {block.label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Gap control */}
      <div className="border-t border-border p-4 bg-muted/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Block Gap</span>
          </div>
          <span className="text-xs font-medium text-foreground">{blockGap}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="24"
          value={blockGap}
          onChange={(e) => setBlockGap(parseInt(e.target.value))}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--primary) ${(blockGap / 24) * 100}%, var(--border) ${(blockGap / 24) * 100}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>0</span>
          <span>24px</span>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={onAddSection}
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>
      </div>
    </div>
  )
}
