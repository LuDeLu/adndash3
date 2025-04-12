"use client"

import PostVentaGestion from "@/components/postventa/PostVentaGestion"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function PostVentasPage() {
  return (
    <>
      <PostVentaGestion />
      <SpeedInsights />
    </>
  )
}
