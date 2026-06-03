"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Pencil, Eraser, Undo2, Trash2 } from "lucide-react"

interface Props {
  prompt?: string
  readOnly?: boolean
  onSave?: (dataUrl: string) => void
  initialData?: string
}

export function DrawingCanvas({ prompt, readOnly, onSave, initialData }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<"pen" | "eraser">("pen")
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(2)
  const [history, setHistory] = useState<string[]>([])
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctxRef.current = ctx

    const rect = canvas.parentElement!.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = 300

    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (initialData) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0)
      img.src = initialData
    } else {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [initialData])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    setHistory((prev) => [...prev, canvas.toDataURL()])
  }, [])

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const ctx = ctxRef.current
    if (!ctx) return
    saveState()
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = ctxRef.current
    if (!ctx) return
    const pos = getPos(e)
    if (tool === "eraser") {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 20
    } else {
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
    }
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  const stopDraw = () => {
    setIsDrawing(false)
    const ctx = ctxRef.current
    if (ctx) ctx.beginPath()
  }

  const undo = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx || history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0)
    img.src = prev
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    if (!canvas || !ctx) return
    saveState()
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleSave = () => {
    if (onSave && canvasRef.current) {
      onSave(canvasRef.current.toDataURL())
    }
  }

  return (
    <div className="space-y-2">
      {prompt && <p className="text-sm font-medium">{prompt}</p>}
      <div className="rounded-lg border border-border overflow-hidden bg-white">
        <div className="flex items-center gap-1 p-1.5 border-b border-border bg-muted/30">
          <button
            onClick={() => setTool("pen")}
            className={`p-1.5 rounded transition-all-200 ${tool === "pen" ? "bg-primary-light text-primary" : "text-muted-foreground hover:bg-muted"}`}
            title="Pen"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTool("eraser")}
            className={`p-1.5 rounded transition-all-200 ${tool === "eraser" ? "bg-primary-light text-primary" : "text-muted-foreground hover:bg-muted"}`}
            title="Eraser"
          >
            <Eraser className="h-3.5 w-3.5" />
          </button>
          <span className="w-px h-4 bg-border mx-1" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-6 p-0 border-none cursor-pointer"
            title="Color"
          />
          <input
            type="range"
            min={1}
            max={10}
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-14 h-1"
            title="Line width"
          />
          <span className="text-[10px] text-muted-foreground w-4">{lineWidth}px</span>
          <span className="w-px h-4 bg-border mx-1" />
          <button onClick={undo} disabled={history.length === 0} className="p-1.5 rounded text-muted-foreground hover:bg-muted disabled:opacity-30" title="Undo">
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button onClick={clear} className="p-1.5 rounded text-muted-foreground hover:bg-muted" title="Clear">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          {onSave && (
            <>
              <span className="w-px h-4 bg-border mx-1" />
              <button onClick={handleSave} className="ml-auto px-2 py-1 text-[10px] bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100">
                Save Drawing
              </button>
            </>
          )}
        </div>
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
          style={{ height: 300 }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </div>
  )
}
