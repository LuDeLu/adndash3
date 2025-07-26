"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Building,
  Hash,
} from "lucide-react"
import { DashboardView } from "./dashboard-view"

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

// Componente de tarjeta de ticket para móvil
function MobileTicketCard({
  ticket,
  onView,
}: {
  ticket: any
  onView: () => void
}) {
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendiente
          </Badge>
        )
      case "aprobado":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Aprobado
          </Badge>
        )
      case "rechazado":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Rechazado
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  // Calcular progreso de aprobaciones
  const totalDepts = Object.keys(ticket.aprobaciones || {}).length
  const approvedDepts = Object.values(ticket.aprobaciones || {}).filter((a: any) => a.aprobado).length
  const progress = totalDepts > 0 ? Math.round((approvedDepts / totalDepts) * 100) : 0

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold flex items-center">
              <Hash className="h-3 w-3 mr-1" />
              {ticket.ticket_id}
            </CardTitle>
            <CardDescription className="text-sm mt-1 line-clamp-2">{ticket.title}</CardDescription>
          </div>
          <div className="ml-2">{renderStatusBadge(ticket.estado)}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Building className="h-3 w-3 mr-2" />
            <span>{ticket.emprendimiento}</span>
          </div>
          <div className="flex items-center">
            <User className="h-3 w-3 mr-2" />
            <span>UF {ticket.unidad_funcional}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-2" />
            <span>{new Date(ticket.fecha_creacion).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Progreso de aprobaciones */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                progress === 100 ? "bg-green-500" : progress > 0 ? "bg-blue-500" : "bg-gray-300"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="default" onClick={onView} className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            Ver Detalles
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Formulario de nuevo ticket optimizado para móvil
function MobileTicketForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    tipoDocumento: "boleto",
    emprendimiento: "",
    unidadFuncional: "",
    quienVende: "",
    fechaFirma: "",
    comprador: {
      nombre: "",
      dni: "",
      cuit: "",
      direccion: "",
      mail: "",
      telefono: "",
    },
    precio: {
      valorVentaTotal: "",
      valorUF: "",
      valorCHBaulera: "",
      valorVentaA: "",
      valorM2: "",
      formaPago: "",
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <ScrollArea className="h-[70vh]">
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Documento *</label>
            <select
              value={formData.tipoDocumento}
              onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value })}
              className="w-full p-2 border rounded-md text-sm"
              required
            >
              <option value="boleto">Boleto de Compraventa</option>
              <option value="cesion">Cesión de Derechos</option>
              <option value="reserva">Reserva</option>
              <option value="mutuo">Mutuo</option>
              <option value="locacion">Locación de Obra</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Emprendimiento *</label>
              <Input
                value={formData.emprendimiento}
                onChange={(e) => setFormData({ ...formData, emprendimiento: e.target.value })}
                placeholder="Ej: Dome Lagos"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidad Funcional *</label>
              <Input
                value={formData.unidadFuncional}
                onChange={(e) => setFormData({ ...formData, unidadFuncional: e.target.value })}
                placeholder="Ej: 4A"
                required
                className="text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quien Vende *</label>
            <Input
              value={formData.quienVende}
              onChange={(e) => setFormData({ ...formData, quienVende: e.target.value })}
              placeholder="Nombre del vendedor"
              required
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha de Firma *</label>
            <Input
              type="date"
              value={formData.fechaFirma}
              onChange={(e) => setFormData({ ...formData, fechaFirma: e.target.value })}
              required
              className="text-sm"
            />
          </div>

          {/* Información del comprador */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Información del Comprador</h3>

            <div className="space-y-3">
              <Input
                placeholder="Nombre completo *"
                value={formData.comprador.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comprador: { ...formData.comprador, nombre: e.target.value },
                  })
                }
                required
                className="text-sm"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="DNI *"
                  value={formData.comprador.dni}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comprador: { ...formData.comprador, dni: e.target.value },
                    })
                  }
                  required
                  className="text-sm"
                />
                <Input
                  placeholder="CUIT"
                  value={formData.comprador.cuit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comprador: { ...formData.comprador, cuit: e.target.value },
                    })
                  }
                  className="text-sm"
                />
              </div>

              <Input
                placeholder="Dirección"
                value={formData.comprador.direccion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comprador: { ...formData.comprador, direccion: e.target.value },
                  })
                }
                className="text-sm"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.comprador.mail}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comprador: { ...formData.comprador, mail: e.target.value },
                    })
                  }
                  className="text-sm"
                />
                <Input
                  placeholder="Teléfono"
                  value={formData.comprador.telefono}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      comprador: { ...formData.comprador, telefono: e.target.value },
                    })
                  }
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Información de precio */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Información de Precio</h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Valor Venta Total (USD)"
                  value={formData.precio.valorVentaTotal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precio: { ...formData.precio, valorVentaTotal: e.target.value },
                    })
                  }
                  className="text-sm"
                />
                <Input
                  placeholder="Valor UF (USD)"
                  value={formData.precio.valorUF}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precio: { ...formData.precio, valorUF: e.target.value },
                    })
                  }
                  className="text-sm"
                />
              </div>

              <Input
                placeholder="Forma de Pago"
                value={formData.precio.formaPago}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    precio: { ...formData.precio, formaPago: e.target.value },
                  })
                }
                className="text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-2 pt-4 sticky bottom-0 bg-white border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Crear Ticket
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}

