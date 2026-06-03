"use client"

import { useState, useRef, useEffect } from "react"
import { PlayCircle, FileText, Upload } from "lucide-react"
import { DrawingCanvas } from "./DrawingCanvas"
import { generateUploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/lib/uploadthing"

const UploadButton = generateUploadButton<OurFileRouter>()

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m?.[1] || null
}

export function shortLabel(type: string): string {
  const map: Record<string, string> = {
    VIDEO: "Video", IMAGE: "Image", RICH_TEXT: "Reading",
    PDF: "PDF", AUDIO: "Audio", QUOTE: "Quote",
    MULTIPLE_CHOICE: "Quiz", TRUE_FALSE: "True/False",
    FILL_BLANK: "Fill Blank", ORDERING: "Ordering",
    MATCHING: "Matching", DRAWING: "Drawing",
    HOMEWORK_UPLOAD: "Homework", SECTION_DIVIDER: "Section",
    CONDITIONAL_LOCK: "Locked", BONUS_POINTS: "Bonus",
  }
  return map[type] || type
}

export function BlockContent({ block, onAnswer }: { block: any, onAnswer?: (answerJson: any, isCorrect: boolean, points: number) => void }) {
  const config = block.config

  switch (block.blockType) {

    case "VIDEO": {
      const ytId = config.sourceType === "youtube" && config.url ? getYoutubeId(config.url) : null
      const hasStart = config.startTime != null && config.startTime > 0
      const hasEnd = config.endTime != null && config.endTime > 0
      const params = hasStart || hasEnd
        ? `?${hasStart ? `start=${config.startTime}` : ""}${hasEnd ? `${hasStart ? "&" : ""}end=${config.endTime}` : ""}`
        : ""
      return (
        <div>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-sm">
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}${params}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : config.fileId ? (
              <video controls className="w-full h-full" {...(config.forceWatch ? { controlsList: "nodownload noremoteplayback" } : {})}>
                <source src={config.fileId} />
              </video>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/60">
                <div className="text-center">
                  <PlayCircle className="w-12 h-12 mx-auto mb-2 opacity-60" />
                  <p className="text-sm">No video uploaded</p>
                </div>
              </div>
            )}
          </div>
          {config.forceWatch && <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">Requires full viewing</p>}
        </div>
      )
    }

    case "RICH_TEXT":
      return config.content ? (
        <div
          className="text-card-foreground leading-relaxed text-sm space-y-4
            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-6
            [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-5
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4
            [&_p]:mb-3 [&_p:last-child]:mb-0
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul_li]:mb-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol_li]:mb-1
            [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-xs [&_code]:font-mono
            [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:text-xs [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:mb-4
            [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:mb-3
            [&_a]:text-primary [&_a]:underline [&_a:hover]:no-underline
            [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
            [&_hr]:border-border [&_hr]:my-6"
          dangerouslySetInnerHTML={{ __html: config.content }}
        />
      ) : (
        <p className="text-muted-foreground italic text-sm">Nothing to read here yet.</p>
      )

    case "QUOTE":
      return (
        <blockquote className="border-l-2 border-primary pl-5 py-2">
          <p className="text-base text-card-foreground leading-relaxed">&ldquo;{config.text}&rdquo;</p>
          {config.attribution && (
            <footer className="text-sm text-muted-foreground mt-2">&mdash; {config.attribution}</footer>
          )}
        </blockquote>
      )

    case "IMAGE":
      if (config.url || config.fileId) {
        return (
          <figure>
            <div className="rounded-lg overflow-hidden bg-muted border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={config.url || config.fileId} alt={config.altText || ""} className="w-full max-h-96 object-contain" />
            </div>
            {config.altText && <figcaption className="text-xs text-muted-foreground mt-2 text-center">{config.altText}</figcaption>}
            {config.hotspots?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {config.hotspots.map((h: any, i: number) => (
                  <span key={i} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-sm">{h.label}</span>
                ))}
              </div>
            )}
          </figure>
        )
      }
      if (config.searchQuery) {
        return (
          <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 h-40 flex items-center justify-center text-amber-700 text-sm">
            Needs image: {config.searchQuery}
          </div>
        )
      }
      return (
        <div className="rounded-lg border border-dashed border-border h-40 flex items-center justify-center text-muted-foreground text-sm">
          No image uploaded
        </div>
      )

    case "PDF":
      return config.fileId ? (
        <div className="card-base overflow-hidden">
          <div className="p-3 bg-muted border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
              <FileText className="h-4 w-4 text-primary" />
              PDF Document
            </div>
            <a href={config.fileId} target="_blank" rel="noopener noreferrer"
              className="text-xs text-primary hover:underline font-medium">
              Open in new tab
            </a>
          </div>
          <iframe src={config.fileId} className="w-full h-96" title="PDF viewer" />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border h-40 flex items-center justify-center text-muted-foreground text-sm">
          No PDF uploaded
        </div>
      )

    case "AUDIO":
      return config.fileId ? (
        <div className="card-base p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <PlayCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">Audio</p>
              <p className="text-xs text-muted-foreground">{config.fileId?.split("/").pop() || "Recording"}</p>
            </div>
          </div>
          <audio controls className="w-full">
            <source src={config.fileId} />
          </audio>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border h-14 flex items-center justify-center text-muted-foreground text-sm">
          No audio uploaded
        </div>
      )

    case "SECTION_DIVIDER":
      return (
        <div className="py-6">
          {config.emoji && <span className="text-2xl">{config.emoji}</span>}
          <h2 className="text-xl font-bold text-card-foreground mt-2">{config.title || "Section"}</h2>
          <hr className="mt-4 border-border" />
        </div>
      )

    case "CONDITIONAL_LOCK":
      return (
        <div className="card-base p-6 text-center border-amber-200 bg-amber-50/30">
          <p className="font-semibold text-card-foreground">🔒 Locked</p>
          <p className="text-sm text-muted-foreground mt-1">Requires {config.threshold}% on a previous section</p>
        </div>
      )

    case "BONUS_POINTS":
      return (
        <div className="card-base p-6 text-center border-success/30">
          <p className="font-semibold text-success text-lg">+{config.points} Bonus Points</p>
          {config.celebratoryText && <p className="text-sm text-muted-foreground mt-1">{config.celebratoryText}</p>}
        </div>
      )

    // --- Interactive Blocks ---

    case "MULTIPLE_CHOICE": {
      const [selected, setSelected] = useState(new Set<string>())
      const [submitted, setSubmitted] = useState(false)
      const correctIds = new Set<string>(config.options?.filter((o: any) => o.isCorrect).map((o: any) => o.id) || [])
      const isMultiCorrect = correctIds.size > 1

      function toggle(id: string) {
        if (submitted) return
        const next = new Set(selected)
        if (isMultiCorrect) {
          if (next.has(id)) next.delete(id); else next.add(id)
        } else {
          next.clear(); next.add(id)
        }
        setSelected(next)
      }

      const correctArr = [...correctIds]
      const selectedArr = [...selected]
      const allCorrect = submitted && correctIds.size > 0
        && correctArr.every((id) => selected.has(id))
        && selectedArr.every((id) => correctIds.has(id))

      return (
        <div className="card-base p-5">
          <p className="text-sm font-medium text-card-foreground mb-4 leading-relaxed">{config.question}</p>
          {isMultiCorrect && !submitted && <p className="text-[10px] text-indigo-600 mb-2">Select all correct answers</p>}
          <div className="space-y-2">
            {config.options?.map((opt: any) => {
              const isSelected = selected.has(opt.id)
              const isCorrect = opt.isCorrect
              let cls = "flex items-center gap-3 p-3 border rounded-sm cursor-pointer transition-all-200 text-sm"
              if (submitted) {
                if (isCorrect) cls += " border-success bg-success/5"
                else if (isSelected) cls += " border-danger bg-danger/5"
                else cls += " border-border opacity-50"
              } else if (isSelected) {
                cls += " border-primary bg-primary-light"
              } else {
                cls += " border-border hover:border-primary/40 hover:bg-primary-light/30"
              }
              return (
                <div key={opt.id} onClick={() => toggle(opt.id)} className={cls}>
                  <div className={`w-4 h-4 shrink-0 border-2 transition-all-200 flex items-center justify-center ${
                    isMultiCorrect ? "rounded-sm" : "rounded-full"
                  } ${
                    submitted
                      ? isCorrect ? "border-success bg-success" : isSelected ? "border-danger bg-danger" : "border-border"
                      : isSelected ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {(submitted && isCorrect) || (isSelected && !submitted) ? (
                      <span className="text-white text-[10px]">{isMultiCorrect ? "✓" : ""}</span>
                    ) : null}
                  </div>
                  <span className="flex-1">{opt.text}</span>
                  {opt.feedback && submitted && isSelected && (
                    <span className="text-[10px] text-muted-foreground italic">{opt.feedback}</span>
                  )}
                  {submitted && isCorrect && <span className="text-xs font-medium text-success">Correct</span>}
                  {submitted && isSelected && !isCorrect && <span className="text-xs font-medium text-danger">Incorrect</span>}
                </div>
              )
            })}
          </div>
          {selected.size > 0 && !submitted && (
            <button onClick={() => {
              setSubmitted(true)
              const cArr = [...correctIds]
              const sArr = [...selected]
              const ok = cArr.every((id) => selected.has(id))
                && sArr.every((id) => correctIds.has(id))
              onAnswer?.({ selected: sArr }, ok, ok ? (config.points ?? 1) : 0)
            }} className="mt-4 px-5 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover transition-all-200 font-medium">
              Submit Answer
            </button>
          )}
          {submitted && (
            <div className={`mt-4 p-3 rounded-sm text-sm ${allCorrect ? "bg-success/5 text-success" : "bg-danger/5 text-danger"}`}>
              {allCorrect ? "Correct!" : `Incorrect. The correct answer${correctIds.size > 1 ? "s" : ""}: ${config.options?.filter((o: any) => o.isCorrect).map((o: any) => o.text).join(", ")}`}
            </div>
          )}
        </div>
      )
    }

    case "TRUE_FALSE": {
      const [answer, setAnswer] = useState<boolean | null>(null)
      const [submitted, setSubmitted] = useState(false)

      return (
        <div className="card-base p-5">
          <p className="text-sm font-medium text-card-foreground mb-4 leading-relaxed">{config.statement}</p>
          <div className="flex gap-3">
            {[true, false].map((val) => {
              const isSelected = answer === val
              let cls = "flex-1 flex items-center justify-center gap-2 p-3 border rounded-sm cursor-pointer transition-all-200 text-sm font-medium"
              if (submitted) {
                if (val === config.correctAnswer) cls += " border-success bg-success/5 text-success"
                else if (isSelected) cls += " border-danger bg-danger/5 text-danger"
                else cls += " border-border opacity-50"
              } else if (isSelected) {
                cls += " border-primary bg-primary-light text-primary"
              } else {
                cls += " border-border hover:border-primary/40 hover:bg-primary-light/30 text-muted-foreground"
              }
              return (
                <div key={String(val)} onClick={() => !submitted && setAnswer(val)} className={cls}>
                  {val ? "True" : "False"}
                </div>
              )
            })}
          </div>
          {answer !== null && !submitted && (
            <button onClick={() => {
              setSubmitted(true)
              const isCorrect = answer === config.correctAnswer
              onAnswer?.({ answer }, isCorrect, isCorrect ? (config.points ?? 1) : 0)
            }} className="mt-4 px-5 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover transition-all-200 font-medium">
              Submit
            </button>
          )}
          {submitted && (
            <p className={`mt-3 text-sm ${answer === config.correctAnswer ? "text-success" : "text-danger"}`}>
              {answer === config.correctAnswer ? "Correct" : "Incorrect"}
            </p>
          )}
        </div>
      )
    }

    case "FILL_BLANK": {
      const [values, setValues] = useState<string[]>(config.blanks?.map(() => "") || [""])
      const [submitted, setSubmitted] = useState(false)
      const allOk = submitted && config.blanks?.every((b: any, i: number) =>
        b.acceptedAnswers.some((a: string) => values[i]?.toLowerCase().trim() === a.toLowerCase().trim())
      )

      return (
        <div className="card-base p-5">
          <p className="text-sm text-card-foreground mb-4 leading-relaxed">
            {submitted
              ? (() => { let idx = 0; return config.sentenceWithBlanks?.replace(/\[blank\]/g, () => `[${values[idx++] || ""}]`) })()
              : config.sentenceWithBlanks?.replace(/\[blank\]/g, `________`)
            }
          </p>
          {config.blanks?.map((_: any, i: number) => (
            <input
              key={i} type="text" value={values[i] || ""}
              onChange={(e) => { const n = [...values]; n[i] = e.target.value; setValues(n) }}
              disabled={submitted}
              className={`w-full mt-2 px-3 py-2 border rounded-sm text-sm focus:outline-none transition-all-200 ${
                submitted ? (allOk ? "border-success bg-success/5" : "border-danger bg-danger/5") : "border-border focus:ring-1 focus:ring-ring"
              }`}
              placeholder={`Answer ${i + 1}`}
            />
          ))}
          {!submitted && (
            <button onClick={() => {
              setSubmitted(true)
              const allCorrect = config.blanks?.every((b: any, i: number) =>
                b.acceptedAnswers.some((a: string) => values[i]?.toLowerCase().trim() === a.toLowerCase().trim())
              )
              onAnswer?.({ values }, allCorrect, allCorrect ? (config.points ?? 1) : 0)
            }} className="mt-4 px-5 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover transition-all-200 font-medium">
              Submit
            </button>
          )}
          {submitted && <p className={`mt-3 text-sm ${allOk ? "text-success" : "text-danger"}`}>{allOk ? "All correct" : "Some are wrong"}</p>}
        </div>
      )
    }

    case "ORDERING": {
      const [items, setItems] = useState(config.items ? [...config.items] : [])
      const [submitted, setSubmitted] = useState(false)
      const initialized = useRef(false)
      useEffect(() => {
        if (!initialized.current) {
          initialized.current = true
          setItems((prev) => [...prev].sort(() => Math.random() - 0.5))
        }
      }, [])

      return (
        <div className="card-base p-5">
          <p className="text-sm font-medium text-card-foreground mb-4">{config.instruction}</p>
          <div className="space-y-1.5">
            {items.map((item: any, i: number) => (
              <div key={item.id} className="flex items-center gap-2 p-3 border border-border rounded-sm bg-white text-sm transition-all-200">
                <span className="text-muted-foreground font-mono text-xs w-5">{i + 1}.</span>
                <span className="flex-1">{item.text}</span>
                {!submitted && (
                  <div className="flex gap-0.5">
                    <button onClick={() => { if (i === 0) return; const n = [...items]; [n[i-1], n[i]] = [n[i], n[i-1]]; setItems(n) }} disabled={i === 0} className="px-1.5 py-0.5 text-xs border border-border rounded-sm hover:bg-muted disabled:opacity-30 transition-all-200">↑</button>
                    <button onClick={() => { if (i === items.length - 1) return; const n = [...items]; [n[i], n[i+1]] = [n[i+1], n[i]]; setItems(n) }} disabled={i === items.length - 1} className="px-1.5 py-0.5 text-xs border border-border rounded-sm hover:bg-muted disabled:opacity-30 transition-all-200">↓</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {!submitted && (
            <button onClick={() => {
              setSubmitted(true)
              const isCorrect = items.every((item: any, i: number) => item.correctPosition === i + 1)
              onAnswer?.({ order: items.map((i: any) => i.id) }, isCorrect, isCorrect ? (config.points ?? 1) : 0)
            }} className="mt-4 px-5 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover transition-all-200 font-medium">
              Check Order
            </button>
          )}
        </div>
      )
    }

    case "MATCHING": {
      const [matches, setMatches] = useState<Record<string, string>>({})
      const [submitted, setSubmitted] = useState(false)
      const leftItems = config.pairs?.map((p: any) => ({ id: p.id, text: p.left })) || []
      const [rightItems, setRightItems] = useState(config.pairs ? [...config.pairs] : [])
      const matchingInit = useRef(false)
      useEffect(() => {
        if (!matchingInit.current) {
          matchingInit.current = true
          setRightItems((prev) => [...prev].sort(() => Math.random() - 0.5))
        }
      }, [])

      return (
        <div className="card-base p-5">
          <p className="text-sm font-medium text-card-foreground mb-4">{config.instruction || config.question || "Match the items"}</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Terms</p>
              {leftItems.length === 0 ? (
                <p className="text-xs text-muted-foreground">No items configured</p>
              ) : (
                leftItems.map((item: any) => (
                  <div key={item.id} className="p-3 border border-border rounded-sm bg-primary-light/30 text-sm font-medium min-h-[44px] flex items-center">
                    {item.text || <span className="text-muted-foreground/50 italic">Empty</span>}
                  </div>
                ))
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Definitions</p>
              {rightItems.map((item: any) => (
                <div key={item.id} className="space-y-1">
                  <p className="text-sm text-card-foreground">{item.right}</p>
                  <select
                    value={matches[item.id] || ""}
                    onChange={(e) => setMatches({ ...matches, [item.id]: e.target.value })}
                    disabled={submitted}
                    className="w-full p-2 border border-border rounded-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
                  >
                    <option value="">— Select match —</option>
                    {leftItems.map((left: any) => (
                      <option key={left.id} value={left.id}>{left.text || "(empty)"}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
          {submitted ? (
            <div className="mt-4 p-3 rounded-sm text-sm font-medium text-center" style={{
              backgroundColor: config.pairs?.every((p: any) => matches[p.id] === p.id) ? "#dcfce7" : "#fef2f2",
              color: config.pairs?.every((p: any) => matches[p.id] === p.id) ? "#166534" : "#991b1b",
            }}>
              {config.pairs?.every((p: any) => matches[p.id] === p.id) ? "✓ All correct!" : "✗ Some matches are incorrect"}
            </div>
          ) : (
            <button onClick={() => {
              setSubmitted(true)
              const isCorrect = config.pairs?.every((p: any) => matches[p.id] === p.id) ?? false
              onAnswer?.({ matches }, isCorrect, isCorrect ? (config.points ?? 1) : 0)
            }} className="mt-4 px-5 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover transition-all-200 font-medium">
              Check Matches
            </button>
          )}
        </div>
      )
    }

    case "DRAWING":
      return (
        <div className="card-base p-5">
          <DrawingCanvas prompt={config.prompt} readOnly={false} />
        </div>
      )

    case "HOMEWORK_UPLOAD": {
      const [fileUrl, setFileUrl] = useState("")
      const acceptTypes = config.acceptedFileTypes?.join(",") || "image,application/pdf"
      return (
        <div className="card-base p-5">
          {config.instructions && <p className="text-sm font-medium text-card-foreground mb-4">{config.instructions}</p>}
          {fileUrl ? (
            <div className="flex items-center gap-2 p-3 bg-success/5 border border-success/20 rounded-lg text-sm">
              <Upload className="h-4 w-4 text-success" />
              <span className="flex-1 truncate text-success">File uploaded</span>
              <button onClick={() => setFileUrl("")} className="text-xs text-muted-foreground hover:text-danger">Remove</button>
            </div>
          ) : (
            <UploadButton
              endpoint={acceptTypes.includes("pdf") ? "pdfUploader" : "imageUploader"}
              onClientUploadComplete={(res) => { if (res?.[0]?.url) { setFileUrl(res[0].url); onAnswer?.({ fileUrl: res[0].url }, true, config.completionPoints ?? 0) } }}
              appearance={{
                button: "w-full !p-8 !text-sm !font-normal !rounded-lg !border-2 !border-dashed !border-gray-300 !bg-transparent !text-gray-500 hover:!bg-gray-50 hover:!text-gray-700 !transition-colors !cursor-pointer !shadow-none !ring-0",
                allowedContent: "!text-[10px] !text-gray-400 !mt-2",
              }}
            />
          )}
          <p className="text-[10px] text-muted-foreground mt-2">
            Accepted: {config.acceptedFileTypes?.join(", ") || "Any file type"}
          </p>
        </div>
      )
    }

    default:
      return <p className="text-muted-foreground text-sm">Block preview not available</p>
  }
}
