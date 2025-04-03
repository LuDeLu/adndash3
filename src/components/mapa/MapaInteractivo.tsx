'use client'

import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProjectModal } from "@/components/proyectos/project-modal"
import InteractiveFloorPlan from '@/components/proyectos/vista-proyecto'
import { MediaGalleryComponent } from '@/components/proyectos/galeria'
import { Button } from "@/components/ui/button"
import { ChevronLeft, MapPin } from 'lucide-react'

// Corrige el problema de los iconos que no se cargan en Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

type Floor = {
  number: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  path: string
  x: number
  y: number
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

const locationCoordinates: { [key: string]: [number, number] } = {
  'Cabello & Lafinur': [-34.5825, -58.4333],
  'Paraguay & Humboldt': [-34.5895, -58.4385],
  'Libertador & Ombú': [-34.5755, -58.4222]
}

const API_BASE_URL = 'https://adndash.squareweb.app/api'

export default function MapaInteractivo() {
  const [isMounted, setIsMounted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [view, setView] = useState<'map' | 'floorPlan' | 'gallery'>('map')
  const [selectedFloorNumber, setSelectedFloorNumber] = useState<number | null>(null)

  useEffect(() => {
    setIsMounted(true)
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      console.error('Error fetching projects:', err)
    }
  }

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null)
  }, [])

  const handleViewProject = useCallback((projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setView('floorPlan')
      setSelectedFloorNumber(null)
    }
  }, [projects])

  const handleViewPlanes = useCallback((projectId: number, floorNumber?: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setView('floorPlan')
      setSelectedFloorNumber(floorNumber || null)
    }
  }, [projects])

  const handleViewGallery = useCallback((projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setView('gallery')
    }
  }, [projects])

  const handleBackToMap = useCallback(() => {
    setView('map')
    setSelectedProject(null)
    setSelectedFloorNumber(null)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br  text-white">
      {view === 'map' && (
        <>
          <Card className="m-4  backdrop-blur-lg ">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-100">Mapa de Proyectos</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[60vh]">
              <MapContainer 
                center={[-34.5825, -58.4333]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                className="rounded-lg overflow-hidden"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {projects.map((project) => {
                  const coordinates = locationCoordinates[project.location]
                  if (coordinates) {
                    return (
                      <Marker 
                        key={project.id} 
                        position={coordinates}
                        eventHandlers={{
                          click: () => handleProjectClick(project),
                        }}
                      >
                        <Popup>{project.name}</Popup>
                      </Marker>
                    )
                  }
                  return null
                })}
              </MapContainer>
            </CardContent>
          </Card>
          <Card className="m-4 mt-2 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-100">Proyectos Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[25vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => (
                    <Card 
                      key={project.id} 
                      className="hover:bg-gray-700/50 transition-all duration-300 ease-in-out transform hover:scale-105 bg-gray-800/30 border-gray-700 cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold text-gray-100">{project.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-300 flex items-center">
                          <MapPin size={14} className="mr-1" /> {project.location}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              isOpen={!!selectedProject}
              onClose={handleCloseModal}
              onViewProject={handleViewProject}
              onViewPlanes={handleViewPlanes}
              onViewGallery={handleViewGallery}
            />
          )}
        </>
      )}
      {(view === 'floorPlan' || view === 'gallery') && (
        <div className="m-4">
          <Button 
            onClick={handleBackToMap}
            className="mb-4 text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4 text-black" />  <span className='text-black'>Volver al Mapa</span>
          </Button>
          {view === 'floorPlan' && selectedProject && (
            <InteractiveFloorPlan 
              projectId={selectedProject.id}
              floorNumber={selectedFloorNumber}
              onReturnToProjectModal={handleBackToMap}
            />
          )}
          {view === 'gallery' && selectedProject && (
            <MediaGalleryComponent 
              projectId={selectedProject.id}
              setActiveSection={handleBackToMap}
            />
          )}
        </div>
      )}
    </div>
  )
}

