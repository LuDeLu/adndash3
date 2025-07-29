"use client"
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
import { apartProjectInfo, getApartProjectStats, apartUnits } from "@/lib/dome-apart-data"
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

interface ApartProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onViewProject: () => void
  onViewGallery: () => void
  onViewPlanes: (floorNumber?: number) => void
}

type Floor = {
  id?: number
  number: number
  floor_number?: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  blockedUnits: number
  path: string
  x: number
  y: number
  total_apartments?: number
}

const getStatusColor = (status: "sold" | "available" | "reserved" | "blocked") => {
  switch (status) {
    case "sold":
      return "#fa4343"
    case "available":
      return "#47fc47"
    case "reserved":
      return "#fafa4b"
    case "blocked":
      return "#3b82f6"
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

export function ApartProjectModal({
  isOpen,
  onClose,
  onViewProject,
  onViewGallery,
  onViewPlanes,
}: ApartProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "features" | "financial" | "location">("overview")
  const [refreshing, setRefreshing] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<"all" | "available" | "reserved" | "sold" | "blocked">("all")
  const [floors, setFloors] = useState<Floor[]>([])
  const [loadingProjectData, setLoadingProjectData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const projectData = apartProjectInfo

  // Configuración específica del edificio Apart
  const buildingConfig = {
    viewBox: "-10 125 1250 1300",
    transform: "scale(1, 1.7)",
    floor_width: 505,
    show_empty_floors: true,
    floor_label_offset_x: 28,
    floor_label_offset_y: 30,
    floor_label_color: "white",
    floor_label_fontsize: "14",
  }

  // Crear datos de pisos con configuración específica para Apart
  const initializeFloors = useCallback(() => {
    const floorsData: Floor[] = Array.from({ length: 9 }, (_, index) => {
      const floorNumber = index + 1
      const floorUnits = apartUnits.filter((unit) => unit.floor === floorNumber)
      const floorStats = floorUnits.reduce(
        (acc, unit) => {
          if (unit.status === "DISPONIBLE") acc.available++
          else if (unit.status === "RESERVADO") acc.reserved++
          else if (unit.status === "VENDIDO") acc.sold++
          else if (unit.status === "BLOQUEADO") acc.blocked++
          return acc
        },
        { available: 0, reserved: 0, sold: 0, blocked: 0 },
      )

      return {
        id: floorNumber,
        number: floorNumber,
        floor_number: floorNumber,
        availableUnits: floorStats.available,
        reservedUnits: floorStats.reserved,
        soldUnits: floorStats.sold,
        blockedUnits: floorStats.blocked,
        path: "",
        x: 448,
        y: 680 - (floorNumber - 1) * 50,
        total_apartments: floorUnits.length,
      }
    })
    setFloors(floorsData)
  }, [])

  // Función para obtener datos del proyecto
  const fetchProjectDetails = useCallback(
    async (forceRefresh = false) => {
      setLoadingProjectData(true)
      setError(null)

      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        initializeFloors()
      } catch (err) {
        console.error("Error al obtener datos del proyecto:", err)
        setError(err instanceof Error ? err.message : "Error desconocido")
      } finally {
        setLoadingProjectData(false)
      }
    },
    [initializeFloors],
  )

  useEffect(() => {
    if (isOpen) {
      fetchProjectDetails()
    } else {
      setFloors([])
      setError(null)
      setActiveTab("overview")
      setCurrentFilter("all")
    }
  }, [isOpen, fetchProjectDetails])

  const refreshData = useCallback(async () => {
    setRefreshing(true)
    await fetchProjectDetails(true)
    setRefreshing(false)
  }, [fetchProjectDetails])

  const handleBrochureClick = () => {
    if (projectData.brochure) {
      window.open(projectData.brochure, "_blank")
    }
  }

  const handleFilterChange = useCallback((filter: "all" | "available" | "reserved" | "sold" | "blocked") => {
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
        case "blocked":
          return floor.blockedUnits
        default:
          return floor.availableUnits + floor.reservedUnits + floor.soldUnits + floor.blockedUnits
      }
    },
    [currentFilter],
  )

  const stats = getApartProjectStats()

  const handleFloorClick = (floorNumber: number) => {
    console.log("Floor clicked:", floorNumber)
    onViewPlanes(floorNumber)
  }

  if (!isOpen) return null

  if (loadingProjectData && floors.length === 0) {
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

  const totalUnits =
    stats.totalUnits || stats.availableUnits + stats.reservedUnits + stats.soldUnits + stats.blockedUnits || 1

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="w-full h-[100dvh] p-0 overflow-hidden flex flex-col sm:max-w-[90vw] sm:h-[90vh]">
            <DialogTitle className="sr-only">{projectData.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Detalles del proyecto {projectData.name} ubicado en {projectData.location}
            </DialogDescription>
            <motion.div className="flex flex-col h-full lg:flex-row">
              {/* Imagen del edificio con overlay de pisos */}
              <div className="w-full h-1/3 sm:h-64 md:h-96 lg:w-1/2 lg:h-full relative">
                <Image
                  src={projectData.image || "(/placeholder.svg?width=800&height=1200&query=modern+building+facade)"}
                  alt={projectData.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* SVG Overlay para pisos con configuración específica */}
                <svg
                  viewBox={buildingConfig.viewBox}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "all" }}
                >
                  <g transform={buildingConfig.transform}>
                    <AnimatePresence>
                      {floors.map((floor) => {
                        const floorTotalUnits =
                          floor.availableUnits + floor.reservedUnits + floor.soldUnits + floor.blockedUnits
                        if (floorTotalUnits === 0 && !buildingConfig.show_empty_floors) return null

                        const floorWidth = buildingConfig.floor_width
                        const soldWidth = floorTotalUnits > 0 ? (floor.soldUnits / floorTotalUnits) * floorWidth : 0
                        const reservedWidth =
                          floorTotalUnits > 0 ? (floor.reservedUnits / floorTotalUnits) * floorWidth : 0
                        const blockedWidth =
                          floorTotalUnits > 0 ? (floor.blockedUnits / floorTotalUnits) * floorWidth : 0
                        const availableWidth = Math.max(0, floorWidth - soldWidth - reservedWidth - blockedWidth)

                        return (
                          <TooltipPrimitive.Provider key={floor.number}>
                            <TooltipPrimitive.Root delayDuration={0}>
                              <TooltipPrimitive.Trigger asChild>
                                <g onClick={() => handleFloorClick(floor.number)} style={{ cursor: "pointer" }}>
                                  {/* Rectángulo vendido */}
                                  <motion.rect
                                    x={floor.x}
                                    y={floor.y}
                                    width={soldWidth}
                                    height="30"
                                    fill={getStatusColor("sold")}
                                    stroke="white"
                                    strokeWidth="1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  {/* Rectángulo reservado */}
                                  <motion.rect
                                    x={floor.x + soldWidth}
                                    y={floor.y}
                                    width={reservedWidth}
                                    height="30"
                                    fill={getStatusColor("reserved")}
                                    stroke="white"
                                    strokeWidth="1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  {/* Rectángulo bloqueado */}
                                  <motion.rect
                                    x={floor.x + soldWidth + reservedWidth}
                                    y={floor.y}
                                    width={blockedWidth}
                                    height="30"
                                    fill={getStatusColor("blocked")}
                                    stroke="white"
                                    strokeWidth="1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  {/* Rectángulo disponible */}
                                  <motion.rect
                                    x={floor.x + soldWidth + reservedWidth + blockedWidth}
                                    y={floor.y}
                                    width={availableWidth}
                                    height="30"
                                    fill={getStatusColor("available")}
                                    stroke="white"
                                    strokeWidth="1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.8 }}
                                    exit={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                  />
                                  {/* Etiqueta del piso */}
                                  <text
                                    x={floor.x - buildingConfig.floor_label_offset_x}
                                    y={floor.y + buildingConfig.floor_label_offset_y}
                                    fill={buildingConfig.floor_label_color}
                                    fontSize={buildingConfig.floor_label_fontsize}
                                    fontWeight="bold"
                                    textAnchor="end"
                                  >
                                    Piso {floor.number}
                                  </text>
                                </g>
                              </TooltipPrimitive.Trigger>
                              <Tooltip>
                                {`Piso ${floor.number}: ${floor.availableUnits} disp, ${floor.reservedUnits} res, ${floor.soldUnits} vend, ${floor.blockedUnits} bloq`}
                              </Tooltip>
                            </TooltipPrimitive.Root>
                          </TooltipPrimitive.Provider>
                        )
                      })}
                    </AnimatePresence>
                  </g>
                </svg>

                {/* Leyenda de estados */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4" style={{ backgroundColor: getStatusColor("sold") }} />
                    <span className="ml-2 text-white text-xs sm:text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4" style={{ backgroundColor: getStatusColor("reserved") }} />
                    <span className="ml-2 text-white text-xs sm:text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4" style={{ backgroundColor: getStatusColor("blocked") }} />
                    <span className="ml-2 text-white text-xs sm:text-sm">Bloqueado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4" style={{ backgroundColor: getStatusColor("available") }} />
                    <span className="ml-2 text-white text-xs sm:text-sm">Disponible</span>
                  </div>
                </div>

                {/* Botón de actualizar */}
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

              {/* Contenido del modal */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4 sm:p-6">
                  <DialogHeader className="space-y-2 pb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={projectData.logo || "/placeholder.svg"}
                        alt="DOME Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                      <div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
                          {projectData.name}
                        </DialogTitle>
                        <p className="text-sm sm:text-base text-muted-foreground">{projectData.location}</p>
                      </div>
                    </div>
                  </DialogHeader>

                  {/* Selector móvil */}
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
                        <div className="bg-card p-4 rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-4">{projectData.description}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">Total de unidades: {stats.totalUnits}</h4>
                          <Progress value={100} className="w-full" />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades disponibles: {stats.availableUnits}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? (stats.availableUnits / totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades reservadas: {stats.reservedUnits}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? (stats.reservedUnits / totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">Unidades vendidas: {stats.soldUnits}</h4>
                          <Progress
                            value={totalUnits > 0 ? (stats.soldUnits / totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades bloqueadas: {stats.blockedUnits}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? (stats.blockedUnits / totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>

                        <div className="mt-6 bg-card p-4 rounded-lg border">
                          <h4 className="font-medium mb-4 text-base sm:text-lg">Unidades por piso:</h4>
                          <div className="mb-4 flex flex-wrap gap-1 sm:gap-2">
                            {["all", "available", "reserved", "sold", "blocked"].map((filterType) => (
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
                                      : filterType === "sold"
                                        ? "Vendidas"
                                        : "Bloqueadas"}
                              </Button>
                            ))}
                          </div>
                          {floors.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-1 sm:gap-2">
                              {floors.map((floor) => (
                                <Button
                                  key={floor.number}
                                  variant="outline"
                                  className="flex flex-col items-center justify-center p-2 w-full h-full text-xs sm:text-sm bg-transparent"
                                  onClick={() => handleFloorClick(floor.number)}
                                >
                                  <span className="font-medium">Piso {floor.number}</span>
                                  <span className="text-[10px] sm:text-xs font-semibold mt-1">
                                    {getFilteredUnits(floor)}{" "}
                                    {currentFilter === "all"
                                      ? "Total"
                                      : currentFilter === "available"
                                        ? "Libre"
                                        : currentFilter === "reserved"
                                          ? "Reservadas"
                                          : currentFilter === "sold"
                                            ? "Vendidas"
                                            : "Bloqueadas"}
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
                        <h4 className="font-medium text-base sm:text-lg">Tipos de Unidades</h4>
                        {projectData.unitTypes.map((unit, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium">{unit.type}</h5>
                            <p className="text-sm text-muted-foreground">Tamaño: {unit.size}</p>
                            <p className="text-sm text-muted-foreground">Rango de precios: {unit.priceRange}</p>
                            <p className="text-sm text-muted-foreground">Estado: {unit.status}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Amenities del Complejo</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {projectData.amenities.map((amenity, index) => (
                            <div key={index} className="bg-muted p-4 rounded-lg">
                              <h5 className="font-medium">{amenity.name}</h5>
                              <p className="text-sm text-muted-foreground">{amenity.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="financial" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Opciones de Financiamiento</h4>
                        {projectData.financialOptions.map((option, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium">{option.name}</h5>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        ))}

                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <h5 className="font-medium">Promociones Especiales</h5>
                          <p className="text-sm text-muted-foreground">{projectData.generalPromotions}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="mt-2">
                      <div className="space-y-6 mt-4">
                        <h4 className="font-medium text-xl">Ubicación del Proyecto</h4>

                        <div className="bg-muted rounded-lg overflow-hidden shadow-md aspect-video">
                          <iframe
                            src={projectData.mapConfig.embedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-muted p-6 rounded-lg shadow-md">
                            <h5 className="font-medium text-lg mb-3">Detalles de Ubicación</h5>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li>
                                <span className="font-semibold text-foreground">Dirección:</span>{" "}
                                {projectData.mapConfig.address}
                              </li>
                              <li>
                                <span className="font-semibold text-foreground">Código postal:</span>{" "}
                                {projectData.mapConfig.postalCode}
                              </li>
                              <li className="flex items-center space-x-2">
                                <span className="font-semibold text-foreground">Link de ubicación:</span>
                                <input
                                  type="text"
                                  value={projectData.mapConfig.detailsLink}
                                  readOnly
                                  className="flex-grow bg-background px-2 py-1 rounded text-xs border"
                                />
                                <Button
                                  onClick={() => navigator.clipboard.writeText(projectData.mapConfig.detailsLink)}
                                  size="sm"
                                  variant="outline"
                                >
                                  Copiar
                                </Button>
                              </li>
                            </ul>
                          </div>

                          <div className="bg-muted p-6 rounded-lg shadow-md">
                            <h5 className="font-medium text-lg mb-3">Comodidades del Área</h5>
                            <p className="text-sm text-muted-foreground">
                              {projectData.mapConfig.amenitiesDescription}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>

                {/* Botones de acción */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 sm:p-4 bg-background border-t">
                  <Button onClick={() => handleFloorClick(1)} className="w-full py-3 sm:py-6 text-xs sm:text-base">
                    Ver planos
                  </Button>
                  <Button onClick={handleBrochureClick} className="w-full py-3 sm:py-6 text-xs sm:text-base">
                    <DownloadIcon className="mr-1 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Descargar </span>
                    <span>brochure</span>
                  </Button>
                  <Button onClick={onViewGallery} className="w-full py-3 sm:py-6 text-xs sm:text-base">
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
