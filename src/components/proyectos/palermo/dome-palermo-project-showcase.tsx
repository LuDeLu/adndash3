"use client"
import { useState } from "react"
import { DomePalermoProjectModal } from "./dome-palermo-project-modal"
import { DomePalermoFloorPlan } from "./dome-palermo-floor-plan"
import { DomePalermoGallery } from "./dome-palermo-gallery"
import { domePalermoData } from "@/lib/dome-palermo-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

type ViewMode = "card" | "modal" | "floorPlan" | "gallery"

interface DomePalermoProjectShowcaseProps {
  onBack?: () => void
  onOpenFloorPlan?: () => void
}

export function DomePalermoProjectShowcase({ onBack, onOpenFloorPlan }: DomePalermoProjectShowcaseProps) {
  const [currentView, setCurrentView] = useState<ViewMode>("card")
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)

  const handleViewProject = () => {
    setCurrentView("modal")
  }

  const handleViewGallery = () => {
    setCurrentView("gallery")
  }

  const handleViewPlanes = (floorNumber?: number) => {
    setSelectedFloor(floorNumber || null)
    setCurrentView("floorPlan")
  }

  const handleReturnToProjectModal = () => {
    setCurrentView("modal")
    setSelectedFloor(null)
  }

  const handleReturnToCard = () => {
    setCurrentView("card")
    setSelectedFloor(null)
  }

  const handleCloseModal = () => {
    setCurrentView("card")
  }

  if (currentView === "floorPlan") {
    return <DomePalermoFloorPlan onBack={handleReturnToProjectModal} />
  }

  if (currentView === "gallery") {
    return <DomePalermoGallery isOpen={true} onClose={handleReturnToCard} />
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Botón de regreso */}
        {onBack && (
          <div className="mb-6">
            <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Volver a Proyectos
            </Button>
          </div>
        )}

        {/* Project Card */}
        <div className="bg-card rounded-lg shadow-lg overflow-hidden cursor-pointer" onClick={handleViewProject}>
          <div className="relative h-64">
            <img
              src={domePalermoData.projectInfo.image || "/placeholder.svg"}
              alt={domePalermoData.projectInfo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <Image
                  src={domePalermoData.projectInfo.image || "/placeholder.svg"}
                  alt="DOME Logo"
                  width={60}
                  height={60}
                  className="object-contain bg-white/10 rounded-lg p-1"
                />
              </div>
              <h2 className="text-2xl font-bold">{domePalermoData.projectInfo.name}</h2>
              <p className="text-sm opacity-90">{domePalermoData.projectInfo.location}</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground mb-4">
              Moderno edificio residencial en el corazón de Palermo con amenities premium y acabados de lujo.
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Haz clic para ver detalles</span>
              <div className="flex space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Disponible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Modal */}
        <DomePalermoProjectModal
          isOpen={currentView === "modal"}
          onClose={handleCloseModal}
          onOpenFloorPlan={handleViewPlanes}
        />
      </div>
    </div>
  )
}
