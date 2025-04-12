"use client"

import { SettingsDashboardComponent } from "@/components/usuarios/configuracion"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function AjustesPage() {
  return (
    <>
      <SettingsDashboardComponent />
      <SpeedInsights />
    </>
  )
}
