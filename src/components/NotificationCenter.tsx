"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Bell, Check, X, Settings, Archive } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/app/auth/auth-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Notyf } from "notyf"
import { CheckCheck, Filter } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/"

// Types
export type Notification = {
  id: string
  message: string
  timestamp: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
  link?: string
  module: "clientes" | "proyectos" | "calendario" | "obras" | "postventa" | "sistema" | "estadisticas" | "documentos"
  priority?: "low" | "medium" | "high"
  actionable?: boolean
  actions?: {
    type: "approve" | "reject" | "view" | "custom"
    label: string
    action?: string
  }[]
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

// Create Notyf instance once outside component to avoid recreation
const notyf =
  typeof window !== "undefined"
    ? new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
        types: [
          {
            type: "success",
            background: "green",
            icon: false,
          },
          {
            type: "error",
            background: "red",
            icon: false,
          },
          {
            type: "warning",
            background: "orange",
            icon: false,
          },
          {
            type: "info",
            background: "blue",
            icon: false,
          },
        ],
      })
    : null

// Module name mapping
const MODULE_NAMES: Record<string, string> = {
  clientes: "Clientes",
  proyectos: "Proyectos",
  calendario: "Calendario",
  obras: "Obras",
  postventa: "Post-venta",
  sistema: "Sistema",
  estadisticas: "Estadísticas",
  documentos: "Documentos",
}

// Module icons mapping
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

// Define type-specific colors for better styling
const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  info: {
    bg: "bg-blue-500/10 hover:bg-blue-500/20",
    border: "border-l-blue-500",
    text: "text-blue-400",
  },
  warning: {
    bg: "bg-yellow-500/10 hover:bg-yellow-500/20",
    border: "border-l-yellow-500",
    text: "text-yellow-400",
  },
  success: {
    bg: "bg-green-500/10 hover:bg-green-500/20",
    border: "border-l-green-500",
    text: "text-green-400",
  },
  error: {
    bg: "bg-red-500/10 hover:bg-red-500/20",
    border: "border-l-red-500",
    text: "text-red-400",
  },
}

// Default preferences
const DEFAULT_PREFERENCES: NotificationPreferences = {
  enableAll: true,
  modules: {
    clientes: true,
    proyectos: true,
    calendario: true,
    obras: true,
    postventa: true,
    sistema: true,
    estadisticas: true,
    documentos: true,
  },
  types: {
    info: true,
    warning: true,
    success: true,
    error: true,
  },
  emailNotifications: false,
  desktopNotifications: true,
  soundEnabled: false,
  autoMarkAsRead: false,
  groupSimilar: true,
  showBadgeCount: true,
}

