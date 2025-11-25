// Tipos para el sistema de notificaciones

export type NotificationType = "info" | "warning" | "success" | "error"

export type NotificationModule =
  | "clientes"
  | "proyectos"
  | "calendario"
  | "obras"
  | "postventa"
  | "sistema"
  | "estadisticas"
  | "documentos"

export type NotificationPriority = "low" | "medium" | "high"

export type NotificationAction = {
  type: "approve" | "reject" | "view" | "custom"
  label: string
  action?: string
}

export type Notification = {
  id: string
  message: string
  timestamp: string
  read: boolean
  type: NotificationType
  link?: string
  module: NotificationModule
  priority?: NotificationPriority
  actionable?: boolean
  actions?: NotificationAction[]
  metadata?: Record<string, any>
  expiresAt?: string
}

export type NotificationPreferences = {
  enableAll: boolean
  modules: Record<string, boolean>
  types: Record<string, boolean>
  emailNotifications: boolean
  desktopNotifications: boolean
  soundEnabled: boolean
  autoMarkAsRead: boolean
  groupSimilar: boolean
  showBadgeCount: boolean
}

export type NotificationEvent =
  | "cliente_nuevo"
  | "cliente_actualizado"
  | "proyecto_actualizado"
  | "reclamo_nuevo"
  | "reclamo_actualizado"
  | "visita_programada"
  | "tarea_vencida"
  | "documento_nuevo"
