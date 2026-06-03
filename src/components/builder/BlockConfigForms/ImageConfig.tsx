"use client"

import { useState } from "react"
import type { LessonBlock, ImageConfig as ImageConfigType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { UploadField } from "../UploadField"
import { toast } from "sonner"
import { Image, Link } from "lucide-react"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function ImageConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as ImageConfigType
  const [altText, setAltText] = useState(config.altText || "")
  const [fileId, setFileId] = useState(config.fileId || "")
  const [url, setUrl] = useState(config.url || "")
  const [showUrlTab, setShowUrlTab] = useState(!!config.url)
  const [hotspotText, setHotspotText] = useState("")

  const hotspots = config.hotspots || []

  async function save(field: string, value: any, extra?: Record<string, any>) {
    const cur = block.config as ImageConfigType
    const newConfig = { altText, fileId, url, hotspots: cur.hotspots || [], [field]: value, ...extra }
    updateBlock(block.id, { [field]: value } as any)
    try {
      await fetch(`/api/lessons/${lessonId}/blocks/${block.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: newConfig }),
      })
    } catch { toast.error("Failed to save") }
  }

  function addHotspot() {
    if (!hotspotText.trim()) return
    const newHotspots = [...hotspots, { x: 0.5, y: 0.5, label: hotspotText.trim() }]
    save("hotspots", newHotspots)
    setHotspotText("")
  }

  function removeHotspot(index: number) {
    const newHotspots = hotspots.filter((_: any, i: number) => i !== index)
    save("hotspots", newHotspots)
  }

  const src = url || fileId

  return (
    <div className="space-y-3">
      {/* Source tabs */}
      <div className="flex gap-1 rounded-md bg-gray-100 p-0.5">
        <button
          onClick={() => { setShowUrlTab(false); setUrl(""); save("url", "") }}
          className={`flex items-center gap-1.5 flex-1 rounded px-2 py-1 text-xs font-medium transition-all ${
            !showUrlTab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Image className="h-3 w-3" />
          Upload
        </button>
        <button
          onClick={() => { setShowUrlTab(true); setFileId(""); save("fileId", "") }}
          className={`flex items-center gap-1.5 flex-1 rounded px-2 py-1 text-xs font-medium transition-all ${
            showUrlTab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Link className="h-3 w-3" />
          URL
        </button>
      </div>

      {showUrlTab ? (
        <div>
          <label className="text-xs font-medium">Image URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); save("url", e.target.value) }}
            className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      ) : (
        <div>
          <label className="text-xs font-medium">Upload Image</label>
          <UploadField
            endpoint="imageUploader"
            currentUrl={fileId}
            onUpload={(url) => { setFileId(url); save("fileId", url) }}
            acceptLabel="JPG, PNG, max 5MB"
          />
        </div>
      )}

      {src && (
        <div className="rounded-lg overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={altText || "Image preview"} className="w-full h-32 object-cover" />
        </div>
      )}

      <div>
        <label className="text-xs font-medium">Alt Text</label>
        <input
          type="text"
          value={altText}
          onChange={(e) => { setAltText(e.target.value); save("altText", e.target.value) }}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
          placeholder="Describe the image"
        />
      </div>

      <div>
        <label className="text-xs font-medium">Clickable Hotspots</label>
        <div className="flex gap-1 mt-1">
          <input
            type="text"
            value={hotspotText}
            onChange={(e) => setHotspotText(e.target.value)}
            className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
            placeholder="Label text"
            onKeyDown={(e) => e.key === "Enter" && addHotspot()}
          />
          <button onClick={addHotspot} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">Add</button>
        </div>
        {hotspots.length > 0 && (
          <div className="mt-2 space-y-1">
            {hotspots.map((h: any, i: number) => (
              <div key={i} className="flex items-center gap-1 text-xs">
                <span className="flex-1">{h.label}</span>
                <span className="text-gray-400">({Math.round(h.x * 100)}%,{Math.round(h.y * 100)}%)</span>
                <button onClick={() => removeHotspot(i)} className="text-red-500 hover:text-red-700">x</button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">Up to 10 markers</p>
      </div>
    </div>
  )
}
