"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  CartesianGrid,
} from "recharts"
import { ChartControls, type ChartType, type PeriodType } from "./chart-controls"

interface VentasStockChartProps {
  data: { vendido: number; stock: number }
}

export function VentasStockChart({ data }: VentasStockChartProps) {
  const [chartType, setChartType] = useState<ChartType>("pie")
  const [period, setPeriod] = useState<PeriodType>("month")

  const total = data.vendido + data.stock
  const chartData = [
    { name: "Vendido", value: data.vendido, percentage: ((data.vendido / total) * 100).toFixed(1) },
    { name: "Stock", value: data.stock, percentage: ((data.stock / total) * 100).toFixed(1) },
  ]

  const COLORS = ["#d88a04ff", "#1e3a5f"]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            {payload[0].value} unidades ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-xs text-foreground">
                  {value} {entry.payload.percentage}%
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            {chartData.map((entry, index) => (
              <Line
                key={`line-${index}`}
                type="monotone"
                dataKey="value"
                data={[entry]}
                stroke={COLORS[index]}
                strokeWidth={2}
                dot={{ fill: COLORS[index], r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              fill={COLORS[0]}
              fillOpacity={0.6}
              stroke={COLORS[0]}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "radialBar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" barSize={30} data={chartData}>
            <RadialBar background dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </RadialBar>
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="bottom"
              formatter={(value, entry: any) => (
                <span className="text-xs text-foreground">
                  {value} {entry.payload.percentage}%
                </span>
              )}
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
          <CardTitle className="text-sm font-medium">Ventas vs Stock (en unidades)</CardTitle>
          <ChartControls
            chartType={chartType}
            onChartTypeChange={setChartType}
            period={period}
            onPeriodChange={setPeriod}
            allowedChartTypes={["pie", "bar", "line", "area", "radialBar"]}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
