"use client"

import { useState } from "react"
import type { LessonBlock, OrderingConfig as OrdType } from "@/types/block"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"
import { GripVertical } from "lucide-react"

interface Props {
  block: LessonBlock
  lessonId: string
}

export function OrderingConfig({ block, lessonId }: Props) {
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const config = block.config as OrdType
  const [instruction, setInstruction] = useState(config.instruction || "")
  const [items, setItems] = useState(
    config.items || [
      { id: "1", text: "", correctOrder: 1 },
      { id: "2", text: "", correctOrder: 2 },
    ]
  )
  const [points, setPoints] = useState(config.points || 10)
  const [newItemText, setNewItemText] = useState("")

  async function save() {
    const cfg = { instruction, items, points }
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

  function addItem() {
    if (!newItemText.trim() || items.length >= 10) return
    const id = String(items.length + 1)
    setItems([...items, { id, text: newItemText.trim(), correctOrder: items.length + 1 }])
    setNewItemText("")
  }

  function removeItem(id: string) {
    if (items.length <= 2) return
    const filtered = items.filter((i) => i.id !== id)
    setItems(filtered.map((i, idx) => ({ ...i, correctOrder: idx + 1 })))
  }

  function updateItem(id: string, text: string) {
    setItems(items.map((i) => (i.id === id ? { ...i, text } : i)))
  }

  function moveItem(index: number, direction: "up" | "down") {
    const newItems = [...items]
    const target = direction === "up" ? index - 1 : index + 1
    if (target < 0 || target >= newItems.length) return
    ;[newItems[index], newItems[target]] = [newItems[target], newItems[index]]
    setItems(newItems.map((i, idx) => ({ ...i, correctOrder: idx + 1 })))
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
          placeholder="Put these events in order..."
        />
      </div>
      <div>
        <label className="text-xs font-medium">Items (correct order - drag to arrange)</label>
        <div className="space-y-1 mt-1">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
              <input
                type="text"
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                className="flex-1 px-2 py-1 text-xs border border-border rounded"
                placeholder="Item text"
              />
              <div className="flex gap-0.5">
                <button onClick={() => moveItem(index, "up")} disabled={index === 0} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">↑</button>
                <button onClick={() => moveItem(index, "down")} disabled={index === items.length - 1} className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30">↓</button>
              </div>
              {items.length > 2 && (
                <button onClick={() => removeItem(item.id)} className="text-red-500 text-xs">x</button>
              )}
            </div>
          ))}
        </div>
        {items.length < 10 && (
          <div className="flex gap-1 mt-1">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 px-2 py-1 text-xs border border-border rounded"
              placeholder="New item"
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
            <button onClick={addItem} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded">Add</button>
          </div>
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
