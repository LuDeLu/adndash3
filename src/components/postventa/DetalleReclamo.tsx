"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reclamo, ItemInspeccion, OrdenTrabajo, ActaConformidad, EstadoReclamo } from "../../types/postVenta"

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
    responsable: "",
    fechaTrabajo: "",
    horaTrabajo: "",
    tiempoEstimado: "",
    observacionesEjecucion: "",
  })

  const [actaConformidad, setActaConformidad] = useState<ActaConformidad>({
    fechaSolicitud: reclamo.fechaIngreso,
    fechaIngreso: reclamo.fechaIngreso,
    fechaVisitaAcordada: "",
    fechaAcordadaOrdenInspeccion: "",
    fechaTerminoOT: "",
    fechaTerminoEjecucion: "",
    responsable: "",
    solicitudesSolucionadas: [],
    conformidadCliente: false,
    nombreRecepcion: "",
    telefonoRecepcion: "",
  })

  const [mostrarDetallesInspeccion, setMostrarDetallesInspeccion] = useState(false)
  const [mostrarDetallesActaConformidad, setMostrarDetallesActaConformidad] = useState(false)

  const handleInspeccionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInspeccion({ ...inspeccion, [e.target.name]: e.target.value })
  }

  const handleOrdenTrabajoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrdenTrabajo({ ...ordenTrabajo, [e.target.name]: e.target.value })
  }

  const handleActaConformidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActaConformidad({ ...actaConformidad, [e.target.name]: e.target.value })
  }

  const agregarInspeccion = () => {
    const nuevaInspeccion = reclamo.inspeccion
      ? { ...reclamo.inspeccion, items: [...reclamo.inspeccion.items, inspeccion] }
      : { items: [inspeccion], observaciones: "", fechaProgramada: "" }

    const reclamoActualizado: Reclamo = {
      ...reclamo,
      inspeccion: nuevaInspeccion,
      estado: "En Inspección" as EstadoReclamo,
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
      estado: "En Reparación" as EstadoReclamo,
    }
    onActualizarReclamo(reclamoActualizado)
    // Limpiar el formulario después de agregar la orden de trabajo
    setOrdenTrabajo({
      responsable: "",
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
      estado: "Solucionado" as EstadoReclamo,
    }
    onActualizarReclamo(reclamoActualizado)
  }

  return (
    <Card className="mt-8 bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Detalle del Reclamo - Ticket: {reclamo.ticket}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Información del Reclamo</h3>
            <p>
              <strong>Cliente:</strong> {reclamo.cliente}
            </p>
            <p>
              <strong>Teléfono:</strong> {reclamo.telefono}
            </p>
            <p>
              <strong>Edificio:</strong> {reclamo.edificio}
            </p>
            <p>
              <strong>UF:</strong> {reclamo.unidadFuncional}
            </p>
            <p>
              <strong>Detalle:</strong> {reclamo.detalle}
            </p>
            <p>
              <strong>Comentario:</strong> {reclamo.comentario}
            </p>
            <p>
              <strong>Estado:</strong> {reclamo.estado}
            </p>
          </div>

          {reclamo.estado === "Ingresado" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Orden de Inspección</h3>
              <div className="space-y-4">
                <Input
                  name="ambiente"
                  placeholder="Ambiente"
                  value={inspeccion.ambiente}
                  onChange={handleInspeccionChange}
                  className="bg-input text-foreground"
                />
                <Input
                  name="lugar"
                  placeholder="Lugar"
                  value={inspeccion.lugar}
                  onChange={handleInspeccionChange}
                  className="bg-input text-foreground"
                />
                <Input
                  name="item"
                  placeholder="Ítem"
                  value={inspeccion.item}
                  onChange={handleInspeccionChange}
                  className="bg-input text-foreground"
                />
                <Input
                  name="descripcionCliente"
                  placeholder="Descripción del Cliente"
                  value={inspeccion.descripcionCliente}
                  onChange={handleInspeccionChange}
                  className="bg-input text-foreground"
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
              </div>
            </div>
          )}

          {reclamo.estado !== "Ingresado" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Estado de Inspección</h3>
              <Button onClick={() => setMostrarDetallesInspeccion(!mostrarDetallesInspeccion)}>
                {mostrarDetallesInspeccion ? "Ocultar Detalles" : "Ver Detalles"}
              </Button>
              {mostrarDetallesInspeccion && reclamo.inspeccion && (
                <div className="mt-4 space-y-2">
                  {reclamo.inspeccion.items.map((item, index) => (
                    <div key={index} className="border p-2 rounded">
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
                    </div>
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
          )}

          {reclamo.estado === "En Inspección" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Orden de Trabajo</h3>
              <div className="space-y-4">
                <Input
                  name="responsable"
                  placeholder="Responsable"
                  value={ordenTrabajo.responsable}
                  onChange={handleOrdenTrabajoChange}
                  className="bg-input text-foreground"
                />
                <Input
                  name="fechaTrabajo"
                  type="date"
                  placeholder="Fecha de Trabajo"
                  value={ordenTrabajo.fechaTrabajo}
                  onChange={handleOrdenTrabajoChange}
                  className="bg-input text-foreground"
                />
                <Input
                  name="horaTrabajo"
                  type="time"
                  placeholder="Hora de Trabajo"
                  value={ordenTrabajo.horaTrabajo}
                  onChange={handleOrdenTrabajoChange}
                  className="bg-input text-foreground"
                />
                <Input
                  name="tiempoEstimado"
                  placeholder="Tiempo Estimado"
                  value={ordenTrabajo.tiempoEstimado}
                  onChange={handleOrdenTrabajoChange}
                  className="bg-input text-foreground"
                />
                <Textarea
                  name="observacionesEjecucion"
                  placeholder="Observaciones de Ejecución"
                  value={ordenTrabajo.observacionesEjecucion}
                  onChange={handleOrdenTrabajoChange}
                  className="bg-input text-foreground"
                />
                <Button onClick={agregarOrdenTrabajo}>Crear Orden de Trabajo</Button>
              </div>
            </div>
          )}

          {reclamo.estado === "En Reparación" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Acta de Conformidad</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fechaSolicitud" className="block text-sm font-medium text-gray-700">
                    Fecha de Solicitud:
                  </label>
                  <Input
                    id="fechaSolicitud"
                    name="fechaSolicitud"
                    type="date"
                    value={actaConformidad.fechaSolicitud}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="fechaIngreso" className="block text-sm font-medium text-gray-700">
                    Fecha de Ingreso:
                  </label>
                  <Input
                    id="fechaIngreso"
                    name="fechaIngreso"
                    type="date"
                    value={actaConformidad.fechaIngreso}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="fechaVisitaAcordada" className="block text-sm font-medium text-gray-700">
                    Fecha de Visita Acordada:
                  </label>
                  <Input
                    id="fechaVisitaAcordada"
                    name="fechaVisitaAcordada"
                    type="date"
                    value={actaConformidad.fechaVisitaAcordada}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="fechaAcordadaOrdenInspeccion" className="block text-sm font-medium text-gray-700">
                    Fecha Acordada Orden de Inspección:
                  </label>
                  <Input
                    id="fechaAcordadaOrdenInspeccion"
                    name="fechaAcordadaOrdenInspeccion"
                    type="date"
                    value={actaConformidad.fechaAcordadaOrdenInspeccion}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="fechaTerminoOT" className="block text-sm font-medium text-gray-700">
                    Fecha Término OT:
                  </label>
                  <Input
                    id="fechaTerminoOT"
                    name="fechaTerminoOT"
                    type="date"
                    value={actaConformidad.fechaTerminoOT}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="fechaTerminoEjecucion" className="block text-sm font-medium text-gray-700">
                    Fecha Término Ejecución:
                  </label>
                  <Input
                    id="fechaTerminoEjecucion"
                    name="fechaTerminoEjecucion"
                    type="date"
                    value={actaConformidad.fechaTerminoEjecucion}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">
                    Responsable:
                  </label>
                  <Input
                    id="responsable"
                    name="responsable"
                    value={actaConformidad.responsable}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="solicitudesSolucionadas" className="block text-sm font-medium text-gray-700">
                    Solicitudes Solucionadas:
                  </label>
                  <Input
                    id="solicitudesSolucionadas"
                    name="solicitudesSolucionadas"
                    value={actaConformidad.solicitudesSolucionadas.join(", ")}
                    onChange={(e) =>
                      setActaConformidad({ ...actaConformidad, solicitudesSolucionadas: e.target.value.split(", ") })
                    }
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="conformidadCliente" className="block text-sm font-medium text-gray-700">
                    Conformidad del Cliente:
                  </label>
                  <input
                    id="conformidadCliente"
                    name="conformidadCliente"
                    type="checkbox"
                    checked={actaConformidad.conformidadCliente}
                    onChange={(e) => setActaConformidad({ ...actaConformidad, conformidadCliente: e.target.checked })}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="nombreRecepcion" className="block text-sm font-medium text-gray-700">
                    Nombre de Recepción:
                  </label>
                  <Input
                    id="nombreRecepcion"
                    name="nombreRecepcion"
                    value={actaConformidad.nombreRecepcion}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <div>
                  <label htmlFor="telefonoRecepcion" className="block text-sm font-medium text-gray-700">
                    Teléfono de Recepción:
                  </label>
                  <Input
                    id="telefonoRecepcion"
                    name="telefonoRecepcion"
                    value={actaConformidad.telefonoRecepcion}
                    onChange={handleActaConformidadChange}
                    className="bg-input text-foreground"
                  />
                </div>
                <Button onClick={finalizarReclamo}>Finalizar Reclamo</Button>
              </div>
            </div>
          )}

          {reclamo.estado === "Solucionado" && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Acta de Conformidad</h3>
              <Button onClick={() => setMostrarDetallesActaConformidad(!mostrarDetallesActaConformidad)}>
                {mostrarDetallesActaConformidad ? "Ocultar Detalles" : "Ver Detalles"}
              </Button>
              {mostrarDetallesActaConformidad && reclamo.actaConformidad && (
                <div className="mt-4 space-y-2">
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
                    <strong>Solicitudes Solucionadas:</strong>{" "}
                    {reclamo.actaConformidad.solicitudesSolucionadas.join(", ")}
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
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

