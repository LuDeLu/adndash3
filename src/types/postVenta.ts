export type EstadoReclamo = "Ingresado" | "En Inspección" | "En Reparación" | "Solucionado" | "No Corresponde"

export type ItemInspeccion = {
  ambiente: string
  lugar: string
  item: string
  descripcionCliente: string
  resultado: "Corresponde" | "No Corresponde" | "Re Inspección" | "Solucionado en Visita"
}

export type OrdenTrabajo = {
  responsable: string
  fechaTrabajo: string
  horaTrabajo: string
  tiempoEstimado: string
  observacionesEjecucion: string
}

export type ActaConformidad = {
  fechaSolicitud: string
  fechaIngreso: string
  fechaVisitaAcordada: string
  fechaAcordadaOrdenInspeccion: string
  fechaTerminoOT: string
  fechaTerminoEjecucion: string
  responsable: string
  solicitudesSolucionadas: string[]
  conformidadCliente: boolean
  nombreRecepcion: string
  telefonoRecepcion: string
}

export type Reclamo = {
  ticket: string
  cliente: string
  telefono: string
  edificio: string
  unidadFuncional: string
  fechaIngreso: string
  fechaVisita?: string
  detalle: string
  comentario: string
  estado: EstadoReclamo
  inspeccion?: OrdenInspeccion
  ordenTrabajo?: OrdenTrabajo
  actaConformidad?: ActaConformidad
}

export type OrdenInspeccion = {
  items: ItemInspeccion[]
  observaciones: string
  fechaProgramada: string
}

