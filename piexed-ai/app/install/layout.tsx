import type React from "react"
export const metadata = {
  title: "Piexed AI Installer",
  description: "Install your Self-Evolving Generative AI Platform",
}

export default function InstallLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

