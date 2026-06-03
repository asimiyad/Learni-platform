"use client"

import { useState } from "react"
import type { LessonBlock, RichTextConfig as RichTextConfigType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { TiptapEditor } from "@/components/editor/TiptapEditor"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function RichTextConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as RichTextConfigType
  const [content, setContent] = useState(config.content || "")

  async function save() {
    updateBlock(block.id, { content } as any)
    try {
      await fetch(`/api/lessons/${lessonId}/blocks/${block.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: { content } }),
      })
      toast.success("Saved")
    } catch { toast.error("Failed to save") }
  }

  return (
    <div className="space-y-3">
      <TiptapEditor content={content} onChange={setContent} />
      <div className="flex gap-2">
        <button
          onClick={save}
          className="flex-1 px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
        >
          Save Content
        </button>
      </div>
    </div>
  )
}
