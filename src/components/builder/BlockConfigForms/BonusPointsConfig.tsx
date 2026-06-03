"use client"

import { useState } from "react"
import type { LessonBlock, BonusPointsConfig as BPType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function BonusPointsConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as BPType
  const [points, setPoints] = useState(config.points || 10)
  const [celebratoryText, setCelebratoryText] = useState(config.celebratoryText || "")

  async function save() {
    const cfg = { points, celebratoryText }
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
        <label className="text-xs font-medium">Points Amount</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          min={0}
        />
      </div>
      <div>
        <label className="text-xs font-medium">Celebratory Text (optional)</label>
        <input
          type="text"
          value={celebratoryText}
          onChange={(e) => setCelebratoryText(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          placeholder="Great job!"
        />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded p-2">
        <p className="text-xs text-amber-800">
          This block is invisible to students. Points are awarded automatically when reached.
        </p>
      </div>
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save
      </button>
    </div>
  )
}
