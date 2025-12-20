"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from "recharts"
import { ChartControls, type ChartType, type PeriodType } from "./chart-controls"

interface ProjectData {
  proyecto: string
  vendido: number
  precioLista: number
}

interface VendidoPrecioListaChartProps {
  data: ProjectData[]
}

export function VendidoPrecioListaChart({ data }: VendidoPrecioListaChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line")
  const [period, setPeriod] = useState<PeriodType>("month")

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()} USD
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="proyecto"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="vendido"
              name="Vendido"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="precioLista"
              name="Precio Lista"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="proyecto"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Bar dataKey="vendido" name="Vendido" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="precioLista" name="Precio Lista" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="proyecto"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="vendido"
              name="Vendido"
              fill="#06b6d4"
              fillOpacity={0.3}
              stroke="#06b6d4"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="precioLista"
              name="Precio Lista"
              fill="#8b5cf6"
              fillOpacity={0.3}
              stroke="#8b5cf6"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "scatter") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="vendido"
              name="Vendido"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              dataKey="precioLista"
              name="Precio Lista"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <ZAxis range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            <Scatter name="Proyectos" data={data} fill="#06b6d4" />
          </ScatterChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "radar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="proyecto" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
            <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            <Radar name="Vendido" dataKey="vendido" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
            <Radar name="Precio Lista" dataKey="precioLista" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "composed") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="proyecto"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            <Bar dataKey="vendido" name="Vendido" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="precioLista"
              name="Precio Lista"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )
    }

    return null
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-medium">Vendido vs Precio de lista (en USD)</CardTitle>
          <ChartControls
            chartType={chartType}
            onChartTypeChange={setChartType}
            period={period}
            onPeriodChange={setPeriod}
            allowedChartTypes={["line", "bar", "area", "scatter", "radar", "composed"]}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
