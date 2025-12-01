"use client"

import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DownloadIcon, ImageIcon, RefreshCw } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  berutiProjectInfo,
  berutiFloorsData,
  getBerutiStatusColor,
  berutiAmenities,
  berutiUnitTypes,
  berutiFinancialOptions,
  berutiMapConfig,
  type BerutiApartmentStatus,
} from "@/lib/dome-beruti-data"
import { useUnitStorage } from "@/lib/hooks/useUnitStorage"

interface DomeBerutiProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenFloorPlan: (floorNumber?: number) => void
  onOpenGallery: () => void
}

type Floor = {
  number: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  blockedUnits: number
  x: number
  y: number
}

const getFilteredUnits = (floor: Floor, filter: "all" | "available" | "reserved" | "sold" | "blocked") => {
  switch (filter) {
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
}

export function DomeBerutiProjectModal({
  isOpen,
  onClose,
  onOpenFloorPlan,
  onOpenGallery,
}: DomeBerutiProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "features" | "financial" | "location">("overview")
  const [refreshing, setRefreshing] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<"all" | "available" | "reserved" | "sold" | "blocked">("all")

  const { unitStatuses, refresh: refreshStorage, isLoading } = useUnitStorage("beruti")

  const getUnitStatus = useCallback(
    (unitNumber: string, defaultStatus: BerutiApartmentStatus): BerutiApartmentStatus => {
      const backendStatus = unitStatuses[unitNumber]
      if (backendStatus && backendStatus.status) {
        return backendStatus.status
      }
      return defaultStatus
    },
    [unitStatuses],
  )

  const stats = useMemo(() => {
    let totalUnits = 0
    let availableUnits = 0
    let reservedUnits = 0
    let soldUnits = 0
    let blockedUnits = 0

    berutiFloorsData.forEach((floor) => {
      floor.apartments.forEach((apt) => {
        totalUnits++
        const currentStatus = getUnitStatus(apt.unitNumber, apt.status)
        switch (currentStatus) {
          case "DISPONIBLE":
            availableUnits++
            break
          case "RESERVADO":
            reservedUnits++
            break
          case "VENDIDO":
            soldUnits++
            break
          case "BLOQUEADO":
            blockedUnits++
            break
        }
      })
    })

    return { totalUnits, availableUnits, reservedUnits, soldUnits, blockedUnits }
  }, [getUnitStatus])

  const floors: Floor[] = useMemo(() => {
    return berutiFloorsData.map((floor, index) => {
      const floorStats = floor.apartments.reduce(
        (acc, apt) => {
          // Obtener el estado real de la unidad (backend o estático)
          const currentStatus = getUnitStatus(apt.unitNumber, apt.status)
          if (currentStatus === "DISPONIBLE") acc.available++
          else if (currentStatus === "RESERVADO") acc.reserved++
          else if (currentStatus === "VENDIDO") acc.sold++
          else if (currentStatus === "BLOQUEADO") acc.blocked++
          return acc
        },
        { available: 0, reserved: 0, sold: 0, blocked: 0 },
      )

      return {
        number: floor.level,
        availableUnits: floorStats.available,
        reservedUnits: floorStats.reserved,
        soldUnits: floorStats.sold,
        blockedUnits: floorStats.blocked,
        x: 448,
        y: 680 - index * 45,
      }
    })
  }, [getUnitStatus])

  const refreshData = useCallback(async () => {
    setRefreshing(true)
    await refreshStorage()
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshing(false)
  }, [refreshStorage])

  const handleBrochureClick = () => {
    if (berutiProjectInfo.brochure) {
      window.open(berutiProjectInfo.brochure, "_blank")
    }
  }

  const handleFloorClick = (floorNumber: number) => {
    console.log("Beruti floor clicked:", floorNumber)
    onOpenFloorPlan(floorNumber)
  }

  const handleFilterChange = useCallback((filter: "all" | "available" | "reserved" | "sold" | "blocked") => {
    setCurrentFilter(filter)
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="w-full h-[100dvh] p-0 overflow-hidden flex flex-col sm:max-w-[90vw] sm:h-[90vh]">
            <DialogTitle className="sr-only">{berutiProjectInfo.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Detalles del proyecto {berutiProjectInfo.name} ubicado en {berutiProjectInfo.location}
            </DialogDescription>
            <motion.div className="flex flex-col h-full lg:flex-row">
              {/* Imagen del edificio con overlay de pisos */}
              <div className="w-full h-1/3 sm:h-64 md:h-96 lg:w-1/2 lg:h-full relative">
                <Image
                  src={berutiProjectInfo.image || "/placeholder.svg?width=800&height=1200&query=modern+building+facade"}
                  alt={berutiProjectInfo.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* SVG Overlay para pisos */}
                <svg
                  viewBox="-162 100 1000 800"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "all" }}
                >
                  <g transform="scale(1.0, 1.15) translate(-200, 50)">
                    <AnimatePresence>
                      {floors.map((floor) => {
                        const totalUnits =
                          floor.availableUnits + floor.reservedUnits + floor.soldUnits + floor.blockedUnits
                        if (totalUnits === 0) return null

                        const floorWidth = 260
                        const soldWidth = totalUnits > 0 ? (floor.soldUnits / totalUnits) * floorWidth : 0
                        const reservedWidth = totalUnits > 0 ? (floor.reservedUnits / totalUnits) * floorWidth : 0
                        const blockedWidth = totalUnits > 0 ? (floor.blockedUnits / totalUnits) * floorWidth : 0
                        const availableWidth = floorWidth - soldWidth - reservedWidth - blockedWidth

                        return (
                          <g
                            key={floor.number}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleFloorClick(floor.number)
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {/* Rectángulo vendido */}
                            <motion.rect
                              x={floor.x}
                              y={floor.y}
                              width={soldWidth}
                              height="25"
                              fill={getBerutiStatusColor("VENDIDO")}
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
                              height="25"
                              fill={getBerutiStatusColor("RESERVADO")}
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
                              height="25"
                              fill={getBerutiStatusColor("BLOQUEADO")}
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
                              height="25"
                              fill={getBerutiStatusColor("DISPONIBLE")}
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
                              x={floor.x - 30}
                              y={floor.y + 17}
                              fill="white"
                              fontSize="12"
                              fontWeight="bold"
                              textAnchor="end"
                            >
                              Piso {floor.number}
                            </text>
                          </g>
                        )
                      })}
                    </AnimatePresence>
                  </g>
                </svg>

                {/* Leyenda de estados */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
                  <div className="flex items-center mb-1">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      style={{ backgroundColor: getBerutiStatusColor("VENDIDO") }}
                    />
                    <span className="ml-2 text-white text-xs sm:text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      style={{ backgroundColor: getBerutiStatusColor("RESERVADO") }}
                    />
                    <span className="ml-2 text-white text-xs sm:text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      style={{ backgroundColor: getBerutiStatusColor("BLOQUEADO") }}
                    />
                    <span className="ml-2 text-white text-xs sm:text-sm">Bloqueado</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      style={{ backgroundColor: getBerutiStatusColor("DISPONIBLE") }}
                    />
                    <span className="ml-2 text-white text-xs sm:text-sm">Disponible</span>
                  </div>
                </div>

                {/* Botón de actualizar */}
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={refreshData}
                    disabled={refreshing || isLoading}
                    size="sm"
                    variant="outline"
                    className="bg-black bg-opacity-50 text-white border-white hover:bg-opacity-75"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing || isLoading ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4 sm:p-6">
                  <DialogHeader className="space-y-2 pb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={berutiProjectInfo.logo || "/placeholder.svg"}
                        alt="DOME Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                      <div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
                          {berutiProjectInfo.name}
                        </DialogTitle>
                        <p className="text-sm sm:text-base text-muted-foreground">{berutiProjectInfo.location}</p>
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
                          <p className="text-sm text-muted-foreground mb-4">{berutiProjectInfo.description}</p>
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
                            value={stats.totalUnits > 0 ? (stats.availableUnits / stats.totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades reservadas: {stats.reservedUnits}
                          </h4>
                          <Progress
                            value={stats.totalUnits > 0 ? (stats.reservedUnits / stats.totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">Unidades vendidas: {stats.soldUnits}</h4>
                          <Progress
                            value={stats.totalUnits > 0 ? (stats.soldUnits / stats.totalUnits) * 100 : 0}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades bloqueadas: {stats.blockedUnits}
                          </h4>
                          <Progress
                            value={stats.totalUnits > 0 ? (stats.blockedUnits / stats.totalUnits) * 100 : 0}
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
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-1 sm:gap-2">
                            {floors.map((floor) => (
                              <Button
                                key={floor.number}
                                variant="outline"
                                className="flex flex-col items-center justify-center p-2 w-full h-full text-xs sm:text-sm bg-transparent"
                                onClick={() => handleFloorClick(floor.number)}
                              >
                                <span className="font-medium">Piso {floor.number}</span>
                                <span className="text-[10px] sm:text-xs font-semibold mt-1">
                                  {getFilteredUnits(floor, currentFilter)}{" "}
                                  {currentFilter === "all"
                                    ? "Total"
                                    : currentFilter === "available"
                                      ? "Libre"
                                      : currentFilter === "reserved"
                                        ? "Reserv."
                                        : currentFilter === "sold"
                                          ? "Vend."
                                          : "Bloq."}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="units" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Tipos de Unidades</h4>
                        {berutiUnitTypes.map((unit, index) => (
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
                          {berutiAmenities.map((amenity, index) => (
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
                        {berutiFinancialOptions.map((option, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium">{option.name}</h5>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="mt-2">
                      <div className="space-y-6 mt-4">
                        <h4 className="font-medium text-xl">Ubicación del Proyecto</h4>

                        <div className="bg-muted rounded-lg overflow-hidden shadow-md aspect-video">
                          <iframe
                            src={berutiMapConfig.googleMapsEmbed}
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
                                {berutiMapConfig.address}
                              </li>
                              <li>
                                <span className="font-semibold text-foreground">Código postal:</span>{" "}
                                {berutiMapConfig.postalCode}
                              </li>
                              <li>
                                <span className="font-semibold text-foreground">Barrio:</span> Palermo
                              </li>
                            </ul>
                          </div>

                          <div className="bg-muted p-6 rounded-lg shadow-md">
                            <h5 className="font-medium text-lg mb-3">Comodidades del Área</h5>
                            <p className="text-sm text-muted-foreground">{berutiMapConfig.amenitiesDescription}</p>
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
                  <Button onClick={onOpenGallery} className="w-full py-3 sm:py-6 text-xs sm:text-base">
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
