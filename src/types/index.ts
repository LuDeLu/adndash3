export type Proyecto = {
    id: string
    nombre: string
    progreso: number
    fechaInicio: string
    fechaFin: string
    detalles: {
      cimentacion: number
      estructura: number
      interior: number
      exterior: number
    }
    videoEnVivo: string
  }
  
  export type Tarea = {
    id: string
    nombre: string
    inicio: Date
    fin: Date
    progreso: number
    responsable: string
    estado: string
  }
  
  export type TodoItem = {
    id: string
    texto: string
    completado: boolean
  }
  
  export type Notificacion = {
    id: string
    mensaje: string
    tipo: "plazo" | "retraso" | "hito"
    fecha: Date
  }
  
  export type Documento = {
    id: string
    nombre: string
    tipo: string
    fechaSubida: Date
    url: string
  }
  
  export type Informe = {
    id: string
    fecha: string
    titulo: string
    tareasCompletadas: string
    porcentajeProgreso: string
    cronogramaActualizado: string
    notasAdicionales: string
    problemas: string
    solucionesPropuestas: string
    materialUtilizado: string
    horasTrabajadas: string
    climaCondiciones: string
    usuario: string
  }
  
  