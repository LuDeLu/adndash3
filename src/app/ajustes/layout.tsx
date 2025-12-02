import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ajustes",
  description: "Configuración del sistema - ADN Developers",
}

export default function AjustesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
