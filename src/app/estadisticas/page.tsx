"use client"

import { EstadisticasDashboard } from "@/components/estadisticas/estadisticas-dashboard"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function EstadisticasPage() {
  return (
    <>
      <EstadisticasDashboard />
      <SpeedInsights />
    </>
  )
}
