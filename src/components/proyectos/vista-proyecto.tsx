"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
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

// Modificar la función handleFormSubmit para usar el servicio API optimizado
import { updateApartment, invalidateCache } from "../../lib/proyectos"

let notyf: Notyf | null = null

type ApartmentStatus = "ocupado" | "reservado" | "libre" | "bloqueado"

type ApartmentData = {
  buyer: string
  date: string
  price: string
  status: ApartmentStatus
  contractFile?: File | null
  phoneNumber?: string
  email?: string
  surface: string
  assignedParkings: string[]
  id?: number // ID de la base de datos
}

type ApartmentDataMap = {
  [key: string]: ApartmentData
}

type FloorData = {
  apartments: ApartmentDataMap
  svgPaths: {
    [key: string]: string
  }
  viewBox?: string
  id?: number // ID de la base de datos
}

// Cambiar la definición de tipo para FloorData para permitir indexación numérica
type FloorDataMap = {
  [key: number]: FloorData
}

type UnitStats = {
  disponibles: number
  reservadas: number
  vendidas: number
  bloqueadas: number
}

type ParkingSpot = {
  id: string
  level: number
  status: "libre" | "ocupado"
  assignedTo: string | null
  path: string
  dbId?: number // ID de la base de datos
}

const API_BASE_URL = "https://adndash.squareweb.app/api"

const floorPlans: { [key: number]: string } = {
  1: "/images/planos/plano_piso_1.svg",
  2: "/images/planos/plano_piso_2-6.svg",
  3: "/images/planos/plano_piso_2-6.svg",
  4: "/images/planos/plano_piso_2-6.svg",
  5: "/images/planos/plano_piso_2-6.svg",
  6: "/images/planos/plano_piso_2-6.svg",
  7: "/images/planos/plano_piso_2-6.svg",
  8: "/images/planos/plano_piso_8.svg",
  9: "/images/planos/plano_piso_9.svg",
}

const apartmentPDFs: { [key: string]: string } = {
  "1A": "/planodepa/uf101.pdf",
  "1B": "/planodepa/ufuf102.pdf",
  "1C": "/planodepa/ufuf103.pdf",
  "2A": "/planodepa/ufuf201-601.pdf",
  "2B": "/planodepa/ufuf202-602.pdf",
  "2C": "/planodepa/ufuf203-603.pdf",
  "3A": "/planodepa/ufuf201-601.pdf",
  "3B": "/planodepa/ufuf202-602.pdf",
  "3C": "/planodepa/ufuf203-603.pdf",
  "4A": "/planodepa/ufuf201-601.pdf",
  "4B": "/planodepa/ufuf202-602.pdf",
  "4C": "/planodepa/ufuf203-603.pdf",
  "5A": "/planodepa/ufuf201-601.pdf",
  "5B": "/planodepa/ufuf202-602.pdf",
  "5C": "/planodepa/ufuf203-603.pdf",
  "6A": "/planodepa/ufuf201-601.pdf",
  "6B": "/planodepa/ufuf202-602.pdf",
  "6C": "/planodepa/ufuf203-603.pdf",
  "7A": "/planodepa/ufuf701.pdf",
  "8A": "/planodepa/ufuf801.pdf",
  "8B": "/planodepa/ufuf802.pdf",
  "8C": "/planodepa/ufuf803.pdf",
  "9A": "/planodepa/ufuf901.pdf",
  "9B": "/planodepa/ufuf902.pdf",
}

const floors = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const statusColors = {
  ocupado: "#f57f7f",
  reservado: "#edcf53",
  libre: "#87f5af",
  bloqueado: "#7f7fff",
}

const garageLevels = [1, 2, 3]

const garagePlans = {
  1: "/images/planos/cochera1.svg",
  2: "/images/planos/cochera2.svg",
  3: "/images/planos/cochera3.svg",
}

// Datos iniciales para usar como respaldo
const initialFloorData: FloorDataMap = {
  1: {
    apartments: {
      "1A": { buyer: "", date: "", price: "$774.200", status: "libre", surface: "181,55 m²", assignedParkings: [] },
      "1B": { buyer: "", date: "", price: "$820.900", status: "libre", surface: "183,35 m²", assignedParkings: [] },
      "1C": { buyer: "", date: "", price: "$667.600", status: "libre", surface: "154,25 m²", assignedParkings: [] },
    },
    svgPaths: {
      "1A": "M136,509 L126,2004 L764,2001 L767,1918 L1209,1915 L1207,1999 L1218,2001 L1221,1692 L1635,1692 L1639,1544 L1224,1543 L1227,1291 L1430,1292 L1424,899 L1219,902 L1216,578 L506,575 L504,455 Z",
      "1B": "M3111,2317 L1421,2314 L1418,2007 L1209,2004 L1209,1680 L1635,1683 L2078,1683 L2084,1270 L3117,1270 Z",
      "1C": "M3111,1276 L3114,300 L2298,303 L2304,214 L1206,366 L1212,904 L1415,910 L1418,1288 L1674,1291 L1677,1115 L1879,1109 L1879,1285 Z",
    },
    viewBox: "0 0 3200 2400",
  },
  // ... (otros pisos)
}

