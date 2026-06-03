import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SYSTEM_PROMPT } from "@/lib/prompts"

const ACTIONS_PROMPT = `You are an AI assistant inside a lesson builder. You can help the teacher edit their lesson.

Available actions — respond with JSON: {"reply":"message to teacher","actions":[...]}

Actions:
{"action":"addBlock","sectionIndex":0,"blockType":"MULTIPLE_CHOICE","config":{...}}
{"action":"deleteBlock","blockId":"..."}
{"action":"updateBlock","blockId":"...","config":{...}}
{"action":"addSection","title":"New Section"}
{"action":"deleteSection","sectionIndex":0}
{"action":"updateTitle","title":"New Title"}
{"action":"reorderBlocks","sectionIndex":0,"blockIds":["id1","id2","id3"]}
{"action":"changeBlockType","blockId":"...","blockType":"MULTIPLE_CHOICE"}
{"action":"updateBlockGrid","blockId":"...","gridWidth":6,"gridHeight":1}

Block configs must match these shapes exactly:
RICH_TEXT={"content":"<h2>T</h2><p>t</p>"}
QUOTE={"text":"q","attribution":"- N","style":"modern"}
MULTIPLE_CHOICE={"question":"Q?","options":[{"id":"o1","text":"A","isCorrect":true,"feedback":"f"},{"id":"o2","text":"B","isCorrect":false,"feedback":"f"},{"id":"o3","text":"C","isCorrect":false,"feedback":"f"},{"id":"o4","text":"D","isCorrect":false,"feedback":"f"}],"points":10,"allowRetry":false}
TRUE_FALSE={"statement":"S","correctAnswer":true,"feedbackCorrect":"y","feedbackIncorrect":"n","points":10}
FILL_BLANK={"sentenceWithBlanks":"X is [blank].","blanks":[{"placeholderIndex":0,"acceptedAnswers":["a","A"]}],"points":10}
ORDERING={"instruction":"Order:","items":[{"id":"i1","text":"A","correctOrder":1},{"id":"i2","text":"B","correctOrder":2}],"points":10}
MATCHING={"instruction":"Match:","pairs":[{"id":"p1","left":"T","right":"D"},{"id":"p2","left":"T2","right":"D2"}],"points":10}
DRAWING={"prompt":"Draw...","completionPoints":5}
HOMEWORK_UPLOAD={"instructions":"Submit","acceptedFileTypes":["image","pdf"],"completionPoints":5}
VIDEO={"sourceType":"youtube","url":"https://youtube.com/watch?v=ID","startTime":0,"endTime":0}
IMAGE={"url":"https://example.com/image.jpg","altText":"desc","hotspots":[]}
PDF={"fileId":"","pageRange":""}
AUDIO={"sourceType":"upload","fileId":""}

Keep action count small (1-3 max). Reply naturally. If you can't do something, explain why.`

const fullSystem = `${SYSTEM_PROMPT}\n\n${ACTIONS_PROMPT}`

async function* streamDeepSeek(system: string, user: string): AsyncGenerator<string> {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) throw new Error("DEEPSEEK_API_KEY not set")
  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: system }, { role: "user", content: user }], temperature: 0.3, max_tokens: 4096, stream: true }),
  })
  if (!res.ok) { const t = await res.text(); throw new Error(`DeepSeek error ${res.status}: ${t}`) }
  const reader = res.body?.getReader()
  if (!reader) throw new Error("No response body")
  const decoder = new TextDecoder()
  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim()
        if (data === "[DONE]") return
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ""
          if (content) yield content
        } catch { /* skip incomplete JSON */ }
      }
    }
  }
}

async function* streamGroq(system: string, user: string): AsyncGenerator<string> {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error("GROQ_API_KEY not set")
  const totalChars = system.length + user.length + 500
  if (totalChars > 18000) throw new Error("Groq prompt too large")
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "system", content: system }, { role: "user", content: user }], temperature: 0.3, max_tokens: 4096, stream: true }),
  })
  if (!res.ok) { const t = await res.text(); throw new Error(`Groq error ${res.status}: ${t}`) }
  const reader = res.body?.getReader()
  if (!reader) throw new Error("No response body")
  const decoder = new TextDecoder()
  let buffer = ""
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() || ""
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim()
        if (data === "[DONE]") return
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ""
          if (content) yield content
        } catch { /* skip */ }
      }
    }
  }
}

const streamers: { name: string; stream: (system: string, user: string) => AsyncGenerator<string> }[] = [
  { name: "DeepSeek", stream: streamDeepSeek },
  { name: "Groq", stream: streamGroq },
]

function parseActions(text: string): { reply: string; actions: any[] } {
  const cleaned = text.replace(/^```(?:json)?\s*/gm, "").replace(/```\s*$/gm, "").trim()
  try {
    const parsed = JSON.parse(cleaned)
    return { reply: parsed.reply || "Done!", actions: parsed.actions || [] }
  } catch {
    const s = cleaned.indexOf("{"); const e = cleaned.lastIndexOf("}")
    if (s !== -1 && e > s) {
      try {
        const parsed = JSON.parse(cleaned.slice(s, e + 1))
        return { reply: parsed.reply || "Done!", actions: parsed.actions || [] }
      } catch {}
    }
    return { reply: text, actions: [] }
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const session = await requireTeacher()
  const { lessonId } = await params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId, teacherId: session.user.id },
    include: { sections: { include: { blocks: true }, orderBy: { orderIndex: "asc" } } },
  })
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 })

  const { message, messages: history } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: "Message is required" }, { status: 400 })

  const lessonContext = {
    title: lesson.title,
    status: lesson.status,
    totalPoints: lesson.totalPoints,
    sections: lesson.sections.map((s) => {
      const secConfig = JSON.parse(s.config || "{}")
      return { id: s.id, title: secConfig.title || "", orderIndex: s.orderIndex, blocks: s.blocks.map((b) => ({ id: b.id, blockType: b.blockType, stepOrder: b.stepOrder, config: JSON.parse(b.config || "{}") })) }
    }),
  }

  let conversationHistory = ""
  if (Array.isArray(history)) {
    conversationHistory = history.slice(0, -1).slice(-6).map((m: any) => `${m.role === "user" ? "Teacher" : "Assistant"}: ${m.content}`).join("\n")
  }

  const userPrompt = `Current lesson:\n${JSON.stringify(lessonContext, null, 2)}\n\n${conversationHistory ? `Conversation:\n${conversationHistory}\n\n` : ""}Teacher: ${message}`

  // Find a working streamer
  let chosenStreamer: typeof streamers[0] | null = null
  let lastError = ""
  for (const s of streamers) {
    try {
      for await (const _ of s.stream(fullSystem, "OK")) { break }
      chosenStreamer = s
      break
    } catch (e) {
      lastError = String(e)
    }
  }

  if (!chosenStreamer) {
    return NextResponse.json({ error: `AI unavailable: ${lastError}` }, { status: 503 })
  }

  // Stream the response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let fullText = ""
      try {
        for await (const chunk of chosenStreamer!.stream(fullSystem, userPrompt)) {
          fullText += chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "token", text: chunk })}\n\n`))
        }
        // Parse actions
        const { reply, actions } = parseActions(fullText)
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done", reply, actions })}\n\n`))
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "error", error: String(e) })}\n\n`))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
