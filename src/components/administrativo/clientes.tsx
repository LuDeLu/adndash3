"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, ChevronDown, Send, ChevronLeft, ChevronRight, Search, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

// Initialize Notyf
let notyf: Notyf

if (typeof window !== "undefined") {
  notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
    types: [
      {
        type: "info",
        background: "blue",
        icon: {
          className: "notyf__icon--info",
          tagName: "i",
          text: "ℹ",
        },
      },
    ],
  })
}

type Cliente = {
  id: string
  nombre: string
  apellido: string
  tipo: string
  agencia_inmobiliaria_id?: number
  caracteristica: string
  telefono: string
  email: string
  como_nos_conocio: string
  metros_min: string
  metros_max: string
  precio_min: string
  precio_max: string
  rango_edad: string
  estado: string
  dato_extra: string
  ultimo_contacto: string | null
  proximo_contacto: string | null
  recomendacion?: string
  emprendimientos: number[]
  tipologias: number[]
  fecha_creacion?: string
}

type AgenciaInmobiliaria = {
  id: number
  nombre: string
}

type Emprendimiento = {
  id: number
  nombre: string
}

type Tipologia = {
  id: number
  nombre: string
}

type Departamento = {
  id: string
  emprendimiento: string
  tipologia: string
}

const API_BASE_URL = "https://adndashboard.squareweb.app/api"

