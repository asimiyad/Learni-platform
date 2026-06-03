"use client"

import { useState } from "react"
import type { LessonBlock, MultipleChoiceConfig as MCType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

interface Props {
  block: LessonBlock
  lessonId: string
}

let optCounter = 0
function nextId() {
  optCounter++
  return `opt_${optCounter}_${Date.now()}`
}

export function MultipleChoiceConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as MCType
  const [question, setQuestion] = useState(config.question || "")
  const [options, setOptions] = useState(
    config.options || [
      { id: nextId(), text: "", isCorrect: false, feedback: "" },
      { id: nextId(), text: "", isCorrect: false, feedback: "" },
    ]
  )
  const [points, setPoints] = useState(config.points || 10)
  const [allowRetry, setAllowRetry] = useState(config.allowRetry || false)
  const [retryReduced, setRetryReduced] = useState(config.retryReducedPoints || 5)

  async function save() {
    const cfg = { question, options, points, allowRetry, retryReducedPoints: retryReduced }
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

  function updateOption(id: string, field: string, value: any) {
    setOptions(options.map((o) => (o.id === id ? { ...o, [field]: value } : o)))
  }

  function addOption() {
    if (options.length >= 10) return
    setOptions([...options, { id: nextId(), text: "", isCorrect: false, feedback: "" }])
  }

  function removeOption(id: string) {
    if (options.length <= 2) return
    setOptions(options.filter((o) => o.id !== id))
  }

  const hasCorrect = options.some((o) => o.isCorrect)
  const correctCount = options.filter((o) => o.isCorrect).length

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium">Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded"
          rows={2}
          placeholder="What is...?"
        />
      </div>
      <div>
        <label className="text-xs font-medium">Options (2-10)</label>
        <p className="text-[10px] text-muted-foreground mb-1">Check the ones that are correct (multi-answer supported)</p>
        <div className="space-y-1.5">
          {options.map((opt, i) => (
            <div key={opt.id} className="flex items-start gap-1.5 p-2 border border-gray-100 rounded">
              <input
                type="checkbox"
                checked={opt.isCorrect}
                onChange={(e) => updateOption(opt.id, "isCorrect", e.target.checked)}
                className="mt-1 shrink-0"
              />
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) => updateOption(opt.id, "text", e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                  placeholder={`Option ${i + 1}`}
                />
                <input
                  type="text"
                  value={opt.feedback || ""}
                  onChange={(e) => updateOption(opt.id, "feedback", e.target.value)}
                  className="w-full px-2 py-1 text-[10px] border border-gray-100 rounded text-muted-foreground"
                  placeholder="Optional feedback when selected..."
                />
              </div>
              {options.length > 2 && (
                <button onClick={() => removeOption(opt.id)} className="p-1 text-red-400 hover:text-red-600">
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        {!hasCorrect && <p className="text-[10px] text-amber-600 mt-1">Mark at least one option as correct</p>}
        {correctCount > 1 && <p className="text-[10px] text-indigo-600 mt-1">Multiple correct answers — student must select all to earn points</p>}
        {options.length < 10 && (
          <button onClick={addOption} className="mt-1 text-xs text-indigo-600 hover:underline flex items-center gap-1">
            <Plus className="h-3 w-3" /> Add option
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-xs font-medium">Points</label>
          <input type="number" value={points} onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded" min={0} />
        </div>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={allowRetry} onChange={(e) => setAllowRetry(e.target.checked)}
          className="rounded border-gray-300" />
        <span className="text-xs">Allow retry</span>
      </label>
      {allowRetry && (
        <div>
          <label className="text-xs font-medium">Reduced points on retry</label>
          <input type="number" value={retryReduced} onChange={(e) => setRetryReduced(parseInt(e.target.value) || 0)}
            className="w-full mt-1 px-2 py-1.5 text-xs border border-gray-200 rounded" min={0} />
        </div>
      )}
      <button onClick={save} className="w-full px-3 py-1.5 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
        Save Quiz
      </button>
    </div>
  )
}
