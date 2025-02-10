"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ParkingSpotStatus = "ocupado" | "reservado" | "libre" | "bloqueado"

type ParkingSpotData = {
  id: string
  status: ParkingSpotStatus
  owner?: string
  price: string
}

type ParkingSpotsState = { [key: number]: ParkingSpotData[] }

interface GarageViewProps {
  assignedParkingSpots: { [key: string]: string[] }
  onAssignParkingSpot: (apartment: string, parkingSpot: string) => void
  onRemoveParkingSpot: (apartment: string, parkingSpot: string) => void
  parkingSpots: ParkingSpotsState
  setParkingSpots: React.Dispatch<React.SetStateAction<ParkingSpotsState>>
}

const statusColors: { [key in ParkingSpotStatus]: string } = {
  ocupado: "red",
  reservado: "yellow",
  libre: "green",
  bloqueado: "gray",
}

export default function GarageView({
  assignedParkingSpots,
  onAssignParkingSpot,
  onRemoveParkingSpot,
  parkingSpots,
  setParkingSpots,
}: GarageViewProps) {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpotData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [assigningTo, setAssigningTo] = useState<string | null>(null)

  const handleSpotClick = (spot: ParkingSpotData) => {
    if (assigningTo) {
      onAssignParkingSpot(assigningTo, spot.id)
      setAssigningTo(null)
    } else {
      setSelectedSpot(spot)
      setIsModalOpen(true)
    }
  }

  const handleLevelChange = (direction: "up" | "down") => {
    setCurrentLevel((prevLevel) => {
      if (direction === "up" && prevLevel < 3) return prevLevel + 1
      if (direction === "down" && prevLevel > 1) return prevLevel - 1
      return prevLevel
    })
  }

  const generateParkingSpotPath = (index: number) => {
    const row = Math.floor(index / 5)
    const col = index % 5
    const x = 40 + col * 150
    const y = 40 + row * 100
    return `M${x},${y} L${x + 120},${y} L${x + 120},${y + 80} L${x},${y + 80} Z`
  }

  return (
    <div className="max-w-4xl mx-auto bg-black text-white">
      <div className="rounded-lg overflow-hidden mb-8">
        <div className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Selecciona un nivel de cochera</h2>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <button
                onClick={() => handleLevelChange("down")}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                disabled={currentLevel === 1}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <span className="mx-4 text-lg font-bold">Nivel {currentLevel}</span>
              <button
                onClick={() => handleLevelChange("up")}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
                disabled={currentLevel === 3}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setCurrentLevel(level)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full font-bold ${
                    currentLevel === level ? "bg-zinc-800" : ""
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {level}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative aspect-video">
          <Image
            src="/images/planos/cochera1.svg"
            alt={`Plano de la Cochera - Nivel ${currentLevel}`}
            layout="fill"
            objectFit="contain"
            className="opacity-20"
          />
          <svg viewBox="0 0 800 480" className="absolute top-0 left-0 w-full h-full">
            {parkingSpots[currentLevel]?.map((spot, index) => (
              <motion.path
                key={spot.id}
                d={generateParkingSpotPath(index)}
                fill={statusColors[spot.status]}
                stroke="#000"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSpotClick(spot)}
                style={{ cursor: "pointer" }}
              />
            ))}
            {parkingSpots[currentLevel]?.map((spot, index) => (
              <text
                key={`text-${spot.id}`}
                x={40 + (index % 5) * 150 + 60}
                y={40 + Math.floor(index / 5) * 100 + 40}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
              >
                {spot.id}
              </text>
            ))}
          </svg>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-bold">Plano de Cocheras - Nivel {currentLevel}</h3>
          <p className="text-zinc-400 text-sm">Selecciona las cocheras para ver su estado.</p>
        </div>
      </div>

      {assigningTo && (
        <div className="bg-zinc-800 p-4 rounded-lg mb-4">
          <p className="text-lg font-semibold">Asignando cochera para el departamento {assigningTo}</p>
          <Button onClick={() => setAssigningTo(null)} className="mt-2 bg-red-600 hover:bg-red-700">
            Cancelar asignación
          </Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Detalles de la cochera {selectedSpot?.id}</DialogTitle>
          </DialogHeader>
          {selectedSpot && (
            <DialogDescription className="text-zinc-300">
              <p>
                <strong>Estado:</strong> {selectedSpot.status}
              </p>
              <p>
                <strong>Precio:</strong> {selectedSpot.price}
              </p>
              {selectedSpot.owner && (
                <p>
                  <strong>Asignado a:</strong> {selectedSpot.owner}
                </p>
              )}
            </DialogDescription>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="text-white hover:bg-zinc-800 w-full"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

