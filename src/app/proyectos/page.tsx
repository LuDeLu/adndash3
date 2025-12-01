"use client"

import { useState, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { DomeBoulevardFloorPlan } from "@/components/proyectos/boulevard/dome-boulevar-floor-plan"
import { DomeApartFloorPlan } from "@/components/proyectos/apart/dome-apart-floor-plan"
import { DomeBerutiFloorPlan } from "@/components/proyectos/beruti/dome-beruti-floor-plan"
import {DomeFloorPlan} from "@/components/proyectos/lagos/dome-floor-plan"
import { DomeSuitesFloorPlan } from "@/components/proyectos/suites/dome-suites-floor-plan"
import { DomePalermoFloorPlan } from "@/components/proyectos/resi/dome-resi-floor-plan"
import Image from "next/image"

// Importar todos los modales (usando named exports)
import { DomeProjectModal } from "@/components/proyectos/lagos/dome-project-modal"
import { DomeSuitesProjectModal } from "@/components/proyectos/suites/dome-suites-project-modal"
import { DomePalermoProjectModal } from "@/components/proyectos/resi/dome-resi-project-modal"
import { DomeBoulevardProjectModal } from "@/components/proyectos/boulevard/dome-boulevar-project-modal"
import { ApartProjectModal } from "@/components/proyectos/apart/dome-apart-project-modal"
import { DomeBerutiProjectModal } from "@/components/proyectos/beruti/dome-beruti-project-modal"

// Importar galerías (usando named exports)
import { DomeGallery } from "@/components/proyectos/lagos/dome-gallery"
import { DomeSuitesGallery } from "@/components/proyectos/suites/dome-suites-gallery"
import { DomePalermoGallery } from "@/components/proyectos/resi/dome-resi-gallery"
import { DomeBoulevardGallery } from "@/components/proyectos/boulevard/dome-boulevar-gallery"
import { DomeApartGallery } from "@/components/proyectos/apart/dome-apart-gallery"
import { DomeBerutiGallery } from "@/components/proyectos/beruti/dome-beruti-gallery"

type ProjectType = "lagos" | "suites" | "palermo" | "boulevar" | "apart" | "beruti"
type ViewMode = "cards" | "floorplan" | "gallery"

type StaticProject = {
  id: string
  name: string
  image: string
  location: string
  type: ProjectType
  logo?: string
}

const staticProjects: StaticProject[] = [
  {
    id: "suites",
    name: "DOME Suites & Residences",
    image: "/images/logo/suitelogo.png",
    location: "Paraguay & Humboldt",
    type: "suites",
  },
  {
    id: "lagos",
    name: "DOME Puertos del Lago",
    image: "/images/logo/lagoslogo.png",
    location: "Escobar, Buenos Aires",
    type: "lagos",
  },
  {
    id: "palermo",
    name: "DOME Palermo Residence",
    image: "/images/logo/palermoresi.png",
    location: "Cabello & R. Arabe Siria",
    type: "palermo",
  },
  {
    id: "boulevar",
    name: "DOME Palermo Boulevard",
    image: "/images/logo/palermobou.png",
    location: "Cerviño 3941",
    type: "boulevar",
  },
  {
    id: "apart",
    name: "DOME Palermo Apartament",
    image: "/images/logo/palermoapart.png",
    location: "Cabello & Lafinur",
    type: "apart",
  },
  {
    id: "beruti",
    name: "DOME Torre Beruti",
    image: "/images/logo/berutilogo.png",
    location: "Beruti 4540",
    type: "beruti",
  },
]

const ProjectCard = memo(({ project, onClick }: { project: StaticProject; onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
  >
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer w-full bg-black"
      onClick={onClick}
    >
      <div className="relative h-[200px] overflow-hidden group">
        <div className="absolute inset-0 bg-black">
          <img
            src={project.image || "/placeholder.svg"}
            className="w-[200%] h-[200%] object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
          />
        </div>

        {/* Logo overlay */}
        {project.logo && (
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
              <Image
                src={project.logo || "/placeholder.svg"}
                alt={`${project.name} Logo`}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <div className="p-3 text-center bg-black text-white">
        <p className="text-xs text-gray-400">{project.location}</p>
      </div>
    </Card>
  </motion.div>
))

ProjectCard.displayName = "ProjectCard"

export default function DomePuertosPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("cards")
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)
  const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined)

  // Estados para controlar los modales
  const [isLagosModalOpen, setIsLagosModalOpen] = useState(false)
  const [isSuitesModalOpen, setIsSuitesModalOpen] = useState(false)
  const [isPalermoModalOpen, setIsPalermoModalOpen] = useState(false)
  const [isBoulevardModalOpen, setIsBoulevardModalOpen] = useState(false)
  const [isApartModalOpen, setIsApartModalOpen] = useState(false)
  const [isBerutiModalOpen, setIsBerutiModalOpen] = useState(false)

  const closeAllModals = () => {
    setIsLagosModalOpen(false)
    setIsSuitesModalOpen(false)
    setIsPalermoModalOpen(false)
    setIsBoulevardModalOpen(false)
    setIsApartModalOpen(false)
    setIsBerutiModalOpen(false)
  }

  // Función para manejar la navegación a planos de piso
  const handleViewFloorPlan = useCallback(
    (floorNumber?: number) => {
      console.log("handleViewFloorPlan called with floor:", floorNumber, "selectedProject:", selectedProject)
      setSelectedFloor(floorNumber)
      setCurrentView("floorplan")
      // Cerrar modales DESPUÉS de establecer el estado
      setTimeout(() => {
        closeAllModals()
      }, 0)
    },
    [selectedProject],
  )

  // Función para manejar la navegación a galerías
  const handleViewGallery = useCallback(() => {
    console.log("handleViewGallery called, selectedProject:", selectedProject)
    setCurrentView("gallery")
    // Cerrar modales DESPUÉS de establecer el estado
    setTimeout(() => {
      closeAllModals()
    }, 0)
  }, [selectedProject])

  const handleBackToCards = () => {
    setCurrentView("cards")
    setSelectedProject(null)
    setSelectedFloor(undefined)
  }

  const handleBackToProject = () => {
    setCurrentView("cards")
    setSelectedProject(null)
    setSelectedFloor(undefined)
  }

  const handleProjectClick = useCallback((project: StaticProject) => {
    console.log("Project clicked:", project.type)
    setSelectedProject(project.type)

    // Abrir el modal correspondiente según el tipo de proyecto
    switch (project.type) {
      case "lagos":
        setIsLagosModalOpen(true)
        break
      case "suites":
        setIsSuitesModalOpen(true)
        break
      case "palermo":
        setIsPalermoModalOpen(true)
        break
      case "boulevar":
        setIsBoulevardModalOpen(true)
        break
      case "apart":
        setIsApartModalOpen(true)
        break
      case "beruti":
        setIsBerutiModalOpen(true)
        break
    }
  }, [])

  const handleModalViewProject = () => {
    // Esta función se puede usar si necesitas alguna acción adicional
    // cuando se hace clic en "Ver Proyecto" desde el modal
  }

  // Renderizar planos de piso según el proyecto seleccionado
  if (currentView === "floorplan") {
    switch (selectedProject) {
      case "lagos":
        return <DomeFloorPlan floorNumber={selectedFloor} onReturnToProjectModal={handleBackToCards} />
      case "suites":
        return <DomeSuitesFloorPlan floorNumber={selectedFloor} onReturnToProjectModal={handleBackToCards} />
      case "palermo":
        return <DomePalermoFloorPlan onBack={handleBackToCards} />
      case "boulevar":
        return <DomeBoulevardFloorPlan floorNumber={selectedFloor} onReturnToProjectModal={handleBackToCards} />
      case "apart":
        return <DomeApartFloorPlan floorNumber={selectedFloor} onReturnToProjectModal={handleBackToCards} />
      case "beruti":
        return <DomeBerutiFloorPlan floorNumber={selectedFloor} onBack={handleBackToCards} />
      default:
        return null
    }
  }

  // Renderizar galerías según el proyecto seleccionado
  if (currentView === "gallery") {
    switch (selectedProject) {
      case "lagos":
        return <DomeGallery onReturnToProject={handleBackToCards} />
      case "suites":
        return <DomeSuitesGallery onReturnToProject={handleBackToCards} />
      case "palermo":
        return <DomePalermoGallery onReturnToProject={handleBackToCards} />
      case "boulevar":
        return <DomeBoulevardGallery onReturnToProject={handleBackToCards} />
      case "apart":
        return <DomeApartGallery onReturnToProject={handleBackToCards} />
      case "beruti":
        return <DomeBerutiGallery onReturnToProject={handleBackToCards} />
      default:
        return null
    }
  }

  // Vista principal con las cartas de proyectos
  return (
    <div className="bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {staticProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ProjectCard project={project} onClick={() => handleProjectClick(project)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Modales para cada proyecto */}
      <DomeProjectModal
        isOpen={isLagosModalOpen}
        onClose={closeAllModals}
        onViewProject={handleModalViewProject}
        onViewGallery={handleViewGallery}
        onViewPlanes={handleViewFloorPlan}
      />

      <DomeSuitesProjectModal
        isOpen={isSuitesModalOpen}
        onClose={closeAllModals}
        onViewProject={handleModalViewProject}
        onViewGallery={handleViewGallery}
        onViewPlanes={handleViewFloorPlan}
      />

      <DomePalermoProjectModal
        isOpen={isPalermoModalOpen}
        onClose={closeAllModals}
        onOpenFloorPlan={handleViewFloorPlan}
      />

      <DomeBoulevardProjectModal
        isOpen={isBoulevardModalOpen}
        onClose={closeAllModals}
        onViewProject={handleModalViewProject}
        onViewGallery={handleViewGallery}
        onViewPlanes={handleViewFloorPlan}
      />

      <ApartProjectModal
        isOpen={isApartModalOpen}
        onClose={closeAllModals}
        onViewProject={handleModalViewProject}
        onViewGallery={handleViewGallery}
        onViewPlanes={handleViewFloorPlan}
      />

      <DomeBerutiProjectModal
        isOpen={isBerutiModalOpen}
        onClose={closeAllModals}
        onOpenFloorPlan={handleViewFloorPlan}
        onOpenGallery={handleViewGallery}
      />
    </div>
  )
}
