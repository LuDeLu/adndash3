"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { ChartControls, type ChartType, type PeriodType } from "./chart-controls"

interface VendidoPorProyectoChartProps {
  data: { nombre: string; monto: number }[]
}

export function VendidoPorProyectoChart({ data }: VendidoPorProyectoChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [period, setPeriod] = useState<PeriodType>("month")

  const COLORS = ["#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium">{label || payload[0].name}</p>
          <p className="text-xs text-muted-foreground">${payload[0].value.toLocaleString()} USD</p>
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }} />
            <Bar dataKey="monto" fill="#06b6d4" radius={[0, 4, 4, 0]} maxBarSize={24} />
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="monto" nameKey="nombre">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="nombre"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="monto"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={{ fill: "#06b6d4", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="nombre"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="monto" fill="#06b6d4" fillOpacity={0.3} stroke="#06b6d4" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "radialBar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" barSize={15} data={data}>
            <RadialBar minAngle={15} background clockWise dataKey="monto">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </RadialBar>
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="bottom"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadialBarChart>
        </ResponsiveContainer>
      )
    }

    return null
  }

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-medium">Vendido en $$ (por proyecto)</CardTitle>
          <ChartControls
            chartType={chartType}
            onChartTypeChange={setChartType}
            period={period}
            onPeriodChange={setPeriod}
            allowedChartTypes={["bar", "pie", "line", "area", "radialBar"]}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
