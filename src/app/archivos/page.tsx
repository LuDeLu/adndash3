"use client"

import DocumentManagement from "@/components/administrativo/documentos"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ArchivosPage() {
  return (
    <>
      <DocumentManagement />
      <SpeedInsights />
    </>
  )
}
