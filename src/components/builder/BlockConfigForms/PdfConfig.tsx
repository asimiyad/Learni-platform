"use client"

import { useState } from "react"
import type { LessonBlock, PdfConfig as PdfConfigType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { UploadField } from "../UploadField"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function PdfConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as PdfConfigType
  const [fileId, setFileId] = useState(config.fileId || "")
  const [pageRange, setPageRange] = useState(config.pageRange || "")

  async function save() {
    const cfg = { fileId, pageRange }
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
        <label className="text-xs font-medium">Upload PDF</label>
        <UploadField
          endpoint="pdfUploader"
          currentUrl={fileId}
          onUpload={(url) => setFileId(url)}
          acceptLabel="PDF, max 20MB"
        />
      </div>
      <div>
        <label className="text-xs font-medium">Page Range (optional)</label>
        <input
          type="text"
          value={pageRange}
          onChange={(e) => setPageRange(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
          placeholder="e.g., 1-5"
        />
        <p className="text-xs text-gray-400 mt-1">Leave empty to show all pages</p>
      </div>
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save
      </button>
    </div>
  )
}