export function ApprovalForm() {
  const isMobile = useIsMobile()
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [tickets, setTickets] = useState([
    {
      id: "1",
      ticket_id: "APR-001",
      title: "Aprobación Boleto de Compraventa",
      emprendimiento: "Dome Lagos",
      unidad_funcional: "4A",
      fecha_creacion: new Date().toISOString(),
      estado: "pendiente",
      aprobaciones: {
        contaduria: { aprobado: true, usuario: "Ana Silva", fecha: new Date().toISOString() },
        legales: { aprobado: false, usuario: null, fecha: null },
        tesoreria: { aprobado: false, usuario: null, fecha: null },
        gerenciaComercial: { aprobado: false, usuario: null, fecha: null },
        gerencia: { aprobado: false, usuario: null, fecha: null },
        arquitecto: { aprobado: false, usuario: null, fecha: null },
      },
    },
    {
      id: "2",
      ticket_id: "APR-002",
      title: "Aprobación Cesión de Derechos",
      emprendimiento: "Dome Palermo",
      unidad_funcional: "2B",
      fecha_creacion: new Date(Date.now() - 86400000).toISOString(),
      estado: "aprobado",
      aprobaciones: {
        contaduria: { aprobado: true, usuario: "Ana Silva", fecha: new Date().toISOString() },
        legales: { aprobado: true, usuario: "Carlos López", fecha: new Date().toISOString() },
        tesoreria: { aprobado: true, usuario: "María García", fecha: new Date().toISOString() },
        gerenciaComercial: { aprobado: true, usuario: "Juan Pérez", fecha: new Date().toISOString() },
        gerencia: { aprobado: true, usuario: "Roberto Díaz", fecha: new Date().toISOString() },
        arquitecto: { aprobado: true, usuario: "Laura Martín", fecha: new Date().toISOString() },
      },
    },
  ])

  if (!isMobile) {
    // Vista desktop - usar el componente original
    return <DashboardView />
  }

  // Vista móvil optimizada
  return (
    <div className="min-h-screen bg-background">
      {/* Header móvil */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Checklist</h1>
            <p className="text-sm text-muted-foreground">Gestión de Aprobaciones</p>
          </div>
          <Dialog open={showNewTicketForm} onOpenChange={setShowNewTicketForm}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Nuevo Ticket de Aprobación</DialogTitle>
              </DialogHeader>
              <MobileTicketForm
                onSubmit={(data) => {
                  console.log("Nuevo ticket:", data)
                  setShowNewTicketForm(false)
                }}
                onCancel={() => setShowNewTicketForm(false)}
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
            <TabsTrigger value="pendiente" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Pendientes
            </TabsTrigger>
            <TabsTrigger value="aprobado" className="text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Aprobados
            </TabsTrigger>
            <TabsTrigger value="rechazado" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Rechazados
            </TabsTrigger>
          </TabsList>

          {/* Barra de búsqueda y filtros */}
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar tickets..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <TabsContent value="todos" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <MobileTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onView={() => console.log("Ver ticket", ticket.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="pendiente" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {tickets
                  .filter((t) => t.estado === "pendiente")
                  .map((ticket) => (
                    <MobileTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onView={() => console.log("Ver ticket", ticket.id)}
                    />
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="aprobado" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {tickets
                  .filter((t) => t.estado === "aprobado")
                  .map((ticket) => (
                    <MobileTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onView={() => console.log("Ver ticket", ticket.id)}
                    />
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="rechazado" className="mt-0">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4">
                {tickets
                  .filter((t) => t.estado === "rechazado")
                  .map((ticket) => (
                    <MobileTicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onView={() => console.log("Ver ticket", ticket.id)}
                    />
                  ))}
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
        <Button size="sm" className="shadow-lg" onClick={() => setShowNewTicketForm(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
