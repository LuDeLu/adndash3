"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface StatisticsOverviewChartProps {
  data: { mes: string; [key: string]: any }[]
}

export function StatisticsOverviewChart({ data }: StatisticsOverviewChartProps) {
  const projectNames = data.length > 0 ? Object.keys(data[0]).filter((key) => key !== "mes") : []

  const projectColors: { [key: string]: string } = {
    "Dome Apart": "#a855f7",
    "Dome Beruti": "#3b82f6",
    "Dome Boulevard": "#10b981",
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

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Statics Overview</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
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
      </CardHeader>
      <CardContent>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--accent))", opacity: 0.1 }} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="rect"
                formatter={(value) => (
                  <span className="text-xs text-muted-foreground">{value.replace("Dome ", "")}</span>
                )}
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
        </div>
      </CardContent>
    </Card>
  )
}
