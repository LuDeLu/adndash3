"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Trash2, Save, Upload, X } from "lucide-react"
import type { Reclamo, TipoOcupante, Urgencia } from "../../types/postVenta"

type CrearTicketProps = {
  onCrearTicket: (ticket: Omit<Reclamo, "id" | "ticket" | "fechaCreacion">) => void
  onCancelar: () => void
}

const EDIFICIOS = [
  "DOME Palermo Residence",
  "DOME Suites & Residence",
  "DOME Palermo Boulevard",
  "DOME Palermo Apartments",
  "DOME Beruti",
]
const UBICACIONES = [
  "Cocina",
  "Baño Principal",
  "Baño Secundario",
  "Dormitorio Principal",
  "Dormitorio Secundario",
  "Living",
  "Comedor",
  "Balcón",
  "Terraza",
  "Lavadero",
  "Pasillo",
  "Entrada",
  "Cochera",
  "Baulera",
  "Áreas Comunes",
]
const RUBROS = [
  "Plomería",
  "Electricidad",
  "Pintura",
  "Carpintería",
  "Herrería",
  "Vidriería",
  "Albañilería",
  "Aire Acondicionado",
  "Calefacción",
  "Gas",
  "Cerrajería",
  "Impermeabilización",
  "Otros",
]
const PROVEEDORES = ["Proveedor 1", "Proveedor 2", "Proveedor 3", "Proveedor 4", "Proveedor 5", "A Designar"]

