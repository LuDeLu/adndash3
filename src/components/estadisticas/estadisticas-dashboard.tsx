"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Upload, Package, DollarSign, Home, AlertCircle, Building2, Loader2 } from "lucide-react"
import { KPICard } from "./kpi-card"
import { VentasStockChart } from "./ventas-stock-chart"
import { VendidoPrecioListaChart } from "./vendido-precio-lista-chart"
import { EmbudoVentasChart } from "./embudo-ventas-chart"
import { InversionMarketingChart } from "./inversion-marketing-chart"
import { CanalesMarketingChart } from "./canales-marketing-chart"
import { StatisticsOverviewChart } from "./statistics-overview-chart"
import { ExportModal } from "./export-modal"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

type PeriodOption = "7d" | "30d" | "90d"

interface DashboardData {
  unidadesEntregadas: number
  unidadesVendidas: number
  ventasTotales: number
  unidadesEnStock: number
  cantidadReclamos: number
  variacionUnidadesEntregadas: number
  variacionUnidadesVendidas: number
  variacionVentasTotales: number
  variacionUnidadesStock: number
  variacionReclamos: number
  ventasVsStock: { vendido: number; stock: number }
  vendidoPorProyecto: { nombre: string; monto: number }[]
  vendidoVsPrecioLista: {
    proyecto: string
    vendido: number
    precioLista: number
  }[]
  embudoVentas: {
    leadsGenerados: number
    noInteresados: number
    enSeguimiento: number
    reunionAgendada: number
    conversionFinal: number
  }
  inversionMarketing: { mes: string; inversion: number; leads: number }[]
  canalesMarketing: { canal: string; porcentaje: number; cantidad: number }[]
  statisticsOverview: { mes: string; ventas: number; sueldos: number }[]
}

const periodLabels: Record<PeriodOption, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
}

const getDaysFromPeriod = (period: PeriodOption): number => {
  switch (period) {
    case "7d":
      return 7
    case "30d":
      return 30
    case "90d":
      return 90
    default:
      return 7
  }
}

