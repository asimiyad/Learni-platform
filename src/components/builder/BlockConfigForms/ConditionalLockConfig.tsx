"use client"

import { useState } from "react"
import type { LessonBlock, ConditionalLockConfig as CLType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function ConditionalLockConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const sections = useBuilderStore((s) => s.sections)
  const blocks = sections.flatMap((s) => s.blocks)
  const config = block.config as CLType
  const [conditionType, setConditionType] = useState<"score_on_quiz" | "completion_of_block">(config.conditionType || "score_on_quiz")
  const [targetBlockId, setTargetBlockId] = useState(config.targetBlockId || "")
  const [threshold, setThreshold] = useState(config.threshold || 80)

  const quizBlocks = blocks.filter(
    (b) =>
      b.id !== block.id &&
      ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK", "ORDERING", "MATCHING"].includes(b.blockType)
  )

  async function save() {
    const cfg = { conditionType, targetBlockId, threshold }
    updateBlock(block.id, cfg as any)
    try {
      await fetch(`/api/lessons/${lessonId}/blocks/${block.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cfg }),
      })
      toast.success("Saved")
    } catch { toast.error("Failed to save") }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium">Condition Type</label>
        <select
          value={conditionType}
          onChange={(e) => setConditionType(e.target.value as "score_on_quiz" | "completion_of_block")}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
        >
          <option value="score_on_quiz">Score on previous quiz block</option>
          <option value="completion_of_block">Completion of specific block</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium">Target Block</label>
        <select
          value={targetBlockId}
          onChange={(e) => setTargetBlockId(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
        >
          <option value="">Select a block...</option>
          {quizBlocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.blockType} ({b.id.slice(0, 8)})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium">Threshold (%)</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="range"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs font-mono w-8 text-right">{threshold}%</span>
        </div>
      </div>
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save
      </button>
    </div>
  )
}
