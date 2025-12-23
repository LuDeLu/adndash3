"use client"
import { useState, useCallback, useEffect, useRef, useMemo } from "react"
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
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  type BerutiApartmentStatus,
} from "@/lib/dome-beruti-data"
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

interface UnitOwner {
  name: string
  email: string
  phone: string
  type: string
  assignedAt: string
  assignedBy?: string
}

interface ActivityEntry {
  timestamp: Date
  description: string
  unitId: string
  action: string
  user: string
}

type DomeBerutiFloorPlanProps = {
  floorNumber?: number | null
  onBack: () => void
}

const floors = Array.from({ length: 14 }, (_, i) => i + 1)
const garageLevels = [1, 2, 3]
const API_BASE_URL = "https://adndashboard.squareweb.app/api"

const garagePlans = {
  1: "/planos/beruti/cochera/nivel1.png",
  2: "/planos/beruti/cochera/nivel2.png",
  3: "/planos/beruti/cochera/nivel3.png",
}

export function DomeBerutiFloorPlan({ floorNumber, onBack }: DomeBerutiFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedUnit, setSelectedUnit] = useState<BerutiApartment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuth()
  type Action =
    | "block"
    | "reserve"
    | "sell"
    | "unblock"
    | "directReserve"
    | "cancelReservation"
    | "release"
    | "addOwner"
    | "assignParking"
    | "removeOwner"

  const [action, setAction] = useState<Action | null>(null)
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
  const [selectedParkingSpot, setSelectedParkingSpot] = useState<BerutiParkingSpot | null>(null)
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

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

  const [selectedParkingsForAssignment, setSelectedParkingsForAssignment] = useState<{ [key: string]: boolean }>({})
  const [parkingAssignmentLevel, setParkingAssignmentLevel] = useState(1)
  const [isAssigningApartmentFromParking, setIsAssigningApartmentFromParking] = useState(false)
  const [apartmentAssignmentFloor, setApartmentAssignmentFloor] = useState(1)

  // Initialize Notyf
  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  const {
    unitOwners,
    addOwner,
    removeOwner,
    parkingAssignments,
    assignParking,
    getUnitParking,
    isParkingSpotAssigned,
    getParkingSpotUnit,
    updateStatus,
    unitStatuses,
    refresh,
  } = useUnitStorage("beruti")

  const getRealStatus = useCallback(
    (apartment: BerutiApartment): BerutiApartmentStatus => {
      const override = unitStatuses[apartment.unitNumber]
      if (override && override.status) {
        return override.status
      }
      return apartment.status
    },
    [unitStatuses],
  )

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
    setSelectedCliente(null)
  }, [])

  const handleFloorClick = (floor: number) => {
    setCurrentFloor(floor)
    setSelectedUnit(null)
    setIsModalOpen(false)
  }

  const handleActionClick = (
    actionType:
      | "block"
      | "reserve"
      | "sell"
      | "unblock"
      | "directReserve"
      | "cancelReservation"
      | "release"
      | "addOwner"
      | "assignParking"
      | "removeOwner",
  ) => {
    setAction(actionType)
    setConfirmReservation(
      actionType === "reserve" && selectedUnit !== null && getRealStatus(selectedUnit) === "BLOQUEADO",
    )
    setConfirmCancelReservation(actionType === "cancelReservation")
    setConfirmRelease(actionType === "release")

    if (actionType === "assignParking" && selectedUnit) {
      const currentParking = getUnitParking(selectedUnit.unitNumber)
      const initialSelection: { [key: string]: boolean } = {}
      currentParking.forEach((parkingId) => {
        initialSelection[parkingId] = true
      })
      setSelectedParkingsForAssignment(initialSelection)
      setParkingAssignmentLevel(1)
    }

    // Add handler for removeOwner action
    if (actionType === "removeOwner") {
      // No specific state changes needed for this action, handled directly in handleRemoveOwner
    }
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
        if (notyf) notyf.error("Error al cargar la lista de clientes")
      }
    } catch (error) {
      console.error("Error al cargar clientes:", error)
      if (notyf) notyf.error("Error de conexión al cargar clientes")
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
        if (notyf) notyf.success("Cliente creado exitosamente")
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
        if (notyf) notyf.error("Error al crear el cliente")
      }
    } catch (error) {
      console.error("Error al crear cliente:", error)
      if (notyf) notyf.error("Error de conexión al crear cliente")
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
    if (!selectedCliente || !selectedUnit) return

    try {
      addOwner(selectedUnit.unitNumber, {
        name: `${selectedCliente.nombre} ${selectedCliente.apellido}`,
        email: selectedCliente.email,
        phone: selectedCliente.telefono,
        type: selectedCliente.tipo,
        assignedAt: new Date().toISOString(),
        assignedBy: user?.name || "Usuario",
      })

      if (notyf) {
        notyf.success(`Propietario asignado a la unidad ${selectedUnit.unitNumber}`)
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

  const handleRemoveOwner = async () => {
    if (!selectedUnit) return

    try {
      removeOwner(selectedUnit.unitNumber)

      if (notyf) {
        notyf.success(`Propietario removido de la unidad ${selectedUnit.unitNumber}`)
      }

      setAction(null)
      setSelectedCliente(null)
      setSearchTerm("")
      setShowCreateClient(false)
    } catch (error) {
      console.error("Error al remover propietario:", error)
      if (notyf) notyf.error("Error al remover propietario")
    }
  }

  const handleConfirmParkingAssignment = async () => {
    if (!selectedUnit) return

    try {
      const parkingSpotIds = Object.entries(selectedParkingsForAssignment)
        .filter(([_, isSelected]) => isSelected)
        .map(([parkingId]) => parkingId)

      await assignParking(selectedUnit.unitNumber, parkingSpotIds)

      if (notyf) {
        if (parkingSpotIds.length > 0) {
          notyf.success(`Cocheras asignadas a la unidad ${selectedUnit.unitNumber}: ${parkingSpotIds.join(", ")}`)
        } else {
          notyf.success(`Se removieron las cocheras de la unidad ${selectedUnit.unitNumber}`)
        }
      }

      // Log activity
      const timestamp = new Date().toLocaleString()
      const description = `${user?.name || "Usuario"} ${parkingSpotIds.length > 0 ? `asignó cocheras (${parkingSpotIds.join(", ")})` : "removió cocheras"} de la unidad ${selectedUnit.unitNumber}`
      // setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog]) // This line seems redundant with the useMemo hook below

      setAction(null)
      setSelectedParkingsForAssignment({})
    } catch (error) {
      console.error("Error al asignar cocheras:", error)
      if (notyf) notyf.error("Error al asignar cocheras")
    }
  }

  const getParkingInfo = (parkingId: string) => {
    return berutiParkingSpots.find((p) => p.id === parkingId)
  }

  const getAvailableParkingForLevel = (level: number) => {
    return berutiParkingSpots.filter((parking) => {
      const isCorrectLevel = parking.level === level
      const assignedToUnit = getParkingSpotUnit(parking.id)
      // Show if: belongs to current unit OR not assigned to anyone
      const isAvailable = !assignedToUnit || (selectedUnit && assignedToUnit === selectedUnit.unitNumber)
      return isCorrectLevel && isAvailable
    })
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
        await updateStatus(selectedUnit.unitNumber, {
          id: selectedUnit.id,
          status: newStatus,
          changedAt: new Date().toISOString(),
          changedBy: user.name || user.email,
          notes: formData.note || undefined,
        })

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
        // setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog]) // This line seems redundant with the useMemo hook below

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

  const getUnitStats = useCallback(() => {
    if (!currentFloorData) return { available: 0, reserved: 0, sold: 0, blocked: 0 }
    const apartments = currentFloorData.apartments
    return {
      available: apartments.filter((apt) => getRealStatus(apt) === "DISPONIBLE").length,
      reserved: apartments.filter((apt) => getRealStatus(apt) === "RESERVADO").length,
      sold: apartments.filter((apt) => getRealStatus(apt) === "VENDIDO").length,
      blocked: apartments.filter((apt) => getRealStatus(apt) === "BLOQUEADO").length,
    }
  }, [currentFloorData, getRealStatus])

  const stats = getUnitStats()

  const handleParkingSpotClick = useCallback((spot: BerutiParkingSpot) => {
    setSelectedParkingSpot(spot)
    setIsParkingModalOpen(true)
  }, [])

  const getParkingSpotApartments = useCallback(
    (parkingId: string): string[] => {
      if (!parkingAssignments) return []
      const apartmentIds: string[] = []
      Object.entries(parkingAssignments).forEach(([apartmentId, assignment]) => {
        // ParkingAssignment has parkingSpots array property
        if (assignment && assignment.parkingSpots && assignment.parkingSpots.includes(parkingId)) {
          apartmentIds.push(apartmentId)
        }
      })
      return apartmentIds
    },
    [parkingAssignments],
  )

  const handleAssignApartmentFromParking = useCallback(
    async (apartmentId: string) => {
      if (!selectedParkingSpot) return

      try {
        const currentAssignments = parkingAssignments?.[apartmentId]?.parkingSpots || []

        if (currentAssignments.includes(selectedParkingSpot.id)) {
          notyf?.error("Esta cochera ya está asignada a este departamento")
          return
        }

        const newAssignments = [...currentAssignments, selectedParkingSpot.id]
        await assignParking(apartmentId, newAssignments)

        await fetch(`${API_BASE_URL}/projects/beruti/activity-log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            apartmentId,
            action: "PARKING_ASSIGNED",
            parkingId: selectedParkingSpot.id,
            performedBy: user?.name || "Sistema",
            timestamp: new Date().toISOString(),
          }),
        })

        notyf?.success(`Cochera ${selectedParkingSpot.id} asignada a unidad ${apartmentId}`)
        setIsAssigningApartmentFromParking(false)
        setIsParkingModalOpen(false)
        await refresh()
      } catch (error) {
        console.error("Error al asignar cochera:", error)
        notyf?.error("Error al asignar la cochera")
      }
    },
    [selectedParkingSpot, parkingAssignments, user, refresh, assignParking, notyf],
  )

  const activityLog = useMemo(() => {
    const activities: ActivityEntry[] = []

    Object.entries(unitStatuses).forEach(([unitId, status]) => {
      if (status.changedAt && status.changedBy) {
        const actionLabel =
          status.status === "VENDIDO"
            ? "marcó como VENDIDA"
            : status.status === "RESERVADO"
              ? "marcó como RESERVADA"
              : status.status === "BLOQUEADO"
                ? "marcó como BLOQUEADA"
                : "liberó (DISPONIBLE)"

        activities.push({
          timestamp: new Date(status.changedAt),
          description: actionLabel,
          unitId,
          action: status.status,
          user: status.changedBy,
        })
      }
    })

    Object.entries(unitOwners).forEach(([unitId, owner]) => {
      if (owner.assignedAt) {
        activities.push({
          timestamp: new Date(owner.assignedAt),
          description: `asignó a "${owner.name}" como propietario de`,
          unitId,
          action: "OWNER_ASSIGNED",
          user: (owner as UnitOwner).assignedBy || "Sistema",
        })
      }
    })

    Object.entries(parkingAssignments).forEach(([unitId, assignment]) => {
      // ParkingAssignment has parkingSpots array and assignedAt timestamp
      if (assignment && assignment.parkingSpots && assignment.parkingSpots.length > 0 && assignment.assignedAt) {
        activities.push({
          timestamp: new Date(assignment.assignedAt),
          description: `asignó cocheras (${assignment.parkingSpots.join(", ")}) a`,
          unitId,
          action: "PARKING_ASSIGNED",
          user: assignment.assignedBy || "Sistema",
        })
      }
    })

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [unitStatuses, unitOwners, parkingAssignments])

  const formatActivityDate = (date: Date) => {
    return date.toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getGarageStatistics = () => {
    const total = berutiParkingSpots.length
    const occupied = berutiParkingSpots.filter((spot) => {
      const assignedToUnit = getParkingSpotUnit(spot.id)
      return !!assignedToUnit
    }).length
    const available = total - occupied

    return { total, occupied, available }
  }

  const getGarageStatisticsByLevel = (level: number) => {
    const levelSpots = berutiParkingSpots.filter((spot) => spot.level === level)
    const total = levelSpots.length
    const occupied = levelSpots.filter((spot) => {
      const assignedToUnit = getParkingSpotUnit(spot.id)
      return !!assignedToUnit
    }).length
    const available = total - occupied

    return { total, occupied, available }
  }

  // Load initial data

  return (
    <div className="min-h-screen  text-white">
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
            <Button onClick={refreshData} disabled={refreshing} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Actualizando..." : "Actualizar"}
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

                        const realStatus = getRealStatus(apartment)

                        return (
                          <polygon
                            key={apartment.id}
                            points={points.join(" ")}
                            fill={getBerutiStatusColor(realStatus)}
                            stroke="white"
                            strokeWidth="2"
                            opacity="0.4"
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
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg" ||
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

                          const assignedToUnit = getParkingSpotUnit(spot.id)
                          const isAssigned = !!assignedToUnit

                          return (
                            <rect
                              key={spot.id}
                              x={x1}
                              y={y1}
                              width={x2 - x1}
                              height={y2 - y1}
                              fill={isAssigned ? "#ef4444" : "#22c55e"}
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

                {/* Parking Legend */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2 bg-green-500"></div>
                    <span className="text-sm">Libre</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2 bg-red-500"></div>
                    <span className="text-sm">Asignada</span>
                  </div>
                </div>
              </div>
            </div>
                            {/* Garage Statistics Indicators */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Overall Garage Statistics */}
                  <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">Todas las Cocheras</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{getGarageStatistics().total}</div>
                        <div className="text-xs text-zinc-400 mt-1">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{getGarageStatistics().available}</div>
                        <div className="text-xs text-zinc-400 mt-1">Disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{getGarageStatistics().occupied}</div>
                        <div className="text-xs text-zinc-400 mt-1">Ocupadas</div>
                      </div>
                    </div>
                  </div>

                  {/* Current Level Statistics */}
                  <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    <h3 className="text-sm font-medium text-zinc-400 mb-3">Nivel {currentGarageLevel}</h3>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {getGarageStatisticsByLevel(currentGarageLevel).total}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {getGarageStatisticsByLevel(currentGarageLevel).available}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">Disponibles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">
                          {getGarageStatisticsByLevel(currentGarageLevel).occupied}
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">Ocupadas</div>
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
                        style={{ backgroundColor: getBerutiStatusColor(getRealStatus(selectedUnit)) }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {getBerutiStatusLabel(getRealStatus(selectedUnit))}
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

                {/* Owner Section */}
                <div className="p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Propietario Actual
                  </h4>
                  {unitOwners[selectedUnit.unitNumber] ? (
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {unitOwners[selectedUnit.unitNumber].name}
                      </p>
                      <p className="flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        {unitOwners[selectedUnit.unitNumber].email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {unitOwners[selectedUnit.unitNumber].phone}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {unitOwners[selectedUnit.unitNumber].type}
                      </Badge>
                    </div>
                  ) : (
                    <p className="text-zinc-400">Sin asignar</p>
                  )}
                </div>

                <div className="p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                    <Car className="w-4 h-4 mr-2" />
                    Cocheras Asignadas
                  </h4>
                  {(() => {
                    const assignedParkings = getUnitParking(selectedUnit.unitNumber)
                    if (assignedParkings.length > 0) {
                      return (
                        <div className="space-y-2">
                          {assignedParkings.map((parkingId) => {
                            const parkingInfo = getParkingInfo(parkingId)
                            return (
                              <div
                                key={parkingId}
                                className="flex items-center justify-between bg-zinc-700/50 p-2 rounded"
                              >
                                <div>
                                  <span className="font-medium">{parkingId}</span>
                                  {parkingInfo && (
                                    <span className="text-zinc-400 text-xs ml-2">
                                      Nivel {parkingInfo.level} - {formatBerutiPrice(parkingInfo.price)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    }
                    return <p className="text-zinc-400">Sin cocheras asignadas</p>
                  })()}
                </div>

                {!action && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleActionClick("addOwner")}
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {unitOwners[selectedUnit.unitNumber] ? "Cambiar Propietario" : "Añadir Propietario"}
                    </Button>

                    <Button
                      onClick={() => handleActionClick("assignParking")}
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      <Car className="mr-2 h-4 w-4" />
                      {getUnitParking(selectedUnit.unitNumber).length > 0 ? "Gestionar Cocheras" : "Asignar Cocheras"}
                    </Button>

                    <Button onClick={handleDownloadFloorPlan} className="w-full bg-slate-600 hover:bg-slate-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar plano
                    </Button>

                    {getRealStatus(selectedUnit) === "DISPONIBLE" && (
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

                    {getRealStatus(selectedUnit) === "BLOQUEADO" && (
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

                    {getRealStatus(selectedUnit) === "RESERVADO" && (
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

                    {getRealStatus(selectedUnit) === "VENDIDO" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="w-full bg-slate-600 hover:bg-slate-700">
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

                {/* Updated Add Owner Action section in the modal */}
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

                        <ScrollArea className="h-60">
                          <div className="space-y-2">
                            {isLoadingClientes ? (
                              <div className="text-center py-4 text-zinc-400">Cargando clientes...</div>
                            ) : filteredClientes.length === 0 ? (
                              <div className="text-center py-4 text-zinc-400">No hay clientes disponibles</div>
                            ) : (
                              filteredClientes.map((cliente) => (
                                <div
                                  key={cliente.id}
                                  onClick={() => setSelectedCliente(cliente)}
                                  className={cn(
                                    "p-3 rounded-lg border cursor-pointer transition-colors",
                                    selectedCliente?.id === cliente.id
                                      ? "border-purple-500 bg-purple-500/20"
                                      : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700",
                                  )}
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
                        </ScrollArea>

                        {selectedCliente && (
                          <Button onClick={handleAssignOwner} className="w-full bg-purple-600 hover:bg-purple-700">
                            Asignar como Propietario
                          </Button>
                        )}

                        {unitOwners[selectedUnit.unitNumber] && (
                          <Button onClick={handleRemoveOwner} className="w-full bg-red-600 hover:bg-red-700">
                            Remover Propietario Actual
                          </Button>
                        )}
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

                {action === "assignParking" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        Asignar Cocheras a Unidad {selectedUnit.unitNumber}
                      </h4>
                    </div>

                    {/* Level selector */}
                    <div className="flex justify-center space-x-2">
                      {garageLevels.map((level) => (
                        <Button
                          key={level}
                          onClick={() => setParkingAssignmentLevel(level)}
                          variant={parkingAssignmentLevel === level ? "default" : "outline"}
                          size="sm"
                          className={parkingAssignmentLevel === level ? "bg-blue-600" : "border-zinc-600"}
                        >
                          Nivel {level}
                        </Button>
                      ))}
                    </div>

                    {/* Parking spots list */}
                    <ScrollArea className="h-60">
                      <div className="space-y-2">
                        {getAvailableParkingForLevel(parkingAssignmentLevel).map((parking) => {
                          const isSelected = selectedParkingsForAssignment[parking.id] || false
                          const assignedTo = getParkingSpotUnit(parking.id)
                          const isAssignedToOther = assignedTo && assignedTo !== selectedUnit.unitNumber

                          return (
                            <div
                              key={parking.id}
                              onClick={() => {
                                if (!isAssignedToOther) {
                                  setSelectedParkingsForAssignment((prev) => ({
                                    ...prev,
                                    [parking.id]: !prev[parking.id],
                                  }))
                                }
                              }}
                              className={cn(
                                "p-3 rounded-lg border cursor-pointer transition-colors",
                                isSelected
                                  ? "border-blue-500 bg-blue-500/20"
                                  : isAssignedToOther
                                    ? "border-zinc-700 bg-zinc-800/50 opacity-50 cursor-not-allowed"
                                    : "border-zinc-700 bg-zinc-800 hover:bg-zinc-700",
                              )}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    checked={isSelected}
                                    disabled={!!isAssignedToOther}
                                    onCheckedChange={(checked) => {
                                      if (!isAssignedToOther) {
                                        setSelectedParkingsForAssignment((prev) => ({
                                          ...prev,
                                          [parking.id]: !!checked,
                                        }))
                                      }
                                    }}
                                  />
                                  <div>
                                    <p className="font-medium text-white">{parking.id}</p>
                                    <p className="text-sm text-zinc-400">
                                      Nivel {parking.level} - Tipo {parking.type}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-green-400">{formatBerutiPrice(parking.price)}</p>
                                  {isAssignedToOther && <p className="text-xs text-red-400">Asignada a {assignedTo}</p>}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>

                    {/* Currently selected summary */}
                    {Object.values(selectedParkingsForAssignment).some((v) => v) && (
                      <div className="p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
                        <p className="text-sm text-blue-300">Cocheras seleccionadas:</p>
                        <p className="font-medium text-white">
                          {Object.entries(selectedParkingsForAssignment)
                            .filter(([_, isSelected]) => isSelected)
                            .map(([parkingId]) => parkingId)
                            .join(", ")}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex space-x-2">
                      <Button onClick={handleConfirmParkingAssignment} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Guardar Asignaciones
                      </Button>
                      <Button
                        onClick={() => {
                          setAction(null)
                          setSelectedParkingsForAssignment({})
                        }}
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Block/Reserve/Sell Forms */}
                {(action === "block" || action === "directReserve" || action === "reserve" || action === "sell") && (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
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

                    <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
                      {action === "block"
                        ? "Confirmar Bloqueo"
                        : action === "reserve" || action === "directReserve"
                          ? "Confirmar Reserva"
                          : "Confirmar Venta"}
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
                  </form>
                )}

                {/* Confirmation Dialogs */}
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

        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-4">Registro de Actividades</h4>
            <ScrollArea className="h-60">
              <div className="space-y-2">
                {activityLog.map((activity, index) => (
                  <div
                    key={`${activity.unitId}-${activity.timestamp.getTime()}-${index}`}
                    className="flex items-start gap-3 text-sm py-2 border-b border-zinc-800 last:border-0"
                  >
                    <span className="text-zinc-500 whitespace-nowrap min-w-[140px]">
                      {formatActivityDate(activity.timestamp)}
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="font-medium text-amber-400">{activity.user}</span>
                      <span className="text-zinc-300">{activity.description}</span>
                      <span className="text-zinc-400">la unidad</span>
                      <span className="font-semibold text-white bg-zinc-700 px-2 py-0.5 rounded">
                        {activity.unitId}
                      </span>
                    </div>
                  </div>
                ))}
                {activityLog.length === 0 && (
                  <p className="text-sm text-zinc-500 text-center py-4">No hay actividades registradas</p>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

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
                      {(() => {
                        const assignedApartments = getParkingSpotApartments(selectedParkingSpot.id)
                        return (
                          <>
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: assignedApartments.length > 0 ? "#ef4444" : "#22c55e" }}
                            />
                            <Badge variant="outline" className="capitalize">
                              {assignedApartments.length > 0 ? "Asignada" : "Libre"}
                            </Badge>
                          </>
                        )
                      })()}
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

                {(() => {
                  const assignedApartments = getParkingSpotApartments(selectedParkingSpot.id)
                  if (assignedApartments.length > 0) {
                    return (
                      <div className="p-3 bg-zinc-800 rounded">
                        <Label className="text-zinc-400">Asignada a:</Label>
                        <div className="space-y-1 mt-1">
                          {assignedApartments.map((aptId) => (
                            <p key={aptId} className="font-semibold">
                              Unidad {aptId}
                            </p>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setIsAssigningApartmentFromParking(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Asignar departamento
              </Button>
              <Button onClick={() => setIsParkingModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAssigningApartmentFromParking} onOpenChange={setIsAssigningApartmentFromParking}>
          <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Asignar departamento a cochera {selectedParkingSpot?.id}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-zinc-400 mb-2 block">Seleccionar piso</Label>
                <div className="grid grid-cols-7 gap-2">
                  {floors.map((floor) => (
                    <Button
                      key={floor}
                      variant={apartmentAssignmentFloor === floor ? "default" : "outline"}
                      size="sm"
                      onClick={() => setApartmentAssignmentFloor(floor)}
                      className={cn(
                        apartmentAssignmentFloor === floor
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700",
                      )}
                    >
                      {floor}
                    </Button>
                  ))}
                </div>
              </div>

              <ScrollArea className="h-[300px] rounded-md border border-zinc-800 p-4">
                <div className="space-y-2">
                  {getBerutiFloorData(apartmentAssignmentFloor)?.apartments.map((apartment) => {
                    const status = getRealStatus(apartment)
                    const currentParkingSpots = parkingAssignments?.[apartment.id]?.parkingSpots || []
                    const hasParkingSpot = currentParkingSpots.includes(selectedParkingSpot?.id || "")

                    return (
                      <div
                        key={apartment.id}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer transition-colors",
                          hasParkingSpot
                            ? "bg-blue-900/20 border-blue-600"
                            : "bg-zinc-800 border-zinc-700 hover:bg-zinc-700",
                        )}
                        onClick={() => !hasParkingSpot && handleAssignApartmentFromParking(apartment.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getBerutiStatusColor(status) }}
                            />
                            <div>
                              {/* Use unitNumber instead of id for apartment display */}
                              <p className="font-medium text-white">Unidad {apartment.unitNumber}</p>
                              <p className="text-xs text-zinc-400">{apartment.totalArea}m²</p>
                            </div>
                          </div>
                          {hasParkingSpot && (
                            <Badge variant="outline" className="bg-blue-600">
                              Ya asignada
                            </Badge>
                          )}
                        </div>
                        {currentParkingSpots.length > 0 && (
                          <div className="mt-2 text-xs text-zinc-400">
                            Cocheras:
                            {currentParkingSpots.join(", ")}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>

            <DialogFooter>
              <Button
                onClick={() => setIsAssigningApartmentFromParking(false)}
                className="bg-zinc-700 hover:bg-zinc-600"
              >
                Cancelar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
