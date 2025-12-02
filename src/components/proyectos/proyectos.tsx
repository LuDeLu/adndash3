"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { ProjectModal } from "./project-modal"
import { AnimatePresence, motion } from "framer-motion"
import "notyf/notyf.min.css"

type Floor = {
  number: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  path: string
  x: number
  y: number
}

type UnitType = {
  type: string
  size: string
  priceRange: string
  status: string
}

type Amenity = {
  name: string
  description: string
}

type FinancialOption = {
  name: string
  description: string
}

type Project = {
  id: number
  name: string
  edificio: string
  image: string
  location: string
  available_units: number
  reserved_units: number
  sold_units: number
  total_units: number
  brochure: string
  floors?: Floor[]
  unitTypes?: UnitType[]
  amenities?: Amenity[]
  parkingInfo?: string
  financialOptions?: FinancialOption[]
  promotions?: string
}

const API_BASE_URL = "https://adndashboard.squareweb.app/api"

const ProjectCard = memo(({ project, onClick }: { project: Project; onClick: () => void }) => (
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
            alt={project.name}
            className="w-[200%] h-[200%] object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="p-3 text-center bg-black text-white">
        <p className="text-sm text-gray-400">{project.location}</p>
      </div>
    </Card>
  </motion.div>
))

ProjectCard.displayName = "ProjectCard"

type AdnProps = {
  onViewProject: (projectId: number) => void
  onViewPlanes: (projectId: number, floorNumber?: number) => void
  onViewGallery: (projectId: number) => void
  isProjectModalOpen: boolean
  setIsProjectModalOpen: (isOpen: boolean) => void
  selectedProjectId: number | null
  setSelectedProjectId: (projectId: number | null) => void
}

export function Adn({
  onViewProject,
  onViewPlanes,
  onViewGallery,
  isProjectModalOpen,
  setIsProjectModalOpen,
  selectedProjectId,
  setSelectedProjectId,
}: AdnProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`Fetching projects from: ${API_BASE_URL}/projects`)

      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      console.log(`Response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`HTTP error! status: ${response.status}, body: ${errorText}`)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Received ${data.length} projects:`, data)
      setProjects(data)
    } catch (err) {
      console.error("Error fetching projects:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const handleProjectClick = useCallback(
    (projectId: number) => {
      setIsProjectModalOpen(true)
      setSelectedProjectId(projectId)
    },
    [setIsProjectModalOpen, setSelectedProjectId],
  )

  const handleCloseModal = useCallback(() => {
    setIsProjectModalOpen(false)
    setSelectedProjectId(null)
  }, [setIsProjectModalOpen, setSelectedProjectId])

  if (loading) return <div className="p-4">Cargando proyectos...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || null

  return (
    <div className="bg-black min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 p-6">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} onClick={() => handleProjectClick(project.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            isOpen={isProjectModalOpen}
            onClose={handleCloseModal}
            onViewProject={() => onViewProject(selectedProject.id)}
            onViewPlanes={onViewPlanes}
            onViewGallery={onViewGallery}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
