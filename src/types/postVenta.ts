export type TipoOcupante = "Inquilino" | "Propietario"
export type EstadoReclamo = "Ingresado" | "En Inspección" | "En Reparación" | "Solucionado" | "No Corresponde"
export type ResultadoInspeccion = "Corresponde" | "No Corresponde" | "Re Inspección" | "Solucionado en Visita"

export interface ItemInspeccion {
  ambiente: string
  lugar: string
  item: string
  descripcionCliente: string
  resultado: ResultadoInspeccion
}

export interface Inspeccion {
  items: ItemInspeccion[]
  observaciones: string
  fechaProgramada: string
}

export interface OrdenTrabajo {
  responsable: string
  fechaTrabajo: string
  horaTrabajo: string
  tiempoEstimado: string
  observacionesEjecucion: string
}

export interface ActaConformidad {
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

export interface Reclamo {
  id: string | number
  ticket: string
  cliente: string
  telefono: string
  edificio: string
  unidadFuncional: string
  tipoOcupante: TipoOcupante
  fechaIngreso: string
  fechaVisita?: string
  horaVisita?: string
  detalle: string
  detalles?: string[] // Campo adicional para múltiples detalles
  comentario?: string
  estado: EstadoReclamo
  inspeccion?: Inspeccion
  ordenTrabajo?: OrdenTrabajo
  actaConformidad?: ActaConformidad
}

