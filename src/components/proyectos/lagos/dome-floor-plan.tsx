"use client"
import { useState, useCallback, useEffect, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ChevronLeft, ChevronRight, Download, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
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
} from "@/lib/dome-puertos-data"
import Image from "next/image"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

let notyf: Notyf | null = null

type DomeFloorPlanProps = {
  floorNumber?: number | null
  onReturnToProjectModal: () => void
}

const floors = [0, 1, 2, 3, 4, 5]

export default function DomeFloorPlan({ floorNumber, onReturnToProjectModal }: DomeFloorPlanProps) {
  const [currentFloor, setCurrentFloor] = useState(floorNumber || 1)
  const [selectedApartment, setSelectedApartment] = useState<DomeApartment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
  const [confirmReservation, setConfirmReservation] = useState(false)
  const [confirmCancelReservation, setConfirmCancelReservation] = useState(false)
  const [confirmRelease, setConfirmRelease] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleActionClick = (
    actionType: "block" | "reserve" | "sell" | "unblock" | "directReserve" | "cancelReservation" | "release",
  ) => {
    setAction(actionType)
    setConfirmReservation(
      actionType === "reserve" && selectedApartment !== null && selectedApartment.status === "bloqueado",
    )
    setConfirmCancelReservation(actionType === "cancelReservation")
    setConfirmRelease(actionType === "release")
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedApartment) return

    try {
      let newStatus: DomeApartment["status"] = selectedApartment.status

      switch (action) {
        case "block":
          newStatus = "bloqueado"
          break
        case "reserve":
        case "directReserve":
          newStatus = "reservado"
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

      const success = updateDomeApartmentStatus(selectedApartment.id, newStatus)

      if (success) {
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
    if (notyf) notyf.success("Descargando plano...")
  }

  const refreshData = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
    if (notyf) notyf.success("Datos actualizados")
  }

  // Obtener la imagen del plano para el piso actual
  const getFloorPlanImage = () => {
    const floorPlan = domeFloorPlans[currentFloor as keyof typeof domeFloorPlans]
    return floorPlan?.complete || "/images/lagos/lagospb.jpg"
  }

  if (!currentFloorData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-zinc-900 text-white">
          <CardContent className="p-6 text-center">
            <p className="text-zinc-300 mb-4">Piso no encontrado</p>
            <Button onClick={onReturnToProjectModal} className="bg-zinc-800 hover:bg-zinc-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al proyecto
            </Button>
          </CardContent>
        </Card>
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
          </div>
        </div>

        {/* Floor Selection */}
        <div className="max-w-4xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Selecciona un piso</h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
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
              useMap="#floor-map"
            />

            {/* SVG overlay for clickable areas */}
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
                      fill={getStatusColor(apartment.status)}
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
        </div>

        {/* Legend */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-zinc-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-4">Leyenda</h4>
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

        {/* Apartment Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Detalles del departamento {selectedApartment?.unitNumber}</DialogTitle>
            </DialogHeader>
            {selectedApartment && (
              <div className="space-y-4">
                <div className="text-zinc-300 space-y-2">
                  <p>
                    <strong>Estado:</strong> {getStatusLabel(selectedApartment.status)}
                  </p>
                  <p>
                    <strong>Precio:</strong> {formatPrice(selectedApartment.saleValue)}
                  </p>
                  <p>
                    <strong>Superficie:</strong> {formatArea(selectedApartment.totalArea)}
                  </p>
                  <p>
                    <strong>Descripción:</strong> {selectedApartment.description}
                  </p>
                  <p>
                    <strong>Orientación:</strong> {selectedApartment.orientation}
                  </p>
                  <p>
                    <strong>Cocheras:</strong> {selectedApartment.parkingSpots}
                  </p>
                </div>

                {!action && (
                  <div className="space-y-2">
                    {selectedApartment.status === "DISPONIBLE" && (
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
                    {selectedApartment.status === "bloqueado" && (
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
                    {selectedApartment.status === "reservado" && (
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
                    {selectedApartment.status === "VENDIDO" && (
                      <>
                        <Button onClick={handleDownloadFloorPlan} className="bg-blue-600 hover:bg-blue-700 w-full">
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
                          ? "Confir mar Reserva"
                          : "Confirmar Venta"}
                    </Button>
                  </form>
                )}

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
      </div>
    </div>
  )
}
