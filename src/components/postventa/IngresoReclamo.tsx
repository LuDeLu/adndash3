import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reclamo } from "../../types/postVenta"

type IngresoReclamoProps = {
  onNuevoReclamo: (reclamo: Omit<Reclamo, "id">) => void
}

export default function IngresoReclamo({ onNuevoReclamo }: IngresoReclamoProps) {
  const [nuevoReclamo, setNuevoReclamo] = useState<Omit<Reclamo, "id" | "ticket" | "fechaIngreso" | "estado">>({
    cliente: "",
    telefono: "",
    edificio: "",
    unidadFuncional: "",
    detalle: "",
    comentario: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNuevoReclamo(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const reclamoCompleto: Omit<Reclamo, "id"> = {
      ...nuevoReclamo,
      estado: "Ingresado",
      fechaIngreso: new Date().toISOString().split('T')[0],
      ticket: `T${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
    }
    onNuevoReclamo(reclamoCompleto)
    setNuevoReclamo({
      cliente: "",
      telefono: "",
      edificio: "",
      unidadFuncional: "",
      detalle: "",
      comentario: "",
    })
  }

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Ingreso de Reclamo</CardTitle>
        <CardDescription>Complete el formulario para ingresar un nuevo reclamo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="cliente"
            placeholder="Nombre del Cliente"
            value={nuevoReclamo.cliente}
            onChange={handleInputChange}
            required
          />
          <Input
            name="telefono"
            placeholder="Teléfono de Contacto"
            value={nuevoReclamo.telefono}
            onChange={handleInputChange}
            required
          />
          <Input
            name="edificio"
            placeholder="Edificio"
            value={nuevoReclamo.edificio}
            onChange={handleInputChange}
            required
          />
          <Input
            name="unidadFuncional"
            placeholder="Nº de UF"
            value={nuevoReclamo.unidadFuncional}
            onChange={handleInputChange}
            required
          />
          <Textarea
            name="detalle"
            placeholder="Detalle del Reclamo"
            value={nuevoReclamo.detalle}
            onChange={handleInputChange}
            required
          />
          <Textarea
            name="comentario"
            placeholder="Comentario"
            value={nuevoReclamo.comentario}
            onChange={handleInputChange}
          />
          <Button type="submit" className="w-full">
            Ingresar Reclamo
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}