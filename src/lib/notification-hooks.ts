"use client"

import { useEffect } from "react"
import { useNotifications } from "./notification-utils"

/**
 * Hook para generar notificaciones automáticas cuando se crea un nuevo cliente
 * @param cliente Datos del cliente
 * @param isNew Indica si es un cliente nuevo o una actualización
 */
export function useClienteNotifications(cliente: any, isNew = true) {
  const { generateSystemNotification } = useNotifications()

  useEffect(() => {
    if (cliente && Object.keys(cliente).length > 0) {
      generateSystemNotification(isNew ? "cliente_nuevo" : "cliente_actualizado", cliente)
    }
  }, [cliente, isNew, generateSystemNotification])
}

/**
 * Hook para generar notificaciones automáticas cuando se crea o actualiza un reclamo
 * @param reclamo Datos del reclamo
 * @param isNew Indica si es un reclamo nuevo o una actualización
 */
export function useReclamoNotifications(reclamo: any, isNew = true) {
  const { generateSystemNotification } = useNotifications()

  useEffect(() => {
    if (reclamo && Object.keys(reclamo).length > 0) {
      generateSystemNotification(isNew ? "reclamo_nuevo" : "reclamo_actualizado", reclamo)
    }
  }, [reclamo, isNew, generateSystemNotification])
}

/**
 * Hook para generar notificaciones automáticas cuando se programa una visita
 * @param visita Datos de la visita
 */
export function useVisitaNotifications(visita: any) {
  const { generateSystemNotification } = useNotifications()

  useEffect(() => {
    if (visita && visita.fechaVisita) {
      generateSystemNotification("visita_programada", visita)
    }
  }, [visita, generateSystemNotification])
}

/**
 * Hook para verificar eventos programados periódicamente
 * @param interval Intervalo en milisegundos (por defecto 1 hora)
 */
export function useScheduledNotifications(interval = 3600000) {
  const { checkScheduledEvents } = useNotifications()

  useEffect(() => {
    // Verificar eventos al montar el componente
    checkScheduledEvents()

    // Configurar verificación periódica
    const intervalId = setInterval(checkScheduledEvents, interval)

    // Limpiar intervalo al desmontar
    return () => clearInterval(intervalId)
  }, [checkScheduledEvents, interval])
}
