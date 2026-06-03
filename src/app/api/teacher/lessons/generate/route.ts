import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { generateLesson, isAiConfigured } from "@/lib/ai"
import { fetchUrlContent } from "@/lib/fetch-content"

export async function POST(req: Request) {
  const session = await requireTeacher()

  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "No AI provider configured. Set DEEPSEEK_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY in .env" },
      { status: 501 }
    )
  }

  const body = await req.json()
  const { source, sourceType } = body as { source: string; sourceType: "text" | "topic" | "url" }

  if (!source || !source.trim()) {
    return NextResponse.json({ error: "Source content is required" }, { status: 400 })
  }

  let finalSource = source

  if (sourceType === "url") {
    try {
      finalSource = await fetchUrlContent(source)
    } catch (err) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${err instanceof Error ? err.message : "Unknown error"}` },
        { status: 400 }
      )
    }
  }

  try {
    const { data, provider } = await generateLesson(finalSource, sourceType)

    return NextResponse.json({
      lesson: data,
      provider,
      warning: null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: `Generation failed: ${message}` },
      { status: 500 }
    )
  }
}
