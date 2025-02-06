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

type ParkingSpotStatus = "ocupado" | "reservado" | "libre" | "bloqueado"

type ParkingSpotData = {
  id: string
  status: ParkingSpotStatus
  owner?: string
  price: string
}

const parkingSpots: ParkingSpotData[] = [
  { id: "A1", status: "libre", price: "$50,000" },
  { id: "A2", status: "ocupado", owner: "Juan Pérez", price: "$50,000" },
  { id: "A3", status: "reservado", owner: "María García", price: "$50,000" },
  { id: "B1", status: "libre", price: "$45,000" },
  { id: "B2", status: "bloqueado", price: "$45,000" },
  { id: "B3", status: "libre", price: "$45,000" },
  // Add more parking spots as needed
]

const statusColors = {
  ocupado: "#f57f7f",
  reservado: "#edcf53",
  libre: "#87f5af",
  bloqueado: "#7f7fff",
}

export default function GarageView() {
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpotData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSpotClick = (spot: ParkingSpotData) => {
    setSelectedSpot(spot)
    setIsModalOpen(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-zinc-900 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Plano de la Cochera</h2>
        <div className="relative aspect-video">
          <Image src="/images/planos/plano_cochera.svg" alt="Plano de la Cochera" layout="fill" objectFit="contain" />
          <svg viewBox="0 0 1000 600" className="absolute top-0 left-0 w-full h-full">
            {parkingSpots.map((spot) => (
              <motion.rect
                key={spot.id}
                x={(Number.parseInt(spot.id[1]) - 1) * 150 + 50}
                y={spot.id[0] === "A" ? 50 : 300}
                width="120"
                height="200"
                fill={statusColors[spot.status]}
                stroke="black"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                whileHover={{ opacity: 0.8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSpotClick(spot)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </svg>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Detalles del espacio de estacionamiento {selectedSpot?.id}</DialogTitle>
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
                  <strong>Propietario:</strong> {selectedSpot.owner}
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

