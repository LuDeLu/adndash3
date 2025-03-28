"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Settings,
  Map,
  Building2,
  HardHat,
  ChevronLeft,
  ChevronRight,
  Wrench,
  CheckSquare,
} from "lucide-react"

interface NavigationProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigationItems = [
    {
      title: "Proyectos",
      icon: Building2,
      section: "proyectos",
    },
    {
      title: "Estadísticas",
      icon: LayoutDashboard,
      section: "estadisticas",
    },
    {
      title: "Clientes",
      icon: Users,
      section: "clientes",
    },
    {
      title: "Calendario",
      icon: Calendar,
      section: "calendario",
    },
    {
      title: "Archivos",
      icon: FileText,
      section: "archivos",
    },
    {
      title: "Obras",
      icon: HardHat,
      section: "obras",
    },
    {
      title: "Mapa",
      icon: Map,
      section: "mapa",
    },
    {
      title: "Post Ventas",
      icon: Wrench,
      section: "postventas",
    },
    {
      title: "Aprobaciones",
      icon: CheckSquare,
      section: "aprobaciones",
    },
    {
      title: "Configuración",
      icon: Settings,
      section: "ajustes",
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
          {navigationItems.map((item) => (
            <li key={item.section}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  activeSection === item.section
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white",
                  isCollapsed && "justify-center px-0",
                )}
                onClick={() => setActiveSection(item.section)}
              >
                <item.icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-2")} />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

