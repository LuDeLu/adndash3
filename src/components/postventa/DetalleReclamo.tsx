"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { es } from "date-fns/locale/es"
import type { Reclamo, ItemInspeccion, OrdenTrabajo, ActaConformidad, EstadoReclamo } from "../../types/postVenta"
import EnviarInformacionTrabajador from "./EnviarInformacionTrabajador"
import {
  User,
  Phone,
  Building,
  Hash,
  Calendar,
  FileText,
  Clipboard,
  PenTool as Tool,
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
} from "lucide-react"
import { format } from "date-fns"

registerLocale("es", es)

type DetalleReclamoProps = {
  reclamo: Reclamo
  onActualizarReclamo: (reclamo: Reclamo) => void
  onEnviarCorreo: (reclamo: Reclamo, tipo: "nuevo_reclamo" | "actualizacion_estado") => void
}

export default function DetalleReclamo({ reclamo, onActualizarReclamo, onEnviarCorreo }: DetalleReclamoProps) {
  const [inspeccion, setInspeccion] = useState<ItemInspeccion>({
    ambiente: "",
    lugar: "",
    item: "",
    descripcionCliente: "",
    resultado: "Corresponde",
  })

  const [ordenTrabajo, setOrdenTrabajo] = useState<OrdenTrabajo>({
    responsable: "Yoni",
    fechaTrabajo: "",
    horaTrabajo: "",
    tiempoEstimado: "",
    observacionesEjecucion: "",
  })

  const [actaConformidad, setActaConformidad] = useState<ActaConformidad>({
    fechaSolicitud: reclamo.fechaIngreso,
    fechaIngreso: reclamo.fechaIngreso,
    fechaVisitaAcordada: reclamo.fechaVisita || "",
    fechaAcordadaOrdenInspeccion: "",
    fechaTerminoOT: "",
    fechaTerminoEjecucion: "",
    responsable: "Yoni",
    solicitudesSolucionadas: [],
    conformidadCliente: false,
    nombreRecepcion: "",
    telefonoRecepcion: "",
  })

  // Modificar la función de inicialización de fechaHoraVisita para manejar fechas inválidas
  const [fechaHoraVisita, setFechaHoraVisita] = useState<Date | null>(() => {
    if (reclamo.fechaVisita && reclamo.horaVisita) {
      try {
        // Crear la fecha correctamente para evitar problemas de zona horaria
        const [year, month, day] = reclamo.fechaVisita.split("-").map(Number)
        const [hours, minutes] = reclamo.horaVisita.split(":").map(Number)

        // Verificar que los valores sean válidos
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes)) {
          console.warn("Fecha u hora inválida:", reclamo.fechaVisita, reclamo.horaVisita)
          return null
        }

        // Crear la fecha con los componentes individuales
        const date = new Date(year, month - 1, day, hours, minutes)

        // Verificar que la fecha resultante sea válida
        if (isNaN(date.getTime())) {
          console.warn("Fecha resultante inválida:", date)
          return null
        }

        return date
      } catch (error) {
        console.error("Error al parsear la fecha:", error)
        return null
      }
    }
    return null
  })

  const handleInspeccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInspeccion({ ...inspeccion, [e.target.name]: e.target.value as any })
  }

  const handleOrdenTrabajoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrdenTrabajo({ ...ordenTrabajo, [e.target.name]: e.target.value })
  }

  const handleActaConformidadChange = (name: string, value: string | boolean | string[]) => {
    setActaConformidad((prev) => ({ ...prev, [name]: value }))
  }

  const handleFechaHoraVisitaChange = (date: Date | null) => {
    setFechaHoraVisita(date)
    if (date) {
      // Formatear la fecha correctamente (YYYY-MM-DD)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      const fechaVisita = `${year}-${month}-${day}`

      // Formatear la hora (HH:mm)
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")
      const horaVisita = `${hours}:${minutes}`

      actualizarFechaHoraVisita(fechaVisita, horaVisita)
    }
  }

  const actualizarFechaHoraVisita = async (fecha: string, hora: string) => {
    const reclamoActualizado: Reclamo = {
      ...reclamo,
      fechaVisita: fecha,
      horaVisita: hora,
    }
    await onActualizarReclamo(reclamoActualizado)
  }

  const agregarInspeccion = () => {
    const nuevaInspeccion = reclamo.inspeccion
      ? {
          ...reclamo.inspeccion,
          items: [...reclamo.inspeccion.items, inspeccion],
        }
      : {
          items: [inspeccion],
          observaciones: "",
          fechaProgramada: new Date().toISOString().split("T")[0],
        }

    const reclamoActualizado: Reclamo = {
      ...reclamo,
      inspeccion: nuevaInspeccion,
      estado: "En Proceso",
    }

    onActualizarReclamo(reclamoActualizado)
    setInspeccion({
      ambiente: "",
      lugar: "",
      item: "",
      descripcionCliente: "",
      resultado: "Corresponde",
    })
  }

  const agregarOrdenTrabajo = () => {
    const reclamoActualizado: Reclamo = {
      ...reclamo,
      ordenTrabajo: ordenTrabajo,
      estado: "En Proceso",
    }
    onActualizarReclamo(reclamoActualizado)
    setOrdenTrabajo({
      responsable: "Yoni",
      fechaTrabajo: "",
      horaTrabajo: "",
      tiempoEstimado: "",
      observacionesEjecucion: "",
    })
  }

  const finalizarReclamo = () => {
    const reclamoActualizado: Reclamo = {
      ...reclamo,
      actaConformidad,
      estado: "Solucionado",
    }
    onActualizarReclamo(reclamoActualizado)
  }

  const getEstadoBadge = (estado: EstadoReclamo) => {
    switch (estado) {
      case "Ingresado":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
            <Clock className="mr-1 h-3 w-3" />
            Ingresado
          </Badge>
        )
      case "En Proceso":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            <AlertTriangle className="mr-1 h-3 w-3" />
            En Proceso
          </Badge>
        )
      case "Solucionado":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Solucionado
          </Badge>
        )
      case "No Corresponde":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            No Corresponde
          </Badge>
        )
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ticket: {reclamo.ticket}
          </CardTitle>
          {getEstadoBadge(reclamo.estado)}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="informacion" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="informacion" className="flex items-center justify-center">
              <FileText className="w-4 h-4 mr-2" />
              Información
            </TabsTrigger>
            <TabsTrigger value="inspeccion" className="flex items-center justify-center">
              <Clipboard className="w-4 h-4 mr-2" />
              Inspección
            </TabsTrigger>
            <TabsTrigger value="reparacion" className="flex items-center justify-center">
              <Tool className="w-4 h-4 mr-2" />
              Reparación
            </TabsTrigger>
            <TabsTrigger value="conformidad" className="flex items-center justify-center">
              <CheckSquare className="w-4 h-4 mr-2" />
              Conformidad
            </TabsTrigger>
          </TabsList>

          <TabsContent value="informacion">
            <InformacionReclamo
              reclamo={reclamo}
              fechaHoraVisita={fechaHoraVisita}
              handleFechaHoraVisitaChange={handleFechaHoraVisitaChange}
            />
          </TabsContent>

          <TabsContent value="inspeccion">
            <InspeccionReclamo
              reclamo={reclamo}
              inspeccion={inspeccion}
              handleInspeccionChange={handleInspeccionChange}
              agregarInspeccion={agregarInspeccion}
            />
          </TabsContent>

          <TabsContent value="reparacion">
            <ReparacionReclamo
              reclamo={reclamo}
              ordenTrabajo={ordenTrabajo}
              handleOrdenTrabajoChange={handleOrdenTrabajoChange}
              agregarOrdenTrabajo={agregarOrdenTrabajo}
            />
          </TabsContent>

          <TabsContent value="conformidad">
            <ConformidadReclamo
              reclamo={reclamo}
              actaConformidad={actaConformidad}
              handleActaConformidadChange={handleActaConformidadChange}
              finalizarReclamo={finalizarReclamo}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface InformacionReclamoProps {
  reclamo: Reclamo
  fechaHoraVisita: Date | null
  handleFechaHoraVisitaChange: (date: Date | null) => void
}

