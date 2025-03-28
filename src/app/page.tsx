"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useAuth } from "@/app/auth/auth-context"
import Login from "@/components/usuarios/login"
import { Navigation } from "@/components/Navigation"
import { Adn } from "@/components/proyectos/proyectos"
import { Clientes } from "@/components/administrativo/clientes"
import Dashboard from "@/components/estadisticas/estadisticas"
import Calendario from "@/components/administrativo/calendario"
import InteractiveFloorPlan from "@/components/proyectos/vista-proyecto"
import { MediaGalleryComponent } from "@/components/proyectos/galeria"
import { SettingsDashboardComponent } from "@/components/usuarios/configuracion"
import DocumentManagement from "@/components/administrativo/documentos"
import SeguimientoProyectosConstruccionComponent from "@/components/obras/obras"
import UserManagement from "@/components/config/roles"
import { AddProject } from "@/components/config/añadir-proyecto"
import PostVentaGestion from "@/components/postventa/PostVentaGestion"
import UserMenu from "@/components/UserMenu"
import { ApprovalForm } from "@/components/checklist/approval-form" // Importar el componente de aprobaciones

// Importación dinámica del componente MapaInteractivo
const MapaInteractivo = dynamic(() => import("@/components/mapa/MapaInteractivo"), { ssr: false })

export default function Home() {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState("proyectos")
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  const handleViewProject = (projectId: number) => {
    setSelectedProjectId(projectId)
    setActiveSection("proyectos/vista")
    setIsProjectModalOpen(false)
  }

  const handleViewGallery = (projectId: number) => {
    setSelectedProjectId(projectId)
    setActiveSection("galeria")
  }

  const handleViewPlanes = (projectId: number, floorNumber?: number) => {
    setSelectedProjectId(projectId)
    setSelectedFloorNumber(floorNumber || null)
    setActiveSection("proyectos/vista")
  }

  const handleReturnToProjectModal = () => {
    setActiveSection("proyectos")
    setIsProjectModalOpen(true)
  }

  useEffect(() => {
    const checkSession = () => {
      const expirationTime = localStorage.getItem("sessionExpiration")
      if (expirationTime && new Date().getTime() > Number.parseInt(expirationTime, 10)) {
        logout()
      }
    }

    const interval = setInterval(checkSession, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [logout])

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex h-screen bg-black">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto p-6 bg-black text-white">
        {/* Añadimos el UserMenu en la parte superior derecha */}
        <div className="flex justify-end mb-4">
          <UserMenu />
        </div>
        {activeSection === "proyectos" && (
          <Adn
            onViewProject={handleViewProject}
            onViewGallery={handleViewGallery}
            onViewPlanes={handleViewPlanes}
            isProjectModalOpen={isProjectModalOpen}
            setIsProjectModalOpen={setIsProjectModalOpen}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
          />
        )}
        {activeSection === "proyectos/vista" && (
          <InteractiveFloorPlan
            projectId={selectedProjectId!}
            floorNumber={selectedFloorNumber}
            onReturnToProjectModal={handleReturnToProjectModal}
          />
        )}
        {activeSection === "calendario" && <Calendario />}
        {activeSection === "clientes" && <Clientes />}
        {activeSection === "estadisticas" && <Dashboard />}
        {activeSection === "archivos" && <DocumentManagement />}
        {activeSection === "obras" && <SeguimientoProyectosConstruccionComponent />}
        {activeSection === "galeria" && (
          <MediaGalleryComponent projectId={selectedProjectId!} setActiveSection={setActiveSection} />
        )}
        {activeSection === "ajustes" && <SettingsDashboardComponent />}
        {activeSection === "usermanagement" && <UserManagement />}
        {activeSection === "añadirproyecto" && <AddProject />}
        {activeSection === "mapa" && <MapaInteractivo />}
        {activeSection === "postventas" && <PostVentaGestion />}
        {activeSection === "aprobaciones" && <ApprovalForm />} {/* Añadir el componente de aprobaciones */}
        <SpeedInsights />
      </main>
    </div>
  )
}

