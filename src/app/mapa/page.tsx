"use client"

import dynamic from "next/dynamic"
import { SpeedInsights } from "@vercel/speed-insights/next"

// Importación dinámica del componente MapaInteractivo
const MapaInteractivo = dynamic(() => import("@/components/mapa/MapaInteractivo"), { ssr: false })

export default function MapaPage() {
  return (
    <>
      <MapaInteractivo />
      <SpeedInsights />
    </>
  )
}
