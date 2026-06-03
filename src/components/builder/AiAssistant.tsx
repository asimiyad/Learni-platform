"use client"

import { useState, useRef, useEffect } from "react"
import { Undo2, MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react"
import { useBuilderStore } from "@/store/lessonBuilder"
import { toast } from "sonner"
import type { Section } from "@/types/block"

interface Message {
  role: "user" | "assistant"
  content: string
  snapshot?: { title: string; sections: Section[] }
}

interface Action {
  action: string
  sectionIndex?: number
  blockId?: string
  blockIds?: string[]
  blockType?: string
  title?: string
  config?: any
}

export function AiAssistant({ lessonId }: { lessonId: string }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I can help you edit your lesson. Try: add a quiz, delete a block, change the title, etc." },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sections = useBuilderStore((s) => s.sections)
  const lesson = useBuilderStore((s) => s.lesson)
  const addBlock = useBuilderStore((s) => s.addBlock)
  const removeBlock = useBuilderStore((s) => s.removeBlock)
  const updateBlock = useBuilderStore((s) => s.updateBlock)
  const addSection = useBuilderStore((s) => s.addSection)
  const removeSection = useBuilderStore((s) => s.removeSection)
  const setLessonField = useBuilderStore((s) => s.setLessonField)
  const setSections = useBuilderStore((s) => s.setSections)
  const reorderBlocksInSection = useBuilderStore((s) => s.reorderBlocksInSection)
  const updateBlockType = useBuilderStore((s) => s.updateBlockType)
  const updateBlockGrid = useBuilderStore((s) => s.updateBlockGrid)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  function applyActions(actions: Action[]) {
    for (const a of actions) {
      switch (a.action) {
        case "addBlock": {
          const section = sections[a.sectionIndex ?? 0]
          if (!section) { toast.error("Section not found"); continue }
          const maxRow = Math.max(...section.blocks.map((b) => b.gridRow + b.gridHeight), 1)
          const block = {
            id: `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            sectionId: section.id,
            blockType: a.blockType || "RICH_TEXT",
            config: a.config || {},
            gridColumn: 1,
            gridRow: maxRow,
            gridWidth: 12,
            gridHeight: 1,
            stepOrder: -1,
          }
          addBlock(section.id, block as any)
          // Persist to DB
          fetch(`/api/lessons/${lessonId}/blocks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blockType: block.blockType,
              sectionId: section.id,
              config: block.config,
              gridColumn: 1,
              gridRow: maxRow,
              gridWidth: 12,
              gridHeight: 1,
            }),
          }).then(async (res) => {
            if (res.ok) {
              const saved = await res.json()
              // Replace temp ID with real one
              removeBlock(block.id)
              addBlock(section.id, { ...block, id: saved.id } as any)
            }
          })
          break
        }
        case "deleteBlock": {
          if (a.blockId) removeBlock(a.blockId)
          break
        }
        case "updateBlock": {
          if (a.blockId && a.config) updateBlock(a.blockId, a.config)
          break
        }
        case "addSection": {
          const section = {
            id: `tmp_${Date.now()}`,
            lessonId,
            orderIndex: sections.length,
            config: {},
            blocks: [],
          }
          addSection(section as any)
          fetch(`/api/lessons/${lessonId}/sections`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ config: {}, title: a.title || "New Section" }),
          }).then(async (res) => {
            if (res.ok) {
              const saved = await res.json()
              removeSection(section.id)
              addSection(saved)
            }
          })
          break
        }
        case "deleteSection": {
          const sec = sections[a.sectionIndex ?? 0]
          if (sec) removeSection(sec.id)
          break
        }
        case "updateTitle": {
          if (a.title) setLessonField("title", a.title)
          break
        }
        case "reorderBlocks": {
          const sec = sections[a.sectionIndex ?? 0]
          if (sec && a.blockIds?.length) reorderBlocksInSection(sec.id, a.blockIds)
          break
        }
        case "changeBlockType": {
          if (a.blockId && a.blockType) updateBlockType(a.blockId, a.blockType as any)
          break
        }
        case "updateBlockGrid": {
          if (a.blockId && a.config) updateBlockGrid(a.blockId, a.config)
          break
        }
      }
    }
  }

  function handleUndo(msgIndex: number) {
    const msg = messages[msgIndex]
    if (!msg?.snapshot) return
    const { title: oldTitle, sections: oldSections } = msg.snapshot
    setLessonField("title", oldTitle)
    setSections(oldSections)
    toast.success("Undone")
    setMessages((prev) => prev.filter((_, i) => i !== msgIndex))
  }

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput("")
    const updatedMessages = [...messages, { role: "user" as const, content: userMsg }]
    setMessages(updatedMessages)
    setLoading(true)

    // Add a placeholder assistant message that we'll stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }])

    try {
      const res = await fetch(`/api/teacher/lessons/${lessonId}/ai-assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, messages: updatedMessages }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }))
        throw new Error(err.error)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let buffer = ""
      let actions: any[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = JSON.parse(line.slice(6))

          if (data.type === "token") {
            setMessages((prev) => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last?.role === "assistant") {
                next[next.length - 1] = { ...last, content: last.content + data.text }
              }
              return next
            })
          } else if (data.type === "done") {
            actions = data.actions || []
            // Update the final message text
            setMessages((prev) => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last?.role === "assistant") {
                next[next.length - 1] = { ...last, content: data.reply || last.content }
              }
              return next
            })
          } else if (data.type === "error") {
            throw new Error(data.error)
          }
        }
      }

      if (actions.length > 0) {
        const snapshot = JSON.parse(JSON.stringify({ title: lesson?.title, sections }))
        applyActions(actions)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "✅ Changes applied.", snapshot },
        ])
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed"
      setMessages((prev) => {
        const next = [...prev]
        if (next[next.length - 1]?.role === "assistant" && !next[next.length - 1].content) {
          next.pop()
        }
        return [...next, { role: "assistant", content: `Error: ${msg}` }]
      })
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-hover)] transition-all"
        title="AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 right-6 z-50 flex w-80 sm:w-96 flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--primary)] px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="text-sm font-semibold">AI Assistant</span>
        </div>
        <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/20 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3" style={{ maxHeight: "400px" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="mt-1 shrink-0 rounded-full bg-[var(--primary-light)] p-1">
                <Bot className="h-3.5 w-3.5 text-[var(--primary)]" />
              </div>
            )}
            <div
              className={`rounded-lg px-3 py-2 text-xs leading-relaxed max-w-[80%] ${
                msg.role === "user"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--foreground)]"
              }`}
            >
              {msg.content}
              {msg.snapshot && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleUndo(i) }}
                  className="ml-2 inline-flex items-center gap-1 rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-600 hover:bg-amber-500/30 transition-colors"
                  title="Undo these changes"
                >
                  <Undo2 className="h-3 w-3" />
                  Undo
                </button>
              )}
            </div>
            {msg.role === "user" && (
              <div className="mt-1 shrink-0 rounded-full bg-[var(--primary)] p-1">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="mt-1 shrink-0 rounded-full bg-[var(--primary-light)] p-1">
              <Bot className="h-3.5 w-3.5 text-[var(--primary)]" />
            </div>
            <div className="rounded-lg bg-[var(--muted)] px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--muted-foreground)]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me to edit the lesson..."
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[var(--ring)]"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-[var(--primary)] p-2 text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
