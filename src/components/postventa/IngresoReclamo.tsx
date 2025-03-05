"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Reclamo, TipoOcupante } from "../../types/postVenta"

type IngresoReclamoProps = {
  onNuevoReclamo: (reclamo: Omit<Reclamo, "id">) => void
}

export default function IngresoReclamo({ onNuevoReclamo }: IngresoReclamoProps) {
  const [nuevoReclamo, setNuevoReclamo] = useState<Omit<Reclamo, "id">>({
    cliente: "",
    telefono: "",
    edificio: "",
    unidadFuncional: "",
    detalle: "",
    detalles: [], // Nuevo campo para múltiples detalles
    comentario: "",
    tipoOcupante: "Inquilino",
    ticket: "",
    fechaIngreso: "",
    estado: "Ingresado",
  })

  const [nuevoDetalle, setNuevoDetalle] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNuevoReclamo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: TipoOcupante) => {
    setNuevoReclamo((prev) => ({ ...prev, tipoOcupante: value }))
  }

  const agregarDetalle = () => {
    if (nuevoDetalle.trim() === "") return
    setNuevoReclamo((prev) => ({
      ...prev,
      detalles: [...(prev.detalles || []), nuevoDetalle],
    }))
    setNuevoDetalle("")
  }

  const eliminarDetalle = (index: number) => {
    setNuevoReclamo((prev) => ({
      ...prev,
      detalles: (prev.detalles || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Si no hay detalle general pero hay detalles adicionales, usar el primer detalle como detalle general
    let detalleGeneral = nuevoReclamo.detalle
    if (!detalleGeneral.trim() && nuevoReclamo.detalles && nuevoReclamo.detalles.length > 0) {
      detalleGeneral = nuevoReclamo.detalles[0]
    }

    const reclamoCompleto: Omit<Reclamo, "id"> = {
      ...nuevoReclamo,
      detalle: detalleGeneral,
      fechaIngreso: new Date().toISOString().split("T")[0],
      ticket: `T${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
      detalles: nuevoReclamo.detalles || [], // Asegurarse de que detalles sea un array
    }
    onNuevoReclamo(reclamoCompleto)
    setNuevoReclamo({
      cliente: "",
      telefono: "",
      edificio: "",
      unidadFuncional: "",
      detalle: "",
      detalles: [],
      comentario: "",
      tipoOcupante: "Inquilino",
      ticket: "",
      fechaIngreso: "",
      estado: "Ingresado",
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
          <div className="space-y-2">
            <Label htmlFor="cliente">Nombre del Cliente</Label>
            <Input
              id="cliente"
              name="cliente"
              placeholder="Nombre del Cliente"
              value={nuevoReclamo.cliente}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono de Contacto</Label>
            <Input
              id="telefono"
              name="telefono"
              placeholder="Teléfono de Contacto"
              value={nuevoReclamo.telefono}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edificio">Edificio</Label>
            <Input
              id="edificio"
              name="edificio"
              placeholder="Edificio"
              value={nuevoReclamo.edificio}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidadFuncional">Nº de UF</Label>
            <Input
              id="unidadFuncional"
              name="unidadFuncional"
              placeholder="Nº de UF"
              value={nuevoReclamo.unidadFuncional}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoOcupante">Tipo de Ocupante</Label>
            <Select onValueChange={handleSelectChange} defaultValue={nuevoReclamo.tipoOcupante}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione el tipo de ocupante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inquilino">Inquilino</SelectItem>
                <SelectItem value="Propietario">Propietario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nuevoDetalle">Detalles del reclamo</Label>
            <div className="flex space-x-2">
              <Textarea
                id="nuevoDetalle"
                value={nuevoDetalle}
                onChange={(e) => setNuevoDetalle(e.target.value)}
                placeholder="Añadir detalle adicional"
                className="flex-1"
              />
              <Button type="button" onClick={agregarDetalle} className="self-end">
                Añadir
              </Button>
            </div>

            {nuevoReclamo.detalles && nuevoReclamo.detalles.length > 0 && (
              <div className="mt-2 space-y-2">
                <Label>Detalles añadidos:</Label>
                <ul className="space-y-2">
                  {nuevoReclamo.detalles.map((detalle, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <span className="text-sm">{detalle}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarDetalle(index)}
                        className="h-6 w-6 p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario">Comentario</Label>
            <Textarea
              id="comentario"
              name="comentario"
              placeholder="Comentario"
              value={nuevoReclamo.comentario}
              onChange={handleInputChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Ingresar Reclamo
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

