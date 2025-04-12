"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { useState, useCallback, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DownloadIcon, ImageIcon, RefreshCw } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchFloorData, fetchProjectStats } from "../../lib/proyectos"

const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>,
})

// Añadir la URL base de la API
const API_BASE_URL = "http://localhost:3001/api"

type Floor = {
  number: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  path: string
  x: number
  y: number
  id?: number
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

type ProjectModalProps = {
  project: Project
  isOpen: boolean
  onClose: () => void
  onViewProject: (projectId: number) => void
  onViewGallery: (projectId: number) => void
  onViewPlanes: (projectId: number, floorNumber?: number) => void
}

// Modificar la función getStatusColor para usar colores más distintivos
const getStatusColor = (status: "sold" | "available" | "reserved") => {
  switch (status) {
    case "sold":
      return "#fa4343" // Rojo para vendido
    case "available":
      return "#47fc47" // Verde para disponible
    case "reserved":
      return "#fafa4b" // Amarillo para reservado
    default:
      return "#CCCCCC" // Gris para otros casos
  }
}

const sampleUnitTypes: UnitType[] = [
  { type: "Local", size: "60-140 m²", priceRange: "$100,000 - $150,000", status: "Finalizados" },
  { type: "4 Ambientes", size: "150-250 m²", priceRange: "$160,000 - $300,000", status: "Listo para habitar" },
]

const sampleAmenities: Amenity[] = [
  { name: "Hall de acceso", description: "Importante hall de acceso" },
  { name: "Seguridad 24 Hs.", description: "Servicio de seguridad las 24 horas" },
  { name: "Cocheras cubiertas", description: "En 3 subsuelos, con acceso por rampa" },
  { name: "Salón de usos múltiples", description: "Con sus servicios en 1er subsuelo" },
  { name: "Gimnasio", description: "Con baños y vestuario en 1er subsuelo" },
  { name: "Piscina descubierta", description: "Con solárium, en terraza 10mo piso" },
  { name: "Rooftop", description: "En 10mo piso" },
  { name: "Laundry", description: "Servicio de lavandería" },
  { name: "Bike Parking", description: "Estacionamiento para bicicletas" },
  { name: "Local E-Commerce", description: "Espacio para comercio electrónico" },
]

const sampleFinancialOptions: FinancialOption[] = [
  { name: "Financiamiento directo", description: "Hasta 60 cuotas con tasa preferencial" },
  { name: "Hipoteca bancaria", description: "Acuerdos con principales bancos" },
]

const sampleParkingInfo =
  "Disponemos de 50 espacios de estacionamiento subterráneo. Costo adicional de $15,000 por unidad. Acceso con tarjeta magnética y vigilancia 24/7."

const samplePromotions =
  "10% de descuento en compras al contado. Financiamiento especial: 24 cuotas sin interés en unidades seleccionadas."

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

// Modificar la función ProjectModal para obtener datos de la API
export function ProjectModal({
  project,
  isOpen,
  onClose,
  onViewProject,
  onViewGallery,
  onViewPlanes,
}: ProjectModalProps) {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [currentFilter, setCurrentFilter] = useState<"all" | "available" | "reserved" | "sold">("all")
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "features" | "financial" | "location">("overview")
  const [floors, setFloors] = useState<Floor[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener los pisos y sus departamentos de manera optimizada
  const fetchFloors = useCallback(
    async (forceRefresh = false) => {
      if (!project.id) return

      setLoading(true)
      try {
        // Obtener los pisos del proyecto
        const floorsResponse = await fetch(`${API_BASE_URL}/floors/project/${project.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!floorsResponse.ok) {
          throw new Error(`Error al obtener pisos: ${floorsResponse.statusText}`)
        }

        const floorsData = await floorsResponse.json()

        // Para cada piso, obtener sus departamentos en paralelo
        const floorsPromises = floorsData.map(async (floor: any) => {
          // Obtener los departamentos del piso usando la función optimizada
          const floorData = await fetchFloorData(project.id, floor.floor_number, forceRefresh)

          if (!floorData) {
            return {
              number: floor.floor_number,
              availableUnits: 0,
              reservedUnits: 0,
              soldUnits: 0,
              path: "",
              x: 448,
              y: floor.floor_number <= 7 ? 680 - (floor.floor_number - 1) * 80 : floor.floor_number === 8 ? 125 : 55,
              id: floor.id,
            }
          }

          // Contar departamentos por estado
          let availableUnits = 0
          let reservedUnits = 0
          let soldUnits = 0

          Object.values(floorData.apartments).forEach((apt: any) => {
            if (apt.status === "libre") availableUnits++
            else if (apt.status === "reservado") reservedUnits++
            else if (apt.status === "ocupado") soldUnits++
          })

          return {
            number: floor.floor_number,
            availableUnits,
            reservedUnits,
            soldUnits,
            path: "", // No necesitamos el path para la visualización actual
            x: 448,
            y: floor.floor_number <= 7 ? 680 - (floor.floor_number - 1) * 80 : floor.floor_number === 8 ? 125 : 55,
            id: floor.id,
          }
        })

        // Esperar a que todas las promesas se resuelvan
        const floorsWithApartments = await Promise.all(floorsPromises)

        setFloors(floorsWithApartments)
        setError(null)
      } catch (err) {
        console.error("Error al obtener datos de pisos:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoading(false)
      }
    },
    [project.id],
  )

  // Función para refrescar los datos
  const refreshData = useCallback(async () => {
    if (!project.id) return

    setRefreshing(true)
    try {
      // Forzar actualización de la caché
      await fetchFloors(true)

      // Actualizar estadísticas del proyecto
      const stats = await fetchProjectStats(project.id, true)

      // Actualizar el proyecto con los datos calculados
      if (stats) {
        project.available_units = stats.available_units
        project.reserved_units = stats.reserved_units
        project.sold_units = stats.sold_units
        project.total_units = stats.total_units
      }
    } catch (err) {
      console.error("Error al refrescar datos:", err)
    } finally {
      setRefreshing(false)
    }
  }, [project, fetchFloors])

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && project.id) {
      fetchFloors()
    }
  }, [isOpen, project.id, fetchFloors])

  // Actualizar las estadísticas del proyecto cuando cambian los pisos
  useEffect(() => {
    if (floors.length > 0 && project.id) {
      // Calcular totales
      const available = floors.reduce((sum, floor) => sum + floor.availableUnits, 0)
      const reserved = floors.reduce((sum, floor) => sum + floor.reservedUnits, 0)
      const sold = floors.reduce((sum, floor) => sum + floor.soldUnits, 0)
      const total = available + reserved + sold

      // Actualizar el proyecto con los datos calculados
      project.available_units = available
      project.reserved_units = reserved
      project.sold_units = sold
      project.total_units = total
    }
  }, [floors, project])

  const handleBrochureClick = (brochurePath: string) => {
    window.open(brochurePath, "_blank")
  }

  // Usar los pisos obtenidos de la API o los de muestra como respaldo
  const floorsToDisplay = useMemo(() => (floors.length > 0 ? floors : []), [floors])

  const unitTypesToDisplay = project.unitTypes || sampleUnitTypes
  const amenitiesToDisplay = project.amenities || sampleAmenities
  const financialOptionsToDisplay = project.financialOptions || sampleFinancialOptions
  const parkingInfoToDisplay = project.parkingInfo || sampleParkingInfo
  const promotionsToDisplay = project.promotions || samplePromotions

  const handleFloorClick = (floorNumber: number) => {
    setSelectedFloor(floorNumber)
    onViewPlanes(project.id, floorNumber)
  }

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

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="w-full h-[100dvh] p-0 overflow-hidden flex flex-col sm:max-w-[90vw] sm:h-[90vh]">
            <motion.div className="flex flex-col h-full lg:flex-row">
              <div className="w-full h-1/3 sm:h-64 md:h-96 lg:w-1/2 lg:h-full relative">
                <Image
                  src={project.edificio || "/placeholder.svg"}
                  alt={project.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                />
                <svg
                  viewBox="0 0 1000 2400"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "all" }}
                >
                  <g transform="scale(2.4, 2.4) translate(-515, 135)">
                    <AnimatePresence>
                      {floorsToDisplay.map((floor) => {
                        const totalUnits = floor.availableUnits + floor.reservedUnits + floor.soldUnits
                        if (totalUnits === 0) return null // No mostrar pisos sin unidades

                        const floorWidth = 613 // Ancho total del piso
                        const soldWidth = totalUnits > 0 ? (floor.soldUnits / totalUnits) * floorWidth : 0
                        const reservedWidth = totalUnits > 0 ? (floor.reservedUnits / totalUnits) * floorWidth : 0
                        const availableWidth = floorWidth - soldWidth - reservedWidth

                        return (
                          <TooltipPrimitive.Provider key={floor.number}>
                            <TooltipPrimitive.Root delayDuration={0}>
                              <TooltipPrimitive.Trigger asChild>
                                <g onClick={() => handleFloorClick(floor.number)} style={{ cursor: "pointer" }}>
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
                                    x={floor.x - 28}
                                    y={floor.y + 30}
                                    fill="white"
                                    fontSize="14"
                                    fontWeight="bold"
                                    textAnchor="end"
                                  >
                                    Piso {floor.number}
                                  </text>
                                </g>
                              </TooltipPrimitive.Trigger>
                              <Tooltip>
                                {`Piso ${floor.number}: ${floor.availableUnits} disponibles, ${floor.reservedUnits} reservadas, ${floor.soldUnits} vendidas`}
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
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <span className="text-white text-xs">Vendido</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                    <span className="text-white text-xs">Reservado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                    <span className="text-white text-xs">Disponible</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={refreshData}
                    disabled={refreshing}
                    size="sm"
                    variant="outline"
                    className="bg-black bg-opacity-50 text-white border-white"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Actualizando..." : "Actualizar"}
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
                    <Select
                      onValueChange={(value: string) =>
                        setActiveTab(value as "overview" | "units" | "features" | "financial" | "location")
                      }
                      value={activeTab}
                    >
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
                  <Tabs
                    value={activeTab}
                    onValueChange={(value: string) =>
                      setActiveTab(value as "overview" | "units" | "features" | "financial" | "location")
                    }
                  >
                    <TabsList className="hidden sm:flex h-12 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground mb-4 overflow-x-auto whitespace-nowrap w-full">
                      <TabsTrigger
                        value="overview"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                      >
                        Resumen
                      </TabsTrigger>
                      <TabsTrigger
                        value="units"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                      >
                        Unidades
                      </TabsTrigger>
                      <TabsTrigger
                        value="features"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring f-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                      >
                        Características
                      </TabsTrigger>
                      <TabsTrigger
                        value="financial"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring f-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                      >
                        Financiamiento
                      </TabsTrigger>
                      <TabsTrigger
                        value="location"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring f-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                      >
                        Ubicación
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">Total de unidades: {project.total_units}</h4>
                          <Progress value={100} className="w-full" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades disponibles: {project.available_units}
                          </h4>
                          <Progress value={(project.available_units / project.total_units) * 100} className="w-full" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades reservadas: {project.reserved_units}
                          </h4>
                          <Progress value={(project.reserved_units / project.total_units) * 100} className="w-full" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">Unidades vendidas: {project.sold_units}</h4>
                          <Progress value={(project.sold_units / project.total_units) * 100} className="w-full" />
                        </div>
                        <div className="mt-6 bg-black text-white p-4 rounded-lg">
                          <h4 className="font-medium mb-4 text-base sm:text-lg text-white">Unidades por piso:</h4>
                          <div className="mb-4 flex flex-wrap gap-1 sm:gap-2">
                            <Button
                              variant={currentFilter === "all" ? "default" : "outline"}
                              onClick={() => handleFilterChange("all")}
                              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                            >
                              Todas
                            </Button>
                            <Button
                              variant={currentFilter === "available" ? "default" : "outline"}
                              onClick={() => handleFilterChange("available")}
                              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                            >
                              Disponibles
                            </Button>
                            <Button
                              variant={currentFilter === "reserved" ? "default" : "outline"}
                              onClick={() => handleFilterChange("reserved")}
                              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                            >
                              Reservadas
                            </Button>
                            <Button
                              variant={currentFilter === "sold" ? "default" : "outline"}
                              onClick={() => handleFilterChange("sold")}
                              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                            >
                              Vendidas
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-2">
                            {floorsToDisplay.map((floor) => (
                              <Button
                                key={floor.number}
                                variant="outline"
                                className="flex flex-col items-center justify-center p-4 w-full h-full text-s sm:text-sm"
                                onClick={() => onViewPlanes(project.id, floor.number)}
                              >
                                <span className="font-medium">Piso {floor.number}</span>
                                <span className="text-[10px] sm:text-xs font-semibold mt-2">
                                  {getFilteredUnits(floor)}{" "}
                                  {currentFilter === "all"
                                    ? "Total"
                                    : currentFilter === "available"
                                      ? "Libre"
                                      : currentFilter === "reserved"
                                        ? "Reservadas"
                                        : "Vendidas"}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="units" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Detalles de las Unidades</h4>
                        {unitTypesToDisplay.map((unit, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium">{unit.type}</h5>
                            <p className="text-sm">Tamaño: {unit.size}</p>
                            <p className="text-sm">Rango de precios: {unit.priceRange}</p>
                            <p className="text-sm">Estado: {unit.status}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="features" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Características del Edificio</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {amenitiesToDisplay.map((amenity, index) => (
                            <div key={index} className="bg-muted p-4 rounded-lg">
                              <h5 className="font-medium">{amenity.name}</h5>
                              <p className="text-sm">{amenity.description}</p>
                            </div>
                          ))}
                        </div>
                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <h5 className="font-medium">Estacionamiento</h5>
                          <p className="text-sm">{parkingInfoToDisplay}</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="financial" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Financiamiento</h4>
                        {financialOptionsToDisplay.map((option, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium">{option.name}</h5>
                            <p className="text-sm">{option.description}</p>
                          </div>
                        ))}
                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <h5 className="font-medium">Promociones y Descuentos</h5>
                          <p className="text-sm">{promotionsToDisplay}</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="location" className="mt-2">
                      <div className="space-y-6 mt-4">
                        <h4 className="font-medium text-xl">Ubicación del Proyecto</h4>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 rounded-lg shadow-md">
                            <h5 className="font-medium text-lg mb-3">Detalles de Ubicación</h5>
                            <ul className="space-y-2">
                              <li className="flex items-center space-x-2">
                                <span className="font-semibold">Link de ubicación:</span>
                                <input
                                  type="text"
                                  value="https://maps.app.goo.gl/1XqsNPMyqdYwzErn7"
                                  readOnly
                                  className="flex-grow bg-gray-900 px-2 py-1 rounded text-sm"
                                />
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText("https://maps.app.goo.gl/1XqsNPMyqdYwzErn7")
                                  }}
                                  className="px-2 py-1 text-xs"
                                >
                                  Copiar
                                </Button>
                              </li>
                              <li>
                                <span className="font-semibold">Código postal:</span> C1425
                              </li>
                            </ul>
                          </div>
                          <div className=" p-6 rounded-lg shadow-md">
                            <h5 className="font-medium text-lg mb-3">Comodidades</h5>
                            <p>
                              DOME Palermo Residence se encuentra ubicado en una importante esquina de Palermo, con
                              amplia conexión con medios de transporte y en el centro de un importante polo gastronómico
                              y recreativo de la ciudad.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 sm:p-4 bg-background border-t">
                  <Button onClick={() => onViewPlanes(project.id)} className="w-full py-2 sm:py-6 text-xs sm:text-base">
                    Ver planos
                  </Button>
                  <Button
                    onClick={() => handleBrochureClick(project.brochure)}
                    className="w-full py-2 sm:py-6 text-xs sm:text-base"
                  >
                    <DownloadIcon className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Descargar </span>
                    <span>brochure</span>
                  </Button>
                  <Button
                    onClick={() => onViewGallery(project.id)}
                    className="w-full py-2 sm:py-6 text-xs sm:text-base"
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
