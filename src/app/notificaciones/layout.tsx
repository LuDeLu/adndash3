import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Notificaciones",
  description: "Centro de notificaciones - ADN Developers",
}

export default function NotificacionesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
