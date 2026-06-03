"use client"

import { useState } from "react"
import { useBuilderStore } from "@/store/lessonBuilder"
import { X } from "lucide-react"
import { toast } from "sonner"

export function LessonSettingsModal() {
  const { lesson, toggleSettings, setLessonField } = useBuilderStore()
  const [passThreshold, setPassThreshold] = useState(lesson?.passThreshold ?? 50)
  const [timeLimit, setTimeLimit] = useState(lesson?.timeLimit ?? 0)
  const [thumbnail, setThumbnail] = useState(lesson?.thumbnail ?? "")

  async function handleSave() {
    setLessonField("passThreshold", passThreshold)
    setLessonField("timeLimit", timeLimit || null)
    setLessonField("thumbnail", thumbnail || null)
    toggleSettings()
    toast.success("Lesson settings saved")
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Lesson Settings</h2>
          <button onClick={toggleSettings} className="p-1 rounded hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Pass Threshold (%)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={100}
                value={passThreshold}
                onChange={(e) => setPassThreshold(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-mono w-10 text-right">{passThreshold}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Student must earn this % of total points to pass the lesson
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time Limit (minutes)</label>
            <input
              type="number"
              value={timeLimit || ""}
              onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : 0)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="No limit"
              min={0}
            />
            <p className="text-xs text-muted-foreground mt-1">Leave 0 for no time limit</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thumbnail</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Paste image URL or upload..."
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={toggleSettings}
            className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
