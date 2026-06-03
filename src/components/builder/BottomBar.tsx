"use client"

import { Clock, Layers, Trophy } from "lucide-react"

interface Props {
  totalPoints: number
  blockCount: number
  estimatedDuration: number | null
  onDurationChange: (duration: number) => void
}

export function BottomBar({ totalPoints, blockCount, estimatedDuration, onDurationChange }: Props) {
  return (
    <div className="h-14 border-t border-border bg-white flex items-center justify-between px-6 shrink-0 z-40">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2" title="Total points">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{totalPoints} pts</span>
        </div>
        <div className="flex items-center gap-2" title="Total blocks">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold">{blockCount} blocks</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Est. Time:</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={estimatedDuration ?? ""}
            onChange={(e) => onDurationChange(e.target.value ? parseInt(e.target.value) : 0)}
            className="w-16 px-2 py-1 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="---"
            min={0}
          />
          <span className="text-sm text-muted-foreground">min</span>
        </div>
      </div>
    </div>
  )
}
