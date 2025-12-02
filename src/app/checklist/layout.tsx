import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checklist",
  description: "Control de tareas y checklist - ADN Developers",
}

export default function ChecklistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
