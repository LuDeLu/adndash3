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
  PenToolIcon as Tool,
  CheckSquare,
} from "lucide-react"

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
        const date = new Date()
        date.setFullYear(year)
        date.setMonth(month - 1) // Los meses en JavaScript son 0-indexed
        date.setDate(day)
        date.setHours(hours, minutes, 0, 0)

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

  const handleInspeccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Crear una nueva fecha con la zona horaria local para evitar problemas de offset
      const localDate = new Date(date.getTime())

      // Formatear la fecha correctamente (YYYY-MM-DD)
      const year = localDate.getFullYear()
      const month = String(localDate.getMonth() + 1).padStart(2, "0")
      const day = String(localDate.getDate()).padStart(2, "0")
      const fechaVisita = `${year}-${month}-${day}`

      // Formatear la hora (HH:mm)
      const hours = String(localDate.getHours()).padStart(2, "0")
      const minutes = String(localDate.getMinutes()).padStart(2, "0")
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
      estado: "En Inspección",
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
      estado: "En Reparación",
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
        return <Badge variant="secondary">Ingresado</Badge>
      case "En Inspección":
        return <Badge variant="default">En Inspección</Badge>
      case "En Reparación":
        return <Badge variant="default">En Reparación</Badge>
      case "Solucionado":
        return <Badge variant="secondary">Solucionado</Badge>
      case "No Corresponde":
        return <Badge variant="destructive">No Corresponde</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Detalle del Reclamo - Ticket: {reclamo.ticket}</CardTitle>
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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InfoItem icon={<User />} label="Cliente" value={reclamo.cliente} />
        <InfoItem icon={<Phone />} label="Teléfono" value={reclamo.telefono} />
        <InfoItem icon={<Building />} label="Edificio" value={reclamo.edificio} />
        <InfoItem icon={<Hash />} label="UF" value={reclamo.unidadFuncional} />
        <InfoItem icon={<User />} label="Tipo de Ocupante" value={reclamo.tipoOcupante} />
      </div>
      <div>
        <Label htmlFor="detalle" className="flex items-center mb-2">
          <FileText className="mr-2 h-4 w-4" />
          Detalle del Reclamo
        </Label>
        <Textarea id="detalle" value={reclamo.detalle} readOnly className="bg-muted" />
      </div>

      {reclamo.detalles && reclamo.detalles.length > 0 && (
        <div>
          <Label className="flex items-center mb-2">
            <FileText className="mr-2 h-4 w-4" />
            Detalles Adicionales
          </Label>
          <div className="space-y-2 border rounded-md p-3 bg-muted">
            {reclamo.detalles.map((detalle, index) => (
              <div key={index} className="flex items-start">
                <span className="font-medium mr-2">{index + 1}.</span>
                <span>{detalle}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <Label htmlFor="comentario" className="flex items-center mb-2">
          <FileText className="mr-2 h-4 w-4" />
          Comentario
        </Label>
        <Textarea id="comentario" value={reclamo.comentario} readOnly className="bg-muted" />
      </div>
      <div>
        <Label htmlFor="fechaHoraVisita" className="flex items-center mb-2">
          <Calendar className="mr-2 h-4 w-4" />
          Fecha y Hora de Primera Visita
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
        />
      </div>
      <EnviarInformacionTrabajador reclamo={reclamo} />
    </div>
  )
}

interface InspeccionReclamoProps {
  reclamo: Reclamo
  inspeccion: ItemInspeccion
  handleInspeccionChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  agregarInspeccion: () => void
}

function InspeccionReclamo({ reclamo, inspeccion, handleInspeccionChange, agregarInspeccion }: InspeccionReclamoProps) {
  return (
    <div className="space-y-4">
      {reclamo.estado === "Ingresado" && (
        <>
          <h3 className="text-lg font-semibold">Nueva Inspección</h3>
          <Input name="ambiente" placeholder="Ambiente" value={inspeccion.ambiente} onChange={handleInspeccionChange} />
          <Input name="lugar" placeholder="Lugar" value={inspeccion.lugar} onChange={handleInspeccionChange} />
          <Input name="item" placeholder="Ítem" value={inspeccion.item} onChange={handleInspeccionChange} />
          <Input
            name="descripcionCliente"
            placeholder="Descripción del Cliente"
            value={inspeccion.descripcionCliente}
            onChange={handleInspeccionChange}
          />
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
          <Button onClick={agregarInspeccion}>Agregar Inspección</Button>
        </>
      )}
      {reclamo.inspeccion && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Inspecciones Realizadas</h3>
          {reclamo.inspeccion.items.map((item, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="pt-6">
                <p>
                  <strong>Ambiente:</strong> {item.ambiente}
                </p>
                <p>
                  <strong>Lugar:</strong> {item.lugar}
                </p>
                <p>
                  <strong>Ítem:</strong> {item.item}
                </p>
                <p>
                  <strong>Descripción del Cliente:</strong> {item.descripcionCliente}
                </p>
                <p>
                  <strong>Resultado:</strong> {item.resultado}
                </p>
              </CardContent>
            </Card>
          ))}
          <p>
            <strong>Observaciones:</strong> {reclamo.inspeccion.observaciones}
          </p>
          <p>
            <strong>Fecha Programada:</strong> {reclamo.inspeccion.fechaProgramada}
          </p>
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
    <div className="space-y-4">
      {reclamo.estado === "En Inspección" && (
        <>
          <h3 className="text-lg font-semibold">Nueva Orden de Trabajo</h3>
          <Input
            name="responsable"
            placeholder="Responsable"
            value={ordenTrabajo.responsable}
            onChange={handleOrdenTrabajoChange}
          />
          <Input
            name="fechaTrabajo"
            type="date"
            placeholder="Fecha de Trabajo"
            value={ordenTrabajo.fechaTrabajo}
            onChange={handleOrdenTrabajoChange}
          />
          <Input
            name="horaTrabajo"
            type="time"
            placeholder="Hora de Trabajo"
            value={ordenTrabajo.horaTrabajo}
            onChange={handleOrdenTrabajoChange}
          />
          <Input
            name="tiempoEstimado"
            placeholder="Tiempo Estimado"
            value={ordenTrabajo.tiempoEstimado}
            onChange={handleOrdenTrabajoChange}
          />
          <Textarea
            name="observacionesEjecucion"
            placeholder="Observaciones de Ejecución"
            value={ordenTrabajo.observacionesEjecucion}
            onChange={handleOrdenTrabajoChange}
          />
          <Button onClick={agregarOrdenTrabajo}>Crear Orden de Trabajo</Button>
        </>
      )}
      {reclamo.ordenTrabajo && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Orden de Trabajo Actual</h3>
          <Card>
            <CardContent className="pt-6">
              <p>
                <strong>Responsable:</strong> {reclamo.ordenTrabajo.responsable}
              </p>
              <p>
                <strong>Fecha de Trabajo:</strong> {reclamo.ordenTrabajo.fechaTrabajo}
              </p>
              <p>
                <strong>Hora de Trabajo:</strong> {reclamo.ordenTrabajo.horaTrabajo}
              </p>
              <p>
                <strong>Tiempo Estimado:</strong> {reclamo.ordenTrabajo.tiempoEstimado}
              </p>
              <p>
                <strong>Observaciones de Ejecución:</strong> {reclamo.ordenTrabajo.observacionesEjecucion}
              </p>
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
    <div className="space-y-4">
      {reclamo.estado === "En Reparación" && (
        <>
          <h3 className="text-lg font-semibold">Acta de Conformidad</h3>
          <Input
            name="fechaSolicitud"
            type="date"
            value={actaConformidad.fechaSolicitud}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="fechaSolicitud">Fecha de Solicitud</Label>
          <Input
            name="fechaIngreso"
            type="date"
            value={actaConformidad.fechaIngreso}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
          <Input
            name="fechaVisitaAcordada"
            type="date"
            value={actaConformidad.fechaVisitaAcordada}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="fechaVisitaAcordada">Fecha de Visita Acordada</Label>
          <Input
            name="fechaAcordadaOrdenInspeccion"
            type="date"
            value={actaConformidad.fechaAcordadaOrdenInspeccion}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="fechaAcordadaOrdenInspeccion">Fecha Acordada Orden de Inspección</Label>
          <Input
            name="fechaTerminoOT"
            type="date"
            value={actaConformidad.fechaTerminoOT}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="fechaTerminoOT">Fecha Término OT</Label>
          <Input
            name="fechaTerminoEjecucion"
            type="date"
            value={actaConformidad.fechaTerminoEjecucion}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="fechaTerminoEjecucion">Fecha Término Ejecución</Label>
          <Input
            name="responsable"
            value={actaConformidad.responsable}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="responsable">Responsable</Label>
          <Input
            name="solicitudesSolucionadas"
            value={actaConformidad.solicitudesSolucionadas.join(", ")}
            onChange={(e) => handleActaConformidadChange("solicitudesSolucionadas", e.target.value.split(", "))}
          />
          <Label htmlFor="solicitudesSolucionadas">Solicitudes Solucionadas (separadas por coma)</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="conformidadCliente"
              name="conformidadCliente"
              checked={actaConformidad.conformidadCliente}
              onChange={(e) => handleActaConformidadChange("conformidadCliente", e.target.checked)}
            />
            <Label htmlFor="conformidadCliente">Conformidad del Cliente</Label>
          </div>
          <Input
            name="nombreRecepcion"
            value={actaConformidad.nombreRecepcion}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="nombreRecepcion">Nombre de Recepción</Label>
          <Input
            name="telefonoRecepcion"
            value={actaConformidad.telefonoRecepcion}
            onChange={(e) => handleActaConformidadChange(e.target.name, e.target.value)}
          />
          <Label htmlFor="telefonoRecepcion">Teléfono de Recepción</Label>
          <Button onClick={finalizarReclamo}>Finalizar Reclamo</Button>
        </>
      )}
      {reclamo.actaConformidad && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Acta de Conformidad</h3>
          <Card>
            <CardContent className="pt-6">
              <p>
                <strong>Fecha de Solicitud:</strong> {reclamo.actaConformidad.fechaSolicitud}
              </p>
              <p>
                <strong>Fecha de Ingreso:</strong> {reclamo.actaConformidad.fechaIngreso}
              </p>
              <p>
                <strong>Fecha de Visita Acordada:</strong> {reclamo.actaConformidad.fechaVisitaAcordada}
              </p>
              <p>
                <strong>Fecha Acordada Orden de Inspección:</strong>{" "}
                {reclamo.actaConformidad.fechaAcordadaOrdenInspeccion}
              </p>
              <p>
                <strong>Fecha Término OT:</strong> {reclamo.actaConformidad.fechaTerminoOT}
              </p>
              <p>
                <strong>Fecha Término Ejecución:</strong> {reclamo.actaConformidad.fechaTerminoEjecucion}
              </p>
              <p>
                <strong>Responsable:</strong> {reclamo.actaConformidad.responsable}
              </p>
              <p>
                <strong>Solicitudes Solucionadas:</strong> {reclamo.actaConformidad.solicitudesSolucionadas.join(", ")}
              </p>
              <p>
                <strong>Conformidad del Cliente:</strong> {reclamo.actaConformidad.conformidadCliente ? "Sí" : "No"}
              </p>
              <p>
                <strong>Nombre de Recepción:</strong> {reclamo.actaConformidad.nombreRecepcion}
              </p>
              <p>
                <strong>Teléfono de Recepción:</strong> {reclamo.actaConformidad.telefonoRecepcion}
              </p>
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
      {icon}
      <span className="font-medium ml-2">{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  )
}

