'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { useAuth } from '@/app/auth/auth-context'
import Login from '@/components/usuarios/login'
import { Navigation } from '@/components/Navigation'
import { Adn } from "@/components/proyectos/proyectos"
import { Clientes } from "@/components/administrativo/clientes"
import Dashboard from "@/components/estadisticas/estadisticas"
import Calendario from '@/components/administrativo/calendario'
import InteractiveFloorPlan from '@/components/proyectos/vista-proyecto'
import { MediaGalleryComponent } from '@/components/proyectos/galeria'
import { SettingsDashboardComponent } from '@/components/usuarios/configuracion'
import DocumentManagement from "@/components/administrativo/documentos"
import { SeguimientoProyectosConstruccionComponent } from '@/components/administrativo/obras'
import UserManagement from '@/components/config/roles'
import { AddProject } from '@/components/config/añadir-proyecto'

// Importación dinámica del componente MapaInteractivo
const MapaInteractivo = dynamic(
  () => import('@/components/mapa/MapaInteractivo'),
  { ssr: false }
)

export default function Home() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('proyectos')
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number | null>(null)

  const handleViewProject = (projectId: number) => {
    setSelectedProjectId(projectId)
    setActiveSection('proyectos/vista')
  }

  const handleViewGallery = (projectId: number) => {
    setSelectedProjectId(projectId)
    setActiveSection('galeria')
  }

  const handleViewPlanes = (projectId: number, floorNumber?: number) => {
    setSelectedProjectId(projectId)
    setSelectedFloorNumber(floorNumber || null)
    setActiveSection('proyectos/vista')
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex h-screen">
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto p-6">
        {activeSection === 'proyectos' && (
          <Adn 
            onViewProject={handleViewProject} 
            onViewGallery={handleViewGallery}
            onViewPlanes={handleViewPlanes}
          />
        )}
        {activeSection === 'proyectos/vista' && (
          <InteractiveFloorPlan 
            projectId={selectedProjectId!} 
            floorNumber={selectedFloorNumber}
          />
        )}
        {activeSection === 'calendario' && <Calendario />}
        {activeSection === 'clientes' && <Clientes />}
        {activeSection === 'estadisticas' && <Dashboard />}
        {activeSection === 'archivos' && <DocumentManagement />}
        {activeSection === 'obras' && <SeguimientoProyectosConstruccionComponent />}
        {activeSection === 'galeria' && (
          <MediaGalleryComponent 
            projectId={selectedProjectId!}
            setActiveSection={setActiveSection}
          />
        )}
        {activeSection === 'ajustes' && <SettingsDashboardComponent />}
        {activeSection === 'usermanagement' && <UserManagement />}
        {activeSection === 'añadirproyecto' && <AddProject />}
        {activeSection === 'mapa' && <MapaInteractivo />}

        <SpeedInsights />
      </main>
    </div>
  )
}

