import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Gestión de proyectos inmobiliarios - ADN Developers",
}

export default function ProyectosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
