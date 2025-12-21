"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

interface StatisticsOverviewChartProps {
  data: { mes: string; [key: string]: any }[]
}

export function StatisticsOverviewChart({ data }: StatisticsOverviewChartProps) {
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [period, setPeriod] = useState<PeriodType>("month")

  const projectNames = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "mes") : []

  const projectColors: { [key: string]: string } = {
    "Dome Apart": "#a855f7",
    "Dome Beruti": "#3b82f6",
    "DOME Cerviño Boulevard": "#10b981",
    "Dome Palermo": "#f59e0b",
    "Dome Puertos": "#ef4444",
    "Dome Suites": "#8b5cf6",
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data: data,
    }

    const commonAxisProps = {
      xAxis: (
        <XAxis
          dataKey="mes"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
      ),
      yAxis: (
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          tickFormatter={(value) => `${value / 1000}k`}
        />
      ),
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="rect"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value.replace("Dome ", "")}</span>}
            />
            {projectNames.map((projectName, index) => {
              const color = projectColors[projectName] || `hsl(${index * 60}, 70%, 50%)`
              return (
                <Bar
                  key={projectName}
                  dataKey={projectName}
                  name={projectName}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={20}
                />
              )
            })}
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="line"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value.replace("Dome ", "")}</span>}
            />
            {projectNames.map((projectName, index) => {
              const color = projectColors[projectName] || `hsl(${index * 60}, 70%, 50%)`
              return (
                <Line
                  key={projectName}
                  type="monotone"
                  dataKey={projectName}
                  name={projectName}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "area") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="rect"
              formatter={(value) => <span className="text-xs text-muted-foreground">{value.replace("Dome ", "")}</span>}
            />
            {projectNames.map((projectName, index) => {
              const color = projectColors[projectName] || `hsl(${index * 60}, 70%, 50%)`
              return (
                <Area
                  key={projectName}
                  type="monotone"
                  dataKey={projectName}
                  name={projectName}
                  fill={color}
                  fillOpacity={0.3}
                  stroke={color}
                  strokeWidth={2}
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "scatter") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            <ZAxis range={[60, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value.replace("Dome ", "")}</span>}
            />
            {projectNames.map((projectName, index) => {
              const color = projectColors[projectName] || `hsl(${index * 60}, 70%, 50%)`
              return <Scatter key={projectName} name={projectName} data={data} dataKey={projectName} fill={color} />
            })}
          </ScatterChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "radar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart {...commonProps}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="mes" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
            <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value.replace("Dome ", "")}</span>}
            />
            {projectNames.map((projectName, index) => {
              const color = projectColors[projectName] || `hsl(${index * 60}, 70%, 50%)`
              return (
                <Radar
                  key={projectName}
                  name={projectName}
                  dataKey={projectName}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                />
              )
            })}
          </RadarChart>
        </ResponsiveContainer>
      )
    }

    if (chartType === "composed") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            {commonAxisProps.xAxis}
            {commonAxisProps.yAxis}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value.replace("Dome ", "")}</span>}
            />
            {projectNames.map((projectName, index) => {
              const color = projectColors[projectName] || `hsl(${index * 60}, 70%, 50%)`
              if (index % 2 === 0) {
                return (
                  <Bar
                    key={projectName}
                    dataKey={projectName}
                    name={projectName}
                    fill={color}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                )
              } else {
                return (
                  <Line
                    key={projectName}
                    type="monotone"
                    dataKey={projectName}
                    name={projectName}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ fill: color, r: 3 }}
                  />
                )
              }
            })}
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
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium">Statistics Overview</CardTitle>
            <div className="flex items-center gap-2 flex-wrap mt-2">
              {projectNames.slice(0, 6).map((projectName, index) => {
                const color = projectColors[projectName] || `hsl(${index * 60}, 70%, 50%)`
                return (
                  <Badge
                    key={projectName}
                    variant="outline"
                    className="text-xs"
                    style={{
                      backgroundColor: `${color}10`,
                      color: color,
                      borderColor: `${color}20`,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: color }} />
                    {projectName.replace("Dome ", "")}
                  </Badge>
                )
              })}
            </div>
          </div>
          <ChartControls
            chartType={chartType}
            onChartTypeChange={setChartType}
            period={period}
            onPeriodChange={setPeriod}
            allowedChartTypes={["bar", "line", "area", "scatter", "radar", "composed"]}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">{renderChart()}</div>
      </CardContent>
    </Card>
  )
}
