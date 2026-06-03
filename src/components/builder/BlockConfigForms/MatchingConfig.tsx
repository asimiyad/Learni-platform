"use client"

import { useState } from "react"
import type { LessonBlock, MatchingConfig as MatchType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function MatchingConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as MatchType
  const [instruction, setInstruction] = useState(config.instruction || "")
  const [pairs, setPairs] = useState(
    config.pairs || [
      { id: "1", left: "", right: "" },
      { id: "2", left: "", right: "" },
    ]
  )
  const [points, setPoints] = useState(config.points || 10)

  async function save() {
    const cfg = { ...config, instruction, pairs, points }
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

  function updatePair(id: string, field: "left" | "right", value: string) {
    setPairs(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  function addPair() {
    if (pairs.length >= 10) return
    setPairs([...pairs, { id: String(pairs.length + 1), left: "", right: "" }])
  }

  function removePair(id: string) {
    if (pairs.length <= 2) return
    setPairs(pairs.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium">Instruction</label>
        <input
          type="text"
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="w-full mt-1 px-2 py-1.5 text-xs border border-border rounded"
          placeholder="Match each term with its definition..."
        />
      </div>
      <div>
        <label className="text-xs font-medium">Pairs (left → right)</label>
        <div className="space-y-1 mt-1">
          {pairs.map((pair) => (
            <div key={pair.id} className="flex items-center gap-1">
              <input
                type="text"
                value={pair.left}
                onChange={(e) => updatePair(pair.id, "left", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-border rounded"
                placeholder="Left"
              />
              <span className="text-muted-foreground text-xs">→</span>
              <input
                type="text"
                value={pair.right}
                onChange={(e) => updatePair(pair.id, "right", e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-border rounded"
                placeholder="Right"
              />
              {pairs.length > 2 && (
                <button onClick={() => removePair(pair.id)} className="text-red-500 text-xs">x</button>
              )}
            </div>
          ))}
        </div>
        {pairs.length < 10 && (
          <button onClick={addPair} className="mt-1 text-xs text-indigo-600 hover:underline">+ Add pair</button>
        )}
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
