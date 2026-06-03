"use client"

import { useState } from "react"
import type { LessonBlock, SectionDividerConfig as SDType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function SectionDividerConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as SDType
  const [title, setTitle] = useState(config.title || "")
  const [emoji, setEmoji] = useState(config.emoji || "")

  async function save() {
    const cfg = { title, emoji }
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
        <label className="text-xs font-medium">Section Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          placeholder="Part 1: Vocabulary"
        />
      </div>
      <div>
        <label className="text-xs font-medium">Emoji / Icon (optional)</label>
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          placeholder="📚"
          maxLength={2}
        />
      </div>
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save
      </button>
    </div>
  )
}
