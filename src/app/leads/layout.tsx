import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Leads",
  description: "Gestión de clientes - ADN Developers",
}

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
