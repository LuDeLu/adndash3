"use client"

import { useState, useCallback, memo } from "react"
import { Card } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import DomeProjectShowcase from "@/components/proyectos/lagos/dome-project-showcase"
import DomeSuitesProjectShowcase from "@/components/proyectos/suites/dome-suites-project-showcase"

type ProjectType = "lagos" | "suites" | "palermo"
type ViewMode = "cards" | "project"

type StaticProject = {
  id: string
  name: string
  image: string
  location: string
  type: ProjectType
}

const staticProjects: StaticProject[] = [
  {
    id: "suites",
    name: "DOME Suites & Residences",
    image: "https://adndevelopers.com.ar/wp-content/uploads/2025/06/suites-scaled.png",
    location: "Paraguay & Humboldt",
    type: "suites",
  },
  {
    id: "lagos",
    name: "DOME Puertos del Lago",
    image: "https://adndevelopers.com.ar/wp-content/uploads/2025/06/lagos-scaled.png",
    location: "Escobar, Buenos Aires",
    type: "lagos",
  },
  {
    id: "palermo",
    name: "DOME Palermo Residence",
    image: "https://adndash.vercel.app/images/logo/palermoresi.png",
    location: "Cabello & R. Arabe Siria",
    type: "palermo",
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

export default function DomePuertosPage() {
  const [currentView, setCurrentView] = useState<ViewMode>("cards")
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)

  const handleViewProject = (projectType: ProjectType) => {
    setSelectedProject(projectType)
    setCurrentView("project")
  }

  const handleBackToCards = () => {
    setCurrentView("cards")
    setSelectedProject(null)
  }

  const handleProjectClick = useCallback((project: StaticProject) => {
    handleViewProject(project.type)
  }, [])

  if (currentView === "project" && selectedProject === "lagos") {
    return <DomeProjectShowcase onBack={handleBackToCards} />
  }

  if (currentView === "project" && selectedProject === "suites") {
    return <DomeSuitesProjectShowcase onBack={handleBackToCards} />
  }

  if (currentView === "project" && selectedProject === "palermo") {
    // Por ahora redirige a lagos hasta que se implemente Palermo
    return <DomeProjectShowcase onBack={handleBackToCards} />
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <AnimatePresence>
          {staticProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} onClick={() => handleProjectClick(project)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
