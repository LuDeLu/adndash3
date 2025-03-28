"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Download,
  Eye,
  Calendar,
  ArrowUpDown,
  Info,
} from "lucide-react"
import { FormDataInput } from "./form-data-input"
import { PDFViewer } from "./pdf-viewer"
import { initialFormData } from "@/lib/initial-data"
import type { FormData } from "@/types/form-data"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Tipo para los tickets de aprobación
interface ApprovalTicket {
  id: string
  title: string
  emprendimiento: string
  unidadFuncional: string
  fechaCreacion: string
  estado: "pendiente" | "aprobado" | "rechazado"
  creador: string
  formData: FormData
  aprobaciones: {
    contaduria: { aprobado: boolean; usuario: string; fecha: string | null; comentarios: string }
    legales: { aprobado: boolean; usuario: string; fecha: string | null; comentarios: string }
    tesoreria: { aprobado: boolean; usuario: string; fecha: string | null; comentarios: string }
    gerenciaComercial: { aprobado: boolean; usuario: string; fecha: string | null; comentarios: string }
    gerencia: { aprobado: boolean; usuario: string; fecha: string | null; comentarios: string }
    arquitecto: { aprobado: boolean; usuario: string; fecha: string | null; comentarios: string }
  }
}

// Datos de ejemplo para tickets
const mockTickets: ApprovalTicket[] = [
  {
    id: "TICK-001",
    title: "Aprobación Boleto de Compraventa",
    emprendimiento: "Edificio Libertad",
    unidadFuncional: "3B",
    fechaCreacion: "2024-03-15",
    estado: "pendiente",
    creador: "Juan Pérez",
    formData: {
      ...initialFormData,
      emprendimiento: "Edificio Libertad",
      unidadFuncional: "3B",
      tipoDocumento: "boleto",
      comprador: {
        ...initialFormData.comprador,
        nombre: "Carlos Rodríguez",
      },
    },
    aprobaciones: {
      contaduria: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      legales: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      tesoreria: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      gerenciaComercial: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      gerencia: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      arquitecto: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
    },
  },
  {
    id: "TICK-002",
    title: "Aprobación Cesión de Derechos",
    emprendimiento: "Torre Norte",
    unidadFuncional: "12A",
    fechaCreacion: "2024-03-10",
    estado: "pendiente",
    creador: "María González",
    formData: {
      ...initialFormData,
      emprendimiento: "Torre Norte",
      unidadFuncional: "12A",
      tipoDocumento: "cesion",
      comprador: {
        ...initialFormData.comprador,
        nombre: "Laura Fernández",
      },
    },
    aprobaciones: {
      contaduria: { aprobado: true, usuario: "Ana Contable", fecha: "2024-03-12", comentarios: "Verificado" },
      legales: { aprobado: true, usuario: "Pablo Legal", fecha: "2024-03-13", comentarios: "Documentación correcta" },
      tesoreria: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      gerenciaComercial: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      gerencia: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      arquitecto: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
    },
  },
  {
    id: "TICK-003",
    title: "Aprobación Reserva",
    emprendimiento: "Residencial del Parque",
    unidadFuncional: "5C",
    fechaCreacion: "2024-03-05",
    estado: "aprobado",
    creador: "Roberto Sánchez",
    formData: {
      ...initialFormData,
      emprendimiento: "Residencial del Parque",
      unidadFuncional: "5C",
      tipoDocumento: "reserva",
      comprador: {
        ...initialFormData.comprador,
        nombre: "Martín López",
      },
    },
    aprobaciones: {
      contaduria: { aprobado: true, usuario: "Ana Contable", fecha: "2024-03-06", comentarios: "Verificado" },
      legales: { aprobado: true, usuario: "Pablo Legal", fecha: "2024-03-06", comentarios: "Documentación correcta" },
      tesoreria: { aprobado: true, usuario: "Carlos Tesorero", fecha: "2024-03-07", comentarios: "Fondos verificados" },
      gerenciaComercial: { aprobado: true, usuario: "Laura Comercial", fecha: "2024-03-07", comentarios: "Aprobado" },
      gerencia: { aprobado: true, usuario: "Martín Gerente", fecha: "2024-03-08", comentarios: "Aprobado" },
      arquitecto: {
        aprobado: true,
        usuario: "Sofía Arquitecta",
        fecha: "2024-03-08",
        comentarios: "Planos verificados",
      },
    },
  },
  {
    id: "TICK-004",
    title: "Aprobación Mutuo",
    emprendimiento: "Edificio Libertad",
    unidadFuncional: "7D",
    fechaCreacion: "2024-03-01",
    estado: "rechazado",
    creador: "Lucía Martínez",
    formData: {
      ...initialFormData,
      emprendimiento: "Edificio Libertad",
      unidadFuncional: "7D",
      tipoDocumento: "mutuo",
      comprador: {
        ...initialFormData.comprador,
        nombre: "Diego Gómez",
      },
    },
    aprobaciones: {
      contaduria: { aprobado: true, usuario: "Ana Contable", fecha: "2024-03-02", comentarios: "Verificado" },
      legales: {
        aprobado: false,
        usuario: "Pablo Legal",
        fecha: "2024-03-03",
        comentarios: "Documentación incompleta",
      },
      tesoreria: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      gerenciaComercial: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      gerencia: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      arquitecto: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
    },
  },
]

