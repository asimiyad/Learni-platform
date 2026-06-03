"use client"

import { useState } from "react"
import type { LessonBlock, DrawingConfig as DrawType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function DrawingConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as DrawType
  const [prompt, setPrompt] = useState(config.prompt || "")
  const [completionPoints, setCompletionPoints] = useState(config.completionPoints || 0)

  async function save() {
    const cfg = { ...config, prompt, completionPoints }
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
        <label className="text-xs font-medium">Drawing Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          rows={2}
          placeholder="Draw a plant cell..."
        />
      </div>
      <div>
        <label className="text-xs font-medium">Completion Points</label>
        <input
          type="number"
          value={completionPoints}
          onChange={(e) => setCompletionPoints(parseInt(e.target.value) || 0)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          min={0}
        />
      </div>
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save
      </button>
    </div>
  )
}
