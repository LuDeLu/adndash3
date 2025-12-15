"use client"

import { Propietarios } from "@/components/administrativo/propietarios"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function PropietariosPage() {
  return (
    <>
      <Propietarios />
      <SpeedInsights />
    </>
  )
}
