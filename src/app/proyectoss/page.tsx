"use client"

import { useState } from "react"
import { Adn } from "@/components/proyectos/proyectos"
import { useRouter } from "next/navigation"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ProyectosPage() {
  const router = useRouter()
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const handleViewProject = (projectId: number) => {
    router.push(`/proyectos/vista/${projectId}`)
    setIsProjectModalOpen(false)
  }

  const handleViewGallery = (projectId: number) => {
    router.push(`/galeria/${projectId}`)
  }

  const handleViewPlanes = (projectId: number, floorNumber?: number) => {
    const url = floorNumber ? `/proyectos/vista/${projectId}?floor=${floorNumber}` : `/proyectos/vista/${projectId}`
    router.push(url)
  }

  return (
    <>
      <Adn
        onViewProject={handleViewProject}
        onViewGallery={handleViewGallery}
        onViewPlanes={handleViewPlanes}
        isProjectModalOpen={isProjectModalOpen}
        setIsProjectModalOpen={setIsProjectModalOpen}
        selectedProjectId={selectedProjectId}
        setSelectedProjectId={setSelectedProjectId}
      />
      <SpeedInsights />
    </>
  )
}
