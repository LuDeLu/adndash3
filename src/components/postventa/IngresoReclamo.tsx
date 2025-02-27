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
    comentario: "",
    tipoOcupante: "Inquilino",
    ticket: "",
    fechaIngreso: "",
    estado: "Ingresado",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNuevoReclamo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: TipoOcupante) => {
    setNuevoReclamo((prev) => ({ ...prev, tipoOcupante: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const reclamoCompleto: Omit<Reclamo, "id"> = {
      ...nuevoReclamo,
      fechaIngreso: new Date().toISOString().split("T")[0],
      ticket: `T${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
    }
    onNuevoReclamo(reclamoCompleto)
    setNuevoReclamo({
      cliente: "",
      telefono: "",
      edificio: "",
      unidadFuncional: "",
      detalle: "",
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
            <Label htmlFor="detalle">Detalle del Reclamo</Label>
            <Textarea
              id="detalle"
              name="detalle"
              placeholder="Detalle del Reclamo"
              value={nuevoReclamo.detalle}
              onChange={handleInputChange}
              required
            />
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

