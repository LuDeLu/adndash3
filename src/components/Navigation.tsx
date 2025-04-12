"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  FolderPlus,
  UserPlus,
} from "lucide-react"

export function Navigation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // Si no hay usuario autenticado, no mostrar la navegación
  if (!user) return null

  const navigationItems = [
    {
      title: "Proyectos",
      icon: Building2,
      href: "/proyectos",
    },
    {
      title: "Estadísticas",
      icon: LayoutDashboard,
      href: "/estadisticas",
    },
    {
      title: "Clientes",
      icon: Users,
      href: "/clientes",
    },
    {
      title: "Calendario",
      icon: Calendar,
      href: "/calendario",
    },
    {
      title: "Archivos",
      icon: FileText,
      href: "/archivos",
    },
    {
      title: "Obras",
      icon: HardHat,
      href: "/obras",
    },
    {
      title: "Post Ventas",
      icon: Wrench,
      href: "/postventas",
    },
    {
      title: "checklist",
      icon: CheckSquare,
      href: "/checklist",
    },
    {
      title: "Mapa",
      icon: Map,
      href: "/mapa",
    },
    {
      title: "Gestión de Usuarios",
      icon: UserPlus,
      href: "/usermanagement",
      adminOnly: true,
    },
    {
      title: "Configuración",
      icon: Settings,
      href: "/ajustes",
    },
  ]

  return (
    <div
      className={cn(
        "flex flex-col border-r border-gray-800 bg-black text-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        {!isCollapsed && <span className="text-lg font-semibold">ADN Desarrollos</span>}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto text-gray-400 hover:text-white", isCollapsed && "mx-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-2 px-2">
          {navigationItems.map((item) => {
            // No mostrar elementos solo para admin si el usuario no es admin
            if (item.adminOnly && user.rol !== "admin") return null

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      isActive
                        ? "bg-gray-800 text-white hover:bg-gray-700"
                        : "text-gray-400 hover:bg-gray-900 hover:text-white",
                      isCollapsed && "justify-center px-0",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
                    {!isCollapsed && <span>{item.title}</span>}
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
