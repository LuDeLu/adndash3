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
import { getBoulevardProjectStats, getBoulevardUnitsByFloor, boulevardAmenities } from "@/lib/dome-boulevar-data"

type DomeBoulevardProjectModalProps = {
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
  x: number
  y: number
}

const getFilteredUnits = (floor: Floor, filter: "all" | "available" | "reserved" | "sold") => {
  switch (filter) {
    case "available":
      return floor.availableUnits
    case "reserved":
      return floor.reservedUnits
    case "sold":
      return floor.soldUnits
    default:
      return floor.availableUnits + floor.reservedUnits + floor.soldUnits
  }
}

export function DomeBoulevardProjectModal({
  isOpen,
  onClose,
  onViewProject,
  onViewGallery,
  onViewPlanes,
}: DomeBoulevardProjectModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "units" | "features" | "financial" | "location">("overview")
  const [refreshing, setRefreshing] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<"all" | "available" | "reserved" | "sold">("all")

  const stats = getBoulevardProjectStats()

  // Crear datos de pisos para la visualización
  const floors: Floor[] = useMemo(() => {
    const floorData = []

    // Pisos 1-12
    for (let i = 1; i <= 12; i++) {
      const floorUnits = getBoulevardUnitsByFloor(i)
      const floorStats = floorUnits.reduce(
        (acc, unit) => {
          if (unit.status === "DISPONIBLE") acc.available++
          else if (unit.status === "RESERVADO") acc.reserved++
          else if (unit.status === "VENDIDO") acc.sold++
          return acc
        },
        { available: 0, reserved: 0, sold: 0 },
      )

      floorData.push({
        number: i,
        availableUnits: floorStats.available,
        reservedUnits: floorStats.reserved,
        soldUnits: floorStats.sold,
        x: 448,
        y: 680 - (i - 1) * 50,
      })
    }

    return floorData
  }, [])

  const refreshData = useCallback(async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }, [])

  const handleBrochureClick = () => {
    console.log("Downloading brochure...")
  }

  const handleFloorClick = (floorNumber: number) => {
    console.log("Boulevard floor clicked:", floorNumber)
    onViewPlanes(floorNumber)
  }

  const handleFilterChange = useCallback((filter: "all" | "available" | "reserved" | "sold") => {
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
                  src="/images/edificio/cerviño.png"
                  alt="DOME Boulevard"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* SVG Overlay para pisos */}
                <svg
                  viewBox="-980 750 4000 1000"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "all" }}
                >
                  <g transform="scale(2.5, 3) translate(-200, 50)">
                    <AnimatePresence>
                      {floors.map((floor) => {
                        const totalUnits = floor.availableUnits + floor.reservedUnits + floor.soldUnits
                        if (totalUnits === 0) return null

                        const floorWidth = 400
                        const soldWidth = totalUnits > 0 ? (floor.soldUnits / totalUnits) * floorWidth : 0
                        const reservedWidth = totalUnits > 0 ? (floor.reservedUnits / totalUnits) * floorWidth : 0
                        const availableWidth = floorWidth - soldWidth - reservedWidth

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
                            <motion.rect
                              x={floor.x}
                              y={floor.y}
                              width={soldWidth}
                              height="40"
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
                              height="40"
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
                              width={availableWidth}
                              height="40"
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
                        src="/images/logo/palermobou.png"
                        alt="DOME Logo"
                        width={50}
                        height={50}
                        className="object-contain"
                      />
                      <div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight">DOME Boulevard</DialogTitle>
                        <p className="text-sm sm:text-base text-muted-foreground">Cerviño 3941, Palermo</p>
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
                          <p className="text-sm text-muted-foreground mb-4">
                            Exclusivo desarrollo inmobiliario en el corazón de Palermo con unidades de 2 y 3
                            dormitorios, amenities de primer nivel y cocheras.
                          </p>
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
                          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 sm:gap-2">
                            {floors.map((floor) => (
                              <Button
                                key={floor.number}
                                variant="outline"
                                className="flex flex-col items-center justify-center p-4 w-full h-full text-xs sm:text-sm bg-transparent"
                                onClick={() => handleFloorClick(floor.number)}
                              >
                                <span className="font-medium">Piso {floor.number}</span>
                                <span className="text-[10px] sm:text-xs font-semibold mt-2">
                                  {getFilteredUnits(floor, currentFilter)}{" "}
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
                        <h4 className="font-medium text-base sm:text-lg">Tipos de Unidades</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">2 Dormitorios (All Suites)</h5>
                          <p className="text-sm text-muted-foreground">Superficie: 89-104 m²</p>
                          <p className="text-sm text-muted-foreground">Rango de precios: USD 455.300 - 573.700</p>
                          <p className="text-sm text-muted-foreground">Estado: Disponible</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">3 Dormitorios</h5>
                          <p className="text-sm text-muted-foreground">Superficie: 145-193 m²</p>
                          <p className="text-sm text-muted-foreground">Rango de precios: USD 640.900 - 1.288.500</p>
                          <p className="text-sm text-muted-foreground">Estado: Disponible</p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">3 Dormitorios c/Palier Privado</h5>
                          <p className="text-sm text-muted-foreground">Superficie: 181-230 m²</p>
                          <p className="text-sm text-muted-foreground">Rango de precios: USD 921.400 - 1.494.300</p>
                          <p className="text-sm text-muted-foreground">Estado: Disponible</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="features" className="mt-2">
                      <div className="space-y-4 mt-4">
                        <h4 className="font-medium text-base sm:text-lg">Amenities del Complejo</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {boulevardAmenities.map((amenity, index) => (
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
                        <h4 className="font-medium text-base sm:text-lg">Opciones de Financiamiento</h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">Financiamiento Directo</h5>
                          <p className="text-sm text-muted-foreground">
                            Planes de financiamiento directo con la desarrolladora
                          </p>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <h5 className="font-medium">Crédito Hipotecario</h5>
                          <p className="text-sm text-muted-foreground">Asistencia para obtener créditos hipotecarios</p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg mt-4">
                          <h5 className="font-medium">Promociones Especiales</h5>
                          <p className="text-sm text-muted-foreground">
                            Consulte por promociones vigentes y descuentos por pago contado
                          </p>
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
                                <span className="font-semibold text-foreground">Dirección:</span> Cerviño 3941, Palermo
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
                              público. Cerca de centros comerciales y espacios verdes.
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