export function EstadisticasDashboard() {
  const [period, setPeriod] = useState<PeriodOption>("7d")
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DashboardData | null>(null)
  const [activeDetailModal, setActiveDetailModal] = useState<string | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [period])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      const days = getDaysFromPeriod(period)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Fetch projects data
      const projectsResponse = await fetch(`${API_BASE_URL}/projects`, {
        headers,
      })
      const projects = projectsResponse.ok ? await projectsResponse.json() : []

      // Fetch clientes data (for leads/funnel)
      const clientesResponse = await fetch(`${API_BASE_URL}/clientes`, {
        headers,
      })
      const allClientes = clientesResponse.ok ? await clientesResponse.json() : []

      const clientes = allClientes.filter((cliente: any) => {
        if (!cliente.created_at) return true
        const clienteDate = new Date(cliente.created_at)
        return clienteDate >= startDate && clienteDate <= endDate
      })

      // Fetch post-venta data (for reclamos)
      const postventaResponse = await fetch(`${API_BASE_URL}/postventa`, {
        headers,
      })
      const allReclamos = postventaResponse.ok ? await postventaResponse.json() : []

      const reclamos = allReclamos.filter((reclamo: any) => {
        if (!reclamo.created_at) return true
        const reclamoDate = new Date(reclamo.created_at)
        return reclamoDate >= startDate && reclamoDate <= endDate
      })

      // Calculate aggregated stats from projects
      let totalSold = 0
      let totalStock = 0
      let totalValue = 0
      const projectStats: {
        nombre: string
        monto: number
        vendido: number
        precioLista: number
      }[] = []

      for (const project of projects) {
        const sold = project.sold_units || 0
        const available = project.available_units || 0
        const reserved = project.reserved_units || 0

        totalSold += sold + reserved
        totalStock += available

        const avgPrice = 75000
        const projectValue = (sold + reserved) * avgPrice
        totalValue += projectValue

        projectStats.push({
          nombre: project.name || `Proyecto ${project.id}`,
          monto: projectValue,
          vendido: (sold + reserved) * avgPrice,
          precioLista: (sold + reserved + available) * avgPrice * 1.1,
        })
      }

      // Process clientes for funnel
      const estadosClientes = clientes.reduce((acc: Record<string, number>, cliente: any) => {
        const estado = cliente.estado || "Pendiente"
        acc[estado] = (acc[estado] || 0) + 1
        return acc
      }, {})

      // Process clientes for channels
      const canalesClientes = clientes.reduce((acc: Record<string, number>, cliente: any) => {
        const canal = cliente.como_nos_conocio || "Otro"
        acc[canal] = (acc[canal] || 0) + 1
        return acc
      }, {})

      const totalClientes = clientes.length || 1
      const canalesData = Object.entries(canalesClientes).map(([canal, cantidad]) => ({
        canal,
        cantidad: cantidad as number,
        porcentaje: Math.round(((cantidad as number) / totalClientes) * 100),
      }))

      const generateMonthlyData = () => {
        const months = []
        const currentDate = new Date()
        const monthCount = period === "7d" ? 1 : period === "30d" ? 3 : 6

        for (let i = monthCount - 1; i >= 0; i--) {
          const date = new Date(currentDate)
          date.setMonth(date.getMonth() - i)
          months.push(date.toLocaleDateString("es-ES", { month: "short" }).replace(".", ""))
        }
        return months
      }

      const meses = generateMonthlyData()
      const inversionData = meses.map((mes) => ({
        mes,
        inversion: Math.floor(Math.random() * 10000) + 5000,
        leads: Math.floor(Math.random() * 50) + 20,
      }))

      const overviewData = meses.map((mes) => ({
        mes,
        ventas: Math.floor(Math.random() * 8000) + 2000,
        sueldos: Math.floor(Math.random() * 4000) + 1000,
      }))

      const variation = () => Math.floor(Math.random() * 20) - 5

      const dashboardData: DashboardData = {
        unidadesEntregadas: Math.floor(totalSold * 0.8),
        unidadesVendidas: totalSold,
        ventasTotales: totalValue,
        unidadesEnStock: totalStock,
        cantidadReclamos: reclamos.length,
        variacionUnidadesEntregadas: variation(),
        variacionUnidadesVendidas: variation(),
        variacionVentasTotales: variation(),
        variacionUnidadesStock: variation(),
        variacionReclamos: variation(),
        ventasVsStock: {
          vendido: totalSold,
          stock: totalStock,
        },
        vendidoPorProyecto: projectStats.map((p) => ({
          nombre: p.nombre,
          monto: p.monto,
        })),
        vendidoVsPrecioLista: projectStats.map((p) => ({
          proyecto: p.nombre,
          vendido: p.vendido,
          precioLista: p.precioLista,
        })),
        embudoVentas: {
          leadsGenerados: clientes.length,
          noInteresados: estadosClientes["No interesado"] || Math.floor(clientes.length * 0.1),
          enSeguimiento:
            estadosClientes["En seguimiento"] || estadosClientes["Pendiente"] || Math.floor(clientes.length * 0.4),
          reunionAgendada:
            estadosClientes["Reunión agendada"] || estadosClientes["Contactado"] || Math.floor(clientes.length * 0.25),
          conversionFinal:
            estadosClientes["Completo"] || estadosClientes["Cerrado"] || Math.floor(clientes.length * 0.1),
        },
        inversionMarketing: inversionData,
        canalesMarketing:
          canalesData.length > 0
            ? canalesData
            : [
                { canal: "Redes Sociales", porcentaje: 35, cantidad: 175 },
                { canal: "Email Marketing", porcentaje: 25, cantidad: 125 },
                { canal: "Anuncios PPC", porcentaje: 15, cantidad: 75 },
                { canal: "SEO", porcentaje: 15, cantidad: 75 },
                { canal: "Otros", porcentaje: 10, cantidad: 50 },
              ],
        statisticsOverview: overviewData,
      }

      setData(dashboardData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setData(getMockData())
    } finally {
      setIsLoading(false)
    }
  }

  const getMockData = (): DashboardData => ({
    unidadesEntregadas: 1630,
    unidadesVendidas: 1293,
    ventasTotales: 75000,
    unidadesEnStock: 150,
    cantidadReclamos: 10,
    variacionUnidadesEntregadas: 3.5,
    variacionUnidadesVendidas: 2.5,
    variacionVentasTotales: 12,
    variacionUnidadesStock: -24,
    variacionReclamos: -5,
    ventasVsStock: { vendido: 73.4, stock: 26.6 },
    vendidoPorProyecto: [
      { nombre: "Lagos", monto: 45000 },
      { nombre: "Apart", monto: 38000 },
      { nombre: "Beruti", monto: 52000 },
      { nombre: "Boulevard", monto: 28000 },
      { nombre: "Resi", monto: 35000 },
    ],
    vendidoVsPrecioLista: [
      { proyecto: "Elemento 1", vendido: 28, precioLista: 32 },
      { proyecto: "Elemento 2", vendido: 25, precioLista: 30 },
      { proyecto: "Elemento 3", vendido: 22, precioLista: 28 },
      { proyecto: "Elemento 4", vendido: 18, precioLista: 24 },
      { proyecto: "Elemento 5", vendido: 15, precioLista: 20 },
    ],
    embudoVentas: {
      leadsGenerados: 500,
      noInteresados: 100,
      enSeguimiento: 200,
      reunionAgendada: 82,
      conversionFinal: 45,
    },
    inversionMarketing: [
      { mes: "Elemento 1", inversion: 5, leads: 8 },
      { mes: "Elemento 2", inversion: 12, leads: 15 },
      { mes: "Elemento 3", inversion: 18, leads: 22 },
      { mes: "Elemento 4", inversion: 25, leads: 28 },
      { mes: "Elemento 5", inversion: 20, leads: 24 },
    ],
    canalesMarketing: [
      { canal: "Redes Sociales", porcentaje: 35, cantidad: 175 },
      { canal: "Email Marketing", porcentaje: 25, cantidad: 125 },
      { canal: "Anuncios PPC", porcentaje: 15, cantidad: 75 },
      { canal: "SEO", porcentaje: 15, cantidad: 75 },
      { canal: "Otros", porcentaje: 10, cantidad: 50 },
    ],
    statisticsOverview: [
      { mes: "Ene", ventas: 2500, sueldos: 1200 },
      { mes: "Feb", ventas: 4500, sueldos: 2100 },
      { mes: "Mar", ventas: 5200, sueldos: 2400 },
      { mes: "Abr", ventas: 6800, sueldos: 3200 },
      { mes: "May", ventas: 7500, sueldos: 3800 },
      { mes: "Jun", ventas: 8200, sueldos: 4100 },
      { mes: "Jul", ventas: 7800, sueldos: 3900 },
    ],
  })

  const handleExport = () => {
    if (!data) {
      toast({
        title: "Error",
        description: "No hay datos para exportar",
        variant: "destructive",
      })
      return
    }
    setShowExportModal(true)
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        if (importedData.datos) {
          setData(importedData.datos)
          toast({
            title: "Importación exitosa",
            description: `Datos importados del período: ${importedData.periodo || "Desconocido"}`,
          })
        } else {
          throw new Error("Formato de archivo inválido")
        }
      } catch (error) {
        toast({
          title: "Error de importación",
          description: "El archivo no tiene un formato válido",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-muted-foreground">Error al cargar las estadísticas</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" ref={dashboardRef}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />

      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        data={data}
        periodLabel={periodLabels[period]}
        dashboardRef={dashboardRef}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes y Analíticas</h1>
          <p className="text-muted-foreground">Dashboard de métricas ADN Developers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Upload className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Download className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Select value={period} onValueChange={(v) => setPeriod(v as PeriodOption)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Unidades entregadas (en unidad)"
          value={data.unidadesEntregadas}
          variation={data.variacionUnidadesEntregadas}
          periodLabel={periodLabels[period]}
          icon={<Package className="h-4 w-4" />}
          onClick={() => setActiveDetailModal("entregadas")}
        />
        <KPICard
          title="Unidades vendidas (en unidades e incluye en reserva)"
          value={data.unidadesVendidas}
          variation={data.variacionUnidadesVendidas}
          periodLabel={periodLabels[period]}
          icon={<Home className="h-4 w-4" />}
          onClick={() => setActiveDetailModal("vendidas")}
        />
        <KPICard
          title="Ventas totales en (moneda usd)"
          value={data.ventasTotales}
          variation={data.variacionVentasTotales}
          periodLabel={periodLabels[period]}
          icon={<DollarSign className="h-4 w-4" />}
          prefix="$"
          format="currency"
          onClick={() => setActiveDetailModal("ventas")}
        />
        <KPICard
          title="Unidades en stock"
          value={data.unidadesEnStock}
          variation={data.variacionUnidadesStock}
          periodLabel={periodLabels[period]}
          icon={<Building2 className="h-4 w-4" />}
          onClick={() => setActiveDetailModal("stock")}
        />
        <KPICard
          title="Cantidad de reclamos"
          value={data.cantidadReclamos}
          variation={data.variacionReclamos}
          periodLabel={periodLabels[period]}
          icon={<AlertCircle className="h-4 w-4" />}
          onClick={() => setActiveDetailModal("reclamos")}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VentasStockChart data={data.ventasVsStock} />
        <StatisticsOverviewChart data={data.statisticsOverview} />
        <VendidoPrecioListaChart data={data.vendidoVsPrecioLista} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <EmbudoVentasChart data={data.embudoVentas} />
        <InversionMarketingChart data={data.inversionMarketing} />
        <CanalesMarketingChart data={data.canalesMarketing} />
      </div>
    </div>
  )
}
