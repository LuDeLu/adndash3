"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, DollarSign, Clock, FileText } from "lucide-react"
import type { EstadisticasPostVenta } from "../../types/postVenta"

type EstadisticasProps = {
  estadisticas: EstadisticasPostVenta | null
}

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"]

export default function Estadisticas({ estadisticas }: EstadisticasProps) {
  if (!estadisticas) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      </div>
    )
  }

  const totalTickets = estadisticas.porEstado.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">Todos los estados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${estadisticas.costoTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Suma de todos los tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.tiempoPromedioResolucion} días</div>
            <p className="text-xs text-muted-foreground">Resolución promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Solucionados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.porEstado.find((e) => e.estado === "Solucionado")?.cantidad || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalTickets > 0
                ? `${Math.round(((estadisticas.porEstado.find((e) => e.estado === "Solucionado")?.cantidad || 0) / totalTickets) * 100)}%`
                : "0%"}{" "}
              del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets por Estado */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={estadisticas.porEstado}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ estado, cantidad }) => `${estado}: ${cantidad}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {estadisticas.porEstado.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tickets por Rubro */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Rubro</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadisticas.porRubro}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rubro" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tickets por Proveedor */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets por Proveedor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadisticas.porProveedor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="proveedor" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Costo por Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Costo por Ticket (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={estadisticas.costoPorTicket.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ticket" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${Number(value).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
                />
                <Bar dataKey="costo" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de costos detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Costos por Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Ticket</th>
                  <th className="text-right p-2">Costo</th>
                </tr>
              </thead>
              <tbody>
                {estadisticas.costoPorTicket.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2">{item.ticket}</td>
                    <td className="text-right p-2 font-medium">
                      ${item.costo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold border-t-2">
                  <td className="p-2">Total</td>
                  <td className="text-right p-2">
                    ${estadisticas.costoTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