function InformacionReclamo({ reclamo, fechaHoraVisita, handleFechaHoraVisitaChange }: InformacionReclamoProps) {
  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Información del Cliente</h3>
            <InfoItem icon={<User className="text-blue-500" />} label="Cliente" value={reclamo.cliente} />
            <InfoItem icon={<Phone className="text-blue-500" />} label="Teléfono" value={reclamo.telefono} />
            <InfoItem
              icon={<UserCheck className="text-blue-500" />}
              label="Tipo de Ocupante"
              value={reclamo.tipoOcupante}
            />
          </div>

          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Ubicación</h3>
            <InfoItem icon={<Building className="text-purple-500" />} label="Edificio" value={reclamo.edificio} />
            <InfoItem icon={<Hash className="text-purple-500" />} label="UF" value={reclamo.unidadFuncional} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/40 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Programación de Visita</h3>
            <div className="space-y-2">
              <Label htmlFor="fechaHoraVisita" className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-green-500" />
                Fecha y Hora de Visita
              </Label>
              <DatePicker
                id="fechaHoraVisita"
                selected={fechaHoraVisita}
                onChange={handleFechaHoraVisitaChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="w-full p-2 border rounded bg-input text-foreground"
                placeholderText="Seleccione fecha y hora"
                locale="es"
                timeCaption="Hora"
                disabledKeyboardNavigation
              />
              {reclamo.fechaVisita && (
                <div className="text-xs text-muted-foreground mt-1">
                  Visita programada para el{" "}
                  {format(new Date(reclamo.fechaVisita), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
                  {reclamo.horaVisita && ` a las ${reclamo.horaVisita} hs.`}
                </div>
              )}
            </div>
          </div>

          <EnviarInformacionTrabajador reclamo={reclamo} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Detalle del Reclamo</h3>
        <Textarea id="detalle" value={reclamo.detalle} readOnly className="bg-muted min-h-[100px]" />
      </div>

      {reclamo.detalles && reclamo.detalles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Detalles Adicionales</h3>
          <div className="space-y-2 border rounded-md p-4 bg-muted">
            {reclamo.detalles.map((detalle, index) => (
              <div key={index} className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5 h-5 w-5 flex items-center justify-center p-0">
                  {index + 1}
                </Badge>
                <span>{detalle}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {reclamo.comentario && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Comentario</h3>
          <Textarea id="comentario" value={reclamo.comentario} readOnly className="bg-muted" />
        </div>
      )}
    </div>
  )
}

interface InspeccionReclamoProps {
  reclamo: Reclamo
  inspeccion: ItemInspeccion
  handleInspeccionChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  agregarInspeccion: () => void
}

function InspeccionReclamo({ reclamo, inspeccion, handleInspeccionChange, agregarInspeccion }: InspeccionReclamoProps) {
  return (
    <div className="space-y-6 pt-4">
      {reclamo.estado === "Ingresado" && (
        <div className=" dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Clipboard className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Nueva Inspección
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ambiente">Ambiente</Label>
              <Input
                id="ambiente"
                name="ambiente"
                placeholder="Ej: Cocina, Baño, Dormitorio"
                value={inspeccion.ambiente}
                onChange={handleInspeccionChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lugar">Lugar</Label>
              <Input
                id="lugar"
                name="lugar"
                placeholder="Ej: Pared, Techo, Piso"
                value={inspeccion.lugar}
                onChange={handleInspeccionChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="item">Ítem</Label>
            <Input
              id="item"
              name="item"
              placeholder="Ej: Grifo, Cerámica, Pintura"
              value={inspeccion.item}
              onChange={handleInspeccionChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcionCliente">Descripción del Cliente</Label>
            <Textarea
              id="descripcionCliente"
              name="descripcionCliente"
              placeholder="Descripción detallada del problema según el cliente"
              value={inspeccion.descripcionCliente}
              onChange={handleInspeccionChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resultado">Resultado de la Inspección</Label>
            <select
              id="resultado"
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
          <Button
            onClick={agregarInspeccion}
            className="w-full md:w-auto"
            disabled={!inspeccion.ambiente || !inspeccion.lugar || !inspeccion.item}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Registrar Inspección
          </Button>
        </div>
      )}

      {reclamo.inspeccion && reclamo.inspeccion.items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clipboard className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
            Inspecciones Realizadas
          </h3>
          <div className="space-y-4">
            {reclamo.inspeccion.items.map((item, index) => (
              <Card key={index} className="overflow-hidden border border-border">
                <div
                  className={`h-2 ${
                    item.resultado === "Corresponde"
                      ? "bg-green-500"
                      : item.resultado === "No Corresponde"
                        ? "bg-red-500"
                        : item.resultado === "Re Inspección"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                  }`}
                />
                <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ambiente</p>
                    <p className="font-medium">{item.ambiente}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Lugar</p>
                    <p className="font-medium">{item.lugar}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ítem</p>
                    <p className="font-medium">{item.item}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Resultado</p>
                    <Badge
                      variant="outline"
                      className={`${
                        item.resultado === "Corresponde"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : item.resultado === "No Corresponde"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : item.resultado === "Re Inspección"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                      }`}
                    >
                      {item.resultado}
                    </Badge>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Descripción del Cliente</p>
                    <p>{item.descripcionCliente}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {reclamo.inspeccion.observaciones && (
            <div className="mt-4 p-4 bg-muted/40 rounded-lg">
              <p className="font-medium mb-2">Observaciones:</p>
              <p>{reclamo.inspeccion.observaciones}</p>
            </div>
          )}

          <div className="mt-4 flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Fecha Programada: {format(new Date(reclamo.inspeccion.fechaProgramada), "dd/MM/yyyy", { locale: es })}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

interface ReparacionReclamoProps {
  reclamo: Reclamo
  ordenTrabajo: OrdenTrabajo
  handleOrdenTrabajoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  agregarOrdenTrabajo: () => void
}

function ReparacionReclamo({
  reclamo,
  ordenTrabajo,
  handleOrdenTrabajoChange,
  agregarOrdenTrabajo,
}: ReparacionReclamoProps) {
  return (
    <div className="space-y-6 pt-4">
      {reclamo.estado === "En Proceso" && (
        <div className=" dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Tool className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
            Nueva Orden de Trabajo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                name="responsable"
                placeholder="Nombre del responsable"
                value={ordenTrabajo.responsable}
                onChange={handleOrdenTrabajoChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiempoEstimado">Tiempo Estimado</Label>
              <Input
                id="tiempoEstimado"
                name="tiempoEstimado"
                placeholder="Ej: 2 horas, 1 día"
                value={ordenTrabajo.tiempoEstimado}
                onChange={handleOrdenTrabajoChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaTrabajo">Fecha de Trabajo</Label>
              <Input
                id="fechaTrabajo"
                name="fechaTrabajo"
                type="date"
                value={ordenTrabajo.fechaTrabajo}
                onChange={handleOrdenTrabajoChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="horaTrabajo">Hora de Trabajo</Label>
              <Input
                id="horaTrabajo"
                name="horaTrabajo"
                type="time"
                value={ordenTrabajo.horaTrabajo}
                onChange={handleOrdenTrabajoChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacionesEjecucion">Observaciones de Ejecución</Label>
            <Textarea
              id="observacionesEjecucion"
              name="observacionesEjecucion"
              placeholder="Detalles sobre la ejecución del trabajo"
              value={ordenTrabajo.observacionesEjecucion}
              onChange={handleOrdenTrabajoChange}
              rows={4}
            />
          </div>

          <Button
            onClick={agregarOrdenTrabajo}
            className="w-full md:w-auto"
            disabled={!ordenTrabajo.responsable || !ordenTrabajo.fechaTrabajo}
          >
            <Tool className="mr-2 h-4 w-4" />
            Crear Orden de Trabajo
          </Button>
        </div>
      )}

      {reclamo.ordenTrabajo && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Tool className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
            Orden de Trabajo Actual
          </h3>

          <Card className="overflow-hidden border border-border">
            <div className="h-2 bg-green-500" />
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Responsable</p>
                    <p className="font-medium">{reclamo.ordenTrabajo.responsable}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tiempo Estimado</p>
                    <p className="font-medium">{reclamo.ordenTrabajo.tiempoEstimado || "No especificado"}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha y Hora de Trabajo</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-green-500" />
                      <p className="font-medium">
                        {reclamo.ordenTrabajo.fechaTrabajo
                          ? format(new Date(reclamo.ordenTrabajo.fechaTrabajo), "dd/MM/yyyy", { locale: es })
                          : "No programado"}
                        {reclamo.ordenTrabajo.horaTrabajo && ` a las ${reclamo.ordenTrabajo.horaTrabajo} hs.`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {reclamo.ordenTrabajo.observacionesEjecucion && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Observaciones de Ejecución</p>
                  <div className="p-3 bg-muted rounded-md">
                    <p>{reclamo.ordenTrabajo.observacionesEjecucion}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

interface ConformidadReclamoProps {
  reclamo: Reclamo
  actaConformidad: ActaConformidad
  handleActaConformidadChange: (name: string, value: string | boolean | string[]) => void
  finalizarReclamo: () => void
}

function ConformidadReclamo({
  reclamo,
  actaConformidad,
  handleActaConformidadChange,
  finalizarReclamo,
}: ConformidadReclamoProps) {
  return (
    <div className="space-y-6 pt-4">
      {reclamo.estado === "En Proceso" && (
        <div className="dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold flex items-center">
            <CheckSquare className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
            Acta de Conformidad
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaSolicitud">Fecha de Solicitud</Label>
              <Input
                id="fechaSolicitud"
                name="fechaSolicitud"
                type="date"
                value={actaConformidad.fechaSolicitud}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
              <Input
                id="fechaIngreso"
                name="fechaIngreso"
                type="date"
                value={actaConformidad.fechaIngreso}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaVisitaAcordada">Fecha de Visita Acordada</Label>
              <Input
                id="fechaVisitaAcordada"
                name="fechaVisitaAcordada"
                type="date"
                value={actaConformidad.fechaVisitaAcordada}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaAcordadaOrdenInspeccion">Fecha Acordada Orden de Inspección</Label>
              <Input
                id="fechaAcordadaOrdenInspeccion"
                name="fechaAcordadaOrdenInspeccion"
                type="date"
                value={actaConformidad.fechaAcordadaOrdenInspeccion}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaTerminoOT">Fecha Término OT</Label>
              <Input
                id="fechaTerminoOT"
                name="fechaTerminoOT"
                type="date"
                value={actaConformidad.fechaTerminoOT}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaTerminoEjecucion">Fecha Término Ejecución</Label>
              <Input
                id="fechaTerminoEjecucion"
                name="fechaTerminoEjecucion"
                type="date"
                value={actaConformidad.fechaTerminoEjecucion}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input
              id="responsable"
              name="responsable"
              value={actaConformidad.responsable}
              onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solicitudesSolucionadas">Solicitudes Solucionadas (separadas por coma)</Label>
            <Input
              id="solicitudesSolucionadas"
              name="solicitudesSolucionadas"
              value={actaConformidad.solicitudesSolucionadas.join(", ")}
              onChange={(e) => handleActaConformidadChange("solicitudesSolucionadas", e.target.value.split(", "))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="conformidadCliente"
              name="conformidadCliente"
              checked={actaConformidad.conformidadCliente}
              onChange={(e) => handleActaConformidadChange("conformidadCliente", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="conformidadCliente">Conformidad del Cliente</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombreRecepcion">Nombre de Recepción</Label>
              <Input
                id="nombreRecepcion"
                name="nombreRecepcion"
                value={actaConformidad.nombreRecepcion}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefonoRecepcion">Teléfono de Recepción</Label>
              <Input
                id="telefonoRecepcion"
                name="telefonoRecepcion"
                value={actaConformidad.telefonoRecepcion}
                onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
              />
            </div>
          </div>

          <Button onClick={finalizarReclamo} className="w-full md:w-auto" disabled={!actaConformidad.nombreRecepcion}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Finalizar Reclamo
          </Button>
        </div>
      )}

      {reclamo.actaConformidad && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CheckSquare className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
            Acta de Conformidad
          </h3>

          <Card className="overflow-hidden border border-border">
            <div className="h-2 bg-gray-500" />
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha de Solicitud</p>
                    <p className="font-medium">
                      {format(new Date(reclamo.actaConformidad.fechaSolicitud), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha de Ingreso</p>
                    <p className="font-medium">
                      {format(new Date(reclamo.actaConformidad.fechaIngreso), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha de Visita Acordada</p>
                    <p className="font-medium">
                      {reclamo.actaConformidad.fechaVisitaAcordada
                        ? format(new Date(reclamo.actaConformidad.fechaVisitaAcordada), "dd/MM/yyyy", { locale: es })
                        : "No especificada"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha Acordada Orden de Inspección</p>
                    <p className="font-medium">
                      {reclamo.actaConformidad.fechaAcordadaOrdenInspeccion
                        ? format(new Date(reclamo.actaConformidad.fechaAcordadaOrdenInspeccion), "dd/MM/yyyy", {
                            locale: es,
                          })
                        : "No especificada"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha Término OT</p>
                    <p className="font-medium">
                      {reclamo.actaConformidad.fechaTerminoOT
                        ? format(new Date(reclamo.actaConformidad.fechaTerminoOT), "dd/MM/yyyy", { locale: es })
                        : "No especificada"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fecha Término Ejecución</p>
                    <p className="font-medium">
                      {reclamo.actaConformidad.fechaTerminoEjecucion
                        ? format(new Date(reclamo.actaConformidad.fechaTerminoEjecucion), "dd/MM/yyyy", { locale: es })
                        : "No especificada"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Responsable</p>
                    <p className="font-medium">{reclamo.actaConformidad.responsable}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Conformidad del Cliente</p>
                    <Badge
                      variant={reclamo.actaConformidad.conformidadCliente ? "outline" : "destructive"}
                      className={
                        reclamo.actaConformidad.conformidadCliente ? "bg-green-100 text-green-800 border-green-200" : ""
                      }
                    >
                      {reclamo.actaConformidad.conformidadCliente ? "Conforme" : "No conforme"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-2">Solicitudes Solucionadas</p>
                {reclamo.actaConformidad.solicitudesSolucionadas.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {reclamo.actaConformidad.solicitudesSolucionadas.map((solicitud, index) => (
                      <li key={index}>{solicitud}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">No se especificaron solicitudes solucionadas</p>
                )}
              </div>

              <div className="mt-6 p-4 bg-muted/40 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nombre de Recepción</p>
                    <p className="font-medium">{reclamo.actaConformidad.nombreRecepcion}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Teléfono de Recepción</p>
                    <p className="font-medium">{reclamo.actaConformidad.telefonoRecepcion}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

interface InfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center">
      <div className="mr-2">{icon}</div>
      <span className="font-medium mr-1">{label}:</span>
      <span>{value}</span>
    </div>
  )
}