export default function NotificationCenter() {
  const { user } = useAuth()
  const router = useRouter()
  // Use useRef for polling interval to manage it across renders
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  // Add error state for better user feedback
  const [error, setError] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)

  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set())

  const getAuthToken = useCallback(() => {
    return typeof window !== "undefined" ? localStorage.getItem("token") : ""
  }, [])

  const apiCall = useCallback(
    async <T,>(
      path: string,
      options: {
        method?: "GET" | "POST" | "PATCH" | "DELETE"
        body?: any
      } = {},
    ): Promise<T | null> => {
      try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
          method: options.method || "GET",
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        })

        if (!response.ok) {
          // Extract error message from response if available
          let errorMessage = `API Error: ${response.statusText}`
          try {
            const errorData = await response.json()
            if (errorData.message) {
              errorMessage = errorData.message
            }
          } catch (jsonError) {
            // Ignore if response is not JSON
          }
          throw new Error(errorMessage)
        }

        // Handle cases where the API might return an empty response for certain operations
        if (response.status === 204) {
          // No Content
          return {} as T // Return an empty object or appropriate type for T
        }

        return await response.json()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        console.error(`[v0] API Error on ${path}:`, errorMessage)
        setError(errorMessage) // Set global error state
        return null
      }
    },
    [getAuthToken],
  )

  // Load preferences from localStorage
  const loadPreferences = useCallback(() => {
    if (typeof window === "undefined") return

    const savedPrefs = localStorage.getItem("notificationPreferences")
    if (savedPrefs) {
      try {
        // Merge with existing preferences to avoid losing settings
        setPreferences((prev) => ({
          ...prev,
          ...JSON.parse(savedPrefs),
        }))
      } catch (e) {
        console.error("[v0] Error parsing preferences:", e)
      }
    }

    const archivedNotifs = localStorage.getItem("archivedNotifications")
    if (archivedNotifs) {
      try {
        setArchivedIds(new Set(JSON.parse(archivedNotifs)))
      } catch (e) {
        console.error("[v0] Error parsing archived notifications:", e)
      }
    }
  }, [])

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setError(null) // Clear previous errors
      setLoading(true) // Start loading
      const data = await apiCall<any[]>("/api/notifications")

      if (data && Array.isArray(data)) {
        console.log("[v0] Received notifications:", data) // Debug log to verify data is received

        // Transform data from database format to interface format
        const formattedData = data.map((item: any) => ({
          id: item.id.toString(),
          message: item.message,
          timestamp: item.created_at,
          read: item.read === 1 || item.read === true,
          type: item.type || "info",
          link: item.link,
          module: item.module,
          priority: item.priority || "medium",
          actionable: item.actionable === 1 || item.actionable === true,
          actions: item.actions
            ? typeof item.actions === "string"
              ? JSON.parse(item.actions)
              : item.actions
            : undefined,
          metadata: item.metadata
            ? typeof item.metadata === "string"
              ? JSON.parse(item.metadata)
              : item.metadata
            : undefined,
          expiresAt: item.expires_at,
        }))

        console.log("[v0] Formatted notifications:", formattedData) // Debug log after transformation
        setNotifications(formattedData)
        setUnreadCount(formattedData.filter((n: Notification) => !n.read).length)

        // Request permission for desktop notifications if enabled
        if (
          preferences.desktopNotifications &&
          typeof window !== "undefined" &&
          Notification.permission === "default"
        ) {
          Notification.requestPermission()
        }
      } else {
        console.log("[v0] No data or invalid format received:", data)
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("[v0] Error in fetchNotifications:", error)
    } finally {
      setLoading(false)
    }
  }, [user, preferences.desktopNotifications, apiCall])

  // Group similar notifications
  const groupedNotifications = useMemo(() => {
    if (!preferences.groupSimilar) return {}

    const grouped: Record<string, Notification[]> = {}

    notifications.forEach((notification) => {
      // Create a key based on module and type
      const key = `${notification.module}-${notification.type}`

      if (!grouped[key]) {
        grouped[key] = []
      }

      grouped[key].push(notification)
    })

    return grouped
  }, [notifications, preferences.groupSimilar])

  // Mark notification as read
  const markAsRead = useCallback(
    async (id: string) => {
      try {
        // Use the generic apiCall helper
        const success = await apiCall(`/api/notifications/${id}/read`, { method: "PATCH" })
        if (success) {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
          setUnreadCount((prev) => Math.max(0, prev - 1))
        }
      } catch (err) {
        // Error logged by apiCall
      }
    },
    [apiCall],
  )

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      // Use the generic apiCall helper
      const success = await apiCall("/api/notifications/read-all", { method: "PATCH" })
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
        notyf?.success("Notificaciones marcadas como leídas")
      }
    } catch (err) {
      // Error logged by apiCall
    }
  }, [apiCall])

  // Delete notification
  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        // Use the generic apiCall helper
        const success = await apiCall(`/api/notifications/${id}`, { method: "DELETE" })
        if (success) {
          setNotifications((prev) => {
            const updated = prev.filter((n) => n.id !== id)
            // Recalculate unread count correctly
            setUnreadCount(updated.filter((n) => !n.read).length)
            return updated
          })
          notyf?.success("Notificación eliminada")
        }
      } catch (err) {
        console.error("[v0] Error deleting notification:", err)
        notyf?.error("Error al eliminar notificación")
      }
    },
    [apiCall],
  )

  // Execute notification action
  const executeAction = useCallback(
    async (notification: Notification, action: any) => {
      // Mark as read when executing an action
      if (!notification.read) {
        await markAsRead(notification.id)
      }

      // Navigate if there's a link
      if (notification.link) {
        router.push(notification.link)
        setIsOpen(false)
      }

      // Execute specific action based on type
      switch (action.type) {
        case "approve":
          // Logic for approval
          notyf?.success("Solicitud aprobada correctamente")
          break
        case "reject":
          // Logic for rejection
          notyf?.error("Solicitud rechazada")
          break
        case "view":
          break
      }
    },
    [markAsRead, router],
  )

  // Filter notifications based on active tab
  const filteredNotificationsList = useMemo(() => {
    return notifications.filter((notification) => {
      // Don't show archived notifications
      if (archivedIds.has(notification.id)) return false

      // First check if the module is enabled in preferences
      if (!preferences.modules[notification.module]) {
        return false
      }

      // Then check if the type is enabled
      if (!preferences.types[notification.type]) {
        return false
      }

      // Finally apply tab filter
      if (activeFilter === "all") return true
      if (activeFilter === "unread") return !notification.read
      if (activeFilter === "high") return notification.priority === "high"
      return notification.module === activeFilter
    })
  }, [notifications, preferences.modules, preferences.types, activeFilter, archivedIds])

  // Format relative time (e.g., "5 minutes ago")
  const formatRelativeTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "hace unos segundos"
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`

    // If more than a week, show the date
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }, [])

  // Renamed formatRelativeTime to formatTime for consistency with other date formatting functions
  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return "hace unos segundos"
    if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
    if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`

    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }, [])

  // Show desktop notification
  const showDesktopNotification = useCallback(
    (notification: Notification) => {
      if (!preferences.desktopNotifications || typeof window === "undefined" || Notification.permission !== "granted")
        return

      const title = `ADN Developers - ${MODULE_NAMES[notification.module] || notification.module}`
      const options = {
        body: notification.message,
        icon: "/favicon.ico",
        tag: notification.id,
      }

      const desktopNotif = new Notification(title, options)

      desktopNotif.onclick = () => {
        window.focus()
        if (notification.link) {
          router.push(notification.link)
        }
        markAsRead(notification.id)
      }
    },
    [preferences.desktopNotifications, router, markAsRead],
  )

  // Get notification background color based on type and priority
  const getNotificationBgColor = useCallback((type: string, priority = "medium") => {
    let baseColor = ""

    switch (type) {
      case "info":
        baseColor = "bg-blue-500/10 hover:bg-blue-500/20"
        break
      case "warning":
        baseColor = "bg-yellow-500/10 hover:bg-yellow-500/20"
        break
      case "success":
        baseColor = "bg-green-500/10 hover:bg-green-500/20"
        break
      case "error":
        baseColor = "bg-red-500/10 hover:bg-red-500/20"
        break
      default:
        baseColor = "bg-gray-500/10 hover:bg-gray-500/20"
    }

    // Add additional style for high priority
    if (priority === "high") {
      return `${baseColor} animate-pulse-slow`
    }

    return baseColor
  }, [])

  // Get notification border color based on type
  const getNotificationBorderColor = useCallback((type: string) => {
    switch (type) {
      case "info":
        return "border-l-blue-500"
      case "warning":
        return "border-l-yellow-500"
      case "success":
        return "border-l-green-500"
      case "error":
        return "border-l-red-500"
      default:
        return "border-l-gray-500"
    }
  }, [])

  // Save preferences
  const savePreferences = useCallback(
    (newPrefs: Partial<NotificationPreferences>) => {
      setPreferences((prev) => {
        const updated = { ...prev, ...newPrefs }
        if (typeof window !== "undefined") {
          localStorage.setItem("notificationPreferences", JSON.stringify(updated))
        }
        return updated
      })
    },
    [], // Empty dependency array as it only uses `preferences` from closure
  )

  const archiveNotification = useCallback((id: string) => {
    setArchivedIds((prev) => {
      const updated = new Set(prev)
      updated.add(id)
      if (typeof window !== "undefined") {
        localStorage.setItem("archivedNotifications", JSON.stringify(Array.from(updated)))
      }
      return updated
    })
    // Show confirmation message
    notyf?.success("Notificación archivada")
  }, [])

  // Unarchive notification (not used in current UI, but good to have)
  const unarchiveNotification = useCallback((id: string) => {
    setArchivedIds((prev) => {
      const updated = new Set(prev)
      updated.delete(id)
      if (typeof window !== "undefined") {
        localStorage.setItem("archivedNotifications", JSON.stringify(Array.from(updated)))
      }
      return updated
    })
  }, [])

  // Initialize and set up polling
  useEffect(() => {
    loadPreferences()
    fetchNotifications()

    // Start polling for new notifications with a configurable interval
    pollingIntervalRef.current = setInterval(fetchNotifications, 30000) // Every 30 seconds

    // Cleanup interval on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [fetchNotifications, loadPreferences])

  // Check for new notifications and show desktop notifications
  useEffect(() => {
    if (notifications.length > 0 && preferences.desktopNotifications) {
      // Find new notifications (unread and recent)
      const newNotifications = notifications.filter(
        (n) => !n.read && new Date(n.timestamp).getTime() > Date.now() - 60000, // Less than 1 minute
      )

      // Show desktop notifications for new ones
      newNotifications.forEach((notification) => {
        showDesktopNotification(notification)
      })
    }
  }, [notifications, preferences.desktopNotifications, showDesktopNotification])

  // Automatically mark as read when dropdown opens (if enabled)
  useEffect(() => {
    if (isOpen && preferences.autoMarkAsRead && unreadCount > 0) {
      markAllAsRead()
    }
  }, [isOpen, preferences.autoMarkAsRead, unreadCount, markAllAsRead])

  // Settings panel component
  const SettingsPanel = () => (
    <div className="p-4 space-y-4">
      <h4 className="font-medium text-sm">Configuración de notificaciones</h4>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-all" className="text-sm">
            Habilitar todas las notificaciones
          </Label>
          <Switch
            id="enable-all"
            checked={preferences.enableAll}
            onCheckedChange={(checked) => {
              // If disabled, deactivate all notifications
              const updatedModules = { ...preferences.modules }
              const updatedTypes = { ...preferences.types }

              if (!checked) {
                Object.keys(updatedModules).forEach((key) => {
                  updatedModules[key] = false
                })
                Object.keys(updatedTypes).forEach((key) => {
                  updatedTypes[key] = false
                })
              } else {
                // If enabled, activate all
                Object.keys(updatedModules).forEach((key) => {
                  updatedModules[key] = true
                })
                Object.keys(updatedTypes).forEach((key) => {
                  updatedTypes[key] = true
                })
              }

              savePreferences({
                enableAll: checked,
                modules: updatedModules,
                types: updatedTypes,
              })
            }}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Módulos</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(preferences.modules).map((module) => (
              <div key={module} className="flex items-center space-x-2">
                <Switch
                  id={`module-${module}`}
                  checked={preferences.modules[module]}
                  disabled={!preferences.enableAll}
                  onCheckedChange={(checked) => {
                    const updatedModules = { ...preferences.modules, [module]: checked }
                    savePreferences({ modules: updatedModules })
                  }}
                />
                <Label htmlFor={`module-${module}`} className="text-xs">
                  {MODULE_NAMES[module] || module}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Tipos de notificación</Label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(preferences.types).map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Switch
                  id={`type-${type}`}
                  checked={preferences.types[type]}
                  disabled={!preferences.enableAll}
                  onCheckedChange={(checked) => {
                    const updatedTypes = { ...preferences.types, [type]: checked }
                    savePreferences({ types: updatedTypes })
                  }}
                />
                <Label htmlFor={`type-${type}`} className="text-xs capitalize">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Opciones adicionales</Label>
          <div className="space-y-2">
            {[
              {
                id: "desktop-notif",
                label: "Notificaciones de escritorio",
                checked: preferences.desktopNotifications,
                onChange: (checked: boolean) => {
                  if (checked && typeof window !== "undefined" && Notification.permission !== "granted") {
                    Notification.requestPermission()
                  }
                  savePreferences({ desktopNotifications: checked })
                },
              },
              {
                id: "email-notif",
                label: "Notificaciones por email",
                checked: preferences.emailNotifications,
                onChange: (checked: boolean) => savePreferences({ emailNotifications: checked }),
              },
              {
                id: "sound-enabled",
                label: "Sonidos de notificación",
                checked: preferences.soundEnabled,
                onChange: (checked: boolean) => savePreferences({ soundEnabled: checked }),
              },
              {
                id: "auto-mark-read",
                label: "Marcar como leídas automáticamente",
                checked: preferences.autoMarkAsRead,
                onChange: (checked: boolean) => savePreferences({ autoMarkAsRead: checked }),
              },
              {
                id: "group-similar",
                label: "Agrupar notificaciones similares",
                checked: preferences.groupSimilar,
                onChange: (checked: boolean) => savePreferences({ groupSimilar: checked }),
              },
              {
                id: "show-badge",
                label: "Mostrar contador de notificaciones",
                checked: preferences.showBadgeCount,
                onChange: (checked: boolean) => savePreferences({ showBadgeCount: checked }),
              },
            ].map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <Label htmlFor={option.id} className="text-xs">
                  {option.label}
                </Label>
                <Switch
                  id={option.id}
                  checked={option.checked}
                  disabled={!preferences.enableAll}
                  onCheckedChange={option.onChange}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" onClick={() => setShowSettings(false)}>
        Volver a notificaciones
      </Button>
    </div>
  )

  // Notification list component
  const NotificationList = () => {
    if (loading) {
      return (
        <div className="p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                <div className="h-4 w-[250px] bg-gray-300"></div>
              </div>
              <div className="h-3 w-[200px] bg-gray-300"></div>
            </div>
          ))}
        </div>
      )
    }

    if (filteredNotificationsList.length === 0) {
      return (
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
          <Bell className="h-8 w-8 mb-2 opacity-20" />
          <p>No hay notificaciones</p>
          <p className="text-xs mt-1">
            {activeFilter !== "all" ? "Prueba cambiando los filtros" : "Las notificaciones aparecerán aquí"}
          </p>
        </div>
      )
    }

    if (preferences.groupSimilar) {
      // Grouped view
      return (
        <>
          {Object.entries(groupedNotifications)
            .filter(([key, notifs]) => notifs.some((n) => filteredNotificationsList.some((fn) => fn.id === n.id)))
            .map(([key, notifs]) => {
              // Filter only notifications that pass the current filter
              const filteredGroupNotifs = notifs.filter((n) => filteredNotificationsList.some((fn) => fn.id === n.id))

              if (filteredGroupNotifs.length === 0) return null

              // Use the first notification as the group representative
              const firstNotif = filteredGroupNotifs[0]

              return (
                <DropdownMenuGroup key={key}>
                  <DropdownMenuItem
                    className={`flex flex-col items-start p-3 border-b border-l-4 cursor-pointer ${
                      filteredGroupNotifs.some((n) => !n.read) ? "font-medium" : "opacity-70"
                    } ${getNotificationBgColor(firstNotif.type, firstNotif.priority)} ${getNotificationBorderColor(firstNotif.type)}`}
                    onClick={() => {
                      // Mark all as read when clicked
                      filteredGroupNotifs.forEach((n) => {
                        if (!n.read) markAsRead(n.id)
                      })

                      // Navigate to the first link if it exists
                      if (firstNotif.link) {
                        router.push(firstNotif.link)
                        setIsOpen(false)
                      }
                    }}
                  >
                    <div className="w-full">
                      <div className="flex items-center gap-1">
                        <span>{MODULE_ICONS[firstNotif.module] || "📣"}</span>
                        <p className="text-sm">
                          {filteredGroupNotifs.length > 1
                            ? `${filteredGroupNotifs.length} notificaciones de ${MODULE_NAMES[firstNotif.module] || firstNotif.module}`
                            : firstNotif.message}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(firstNotif.timestamp)}
                        </span>
                        <div className="flex items-center gap-1">
                          {filteredGroupNotifs.some((n) => !n.read) && (
                            <Badge variant="outline" className="text-[10px] h-4 px-1">
                              {filteredGroupNotifs.filter((n) => !n.read).length} nuevas
                            </Badge>
                          )}
                          {firstNotif.priority === "high" && (
                            <Badge className="bg-red-500 text-[10px] h-4 px-1">Prioritaria</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )
            })}
        </>
      )
    } else {
      // Normal view (ungrouped)
      return (
        <>
          {filteredNotificationsList.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex flex-col items-start p-3 border-b border-l-4 cursor-pointer ${
                notification.read ? "opacity-70" : "font-medium"
              } ${getNotificationBgColor(notification.type, notification.priority)} ${getNotificationBorderColor(notification.type)}`}
              onClick={() => {
                if (!notification.read) {
                  markAsRead(notification.id)
                }
                if (notification.link) {
                  router.push(notification.link)
                  setIsOpen(false)
                }
              }}
            >
              <div className="w-full">
                <div className="flex items-center gap-1">
                  <span>{MODULE_ICONS[notification.module] || "📣"}</span>
                  <p className="text-sm">{notification.message}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.timestamp)}</span>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        Nueva
                      </Badge>
                    )}
                    {notification.priority === "high" && (
                      <Badge className="bg-red-500 text-[10px] h-4 px-1">Prioritaria</Badge>
                    )}
                  </div>
                </div>

                {/* Notification actions */}
                {notification.actionable && notification.actions && notification.actions.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {notification.actions.map((action, idx) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={action.type === "reject" ? "destructive" : "secondary"}
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          executeAction(notification, action)
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Quick action buttons */}
                <div className="flex justify-end gap-1 mt-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!notification.read) {
                        markAsRead(notification.id)
                      }
                    }}
                    disabled={notification.read}
                    title="Marcar como leída"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      archiveNotification(notification.id)
                      notyf?.success("Notificación archivada")
                    }}
                    title="Archivar notificación"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                    title="Eliminar notificación"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </>
      )
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notificaciones">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && preferences.showBadgeCount && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px]"
              aria-label={`${unreadCount} notificaciones sin leer`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={markAllAsRead}
                      className="h-7 w-7"
                      aria-label="Marcar todas como leídas"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Marcar todas como leídas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className="h-7 w-7"
                    aria-label="Configuración de notificaciones"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Configuración de notificaciones</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {showSettings ? (
          <SettingsPanel />
        ) : (
          <>
            <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="grid grid-cols-4 p-1 m-2">
                <TabsTrigger value="all" className="text-xs">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  No leídas {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
                <TabsTrigger value="high" className="text-xs">
                  Prioritarias
                </TabsTrigger>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TabsTrigger value="" className="text-xs flex items-center gap-1">
                      <Filter className="h-3 w-3" />
                      Filtrar
                    </TabsTrigger>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filtrar por módulo</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.keys(preferences.modules)
                      .filter((module) => preferences.modules[module])
                      .map((module) => (
                        <DropdownMenuItem
                          key={module}
                          onClick={() => setActiveFilter(module)}
                          className="flex items-center gap-2"
                        >
                          <span>{MODULE_ICONS[module] || "📣"}</span>
                          <span>{MODULE_NAMES[module] || module}</span>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TabsList>
            </Tabs>

            <ScrollArea className="h-[350px]">
              <NotificationList />
            </ScrollArea>

            <div className="p-2 border-t text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs w-full"
                onClick={() => {
                  router.push("/notificaciones")
                  setIsOpen(false)
                }}
              >
                Ver todas las notificaciones
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
