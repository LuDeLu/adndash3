import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reclamo } from "../../types/postVenta"

type IngresoReclamoProps = {
  onNuevoReclamo: (reclamo: Reclamo) => void
}

export default function IngresoReclamo({ onNuevoReclamo }: IngresoReclamoProps) {
  const [nuevoReclamo, setNuevoReclamo] = useState<Omit<Reclamo, "ticket" | "fechaIngreso" | "estado">>({
    cliente: "",
    telefono: "",
    edificio: "",
    unidadFuncional: "",
    detalle: "",
    comentario: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoReclamo({
      ...nuevoReclamo,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ticket = `T${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`
    const fechaIngreso = new Date().toISOString().split("T")[0]
    onNuevoReclamo({ ...nuevoReclamo, ticket, fechaIngreso, estado: "Ingresado" } as Reclamo)
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
            className="bg-input text-foreground"
          />
          <Input
            name="telefono"
            placeholder="Teléfono de Contacto"
            value={nuevoReclamo.telefono}
            onChange={handleInputChange}
            required
            className="bg-input text-foreground"
          />
          <Input
            name="edificio"
            placeholder="Edificio"
            value={nuevoReclamo.edificio}
            onChange={handleInputChange}
            required
            className="bg-input text-foreground"
          />
          <Input
            name="unidadFuncional"
            placeholder="Nº de UF"
            value={nuevoReclamo.unidadFuncional}
            onChange={handleInputChange}
            required
            className="bg-input text-foreground"
          />
          <Textarea
            name="detalle"
            placeholder="Detalle del Reclamo"
            value={nuevoReclamo.detalle}
            onChange={handleInputChange}
            required
            className="bg-input text-foreground"
          />
          <Textarea
            name="comentario"
            placeholder="Comentario"
            value={nuevoReclamo.comentario}
            onChange={handleInputChange}
            className="bg-input text-foreground"
          />
          <Button type="submit" className="w-full">
            Ingresar Reclamo
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

