"use client"

import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: number
  variation?: number
  periodLabel?: string // Added periodLabel prop
  icon?: ReactNode
  prefix?: string
  suffix?: string
  format?: "number" | "currency" | "percent"
  onClick?: () => void
}

export function KPICard({
  title,
  value,
  variation,
  periodLabel = "Últimos 7 días", // Default in Spanish
  icon,
  prefix = "",
  suffix = "",
  format = "number",
  onClick,
}: KPICardProps) {
  const formatValue = (val: number) => {
    if (format === "currency") {
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val)
    }
    if (format === "percent") {
      return `${val.toFixed(1)}%`
    }
    return new Intl.NumberFormat("es-ES").format(val)
  }

  const isPositive = variation !== undefined && variation >= 0
  const showVariation = variation !== undefined && variation !== 0

  return (
    <Card
      className={cn(
        "bg-card border-border/50 hover:border-border transition-colors cursor-pointer",
        onClick && "hover:bg-accent/5",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs text-muted-foreground leading-tight line-clamp-2">{title}</p>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-bold tracking-tight">
            {prefix && format !== "currency" ? prefix : ""}
            {formatValue(value)}
            {suffix}
          </p>
          {showVariation && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-muted-foreground">{periodLabel}</span>
              <span
                className={cn(
                  "inline-flex items-center text-xs font-medium px-1.5 py-0.5 rounded",
                  isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500",
                )}
              >
                {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                {Math.abs(variation).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
