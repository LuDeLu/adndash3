import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Obras",
  description: "Seguimiento de obras en construcción - ADN Developers",
}

export default function ObrasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
