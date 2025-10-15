export type TipoOcupante = "Inquilino" | "Propietario"
export type EstadoReclamo = "Ingresado" | "En Proceso" | "Solucionado" | "No Corresponde"
export type ResultadoInspeccion = "Corresponde" | "No Corresponde" | "Re Inspección" | "Solucionado en Visita"
export type Urgencia = "Baja" | "Media" | "Alta"

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

export interface CierreTicket {
  fechaCierre: string
  tiempoResolucion: number // en días
  proveedorResolvio: string
  costo: number
}

export interface Reclamo {
  id: string | number
  ticket: string
  fechaCreacion: string
  cliente: string
  telefono: string
  edificio: string
  unidadFuncional: string
  tipoOcupante: TipoOcupante
  nombreInquilino?: string
  fechaPosesion?: string
  ubicacionAfectada?: string
  rubro?: string
  proveedor?: string
  urgencia?: Urgencia
  fotos?: string[] // URLs de fotos/videos
  fechaIngreso: string
  fechaVisita?: string
  horaVisita?: string
  detalle: string
  detalles?: string[]
  comentario?: string
  notas?: string
  estado: EstadoReclamo
  inspeccion?: Inspeccion
  ordenTrabajo?: OrdenTrabajo
  actaConformidad?: ActaConformidad
  cierre?: CierreTicket
  fechaCierre?: string
  tiempoResolucion?: number
  proveedorResolvio?: string
  costo?: number
}

export interface EstadisticasPostVenta {
  porEstado: {
    estado: EstadoReclamo
    cantidad: number
  }[]
  porRubro: {
    rubro: string
    cantidad: number
  }[]
  porProveedor: {
    proveedor: string
    cantidad: number
  }[]
  costoPorTicket: {
    ticket: string
    costo: number
  }[]
  costoTotal: number
  tiempoPromedioResolucion: number
}
