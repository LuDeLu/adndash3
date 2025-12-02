import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Archivos",
  description: "Repositorio de documentos - ADN Developers",
}

export default function ArchivosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
