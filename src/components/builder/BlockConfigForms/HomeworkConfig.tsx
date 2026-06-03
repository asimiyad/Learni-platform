"use client"

import { useState } from "react"
import type { LessonBlock, HomeworkUploadConfig as HwkType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function HomeworkConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as HwkType
  const [instructions, setInstructions] = useState(config.instructions || "")
  const [acceptImage, setAcceptImage] = useState(config.acceptedFileTypes?.includes("image") ?? true)
  const [acceptPdf, setAcceptPdf] = useState(config.acceptedFileTypes?.includes("pdf") ?? true)
  const [completionPoints, setCompletionPoints] = useState(config.completionPoints || 0)

  async function save() {
    const acceptedFileTypes: Array<"image" | "pdf"> = []
    if (acceptImage) acceptedFileTypes.push("image")
    if (acceptPdf) acceptedFileTypes.push("pdf")
    const cfg = { ...config, instructions, acceptedFileTypes, completionPoints }
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
        <label className="text-xs font-medium">Instructions for Students</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          rows={2}
          placeholder="Submit your essay as a PDF..."
        />
      </div>
      <div>
        <label className="text-xs font-medium">Accepted File Types</label>
        <div className="flex gap-3 mt-1">
          <label className="flex items-center gap-1.5 text-xs">
            <input type="checkbox" checked={acceptImage} onChange={(e) => setAcceptImage(e.target.checked)} />
            Image
          </label>
          <label className="flex items-center gap-1.5 text-xs">
            <input type="checkbox" checked={acceptPdf} onChange={(e) => setAcceptPdf(e.target.checked)} />
            PDF
          </label>
        </div>
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
