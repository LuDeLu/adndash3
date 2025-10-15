"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle2, XCircle, AlertTriangle, Eye, Calendar } from "lucide-react"
import type { Reclamo, EstadoReclamo } from "../../types/postVenta"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type MisTicketsProps = {
  reclamos: Reclamo[]
  onActualizarEstado: (id: string | number, nuevoEstado: EstadoReclamo, datosAdicionales?: any) => void
  onVerDetalle: (reclamo: Reclamo) => void
}

export default function MisTickets({ reclamos, onActualizarEstado, onVerDetalle }: MisTicketsProps) {
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Reclamo | null>(null)
  const [mostrarDialogoProceso, setMostrarDialogoProceso] = useState(false)
  const [mostrarDialogoCierre, setMostrarDialogoCierre] = useState(false)
  const [fechaVisita, setFechaVisita] = useState("")
  const [horaVisita, setHoraVisita] = useState("")
  const [proveedorResolvio, setProveedorResolvio] = useState("")
  const [costo, setCosto] = useState("")

  const estados: EstadoReclamo[] = ["Ingresado", "En Proceso", "Solucionado", "No Corresponde"]

  const getTicketsPorEstado = (estado: EstadoReclamo) => {
    return reclamos.filter((r) => r.estado === estado)
  }

  const getEstadoColor = (estado: EstadoReclamo) => {
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

  const getEstadoIcon = (estado: EstadoReclamo) => {
    switch (estado) {
      case "Ingresado":
        return <Clock className="h-4 w-4" />
      case "En Proceso":
        return <AlertTriangle className="h-4 w-4" />
      case "Solucionado":
        return <CheckCircle2 className="h-4 w-4" />
      case "No Corresponde":
        return <XCircle className="h-4 w-4" />
    }
  }

  const handleMoverTicket = (ticket: Reclamo, nuevoEstado: EstadoReclamo) => {
    setTicketSeleccionado(ticket)

    if (nuevoEstado === "En Proceso") {
      setMostrarDialogoProceso(true)
    } else if (nuevoEstado === "Solucionado") {
      setMostrarDialogoCierre(true)
    } else {
      onActualizarEstado(ticket.id, nuevoEstado)
    }
  }

  const confirmarProceso = () => {
    if (ticketSeleccionado && fechaVisita && horaVisita) {
      onActualizarEstado(ticketSeleccionado.id, "En Proceso", {
        fechaVisita,
        horaVisita,
      })
      setMostrarDialogoProceso(false)
      setFechaVisita("")
      setHoraVisita("")
      setTicketSeleccionado(null)
    }
  }

  const confirmarCierre = () => {
    if (ticketSeleccionado && proveedorResolvio) {
      const fechaCierre = new Date().toISOString().split("T")[0]
      const fechaCreacion = new Date(ticketSeleccionado.fechaCreacion || ticketSeleccionado.fechaIngreso)
      const tiempoResolucion = Math.ceil((new Date().getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24))

      onActualizarEstado(ticketSeleccionado.id, "Solucionado", {
        fechaCierre,
        tiempoResolucion,
        proveedorResolvio,
        costo: Number.parseFloat(costo) || 0,
      })
      setMostrarDialogoCierre(false)
      setProveedorResolvio("")
      setCosto("")
      setTicketSeleccionado(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estados.map((estado) => {
          const tickets = getTicketsPorEstado(estado)
          return (
            <Card key={estado} className="border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    {getEstadoIcon(estado)}
                    <span>{estado}</span>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-base font-bold">
                    {tickets.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">No hay tickets en este estado</div>
                ) : (
                  tickets.map((ticket) => (
                    <Card key={ticket.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm">{ticket.ticket}</span>
                          <Badge variant="outline" className={getEstadoColor(ticket.estado)}>
                            {ticket.estado}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(ticket.fechaCreacion || ticket.fechaIngreso), "dd/MM/yyyy", {
                              locale: es,
                            })}
                          </div>
                          <div>
                            <strong>UF:</strong> {ticket.unidadFuncional}
                          </div>
                          <div>
                            <strong>Rubro:</strong> {ticket.rubro || "No especificado"}
                          </div>
                        </div>

                        <div className="flex gap-1 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs bg-transparent"
                            onClick={() => onVerDetalle(ticket)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>

                          {estado !== "Solucionado" && estado !== "No Corresponde" && (
                            <select
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground rounded-md px-3 flex-1 h-7 text-xs bg-transparent"
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleMoverTicket(ticket, e.target.value as EstadoReclamo)
                                  e.target.value = ""
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Mover a...
                              </option>
                              {estados
                                .filter((e) => e !== estado)
                                .map((e) => (
                                  <option key={e} value={e}>
                                    {e}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Diálogo para mover a "En Proceso" */}
      <Dialog open={mostrarDialogoProceso} onOpenChange={setMostrarDialogoProceso}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Programar Visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Al programar la visita, se enviará automáticamente un recordatorio al cliente 48 horas antes de la fecha
              programada.
            </p>
            <div className="space-y-2">
              <Label htmlFor="fechaVisita">Fecha de Visita *</Label>
              <Input
                id="fechaVisita"
                type="date"
                value={fechaVisita}
                onChange={(e) => setFechaVisita(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaVisita">Hora de Visita *</Label>
              <Input id="horaVisita" type="time" value={horaVisita} onChange={(e) => setHoraVisita(e.target.value)} />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setMostrarDialogoProceso(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmarProceso} disabled={!fechaVisita || !horaVisita}>
                Confirmar y Programar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo para cerrar ticket */}
      <Dialog open={mostrarDialogoCierre} onOpenChange={setMostrarDialogoCierre}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Al cerrar el ticket, se enviará automáticamente un correo al cliente solicitando su conformidad.
            </p>
            <div className="space-y-2">
              <Label>Fecha de Cierre</Label>
              <Input type="date" value={new Date().toISOString().split("T")[0]} disabled />
              <p className="text-xs text-muted-foreground">Fecha automática del día de cierre</p>
            </div>

            {ticketSeleccionado && (
              <div className="space-y-2">
                <Label>Tiempo de Resolución</Label>
                <Input
                  value={`${Math.ceil(
                    (new Date().getTime() -
                      new Date(ticketSeleccionado.fechaCreacion || ticketSeleccionado.fechaIngreso).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )} días`}
                  disabled
                />
                <p className="text-xs text-muted-foreground">Cálculo automático desde la fecha de creación</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="proveedorResolvio">Proveedor que Resolvió *</Label>
              <Input
                id="proveedorResolvio"
                value={proveedorResolvio}
                onChange={(e) => setProveedorResolvio(e.target.value)}
                placeholder="Nombre del proveedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo">Costo</Label>
              <Input
                id="costo"
                type="number"
                step="0.01"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setMostrarDialogoCierre(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmarCierre} disabled={!proveedorResolvio}>
                Cerrar Ticket y Enviar Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
