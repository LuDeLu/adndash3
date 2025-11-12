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
  Phone,
  Mail,
  User,
  Calendar,
  Search,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/app/auth/auth-context"
import { domePalermoData, type GarageLevel } from "@/lib/dome-palermo-data"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

// Assuming API_BASE_URL is defined elsewhere, e.g., in an environment file or constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api" // Example API base URL

let notyf: Notyf | null = null

interface DomePalermoFloorPlanProps {
  onBack: () => void
}

type ApartmentStatus = "available" | "reserved" | "sold" | "blocked"

interface ApartmentData {
  id: string
  buyer: string
  date: string
  price: string
  status: ApartmentStatus
  surface: string
  phoneNumber?: string
  email?: string
  assignedParkings: string[]
}

interface FloorData {
  apartments: { [key: string]: ApartmentData }
  svgPaths: { [key: string]: string }
  viewBox: string
}

interface ParkingSpot {
  id: string
  level: number
  status: "available" | "reserved" | "sold" | "blocked"
  assignedTo: string | null
  path: string
}

interface Cliente {
  id: number
  nombre: string
  apellido: string
  telefono: string
  email: string
  tipo: string
  estado: string
}

interface NewClienteData {
  nombre: string
  apellido: string
  telefono: string
  email: string
  tipo: string
  estado: string
}

interface UnitOwner {
  name: string
  email: string
  phone: string
  type: string
}

const floors = Array.from({ length: 9 }, (_, i) => i + 1)
const garageLevels = [1, 2, 3]

// Garage plan images for Dome Resi (Palermo Residence)
const garagePlans = {
  1: "/planos/resi/cochera/nivel1.png",
  2: "/planos/resi/cochera/nivel2.png",
  3: "/planos/resi/cochera/nivel3.png",
}

