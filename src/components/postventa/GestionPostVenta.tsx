"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import type { Reclamo } from "../../types/postVenta"
import IngresoReclamo from "./IngresoReclamo"
import ListaReclamos from "./ListaReclamos"
import DetalleReclamo from "./DetalleReclamo"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

let notyf: Notyf

if (typeof window !== "undefined") {
  notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
  })
}

const API_BASE_URL = "https://adndash.squareweb.app/api"

export default function GestionPostVenta() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reclamosSeleccionados, setReclamosSeleccionados] = useState<(string | number)[]>([])

  useEffect(() => {
    fetchReclamos()
  }, [])

  const fetchReclamos = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get<Reclamo[]>(`${API_BASE_URL}/postventa`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setReclamos(response.data)
    } catch (error) {
      console.error("Error fetching reclamos:", error)
      notyf.error("Error al cargar los reclamos")
    } finally {
      setIsLoading(false)
    }
  }

  const agregarReclamo = async (nuevoReclamo: Omit<Reclamo, "id">) => {
    try {
      const response = await axios.post<Reclamo>(`${API_BASE_URL}/postventa`, nuevoReclamo, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setReclamos((prevReclamos) => [...prevReclamos, response.data])
      notyf.success("Reclamo creado con éxito")
    } catch (error) {
      console.error("Error creating reclamo:", error)
      notyf.error("Error al crear el reclamo")
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
      notyf.success("Reclamo actualizado con éxito")
    } catch (error) {
      console.error("Error updating reclamo:", error)
      notyf.error("Error al actualizar el reclamo")
    }
  }

  const handleEnviarCorreo = async (reclamo: Reclamo, tipo: "nuevo_reclamo" | "actualizacion_estado") => {
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

  const handleEliminarReclamo = async (id: string | number) => {
    try {
      await axios.delete(`${API_BASE_URL}/postventa/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setReclamos((prevReclamos) => prevReclamos.filter((r) => r.id !== id))
      if (reclamoSeleccionado && reclamoSeleccionado.id === id) {
        setReclamoSeleccionado(null)
      }
      notyf.success("Reclamo eliminado con éxito")
    } catch (error) {
      console.error("Error deleting reclamo:", error)
      notyf.error("Error al eliminar el reclamo")
    }
  }

  const handleEditarReclamo = (reclamo: Reclamo) => {
    setReclamoSeleccionado(reclamo)
  }

  const toggleSeleccionReclamo = (id: string | number) => {
    setReclamosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((reclamoId) => reclamoId !== id) : [...prev, id],
    )
  }

  return (
    <div className="container mx-auto p-4 text-foreground">
      <h1 className="text-3xl font-bold mb-8 text-primary">Gestión de Post Venta ADN Developers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <IngresoReclamo onNuevoReclamo={agregarReclamo} />
        <ListaReclamos
          reclamos={reclamos}
          onSeleccionarReclamo={setReclamoSeleccionado}
          isLoading={isLoading}
          onEliminarReclamo={handleEliminarReclamo}
          onEditarReclamo={handleEditarReclamo}
          reclamosSeleccionados={reclamosSeleccionados}
          toggleSeleccionReclamo={toggleSeleccionReclamo}
        />
      </div>

      {reclamoSeleccionado && (
        <DetalleReclamo
          reclamo={reclamoSeleccionado}
          onActualizarReclamo={actualizarReclamo}
          onEnviarCorreo={handleEnviarCorreo}
        />
      )}
    </div>
  )
}