export default function CrearTicket({ onCrearTicket, onCancelar }: CrearTicketProps) {
  const [formData, setFormData] = useState<Omit<Reclamo, "id" | "ticket" | "fechaCreacion">>({
    cliente: "",
    telefono: "",
    edificio: "",
    unidadFuncional: "",
    tipoOcupante: "Propietario",
    nombreInquilino: "",
    fechaPosesion: "",
    ubicacionAfectada: "",
    rubro: "",
    proveedor: "",
    urgencia: "Media",
    fechaIngreso: new Date().toISOString().split("T")[0],
    detalle: "",
    detalles: [],
    fotos: [],
    estado: "Ingresado",
    notas: "",
  })

  const [nuevoDetalle, setNuevoDetalle] = useState("")
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<File[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const agregarDetalle = () => {
    if (nuevoDetalle.trim() === "") return
    setFormData((prev) => ({
      ...prev,
      detalles: [...(prev.detalles || []), nuevoDetalle],
    }))
    setNuevoDetalle("")
  }

  const eliminarDetalle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: (prev.detalles || []).filter((_, i) => i !== index),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nuevosArchivos = Array.from(e.target.files)
      setArchivosSeleccionados((prev) => [...prev, ...nuevosArchivos])
    }
  }

  const eliminarArchivo = (index: number) => {
    setArchivosSeleccionados((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fotosNombres = archivosSeleccionados.map((file) => file.name)
    onCrearTicket({ ...formData, fotos: fotosNombres })
  }

  const isFormValid = () => {
    return (
      formData.cliente.trim() !== "" &&
      formData.telefono.trim() !== "" &&
      formData.edificio.trim() !== "" &&
      formData.unidadFuncional.trim() !== "" &&
      formData.detalles &&
      formData.detalles.length > 0
    )
  }

  useEffect(() => {
    const autocompletarCliente = async () => {
      if (formData.edificio && formData.unidadFuncional) {
        try {
          const response = await fetch(`/api/clientes?edificio=${formData.edificio}&unidad=${formData.unidadFuncional}`)
          if (response.ok) {
            const cliente = await response.json()
            if (cliente) {
              setFormData((prev) => ({
                ...prev,
                cliente: `${cliente.nombre} ${cliente.apellido}`,
                telefono: cliente.telefono || "",
                fechaPosesion: cliente.fechaPosesion || "",
              }))
            }
          }
        } catch (error) {
          console.log("No se pudo autocompletar los datos del cliente")
        }
      }
    }

    autocompletarCliente()
  }, [formData.edificio, formData.unidadFuncional])

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle>Crear Nuevo Ticket</CardTitle>
        <CardDescription>Complete todos los campos requeridos para crear un nuevo ticket de posventa</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección: Datos del Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Datos del Cliente</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edificio">Edificio *</Label>
                <Select onValueChange={(value) => handleSelectChange("edificio", value)} value={formData.edificio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione edificio" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDIFICIOS.map((edificio) => (
                      <SelectItem key={edificio} value={edificio}>
                        {edificio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unidadFuncional">Unidad Funcional *</Label>
                <Input
                  id="unidadFuncional"
                  name="unidadFuncional"
                  placeholder="Ej: 101, A-5, etc."
                  value={formData.unidadFuncional}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Nombre del Cliente *</Label>
                <Input
                  id="cliente"
                  name="cliente"
                  placeholder="Se autocompletará al seleccionar edificio y unidad"
                  value={formData.cliente}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Los datos se autocompletarán desde la base de datos de Comercial
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  placeholder="Número de contacto"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoOcupante">Relación con el inmueble *</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("tipoOcupante", value as TipoOcupante)}
                  value={formData.tipoOcupante}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Propietario">Propietario</SelectItem>
                    <SelectItem value="Inquilino">Inquilino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.tipoOcupante === "Inquilino" && (
                <div className="space-y-2">
                  <Label htmlFor="nombreInquilino">Nombre del Inquilino</Label>
                  <Input
                    id="nombreInquilino"
                    name="nombreInquilino"
                    value={formData.nombreInquilino || ""}
                    onChange={handleInputChange}
                    placeholder="Nombre completo del inquilino"
                  />
                  <p className="text-xs text-muted-foreground">
                    Si está disponible, se autocompletará desde la base de datos
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fechaPosesion">Fecha de Posesión</Label>
                <Input
                  id="fechaPosesion"
                  name="fechaPosesion"
                  type="date"
                  value={formData.fechaPosesion}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">Se autocompleta desde el acta si está disponible</p>
              </div>
            </div>
          </div>

          {/* Sección: Detalles del Reclamo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Detalles del Reclamo</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ubicacionAfectada">Ubicación Afectada</Label>
                <Select
                  onValueChange={(value) => handleSelectChange("ubicacionAfectada", value)}
                  value={formData.ubicacionAfectada}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {UBICACIONES.map((ubicacion) => (
                      <SelectItem key={ubicacion} value={ubicacion}>
                        {ubicacion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rubro">Rubro</Label>
                <Select onValueChange={(value) => handleSelectChange("rubro", value)} value={formData.rubro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione rubro" />
                  </SelectTrigger>
                  <SelectContent>
                    {RUBROS.map((rubro) => (
                      <SelectItem key={rubro} value={rubro}>
                        {rubro}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Select onValueChange={(value) => handleSelectChange("proveedor", value)} value={formData.proveedor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVEEDORES.map((proveedor) => (
                      <SelectItem key={proveedor} value={proveedor}>
                        {proveedor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencia">Urgencia</Label>
              <Select
                onValueChange={(value) => handleSelectChange("urgencia", value as Urgencia)}
                value={formData.urgencia}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baja">Baja</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nuevoDetalle">Reclamo (Detalles) *</Label>
              <div className="flex space-x-2">
                <Textarea
                  id="nuevoDetalle"
                  value={nuevoDetalle}
                  onChange={(e) => setNuevoDetalle(e.target.value)}
                  placeholder="Describa el reclamo en detalle"
                  className="flex-1"
                  rows={3}
                />
                <Button type="button" onClick={agregarDetalle} size="icon" className="self-end">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {formData.detalles && formData.detalles.length > 0 ? (
                <div className="mt-4 space-y-2">
                  <Label>Detalles añadidos:</Label>
                  <ul className="space-y-2">
                    {formData.detalles.map((detalle, index) => (
                      <li key={index} className="flex justify-between items-start p-3 bg-muted rounded-md">
                        <span className="text-sm flex-1">{detalle}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarDetalle(index)}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-4 p-4 border border-dashed rounded-md text-center text-muted-foreground text-sm">
                  No hay detalles añadidos. Agregue al menos un detalle para el reclamo.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fotos">Fotos/Videos</Label>
              <div className="border-2 border-dashed rounded-md p-4">
                <input
                  type="file"
                  id="fotos"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="fotos" className="cursor-pointer block text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Arrastra archivos aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground mt-1">Sin límite de capacidad</p>
                </label>
              </div>

              {archivosSeleccionados.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Archivos seleccionados:</Label>
                  <ul className="space-y-2">
                    {archivosSeleccionados.map((archivo, index) => (
                      <li key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <span className="text-sm truncate flex-1">{archivo.name}</span>
                        <span className="text-xs text-muted-foreground mx-2">
                          {(archivo.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => eliminarArchivo(index)}
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancelar}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={!isFormValid()}>
              <Save className="h-4 w-4 mr-2" />
              Crear Ticket
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
