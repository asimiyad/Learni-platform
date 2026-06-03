"use client"

import { useState } from "react"
import type { LessonBlock, VideoConfig as VideoConfigType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { UploadField } from "../UploadField"
import { toast } from "sonner"
import { Video } from "lucide-react"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function VideoConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as VideoConfigType
  const [sourceType, setSourceType] = useState<"youtube" | "upload">(config.sourceType || "youtube")
  const [url, setUrl] = useState(config.url || "")
  const [fileId, setFileId] = useState(config.fileId || "")
  const [forceWatch, setForceWatch] = useState(config.forceWatch || false)
  const [startTime, setStartTime] = useState(config.startTime || 0)
  const [endTime, setEndTime] = useState(config.endTime || 0)

  async function save(field: string, value: any) {
    const newConfig = { sourceType, url, fileId, forceWatch, startTime, endTime, [field]: value }
    updateBlock(block.id, { [field]: value } as any)
    try {
      await fetch(`/api/lessons/${lessonId}/blocks/${block.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: newConfig }),
      })
    } catch { toast.error("Failed to save") }
  }

  function getYoutubeId(yurl: string) {
    const m = yurl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return m?.[1] || null
  }

  const youtubeId = sourceType === "youtube" && url ? getYoutubeId(url) : null

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium">Source Type</label>
        <select
          value={sourceType}
          onChange={(e) => { const v = e.target.value as "youtube" | "upload"; setSourceType(v); save("sourceType", v) }}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
        >
          <option value="youtube">YouTube URL</option>
          <option value="upload">Upload MP4</option>
        </select>
      </div>

      {sourceType === "youtube" ? (
        <div>
          <label className="text-xs font-medium">YouTube URL</label>
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); save("url", e.target.value) }}
              className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          {youtubeId && (
            <div className="mt-2 rounded-lg overflow-hidden bg-gray-100 aspect-video flex items-center justify-center">
              <Video className="h-8 w-8 text-red-500" />
              <span className="text-xs text-gray-500 ml-2">YouTube ID: {youtubeId}</span>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="text-xs font-medium">Upload Video</label>
          <UploadField
            endpoint="videoUploader"
            currentUrl={fileId}
            onUpload={(url) => { setFileId(url); save("fileId", url) }}
            acceptLabel="MP4, max 500MB"
          />
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium">Start (sec)</label>
          <input
            type="number"
            value={startTime}
            onChange={(e) => { setStartTime(parseInt(e.target.value) || 0); save("startTime", parseInt(e.target.value) || 0) }}
            className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
            min={0}
          />
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium">End (sec)</label>
          <input
            type="number"
            value={endTime}
            onChange={(e) => { setEndTime(parseInt(e.target.value) || 0); save("endTime", parseInt(e.target.value) || 0) }}
            className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
            min={0}
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={forceWatch}
          onChange={(e) => { setForceWatch(e.target.checked); save("forceWatch", e.target.checked) }}
          className="rounded border-gray-300"
        />
        <span className="text-xs">Force Watch (student cannot skip)</span>
      </label>
    </div>
  )
}
