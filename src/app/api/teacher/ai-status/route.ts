import { NextResponse } from "next/server"
import { requireTeacher } from "@/lib/auth"
import { getAiStatus } from "@/lib/ai"

export async function GET() {
  await requireTeacher()
  const status = await getAiStatus()
  return NextResponse.json(status)
}
