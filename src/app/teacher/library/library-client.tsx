"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import gsap from "gsap"

interface Props {
  savedBlocks: any[]
  templates: any[]
}

export function LibraryClient({ savedBlocks: initialBlocks, templates: initialTemplates }: Props) {
  const [savedBlocks, setSavedBlocks] = useState(initialBlocks)
  const [templates, setTemplates] = useState(initialTemplates)
  const blocksRef = useRef<HTMLDivElement>(null)
  const templatesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (blocksRef.current) {
      gsap.fromTo(
        blocksRef.current.querySelectorAll(".gsap-library-item"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
      )
    }
  }, [savedBlocks.length])

  useEffect(() => {
    if (templatesRef.current) {
      gsap.fromTo(
        templatesRef.current.querySelectorAll(".gsap-library-item"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: "power2.out" }
      )
    }
  }, [templates.length])

  async function deleteBlock(id: string) {
    try {
      await fetch(`/api/library/blocks/${id}`, { method: "DELETE" })
      setSavedBlocks((prev) => prev.filter((b) => b.id !== id))
      toast.success("Block removed from library")
    } catch {
      toast.error("Failed to delete")
    }
  }

  async function deleteTemplate(id: string) {
    try {
      await fetch(`/api/library/templates/${id}`, { method: "DELETE" })
      setTemplates((prev) => prev.filter((t) => t.id !== id))
      toast.success("Template removed from library")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-outline-variant">
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-background">My Library</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Your saved blocks and templates.</p>
      </div>

      <Tabs defaultValue="templates" className="mt-2">
        <TabsList className="mb-8 border-b border-outline-variant bg-transparent p-0 flex gap-8 h-auto">
          <TabsTrigger value="templates" className="data-[state=active]:border-primary data-[state=active]:text-on-background text-on-surface-variant border-b-2 border-transparent pb-3 rounded-none bg-transparent px-0 text-sm tracking-wide uppercase font-medium">
            Saved Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="blocks" className="data-[state=active]:border-primary data-[state=active]:text-on-background text-on-surface-variant border-b-2 border-transparent pb-3 rounded-none bg-transparent px-0 text-sm tracking-wide uppercase font-medium">
            Saved Blocks ({savedBlocks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-0 focus-visible:outline-none">
          {templates.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface">
              <span className="material-symbols-outlined text-5xl text-primary opacity-50 mb-4" style={{ fontSize: "48px" }}>file_present</span>
              <p className="text-headline-md font-headline-md text-on-background mb-2">No templates saved yet</p>
              <p className="text-sm text-on-surface-variant">Save a lesson as a template in the builder to reuse it later.</p>
            </div>
          ) : (
            <div ref={templatesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="gsap-library-item group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-6 hover:border-primary hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-surface border border-outline-variant">
                      <span className="material-symbols-outlined text-primary" style={{ fontSize: "20px" }}>file_present</span>
                    </div>
                    <button onClick={() => deleteTemplate(template.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                    </button>
                  </div>
                  <h3 className="text-lesson-title font-lesson-title text-on-background mb-2">{template.name}</h3>
                  {template.description && (
                    <p className="text-sm line-clamp-2 mb-4 text-on-surface-variant">{template.description}</p>
                  )}
                  <div className="mt-auto pt-4 border-t border-outline-variant flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-primary">{template.blocks.length} Blocks</span>
                    <span className="material-symbols-outlined text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ fontSize: "16px" }}>arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="blocks" className="mt-0 focus-visible:outline-none">
          {savedBlocks.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface">
              <span className="material-symbols-outlined text-5xl text-primary opacity-50 mb-4" style={{ fontSize: "48px" }}>inventory_2</span>
              <p className="text-headline-md font-headline-md text-on-background mb-2">No blocks saved yet</p>
              <p className="text-sm text-on-surface-variant">Right-click any block in the lesson builder to save it to your library.</p>
            </div>
          ) : (
            <div ref={blocksRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {savedBlocks.map((block) => (
                <div key={block.id} className="gsap-library-item group relative bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary transition-colors duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-surface text-primary border border-outline-variant">
                      {block.blockType.replace("_", " ")}
                    </span>
                    <button onClick={() => deleteBlock(block.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>delete</span>
                    </button>
                  </div>
                  <h3 className="font-medium text-on-background text-sm mb-1 line-clamp-1">{block.name}</h3>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
