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
  Search,
  Plus,
  User,
  RefreshCw,
  Phone,
  Mail,
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
  apartProjectInfo,
  getApartUnitsByFloor,
  getApartFloorImage,
  apartFloorCoordinates,
  apartParking,
  type ApartUnit,
  getApartStatusLabel,
  formatApartPrice,
  formatApartArea,
  updateApartUnitStatus,
  getApartStatusColor,
} from "@/lib/dome-apart-data"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useUnitStorage } from "@/lib/hooks/useUnitStorage"

let notyf: Notyf | null = null

type DomeApartFloorPlanProps = {
  floorNumber?: number | null
  onReturnToProjectModal: () => void
}

const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const garageLevels = [1, 2, 3]

// Garage plan images for Dome Apart
const garagePlans = {
  1: "/planos/apart/cochera/nivel1.png",
  2: "/planos/apart/cochera/nivel2.png",
  3: "/planos/apart/cochera/nivel3.png",
}

// Coordenadas de las cocheras para cada nivel
const apartGarageCoordinates = {
  1: [
    {
      id: "a1",
      coords: "455,109,440,216,444,226,442,241,452,248,488,255,495,250,499,233,506,227,517,118,507,109,489,106,472,104",
    },
    {
      id: "a2",
      coords: "552,127,531,236,535,245,533,260,546,269,580,272,591,263,592,250,600,240,610,136,595,128,569,122",
    },
    { id: "a3", coords: "222,283,215,318,216,342,334,362,356,356,360,336,360,306,334,295" },
    { id: "a4", coords: "208,379,202,411,203,436,254,445,326,453,341,445,347,409,343,393,294,387,247,380" },
    { id: "a5", coords: "189,488,184,525,219,536,296,547,321,546,328,533,330,506,331,490,317,486,298,480,199,468" },
    {
      id: "a6",
      coords:
        "379,634,380,735,385,750,407,755,428,754,443,747,446,637,441,631,443,615,435,615,429,610,415,607,398,607,391,610,385,617",
    },
    {
      id: "a7",
      coords:
        "478,631,477,734,480,745,484,750,498,755,530,754,539,749,541,722,541,639,537,632,536,619,531,610,511,608,495,608,486,610",
    },
    {
      id: "a8",
      coords: "569,633,571,748,588,754,599,754,622,752,630,749,633,636,629,630,631,619,623,609,599,607,585,607,576,611",
    },
    {
      id: "a9",
      coords:
        "679,634,679,748,703,754,716,754,729,753,738,750,742,743,744,637,739,629,739,617,733,610,723,608,712,608,691,608,686,613",
    },
    {
      id: "a10",
      coords: "785,634,786,744,795,753,816,756,837,753,847,745,850,637,847,630,846,618,838,609,798,607,789,611",
    },
    {
      id: "a11",
      coords:
        "887,632,889,750,896,752,902,752,921,755,936,752,946,752,952,740,951,637,950,630,947,617,942,609,928,607,908,607,900,608,892,615",
    },
  ],
  2: [
    {
      id: "b1",
      coords: "465,112,447,218,450,229,449,243,456,250,490,255,497,252,504,245,511,233,516,180,523,132,519,113,487,107",
    },
    {
      id: "b2",
      coords:
        "559,127,536,236,540,246,537,260,549,267,576,274,589,269,594,268,595,253,599,247,614,160,614,140,605,131,588,129,581,128",
    },
    {
      id: "b3",
      coords: "231,316,241,288,353,296,358,301,372,304,378,313,376,330,375,348,372,356,364,363,349,359,345,364,233,346",
    },
    {
      id: "b4",
      coords: "226,380,221,403,219,430,229,438,330,454,338,450,350,453,361,444,365,415,358,398,347,395,338,390,266,381",
    },
    {
      id: "b5",
      coords: "214,471,205,489,204,512,206,530,313,546,323,543,335,548,343,538,348,527,350,506,348,495,338,486,326,483",
    },
    {
      id: "b6",
      coords:
        "386,628,387,734,388,748,418,750,440,748,449,740,451,632,446,629,446,613,435,607,419,607,407,607,398,609,390,612",
    },
    {
      id: "b7",
      coords:
        "480,630,482,743,496,749,515,748,528,748,542,742,546,633,543,627,539,610,530,607,520,607,510,606,499,604,492,607,487,613,482,622",
    },
    {
      id: "b8",
      coords:
        "588,632,592,738,598,745,609,748,620,748,636,748,644,749,651,744,653,719,654,631,650,626,652,616,645,606,611,605,600,606,593,616,595,627",
    },
    {
      id: "b9",
      coords:
        "686,629,688,738,691,745,697,746,703,746,713,748,738,747,744,743,748,736,748,730,748,653,750,632,747,627,745,612,735,604,718,604,699,606,690,613",
    },
    {
      id: "b10",
      coords:
        "790,630,790,725,793,743,801,750,815,751,828,751,841,750,852,746,856,635,849,628,850,612,837,608,821,607,808,606,801,607,795,612",
    },
    {
      id: "b11",
      coords:
        "892,634,893,740,898,749,903,750,918,751,928,751,940,750,948,750,953,745,955,737,957,634,953,631,954,617,949,611,932,608,919,608,910,607,900,611,895,618",
    },
  ],
  3: [
    {
      id: "c1",
      coords:
        "455,104,450,126,434,217,437,222,437,236,445,242,459,246,471,245,480,246,490,242,492,230,499,226,511,119,501,109,478,105",
    },
    {
      id: "c2",
      coords:
        "546,122,539,149,525,230,529,239,525,253,536,260,541,262,551,264,567,268,583,262,583,249,587,245,590,228,600,158,601,143,603,131,591,124,566,120",
    },
    {
      id: "c3",
      coords:
        "227,280,218,292,215,313,214,327,217,337,240,347,272,348,288,350,306,353,314,355,326,356,339,355,351,354,358,340,361,321,362,311,357,298,346,296,337,294,323,291,310,291,290,288,275,286,257,283",
    },
    {
      id: "c4",
      coords:
        "213,374,204,389,202,419,204,431,226,438,250,439,284,444,292,447,309,448,319,446,332,449,342,441,347,405,343,394,331,390,314,382,279,381,253,377,232,375",
    },
    {
      id: "c5",
      coords:
        "197,466,188,480,186,499,187,512,188,520,194,524,204,529,225,530,259,535,281,539,287,541,296,543,302,538,314,539,326,536,330,528,331,512,331,495,327,486,322,482,310,481,304,475,288,475,269,475,257,473,241,471,230,469,221,468",
    },
    {
      id: "c6",
      coords:
        "369,624,370,681,370,708,369,726,372,739,383,742,396,743,409,743,420,742,429,740,432,731,434,629,431,623,433,611,429,602,420,596,411,598,398,597,374,599",
    },
    {
      id: "c7",
      coords:
        "464,621,467,644,466,667,466,683,467,699,464,722,467,734,475,741,490,743,503,742,512,741,519,739,527,739,529,726,527,678,529,651,530,641,531,629,530,622,525,617,527,604,518,601,511,598,493,598,481,597,469,602,470,610",
    },
    {
      id: "c8",
      coords:
        "575,620,576,643,578,659,579,676,576,704,577,719,579,736,588,741,603,741,619,740,629,740,635,736,641,721,641,709,641,697,641,685,640,671,640,661,639,651,640,644,641,633,641,624,638,617,637,609,635,599,626,597,617,595,600,595,588,594,580,603",
    },
    {
      id: "c9",
      coords:
        "672,623,674,645,675,658,674,685,674,697,672,709,673,719,674,728,678,740,685,740,696,740,704,742,711,741,719,739,729,739,732,734,734,728,738,720,737,655,737,644,740,636,740,629,738,623,733,619,735,604,725,598,711,593,694,594,680,596,674,609",
    },
    {
      id: "c10",
      coords:
        "778,623,780,644,781,656,779,678,779,702,780,713,782,730,784,738,798,739,818,741,831,741,841,735,840,724,842,707,843,694,842,685,844,665,842,647,846,639,842,621,842,612,837,598,825,597,810,597,791,595,781,602",
    },
  ],
}