const departamentos: Departamento[] = [
  { id: "302", emprendimiento: "Palermo Residence", tipologia: "4 ambientes" },
  { id: "501", emprendimiento: "Palermo Boulevard", tipologia: "2 dormitorios" },
  { id: "201", emprendimiento: "Business Plaza", tipologia: "Local" },
  { id: "503", emprendimiento: "Palermo Apartments", tipologia: "1 dormitorio" },
  { id: "200", emprendimiento: "Suites & Residence", tipologia: "2 dormitorios" },
  { id: "303", emprendimiento: "Palermo Boulevard", tipologia: "3 dormitorios" },
]

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [agenciasInmobiliarias, setAgenciasInmobiliarias] = useState<AgenciaInmobiliaria[]>([])
  const [emprendimientos, setEmprendimientos] = useState<Emprendimiento[]>([])
  const [tipologias, setTipologias] = useState<Tipologia[]>([])
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [tabActual, setTabActual] = useState("detalles")
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null)
  const [dialogoEnvioAbierto, setDialogoEnvioAbierto] = useState(false)
  const [departamentosSeleccionados, setDepartamentosSeleccionados] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<{ id: string; message: string }[]>([])
  const [isMobileView, setIsMobileView] = useState(false)

  const [openDropdowns, setOpenDropdowns] = useState({
    tipo: false,
    emprendimientos: false,
    tipologias: false,
    estado: false,
  })

  const [filtros, setFiltros] = useState<{
    tipo: string[]
    emprendimientos: string[]
    tipologias: string[]
    estado: string[]
  }>({
    tipo: [],
    emprendimientos: [],
    tipologias: [],
    estado: [],
  })
  const [clientesFiltrados, setClientesFiltrados] = useState<Cliente[]>(clientes)

  const clienteVacio: Cliente = {
    id: "",
    nombre: "",
    apellido: "",
    tipo: "Consumidor final",
    caracteristica: "",
    telefono: "",
    email: "",
    como_nos_conocio: "",
    metros_min: "",
    metros_max: "",
    precio_min: "",
    precio_max: "",
    rango_edad: "",
    estado: "Pendiente",
    dato_extra: "",
    ultimo_contacto: null,
    proximo_contacto: null,
    emprendimientos: [],
    tipologias: [],
  }

  const [nuevoCliente, setNuevoCliente] = useState<Cliente>(clienteVacio)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [notificationCount, setNotificationCount] = useState(0)

  // Detectar vista móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    fetchClientes()
    fetchAgenciasInmobiliarias()
    fetchEmprendimientos()
    fetchTipologias()
  }, [])

  useEffect(() => {
    const nuevosFiltrados = clientes.filter((cliente) => {
      const searchTerms = searchTerm.toLowerCase().split(" ")
      const matchesSearch = searchTerms.every((term) =>
        Object.values(cliente).some((value) => typeof value === "string" && value.toLowerCase().includes(term)),
      )
      return (
        matchesSearch &&
        (filtros.tipo.length === 0 || filtros.tipo.includes(cliente.tipo)) &&
        (filtros.emprendimientos.length === 0 ||
          cliente.emprendimientos.some((empId) => filtros.emprendimientos.includes(empId.toString()))) &&
        (filtros.tipologias.length === 0 ||
          cliente.tipologias.some((tipId) => filtros.tipologias.includes(tipId.toString()))) &&
        (filtros.estado.length === 0 || filtros.estado.includes(cliente.estado))
      )
    })
    setClientesFiltrados(nuevosFiltrados)
  }, [clientes, filtros, searchTerm])

  const fetchClientes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Error al obtener clientes")
      }
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error("Error:", error)
      notyf.error("Error al cargar clientes")
    }
  }

  const fetchAgenciasInmobiliarias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agencias/inmobiliarias`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Error al obtener agencias inmobiliarias")
      }
      const data = await response.json()
      setAgenciasInmobiliarias(data)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const fetchEmprendimientos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agencias/emprendimientos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Error al obtener emprendimientos")
      }
      const data = await response.json()
      setEmprendimientos(data)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const fetchTipologias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/agencias/tipologias`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Error al obtener tipologías")
      }
      const data = await response.json()
      setTipologias(data)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (modoEdicion && clienteEditando) {
        const response = await fetch(`${API_BASE_URL}/clientes/${clienteEditando.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(clienteEditando),
        })
        if (!response.ok) {
          throw new Error("Error al actualizar cliente")
        }
        notyf.success("Cliente actualizado exitosamente")
      } else {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(nuevoCliente),
        })
        if (!response.ok) {
          throw new Error("Error al crear cliente")
        }
        notyf.success("Cliente creado exitosamente")
      }
      fetchClientes()
      setDialogoAbierto(false)
      setNuevoCliente(clienteVacio)
      setClienteEditando(null)
      setModoEdicion(false)
    } catch (error) {
      console.error("Error:", error)
      notyf.error("Error al guardar cliente")
    }
  }

  const handleBorrar = async (id: string) => {
    setClienteToDelete(id)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (clienteToDelete) {
      try {
        const response = await fetch(`${API_BASE_URL}/clientes/${clienteToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!response.ok) {
          throw new Error("Error al borrar cliente")
        }
        fetchClientes()
        notyf.success("Cliente eliminado exitosamente")
      } catch (error) {
        console.error("Error:", error)
        notyf.error("Error al eliminar cliente")
      }
    }
    setDeleteConfirmOpen(false)
    setClienteToDelete(null)
  }

  const handleEnviarFicha = async (cliente: Cliente) => {
    setClienteSeleccionado(cliente)
    setDialogoEnvioAbierto(true)
    setDepartamentosSeleccionados([])

    const now = new Date()
    const nextContactDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${cliente.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ultimo_contacto: now.toISOString(),
          proximo_contacto: nextContactDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar fechas de contacto")
      }

      setClientes(
        clientes.map((c) =>
          c.id === cliente.id
            ? { ...c, ultimo_contacto: now.toISOString(), proximo_contacto: nextContactDate.toISOString() }
            : c,
        ),
      )
      notyf.success("Fechas de contacto actualizadas")
    } catch (error) {
      console.error("Error:", error)
      notyf.error("Error al actualizar fechas de contacto")
    }
  }

  const handleSeleccionarDepartamento = (id: string) => {
    setDepartamentosSeleccionados((prev) => (prev.includes(id) ? prev.filter((depId) => depId !== id) : [...prev, id]))
  }

  const enviarPorWhatsApp = async () => {
    if (clienteSeleccionado) {
      const departamentosInfo = departamentosSeleccionados
        .map((id) => {
          const dep = departamentos.find((d) => d.id === id)
          return `${dep?.emprendimiento} - ${dep?.tipologia} (${id})`
        })
        .join(", ")
      const mensaje = `Hola ${clienteSeleccionado.nombre}, aquí tienes información sobre los departamentos seleccionados: ${departamentosInfo}. https://adndevelopers.com.ar/ficha302/`

      const phoneNumber = `54${clienteSeleccionado.caracteristica}${clienteSeleccionado.telefono}`

      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`
      window.open(url, "_blank")
      notyf.success("Mensaje de WhatsApp enviado")
    }
  }

  const enviarPorEmail = async () => {
    if (clienteSeleccionado) {
      const departamentosInfo = departamentosSeleccionados
        .map((id) => {
          const dep = departamentos.find((d) => d.id === id)
          return `${dep?.emprendimiento} - ${dep?.tipologia} (${id})`
        })
        .join("\n")
      const asunto = "Información sobre departamentos"
      const cuerpo = `Estimado/a ${clienteSeleccionado.nombre},\n\nAquí tienes información sobre los departamentos seleccionados:\n\n${departamentosInfo}`
      const mailtoLink = `mailto:${clienteSeleccionado.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
      window.location.href = mailtoLink
      notyf.success("Email enviado")
    }
  }

  const exportarPDF = () => {
    const doc = new jsPDF()
    const exportData = clientes.map((c) => ({
      Nombre: `${c.nombre} ${c.apellido}`,
      Tipo: c.tipo,
      Teléfono: `${c.caracteristica}-${c.telefono}`,
      Email: c.email,
      "Cómo nos conoció": c.como_nos_conocio,
      Metros: `${c.metros_min}-${c.metros_max}`,
      Precio: `${c.precio_min}-${c.precio_max}`,
      "Rango de edad": c.rango_edad,
      Estado: c.estado,
      "Dato extra": c.dato_extra,
    }))
    const columns = Object.keys(exportData[0])

    autoTable(doc, {
      head: [columns],
      body: exportData.map(Object.values),
      styles: { overflow: "linebreak", cellWidth: "wrap" },
    })

    doc.save("clientes.pdf")
    notyf.success("PDF exportado exitosamente")
  }

  const exportarExcel = () => {
    const exportData = clientes.map((c) => ({
      Nombre: `${c.nombre} ${c.apellido}`,
      Tipo: c.tipo,
      Teléfono: `${c.caracteristica}-${c.telefono}`,
      Email: c.email,
      "Cómo nos conoció": c.como_nos_conocio,
      Metros: `${c.metros_min}-${c.metros_max}`,
      Precio: `${c.precio_min}-${c.precio_max}`,
      "Rango de edad": c.rango_edad,
      Estado: c.estado,
      "Dato extra": c.dato_extra,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes")
    XLSX.writeFile(workbook, "clientes.xlsx")
    notyf.success("Excel exportado exitosamente")
  }

  const getEmprendimientosNames = (empIds: number[]) => {
    return empIds
      .map((id) => emprendimientos.find((emp) => emp.id === id)?.nombre)
      .filter(Boolean)
      .join(", ")
  }

  const getTipologiasNames = (tipIds: number[]) => {
    return tipIds
      .map((id) => tipologias.find((tip) => tip.id === id)?.nombre)
      .filter(Boolean)
      .join(", ")
  }

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date()
      const newNotifications = clientes
        .filter((cliente) => {
          if (cliente.proximo_contacto && new Date(cliente.proximo_contacto) <= now) {
            return true
          }
          return false
        })
        .map((cliente) => ({
          id: cliente.id,
          message: `Es hora de contactar a ${cliente.nombre} ${cliente.apellido}. Último contacto: ${cliente.ultimo_contacto ? new Date(cliente.ultimo_contacto).toLocaleDateString() : "No registrado"}`,
        }))
      setNotifications(newNotifications)
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [clientes])

  const handleNotificationClick = (clienteId: string) => {
    const cliente = clientes.find((c) => c.id === clienteId)
    if (cliente) {
      handleEnviarFicha(cliente)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = clientesFiltrados.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    if (modoEdicion && clienteEditando) {
      setClienteEditando({
        ...clienteEditando,
        [id]: value,
      })
    } else {
      setNuevoCliente({
        ...nuevoCliente,
        [id]: value,
      })
    }
  }

  const handleSelectChange = (value: string, field: keyof Cliente) => {
    if (modoEdicion && clienteEditando) {
      setClienteEditando({
        ...clienteEditando,
        [field]: field === "agencia_inmobiliaria_id" ? Number.parseInt(value) : value,
      })
    } else {
      setNuevoCliente({
        ...nuevoCliente,
        [field]: field === "agencia_inmobiliaria_id" ? Number.parseInt(value) : value,
      })
    }
  }

  const handleMultiSelectChange = (checked: boolean, id: number, field: "emprendimientos" | "tipologias") => {
    if (modoEdicion && clienteEditando) {
      setClienteEditando({
        ...clienteEditando,
        [field]: checked
          ? [...(clienteEditando[field] || []), id]
          : (clienteEditando[field] || []).filter((item) => item !== id),
      })
    } else {
      setNuevoCliente({
        ...nuevoCliente,
        [field]: checked
          ? [...(nuevoCliente[field] || []), id]
          : (nuevoCliente[field] || []).filter((item) => item !== id),
      })
    }
  }

  const toggleDropdown = (dropdown: keyof typeof openDropdowns) => {
    setOpenDropdowns((prev) => ({ ...prev, [dropdown]: !prev[dropdown] }))
  }

  const handleFiltroChange = (tipo: keyof typeof filtros, valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [tipo]: prev[tipo].includes(valor) ? prev[tipo].filter((v) => v !== valor) : [...prev[tipo], valor],
    }))
    // No cerramos el dropdown aquí
  }

  const handleEditar = (cliente: Cliente) => {
    setClienteEditando(cliente)
    setModoEdicion(true)
    setDialogoAbierto(true)
  }

  // Componente de tarjeta para vista móvil
  const ClienteCard = ({ cliente }: { cliente: Cliente }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {cliente.nombre} {cliente.apellido}
            </CardTitle>
            <CardDescription className="text-sm mt-1">
              {cliente.tipo} • {cliente.caracteristica}-{cliente.telefono}
            </CardDescription>
          </div>
          <Badge variant={cliente.estado === "Completo" ? "default" : "secondary"}>{cliente.estado}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mt-3">
          <div>
            <span className="font-medium">Email:</span>
            <p className="text-muted-foreground truncate">{cliente.email}</p>
          </div>
          <div>
            <span className="font-medium">Conoció por:</span>
            <p className="text-muted-foreground">{cliente.como_nos_conocio}</p>
          </div>
          <div>
            <span className="font-medium">Metros:</span>
            <p className="text-muted-foreground">
              {cliente.metros_min}-{cliente.metros_max}
            </p>
          </div>
          <div>
            <span className="font-medium">Precio:</span>
            <p className="text-muted-foreground">
              {cliente.precio_min}-{cliente.precio_max}
            </p>
          </div>
        </div>

        {(getEmprendimientosNames(cliente.emprendimientos) || getTipologiasNames(cliente.tipologias)) && (
          <div className="mt-3 text-sm">
            {getEmprendimientosNames(cliente.emprendimientos) && (
              <div>
                <span className="font-medium">Emprendimientos:</span>
                <p className="text-muted-foreground">{getEmprendimientosNames(cliente.emprendimientos)}</p>
              </div>
            )}
            {getTipologiasNames(cliente.tipologias) && (
              <div className="mt-1">
                <span className="font-medium">Tipologías:</span>
                <p className="text-muted-foreground">{getTipologiasNames(cliente.tipologias)}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={() => handleEditar(cliente)}>
            <Pencil className="h-3 w-3 mr-1" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleBorrar(cliente.id)}>
            <Trash2 className="h-3 w-3 mr-1" />
            Eliminar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleEnviarFicha(cliente)}>
            <Send className="h-3 w-3 mr-1" />
            Enviar
          </Button>
        </div>
      </CardHeader>
    </Card>
  )

  return (
    <div className="flex flex-col p-2 md:p-4 lg:p-6 space-y-4 md:space-y-6">
      {/* Cards de estadísticas - mejoradas para móvil */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Clientes totales</CardTitle>
            <CardDescription className="text-lg md:text-xl font-bold">{clientes.length}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Por mes</CardTitle>
            <CardDescription className="text-lg md:text-xl font-bold">
              {Math.floor(clientes.length / 2)}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Pendientes</CardTitle>
            <CardDescription className="text-lg md:text-xl font-bold">
              {clientes.filter((c) => c.estado === "Pendiente").length}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="p-3 md:p-6">
            <CardTitle className="text-sm md:text-base">Finalizados</CardTitle>
            <CardDescription className="text-lg md:text-xl font-bold">
              {clientes.filter((c) => c.estado === "Completo").length}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Controles superiores - mejorados para móvil */}
      <div className="flex flex-col space-y-4">
        {/* Primera fila: Botón añadir y acciones */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setModoEdicion(false)
                  setNuevoCliente(clienteVacio)
                }}
                className="w-full sm:w-auto"
              >
                Añadir Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{modoEdicion ? "Editar Cliente" : "Añadir Cliente"}</DialogTitle>
                <DialogDescription>
                  {modoEdicion ? "Modifica los detalles del cliente." : "Ingresa los detalles del nuevo cliente."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <Tabs value={tabActual} onValueChange={setTabActual}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="detalles" className="text-xs md:text-sm">
                      Detalles
                    </TabsTrigger>
                    <TabsTrigger value="busqueda" className="text-xs md:text-sm">
                      Búsqueda
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="detalles">
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="nombre" className="md:text-right">
                          Nombre
                        </Label>
                        <Input
                          id="nombre"
                          required
                          value={modoEdicion ? clienteEditando?.nombre : nuevoCliente.nombre}
                          onChange={handleInputChange}
                          placeholder="Nombre del cliente"
                          className="md:col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="apellido" className="md:text-right">
                          Apellido
                        </Label>
                        <Input
                          id="apellido"
                          required
                          value={modoEdicion ? clienteEditando?.apellido : nuevoCliente.apellido}
                          onChange={handleInputChange}
                          placeholder="Apellido del cliente"
                          className="md:col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="tipo" className="md:text-right">
                          Tipo de cliente
                        </Label>
                        <Select
                          onValueChange={(value) => handleSelectChange(value, "tipo")}
                          value={modoEdicion ? clienteEditando?.tipo : nuevoCliente.tipo}
                        >
                          <SelectTrigger className="md:col-span-3">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Consumidor final">Consumidor final</SelectItem>
                            <SelectItem value="Inversor">Inversor</SelectItem>
                            <SelectItem value="Inmobiliaria">Inmobiliaria</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {(modoEdicion ? clienteEditando?.tipo : nuevoCliente.tipo) === "Inmobiliaria" && (
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                          <Label htmlFor="agencia_inmobiliaria_id" className="md:text-right">
                            Agencia Inmobiliaria
                          </Label>
                          <Select
                            onValueChange={(value) => handleSelectChange(value, "agencia_inmobiliaria_id")}
                            value={
                              modoEdicion
                                ? clienteEditando?.agencia_inmobiliaria_id?.toString()
                                : nuevoCliente.agencia_inmobiliaria_id?.toString()
                            }
                          >
                            <SelectTrigger className="md:col-span-3">
                              <SelectValue placeholder="Seleccionar agencia" />
                            </SelectTrigger>
                            <SelectContent>
                              {agenciasInmobiliarias.map((agencia) => (
                                <SelectItem key={agencia.id} value={agencia.id.toString()}>
                                  {agencia.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="caracteristica" className="md:text-right text-sm">
                          Característica
                        </Label>
                        <Input
                          id="caracteristica"
                          value={modoEdicion ? clienteEditando?.caracteristica : nuevoCliente.caracteristica}
                          onChange={handleInputChange}
                          placeholder="Ej: 11"
                          className="col-span-1"
                        />
                        <Label htmlFor="telefono" className="md:text-right text-sm">
                          Teléfono
                        </Label>
                        <Input
                          id="telefono"
                          required
                          value={modoEdicion ? clienteEditando?.telefono : nuevoCliente.telefono}
                          onChange={handleInputChange}
                          placeholder="Número de teléfono"
                          className="col-span-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="email" className="md:text-right">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={modoEdicion ? clienteEditando?.email : nuevoCliente.email}
                          onChange={handleInputChange}
                          placeholder="Email del cliente"
                          className="md:col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="como_nos_conocio" className="md:text-right">
                          ¿Cómo nos conoció?
                        </Label>
                        <Select
                          onValueChange={(value) => handleSelectChange(value, "como_nos_conocio")}
                          value={modoEdicion ? clienteEditando?.como_nos_conocio : nuevoCliente.como_nos_conocio}
                        >
                          <SelectTrigger className="md:col-span-3">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Referido">Referido</SelectItem>
                            <SelectItem value="Pauta">Pauta</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Vía pública">Vía pública</SelectItem>
                            <SelectItem value="ZonaProp">ZonaProp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="rango_edad" className="md:text-right">
                          Rango de edad
                        </Label>
                        <Select
                          onValueChange={(value) => handleSelectChange(value, "rango_edad")}
                          value={modoEdicion ? clienteEditando?.rango_edad : nuevoCliente.rango_edad}
                        >
                          <SelectTrigger className="md:col-span-3">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20-30">20-30</SelectItem>
                            <SelectItem value="30-40">30-40</SelectItem>
                            <SelectItem value="40-50">40-50</SelectItem>
                            <SelectItem value="50-60">50-60</SelectItem>
                            <SelectItem value="+60">+60</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="busqueda">
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                        <Label className="md:text-right">Emprendimientos</Label>
                        <div className="md:col-span-3 space-y-2 max-h-32 overflow-y-auto">
                          {emprendimientos.length > 0 ? (
                            emprendimientos.map((emprendimiento) => (
                              <div key={emprendimiento.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`emprendimiento-${emprendimiento.id}`}
                                  checked={(
                                    (modoEdicion ? clienteEditando?.emprendimientos : nuevoCliente.emprendimientos) ||
                                    []
                                  ).includes(emprendimiento.id)}
                                  onCheckedChange={(checked) =>
                                    handleMultiSelectChange(checked as boolean, emprendimiento.id, "emprendimientos")
                                  }
                                />
                                <label
                                  htmlFor={`emprendimiento-${emprendimiento.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {emprendimiento.nombre}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p>No hay emprendimientos disponibles</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-2 md:gap-4">
                        <Label className="md:text-right">Tipologías</Label>
                        <div className="md:col-span-3 space-y-2 max-h-32 overflow-y-auto">
                          {tipologias.length > 0 ? (
                            tipologias.map((tipologia) => (
                              <div key={tipologia.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`tipologia-${tipologia.id}`}
                                  checked={(
                                    (modoEdicion ? clienteEditando?.tipologias : nuevoCliente.tipologias) || []
                                  ).includes(tipologia.id)}
                                  onCheckedChange={(checked) =>
                                    handleMultiSelectChange(checked as boolean, tipologia.id, "tipologias")
                                  }
                                />
                                <label
                                  htmlFor={`tipologia-${tipologia.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {tipologia.nombre}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p>No hay tipologías disponibles</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="metros_min" className="md:text-right text-sm">
                          Metros mín:
                        </Label>
                        <Input
                          id="metros_min"
                          value={modoEdicion ? clienteEditando?.metros_min : nuevoCliente.metros_min}
                          onChange={handleInputChange}
                          placeholder="Mínimo"
                          className="col-span-1"
                        />
                        <Label htmlFor="metros_max" className="md:text-right text-sm">
                          Metros máx:
                        </Label>
                        <Input
                          id="metros_max"
                          value={modoEdicion ? clienteEditando?.metros_max : nuevoCliente.metros_max}
                          onChange={handleInputChange}
                          placeholder="Máximo"
                          className="col-span-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="precio_min" className="md:text-right text-sm">
                          Precio mín:
                        </Label>
                        <Input
                          id="precio_min"
                          value={modoEdicion ? clienteEditando?.precio_min : nuevoCliente.precio_min}
                          onChange={handleInputChange}
                          placeholder="Mínimo"
                          className="col-span-1"
                        />
                        <Label htmlFor="precio_max" className="md:text-right text-sm">
                          Precio máx:
                        </Label>
                        <Input
                          id="precio_max"
                          value={modoEdicion ? clienteEditando?.precio_max : nuevoCliente.precio_max}
                          onChange={handleInputChange}
                          placeholder="Máximo"
                          className="col-span-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="estado" className="md:text-right">
                          Estado
                        </Label>
                        <Select
                          onValueChange={(value) => handleSelectChange(value, "estado")}
                          value={modoEdicion ? clienteEditando?.estado : nuevoCliente.estado}
                        >
                          <SelectTrigger className="md:col-span-3">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pendiente">Pendiente</SelectItem>
                            <SelectItem value="En proceso">En proceso</SelectItem>
                            <SelectItem value="Completo">Completo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                        <Label htmlFor="dato_extra" className="md:text-right">
                          Dato extra
                        </Label>
                        <Textarea
                          id="dato_extra"
                          value={modoEdicion ? clienteEditando?.dato_extra : nuevoCliente.dato_extra}
                          onChange={handleInputChange}
                          placeholder="Información adicional"
                          className="md:col-span-3"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter className="mt-4">
                  <Button type="submit" className="w-full sm:w-auto">
                    {modoEdicion ? "Guardar cambios" : "Añadir cliente"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Acciones - mejoradas para móvil */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative bg-transparent">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuCheckboxItem>Notificaciones</DropdownMenuCheckboxItem>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} onSelect={() => handleNotificationClick(notification.id)}>
                      <span className="text-xs">{notification.message}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No hay notificaciones pendientes</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={exportarPDF} variant="outline" size="sm">
              PDF
            </Button>
            <Button onClick={exportarExcel} variant="outline" size="sm">
              Excel
            </Button>
          </div>
        </div>

        {/* Segunda fila: Filtros y búsqueda */}
        <div className="flex flex-col space-y-2">
          {/* Filtros - mejorados para móvil */}
          <div className="flex flex-wrap gap-2">
            <DropdownMenu open={openDropdowns.tipo} onOpenChange={() => toggleDropdown("tipo")}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Tipo <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuCheckboxItem
                  checked={filtros.tipo.includes("Consumidor final")}
                  onCheckedChange={() => handleFiltroChange("tipo", "Consumidor final")}
                >
                  Consumidor final
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtros.tipo.includes("Inversor")}
                  onCheckedChange={() => handleFiltroChange("tipo", "Inversor")}
                >
                  Inversor
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtros.tipo.includes("Inmobiliaria")}
                  onCheckedChange={() => handleFiltroChange("tipo", "Inmobiliaria")}
                >
                  Inmobiliaria
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={openDropdowns.emprendimientos} onOpenChange={() => toggleDropdown("emprendimientos")}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Emprendimientos <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {emprendimientos.map((emprendimiento) => (
                  <DropdownMenuCheckboxItem
                    key={emprendimiento.id}
                    checked={filtros.emprendimientos.includes(emprendimiento.id.toString())}
                    onCheckedChange={() => handleFiltroChange("emprendimientos", emprendimiento.id.toString())}
                  >
                    {emprendimiento.nombre}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={openDropdowns.tipologias} onOpenChange={() => toggleDropdown("tipologias")}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Tipologías <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {tipologias.map((tipologia) => (
                  <DropdownMenuCheckboxItem
                    key={tipologia.id}
                    checked={filtros.tipologias.includes(tipologia.id.toString())}
                    onCheckedChange={() => handleFiltroChange("tipologias", tipologia.id.toString())}
                  >
                    {tipologia.nombre}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu open={openDropdowns.estado} onOpenChange={() => toggleDropdown("estado")}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Estado <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuCheckboxItem
                  checked={filtros.estado.includes("Pendiente")}
                  onCheckedChange={() => handleFiltroChange("estado", "Pendiente")}
                >
                  Pendiente
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtros.estado.includes("En proceso")}
                  onCheckedChange={() => handleFiltroChange("estado", "En proceso")}
                >
                  En proceso
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filtros.estado.includes("Completo")}
                  onCheckedChange={() => handleFiltroChange("estado", "Completo")}
                >
                  Completo
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Búsqueda */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-4 w-4" />
            </Button>
            {isSearchOpen && (
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            )}
          </div>
        </div>
      </div>

      {/* Lista de clientes - Vista adaptativa */}
      {isMobileView ? (
        // Vista móvil: Cards
        <div className="space-y-4">
          {currentItems.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} />
          ))}
        </div>
      ) : (
        // Vista desktop: Tabla
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Emprendimientos</TableHead>
                <TableHead>Tipologías</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>¿Cómo nos conoció?</TableHead>
                <TableHead>Metros</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Rango de edad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Dato extra</TableHead>
                <TableHead>Último Contacto</TableHead>
                <TableHead>Próximo Contacto</TableHead>
                <TableHead>Fecha de Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>
                    {cliente.nombre} {cliente.apellido}
                  </TableCell>
                  <TableCell>{cliente.tipo}</TableCell>
                  <TableCell>{getEmprendimientosNames(cliente.emprendimientos)}</TableCell>
                  <TableCell>{getTipologiasNames(cliente.tipologias)}</TableCell>
                  <TableCell>
                    {cliente.caracteristica}-{cliente.telefono}
                  </TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.como_nos_conocio}</TableCell>
                  <TableCell>
                    {cliente.metros_min}-{cliente.metros_max}
                  </TableCell>
                  <TableCell>
                    {cliente.precio_min}-{cliente.precio_max}
                  </TableCell>
                  <TableCell>{cliente.rango_edad}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.estado === "Completo" ? "default" : "secondary"}>{cliente.estado}</Badge>
                  </TableCell>
                  <TableCell>{cliente.dato_extra}</TableCell>
                  <TableCell>
                    {cliente.ultimo_contacto ? new Date(cliente.ultimo_contacto).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {cliente.proximo_contacto ? new Date(cliente.proximo_contacto).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {cliente.fecha_creacion ? new Date(cliente.fecha_creacion).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditar(cliente)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleBorrar(cliente.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleEnviarFicha(cliente)}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Paginación - mejorada para móvil */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-full sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {Math.ceil(clientesFiltrados.length / itemsPerPage)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= clientesFiltrados.length}
          className="w-full sm:w-auto"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Diálogos existentes */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="w-full sm:w-auto">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogoEnvioAbierto} onOpenChange={setDialogoEnvioAbierto}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar ficha de departamentos</DialogTitle>
            <DialogDescription>Selecciona los departamentos para enviar al cliente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-60 overflow-y-auto">
            {departamentos.map((departamento) => (
              <div key={departamento.id} className="flex items-center space-x-2">
                <Checkbox
                  id={departamento.id}
                  checked={departamentosSeleccionados.includes(departamento.id)}
                  onCheckedChange={() => handleSeleccionarDepartamento(departamento.id)}
                />
                <label
                  htmlFor={departamento.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {departamento.emprendimiento} - {departamento.tipologia} ({departamento.id})
                </label>
              </div>
            ))}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button onClick={enviarPorWhatsApp} className="w-full sm:w-auto">
              Enviar por WhatsApp
            </Button>
            <Button onClick={enviarPorEmail} className="w-full sm:w-auto">
              Enviar por Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
