"use client"

import Dashboard from "@/components/estadisticas/estadisticas"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function EstadisticasPage() {
  return (
    <>
      <Dashboard />
      <SpeedInsights />
    </>
  )
}