interface UnitOwner {
  name: string
  email: string
  phone: string
  type: string
  assignedAt: string
  assignedBy?: string
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

const API_BASE_URL = "https://adndashboard.squareweb.app/api"

export function DomeApartFloorPlan({ floorNumber, onReturnToProjectModal }: DomeApartFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedUnit, setSelectedUnit] = useState<ApartUnit | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityLog, setActivityLog] = useState<string[]>([])
  const { user } = useAuth()
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

  const [confirmReservation, setConfirmReservation] = useState(false)
  const [confirmCancelReservation, setConfirmCancelReservation] = useState(false)
  const [confirmRelease, setConfirmRelease] = useState(false)
  const [activeView, setActiveView] = useState<"apartments" | "garage">("apartments")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedParking, setSelectedParking] = useState<string | null>(null)
  const [currentGarageLevel, setCurrentGarageLevel] = useState(1)
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [selectedParkingsForAssignment, setSelectedParkingsForAssignment] = useState<{ [key: string]: boolean }>({})
  const [parkingAssignmentLevel, setParkingAssignmentLevel] = useState(1)

  const {
    unitOwners,
    addOwner,
    removeOwner,
    parkingAssignments,
    assignParking,
    getUnitParking,
    isParkingSpotAssigned,
    getParkingSpotUnit,
  } = useUnitStorage("apart")

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
  const getCurrentFloorUnits = useCallback(() => {
    return getApartUnitsByFloor(currentFloor)
  }, [currentFloor])

  const currentFloorUnits = getCurrentFloorUnits()

  const handleUnitClick = useCallback((unit: ApartUnit) => {
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
      | "assignParking",
  ) => {
    setAction(actionType)
    setConfirmReservation(actionType === "reserve" && selectedUnit !== null && selectedUnit.status === "BLOQUEADO")
    setConfirmCancelReservation(actionType === "cancelReservation")
    setConfirmRelease(actionType === "release")

    if (actionType !== "addOwner") {
      setSelectedCliente(null)
      setSearchTerm("")
      setShowCreateClient(false)
    }

    if (actionType === "assignParking" && selectedUnit) {
      const currentParking = getUnitParking(selectedUnit.unitNumber)
      const initialSelection: { [key: string]: boolean } = {}
      currentParking.forEach((parkingId) => {
        initialSelection[parkingId] = true
      })
      setSelectedParkingsForAssignment(initialSelection)
      setParkingAssignmentLevel(1)
    }
  }

  const handleAssignOwner = async () => {
    if (!selectedCliente || !selectedUnit) return

    try {
      addOwner(selectedUnit.unitNumber, {
        name: `${selectedCliente.nombre} ${selectedCliente.apellido}`,
        email: selectedCliente.email,
        phone: selectedCliente.telefono,
        type: selectedCliente.tipo,
        assignedAt: new Date().toISOString(),
        assignedBy: "",
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

      const timestamp = new Date().toLocaleString()
      const description = `${user?.name || "Usuario"} ${parkingSpotIds.length > 0 ? `asignó cocheras (${parkingSpotIds.join(", ")})` : "removió cocheras"} de la unidad ${selectedUnit.unitNumber}`
      setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog])

      setAction(null)
      setSelectedParkingsForAssignment({})
    } catch (error) {
      console.error("Error al asignar cocheras:", error)
      if (notyf) notyf.error("Error al asignar cocheras")
    }
  }

  const getParkingInfo = (parkingId: string) => {
    return apartParking.find((p) => p.id === parkingId)
  }

  const getAvailableParkingForLevel = (level: number) => {
    const levelPrefix = level === 1 ? "a" : level === 2 ? "b" : "c"
    return apartParking.filter((parking) => {
      const isCorrectLevel = parking.id.startsWith(levelPrefix)
      const assignedToUnit = getParkingSpotUnit(parking.id)
      const isAvailable = !assignedToUnit || (selectedUnit && assignedToUnit === selectedUnit.unitNumber)
      return isCorrectLevel && isAvailable
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUnit || !user) return

    try {
      let newStatus: ApartUnit["status"] = selectedUnit.status

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

      const success = updateApartUnitStatus(selectedUnit.id, newStatus)

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

  const handleParkingClick = (parkingId: string) => {
    setSelectedParking(parkingId)
    setIsParkingModalOpen(true)
  }

  const handleDownloadFloorPlan = () => {
    if (!selectedUnit) return

    const filePath = "/general/planosgenerales/Plano_DOME-Palermo-Apartaments.pdf"
    const link = document.createElement("a")
    link.href = filePath
    link.download = "Plano_Apart_Palermo.pdf"
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
        filePath = "/general/precios/Lista_DOME-Palermo-Apartaments.pdf"
        break
      case "Plano del edificio":
        filePath = "/general/planosgenerales/Plano_DOME-Palermo-Apartaments.pdf"
        break
      case "Plano de la cochera":
        filePath = "/general/cocheras/Cochera_DOME-Palermo-Apartaments.pdf"
        break
      case "Brochure":
        filePath = "/general/brochures/Brochure_DOME-Palermo-Apartaments.pdf"
        break
      case "Ficha técnica":
        filePath = "/general/especificaciones/Especificaciones_DOME-Palermo-Apartaments.pdf"
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

  const getUnitStats = () => {
    const units = currentFloorUnits
    return {
      available: units.filter((unit) => unit.status === "DISPONIBLE").length,
      reserved: units.filter((unit) => unit.status === "RESERVADO").length,
      sold: units.filter((unit) => unit.status === "VENDIDO").length,
      blocked: units.filter((unit) => unit.status === "BLOQUEADO").length,
    }
  }

  const stats = getUnitStats()

  return (
    <div className="min-h-screen  text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button onClick={onReturnToProjectModal} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver al proyecto
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">{apartProjectInfo.name}</h1>
            <p className="text-zinc-400 flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-1" />
              {apartProjectInfo.location}
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
                  src={getApartFloorImage(currentFloor) || "/placeholder.svg?height=600&width=800"}
                  alt={`Plano del Piso ${currentFloor}`}
                  fill
                  className="object-contain pointer-events-none"
                />
                {apartFloorCoordinates[currentFloor as keyof typeof apartFloorCoordinates] && (
                  <div className="absolute inset-0 z-10">
                    <svg viewBox="0 0 1050 850" className="w-full h-full" style={{ pointerEvents: "all" }}>
                      {apartFloorCoordinates[currentFloor as keyof typeof apartFloorCoordinates].map((unitCoord) => {
                        const unit = currentFloorUnits.find((u) => u.id === unitCoord.id)
                        if (!unit) return null

                        return (
                          <polygon
                            key={unit.id}
                            points={unitCoord.coords}
                            fill={getApartStatusColor(unit.status)}
                            stroke="black"
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
                      style={{ backgroundColor: getApartStatusColor("DISPONIBLE") }}
                    ></div>
                    <span className="text-sm">Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getApartStatusColor("RESERVADO") }}
                    ></div>
                    <span className="text-sm">Reservado</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getApartStatusColor("VENDIDO") }}
                    ></div>
                    <span className="text-sm">Vendido</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: getApartStatusColor("BLOQUEADO") }}
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

                <div className="relative aspect-video">
                  <Image
                    src={
                      garagePlans[currentGarageLevel as keyof typeof garagePlans] ||
                      "/placeholder.svg?height=600&width=800" ||
                      "/placeholder.svg"
                    }
                    alt={`Cocheras Nivel ${currentGarageLevel}`}
                    fill
                    className="object-contain"
                  />
                  {/* SVG Overlay para cocheras clickeables */}
                  {apartGarageCoordinates[currentGarageLevel as keyof typeof apartGarageCoordinates] && (
                    <div className="absolute inset-0 z-10">
                      <svg viewBox="0 0 1155 860" className="w-full h-full" style={{ pointerEvents: "all" }}>
                        {apartGarageCoordinates[currentGarageLevel as keyof typeof apartGarageCoordinates].map(
                          (parkingCoord) => {
                            const parking = apartParking.find((p) => p.id === parkingCoord.id)
                            if (!parking) return null

                            const assignedToUnit = getParkingSpotUnit(parking.id)
                            const isAssigned = !!assignedToUnit

                            return (
                              <polygon
                                key={parkingCoord.id}
                                points={parkingCoord.coords}
                                fill={isAssigned ? "#ef4444" : "#22c55e"}
                                stroke="black"
                                strokeWidth="2"
                                opacity="0.7"
                                onClick={() => handleParkingClick(parkingCoord.id)}
                                style={{ cursor: "pointer" }}
                                className="hover:opacity-100 transition-opacity"
                              />
                            )
                          },
                        )}
                      </svg>
                    </div>
                  )}
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
                        style={{ backgroundColor: getApartStatusColor(selectedUnit.status) }}
                      />
                      <Badge variant="outline" className="capitalize">
                        {getApartStatusLabel(selectedUnit.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Superficie Total</Label>
                    <p className="font-semibold">{formatApartArea(selectedUnit.totalAreaWithAmenities)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio</Label>
                    <p className="font-semibold text-green-400">{formatApartPrice(selectedUnit.saleValue)}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-400">Precio por m²</Label>
                    <p className="font-semibold">{formatApartPrice(selectedUnit.pricePerSqm)}</p>
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
                      <span>{formatApartArea(selectedUnit.coveredArea)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Balcón:</span>
                      <span>{formatApartArea(selectedUnit.balconyArea)}</span>
                    </div>
                    {selectedUnit.terraceArea > 0 && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Terraza:</span>
                        <span>{formatApartArea(selectedUnit.terraceArea)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Con Amenities:</span>
                      <span>{formatApartArea(selectedUnit.totalAreaWithAmenities)}</span>
                    </div>
                  </div>
                </div>

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
                      <Button onClick={handleRemoveOwner} variant="destructive" size="sm" className="mt-2">
                        Remover Propietario
                      </Button>
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
                                      Nivel {parkingInfo.id.charAt(0).toUpperCase()} -{" "}
                                      {formatApartPrice(parkingInfo.price)}
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

                    {selectedUnit.status === "DISPONIBLE" && (
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
                          const assignedToUnit = getParkingSpotUnit(parking.id)
                          const isAssignedToOther = assignedToUnit && assignedToUnit !== selectedUnit.unitNumber

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
                                    <p className="text-sm text-zinc-400">Nivel {parking.id.charAt(0).toUpperCase()}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-green-400">{formatApartPrice(parking.price)}</p>
                                  {isAssignedToOther && (
                                    <p className="text-xs text-red-400">Asignada a {assignedToUnit}</p>
                                  )}
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
                        value={formData.price || formatApartPrice(selectedUnit.saleValue)}
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
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Parking Modal */}
        <Dialog open={isParkingModalOpen} onOpenChange={setIsParkingModalOpen}>
          <DialogContent className="sm:max-w-[400px] bg-zinc-900 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Cochera {selectedParking?.toUpperCase()}</DialogTitle>
            </DialogHeader>

            {selectedParking && (
              <div className="space-y-4">
                {(() => {
                  const parking = apartParking.find((p) => p.id === selectedParking)
                  if (!parking) return null

                  const assignedToUnit = getParkingSpotUnit(parking.id)

                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-zinc-400">Estado</Label>
                          <div className="flex items-center mt-1">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: assignedToUnit ? "#ef4444" : "#22c55e" }}
                            />
                            <Badge variant="outline" className="capitalize">
                              {assignedToUnit ? "Asignada" : "Libre"}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-zinc-400">Nivel</Label>
                          <p className="font-semibold">{parking.level}</p>
                        </div>
                        <div>
                          <Label className="text-zinc-400">Precio</Label>
                          <p className="font-semibold text-green-400">{formatApartPrice(parking.price)}</p>
                        </div>
                        <div>
                          <Label className="text-zinc-400">Condición</Label>
                          <p className="font-semibold">{parking.condition}</p>
                        </div>
                      </div>

                      {assignedToUnit && (
                        <div className="p-3 bg-zinc-800 rounded-lg">
                          <Label className="text-zinc-400">Asignada a:</Label>
                          <p className="font-semibold text-white">Unidad {assignedToUnit}</p>
                        </div>
                      )}
                    </div>
                  )
                })()}
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
