"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  ResponsiveContainer,
  Area,
  Bar,
  Line,
  Pie,
  Radar,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBar,
  RadialBarChart,
} from "recharts"
import {
  datosVentas,
  datosProyecto,
  datosVentasPropiedades,
  datosOcupacion,
  datosLeads,
  datosConversion,
  canalesMarketing,
  datosRendimientoInversion,
  datosValorPropiedad,
  datosSatisfaccionCliente,
  datosTiempoCierre,
  datosUnidadesVendidas,
  datosValorM2,
  datosVisitasVentas,
  datosInventario,
  datosProductividad,
  COLORES,
} from "@/lib/data"
import {
  Settings,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  AreaChartIcon,
  RadarIcon,
  ScatterChartIcon as ScatterIcon,
  Save,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  RefreshCw,
  Menu,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

// Tipos de datos disponibles
const DATA_SOURCES = {
  ventas: {
    name: "Ventas Mensuales",
    description: "Comparación de ventas vs. objetivo",
    data: datosVentas,
    keys: ["ventas", "objetivo"],
    colors: ["#8884d8", "#82ca9d"],
    xAxis: "mes",
  },
  proyectos: {
    name: "Estado de Proyectos",
    description: "Distribución de proyectos por estado",
    data: datosProyecto,
    keys: ["valor"],
    colors: COLORES,
    nameKey: "nombre",
    valueKey: "valor",
  },
  propiedades: {
    name: "Ventas de Propiedades",
    description: "Número de propiedades vendidas por mes",
    data: datosVentasPropiedades,
    keys: ["vendidas"],
    colors: ["#8884d8"],
    xAxis: "mes",
  },
  ocupacion: {
    name: "Ocupación de Propiedades",
    description: "Porcentaje de propiedades ocupadas vs. vacantes",
    data: datosOcupacion,
    keys: ["valor"],
    colors: ["#00C49F", "#FF8042"],
    nameKey: "nombre",
    valueKey: "valor",
  },
  leads: {
    name: "Leads Generados",
    description: "Número de leads generados por mes",
    data: datosLeads,
    keys: ["leads"],
    colors: ["#8884d8"],
    xAxis: "mes",
  },
  conversion: {
    name: "Tasa de Conversión",
    description: "Porcentaje de conversión de leads a ventas",
    data: datosConversion,
    keys: ["tasa"],
    colors: ["#82ca9d"],
    xAxis: "mes",
  },
  marketing: {
    name: "Canales de Marketing",
    description: "Distribución de leads por canal de marketing",
    data: canalesMarketing,
    keys: ["valor"],
    colors: COLORES,
    nameKey: "nombre",
    valueKey: "valor",
  },
  roi: {
    name: "ROI de Inversión",
    description: "Retorno de inversión por mes",
    data: datosRendimientoInversion,
    keys: ["roi"],
    colors: ["#8884d8"],
    xAxis: "mes",
  },
  valorPropiedad: {
    name: "Valor de Propiedad",
    description: "Evolución del valor de propiedad por mes",
    data: datosValorPropiedad,
    keys: ["valor"],
    colors: ["#8884d8"],
    xAxis: "mes",
  },
  satisfaccion: {
    name: "Satisfacción del Cliente",
    description: "Nivel de satisfacción del cliente por mes",
    data: datosSatisfaccionCliente,
    keys: ["satisfaccion"],
    colors: ["#82ca9d"],
    xAxis: "mes",
  },
  tiempoCierre: {
    name: "Tiempo de Cierre",
    description: "Días promedio para cerrar una venta",
    data: datosTiempoCierre,
    keys: ["tiempo"],
    colors: ["#FF8042"],
    xAxis: "mes",
  },
  unidadesVendidas: {
    name: "Unidades Vendidas",
    description: "Número de unidades vendidas por mes",
    data: datosUnidadesVendidas,
    keys: ["unidades"],
    colors: ["#8884d8"],
    xAxis: "mes",
  },
  valorM2: {
    name: "Valor por m²",
    description: "Precio de lista vs. precio de cierre por m²",
    data: datosValorM2,
    keys: ["listaM2", "cierreM2"],
    colors: ["#8884d8", "#82ca9d"],
    xAxis: "tipo",
  },
  visitasVentas: {
    name: "Visitas vs. Ventas",
    description: "Relación entre visitas y ventas por mes",
    data: datosVisitasVentas,
    keys: ["visitas", "ventas"],
    colors: ["#8884d8", "#82ca9d"],
    xAxis: "mes",
  },
  inventario: {
    name: "Inventario por Tipo",
    description: "Unidades disponibles por tipo de propiedad",
    data: datosInventario,
    keys: ["unidades", "valor"],
    colors: ["#8884d8", "#82ca9d"],
    xAxis: "tipo",
  },
  productividad: {
    name: "Productividad de Ventas",
    description: "Ventas propias vs. ventas por brokers",
    data: datosProductividad,
    keys: ["propias", "brokers"],
    colors: ["#8884d8", "#82ca9d"],
    xAxis: "mes",
  },
}

// Tipos de gráficos disponibles
const CHART_TYPES = {
  area: {
    name: "Área",
    icon: <AreaChartIcon className="h-4 w-4" />,
    component: AreaChart,
    dataComponent: Area,
    supportsPie: false,
  },
  bar: {
    name: "Barras",
    icon: <BarChart3 className="h-4 w-4" />,
    component: BarChart,
    dataComponent: Bar,
    supportsPie: false,
  },
  line: {
    name: "Línea",
    icon: <LineChartIcon className="h-4 w-4" />,
    component: LineChart,
    dataComponent: Line,
    supportsPie: false,
  },
  pie: {
    name: "Circular",
    icon: <PieChartIcon className="h-4 w-4" />,
    component: PieChart,
    dataComponent: Pie,
    supportsPie: true,
  },
  radar: {
    name: "Radar",
    icon: <RadarIcon className="h-4 w-4" />,
    component: RadarChart,
    dataComponent: Radar,
    supportsPie: false,
  },
  scatter: {
    name: "Dispersión",
    icon: <ScatterIcon className="h-4 w-4" />,
    component: ScatterChart,
    dataComponent: Scatter,
    supportsPie: false,
  },
  radialBar: {
    name: "Barra Radial",
    icon: <PieChartIcon className="h-4 w-4" />,
    component: RadialBarChart,
    dataComponent: RadialBar,
    supportsPie: true,
  },
}

// Tipo para un widget de gráfico
interface ChartWidget {
  id: string
  dataSource: string
  chartType: string
  title?: string
  description?: string
  w: number
  h: number
  x: number
  y: number
  showLegend: boolean
  stacked: boolean
  period: string
}

// Componente para renderizar un gráfico específico
const ChartRenderer = ({
  widget,
  onEdit,
  onRemove,
  onResize,
}: {
  widget: ChartWidget
  onEdit: (id: string) => void
  onRemove: (id: string) => void
  onResize: (id: string, isFullscreen: boolean) => void
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isMobile = useMobile()
  const dataSource = DATA_SOURCES[widget.dataSource as keyof typeof DATA_SOURCES]
  const chartType = CHART_TYPES[widget.chartType as keyof typeof CHART_TYPES]

  // Si no hay datos o tipo de gráfico, mostrar mensaje
  if (!dataSource || !chartType) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">Configuración inválida</p>
        </CardContent>
      </Card>
    )
  }

  // Verificar compatibilidad del tipo de gráfico con los datos
  const isPieData = "nameKey" in dataSource && "valueKey" in dataSource
  const isCompatible = chartType.supportsPie === isPieData

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onResize(widget.id, !isFullscreen)
  }

  const renderChart = () => {
    const ChartComponent = chartType.component

    if (isPieData && chartType.supportsPie) {
      // Renderizar gráfico circular
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent>
            <Pie
              data={dataSource.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                const RADIAN = Math.PI / 180
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)
                return (
                  <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                )
              }}
              outerRadius={isMobile ? 60 : 80}
              dataKey={dataSource.valueKey}
              nameKey={dataSource.nameKey}
            >
              {dataSource.data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={dataSource.colors[index % dataSource.colors.length]} />
              ))}
            </Pie>
            {widget.showLegend && <Legend />}
            <Tooltip />
          </ChartComponent>
        </ResponsiveContainer>
      )
    } else if (!isPieData && !chartType.supportsPie) {
      // Renderizar gráfico cartesiano (área, barras, líneas, etc.)
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={dataSource.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={dataSource.xAxis}
              fontSize={isMobile ? 10 : 12}
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={isMobile ? 60 : 30}
            />
            <YAxis fontSize={isMobile ? 10 : 12} />
            <Tooltip />
            {widget.showLegend && <Legend />}
            {dataSource.keys.map((key: string, index: number) => {
              // Usar el componente específico según el tipo de gráfico
              if (chartType.dataComponent === Area) {
                return (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    fill={dataSource.colors[index % dataSource.colors.length]}
                    stroke={dataSource.colors[index % dataSource.colors.length]}
                    stackId={widget.stacked ? "stack" : undefined}
                  />
                )
              } else if (chartType.dataComponent === Bar) {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={dataSource.colors[index % dataSource.colors.length]}
                    stackId={widget.stacked ? "stack" : undefined}
                  />
                )
              } else if (chartType.dataComponent === Line) {
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={dataSource.colors[index % dataSource.colors.length]}
                    strokeWidth={isMobile ? 1 : 2}
                  />
                )
              } else if (chartType.dataComponent === Radar) {
                return (
                  <Radar
                    key={key}
                    dataKey={key}
                    fill={dataSource.colors[index % dataSource.colors.length]}
                    fillOpacity={0.6}
                  />
                )
              } else if (chartType.dataComponent === Scatter) {
                return <Scatter key={key} dataKey={key} fill={dataSource.colors[index % dataSource.colors.length]} />
              }
              return null
            })}
          </ChartComponent>
        </ResponsiveContainer>
      )
    } else {
      // Tipo de gráfico incompatible con los datos
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center text-sm">Tipo de gráfico incompatible con estos datos</p>
        </div>
      )
    }
  }

  return (
    <Card className={`w-full h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      <CardHeader className={`${isMobile ? "p-2" : "p-3"} flex-row items-center justify-between space-y-0 drag-handle`}>
        <div className="flex-1 min-w-0">
          <CardTitle className={`${isMobile ? "text-xs" : "text-sm"} font-medium truncate`}>
            {widget.title || dataSource.name}
          </CardTitle>
          <CardDescription className={`${isMobile ? "text-xs" : "text-xs"} truncate`}>
            {widget.description || dataSource.description}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={() => onEdit(widget.id)}>
            <Settings className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={toggleFullscreen}>
            {isFullscreen ? (
              <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            ) : (
              <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
            )}
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={() => onRemove(widget.id)}>
            <Trash2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? "p-2" : "p-3"} flex-grow`}>{renderChart()}</CardContent>
    </Card>
  )
}

