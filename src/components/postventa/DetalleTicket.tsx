"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  User,
  Phone,
  Building,
  MapPin,
  FileText,
  DollarSign,
  CheckCircle2,
  X,
  Save,
} from "lucide-react"
import type { Reclamo } from "../../types/postVenta"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type DetalleTicketProps = {
  reclamo: Reclamo
  onCerrar: () => void
  onActualizar: (id: string | number, notas: string) => void
}

export default function DetalleTicket({ reclamo, onCerrar, onActualizar }: DetalleTicketProps) {
  const [notas, setNotas] = useState(reclamo.notas || "")
  const [editando, setEditando] = useState(false)

  const handleGuardarNotas = () => {
    onActualizar(reclamo.id, notas)
    setEditando(false)
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Ingresado":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "En Proceso":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Solucionado":
        return "bg-green-100 text-green-800 border-green-200"
      case "No Corresponde":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getUrgenciaColor = (urgencia?: string) => {
    switch (urgencia) {
      case "Alta":
        return "bg-red-100 text-red-800 border-red-200"
      case "Media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Baja":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 /50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">Detalle del Ticket</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">{reclamo.ticket}</span>
              <Badge variant="outline" className={getEstadoColor(reclamo.estado)}>
                {reclamo.estado}
              </Badge>
              {reclamo.urgencia && (
                <Badge variant="outline" className={getUrgenciaColor(reclamo.urgencia)}>
                  {reclamo.urgencia}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCerrar}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Información del Cliente */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <Label className="text-muted-foreground">Cliente</Label>
                <p className="font-medium">{reclamo.cliente}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Telefono</Label>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {reclamo.telefono}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo de Ocupante</Label>
                <p className="font-medium">{reclamo.tipoOcupante}</p>
              </div>
              {reclamo.nombreInquilino && (
                <div>
                  <Label className="text-muted-foreground">Nombre del Inquilino</Label>
                  <p className="font-medium">{reclamo.nombreInquilino}</p>
                </div>
              )}
              {reclamo.fechaPosesion && (
                <div>
                  <Label className="text-muted-foreground">Fecha de Posesion</Label>
                  <p className="font-medium">{format(new Date(reclamo.fechaPosesion), "dd/MM/yyyy", { locale: es })}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Información del Inmueble */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-5 w-5" />
              Información del Inmueble
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <Label className="text-muted-foreground">Edificio</Label>
                <p className="font-medium">{reclamo.edificio}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidad Funcional</Label>
                <p className="font-medium">{reclamo.unidadFuncional}</p>
              </div>
              {reclamo.ubicacionAfectada && (
                <div>
                  <Label className="text-muted-foreground">Ubicación Afectada</Label>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {reclamo.ubicacionAfectada}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Detalles del Reclamo */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalles del Reclamo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <Label className="text-muted-foreground">Fecha de Creación</Label>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(reclamo.fechaCreacion || reclamo.fechaIngreso), "dd/MM/yyyy", { locale: es })}
                </p>
              </div>
              {reclamo.rubro && (
                <div>
                  <Label className="text-muted-foreground">Rubro</Label>
                  <p className="font-medium">{reclamo.rubro}</p>
                </div>
              )}
              {reclamo.proveedor && (
                <div>
                  <Label className="text-muted-foreground">Proveedor</Label>
                  <p className="font-medium">{reclamo.proveedor}</p>
                </div>
              )}
              {reclamo.fechaVisita && (
                <div>
                  <Label className="text-muted-foreground">Fecha de Visita Programada</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(new Date(reclamo.fechaVisita), "dd/MM/yyyy", { locale: es })}
                    {reclamo.horaVisita && ` - ${reclamo.horaVisita}`}
                  </p>
                </div>
              )}
            </div>

            <div className="pl-7">
              <Label className="text-muted-foreground">Descripción del Reclamo</Label>
              <p className="font-medium mt-1">{reclamo.detalle}</p>
            </div>

            {reclamo.detalles && reclamo.detalles.length > 0 && (
              <div className="pl-7">
                <Label className="text-muted-foreground">Detalles Adicionales</Label>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  {reclamo.detalles.map((detalle, index) => (
                    <li key={index} className="font-medium">
                      {detalle}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Información de Cierre (si está solucionado) */}
          {reclamo.estado === "Solucionado" && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  Información de Cierre
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  {reclamo.fechaCierre && (
                    <div>
                      <Label className="text-muted-foreground">Fecha de Cierre</Label>
                      <p className="font-medium">
                        {format(new Date(reclamo.fechaCierre), "dd/MM/yyyy", { locale: es })}
                      </p>
                    </div>
                  )}
                  {reclamo.tiempoResolucion && (
                    <div>
                      <Label className="text-muted-foreground">Tiempo de Resolucion</Label>
                      <p className="font-medium">{reclamo.tiempoResolucion} días</p>
                    </div>
                  )}
                  {reclamo.proveedorResolvio && (
                    <div>
                      <Label className="text-muted-foreground">Proveedor que Resolvio</Label>
                      <p className="font-medium">{reclamo.proveedorResolvio}</p>
                    </div>
                  )}
                  {reclamo.costo !== undefined && reclamo.costo > 0 && (
                    <div>
                      <Label className="text-muted-foreground">Costo</Label>
                      <p className="font-medium flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />$
                        {reclamo.costo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Notas/Observaciones/Comentarios */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notas / Observaciones / Comentarios
              </h3>
              {!editando && (
                <Button variant="outline" size="sm" onClick={() => setEditando(true)}>
                  Editar
                </Button>
              )}
            </div>
            <div className="pl-7">
              {editando ? (
                <div className="space-y-2">
                  <Textarea
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Registre aquí visitas, fechas, proveedores y trabajos realizados..."
                    rows={6}
                    className="w-full"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleGuardarNotas} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNotas(reclamo.notas || "")
                        setEditando(false)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-md min-h-[100px]">
                  {notas ? (
                    <p className="whitespace-pre-wrap">{notas}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No hay notas registradas. Haga clic en Editar para agregar informacion.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Botón de cerrar */}
          <div className="flex justify-end pt-4">
            <Button onClick={onCerrar}>Cerrar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
