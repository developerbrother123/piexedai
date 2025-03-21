import type { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { messages, model, stream = true, userId, maxTokens = 2048 } = await req.json()

