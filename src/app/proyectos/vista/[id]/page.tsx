"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import InteractiveFloorPlan from "@/components/proyectos/vista-proyecto"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ProyectoVistaPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const projectId = Number(params.id)
  const floorNumber = searchParams.get("floor") ? Number(searchParams.get("floor")) : null

  const handleReturnToProjectModal = () => {
    router.push("/proyectos")
  }

  return (
    <>
      <InteractiveFloorPlan
        projectId={projectId}
        floorNumber={floorNumber}
        onReturnToProjectModal={handleReturnToProjectModal}
      />
      <SpeedInsights />
    </>
  )
}
