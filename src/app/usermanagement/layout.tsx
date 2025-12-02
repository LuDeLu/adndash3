import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Usuarios",
  description: "Gestión de usuarios del sistema - ADN Developers",
}

export default function UserManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
