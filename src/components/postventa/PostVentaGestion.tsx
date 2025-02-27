"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Reclamo } from "../../types/postVenta"
import IngresoReclamo from "./IngresoReclamo"
import ListaReclamos from "./ListaReclamos"
import DetalleReclamo from "./DetalleReclamo"
import CalendarioReclamos from "./CalendarioReclamos"
import ComunicacionCliente from "./ComunicacionCliente"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Calendar, List, Search, RefreshCw, AlertCircle } from "lucide-react"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

let notyf: Notyf

if (typeof window !== "undefined") {
  notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    types: [
      {
        type: "success",
        background: "#10b981",
        icon: false,
      },
      {
        type: "error",
        background: "#ef4444",
        icon: false,
      },
    ],
  })
}

const API_BASE_URL = "https://adndashbackend.onrender.com/api"

export default function PostVentaGestion() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [reclamosFiltrados, setReclamosFiltrados] = useState<Reclamo[]>([])
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [vistaActiva, setVistaActiva] = useState("lista")
  const [busqueda, setBusqueda] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    fetchReclamos()
  }, [])

  useEffect(() => {
    if (busqueda.trim() === "") {
      setReclamosFiltrados(reclamos)
    } else {
      const termino = busqueda.toLowerCase()
      const filtrados = reclamos.filter(
        (reclamo) =>
          reclamo.cliente.toLowerCase().includes(termino) ||
          reclamo.ticket.toLowerCase().includes(termino) ||
          reclamo.edificio.toLowerCase().includes(termino) ||
          reclamo.unidadFuncional.toLowerCase().includes(termino) ||
          reclamo.estado.toLowerCase().includes(termino),
      )
      setReclamosFiltrados(filtrados)
    }
  }, [busqueda, reclamos])

  const fetchReclamos = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      const response = await axios.get<Reclamo[]>(`${API_BASE_URL}/postventa`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setReclamos(response.data)
      setReclamosFiltrados(response.data)
    } catch (error) {
      console.error("Error fetching reclamos:", error)
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          notyf.error("No tienes permiso para acceder a esta información")
        } else {
          notyf.error(`Error al cargar los reclamos: ${error.response.data.message || "Error desconocido"}`)
        }
      } else {
        notyf.error("Error al cargar los reclamos")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const refreshReclamos = async () => {
    setIsRefreshing(true)
    try {
      await fetchReclamos()
      notyf.success("Datos actualizados correctamente")
    } catch (error) {
      console.error("Error refreshing reclamos:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const agregarReclamo = async (nuevoReclamo: Omit<Reclamo, "id">) => {
    try {
      const response = await fetch(`${API_BASE_URL}/postventa`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoReclamo),
      })
      if (!response.ok) throw new Error("Error al crear el reclamo")
      const data = await response.json()
      setReclamos((prevReclamos) => [...prevReclamos, data])
      setReclamosFiltrados((prevReclamos) => [...prevReclamos, data])
      notyf.success("Reclamo creado con éxito")
    } catch (error) {
      console.error("Error creating reclamo:", error)
      notyf.error("Error al crear el reclamo")
    }
  }

  const actualizarReclamo = async (reclamoActualizado: Reclamo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/postventa/${reclamoActualizado.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reclamoActualizado),
      })
      if (!response.ok) throw new Error("Error al actualizar el reclamo")
      const data = await response.json()
      setReclamos((prevReclamos) => prevReclamos.map((r) => (r.id === data.id ? data : r)))
      setReclamosFiltrados((prevReclamos) => prevReclamos.map((r) => (r.id === data.id ? data : r)))
      setReclamoSeleccionado(data)
      notyf.success("Reclamo actualizado con éxito")
    } catch (error) {
      console.error("Error updating reclamo:", error)
      notyf.error("Error al actualizar el reclamo")
    }
  }

  const handleEnviarCorreo = async (reclamo: Reclamo, tipo: "nuevo_reclamo" | "actualizacion_estado") => {
    try {
      const response = await fetch(`${API_BASE_URL}/postventa/enviar-correo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reclamo, tipo }),
      })
      if (!response.ok) throw new Error("Error al enviar el correo")
      notyf.success("Correo enviado con éxito")
    } catch (error) {
      console.error("Error sending email:", error)
      notyf.error("Error al enviar el correo")
    }
  }

  return (
    <div className="container mx-auto p-4 text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestión de Post Venta</h1>
          <p className="text-muted-foreground mt-1">ADN Developers</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar reclamos..."
              className="pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={refreshReclamos} disabled={isRefreshing}>
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lista" className="w-full" onValueChange={setVistaActiva}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Vista Lista
          </TabsTrigger>
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Vista Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lista">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <IngresoReclamo onNuevoReclamo={agregarReclamo} />
            <ListaReclamos
              reclamos={reclamosFiltrados}
              onSeleccionarReclamo={setReclamoSeleccionado}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="calendario">
          <CalendarioReclamos reclamos={reclamosFiltrados} onEventClick={setReclamoSeleccionado} />
        </TabsContent>
      </Tabs>

      {reclamoSeleccionado ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <DetalleReclamo
              reclamo={reclamoSeleccionado}
              onActualizarReclamo={actualizarReclamo}
              onEnviarCorreo={handleEnviarCorreo}
            />
          </div>
          <div>
            <ComunicacionCliente reclamo={reclamoSeleccionado} onEnviarCorreo={handleEnviarCorreo} />
          </div>
        </div>
      ) : (
        <Card className="mt-8 bg-muted/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Ningún reclamo seleccionado</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Seleccione un reclamo de la lista o del calendario para ver sus detalles y gestionarlo
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

