import { SYSTEM_PROMPT } from "./prompts"
import { OUTLINE_PROMPT } from "./prompts-outline"
import { fillSystemPrompt } from "./prompts-fill"
import { resolveLessonMedia } from "./resolve-media"

// ─── Provider Health ───────────────────────────────────
interface HealthResult {
  ok: boolean
  name: string
  error?: string
}

let healthCache: HealthResult[] | null = null
let healthCachedAt = 0
const HEALTH_TTL = 5 * 60 * 1000

async function probeDeepSeek(): Promise<HealthResult> {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) return { ok: false, name: "DeepSeek Flash", error: "No key" }
  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: "OK" }], max_tokens: 1 }),
    })
    if (res.status === 402 || res.status === 401) {
      const text = await res.text()
      return { ok: false, name: "DeepSeek Flash", error: `DeepSeek ${res.status}` }
    }
    if (!res.ok) return { ok: false, name: "DeepSeek Flash", error: `DeepSeek ${res.status}` }
    return { ok: true, name: "DeepSeek Flash" }
  } catch (e) {
    return { ok: false, name: "DeepSeek Flash", error: String(e) }
  }
}

async function probeGemini(): Promise<HealthResult> {
  const key = process.env.GEMINI_API_KEY
  if (!key) return { ok: false, name: "Gemini", error: "No key" }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: "OK" }] }], generationConfig: { maxOutputTokens: 1 } }),
    })
    if (!res.ok) return { ok: false, name: "Gemini", error: `Gemini ${res.status}` }
    return { ok: true, name: "Gemini" }
  } catch (e) {
    return { ok: false, name: "Gemini", error: String(e) }
  }
}

async function probeGroq(): Promise<HealthResult> {
  const key = process.env.GROQ_API_KEY
  if (!key) return { ok: false, name: "Groq (Llama)", error: "No key" }
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: "OK" }], max_tokens: 1 }),
    })
    if (!res.ok) return { ok: false, name: "Groq (Llama)", error: `Groq ${res.status}` }
    return { ok: true, name: "Groq (Llama)" }
  } catch (e) {
    return { ok: false, name: "Groq (Llama)", error: String(e) }
  }
}

const probes: (() => Promise<HealthResult>)[] = [probeDeepSeek, probeGemini, probeGroq]

export async function getProviderHealth(): Promise<HealthResult[]> {
  if (healthCache && Date.now() - healthCachedAt < HEALTH_TTL) return healthCache
  const results = await Promise.all(probes.map((p) => p()))
  healthCache = results
  healthCachedAt = Date.now()
  return results
}

export async function getSortedProviderNames(): Promise<string[]> {
  const results = await getProviderHealth()
  return results
    .filter((r) => r.ok)
    .sort((a) => (a.name === "DeepSeek Flash" ? 0 : a.name === "Gemini" ? 1 : 2))
    .map((r) => r.name)
}

// ─── Generic AI caller ─────────────────────────────────

interface AiProvider {
  name: string
  generate(system: string, user: string): Promise<string>
}

class DeepSeekProvider implements AiProvider {
  name = "DeepSeek Flash"
  async generate(system: string, user: string): Promise<string> {
    const key = process.env.DEEPSEEK_API_KEY
    if (!key) throw new Error("DEEPSEEK_API_KEY not set")
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: system }, { role: "user", content: user }], temperature: 0.3, max_tokens: 8192 }),
    })
    if (!res.ok) { const t = await res.text(); throw new Error(`DeepSeek error ${res.status}: ${t}`) }
    const j = await res.json()
    return j.choices?.[0]?.message?.content ?? ""
  }
}

class GeminiProvider implements AiProvider {
  name = "Gemini"
  async generate(system: string, user: string): Promise<string> {
    const key = process.env.GEMINI_API_KEY
    if (!key) throw new Error("GEMINI_API_KEY not set")
    const res = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: `${system}\n\n${user}` }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 8192 } }),
    })
    if (!res.ok) { const t = await res.text(); throw new Error(`Gemini error ${res.status}: ${t}`) }
    const j = await res.json()
    return j.candidates?.[0]?.content?.parts?.[0]?.text ?? ""
  }
}

class GroqProvider implements AiProvider {
  name = "Groq (Llama)"
  async generate(system: string, user: string): Promise<string> {
    const key = process.env.GROQ_API_KEY
    if (!key) throw new Error("GROQ_API_KEY not set")
    const totalChars = system.length + user.length + 500
    if (totalChars > 18000) throw new Error("Groq prompt too large")
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: system }, { role: "user", content: user }], temperature: 0.3, max_tokens: 8192 }),
    })
    if (!res.ok) { const t = await res.text(); throw new Error(`Groq error ${res.status}: ${t}`) }
    const j = await res.json()
    return j.choices?.[0]?.message?.content ?? ""
  }
}

