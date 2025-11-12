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
import { Badge } from "@/components/ui/badge"
import {
  getBoulevardUnitsByFloor,
  getBoulevardUnitById,
  getBoulevardFloorImage,
  boulevardFloorCoordinates,
  getBoulevardGarageSpotsByLevel,
  type BoulevardUnit,
  type BoulevardGarageSpot,
} from "@/lib/dome-boulevar-data"
import { useUnitStorage } from "@/lib/hooks/useUnitStorage"

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
}

let notyf: Notyf | null = null

const API_BASE_URL = "https://adndashboard.squareweb.app/api"

type DomeBoulevardFloorPlanProps = {
  floorNumber?: number | null
  onReturnToProjectModal: () => void
}

const floors = Array.from({ length: 12 }, (_, i) => i + 1)
const garageLevels = [1, 2, 3]

// Garage plan images for Dome Boulevard
const garagePlans = {
  1: "/planos/boulevard/cochera/nivel1.png",
  2: "/planos/boulevard/cochera/nivel2.png",
  3: "/planos/boulevard/cochera/nivel3.png",
}

export function DomeBoulevardFloorPlan({ floorNumber, onReturnToProjectModal }: DomeBoulevardFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedUnit, setSelectedUnit] = useState<BoulevardUnit | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityLog, setActivityLog] = useState<string[]>([])
  const { user } = useAuth()
  const [action, setAction] = useState<
    "block" | "reserve" | "sell" | "unblock" | "directReserve" | "cancelReservation" | "release" | "addOwner" | null
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
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [selectedGarageSpot, setSelectedGarageSpot] = useState<BoulevardGarageSpot | null>(null)
  const [isGarageParkingModalOpen, setIsGarageParkingModalOpen] = useState(false)

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
  const { unitOwners, addOwner } = useUnitStorage("boulevard")

  // Initialize Notyf
  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  useEffect(() => {
    if (action === "addOwner") {
      loadClientes()
    }
  }, [action])

  const loadClientes = useCallback(async () => {
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
  }, [])

  const createNewCliente = useCallback(async () => {
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
  }, [newClienteData, loadClientes])

  // Obtener datos del piso seleccionado
  const getCurrentFloorData = useCallback(() => {
    const units = getBoulevardUnitsByFloor(currentFloor)
    return {
      level: currentFloor,
      name: `Piso ${currentFloor}`,
      apartments: units,
    }
  }, [currentFloor])

  const currentFloorData = getCurrentFloorData()

  const handleUnitClick = useCallback((unit: BoulevardUnit) => {
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
      | "addOwner",
  ) => {
    setAction(actionType)
    setConfirmReservation(actionType === "reserve" && selectedUnit !== null && selectedUnit.status === "BLOQUEADO")
    setConfirmCancelReservation(actionType === "cancelReservation")
    setConfirmRelease(actionType === "release")
  }

  const handleSearchClientes = useCallback(
    (term: string) => {
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
    },
    [clientes],
  )

  const handleAssignOwner = useCallback(async () => {
    if (!selectedCliente || !selectedUnit) return

    try {
      addOwner(selectedUnit.id, {
        name: `${selectedCliente.nombre} ${selectedCliente.apellido}`,
        email: selectedCliente.email,
        phone: selectedCliente.telefono,
        type: selectedCliente.tipo,
        assignedAt: new Date().toISOString(),
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
  }, [selectedCliente, selectedUnit, addOwner])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUnit || !user) return

    try {
      // Simular actualización
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
      const description = `${user.name} ${action === "block" ? "bloqueó" : action === "reserve" || action === "directReserve" ? "reservó" : action === "sell" ? "vendió" : "liberó"} la unidad ${selectedUnit.unitNumber}`
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

    const filePath = "/general/planosgenerales/Planos_DOME-Palermo-Boulevard.pdf"
    const link = document.createElement("a")
    link.href = filePath
    link.download = "Plano_Boulevard.pdf"
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
        filePath = "/general/precios/Lista_DOME-Palermo-Boulevard.pdf"
        break
      case "Plano del edificio":
        filePath = "/general/planosgenerales/Planos_DOME-Palermo-Boulevard.pdf"
        break
      case "Plano de la cochera":
        filePath = "/general/cocheras/Cochera_DOME-Palermo-Boulevard.pdf"
        break
      case "Brochure":
        filePath = "/general/brochures/Brochure_DOME-Palermo-Boulevard.pdf"
        break
      case "Ficha técnica":
        filePath = "/general/especificaciones/Especificaciones_DOME-Palermo-Boulevard.pdf"
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

  // Obtener la imagen del plano para el piso actual
  const getFloorPlanImage = () => {
    return getBoulevardFloorImage(currentFloor) || "/placeholder.svg?height=600&width=800"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISPONIBLE":
        return "#10B981"
      case "VENDIDO":
        return "#EF4444"
      case "RESERVADO":
        return "#F59E0B"
      case "BLOQUEADO":
        return "#6B7280"
      default:
        return "#6B7280"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DISPONIBLE":
        return "Disponible"
      case "VENDIDO":
        return "Vendido"
      case "RESERVADO":
        return "Reservado"
      case "BLOQUEADO":
        return "Bloqueado"
      default:
        return status
    }
  }

  const handleGarageSpotClick = useCallback((spot: BoulevardGarageSpot) => {
    setSelectedGarageSpot(spot)
    setIsGarageParkingModalOpen(true)
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
              Unidades
            </TabsTrigger>
            <TabsTrigger value="garage" className="data-[state=active]:bg-zinc-700">
              Cochera
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
                      onClick={() => handleFloorClick(Math.min(12, currentFloor + 1))}
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
                  src={getFloorPlanImage() || "/placeholder.svg"}
                  alt={`Plano ${currentFloorData.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "contain" }}
                  className="pointer-events-none"
                />

                {/* SVG overlay for clickable areas */}
                <div className="absolute inset-0 z-10">
                  <svg viewBox="0 0 920 860" className="w-full h-full" style={{ pointerEvents: "all" }}>
                    {boulevardFloorCoordinates[currentFloor as keyof typeof boulevardFloorCoordinates]?.map((coord) => {
                      const unit = getBoulevardUnitById(coord.id)
                      if (!unit) return null

                      return (
                        <polygon
                          key={unit.id}
                          points={coord.coords}
                          fill={getStatusColor(unit.status)}
                          stroke="white"
                          strokeWidth="2"
                          opacity="0.7"
                          onClick={() => handleUnitClick(unit)}
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
                <p className="text-zinc-400 text-sm">Selecciona las unidades para ver su estado.</p>
              </div>
            </div>
          </TabsContent>

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
                    src={
                      garagePlans[currentGarageLevel as keyof typeof garagePlans] ||
                      "/placeholder.svg?height=600&width=800" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={`Cocheras Nivel ${currentGarageLevel}`}
                    fill
                    className="object-contain pointer-events-none"
                  />

                  {/* SVG overlay for clickable garage spots */}
                  {(currentGarageLevel === 1 || currentGarageLevel === 3) && (
                    <div className="absolute inset-0 z-10">
                      <svg viewBox="0 0 975 860" className="w-full h-full" style={{ pointerEvents: "all" }}>
                        {getBoulevardGarageSpotsByLevel(currentGarageLevel).map((spot) => (
                          <polygon
                            key={spot.id}
                            points={spot.coords}
                            fill={getStatusColor(spot.status)}
                            stroke="white"
                            strokeWidth="2"
                            opacity="0.7"
                            onClick={() => handleGarageSpotClick(spot)}
                            style={{ cursor: "pointer" }}
                            className="hover:opacity-100 transition-opacity"
                          />
                        ))}
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Legend */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 mr-2 rounded"></div>
                <span className="text-sm">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-400 mr-2 rounded"></div>
                <span className="text-sm">Reservado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-400 mr-2 rounded"></div>
                <span className="text-sm">Vendido</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-400 mr-2 rounded"></div>
                <span className="text-sm">Bloqueado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[500px] bg-zinc-900 text-white overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {selectedUnit ? `Detalles de la unidad ${selectedUnit.unitNumber}` : "Detalles"}
              </DialogTitle>
            </DialogHeader>
            {selectedUnit && (
              <div className="space-y-4">
                <DialogDescription className="text-zinc-300 space-y-2">
                  <p>
                    <strong>Estado:</strong> {getStatusLabel(selectedUnit.status)}
                  </p>
                  <p>
                    <strong>Precio:</strong> USD {selectedUnit.saleValue.toLocaleString()}
                  </p>
                  <p>
                    <strong>Superficie:</strong> {selectedUnit.totalArea}m²
                  </p>
                  <p>
                    <strong>Descripción:</strong> {selectedUnit.description}
                  </p>
                  <p>
                    <strong>Orientación:</strong> {selectedUnit.orientation}
                  </p>
                  <p>
                    <strong>Piso:</strong> {selectedUnit.floor}
                  </p>

                  {unitOwners[selectedUnit.id] && (
                    <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
                      <h4 className="font-semibold text-green-400 mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Propietario Actual
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center">
                          <User className="w-3 h-3 mr-2" />
                          {unitOwners[selectedUnit.id].name}
                        </p>
                        <p className="flex items-center">
                          <Mail className="w-3 h-3 mr-2" />
                          {unitOwners[selectedUnit.id].email}
                        </p>
                        <p className="flex items-center">
                          <Phone className="w-3 h-3 mr-2" />
                          {unitOwners[selectedUnit.id].phone}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {unitOwners[selectedUnit.id].type}
                        </Badge>
                      </div>
                    </div>
                  )}
                </DialogDescription>

                {!action && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => handleActionClick("addOwner")}
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {unitOwners[selectedUnit.id] ? "Cambiar Propietario" : "Añadir Propietario"}
                    </Button>

                    {selectedUnit.status === "DISPONIBLE" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="bg-blue-600 hover:bg-blue-700 w-full">
                          <Download className="mr-2 h-4 w-4" /> Descargar plano
                        </Button>
                        <Button
                          onClick={() => handleActionClick("block")}
                          className="bg-blue-600 hover:bg-blue-700 w-full"
                        >
                          Bloquear
                        </Button>
                        <Button
                          onClick={() => handleActionClick("directReserve")}
                          className="bg-green-600 hover:bg-green-700 w-full"
                        >
                          Reservar
                        </Button>
                      </>
                    )}
                    {selectedUnit.status === "BLOQUEADO" && (
                      <>
                        <Button
                          onClick={() => handleActionClick("reserve")}
                          className="bg-green-600 hover:bg-green-700 w-full"
                        >
                          Reservar
                        </Button>
                        <Button
                          onClick={() => handleActionClick("unblock")}
                          className="bg-red-600 hover:bg-red-700 w-full"
                        >
                          Liberar Bloqueo
                        </Button>
                      </>
                    )}
                    {selectedUnit.status === "RESERVADO" && (
                      <>
                        <Button
                          onClick={() => handleActionClick("sell")}
                          className="bg-green-600 hover:bg-green-700 w-full"
                        >
                          Vender
                        </Button>
                        <Button
                          onClick={() => handleActionClick("cancelReservation")}
                          className="bg-red-600 hover:bg-red-700 w-full"
                        >
                          Cancelar Reserva
                        </Button>
                      </>
                    )}
                    {selectedUnit.status === "VENDIDO" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="bg-blue-600 hover:bg-blue-700 w-full">
                          Descargar contrato
                        </Button>
                        <Button
                          onClick={() => handleActionClick("release")}
                          className="bg-yellow-600 hover:bg-yellow-700 w-full"
                        >
                          Liberar unidad
                        </Button>
                      </>
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
                      </>
                    )}
                    <div>
                      <Label htmlFor="price" className="text-white">
                        Precio
                      </Label>
                      <Input
                        id="price"
                        type="text"
                        value={formData.price || `USD ${selectedUnit.saleValue.toLocaleString()}`}
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

        <Dialog open={isGarageParkingModalOpen} onOpenChange={setIsGarageParkingModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Cochera {selectedGarageSpot?.spotNumber}</DialogTitle>
            </DialogHeader>
            {selectedGarageSpot && (
              <div className="space-y-4">
                <DialogDescription className="text-zinc-300 space-y-2">
                  <p>
                    <strong>Nivel:</strong> {selectedGarageSpot.level}
                  </p>
                  <p>
                    <strong>Estado:</strong> {getStatusLabel(selectedGarageSpot.status)}
                  </p>
                  <p>
                    <strong>Precio:</strong> USD {selectedGarageSpot.price.toLocaleString()}
                  </p>
                </DialogDescription>

                <div className="space-y-2">
                  {selectedGarageSpot.status === "DISPONIBLE" && (
                    <>
                      <Button
                        onClick={() => {
                          if (notyf) notyf.success("Cochera bloqueada")
                          setIsGarageParkingModalOpen(false)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                      >
                        Bloquear
                      </Button>
                      <Button
                        onClick={() => {
                          if (notyf) notyf.success("Cochera reservada")
                          setIsGarageParkingModalOpen(false)
                        }}
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        Reservar
                      </Button>
                    </>
                  )}
                  {selectedGarageSpot.status === "BLOQUEADO" && (
                    <>
                      <Button
                        onClick={() => {
                          if (notyf) notyf.success("Cochera reservada")
                          setIsGarageParkingModalOpen(false)
                        }}
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        Reservar
                      </Button>
                      <Button
                        onClick={() => {
                          if (notyf) notyf.success("Bloqueo liberado")
                          setIsGarageParkingModalOpen(false)
                        }}
                        className="bg-red-600 hover:bg-red-700 w-full"
                      >
                        Liberar Bloqueo
                      </Button>
                    </>
                  )}
                  {selectedGarageSpot.status === "RESERVADO" && (
                    <>
                      <Button
                        onClick={() => {
                          if (notyf) notyf.success("Cochera vendida")
                          setIsGarageParkingModalOpen(false)
                        }}
                        className="bg-green-600 hover:bg-green-700 w-full"
                      >
                        Vender
                      </Button>
                      <Button
                        onClick={() => {
                          if (notyf) notyf.success("Reserva cancelada")
                          setIsGarageParkingModalOpen(false)
                        }}
                        className="bg-red-600 hover:bg-red-700 w-full"
                      >
                        Cancelar Reserva
                      </Button>
                    </>
                  )}
                  {selectedGarageSpot.status === "VENDIDO" && (
                    <Button
                      onClick={() => {
                        if (notyf) notyf.success("Cochera liberada")
                        setIsGarageParkingModalOpen(false)
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 w-full"
                    >
                      Liberar Cochera
                    </Button>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsGarageParkingModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
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
