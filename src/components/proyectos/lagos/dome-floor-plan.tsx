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
  RefreshCw,
  User,
  Phone,
  Mail,
  Search,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { useAuth } from "@/app/auth/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  domeFloorsData,
  domePlantaBajaData,
  domeFloorPlans,
  type DomeApartment,
  getStatusLabel,
  formatPrice,
  formatArea,
  updateDomeApartmentStatus,
  getStatusColor,
  type ParkingSpot,
  getParkingSpotsByLevel,
} from "@/lib/dome-puertos-data"
import { Badge } from "@/components/ui/badge"
import { useUnitStorage } from "@/lib/hooks/useUnitStorage"

let notyf: Notyf | null = null

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

type DomeFloorPlanProps = {
  floorNumber?: number | null
  onReturnToProjectModal: () => void
}

const floors = [0, 1, 2, 3, 4, 5]
const API_BASE_URL = "http://localhost:3001/api"

const garageLevels = [1]
const garagePlans = {
  1: "/planos/lagos/cochera/nivel1.png",
}

export function DomeFloorPlan({ floorNumber, onReturnToProjectModal }: DomeFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedApartment, setSelectedApartment] = useState<DomeApartment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityLog, setActivityLog] = useState<string[]>([])
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

  const {
    unitOwners,
    unitStatuses,
    addOwner,
    removeOwner,
    assignParking,
    getUnitParking,
    isParkingSpotAssigned,
    getParkingSpotUnit,
    updateStatus,
    refresh, // Added refresh function
  } = useUnitStorage("lagos")

  const [action, setAction] = useState<
    | "block"
    | "reserve"
    | "sell"
    | "unblock"
    | "directReserve"
    | "cancelReservation"
    | "release"
    | "addOwner"
    | "assignParking"
    | null
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
  const [autoRefresh, setAutoRefresh] = useState(true)

  const [selectedParkingSpot, setSelectedParkingSpot] = useState<ParkingSpot | null>(null)
  const [isParkingSpotModalOpen, setIsParkingSpotModalOpen] = useState(false)

  const [selectedParkingsForAssignment, setSelectedParkingsForAssignment] = useState<{ [key: string]: boolean }>({})
  const [parkingAssignmentLevel, setParkingAssignmentLevel] = useState(1)

  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  const getRealStatus = useCallback(
    (apartment: DomeApartment): DomeApartment["status"] => {
      if (unitStatuses && unitStatuses[apartment.unitNumber]) {
        const storedStatus = unitStatuses[apartment.unitNumber].status
        // Map backend status format (uppercase) to local status format
        const statusMap: { [key: string]: DomeApartment["status"] } = {
          DISPONIBLE: "DISPONIBLE",
          RESERVADO: "reservado",
          VENDIDO: "VENDIDO",
          BLOQUEADO: "bloqueado",
        }
        return statusMap[storedStatus] || apartment.status
      }
      return apartment.status
    },
    [unitStatuses],
  )

  const getRealStatusColor = useCallback(
    (apartment: DomeApartment): string => {
      const realStatus = getRealStatus(apartment)
      return getStatusColor(realStatus)
    },
    [getRealStatus],
  )

  const getCurrentFloorData = useCallback(() => {
    if (currentFloor === 0) {
      return {
        level: 0,
        name: "Planta Baja",
        apartments: domePlantaBajaData,
      }
    }

    const floorData = domeFloorsData.find((floor) => floor.level === currentFloor)
    if (!floorData) return null

    const apartments = [...floorData.sections.A, ...floorData.sections.B, ...floorData.sections.C]

    return {
      level: floorData.level,
      name: floorData.name,
      apartments,
    }
  }, [currentFloor])

  const currentFloorData = getCurrentFloorData()

  const getUnitStats = useCallback(() => {
    if (!currentFloorData) return { available: 0, reserved: 0, sold: 0, blocked: 0 }

    return currentFloorData.apartments.reduce(
      (acc, apt) => {
        const realStatus = getRealStatus(apt)
        if (realStatus === "DISPONIBLE") acc.available++
        else if (realStatus === "reservado") acc.reserved++
        else if (realStatus === "VENDIDO") acc.sold++
        else if (realStatus === "bloqueado") acc.blocked++
        return acc
      },
      { available: 0, reserved: 0, sold: 0, blocked: 0 },
    )
  }, [currentFloorData, getRealStatus])

  const handleApartmentClick = useCallback((apartment: DomeApartment) => {
    setSelectedApartment(apartment)
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
    setSelectedApartment(null)
    setIsModalOpen(false)
  }

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
      addOwner(selectedApartment.unitNumber, {
        name: `${selectedCliente.nombre} ${selectedCliente.apellido}`,
        email: selectedCliente.email,
        phone: selectedCliente.telefono,
        type: selectedCliente.tipo,
        assignedAt: new Date().toISOString(),
      })

      if (notyf) {
        notyf.success(`Propietario asignado a la unidad ${selectedApartment.unitNumber}`)
      }

      setAction(null)
      setSelectedCliente(null)
      setSearchTerm("")
      setShowCreateClient(false)
    } catch (error) {
      console.error("Error al asignar propietario:", error)
      if (notyf) notyf.error("Error al asignar propietario")
    }
  }

  const handleActionClick = (newAction: typeof action) => {
    setAction(newAction)
    if (newAction === "assignParking" && selectedApartment) {
      const currentParkings = getUnitParking(selectedApartment.unitNumber)
      const initialSelection: { [key: string]: boolean } = {}
      currentParkings.forEach((parkingId) => {
        initialSelection[parkingId] = true
      })
      setSelectedParkingsForAssignment(initialSelection)
      setParkingAssignmentLevel(1)
    } else if (
      newAction === "block" ||
      newAction === "reserve" ||
      newAction === "sell" ||
      newAction === "unblock" ||
      newAction === "directReserve" ||
      newAction === "cancelReservation" ||
      newAction === "release"
    ) {
      setConfirmReservation(
        newAction === "reserve" && selectedApartment !== null && getRealStatus(selectedApartment) === "bloqueado",
      )
      setConfirmCancelReservation(newAction === "cancelReservation")
      setConfirmRelease(newAction === "release")
    }
  }

  const handleConfirmParkingAssignment = async () => {
    if (!selectedApartment) return

    try {
      const parkingSpotIds = Object.entries(selectedParkingsForAssignment)
        .filter(([_, isSelected]) => isSelected)
        .map(([parkingId]) => parkingId)

      await assignParking(selectedApartment.unitNumber, parkingSpotIds)

      if (notyf) {
        if (parkingSpotIds.length > 0) {
          notyf.success(`Cocheras asignadas a la unidad ${selectedApartment.unitNumber}: ${parkingSpotIds.join(", ")}`)
        } else {
          notyf.success(`Se removieron las cocheras de la unidad ${selectedApartment.unitNumber}`)
        }
      }

      const timestamp = new Date().toLocaleString()
      const description = `${user?.name || "Usuario"} ${parkingSpotIds.length > 0 ? `asignó cocheras (${parkingSpotIds.join(", ")})` : "removió cocheras"} de la unidad ${selectedApartment.unitNumber}`
      setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog])

      setAction(null)
      setSelectedParkingsForAssignment({})
    } catch (error) {
      console.error("Error al asignar cocheras:", error)
      if (notyf) notyf.error("Error al asignar cocheras")
    }
  }

  const getAvailableParkingForLevel = (level: number) => {
    const spots = getParkingSpotsByLevel(level)
    return spots.filter((parking) => {
      const assignedToUnit = getParkingSpotUnit(parking.id)
      const isAvailable = !assignedToUnit || (selectedApartment && assignedToUnit === selectedApartment.unitNumber)
      return isAvailable
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApartment || !user) return

    try {
      let newStatus: DomeApartment["status"] = getRealStatus(selectedApartment)
      let backendStatus: "DISPONIBLE" | "RESERVADO" | "VENDIDO" | "BLOQUEADO" = "DISPONIBLE"

      switch (action) {
        case "block":
          newStatus = "bloqueado"
          backendStatus = "BLOQUEADO"
          break
        case "reserve":
        case "directReserve":
          newStatus = "reservado"
          backendStatus = "RESERVADO"
          break
        case "sell":
          newStatus = "VENDIDO"
          backendStatus = "VENDIDO"
          break
        case "unblock":
        case "cancelReservation":
        case "release":
          newStatus = "DISPONIBLE"
          backendStatus = "DISPONIBLE"
          break
      }

      const success = updateDomeApartmentStatus(selectedApartment.id, newStatus)

      if (success) {
        await updateStatus(selectedApartment.unitNumber, {
          id: selectedApartment.id,
          status: backendStatus,
          changedAt: new Date().toISOString(),
          changedBy: user.name || user.email,
          notes: formData.note || undefined,
        })

        if (notyf) {
          switch (action) {
            case "block":
              notyf.success("Departamento bloqueado con éxito")
              break
            case "reserve":
            case "directReserve":
              notyf.success("Departamento reservado con éxito")
              break
            case "sell":
              notyf.success("Departamento vendido con éxito")
              break
            case "unblock":
              notyf.success("Bloqueo liberado con éxito")
              break
            case "cancelReservation":
              notyf.success("Reserva cancelada con éxito")
              break
            case "release":
              notyf.success("Departamento liberado con éxito")
              break
          }
        }

        const timestamp = new Date().toLocaleString()
        const description = `${user.name} ${action === "block" ? "bloqueó" : action === "reserve" || action === "directReserve" ? "reservó" : action === "sell" ? "vendió" : "liberó"} el departamento ${selectedApartment.unitNumber}`
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
        if (notyf) notyf.error("Error al actualizar el departamento")
      }
    } catch (err) {
      console.error("Error updating apartment:", err)
      if (notyf) notyf.error("Error al actualizar el departamento")
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData((prev) => ({ ...prev, reservationOrder: event.target.files![0] }))
    }
  }

  const handleDownloadFloorPlan = () => {
    if (!selectedApartment) return

    const filePath = "/general/planosgenerales/Plano_DOME-Puertos-Lagos.pdf"
    const link = document.createElement("a")
    link.href = filePath
    link.download = "Plano_Puertos_Lagos.pdf"
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
        filePath = "/general/precios/Lista_DOME-Puertos-Lagos.pdf"
        break
      case "Plano del edificio":
        filePath = "/general/planosgenerales/Plano_DOME-Puertos-Lagos.pdf"
        break
      case "Plano de la cochera":
        filePath = "/general/cocheras/Cochera_DOME-Puertos-Lagos.pdf"
        break
      case "Brochure":
        filePath = "/general/brochures/Brochure_DOME-Puertos-Lagos.pdf"
        break
      case "Ficha técnica":
        filePath = "/general/especificaciones/Especificaciones_DOME-Puertos-Lagos.pdf"
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

  const refreshData = async () => {
    setRefreshing(true)
    await refresh()
    await new Promise((resolve) => setTimeout(resolve, 500))
    setRefreshing(false)
    if (notyf) notyf.success("Datos actualizados")
  }

  const getFloorPlanImage = () => {
    const floorPlan = domeFloorPlans[currentFloor as keyof typeof domeFloorPlans]
    return floorPlan?.complete || "/planos/lagos/lagospb.jpg"
  }

  const handleParkingSpotClick = useCallback((parkingSpot: ParkingSpot) => {
    setSelectedParkingSpot(parkingSpot)
    setIsParkingSpotModalOpen(true)
  }, [])

  if (!currentFloorData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full max-w-md bg-zinc-900 text-white p-6 rounded-lg text-center">
          <p className="text-zinc-300 mb-4">Piso no encontrado</p>
          <Button onClick={onReturnToProjectModal} className="bg-zinc-800 hover:bg-zinc-700">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver al proyecto
          </Button>
        </div>
      </div>
    )
  }

  const unitStats = getUnitStats()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button onClick={onReturnToProjectModal} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver al proyecto
          </Button>
          <div className="flex items-center space-x-2">
            <Button onClick={refreshData} disabled={refreshing} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Actualizando..." : "Actualizar datos"}
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="autoRefresh"
                checked={autoRefresh}
                onCheckedChange={(checked) => setAutoRefresh(checked === true)}
              />
              <Label htmlFor="autoRefresh" className="text-sm">
                Auto-actualizar
              </Label>
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
              Departamentos
            </TabsTrigger>
            <TabsTrigger value="garage" className="data-[state=active]:bg-zinc-700">
              Cochera
            </TabsTrigger>
          </TabsList>

          <TabsContent value="garage">
            <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                  Mapa de Cocheras - Nivel {currentGarageLevel}
                </h2>
                <div className="flex justify-center space-x-4 mb-4">
                  {garageLevels.map((level) => (
                    <Button
                      key={level}
                      onClick={() => setCurrentGarageLevel(level)}
                      variant={currentGarageLevel === level ? "default" : "outline"}
                    >
                      Nivel {level}
                    </Button>
                  ))}
                </div>
                <div className="relative aspect-video">
                  <Image
                    src={garagePlans[currentGarageLevel as keyof typeof garagePlans] || "/placeholder.svg"}
                    alt={`Cocheras Nivel ${currentGarageLevel}`}
                    fill
                    className="object-contain pointer-events-none"
                  />

                  <div className="absolute inset-0 z-10">
                    <svg viewBox="0 120 1600 600" className="w-full h-full" style={{ pointerEvents: "all" }}>
                      {getParkingSpotsByLevel(currentGarageLevel).map((spot) => {
                        const coords = spot.coordinates.split(",").map(Number)
                        const isAssigned = !!getParkingSpotUnit(spot.id)
                        if (coords.length === 4) {
                          return (
                            <rect
                              key={spot.id}
                              x={coords[0]}
                              y={coords[1]}
                              width={coords[2] - coords[0]}
                              height={coords[3] - coords[1]}
                              fill={isAssigned ? "#ef4444" : "#22c55e"}
                              stroke="white"
                              strokeWidth="2"
                              opacity="0.7"
                              onClick={() => handleParkingSpotClick(spot)}
                              style={{ cursor: "pointer" }}
                              className="hover:opacity-100 transition-opacity"
                            />
                          )
                        }
                        return null
                      })}
                    </svg>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-sm text-zinc-300">Libre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-sm text-zinc-300">Asignada</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apartments">
            {/* Floor Selection */}
            <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Selecciona un piso</h2>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <button
                      onClick={() => handleFloorClick(Math.max(0, currentFloor - 1))}
                      className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronLeft />
                    </button>
                    <span className="mx-4 text-lg font-bold">
                      {currentFloor === 0 ? "Planta Baja" : currentFloor === 5 ? "Penthouses" : `Piso ${currentFloor}`}
                    </span>
                    <button
                      onClick={() => handleFloorClick(Math.min(5, currentFloor + 1))}
                      className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {floors.map((floor) => (
                      <motion.button
                        key={floor}
                        onClick={() => handleFloorClick(floor)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold ${
                          currentFloor === floor ? "bg-zinc-800" : "bg-zinc-700 hover:bg-zinc-600"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {floor === 0 ? "PB" : floor === 5 ? "PH" : floor}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floor Plan with Image Map */}
              <div className="relative aspect-video">
                <Image
                  src={getFloorPlanImage() || "/placeholder.svg"}
                  alt={`Plano ${currentFloorData.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "contain" }}
                  className="pointer-events-none"
                />

                <div className="absolute inset-0 z-10">
                  <svg viewBox="0 0 1000 530" className="w-full h-full" style={{ pointerEvents: "all" }}>
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
                          fill={getRealStatusColor(apartment)}
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
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold">{currentFloorData.name}</h3>
                <p className="text-zinc-400 text-sm">Selecciona los departamentos para ver su estado.</p>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-green-400">Disponibles</p>
                  <p className="text-lg font-bold text-green-400">{unitStats.available}</p>
                </div>
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-yellow-400">Reservados</p>
                  <p className="text-lg font-bold text-yellow-400">{unitStats.reserved}</p>
                </div>
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-red-400">Vendidos</p>
                  <p className="text-lg font-bold text-red-400">{unitStats.sold}</p>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-400">Bloqueados</p>
                  <p className="text-lg font-bold text-blue-400">{unitStats.blocked}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Apartment Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border-zinc-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Departamento {selectedApartment?.unitNumber}</DialogTitle>
            </DialogHeader>

            {selectedApartment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-zinc-400">Estado</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getRealStatusColor(selectedApartment) }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {getStatusLabel(getRealStatus(selectedApartment))}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Superficie Total</Label>
                    <p className="font-semibold">{formatArea(selectedApartment.totalArea)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold text-green-400">{formatPrice(selectedApartment.saleValue)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio por m²</Label>
                    <p className="font-semibold">
                      {formatPrice(selectedApartment.saleValue / selectedApartment.totalArea)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold">Detalles del Departamento</h4>
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
                      <span className="text-zinc-400">Cocheras:</span>
                      <span>{selectedApartment.parkingSpots}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Cocheras Asignadas
                  </h4>
                  {getUnitParking(selectedApartment.unitNumber).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {getUnitParking(selectedApartment.unitNumber).map((parkingId) => (
                        <Badge key={parkingId} variant="secondary" className="bg-blue-600/20 text-blue-400">
                          {parkingId}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-400 text-sm">Sin cocheras asignadas</p>
                  )}
                </div>

                <div className="p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Propietario Actual
                  </h4>
                  {unitOwners[selectedApartment.unitNumber] ? (
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {unitOwners[selectedApartment.unitNumber].name}
                      </p>
                      <p className="flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        {unitOwners[selectedApartment.unitNumber].email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {unitOwners[selectedApartment.unitNumber].phone}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {unitOwners[selectedApartment.unitNumber].type}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-zinc-400">Sin asignar</p>
                  )}
                </div>

                {!action && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleActionClick("addOwner")}
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {unitOwners[selectedApartment.unitNumber] ? "Cambiar Propietario" : "Añadir Propietario"}
                    </Button>

                    <Button
                      onClick={() => handleActionClick("assignParking")}
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      <Car className="mr-2 h-4 w-4" />
                      Asignar Cochera
                    </Button>

                    <Button onClick={handleDownloadFloorPlan} className="w-full bg-slate-600 hover:bg-slate-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar plano
                    </Button>

                    {getRealStatus(selectedApartment) === "DISPONIBLE" && (
                      <>
                        <Button
                          onClick={() => handleActionClick("block")}
                          className="w-full bg-orange-600 hover:bg-orange-700"
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

                    {getRealStatus(selectedApartment) === "bloqueado" && (
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

                    {getRealStatus(selectedApartment) === "reservado" && (
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

                    {getRealStatus(selectedApartment) === "VENDIDO" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="w-full bg-slate-600 hover:bg-slate-700">
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

                {/* Add Owner Action */}
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
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => handleSearchClientes(e.target.value)}
                            className="pl-10 text-white bg-zinc-800 border-zinc-700"
                          />
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {isLoadingClientes ? (
                            <div className="text-center py-4 text-zinc-400">Cargando clientes...</div>
                          ) : filteredClientes.length === 0 ? (
                            <div className="text-center py-4 text-zinc-400">No hay clientes disponibles</div>
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
                          <Button onClick={handleAssignOwner} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Asignar como Propietario
                          </Button>
                        )}

                        <Button
                          onClick={() => setAction(null)}
                          variant="outline"
                          className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <h5 className="font-medium text-white">Crear Nuevo Cliente</h5>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="newNombre" className="text-white">
                              Nombre
                            </Label>
                            <Input
                              id="newNombre"
                              value={newClienteData.nombre}
                              onChange={(e) => setNewClienteData({ ...newClienteData, nombre: e.target.value })}
                              className="text-white bg-zinc-800 border-zinc-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newApellido" className="text-white">
                              Apellido
                            </Label>
                            <Input
                              id="newApellido"
                              value={newClienteData.apellido}
                              onChange={(e) => setNewClienteData({ ...newClienteData, apellido: e.target.value })}
                              className="text-white bg-zinc-800 border-zinc-700"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="newTelefono" className="text-white">
                            Teléfono
                          </Label>
                          <Input
                            id="newTelefono"
                            type="tel"
                            value={newClienteData.telefono}
                            onChange={(e) => setNewClienteData({ ...newClienteData, telefono: e.target.value })}
                            className="text-white bg-zinc-800 border-zinc-700"
                          />
                        </div>

                        <div>
                          <Label htmlFor="newEmail" className="text-white">
                            Email
                          </Label>
                          <Input
                            id="newEmail"
                            type="email"
                            value={newClienteData.email}
                            onChange={(e) => setNewClienteData({ ...newClienteData, email: e.target.value })}
                            className="text-white bg-zinc-800 border-zinc-700"
                          />
                        </div>

                        <div className="flex space-x-2">
                          <Button onClick={createNewCliente} className="flex-1 bg-green-600 hover:bg-green-700">
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

                {/* Block/Reserve/Sell Forms */}
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
                      </>
                    )}
                    <div>
                      <Label htmlFor="price" className="text-white">
                        Precio
                      </Label>
                      <Input
                        id="price"
                        type="text"
                        value={formData.price || formatPrice(selectedApartment.saleValue)}
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
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
                      {action === "block"
                        ? "Confirmar Bloqueo"
                        : action === "reserve" || action === "directReserve"
                          ? "Confirmar Reserva"
                          : "Confirmar Venta"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setAction(null)}
                      variant="outline"
                      className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                    >
                      Cancelar
                    </Button>
                  </form>
                )}

                {/* Unblock/Cancel/Release Forms */}
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
                    <Button
                      type="button"
                      onClick={() => setAction(null)}
                      variant="outline"
                      className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                    >
                      Cancelar
                    </Button>
                  </form>
                )}

                {/* Assign Parking Form */}
                {action === "assignParking" && selectedApartment && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Asignar Cocheras a {selectedApartment.unitNumber}</h4>
                    <Tabs
                      value={String(parkingAssignmentLevel)}
                      onValueChange={(value) => setParkingAssignmentLevel(Number(value))}
                      className="mb-4"
                    >
                      <TabsList className="grid w-full grid-cols-1 bg-zinc-800">
                        {garageLevels.map((level) => (
                          <TabsTrigger key={level} value={String(level)} className="data-[state=active]:bg-zinc-700">
                            Nivel {level}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {garageLevels.map((level) => (
                        <TabsContent key={level} value={String(level)}>
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {getAvailableParkingForLevel(level).length === 0 ? (
                              <div className="text-center py-4 text-zinc-400">
                                No hay cocheras disponibles en este nivel.
                              </div>
                            ) : (
                              getAvailableParkingForLevel(level).map((parkingSpot) => (
                                <div
                                  key={parkingSpot.id}
                                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                    selectedParkingsForAssignment[parkingSpot.id]
                                      ? "border-indigo-500 bg-indigo-500/20"
                                      : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700"
                                  }`}
                                  onClick={() =>
                                    setSelectedParkingsForAssignment((prev) => ({
                                      ...prev,
                                      [parkingSpot.id]: !prev[parkingSpot.id],
                                    }))
                                  }
                                >
                                  <div className="flex justify-between items-center">
                                    <p className="font-medium text-white">
                                      {parkingSpot.number} - {parkingSpot.type === "simple" ? "Simple" : "Doble"}
                                    </p>
                                    <p className="text-sm text-zinc-400">{formatPrice(parkingSpot.price)}</p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                    <Button
                      onClick={handleConfirmParkingAssignment}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      Confirmar Asignación de Cocheras
                    </Button>
                    <Button
                      onClick={() => setAction(null)}
                      variant="outline"
                      className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}

                {/* Confirmation Dialogs */}
                {(confirmReservation || confirmCancelReservation || confirmRelease) && (
                  <div className="space-y-4">
                    <p className="text-yellow-400">
                      {confirmReservation
                        ? "¿Confirmar reserva del departamento?"
                        : confirmCancelReservation
                          ? "¿Confirmar cancelación de la reserva?"
                          : "¿Confirmar liberación del departamento?"}
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

        {/* Parking spot modal */}
        <Dialog open={isParkingSpotModalOpen} onOpenChange={setIsParkingSpotModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Cochera {selectedParkingSpot?.number}</DialogTitle>
            </DialogHeader>
            {selectedParkingSpot && (
              <div className="space-y-4">
                <DialogDescription className="text-zinc-300 space-y-2">
                  <p>
                    <strong>Tipo:</strong> {selectedParkingSpot.type === "simple" ? "Simple" : "Doble"}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    <span className={getParkingSpotUnit(selectedParkingSpot.id) ? "text-red-400" : "text-green-400"}>
                      {getParkingSpotUnit(selectedParkingSpot.id) ? "Asignada" : "Libre"}
                    </span>
                  </p>
                  <p>
                    <strong>Precio:</strong> {formatPrice(selectedParkingSpot.price)}
                  </p>
                  {getParkingSpotUnit(selectedParkingSpot.id) && (
                    <p>
                      <strong>Asignada a:</strong> Unidad {getParkingSpotUnit(selectedParkingSpot.id)}
                    </p>
                  )}
                </DialogDescription>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsParkingSpotModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
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
