import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Propietarios",
  description: "Gestión de propietarios",
}

export default function PropietariosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
