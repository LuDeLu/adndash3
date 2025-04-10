import type { FormData } from "./form-data"

export interface ApprovalSignature {
  aprobado: boolean
  usuario: string
  fecha: string | null
  comentarios: string
}

export interface ApprovalTicket {
  id: string
  ticket_id: string
  title: string
  emprendimiento: string
  unidad_funcional: string
  fecha_creacion: string
  estado: "pendiente" | "aprobado" | "rechazado"
  creador_id: string
  formData: FormData
  aprobaciones: {
    contaduria: ApprovalSignature
    legales: ApprovalSignature
    tesoreria: ApprovalSignature
    gerenciaComercial: ApprovalSignature
    gerencia: ApprovalSignature
    arquitecto: ApprovalSignature
  }
}
