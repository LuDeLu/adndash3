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
import { useUnitStorage } from "@/lib/hooks/useUnitStorage"
import { suitesFloorsData, type SuitesApartment, type SuitesApartmentStatus } from "@/lib/dome-suites-data"

interface DomeSuitesProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onViewProject: () => void
  onViewGallery: () => void
  onViewPlanes: (floorNumber?: number) => void
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

export function DomeSuitesProjectModal({
  isOpen,
  onClose,
  onViewProject,
  onViewGallery,
  onViewPlanes,
}: DomeSuitesProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "features" | "financial" | "location">("overview")
  const [refreshing, setRefreshing] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<"all" | "available" | "reserved" | "sold" | "blocked">("all")

  const { unitStatuses, refresh } = useUnitStorage("suites")

  const getRealStatus = useCallback(
    (apartment: SuitesApartment): SuitesApartmentStatus => {
      const override = unitStatuses[apartment.unitNumber]
      if (override && override.status) {
        return override.status as SuitesApartmentStatus
      }
      return apartment.status
    },
    [unitStatuses],
  )

  const floors: Floor[] = useMemo(() => {
    return suitesFloorsData.map((floorData, index) => {
      const stats = floorData.apartments.reduce(
        (acc, apt) => {
          const realStatus = getRealStatus(apt)
          switch (realStatus) {
            case "DISPONIBLE":
              acc.available++
              break
            case "RESERVADO":
              acc.reserved++
              break
            case "VENDIDO":
              acc.sold++
              break
            case "BLOQUEADO":
              acc.blocked++
              break
          }
          return acc
        },
        { available: 0, reserved: 0, sold: 0, blocked: 0 },
      )

      return {
        number: floorData.level,
        availableUnits: stats.available,
        reservedUnits: stats.reserved,
        soldUnits: stats.sold,
        blockedUnits: stats.blocked,
        x: 448,
        y: 680 - index * 55,
      }
    })
  }, [getRealStatus])

  const projectData = useMemo(() => {
    const totals = floors.reduce(
      (acc, floor) => {
        acc.total += floor.availableUnits + floor.reservedUnits + floor.soldUnits + floor.blockedUnits
        acc.available += floor.availableUnits
        acc.reserved += floor.reservedUnits
        acc.sold += floor.soldUnits
        acc.blocked += floor.blockedUnits
        return acc
      },
      { total: 0, available: 0, reserved: 0, sold: 0, blocked: 0 },
    )

    return {
      name: "DOME Suites & Residences",
      location: "Paraguay & Humboldt",
      image: "/images/edificio/suitesedi.webp",
      description:
        "Exclusivo desarrollo de suites y residencias en el corazón de Palermo con amenities de primer nivel.",
      totalUnits: totals.total,
      availableUnits: totals.available,
      reservedUnits: totals.reserved,
      soldUnits: totals.sold,
      blockedUnits: totals.blocked,
    }
  }, [floors])

  const refreshData = useCallback(async () => {
    setRefreshing(true)
    await refresh()
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshing(false)
  }, [refresh])

  const handleBrochureClick = () => {
    console.log("Downloading brochure...")
  }

  const handleFloorClick = (floorNumber: number) => {
    onViewPlanes(floorNumber)
  }

  const handleFilterChange = useCallback((filter: "all" | "available" | "reserved" | "sold" | "blocked") => {
    setCurrentFilter(filter)
  }, [])

  if (!isOpen) return null

  const totalUnits = projectData.totalUnits || 1

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
                  src={projectData.image || "/placeholder.svg?width=800&height=1200&query=modern+building+facade"}
                  alt={projectData.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* SVG Overlay para pisos - Updated to use real data */}
                <svg
                  viewBox="-300 -100 1800 1000"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "all" }}
                >
                  <g transform="scale(1, 1) translate(-200, 100)">
                    <AnimatePresence>
                      {floors.map((floor) => {
                        const totalUnits =
                          floor.availableUnits + floor.reservedUnits + floor.soldUnits + floor.blockedUnits
                        if (totalUnits === 0) return null

                        const floorWidth = 850
                        const soldWidth = totalUnits > 0 ? (floor.soldUnits / totalUnits) * floorWidth : 0
                        const reservedWidth = totalUnits > 0 ? (floor.reservedUnits / totalUnits) * floorWidth : 0
                        const blockedWidth = totalUnits > 0 ? (floor.blockedUnits / totalUnits) * floorWidth : 0
                        const availableWidth = floorWidth - soldWidth - reservedWidth - blockedWidth

                        return (
                          <g
                            key={floor.number}
                            onClick={() => handleFloorClick(floor.number)}
                            style={{ cursor: "pointer" }}
                          >
                            <motion.rect
                              x={floor.x}
                              y={floor.y}
                              width={soldWidth}
                              height="25"
                              fill="#f57f7f"
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
                              height="25"
                              fill="#edcf53"
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
                              width={blockedWidth}
                              height="25"
                              fill="#60a5fa"
                              stroke="white"
                              strokeWidth="1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.8 }}
                              exit={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                            <motion.rect
                              x={floor.x + soldWidth + reservedWidth + blockedWidth}
                              y={floor.y}
                              width={availableWidth}
                              height="25"
                              fill="#87f5af"
                              stroke="white"
                              strokeWidth="1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.8 }}
                              exit={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
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

                {/* Leyenda de estados - Added blocked status */}
                <div className="absolute bottom-4 left-4  bg-opacity-50 p-2 rounded">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 mr-2"></div>
                    <span className="text-white text-xs sm:text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 mr-2"></div>
                    <span className="text-white text-xs sm:text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 mr-2"></div>
                    <span className="text-white text-xs sm:text-sm">Bloqueado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 mr-2"></div>
                    <span className="text-white text-xs sm:text-sm">Disponible</span>
                  </div>
                </div>

                {/* Botón de actualizar */}
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={refreshData}
                    disabled={refreshing}
                    size="sm"
                    variant="outline"
                    className=" bg-opacity-50 text-white border-white hover:bg-opacity-75"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "Actualizando..." : "Actualizar"}
                  </Button>
                </div>
              </div>

              {/* Contenido del modal */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <ScrollArea className="flex-1 p-4 sm:p-6">
                  <DialogHeader className="space-y-2 pb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={"/images/logo/suitelogo.png"}
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
                          <h4 className="font-medium text-sm sm:text-base">
                            Total de unidades: {projectData.totalUnits}
                          </h4>
                          <Progress value={100} className="w-full" />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades disponibles: {projectData.availableUnits}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? (projectData.availableUnits / totalUnits) * 100 : 0}
                            className="w-full [&>div]:bg-green-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades reservadas: {projectData.reservedUnits}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? (projectData.reservedUnits / totalUnits) * 100 : 0}
                            className="w-full [&>div]:bg-yellow-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades bloqueadas: {projectData.blockedUnits}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? (projectData.blockedUnits / totalUnits) * 100 : 0}
                            className="w-full [&>div]:bg-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-sm sm:text-base">
                            Unidades vendidas: {projectData.soldUnits}
                          </h4>
                          <Progress
                            value={totalUnits > 0 ? (projectData.soldUnits / totalUnits) * 100 : 0}
                            className="w-full [&>div]:bg-red-500"
                          />
                        </div>

                        <div className="mt-6 bg-card p-4 rounded-lg border">
                          <h4 className="font-medium mb-4 text-base sm:text-lg">Unidades por piso:</h4>
                          <div className="mb-4 flex flex-wrap gap-1 sm:gap-2">
                            {["all", "available", "reserved", "blocked", "sold"].map((filterType) => (
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
                                      : filterType === "blocked"
                                        ? "Bloqueadas"
                                        : "Vendidas"}
                              </Button>
                            ))}
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-1 sm:gap-2">
                            {floors.map((floor) => (
                              <Button
                                key={floor.number}
                                variant="outline"
                                className="flex flex-col items-center justify-center p-2 w-full h-full text-xs sm:text-sm bg-transparent"
                                onClick={() => onViewPlanes(floor.number)}
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
                                        : currentFilter === "blocked"
                                          ? "Bloq."
                                          : "Vend."}
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
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">Suites</h5>
                          <p className="text-sm text-muted-foreground">Superficie: 45-65 m²</p>
                          <p className="text-sm text-muted-foreground">Rango de precios: USD 180.000 - 260.000</p>
                          <p className="text-sm text-muted-foreground">Estado: Disponible</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">Residencias</h5>
                          <p className="text-sm text-muted-foreground">Superficie: 85-120 m²</p>
                          <p className="text-sm text-muted-foreground">Rango de precios: USD 340.000 - 480.000</p>
                          <p className="text-sm text-muted-foreground">Estado: Disponible</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Amenities del Complejo</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            "Piscina en rooftop",
                            "Gimnasio equipado",
                            "Sala de reuniones",
                            "Terraza panorámica",
                            "Cocheras cubiertas",
                            "Seguridad 24hs",
                          ].map((amenity, index) => (
                            <div key={index} className="bg-muted p-4 rounded-lg">
                              <h5 className="font-medium">{amenity}</h5>
                              <p className="text-sm text-muted-foreground">Amenity de primer nivel</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="financial" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Plan de Financiamiento</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">Anticipo</h5>
                          <p className="text-sm text-muted-foreground">30% al momento de la reserva</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">Cuotas</h5>
                          <p className="text-sm text-muted-foreground">40% durante la construcción (24 cuotas)</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">Entrega</h5>
                          <p className="text-sm text-muted-foreground">30% contra entrega de llaves</p>
                        </div>
                      </div>
                    </TabsContent>

<TabsContent value="location" className="mt-2">
                      <div className="space-y-6 mt-4">
                        <h4 className="font-medium text-xl">Ubicación del Proyecto</h4>

                        <div className="bg-muted rounded-lg overflow-hidden shadow-md aspect-video">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.016!2d-58.4200!3d-34.5875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM1JzE1LjAiUyA1OMKwMjUnMTIuMCJX!5e0!3m2!1sen!2sar!4v1234567890"
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
                                <span className="font-semibold text-foreground">Dirección:</span> {projectData.location}
                              </li>
                              <li>
                                <span className="font-semibold text-foreground">Barrio:</span> Palermo
                              </li>
                              <li>
                                <span className="font-semibold text-foreground">Ciudad:</span> Buenos Aires
                              </li>
                            </ul>
                          </div>

                          <div className="bg-muted p-6 rounded-lg shadow-md">
                            <h5 className="font-medium text-lg mb-3">Comodidades del Área</h5>
                            <p className="text-sm text-muted-foreground">
                              Ubicado en el corazón de Palermo, con acceso a restaurantes, cafés, parques y transporte
                              público.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </ScrollArea>

{/* Botones de acción */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 sm:p-4 bg-background border-t">
                  <Button onClick={() => onViewPlanes()} className="w-full py-3 sm:py-6 text-xs sm:text-base">
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
