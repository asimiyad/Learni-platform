"use client"

import { useState } from "react"
import type { LessonBlock, FillBlankConfig as FBType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function FillBlankConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as FBType
  const [sentence, setSentence] = useState(config.sentenceWithBlanks || "")
  const [blanks, setBlanks] = useState(
    config.blanks || [{ placeholderIndex: 0, acceptedAnswers: [""] }]
  )
  const [points, setPoints] = useState(config.points || 10)

  async function save() {
    const cfg = { ...config, sentenceWithBlanks: sentence, blanks, points }
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

  function updateBlank(index: number, value: string) {
    setBlanks(blanks.map((b, i) =>
      i === index ? { ...b, acceptedAnswers: value.split(",").map((s) => s.trim()) } : b
    ))
  }

  function addBlank() {
    setBlanks([...blanks, { placeholderIndex: blanks.length, acceptedAnswers: [""] }])
  }

  function removeBlank(index: number) {
    if (blanks.length <= 1) return
    setBlanks(blanks.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium">Sentence with [blank] placeholders</label>
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          rows={2}
          placeholder="The capital of France is [blank]."
        />
        <p className="text-xs text-muted-foreground mt-1">Use [blank] for each blank</p>
      </div>
      <div>
        <label className="text-xs font-medium">Accepted Answers (blank #{blanks.length})</label>
        {blanks.map((blank, i) => (
          <div key={i} className="flex items-center gap-1 mt-1">
            <input
              type="text"
              value={blank.acceptedAnswers.join(", ")}
              onChange={(e) => updateBlank(i, e.target.value)}
              className="flex-1 px-2 py-1.5 text-xs border border-border rounded"
              placeholder="Paris, paris, PARIS"
            />
            {blanks.length > 1 && (
              <button onClick={() => removeBlank(i)} className="text-red-500 text-xs">x</button>
            )}
          </div>
        ))}
        <button onClick={addBlank} className="mt-1 text-xs text-indigo-600 hover:underline">+ Add blank</button>
        <p className="text-xs text-muted-foreground mt-1">Comma-separated, case-insensitive</p>
      </div>
      <div>
        <label className="text-xs font-medium">Points</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
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
