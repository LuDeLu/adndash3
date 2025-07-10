"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Download, Building, RefreshCw, Loader2, AlertCircle, Settings } from "lucide-react"
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
  DialogClose,
} from "@/components/ui/dialog"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import { useAuth } from "@/app/auth/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateApartment, fetchProjectConfigById } from "../../lib/proyectos" // Assuming invalidateCache is also here or not needed for this specific fix
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

let notyfInstance: Notyf | null = null

type ApartmentStatus = "ocupado" | "reservado" | "libre" | "bloqueado"

type ApartmentData = {
  buyer: string
  date: string
  price: string
  status: ApartmentStatus
  contractFile?: File | null
  contractUrl?: string
  phoneNumber?: string
  email?: string
  surface: string
  assignedParkings: string[]
  id?: number // ID de la base de datos del departamento
  notes?: string
  svg_path?: string
}

type ApartmentDataMap = { [key: string]: ApartmentData }

type FloorConfig = {
  id?: number
  floor_number: number
  floor_name?: string
  view_box?: string
  background_image?: string
  apartment_config?: {
    [apartmentId: string]: {
      default_price?: string
      default_surface?: string
      svg_path?: string
    }
  }
}

type ParkingSpot = {
  id: string // parking_spot_code e.g. "P1"
  level: number
  status: "libre" | "ocupado"
  assignedTo: string | null // apartment_code e.g. "1-1A"
  path: string // svg_path
  dbId?: number // database id
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

// Obtener paths desde la configuración del proyecto
const getApartmentSvgPath = (apartmentId: string, floorConfig: FloorConfig | null, projectConfig: any) => {
  // Primero intentar obtener desde apartment_config específico
  if (floorConfig?.apartment_config?.[apartmentId]?.svg_path) {
    return floorConfig.apartment_config[apartmentId].svg_path
  }

  // Luego desde configuración general del proyecto
  if (projectConfig?.apartment_svg_paths?.[apartmentId]) {
    return projectConfig.apartment_svg_paths[apartmentId]
  }

  // Fallback a path por defecto si existe
  return projectConfig?.default_apartment_svg || ""
}

const getParkingSvgPath = (parkingId: string, projectConfig: any) => {
  // Obtener desde configuración del proyecto
  if (projectConfig?.parking_svg_paths?.[parkingId]) {
    return projectConfig.parking_svg_paths[parkingId]
  }

  // Fallback a path por defecto
  return projectConfig?.default_parking_svg || ""
}

const statusColors: { [key in ApartmentStatus]: string } = {
  ocupado: "#f57f7f",
  reservado: "#edcf53",
  libre: "#87f5af",
  bloqueado: "#7f7fff",
}

interface InteractiveFloorPlanProps {
  projectId: number
  floorNumber?: number | null
  onReturnToProjectModal?: () => void
}

export default function InteractiveFloorPlan({
  projectId,
  floorNumber,
  onReturnToProjectModal,
}: InteractiveFloorPlanProps) {
  const { user } = useAuth()
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activityLog, setActivityLog] = useState<string[]>([])

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

  const [unitStats, setUnitStats] = useState<{
    disponibles: number
    reservadas: number
    vendidas: number
    bloqueadas: number
  }>({ disponibles: 0, reservadas: 0, vendidas: 0, bloqueadas: 0 })

  const [activeView, setActiveView] = useState<"apartments" | "garage">("apartments")
  const [currentGarageLevel, setCurrentGarageLevel] = useState(1)
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false)
  const [selectedParking, setSelectedParking] = useState<string | null>(null) // Stores parking_spot_code like "P1"
  const [isParkingInfoModalOpen, setIsParkingInfoModalOpen] = useState(false)

  const [projectConfig, setProjectConfig] = useState<any>(null)
  const [currentFloorConfig, setCurrentFloorConfig] = useState<FloorConfig | null>(null)
  const [apartmentsData, setApartmentsData] = useState<ApartmentDataMap>({})

  const [showParkingAssignment, setShowParkingAssignment] = useState(false)
  const [selectedParkingsForAssignment, setSelectedParkingsForAssignment] = useState<{ [key: string]: boolean }>({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && !notyfInstance) {
      notyfInstance = new Notyf({ duration: 3000, position: { x: "right", y: "top" } })
    }
  }, [])

  const fetchFullProjectData = useCallback(
    async (forceRefresh = false) => {
      if (!projectId) return
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("token") || ""
        const config = await fetchProjectConfigById(projectId, token)
        setProjectConfig(config)

        const floorConfigForCurrent = Array.isArray(config?.floorConfig)
          ? config.floorConfig.find((fc: FloorConfig) => fc.floor_number === currentFloor)
          : null
        setCurrentFloorConfig(floorConfigForCurrent)

        if (floorConfigForCurrent?.id) {
          const apartmentsResponse = await fetch(`${API_BASE_URL}/apartments/floor/${floorConfigForCurrent.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (!apartmentsResponse.ok)
            throw new Error(`Error al obtener departamentos: ${apartmentsResponse.statusText}`)
          const apartmentsApiData: any[] = await apartmentsResponse.json()

          const formattedApartments: ApartmentDataMap = {}
          apartmentsApiData.forEach((apt) => {
            let aptSvgPath = apt.svg_path
            if (!aptSvgPath) {
              aptSvgPath = getApartmentSvgPath(apt.apartment_id, floorConfigForCurrent, config)
            }

            formattedApartments[apt.apartment_id] = {
              id: apt.id,
              buyer: apt.buyer || "",
              date: apt.reservation_date || apt.sale_date || "",
              price: apt.price || floorConfigForCurrent?.apartment_config?.[apt.apartment_id]?.default_price || "",
              status: apt.status as ApartmentStatus,
              contractUrl: apt.contract_url || "",
              phoneNumber: apt.phone || "",
              email: apt.email || "",
              surface:
                apt.surface || floorConfigForCurrent?.apartment_config?.[apt.apartment_id]?.default_surface || "",
              assignedParkings: apt.assigned_parkings || [], // Ensure this is an array
              notes: apt.notes || "",
              svg_path: aptSvgPath,
            }
          })
          setApartmentsData(formattedApartments)
          updateUnitStats(formattedApartments)
        } else {
          setApartmentsData({})
          updateUnitStats({})
        }

        const parkingResponse = await fetch(`${API_BASE_URL}/parking/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!parkingResponse.ok) throw new Error(`Error al obtener cocheras: ${parkingResponse.statusText}`)
        const parkingApiData: any[] = await parkingResponse.json()

        const formattedParkingSpots: ParkingSpot[] = parkingApiData.map((spot) => ({
          dbId: spot.id,
          id: spot.parking_spot_code, // This is "P1", "P2", etc.
          level: spot.level,
          status: spot.status as "libre" | "ocupado",
          assignedTo: spot.assigned_to_apartment_code, // This is "1-1A", etc.
          path: spot.svg_path || getParkingSvgPath(spot.parking_spot_code, config), // Fallback to defaultParkingPaths
        }))
        setParkingSpots(formattedParkingSpots)

        const logsResponse = await fetch(`${API_BASE_URL}/activity-logs/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (logsResponse.ok) {
          const logsData = await logsResponse.json()
          setActivityLog(
            logsData.map((log: any) => `${new Date(log.created_at).toLocaleString()} - ${log.description}`).reverse(),
          )
        }
      } catch (err) {
        console.error("Error fetching full project data:", err)
        setError(err instanceof Error ? err.message : "Error desconocido al cargar datos del proyecto.")
        if (notyfInstance) notyfInstance.error("Error al cargar datos del proyecto.")
      } finally {
        setLoading(false)
        setRefreshing(false)
      }
    },
    [projectId, currentFloor],
  )

  useEffect(() => {
    fetchFullProjectData()
  }, [projectId, currentFloor, fetchFullProjectData])

  useEffect(() => {
    if (autoRefresh && projectId) {
      refreshIntervalRef.current = setInterval(() => {
        if (!isModalOpen && !showParkingAssignment && !isParkingModalOpen && !isParkingInfoModalOpen) {
          setRefreshing(true)
          fetchFullProjectData(true)
        }
      }, 30000)
    }
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current)
    }
  }, [
    autoRefresh,
    projectId,
    fetchFullProjectData,
    isModalOpen,
    showParkingAssignment,
    isParkingModalOpen,
    isParkingInfoModalOpen,
  ])

  const refreshDataManual = () => {
    setRefreshing(true)
    fetchFullProjectData(true)
  }

  const updateUnitStats = (currentApartments: ApartmentDataMap) => {
    const stats = Object.values(currentApartments).reduce(
      (acc, apartment) => {
        if (apartment.status === "libre") acc.disponibles++
        else if (apartment.status === "reservado") acc.reservadas++
        else if (apartment.status === "ocupado") acc.vendidas++
        else if (apartment.status === "bloqueado") acc.bloqueadas++
        return acc
      },
      { disponibles: 0, reservadas: 0, vendidas: 0, bloqueadas: 0 },
    )
    setUnitStats(stats)
  }

  const handleFloorClick = (floorNum: number) => {
    setCurrentFloor(floorNum)
    setSelectedApartment(null)
    setIsModalOpen(false)
  }

  const handleApartmentClick = (apartmentIdCode: string) => {
    setSelectedApartment(apartmentIdCode)
    const aptData = apartmentsData[apartmentIdCode]
    setFormData({
      name: aptData?.buyer || "",
      phone: aptData?.phoneNumber || "",
      email: aptData?.email || "",
      price: aptData?.price || "",
      note: aptData?.notes || "",
      reservationOrder: null,
    })
    setAction(null)
    setIsModalOpen(true)
  }

  const handleActionClick = (
    actionType: "block" | "reserve" | "sell" | "unblock" | "directReserve" | "cancelReservation" | "release",
  ) => {
    setAction(actionType)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !selectedApartment ||
      !projectId ||
      !user ||
      !currentFloorConfig?.id ||
      !apartmentsData[selectedApartment]?.id
    ) {
      if (notyfInstance) notyfInstance.error("Faltan datos para realizar la acción.")
      return
    }

    const apartmentDbId = apartmentsData[selectedApartment].id!
    let newStatus: ApartmentStatus = apartmentsData[selectedApartment].status
    let logDescription = ""

    switch (action) {
      case "block":
        newStatus = "bloqueado"
        logDescription = `${user.name} bloqueó ${selectedApartment}`
        break
      case "directReserve":
        newStatus = "reservado"
        logDescription = `${user.name} reservó (directo) ${selectedApartment} para ${formData.name}`
        break
      case "reserve":
        newStatus = "reservado"
        logDescription = `${user.name} reservó ${selectedApartment} (desde bloqueo)`
        break
      case "sell":
        newStatus = "ocupado"
        logDescription = `${user.name} vendió ${selectedApartment}`
        break
      case "unblock":
        newStatus = "libre"
        logDescription = `${user.name} liberó bloqueo de ${selectedApartment}. Nota: ${formData.note}`
        break
      case "cancelReservation":
        newStatus = "libre"
        logDescription = `${user.name} canceló reserva de ${selectedApartment}. Nota: ${formData.note}`
        break
      case "release":
        newStatus = "libre"
        logDescription = `${user.name} liberó ${selectedApartment} (vendido). Nota: ${formData.note}`
        break
      default:
        if (notyfInstance) notyfInstance.error("Acción no reconocida")
        return
    }

    if ((action === "unblock" || action === "cancelReservation" || action === "release") && !formData.note) {
      if (notyfInstance) notyfInstance.error("Se requiere una nota para esta acción.")
      return
    }

    const payload: any = {
      status: newStatus,
      price: formData.price || apartmentsData[selectedApartment].price,
      description: logDescription,
      userId: user.userId,
      userName: user.name,
      projectId: projectId,
      buyer:
        action === "directReserve" || action === "sell" || action === "block"
          ? formData.name
          : newStatus === "libre"
            ? ""
            : apartmentsData[selectedApartment].buyer,
      phone:
        action === "directReserve" || action === "sell" || action === "block"
          ? formData.phone
          : newStatus === "libre"
            ? ""
            : apartmentsData[selectedApartment].phoneNumber,
      email:
        action === "directReserve" || action === "sell" || action === "block"
          ? formData.email
          : newStatus === "libre"
            ? ""
            : apartmentsData[selectedApartment].email,
      reservation_date:
        newStatus === "reservado"
          ? new Date().toISOString().split("T")[0]
          : newStatus === "libre"
            ? null
            : apartmentsData[selectedApartment].date,
      sale_date: newStatus === "ocupado" ? new Date().toISOString().split("T")[0] : null,
      notes: formData.note || apartmentsData[selectedApartment].notes,
    }

    if (action === "sell" && formData.reservationOrder) {
      payload.contractFile = formData.reservationOrder
    }

    try {
      const success = await updateApartment(
        apartmentDbId,
        payload,
        projectId,
        currentFloor, // This might not be needed if backend derives it
        localStorage.getItem("token") || "",
        !!formData.reservationOrder,
      )
      if (success) {
        if (notyfInstance) notyfInstance.success("Departamento actualizado con éxito.")
        setIsModalOpen(false)
        setAction(null)
        setFormData({ name: "", phone: "", email: "", reservationOrder: null, price: "", note: "" })
        if (fileInputRef.current) fileInputRef.current.value = ""
        fetchFullProjectData(true)
      } else {
        throw new Error("Error al actualizar departamento desde el servicio.")
      }
    } catch (err) {
      console.error("Error updating apartment:", err)
      if (notyfInstance) notyfInstance.error((err as Error).message || "Error al actualizar el departamento.")
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData((prev) => ({ ...prev, reservationOrder: event.target.files![0] }))
    }
  }

  const handleDownloadFloorPlan = () => {
    if (!selectedApartment || !projectConfig?.files) return
    const aptFile = Array.isArray(projectConfig.files)
      ? projectConfig.files.find(
          (f: any) =>
            f.file_type === "apartment_pdf" && f.apartment_id === selectedApartment && f.floor_number === currentFloor,
        )
      : null
    if (aptFile?.file_path) {
      window.open(
        aptFile.file_path.startsWith("http") || aptFile.file_path.startsWith("/")
          ? aptFile.file_path
          : aptFile.file_path, // Use relative path directly
        "_blank",
      )
      if (notyfInstance) notyfInstance.success("Descargando plano...")
    } else {
      if (notyfInstance) notyfInstance.error("Plano no disponible para este departamento.")
    }
  }

  const handleDownloadContract = () => {
    if (!selectedApartment || !apartmentsData[selectedApartment]?.contractUrl) {
      if (notyfInstance) notyfInstance.error("Contrato no disponible.")
      return
    }
    const url = apartmentsData[selectedApartment].contractUrl!
    window.open(url.startsWith("http") || url.startsWith("/") ? url : url, "_blank")
    if (notyfInstance) notyfInstance.success("Descargando contrato...")
  }

  const handleParkingClick = (parkingSpotCode: string, level: number) => {
    // parkingSpotCode is "P1", "P2"
    const spot = parkingSpots.find((p) => p.id === parkingSpotCode && p.level === level)
    if (spot) {
      setSelectedParking(parkingSpotCode) // Store "P1", "P2"
      setCurrentGarageLevel(level)
      if (spot.status === "ocupado") {
        setIsParkingInfoModalOpen(true)
      } else {
        setIsParkingModalOpen(true)
      }
    }
  }

  const handleParkingAssignmentAction = async (assignToApartmentIdCode: string | null) => {
    // assignToApartmentIdCode is "1A", "2B"
    if (!selectedParking || !projectId || !user || !currentGarageLevel) {
      // selectedParking is "P1", "P2"
      if (notyfInstance) notyfInstance.error("Faltan datos para la acción de cochera.")
      return
    }
    const spotToUpdate = parkingSpots.find((p) => p.id === selectedParking && p.level === currentGarageLevel)
    if (!spotToUpdate?.dbId) {
      if (notyfInstance) notyfInstance.error("No se encontró la cochera en la base de datos.")
      return
    }

    const newStatus = assignToApartmentIdCode ? "ocupado" : "libre"
    // Backend expects assigned_to_apartment_code as "FLOOR-APTCODE", e.g., "1-1A"
    const assignedToDbFormat = assignToApartmentIdCode
      ? `${currentFloorConfig?.floor_number || currentFloor}-${assignToApartmentIdCode}`
      : null

    const logDesc = assignToApartmentIdCode
      ? `${user.name} asignó cochera ${selectedParking} (Nivel ${currentGarageLevel}) a depto. ${assignedToDbFormat}`
      : `${user.name} liberó cochera ${selectedParking} (Nivel ${currentGarageLevel})`

    try {
      const response = await fetch(`${API_BASE_URL}/parking/${spotToUpdate.dbId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          status: newStatus,
          assigned_to: assignedToDbFormat, // Changed key here
          userId: user.userId,
          userName: user.name,
          projectId: projectId,
          description: logDesc,
        }),
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Error al actualizar cochera.")
      }
      if (notyfInstance)
        notyfInstance.success(`Cochera ${newStatus === "ocupado" ? "asignada" : "liberada"} con éxito.`)
      setIsParkingModalOpen(false)
      setIsParkingInfoModalOpen(false)
      setSelectedParking(null)
      fetchFullProjectData(true)
    } catch (err) {
      console.error("Error updating parking spot:", err)
      if (notyfInstance) notyfInstance.error((err as Error).message || "Error al actualizar cochera.")
    }
  }

  const handleOpenParkingAssignmentModal = () => {
    if (!selectedApartment) return
    const currentAssigned = apartmentsData[selectedApartment]?.assignedParkings || []
    const initialSelection: { [key: string]: boolean } = {}
    currentAssigned.forEach((pid) => {
      // pid here is "P1", "P2"
      initialSelection[pid] = true
    })
    setSelectedParkingsForAssignment(initialSelection)
    setShowParkingAssignment(true)
  }

  const handleConfirmParkingAssignmentForApartment = async () => {
    if (!selectedApartment || !projectId || !user || !apartmentsData[selectedApartment]?.id) {
      if (notyfInstance) notyfInstance.error("Faltan datos para asignar cocheras.")
      return
    }
    const apartmentDbId = apartmentsData[selectedApartment].id!
    const parkingSpotCodesToAssign = Object.entries(selectedParkingsForAssignment) // parkingSpotCodes are "P1", "P2"
      .filter(([_, checked]) => checked)
      .map(([parkingSpotCode, _]) => parkingSpotCode)

    const logDesc = `${user.name} actualizó asignación de cocheras para depto. ${selectedApartment}: ${parkingSpotCodesToAssign.join(", ")}`

    try {
      const response = await fetch(`${API_BASE_URL}/apartments/${apartmentDbId}/assign-parking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          parking_spot_codes: parkingSpotCodesToAssign, // Send "P1", "P2"
          userId: user.userId,
          userName: user.name,
          projectId: projectId,
          description: logDesc,
        }),
      })
      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Error al asignar cocheras al departamento.")
      }
      if (notyfInstance) notyfInstance.success("Asignación de cocheras actualizada.")
      setShowParkingAssignment(false)
      fetchFullProjectData(true) // Refresh to show updated assignments
    } catch (err) {
      console.error("Error assigning parking to apartment:", err)
      if (notyfInstance) notyfInstance.error((err as Error).message || "Error al asignar cocheras.")
    }
  }

  const availableFloors: number[] = Array.isArray(projectConfig?.floorConfig)
    ? projectConfig.floorConfig.map((fc: FloorConfig) => fc.floor_number).sort((a: number, b: number) => a - b)
    : []

  const garagePlanForCurrentLevel = Array.isArray(projectConfig?.files)
    ? projectConfig.files.find((f: any) => {
        if (f.file_type !== "garage_plan") return false
        let fileLevel = Number(f.level)
        if (isNaN(fileLevel) || fileLevel === 0) {
          const nameMatch = f.file_name?.match(/Nivel\s*(\d+)/i)
          if (nameMatch && nameMatch[1]) {
            fileLevel = Number(nameMatch[1])
          } else {
            // Fallback if level is not in name
            const garageConfigLevel = projectConfig?.parking_config?.levels?.find((l: number) =>
              f.file_name?.includes(String(l)),
            )
            if (garageConfigLevel) fileLevel = garageConfigLevel
          }
        }
        return fileLevel === currentGarageLevel
      })?.file_path
    : null

  const currentAptData = selectedApartment ? apartmentsData[selectedApartment] : null

  // Helper to get text coordinates for parking spots (example, adjust as needed)
  const getParkingTextCoordinates = (path: string) => {
    if (!path || typeof path !== "string" || !path.startsWith("M")) {
      return { x: 0, y: 0 } // Default or error case
    }
    // Basic parsing: assumes "M x y L ..." format
    const parts = path
      .substring(1)
      .trim()
      .split(/[ ,LMCZzHhVvSsQqTtAa]/)
    const x = Number.parseFloat(parts[0])
    const y = Number.parseFloat(parts[1])

    // This is a very naive centroid calculation, might need a proper SVG path parser for complex shapes
    // For simple rectangular-ish paths, this might be okay.
    // A more robust solution would involve a library or more complex SVG path parsing.
    let sumX = x,
      sumY = y,
      count = 1
    for (let i = 2; i < parts.length - 1; i += 2) {
      if (parts[i] && parts[i + 1]) {
        sumX += Number.parseFloat(parts[i])
        sumY += Number.parseFloat(parts[i + 1])
        count++
      }
    }
    return { x: count > 0 ? sumX / count : x, y: count > 0 ? sumY / count + 15 : y + 15 } // Adjust y for text position
  }

  if (loading && !projectConfig) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando datos del proyecto...</p>
        {onReturnToProjectModal && (
          <Button onClick={onReturnToProjectModal} variant="outline" className="mt-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex space-x-4 mt-6">
          <Button onClick={refreshDataManual} variant="outline" disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Reintentar
          </Button>
          {onReturnToProjectModal && (
            <Button onClick={onReturnToProjectModal} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Volver
            </Button>
          )}
        </div>
      </div>
    )
  }

  if (!projectConfig) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg text-muted-foreground">No se pudo cargar la configuración del proyecto.</p>
        {onReturnToProjectModal && (
          <Button onClick={onReturnToProjectModal} variant="outline" className="mt-6">
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {onReturnToProjectModal && (
              <Button onClick={onReturnToProjectModal} variant="outline" size="sm" className="text-xs sm:text-sm">
                <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Volver
              </Button>
            )}
            <h1 className="text-xl sm:text-2xl font-bold">{projectConfig?.project?.name || "Vista de Proyecto"}</h1>
            {user?.rol === "admin" || user?.rol === "superadmin" ? (
              <Link href={`/admin/configuracion-proyecto/${projectId}`}>
                <Button variant="outline" size="icon" title="Configurar Proyecto">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            ) : null}
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button
              onClick={refreshDataManual}
              variant="outline"
              size="sm"
              disabled={refreshing || loading}
              className="text-xs sm:text-sm"
            >
              <RefreshCw
                className={`mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 ${refreshing || loading ? "animate-spin" : ""}`}
              />
              {refreshing || loading ? "Actualizando..." : "Actualizar"}
            </Button>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Checkbox
                id="autoRefresh"
                checked={autoRefresh}
                onCheckedChange={(checked) => setAutoRefresh(checked === true)}
              />
              <Label htmlFor="autoRefresh" className="text-xs sm:text-sm text-muted-foreground">
                Auto
              </Label>
            </div>
          </div>
        </div>

        <Tabs
          value={activeView}
          onValueChange={(value) => setActiveView(value as "apartments" | "garage")}
          className="mb-8"
        >
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger
              value="apartments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Departamentos
            </TabsTrigger>
            <TabsTrigger
              value="garage"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Cochera
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apartments">
            <div className="bg-card p-3 sm:p-4 rounded-lg shadow-md overflow-hidden mb-8 border">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 sm:mb-6">
                <div className="flex items-center mb-3 md:mb-0">
                  <Button
                    onClick={() => handleFloorClick(Math.max(availableFloors[0] || 1, currentFloor - 1))}
                    variant="ghost"
                    size="icon"
                    disabled={currentFloor === (availableFloors[0] || 1)}
                  >
                    <ChevronLeft />
                  </Button>
                  <span className="mx-2 sm:mx-4 text-md sm:text-lg font-semibold">
                    {currentFloorConfig?.floor_name || currentFloor}
                  </span>
                  <Button
                    onClick={() =>
                      handleFloorClick(Math.min(availableFloors[availableFloors.length - 1] || 9, currentFloor + 1))
                    }
                    variant="ghost"
                    size="icon"
                    disabled={currentFloor === (availableFloors[availableFloors.length - 1] || 9)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                <ScrollArea className="w-full md:w-auto pb-2">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    {availableFloors.map((floorNum: number) => (
                      <motion.button
                        key={`floor-btn-${floorNum}`}
                        onClick={() => handleFloorClick(floorNum)}
                        className={`px-2 py-1 sm:w-10 sm:h-10 rounded-md text-xs sm:text-sm font-medium border transition-colors ${currentFloor === floorNum ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {(Array.isArray(projectConfig?.floorConfig)
                          ? projectConfig.floorConfig.find((fc: FloorConfig) => fc.floor_number === floorNum)
                              ?.floor_name
                          : floorNum) || floorNum}
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {currentFloorConfig?.background_image ? (
                <div className="relative aspect-[1.77] sm:aspect-[2] md:aspect-[2.33] max-h-[60vh] mx-auto">
                  <Image
                    src={
                      currentFloorConfig.background_image.startsWith("http")
                        ? currentFloorConfig.background_image
                        : currentFloorConfig.background_image // Use relative path directly for Next.js public folder
                    }
                    alt={`Plano del Piso ${currentFloorConfig.floor_name || currentFloor}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                    style={{ objectFit: "contain" }}
                    className="pointer-events-none"
                    priority
                    onError={(e) => console.error("Error loading floor plan image:", e.currentTarget.src)}
                  />
                  <div className="absolute inset-0 z-10">
                    <svg
                      viewBox={currentFloorConfig.view_box || "0 0 1000 500"}
                      className="w-full h-full"
                      style={{ pointerEvents: "all" }}
                    >
                      <g transform="scale(1, 1) translate(-83, 10)">
                        {Object.entries(apartmentsData).map(([aptIdCode, data]) => {
                          const apartmentFullData = apartmentsData[aptIdCode]
                          if (!apartmentFullData?.svg_path) {
                            return null
                          }
                          return (
                            <TooltipPrimitive.Provider key={`apt-tooltip-${aptIdCode}`}>
                              <TooltipPrimitive.Root delayDuration={100}>
                                <TooltipPrimitive.Trigger asChild>
                                  <path
                                    d={apartmentFullData.svg_path}
                                    fill={statusColors[data.status] || "#ccc"}
                                    stroke="black"
                                    strokeWidth="1" // Adjusted for better visibility on complex SVGs
                                    opacity="0.6"
                                    onClick={() => handleApartmentClick(aptIdCode)}
                                    style={{ cursor: "pointer" }}
                                    className="hover:opacity-80 transition-opacity"
                                  />
                                </TooltipPrimitive.Trigger>
                                <TooltipPrimitive.Content className="bg-background border text-foreground p-2 rounded shadow-lg text-xs z-50">
                                  Depto: {aptIdCode} <br />
                                  Estado: {data.status} <br />
                                  {data.buyer && `Comprador: ${data.buyer}`}
                                </TooltipPrimitive.Content>
                              </TooltipPrimitive.Root>
                            </TooltipPrimitive.Provider>
                          )
                        })}
                      </g>
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">Plano no disponible para este piso.</div>
              )}
              <div className="flex items-center justify-center space-x-4 mt-4 text-xs sm:text-sm">
                {Object.entries(statusColors).map(([status, color]) => (
                  <div key={status} className="flex items-center">
                    <div className="w-3 h-3 rounded-sm mr-1.5" style={{ backgroundColor: color }}></div>
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="garage">
            <div className="bg-card p-3 sm:p-4 rounded-lg shadow-md overflow-hidden mb-8 border">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
                Mapa de Cocheras - Nivel {currentGarageLevel}
              </h2>
              <div className="flex justify-center space-x-2 sm:space-x-4 mb-3 sm:mb-4">
                {Array.isArray(projectConfig?.parking_config?.levels) &&
                  projectConfig.parking_config.levels.map((level: number) => (
                    <Button
                      key={`garage-level-btn-${level}`}
                      onClick={() => setCurrentGarageLevel(level)}
                      variant={currentGarageLevel === level ? "default" : "outline"}
                      size="sm"
                    >
                      Nivel {level}
                    </Button>
                  ))}
              </div>
              {garagePlanForCurrentLevel ? (
                <div className="relative aspect-[1.77] sm:aspect-[2] md:aspect-[2.33] max-h-[60vh] mx-auto">
                  <Image
                    src={
                      garagePlanForCurrentLevel.startsWith("http")
                        ? garagePlanForCurrentLevel
                        : garagePlanForCurrentLevel // Use relative path directly for Next.js public folder
                    }
                    alt={`Plano de Cocheras Nivel ${currentGarageLevel}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
                    style={{ objectFit: "contain" }}
                    onError={(e) => console.error("Error loading garage plan image:", e.currentTarget.src)}
                  />
                  <svg
                    viewBox={projectConfig?.parking_config?.view_box || "0 0 4400 2600"} // Adjusted viewBox for parking
                    className="absolute top-0 left-0 w-full h-full"
                  >
                    <g transform="scale(1,1) translate(100,-100)">
                      {" "}
                      {/* Adjust translate if needed */}
                      {parkingSpots
                        .filter((spot) => spot.level === currentGarageLevel)
                        .map((spot) => {
                          const textCoords = getParkingTextCoordinates(spot.path)
                          return (
                            <TooltipPrimitive.Provider key={`parking-tooltip-${spot.id}-${spot.level}`}>
                              <TooltipPrimitive.Root delayDuration={100}>
                                <TooltipPrimitive.Trigger asChild>
                                  <g
                                    onClick={() => handleParkingClick(spot.id, spot.level)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <path
                                      d={spot.path}
                                      fill={
                                        spot.status === "libre"
                                          ? "rgba(135, 245, 175, 0.4)"
                                          : "rgba(245, 127, 127, 0.4)"
                                      }
                                      stroke={spot.status === "libre" ? "#22c55e" : "#ef4444"}
                                      strokeWidth="3" // Increased stroke width
                                      className="hover:opacity-70 transition-opacity"
                                    />
                                    <text
                                      x={textCoords.x}
                                      y={textCoords.y}
                                      textAnchor="middle"
                                      fill="currentColor"
                                      fontSize="40" // Adjusted font size
                                      dominantBaseline="middle"
                                      className="pointer-events-none font-semibold"
                                      stroke="black"
                                      strokeWidth="0.5"
                                    >
                                      {spot.id}
                                    </text>
                                  </g>
                                </TooltipPrimitive.Trigger>
                                <TooltipPrimitive.Content className="bg-background border text-foreground p-2 rounded shadow-lg text-xs z-50">
                                  Cochera: {spot.id} (Nivel {spot.level}) <br />
                                  Estado: {spot.status} <br />
                                  {spot.assignedTo && `Asignada a: ${spot.assignedTo}`}
                                </TooltipPrimitive.Content>
                              </TooltipPrimitive.Root>
                            </TooltipPrimitive.Provider>
                          )
                        })}
                    </g>
                  </svg>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  Plano de cocheras no disponible para este nivel.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) setAction(null)
          }}
        >
          <DialogContent className="sm:max-w-md bg-card max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Departamento {selectedApartment}</DialogTitle>
              {currentAptData && (
                <DialogDescription className="text-xs">
                  Estado:{" "}
                  <span
                    className={cn(
                      "font-semibold",
                      currentAptData.status === "libre" && "text-green-500",
                      currentAptData.status === "reservado" && "text-yellow-500",
                      currentAptData.status === "ocupado" && "text-red-500",
                      currentAptData.status === "bloqueado" && "text-blue-500",
                    )}
                  >
                    {currentAptData.status}
                  </span>{" "}
                  | Precio: {currentAptData.price || "N/A"} | Sup: {currentAptData.surface || "N/A"}
                </DialogDescription>
              )}
            </DialogHeader>
            <ScrollArea className="flex-grow pr-2 -mr-4">
              {currentAptData && !action && (
                <div className="space-y-3 py-2">
                  {currentAptData.buyer && (
                    <p className="text-sm">
                      <strong>Comprador:</strong> {currentAptData.buyer}
                    </p>
                  )}
                  {currentAptData.date && (
                    <p className="text-sm">
                      <strong>Fecha:</strong> {new Date(currentAptData.date).toLocaleDateString()}
                    </p>
                  )}
                  {currentAptData.phoneNumber && (
                    <p className="text-sm">
                      <strong>Teléfono:</strong> {currentAptData.phoneNumber}
                    </p>
                  )}
                  {currentAptData.email && (
                    <p className="text-sm">
                      <strong>Email:</strong> {currentAptData.email}
                    </p>
                  )}
                  {currentAptData.notes && (
                    <p className="text-sm">
                      <strong>Notas:</strong> {currentAptData.notes}
                    </p>
                  )}
                  <p className="text-sm">
                    <strong>Cocheras:</strong> {currentAptData.assignedParkings?.join(", ") || "Ninguna"}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {currentAptData.status === "libre" && (
                      <>
                        <Button onClick={() => handleActionClick("block")} size="sm">
                          Bloquear
                        </Button>
                        <Button onClick={() => handleActionClick("directReserve")} size="sm" variant="secondary">
                          Reservar
                        </Button>
                      </>
                    )}
                    {currentAptData.status === "bloqueado" && (
                      <>
                        <Button onClick={() => handleActionClick("reserve")} size="sm" variant="secondary">
                          Reservar
                        </Button>
                        <Button onClick={() => handleActionClick("unblock")} size="sm" variant="destructive">
                          Liberar Bloqueo
                        </Button>
                      </>
                    )}
                    {currentAptData.status === "reservado" && (
                      <>
                        <Button onClick={() => handleActionClick("sell")} size="sm" variant="secondary">
                          Vender
                        </Button>
                        <Button onClick={() => handleActionClick("cancelReservation")} size="sm" variant="destructive">
                          Cancelar Reserva
                        </Button>
                      </>
                    )}
                    {currentAptData.status === "ocupado" && (
                      <>
                        {currentAptData.contractUrl && (
                          <Button onClick={handleDownloadContract} size="sm">
                            Desc. Contrato
                          </Button>
                        )}
                        <Button onClick={() => handleActionClick("release")} size="sm" variant="destructive">
                          Liberar Depto.
                        </Button>
                      </>
                    )}
                    <Button onClick={handleDownloadFloorPlan} size="sm">
                      Plano Depto.
                    </Button>
                    <Button onClick={handleOpenParkingAssignmentModal} size="sm" disabled={!selectedApartment}>
                      Asignar Cocheras
                    </Button>
                  </div>
                </div>
              )}
              {action && (
                <form onSubmit={handleFormSubmit} className="space-y-3 py-2">
                  {(action === "block" || action === "directReserve" || action === "sell") && (
                    <>
                      <div>
                        <Label htmlFor="name">Nombre Comprador/Interesado</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required={action !== "block"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </>
                  )}
                  {(action === "directReserve" || action === "reserve" || action === "sell") && (
                    <div>
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder={currentAptData?.price}
                      />
                    </div>
                  )}
                  {action === "sell" && (
                    <div>
                      <Label htmlFor="contractFile">Contrato (PDF)</Label>
                      <Input
                        id="contractFile"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </div>
                  )}
                  {(action === "unblock" ||
                    action === "cancelReservation" ||
                    action === "release" ||
                    action === "block" ||
                    action === "reserve" ||
                    action === "directReserve") && (
                    <div>
                      <Label htmlFor="note">
                        Nota{" "}
                        {(action === "unblock" || action === "cancelReservation" || action === "release") &&
                          "(Obligatoria)"}
                      </Label>
                      <Textarea
                        id="note"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        required={action === "unblock" || action === "cancelReservation" || action === "release"}
                      />
                    </div>
                  )}
                  <DialogFooter className="pt-3">
                    <Button type="button" variant="ghost" onClick={() => setAction(null)}>
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant={
                        action === "unblock" || action === "cancelReservation" || action === "release"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {action === "block" && "Confirmar Bloqueo"}
                      {action === "directReserve" && "Confirmar Reserva"}
                      {action === "reserve" && "Confirmar Reserva"}
                      {action === "sell" && "Confirmar Venta"}
                      {action === "unblock" && "Liberar Bloqueo"}
                      {action === "cancelReservation" && "Cancelar Reserva"}
                      {action === "release" && "Liberar Depto."}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </ScrollArea>
            {!action && (
              <DialogFooter className="mt-auto pt-4 border-t">
                <DialogClose asChild>
                  <Button variant="outline">Cerrar</Button>
                </DialogClose>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={showParkingAssignment} onOpenChange={setShowParkingAssignment}>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
              <DialogTitle>Asignar Cocheras a Depto. {selectedApartment}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] my-4">
              <div className="space-y-2 p-1">
                {parkingSpots
                  .filter((s) => s.status === "libre" || currentAptData?.assignedParkings?.includes(s.id))
                  .map((spot) => (
                    <div
                      key={`assign-park-div-${spot.id}-${spot.level}`}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-muted transition-colors"
                    >
                      <Checkbox
                        id={`assign-park-${spot.id}-${spot.level}`}
                        checked={selectedParkingsForAssignment[spot.id] || false}
                        onCheckedChange={(checked) =>
                          setSelectedParkingsForAssignment((prev) => ({ ...prev, [spot.id]: !!checked }))
                        }
                      />
                      <Label htmlFor={`assign-park-${spot.id}-${spot.level}`} className="flex-grow cursor-pointer">
                        Cochera {spot.id} (Nivel {spot.level})
                        {currentAptData?.assignedParkings?.includes(spot.id) && spot.status === "ocupado" && (
                          <span className="text-xs text-primary ml-1">(Ya asignada a este depto)</span>
                        )}
                      </Label>
                    </div>
                  ))}
                {parkingSpots.filter((s) => s.status === "libre" || currentAptData?.assignedParkings?.includes(s.id))
                  .length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay cocheras disponibles o ya asignadas para modificar.
                  </p>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowParkingAssignment(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmParkingAssignmentForApartment}>Guardar Asignaciones</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isParkingInfoModalOpen} onOpenChange={setIsParkingInfoModalOpen}>
          <DialogContent className="sm:max-w-xs bg-card">
            <DialogHeader>
              <DialogTitle>Info Cochera {selectedParking}</DialogTitle>
            </DialogHeader>
            {selectedParking &&
              parkingSpots.find((s) => s.id === selectedParking && s.level === currentGarageLevel) && (
                <div className="py-4 space-y-3">
                  <p className="text-sm">
                    <strong>Nivel:</strong> {currentGarageLevel}
                  </p>
                  <p className="text-sm">
                    <strong>Estado:</strong>{" "}
                    {parkingSpots.find((s) => s.id === selectedParking && s.level === currentGarageLevel)!.status}
                  </p>
                  <p className="text-sm">
                    <strong>Asignada a:</strong>{" "}
                    {parkingSpots.find((s) => s.id === selectedParking && s.level === currentGarageLevel)!.assignedTo ||
                      "N/A"}
                  </p>
                  <Button onClick={() => handleParkingAssignmentAction(null)} variant="destructive" className="w-full">
                    Liberar Cochera
                  </Button>
                </div>
              )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isParkingModalOpen} onOpenChange={setIsParkingModalOpen}>
          <DialogContent className="sm:max-w-md bg-card">
            <DialogHeader>
              <DialogTitle>
                Asignar Cochera {selectedParking} (Nivel {currentGarageLevel})
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-2">Selecciona un departamento para asignar esta cochera:</p>
            <ScrollArea className="max-h-[50vh] my-2">
              <div className="space-y-1 p-1">
                {Object.entries(apartmentsData)
                  // Only show apartments on the *currently selected floor* in the main view
                  .filter(([aptIdCode, aptData]) => {
                    const floorOfApt = projectConfig?.floorConfig?.find(
                      (fc: FloorConfig) =>
                        Object.keys(fc.apartment_config || {}).includes(aptIdCode) || // Check if aptIdCode is in apartment_config keys
                        (fc.apartment_config && Object.values(fc.apartment_config).some((ac) => ac === aptIdCode)), // Or if it's a value (less likely)
                    )?.floor_number
                    return floorOfApt === currentFloor
                  })
                  .filter(([_, apt]) => apt.status !== "ocupado") // Filter out already sold apartments
                  .map(([aptIdCode, aptData]) => (
                    <Button
                      key={`assignable-apt-${aptIdCode}`}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleParkingAssignmentAction(aptIdCode)} // Pass "1A", "2B"
                    >
                      Depto. {aptIdCode} (Piso {currentFloor})
                    </Button>
                  ))}
                {Object.keys(apartmentsData).filter((aptIdCode) => {
                  const floorOfApt = projectConfig?.floorConfig?.find((fc: FloorConfig) =>
                    Object.keys(fc.apartment_config || {}).includes(aptIdCode),
                  )?.floor_number
                  return floorOfApt === currentFloor
                }).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay departamentos en este piso para asignar.
                  </p>
                )}
              </div>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mt-8">
          <div className="bg-card p-3 sm:p-4 rounded-lg shadow border">
            <h4 className="font-semibold mb-3 text-md sm:text-lg">Información Adicional</h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {projectConfig?.project?.brochure && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      projectConfig.project.brochure.startsWith("http") ||
                        projectConfig.project.brochure.startsWith("/")
                        ? projectConfig.project.brochure
                        : projectConfig.project.brochure,
                      "_blank",
                    )
                  }
                >
                  <Download className="mr-2 h-4 w-4" /> Brochure
                </Button>
              )}
              {Array.isArray(projectConfig?.files) &&
                projectConfig.files.find((f: any) => f.file_type === "building_plan") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const buildingPlanFile = projectConfig.files.find((f: any) => f.file_type === "building_plan")
                      if (buildingPlanFile?.file_path) {
                        window.open(
                          buildingPlanFile.file_path.startsWith("http") || buildingPlanFile.file_path.startsWith("/")
                            ? buildingPlanFile.file_path
                            : buildingPlanFile.file_path,
                          "_blank",
                        )
                      }
                    }}
                  >
                    <Building className="mr-2 h-4 w-4" /> Plano Edificio
                  </Button>
                )}
            </div>
          </div>
          <div className="bg-card p-3 sm:p-4 rounded-lg shadow border">
            <h4 className="font-semibold mb-3 text-md sm:text-lg">Registro de Actividades</h4>
            <ScrollArea className="h-40 sm:h-48">
              {activityLog.length > 0 ? (
                activityLog.map((activity, index) => (
                  <p key={`log-${index}`} className="text-xs sm:text-sm text-muted-foreground mb-1">
                    {activity}
                  </p>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-muted-foreground">No hay actividades registradas.</p>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
