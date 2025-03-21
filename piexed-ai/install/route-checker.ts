"use server"

import fs from "fs"
import path from "path"

interface RouteCheckResult {
  route: string
  exists: boolean
  type: "page" | "api" | "component"
}

export async function checkRoutes() {
  const appDir = path.join(process.cwd(), "app")
  const results: RouteCheckResult[] = []

  // Essential routes to check
  const essentialRoutes = [
    { path: "page.tsx", type: "page" },
    { path: "dashboard/page.tsx", type: "page" },
    { path: "admin/page.tsx", type: "page" },
    { path: "login/page.tsx", type: "page" },
    { path: "chat/page.tsx", type: "page" },
    { path: "subscription/page.tsx", type: "page" },
    { path: "api-docs/page.tsx", type: "page" },
    { path: "contact/page.tsx", type: "page" },
    { path: "image/page.tsx", type: "page" },
    { path: "music/page.tsx", type: "page" },
    { path: "video/page.tsx", type: "page" },
    { path: "software/page.tsx", type: "page" },
    { path: "admin/models/page.tsx", type: "page" },
    { path: "admin/payments/crypto/page.tsx", type: "page" },
    { path: "api/generate/route.ts", type: "api" },
    { path: "api/chat/route.ts", type: "api" },
    { path: "api/auth/route.ts", type: "api" },
    { path: "api/subscription/route.ts", type: "api" },
    { path: "api/admin/route.ts", type: "api" },
    { path: "api/image/route.ts", type: "api" },
    { path: "api/payments/crypto/route.ts", type: "api" },
    { path: "api/payments/crypto/webhook/route.ts", type: "api" },
    { path: "api/software/route.ts", type: "api" },
    { path: "api/software/download/[buildId]/[fileName]/route.ts", type: "api" },
  ]

  for (const route of essentialRoutes) {
    const fullPath = path.join(appDir, route.path)
    results.push({
      route: route.path,
      exists: fs.existsSync(fullPath),
      type: route.type,
    })
  }

  return results
}

