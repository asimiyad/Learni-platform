"use client"

import { useState } from "react"
import type { LessonBlock, AudioConfig as AudioConfigType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { UploadField } from "../UploadField"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function AudioConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as AudioConfigType
  const [sourceType, setSourceType] = useState<"upload" | "recording">(config.sourceType || "upload")
  const [fileId, setFileId] = useState(config.fileId || "")

  async function save() {
    const cfg = { sourceType, fileId }
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
        <label className="text-xs font-medium">Source</label>
        <select
          value={sourceType}
          onChange={(e) => { const v = e.target.value as "upload" | "recording"; setSourceType(v) }}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
        >
          <option value="upload">Upload Audio</option>
          <option value="recording">Record Audio</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium">Audio File</label>
        <UploadField
          endpoint="audioUploader"
          currentUrl={fileId}
          onUpload={(url) => setFileId(url)}
          acceptLabel="MP3, WAV, OGG, max 15MB"
        />
      </div>
      {fileId && (
        <audio controls className="w-full mt-1 h-10">
          <source src={fileId} />
        </audio>
      )}
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save
      </button>
    </div>
  )
}
