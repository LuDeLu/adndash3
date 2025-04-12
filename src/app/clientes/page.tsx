"use client"

import { Clientes } from "@/components/administrativo/clientes"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ClientesPage() {
  return (
    <>
      <Clientes />
      <SpeedInsights />
    </>
  )
}
