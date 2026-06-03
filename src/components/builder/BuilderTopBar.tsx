"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useBuilderStore } from "@/store/lessonBuilder"
import { cn } from "@/lib/utils"
import { Save, Eye, Settings, ArrowLeft, Send, RotateCcw, PanelRight } from "lucide-react"

interface Props {
  onSave: () => Promise<void>
  onPublish: () => Promise<void>
  onUnpublish: () => Promise<void>
  onSettings: () => void
  isDirty: boolean
  lessonId?: string
  lessonStatus?: string
  showPreview?: boolean
  onTogglePreview?: () => void
}

export function BuilderTopBar({ onSave, onPublish, onUnpublish, onSettings, isDirty, lessonId, lessonStatus, showPreview, onTogglePreview }: Props) {
  const router = useRouter()
  const { lesson, setLessonField } = useBuilderStore()
  const [title, setTitle] = useState(lesson?.title || "")
  const [saving, setSaving] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setTitle(lesson?.title || "")
  }, [lesson?.title])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    const canvas = document.querySelector(".builder-canvas")
    if (canvas) { canvas.addEventListener("scroll", onScroll, { passive: true }); return () => canvas.removeEventListener("scroll", onScroll) }
    return
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title !== lesson?.title) {
        setLessonField("title", title)
      }
    }, 500)
    return () => clearTimeout(timeout)
  }, [title, lesson?.title, setLessonField])

  async function handleSave() {
    setSaving(true)
    await onSave()
    setSaving(false)
  }

  function handleBack() {
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Leave anyway?")
      if (!confirmed) return
    }
    const subjectId = lesson?.subjectId
    if (subjectId) {
      router.push(`/teacher/subjects/${subjectId}`)
    } else {
      router.push("/teacher/subjects")
    }
  }

  function handlePreview() {
    window.open(`/preview/${lessonId}`, "_blank")
  }

  return (
    <div className={cn("border-b border-border bg-white px-4 h-14 flex items-center justify-between shrink-0 transition-shadow", scrolled && "shadow-sm")}>
      <div className="flex items-center gap-4">
        <button onClick={handleBack} className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none outline-none focus:ring-0 w-64 md:w-96 placeholder:text-muted-foreground/50"
            placeholder="Untitled Lesson..."
          />
          {isDirty && <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Unsaved</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onTogglePreview}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            showPreview ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
          }`}
          title="Toggle split-pane live preview"
        >
          <PanelRight className="h-4 w-4" /> Live
        </button>
        <button onClick={handlePreview} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button onClick={onSettings} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Settings className="h-4 w-4" /> Settings
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Draft"}
        </button>
        {lessonStatus === "PUBLISHED" ? (
          <button onClick={onUnpublish} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
            <RotateCcw className="h-4 w-4" /> Unpublish
          </button>
        ) : (
          <button onClick={onPublish} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Send className="h-4 w-4" /> Publish
          </button>
        )}
      </div>
    </div>
  )
}
