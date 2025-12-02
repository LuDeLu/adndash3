import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mapa",
  description: "Mapa interactivo de proyectos - ADN Developers",
}

export default function MapaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