export function DomePalermoFloorPlan({ onBack }: DomePalermoFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(1)
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null)
  const [selectedParkingSpot, setSelectedParkingSpot] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeView, setActiveView] = useState<"apartments" | "garage">("apartments")
  const [currentGarageLevel, setCurrentGarageLevel] = useState<GarageLevel>(1)
  const [action, setAction] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    price: "",
    note: "",
    reservationOrder: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  const [activityLog, setActivityLog] = useState<string[]>([])
  const [confirmReservation, setConfirmReservation] = useState(false)
  const [confirmCancelReservation, setConfirmCancelReservation] = useState(false)
  const [confirmRelease, setConfirmRelease] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [showCreateClient, setShowCreateClient] = useState(false)
  const [newClienteData, setNewClienteData] = useState<NewClienteData>({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    tipo: "COMPRADOR",
    estado: "ACTIVO",
  })
  const [isLoadingClientes, setIsLoadingClientes] = useState(false)
  const [unitOwners, setUnitOwners] = useState<{ [key: string]: UnitOwner }>({})

  // Initialize Notyf
  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  const loadClientes = async () => {
    setIsLoadingClientes(true)
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const clientesData = await response.json()
        setClientes(clientesData)
        setFilteredClientes(clientesData)
      } else {
        console.error("Error al cargar clientes")
        if (notyf) {
          notyf.error("Error al cargar la lista de clientes")
        }
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      if (notyf) {
        notyf.error("Error de conexión al cargar clientes")
      }
    } finally {
      setIsLoadingClientes(false)
    }
  }

  const createNewCliente = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newClienteData),
      })

      if (response.ok) {
        const nuevoCliente = await response.json()
        if (notyf) {
          notyf.success("Cliente creado exitosamente")
        }

        await loadClientes()
        setSelectedCliente(nuevoCliente)
        setShowCreateClient(false)

        setNewClienteData({
          nombre: "",
          apellido: "",
          telefono: "",
          email: "",
          tipo: "COMPRADOR",
          estado: "ACTIVO",
        })
      } else {
        if (notyf) {
          notyf.error("Error al crear el cliente")
        }
      }
    } catch (error) {
      console.error("Error al crear cliente:", error)
      if (notyf) {
        notyf.error("Error de conexión al crear cliente")
      }
    }
  }

  const handleSearchClientes = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFilteredClientes(clientes)
    } else {
      const filtered = clientes.filter(
        (cliente) =>
          `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(term.toLowerCase()) ||
          cliente.email.toLowerCase().includes(term.toLowerCase()) ||
          cliente.telefono.includes(term),
      )
      setFilteredClientes(filtered)
    }
  }

  useEffect(() => {
    if (action === "addOwner") {
      loadClientes()
    }
  }, [action])

  const handleAssignOwner = async () => {
    if (!selectedCliente || !selectedApartment) return

    try {
      setUnitOwners((prev) => ({
        ...prev,
        [selectedApartment]: {
          name: `${selectedCliente.nombre} ${selectedCliente.apellido}`,
          email: selectedCliente.email,
          phone: selectedCliente.telefono,
          type: selectedCliente.tipo,
        },
      }))

      if (notyf) {
        notyf.success(`Propietario asignado al departamento ${selectedApartment}`)
      }

      setAction(null)
      setSelectedCliente(null)
      setSearchTerm("")
      setShowCreateClient(false)
    } catch (error) {
      console.error("Error al asignar propietario:", error)
      if (notyf) {
        notyf.error("Error al asignar propietario")
      }
    }
  }

  const projectData = domePalermoData.projectInfo
  const floorData = domePalermoData.getFloorData(currentFloor)
  const parkingSpots = domePalermoData.getParkingSpotsByLevel(currentGarageLevel)

  const statusColors = {
    available: "#87f5af",
    reserved: "#edcf53",
    sold: "#f57f7f",
    blocked: "#7f7fff",
  }

  const handleFloorClick = (floor: number) => {
    setCurrentFloor(floor)
    setSelectedApartment(null)
    setSelectedParkingSpot(null)
    setIsModalOpen(false)
  }

  const handleApartmentClick = (apartment: string) => {
    setSelectedApartment(apartment)
    setSelectedParkingSpot(null)
    setIsModalOpen(true)
    setAction(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      price: "",
      note: "",
      reservationOrder: null,
    })
    setConfirmReservation(false)
    setConfirmCancelReservation(false)
    setConfirmRelease(false)
    setSelectedCliente(null)
    setSearchTerm("")
    setShowCreateClient(false)
  }

  const handleParkingSpotClick = (spotId: string) => {
    setSelectedParkingSpot(spotId)
    setSelectedApartment(null)
    setIsModalOpen(true)
    setAction(null)
    setFormData({
      name: "",
      phone: "",
      email: "",
      price: "",
      note: "",
      reservationOrder: null,
    })
    setConfirmReservation(false)
    setConfirmCancelReservation(false)
    setConfirmRelease(false)
  }

  const handleActionClick = (actionType: string) => {
    setAction(actionType)
    if (
      actionType === "reserve" &&
      ((selectedApartment && floorData?.apartments[selectedApartment]?.status === "blocked") ||
        (selectedParkingSpot && parkingSpots.find((spot) => spot.id === selectedParkingSpot)?.status === "blocked"))
    ) {
      setConfirmReservation(true)
    } else if (actionType === "cancelReservation") {
      setConfirmCancelReservation(true)
    } else if (actionType === "release") {
      setConfirmRelease(true)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!selectedApartment && !selectedParkingSpot) || !user) return

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (notyf) {
        const itemType = selectedApartment ? "Departamento" : "Cochera"
        switch (action) {
          case "block":
            notyf.success(`${itemType} bloqueado con éxito`)
            break
          case "reserve":
          case "directReserve":
            notyf.success(`${itemType} reservado con éxito`)
            break
          case "sell":
            notyf.success(`${itemType} vendido con éxito`)
            break
          case "unblock":
            notyf.success("Bloqueo liberado con éxito")
            break
          case "cancelReservation":
            notyf.success("Reserva cancelada con éxito")
            break
          case "release":
            notyf.success(`${itemType} liberado con éxito`)
            break
          default:
            notyf.success("Acción completada con éxito")
        }
      }

      // Actualizar el registro de actividades
      const timestamp = new Date().toLocaleString()
      const itemId = selectedApartment || selectedParkingSpot
      const itemType = selectedApartment ? "departamento" : "cochera"
      const description = `${user.name} ${
        action === "block"
          ? "bloqueó"
          : action === "reserve" || action === "directReserve"
            ? "reservó"
            : action === "sell"
              ? "vendió"
              : "liberó"
      } ${itemType} ${itemId}`
      setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog])

      setIsModalOpen(false)
      setAction(null)
      setFormData({
        name: "",
        phone: "",
        email: "",
        price: "",
        note: "",
        reservationOrder: null,
      })
      setConfirmReservation(false)
      setConfirmCancelReservation(false)
      setConfirmRelease(false)
      setSelectedCliente(null)
      setSearchTerm("")
      setShowCreateClient(false)
    } catch (error) {
      if (notyf) notyf.error("Error al procesar la acción")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData((prev) => ({ ...prev, reservationOrder: event.target.files![0] }))
    }
  }

  const handleDownloadFloorPlan = () => {
    if (!selectedApartment && !selectedParkingSpot) return

    const filePath = "/general/planogenerales/Planos_DOME-Palermo-Residence.pdf"
    const link = document.createElement("a")
    link.href = filePath
    link.download = "Plano_Palermo_Residence.pdf"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (notyf) notyf.success("Descargando plano...")
  }

  const handleDownloadAdditionalInfo = useCallback((type: string) => {
    let filePath = ""

    switch (type) {
      case "Presupuestos":
        filePath = "/general/precios/Lista_DOME-Palermo-Residence.pdf"
        break
      case "Plano del edificio":
        filePath = "/general/planogenerales/Planos_DOME-Palermo-Residence.pdf"
        break
      case "Plano de la cochera":
        filePath = "/general/cocheras/Cochera_DOME-Palermo-Residence.pdf"
        break
      case "Brochure":
        filePath = "/general/brochures/Brochure_DOME-Palermo-Residence.pdf"
        break
      case "Ficha técnica":
        filePath = "/general/especificaciones/Especificaciones_DOME-Palermo-Residence.pdf"
        break
      default:
        if (notyf) notyf.error("Archivo no encontrado")
        return
    }

    const link = document.createElement("a")
    link.href = filePath
    link.download = filePath.split("/").pop() || "documento.pdf"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (notyf) notyf.success(`Descargando ${type}...`)
  }, [])

  const getUnitStats = () => {
    if (!floorData) return { available: 0, reserved: 0, sold: 0, blocked: 0 }
    const apartments = Object.values(floorData.apartments)
    return {
      available: apartments.filter((apt) => apt.status === "available").length,
      reserved: apartments.filter((apt) => apt.status === "reserved").length,
      sold: apartments.filter((apt) => apt.status === "sold").length,
      blocked: apartments.filter((apt) => apt.status === "blocked").length,
    }
  }

  const getParkingStats = () => {
    const stats = domePalermoData.getParkingStats()
    return stats
  }

  const stats = getUnitStats()
  const parkingStats = getParkingStats()

  const selectedSpot = selectedParkingSpot ? parkingSpots.find((spot) => spot.id === selectedParkingSpot) : null

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
            <h1 className="text-2xl font-bold">{projectData.name}</h1>
            <p className="text-zinc-400 flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-1" />
              {projectData.location}
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
              Departamentos
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
                      onClick={() => handleFloorClick(Math.min(9, currentFloor + 1))}
                      className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                      disabled={currentFloor === 9}
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

              {/* Floor Plan with Image Map */}
              <div className="relative aspect-video">
                <Image
                  src={domePalermoData.getFloorPlan(currentFloor) || "/placeholder.svg?height=600&width=800"}
                  alt={`Plano del Piso ${currentFloor}`}
                  fill
                  className="object-contain pointer-events-none"
                />
                {floorData && (
                  <div className="absolute inset-0 z-10">
                    <svg viewBox={floorData.viewBox} className="w-full h-full" style={{ pointerEvents: "all" }}>
                      <g transform="scale(1, 1) translate(-83, 10)">
                        {Object.entries(floorData.apartments).map(([aptId, aptData]) => (
                          <path
                            key={aptId}
                            d={floorData.svgPaths[aptId] || ""}
                            fill={statusColors[aptData.status]}
                            stroke="black"
                            strokeWidth="10"
                            opacity="0.7"
                            onClick={() => handleApartmentClick(aptId)}
                            style={{ cursor: "pointer" }}
                            className="hover:opacity-100 transition-opacity"
                          />
                        ))}
                      </g>
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold">Plano del Piso {currentFloor}</h3>
                <p className="text-zinc-400 text-sm">Haz clic en los departamentos para ver su información.</p>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: statusColors.available }}></div>
                    <span className="text-sm">Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: statusColors.reserved }}></div>
                    <span className="text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: statusColors.sold }}></div>
                    <span className="text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: statusColors.blocked }}></div>
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
                      onClick={() => setCurrentGarageLevel(level as GarageLevel)}
                      variant={currentGarageLevel === level ? "default" : "outline"}
                      className={currentGarageLevel === level ? "bg-blue-600" : ""}
                    >
                      Nivel {level}
                    </Button>
                  ))}
                </div>

                <div className="relative aspect-video">
                  <Image
                    src={
                      garagePlans[currentGarageLevel as keyof typeof garagePlans] ||
                      "/placeholder.svg?height=600&width=800" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={`Cocheras Nivel ${currentGarageLevel}`}
                    fill
                    className="object-contain pointer-events-none"
                  />
                  <div className="absolute inset-0 z-10">
                    <svg viewBox="100 0 1350 850" className="w-full h-full" style={{ pointerEvents: "all" }}>
                      {parkingSpots.map((spot) => (
                        <g key={spot.id} style={{ cursor: "pointer" }} onClick={() => handleParkingSpotClick(spot.id)}>
                          <path
                            d={spot.path}
                            fill={
                              spot.status === "available"
                                ? "rgba(135, 245, 175, 0.3)"
                                : spot.status === "reserved"
                                  ? "rgba(237, 207, 83, 0.3)"
                                  : spot.status === "sold"
                                    ? "rgba(245, 127, 127, 0.3)"
                                    : "rgba(127, 127, 255, 0.3)"
                            }
                            stroke={
                              spot.status === "available"
                                ? "#22c55e"
                                : spot.status === "reserved"
                                  ? "#eab308"
                                  : spot.status === "sold"
                                    ? "#ef4444"
                                    : "#3b82f6"
                            }
                            strokeWidth="2"
                            className="hover:opacity-80 transition-opacity"
                          />
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                            dominantBaseline="middle"
                            stroke="black"
                            strokeWidth="0.5"
                            style={{ pointerEvents: "none" }}
                          >
                            {spot.id.replace("P" + currentGarageLevel + "-", "")}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Parking Stats */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Disponibles</div>
                    <div className="text-xl font-bold text-green-400">{parkingStats.available}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Reservadas</div>
                    <div className="text-xl font-bold text-yellow-400">{parkingStats.reserved}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Vendidas</div>
                    <div className="text-xl font-bold text-red-400">{parkingStats.sold}</div>
                  </div>
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-zinc-400">Total</div>
                    <div className="text-xl font-bold text-blue-400">{parkingStats.total}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Unified Modal for Apartments and Parking Spots */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border-zinc-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedApartment ? `Departamento ${selectedApartment}` : `Cochera ${selectedParkingSpot}`}
              </DialogTitle>
            </DialogHeader>

            {selectedApartment && floorData?.apartments[selectedApartment] && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-zinc-400">Estado</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: floorData.apartments[selectedApartment]
                            ? statusColors[floorData.apartments[selectedApartment].status]
                            : statusColors.available,
                        }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {floorData.apartments[selectedApartment]?.status === "available"
                          ? "Disponible"
                          : floorData.apartments[selectedApartment]?.status === "reserved"
                            ? "Reservado"
                            : floorData.apartments[selectedApartment]?.status === "sold"
                              ? "Vendido"
                              : "Bloqueado"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Superficie</Label>
                    <p className="font-semibold">{floorData.apartments[selectedApartment].surface}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold text-green-400">{floorData.apartments[selectedApartment].price}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Piso</Label>
                    <p className="font-semibold">{currentFloor}</p>
                  </div>
                </div>

                {floorData.apartments[selectedApartment]?.buyer && (
                  <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                    <h4 className="font-semibold">Información del Cliente</h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-zinc-400" />
                        <span>{floorData.apartments[selectedApartment]?.buyer}</span>
                      </div>
                      {floorData.apartments[selectedApartment]?.phoneNumber && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-zinc-400" />
                          <span>{floorData.apartments[selectedApartment]?.phoneNumber}</span>
                        </div>
                      )}
                      {floorData.apartments[selectedApartment]?.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-zinc-400" />
                          <span>{floorData.apartments[selectedApartment]?.email}</span>
                        </div>
                      )}
                      {floorData.apartments[selectedApartment]?.date && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                          <span>{floorData.apartments[selectedApartment]?.date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {unitOwners[selectedApartment] && (
                  <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                    <h4 className="font-semibold text-green-400 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Propietario Actual
                    </h4>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-zinc-400" />
                        <span>{unitOwners[selectedApartment].name}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-zinc-400" />
                        <span>{unitOwners[selectedApartment].email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-zinc-400" />
                        <span>{unitOwners[selectedApartment].phone}</span>
                      </div>
                      <Badge variant="secondary" className="mt-2 w-fit">
                        {unitOwners[selectedApartment].type}
                      </Badge>
                    </div>
                  </div>
                )}

                {!action && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleActionClick("addOwner")}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {unitOwners[selectedApartment] ? "Cambiar Propietario" : "Añadir Propietario"}
                    </Button>

                    <Button onClick={handleDownloadFloorPlan} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar plano
                    </Button>

                    {floorData.apartments[selectedApartment]?.status === "available" && (
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

                    {floorData.apartments[selectedApartment]?.status === "blocked" && (
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

                    {floorData.apartments[selectedApartment]?.status === "reserved" && (
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

                    {floorData.apartments[selectedApartment]?.status === "sold" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="w-full bg-blue-600 hover:bg-blue-700">
                          Descargar contrato
                        </Button>
                        <Button
                          onClick={() => handleActionClick("release")}
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                        >
                          Liberar departamento
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedParkingSpot && selectedSpot && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-zinc-400">Estado</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            statusColors[selectedSpot.status as keyof typeof statusColors] || statusColors.available,
                        }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {selectedSpot.status === "available"
                          ? "Disponible"
                          : selectedSpot.status === "reserved"
                            ? "Reservado"
                            : selectedSpot.status === "sold"
                              ? "Vendido"
                              : "Bloqueado"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Nivel</Label>
                    <p className="font-semibold">{selectedSpot.level}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold text-green-400">$15,000</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Asignado a</Label>
                    <p className="font-semibold">{selectedSpot.assignedTo || "No asignado"}</p>
                  </div>
                </div>

                {!action && (
                  <div className="space-y-2">
                    <Button onClick={handleDownloadFloorPlan} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar plano cochera
                    </Button>

                    {selectedSpot.status === "available" && (
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

                    {selectedSpot.status === "blocked" && (
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

                    {selectedSpot.status === "reserved" && (
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

                    {selectedSpot.status === "sold" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="w-full bg-blue-600 hover:bg-blue-700">
                          Descargar contrato
                        </Button>
                        <Button
                          onClick={() => handleActionClick("release")}
                          className="w-full bg-yellow-600 hover:bg-yellow-700"
                        >
                          Liberar cochera
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {action === "addOwner" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Seleccionar Propietario</h4>
                  <Button
                    onClick={() => setShowCreateClient(!showCreateClient)}
                    size="sm"
                    variant="outline"
                    className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Crear Cliente
                  </Button>
                </div>

                {!showCreateClient ? (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        placeholder="Buscar cliente por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => handleSearchClientes(e.target.value)}
                        className="pl-10 text-white bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {isLoadingClientes ? (
                        <div className="text-center py-4 text-zinc-400">Cargando clientes...</div>
                      ) : filteredClientes.length === 0 ? (
                        <div className="text-center py-4 text-zinc-400">
                          {searchTerm ? "No se encontraron clientes" : "No hay clientes disponibles"}
                        </div>
                      ) : (
                        filteredClientes.map((cliente) => (
                          <div
                            key={cliente.id}
                            onClick={() => setSelectedCliente(cliente)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedCliente?.id === cliente.id
                                ? "border-indigo-500 bg-indigo-500/20"
                                : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-white">
                                  {cliente.nombre} {cliente.apellido}
                                </p>
                                <p className="text-sm text-zinc-400">{cliente.email}</p>
                                <p className="text-sm text-zinc-400">{cliente.telefono}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {cliente.tipo}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {selectedCliente && (
                      <div className="space-y-3">
                        <div className="p-3 bg-indigo-500/20 border border-indigo-500 rounded-lg">
                          <p className="text-sm text-indigo-300">Cliente seleccionado:</p>
                          <p className="font-medium text-white">
                            {selectedCliente.nombre} {selectedCliente.apellido}
                          </p>
                        </div>
                        <Button onClick={handleAssignOwner} className="w-full bg-indigo-600 hover:bg-indigo-700">
                          Asignar como Propietario
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <h5 className="font-medium text-white">Crear Nuevo Cliente</h5>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="newNombre" className="text-white">
                          Nombre *
                        </Label>
                        <Input
                          id="newNombre"
                          value={newClienteData.nombre}
                          onChange={(e) => setNewClienteData({ ...newClienteData, nombre: e.target.value })}
                          required
                          className="text-white bg-zinc-800 border-zinc-700"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newApellido" className="text-white">
                          Apellido *
                        </Label>
                        <Input
                          id="newApellido"
                          value={newClienteData.apellido}
                          onChange={(e) => setNewClienteData({ ...newClienteData, apellido: e.target.value })}
                          required
                          className="text-white bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newTelefono" className="text-white">
                        Teléfono *
                      </Label>
                      <Input
                        id="newTelefono"
                        type="tel"
                        value={newClienteData.telefono}
                        onChange={(e) => setNewClienteData({ ...newClienteData, telefono: e.target.value })}
                        required
                        className="text-white bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    <div>
                      <Label htmlFor="newEmail" className="text-white">
                        Email *
                      </Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newClienteData.email}
                        onChange={(e) => setNewClienteData({ ...newClienteData, email: e.target.value })}
                        required
                        className="text-white bg-zinc-800 border-zinc-700"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={createNewCliente}
                        disabled={
                          !newClienteData.nombre ||
                          !newClienteData.apellido ||
                          !newClienteData.telefono ||
                          !newClienteData.email
                        }
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Crear Cliente
                      </Button>
                      <Button
                        onClick={() => setShowCreateClient(false)}
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
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
                    value={
                      formData.price ||
                      (selectedApartment && floorData?.apartments[selectedApartment]?.price) ||
                      "$15,000"
                    }
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
                <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                  {loading
                    ? "Procesando..."
                    : `Confirmar ${action === "block" ? "Bloqueo" : action === "reserve" || action === "directReserve" ? "Reserva" : "Venta"}`}
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
                <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                  {loading
                    ? "Procesando..."
                    : `Confirmar ${action === "unblock" ? "Liberación" : action === "cancelReservation" ? "Cancelación" : "Liberación"}`}
                </Button>
              </form>
            )}

            {(confirmReservation || confirmCancelReservation || confirmRelease) && (
              <div className="space-y-4">
                <p className="text-yellow-400">
                  {confirmReservation
                    ? `¿Confirmar reserva ${selectedApartment ? "del departamento" : "de la cochera"}?`
                    : confirmCancelReservation
                      ? "¿Confirmar cancelación de la reserva?"
                      : `¿Confirmar liberación ${selectedApartment ? "del departamento" : "de la cochera"}?`}
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

            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
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
                  <h4 className="font-semibold text-zinc-300">Estadísticas Departamentos</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total unidades:</span>
                      <span>{projectData.totalUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Disponibles:</span>
                      <span className="text-green-400">{projectData.availableUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reservadas:</span>
                      <span className="text-yellow-400">{projectData.reservedUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Vendidas:</span>
                      <span className="text-red-400">{projectData.soldUnits}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-zinc-300">Estadísticas Cocheras</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Total cocheras:</span>
                      <span>{parkingStats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Disponibles:</span>
                      <span className="text-green-400">{parkingStats.available}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Reservadas:</span>
                      <span className="text-yellow-400">{parkingStats.reserved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Vendidas:</span>
                      <span className="text-red-400">{parkingStats.sold}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-zinc-300">Acciones</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-zinc-700 bg-transparent"
                      onClick={() => handleDownloadAdditionalInfo("Brochure")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descargar brochure
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-zinc-700 bg-transparent"
                      onClick={() => handleDownloadAdditionalInfo("Ficha técnica")}
                    >
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
