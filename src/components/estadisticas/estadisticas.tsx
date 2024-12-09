"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, Radar } from 'recharts'
import { ArrowUpIcon, ArrowDownIcon, DollarSignIcon, UsersIcon, HomeIcon, TargetIcon, TrendingUpIcon, BarChart2Icon, PieChartIcon, LineChartIcon, MenuIcon, Clock, Percent } from 'lucide-react'

import { formatCurrency, formatNumber, formatPercent, cn } from "@/lib/utils"
import { COLORES, datosVentas, datosProyecto, datosVentasPropiedades, datosOcupacion, datosLeads, datosConversion, canalesMarketing, datosRendimientoInversion, datosValorPropiedad, datosSatisfaccionCliente, datosTiempoCierre, datosUnidadesVendidas, datosValorM2, datosVisitasVentas, datosInventario, datosProductividad } from "@/lib/data"

const responsiveText = (baseSize: string) => {
  return cn(
    baseSize,
    {
      'text-sm': baseSize === 'text-base',
      'text-base': baseSize === 'text-lg',
      'text-lg': baseSize === 'text-xl',
      'text-xl': baseSize === 'text-2xl',
      'text-2xl': baseSize === 'text-3xl',
    }
  )
}

const tabOptions = [
  { value: "vistaGeneral", label: "Vista General" },
  { value: "detallesProyecto", label: "Detalles del Proyecto" },
  { value: "analisisVentas", label: "Análisis de Ventas" },
  { value: "estadisticasInmobiliarias", label: "Estadísticas Inmobiliarias" },
  { value: "rendimientoMarketing", label: "Ren. de Marketing" },
  { value: "financiero", label: "Análisis Financiero" },
  { value: "rendimientoEquipo", label: "Ren. del Equipo" },
  { value: "inventario", label: "Inventario" },
]

