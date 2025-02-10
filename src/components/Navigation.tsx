"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Home,
  Calendar,
  Users,
  BarChart,
  Settings,
  Menu,
  LayoutDashboard,
  ImageIcon,
  LogOut,
  ClipboardList,
  Pickaxe,
  UserRoundCog,
  Map,
  ChevronLeft,
  Headphones,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/app/auth/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

type NavigationProps = {
  activeSection: string
  setActiveSection: (section: string) => void
}

type NavItemProps = {
  icon: React.ReactNode
  label: string
  section: string
  isMobile: boolean
  onClick: () => void
}

export function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobile(newIsMobile)
      if (!newIsMobile) {
        setIsCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!activeSection.startsWith("proyectos")) {
      setIsProjectsOpen(false)
    }
  }, [activeSection])

  const NavItem = ({ icon, label, section, isMobile, onClick }: NavItemProps) => {
    if (isMobile) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeSection === section ? "secondary" : "ghost"}
                size="icon"
                className="h-12 w-12"
                onClick={onClick}
              >
                {icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Button
        variant={activeSection === section ? "secondary" : "ghost"}
        className={`w-full justify-start ${isCollapsed ? "px-2" : ""}`}
        onClick={onClick}
      >
        {icon}
        {!isCollapsed && <span className="ml-2">{label}</span>}
      </Button>
    )
  }

  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Proyectos", section: "proyectos" },
    { icon: <LayoutDashboard className="h-5 w-5" />, label: "Muestra de planos", section: "proyectos/vista" },
    { icon: <Calendar className="h-5 w-5" />, label: "Calendario", section: "calendario" },
    { icon: <Users className="h-5 w-5" />, label: "Clientes", section: "clientes" },
    { icon: <BarChart className="h-5 w-5" />, label: "Estadísticas", section: "estadisticas" },
    { icon: <ClipboardList className="h-5 w-5" />, label: "Archivos", section: "archivos" },
    { icon: <Pickaxe className="h-5 w-5" />, label: "Obras", section: "obras" },
    { icon: <ImageIcon className="h-5 w-5" />, label: "Galeria", section: "galeria" },
    { icon: <Map className="h-5 w-5" />, label: "Ubicaciones", section: "mapa" },
    { icon: <Headphones className="h-5 w-5" />, label: "Postventas", section: "postventas" },
    { icon: <Settings className="h-5 w-5" />, label: "Ajustes", section: "ajustes" },

    ...(user?.rol === "admin"
      ? [{ icon: <UserRoundCog className="h-5 w-5" />, label: "Usuarios", section: "usermanagement" }]
      : []),
    ...(user?.rol === "superadmin"
      ? [
          { icon: <UserRoundCog className="h-5 w-5" />, label: "Usuarios", section: "usermanagement" },
          { icon: <UserRoundCog className="h-5 w-5" />, label: "Añadir Proyecto", section: "añadirproyecto" },
        ]
      : []),
  ]

  const handleLogout = () => {
    logout()
  }

  const UserInfo = () => (
    <div
      className={`flex items-center ${isCollapsed ? "justify-center" : "justify-start"} mb-4 bg-secondary p-4 rounded-lg`}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
        <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <div className="ml-3 overflow-hidden">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      )}
    </div>
  )

  const DesktopNavContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          {!isCollapsed && <span className="text-lg font-bold">ADN Developers</span>}
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-full">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <nav className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => (
          <NavItem
            key={item.section}
            {...item}
            isMobile={false}
            onClick={() => {
              if (item.section === "proyectos" && activeSection === "proyectos") {
                setIsProjectsOpen(!isProjectsOpen)
              } else {
                setActiveSection(item.section)
              }
            }}
          />
        ))}
      </nav>
      <UserInfo />
      <Button variant="ghost" className={`w-full justify-start ${isCollapsed ? "px-2" : ""}`} onClick={handleLogout}>
        <LogOut className="h-5 w-5" />
        {!isCollapsed && <span className="ml-2">Cerrar sesión</span>}
      </Button>
    </>
  )

  if (isMobile) {
    return (
      <>
        <AnimatePresence>
          {isCollapsed && (
            <motion.button
              className="fixed top-4 left-4 z-50 p-2 rounded-md shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCollapsed(false)}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!isCollapsed && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/50 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCollapsed(true)}
              />
              <motion.nav
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 w-[65%] bg-background border-r border-border p-6 shadow-xl z-50 overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-2xl font-bold">ADN Developers</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsCollapsed(true)}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </motion.button>
                  </div>
                  <div className="flex-grow">
                    {navItems.map((item) => (
                      <motion.div key={item.section} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={activeSection === item.section ? "secondary" : "ghost"}
                          className="w-full justify-start mb-4 text-lg"
                          onClick={() => {
                            setActiveSection(item.section)
                            setIsCollapsed(true)
                          }}
                        >
                          {item.icon}
                          <span className="ml-4">{item.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <UserInfo />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="ghost" className="w-full justify-start mt-4 text-lg" onClick={handleLogout}>
                        <LogOut className="h-5 w-5" />
                        <span className="ml-4">Cerrar sesión</span>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div
      className={`bg-background border-r border-border p-4 flex flex-col h-screen transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      <DesktopNavContent />
    </div>
  )
}

