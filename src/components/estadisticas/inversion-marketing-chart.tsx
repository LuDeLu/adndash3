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

interface InversionMarketingChartProps {
  data: { mes: string; inversion: number; leads: number }[]
}

export function InversionMarketingChart({ data }: InversionMarketingChartProps) {
  const [chartType, setChartType] = useState<ChartType>("line")
  const [period, setPeriod] = useState<PeriodType>("month")

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.dataKey === "inversion" ? `$${entry.value.toLocaleString()}` : entry.value}
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
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="inversion"
              name="Inversión"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: "#a855f7", strokeWidth: 0, r: 4 }}
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
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Bar yAxisId="left" dataKey="inversion" name="Inversión" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="leads" name="Leads" fill="#a855f7" radius={[4, 4, 0, 0]} />
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
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="inversion"
              name="Inversión"
              fill="#3b82f6"
              fillOpacity={0.3}
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="leads"
              name="Leads"
              fill="#a855f7"
              fillOpacity={0.3}
              stroke="#a855f7"
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
              dataKey="inversion"
              name="Inversión"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              dataKey="leads"
              name="Leads"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <ZAxis range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            <Scatter name="Marketing Data" data={data} fill="#3b82f6" />
          </ScatterChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "radar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            <Radar name="Inversión" dataKey="inversion" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Radar name="Leads" dataKey="leads" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
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
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            <Bar yAxisId="left" dataKey="inversion" name="Inversión" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="leads"
              name="Leads"
              stroke="#a855f7"
              strokeWidth={2}
              dot={{ fill: "#a855f7", r: 4 }}
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
          <CardTitle className="text-sm font-medium">Inversión marketing vs Leads por canal (en USD)</CardTitle>
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