export default function Dashboard() {
  const [periodoTiempo, setPeriodoTiempo] = useState<"semana" | "mes" | "año">("mes")
  const [proyecto, setProyecto] = useState("todos")
  const [activeTab, setActiveTab] = useState("vistaGeneral")

  // Datos de ejemplo para nuevas visualizaciones
  const datosRendimientoVendedores = [
    { nombre: "Raul", ventas: 450000, comision: 22500 },
    { nombre: "Carlos", ventas: 380000, comision: 19000 },
    { nombre: "Luciano", ventas: 520000, comision: 26000 },
    { nombre: "Lucas", ventas: 290000, comision: 14500 },
    { nombre: "Maria", ventas: 410000, comision: 20500 },
  ]

  const datosTiempoVenta = [
    { propiedad: "Local", dias: 45 },
    { propiedad: "Mono amb", dias: 30 },
    { propiedad: "2 Amb", dias: 60 },
    { propiedad: "3 Amb", dias: 20 },
    { propiedad: "4 Amb", dias: 40 },
  ]

  const datosComparativaPrecios = [
    { tipo: "Apartamento", precioLista: 200000, precioVenta: 195000 },
    { tipo: "Casa", precioLista: 350000, precioVenta: 340000 },
    { tipo: "Dúplex", precioLista: 280000, precioVenta: 275000 },
    { tipo: "Ático", precioLista: 400000, precioVenta: 410000 },
    { tipo: "Chalet", precioLista: 500000, precioVenta: 490000 },
  ]

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Panel de Control Inmobiliario</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => setPeriodoTiempo("semana")}>Semana</Button>
          <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => setPeriodoTiempo("mes")}>Mes</Button>
          <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => setPeriodoTiempo("año")}>Año</Button>
        </div>
      </div>

      <Select onValueChange={setProyecto} defaultValue={proyecto}>
        <SelectTrigger className="w-full sm:w-[200px] mb-4 sm:mb-0">
          <SelectValue placeholder="Seleccionar proyecto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los Proyectos</SelectItem>
          <SelectItem value="proyectoA">DOME Palermo Residence</SelectItem>
          <SelectItem value="proyectoB">DOME Palermo Apartments</SelectItem>
          <SelectItem value="proyectoC">DOME Suites & Residence</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={responsiveText('text-sm')}>Unidades Vendidas</CardTitle>
            <HomeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={responsiveText('text-2xl')}>{formatNumber(97)}</div>
            <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={responsiveText('text-sm')}>Valor Total de Ventas</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={responsiveText('text-2xl')}>{formatCurrency(3450000)}</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={responsiveText('text-sm')}>Tiempo Promedio de Cierre</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={responsiveText('text-2xl')}>33 días</div>
            <p className="text-xs text-muted-foreground">-5 días desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className={responsiveText('text-sm')}>Tasa de Conversión</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={responsiveText('text-2xl')}>{formatPercent(13.2)}</div>
            <p className="text-xs text-muted-foreground">+2.4% desde el mes pasado</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="block md:hidden w-full">
          <Select onValueChange={setActiveTab} defaultValue={activeTab}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar vista" />
            </SelectTrigger>
            <SelectContent>
              {tabOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="hidden md:flex md:flex-wrap justify-start md:grid-cols-3 lg:grid-cols-6 gap-2">
            {tabOptions.map((option) => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="vistaGeneral" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Resumen de Ventas</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosVentas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="ventas" name="Ventas" fill="#8884d8" />
                      <Bar dataKey="objetivo" name="Objetivo" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Distribución de Tipos de Propiedades</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Apartamentos', value: 35 },
                          { name: 'Casas', value: 25 },
                          { name: 'Oficinas', value: 20 },
                          { name: 'Locales', value: 15 },
                          { name: 'Terrenos', value: 5 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosProyecto.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Unidades Vendidas vs Tiempo de Cierre</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={datosUnidadesVendidas.map((d, i) => ({...d, tiempo: datosTiempoCierre[i].tiempo}))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="unidades" fill="#8884d8" name="Unidades Vendidas" />
                      <Line yAxisId="right" type="monotone" dataKey="tiempo" stroke="#82ca9d" name="Tiempo de Cierre (días)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Valor Promedio de Venta</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={datosVentas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Area type="monotone" dataKey="ventas" name="Valor Promedio" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="detallesProyecto" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Estado de los Proyectos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300} minHeight={300}>
                    <PieChart>
                      <Pie
                        data={datosProyecto}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosProyecto.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Satisfacción del Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300} minHeight={300}>
                    <LineChart data={datosSatisfaccionCliente}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="satisfaccion" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analisisVentas" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Ventas vs Objetivo</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosVentas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="ventas" name="Ventas" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="objetivo" name="Objetivo" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Comparativa de Precios</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosComparativaPrecios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="precioLista" name="Precio Lista" fill="#8884d8" />
                      <Bar dataKey="precioVenta" name="Precio Venta" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Valor m² de Lista vs Cierre</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosValorM2}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="listaM2" name="Valor m² Lista" fill="#8884d8" />
                      <Bar dataKey="cierreM2" name="Valor m² Cierre" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Visitas vs Ventas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={datosVisitasVentas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="visitas" fill="#8884d8" name="Número de Visitas" />
                      <Line yAxisId="right" type="monotone" dataKey="ventas" stroke="#82ca9d" name="Ventas" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Tiempo Promedio de Venta por Propiedad</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosTiempoVenta} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="propiedad" type="category" />
                    <Tooltip formatter={(value) => `${value} días`} />
                    <Bar dataKey="dias" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="estadisticasInmobiliarias" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Propiedades Vendidas por Mes</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosVentasPropiedades}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="vendidas" name="Propiedades Vendidas" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Tasa de Ocupación</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={datosOcupacion}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="valor"
                        label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosOcupacion.map((entry,index) => (
                          <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Evolución del Valor de Propiedades</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={datosValorPropiedad}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Area type="monotone" dataKey="valor" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rendimientoMarketing" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Generación de Leads</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosLeads}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="leads" name="Leads Generados" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Tasa de Conversión</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosConversion}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="tasa" name="Tasa de Conversión" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Retorno de Inversión en Marketing (ROMI)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosRendimientoInversion}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="roi" name="ROMI" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Costo por Adquisición de Cliente (CAC)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { mes: 'Ene', cac: 1000 },
                      { mes: 'Feb', cac: 950 },
                      { mes: 'Mar', cac: 900 },
                      { mes: 'Abr', cac: 920 },
                      { mes: 'May', cac: 880 },
                      { mes: 'Jun', cac: 850 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Bar dataKey="cac" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Efectividad de Canales de Marketing</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={canalesMarketing}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="nombre" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Efectividad" dataKey="valor" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => `${value}%`} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rendimientoEquipo" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Rendimiento de Vendedores</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ventas" name="Ventas" type="number" />
                    <YAxis dataKey="comision" name="Comisión" type="number" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value) => formatCurrency(value as number)} />
                    <Scatter name="Vendedores" data={datosRendimientoVendedores} fill="#8884d8">
                      {datosRendimientoVendedores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Top 5 Vendedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datosRendimientoVendedores}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Bar dataKey="ventas" name="Ventas" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Distribución de Comisiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={datosRendimientoVendedores}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="comision"
                        label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                      >
                        {datosRendimientoVendedores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Productividad del Equipo: Ventas Propias vs Brokers</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={datosProductividad}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Area type="monotone" dataKey="propias" stackId="1" stroke="#8884d8" fill="#8884d8" name="Ventas Propias" />
                    <Area type="monotone" dataKey="brokers" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Ventas de Brokers" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="financiero" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Rendimiento de la Inversión (ROI)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datosRendimientoInversion}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      <Line type="monotone" dataKey="roi" name="ROI" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Flujo de Caja</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { mes: 'Ene', ingresos: 50000, gastos: 30000 },
                        { mes: 'Feb', ingresos: 55000, gastos: 35000 },
                        { mes: 'Mar', ingresos: 60000, gastos: 32000 },
                        { mes: 'Abr', ingresos: 58000, gastos: 34000 },
                        { mes: 'May', ingresos: 65000, gastos: 36000 },
                        { mes: 'Jun', ingresos: 70000, gastos: 38000 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Area type="monotone" dataKey="ingresos" stackId="1" stroke="#8884d8" fill="#8884d8" />
                      <Area type="monotone" dataKey="gastos" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="inventario" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Inventario de Propiedades</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={datosInventario} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="tipo" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="unidades" name="Unidades" fill="#8884d8" />
                    <Bar dataKey="m2" name="Metros Cuadrados" fill="#82ca9d" />
                    <Bar dataKey="valor" name="Valor ($)" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

