"use client"
import { useState, useCallback, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DownloadIcon, ImageIcon, RefreshCw } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { suitesProjectInfo, getSuitesProjectStats, suitesFloorsData } from "@/lib/dome-suites-data"

type SuitesProjectModalProps = {
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

export function SuitesProjectModal({
  isOpen,
  onClose,
  onViewProject,
  onViewGallery,
  onViewPlanes,
}: SuitesProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "features" | "financial" | "location">("overview")
  const [refreshing, setRefreshing] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<"all" | "available" | "reserved" | "sold" | "blocked">("all")

  const stats = getSuitesProjectStats()

  // Crear datos de pisos para la visualización
  const floors: Floor[] = useMemo(() => {
    return suitesFloorsData.map((floor, index) => {
      const floorStats = floor.apartments.reduce(
        (acc, apt) => {
          if (apt.status === "DISPONIBLE") acc.available++
          else if (apt.status === "RESERVADO") acc.reserved++
          else if (apt.status === "VENDIDO") acc.sold++
          else if (apt.status === "BLOQUEADO") acc.blocked++
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
        y: 680 - index * 50,
      }
    })
  }, [])

  const refreshData = useCallback(async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }, [])

  const handleBrochureClick = () => {
    if (suitesProjectInfo.brochure) {
      window.open(suitesProjectInfo.brochure, "_blank")
    }
  }

  const handleFloorClick = (floorNumber: number) => {
    onViewPlanes(floorNumber)
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
            <motion.div className="flex flex-col h-full lg:flex-row">
              {/* Imagen del edificio con overlay de pisos */}
              <div className="w-full h-1/3 sm:h-64 md:h-96 lg:w-1/2 lg:h-full relative">
                <Image
                  src={suitesProjectInfo.image || "/placeholder.svg"}
                  alt={suitesProjectInfo.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* SVG Overlay para pisos */}
                <svg
                  viewBox="540 27 1100 600"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "all" }}
                >
                  <g transform="scale(1.9, 0.85)">
                    <AnimatePresence>
                      {floors.map((floor) => {
                        const totalUnits =
                          floor.availableUnits + floor.reservedUnits + floor.soldUnits + floor.blockedUnits
                        if (totalUnits === 0) return null

                        const floorWidth = 300
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
                              height="30"
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
                              height="30"
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
                              height="30"
                              fill="#3b82f6"
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
                              height="30"
                              fill="#87f5af"
                              stroke="white"
                              strokeWidth="1"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.8 }}
                              exit={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          </g>
                        )
                      })}
                    </AnimatePresence>
                  </g>
                </svg>

                {/* Leyenda de estados */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-2 rounded">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 mr-2"></div>
                    <span className="text-white text-xs sm:text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-500 mr-2"></div>
                    <span className="text-white text-xs sm:text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 mr-2"></div>
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
                    className="bg-black bg-opacity-50 text-white border-white hover:bg-opacity-75"
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
                        src={suitesProjectInfo.logo || "/placeholder.svg"}
                        alt="Suites Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                      <div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">
                          {suitesProjectInfo.name}
                        </DialogTitle>
                        <p className="text-sm sm:text-base text-muted-foreground">{suitesProjectInfo.location}</p>
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
                          <p className="text-sm text-muted-foreground mb-4">{suitesProjectInfo.description}</p>
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
                            <Button
                              variant={currentFilter === "blocked" ? "default" : "outline"}
                              onClick={() => handleFilterChange("blocked")}
                              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2"
                            >
                              Bloqueadas
                            </Button>
                          </div>
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-1 sm:gap-2">
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
                                        ? "Reservadas"
                                        : currentFilter === "sold"
                                          ? "Vendidas"
                                          : "Bloqueadas"}
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
                        {suitesProjectInfo.unitTypes.map((unit, index) => (
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
                          {suitesProjectInfo.amenities.map((amenity, index) => (
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
                        {suitesProjectInfo.financialOptions.map((option, index) => (
                          <div key={index} className="bg-muted p-4 rounded-lg">
                            <h5 className="font-medium">{option.name}</h5>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        ))}

                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <h5 className="font-medium">Promociones Especiales</h5>
                          <p className="text-sm text-muted-foreground">{suitesProjectInfo.generalPromotions}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="mt-2">
                      <div className="space-y-6 mt-4">
                        <h4 className="font-medium text-xl">Ubicación del Proyecto</h4>

                        <div className="bg-muted rounded-lg overflow-hidden shadow-md aspect-video">
                          <iframe
                            src={suitesProjectInfo.mapConfig.embedUrl}
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
                                {suitesProjectInfo.mapConfig.address}
                              </li>
                              <li>
                                <span className="font-semibold text-foreground">Código postal:</span>{" "}
                                {suitesProjectInfo.mapConfig.postalCode}
                              </li>
                              <li className="flex items-center space-x-2">
                                <span className="font-semibold text-foreground">Link de ubicación:</span>
                                <input
                                  type="text"
                                  value={suitesProjectInfo.mapConfig.detailsLink}
                                  readOnly
                                  className="flex-grow bg-background px-2 py-1 rounded text-xs border"
                                />
                                <Button
                                  onClick={() => navigator.clipboard.writeText(suitesProjectInfo.mapConfig.detailsLink)}
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
                              {suitesProjectInfo.mapConfig.amenitiesDescription}
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
