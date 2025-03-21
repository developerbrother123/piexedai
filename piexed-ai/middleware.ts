import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the application is installed by making an API call
  // instead of directly checking the file system
  const isInstalled = process.env.PIEXED_INSTALLED === "true"

  // If not installed and not accessing the installer, redirect to installer
  if (
    !isInstalled &&
    !request.nextUrl.pathname.startsWith("/install") &&
    !request.nextUrl.pathname.startsWith("/api/install")
  ) {
    return NextResponse.redirect(new URL("/install", request.url))
  }

  // If installed and accessing the installer, redirect to home
  if (isInstalled && request.nextUrl.pathname === "/install") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/install routes (so we can check installation status)
     * 2. /install routes (so we can access the installer)
     * 3. /_next (internal Next.js routes)
     * 4. /static (static files)
     * 5. /favicon.ico, /robots.txt (common static files)
     */
    "/((?!_next|static|favicon.ico|robots.txt).*)",
  ],
}

