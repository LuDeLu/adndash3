/**
 * Crea una nueva notificación en el servidor
 * @param userId ID del usuario destinatario
 * @param message Mensaje de la notificación
 * @param type Tipo de notificación (info, warning, success, error)
 * @param module Módulo relacionado con la notificación
 * @param options Opciones adicionales
 * @returns ID de la notificación creada
 */
export async function createNotification(
    userId: string | number,
    message: string,
    type: "info" | "warning" | "success" | "error",
    module: string,
    options?: {
      link?: string
      priority?: "low" | "medium" | "high"
      actionable?: boolean
      actions?: Array<{
        type: "approve" | "reject" | "view" | "custom"
        label: string
        action?: string
      }>
      metadata?: Record<string, any>
      expiresAt?: Date
    },
  ) {
    try {
      const response = await fetch("http://localhost:3001/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId,
          message,
          type,
          module,
          link: options?.link,
          priority: options?.priority || "medium",
          actionable: options?.actionable || false,
          actions: options?.actions ? JSON.stringify(options.actions) : undefined,
          metadata: options?.metadata ? JSON.stringify(options.metadata) : undefined,
          expiresAt: options?.expiresAt?.toISOString(),
        }),
      })
  
      if (!response.ok) {
        throw new Error("Error creating notification")
      }
  
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error("Error creating notification:", error)
      throw error
    }
  }
  
  /**
   * Crea una notificación para todos los usuarios con un rol específico
   * @param roleId ID del rol
   * @param message Mensaje de la notificación
   * @param type Tipo de notificación
   * @param module Módulo relacionado
   * @param options Opciones adicionales
   * @returns Número de notificaciones creadas
   */
  export async function createNotificationForRole(
    roleId: string | number,
    message: string,
    type: "info" | "warning" | "success" | "error",
    module: string,
    options?: {
      link?: string
      priority?: "low" | "medium" | "high"
      actionable?: boolean
      actions?: Array<{
        type: "approve" | "reject" | "view" | "custom"
        label: string
        action?: string
      }>
      metadata?: Record<string, any>
      expiresAt?: Date
    },
  ) {
    try {
      const response = await fetch("http://localhost:3001/api/notifications/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          roleId,
          message,
          type,
          module,
          link: options?.link,
          priority: options?.priority || "medium",
          actionable: options?.actionable || false,
          actions: options?.actions ? JSON.stringify(options.actions) : undefined,
          metadata: options?.metadata ? JSON.stringify(options.metadata) : undefined,
          expiresAt: options?.expiresAt?.toISOString(),
        }),
      })
  
      if (!response.ok) {
        throw new Error("Error creating notifications for role")
      }
  
      const data = await response.json()
      return data.count
    } catch (error) {
      console.error("Error creating notifications for role:", error)
      throw error
    }
  }
  
  /**
   * Genera notificaciones automáticas basadas en eventos del sistema
   * @param event Tipo de evento
   * @param data Datos relacionados con el evento
   */
  export async function generateSystemNotification(
    event:
      | "cliente_nuevo"
      | "cliente_actualizado"
      | "proyecto_actualizado"
      | "reclamo_nuevo"
      | "reclamo_actualizado"
      | "visita_programada"
      | "tarea_vencida"
      | "documento_nuevo",
    data: any,
  ) {
    try {
      // Configuración de notificaciones según el tipo de evento
      let notificationConfig: {
        message: string
        type: "info" | "warning" | "success" | "error"
        module: string
        roleId?: number
        userId?: number
        priority: "low" | "medium" | "high"
        link?: string
        actionable?: boolean
        actions?: Array<any>
      }
  
      switch (event) {
        case "cliente_nuevo":
          notificationConfig = {
            message: `Nuevo cliente registrado: ${data.nombre} ${data.apellido}`,
            type: "info",
            module: "clientes",
            roleId: 4, // ID del rol comercial
            priority: "medium",
            link: `/clientes?id=${data.id}`,
          }
          break
  
        case "reclamo_nuevo":
          notificationConfig = {
            message: `Nuevo reclamo: ${data.ticket} - ${data.cliente}`,
            type: "warning",
            module: "postventa",
            roleId: 7, // ID del rol postventa
            priority: "high",
            link: `/postventa?id=${data.id}`,
            actionable: true,
            actions: [
              {
                type: "view",
                label: "Ver detalles",
              },
            ],
          }
          break
  
        case "reclamo_actualizado":
          notificationConfig = {
            message: `Reclamo actualizado: ${data.ticket} - Estado: ${data.estado}`,
            type: "info",
            module: "postventa",
            roleId: 7, // ID del rol postventa
            priority: "medium",
            link: `/postventa?id=${data.id}`,
          }
          break
  
        case "visita_programada":
          notificationConfig = {
            message: `Visita programada: ${data.cliente} - ${new Date(data.fechaVisita).toLocaleDateString()}`,
            type: "info",
            module: "calendario",
            roleId: 7, // ID del rol postventa
            priority: "medium",
            link: `/calendario?fecha=${data.fechaVisita}`,
          }
          break
  
        case "tarea_vencida":
          notificationConfig = {
            message: `Tarea vencida: ${data.name}`,
            type: "error",
            module: "obras",
            roleId: 6, // ID del rol obras
            priority: "high",
            link: `/obras/tareas?id=${data.id}`,
            actionable: true,
            actions: [
              {
                type: "view",
                label: "Ver tarea",
              },
            ],
          }
          break
  
        case "documento_nuevo":
          notificationConfig = {
            message: `Nuevo documento: ${data.name}`,
            type: "info",
            module: "documentos",
            roleId: 8, // ID del rol arquitectura
            priority: "low",
            link: `/documentos?id=${data.id}`,
          }
          break
  
        default:
          return // No hacer nada si el evento no está soportado
      }
  
      // Crear la notificación para el rol o usuario específico
      if (notificationConfig.roleId) {
        await createNotificationForRole(
          notificationConfig.roleId,
          notificationConfig.message,
          notificationConfig.type,
          notificationConfig.module,
          {
            link: notificationConfig.link,
            priority: notificationConfig.priority,
            actionable: notificationConfig.actionable,
            actions: notificationConfig.actions,
          },
        )
      } else if (notificationConfig.userId) {
        await createNotification(
          notificationConfig.userId,
          notificationConfig.message,
          notificationConfig.type,
          notificationConfig.module,
          {
            link: notificationConfig.link,
            priority: notificationConfig.priority,
            actionable: notificationConfig.actionable,
            actions: notificationConfig.actions,
          },
        )
      }
    } catch (error) {
      console.error("Error generating system notification:", error)
    }
  }
  
  /**
   * Verifica eventos programados y genera notificaciones automáticas
   * Esta función debe ejecutarse periódicamente (por ejemplo, cada hora)
   */
  export async function checkScheduledEvents() {
    try {
      // 1. Verificar clientes que necesitan seguimiento
      const clientesResponse = await fetch("http://localhost:3001/api/clientes/seguimiento", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
  
      if (clientesResponse.ok) {
        const clientesSeguimiento = await clientesResponse.json()
  
        for (const cliente of clientesSeguimiento) {
          await createNotificationForRole(
            4, // ID del rol comercial
            `Seguimiento pendiente: ${cliente.nombre} ${cliente.apellido}`,
            "warning",
            "clientes",
            {
              link: `/clientes?id=${cliente.id}`,
              priority: "medium",
            },
          )
        }
      }
  
      // 2. Verificar reclamos sin atender
      const reclamosResponse = await fetch("http://localhost:3001/api/postventa/pendientes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
  
      if (reclamosResponse.ok) {
        const reclamosPendientes = await reclamosResponse.json()
  
        for (const reclamo of reclamosPendientes) {
          // Solo notificar si han pasado más de 2 días desde su creación
          const fechaIngreso = new Date(reclamo.fechaIngreso)
          const diasTranscurridos = Math.floor((Date.now() - fechaIngreso.getTime()) / (1000 * 60 * 60 * 24))
  
          if (diasTranscurridos >= 2) {
            await createNotificationForRole(
              7, // ID del rol postventa
              `Reclamo sin atender: ${reclamo.ticket} - ${reclamo.cliente} (${diasTranscurridos} días)`,
              "error",
              "postventa",
              {
                link: `/postventa?id=${reclamo.id}`,
                priority: "high",
                actionable: true,
                actions: [
                  {
                    type: "view",
                    label: "Atender reclamo",
                  },
                ],
              },
            )
          }
        }
      }
  
      // 3. Verificar visitas programadas para mañana
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split("T")[0]
  
      const visitasResponse = await fetch(
        `http://localhost:3001/api/postventa/visitas?fecha=${tomorrowStr}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
  
      if (visitasResponse.ok) {
        const visitasMañana = await visitasResponse.json()
  
        for (const visita of visitasMañana) {
          await createNotificationForRole(
            7, // ID del rol postventa
            `Visita programada para mañana: ${visita.cliente} - ${visita.unidadFuncional}`,
            "info",
            "calendario",
            {
              link: `/postventa?id=${visita.id}`,
              priority: "high",
            },
          )
        }
      }
    } catch (error) {
      console.error("Error checking scheduled events:", error)
    }
  }
  
  /**
   * Hook personalizado para usar el sistema de notificaciones en cualquier componente
   */
  export function useNotifications() {
    return {
      createNotification,
      createNotificationForRole,
      generateSystemNotification,
      checkScheduledEvents,
    }
  }
