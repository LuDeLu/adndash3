"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Bell,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  Search,
  TrendingUp,
  Users,
  CheckCheck,
  Clock,
  BarChart3,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth/auth-context"
import { Notyf } from "notyf"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const notyf = typeof window !== "undefined" ? new Notyf() : null

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

const TYPE_COLORS: Record<string, string> = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

interface Notification {
  id: string
  message: string
  type: "info" | "warning" | "success" | "error"
  module: string
  link?: string
  created_at: string
  read: boolean
  read_at?: string
  total_recipients?: number
  read_count?: number
}

interface NotificationDetail {
  notification: Notification
  readBy: Array<{
    id: number
    nombre: string
    email: string
    rol: string
    read_at: string
  }>
  unreadBy: Array<{
    id: number
    nombre: string
    email: string
    rol: string
  }>
}

interface NotificationStats {
  total: number
  unread: number
  readRate: number
  todayCount: number
  weekCount: number
  byModule: Record<string, number>
  byType: Record<string, number>
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedNotification, setSelectedNotification] = useState<NotificationDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch("https://adndashboard.squareweb.app/api/notifications", {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(
          data.map((item: any) => ({
            id: item.id.toString(),
            message: item.message,
            timestamp: item.created_at,
            type: item.type || "info",
            link: item.link,
            module: item.module,
            created_at: item.created_at,
            read: item.read === 1,
            read_at: item.read_at,
            total_recipients: item.total_recipients,
            read_count: item.read_count,
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
      notyf?.error("Error al cargar notificaciones")
    } finally {
      setLoading(false)
    }
  }, [user])

  // Fetch notification details
  const fetchNotificationDetails = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`https://adndashboard.squareweb.app/api/notifications/${notificationId}/details`, {
        headers: {
          Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedNotification(data)

        // Mark as read
        await fetch(`https://adndashboard.squareweb.app/api/notifications/${notificationId}/read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
            "Content-Type": "application/json",
          },
        })
      }
    } catch (error) {
      console.error("Error fetching notification details:", error)
      notyf?.error("Error al cargar detalles de notificación")
    }
  }, [])

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(`https://adndashboard.squareweb.app/api/notifications/${notificationId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
          },
        })

        if (response.ok) {
          setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
          if (selectedNotification?.notification.id === notificationId) {
            setSelectedNotification(null)
          }
          notyf?.success("Notificación eliminada")
        }
      } catch (error) {
        console.error("Error deleting notification:", error)
        notyf?.error("Error al eliminar notificación")
      }
    },
    [selectedNotification],
  )

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "hace unos segundos"
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const stats: NotificationStats = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const byModule: Record<string, number> = {}
    const byType: Record<string, number> = {}
    let unread = 0
    let todayCount = 0
    let weekCount = 0

    notifications.forEach((n) => {
      if (!n.read) unread++

      const createdAt = new Date(n.created_at)
      if (createdAt >= today) todayCount++
      if (createdAt >= weekAgo) weekCount++

      byModule[n.module] = (byModule[n.module] || 0) + 1
      byType[n.type] = (byType[n.type] || 0) + 1
    })

    return {
      total: notifications.length,
      unread,
      readRate: notifications.length > 0 ? ((notifications.length - unread) / notifications.length) * 100 : 0,
      todayCount,
      weekCount,
      byModule,
      byType,
    }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Tab filter
      if (activeTab === "unread" && n.read) return false
      if (activeTab !== "all" && activeTab !== "unread" && n.module !== activeTab) return false

      // Search filter
      if (searchQuery && !n.message.toLowerCase().includes(searchQuery.toLowerCase())) return false

      // Type filter
      if (typeFilter !== "all" && n.type !== typeFilter) return false

      // Date filter
      if (dateFilter !== "all") {
        const createdAt = new Date(n.created_at)
        const now = new Date()

        if (dateFilter === "today") {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          if (createdAt < today) return false
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (createdAt < weekAgo) return false
        } else if (dateFilter === "month") {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (createdAt < monthAgo) return false
        }
      }

      return true
    })
  }, [notifications, activeTab, searchQuery, typeFilter, dateFilter])

  const handleSelectAll = () => {
    if (selectedIds.size === filteredNotifications.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredNotifications.map((n) => n.id)))
    }
  }

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`https://adndashboard.squareweb.app/api/notifications/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
            },
          }),
        ),
      )

      setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)))
      setSelectedIds(new Set())
      notyf?.success(`${selectedIds.size} notificaciones eliminadas`)
    } catch (error) {
      console.error("Error deleting notifications:", error)
      notyf?.error("Error al eliminar notificaciones")
    }
  }

  const handleMarkAllRead = async () => {
    if (selectedIds.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`https://adndashboard.squareweb.app/api/notifications/${id}/read`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""}`,
              "Content-Type": "application/json",
            },
          }),
        ),
      )

      setNotifications((prev) =>
        prev.map((n) => (selectedIds.has(n.id) ? { ...n, read: true, read_at: new Date().toISOString() } : n)),
      )
      setSelectedIds(new Set())
      notyf?.success(`${selectedIds.size} notificaciones marcadas como leídas`)
    } catch (error) {
      console.error("Error marking notifications as read:", error)
      notyf?.error("Error al marcar notificaciones")
    }
  }

  if (selectedNotification) {
    const { notification, readBy, unreadBy } = selectedNotification
    const readPercentage =
      (notification.total_recipients ?? 0)
        ? ((notification.read_count ?? 0) / (notification.total_recipients ?? 0)) * 100
        : 0

    return (
      <div className="min-h-screen bg-slate-950 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedNotification(null)
                fetchNotifications()
              }}
              className="border-slate-800 hover:bg-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-white">Detalles de notificación</h1>
              <p className="text-slate-400 text-sm mt-1">Análisis de alcance y engagement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Destinatarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">{notification.total_recipients || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Usuarios totales</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-emerald-400">{notification.read_count || 0}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {notification.read_count || 0} de {notification.total_recipients || 0}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Tasa de lectura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-400">{Math.round(readPercentage)}%</p>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${readPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{MODULE_ICONS[notification.module] || "📣"}</div>
                      <Badge className={TYPE_COLORS[notification.type]}>{notification.type.toUpperCase()}</Badge>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {MODULE_NAMES[notification.module] || notification.module}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white">{notification.message}</CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      {formatRelativeTime(notification.created_at)}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <Tabs defaultValue="read" className="w-full">
                <CardHeader className="pb-0">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                    <TabsTrigger
                      value="read"
                      className="flex items-center gap-2 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
                    >
                      <Eye className="h-4 w-4" />
                      Vieron ({readBy.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="unread"
                      className="flex items-center gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-slate-300"
                    >
                      <EyeOff className="h-4 w-4" />
                      No vieron ({unreadBy.length})
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="pt-6">
                  <TabsContent value="read" className="space-y-2 mt-0">
                    {readBy.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <Eye className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Nadie ha visualizado esta notificación aún</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {readBy.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Avatar className="border-2 border-emerald-500/30">
                                <AvatarFallback className="bg-emerald-500/10 text-emerald-400">
                                  {user.nombre.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-white truncate">{user.nombre}</p>
                                <p className="text-sm text-slate-400 truncate">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                                {user.rol}
                              </Badge>
                              <div className="text-right">
                                <div className="flex items-center gap-1.5 text-emerald-400">
                                  <Check className="h-3.5 w-3.5" />
                                  <p className="text-sm font-medium">Visto</p>
                                </div>
                                <p className="text-xs text-slate-500">{formatRelativeTime(user.read_at)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="unread" className="space-y-2 mt-0">
                    {unreadBy.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">
                        <CheckCheck className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>Todos han visualizado esta notificación</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {unreadBy.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-75"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Avatar className="opacity-60 border-2 border-slate-700">
                                <AvatarFallback className="bg-slate-800 text-slate-500">
                                  {user.nombre.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-400 truncate">{user.nombre}</p>
                                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <Badge variant="outline" className="border-slate-700 text-slate-500">
                                {user.rol}
                              </Badge>
                              <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-400">
                                Pendiente
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl">
                <Bell className="h-6 w-6 text-white" />
              </div>
              Centro de Notificaciones
            </h1>
            <p className="text-slate-400 mt-2">Gestiona y analiza todas tus notificaciones del sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchNotifications}
              className="border-slate-800 hover:bg-slate-900 text-slate-300 bg-transparent"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-slate-800 hover:bg-slate-900 text-slate-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>

        {loading ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <p className="text-slate-400">Cargando notificaciones...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Total de notificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {stats.todayCount} hoy · {stats.weekCount} esta semana
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    No leídas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-amber-400">{stats.unread}</p>
                  <p className="text-xs text-slate-500 mt-1">Requieren atención</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Tasa de lectura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-emerald-400">{Math.round(stats.readRate)}%</p>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${stats.readRate}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Módulos activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-400">{Object.keys(stats.byModule).length}</p>
                  <p className="text-xs text-slate-500 mt-1">Con notificaciones</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800 mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Buscar notificaciones..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full lg:w-[180px] bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Filtrar por fecha" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">Todas las fechas</SelectItem>
                      <SelectItem value="today">Hoy</SelectItem>
                      <SelectItem value="week">Última semana</SelectItem>
                      <SelectItem value="month">Último mes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full lg:w-[180px] bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="all">Todos los tipos</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedIds.size > 0 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkAllRead}
                        className="border-slate-700 hover:bg-slate-800 text-slate-300 bg-transparent"
                      >
                        <CheckCheck className="h-4 w-4 mr-2" />
                        Marcar leídas ({selectedIds.size})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkDelete}
                        className="border-red-900 hover:bg-red-950/20 text-red-400 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar ({selectedIds.size})
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 bg-slate-900 border border-slate-800 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                  Todas ({notifications.length})
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
                >
                  No leídas ({stats.unread})
                </TabsTrigger>
                {Object.entries(MODULE_NAMES)
                  .slice(0, 5)
                  .map(([key, name]) => (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="data-[state=active]:bg-slate-800 data-[state=active]:text-white hidden md:block"
                    >
                      {MODULE_ICONS[key]} {name} ({stats.byModule[key] || 0})
                    </TabsTrigger>
                  ))}
              </TabsList>

              <TabsContent value={activeTab} className="space-y-3 mt-6">
                {filteredNotifications.length === 0 ? (
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-12 text-center">
                      <Bell className="h-16 w-16 mx-auto mb-4 text-slate-700" />
                      <p className="text-slate-400 text-lg">No hay notificaciones en esta categoría</p>
                      {searchQuery && (
                        <p className="text-slate-500 text-sm mt-2">Intenta cambiar los filtros de búsqueda</p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {filteredNotifications.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
                        <Checkbox
                          checked={selectedIds.size === filteredNotifications.length}
                          onCheckedChange={handleSelectAll}
                          className="border-slate-700"
                        />
                        <span className="text-sm text-slate-400">
                          {selectedIds.size === filteredNotifications.length
                            ? "Deseleccionar todas"
                            : "Seleccionar todas"}{" "}
                          ({filteredNotifications.length} notificaciones)
                        </span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {filteredNotifications.map((notification) => (
                        <Card
                          key={notification.id}
                          className={`cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/10 ${
                            !notification.read
                              ? "border-blue-500/50 bg-gradient-to-r from-blue-950/30 to-slate-900"
                              : "bg-slate-900 border-slate-800 hover:border-slate-700"
                          } ${selectedIds.has(notification.id) ? "ring-2 ring-blue-500/50" : ""}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex items-center pt-1">
                                <Checkbox
                                  checked={selectedIds.has(notification.id)}
                                  onCheckedChange={() => handleToggleSelect(notification.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="border-slate-700"
                                />
                              </div>

                              <div
                                className="flex items-start gap-3 flex-1 min-w-0"
                                onClick={() => fetchNotificationDetails(notification.id)}
                              >
                                <div className="text-2xl mt-1 shrink-0">
                                  {MODULE_ICONS[notification.module] || "📣"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <p
                                      className={`font-semibold truncate ${
                                        !notification.read ? "text-white" : "text-slate-400"
                                      }`}
                                    >
                                      {notification.message}
                                    </p>
                                    <Badge className={TYPE_COLORS[notification.type]}>{notification.type}</Badge>
                                    {!notification.read && (
                                      <Badge className="bg-blue-500 hover:bg-blue-600">Nueva</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      {formatRelativeTime(notification.created_at)}
                                    </span>
                                    <span>•</span>
                                    <span>{MODULE_NAMES[notification.module] || notification.module}</span>
                                    {notification.total_recipients && (
                                      <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                          <Eye className="h-3.5 w-3.5" />
                                          {notification.read_count ?? 0}/{notification.total_recipients ?? 0}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="text-red-400 hover:text-red-300 hover:bg-red-950/20 h-9 w-9 shrink-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
