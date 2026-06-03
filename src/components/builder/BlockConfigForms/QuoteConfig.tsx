"use client"

import { useState } from "react"
import type { LessonBlock, QuoteConfig as QuoteConfigType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function QuoteConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as QuoteConfigType
  const [text, setText] = useState(config.text || "")
  const [attribution, setAttribution] = useState(config.attribution || "")
  const [style, setStyle] = useState(config.style || "modern")

  async function save() {
    const cfg = { text, attribution, style }
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
        <label className="text-xs font-medium">Quote Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          rows={3}
          placeholder="The quote text..."
        />
      </div>
      <div>
        <label className="text-xs font-medium">Attribution</label>
        <input
          type="text"
          value={attribution}
          onChange={(e) => setAttribution(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          placeholder="- Albert Einstein"
        />
      </div>
      <div>
        <label className="text-xs font-medium">Style</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as "modern" | "classic")}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
        >
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
        </select>
      </div>
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save Quote
      </button>
    </div>
  )
}
