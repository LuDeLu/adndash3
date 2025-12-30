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
  MapPin,
  Home,
  User,
  Search,
  Plus,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/app/auth/auth-context"
import { domePalermoData, formatPrice, type GarageLevel, type ApartmentStatus } from "@/lib/dome-palermo-data"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useUnitStorage } from "@/lib/hooks/useUnitStorage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

let notyf: Notyf | null = null

interface DomePalermoFloorPlanProps {
  onBack: () => void
  initialFloor?: number
}

type UnitStatusType = "DISPONIBLE" | "RESERVADO" | "VENDIDO" | "BLOQUEADO"

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
  orientation?: string
  type?: string
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
  price: string
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

const floors = Array.from({ length: 9 }, (_, i) => i + 1)
const garageLevels = [1, 2, 3]

const garagePlans = {
  1: "/planos/resi/cochera/nivel1.png",
  2: "/planos/resi/cochera/nivel2.png",
  3: "/planos/resi/cochera/nivel3.png",
}

const statusToInternal = (status: ApartmentStatus): UnitStatusType => {
  switch (status) {
    case "available":
      return "DISPONIBLE"
    case "reserved":
      return "RESERVADO"
    case "sold":
      return "VENDIDO"
    case "blocked":
      return "BLOQUEADO"
    default:
      return "DISPONIBLE"
  }
}

const internalToStatus = (status: UnitStatusType): ApartmentStatus => {
  switch (status) {
    case "DISPONIBLE":
      return "available"
    case "RESERVADO":
      return "reserved"
    case "VENDIDO":
      return "sold"
    case "BLOQUEADO":
      return "blocked"
    default:
      return "available"
  }
}

const getStatusColor = (status: UnitStatusType): string => {
  switch (status) {
    case "DISPONIBLE":
      return "#87f5af"
    case "RESERVADO":
      return "#edcf53"
    case "VENDIDO":
      return "#f57f7f"
    case "BLOQUEADO":
      return "#7f7fff"
    default:
      return "#87f5af"
  }
}