// Paths predeterminados para los SVG de los departamentos
const defaultSvgPaths = {
  "1A": "M136,509 L126,2004 L764,2001 L767,1918 L1209,1915 L1207,1999 L1218,2001 L1221,1692 L1635,1692 L1639,1544 L1224,1543 L1227,1291 L1430,1292 L1424,899 L1219,902 L1216,578 L506,575 L504,455 Z",
  "1B": "M3111,2317 L1421,2314 L1418,2007 L1209,2004 L1209,1680 L1635,1683 L2078,1683 L2084,1270 L3117,1270 Z",
  "1C": "M3111,1276 L3114,300 L2298,303 L2304,214 L1206,366 L1212,904 L1415,910 L1418,1288 L1674,1291 L1677,1115 L1879,1109 L1879,1285 Z",
  "2A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
  "2B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
  "2C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
  // Los mismos paths para los pisos 3-7
  "8A": "M854,1776 L203,1786 L208,420 L605,414 L595,351 L1341,255 L1346,1304 L1754,1304 L1754,1447 L1346,1463 L1346,1702 L859,1712 Z",
  "8B": "M1346,1447 L1341,1702 L1558,1712 L1558,1792 L1748,1792 L1748,2094 L3114,2094 L3108,1087 L2436,1087 L2431,1214 L2251,1220 L2256,1431 Z",
  "8C": "M3119,1092 L2426,1082 L2426,1008 L2045,1018 L2039,838 L2436,817 L2442,626 L1965,626 L1976,838 L1817,838 L1817,1008 L1346,1008 L1346,255 L3124,22 Z",
  "9A": "M22,342 L26,1335 L1599,1335 L1602,1054 L1449,1054 L1442,926 L1001,929 L1001,214 Z",
  "9B": "M1342,1332 L1342,1613 L2345,1610 L2352,26 L1001,217 L994,342 L1175,346 L1178,679 L1783,683 L1783,1047 L1606,1051 L1606,1325 Z",
}

// Paths predeterminados para los SVG de las cocheras
const defaultParkingPaths = [
  "M571,885 L640,1391 L737,1405 L817,1369 L753,869 L668,865 Z",
  "M862,845 L926,1349 L1039,1373 L1120,1321 L1055,841 L1007,816 L951,824 L910,833 Z",
  "M1164,811 L1221,1311 L1318,1319 L1394,1303 L1418,1255 L1350,779 L1245,783 Z",
  "M1455,763 L1531,1271 L1636,1279 L1717,1243 L1644,730 Z",
  "M1761,722 L1826,1227 L1911,1243 L2011,1214 L1943,694 Z",
  "M2060,685 L2140,1193 L2229,1209 L2318,1177 L2253,660 Z",
  "M2374,654 L2447,1150 L2544,1158 L2625,1122 L2552,625 Z",
  "M2681,639 L2754,1107 L2850,1115 L2931,1083 L2862,578 L2681,607 Z",
  "M2992,560 L3064,1064 L3165,1076 L3250,1036 L3169,535 Z",
  "M3520,1198 L4020,1198 L4020,1384 L3520,1392 L3488,1307 Z",
  "M3512,1497 L4020,1501 L4028,1670 L3524,1687 L3496,1586 Z",
  "M1253,2522 L1435,2522 L1427,2009 L1338,1985 L1245,2017 Z",
  "M1552,2013 L1552,2518 L1741,2522 L1729,2017 L1644,1989 Z",
]

interface InteractiveFloorPlanProps {
  projectId?: number
  floorNumber?: number | null
  onReturnToProjectModal: () => void
}

