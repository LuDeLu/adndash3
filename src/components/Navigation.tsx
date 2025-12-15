"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/app/auth/auth-context"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  Building2,
  HardHat,
  ChevronLeft,
  ChevronRight,
  Wrench,
  CheckSquare,
  Map,
  UserPlus,
  Menu,
  Bell,
  LogOut,
  User,
  BarChart3,
  Crown,
} from "lucide-react"

// Hook para detectar móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

// Datos de notificaciones simuladas
const mockNotifications = [
  {
    id: "1",
    title: "Nueva venta registrada",
    message: "Se ha registrado una nueva venta en Dome Lagos",
    time: "hace 5 min",
    type: "success",
    unread: true,
  },
  {
    id: "2",
    title: "Reunión programada",
    message: "Reunión con cliente mañana a las 10:00 AM",
    time: "hace 1 hora",
    type: "info",
    unread: true,
  },
  {
    id: "3",
    title: "Documento pendiente",
    message: "Revisar contrato de Dome Palermo",
    time: "hace 2 horas",
    type: "warning",
    unread: false,
  },
  {
    id: "4",
    title: "Pago recibido",
    message: "Pago de cuota mensual procesado",
    time: "hace 3 horas",
    type: "success",
    unread: false,
  },
]

// Componente de notificaciones para móvil
function NotificationDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "info":
        return "ℹ️"
      default:
        return "📢"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-muted/50">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-6">
              Marcar todas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer",
                  notification.unread ? "bg-blue-50 dark:bg-blue-950/20" : "",
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-2 w-full">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No hay notificaciones</div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente de menú de usuario para móvil
function UserDropdown() {
  const { user, logout } = useAuth()

  const getUserInitials = (name: string) => {
    if (!name) return "U"
    const nameParts = name.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.name || "Usuario"} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs font-semibold">
              {getUserInitials(user?.name || "Usuario")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Usuario"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email || ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileHeader({ onMenuToggle }: { onMenuToggle: () => void }) {
  const pathname = usePathname()

  const navigationItems = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    { title: "Estadísticas", href: "/estadisticas", icon: BarChart3 },
    { title: "Proyectos", href: "/proyectos", icon: Building2 },
    { title: "Clientes", href: "/clientes", icon: Users },
    { title: "Calendario", href: "/calendario", icon: Calendar },
    { title: "Obras", href: "/obras", icon: HardHat },
    { title: "Post Ventas", href: "/postventas", icon: Wrench },
    { title: "Checklist", href: "/checklist", icon: CheckSquare },
    { title: "Mapa", href: "/mapa", icon: Map },
    { title: "Archivos", href: "/archivos", icon: FileText },
    { title: "Gestión de Usuarios", href: "/usermanagement", icon: UserPlus },
    { title: "Configuración", href: "/ajustes", icon: Settings },
  ]

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    return currentItem?.title || "ADN Developers"
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 /95 backdrop-blur-md border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuToggle}
            className="text-gray-400 hover:text-white hover:bg-gray-900"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-base text-white">{getCurrentPageTitle()}</h1>
            <p className="text-xs text-gray-500">ADN Developers</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </div>
  )
}

function MobileSidebarContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const getUserInitials = (name: string) => {
    if (!name) return "U"
    const nameParts = name.split(" ")
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }

  const navigationItems = [
    { title: "Proyectos", href: "/proyectos", icon: Building2, badge: null },
    { title: "Estadísticas", href: "/estadisticas", icon: BarChart3, badge: null },
    { title: "Leads", href: "/leads", icon: Users, badge: null },
    { title: "Propietarios", href: "/propietarios", icon: Crown, badge: null },
    { title: "Calendario", href: "/calendario", icon: Calendar, badge: 3 },
    { title: "Archivos", href: "/archivos", icon: FileText, badge: null },
    { title: "Obras", href: "/obras", icon: HardHat, badge: null },
    { title: "Post Ventas", href: "/postventas", icon: Wrench, badge: 5 },
    { title: "Checklist", href: "/checklist", icon: CheckSquare, badge: 2 },
    { title: "Mapa", href: "/mapa", icon: Map, badge: null },
    ...(user?.rol === "admin"
      ? [{ title: "Gestión de Usuarios", href: "/usermanagement", icon: UserPlus, badge: null }]
      : []),
    { title: "Configuración", href: "/ajustes", icon: Settings, badge: null },
  ]

  const handleLogout = () => {
    logout()
    onItemClick?.()
  }

  return (
    <div className="flex flex-col h-full  text-white">
      {/* Header del sidebar con logo - estilo desktop */}
      <div className="flex h-16 items-center border-b border-gray-800 px-4 flex-shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/images/logo/adn-developers-logo-big.png"
              alt="ADN Developers"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-semibold truncate">ADN Developers</span>
        </div>
      </div>

      {/* Información del usuario - estilo más limpio */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} alt={user?.name || "Usuario"} />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-500 text-white font-semibold text-sm">
              {getUserInitials(user?.name || "Usuario")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || "Usuario"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || "usuario@adn.com"}</p>
            <Badge variant="secondary" className="text-xs mt-1 bg-gray-800 text-gray-300 hover:bg-gray-700">
              {user?.rol === "admin" ? "Administrador" : "Usuario"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navegación principal - estilo desktop con items más compactos */}
      <ScrollArea className="flex-1">
        <nav className="py-2 px-2">
          <ul className="space-y-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center space-x-2 px-2 py-3 rounded-lg text-sm font-medium transition-colors duration-200 group",
                      isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive ? "text-white" : "text-gray-400 group-hover:text-white",
                      )}
                    />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs min-w-[20px] h-5 flex items-center justify-center px-1.5",
                          isActive ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </ScrollArea>

      <Separator className="bg-gray-800" />

      {/* Footer con logout - estilo desktop */}
      <div className="p-4 flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-900 h-10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}

// Navegación desktop original (arreglada para altura completa)
function DesktopNavigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  if (!user) return null

  const navigationItems = [
    { title: "Proyectos", icon: Building2, href: "/proyectos" },
    { title: "Estadísticas", icon: BarChart3, href: "/estadisticas" },
    { title: "Leads", icon: Users, href: "/leads" },
    { title: "Propietarios", icon: Crown, href: "/propietarios" },
    { title: "Calendario", icon: Calendar, href: "/calendario" },
    { title: "Archivos", icon: FileText, href: "/archivos" },
    { title: "Obras", icon: HardHat, href: "/obras" },
    { title: "Post Ventas", icon: Wrench, href: "/postventas" },
    { title: "Checklist", icon: CheckSquare, href: "/checklist" },
    { title: "Mapa", icon: Map, href: "/mapa" },
    ...(user.rol === "admin" ? [{ title: "Gestión de Usuarios", icon: UserPlus, href: "/usermanagement" }] : []),
    { title: "Configuración", icon: Settings, href: "/ajustes" },
  ]

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r border-gray-800  text-white transition-all duration-300",
        isCollapsed ? "w-16 min-w-16" : "w-64 min-w-64",
      )}
    >
      <div className="flex h-16 items-center border-b border-gray-800 px-3 flex-shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/images/logo/adn-developers-logo-big.png"
                alt="ADN Developers"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="text-lg font-semibold truncate">ADN Developers</span>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden mx-auto">
            <Image
              src="/images/logo/adn-developers-logo-big.png"
              alt="ADN"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-gray-400 hover:text-white shrink-0", isCollapsed ? "hidden" : "ml-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Collapse button for collapsed state */}
      {isCollapsed && (
        <div className="flex justify-center py-2 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Navegación - con flex-1 para ocupar todo el espacio disponible */}
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-2 px-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10",
                      isActive
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "text-gray-400 hover:bg-gray-900 hover:text-white",
                      isCollapsed && "justify-center px-0",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isCollapsed ? "mr-0" : "mr-2")} />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

export function Navigation() {
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (isMobile) {
    return (
      <>
        <MobileHeader onMenuToggle={() => setMobileMenuOpen(true)} />

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-80 p-0  border-r border-gray-800">
            <MobileSidebarContent onItemClick={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Spacer para el header fijo */}
        <div className="h-16" />
      </>
    )
  }

  // Desktop: navegación original simple pero con altura completa
  return <DesktopNavigation />
}
