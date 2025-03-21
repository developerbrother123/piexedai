import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const installLockPath = path.join(process.cwd(), "install", ".installed")
    const isInstalled = fs.existsSync(installLockPath)

    return NextResponse.json({
      installed: isInstalled,
      installedAt: isInstalled ? fs.readFileSync(installLockPath, "utf-8") : null,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to check installation status" }, { status: 500 })
  }
}