export default function InteractiveFloorPlan({
  projectId,
  floorNumber,
  onReturnToProjectModal,
}: InteractiveFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null)
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
  const [unitStats, setUnitStats] = useState<UnitStats>({
    disponibles: 0,
    reservadas: 0,
    vendidas: 0,
    bloqueadas: 0,
  })
  const [confirmReservation, setConfirmReservation] = useState(false)
  const [confirmCancelReservation, setConfirmCancelReservation] = useState(false)
  const [confirmRelease, setConfirmRelease] = useState(false)
  const [activeView, setActiveView] = useState<"apartments" | "garage">("apartments")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedParking, setSelectedParking] = useState<string | null>(null)
  const [currentGarageLevel, setCurrentGarageLevel] = useState(1)
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false)
  const [floorData, setFloorData] = useState<FloorData>({ apartments: {}, svgPaths: {} })
  const [showParkingAssignment, setShowParkingAssignment] = useState(false)
  const [selectedParkings, setSelectedParkings] = useState<{ [key: string]: boolean }>({})
  const [isParkingInfoModalOpen, setIsParkingInfoModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [creatingFloors, setCreatingFloors] = useState(false)

  // Initialize Notyf
  useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  // Check API availability
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`${API_BASE_URL}/health`, {
          method: "HEAD",
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        setApiAvailable(response.ok)
      } catch (err) {
        console.warn("API health check failed:", err)
        setApiAvailable(false)
      }
    }

    checkApiAvailability()
  }, [])

  // Set up auto-refresh
  useEffect(() => {
    if (autoRefresh && projectId) {
      refreshIntervalRef.current = setInterval(() => {
        refreshData()
      }, 30000) // Refresh every 30 seconds
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [autoRefresh, projectId, currentFloor])

  // Function to refresh data
  const refreshData = async () => {
    if (!projectId || refreshing) return

    setRefreshing(true)
    try {
      await fetchFloorData()
      await fetchParkingSpots()
      await fetchActivityLogs()
    } catch (err) {
      console.error("Error refreshing data:", err)
    } finally {
      setRefreshing(false)
    }
  }

  // Modificar la función createFloorsAndApartments para usar las rutas existentes
  const createFloorsAndApartments = async () => {
    if (!projectId || creatingFloors) return

    setCreatingFloors(true)
    try {
      // En lugar de intentar crear pisos directamente con POST,
      // usamos la ruta GET existente que creará los pisos si no existen
      const floorResponse = await fetch(`${API_BASE_URL}/floors/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!floorResponse.ok) {
        throw new Error(`Error getting/creating floors: ${floorResponse.statusText}`)
      }

      const floors = await floorResponse.json()
      console.log("Floors created or retrieved:", floors)

      // Para cada piso, obtenemos los departamentos (que también se crearán si no existen)
      for (const floor of floors) {
        const apartmentsResponse = await fetch(`${API_BASE_URL}/apartments/floor/${floor.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!apartmentsResponse.ok) {
          console.error(
            `Error getting/creating apartments for floor ${floor.floor_number}:`,
            apartmentsResponse.statusText,
          )
        } else {
          console.log(`Apartments for floor ${floor.floor_number} created or retrieved`)
        }
      }

      // Obtener las cocheras (que también se crearán si no existen)
      const parkingResponse = await fetch(`${API_BASE_URL}/parking/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!parkingResponse.ok) {
        console.error("Error getting/creating parking spots:", parkingResponse.statusText)
      } else {
        console.log("Parking spots created or retrieved")
      }

      if (notyf) notyf.success("Pisos y departamentos creados con éxito")

      // Recargar los datos
      await refreshData()
    } catch (err) {
      console.error("Error creating floors and apartments:", err)
      if (notyf) notyf.error("Error al crear pisos y departamentos")
    } finally {
      setCreatingFloors(false)
    }
  }

  // Fetch floor data
  const fetchFloorData = async () => {
    if (!projectId) return

    try {
      setLoading(true)

      // First, get the floor by project and number
      const floorResponse = await fetch(`${API_BASE_URL}/floors/project/${projectId}/number/${currentFloor}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!floorResponse.ok) {
        // Si el piso no existe, usar datos de respaldo
        console.warn(`Floor ${currentFloor} not found for project ${projectId}, using fallback data`)

        // Intentar crear los pisos y departamentos
        await createFloorsAndApartments()

        // Usar datos de respaldo mientras tanto
        const fallbackData = initialFloorData[currentFloor] || {
          apartments: {},
          svgPaths: {},
          viewBox: "0 0 3200 2400",
        }

        setFloorData(fallbackData)
        updateUnitStats(fallbackData.apartments)
        setError(null)
        setLoading(false)
        return
      }

      const floorInfo = await floorResponse.json()
      const floorId = floorInfo.id

      // Then, get the apartments for this floor
      const apartmentsResponse = await fetch(`${API_BASE_URL}/apartments/floor/${floorId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!apartmentsResponse.ok) {
        throw new Error(`HTTP error! status: ${apartmentsResponse.status}`)
      }

      const apartments = await apartmentsResponse.json()

      // Format data to match the expected structure
      const formattedData: FloorData = {
        apartments: {},
        svgPaths: {},
        viewBox: floorInfo.view_box || "0 0 3200 2400",
        id: floorId,
      }

      // Process apartments
      apartments.forEach((apt: any) => {
        formattedData.apartments[apt.apartment_id] = {
          buyer: apt.buyer || "",
          date: apt.reservation_date || "",
          price: apt.price || "",
          status: apt.status as ApartmentStatus,
          surface: apt.surface || "",
          phoneNumber: apt.phone || "",
          email: apt.email || "",
          assignedParkings: [],
          id: apt.id, // Make sure this is included
        }

        formattedData.svgPaths[apt.apartment_id] = apt.svg_path || ""
      })

      // Get parking assignments
      const parkingResponse = await fetch(`${API_BASE_URL}/parking/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (parkingResponse.ok) {
        const parkingData = await parkingResponse.json()

        // Assign parking spots to apartments
        parkingData.forEach((spot: any) => {
          if (spot.assigned_to) {
            const [floorNum, aptId] = spot.assigned_to.split("-")
            if (floorNum === currentFloor.toString() && formattedData.apartments[aptId]) {
              formattedData.apartments[aptId].assignedParkings.push(spot.parking_id)
            }
          }
        })
      }

      setFloorData(formattedData)
      updateUnitStats(formattedData.apartments)
      setError(null)
    } catch (err) {
      console.error("Error fetching floor data:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")

      // Si hay un error, intentar crear los pisos y departamentos
      await createFloorsAndApartments()

      // Usar datos de respaldo mientras tanto
      const fallbackData = initialFloorData[currentFloor] || {
        apartments: {},
        svgPaths: {},
        viewBox: "0 0 3200 2400",
      }

      setFloorData(fallbackData)
      updateUnitStats(fallbackData.apartments)

      if (notyf) notyf.error("Error al cargar los datos del piso")
    } finally {
      setLoading(false)
    }
  }

  // Add this function after the fetchFloorData function

  const refreshApartmentData = async (floorNumber: number, apartmentId: string) => {
    if (!projectId) return null

    try {
      const response = await fetch(
        `${API_BASE_URL}/apartments/by-identifier/${floorNumber}/${apartmentId}?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Update the apartment data in the state
      setFloorData((prevData) => ({
        ...prevData,
        apartments: {
          ...prevData.apartments,
          [apartmentId]: {
            ...prevData.apartments[apartmentId],
            id: data.id,
          },
        },
      }))

      return data
    } catch (err) {
      console.error("Error refreshing apartment data:", err)
      return null
    }
  }

  // Modify the handleApartmentClick function to fetch the apartment data if needed
  const handleApartmentClick = async (apartment: string) => {
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

    // If the apartment doesn't have an ID, try to fetch it
    if (floorData.apartments[apartment] && !floorData.apartments[apartment].id) {
      await refreshApartmentData(currentFloor, apartment)
    }
  }

  // Fetch parking spots
  const fetchParkingSpots = async () => {
    if (!projectId) return

    try {
      const response = await fetch(`${API_BASE_URL}/parking/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        // Si no hay cocheras, intentar crearlas
        await createFloorsAndApartments()
        return
      }

      const data = await response.json()

      // Transform data to match the expected format
      const formattedSpots: ParkingSpot[] = data.map((spot: any) => ({
        id: spot.parking_id,
        level: spot.level,
        status: spot.status as "libre" | "ocupado",
        assignedTo: spot.assigned_to,
        path: spot.svg_path,
        dbId: spot.id,
      }))

      setParkingSpots(formattedSpots)
    } catch (err) {
      console.error("Error fetching parking spots:", err)
      if (notyf) notyf.error("Error al cargar las cocheras")
    }
  }

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    if (!projectId) return

    try {
      const response = await fetch(`${API_BASE_URL}/floors/project/${projectId}/logs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        return
      }

      const data = await response.json()

      // Format logs
      const formattedLogs = data.map((log: any) => {
        const timestamp = new Date(log.created_at).toLocaleString()
        return `${timestamp} - ${log.description}`
      })

      setActivityLog(formattedLogs)
    } catch (err) {
      console.error("Error fetching activity logs:", err)
    }
  }

  // Load data when component mounts or floor changes
  useEffect(() => {
    if (projectId) {
      fetchFloorData()
      fetchParkingSpots()
      fetchActivityLogs()
    }
  }, [projectId, currentFloor])

  const updateUnitStats = (apartments: ApartmentDataMap) => {
    const stats = Object.values(apartments).reduce(
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

  const handleFloorClick = (floor: number) => {
    setCurrentFloor(floor)
    setSelectedApartment(null)
    setIsModalOpen(false)
  }

  const handleActionClick = (
    actionType: "block" | "reserve" | "sell" | "unblock" | "directReserve" | "cancelReservation" | "release",
  ) => {
    setAction(actionType)
    setConfirmReservation(
      actionType === "reserve" &&
        selectedApartment !== null &&
        floorData.apartments[selectedApartment]?.status === "bloqueado",
    )
    setConfirmCancelReservation(actionType === "cancelReservation")
    setConfirmRelease(actionType === "release")
  }

  // Dentro de la función handleFormSubmit, reemplazar la llamada a la API con:
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApartment || !projectId || !user) return

    try {
      const apartment = floorData.apartments[selectedApartment]
      if (!apartment) {
        if (notyf) notyf.error("No se encontró información del departamento")
        return
      }

      let newStatus: ApartmentStatus = apartment.status
      let description = ""

      switch (action) {
        case "block":
          newStatus = "bloqueado"
          description = `${user.name} bloqueó el departamento ${selectedApartment}`
          break
        case "reserve":
        case "directReserve":
          newStatus = "reservado"
          description = `${user.name} reservó el departamento ${selectedApartment}`
          break
        case "sell":
          newStatus = "ocupado"
          description = `${user.name} vendió el departamento ${selectedApartment}`
          break
        case "unblock":
          if (formData.note) {
            newStatus = "libre"
            description = `${user.name} liberó el bloqueo del departamento ${selectedApartment}. Nota: ${formData.note}`
          } else {
            if (notyf) notyf.error("Se requiere una nota para liberar el bloqueo")
            return
          }
          break
        case "cancelReservation":
          if (formData.note) {
            newStatus = "libre"
            description = `${user.name} canceló la reserva del departamento ${selectedApartment}. Nota: ${formData.note}`
          } else {
            if (notyf) notyf.error("Se requiere una nota para cancelar la reserva")
            return
          }
          break
        case "release":
          if (formData.note) {
            newStatus = "libre"
            description = `${user.name} liberó el departamento ${selectedApartment}. Nota: ${formData.note}`
          } else {
            if (notyf) notyf.error("Se requiere una nota para liberar el departamento")
            return
          }
          break
        default:
          if (notyf) notyf.error("Acción no reconocida")
          return
      }

      // Get the apartment ID from the database
      const apartmentDbId = apartment.id
      if (!apartmentDbId) {
        // Log more details for debugging
        console.error("No database ID found for apartment", selectedApartment, "Full apartment data:", apartment)

        // Try to find the apartment in the database by querying for it
        try {
          const response = await fetch(
            `${API_BASE_URL}/apartments/by-identifier/${currentFloor}/${selectedApartment}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )

          if (response.ok) {
            const data = await response.json()
            if (data && data.id) {
              // Usar la función optimizada para actualizar el departamento
              const success = await updateApartment(
                data.id,
                {
                  status: newStatus,
                  buyer: action === "block" || action === "directReserve" ? formData.name : apartment.buyer,
                  phone: action === "block" || action === "directReserve" ? formData.phone : apartment.phoneNumber,
                  email: action === "block" || action === "directReserve" ? formData.email : apartment.email,
                  price: formData.price || apartment.price,
                  description,
                  userId: user.userId,
                  userName: user.name,
                  projectId: projectId,
                },
                projectId,
                currentFloor,
              )

              if (!success) {
                throw new Error("Error al actualizar departamento")
              }

              // Actualizar la interfaz inmediatamente sin esperar a la próxima actualización
              setFloorData((prevData) => ({
                ...prevData,
                apartments: {
                  ...prevData.apartments,
                  [selectedApartment]: {
                    ...prevData.apartments[selectedApartment],
                    status: newStatus,
                    buyer: action === "block" || action === "directReserve" ? formData.name : apartment.buyer,
                    phoneNumber:
                      action === "block" || action === "directReserve" ? formData.phone : apartment.phoneNumber,
                    email: action === "block" || action === "directReserve" ? formData.email : apartment.email,
                    price: formData.price || apartment.price,
                  },
                },
              }))

              // Actualizar el registro de actividades
              const timestamp = new Date().toLocaleString()
              setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog])

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

              setIsModalOpen(false)
              setAction(null)
              setConfirmReservation(false)
              setConfirmCancelReservation(false)
              setConfirmRelease(false)
              setFormData({
                name: "",
                phone: "",
                email: "",
                reservationOrder: null,
                price: "",
                note: "",
              })

              // Invalidar la caché para forzar una actualización en la próxima carga
              invalidateCache(projectId, currentFloor)

              return // Exit early since we've handled the update
            }
          }
        } catch (err) {
          console.error("Error trying to find apartment by identifier:", err)
        }

        if (notyf) notyf.error("Error: No se encontró el ID del departamento en la base de datos")
        return
      }

      // Usar la función optimizada para actualizar el departamento
      const success = await updateApartment(
        apartmentDbId,
        {
          status: newStatus,
          buyer: action === "block" || action === "directReserve" ? formData.name : apartment.buyer,
          phone: action === "block" || action === "directReserve" ? formData.phone : apartment.phoneNumber,
          email: action === "block" || action === "directReserve" ? formData.email : apartment.email,
          price: formData.price || apartment.price,
          description,
          userId: user.userId,
          userName: user.name,
          projectId: projectId,
        },
        projectId,
        currentFloor,
      )

      if (!success) {
        throw new Error("Error al actualizar departamento")
      }

      // Actualizar la interfaz inmediatamente sin esperar a la próxima actualización
      setFloorData((prevData) => ({
        ...prevData,
        apartments: {
          ...prevData.apartments,
          [selectedApartment]: {
            ...prevData.apartments[selectedApartment],
            status: newStatus,
            buyer: action === "block" || action === "directReserve" ? formData.name : apartment.buyer,
            phoneNumber: action === "block" || action === "directReserve" ? formData.phone : apartment.phoneNumber,
            email: action === "block" || action === "directReserve" ? formData.email : apartment.email,
            price: formData.price || apartment.price,
          },
        },
      }))

      // Actualizar el registro de actividades
      const timestamp = new Date().toLocaleString()
      setActivityLog((prevLog) => [`${timestamp} - ${description}`, ...prevLog])

      if (notyf) {
        switch (action) {
          case "block":
            notyf.success("Departamento bloqueado con éxito")
            break
          case "reserve":
            notyf.success("Departamento reservado con éxito")
            break
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

      setIsModalOpen(false)
      setAction(null)
      setConfirmReservation(false)
      setConfirmCancelReservation(false)
      setConfirmRelease(false)
      setFormData({
        name: "",
        phone: "",
        email: "",
        reservationOrder: null,
        price: "",
        note: "",
      })

      // Invalidar la caché para forzar una actualización en la próxima carga
      invalidateCache(projectId, currentFloor)
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

    const pdfPath = apartmentPDFs[selectedApartment]
    if (!pdfPath) {
      if (notyf) notyf.error("Plano no disponible")
      return
    }

    // Create a link element and trigger download
    const link = document.createElement("a")
    link.href = pdfPath
    link.download = `Plano_${selectedApartment}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (notyf) notyf.success("Descargando plano...")
  }

  const handleDownloadAdditionalInfo = useCallback((type: string) => {
    console.log(`Downloading ${type}...`)
    if (notyf) notyf.success(`Descargando ${type}...`)
  }, [])

  const handleDownloadContract = (apartment: string) => {
    const apartmentData = floorData.apartments[apartment]
    if (apartmentData.contractFile) {
      // Aquí iría la lógica para descargar el archivo
      // Por ahora, solo mostraremos un mensaje en la consola
      console.log(`Descargando contrato para el departamento ${apartment}`)
      if (notyf) notyf.success(`Descargando contrato para el departamento ${apartment}`)
    } else {
      console.log(`No hay contrato disponible para el departamento ${apartment}`)
      if (notyf) notyf.error(`No hay contrato disponible para el departamento ${apartment}`)
    }
  }

  const handleParkingClick = (parkingId: string, level: number) => {
    if (level === 1) {
      const clickedSpot = parkingSpots.find((spot) => spot.id === parkingId)
      if (clickedSpot) {
        setSelectedParking(parkingId)
        setCurrentGarageLevel(level)
        if (clickedSpot.status === "ocupado") {
          setIsParkingInfoModalOpen(true)
        } else {
          setIsParkingModalOpen(true)
        }
      }
    }
  }

  const handleParkingAssignment = async () => {
    if (!selectedApartment || !projectId || !user) return

    try {
      const parkingIdsToAssign = Object.keys(selectedParkings).filter((id) => selectedParkings[id])

      // Update parking assignments in database
      const response = await fetch(`${API_BASE_URL}/parking/project/${projectId}/assign`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apartmentId: `${currentFloor}-${selectedApartment}`,
          parkingIds: parkingIdsToAssign,
          userId: user.userId,
          userName: user.name,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error assigning parking spots:", errorData)
        if (notyf) notyf.error(`Error al asignar cocheras: ${errorData.message || "Error desconocido"}`)
        return
      }

      // Refresh data to get the latest state
      await refreshData()

      if (notyf) notyf.success("Cocheras actualizadas con éxito")
      setShowParkingAssignment(false)
    } catch (err) {
      console.error("Error assigning parking spots:", err)
      if (notyf) notyf.error("Error al asignar cocheras")
    }
  }

  const handleParkingUnassignment = async () => {
    if (!selectedParking || !projectId || !user) return

    try {
      const spot = parkingSpots.find((s) => s.id === selectedParking)
      if (!spot || !spot.assignedTo || !spot.dbId) {
        if (notyf) notyf.error("No se encontró información de la cochera")
        return
      }

      // Update parking spot in database
      const response = await fetch(`${API_BASE_URL}/parking/${spot.dbId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "libre",
          assigned_to: null,
          userId: user.userId,
          userName: user.name,
          projectId: projectId,
          description: `${user.name} desasignó la cochera ${selectedParking} del departamento ${spot.assignedTo}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error unassigning parking spot:", errorData)
        if (notyf) notyf.error(`Error al desasignar cochera: ${errorData.message || "Error desconocido"}`)
        return
      }

      // Refresh data to get the latest state
      await refreshData()

      if (notyf) notyf.success(`Cochera ${selectedParking} desasignada con éxito`)
      setIsParkingInfoModalOpen(false)
      setSelectedParking(null)
    } catch (err) {
      console.error("Error unassigning parking spot:", err)
      if (notyf) notyf.error("Error al desasignar cochera")
    }
  }

  const handleParkingAssignment2 = async (apartmentId: string | null) => {
    if (!selectedParking || !projectId || !user) return

    try {
      const spot = parkingSpots.find((s) => s.id === selectedParking)
      if (!spot || !spot.dbId) {
        if (notyf) notyf.error("No se encontró información de la cochera")
        return
      }

      // Update parking spot in database
      const response = await fetch(`${API_BASE_URL}/parking/${spot.dbId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: apartmentId ? "ocupado" : "libre",
          assigned_to: apartmentId,
          userId: user.userId,
          userName: user.name,
          projectId: projectId,
          description: apartmentId
            ? `${user.name} asignó la cochera ${selectedParking} al departamento ${apartmentId}`
            : `${user.name} liberó la cochera ${selectedParking}`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error updating parking spot:", errorData)
        if (notyf) notyf.error(`Error al actualizar cochera: ${errorData.message || "Error desconocido"}`)
        return
      }

      // Refresh data to get the latest state
      await refreshData()

      if (notyf) notyf.success(apartmentId ? "Cochera asignada con éxito" : "Cochera liberada con éxito")
      setIsParkingModalOpen(false)
      setSelectedParking(null)
    } catch (err) {
      console.error("Error updating parking spot:", err)
      if (notyf) notyf.error("Error al actualizar cochera")
    }
  }

  const handleOpenParkingAssignment = () => {
    if (!selectedApartment || !floorData.apartments[selectedApartment]) {
      console.error("No se ha seleccionado un apartamento válido")
      if (notyf) notyf.error("No se ha seleccionado un apartamento válido")
      return
    }

    const initialSelectedParkings = floorData.apartments[selectedApartment].assignedParkings.reduce(
      (acc, parkingId) => {
        acc[parkingId] = true
        return acc
      },
      {} as { [key: string]: boolean },
    )
    setSelectedParkings(initialSelectedParkings)
    setShowParkingAssignment(true)
  }

  const getTextX = (id: string) => {
    const spotIndex = Number.parseInt(id.slice(1)) - 1
    if (spotIndex < 9) {
      return parkingSpots[spotIndex]?.path.split(" ")[1] || "0"
    } else if (spotIndex === 9) {
      return "3770"
    } else if (spotIndex === 10) {
      return "3770"
    } else {
      return "1500"
    }
  }

  const getTextY = (id: string) => {
    const spotIndex = Number.parseInt(id.slice(1)) - 1
    if (spotIndex < 9) {
      return parkingSpots[spotIndex]?.path.split(" ")[2] || "0"
    } else if (spotIndex === 9 || spotIndex === 10) {
      return "1300"
    } else {
      return "2300"
    }
  }

  // Modify the loading/error section to include API availability message
  if (!apiAvailable) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <p className="text-xl mb-4">No se puede conectar al servidor API</p>
        <p className="text-zinc-400 text-center max-w-md mb-6">
          El servidor API no está disponible en este momento. Verifique que el servidor esté en ejecución en{" "}
          {API_BASE_URL}.
        </p>
        <Button onClick={onReturnToProjectModal} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al proyecto
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">Cargando datos del piso...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <p className="text-xl text-red-500 mb-4">Error: {error}</p>
        <div className="flex space-x-4 mb-6">
          <Button onClick={refreshData} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
          <Button onClick={createFloorsAndApartments} className="bg-green-600 hover:bg-green-700 text-white">
            Crear pisos y departamentos
          </Button>
        </div>
        <Button onClick={onReturnToProjectModal} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al proyecto
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
          <TabsContent value="apartments">
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
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold ${currentFloor === floor ? "bg-zinc-800" : ""}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {floor}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative aspect-video -ml-9 md:-ml-9">
                <Image
                  src={floorPlans[currentFloor] || "/placeholder.svg"}
                  alt={`Plano del Piso ${currentFloor}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "contain" }}
                  className="pointer-events-none"
                />
                <div className="absolute inset-0 z-10">
                  <svg
                    viewBox={floorData.viewBox || "-200 0 3200 2400"}
                    className="w-full h-full"
                    style={{ pointerEvents: "all" }}
                  >
                    <g transform="scale(1, 1) translate(-83, 10)">
                      {Object.entries(floorData.apartments).map(([apt, data]) => (
                        <path
                          key={apt}
                          d={floorData.svgPaths[apt] || ""}
                          fill={statusColors[data.status]}
                          stroke="black"
                          strokeWidth="10"
                          opacity="0.7"
                          onClick={() => handleApartmentClick(apt)}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </g>
                  </svg>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold">Plano del Piso {currentFloor}</h3>
                <p className="text-zinc-400 text-sm">Selecciona los departamentos para ver su estado.</p>
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
                  {currentGarageLevel === 1 ? (
                    <>
                      <div className="relative aspect-video overflow-hidden">
                        <div className="absolute inset-0 scale-100 origin-center">
                          <Image
                            src={garagePlans[currentGarageLevel] || "/placeholder.svg"}
                            alt={`Plano de Cocheras Nivel ${currentGarageLevel}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <svg viewBox="90 450 4400 2600" className="absolute top-0 left-0 w-full h-full">
                          {parkingSpots
                            .filter((spot) => spot.level === currentGarageLevel)
                            .map((spot) => (
                              <g
                                key={spot.id}
                                onClick={() => handleParkingClick(spot.id, spot.level)}
                                style={{ cursor: "pointer" }}
                              >
                                <path
                                  d={spot.path}
                                  fill={
                                    spot.status === "libre" ? "rgba(135, 245, 175, 0.3)" : "rgba(245, 127, 127, 0.3)"
                                  }
                                  stroke={spot.status === "libre" ? "#22c55e" : "#ef4444"}
                                  strokeWidth="3"
                                />
                                <text
                                  x={getTextX(spot.id)}
                                  y={getTextY(spot.id)}
                                  textAnchor="middle"
                                  fill="white"
                                  fontSize="40"
                                  dominantBaseline="middle"
                                  stroke="black"
                                  strokeWidth="1"
                                >
                                  {spot.id}
                                </text>
                                {spot.assignedTo && (
                                  <text
                                    x={getTextX(spot.id)}
                                    y={Number.parseInt(getTextY(spot.id)) + 60}
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="30"
                                    dominantBaseline="middle"
                                    stroke="black"
                                    strokeWidth="1"
                                  >
                                    {spot.assignedTo}
                                  </text>
                                )}
                              </g>
                            ))}
                        </svg>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full bg-zinc-800">
                      <p className="text-xl text-zinc-400">No hay cocheras disponibles en este nivel aún</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog
          open={isParkingModalOpen}
          onOpenChange={() => {
            setIsParkingModalOpen(false)
            setSelectedParking(null)
          }}
        >
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>
                {selectedParking && parkingSpots.find((spot) => spot.id === selectedParking)?.status === "ocupado"
                  ? `Liberar Cochera ${selectedParking} (Nivel 1)`
                  : `Asignar Cochera ${selectedParking} (Nivel 1)`}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedParking && (
                <div className="mb-4">
                  <p className="font-semibold">
                    Estado: {parkingSpots.find((spot) => spot.id === selectedParking)?.status}
                  </p>
                  {parkingSpots.find((spot) => spot.id === selectedParking)?.assignedTo && (
                    <p className="font-semibold">
                      Asignada a: {parkingSpots.find((spot) => spot.id === selectedParking)?.assignedTo}
                    </p>
                  )}
                </div>
              )}
              <h3 className="mb-4">
                {selectedParking && parkingSpots.find((spot) => spot.id === selectedParking)?.status === "ocupado"
                  ? "¿Estás seguro de que quieres liberar esta cochera?"
                  : "Selecciona un departamento para asignar la cochera:"}
              </h3>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {selectedParking && parkingSpots.find((spot) => spot.id === selectedParking)?.status === "ocupado" ? (
                  <Button onClick={() => handleParkingAssignment2(null)} className="w-full bg-red-600 hover:bg-red-700">
                    Liberar Cochera
                  </Button>
                ) : (
                  <>
                    {Object.entries(floorData.apartments).map(([apt, data]) => (
                      <Button
                        key={apt}
                        onClick={() => handleParkingAssignment2(`${currentFloor}-${apt}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 mb-1"
                      >
                        Asignar a {apt}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isParkingInfoModalOpen}
          onOpenChange={() => {
            setIsParkingInfoModalOpen(false)
            setSelectedParking(null)
          }}
        >
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
            <DialogHeader>
              <DialogTitle>Información de la Cochera {selectedParking}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {selectedParking && (
                <div className="space-y-4">
                  <p className="font-semibold">
                    Estado: {parkingSpots.find((spot) => spot.id === selectedParking)?.status}
                  </p>
                  <p className="font-semibold">
                    Asignada a: {parkingSpots.find((spot) => spot.id === selectedParking)?.assignedTo}
                  </p>
                  <Button onClick={handleParkingUnassignment} className="w-full bg-red-600 hover:bg-red-700">
                    Desasignar Cochera
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Detalles del departamento {selectedApartment}</DialogTitle>
            </DialogHeader>
            {selectedApartment && floorData.apartments[selectedApartment] ? (
              <div className="space-y-4">
                <DialogDescription className="text-zinc-300">
                  <p>
                    <strong>Estado:</strong> {floorData.apartments[selectedApartment].status}
                  </p>
                  <p>
                    <strong>Precio:</strong> {floorData.apartments[selectedApartment].price}
                  </p>
                  <p>
                    <strong>Superficie:</strong> {floorData.apartments[selectedApartment].surface}
                  </p>
                  {floorData.apartments[selectedApartment].buyer && (
                    <>
                      <p>
                        <strong>Comprador:</strong> {floorData.apartments[selectedApartment].buyer}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {floorData.apartments[selectedApartment].date}
                      </p>
                      {floorData.apartments[selectedApartment].phoneNumber && (
                        <p>
                          <strong>Teléfono:</strong> {floorData.apartments[selectedApartment].phoneNumber}
                        </p>
                      )}
                      {floorData.apartments[selectedApartment].email && (
                        <p>
                          <strong>Email:</strong> {floorData.apartments[selectedApartment].email}
                        </p>
                      )}
                    </>
                  )}
                  <p>
                    <strong>Cocheras asignadas:</strong>{" "}
                    {floorData.apartments[selectedApartment].assignedParkings.length > 0
                      ? floorData.apartments[selectedApartment].assignedParkings
                          .map((parkingId) => {
                            const parking = parkingSpots.find((spot) => spot.id === parkingId)
                            return parking ? `${parkingId} (Nivel ${parking.level})` : parkingId
                          })
                          .join(", ")
                      : "Ninguna"}
                  </p>
                </DialogDescription>
                {!action && (
                  <div className="space-y-2">
                    {floorData.apartments[selectedApartment].status === "libre" && (
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
                    {floorData.apartments[selectedApartment].status === "bloqueado" && (
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
                    {floorData.apartments[selectedApartment].status === "reservado" && (
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
                    {floorData.apartments[selectedApartment].status === "ocupado" && (
                      <>
                        <Button
                          onClick={() => handleDownloadContract(selectedApartment)}
                          className="bg-blue-600 hover:bg-blue-700 w-full"
                        >
                          Descargar contrato
                        </Button>
                        <Button
                          onClick={() => handleActionClick("release")}
                          className="bg-yellow-600 hover:bg-yellow-700 w-full"
                        >
                          Liberar departamento
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={handleOpenParkingAssignment}
                      className="bg-purple-600 hover:bg-purple-700 w-full"
                      disabled={!selectedApartment}
                    >
                      Asignar cocheras
                    </Button>
                  </div>
                )}
                {showParkingAssignment && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Seleccionar cocheras:</h3>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      {parkingSpots
                        .filter(
                          (spot) =>
                            spot.status === "libre" || spot.assignedTo === `${currentFloor}-${selectedApartment}`,
                        )
                        .map((spot) => (
                          <div key={spot.id} className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={spot.id}
                              checked={selectedParkings[spot.id] || false}
                              onCheckedChange={(checked) => {
                                setSelectedParkings((prev) => ({
                                  ...prev,
                                  [spot.id]: checked === true,
                                }))
                              }}
                            />
                            <label
                              htmlFor={spot.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Cochera {spot.id}{" "}
                              {spot.assignedTo === `${currentFloor}-${selectedApartment}` ? "(Asignada)" : ""}
                            </label>
                          </div>
                        ))}
                    </ScrollArea>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowParkingAssignment(false)
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleParkingAssignment}>Actualizar asignaciones</Button>
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
                        value={formData.price || floorData.apartments[selectedApartment].price}
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
                    {/* Add optional note field for reservation cancellation */}
                    {action === "reserve" && (
                      <div>
                        <Label htmlFor="note" className="text-white">
                          Nota (Opcional)
                        </Label>
                        <Textarea
                          id="note"
                          value={formData.note}
                          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                          className="text-white bg-zinc-800 border-zinc-700"
                        />
                      </div>
                    )}
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
                      {action === "block"
                        ? "Confirmar Bloqueo"
                        : action === "reserve" || action === "directReserve"
                          ? "Confirmar Reserva"
                          : action === "sell"
                            ? "Confirmar Venta"
                            : "Confirmar"}
                    </Button>
                  </form>
                )}
                {(action === "unblock" || action === "cancelReservation") && (
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
                      {action === "unblock" ? "Confirmar Liberación" : "Confirmar Cancelación de Reserva"}
                    </Button>
                  </form>
                )}
                {action === "release" && (
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
                    <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 w-full">
                      Confirmar Liberación
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <p className="text-zinc-300">Este departamento está disponible.</p>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false)
                  setShowParkingAssignment(false)
                }}
                className="text-white hover:bg-zinc-800 w-full"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          <div className="max-w-4xl mx-auto mb-8 mt-8">
            <div className="bg-zinc-900 p-4 rounded-lg">
              <h4 className="font-semibold mb-4">Registro de Actividades</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activityLog.map((activity, index) => (
                  <p key={index} className="text-sm text-zinc-300">
                    {activity}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