const providerByName: Record<string, AiProvider> = {
  "DeepSeek Flash": new DeepSeekProvider(),
  "Gemini": new GeminiProvider(),
  "Groq (Llama)": new GroqProvider(),
}

async function callAi(system: string, user: string): Promise<string> {
  const sorted = await getSortedProviderNames()
  if (sorted.length === 0) throw new Error("No AI providers available")
  let last: Error | null = null
  for (const name of sorted) {
    const p = providerByName[name]
    if (!p) continue
    try {
      return await p.generate(system, user)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.warn(`[${name}] Failed: ${msg}`)
      last = err instanceof Error ? err : new Error(String(err))
    }
  }
  throw last ?? new Error("All AI providers failed")
}

// ─── JSON parsing ───────────────────────────────────────
function stripMarkdown(text: string): string {
  return text.replace(/^```(?:json)?\s*/gm, "").replace(/```\s*$/gm, "").trim()
}

function parseJson(text: string): any {
  const cleaned = stripMarkdown(text)
  try { return JSON.parse(cleaned) } catch {
    const s = cleaned.indexOf("{"); const e = cleaned.lastIndexOf("}")
    if (s !== -1 && e > s) return JSON.parse(cleaned.slice(s, e + 1))
    throw new Error("AI returned invalid JSON")
  }
}

// ─── Multi-step generation ──────────────────────────────

async function generateOutline(source: string, sourceType: string): Promise<any> {
  const user = sourceType === "topic"
    ? `Create a lesson outline about: ${source}`
    : `Create a lesson outline from this content:\n\n${source}`

  const raw = await callAi(OUTLINE_PROMPT, user)
  const outline = parseJson(raw)

  if (!outline.title || !Array.isArray(outline.sections)) throw new Error("Invalid outline")
  return outline
}

async function fillBlock(blockType: string, sectionTitle: string, lessonContext: string): Promise<any> {
  const system = fillSystemPrompt(blockType, sectionTitle, lessonContext)
  const raw = await callAi(system, `Generate the config for a ${blockType} block in section "${sectionTitle}".`)
  return parseJson(raw)
}

// ─── Public API ─────────────────────────────────────────

export async function generateLesson(source: string, sourceType: "text" | "topic" | "url"): Promise<any> {
  // Step 1: Outline
  const outline = await generateOutline(source, sourceType)

  const lessonContext = JSON.stringify({ title: outline.title, subject: outline.subject, grade: outline.grade })

  // Step 2: Fill all blocks in parallel
  const fillTasks: { sectionIndex: number; blockIndex: number; promise: Promise<any> }[] = []

  for (let si = 0; si < outline.sections.length; si++) {
    const sec = outline.sections[si]
    for (let bi = 0; bi < (sec.blocks?.length || 0); bi++) {
      const blockType = sec.blocks[bi]
      if (typeof blockType !== "string") continue
      fillTasks.push({
        sectionIndex: si,
        blockIndex: bi,
        promise: fillBlock(blockType, sec.title || "", lessonContext),
      })
    }
  }

  const results = await Promise.allSettled(fillTasks.map((t) => t.promise))

  // Assemble lesson
  const lesson: any = {
    title: outline.title,
    subject: outline.subject || "",
    grade: outline.grade || 5,
    estimatedMinutes: outline.estimatedMinutes || 30,
    totalPoints: 0,
    sections: [],
  }

  let totalPoints = 0

  for (let si = 0; si < outline.sections.length; si++) {
    const sec = outline.sections[si]
    const secBlocks: any[] = []

    const secFillTasks = fillTasks.filter((t) => t.sectionIndex === si)

    for (const ft of secFillTasks) {
      const result = results[fillTasks.indexOf(ft)]
      const blockType = sec.blocks[ft.blockIndex]
      let config: any = {}

      if (result.status === "fulfilled") {
        config = result.value
        // If fill returned full block with blockType+config, extract config
        if (config.config) config = config.config
        // Accumulate points for quiz blocks
        if (config.points) totalPoints += config.points
      } else {
        console.warn(`[Fill] Block ${blockType} failed:`, result.reason)
      }

      secBlocks.push({ blockType, config })
    }

    lesson.sections.push({ title: sec.title || "", blocks: secBlocks })
  }

  lesson.totalPoints = totalPoints

  // Step 3: Resolve media (images)
  const resolved = await resolveLessonMedia(lesson)

  return { data: resolved, provider: "multi-step" }
}

// ─── Status ─────────────────────────────────────────────

export function isAiConfigured(): boolean {
  return !!(process.env.DEEPSEEK_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY)
}

export async function getAiStatus(): Promise<{ configured: boolean; providers: HealthResult[] }> {
  const results = await getProviderHealth()
  return { configured: results.some((r) => r.ok), providers: results }
}
