"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, List, BarChart3 } from "lucide-react"
import type { Reclamo, EstadoReclamo, EstadisticasPostVenta } from "../../types/postVenta"
import CrearTicket from "./CrearTicket"
import MisTickets from "./MisTickets"
import Estadisticas from "./Estadisticas"
import DetalleTicket from "./DetalleTicket"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

let notyf: Notyf

if (typeof window !== "undefined") {
  notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
  })
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

export default function PostVentaGestion() {
  const [vistaActual, setVistaActual] = useState<"menu" | "crear" | "tickets" | "estadisticas">("menu")
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo | null>(null)
  const [estadisticas, setEstadisticas] = useState<EstadisticasPostVenta | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (vistaActual === "tickets") {
      fetchReclamos()
    }
    if (vistaActual === "estadisticas") {
      fetchEstadisticas()
    }
  }, [vistaActual])

  const fetchReclamos = async () => {
    setIsLoading(true)
    try {
      console.log("[v0] Fetching reclamos from API...")
      const response = await axios.get<Reclamo[]>(`${API_BASE_URL}/postventa`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      console.log("[v0] Reclamos fetched:", response.data.length, "tickets")
      console.log(
        "[v0] Estados:",
        response.data.map((r) => ({ ticket: r.ticket, estado: r.estado })),
      )
      setReclamos(response.data)
    } catch (error) {
      console.error("[v0] Error fetching reclamos:", error)
      notyf.error("Error al cargar los tickets")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEstadisticas = async () => {
    try {
      const response = await axios.get<EstadisticasPostVenta>(`${API_BASE_URL}/postventa/stats/overview`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setEstadisticas(response.data)
    } catch (error) {
      console.error("Error fetching estadísticas:", error)
      notyf.error("Error al cargar las estadísticas")
    }
  }

  const crearTicket = async (nuevoTicket: Omit<Reclamo, "id" | "ticket" | "fechaCreacion">) => {
    try {
      const response = await axios.post<Reclamo>(`${API_BASE_URL}/postventa`, nuevoTicket, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      notyf.success("Ticket creado con éxito. Se enviará notificación al equipo de Posventa.")
      setVistaActual("tickets")
      fetchReclamos()
    } catch (error) {
      console.error("Error creating ticket:", error)
      notyf.error("Error al crear el ticket")
    }
  }

  const actualizarEstado = async (id: string | number, nuevoEstado: EstadoReclamo, datosAdicionales?: any) => {
    try {
      console.log("[v0] Actualizando estado del ticket:", id, "a", nuevoEstado)
      console.log("[v0] Datos adicionales:", datosAdicionales)

      const reclamoActual = reclamos.find((r) => r.id === id)
      if (!reclamoActual) {
        console.error("[v0] Reclamo no encontrado en el estado local")
        return
      }

      const reclamoActualizado = {
        ...reclamoActual,
        estado: nuevoEstado,
        ...datosAdicionales,
      }

      console.log("[v0] Actualizando estado local optimísticamente")
      setReclamos((prevReclamos) => prevReclamos.map((r) => (r.id === id ? reclamoActualizado : r)))

      // Si se está cerrando el ticket, usar el endpoint específico
      if (nuevoEstado === "Solucionado" && datosAdicionales?.proveedorResolvio) {
        console.log("[v0] Cerrando ticket con endpoint específico")
        await axios.post(
          `${API_BASE_URL}/postventa/${id}/cerrar`,
          {
            proveedorResolvio: datosAdicionales.proveedorResolvio,
            costo: datosAdicionales.costo,
            fechaCierre: datosAdicionales.fechaCierre,
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          },
        )
        notyf.success("Ticket cerrado con éxito. Se enviará email al cliente.")
      } else {
        console.log("[v0] Actualizando ticket con PUT")
        const response = await axios.put(`${API_BASE_URL}/postventa/${id}`, reclamoActualizado, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        console.log("[v0] Respuesta del servidor:", response.data)

        if (nuevoEstado === "En Proceso" && datosAdicionales?.fechaVisita) {
          notyf.success("Visita programada. Se enviará recordatorio 48hs antes al cliente.")
        } else {
          notyf.success("Estado actualizado con éxito")
        }
      }

      console.log("[v0] Refrescando datos desde el servidor")
      await fetchReclamos()
    } catch (error) {
      console.error("[v0] Error updating estado:", error)
      notyf.error("Error al actualizar el estado")
      await fetchReclamos()
    }
  }

  const actualizarNotas = async (id: string | number, notas: string) => {
    try {
      const reclamoActual = reclamos.find((r) => r.id === id)
      if (!reclamoActual) return

      await axios.put(
        `${API_BASE_URL}/postventa/${id}`,
        { ...reclamoActual, notas },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )

      notyf.success("Notas actualizadas con éxito")
      fetchReclamos()

      // Actualizar el reclamo seleccionado si es el mismo
      if (reclamoSeleccionado?.id === id) {
        setReclamoSeleccionado({ ...reclamoActual, notas })
      }
    } catch (error) {
      console.error("Error updating notas:", error)
      notyf.error("Error al actualizar las notas")
    }
  }

  const handleEnviarCorreo = async (
    reclamo: Reclamo,
    tipo: "nuevo_reclamo" | "actualizacion_estado" | "cierre_ticket",
  ) => {
    try {
      await axios.post(
        `${API_BASE_URL}/postventa/enviar-correo`,
        { reclamo, tipo },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      notyf.success("Correo enviado con éxito")
    } catch (error) {
      console.error("Error sending email:", error)
      notyf.error("Error al enviar el correo")
    }
  }

  const actualizarReclamo = async (reclamoActualizado: Reclamo) => {
    try {
      const response = await axios.put<Reclamo>(
        `${API_BASE_URL}/postventa/${reclamoActualizado.id}`,
        reclamoActualizado,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      )
      setReclamos((prevReclamos) => prevReclamos.map((r) => (r.id === response.data.id ? response.data : r)))
      setReclamoSeleccionado(response.data)
      notyf.success("Ticket actualizado con éxito")
    } catch (error) {
      console.error("Error updating ticket:", error)
      notyf.error("Error al actualizar el ticket")
    }
  }

  // Vista de menú inicial
  if (vistaActual === "menu") {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestión de Posventa</h1>
          <p className="text-muted-foreground">Sistema integral de gestión de tickets y reclamos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => setVistaActual("crear")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-6 w-6" />
                Crear Ticket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Registra un nuevo reclamo o solicitud de posventa</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => setVistaActual("tickets")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-6 w-6" />
                Mis Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Visualiza y gestiona todos los tickets por estado</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
            onClick={() => setVistaActual("estadisticas")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Estadísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Reportes y gráficos de tickets y costos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Vista de crear ticket
  if (vistaActual === "crear") {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setVistaActual("menu")}>
            ← Volver al Menú
          </Button>
        </div>
        <CrearTicket onCrearTicket={crearTicket} onCancelar={() => setVistaActual("menu")} />
      </div>
    )
  }

  // Vista de mis tickets
  if (vistaActual === "tickets") {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => setVistaActual("menu")}>
            ← Volver al Menú
          </Button>
          <h1 className="text-2xl font-bold">Mis Tickets</h1>
          <div className="w-24" /> {/* Spacer para centrar el título */}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Cargando tickets...</p>
          </div>
        ) : (
          <MisTickets
            reclamos={reclamos}
            onActualizarEstado={actualizarEstado}
            onVerDetalle={(reclamo) => setReclamoSeleccionado(reclamo)}
          />
        )}

        {reclamoSeleccionado && (
          <DetalleTicket
            reclamo={reclamoSeleccionado}
            onCerrar={() => setReclamoSeleccionado(null)}
            onActualizar={actualizarNotas}
          />
        )}
      </div>
    )
  }

  // Vista de estadísticas
  if (vistaActual === "estadisticas") {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => setVistaActual("menu")}>
            ← Volver al Menú
          </Button>
          <h1 className="text-2xl font-bold">Reportes y Estadísticas</h1>
          <div className="w-24" />
        </div>

        <Estadisticas estadisticas={estadisticas} />
      </div>
    )
  }

  return null
}
