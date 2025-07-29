"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Download, FileText, Building, Car, RefreshCw, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/app/auth/auth-context"
import {
  berutiProjectInfo,
  getBerutiFloorData,
  getBerutiFloorPlan,
  getBerutiStatusColor,
  getBerutiStatusLabel,
  formatBerutiPrice,
  formatBerutiArea,
  updateBerutiApartmentStatus,
  type BerutiApartment,
  berutiParkingSpots,
} from "@/lib/dome-beruti-data"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

let notyf: Notyf | null = null

interface DomeBerutiFloorPlanProps {
  floorNumber?: number
  onBack: () => void
}

export function DomeBerutiFloorPlan({ floorNumber, onBack }: DomeBerutiFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedApartment, setSelectedApartment] = useState<BerutiApartment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeView, setActiveView] = useState<"apartments" | "garage">("apartments")
  const [currentGarageLevel, setCurrentGarageLevel] = useState(1)
  const [action, setAction] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    price: "",
    note: "",
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Initialize Notyf
  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  const currentFloorData = getBerutiFloorData(currentFloor)
  const floors = Array.from({ length: 14 }, (_, i) => i + 1)
  const garageLevels = [1, 2, 3]

  const handleFloorClick = (floor: number) => {
    setCurrentFloor(floor)
    setSelectedApartment(null)
    setIsModalOpen(false)
  }

  const handleApartmentClick = (apartment: BerutiApartment) => {
    setSelectedApartment(apartment)
    setIsModalOpen(true)
    setAction(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      price: "",
      note: "",
    })
  }

  const handleActionClick = (actionType: string) => {
    setAction(actionType)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApartment || !user) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let newStatus: BerutiApartment["status"] = selectedApartment.status

      switch (action) {
        case "block":
          newStatus = "BLOQUEADO"
          break
        case "reserve":
          newStatus = "RESERVADO"
          break
        case "sell":
          newStatus = "VENDIDO"
          break
        case "unblock":
        case "release":
          newStatus = "DISPONIBLE"
          break
      }

      const success = updateBerutiApartmentStatus(selectedApartment.id, newStatus)

      if (success && notyf) {
        switch (action) {
          case "block":
            notyf.success("Unidad bloqueada con éxito")
            break
          case "reserve":
            notyf.success("Unidad reservada con éxito")
            break
          case "sell":
            notyf.success("Unidad vendida con éxito")
            break
          case "unblock":
          case "release":
            notyf.success("Unidad liberada con éxito")
            break
          default:
            notyf.success("Acción completada con éxito")
        }
      }

      setIsModalOpen(false)
      setAction(null)
      setFormData({
        name: "",
        phone: "",
        email: "",
        price: "",
        note: "",
      })
    } catch (error) {
      if (notyf) notyf.error("Error al procesar la acción")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadFloorPlan = () => {
    if (!selectedApartment) return

    if (notyf) notyf.success("Descargando plano...")
  }

  const getUnitStats = () => {
    if (!currentFloorData) return { available: 0, reserved: 0, sold: 0, blocked: 0 }
    const apartments = currentFloorData.apartments
    return {
      available: apartments.filter((apt) => apt.status === "DISPONIBLE").length,
      reserved: apartments.filter((apt) => apt.status === "RESERVADO").length,
      sold: apartments.filter((apt) => apt.status === "VENDIDO").length,
      blocked: apartments.filter((apt) => apt.status === "BLOQUEADO").length,
    }
  }

  const stats = getUnitStats()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button onClick={onBack} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver al proyecto
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{berutiProjectInfo.name}</h1>
            <p className="text-zinc-400 flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-1" />
              {berutiProjectInfo.location}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-zinc-400">Disponibles</div>
              <div className="text-lg font-bold text-green-400">{stats.available}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-zinc-400">Reservadas</div>
              <div className="text-lg font-bold text-yellow-400">{stats.reserved}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-zinc-400">Vendidas</div>
              <div className="text-lg font-bold text-red-400">{stats.sold}</div>
            </div>
          </div>
        </div>

        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as "apartments" | "garage")}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
            <TabsTrigger value="apartments" className="data-[state=active]:bg-zinc-700">
              <Home className="w-4 h-4 mr-2" />
              Unidades
            </TabsTrigger>
            <TabsTrigger value="garage" className="data-[state=active]:bg-zinc-700">
              <Car className="w-4 h-4 mr-2" />
              Cocheras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apartments">
            <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <button
                      onClick={() => handleFloorClick(Math.max(1, currentFloor - 1))}
                      className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                      disabled={currentFloor === 1}
                    >
                      <ChevronLeft />
                    </button>
                    <span className="mx-4 text-lg font-bold">Piso {currentFloor}</span>
                    <button
                      onClick={() => handleFloorClick(Math.min(14, currentFloor + 1))}
                      className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                      disabled={currentFloor === 14}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {floors.map((floor) => (
                      <motion.button
                        key={floor}
                        onClick={() => handleFloorClick(floor)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold transition-colors ${
                          currentFloor === floor ? "bg-blue-600 text-white" : "bg-zinc-800 hover:bg-zinc-700"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {floor}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative aspect-video">
                <Image
                  src={getBerutiFloorPlan(currentFloor) || "/placeholder.svg?height=600&width=800"}
                  alt={`Plano del Piso ${currentFloor}`}
                  fill
                  className="object-contain pointer-events-none"
                />
                {currentFloorData && (
                  <div className="absolute inset-0 z-10">
                    <svg viewBox="0 0 1020 780" className="w-full h-full" style={{ pointerEvents: "all" }}>
                      {currentFloorData.apartments.map((apartment) => {
                        if (!apartment.coordinates) return null

                        const coords = apartment.coordinates.split(",").map(Number)
                        const points = []
                        for (let i = 0; i < coords.length; i += 2) {
                          points.push(`${coords[i]},${coords[i + 1]}`)
                        }

                        return (
                          <polygon
                            key={apartment.id}
                            points={points.join(" ")}
                            fill={getBerutiStatusColor(apartment.status)}
                            stroke="white"
                            strokeWidth="2"
                            opacity="0.7"
                            onClick={() => handleApartmentClick(apartment)}
                            style={{ cursor: "pointer" }}
                            className="hover:opacity-100 transition-opacity"
                          />
                        )
                      })}
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold">Plano del Piso {currentFloor}</h3>
                <p className="text-zinc-400 text-sm">Haz clic en las unidades para ver su información.</p>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getBerutiStatusColor("DISPONIBLE") }}
                    ></div>
                    <span className="text-sm">Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getBerutiStatusColor("RESERVADO") }}
                    ></div>
                    <span className="text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getBerutiStatusColor("VENDIDO") }}
                    ></div>
                    <span className="text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getBerutiStatusColor("BLOQUEADO") }}
                    ></div>
                    <span className="text-sm">Bloqueado</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="garage">
            <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Cocheras - Nivel {currentGarageLevel}</h2>
                <div className="flex justify-center space-x-4 mb-4">
                  {garageLevels.map((level) => (
                    <Button
                      key={level}
                      onClick={() => setCurrentGarageLevel(level)}
                      variant={currentGarageLevel === level ? "default" : "outline"}
                      className={currentGarageLevel === level ? "bg-blue-600" : ""}
                    >
                      Nivel {level}
                    </Button>
                  ))}
                </div>

                <div className="relative aspect-video">
                  <div className="flex items-center justify-center h-full bg-zinc-800 rounded">
                    <div className="text-center">
                      <p className="text-xl text-zinc-400 mb-4">Cocheras Nivel {currentGarageLevel}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-semibold">
                            Tipo {currentGarageLevel === 1 ? "A" : currentGarageLevel === 2 ? "B" : "C"}
                          </p>
                          <p className="text-zinc-400">
                            {formatBerutiPrice(
                              currentGarageLevel === 1 ? 60000 : currentGarageLevel === 2 ? 50000 : 45000,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold">Disponibles</p>
                          <p className="text-green-400">
                            {
                              berutiParkingSpots.filter(
                                (spot) => spot.level === currentGarageLevel && spot.status === "DISPONIBLE",
                              ).length
                            }
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold">Total</p>
                          <p className="text-zinc-400">
                            {berutiParkingSpots.filter((spot) => spot.level === currentGarageLevel).length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Apartment Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border-zinc-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Unidad {selectedApartment?.unitNumber}</DialogTitle>
            </DialogHeader>

            {selectedApartment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-zinc-400">Estado</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getBerutiStatusColor(selectedApartment.status) }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {getBerutiStatusLabel(selectedApartment.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Superficie Total</Label>
                    <p className="font-semibold">{formatBerutiArea(selectedApartment.totalArea)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold text-green-400">{formatBerutiPrice(selectedApartment.saleValue)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio por m²</Label>
                    <p className="font-semibold">{formatBerutiPrice(selectedApartment.pricePerM2)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Superficie Cubierta</Label>
                    <p className="font-semibold">{formatBerutiArea(selectedApartment.coveredArea)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Balcón</Label>
                    <p className="font-semibold">{formatBerutiArea(selectedApartment.balconArea)}</p>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold">Detalles de la Unidad</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Descripción:</span>
                      <span>{selectedApartment.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Orientación:</span>
                      <span>{selectedApartment.orientation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Terraza:</span>
                      <span>{formatBerutiArea(selectedApartment.terraceArea)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Con Amenities:</span>
                      <span>{formatBerutiArea(selectedApartment.totalWithAmenities)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold">Información Financiera</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reserva (10%):</span>
                      <span className="text-green-400">{formatBerutiPrice(selectedApartment.reserveAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Anticipo (30%):</span>
                      <span className="text-blue-400">{formatBerutiPrice(selectedApartment.downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Saldo (60%):</span>
                      <span className="text-yellow-400">{formatBerutiPrice(selectedApartment.balance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cuota mensual:</span>
                      <span className="text-purple-400">{formatBerutiPrice(selectedApartment.monthlyPayment)}</span>
                    </div>
                  </div>
                </div>

                {!action && (
                  <div className="space-y-2">
                    <Button onClick={handleDownloadFloorPlan} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar plano
                    </Button>

                    {selectedApartment.status === "DISPONIBLE" && (
                      <>
                        <Button
                          onClick={() => handleActionClick("block")}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          Bloquear
                        </Button>
                        <Button
                          onClick={() => handleActionClick("reserve")}
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                        >
                          Reservar
                        </Button>
                      </>
                    )}

                    {selectedApartment.status === "RESERVADO" && (
                      <Button
                        onClick={() => handleActionClick("sell")}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Vender
                      </Button>
                    )}

                    {(selectedApartment.status === "BLOQUEADO" || selectedApartment.status === "VENDIDO") && (
                      <Button
                        onClick={() => handleActionClick("release")}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Liberar
                      </Button>
                    )}
                  </div>
                )}

                {action && (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre del Cliente</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        value={formData.price || formatBerutiPrice(selectedApartment.saleValue)}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="note">Notas</Label>
                      <Textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                      {loading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        `Confirmar ${action === "block" ? "Bloqueo" : action === "reserve" ? "Reserva" : action === "sell" ? "Venta" : "Liberación"}`
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-zinc-700">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Project Info */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Información del Proyecto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-zinc-300">Estadísticas</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total unidades:</span>
                      <span>{berutiProjectInfo.totalUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Disponibles:</span>
                      <span className="text-green-400">{berutiProjectInfo.availableUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reservadas:</span>
                      <span className="text-yellow-400">{berutiProjectInfo.reservedUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Vendidas:</span>
                      <span className="text-red-400">{berutiProjectInfo.soldUnits}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-zinc-300">Detalles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Pisos:</span>
                      <span>{berutiProjectInfo.floors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cocheras:</span>
                      <span>{berutiParkingSpots.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Subsuelos:</span>
                      <span>{berutiProjectInfo.garageSublevels}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-zinc-300">Acciones</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full border-zinc-700 bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar brochure
                    </Button>
                    <Button variant="outline" className="w-full border-zinc-700 bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver documentación
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
