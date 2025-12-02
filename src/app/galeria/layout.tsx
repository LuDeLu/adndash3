import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Galería",
  description: "Galería de imágenes de proyectos - ADN Developers",
}

export default function GaleriaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
