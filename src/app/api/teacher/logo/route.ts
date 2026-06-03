import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "logo" } })
    return NextResponse.json({ url: setting?.value || null })
  } catch {
    return NextResponse.json({ url: null })
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url is required" }, { status: 400 })
    }
    const setting = await prisma.siteSetting.upsert({
      where: { key: "logo" },
      update: { value: url },
      create: { key: "logo", value: url },
    })
    return NextResponse.json({ url: setting.value })
  } catch {
    return NextResponse.json({ error: "Failed to save logo" }, { status: 500 })
  }
}
