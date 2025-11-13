"use client"

import { EnhancedDashboard } from "@/components/checklist/enhanced-dashboard"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ChecklistPage() {
  return (
    <>
      <EnhancedDashboard />
      <SpeedInsights />
    </>
  )
}
