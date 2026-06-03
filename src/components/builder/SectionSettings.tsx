"use client"

import type { Section, SectionConfig } from "@/types/block"
import { X } from "lucide-react"
import { useBuilderStore } from "@/store/lessonBuilder"

interface Props {
  section: Section
}

export function SectionSettings({ section }: Props) {
  const updateSection = useBuilderStore((s) => s.updateSection)
  const selectSection = useBuilderStore((s) => s.selectSection)

  function handleChange(field: keyof SectionConfig, value: any) {
    updateSection(section.id, { [field]: value })
  }

  return (
    <div className="w-80 border-l border-border bg-white overflow-y-auto shrink-0 z-40">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Section Settings</h3>
        <button onClick={() => selectSection(null)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4 space-y-6">
        <div className="p-4 border border-border bg-card rounded-xl shadow-sm">
          <label className="text-xs font-semibold text-foreground block mb-3 uppercase tracking-wider">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={section.config?.backgroundColor || "#ffffff"}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              className="w-10 h-10 p-0.5 border border-border rounded-md cursor-pointer bg-white"
            />
            <input
              type="text"
              value={section.config?.backgroundColor || ""}
              onChange={(e) => handleChange("backgroundColor", e.target.value)}
              placeholder="#ffffff"
              className="flex-1 px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary uppercase transition-all bg-transparent"
            />
          </div>
        </div>

        <div className="p-4 border border-border bg-card rounded-xl shadow-sm">
          <label className="text-xs font-semibold text-foreground block mb-3 uppercase tracking-wider">Grid Columns</label>
          <input
            type="number"
            min={1}
            max={12}
            value={section.config?.columns || 12}
            onChange={(e) => handleChange("columns", parseInt(e.target.value) || 12)}
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all bg-transparent"
          />
        </div>

        <div className="p-4 border border-border bg-card rounded-xl shadow-sm">
          <label className="text-xs font-semibold text-foreground block mb-3 uppercase tracking-wider">Padding</label>
          <select
            value={section.config?.padding || "0.75rem"}
            onChange={(e) => handleChange("padding", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-all bg-transparent"
          >
            <option value="0.5rem">Small (0.5rem)</option>
            <option value="0.75rem">Default (0.75rem)</option>
            <option value="1rem">Medium (1rem)</option>
            <option value="1.5rem">Large (1.5rem)</option>
            <option value="2rem">X-Large (2rem)</option>
          </select>
        </div>

        <div className="text-xs font-medium text-muted-foreground border-t border-border pt-4">
          <p>Blocks in this section: <span className="text-primary font-semibold">{section.blocks.length}</span></p>
          <p className="mt-1">
            Columns: <span className="text-primary font-semibold">{section.config?.columns || 12}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
