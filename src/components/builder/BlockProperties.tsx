"use client"

import type { LessonBlock } from "@/types/block"
import { X } from "lucide-react"
import { useBuilderStore } from "@/store/lessonBuilder"
import { VideoConfig } from "./BlockConfigForms/VideoConfig"
import { ImageConfig } from "./BlockConfigForms/ImageConfig"
import { RichTextConfig } from "./BlockConfigForms/RichTextConfig"
import { PdfConfig } from "./BlockConfigForms/PdfConfig"
import { AudioConfig } from "./BlockConfigForms/AudioConfig"
import { QuoteConfig } from "./BlockConfigForms/QuoteConfig"
import { MultipleChoiceConfig } from "./BlockConfigForms/MultipleChoiceConfig"
import { TrueFalseConfig } from "./BlockConfigForms/TrueFalseConfig"
import { FillBlankConfig } from "./BlockConfigForms/FillBlankConfig"
import { OrderingConfig } from "./BlockConfigForms/OrderingConfig"
import { MatchingConfig } from "./BlockConfigForms/MatchingConfig"
import { DrawingConfig } from "./BlockConfigForms/DrawingConfig"
import { HomeworkConfig } from "./BlockConfigForms/HomeworkConfig"
import { SectionDividerConfig } from "./BlockConfigForms/SectionDividerConfig"
import { ConditionalLockConfig } from "./BlockConfigForms/ConditionalLockConfig"
import { BonusPointsConfig } from "./BlockConfigForms/BonusPointsConfig"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function BlockProperties({ block, lessonId }: Props) {
  const selectBlock = useBuilderStore((s) => s.selectBlock)
  const updateBlockGrid = useBuilderStore((s) => s.updateBlockGrid)
  const updateBlockStepOrder = useBuilderStore((s) => s.updateBlockStepOrder)

  function renderConfigForm() {
    switch (block.blockType) {
      case "VIDEO":
        return <VideoConfig block={block} lessonId={lessonId} />
      case "IMAGE":
        return <ImageConfig block={block} lessonId={lessonId} />
      case "RICH_TEXT":
        return <RichTextConfig block={block} lessonId={lessonId} />
      case "PDF":
        return <PdfConfig block={block} lessonId={lessonId} />
      case "AUDIO":
        return <AudioConfig block={block} lessonId={lessonId} />
      case "QUOTE":
        return <QuoteConfig block={block} lessonId={lessonId} />
      case "MULTIPLE_CHOICE":
        return <MultipleChoiceConfig block={block} lessonId={lessonId} />
      case "TRUE_FALSE":
        return <TrueFalseConfig block={block} lessonId={lessonId} />
      case "FILL_BLANK":
        return <FillBlankConfig block={block} lessonId={lessonId} />
      case "ORDERING":
        return <OrderingConfig block={block} lessonId={lessonId} />
      case "MATCHING":
        return <MatchingConfig block={block} lessonId={lessonId} />
      case "DRAWING":
        return <DrawingConfig block={block} lessonId={lessonId} />
      case "HOMEWORK_UPLOAD":
        return <HomeworkConfig block={block} lessonId={lessonId} />
      case "SECTION_DIVIDER":
        return <SectionDividerConfig block={block} lessonId={lessonId} />
      case "CONDITIONAL_LOCK":
        return <ConditionalLockConfig block={block} lessonId={lessonId} />
      case "BONUS_POINTS":
        return <BonusPointsConfig block={block} lessonId={lessonId} />
      default:
        return <p className="text-sm text-muted-foreground">No configuration available</p>
    }
  }

  return (
    <div className="w-80 border-l border-border bg-white overflow-y-auto shrink-0 z-40">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Block Settings</h3>
        <button onClick={() => selectBlock(null)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 space-y-6">
        {/* Grid position */}
        <div className="p-4 border border-border bg-card rounded-xl shadow-sm">
          <label className="text-xs font-semibold text-foreground block mb-3 uppercase tracking-wider">Grid Position</label>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-medium text-muted-foreground block mb-1 uppercase">Col</label>
              <input
                type="number"
                min={1}
                max={12}
                value={block.gridColumn}
                onChange={(e) => updateBlockGrid(block.id, { gridColumn: parseInt(e.target.value) || 1 })}
                className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-center transition-all bg-transparent"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground block mb-1 uppercase">Row</label>
              <input
                type="number"
                min={1}
                max={20}
                value={block.gridRow}
                onChange={(e) => updateBlockGrid(block.id, { gridRow: parseInt(e.target.value) || 1 })}
                className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-center transition-all bg-transparent"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground block mb-1 uppercase">W</label>
              <input
                type="number"
                min={1}
                max={12}
                value={block.gridWidth}
                onChange={(e) => updateBlockGrid(block.id, { gridWidth: parseInt(e.target.value) || 1 })}
                className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-center transition-all bg-transparent"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium text-muted-foreground block mb-1 uppercase">H</label>
              <input
                type="number"
                min={1}
                max={6}
                value={block.gridHeight}
                onChange={(e) => updateBlockGrid(block.id, { gridHeight: parseInt(e.target.value) || 1 })}
                className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-center transition-all bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Step Order */}
        <div className="p-4 border border-border bg-card rounded-xl shadow-sm">
          <label className="text-xs font-semibold text-foreground block mb-3 uppercase tracking-wider">Step Order</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={-1}
              value={block.stepOrder}
              onChange={(e) => updateBlockStepOrder(block.id, parseInt(e.target.value) || -1)}
              className="w-20 px-3 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-center transition-all bg-transparent"
            />
            <span className="text-[10px] font-medium text-muted-foreground">(-1 = decorative)</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 border-t border-border pt-3">
            Set consecutive numbers (1, 2, 3...) to define the student's progression through the lesson.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Block config form */}
        {renderConfigForm()}
      </div>
    </div>
  )
}
