"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import LinkExtension from "@tiptap/extension-link"
import ImageExtension from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import Placeholder from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import FontFamily from "@tiptap/extension-font-family"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import { Extension } from "@tiptap/core"
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Quote, Code, Heading1, Heading2, Heading3, Link, AlignLeft,
  AlignCenter, AlignRight, Table as TableIcon, Image,
  Palette, Highlighter, Type, Minus, Plus, X,
} from "lucide-react"
import { useCallback, useState, useRef, useEffect } from "react"

interface Props {
  content: string
  onChange: (html: string) => void
}

const FONTS = [
  { label: "Default", value: "" },
  { label: "Serif", value: "serif" },
  { label: "Sans-Serif", value: "sans-serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Comic Sans", value: "'Comic Sans MS', cursive" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
]

const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 60, 72]

const TEXT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
  { label: "Gray", value: "#78716c" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Amber", value: "#d97706" },
  { label: "Green", value: "#16a34a" },
  { label: "Emerald", value: "#059669" },
  { label: "Teal", value: "#0d9488" },
  { label: "Cyan", value: "#0891b2" },
  { label: "Blue", value: "#2563eb" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Violet", value: "#7c3aed" },
  { label: "Purple", value: "#9333ea" },
  { label: "Pink", value: "#db2777" },
  { label: "Rose", value: "#e11d48" },
]

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Red", value: "#fecaca" },
  { label: "Pink", value: "#fce7f3" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Cyan", value: "#a7f3d0" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Purple", value: "#e9d5ff" },
  { label: "Gray", value: "#f1f5f9" },
  { label: "Lime", value: "#d9f99d" },
]

const SHORTCUTS: Record<string, string> = {
  Bold: "Ctrl+B",
  Italic: "Ctrl+I",
  Underline: "Ctrl+U",
  "Heading 1": "Ctrl+Alt+1",
  "Heading 2": "Ctrl+Alt+2",
  "Heading 3": "Ctrl+Alt+3",
  "Bullet List": "Ctrl+Shift+8",
  "Ordered List": "Ctrl+Shift+7",
  "Blockquote": "Ctrl+Shift+B",
  "Code Block": "Ctrl+Alt+C",
  "Align Left": "",
  "Align Center": "",
  "Align Right": "",
  "Font Family": "",
  "Font Size": "",
  "Text Color": "",
  "Highlight": "",
  "Add Link": "Ctrl+K",
  "Add Image": "",
  "Insert Table": "",
}

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {}
              return { style: `font-size: ${attrs.fontSize}` }
            },
          },
        },
      },
    ]
  },
})

