import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calendario",
  description: "Calendario de actividades y eventos - ADN Developers",
}

export default function CalendarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
