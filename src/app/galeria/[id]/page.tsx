"use client"

import { useParams, useRouter } from "next/navigation"
import { MediaGalleryComponent } from "@/components/proyectos/galeria"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function GaleriaPage() {
  const params = useParams()
  const router = useRouter()

  const projectId = Number(params.id)

  const handleSetActiveSection = (section: string) => {
    if (section === "proyectos") {
      router.push("/proyectos")
    }
  }

  return (
    <>
      <MediaGalleryComponent projectId={projectId} setActiveSection={handleSetActiveSection} />
      <SpeedInsights />
    </>
  )
}
