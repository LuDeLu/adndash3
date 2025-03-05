"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface InspeccionReclamoProps {
  initialInspeccion: Inspeccion
  onInspeccionChange: (inspeccion: Inspeccion) => void
}

type ResultadoInspeccion = "Corresponde" | "No Corresponde" | "Re Inspección" | "Solucionado en Visita"

interface Inspeccion {
  resultado: ResultadoInspeccion | ""
  observaciones?: string
}

const InspeccionReclamo: React.FC<InspeccionReclamoProps> = ({ initialInspeccion, onInspeccionChange }) => {
  const [inspeccion, setInspeccion] = useState<Inspeccion>(initialInspeccion)

  useEffect(() => {
    setInspeccion(initialInspeccion)
  }, [initialInspeccion])

  const handleInspeccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInspeccion((prevInspeccion) => {
      const updatedInspeccion = { ...prevInspeccion, [name]: value }
      onInspeccionChange(updatedInspeccion)
      return updatedInspeccion
    })
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="resultado" className="block text-sm font-medium text-gray-700">
          Resultado Inspección
        </label>
        <select
          name="resultado"
          value={inspeccion.resultado}
          onChange={handleInspeccionChange}
          className="w-full p-2 border rounded bg-input text-foreground"
        >
          <option value="Corresponde">Corresponde</option>
          <option value="No Corresponde">No Corresponde</option>
          <option value="Re Inspección">Re Inspección</option>
          <option value="Solucionado en Visita">Solucionado en Visita</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700">
          Observaciones
        </label>
        <textarea
          id="observaciones"
          name="observaciones"
          value={inspeccion.observaciones || ""}
          onChange={handleInspeccionChange}
          rows={3}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md bg-input text-foreground"
          placeholder="Ingrese observaciones aquí"
        />
      </div>
    </div>
  )
}

export default InspeccionReclamo

