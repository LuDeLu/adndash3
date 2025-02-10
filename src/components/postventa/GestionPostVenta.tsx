"use client"

import { useState, useEffect } from "react"
import type { Reclamo } from "../../types/postVenta"
import IngresoReclamo from "./IngresoReclamo"
import ListaReclamos from "./ListaReclamos"
import DetalleReclamo from "./DetalleReclamo"

export default function GestionPostVenta() {
  const [currentDate, setCurrentDate] = useState<string>("")

  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toISOString().split("T")[0])
  }, [])

  console.log(`GestionPostVenta: Versión actualizada - ${currentDate}`)

  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState<Reclamo | null>(null)

  const agregarReclamo = (nuevoReclamo: Reclamo) => {
    setReclamos([...reclamos, nuevoReclamo])
  }

  const actualizarReclamo = (reclamoActualizado: Reclamo) => {
    setReclamos(reclamos.map((r) => (r.ticket === reclamoActualizado.ticket ? reclamoActualizado : r)))
    setReclamoSeleccionado(reclamoActualizado)
  }

  const handleEnviarCorreo = (reclamo: Reclamo, tipo: "nuevo_reclamo" | "actualizacion_estado") => {
    let asunto = ""
    let mensaje = ""

    if (tipo === "nuevo_reclamo") {
      asunto = `Nuevo reclamo registrado - Ticket ${reclamo.ticket}`
      mensaje = `Estimado/a ${reclamo.cliente},\n\nSe ha registrado un nuevo reclamo con el número de ticket ${reclamo.ticket}. Nos pondremos en contacto con usted pronto para programar una inspección.\n\nGracias por su paciencia.`
    } else if (tipo === "actualizacion_estado") {
      asunto = `Actualización de estado - Ticket ${reclamo.ticket}`
      mensaje = `Estimado/a ${reclamo.cliente},\n\nSu reclamo con número de ticket ${reclamo.ticket} ha sido actualizado al estado: ${reclamo.estado}.\n\nSi tiene alguna pregunta, no dude en contactarnos.`
    }

    const mailtoLink = `mailto:${reclamo.cliente}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(mensaje)}`
    window.open(mailtoLink, "_blank")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Gestión de Post Venta ADN Developers</h1>
      <p className="mb-4">Fecha actual: {currentDate}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <IngresoReclamo onNuevoReclamo={agregarReclamo} />
        <ListaReclamos reclamos={reclamos} onSeleccionarReclamo={setReclamoSeleccionado} />
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