// Componente para editar un widget
const EditWidgetDialog = ({
  widget,
  isOpen,
  onClose,
  onSave,
}: {
  widget: ChartWidget | null
  isOpen: boolean
  onClose: () => void
  onSave: (widget: ChartWidget) => void
}) => {
  const [editedWidget, setEditedWidget] = useState<ChartWidget | null>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (widget) {
      setEditedWidget({ ...widget })
    }
  }, [widget])

  if (!editedWidget) return null

  const handleChange = (field: keyof ChartWidget, value: any) => {
    setEditedWidget({ ...editedWidget, [field]: value })
  }

  const handleSave = () => {
    onSave(editedWidget)
    onClose()
  }

  const dataSource = DATA_SOURCES[editedWidget.dataSource as keyof typeof DATA_SOURCES]
  const isPieData = dataSource && "nameKey" in dataSource && "valueKey" in dataSource

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`${isMobile ? "w-[95vw] max-w-[95vw] h-[90vh] max-h-[90vh] overflow-y-auto" : "sm:max-w-[500px]"}`}
      >
        <DialogHeader>
          <DialogTitle>Configurar Gráfico</DialogTitle>
          <DialogDescription>Personaliza las opciones de visualización para este gráfico.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"} items-center gap-4`}>
            <Label htmlFor="title" className={isMobile ? "" : "text-right"}>
              Título
            </Label>
            <input
              id="title"
              className={`${isMobile ? "col-span-1" : "col-span-3"} flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              value={editedWidget.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder={dataSource?.name || "Título del gráfico"}
            />
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"} items-center gap-4`}>
            <Label htmlFor="description" className={isMobile ? "" : "text-right"}>
              Descripción
            </Label>
            <input
              id="description"
              className={`${isMobile ? "col-span-1" : "col-span-3"} flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
              value={editedWidget.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder={dataSource?.description || "Descripción del gráfico"}
            />
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"} items-center gap-4`}>
            <Label htmlFor="dataSource" className={isMobile ? "" : "text-right"}>
              Fuente de datos
            </Label>
            <Select value={editedWidget.dataSource} onValueChange={(value) => handleChange("dataSource", value)}>
              <SelectTrigger id="dataSource" className={isMobile ? "col-span-1" : "col-span-3"}>
                <SelectValue placeholder="Seleccionar datos" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATA_SOURCES).map(([key, source]) => (
                  <SelectItem key={key} value={key}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"} items-center gap-4`}>
            <Label htmlFor="chartType" className={isMobile ? "" : "text-right"}>
              Tipo de gráfico
            </Label>
            <Select value={editedWidget.chartType} onValueChange={(value) => handleChange("chartType", value)}>
              <SelectTrigger id="chartType" className={isMobile ? "col-span-1" : "col-span-3"}>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHART_TYPES)
                  .filter(([_, type]) => (isPieData ? type.supportsPie : !type.supportsPie))
                  .map(([key, type]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <span className="mr-2">{type.icon}</span>
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"} items-center gap-4`}>
            <Label htmlFor="period" className={isMobile ? "" : "text-right"}>
              Período
            </Label>
            <Select value={editedWidget.period} onValueChange={(value) => handleChange("period", value)}>
              <SelectTrigger id="period" className={isMobile ? "col-span-1" : "col-span-3"}>
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Día</SelectItem>
                <SelectItem value="week">Semana</SelectItem>
                <SelectItem value="month">Mes</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Año</SelectItem>
                <SelectItem value="all">Todo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"} items-center gap-4`}>
            <Label className={isMobile ? "" : "text-right"}>Tamaño</Label>
            <div
              className={`${isMobile ? "col-span-1" : "col-span-3"} flex ${isMobile ? "flex-col" : "items-center"} space-x-4`}
            >
              <div className="flex-1">
                <Label htmlFor="width" className="text-xs">
                  Ancho
                </Label>
                <Slider
                  id="width"
                  min={1}
                  max={12}
                  step={1}
                  value={[editedWidget.w]}
                  onValueChange={(value) => handleChange("w", value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>6</span>
                  <span>12</span>
                </div>
              </div>
              <div className="flex-1">
                <Label htmlFor="height" className="text-xs">
                  Alto
                </Label>
                <Slider
                  id="height"
                  min={1}
                  max={6}
                  step={1}
                  value={[editedWidget.h]}
                  onValueChange={(value) => handleChange("h", value[0])}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1</span>
                  <span>3</span>
                  <span>6</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid ${isMobile ? "grid-cols-1 gap-2" : "grid-cols-4"} items-center gap-4`}>
            <Label className={isMobile ? "" : "text-right"}>Opciones</Label>
            <div className={`${isMobile ? "col-span-1" : "col-span-3"} space-y-2`}>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showLegend"
                  checked={editedWidget.showLegend}
                  onCheckedChange={(checked) => handleChange("showLegend", checked)}
                />
                <Label htmlFor="showLegend">Mostrar leyenda</Label>
              </div>

              {!isPieData && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="stacked"
                    checked={editedWidget.stacked}
                    onCheckedChange={(checked) => handleChange("stacked", checked)}
                  />
                  <Label htmlFor="stacked">Gráfico apilado</Label>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
          <Button variant="outline" onClick={onClose} className={isMobile ? "w-full" : ""}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className={isMobile ? "w-full" : ""}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componente principal de estadísticas
const Estadisticas = () => {
  // Estado para los widgets
  const [widgets, setWidgets] = useState<ChartWidget[]>([])
  const [editingWidget, setEditingWidget] = useState<ChartWidget | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [layouts, setLayouts] = useState<{ [key: string]: ChartWidget[] }>({
    default: [],
  })
  const [currentLayout, setCurrentLayout] = useState<string>("default")
  const [newLayoutName, setNewLayoutName] = useState<string>("")
  const [isFullscreenWidget, setIsFullscreenWidget] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  // Cargar configuración guardada al iniciar
  useEffect(() => {
    const savedLayouts = localStorage.getItem("dashboardLayouts")
    if (savedLayouts) {
      try {
        const parsedLayouts = JSON.parse(savedLayouts)
        setLayouts(parsedLayouts)

        const savedCurrentLayout = localStorage.getItem("currentDashboardLayout") || "default"
        setCurrentLayout(savedCurrentLayout)

        if (parsedLayouts[savedCurrentLayout]) {
          setWidgets(parsedLayouts[savedCurrentLayout])
        } else {
          // Si no existe el layout actual, usar el predeterminado
          setWidgets(getDefaultWidgets())
          setLayouts({ ...parsedLayouts, default: getDefaultWidgets() })
        }
      } catch (e) {
        console.error("Error al cargar la configuración guardada:", e)
        resetToDefault()
      }
    } else {
      resetToDefault()
    }
  }, [])

  // Guardar cambios en localStorage
  useEffect(() => {
    if (widgets.length > 0) {
      const updatedLayouts = { ...layouts, [currentLayout]: widgets }
      setLayouts(updatedLayouts)
      localStorage.setItem("dashboardLayouts", JSON.stringify(updatedLayouts))
      localStorage.setItem("currentDashboardLayout", currentLayout)
    }
  }, [widgets])

  // Widgets predeterminados
  const getDefaultWidgets = (): ChartWidget[] => [
    {
      id: "widget-1",
      dataSource: "ventas",
      chartType: "area",
      w: isMobile ? 12 : 6,
      h: 2,
      x: 0,
      y: 0,
      showLegend: true,
      stacked: false,
      period: "month",
    },
    {
      id: "widget-2",
      dataSource: "proyectos",
      chartType: "pie",
      w: isMobile ? 12 : 3,
      h: 2,
      x: isMobile ? 0 : 6,
      y: isMobile ? 2 : 0,
      showLegend: true,
      stacked: false,
      period: "all",
    },
    {
      id: "widget-3",
      dataSource: "propiedades",
      chartType: "bar",
      w: isMobile ? 12 : 3,
      h: 2,
      x: isMobile ? 0 : 9,
      y: isMobile ? 4 : 0,
      showLegend: true,
      stacked: false,
      period: "month",
    },
    {
      id: "widget-4",
      dataSource: "leads",
      chartType: "line",
      w: isMobile ? 12 : 4,
      h: 2,
      x: 0,
      y: isMobile ? 6 : 2,
      showLegend: true,
      stacked: false,
      period: "month",
    },
    {
      id: "widget-5",
      dataSource: "conversion",
      chartType: "line",
      w: isMobile ? 12 : 4,
      h: 2,
      x: isMobile ? 0 : 4,
      y: isMobile ? 8 : 2,
      showLegend: true,
      stacked: false,
      period: "month",
    },
    {
      id: "widget-6",
      dataSource: "marketing",
      chartType: "pie",
      w: isMobile ? 12 : 4,
      h: 2,
      x: isMobile ? 0 : 8,
      y: isMobile ? 10 : 2,
      showLegend: true,
      stacked: false,
      period: "all",
    },
  ]

  // Resetear a la configuración predeterminada
  const resetToDefault = () => {
    const defaultWidgets = getDefaultWidgets()
    setWidgets(defaultWidgets)
    setLayouts({ default: defaultWidgets })
    setCurrentLayout("default")
    localStorage.setItem("dashboardLayouts", JSON.stringify({ default: defaultWidgets }))
    localStorage.setItem("currentDashboardLayout", "default")
  }

  // Añadir un nuevo widget
  const handleAddWidget = () => {
    const newWidget: ChartWidget = {
      id: `widget-${Date.now()}`,
      dataSource: "ventas",
      chartType: "bar",
      w: isMobile ? 12 : 4,
      h: 2,
      x: 0,
      y: 0,
      showLegend: true,
      stacked: false,
      period: "month",
    }
    setEditingWidget(newWidget)
    setIsEditDialogOpen(true)
  }

  // Editar un widget existente
  const handleEditWidget = (id: string) => {
    const widget = widgets.find((w) => w.id === id)
    if (widget) {
      setEditingWidget(widget)
      setIsEditDialogOpen(true)
    }
  }

  // Eliminar un widget
  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter((w) => w.id !== id))
  }

  // Guardar cambios en un widget
  const handleSaveWidget = (updatedWidget: ChartWidget) => {
    const existingIndex = widgets.findIndex((w) => w.id === updatedWidget.id)
    if (existingIndex >= 0) {
      const newWidgets = [...widgets]
      newWidgets[existingIndex] = updatedWidget
      setWidgets(newWidgets)
    } else {
      setWidgets([...widgets, updatedWidget])
    }
  }

  // Manejar cambio de layout
  const handleChangeLayout = (layoutName: string) => {
    if (layouts[layoutName]) {
      setCurrentLayout(layoutName)
      setWidgets(layouts[layoutName])
      localStorage.setItem("currentDashboardLayout", layoutName)
    }
  }

  // Guardar un nuevo layout
  const handleSaveNewLayout = () => {
    if (newLayoutName.trim() && !layouts[newLayoutName]) {
      const updatedLayouts = { ...layouts, [newLayoutName]: widgets }
      setLayouts(updatedLayouts)
      setCurrentLayout(newLayoutName)
      localStorage.setItem("dashboardLayouts", JSON.stringify(updatedLayouts))
      localStorage.setItem("currentDashboardLayout", newLayoutName)
      setNewLayoutName("")
    }
  }

  // Eliminar un layout
  const handleDeleteLayout = (layoutName: string) => {
    if (layoutName !== "default" && layouts[layoutName]) {
      const { [layoutName]: _, ...restLayouts } = layouts
      setLayouts(restLayouts)

      if (currentLayout === layoutName) {
        setCurrentLayout("default")
        setWidgets(layouts.default)
        localStorage.setItem("currentDashboardLayout", "default")
      }

      localStorage.setItem("dashboardLayouts", JSON.stringify(restLayouts))
    }
  }

  // Manejar widget en pantalla completa
  const handleResizeWidget = (id: string, isFullscreen: boolean) => {
    setIsFullscreenWidget(isFullscreen ? id : null)
  }

  // Componente de controles para móvil
  const MobileControls = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Controles del Dashboard</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <Label className="text-sm font-medium">Layout Actual</Label>
            <Select value={currentLayout} onValueChange={handleChangeLayout}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(layouts).map((layoutName) => (
                  <SelectItem key={layoutName} value={layoutName}>
                    <div className="flex justify-between items-center w-full">
                      {layoutName}
                      {layoutName === currentLayout && (
                        <Badge variant="outline" className="ml-2">
                          Actual
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Guardar Layout</Label>
            <div className="flex space-x-2 mt-2">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Nombre del layout"
                value={newLayoutName}
                onChange={(e) => setNewLayoutName(e.target.value)}
              />
              <Button onClick={handleSaveNewLayout} size="sm">
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleAddWidget} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Gráfico
            </Button>
            <Button onClick={resetToDefault} variant="outline" className="w-full bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Restablecer
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className={`flex ${isMobile ? "flex-col space-y-4" : "justify-between items-center"} mb-6`}>
        <h1 className={`${isMobile ? "text-xl" : "text-2xl"} font-bold`}>Dashboard de Estadísticas</h1>

        {isMobile ? (
          <div className="flex justify-between items-center">
            <Badge variant="outline">Layout: {currentLayout}</Badge>
            <MobileControls />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <span className="mr-2">Layout: {currentLayout}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Cambiar Layout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.keys(layouts).map((layoutName) => (
                  <DropdownMenuItem
                    key={layoutName}
                    onClick={() => handleChangeLayout(layoutName)}
                    className="flex justify-between items-center"
                  >
                    {layoutName}
                    {layoutName === currentLayout && (
                      <Badge variant="outline" className="ml-2">
                        Actual
                      </Badge>
                    )}
                    {layoutName !== "default" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteLayout(layoutName)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Guardar layout actual</h4>
                  <div className="flex space-x-2">
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Nombre del layout"
                      value={newLayoutName}
                      onChange={(e) => setNewLayoutName(e.target.value)}
                    />
                    <Button onClick={handleSaveNewLayout}>Guardar</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" onClick={resetToDefault}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Restablecer
            </Button>

            <Button onClick={handleAddWidget}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Gráfico
            </Button>
          </div>
        )}
      </div>

      <div className={isFullscreenWidget ? "hidden" : ""}>
        {/* Grid responsive mejorado */}
        <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-12"} gap-2 sm:gap-4`}>
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className={`${isMobile ? "col-span-1" : `col-span-${Math.min(widget.w, 12)}`}`}
              style={{
                minHeight: `${widget.h * (isMobile ? 200 : 150)}px`,
              }}
            >
              <ChartRenderer
                widget={widget}
                onEdit={handleEditWidget}
                onRemove={handleRemoveWidget}
                onResize={handleResizeWidget}
              />
            </div>
          ))}
        </div>
      </div>

      {isFullscreenWidget && (
        <div className="fixed inset-0 z-50 bg-background p-2 sm:p-6">
          <ChartRenderer
            widget={widgets.find((w) => w.id === isFullscreenWidget)!}
            onEdit={handleEditWidget}
            onRemove={handleRemoveWidget}
            onResize={handleResizeWidget}
          />
        </div>
      )}

      <EditWidgetDialog
        widget={editingWidget}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setEditingWidget(null)
        }}
        onSave={handleSaveWidget}
      />
    </div>
  )
}

export default Estadisticas