export function ApprovalDashboard() {
  const [tickets, setTickets] = useState<ApprovalTicket[]>(mockTickets)
  const [filteredTickets, setFilteredTickets] = useState<ApprovalTicket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [selectedTicket, setSelectedTicket] = useState<ApprovalTicket | null>(null)
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false)
  const [isViewTicketDialogOpen, setIsViewTicketDialogOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApprovalTicket; direction: "asc" | "desc" } | null>(null)
  const [currentUser, setCurrentUser] = useState("Ana Silva")
  const [currentDepartment, setCurrentDepartment] = useState<keyof ApprovalTicket["aprobaciones"]>("contaduria")
  const [approvalComment, setApprovalComment] = useState("")

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [activeTab, setActiveTab] = useState("form")

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  // Opciones de usuarios para simulación
  const userOptions = [
    { name: "1", department: "contaduria" },
    { name: "2", department: "legales" },
    { name: "3", department: "tesoreria" },
    { name: "4", department: "gerenciaComercial" },
    { name: "5", department: "gerencia" },
    { name: "6", department: "arquitecto" },
  ]

  // Filtrar tickets basado en búsqueda y filtros
  useEffect(() => {
    let result = tickets

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.emprendimiento.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.unidadFuncional.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "todos") {
      result = result.filter((ticket) => ticket.estado === statusFilter)
    }

    // Aplicar ordenamiento si existe
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredTickets(result)
  }, [searchTerm, statusFilter, tickets, sortConfig])

  // Actualizar departamento cuando cambia el usuario
  useEffect(() => {
    const selectedUserOption = userOptions.find((option) => option.name === currentUser)
    if (selectedUserOption) {
      setCurrentDepartment(selectedUserOption.department as keyof ApprovalTicket["aprobaciones"])
    }
  }, [currentUser])

  // Función para crear un nuevo ticket
  const handleCreateTicket = (formData: FormData) => {
    const newTicket: ApprovalTicket = {
      id: `TICK-${String(tickets.length + 1).padStart(3, "0")}`,
      title: `Aprobación ${
        formData.tipoDocumento === "boleto"
          ? "Boleto de Compraventa"
          : formData.tipoDocumento === "cesion"
            ? "Cesión de Derechos"
            : formData.tipoDocumento === "reserva"
              ? "Reserva"
              : formData.tipoDocumento === "mutuo"
                ? "Mutuo"
                : formData.tipoDocumento === "locacion"
                  ? "Locación de Obra"
                  : "Documento"
      }`,
      emprendimiento: formData.emprendimiento || "Sin especificar",
      unidadFuncional: formData.unidadFuncional || "Sin especificar",
      fechaCreacion: new Date().toISOString().split("T")[0],
      estado: "pendiente",
      creador: currentUser,
      formData,
      aprobaciones: {
        contaduria: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
        legales: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
        tesoreria: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
        gerenciaComercial: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
        gerencia: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
        arquitecto: { aprobado: false, usuario: "", fecha: null, comentarios: "" },
      },
    }

    // Actualizar el estado de tickets y asegurarse de que se refleje en la interfaz
    const updatedTickets = [...tickets, newTicket]
    setTickets(updatedTickets)

    // Si el filtro actual permitiría mostrar este ticket, actualizar también filteredTickets
    if (statusFilter === "todos" || statusFilter === "pendiente") {
      setFilteredTickets((prev) => [...prev, newTicket])
    }

    // Cerrar el diálogo
    setIsNewTicketDialogOpen(false)

    // Asegurarse de que estamos en la pestaña correcta para ver el nuevo ticket
    setStatusFilter("todos")

    // Resetear el formulario
    setFormData(initialFormData)
    setActiveTab("form")
  }

  // Función para aprobar un ticket
  const handleApproveTicket = (
    ticketId: string,
    department: keyof ApprovalTicket["aprobaciones"],
    approved: boolean,
  ) => {
    // Primero actualizamos el estado global de tickets
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const updatedAprobaciones = {
            ...ticket.aprobaciones,
            [department]: {
              ...ticket.aprobaciones[department],
              aprobado: approved,
              usuario: currentUser,
              fecha: approved ? new Date().toISOString().split("T")[0] : null,
              comentarios: approvalComment || (approved ? "Aprobado" : "Rechazado"),
            },
          }

          // Determinar el nuevo estado del ticket
          let newEstado: ApprovalTicket["estado"] = "pendiente"
          const aprobados = Object.values(updatedAprobaciones).filter((a) => a.aprobado).length
          const total = Object.keys(updatedAprobaciones).length

          if (aprobados === total) {
            newEstado = "aprobado"
          } else if (Object.values(updatedAprobaciones).some((a) => a.usuario && !a.aprobado)) {
            newEstado = "rechazado"
          }

          const updatedTicket = {
            ...ticket,
            aprobaciones: updatedAprobaciones,
            estado: newEstado,
          }

          // Actualizar también el ticket seleccionado si coincide con el que estamos modificando
          if (selectedTicket && selectedTicket.id === ticketId) {
            setSelectedTicket(updatedTicket)
          }

          return updatedTicket
        }
        return ticket
      }),
    )

    // Limpiar el comentario después de aprobar/rechazar
    setApprovalComment("")
  }

  // Función para ordenar la tabla
  const requestSort = (key: keyof ApprovalTicket) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Renderizar el estado con un badge de color
  const renderStatusBadge = (status: ApprovalTicket["estado"]) => {
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

  return (
    <div className="container mx-auto p-6">
      {/* Selector de usuario (simulación de inicio de sesión) */}
      <div className="mb-6 p-4 border rounded-md shadow-sm">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">Usuario actual:</span>
            <Select value={currentUser} onValueChange={setCurrentUser}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {userOptions.map((option) => (
                  <SelectItem key={option.name} value={option.name}>
                    {option.name} (
                    {option.department === "contaduria"
                      ? "Contaduría"
                      : option.department === "legales"
                        ? "Legales"
                        : option.department === "tesoreria"
                          ? "Tesorería"
                          : option.department === "gerenciaComercial"
                            ? "Gerencia Comercial"
                            : option.department === "gerencia"
                              ? "Gerencia"
                              : option.department === "arquitecto"
                                ? "Arquitecto"
                                : ""}
                    )
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Departamento:</span>
            <Badge>
              {currentDepartment === "contaduria"
                ? "Contaduría"
                : currentDepartment === "legales"
                  ? "Legales"
                  : currentDepartment === "tesoreria"
                    ? "Tesorería"
                    : currentDepartment === "gerenciaComercial"
                      ? "Gerencia Comercial"
                      : currentDepartment === "gerencia"
                        ? "Gerencia"
                        : currentDepartment === "arquitecto"
                          ? "Arquitecto"
                          : ""}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Aprobaciones</h1>
        <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Ticket de Aprobación</DialogTitle>
              <DialogDescription>Complete el formulario para crear un nuevo ticket de aprobación.</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="form">Formulario</TabsTrigger>
                  <TabsTrigger value="preview">Vista Previa PDF</TabsTrigger>
                </TabsList>

                <TabsContent value="form">
                  <Alert className="mb-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Complete el formulario con la información que desea incluir en el PDF. Todos los datos que ingrese
                      serán utilizados para generar un documento siguiendo el formato estándar.
                    </AlertDescription>
                  </Alert>
                  <FormDataInput formData={formData} onChange={handleFormDataChange} />
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setActiveTab("preview")}>Continuar a Vista Previa</Button>
                  </div>
                </TabsContent>

                <TabsContent value="preview">
                  <PDFViewer formData={formData} />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveTab("form")}>
                      Volver al Formulario
                    </Button>
                    <Button
                      onClick={() => {
                        handleCreateTicket(formData)
                        setFormData(initialFormData)
                        setActiveTab("dashboard")
                        setStatusFilter("todos")
                      }}
                    >
                      Crear Ticket
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="todos" onClick={() => setStatusFilter("todos")}>
              Todos
            </TabsTrigger>
            <TabsTrigger value="pendiente" onClick={() => setStatusFilter("pendiente")}>
              <Clock className="mr-2 h-4 w-4" />
              Pendientes
            </TabsTrigger>
            <TabsTrigger value="aprobado" onClick={() => setStatusFilter("aprobado")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Aprobados
            </TabsTrigger>
            <TabsTrigger value="rechazado" onClick={() => setStatusFilter("rechazado")}>
              <AlertCircle className="mr-2 h-4 w-4" />
              Rechazados
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar tickets..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="fecha" onValueChange={(value) => requestSort(value as keyof ApprovalTicket)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fechaCreacion">Fecha de creación</SelectItem>
                <SelectItem value="emprendimiento">Emprendimiento</SelectItem>
                <SelectItem value="estado">Estado</SelectItem>
                <SelectItem value="id">Número de ticket</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="todos" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("id")}>
                        ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("title")}>
                        Título
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("emprendimiento")}>
                        Emprendimiento
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("unidadFuncional")}>
                        Unidad
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("fechaCreacion")}>
                        Fecha
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("estado")}>
                        Estado
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No se encontraron tickets que coincidan con los criterios de búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => {
                      // Calcular progreso de aprobaciones
                      const totalDepts = Object.keys(ticket.aprobaciones).length
                      const approvedDepts = Object.values(ticket.aprobaciones).filter((a) => a.aprobado).length
                      const progress = Math.round((approvedDepts / totalDepts) * 100)

                      return (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.emprendimiento}</TableCell>
                          <TableCell>{ticket.unidadFuncional}</TableCell>
                          <TableCell>{new Date(ticket.fechaCreacion).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStatusBadge(ticket.estado)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    progress === 100 ? "bg-green-500" : progress > 0 ? "bg-blue-500" : "bg-gray-300"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setIsViewTicketDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Las demás pestañas usan el mismo contenido pero con filtros diferentes */}
        <TabsContent value="pendiente" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("id")}>
                        ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("title")}>
                        Título
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("emprendimiento")}>
                        Emprendimiento
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("unidadFuncional")}>
                        Unidad
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("fechaCreacion")}>
                        Fecha
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("estado")}>
                        Estado
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No se encontraron tickets que coincidan con los criterios de búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => {
                      // Calcular progreso de aprobaciones
                      const totalDepts = Object.keys(ticket.aprobaciones).length
                      const approvedDepts = Object.values(ticket.aprobaciones).filter((a) => a.aprobado).length
                      const progress = Math.round((approvedDepts / totalDepts) * 100)

                      return (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.emprendimiento}</TableCell>
                          <TableCell>{ticket.unidadFuncional}</TableCell>
                          <TableCell>{new Date(ticket.fechaCreacion).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStatusBadge(ticket.estado)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    progress === 100 ? "bg-green-500" : progress > 0 ? "bg-blue-500" : "bg-gray-300"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setIsViewTicketDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aprobado" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("id")}>
                        ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("title")}>
                        Título
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("emprendimiento")}>
                        Emprendimiento
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("unidadFuncional")}>
                        Unidad
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("fechaCreacion")}>
                        Fecha
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("estado")}>
                        Estado
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No se encontraron tickets que coincidan con los criterios de búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => {
                      // Calcular progreso de aprobaciones
                      const totalDepts = Object.keys(ticket.aprobaciones).length
                      const approvedDepts = Object.values(ticket.aprobaciones).filter((a) => a.aprobado).length
                      const progress = Math.round((approvedDepts / totalDepts) * 100)

                      return (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.emprendimiento}</TableCell>
                          <TableCell>{ticket.unidadFuncional}</TableCell>
                          <TableCell>{new Date(ticket.fechaCreacion).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStatusBadge(ticket.estado)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    progress === 100 ? "bg-green-500" : progress > 0 ? "bg-blue-500" : "bg-gray-300"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setIsViewTicketDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rechazado" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("id")}>
                        ID
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("title")}>
                        Título
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("emprendimiento")}>
                        Emprendimiento
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("unidadFuncional")}>
                        Unidad
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("fechaCreacion")}>
                        Fecha
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center cursor-pointer" onClick={() => requestSort("estado")}>
                        Estado
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No se encontraron tickets que coincidan con los criterios de búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => {
                      // Calcular progreso de aprobaciones
                      const totalDepts = Object.keys(ticket.aprobaciones).length
                      const approvedDepts = Object.values(ticket.aprobaciones).filter((a) => a.aprobado).length
                      const progress = Math.round((approvedDepts / totalDepts) * 100)

                      return (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.title}</TableCell>
                          <TableCell>{ticket.emprendimiento}</TableCell>
                          <TableCell>{ticket.unidadFuncional}</TableCell>
                          <TableCell>{new Date(ticket.fechaCreacion).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStatusBadge(ticket.estado)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    progress === 100 ? "bg-green-500" : progress > 0 ? "bg-blue-500" : "bg-gray-300"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs">{progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicket(ticket)
                                  setIsViewTicketDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para ver y aprobar un ticket */}
      <Dialog open={isViewTicketDialogOpen} onOpenChange={setIsViewTicketDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>
                    {selectedTicket.title} - {selectedTicket.id}
                  </span>
                  {renderStatusBadge(selectedTicket.estado)}
                </DialogTitle>
                <DialogDescription>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="font-medium">Emprendimiento:</span> {selectedTicket.emprendimiento}
                    </div>
                    <div>
                      <span className="font-medium">Unidad:</span> {selectedTicket.unidadFuncional}
                    </div>
                    <div>
                      <span className="font-medium">Creado:</span>{" "}
                      {new Date(selectedTicket.fechaCreacion).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Por:</span> {selectedTicket.creador}
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">
                    <FileText className="mr-2 h-4 w-4" />
                    Información
                  </TabsTrigger>
                  <TabsTrigger value="approvals">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Firmas
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    <Eye className="mr-2 h-4 w-4" />
                    Vista Previa
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <Calendar className="mr-2 h-4 w-4" />
                    Historial
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información del Documento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="font-medium">Tipo de Documento:</dt>
                            <dd>
                              {selectedTicket.formData.tipoDocumento === "boleto"
                                ? "Boleto de Compraventa"
                                : selectedTicket.formData.tipoDocumento === "cesion"
                                  ? "Cesión de Derechos"
                                  : selectedTicket.formData.tipoDocumento === "reserva"
                                    ? "Reserva"
                                    : selectedTicket.formData.tipoDocumento === "mutuo"
                                      ? "Mutuo"
                                      : selectedTicket.formData.tipoDocumento === "locacion"
                                        ? "Locación de Obra"
                                        : "Otro"}
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Emprendimiento:</dt>
                            <dd>{selectedTicket.formData.emprendimiento}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Unidad Funcional:</dt>
                            <dd>{selectedTicket.formData.unidadFuncional}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Quien Vende:</dt>
                            <dd>{selectedTicket.formData.quienVende}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Fecha de Firma:</dt>
                            <dd>{selectedTicket.formData.fechaFirma}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">M2 Totales:</dt>
                            <dd>{selectedTicket.formData.m2.totales}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Información del Comprador</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="font-medium">Nombre:</dt>
                            <dd>{selectedTicket.formData.comprador.nombre}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">DNI:</dt>
                            <dd>{selectedTicket.formData.comprador.dni}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">CUIT:</dt>
                            <dd>{selectedTicket.formData.comprador.cuit}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Dirección:</dt>
                            <dd>{selectedTicket.formData.comprador.direccion}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Email:</dt>
                            <dd>{selectedTicket.formData.comprador.mail}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Teléfono:</dt>
                            <dd>{selectedTicket.formData.comprador.telefono}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>

                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle>Información de Precio y Forma de Pago</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <dl className="space-y-2">
                          <div className="flex justify-between">
                            <dt className="font-medium">Valor de Venta Total:</dt>
                            <dd>USD {selectedTicket.formData.precio.valorVentaTotal}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Valor UF/UFs:</dt>
                            <dd>USD {selectedTicket.formData.precio.valorUF}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Valor CHs + Baulera:</dt>
                            <dd>USD {selectedTicket.formData.precio.valorCHBaulera}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Valor de Venta "A":</dt>
                            <dd>USD {selectedTicket.formData.precio.valorVentaA}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">US$/M2:</dt>
                            <dd>USD {selectedTicket.formData.precio.valorM2}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="font-medium">Forma de Pago:</dt>
                            <dd className="text-right">{selectedTicket.formData.precio.formaPago}</dd>
                          </div>
                        </dl>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="approvals">
                  <Card>
                    <CardHeader>
                      <CardTitle>Firmas Digitales</CardTitle>
                      <CardDescription>Las siguientes áreas deben aprobar este documento</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(selectedTicket.aprobaciones).map(([dept, approval]) => {
                          const deptName = {
                            contaduria: "Contaduría",
                            legales: "Legales",
                            tesoreria: "Tesorería",
                            gerenciaComercial: "Gerencia Comercial",
                            gerencia: "Gerencia",
                            arquitecto: "Arquitecto",
                          }[dept as keyof typeof selectedTicket.aprobaciones]

                          const isCurrentUserDept = currentDepartment === dept

                          return (
                            <Card
                              key={dept}
                              className={`border-l-4 ${
                                approval.aprobado
                                  ? "border-l-green-500"
                                  : approval.usuario && !approval.aprobado
                                    ? "border-l-red-500"
                                    : "border-l-gray-300"
                              }`}
                            >
                              <CardHeader className="p-4">
                                <CardTitle className="text-base flex items-center justify-between">
                                  {deptName}
                                  {approval.aprobado ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : approval.usuario && !approval.aprobado ? (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  ) : (
                                    <Clock className="h-5 w-5 text-gray-400" />
                                  )}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                {approval.usuario ? (
                                  <div className="space-y-2">
                                    <p className="text-sm">
                                      <span className="font-medium">Firmado por:</span> {approval.usuario}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Fecha:</span>{" "}
                                      {approval.fecha ? new Date(approval.fecha).toLocaleDateString() : "N/A"}
                                    </p>
                                    <p className="text-sm">
                                      <span className="font-medium">Comentarios:</span>{" "}
                                      {approval.comentarios || "Sin comentarios"}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <p className="text-sm text-gray-500">Pendiente de firma</p>
                                    {isCurrentUserDept ? (
                                      <>
                                        <Textarea
                                          placeholder="Añadir comentarios (opcional)"
                                          className="mb-2"
                                          value={approvalComment}
                                          onChange={(e) => setApprovalComment(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={() =>
                                              handleApproveTicket(
                                                selectedTicket.id,
                                                dept as keyof ApprovalTicket["aprobaciones"],
                                                true,
                                              )
                                            }
                                          >
                                            Aprobar
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() =>
                                              handleApproveTicket(
                                                selectedTicket.id,
                                                dept as keyof ApprovalTicket["aprobaciones"],
                                                false,
                                              )
                                            }
                                          >
                                            Rechazar
                                          </Button>
                                        </div>
                                      </>
                                    ) : (
                                      <p className="text-xs text-gray-500">
                                        Solo el departamento de {deptName} puede firmar esta sección
                                      </p>
                                    )}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview">
                  <Card>
                    <CardContent className="p-6">
                      <PDFViewer formData={selectedTicket.formData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de Actividad</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Generar historial basado en las aprobaciones */}
                        <div className="border-l-2 border-gray-200 pl-4 space-y-6">
                          <div className="relative">
                            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-500"></div>
                            <p className="text-sm font-medium">Ticket creado</p>
                            <p className="text-xs text-gray-500">
                              {new Date(selectedTicket.fechaCreacion).toLocaleDateString()} - {selectedTicket.creador}
                            </p>
                          </div>

                          {Object.entries(selectedTicket.aprobaciones)
                            .filter(([_, approval]) => approval.usuario)
                            .sort((a, b) => {
                              if (!a[1].fecha) return 1
                              if (!b[1].fecha) return -1
                              return new Date(b[1].fecha).getTime() - new Date(a[1].fecha).getTime()
                            })
                            .map(([dept, approval]) => {
                              const deptName = {
                                contaduria: "Contaduría",
                                legales: "Legales",
                                tesoreria: "Tesorería",
                                gerenciaComercial: "Gerencia Comercial",
                                gerencia: "Gerencia",
                                arquitecto: "Arquitecto",
                              }[dept as keyof typeof selectedTicket.aprobaciones]

                              return (
                                <div key={dept} className="relative">
                                  <div
                                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${
                                      approval.aprobado ? "bg-green-500" : "bg-red-500"
                                    }`}
                                  ></div>
                                  <p className="text-sm font-medium">
                                    {deptName} - {approval.aprobado ? "Aprobado" : "Rechazado"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {approval.fecha ? new Date(approval.fecha).toLocaleDateString() : "N/A"} -{" "}
                                    {approval.usuario}
                                  </p>
                                  {approval.comentarios && <p className="text-xs mt-1">{approval.comentarios}</p>}
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewTicketDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    // Lógica para descargar el PDF
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function DashboardView() {
  return <ApprovalDashboard />
}

