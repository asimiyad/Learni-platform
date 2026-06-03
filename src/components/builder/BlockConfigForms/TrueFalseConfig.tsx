"use client"

import { useState } from "react"
import type { LessonBlock, TrueFalseConfig as TFType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function TrueFalseConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as TFType
  const [statement, setStatement] = useState(config.statement || "")
  const [correctAnswer, setCorrectAnswer] = useState(config.correctAnswer ?? true)
  const [feedbackCorrect, setFeedbackCorrect] = useState(config.feedbackCorrect || "")
  const [feedbackIncorrect, setFeedbackIncorrect] = useState(config.feedbackIncorrect || "")
  const [points, setPoints] = useState(config.points || 10)

  async function save() {
    const cfg = { statement, correctAnswer, feedbackCorrect, feedbackIncorrect, points }
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
        <label className="text-xs font-medium">Statement</label>
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          rows={2}
          placeholder="The Earth is flat..."
        />
      </div>
      <div>
        <label className="text-xs font-medium">Correct Answer</label>
        <select
          value={correctAnswer ? "true" : "false"}
          onChange={(e) => setCorrectAnswer(e.target.value === "true")}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium">Feedback (Correct)</label>
        <input
          type="text"
          value={feedbackCorrect}
          onChange={(e) => setFeedbackCorrect(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
        />
      </div>
      <div>
        <label className="text-xs font-medium">Feedback (Incorrect)</label>
        <input
          type="text"
          value={feedbackIncorrect}
          onChange={(e) => setFeedbackIncorrect(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
        />
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
