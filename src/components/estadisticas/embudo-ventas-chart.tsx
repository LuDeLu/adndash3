"use client"

import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EmbudoVentasChartProps {
  data: {
    leadsGenerados: number
    noInteresados: number
    enSeguimiento: number
    reunionAgendada: number
    conversionFinal: number
  }
}

export function EmbudoVentasChart({ data }: EmbudoVentasChartProps) {
  const funnelSteps = [
    { label: "Atracción de Leads", value: data.leadsGenerados, color: "#006474ff", percentage: 100 },
    {
      label: "Captación de Leads",
      value: data.enSeguimiento,
      color: "#006474ff",
      percentage:  80,
    },
    {
      label: "Nutrición de Leads 1ra conversación",
      value: data.reunionAgendada,
      color: "#753caaff",
      percentage: 70,
    },
    {
      label: "2da Conversación",
      value: Math.floor(data.reunionAgendada * 0.7),
      color: "#753caaff",
      percentage: 60,
    },
    {
      label: "Desenlace/visita",
      value: data.conversionFinal,
      color: "#f43f5e",
      percentage: 30,
    },
  ]

  const conversionRate = ((data.conversionFinal / data.leadsGenerados) * 100).toFixed(2)
  const metaAlto = new Date()
  metaAlto.setMonth(metaAlto.getMonth() + 3)
  const metaAltaDate = metaAlto.toLocaleDateString("es-AR")

  return (
    <Card className="bg-card border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white">
              G
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
              @
            </div>
            <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-xs font-bold text-white">
              in
            </div>
          </div>
        </div>
        <CardDescription className="text-xs mt-2">Meta Alta del 17/25 al 31/07/2025</CardDescription>
        <p className="text-xs text-muted-foreground">
          Tiquet un afluente de <span className="text-cyan-400 font-medium">500-651 personas</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {funnelSteps.map((step, index) => (
          <div key={index} className="relative">
            <div
              className="h-8 rounded-sm flex items-center justify-between px-3 transition-all"
              style={{
                background: step.color,
                width: `${Math.max(step.percentage, 20)}%`,
                marginLeft: `${(100 - Math.max(step.percentage, 20)) / 2}%`,
              }}
            >
              <span className="text-xs font-medium text-white truncate">{step.label}</span>
            </div>
          </div>
        ))}

        <div className="pt-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">conversión</span>
            <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
              {conversionRate}%
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">2° CONVERSACIÓN</span>
            <span className="text-cyan-400">{Math.floor(data.reunionAgendada * 0.7)} (8%) No interesados</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">1° para agendar reunión:</span>
            <span className="text-cyan-400">{data.conversionFinal}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2">¿Cuántos leads pasan cada etapa?</p>
      </CardContent>
    </Card>
  )
}
