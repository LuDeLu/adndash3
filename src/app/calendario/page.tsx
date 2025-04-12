"use client"

import Calendario from "@/components/administrativo/calendario"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function CalendarioPage() {
  return (
    <>
      <Calendario />
      <SpeedInsights />
    </>
  )
}
