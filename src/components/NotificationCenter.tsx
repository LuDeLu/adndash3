"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Bell, Check, CheckCheck, X, Settings, Filter } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { Notyf } from "notyf"

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

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)

  // Load preferences from localStorage
  const loadPreferences = useCallback(() => {
    if (typeof window === "undefined") return

    const savedPrefs = localStorage.getItem("notificationPreferences")
    if (savedPrefs) {
      try {
        const parsedPrefs = JSON.parse(savedPrefs)
        setPreferences((prev) => ({
          ...prev,
          ...parsedPrefs,
        }))
      } catch (e) {
        console.error("Error parsing notification preferences:", e)
      }
    }
  }, [])

  // Save preferences to localStorage
  const savePreferences = useCallback(
    (newPrefs: Partial<NotificationPreferences>) => {
      const updatedPrefs = { ...preferences, ...newPrefs }
      setPreferences(updatedPrefs)

      if (typeof window !== "undefined") {
        localStorage.setItem("notificationPreferences", JSON.stringify(updatedPrefs))
      }
    },
    [preferences],
  )

  // Fetch notifications from server
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch("https://adndashbackend.onrender.com/api/notifications", {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Transform data from database format to interface format
        const formattedData = data.map((item: any) => ({
          id: item.id.toString(),
          message: item.message,
          timestamp: item.created_at,
          read: item.read === 1,
          type: item.type || "info",
          link: item.link,
          module: item.module,
          priority: item.priority || "medium",
          actionable: item.actionable === 1,
          actions: item.actions ? JSON.parse(item.actions) : undefined,
          metadata: item.metadata ? JSON.parse(item.metadata) : undefined,
          expiresAt: item.expires_at,
        }))

        setNotifications(formattedData)
        setUnreadCount(formattedData.filter((n: Notification) => !n.read).length)

        // Request permission for desktop notifications if enabled
        if (
          preferences.desktopNotifications &&
          typeof window !== "undefined" &&
          Notification.permission !== "granted" &&
          Notification.permission !== "denied"
        ) {
          Notification.requestPermission()
        }
      } else {
        console.error("Error fetching notifications:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [user, preferences.desktopNotifications])

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
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch(`https://adndashbackend.onrender.com/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Update local state
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } else {
        console.error("Error marking notification as read:", response.statusText)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch(`https://adndashbackend.onrender.com/api/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Update local state
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
        notyf?.success("Todas las notificaciones han sido marcadas como leídas")
      } else {
        console.error("Error marking all notifications as read:", response.statusText)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`https://adndashbackend.onrender.com/api/notifications/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
          },
        })

        if (response.ok) {
          // Update local state
          const updatedNotifications = notifications.filter((n) => n.id !== id)
          setNotifications(updatedNotifications)

          // Update unread count if it was an unread notification
          const wasUnread = notifications.find((n) => n.id === id)?.read === false
          if (wasUnread) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }

          notyf?.success("La notificación ha sido eliminada correctamente")
        } else {
          console.error("Error deleting notification:", response.statusText)
        }
      } catch (error) {
        console.error("Error deleting notification:", error)
      }
    },
    [notifications],
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
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
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
  }, [notifications, preferences.modules, preferences.types, activeFilter])

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

  // Load notifications when component mounts
  useEffect(() => {
    loadPreferences()
    fetchNotifications()

    // Set up polling to update notifications every minute
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
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

  // Automatically mark as read when dropdown opens
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

      <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setShowSettings(false)}>
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
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[250px]" />
              </div>
              <Skeleton className="h-3 w-[200px]" />
            </div>
          ))}
        </div>
      )
    }

    if (filteredNotifications.length === 0) {
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
            .filter(([key, notifs]) => notifs.some((n) => filteredNotifications.some((fn) => fn.id === n.id)))
            .map(([key, notifs]) => {
              // Filter only notifications that pass the current filter
              const filteredGroupNotifs = notifs.filter((n) => filteredNotifications.some((fn) => fn.id === n.id))

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
          {filteredNotifications.map((notification) => (
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
                <div className="flex justify-end mt-1">
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
                    aria-label="Marcar como leída"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(notification.id)
                    }}
                    aria-label="Eliminar notificación"
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

