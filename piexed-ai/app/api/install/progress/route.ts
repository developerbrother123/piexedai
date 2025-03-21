import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const progressPath = path.join(process.cwd(), "install", ".progress")

    if (fs.existsSync(progressPath)) {
      const progressData = JSON.parse(fs.readFileSync(progressPath, "utf-8"))
      return NextResponse.json(progressData)
    } else {
      return NextResponse.json({ progress: 0, step: "Not started" })
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to check installation progress" }, { status: 500 })
  }
}

