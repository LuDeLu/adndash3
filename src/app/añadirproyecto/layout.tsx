import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nuevo Proyecto",
  description: "Crear nuevo proyecto - ADN Developers",
}

export default function AñadirProyectoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
