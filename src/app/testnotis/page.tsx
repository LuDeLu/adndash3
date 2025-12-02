"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Info, AlertTriangle, Zap, Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Notyf } from "notyf"

const notyf = typeof window !== "undefined" ? new Notyf() : null

interface TestNotificationConfig {
  name: string
  type: "info" | "warning" | "success" | "error"
  module: string
  priority: "low" | "medium" | "high" | "critical"
  count: number
  icon: React.ReactNode
}

const TEST_NOTIFICATIONS: TestNotificationConfig[] = [
  {
    name: "Notificación de Información",
    type: "info",
    module: "sistema",
    priority: "low",
    count: 3,
    icon: <Info className="h-5 w-5" />,
  },
  {
    name: "Notificación de Advertencia",
    type: "warning",
    module: "obras",
    priority: "medium",
    count: 2,
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    name: "Notificación de Éxito",
    type: "success",
    module: "proyectos",
    priority: "low",
    count: 3,
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    name: "Notificación de Error",
    type: "error",
    module: "postventa",
    priority: "high",
    count: 2,
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    name: "Notificación Crítica (Parpadeante)",
    type: "error",
    module: "calendario",
    priority: "critical",
    count: 1,
    icon: <Zap className="h-5 w-5" />,
  },
]

const MESSAGES = {
  info: [
    "Se ha actualizado la configuración del sistema",
    "Nueva versión disponible para descargar",
    "Recordatorio: Reunión de equipo en 30 minutos",
  ],
  warning: [
    "Progreso en retraso: Solo 60% completado",
    "Atención requerida en el proyecto Dome Palermo",
    "Revisar documentación pendiente",
  ],
  success: ["Proyecto completado exitosamente", "Cliente aprobó diseño final", "Documentos descargados correctamente"],
  error: [
    "Error al conectar con la base de datos",
    "Falló la carga de archivos",
    "Permiso denegado para acceder al recurso",
  ],
  critical: ["¡ALERTA CRÍTICA! Sistema requiere atención inmediata", "Fallo crítico detectado en producción"],
}

const MODULE_ICONS: Record<string, string> = {
  clientes: "👥",
  proyectos: "🏢",
  calendario: "📅",
  obras: "🏗️",
  postventa: "🔧",
  sistema: "⚙️",
  estadisticas: "📊",
  documentos: "📄",
}

