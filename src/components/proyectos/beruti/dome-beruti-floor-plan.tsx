"use client"
import { useState, useCallback, useEffect, useRef } from "react"
import type React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Building,
  Car,
  FileSpreadsheet,
  FileBarChart,
  MapPin,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  type BerutiParkingSpot,
} from "@/lib/dome-beruti-data"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

let notyf: Notyf | null = null

type DomeBerutiFloorPlanProps = {
  floorNumber?: number | null
  onBack: () => void
}

const floors = Array.from({ length: 14 }, (_, i) => i + 1)
const garageLevels = [1, 2, 3]

// Garage plan images for Dome Beruti
const garagePlans = {
  1: "/planos/beruti/cochera/nivel1.png",
  2: "/planos/beruti/cochera/nivel2.png",
  3: "/planos/beruti/cochera/nivel3.png",
}

export function DomeBerutiFloorPlan({ floorNumber, onBack }: DomeBerutiFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedUnit, setSelectedUnit] = useState<BerutiApartment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityLog, setActivityLog] = useState<string[]>([])
  const { user } = useAuth()
  const [action, setAction] = useState<
    "block" | "reserve" | "sell" | "unblock" | "directReserve" | "cancelReservation" | "release" | null
  >(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    reservationOrder: null as File | null,
    price: "",
    note: "",
  })
  const [confirmReservation, setConfirmReservation] = useState(false)
  const [confirmCancelReservation, setConfirmCancelReservation] = useState(false)
  const [confirmRelease, setConfirmRelease] = useState(false)
  const [activeView, setActiveView] = useState<"apartments" | "garage">("apartments")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentGarageLevel, setCurrentGarageLevel] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedParkingSpot, setSelectedParkingSpot] = useState<BerutiParkingSpot | null>(null)
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false)

  // Initialize Notyf
  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  // Obtener datos del piso seleccionado
  const currentFloorData = getBerutiFloorData(currentFloor)

  const handleUnitClick = useCallback((unit: BerutiApartment) => {
    setSelectedUnit(unit)
    setIsModalOpen(true)
    setAction(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      reservationOrder: null,
      price: "",
      note: "",
    })
    setConfirmReservation(false)
    setConfirmCancelReservation(false)
    setConfirmRelease(false)
  }, [])

  const handleFloorClick = (floor: number) => {
    setCurrentFloor(floor)
    setSelectedUnit(null)
    setIsModalOpen(false)
  }

  const handleActionClick = (
    actionType: "block" | "reserve" | "sell" | "unblock" | "directReserve" | "cancelReservation" | "release",
  ) => {
    setAction(actionType)
    setConfirmReservation(actionType === "reserve" && selectedUnit !== null && selectedUnit.status === "BLOQUEADO")
    setConfirmCancelReservation(actionType === "cancelReservation")
    setConfirmRelease(actionType === "release")
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUnit || !user) return

    try {
      let newStatus: BerutiApartment["status"] = selectedUnit.status

      switch (action) {
        case "block":
          newStatus = "BLOQUEADO"
          break
        case "reserve":
        case "directReserve":
          newStatus = "RESERVADO"
          break
        case "sell":
          newStatus = "VENDIDO"
          break
        case "unblock":
        case "cancelReservation":
        case "release":
          newStatus = "DISPONIBLE"
          break
      }

      const success = updateBerutiApartmentStatus(selectedUnit.id, newStatus)

      if (success) {
        if (notyf) {
          switch (action) {
            case "block":
              notyf.success("Unidad bloqueada con éxito")
              break
            case "reserve":
            case "directReserve":
              notyf.success("Unidad reservada con éxito")
              break
            case "sell":
              notyf.success("Unidad vendida con éxito")
              break
            case "unblock":
              notyf.success("Bloqueo liberado con éxito")
              break
            case "cancelReservation":
              notyf.success("Reserva cancelada con éxito")
              break
            case "release":
              notyf.success("Unidad liberada con éxito")
              break
          }
        }

        // Actualizar el registro de actividades
        const timestamp = new Date().toLocaleString()
        const description = `${user.name} ${
          action === "block"
            ? "bloqueó"
            : action === "reserve" || action === "directReserve"
              ? "reservó"
              : action === "sell"
                ? "vendió"
                : "liberó"
        } la unidad ${selectedUnit.unitNumber}`
        setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog])

        setIsModalOpen(false)
        setAction(null)
        setFormData({
          name: "",
          phone: "",
          email: "",
          reservationOrder: null,
          price: "",
          note: "",
        })
      } else {
        if (notyf) notyf.error("Error al actualizar la unidad")
      }
    } catch (err) {
      console.error("Error updating unit:", err)
      if (notyf) notyf.error("Error al actualizar la unidad")
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData((prev) => ({ ...prev, reservationOrder: event.target.files![0] }))
    }
  }

  const handleDownloadFloorPlan = () => {
    if (!selectedUnit) return
    if (notyf) notyf.success("Descargando plano...")
  }

  const handleDownloadAdditionalInfo = useCallback((type: string) => {
    let filePath = ""

    switch (type) {
      case "Presupuestos":
        filePath = "/general/precios/Lista_DOME-Torre-Beruti.pdf"
        break
      case "Plano del edificio":
        filePath = "/general/planogenerales/Planos_DOME-Torre-Beruti.pdf"
        break
      case "Plano de la cochera":
        filePath = "/general/cocheras/Cochera_DOME-Torre-Beruti.pdf"
        break
      case "Brochure":
        filePath = "/general/brochures/Brochure_DOME-Torre-Beruti.pdf"
        break
      case "Ficha técnica":
        filePath = "/general/especificaciones/Especificaciones_DOME-Torre-Beruti.pdf"
        break
      default:
        if (notyf) notyf.error("Archivo no encontrado")
        return
    }

    // Create download link
    const link = document.createElement("a")
    link.href = filePath
    link.download = filePath.split("/").pop() || "documento.pdf"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (notyf) notyf.success(`Descargando ${type}...`)
  }, [])

  const refreshData = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
    if (notyf) notyf.success("Datos actualizados")
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

  const handleParkingSpotClick = useCallback((spot: BerutiParkingSpot) => {
    setSelectedParkingSpot(spot)
    setIsParkingModalOpen(true)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
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
            <div className="text-right">
              <div className="text-sm text-zinc-400">Bloqueadas</div>
              <div className="text-lg font-bold text-blue-400">{stats.blocked}</div>
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
            {/* Floor Selection */}
            <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Selecciona un piso</h2>
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
                  <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto">
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

              {/* Floor Plan with Image Map */}
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
                            onClick={() => handleUnitClick(apartment)}
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

                {/* Floor Stats */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Disponibles</div>
                    <div className="text-xl font-bold text-green-400">{stats.available}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Reservadas</div>
                    <div className="text-xl font-bold text-yellow-400">{stats.reserved}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Vendidas</div>
                    <div className="text-xl font-bold text-red-400">{stats.sold}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Bloqueadas</div>
                    <div className="text-xl font-bold text-blue-400">{stats.blocked}</div>
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

                {/* Garage Plan with Interactive Areas */}
                <div className="relative aspect-video">
                  <Image
                    src={
                      garagePlans[currentGarageLevel as keyof typeof garagePlans] ||
                      "/placeholder.svg?height=600&width=800" ||
                      "/placeholder.svg"
                    }
                    alt={`Cocheras Nivel ${currentGarageLevel}`}
                    fill
                    className="object-contain pointer-events-none"
                  />

                  {/* Interactive parking spots overlay */}
                  <div className="absolute inset-0 z-10">
                    <svg viewBox="0 0 1200 780" className="w-full h-full" style={{ pointerEvents: "all" }}>
                      {berutiParkingSpots
                        .filter((spot) => spot.level === currentGarageLevel)
                        .map((spot) => {
                          if (!spot.coordinates) return null

                          const coords = spot.coordinates.split(",").map(Number)
                          const [x1, y1, x2, y2] = coords

                          return (
                            <rect
                              key={spot.id}
                              x={x1}
                              y={y1}
                              width={x2 - x1}
                              height={y2 - y1}
                              fill={getBerutiStatusColor(spot.status)}
                              stroke="white"
                              strokeWidth="2"
                              opacity="0.7"
                              onClick={() => handleParkingSpotClick(spot)}
                              style={{ cursor: "pointer" }}
                              className="hover:opacity-100 transition-opacity"
                            />
                          )
                        })}
                    </svg>
                  </div>
                </div>

                {/* Parking Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Total Cocheras</div>
                    <div className="text-xl font-bold text-white">
                      {berutiParkingSpots.filter((spot) => spot.level === currentGarageLevel).length}
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Disponibles</div>
                    <div className="text-xl font-bold text-green-400">
                      {
                        berutiParkingSpots.filter(
                          (spot) => spot.level === currentGarageLevel && spot.status === "DISPONIBLE",
                        ).length
                      }
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Vendidas</div>
                    <div className="text-xl font-bold text-red-400">
                      {
                        berutiParkingSpots.filter(
                          (spot) => spot.level === currentGarageLevel && spot.status === "VENDIDO",
                        ).length
                      }
                    </div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Reservadas</div>
                    <div className="text-xl font-bold text-yellow-400">
                      {
                        berutiParkingSpots.filter(
                          (spot) => spot.level === currentGarageLevel && spot.status === "RESERVADO",
                        ).length
                      }
                    </div>
                  </div>
                </div>

                {/* Parking Legend */}
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
        </Tabs>

        {/* Unit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border-zinc-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Unidad {selectedUnit?.unitNumber}</DialogTitle>
            </DialogHeader>

            {selectedUnit && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-zinc-400">Estado</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getBerutiStatusColor(selectedUnit.status) }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {getBerutiStatusLabel(selectedUnit.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Superficie Total</Label>
                    <p className="font-semibold">{formatBerutiArea(selectedUnit.totalArea)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold text-green-400">{formatBerutiPrice(selectedUnit.saleValue)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio por m²</Label>
                    <p className="font-semibold">{formatBerutiPrice(selectedUnit.pricePerM2)}</p>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold">Detalles de la Unidad</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Descripción:</span>
                      <span>{selectedUnit.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Orientación:</span>
                      <span>{selectedUnit.orientation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Superficie Cubierta:</span>
                      <span>{formatBerutiArea(selectedUnit.coveredArea)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Balcón:</span>
                      <span>{formatBerutiArea(selectedUnit.balconArea)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Terraza:</span>
                      <span>{formatBerutiArea(selectedUnit.terraceArea)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Con Amenities:</span>
                      <span>{formatBerutiArea(selectedUnit.totalWithAmenities)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold">Información Financiera</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reserva (10%):</span>
                      <span className="text-green-400">{formatBerutiPrice(selectedUnit.reserveAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Anticipo (30%):</span>
                      <span className="text-blue-400">{formatBerutiPrice(selectedUnit.downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Saldo (60%):</span>
                      <span className="text-yellow-400">{formatBerutiPrice(selectedUnit.balance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cuota mensual:</span>
                      <span className="text-purple-400">{formatBerutiPrice(selectedUnit.monthlyPayment)}</span>
                    </div>
                  </div>
                </div>

                {!action && (
                  <div className="space-y-2">
                    <Button onClick={handleDownloadFloorPlan} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar plano
                    </Button>

                    {selectedUnit.status === "DISPONIBLE" && (
                      <>
                        <Button
                          onClick={() => handleActionClick("block")}
                          className="w-full bg-purple-600 hover:bg-purple-700"
                        >
                          Bloquear
                        </Button>
                        <Button
                          onClick={() => handleActionClick("directReserve")}
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                        >
                          Reservar
                        </Button>
                      </>
                    )}

                    {selectedUnit.status === "BLOQUEADO" && (
                      <>
                        <Button
                          onClick={() => handleActionClick("reserve")}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Reservar
                        </Button>
                        <Button
                          onClick={() => handleActionClick("unblock")}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          Liberar Bloqueo
                        </Button>
                      </>
                    )}

                    {selectedUnit.status === "RESERVADO" && (
                      <>
                        <Button
                          onClick={() => handleActionClick("sell")}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Vender
                        </Button>
                        <Button
                          onClick={() => handleActionClick("cancelReservation")}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          Cancelar Reserva
                        </Button>
                      </>
                    )}

                    {selectedUnit.status === "VENDIDO" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="w-full bg-blue-600 hover:bg-blue-700">
                          Descargar contrato
                        </Button>
                        <Button
                          onClick={() => handleActionClick("release")}
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                        >
                          Liberar unidad
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {(action === "block" || action === "directReserve" || action === "reserve" || action === "sell") && (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {action !== "sell" && (
                      <>
                        <div>
                          <Label htmlFor="name" className="text-white">
                            Nombre
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="text-white bg-zinc-800 border-zinc-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-white">
                            Teléfono
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="text-white bg-zinc-800 border-zinc-700"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="text-white bg-zinc-800 border-zinc-700"
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <Label htmlFor="price" className="text-white">
                        Precio
                      </Label>
                      <Input
                        id="price"
                        type="text"
                        value={formData.price || formatBerutiPrice(selectedUnit.saleValue)}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="text-white bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    {action === "sell" && (
                      <div>
                        <Label htmlFor="reservationOrder" className="text-white">
                          Contrato de Venta
                        </Label>
                        <Input
                          id="reservationOrder"
                          type="file"
                          onChange={handleFileChange}
                          required
                          className="text-white bg-zinc-800 border-zinc-700"
                          ref={fileInputRef}
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="note" className="text-white">
                        Notas
                      </Label>
                      <Textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        className="text-white bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
                      {action === "block"
                        ? "Confirmar Bloqueo"
                        : action === "reserve" || action === "directReserve"
                          ? "Confirmar Reserva"
                          : "Confirmar Venta"}
                    </Button>
                  </form>
                )}

                {(action === "unblock" || action === "cancelReservation" || action === "release") && (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="note" className="text-white">
                        Nota (Obligatoria)
                      </Label>
                      <Textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        required
                        className="text-white bg-zinc-800 border-zinc-700"
                      />
                    </div>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700 w-full">
                      {action === "unblock"
                        ? "Confirmar Liberación"
                        : action === "cancelReservation"
                          ? "Confirmar Cancelación"
                          : "Confirmar Liberación"}
                    </Button>
                  </form>
                )}

                {(confirmReservation || confirmCancelReservation || confirmRelease) && (
                  <div className="space-y-4">
                    <p className="text-yellow-400">
                      {confirmReservation
                        ? "¿Confirmar reserva de la unidad?"
                        : confirmCancelReservation
                          ? "¿Confirmar cancelación de la reserva?"
                          : "¿Confirmar liberación de la unidad?"}
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={handleFormSubmit} className="bg-green-600 hover:bg-green-700 flex-1">
                        Confirmar
                      </Button>
                      <Button
                        onClick={() => {
                          setConfirmReservation(false)
                          setConfirmCancelReservation(false)
                          setConfirmRelease(false)
                          setAction(null)
                        }}
                        className="bg-red-600 hover:bg-red-700 flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Parking Spot Modal */}
        <Dialog open={isParkingModalOpen} onOpenChange={setIsParkingModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-zinc-900 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Cochera {selectedParkingSpot?.id}</DialogTitle>
            </DialogHeader>

            {selectedParkingSpot && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-zinc-400">Estado</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getBerutiStatusColor(selectedParkingSpot.status) }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {getBerutiStatusLabel(selectedParkingSpot.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Nivel</Label>
                    <p className="font-semibold">Nivel {selectedParkingSpot.level}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Tipo</Label>
                    <p className="font-semibold">{selectedParkingSpot.type}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold text-green-400">{formatBerutiPrice(selectedParkingSpot.price)}</p>
                  </div>
                </div>

                {selectedParkingSpot.assignedTo && (
                  <div className="p-3 bg-zinc-800 rounded">
                    <Label className="text-zinc-400">Asignada a:</Label>
                    <p className="font-semibold">{selectedParkingSpot.assignedTo}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {selectedParkingSpot.status === "DISPONIBLE" && (
                    <>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">asignar Cochera</Button>
                    </>
                  )}

                  {selectedParkingSpot.status === "BLOQUEADO" && (
                    <>
                      <Button className="w-full bg-green-600 hover:bg-green-700">Reservar Cochera</Button>
                      <Button className="w-full bg-red-600 hover:bg-red-700">Liberar Bloqueo</Button>
                    </>
                  )}

                  {selectedParkingSpot.status === "RESERVADO" && (
                    <>
                      <Button className="w-full bg-green-600 hover:bg-green-700">Vender Cochera</Button>
                      <Button className="w-full bg-red-600 hover:bg-red-700">Cancelar Reserva</Button>
                    </>
                  )}

                  {selectedParkingSpot.status === "VENDIDO" && (
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Liberar Cochera</Button>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setIsParkingModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-4">Información adicional</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleDownloadAdditionalInfo("Presupuestos")}
                className={cn("bg-slate-700 hover:bg-zinc-700", "transition-colors duration-200")}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Presupuestos
              </Button>
              <Button
                onClick={() => handleDownloadAdditionalInfo("Plano del edificio")}
                className={cn("bg-slate-700 hover:bg-zinc-700", "transition-colors duration-200")}
              >
                <Building className="mr-2 h-4 w-4" /> Plano del edificio
              </Button>
              <Button
                onClick={() => handleDownloadAdditionalInfo("Plano de la cochera")}
                className={cn("bg-slate-700 hover:bg-zinc-700", "transition-colors duration-200")}
              >
                <Car className="mr-2 h-4 w-4" /> Plano de la cochera
              </Button>
              <Button
                onClick={() => handleDownloadAdditionalInfo("Brochure")}
                className={cn("bg-slate-700 hover:bg-zinc-700", "transition-colors duration-200")}
              >
                <FileText className="mr-2 h-4 w-4" /> Brochure
              </Button>
              <Button
                onClick={() => handleDownloadAdditionalInfo("Ficha técnica")}
                className={cn("bg-slate-700 hover:bg-zinc-700", "transition-colors duration-200")}
              >
                <FileBarChart className="mr-2 h-4 w-4" /> Ficha técnica
              </Button>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-4">Registro de Actividades</h4>
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {activityLog.map((activity, index) => (
                  <p key={index} className="text-sm text-zinc-300">
                    {activity}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
