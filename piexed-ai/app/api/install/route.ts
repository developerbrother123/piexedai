import { type NextRequest, NextResponse } from "next/server"
import { installSystem } from "@/install/install-server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { dbConfig, adminUser, siteConfig, storageConfig } = data

    // Validate required fields
    if (!dbConfig || !adminUser || !siteConfig || !storageConfig) {
      return NextResponse.json({ error: "Missing required configuration data" }, { status: 400 })
    }

    // Validate admin user
    if (!adminUser.username || !adminUser.email || !adminUser.password) {
      return NextResponse.json({ error: "Admin user information is incomplete" }, { status: 400 })
    }

    // Run installation
    const result = await installSystem(dbConfig, adminUser, siteConfig, storageConfig)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Installation failed", message: error.message }, { status: 500 })
  }
}