function ToolBtn({
  active, onClick, label, children, disabled,
}: {
  active?: boolean; onClick: () => void; label: string; children: React.ReactNode; disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick() }}
      title={label}
      disabled={disabled}
      className={`relative p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-all-200 disabled:opacity-30 disabled:cursor-not-allowed ${
        active ? "bg-black/10 text-foreground dark:bg-white/10" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  )
}

function Dropdown({
  trigger, children, align = "left",
}: {
  trigger: React.ReactNode; children: React.ReactNode; align?: "left" | "right"
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) document.addEventListener("keydown", onEscape)
    return () => document.removeEventListener("keydown", onEscape)
  }, [open])

  return (
    <div ref={ref} className="relative flex items-center" onPointerDown={(e) => e.stopPropagation()}>
      <div onPointerDown={(e) => { e.stopPropagation(); setOpen(!open) }} className="flex">
        {trigger}
      </div>
      {open && (
        <div
          className={`absolute top-full ${align === "right" ? "right-0" : "left-0"} mt-1 z-50 bg-popover border border-border rounded-lg shadow-xl p-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-150 origin-top-${align === "right" ? "right" : "left"}`}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function TiptapEditor({ content, onChange }: Props) {
  const [linkUrl, setLinkUrl] = useState("")
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [showImageInput, setShowImageInput] = useState(false)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      FontSize,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "text-primary underline underline-offset-2" },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "rounded-lg max-w-full" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4 text-sm",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (showLinkInput && linkInputRef.current) linkInputRef.current.focus()
  }, [showLinkInput])

  useEffect(() => {
    if (showImageInput && imageInputRef.current) imageInputRef.current.focus()
  }, [showImageInput])

  const handleLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes("link").href
    setLinkUrl(previousUrl || "")
    setShowLinkInput(true)
  }, [editor])

  const applyLink = useCallback(() => {
    if (!editor) return
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
    }
    setShowLinkInput(false)
    setLinkUrl("")
  }, [editor, linkUrl])

  const handleImage = useCallback(() => {
    if (!editor) return
    setImageUrl("")
    setShowImageInput(true)
  }, [editor])

  const applyImage = useCallback(() => {
    if (!editor || !imageUrl) return
    editor.chain().focus().setImage({ src: imageUrl }).run()
    setShowImageInput(false)
    setImageUrl("")
  }, [editor, imageUrl])

  const addTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) return null

  const textStyle = editor.getAttributes("textStyle")
  const currentFont = textStyle.fontFamily || ""
  const currentSize = textStyle.fontSize || ""
  const activeColor = editor.getAttributes("textStyle").color || ""
  const activeHighlight = editor.getAttributes("highlight").color || ""
  const hasLink = editor.isActive("link")

  const currentFontLabel = FONTS.find((f) => f.value === currentFont)?.label || "Font"

  const currentSizeLabel = currentSize ? currentSize.replace("px", "") + "px" : "Size"

  function setFontSize(size: string) {
    if (!editor) return
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run()
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-border bg-muted/30">

        {/* Formatting group */}
        <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} label="Bold"><Bold className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} label="Italic"><Italic className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} label="Underline"><UnderlineIcon className="h-3.5 w-3.5" /></ToolBtn>
        <span className="w-px h-4 bg-border mx-0.5" />

        {/* Heading group */}
        <ToolBtn active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} label="Heading 1"><Heading1 className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} label="Heading 2"><Heading2 className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} label="Heading 3"><Heading3 className="h-3.5 w-3.5" /></ToolBtn>
        <span className="w-px h-4 bg-border mx-0.5" />

        {/* List group */}
        <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} label="Bullet List"><List className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} label="Ordered List"><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} label="Blockquote"><Quote className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} label="Code Block"><Code className="h-3.5 w-3.5" /></ToolBtn>
        <span className="w-px h-4 bg-border mx-0.5" />

        {/* Align group */}
        <ToolBtn active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} label="Align Left"><AlignLeft className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} label="Align Center"><AlignCenter className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} label="Align Right"><AlignRight className="h-3.5 w-3.5" /></ToolBtn>
        <span className="w-px h-4 bg-border mx-0.5" />

        {/* Font Family */}
        <Dropdown
          trigger={
            <button
              type="button"
              title="Font Family"
              className="flex items-center gap-1 px-1.5 py-1 text-[11px] font-medium rounded hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground whitespace-nowrap min-w-[44px]"
            >
              <Type className="h-3 w-3 shrink-0" />
              <span className="max-w-[60px] truncate">{currentFontLabel}</span>
            </button>
          }
        >
          <div className="max-h-[260px] overflow-y-auto py-0.5">
            {FONTS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs rounded hover:bg-accent ${
                  currentFont === f.value ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
                }`}
                style={{ fontFamily: f.value || undefined }}
                onClick={() => {
                  if (f.value) editor.chain().focus().setFontFamily(f.value).run()
                  else editor.chain().focus().unsetFontFamily().run()
                }}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentFont === f.value ? "bg-primary" : "bg-transparent"}`} />
                {f.label}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Font Size */}
        <Dropdown
          trigger={
            <button
              type="button"
              title="Font Size"
              className="flex items-center gap-1 px-1.5 py-1 text-[11px] font-medium rounded hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground min-w-[36px]"
            >
              <span>{currentSizeLabel}</span>
            </button>
          }
        >
          <div className="flex gap-1 p-1 border-b border-border">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded hover:bg-accent text-muted-foreground"
              onClick={() => editor.chain().focus().setMark("textStyle", { fontSize: "16px" }).run()}
              title="Reset to normal"
            >
              <Minus className="h-3 w-3" /> Normal
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs rounded hover:bg-accent text-muted-foreground"
              onClick={() => {
                const cur = parseInt(currentSize) || 16
                setFontSize(`${Math.min(cur + 4, 72)}px`)
              }}
              title="Increase"
            >
              <Plus className="h-3 w-3" /> Increase
            </button>
          </div>
          <div className="max-h-[200px] overflow-y-auto py-0.5">
            {FONT_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs rounded hover:bg-accent ${
                  currentSize === `${s}px` ? "bg-accent text-accent-foreground font-medium" : "text-foreground"
                }`}
                onClick={() => setFontSize(`${s}px`)}
              >
                <span className={`w-6 text-right ${s >= 28 ? "font-bold" : ""}`} style={{ fontSize: `${Math.min(s, 20)}px` }}>
                  {s}
                </span>
                <span className="text-muted-foreground">px</span>
                {s === 12 && <span className="text-[10px] text-muted-foreground ml-auto">Small</span>}
                {s === 16 && <span className="text-[10px] text-muted-foreground ml-auto">Normal</span>}
                {s === 24 && <span className="text-[10px] text-muted-foreground ml-auto">Heading</span>}
                {s >= 32 && <span className="text-[10px] text-muted-foreground ml-auto">Display</span>}
              </button>
            ))}
          </div>
        </Dropdown>

        {/* Text Color */}
        <Dropdown
          trigger={
            <button
              type="button"
              title="Text Color"
              className="relative p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground"
            >
              <Palette className="h-3.5 w-3.5" />
              {activeColor && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
              )}
            </button>
          }
        >
          <div className="p-1">
            <div className="grid grid-cols-8 gap-0.5">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  className={`w-6 h-6 rounded border border-border/50 hover:scale-110 hover:z-10 hover:shadow-md transition-all relative ${
                    activeColor === c.value ? "ring-2 ring-primary ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => {
                    if (c.value === "#ffffff") editor.chain().focus().unsetColor().run()
                    else editor.chain().focus().setColor(c.value).run()
                  }}
                >
                  {c.value === "#ffffff" && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <X className="h-3 w-3 text-muted-foreground/40" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-1.5 mt-1 text-xs text-muted-foreground rounded hover:bg-accent"
              onClick={() => editor.chain().focus().unsetColor().run()}
            >
              <span className="w-4 h-4 rounded border border-border bg-gradient-to-br from-white via-transparent to-transparent" />
              Clear color
            </button>
          </div>
        </Dropdown>

        {/* Highlight */}
        <Dropdown
          trigger={
            <button
              type="button"
              title="Highlight"
              className="relative p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground"
            >
              <Highlighter className="h-3.5 w-3.5" />
              {activeHighlight && (
                <span
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
                  style={{ backgroundColor: activeHighlight }}
                />
              )}
            </button>
          }
        >
          <div className="p-1">
            <div className="grid grid-cols-5 gap-0.5">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  className={`w-7 h-7 rounded border border-border/50 hover:scale-110 hover:z-10 hover:shadow-md transition-all ${
                    activeHighlight === c.value ? "ring-2 ring-primary ring-offset-1" : ""
                  }`}
                  style={{ backgroundColor: c.value }}
                  onClick={() => editor.chain().focus().toggleHighlight({ color: c.value }).run()}
                />
              ))}
            </div>
            <button
              type="button"
              className="flex w-full items-center gap-2 px-3 py-1.5 mt-1 text-xs text-muted-foreground rounded hover:bg-accent"
              onClick={() => editor.chain().focus().unsetHighlight().run()}
            >
              Clear highlight
            </button>
          </div>
        </Dropdown>

        <span className="w-px h-4 bg-border mx-0.5" />

        {/* Insert group */}
        <ToolBtn active={hasLink} onClick={handleLink} label="Link"><Link className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn onClick={handleImage} label="Image"><Image className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn onClick={addTable} label="Insert Table"><TableIcon className="h-3.5 w-3.5" /></ToolBtn>
      </div>

      {/* Link inline input */}
      {showLinkInput && (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border bg-muted/50"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Link className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            ref={linkInputRef}
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Paste or type a URL..."
            className="flex-1 text-xs bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyLink()
              if (e.key === "Escape") setShowLinkInput(false)
            }}
          />
          <button
            type="button"
            onClick={applyLink}
            className="px-2 py-0.5 text-[11px] font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => { setShowLinkInput(false); editor.chain().focus().unsetLink().run() }}
            className="px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Remove
          </button>
        </div>
      )}

      {/* Image inline input */}
      {showImageInput && (
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border bg-muted/50"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Image className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            ref={imageInputRef}
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL..."
            className="flex-1 text-xs bg-transparent border-none outline-none placeholder:text-muted-foreground/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyImage()
              if (e.key === "Escape") setShowImageInput(false)
            }}
          />
          <button
            type="button"
            onClick={applyImage}
            disabled={!imageUrl}
            className="px-2 py-0.5 text-[11px] font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-40"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="px-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