export default function TestNotificationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<TestNotificationConfig | null>(null)

  const generateTestNotifications = useCallback(async (config: TestNotificationConfig) => {
    try {
      setLoading(true)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

      const messages = MESSAGES[config.type as keyof typeof MESSAGES] || MESSAGES.info

      for (let i = 0; i < config.count; i++) {
        const message = messages[i % messages.length]

        const response = await fetch("http://localhost:3001/api/notifications", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `[PRUEBA #${i + 1}] ${message}`,
            type: config.type,
            module: config.module,
            priority: config.priority,
            link: `/proyectos`,
          }),
        })

        if (!response.ok) {
          throw new Error(`Error creating notification ${i + 1}`)
        }
      }

      notyf?.success(`✅ ${config.count} notificaciones de prueba creadas exitosamente`)
      setSelectedNotification(config)
    } catch (error) {
      console.error("Error creating test notifications:", error)
      notyf?.error("❌ Error al crear notificaciones de prueba")
    } finally {
      setLoading(false)
    }
  }, [])

  const generateAllNotifications = useCallback(async () => {
    try {
      setLoading(true)

      for (const config of TEST_NOTIFICATIONS) {
        const messages = MESSAGES[config.type as keyof typeof MESSAGES] || MESSAGES.info
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""

        for (let i = 0; i < config.count; i++) {
          const message = messages[i % messages.length]

          const response = await fetch("http://localhost:3001/api/notifications", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `[PRUEBA COMPLETA #${i + 1}] ${message}`,
              type: config.type,
              module: config.module,
              priority: config.priority,
              link: `/proyectos`,
            }),
          })

          if (!response.ok) {
            throw new Error(`Error en notificación: ${config.name}`)
          }
        }
      }

      const totalCount = TEST_NOTIFICATIONS.reduce((sum, config) => sum + config.count, 0)
      notyf?.success(`✅ ${totalCount} notificaciones de prueba creadas exitosamente`)
    } catch (error) {
      console.error("Error creating all test notifications:", error)
      notyf?.error("❌ Error al crear notificaciones de prueba")
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                Generador de Notificaciones de Prueba
              </h1>
              <p className="text-muted-foreground mt-2">
                Crea notificaciones de ejemplo para probar la funcionalidad del sistema
              </p>
            </div>
            <Button variant="outline" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-r from-blue-500/10 to-emerald-500/10">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Genera un conjunto completo de notificaciones de prueba</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              onClick={generateAllNotifications}
              disabled={loading}
              size="lg"
              className="gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Generar Todas las Notificaciones de Prueba
            </Button>
            <Button variant="outline" onClick={() => router.push("/notificaciones")} size="lg">
              Ver Centro de Notificaciones →
            </Button>
          </CardContent>
        </Card>

        {/* Notification Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEST_NOTIFICATIONS.map((config) => (
            <Card
              key={config.name}
              className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                selectedNotification?.name === config.name
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`p-2 rounded-lg ${
                      config.type === "info"
                        ? "bg-blue-100 text-blue-600"
                        : config.type === "warning"
                          ? "bg-yellow-100 text-yellow-600"
                          : config.type === "success"
                            ? "bg-green-100 text-green-600"
                            : config.type === "error"
                              ? "bg-red-100 text-red-600"
                              : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {config.icon}
                  </div>
                  <Badge variant="outline">{config.priority}</Badge>
                </div>
                <CardTitle className="text-base">{config.name}</CardTitle>
                <CardDescription className="text-xs">
                  Módulo: {MODULE_ICONS[config.module]} {config.module}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-muted-foreground mb-1">
                    Cantidad: <span className="font-semibold">{config.count}</span>
                  </p>
                  <p className="text-muted-foreground mb-1">
                    Tipo: <Badge className="capitalize ml-1">{config.type}</Badge>
                  </p>
                </div>
                <Button
                  onClick={() => generateTestNotifications(config)}
                  disabled={loading}
                  className="w-full gap-2 mt-2"
                  variant={selectedNotification?.name === config.name ? "default" : "outline"}
                >
                  {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                  Generar Muestra
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 border-muted">
          <CardHeader>
            <CardTitle className="text-lg">Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">📋 Cómo usar esta página:</h4>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>
                  Haz clic en &quot;Generar Todas las Notificaciones de Prueba&quot; para crear un conjunto completo
                </li>
                <li>O selecciona un tipo específico de notificación para generar solo ese tipo</li>
                <li>Las notificaciones aparecerán en el Centro de Notificaciones</li>
                <li>Puedes filtrar, marcar como leídas o eliminar las notificaciones</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold mb-2">📊 Tipos de Notificaciones:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  🔵 <span className="font-medium">Info</span> - Información general
                </li>
                <li>
                  🟡 <span className="font-medium">Warning</span> - Advertencias
                </li>
                <li>
                  🟢 <span className="font-medium">Success</span> - Operaciones exitosas
                </li>
                <li>
                  🔴 <span className="font-medium">Error</span> - Errores del sistema
                </li>
                <li>
                  ⚡ <span className="font-medium">Critical</span> - Alertas críticas (con efecto parpadeante)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">🎯 Prioridades:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <span className="font-medium">Low</span> - Baja importancia
                </li>
                <li>
                  <span className="font-medium">Medium</span> - Importancia media
                </li>
                <li>
                  <span className="font-medium">High</span> - Alta importancia
                </li>
                <li>
                  <span className="font-medium">Critical</span> - Crítica (requiere acción inmediata)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
