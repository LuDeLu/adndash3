"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
  Building,
  Home,
  FileText,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import GestionPostVenta from "./GestionPostVenta"

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

// Componente de tarjeta de reclamo para móvil
function MobileReclamoCard({
  reclamo,
  onView,
  onEdit,
  onDelete,
}: {
  reclamo: any
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Ingresado":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            Ingresado
          </Badge>
        )
      case "En Inspección":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            En Inspección
          </Badge>
        )
      case "En Reparación":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            En Reparación
          </Badge>
        )
      case "Solucionado":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            Solucionado
          </Badge>
        )
      case "No Corresponde":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            No Corresponde
          </Badge>
        )
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const esVisitaHoy = (fechaVisita: string | undefined): boolean => {
    if (!fechaVisita) return false
    try {
      const hoy = new Date().toISOString().split("T")[0]
      return fechaVisita === hoy
    } catch (error) {
      return false
    }
  }

  return (
    <Card className={`mb-4 ${esVisitaHoy(reclamo.fechaVisita) ? "border-amber-200 bg-amber-50" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold">
              Ticket #{reclamo.ticket}
              {esVisitaHoy(reclamo.fechaVisita) && (
                <AlertTriangle className="inline-block ml-2 h-4 w-4 text-amber-500" />
              )}
            </CardTitle>
            <CardDescription className="text-sm mt-1">{reclamo.cliente}</CardDescription>
          </div>
          <div className="ml-2">{getEstadoBadge(reclamo.estado)}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Building className="h-3 w-3 mr-2" />
            <span>{reclamo.edificio}</span>
          </div>
          <div className="flex items-center">
            <Home className="h-3 w-3 mr-2" />
            <span>UF {reclamo.unidadFuncional}</span>
          </div>
          <div className="flex items-center">
            <FileText className="h-3 w-3 mr-2" />
            <span className="truncate">{reclamo.descripcion}</span>
          </div>
          {reclamo.fechaVisita && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2" />
              <span>
                Visita: {format(new Date(reclamo.fechaVisita), "dd/MM/yyyy", { locale: es })}
                {esVisitaHoy(reclamo.fechaVisita) && (
                  <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200 text-xs">
                    Hoy
                  </Badge>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="default" onClick={onView} className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            Ver
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Formulario de nuevo reclamo optimizado para móvil
function MobileReclamoForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    cliente: "",
    telefono: "",
    email: "",
    edificio: "",
    unidadFuncional: "",
    descripcion: "",
    prioridad: "Media",
    fechaVisita: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente *</Label>
          <Input
            id="cliente"
            value={formData.cliente}
            onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
            placeholder="Nombre del cliente"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="Teléfono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="edificio">Edificio *</Label>
            <Select value={formData.edificio} onValueChange={(value) => setFormData({ ...formData, edificio: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar edificio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dome Lagos">Dome Lagos</SelectItem>
                <SelectItem value="Dome Palermo">Dome Palermo</SelectItem>
                <SelectItem value="Dome Suites">Dome Suites</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="unidadFuncional">Unidad Funcional *</Label>
            <Input
              id="unidadFuncional"
              value={formData.unidadFuncional}
              onChange={(e) => setFormData({ ...formData, unidadFuncional: e.target.value })}
              placeholder="Ej: 4A"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción del Reclamo *</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Describe el problema detalladamente..."
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="prioridad">Prioridad</Label>
            <Select
              value={formData.prioridad}
              onValueChange={(value) => setFormData({ ...formData, prioridad: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Baja">Baja</SelectItem>
                <SelectItem value="Media">Media</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fechaVisita">Fecha de Visita</Label>
            <Input
              id="fechaVisita"
              type="date"
              value={formData.fechaVisita}
              onChange={(e) => setFormData({ ...formData, fechaVisita: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Crear Reclamo
        </Button>
      </div>
    </form>
  )
}

export default function PostVentaGestion() {
  const isMobile = useIsMobile()
  const [showNewReclamoForm, setShowNewReclamoForm] = useState(false)

  if (!isMobile) {
    // Vista desktop - usar el componente original
    return <GestionPostVenta />
  }

  // Vista móvil optimizada
  return (
    <div className="min-h-screen bg-background">
      {/* Header móvil */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Post Venta</h1>
            <p className="text-sm text-muted-foreground">ADN Developers</p>
          </div>
          <Dialog open={showNewReclamoForm} onOpenChange={setShowNewReclamoForm}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nuevo Reclamo</DialogTitle>
              </DialogHeader>
              <MobileReclamoForm
                onSubmit={(data) => {
                  console.log("Nuevo reclamo:", data)
                  setShowNewReclamoForm(false)
                }}
                onCancel={() => setShowNewReclamoForm(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-4">
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="todos" className="text-xs">
              Todos
            </TabsTrigger>
            <TabsTrigger value="pendientes" className="text-xs">
              Pendientes
            </TabsTrigger>
            <TabsTrigger value="proceso" className="text-xs">
              En Proceso
            </TabsTrigger>
            <TabsTrigger value="cerrados" className="text-xs">
              Cerrados
            </TabsTrigger>
          </TabsList>

          {/* Barra de búsqueda y filtros */}
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar reclamos..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="todos" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {/* Ejemplo de reclamos */}
                <MobileReclamoCard
                  reclamo={{
                    id: 1,
                    ticket: "PV-001",
                    cliente: "Juan Pérez",
                    edificio: "Dome Lagos",
                    unidadFuncional: "4A",
                    descripcion: "Problema con la canilla de la cocina",
                    estado: "Ingresado",
                    fechaVisita: new Date().toISOString().split("T")[0], // Hoy
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />

                <MobileReclamoCard
                  reclamo={{
                    id: 2,
                    ticket: "PV-002",
                    cliente: "María González",
                    edificio: "Dome Palermo",
                    unidadFuncional: "2B",
                    descripcion: "Filtración en el baño principal",
                    estado: "En Inspección",
                    fechaVisita: "2024-01-30",
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />

                <MobileReclamoCard
                  reclamo={{
                    id: 3,
                    ticket: "PV-003",
                    cliente: "Carlos Rodríguez",
                    edificio: "Dome Suites",
                    unidadFuncional: "1C",
                    descripcion: "Problema con el aire acondicionado",
                    estado: "En Reparación",
                    fechaVisita: "2024-01-28",
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />

                <MobileReclamoCard
                  reclamo={{
                    id: 4,
                    ticket: "PV-004",
                    cliente: "Ana Martínez",
                    edificio: "Dome Lagos",
                    unidadFuncional: "3A",
                    descripcion: "Puerta del balcón no cierra correctamente",
                    estado: "Solucionado",
                    fechaVisita: "2024-01-25",
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="pendientes" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                <MobileReclamoCard
                  reclamo={{
                    id: 1,
                    ticket: "PV-001",
                    cliente: "Juan Pérez",
                    edificio: "Dome Lagos",
                    unidadFuncional: "4A",
                    descripcion: "Problema con la canilla de la cocina",
                    estado: "Ingresado",
                    fechaVisita: new Date().toISOString().split("T")[0],
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="proceso" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                <MobileReclamoCard
                  reclamo={{
                    id: 2,
                    ticket: "PV-002",
                    cliente: "María González",
                    edificio: "Dome Palermo",
                    unidadFuncional: "2B",
                    descripcion: "Filtración en el baño principal",
                    estado: "En Inspección",
                    fechaVisita: "2024-01-30",
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />

                <MobileReclamoCard
                  reclamo={{
                    id: 3,
                    ticket: "PV-003",
                    cliente: "Carlos Rodríguez",
                    edificio: "Dome Suites",
                    unidadFuncional: "1C",
                    descripcion: "Problema con el aire acondicionado",
                    estado: "En Reparación",
                    fechaVisita: "2024-01-28",
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="cerrados" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                <MobileReclamoCard
                  reclamo={{
                    id: 4,
                    ticket: "PV-004",
                    cliente: "Ana Martínez",
                    edificio: "Dome Lagos",
                    unidadFuncional: "3A",
                    descripcion: "Puerta del balcón no cierra correctamente",
                    estado: "Solucionado",
                    fechaVisita: "2024-01-25",
                  }}
                  onView={() => console.log("Ver reclamo")}
                  onEdit={() => console.log("Editar reclamo")}
                  onDelete={() => console.log("Eliminar reclamo")}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Botón flotante para acciones rápidas */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <Button size="sm" variant="outline" className="shadow-lg bg-transparent">
          <Search className="h-4 w-4" />
        </Button>
        <Button size="sm" className="shadow-lg" onClick={() => setShowNewReclamoForm(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
