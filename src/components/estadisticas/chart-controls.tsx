"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, LineChartIcon, PieChartIcon, AreaChartIcon, ScatterChart, Radar } from "lucide-react"

export type ChartType = "bar" | "line" | "pie" | "area" | "scatter" | "radar" | "radialBar" | "composed"
export type PeriodType = "day" | "week" | "month" | "year"

interface ChartControlsProps {
  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
  period: PeriodType
  onPeriodChange: (period: PeriodType) => void
  allowedChartTypes?: ChartType[]
}

export function ChartControls({
  chartType,
  onChartTypeChange,
  period,
  onPeriodChange,
  allowedChartTypes = ["bar", "line", "pie", "area", "scatter", "radar", "radialBar", "composed"],
}: ChartControlsProps) {
  const chartTypeIcons = {
    bar: <BarChart3 className="h-4 w-4" />,
    line: <LineChartIcon className="h-4 w-4" />,
    pie: <PieChartIcon className="h-4 w-4" />,
    area: <AreaChartIcon className="h-4 w-4" />,
    scatter: <ScatterChart className="h-4 w-4" />,
    radar: <Radar className="h-4 w-4" />,
    radialBar: <PieChartIcon className="h-4 w-4" />,
    composed: <BarChart3 className="h-4 w-4" />,
  }

  const chartTypeLabels = {
    bar: "Barras",
    line: "Línea",
    pie: "Circular",
    area: "Área",
    scatter: "Dispersión",
    radar: "Radar",
    radialBar: "Radial",
    composed: "Combinado",
  }

  const periodLabels = {
    day: "Día",
    week: "Semana",
    month: "Mes",
    year: "Año",
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Select value={period} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[110px] h-8">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Día</SelectItem>
          <SelectItem value="week">Semana</SelectItem>
          <SelectItem value="month">Mes</SelectItem>
          <SelectItem value="year">Año</SelectItem>
        </SelectContent>
      </Select>

      <Select value={chartType} onValueChange={onChartTypeChange}>
        <SelectTrigger className="w-[140px] h-8">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          {allowedChartTypes.map((type) => (
            <SelectItem key={type} value={type}>
              <div className="flex items-center gap-2">
                {chartTypeIcons[type]}
                <span>{chartTypeLabels[type]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
