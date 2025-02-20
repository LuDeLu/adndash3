"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Building,
  Car,
  FileSpreadsheet,
  FileBarChart,
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

// Añadir estas importaciones al principio del archivo
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

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
}

type UnitStats = {
  disponibles: number
  reservadas: number
  vendidas: number
  bloqueadas: number
}

const initialFloorData: { [key: number]: FloorData } = {
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
  2: {
    apartments: {
      "2A": { buyer: "", date: "", price: "$610.000", status: "libre", surface: "196,15 m²", assignedParkings: [] },
      "2B": { buyer: "", date: "", price: "$668.800", status: "libre", surface: "201,05 m²", assignedParkings: [] },
      "2C": { buyer: "", date: "", price: "$468.800", status: "libre", surface: "168,35 m²", assignedParkings: [] },
    },
    svgPaths: {
      "2A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "2B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "2C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    viewBox: "0 0 3200 2400",
  },
  3: {
    apartments: {
      "3A": {
        buyer: "Luciano Florentino",
        date: "2023-09-27",
        price: "$631.900",
        status: "ocupado",
        surface: "196,15 m²",
        assignedParkings: [],
      },
      "3B": {
        buyer: "Pedro Ramírez",
        date: "2023-09-05",
        price: "$692.900",
        status: "ocupado",
        surface: "201,05 m²",
        assignedParkings: [],
      },
      "3C": { buyer: "", date: "", price: "$469.800", status: "libre", surface: "168,35 m²", assignedParkings: [] },
    },
    svgPaths: {
      "3A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "3B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "3C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    viewBox: "0 0 3200 2400",
  },
  4: {
    apartments: {
      "4A": { buyer: "", date: "", price: "$657.300", status: "libre", surface: "196,15 m²", assignedParkings: [] },
      "4B": { buyer: "", date: "", price: "$717.000", status: "libre", surface: "201,05 m²", assignedParkings: [] },
      "4C": { buyer: "", date: "", price: "$424.800", status: "libre", surface: "168,35 m²", assignedParkings: [] },
    },
    svgPaths: {
      "4A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "4B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "4C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    viewBox: "0 0 3200 2400",
  },
  5: {
    apartments: {
      "5A": {
        buyer: "Carlos Hernández",
        date: "2024-01-23",
        price: "$679.300",
        status: "ocupado",
        surface: "196,15 m²",
        assignedParkings: [],
      },
      "5B": {
        buyer: "Javier Martínez",
        date: "2023-11-20",
        price: "$741.100",
        status: "ocupado",
        surface: "201,05 m²",
        assignedParkings: [],
      },
      "5C": {
        buyer: "Laura Fernández",
        date: "2024-09-04",
        price: "$439.100",
        status: "ocupado",
        surface: "168,35 m²",
        assignedParkings: [],
      },
    },
    svgPaths: {
      "5A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "5B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "5C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    viewBox: "0 0 3200 2400",
  },
  6: {
    apartments: {
      "6A": { buyer: "", date: "", price: "$696.200", status: "libre", surface: "196,15 m²", assignedParkings: [] },
      "6B": {
        buyer: "Mariano Nicolas Aldrede",
        date: "2023-07-14",
        price: "$759.500",
        status: "ocupado",
        surface: "201,05 m²",
        assignedParkings: [],
      },
      "6C": {
        buyer: "Isabel Rodríguez",
        date: "2023-12-25",
        price: "$450.100",
        status: "reservado",
        surface: "168,35 m²",
        assignedParkings: [],
      },
    },
    svgPaths: {
      "6A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "6B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "6C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    viewBox: "0 0 3200 2400",
  },
  7: {
    apartments: {
      "7A": { buyer: "", date: "", price: "$696.200", status: "libre", surface: "196,15 m²", assignedParkings: [] },
      "7B": {
        buyer: "Mariano Nicolas Aldrede",
        date: "2023-07-14",
        price: "$759.500",
        status: "ocupado",
        surface: "201,05 m²",
        assignedParkings: [],
      },
      "7C": {
        buyer: "Isabel Rodríguez",
        date: "2023-12-25",
        price: "$450.100",
        status: "reservado",
        surface: "168,35 m²",
        assignedParkings: [],
      },
    },
    svgPaths: {
      "7A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "7B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "7C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    viewBox: "0 0 3200 2400",
  },
  8: {
    apartments: {
      "8A": { buyer: "", date: "", price: "$696.200", status: "libre", surface: "196,15 m²", assignedParkings: [] },
      "8B": {
        buyer: "Mariano Nicolas Aldrede",
        date: "2023-07-14",
        price: "$759.500",
        status: "ocupado",
        surface: "201,05 m²",
        assignedParkings: [],
      },
      "8C": {
        buyer: "Isabel Rodríguez",
        date: "2023-12-25",
        price: "$450.100",
        status: "reservado",
        surface: "168,35 m²",
        assignedParkings: [],
      },
    },
    svgPaths: {
      "8A": "M854,1776 L203,1786 L208,420 L605,414 L595,351 L1341,255 L1346,1304 L1754,1304 L1754,1447 L1346,1463 L1346,1702 L859,1712 Z",
      "8B": "M1346,1447 L1341,1702 L1558,1712 L1558,1792 L1748,1792 L1748,2094 L3114,2094 L3108,1087 L2436,1087 L2431,1214 L2251,1220 L2256,1431 Z",
      "8C": "M3119,1092 L2426,1082 L2426,1008 L2045,1018 L2039,838 L2436,817 L2442,626 L1965,626 L1976,838 L1817,838 L1817,1008 L1346,1008 L1346,255 L3124,22 Z",
    },
    viewBox: "0 0 3455 2250",
  },
  9: {
    apartments: {
      "9A": { buyer: "", date: "", price: "$696.200", status: "libre", surface: "196,15 m²", assignedParkings: [] },
      "9B": {
        buyer: "Mariano Nicolas Aldrede",
        date: "2023-07-14",
        price: "$759.500",
        status: "ocupado",
        surface: "201,05 m²",
        assignedParkings: [],
      },
    },
    svgPaths: {
      "9A": "M22,342 L26,1335 L1599,1335 L1602,1054 L1449,1054 L1442,926 L1001,929 L1001,214 Z",
      "9B": "M1342,1332 L1342,1613 L2345,1610 L2352,26 L1001,217 L994,342 L1175,346 L1178,679 L1783,683 L1783,1047 L1606,1051 L1606,1325 Z",
    },
    viewBox: "0 0 2220 1700",
  },
}

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

// Añadir estas constantes cerca del inicio del archivo, junto con las otras definiciones

const garageLevels = [1, 2, 3]

const garagePlans = {
  1: "/images/planos/cochera1.svg",
  2: "/images/planos/cochera2.svg",
  3: "/images/planos/cochera3.svg",
}

// Actualizar la definición de ParkingSpot para incluir el nivel
type ParkingSpot = {
  id: string
  level: number
  status: "libre" | "ocupado"
  assignedTo: string | null
  path: string
}

interface InteractiveFloorPlanProps {
  projectId?: number
  floorNumber?: number | null
  onReturnToProjectModal: () => void
}

const parkingSpotPaths = [
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

  // Dentro de la función del componente, añadir este nuevo estado
  const [currentGarageLevel, setCurrentGarageLevel] = useState(1)

  // Actualizar la inicialización de parkingSpots
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(
    parkingSpotPaths.map((path, index) => ({
      id: `P${index + 1}`,
      level: 1, // Asignar todos al nivel 1
      status: "libre",
      assignedTo: null,
      path: path,
    })),
  )
  const [isParkingModalOpen, setIsParkingModalOpen] = useState(false)
  const [floorData, setFloorData] = useState(initialFloorData)

  // Añadir este nuevo estado dentro de la función del componente
  const [showParkingAssignment, setShowParkingAssignment] = useState(false)
  // Actualizar el estado selectedParkings para que sea un objeto en lugar de un array
  const [selectedParkings, setSelectedParkings] = useState<{ [key: string]: boolean }>({})

  // Añadir este estado cerca de los otros estados del componente
  const [isParkingInfoModalOpen, setIsParkingInfoModalOpen] = useState(false)

  // Actualizar la función handleParkingAssignment
  const handleParkingAssignment = () => {
    if (selectedApartment) {
      // En la función handleParkingAssignment, modificar la creación de updatedParkingSpots
      const updatedParkingSpots = parkingSpots.map((spot): ParkingSpot => {
        if (selectedParkings[spot.id]) {
          return {
            ...spot,
            status: "ocupado",
            assignedTo: selectedApartment,
          }
        } else if (spot.assignedTo === selectedApartment) {
          return {
            ...spot,
            status: "libre",
            assignedTo: null,
          }
        }
        return spot
      })

      setParkingSpots(updatedParkingSpots)

      setFloorData((prevData) => ({
        ...prevData,
        [currentFloor]: {
          ...prevData[currentFloor],
          apartments: {
            ...prevData[currentFloor].apartments,
            [selectedApartment]: {
              ...prevData[currentFloor].apartments[selectedApartment],
              assignedParkings: updatedParkingSpots
                .filter((spot) => spot.assignedTo === selectedApartment)
                .map((spot) => spot.id),
            },
          },
        },
      }))

      // Añadir entrada al registro de actividades
      const timestamp = new Date().toLocaleString()
      const assignedParkings = Object.keys(selectedParkings).filter((id) => selectedParkings[id])
      const unassignedParkings = updatedParkingSpots
        .filter((spot) => spot.status === "libre" && !selectedParkings[spot.id])
        .map((spot) => spot.id)

      let activityMessage = `${user?.name} `
      if (assignedParkings.length > 0) {
        activityMessage += `asignó las cocheras ${assignedParkings.join(", ")} `
      }
      if (unassignedParkings.length > 0) {
        activityMessage += `${assignedParkings.length > 0 ? "y " : ""}desasignó las cocheras ${unassignedParkings.join(", ")} `
      }
      activityMessage += `del departamento ${selectedApartment}`

      setActivityLog((prevLog) => [`${timestamp} - ${activityMessage}`, ...prevLog])

      if (notyf) notyf.success("Cocheras actualizadas con éxito")
    }
    setShowParkingAssignment(false)
  }

  // Actualizar la función handleParkingClick
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

  // Añadir esta nueva función para manejar la desasignación
  const handleParkingUnassignment = () => {
    if (selectedParking) {
      const spot = parkingSpots.find((s) => s.id === selectedParking)
      if (spot && spot.assignedTo) {
        // Desasignar la cochera
        setParkingSpots((spots) =>
          spots.map((s) => (s.id === selectedParking ? { ...s, status: "libre", assignedTo: null } : s)),
        )

        // Remover la cochera del departamento
        setFloorData((prevData) => {
          const updatedData = { ...prevData } as typeof initialFloorData
          Object.keys(updatedData).forEach((floor) => {
            const floorNum = Number.parseInt(floor)
            if (updatedData[floorNum] && updatedData[floorNum].apartments) {
              Object.keys(updatedData[floorNum].apartments).forEach((apt) => {
                if (updatedData[floorNum].apartments[apt].assignedParkings.includes(selectedParking)) {
                  updatedData[floorNum].apartments[apt] = {
                    ...updatedData[floorNum].apartments[apt],
                    assignedParkings: updatedData[floorNum].apartments[apt].assignedParkings.filter(
                      (id) => id !== selectedParking,
                    ),
                  }
                }
              })
            }
          })

          // Añadir entrada al registro de actividades para liberación
          const timestamp = new Date().toLocaleString()
          const activityMessage = `${user?.name} desasignó la cochera ${selectedParking} del departamento ${spot.assignedTo}`
          setActivityLog((prevLog) => [`${timestamp} - ${activityMessage}`, ...prevLog])

          return updatedData
        })

        if (notyf) notyf.success(`Cochera ${selectedParking} desasignada con éxito`)
      }
      setIsParkingInfoModalOpen(false)
      setSelectedParking(null)
    }
  }

  // Actualizar la función handleParkingAssignment2
  const handleParkingAssignment2 = (apartmentId: string | null) => {
    if (selectedParking) {
      setParkingSpots((spots) =>
        spots.map((spot) =>
          spot.id === selectedParking && spot.level === currentGarageLevel
            ? { ...spot, status: apartmentId ? "ocupado" : "libre", assignedTo: apartmentId }
            : spot,
        ),
      )

      if (apartmentId) {
        const [floorStr, apartment] = apartmentId.split("-")
        const floor = Number.parseInt(floorStr)

        setFloorData((prevData) => {
          const newData = { ...prevData }
          if (newData[floor] && newData[floor].apartments && apartment) {
            newData[floor] = {
              ...newData[floor],
              apartments: {
                ...newData[floor].apartments,
                [apartment]: {
                  ...newData[floor].apartments[apartment],
                  assignedParkings: [
                    ...newData[floor].apartments[apartment].assignedParkings.filter((id) => id !== selectedParking),
                    selectedParking,
                  ],
                },
              },
            }
          }
          return newData
        })

        // Añadir entrada al registro de actividades para asignación
        const timestamp = new Date().toLocaleString()
        const activityMessage = `${user?.name} asignó la cochera ${selectedParking} al departamento ${apartmentId}`
        setActivityLog((prevLog) => [`${timestamp} - ${activityMessage}`, ...prevLog])
      } else {
        // Si se está liberando la cochera, removerla de cualquier departamento que la tenga asignada
        setFloorData((prevData) => {
          const newData = { ...prevData }
          let departmentReleased = ""

          Object.entries(newData).forEach(([floorStr, floorData]) => {
            const floor = Number.parseInt(floorStr)
            if (newData[floor] && newData[floor].apartments) {
              Object.entries(floorData.apartments).forEach(([apt, aptData]) => {
                if (aptData.assignedParkings.includes(selectedParking)) {
                  departmentReleased = `${floor}-${apt}`
                  newData[floor].apartments[apt] = {
                    ...aptData,
                    assignedParkings: aptData.assignedParkings.filter((id) => id !== selectedParking),
                  }
                }
              })
            }
          })

          // Añadir entrada al registro de actividades para liberación
          const timestamp = new Date().toLocaleString()
          const activityMessage = `${user?.name} liberó la cochera ${selectedParking} del departamento ${departmentReleased}`
          setActivityLog((prevLog) => [`${timestamp} - ${activityMessage}`, ...prevLog])

          return newData
        })
      }
    }

    setIsParkingModalOpen(false)
    setSelectedParking(null)
    if (notyf) notyf.success(apartmentId ? "Cochera asignada con éxito" : "Cochera liberada con éxito")
  }

  const updateUnitStats = useCallback(() => {
    const currentFloorData = floorData[currentFloor]
    if (!currentFloorData || !currentFloorData.apartments) {
      setUnitStats({ disponibles: 0, reservadas: 0, vendidas: 0, bloqueadas: 0 })
      return
    }

    const stats = Object.values(currentFloorData.apartments).reduce(
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
  }, [currentFloor, floorData])

  useEffect(() => {
    if (projectId) {
      console.log(`Project ID: ${projectId}`)
    }
    if (floorNumber !== undefined && floorNumber !== null && currentFloor === 1) {
      setCurrentFloor(floorNumber)
    }
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
    updateUnitStats()
  }, [projectId, floorNumber, updateUnitStats, currentFloor])

  useEffect(() => {
    updateUnitStats()
  }, [updateUnitStats])

  const handleFloorClick = (floor: number) => {
    setCurrentFloor(floor)
    setSelectedApartment(null)
    setIsModalOpen(false)
    updateUnitStats()
  }

  const handleApartmentClick = (apartment: string) => {
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
  }

  const handleActionClick = (
    actionType: "block" | "reserve" | "sell" | "unblock" | "directReserve" | "cancelReservation" | "release",
  ) => {
    setAction(actionType)
    if (
      actionType === "reserve" &&
      selectedApartment &&
      floorData[currentFloor].apartments[selectedApartment].status === "bloqueado"
    ) {
      setConfirmReservation(true)
    }
    if (actionType === "cancelReservation") {
      setConfirmCancelReservation(true)
    }
    if (actionType === "release") {
      setConfirmRelease(true)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedApartment && floorData[currentFloor] && floorData[currentFloor].apartments) {
      const apartment = floorData[currentFloor].apartments[selectedApartment]
      const previousStatus = apartment.status

      // Actualizar el precio si se ha modificado
      if (formData.price && formData.price !== apartment.price) {
        apartment.price = formData.price
      }

      let activityMessage = ""

      switch (action) {
        case "block":
          apartment.status = "bloqueado"
          apartment.buyer = formData.name
          apartment.phoneNumber = formData.phone
          activityMessage = `${user?.name} bloqueó el departamento ${selectedApartment}`
          if (notyf) notyf.success("Departamento bloqueado con éxito")
          break
        case "reserve":
        case "directReserve":
          apartment.status = "reservado"
          if (previousStatus !== "bloqueado") {
            apartment.buyer = formData.name
            apartment.phoneNumber = formData.phone
          }
          apartment.date = new Date().toISOString().split("T")[0]
          activityMessage = `${user?.name} reservó el departamento ${selectedApartment}`
          if (notyf) notyf.success("Departamento reservado con éxito")
          break
        case "sell":
          apartment.status = "ocupado"
          break
        case "sell":
          apartment.status = "ocupado"
          apartment.contractFile = formData.reservationOrder
          activityMessage = `${user?.name} vendió el departamento ${selectedApartment}`
          if (notyf) notyf.success("Departamento vendido con éxito")
          break
        case "unblock":
          if (formData.note) {
            apartment.status = "libre"
            apartment.buyer = ""
            apartment.phoneNumber = ""
            apartment.date = ""
            activityMessage = `${user?.name} liberó el bloqueo del departamento ${selectedApartment}. Nota: ${formData.note}`
            if (notyf) notyf.success("Bloqueo liberado con éxito")
          } else {
            if (notyf) notyf.error("Se requiere una nota para liberar el bloqueo")
            return
          }
          break
        case "cancelReservation":
          if (formData.note) {
            apartment.status = "libre"
            apartment.buyer = ""
            apartment.phoneNumber = ""
            apartment.date = ""
            activityMessage = `${user?.name} canceló la reserva del departamento ${selectedApartment}. Nota: ${formData.note}`
            if (notyf) notyf.success("Reserva cancelada con éxito")
          } else {
            if (notyf) notyf.error("Se requiere una nota para cancelar la reserva")
            return
          }
          break
        case "release":
          if (formData.note) {
            apartment.status = "libre"
            apartment.buyer = ""
            apartment.phoneNumber = ""
            apartment.date = ""
            apartment.contractFile = null
            activityMessage = `${user?.name} liberó el departamento ${selectedApartment}. Nota: ${formData.note}`
            if (notyf) notyf.success("Departamento liberado con éxito")
          } else {
            if (notyf) notyf.error("Se requiere una nota para liberar el departamento")
            return
          }
          break
      }

      if (activityMessage) {
        const timestamp = new Date().toLocaleString()
        setActivityLog((prevLog) => [`${timestamp} - ${activityMessage}`, ...prevLog])
      }

      updateUnitStats()
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
    const apartmentData = currentFloorData.apartments[apartment]
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

  const currentFloorData = floorData[currentFloor] || { apartments: {}, svgPaths: {} }
  const totalUnits = Object.keys(currentFloorData.apartments).length

  const getTextX = (id: string) => {
    const spotIndex = Number.parseInt(id.slice(1)) - 1
    if (spotIndex < 9) {
      return parkingSpotPaths[spotIndex].split(" ")[1]
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
      return parkingSpotPaths[spotIndex].split(" ")[2]
    } else if (spotIndex === 9 || spotIndex === 10) {
      return "1300"
    } else {
      return "2300"
    }
  }

  // Actualizar la función handleOpenParkingAssignment
  const handleOpenParkingAssignment = () => {
    if (selectedApartment && currentFloorData.apartments[selectedApartment]) {
      const initialSelectedParkings = currentFloorData.apartments[selectedApartment].assignedParkings.reduce(
        (acc, parkingId) => {
          acc[parkingId] = true
          return acc
        },
        {} as { [key: string]: boolean },
      )
      setSelectedParkings(initialSelectedParkings)
      setShowParkingAssignment(true)
    } else {
      // Manejar el caso en que selectedApartment es null o el apartamento no existe
      console.error("No se ha seleccionado un apartamento válido")
      if (notyf) notyf.error("No se ha seleccionado un apartamento válido")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button onClick={onReturnToProjectModal} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 mb-8">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al proyecto
        </Button>

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
          {/* Dentro del TabsContent para "garage", reemplazar el contenido existente con esto: */}
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
                  layout="fill"
                  objectFit="contain"
                  className="pointer-events-none"
                />
                <svg
                  viewBox={currentFloorData.viewBox || "-200 0 3200 2400"}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ pointerEvents: "none" }}
                >
                  <g transform="scale(1, 1) translate(-83, 10)">
                    <AnimatePresence>
                      {Object.entries(currentFloorData.apartments).map(([apt, data]) => (
                        <motion.path
                          key={apt}
                          d={currentFloorData.svgPaths[apt] || ""}
                          fill={statusColors[data.status]}
                          stroke="black"
                          strokeWidth="10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          whileHover={{ opacity: 0.8 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => handleApartmentClick(apt)}
                          style={{ cursor: "pointer", pointerEvents: "all" }}
                        />
                      ))}
                    </AnimatePresence>
                  </g>
                </svg>
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
                            layout="fill"
                            objectFit="cover"
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
                    {Object.entries(floorData).map(([floor, data]) => (
                      <div key={floor}>
                        <h4 className="font-bold mt-2 mb-1">Piso {floor}</h4>
                        {Object.keys(data.apartments).map((aptId) => (
                          <Button
                            key={`${floor}-${aptId}`}
                            onClick={() => handleParkingAssignment2(`${floor}-${aptId}`)}
                            className="w-full bg-blue-600 hover:bg-blue-700 mb-1"
                          >
                            Asignar a {aptId}
                          </Button>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Añadir este nuevo modal después del modal de asignación de cocheras existente */}
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

        {/* Modificar el contenido del DialogContent para el modal de detalles del departamento */}
        {/* Reemplazar el contenido existente con este: */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Detalles del departamento {selectedApartment}</DialogTitle>
            </DialogHeader>
            {selectedApartment && currentFloorData.apartments[selectedApartment] ? (
              <div className="space-y-4">
                <DialogDescription className="text-zinc-300">
                  <p>
                    <strong>Estado:</strong> {currentFloorData.apartments[selectedApartment].status}
                  </p>
                  <p>
                    <strong>Precio:</strong> {currentFloorData.apartments[selectedApartment].price}
                  </p>
                  <p>
                    <strong>Superficie:</strong> {currentFloorData.apartments[selectedApartment].surface}
                  </p>
                  {currentFloorData.apartments[selectedApartment].buyer && (
                    <>
                      <p>
                        <strong>Comprador:</strong> {currentFloorData.apartments[selectedApartment].buyer}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {currentFloorData.apartments[selectedApartment].date}
                      </p>
                      {currentFloorData.apartments[selectedApartment].phoneNumber && (
                        <p>
                          <strong>Teléfono:</strong> {currentFloorData.apartments[selectedApartment].phoneNumber}
                        </p>
                      )}
                      {currentFloorData.apartments[selectedApartment].email && (
                        <p>
                          <strong>Email:</strong> {currentFloorData.apartments[selectedApartment].email}
                        </p>
                      )}
                    </>
                  )}
                  {/* Actualizar la visualización de las cocheras asignadas en los detalles del apartamento */}
                  <p>
                    <strong>Cocheras asignadas:</strong>{" "}
                    {currentFloorData.apartments[selectedApartment].assignedParkings.length > 0
                      ? currentFloorData.apartments[selectedApartment].assignedParkings
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
                    {currentFloorData.apartments[selectedApartment].status === "libre" && (
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
                    {currentFloorData.apartments[selectedApartment].status === "bloqueado" && (
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
                    {currentFloorData.apartments[selectedApartment].status === "reservado" && (
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
                    {currentFloorData.apartments[selectedApartment].status === "ocupado" && (
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
                        .filter((spot) => spot.status === "libre" || spot.assignedTo === selectedApartment)
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
                              Cochera {spot.id} {spot.assignedTo === selectedApartment ? "(Asignada)" : ""}
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
                        value={formData.price || currentFloorData.apartments[selectedApartment].price}
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

