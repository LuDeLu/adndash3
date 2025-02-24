"use client"

import { useState, useEffect } from "react"
import type { Reclamo } from "../../types/postVenta"
import IngresoReclamo from "./IngresoReclamo"
import ListaReclamos from "./ListaReclamos"
import DetalleReclamo from "./DetalleReclamo"
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'

let notyf: Notyf

if (typeof window !== 'undefined') {
  notyf = new Notyf({
    duration: 3000,
    position: { x: 'right', y: 'top' },
  })
}

const API_BASE_URL = 'https://adndashbackend.onrender.com/api';

export default function PostVentaGestion() {
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReclamos()
  }, [])

  const fetchReclamos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/postventa`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al cargar los reclamos');
      const data = await response.json();
      setReclamos(data)
    } catch (error) {
      console.error("Error fetching reclamos:", error)
      notyf.error("Error al cargar los reclamos")
    } finally {
      setIsLoading(false)
    }
  }

  const agregarReclamo = async (nuevoReclamo: Omit<Reclamo, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/postventa`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoReclamo)
      });
      if (!response.ok) throw new Error('Error al crear el reclamo');
      const data = await response.json();
      setReclamos(prevReclamos => [...prevReclamos, data])
      notyf.success("Reclamo creado con éxito")
    } catch (error) {
      console.error("Error creating reclamo:", error)
      notyf.error("Error al crear el reclamo")
    }
  }

  const actualizarReclamo = async (reclamoActualizado: Reclamo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/postventa/${reclamoActualizado.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reclamoActualizado)
      });
      if (!response.ok) throw new Error('Error al actualizar el reclamo');
      const data = await response.json();
      setReclamos(prevReclamos => prevReclamos.map(r => r.id === data.id ? data : r))
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
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reclamo, tipo })
      });
      if (!response.ok) throw new Error('Error al enviar el correo');
      notyf.success("Correo enviado con éxito")
    } catch (error) {
      console.error("Error sending email:", error)
      notyf.error("Error al enviar el correo")
    }
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