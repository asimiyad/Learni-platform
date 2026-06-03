"use client"

import type { LessonBlock } from "@/types/block"
import { cn } from "@/lib/utils"
import {
  Video, Image, FileText, Book, Headphones, Quote,
  CheckSquare, ToggleLeft, AlignLeft, ListOrdered, Columns,
  Brush, Upload, SeparatorHorizontal, Lock, Gift, X, Copy,
  GripVertical, Maximize2, Minimize2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const blockIcons: Record<string, React.ElementType> = {
  VIDEO: Video,
  IMAGE: Image,
  RICH_TEXT: FileText,
  PDF: Book,
  AUDIO: Headphones,
  QUOTE: Quote,
  MULTIPLE_CHOICE: CheckSquare,
  TRUE_FALSE: ToggleLeft,
  FILL_BLANK: AlignLeft,
  ORDERING: ListOrdered,
  MATCHING: Columns,
  DRAWING: Brush,
  HOMEWORK_UPLOAD: Upload,
  SECTION_DIVIDER: SeparatorHorizontal,
  CONDITIONAL_LOCK: Lock,
  BONUS_POINTS: Gift,
}

const blockLabels: Record<string, string> = {
  VIDEO: "Video",
  IMAGE: "Image",
  RICH_TEXT: "Rich Text",
  PDF: "PDF",
  AUDIO: "Audio",
  QUOTE: "Quote",
  MULTIPLE_CHOICE: "Multiple Choice",
  TRUE_FALSE: "True/False",
  FILL_BLANK: "Fill in the Blank",
  ORDERING: "Ordering",
  MATCHING: "Matching",
  DRAWING: "Drawing",
  HOMEWORK_UPLOAD: "Homework Upload",
  SECTION_DIVIDER: "Section Divider",
  CONDITIONAL_LOCK: "Conditional Lock",
  BONUS_POINTS: "Bonus Points",
}

function getBlockSummary(block: LessonBlock): string {
  const config = block.config as any
  switch (block.blockType) {
    case "VIDEO":
      return config.url || config.fileId ? "Video added" : "No video selected"
    case "IMAGE":
      return config.url ? "Image from URL" : config.fileId ? "Image uploaded" : "No image selected"
    case "RICH_TEXT":
      return config.content ? config.content.substring(0, 60) + "..." : "Empty text"
    case "PDF":
      return config.fileId ? "PDF added" : "No PDF selected"
    case "AUDIO":
      return config.fileId ? "Audio added" : "No audio selected"
    case "QUOTE":
      return config.text ? `"${config.text.substring(0, 50)}..."` : "No quote text"
    case "MULTIPLE_CHOICE":
      return config.question ? config.question.substring(0, 50) + "..." : "No question set"
    case "TRUE_FALSE":
      return config.statement ? config.statement.substring(0, 50) + "..." : "No statement set"
    case "FILL_BLANK":
      return config.sentenceWithBlanks || "No sentence set"
    case "ORDERING":
      return config.items?.length ? `${config.items.length} items` : "No items set"
    case "MATCHING":
      return config.pairs?.length ? `${config.pairs.length} pairs` : "No pairs set"
    case "DRAWING":
      return config.prompt || "No prompt set"
    case "HOMEWORK_UPLOAD":
      return config.instructions || "No instructions set"
    case "SECTION_DIVIDER":
      return config.title || "Untitled section"
    case "CONDITIONAL_LOCK":
      return `Requires ${config.threshold || 0}% on a previous block`
    case "BONUS_POINTS":
      return `${config.points || 0} bonus points`
    default:
      return ""
  }
}

interface Props {
  block: LessonBlock
  isSelected: boolean
  onDelete: () => void
  onClone: () => void
  onWidthChange?: (delta: number) => void
  onHeightChange?: (delta: number) => void
  dragHandleProps?: {
    onPointerDown?: (e: React.PointerEvent) => void
    onPointerUp?: (e: React.PointerEvent) => void
  }
  isDragging?: boolean
}

export function BlockCard({ block, isSelected, onDelete, onClone, onWidthChange, onHeightChange, dragHandleProps, isDragging }: Props) {
  const Icon = blockIcons[block.blockType] || FileText
  const label = blockLabels[block.blockType] || block.blockType
  const summary = getBlockSummary(block)
  const hasStepOrder = block.stepOrder >= 0

  return (
    <div
      className={cn(
        "bg-white border rounded-xl p-4 transition-all duration-200 group relative h-full hover:shadow-md hover:border-border",
        isSelected ? "border-primary ring-1 ring-primary shadow-sm" : "border-border shadow-sm",
        isDragging && "opacity-80 shadow-lg scale-105 z-50"
      )}
    >
      {/* Step order badge */}
      {hasStepOrder && (
        <div className="absolute -top-3 -left-3 z-10">
          <Badge className="bg-primary text-white text-xs font-bold px-2 py-1 min-w-[24px] shadow-sm flex items-center justify-center rounded-full">
            {block.stepOrder}
          </Badge>
        </div>
      )}

      {/* Resize handles */}
      {isSelected && (
        <>
          {onWidthChange && block.gridWidth > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onWidthChange(-1) }}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm hover:bg-muted"
              title="Decrease width"
            >
              <Minimize2 className="h-3 w-3" />
            </button>
          )}
          {onWidthChange && block.gridWidth < 12 && (
            <button
              onClick={(e) => { e.stopPropagation(); onWidthChange(1) }}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm hover:bg-muted"
              title="Increase width"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
          )}
        </>
      )}

      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <div
          className="mt-1 p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground cursor-grab active:cursor-grabbing transition-colors shrink-0 opacity-0 group-hover:opacity-100"
          {...dragHandleProps}
          onPointerDown={(e) => { dragHandleProps?.onPointerDown?.(e); e.stopPropagation() }}
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={cn(
            "p-2.5 rounded-lg transition-colors",
            isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-[10px] font-medium text-muted-foreground">
                ({block.gridColumn},{block.gridRow}) {block.gridWidth}x{block.gridHeight}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); onClone() }}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Clone"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Delete"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
