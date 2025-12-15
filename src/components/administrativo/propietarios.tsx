"use client"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MessageCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  BarChart3,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

type Owner = {
  unitId: string
  projectName: string
  name: string
  email: string
  phone: string
  type: string
  assignedAt: string
}

type ProjectStats = {
  name: string
  key: string
  totalOwners: number
  compradores: number
  inversores: number
  inquilinos: number
  percentage: number
}

const API_BASE_URL = "https://adndashboard.squareweb.app/api"

const PROJECT_NAMES: Record<string, string> = {
  lagos: "Puertos del Lago",
  apart: "Palermo Apartaments",
  beruti: "Torre Beruti",
  boulevard: "Palermo Boulevard",
  suites: "Suites & Residence",
  resi: "Palermo Residence",
}

const PROJECT_COLORS: Record<string, string> = {
  lagos: "bg-blue-500",
  apart: "bg-purple-500",
  beruti: "bg-green-500",
  boulevard: "bg-orange-500",
  suites: "bg-pink-500",
  resi: "bg-teal-500",
}

export function Propietarios() {
  const [propietarios, setPropietarios] = useState<Owner[]>([])
  const [propietarioSeleccionado, setPropietarioSeleccionado] = useState<Owner | null>(null)
  const [dialogoContactoAbierto, setDialogoContactoAbierto] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)

  const [filtros, setFiltros] = useState<{
    proyecto: string[]
    tipo: string[]
    multipleUnits: boolean
  }>({
    proyecto: [],
    tipo: [],
    multipleUnits: false,
  })

  const [sortBy, setSortBy] = useState<"name" | "units" | "date">("name")

  const [propietariosFiltrados, setPropietariosFiltrados] = useState<Owner[]>([])

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
    fetchPropietarios()
  }, [])

  useEffect(() => {
    let nuevosFiltrados = propietarios.filter((propietario) => {
      const searchTerms = searchTerm.toLowerCase().split(" ")
      const matchesSearch = searchTerms.every((term) =>
        Object.values(propietario).some((value) => typeof value === "string" && value.toLowerCase().includes(term)),
      )
      return (
        matchesSearch &&
        (filtros.proyecto.length === 0 || filtros.proyecto.includes(propietario.projectName)) &&
        (filtros.tipo.length === 0 || filtros.tipo.includes(propietario.type))
      )
    })

    // Filter by owners with multiple units
    if (filtros.multipleUnits) {
      const ownerUnitsCount = new Map<string, number>()
      nuevosFiltrados.forEach((p) => {
        const count = ownerUnitsCount.get(p.name) || 0
        ownerUnitsCount.set(p.name, count + 1)
      })
      nuevosFiltrados = nuevosFiltrados.filter((p) => (ownerUnitsCount.get(p.name) || 0) > 1)
    }

    // Apply sorting
    if (sortBy === "units") {
      const ownerUnitsCount = new Map<string, number>()
      nuevosFiltrados.forEach((p) => {
        const count = ownerUnitsCount.get(p.name) || 0
        ownerUnitsCount.set(p.name, count + 1)
      })
      nuevosFiltrados.sort((a, b) => {
        const countA = ownerUnitsCount.get(a.name) || 0
        const countB = ownerUnitsCount.get(b.name) || 0
        return countB - countA
      })
    } else if (sortBy === "date") {
      nuevosFiltrados.sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())
    } else {
      nuevosFiltrados.sort((a, b) => a.name.localeCompare(b.name))
    }

    setPropietariosFiltrados(nuevosFiltrados)
    setCurrentPage(1)
  }, [propietarios, filtros, searchTerm, sortBy])

  const projectStats = useMemo<ProjectStats[]>(() => {
    const stats: ProjectStats[] = []
    const total = propietarios.length

    Object.entries(PROJECT_NAMES).forEach(([key, name]) => {
      const projectOwners = propietarios.filter((p) => p.projectName === key)
      stats.push({
        name,
        key,
        totalOwners: projectOwners.length,
        compradores: projectOwners.filter((p) => p.type === "COMPRADOR").length,
        inversores: projectOwners.filter((p) => p.type === "INVERSOR").length,
        inquilinos: projectOwners.filter((p) => p.type === "INQUILINO").length,
        percentage: total > 0 ? (projectOwners.length / total) * 100 : 0,
      })
    })

    return stats.sort((a, b) => b.totalOwners - a.totalOwners)
  }, [propietarios])

  const ownersWithMultipleUnits = useMemo(() => {
    const ownerUnitsMap = new Map<string, Owner[]>()
    propietarios.forEach((owner) => {
      const units = ownerUnitsMap.get(owner.name) || []
      ownerUnitsMap.set(owner.name, [...units, owner])
    })

    return Array.from(ownerUnitsMap.entries())
      .filter(([_, units]) => units.length > 1)
      .map(([name, units]) => ({
        name,
        unitCount: units.length,
        units,
      }))
      .sort((a, b) => b.unitCount - a.unitCount)
  }, [propietarios])

  const generalStats = useMemo(() => {
    return {
      total: propietarios.length,
      compradores: propietarios.filter((p) => p.type === "COMPRADOR").length,
      inversores: propietarios.filter((p) => p.type === "INVERSOR").length,
      inquilinos: propietarios.filter((p) => p.type === "INQUILINO").length,
      multipleUnits: ownersWithMultipleUnits.length,
      totalUniqueOwners: new Set(propietarios.map((p) => p.name)).size,
    }
  }, [propietarios, ownersWithMultipleUnits])

  const fetchPropietarios = async () => {
    setLoading(true)
    try {
      const projects = ["lagos", "apart", "beruti", "boulevard", "suites", "resi"]
      const allOwners: Owner[] = []

      await Promise.all(
        projects.map(async (projectName) => {
          try {
            const response = await fetch(`${API_BASE_URL}/project-data/${projectName}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            })

            if (response.ok) {
              const data = await response.json()
              if (data.success && data.data.owners) {
                Object.entries(data.data.owners).forEach(([unitId, ownerData]: [string, any]) => {
                  allOwners.push({
                    unitId,
                    projectName,
                    name: ownerData.name || "Sin nombre",
                    email: ownerData.email || "Sin email",
                    phone: ownerData.phone || "Sin teléfono",
                    type: ownerData.type || "COMPRADOR",
                    assignedAt: ownerData.assignedAt || new Date().toISOString(),
                  })
                })
              }
            }
          } catch (error) {
            console.error(`Error fetching ${projectName}:`, error)
          }
        }),
      )

      setPropietarios(allOwners)
      notyf.success(`${allOwners.length} propietarios cargados`)
    } catch (error) {
      console.error("Error:", error)
      notyf.error("Error al cargar propietarios")
    } finally {
      setLoading(false)
    }
  }

  const handleContactarWhatsApp = (propietario: Owner) => {
    const mensaje = `Hola ${propietario.name}, somos de ADN Developers. Nos comunicamos con respecto a su unidad ${propietario.unitId} en ${PROJECT_NAMES[propietario.projectName]}.`
    const phoneNumber = propietario.phone.replace(/\D/g, "")
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`
    window.open(url, "_blank")
    notyf.success("Redirigiendo a WhatsApp")
  }

  const handleContactarEmail = (propietario: Owner) => {
    const asunto = `Información sobre su unidad ${propietario.unitId} - ${PROJECT_NAMES[propietario.projectName]}`
    const cuerpo = `Estimado/a ${propietario.name},\n\nNos comunicamos desde ADN Developers con respecto a su unidad ${propietario.unitId} en el proyecto ${PROJECT_NAMES[propietario.projectName]}.\n\nSaludos cordiales,\nEquipo ADN Developers`
    const mailtoLink = `mailto:${propietario.email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`
    window.location.href = mailtoLink
    notyf.success("Email preparado")
  }

  const handleContactarTelefono = (propietario: Owner) => {
    const telLink = `tel:${propietario.phone}`
    window.location.href = telLink
    notyf.success("Iniciando llamada")
  }

  const exportarPDF = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(18)
    doc.text("Reporte de Propietarios - ADN Developers", 14, 20)

    // Add date
    doc.setFontSize(10)
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28)

    // Add statistics
    doc.setFontSize(12)
    doc.text("Estadísticas Generales", 14, 38)
    doc.setFontSize(10)
    doc.text(`Total de Propietarios: ${generalStats.total}`, 14, 45)
    doc.text(`Propietarios Únicos: ${generalStats.totalUniqueOwners}`, 14, 51)
    doc.text(`Compradores: ${generalStats.compradores}`, 14, 57)
    doc.text(`Inversores: ${generalStats.inversores}`, 14, 63)
    doc.text(`Inquilinos: ${generalStats.inquilinos}`, 14, 69)
    doc.text(`Con Múltiples Unidades: ${generalStats.multipleUnits}`, 14, 75)

    // Add project breakdown
    doc.setFontSize(12)
    doc.text("Desglose por Proyecto", 14, 88)

    const projectData = projectStats.map((p) => [
      p.name,
      p.totalOwners.toString(),
      `${p.percentage.toFixed(1)}%`,
      p.compradores.toString(),
      p.inversores.toString(),
      p.inquilinos.toString(),
    ])

    autoTable(doc, {
      head: [["Proyecto", "Total", "%", "Comp.", "Inv.", "Inq."]],
      body: projectData,
      startY: 93,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Add detailed owners table
    const finalY = (doc as any).lastAutoTable.finalY || 93
    doc.setFontSize(12)
    doc.text("Detalle de Propietarios", 14, finalY + 15)

    const exportData = propietariosFiltrados.map((p) => [
      PROJECT_NAMES[p.projectName],
      p.unitId,
      p.name,
      p.email,
      p.phone,
      p.type,
      new Date(p.assignedAt).toLocaleDateString(),
    ])

    autoTable(doc, {
      head: [["Proyecto", "Unidad", "Nombre", "Email", "Teléfono", "Tipo", "Fecha"]],
      body: exportData,
      startY: finalY + 20,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 25 },
      },
    })

    doc.save(`propietarios_${new Date().toISOString().split("T")[0]}.pdf`)
    notyf.success("PDF exportado exitosamente con estadísticas")
  }

  const exportarExcel = () => {
    const workbook = XLSX.utils.book_new()

    // Sheet 1: Estadísticas Generales
    const statsData = [
      ["Estadísticas Generales de Propietarios"],
      [""],
      ["Métrica", "Valor"],
      ["Total de Propietarios", generalStats.total],
      ["Propietarios Únicos", generalStats.totalUniqueOwners],
      ["Compradores", generalStats.compradores],
      ["Inversores", generalStats.inversores],
      ["Inquilinos", generalStats.inquilinos],
      ["Con Múltiples Unidades", generalStats.multipleUnits],
      [""],
      ["Generado", new Date().toLocaleString()],
    ]
    const statsSheet = XLSX.utils.aoa_to_sheet(statsData)
    XLSX.utils.book_append_sheet(workbook, statsSheet, "Estadísticas")

    // Sheet 2: Desglose por Proyecto
    const projectData = [
      ["Proyecto", "Total Propietarios", "Porcentaje", "Compradores", "Inversores", "Inquilinos"],
      ...projectStats.map((p) => [
        p.name,
        p.totalOwners,
        `${p.percentage.toFixed(1)}%`,
        p.compradores,
        p.inversores,
        p.inquilinos,
      ]),
    ]
    const projectSheet = XLSX.utils.aoa_to_sheet(projectData)
    XLSX.utils.book_append_sheet(workbook, projectSheet, "Por Proyecto")

    // Sheet 3: Propietarios con Múltiples Unidades
    if (ownersWithMultipleUnits.length > 0) {
      const multiUnitsData = [
        ["Nombre", "Cantidad de Unidades", "Proyectos", "Unidades"],
        ...ownersWithMultipleUnits.map((owner) => [
          owner.name,
          owner.unitCount,
          [...new Set(owner.units.map((u) => PROJECT_NAMES[u.projectName]))].join(", "),
          owner.units.map((u) => u.unitId).join(", "),
        ]),
      ]
      const multiUnitsSheet = XLSX.utils.aoa_to_sheet(multiUnitsData)
      XLSX.utils.book_append_sheet(workbook, multiUnitsSheet, "Múltiples Unidades")
    }

    // Sheet 4: Todos los Propietarios (Detalle)
    const exportData = [
      ["Proyecto", "Unidad", "Nombre", "Email", "Teléfono", "Tipo", "Fecha Asignación"],
      ...propietariosFiltrados.map((p) => [
        PROJECT_NAMES[p.projectName],
        p.unitId,
        p.name,
        p.email,
        p.phone,
        p.type,
        new Date(p.assignedAt).toLocaleDateString(),
      ]),
    ]
    const detailSheet = XLSX.utils.aoa_to_sheet(exportData)
    XLSX.utils.book_append_sheet(workbook, detailSheet, "Detalle Propietarios")

    XLSX.writeFile(workbook, `propietarios_completo_${new Date().toISOString().split("T")[0]}.xlsx`)
    notyf.success("Excel exportado con múltiples hojas")
  }

  const handleFiltroChange = (tipo: keyof typeof filtros, valor: string | boolean) => {
    if (typeof valor === "boolean") {
      setFiltros((prev) => ({ ...prev, [tipo]: valor }))
    } else {
      setFiltros((prev) => ({
        ...prev,
        [tipo]: (prev[tipo] as string[]).includes(valor)
          ? (prev[tipo] as string[]).filter((v) => v !== valor)
          : [...(prev[tipo] as string[]), valor],
      }))
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = propietariosFiltrados.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(propietariosFiltrados.length / itemsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const PropietarioCard = ({ propietario }: { propietario: Owner }) => {
    const ownerUnitCount = propietarios.filter((p) => p.name === propietario.name).length

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{propietario.name}</CardTitle>
                {ownerUnitCount > 1 && (
                  <Badge variant="default" className="text-xs">
                    {ownerUnitCount} unidades
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm mt-1">
                <Building2 className="w-3 h-3 inline mr-1" />
                {PROJECT_NAMES[propietario.projectName]} - Unidad {propietario.unitId}
              </CardDescription>
            </div>
            <Badge variant={propietario.type === "COMPRADOR" ? "default" : "secondary"}>{propietario.type}</Badge>
          </div>

          <div className="grid grid-cols-1 gap-2 text-sm mt-3">
            <div>
              <span className="font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email:
              </span>
              <p className="text-muted-foreground truncate">{propietario.email}</p>
            </div>
            <div>
              <span className="font-medium flex items-center gap-1">
                <Phone className="w-3 h-3" /> Teléfono:
              </span>
              <p className="text-muted-foreground">{propietario.phone}</p>
            </div>
            <div>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Asignado:
              </span>
              <p className="text-muted-foreground">{new Date(propietario.assignedAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => handleContactarWhatsApp(propietario)}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => handleContactarEmail(propietario)}
            >
              <Mail className="w-4 h-4 mr-1" />
              Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleContactarTelefono(propietario)}>
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }

  const ProjectStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {projectStats.map((project) => (
        <Card key={project.key} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${PROJECT_COLORS[project.key]}`} />
                <CardTitle className="text-base">{project.name}</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                {project.percentage.toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                Total
              </span>
              <span className="text-2xl font-bold">{project.totalOwners}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Comp.</div>
                <div className="text-sm font-semibold">{project.compradores}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Inv.</div>
                <div className="text-sm font-semibold">{project.inversores}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Inq.</div>
                <div className="text-sm font-semibold">{project.inquilinos}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Resumen General de Propietarios
          </CardTitle>
          <CardDescription>Vista consolidada de todos los proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center ">
              <div className="text-3xl font-bold text-blue-600">{generalStats.total}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Propietarios</div>
            </div>
            <div className="text-center ">
              <div className="text-3xl font-bold text-purple-600">{generalStats.totalUniqueOwners}</div>
              <div className="text-sm text-muted-foreground mt-1">Únicos</div>
            </div>
            <div className="text-center ">
              <div className="text-3xl font-bold text-green-600">{generalStats.compradores}</div>
              <div className="text-sm text-muted-foreground mt-1">Compradores</div>
            </div>
            <div className="text-center ">
              <div className="text-3xl font-bold text-orange-600">{generalStats.inversores}</div>
              <div className="text-sm text-muted-foreground mt-1">Inversores</div>
            </div>
            <div className="text-center ">
              <div className="text-3xl font-bold text-pink-600">{generalStats.inquilinos}</div>
              <div className="text-sm text-muted-foreground mt-1">Inquilinos</div>
            </div>
            <div className="text-center ">
              <div className="text-3xl font-bold text-teal-600">{generalStats.multipleUnits}</div>
              <div className="text-sm text-muted-foreground mt-1">Múltiples Unid.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!loading && <ProjectStatsCards />}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Gestión de Propietarios</CardTitle>
              <CardDescription>Administra y contacta a todos los propietarios de tus proyectos</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={exportarPDF} variant="outline" size={isMobileView ? "sm" : "default"}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button onClick={exportarExcel} variant="outline" size={isMobileView ? "sm" : "default"}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button onClick={fetchPropietarios} size={isMobileView ? "sm" : "default"}>
                Actualizar
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, unidad, proyecto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nombre (A-Z)</SelectItem>
                  <SelectItem value="units">Más Unidades</SelectItem>
                  <SelectItem value="date">Más Reciente</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={isMobileView ? "sm" : "default"}>
                    <Filter className="w-4 h-4 mr-2" />
                    Proyecto {filtros.proyecto.length > 0 && `(${filtros.proyecto.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filtrar por Proyecto</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(PROJECT_NAMES).map(([key, name]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={filtros.proyecto.includes(key)}
                      onCheckedChange={() => handleFiltroChange("proyecto", key)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${PROJECT_COLORS[key]}`} />
                        {name}
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={isMobileView ? "sm" : "default"}>
                    <Filter className="w-4 h-4 mr-2" />
                    Tipo {filtros.tipo.length > 0 && `(${filtros.tipo.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filtrar por Tipo</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filtros.tipo.includes("COMPRADOR")}
                    onCheckedChange={() => handleFiltroChange("tipo", "COMPRADOR")}
                  >
                    Comprador
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filtros.tipo.includes("INVERSOR")}
                    onCheckedChange={() => handleFiltroChange("tipo", "INVERSOR")}
                  >
                    Inversor
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filtros.tipo.includes("INQUILINO")}
                    onCheckedChange={() => handleFiltroChange("tipo", "INQUILINO")}
                  >
                    Inquilino
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant={filtros.multipleUnits ? "default" : "outline"}
                size={isMobileView ? "sm" : "default"}
                onClick={() => handleFiltroChange("multipleUnits", !filtros.multipleUnits)}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Múltiples Unidades
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 flex-wrap">
            <Badge variant="outline" className="text-sm">
              Mostrando: {propietariosFiltrados.length} de {propietarios.length}
            </Badge>
            {filtros.proyecto.length > 0 && (
              <Badge variant="secondary">{filtros.proyecto.length} proyecto(s) filtrado(s)</Badge>
            )}
            {filtros.tipo.length > 0 && <Badge variant="secondary">{filtros.tipo.length} tipo(s) filtrado(s)</Badge>}
            {filtros.multipleUnits && <Badge variant="secondary">Solo múltiples unidades</Badge>}
            {(filtros.proyecto.length > 0 || filtros.tipo.length > 0 || filtros.multipleUnits || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFiltros({ proyecto: [], tipo: [], multipleUnits: false })
                  setSearchTerm("")
                  setSortBy("name")
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">Cargando propietarios...</div>
            </div>
          ) : propietariosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <User className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                No se encontraron propietarios con los filtros aplicados
              </p>
            </div>
          ) : isMobileView ? (
            <div>
              {currentItems.map((propietario, idx) => (
                <PropietarioCard
                  key={`${propietario.projectName}-${propietario.unitId}-${idx}`}
                  propietario={propietario}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Unidad</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Asignado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((propietario, idx) => {
                    const ownerUnitCount = propietarios.filter((p) => p.name === propietario.name).length
                    return (
                      <TableRow key={`${propietario.projectName}-${propietario.unitId}-${idx}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${PROJECT_COLORS[propietario.projectName]}`} />
                            {PROJECT_NAMES[propietario.projectName]}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{propietario.unitId}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {propietario.name}
                            {ownerUnitCount > 1 && (
                              <Badge variant="secondary" className="text-xs">
                                {ownerUnitCount}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{propietario.email}</TableCell>
                        <TableCell>{propietario.phone}</TableCell>
                        <TableCell>
                          <Badge variant={propietario.type === "COMPRADOR" ? "default" : "secondary"}>
                            {propietario.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(propietario.assignedAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleContactarWhatsApp(propietario)}
                              title="WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleContactarEmail(propietario)}
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleContactarTelefono(propietario)}
                              title="Llamar"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {propietariosFiltrados.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, propietariosFiltrados.length)} de{" "}
                {propietariosFiltrados.length} propietarios
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
