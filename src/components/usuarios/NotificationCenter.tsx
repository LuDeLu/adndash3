"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/app/auth/auth-context"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Notification = {
  id: string
  message: string
  timestamp: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
  link?: string
  module: "clientes" | "proyectos" | "calendario" | "obras" | "postventa" | "sistema"
}

export default function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Función para cargar notificaciones desde el servidor
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://adndashbackend.onrender.com/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Transformar datos del formato de la base de datos al formato de la interfaz
        const formattedData = data.map((item: any) => ({
          id: item.id.toString(),
          message: item.message,
          timestamp: item.created_at,
          read: item.read === 1,
          type: item.type,
          link: item.link,
          module: item.module,
        }))
        setNotifications(formattedData)
        setUnreadCount(formattedData.filter((n: Notification) => !n.read).length)
      } else {
        console.error("Error fetching notifications:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Marcar notificación como leída
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`https://adndashbackend.onrender.com/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Actualizar estado local
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } else {
        console.error("Error marking notification as read:", response.statusText)
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`https://adndashbackend.onrender.com/api/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        // Actualizar estado local
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
      } else {
        console.error("Error marking all notifications as read:", response.statusText)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  // Filtrar notificaciones según la pestaña activa
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === "all") return true
    if (activeFilter === "unread") return !notification.read
    return notification.module === activeFilter
  })

  // Formatear la fecha relativa (ej: "hace 5 minutos")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "hace unos segundos"
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
    return `hace ${Math.floor(diffInSeconds / 86400)} días`
  }

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    fetchNotifications()

    // Configurar polling para actualizar notificaciones cada minuto
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Obtener color de fondo según el tipo de notificación
  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500/10"
      case "warning":
        return "bg-yellow-500/10"
      case "success":
        return "bg-green-500/10"
      case "error":
        return "bg-red-500/10"
      default:
        return "bg-gray-500/10"
    }
  }

  // Obtener color de borde según el tipo de notificación
  const getNotificationBorderColor = (type: string) => {
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
  }

  // Obtener icono según el módulo
  const getModuleIcon = (module: string) => {
    switch (module) {
      case "clientes":
        return "👥"
      case "proyectos":
        return "🏢"
      case "calendario":
        return "📅"
      case "obras":
        return "🏗️"
      case "postventa":
        return "🔧"
      case "sistema":
        return "⚙️"
      default:
        return "📣"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px] p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificaciones</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7 px-2">
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="grid grid-cols-4 p-1 m-2">
            <TabsTrigger value="all" className="text-xs">
              Todas
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              No leídas
            </TabsTrigger>
            <TabsTrigger value="proyectos" className="text-xs">
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="postventa" className="text-xs">
              Post-venta
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start p-3 border-b border-l-4 cursor-pointer ${
                  notification.read ? "opacity-70" : "font-medium"
                } ${getNotificationBgColor(notification.type)} ${getNotificationBorderColor(notification.type)}`}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                  if (notification.link) {
                    window.location.href = notification.link
                  }
                  setIsOpen(false)
                }}
              >
                <div className="w-full">
                  <div className="flex items-center gap-1">
                    <span>{getModuleIcon(notification.module)}</span>
                    <p className="text-sm">{notification.message}</p>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.timestamp)}</span>
                    {!notification.read && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1">
                        Nueva
                      </Badge>
                    )}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No hay notificaciones</div>
          )}
        </ScrollArea>

        <div className="p-2 border-t text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs w-full"
            onClick={() => {
              // Aquí podrías redirigir a una página de todas las notificaciones
              console.log("Ver todas las notificaciones")
              setIsOpen(false)
            }}
          >
            Ver todas las notificaciones
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

