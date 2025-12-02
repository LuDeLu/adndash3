import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Postventas",
  description: "Gestión de postventas y reclamos - ADN Developers",
}

export default function PostventasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