export function DomePalermoFloorPlan({ onBack, initialFloor }: DomePalermoFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(initialFloor || 1)
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null)
  const [selectedParkingSpot, setSelectedParkingSpot] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeView, setActiveView] = useState<"apartments" | "garage">("apartments")
  const [currentGarageLevel, setCurrentGarageLevel] = useState<GarageLevel>(1)
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
    | "removeOwner"
    | null
  >(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    price: "",
    note: "",
    reservationOrder: null as File | null,
  })
  const [loading, setLoading] = useState(false)
  // Removed activityLog from state, it's now computed
  const [confirmReservation, setConfirmReservation] = useState(false)
  const [confirmCancelReservation, setConfirmCancelReservation] = useState(false)
  const [confirmRelease, setConfirmRelease] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
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
  } = useUnitStorage("resi")

  const [isAssigningApartmentFromParking, setIsAssigningApartmentFromParking] = useState(false)
  const [assigningApartmentFloor, setAssigningApartmentFloor] = useState(1)

  const [selectedParkingsForAssignment, setSelectedParkingsForAssignment] = useState<{ [key: string]: boolean }>({})
  const [parkingAssignmentLevel, setParkingAssignmentLevel] = useState<GarageLevel>(1)

  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  const getRealStatus = useCallback(
    (apartmentId: string, originalStatus?: ApartmentStatus): UnitStatusType => {
      const override = unitStatuses[apartmentId]
      if (override && override.status) {
        return override.status
      }
      if (originalStatus) {
        return statusToInternal(originalStatus)
      }
      return "DISPONIBLE"
    },
    [unitStatuses],
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
      if (assignment.assignedAt && assignment.parkingSpots.length > 0) {
        activities.push({
          timestamp: new Date(assignment.assignedAt),
          description: `asignó cocheras (${assignment.parkingSpots.join(", ")}) a`,
          unitId,
          action: "PARKING_ASSIGNED",
          user: "Sistema",
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
      addOwner(selectedApartment, {
        name: `${selectedCliente.nombre} ${selectedCliente.apellido}`,
        email: selectedCliente.email,
        phone: selectedCliente.telefono,
        type: selectedCliente.tipo,
        assignedAt: new Date().toISOString(),
        assignedBy: user?.name || user?.email || "Desconocido",
      })

      if (notyf) {
        notyf.success(`Propietario asignado al departamento ${selectedApartment}`)
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
    if (!selectedApartment) return

    try {
      removeOwner(selectedApartment)

      if (notyf) {
        notyf.success(`Propietario removido del departamento ${selectedApartment}`)
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
    // Reset apartment assignment state when opening apartment modal
    setIsAssigningApartmentFromParking(false)
  }

  const handleParkingSpotClick = (spotId: string) => {
    setSelectedParkingSpot(spotId)
    setSelectedApartment(null)
    setIsModalOpen(true)
    setAction(null)
    setIsAssigningApartmentFromParking(false)
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

  const handleActionClick = (newAction: typeof action) => {
    setAction(newAction)
    if (newAction === "assignParking" && selectedApartment) {
      const currentParkings = getUnitParking(selectedApartment)
      const initialSelection: { [key: string]: boolean } = {}
      currentParkings.forEach((parkingId) => {
        initialSelection[parkingId] = true
      })
      setSelectedParkingsForAssignment(initialSelection)
      setParkingAssignmentLevel(1)
    } else if (newAction === "reserve" && selectedApartment && floorData?.apartments[selectedApartment]) {
      const realStatus = getRealStatus(selectedApartment, floorData.apartments[selectedApartment].status)
      if (realStatus === "BLOQUEADO") {
        setConfirmReservation(true)
      }
    } else if (newAction === "cancelReservation") {
      setConfirmCancelReservation(true)
    } else if (newAction === "release") {
      setConfirmRelease(true)
    } else if (newAction === "removeOwner") {
      setConfirmCancelReservation(true) // Reusing this state for confirmation
    }
  }

  const handleConfirmParkingAssignment = async () => {
    if (!selectedApartment) return

    try {
      const parkingSpotIds = Object.entries(selectedParkingsForAssignment)
        .filter(([_, isSelected]) => isSelected)
        .map(([parkingId]) => parkingId)

      await assignParking(selectedApartment, parkingSpotIds)

      if (notyf) {
        if (parkingSpotIds.length > 0) {
          notyf.success(`Cocheras asignadas a la unidad ${selectedApartment}: ${parkingSpotIds.join(", ")}`)
        } else {
          notyf.success(`Se removieron las cocheras de la unidad ${selectedApartment}`)
        }
      }

      const timestamp = new Date().toLocaleString()
      const description = `${user?.name || "Usuario"} ${parkingSpotIds.length > 0 ? `asignó cocheras (${parkingSpotIds.join(", ")})` : "removió cocheras"} de la unidad ${selectedApartment}`
      // No longer using setActivityLog directly, it's computed
      // setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog])

      setAction(null)
      setSelectedParkingsForAssignment({})
    } catch (error) {
      console.error("Error al asignar cocheras:", error)
      if (notyf) notyf.error("Error al asignar cocheras")
    }
  }

  const getParkingInfo = (parkingId: string) => {
    return domePalermoData.parkingSpots.find((p) => p.id === parkingId)
  }

  const getAvailableParkingForLevel = (level: GarageLevel) => {
    const spots = domePalermoData.getParkingSpotsByLevel(level)
    return spots.filter((parking) => {
      const assignedToUnit = getParkingSpotUnit(parking.id)
      const isAvailable = !assignedToUnit || (selectedApartment && assignedToUnit === selectedApartment)
      return isAvailable
    })
  }

  const handleAssignApartmentFromParking = () => {
    setIsAssigningApartmentFromParking(true)
    setAssigningApartmentFloor(1)
  }

  const handleSelectApartmentForParking = async (apartmentId: string) => {
    if (!selectedParkingSpot || !user) return

    try {
      const currentAssignments = parkingAssignments[apartmentId] || { parkingSpots: [] }
      const updatedParkingSpots = [...currentAssignments.parkingSpots, selectedParkingSpot]

      await assignParking(apartmentId, updatedParkingSpots)

      notyf?.success(`Cochera ${selectedParkingSpot} asignada al departamento ${apartmentId} exitosamente`)

      setIsAssigningApartmentFromParking(false)
      setIsModalOpen(false)
      setSelectedParkingSpot(null)
    } catch (error) {
      console.error("Error assigning parking from parking modal:", error)
      notyf?.error("Error al asignar la cochera al departamento")
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!selectedApartment && !selectedParkingSpot) || !user) return

    setLoading(true)
    try {
      let newStatus: UnitStatusType = "DISPONIBLE"

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

      if (action === "removeOwner") {
        await handleRemoveOwner()
        setLoading(false)
        return
      }

      // Update status in useUnitStorage
      if (selectedApartment) {
        await updateStatus(selectedApartment, {
          id: selectedApartment,
          status: newStatus,
          changedAt: new Date().toISOString(),
          changedBy: user.name || user.email,
          notes: formData.note || undefined,
        })
      }

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
              : action === "unblock"
                ? "desbloqueó"
                : action === "cancelReservation"
                  ? "canceló la reserva de"
                  : action === "release"
                    ? "liberó"
                    : ""
      } ${itemType} ${itemId}${action === "sell" && formData.price ? ` por ${formatPrice(formData.price)}` : ""}`

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
      setSelectedParkingSpot(null) // Clear selected parking spot after form submit
    } catch (error) {
      console.error("Error during form submission:", error)
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

  const refreshData = async () => {
    setRefreshing(true)
    // Simulate data fetching
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In a real application, you would fetch new data here
    // For now, we'll just reset the refreshing state
    setRefreshing(false)
    if (notyf) notyf.success("Datos actualizados")
  }

  const getUnitStats = useCallback(() => {
    if (!floorData) return { available: 0, reserved: 0, sold: 0, blocked: 0 }
    const apartments = Object.entries(floorData.apartments)
    return {
      available: apartments.filter(([id, apt]) => getRealStatus(id, apt.status) === "DISPONIBLE").length,
      reserved: apartments.filter(([id, apt]) => getRealStatus(id, apt.status) === "RESERVADO").length,
      sold: apartments.filter(([id, apt]) => getRealStatus(id, apt.status) === "VENDIDO").length,
      blocked: apartments.filter(([id, apt]) => getRealStatus(id, apt.status) === "BLOQUEADO").length,
    }
  }, [floorData, getRealStatus])

  const getGarageStatistics = () => {
    const allSpots = garageLevels.flatMap((level) => domePalermoData.getParkingSpotsByLevel(level as GarageLevel))
    const currentLevelSpots = domePalermoData.getParkingSpotsByLevel(currentGarageLevel)

    const calculateStats = (spots: any[]) => {
      const total = spots.length
      const occupied = spots.filter((spot) => !!getParkingSpotUnit(spot.id)).length
      const available = total - occupied
      return { total, occupied, available }
    }

    return {
      all: calculateStats(allSpots),
      current: calculateStats(currentLevelSpots),
    }
  }

  const garageStats = getGarageStatistics()

  const stats = getUnitStats()

  const selectedSpot = selectedParkingSpot ? parkingSpots.find((spot) => spot.id === selectedParkingSpot) : null

  const selectedApartmentData = selectedApartment && floorData ? floorData.apartments[selectedApartment] : null
  const selectedApartmentRealStatus =
    selectedApartment && selectedApartmentData ? getRealStatus(selectedApartment, selectedApartmentData.status) : null

  const getApartmentsByFloor = useCallback((floor: number) => {
    const floorData = domePalermoData.getFloorData(floor)
    return floorData ? Object.entries(floorData.apartments) : []
  }, [])

  return (
    <div className="min-h-screen  text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
                    >
                      <ChevronLeft />
                    </button>
                    <span className="mx-4 text-lg font-bold">Piso {currentFloor}</span>
                    <button
                      onClick={() => handleFloorClick(Math.min(9, currentFloor + 1))}
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
                        {Object.entries(floorData.apartments).map(([aptId, aptData]) => {
                          const realStatus = getRealStatus(aptId, aptData.status)
                          return (
                            <path
                              key={aptId}
                              d={floorData.svgPaths[aptId] || ""}
                              fill={getStatusColor(realStatus)}
                              stroke="black"
                              strokeWidth="10"
                              opacity="0.7"
                              onClick={() => handleApartmentClick(aptId)}
                              style={{ cursor: "pointer" }}
                              className="hover:opacity-100 transition-opacity"
                            />
                          )
                        })}
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
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getStatusColor("DISPONIBLE") }}
                    ></div>
                    <span className="text-sm">Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getStatusColor("RESERVADO") }}
                    ></div>
                    <span className="text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: getStatusColor("VENDIDO") }}></div>
                    <span className="text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getStatusColor("BLOQUEADO") }}
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
                  <div className="absolute inset-0 z-10">
                    <svg viewBox="100 0 1350 850" className="w-full h-full" style={{ pointerEvents: "all" }}>
                      {parkingSpots.map((spot) => {
                        const assignedToUnit = getParkingSpotUnit(spot.id)
                        const isAssigned = !!assignedToUnit
                        return (
                          <g
                            key={spot.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => handleParkingSpotClick(spot.id)}
                          >
                            <path
                              d={spot.path}
                              fill={isAssigned ? "rgba(239, 68, 68, 0.5)" : "rgba(135, 245, 175, 0.3)"}
                              stroke={isAssigned ? "#ef4444" : "#87f5af"}
                              strokeWidth="2"
                              className="hover:opacity-100 transition-opacity"
                            />
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold">Cocheras Nivel {currentGarageLevel}</h3>
                  <p className="text-zinc-400 text-sm">
                    Haz clic en las cocheras para ver su información. Precio:{" "}
                    {domePalermoData.parkingConfig.prices[currentGarageLevel]}
                  </p>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded mr-2 bg-green-400"></div>
                      <span className="text-sm">Disponible</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded mr-2 bg-red-400"></div>
                      <span className="text-sm">Asignada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Todas las Cocheras</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-2xl font-bold text-white">{garageStats.all.total}</div>
                    <div className="text-xs text-zinc-400">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{garageStats.all.available}</div>
                    <div className="text-xs text-zinc-400">Disponibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">{garageStats.all.occupied}</div>
                    <div className="text-xs text-zinc-400">Ocupadas</div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Nivel {currentGarageLevel}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-2xl font-bold text-white">{garageStats.current.total}</div>
                    <div className="text-xs text-zinc-400">Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{garageStats.current.available}</div>
                    <div className="text-xs text-zinc-400">Disponibles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">{garageStats.current.occupied}</div>
                    <div className="text-xs text-zinc-400">Ocupadas</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Apartment/Parking Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white border-zinc-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedApartment
                  ? `Departamento ${selectedApartment}`
                  : selectedParkingSpot
                    ? `Cochera ${selectedParkingSpot}`
                    : ""}
              </DialogTitle>
            </DialogHeader>

            {selectedApartment && floorData && floorData.apartments[selectedApartment] && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-zinc-400">Estado</Label>
                    <div className="flex items-center mt-1">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getStatusColor(selectedApartmentRealStatus || "DISPONIBLE") }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {selectedApartmentRealStatus === "DISPONIBLE" && "Disponible"}
                        {selectedApartmentRealStatus === "RESERVADO" && "Reservado"}
                        {selectedApartmentRealStatus === "VENDIDO" && "Vendido"}
                        {selectedApartmentRealStatus === "BLOQUEADO" && "Bloqueado"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Superficie</Label>
                    <p className="font-semibold">{floorData.apartments[selectedApartment].surface}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold">
                      {typeof floorData.apartments[selectedApartment].price === "string" &&
                      floorData.apartments[selectedApartment].price.startsWith("$")
                        ? floorData.apartments[selectedApartment].price
                        : new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(
                            Number.parseInt(floorData.apartments[selectedApartment].price.replace(/\D/g, "")) || 0,
                          )}
                    </p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Piso</Label>
                    <p className="font-semibold">{currentFloor}</p>
                  </div>
                </div>

                <div className="space-y-2 p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold">Detalles de la Unidad</h4>
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Orientación:</span>
                      <span>{floorData.apartments[selectedApartment].orientation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Tipo:</span>
                      <span>{floorData.apartments[selectedApartment].type}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800 rounded-lg">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Propietario Actual
                  </h4>
                  {unitOwners[selectedApartment] ? (
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center">
                        <User className="w-3 h-3 mr-2" />
                        {unitOwners[selectedApartment].name}
                      </p>
                      <p className="flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        {unitOwners[selectedApartment].email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {unitOwners[selectedApartment].phone}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {unitOwners[selectedApartment].type}
                      </Badge>
                      <p className="text-xs text-zinc-500">Asignado por: {unitOwners[selectedApartment].assignedBy}</p>
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
                    const assignedParkings = getUnitParking(selectedApartment)
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
                                      Nivel {parkingInfo.level} - {parkingInfo.price}
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
                      {unitOwners[selectedApartment] ? "Cambiar Propietario" : "Añadir Propietario"}
                    </Button>
                    {unitOwners[selectedApartment] && (
                      <Button
                        onClick={() => handleActionClick("removeOwner")}
                        variant="outline"
                        className="w-full border-red-600 text-red-500 hover:bg-red-600/20"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Remover Propietario
                      </Button>
                    )}

                    <Button
                      onClick={() => handleActionClick("assignParking")}
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      <Car className="mr-2 h-4 w-4" />
                      {getUnitParking(selectedApartment).length > 0 ? "Gestionar Cocheras" : "Asignar Cocheras"}
                    </Button>

                    <Button onClick={handleDownloadFloorPlan} className="w-full bg-slate-600 hover:bg-slate-700">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar plano
                    </Button>

                    {selectedApartmentRealStatus === "DISPONIBLE" && (
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

                    {selectedApartmentRealStatus === "BLOQUEADO" && (
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

                    {selectedApartmentRealStatus === "RESERVADO" && (
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

                    {selectedApartmentRealStatus === "VENDIDO" && (
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

                {/* Add Owner Action - Updated with client search/create */}
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

                        {unitOwners[selectedApartment] && (
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

                    {/* Cancel button for add owner */}
                    {!showCreateClient && (
                      <Button
                        onClick={() => {
                          setAction(null)
                          setSelectedCliente(null)
                          setSearchTerm("")
                        }}
                        variant="outline"
                        className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                )}

                {action === "assignParking" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        Asignar Cocheras a Unidad {selectedApartment}
                      </h4>
                    </div>

                    {/* Level selector */}
                    <div className="flex justify-center space-x-2">
                      {garageLevels.map((level) => (
                        <Button
                          key={level}
                          onClick={() => setParkingAssignmentLevel(level as GarageLevel)}
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
                      <div className="space-y-2 pr-2">
                        {getAvailableParkingForLevel(parkingAssignmentLevel).map((parking) => {
                          const isSelected = selectedParkingsForAssignment[parking.id] || false
                          const assignedTo = getParkingSpotUnit(parking.id)
                          const isAssignedToOther = assignedTo && assignedTo !== selectedApartment

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
                              <div className="flex items-center justify-between">
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
                                      Nivel {parking.level} - {parking.price}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-green-400">{parking.price}</p>
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

                    {action === "sell" && (
                      <div>
                        <Label htmlFor="price" className="text-white">
                          Precio de Venta
                        </Label>
                        <Input
                          id="price"
                          value={formData.price}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            const formatted = value ? `$${Number.parseInt(value).toLocaleString("es-AR")}` : ""
                            setFormData({ ...formData, price: formatted })
                          }}
                          className="text-white bg-zinc-800 border-zinc-700"
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

                    <div className="flex space-x-2">
                      <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                        {loading ? "Procesando..." : "Confirmar"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setAction(null)}
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}

                {/* Unblock/Cancel Reservation/Release Forms */}
                {(action === "unblock" || action === "cancelReservation" || action === "release") && (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
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

                    <div className="flex space-x-2">
                      <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                        {loading ? "Procesando..." : "Confirmar"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setAction(null)}
                        variant="outline"
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}

                {action === "removeOwner" && (
                  <div className="space-y-4">
                    <p className="text-zinc-300">
                      Estás a punto de remover el propietario del departamento {selectedApartment}. ¿Estás seguro?
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={handleFormSubmit} className="flex-1 bg-red-600 hover:bg-red-700">
                        Confirmar Remoción
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setAction(null)
                          setConfirmCancelReservation(false)
                        }}
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

            {/* Parking Spot Modal Content */}
            {selectedParkingSpot && selectedSpot && (
              <div className="space-y-4">
                {isAssigningApartmentFromParking ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Seleccionar departamento</h3>
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Seleccionar Piso</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((floor) => (
                            <Button
                              key={floor}
                              onClick={() => setAssigningApartmentFloor(floor)}
                              variant={assigningApartmentFloor === floor ? "default" : "outline"}
                              size="sm"
                              className={assigningApartmentFloor === floor ? "bg-blue-600" : "border-zinc-600"}
                            >
                              {floor}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <ScrollArea className="h-[300px] w-full rounded-md border border-zinc-700 p-4">
                        <div className="space-y-2">
                          {getApartmentsByFloor(assigningApartmentFloor).map(([id, apt]) => {
                            const realStatus = getRealStatus(id)
                            const hasOwner = unitOwners && unitOwners[id]
                            const currentAssignedParkings = getUnitParking(id)
                            const isAlreadyAssigned = currentAssignedParkings.includes(selectedParkingSpot)

                            return (
                              <div
                                key={id}
                                className={cn(
                                  "p-3 rounded-lg border cursor-pointer transition-colors",
                                  "bg-zinc-800 border-zinc-700 hover:bg-zinc-700",
                                  isAlreadyAssigned && "opacity-50",
                                )}
                                onClick={() => !isAlreadyAssigned && handleSelectApartmentForParking(id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold">{id}</p>
                                    <p className="text-sm text-zinc-400">
                                      {apt.surface} - {apt.price}
                                    </p>
                                    {hasOwner && <p className="text-xs text-blue-400 mt-1">{unitOwners[id].name}</p>}
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge
                                      variant="outline"
                                      style={{
                                        borderColor: getStatusColor(realStatus),
                                      }}
                                    >
                                      {realStatus}
                                    </Badge>
                                    {currentAssignedParkings.length > 0 && (
                                      <span className="text-xs text-zinc-400">
                                        {isAlreadyAssigned
                                          ? "Ya tiene esta cochera"
                                          : `${currentAssignedParkings.length} cochera(s)`}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-zinc-400">Estado</Label>
                        <div className="flex items-center mt-1">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: getParkingSpotUnit(selectedParkingSpot) ? "#ef4444" : "#22c55e" }}
                          />
                          <Badge variant="outline" className="capitalize">
                            {getParkingSpotUnit(selectedParkingSpot) ? "Asignada" : "Disponible"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-zinc-400">Nivel</Label>
                        <p className="font-semibold">{selectedSpot.level}</p>
                      </div>
                      <div>
                        <Label className="text-zinc-400">Precio</Label>
                        <p className="font-semibold text-green-400">{selectedSpot.price}</p>
                      </div>
                      <div>
                        <Label className="text-zinc-400">ID</Label>
                        <p className="font-semibold">{selectedSpot.id}</p>
                      </div>
                    </div>

                    {getParkingSpotUnit(selectedParkingSpot) && (
                      <div className="p-4 bg-zinc-800 rounded-lg">
                        <h4 className="font-semibold text-blue-400 mb-2 flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Asignada a
                        </h4>
                        <p className="font-medium">Departamento {getParkingSpotUnit(selectedParkingSpot)}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Footer buttons */}
            <div className="flex gap-2 mt-4">
              {selectedParkingSpot && !isAssigningApartmentFromParking && (
                <>
                  <Button onClick={handleAssignApartmentFromParking} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Building className="w-4 h-4 mr-2" />
                    Asignar departamento
                  </Button>
                  <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1">
                    Cerrar
                  </Button>
                </>
              )}
              {isAssigningApartmentFromParking && (
                <>
                  <Button
                    onClick={() => setIsAssigningApartmentFromParking(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </>
              )}
              {/* Close button for apartment modal if not assigning */}
              {selectedApartment && !action && !isAssigningApartmentFromParking && (
                <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1">
                  Cerrar
                </Button>
              )}
            </div>
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
      </div>
    </div>
  )
}
