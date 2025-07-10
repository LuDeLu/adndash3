"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DownloadIcon, ImageIcon, RefreshCw, Loader2 } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchFloorData, fetchProjectStats } from "../../lib/proyectos"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

type Floor = {
  id?: number
  number: number
  floor_number?: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  path: string
  x: number
  y: number
  total_apartments?: number
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
  amenities?: Amenity[]
  unit_types?: UnitType[]
  financial_options?: FinancialOption[]
  parking_config?: {
    info?: string
    promotions?: string
  }
  floors_config?: any
  building_config?: any
  map_config?: {
    embed_url?: string
    address?: string
    postal_code?: string
    details_link?: string
    amenities_description?: string
  }
  general_promotions?: string
}

type ProjectModalProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onViewProject: (projectId: number) => void
  onViewGallery: (projectId: number) => void
  onViewPlanes: (projectId: number, floorNumber?: number) => void
}

const getStatusColor = (status: "sold" | "available" | "reserved") => {
  switch (status) {
    case "sold":
      return "#fa4343"
    case "available":
      return "#47fc47"
    case "reserved":
      return "#fafa4b"
    default:
      return "#CCCCCC"
  }
}

const Tooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
))
Tooltip.displayName = TooltipPrimitive.Content.displayName

export function ProjectModal({
  project: initialProject,
  isOpen,
  onClose,
  onViewProject,
  onViewGallery,
  onViewPlanes,
}: ProjectModalProps) {
  const [project, setProject] = useState<Project | null>(initialProject)
  const [floors, setFloors] = useState<Floor[]>([])
  const [loadingProjectData, setLoadingProjectData] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<"all" | "available" | "reserved" | "sold">("all")
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "features" | "financial" | "location">("overview")
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjectDetails = useCallback(async (projectId: number, forceRefresh = false) => {
    if (!projectId) return
    setLoadingProjectData(true)
    setError(null)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No hay token de autenticación")
      }

      // 1. Obtener datos del proyecto
      const projectResponse = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!projectResponse.ok) {
        throw new Error(`Error al obtener proyecto: ${projectResponse.statusText}`)
      }

      const projectData: Project = await projectResponse.json()
      setProject(projectData)

      // 2. Obtener pisos del proyecto
      const floorsResponse = await fetch(`${API_BASE_URL}/projects/${projectId}/floors`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (floorsResponse.ok) {
        const floorsApiData = await floorsResponse.json()
        console.log("Floors data received:", floorsApiData)

        // Procesar datos de pisos
        const processedFloors: Floor[] = []

        for (const floorApi of floorsApiData) {
          try {
            // Obtener estadísticas específicas del piso
            const floorStats = await fetchFloorData(projectId, floorApi.floor_number, forceRefresh)

            // Buscar configuración del piso
            let floorConfig = null
            if (projectData.floors_config && Array.isArray(projectData.floors_config)) {
              floorConfig = projectData.floors_config.find((fc: any) => fc.floor_number === floorApi.floor_number)
            }

            // Coordenadas por defecto basadas en el número de piso
            const defaultX = 448
            const defaultY =
              floorApi.floor_number <= 7
                ? 680 - (floorApi.floor_number - 1) * 80
                : floorApi.floor_number === 8
                  ? 125
                  : 55

            const processedFloor: Floor = {
              id: floorApi.id,
              number: floorApi.floor_number,
              floor_number: floorApi.floor_number,
              availableUnits: floorStats?.availableUnits || floorApi.available_apartments || 0,
              reservedUnits: floorStats?.reservedUnits || floorApi.reserved_apartments || 0,
              soldUnits: floorStats?.soldUnits || floorApi.sold_apartments || 0,
              total_apartments: floorApi.total_apartments || 0,
              path: floorConfig?.svg_path || "",
              x: floorConfig?.coordinates?.x || defaultX,
              y: floorConfig?.coordinates?.y || defaultY,
            }

            processedFloors.push(processedFloor)
          } catch (err) {
            console.warn(`Error al obtener datos del piso ${floorApi.floor_number}:`, err)

            // Agregar piso con datos por defecto
            const defaultFloor: Floor = {
              id: floorApi.id,
              number: floorApi.floor_number,
              floor_number: floorApi.floor_number,
              availableUnits: floorApi.available_apartments || 0,
              reservedUnits: floorApi.reserved_apartments || 0,
              soldUnits: floorApi.sold_apartments || 0,
              total_apartments: floorApi.total_apartments || 0,
              path: "",
              x: 448,
              y:
                floorApi.floor_number <= 7
                  ? 680 - (floorApi.floor_number - 1) * 80
                  : floorApi.floor_number === 8
                    ? 125
                    : 55,
            }

            processedFloors.push(defaultFloor)
          }
        }

        // Ordenar pisos por número
        processedFloors.sort((a, b) => a.number - b.number)
        setFloors(processedFloors)

        console.log("Processed floors:", processedFloors)
      } else {
        console.warn("No se pudieron obtener los pisos del proyecto")
        setFloors([])
      }
    } catch (err) {
      console.error("Error al obtener datos del proyecto y pisos:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      setProject(null)
      setFloors([])
    } finally {
      setLoadingProjectData(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen && initialProject?.id) {
      fetchProjectDetails(initialProject.id)
    } else if (!isOpen) {
      setProject(null)
      setFloors([])
      setError(null)
      setActiveTab("overview")
      setCurrentFilter("all")
    }
  }, [isOpen, initialProject, fetchProjectDetails])

  const refreshData = useCallback(async () => {
    if (!project?.id) return
    setRefreshing(true)
    await fetchProjectDetails(project.id, true)

    const stats = await fetchProjectStats(project.id, true)
    if (stats && project) {
      setProject((prev) =>
        prev
          ? {
              ...prev,
              available_units: stats.available_units,
              reserved_units: stats.reserved_units,
              sold_units: stats.sold_units,
              total_units: stats.total_units,
            }
          : null,
      )
    }
    setRefreshing(false)
  }, [project, fetchProjectDetails])

  const handleBrochureClick = () => {
    if (project?.brochure) {
      const url = project.brochure.startsWith("http") ? project.brochure : `${API_BASE_URL}${project.brochure}`
      window.open(url, "_blank")
    }
  }

  const unitTypesToDisplay = project?.unit_types || []
  const amenitiesToDisplay = project?.amenities || []
  const financialOptionsToDisplay = project?.financial_options || []
  const parkingInfoToDisplay = project?.parking_config?.info || "Información de estacionamiento no disponible."
  const promotionsToDisplay =
    project?.general_promotions || project?.parking_config?.promotions || "No hay promociones disponibles."
  const mapConfig = project?.map_config

  const handleFilterChange = useCallback((filter: "all" | "available" | "reserved" | "sold") => {
    setCurrentFilter(filter)
  }, [])

  const getFilteredUnits = useCallback(
    (floor: Floor) => {
      switch (currentFilter) {
        case "available":
          return floor.availableUnits
        case "reserved":
          return floor.reservedUnits
        case "sold":
          return floor.soldUnits
        default:
          return floor.availableUnits + floor.reservedUnits + floor.soldUnits
      }
    },
    [currentFilter],
  )

  if (!isOpen) return null

  if (loadingProjectData && !project) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full h-[100dvh] p-0 overflow-hidden flex flex-col sm:max-w-[90vw] sm:h-[90vh] items-center justify-center">
          <DialogTitle className="sr-only">Cargando proyecto</DialogTitle>
          <DialogDescription className="sr-only">Cargando datos del proyecto</DialogDescription>
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Cargando datos del proyecto...</p>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full h-[100dvh] p-0 overflow-hidden flex flex-col sm:max-w-[90vw] sm:h-[90vh] items-center justify-center">
          <DialogTitle className="sr-only">Error</DialogTitle>
          <DialogDescription className="sr-only">Error al cargar el proyecto</DialogDescription>
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={onClose} className="mt-4">
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  if (!project) return null

  const totalUnits = project.total_units || project.available_units + project.reserved_units + project.sold_units || 1

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="w-full h-[100dvh] p-0 overflow-hidden flex flex-col sm:max-w-[90vw] sm:h-[90vh]">
            <DialogTitle className="sr-only">{project.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Detalles del proyecto {project.name} ubicado en {project.location}
            </DialogDescription>
            <motion.div className="flex flex-col h-full lg:flex-row">
              <div className="w-full h-1/3 sm:h-64 md:h-96 lg:w-1/2 lg:h-full relative">
                <Image
                  src={project.edificio || "/placeholder.svg?width=800&height=1200&query=modern+building+facade"}
                  alt={project.name || "Edificio del proyecto"}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <svg
                  viewBox={project.building_config?.viewBox || "0 0 1000 2400"}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "all" }}
                >
                  <g transform={project.building_config?.transform || "scale(2.4, 2.4) translate(-515, 135)"}>
                    <AnimatePresence>
                      {floors.map((floor) => {
                        const floorTotalUnits = floor.availableUnits + floor.reservedUnits + floor.soldUnits
                        if (floorTotalUnits === 0 && !project.building_config?.show_empty_floors) return null

                        const floorWidth = project.building_config?.floor_width || 613
                        const soldWidth = floorTotalUnits > 0 ? (floor.soldUnits / floorTotalUnits) * floorWidth : 0
                        const reservedWidth =
                          floorTotalUnits > 0 ? (floor.reservedUnits / floorTotalUnits) * floorWidth : 0
                        const availableWidth = Math.max(0, floorWidth - soldWidth - reservedWidth)

                        return (
                          <TooltipPrimitive.Provider key={floor.number}>
                            <TooltipPrimitive.Root delayDuration={0}>
                              <TooltipPrimitive.Trigger asChild>
                                <g onClick={() => onViewPlanes(project.id, floor.number)} style={{ cursor: "pointer" }}>
                                  <motion.rect
                                    x={floor.x}
                                    y={floor.y}
                                    width={soldWidth}
                                    height="46"
                                    fill={getStatusColor("sold")}
                                    stroke="white"
                                    strokeWidth="1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <motion.rect
                                    x={floor.x + soldWidth}
                                    y={floor.y}
                                    width={reservedWidth}
                                    height="46"
                                    fill={getStatusColor("reserved")}
                                    stroke="white"
                                    strokeWidth="1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <motion.rect
                                    x={floor.x + soldWidth + reservedWidth}
                                    y={floor.y}
                                    width={availableWidth}
                                    height="46"
                                    fill={getStatusColor("available")}
                                    stroke="white"
                                    strokeWidth="1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  <text
                                    x={floor.x - (project.building_config?.floor_label_offset_x || 28)}
                                    y={floor.y + (project.building_config?.floor_label_offset_y || 30)}
                                    fill={project.building_config?.floor_label_color || "white"}
                                    fontSize={project.building_config?.floor_label_fontsize || "14"}
                                    fontWeight="bold"
                                    textAnchor="end"
                                  >
                                    Piso {floor.number}
                                  </text>
                                </g>
                              </TooltipPrimitive.Trigger>
                              <Tooltip>
                                {`Piso ${floor.number}: ${floor.availableUnits} disp, ${floor.reservedUnits} res, ${floor.soldUnits} vend`}
                              </Tooltip>
                            </TooltipPrimitive.Root>
                          </TooltipPrimitive.Provider>
                        )
                      })}
                    </AnimatePresence>
                  </g>
                </svg>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4" style={{ backgroundColor: getStatusColor("sold") }} />
                    <span className="ml-2 text-white text-xs sm:text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4" style={{ backgroundColor: getStatusColor("reserved") }} />
                    <span className="ml-2 text-white text-xs sm:text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4" style={{ backgroundColor: getStatusColor("available") }} />
                    <span className="ml-2 text-white text-xs sm:text-sm">Disponible</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={refreshData}
                    disabled={refreshing || loadingProjectData}
                    size="sm"
                    variant="outline"
                    className="bg-black bg-opacity-50 text-white border-white hover:bg-opacity-75"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing || loadingProjectData ? "animate-spin" : ""}`} />
                    {refreshing || loadingProjectData ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4 sm:p-6">
                  <DialogHeader className="space-y-2 pb-4">
                    <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">{project.name}</DialogTitle>
                    <p className="text-sm sm:text-base text-muted-foreground">{project.location}</p>
                  </DialogHeader>
                  <div className="block sm:hidden mb-4">
                    <Select onValueChange={(value) => setActiveTab(value as any)} value={activeTab}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar vista" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Resumen</SelectItem>
                        <SelectItem value="units">Unidades</SelectItem>
                        <SelectItem value="features">Características</SelectItem>
                        <SelectItem value="financial">Financiamiento</SelectItem>
                        <SelectItem value="location">Ubicación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
                    <TabsList className="hidden sm:grid w-full grid-cols-5 h-12 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground mb-4 whitespace-nowrap">
                      {["Resumen", "Unidades", "Características", "Financiamiento", "Ubicación"].map((tabName, idx) => {
                        const tabValue = ["overview", "units", "features", "financial", "location"][idx]
                        return (
                          <TabsTrigger
                            key={tabValue}
                            value={tabValue}
                            className="text-xs px-2 sm:text-sm sm:px-3 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                          >
                            {tabName}
                          </TabsTrigger>
                        )
                      })}
                    </TabsList>
                    <TabsContent value="overview" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Total de unidades: {project.total_units || 0}
                          </h4>
                          <Progress value={100} className="w-full" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades disponibles: {project.available_units || 0}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? ((project.available_units || 0) / totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades reservadas: {project.reserved_units || 0}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? ((project.reserved_units || 0) / totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades vendidas: {project.sold_units || 0}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? ((project.sold_units || 0) / totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>
                        <div className="mt-6 bg-card p-4 rounded-lg border">
                          <h4 className="font-medium mb-4 text-base sm:text-lg">Unidades por piso:</h4>
                          <div className="mb-4 flex flex-wrap gap-1 sm:gap-2">
                            {["all", "available", "reserved", "sold"].map((filterType) => (
                              <Button
                                key={filterType}
                                variant={currentFilter === filterType ? "default" : "outline"}
                                onClick={() => handleFilterChange(filterType as any)}
                                className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                              >
                                {filterType === "all"
                                  ? "Todas"
                                  : filterType === "available"
                                    ? "Disponibles"
                                    : filterType === "reserved"
                                      ? "Reservadas"
                                      : "Vendidas"}
                              </Button>
                            ))}
                          </div>
                          {floors.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1 sm:gap-2">
                              {floors.map((floor) => (
                                <Button
                                  key={floor.number}
                                  variant="outline"
                                  className="flex flex-col items-center justify-center p-2 sm:p-4 w-full h-full text-xs sm:text-sm bg-transparent"
                                  onClick={() => onViewPlanes(project.id, floor.number)}
                                >
                                  <span className="font-medium">Piso {floor.number}</span>
                                  <span className="text-[10px] sm:text-xs font-semibold mt-1 sm:mt-2">
                                    {getFilteredUnits(floor)}{" "}
                                    {currentFilter === "all"
                                      ? "Total"
                                      : currentFilter === "available"
                                        ? "Libre"
                                        : currentFilter === "reserved"
                                          ? "Reserv."
                                          : "Vend."}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground text-sm">No hay información de pisos disponible.</p>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="units" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Detalles de las Unidades</h4>
                        {unitTypesToDisplay.length > 0 ? (
                          unitTypesToDisplay.map((unit, index) => (
                            <div key={index} className="bg-muted p-4 rounded-lg">
                              <h5 className="font-medium">{unit.type}</h5>
                              <p className="text-sm text-muted-foreground">Tamaño: {unit.size}</p>
                              <p className="text-sm text-muted-foreground">Rango de precios: {unit.priceRange}</p>
                              <p className="text-sm text-muted-foreground">Estado: {unit.status}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No hay tipos de unidades definidos.</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="features" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Características del Edificio</h4>
                        {amenitiesToDisplay.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {amenitiesToDisplay.map((amenity, index) => (
                              <div key={index} className="bg-muted p-4 rounded-lg">
                                <h5 className="font-medium">{amenity.name}</h5>
                                <p className="text-sm text-muted-foreground">{amenity.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No hay características definidas.</p>
                        )}
                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <h5 className="font-medium">Estacionamiento</h5>
                          <p className="text-sm text-muted-foreground">{parkingInfoToDisplay}</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="financial" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Financiamiento</h4>
                        {financialOptionsToDisplay.length > 0 ? (
                          financialOptionsToDisplay.map((option, index) => (
                            <div key={index} className="bg-muted p-4 rounded-lg">
                              <h5 className="font-medium">{option.name}</h5>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">No hay opciones de financiamiento definidas.</p>
                        )}
                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <h5 className="font-medium">Promociones y Descuentos</h5>
                          <p className="text-sm text-muted-foreground">{promotionsToDisplay}</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="location" className="mt-2">
                      <div className="space-y-6 mt-4">
                        <h4 className="font-medium text-xl">Ubicación del Proyecto</h4>
                        {mapConfig?.embed_url ? (
                          <div className="bg-muted rounded-lg overflow-hidden shadow-md aspect-video">
                            <iframe
                              src={mapConfig.embed_url}
                              width="100%"
                              height="100%"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                            <iframe
                              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.955759537342!2d-58.415668523393144!3d-34.57998595624697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb579134f34b3%3A0x6d06db0893f18a5b!2sRep%C3%BAblica%20%C3%81rabe%20Siria%20%26%20Cabello%2C%20C1425%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1733140225777!5m2!1ses!2sar"
                              width="100%"
                              height="400"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-muted p-6 rounded-lg shadow-md">
                            <h5 className="font-medium text-lg mb-3">Detalles de Ubicación</h5>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {mapConfig?.address && (
                                <li>
                                  <span className="font-semibold text-foreground">Dirección:</span> {mapConfig.address}
                                </li>
                              )}
                              {mapConfig?.postal_code && (
                                <li>
                                  <span className="font-semibold text-foreground">Código postal:</span>{" "}
                                  {mapConfig.postal_code}
                                </li>
                              )}
                              {mapConfig?.details_link && (
                                <li className="flex items-center space-x-2">
                                  <span className="font-semibold text-foreground">Link de ubicación:</span>
                                  <input
                                    type="text"
                                    value={mapConfig.details_link}
                                    readOnly
                                    className="flex-grow bg-background px-2 py-1 rounded text-xs border"
                                  />
                                  <Button
                                    onClick={() => navigator.clipboard.writeText(mapConfig.details_link!)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    Copiar
                                  </Button>
                                </li>
                              )}
                            </ul>
                          </div>
                          {mapConfig?.amenities_description && (
                            <div className="bg-muted p-6 rounded-lg shadow-md">
                              <h5 className="font-medium text-lg mb-3">Comodidades Cercanas</h5>
                              <p className="text-sm text-muted-foreground">{mapConfig.amenities_description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 sm:p-4 bg-background border-t">
                  <Button onClick={() => onViewPlanes(project.id)} className="w-full py-3 sm:py-6 text-xs sm:text-base">
                    Ver planos
                  </Button>
                  <Button
                    onClick={handleBrochureClick}
                    disabled={!project.brochure}
                    className="w-full py-3 sm:py-6 text-xs sm:text-base"
                  >
                    <DownloadIcon className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Descargar </span>
                    <span>brochure</span>
                  </Button>
                  <Button
                    onClick={() => onViewGallery(project.id)}
                    className="w-full py-3 sm:py-6 text-xs sm:text-base"
                  >
                    <ImageIcon className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Ver </span>
                    <span>multimedia</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
