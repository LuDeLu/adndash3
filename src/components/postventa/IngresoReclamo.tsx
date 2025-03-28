"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Phone, Building, Hash, FileText, UserCheck, Plus, Trash2, Save, X } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState("cliente")

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
    setActiveTab("cliente")
  }

  const isFormValid = () => {
    return (
      nuevoReclamo.cliente.trim() !== "" &&
      nuevoReclamo.telefono.trim() !== "" &&
      nuevoReclamo.edificio.trim() !== "" &&
      nuevoReclamo.unidadFuncional.trim() !== "" &&
      (nuevoReclamo.detalle.trim() !== "" || (nuevoReclamo.detalles && nuevoReclamo.detalles.length > 0))
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cliente" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Datos del Cliente
          </TabsTrigger>
          <TabsTrigger value="detalles" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Detalles del Reclamo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Nombre del Cliente
              </Label>
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
              <Label htmlFor="telefono" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Teléfono de Contacto
              </Label>
              <Input
                id="telefono"
                name="telefono"
                placeholder="Teléfono de Contacto"
                value={nuevoReclamo.telefono}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edificio" className="flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Edificio
              </Label>
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
              <Label htmlFor="unidadFuncional" className="flex items-center">
                <Hash className="h-4 w-4 mr-2" />
                Nº de UF
              </Label>
              <Input
                id="unidadFuncional"
                name="unidadFuncional"
                placeholder="Nº de UF"
                value={nuevoReclamo.unidadFuncional}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoOcupante" className="flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              Tipo de Ocupante
            </Label>
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

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => setActiveTab("detalles")}
              disabled={
                !nuevoReclamo.cliente ||
                !nuevoReclamo.telefono ||
                !nuevoReclamo.edificio ||
                !nuevoReclamo.unidadFuncional
              }
            >
              Continuar
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="detalles" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nuevoDetalle" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Detalles del reclamo
            </Label>
            <div className="flex space-x-2">
              <Textarea
                id="nuevoDetalle"
                value={nuevoDetalle}
                onChange={(e) => setNuevoDetalle(e.target.value)}
                placeholder="Añadir detalle adicional"
                className="flex-1"
              />
              <Button type="button" onClick={agregarDetalle} className="self-end">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {nuevoReclamo.detalles && nuevoReclamo.detalles.length > 0 ? (
              <div className="mt-4 space-y-2">
                <Label>Detalles añadidos:</Label>
                <ul className="space-y-2">
                  {nuevoReclamo.detalles.map((detalle, index) => (
                    <li key={index} className="flex justify-between items-center p-3 bg-muted rounded-md">
                      <span className="text-sm">{detalle}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarDetalle(index)}
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground">
                No hay detalles añadidos. Agregue al menos un detalle para el reclamo.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentario" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Comentario Adicional (opcional)
            </Label>
            <Textarea
              id="comentario"
              name="comentario"
              placeholder="Comentario adicional"
              value={nuevoReclamo.comentario}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={() => setActiveTab("cliente")}>
              <X className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button type="submit" disabled={!isFormValid()}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Reclamo
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}

