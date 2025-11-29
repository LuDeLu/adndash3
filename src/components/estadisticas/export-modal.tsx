"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FileText, FileSpreadsheet, Loader2, CheckCircle2, Info, Download } from "lucide-react"
import jsPDF from "jspdf"

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: any
  periodLabel: string
  dashboardRef: React.RefObject<HTMLDivElement>
}

type ExportType = "simple" | "detallada"

// Tamaño real A4 en milímetros
const A4_WIDTH = 210
const A4_HEIGHT = 297

// Márgenes recomendados A4
const MARGIN_TOP = 20
const MARGIN_BOTTOM = 20
const MARGIN_LEFT = 20
const MARGIN_RIGHT = 20

// Área utilizable
const CONTENT_WIDTH = A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT
const CONTENT_HEIGHT = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM

// Header y footer
const HEADER_HEIGHT = 40   // Altura estándar para encabezado
const FOOTER_HEIGHT = 15   // Altura estándar para pie de página

// Límites del contenido
const CONTENT_START_Y = MARGIN_TOP + HEADER_HEIGHT
const CONTENT_END_Y = A4_HEIGHT - MARGIN_BOTTOM - FOOTER_HEIGHT

export function ExportModal({ open, onOpenChange, data, periodLabel }: ExportModalProps) {
  const [exportType, setExportType] = useState<ExportType>("simple")
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => setLogoImage(img)
    img.onerror = () => console.log("Logo no encontrado, usando texto")
    img.src = "/images/logo/adn-developers-logo-big.png"
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PY", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-PY").format(value)
  }

  const formatDate = () => {
    return new Date().toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const hasSpaceFor = (currentY: number, requiredHeight: number): boolean => {
    return currentY + requiredHeight <= CONTENT_END_Y
  }

  const roundedRect = (
    pdf: jsPDF,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    style: "F" | "S" | "FD" = "F",
  ) => {
    pdf.roundedRect(x, y, w, h, r, r, style)
  }

  const drawTextLogo = (pdf: jsPDF, x: number, y: number) => {
    pdf.setFontSize(20)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(255, 255, 255)
    pdf.text("ADN", x, y)
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.text("Developers", x, y + 5)
  }

  const addHeader = (pdf: jsPDF, title: string, subtitle: string) => {
    // Fondo principal del header
    pdf.setFillColor(15, 23, 42)
    pdf.rect(0, 0, A4_WIDTH, 45, "F")

    // Línea de acento cyan
    pdf.setFillColor(6, 182, 212)
    pdf.rect(0, 45, A4_WIDTH, 2, "F")

    // Logo
    if (logoImage) {
      try {
        pdf.addImage(logoImage, "PNG", MARGIN_LEFT, 8, 32, 28)
      } catch {
        drawTextLogo(pdf, MARGIN_LEFT, 26)
      }
    } else {
      drawTextLogo(pdf, MARGIN_LEFT, 26)
    }

    // Título principal
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(18)
    pdf.setFont("helvetica", "bold")
    pdf.text(title, 55, 22)

    // Subtítulo
    pdf.setFontSize(10)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(148, 163, 184)
    pdf.text(subtitle, 55, 32)

    // Fecha a la derecha
    pdf.setFontSize(8)
    pdf.setTextColor(148, 163, 184)
    const dateText = formatDate()
    const dateWidth = pdf.getTextWidth(dateText)
    pdf.text(dateText, A4_WIDTH - MARGIN_RIGHT - dateWidth, 16)

    // Badge del período
    pdf.setFillColor(6, 182, 212)
    const periodWidth = pdf.getTextWidth(periodLabel) + 12
    roundedRect(pdf, A4_WIDTH - MARGIN_RIGHT - periodWidth, 22, periodWidth, 12, 3, "F")
    pdf.setTextColor(15, 23, 42)
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "bold")
    pdf.text(periodLabel, A4_WIDTH - MARGIN_RIGHT - periodWidth + 6, 30)
  }

  const addFooter = (pdf: jsPDF, pageNum: number, totalPages: number) => {
    const footerY = A4_HEIGHT - MARGIN_BOTTOM


    // Texto del footer
    pdf.setFontSize(7)
    pdf.setTextColor(100, 116, 139)
    pdf.setFont("helvetica", "normal")

    // Número de página
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(6, 182, 212)
    const pageText = `${pageNum} / ${totalPages}`
    const pageWidth = pdf.getTextWidth(pageText)
    pdf.text(pageText, A4_WIDTH - MARGIN_RIGHT - pageWidth, footerY + 7)

  }

  const drawSectionTitle = (pdf: jsPDF, y: number, title: string): number => {
    // Fondo sutil para la sección
    pdf.setFillColor(248, 250, 252)
    roundedRect(pdf, MARGIN_LEFT, y, CONTENT_WIDTH, 14, 2, "F")

    // Indicador de color
    pdf.setFillColor(6, 182, 212)
    roundedRect(pdf, MARGIN_LEFT + 2, y + 2, 3, 10, 1, "F")

    // Título
    pdf.setFontSize(11)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(15, 23, 42)
    pdf.text(title, MARGIN_LEFT + 10, y + 9)

    return y + 18
  }

  const drawKPICard = (
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    value: string,
    variation: number,
    color: number[],
    description?: string,
  ) => {
    // Sombra
    pdf.setFillColor(230, 235, 240)
    roundedRect(pdf, x + 0.5, y + 0.5, width, height, 3, "F")

    // Fondo de la tarjeta
    pdf.setFillColor(255, 255, 255)
    roundedRect(pdf, x, y, width, height, 3, "F")

    // Borde
    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(0.3)
    roundedRect(pdf, x, y, width, height, 3, "S")

    // Barra de color superior
    pdf.setFillColor(color[0], color[1], color[2])
    pdf.rect(x + 6, y, width - 12, 2, "F")

    // Icono de color
    pdf.setFillColor(color[0], color[1], color[2])
    pdf.circle(x + 10, y + 12, 4, "F")
    pdf.setFillColor(255, 255, 255)
    pdf.circle(x + 10, y + 12, 2, "F")

    // Etiqueta
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(100, 116, 139)
    pdf.text(label.toUpperCase(), x + 18, y + 11)

    // Valor principal
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(15, 23, 42)
    pdf.text(value, x + 18, y + 22)

    // Descripción
    if (description) {
      pdf.setFontSize(6)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(148, 163, 184)
      pdf.text(description, x + 18, y + 28)
    }

    // Badge de variación
    const isPositive = variation >= 0
    const variationText = `${isPositive ? "+" : ""}${variation.toFixed(1)}%`
    const badgeWidth = 22

    if (isPositive) {
      pdf.setFillColor(220, 252, 231)
      pdf.setTextColor(22, 163, 74)
    } else {
      pdf.setFillColor(254, 226, 226)
      pdf.setTextColor(220, 38, 38)
    }

    roundedRect(pdf, x + width - badgeWidth - 5, y + 6, badgeWidth, 10, 2, "F")
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "bold")
    pdf.text(variationText, x + width - badgeWidth - 2, y + 12.5)
  }

  const drawTable = (
    pdf: jsPDF,
    y: number,
    headers: string[],
    rows: string[][],
    colWidths: number[],
    options?: { highlightLastRow?: boolean },
  ): number => {
    const rowHeight = 8
    const tableWidth = colWidths.reduce((a, b) => a + b, 0)
    const opts = { highlightLastRow: true, ...options }
    const x = MARGIN_LEFT

    // Header
    pdf.setFillColor(15, 23, 42)
    roundedRect(pdf, x, y, tableWidth, rowHeight + 1, 2, "F")

    pdf.setFontSize(7)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(255, 255, 255)

    let colX = x
    headers.forEach((header, i) => {
      pdf.text(header, colX + 3, y + 6)
      colX += colWidths[i]
    })

    // Filas de datos
    rows.forEach((row, rowIndex) => {
      const rowY = y + (rowHeight + 1) + rowIndex * rowHeight
      const isLastRow = rowIndex === rows.length - 1 && opts.highlightLastRow

      if (isLastRow) {
        pdf.setFillColor(236, 253, 245)
      } else if (rowIndex % 2 === 0) {
        pdf.setFillColor(248, 250, 252)
      } else {
        pdf.setFillColor(255, 255, 255)
      }
      pdf.rect(x, rowY, tableWidth, rowHeight, "F")

      pdf.setDrawColor(241, 245, 249)
      pdf.setLineWidth(0.1)
      pdf.line(x, rowY + rowHeight, x + tableWidth, rowY + rowHeight)

      pdf.setFontSize(7)
      if (isLastRow) {
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(22, 101, 52)
      } else {
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(51, 65, 85)
      }

      colX = x
      row.forEach((cell, i) => {
        pdf.text(cell, colX + 3, rowY + 5.5)
        colX += colWidths[i]
      })
    })

    // Borde exterior
    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(0.3)
    roundedRect(pdf, x, y, tableWidth, rowHeight + 1 + rows.length * rowHeight, 2, "S")

    return y + (rowHeight + 1) + rows.length * rowHeight + 6
  }

  const drawProgressBar = (
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    percentage: number,
    color: number[],
    label?: string,
    value?: string,
  ): number => {
    if (label && value) {
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(51, 65, 85)
      pdf.text(label, x, y - 2)

      pdf.setTextColor(color[0], color[1], color[2])
      const valueWidth = pdf.getTextWidth(value)
      pdf.text(value, x + width - valueWidth, y - 2)
    }

    // Fondo de la barra
    pdf.setFillColor(241, 245, 249)
    roundedRect(pdf, x, y, width, height, height / 2, "F")

    // Barra de progreso
    const fillWidth = Math.max((width * percentage) / 100, height)
    pdf.setFillColor(color[0], color[1], color[2])
    roundedRect(pdf, x, y, fillWidth, height, height / 2, "F")

    // Porcentaje dentro de la barra
    if (percentage > 20) {
      pdf.setFontSize(6)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(255, 255, 255)
      pdf.text(`${percentage.toFixed(1)}%`, x + fillWidth / 2 - 5, y + height / 2 + 2)
    }

    return y + height + 8
  }

  const drawFunnelStep = (
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    height: number,
    data: { label: string; value: number; percentage: number; color: number[] },
    index: number,
  ): number => {
    const shrinkFactor = 1 - index * 0.1
    const stepWidth = width * shrinkFactor
    const stepX = x + (width - stepWidth) / 2

    // Sombra
    pdf.setFillColor(220, 225, 230)
    roundedRect(pdf, stepX + 0.5, y + 0.5, stepWidth, height, 3, "F")

    // Fondo del paso
    pdf.setFillColor(data.color[0], data.color[1], data.color[2])
    roundedRect(pdf, stepX, y, stepWidth, height, 3, "F")

    // Texto
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(255, 255, 255)
    pdf.text(data.label, stepX + 6, y + height / 2 + 2)

    // Valor y porcentaje
    const valueText = formatNumber(data.value)
    const pctText = `${data.percentage.toFixed(1)}%`
    pdf.text(valueText, stepX + stepWidth - pdf.getTextWidth(valueText) - 28, y + height / 2 + 2)

    pdf.setFontSize(6)
    pdf.setFillColor(255, 255, 255)
    roundedRect(pdf, stepX + stepWidth - 24, y + 2, 20, height - 4, 2, "F")
    pdf.setTextColor(data.color[0], data.color[1], data.color[2])
    pdf.text(pctText, stepX + stepWidth - 20, y + height / 2 + 1.5)

    return y + height + 3
  }

  const drawMetricBox = (
    pdf: jsPDF,
    y: number,
    title: string,
    metrics: { label: string; value: string; highlight?: boolean }[],
    bgColor: number[],
    textColor: number[],
    accentColor?: number[],
  ): number => {
    const height = 12 + metrics.length * 8

    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2])
    roundedRect(pdf, MARGIN_LEFT, y, CONTENT_WIDTH, height, 3, "F")

    if (accentColor) {
      pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2])
      pdf.rect(MARGIN_LEFT, y + 3, 3, height - 6, "F")
    }

    pdf.setFontSize(9)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(textColor[0], textColor[1], textColor[2])
    pdf.text(title, MARGIN_LEFT + 8, y + 8)

    pdf.setFontSize(7)
    metrics.forEach((metric, index) => {
      const metricY = y + 15 + index * 7

      if (metric.highlight) {
        pdf.setFont("helvetica", "bold")
      } else {
        pdf.setFont("helvetica", "normal")
      }

      pdf.setTextColor(textColor[0], textColor[1], textColor[2])
      pdf.text(`• ${metric.label}:`, MARGIN_LEFT + 8, metricY)

      pdf.setFont("helvetica", "bold")
      const valueX = MARGIN_LEFT + 10 + pdf.getTextWidth(`• ${metric.label}: `)
      pdf.text(metric.value, valueX, metricY)
    })

    return y + height + 6
  }

  const drawInfoCard = (
    pdf: jsPDF,
    x: number,
    y: number,
    width: number,
    title: string,
    value: string,
    subtitle: string,
    color: number[],
  ) => {
    const height = 35

    pdf.setFillColor(255, 255, 255)
    roundedRect(pdf, x, y, width, height, 3, "F")

    pdf.setDrawColor(226, 232, 240)
    pdf.setLineWidth(0.2)
    roundedRect(pdf, x, y, width, height, 3, "S")

    pdf.setFillColor(color[0], color[1], color[2])
    pdf.rect(x, y, width, 3, "F")

    pdf.setFontSize(7)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(100, 116, 139)
    pdf.text(title.toUpperCase(), x + 5, y + 12)

    pdf.setFontSize(12)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(color[0], color[1], color[2])
    pdf.text(value, x + 5, y + 22)

    pdf.setFontSize(6)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(148, 163, 184)
    pdf.text(subtitle, x + 5, y + 30)
  }

  const drawDonutLegend = (
    pdf: jsPDF,
    y: number,
    data: { label: string; value: number; percentage: number; color: number[] }[],
  ): number => {
    const itemHeight = 12
    const colWidth = CONTENT_WIDTH / 2

    data.forEach((item, index) => {
      const col = index % 2
      const row = Math.floor(index / 2)
      const itemX = MARGIN_LEFT + col * colWidth
      const itemY = y + row * itemHeight

      pdf.setFillColor(248, 250, 252)
      roundedRect(pdf, itemX, itemY, colWidth - 4, itemHeight - 2, 2, "F")

      pdf.setFillColor(item.color[0], item.color[1], item.color[2])
      roundedRect(pdf, itemX + 3, itemY + 2, 8, 8, 1, "F")

      pdf.setFontSize(7)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(51, 65, 85)
      pdf.text(item.label, itemX + 14, itemY + 7)

      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(15, 23, 42)
      const pctText = `${item.percentage}%`
      pdf.text(pctText, itemX + colWidth - 25, itemY + 7)
    })

    return y + Math.ceil(data.length / 2) * itemHeight + 6
  }

  // ==========================================
  // GENERACIÓN DE PDF SIMPLE (1 página)
  // ==========================================
  const generateSimplePDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4")

    addHeader(pdf, "Reporte Ejecutivo", "Resumen de indicadores clave")

    let y = CONTENT_START_Y

    // Sección: KPIs
    y = drawSectionTitle(pdf, y, "Indicadores Clave (KPIs)")

    const kpis = [
      {
        label: "Unid. Entregadas",
        value: formatNumber(data.unidadesEntregadas),
        variation: data.variacionUnidadesEntregadas,
        color: [6, 182, 212],
      },
      {
        label: "Unid. Vendidas",
        value: formatNumber(data.unidadesVendidas),
        variation: data.variacionUnidadesVendidas,
        color: [99, 102, 241],
      },
      {
        label: "Ventas Totales",
        value: formatCurrency(data.ventasTotales),
        variation: data.variacionVentasTotales,
        color: [34, 197, 94],
      },
      {
        label: "Unid. en Stock",
        value: formatNumber(data.unidadesEnStock),
        variation: data.variacionUnidadesStock,
        color: [234, 179, 8],
      },
      {
        label: "Reclamos",
        value: formatNumber(data.cantidadReclamos),
        variation: data.variacionReclamos,
        color: [239, 68, 68],
      },
    ]

    const cardWidth = (CONTENT_WIDTH - 8) / 3
    const cardHeight = 32

    kpis.forEach((kpi, index) => {
      const col = index % 3
      const row = Math.floor(index / 3)
      const xPos = MARGIN_LEFT + col * (cardWidth + 4)
      const yPos = y + row * (cardHeight + 4)
      drawKPICard(pdf, xPos, yPos, cardWidth, cardHeight, kpi.label, kpi.value, kpi.variation, kpi.color)
    })

    y += Math.ceil(kpis.length / 3) * (cardHeight + 4) + 8

    // Sección: Distribución de Inventario
    y = drawSectionTitle(pdf, y, "Distribución de Inventario")

    const totalUnits = data.ventasVsStock.vendido + data.ventasVsStock.stock
    const vendidoPct = totalUnits > 0 ? (data.ventasVsStock.vendido / totalUnits) * 100 : 0
    const stockPct = totalUnits > 0 ? (data.ventasVsStock.stock / totalUnits) * 100 : 0

    y = drawProgressBar(
      pdf,
      MARGIN_LEFT,
      y + 4,
      CONTENT_WIDTH * 0.7,
      10,
      vendidoPct,
      [6, 182, 212],
      "Vendido",
      `${formatNumber(data.ventasVsStock.vendido)} un.`,
    )
    y = drawProgressBar(
      pdf,
      MARGIN_LEFT,
      y,
      CONTENT_WIDTH * 0.7,
      10,
      stockPct,
      [99, 102, 241],
      "En Stock",
      `${formatNumber(data.ventasVsStock.stock)} un.`,
    )

    y += 4

    // Sección: Embudo de Ventas
    y = drawSectionTitle(pdf, y, "Embudo de Ventas")

    const leadsTotal = data.embudoVentas.leadsGenerados || 1
    const funnelData = [
      { label: "Leads Generados", value: data.embudoVentas.leadsGenerados, percentage: 100, color: [6, 182, 212] },
      {
        label: "En Seguimiento",
        value: data.embudoVentas.enSeguimiento,
        percentage: (data.embudoVentas.enSeguimiento / leadsTotal) * 100,
        color: [234, 179, 8],
      },
      {
        label: "Reunión Agendada",
        value: data.embudoVentas.reunionAgendada,
        percentage: (data.embudoVentas.reunionAgendada / leadsTotal) * 100,
        color: [168, 85, 247],
      },
      {
        label: "Conversión Final",
        value: data.embudoVentas.conversionFinal,
        percentage: (data.embudoVentas.conversionFinal / leadsTotal) * 100,
        color: [34, 197, 94],
      },
    ]

    funnelData.forEach((step, index) => {
      y = drawFunnelStep(pdf, MARGIN_LEFT, y, CONTENT_WIDTH - 30, 12, step, index)
    })

    y += 4

    // Métrica de conversión
    const conversionRate = ((data.embudoVentas.conversionFinal / leadsTotal) * 100).toFixed(2)
    y = drawMetricBox(
      pdf,
      y,
      "Tasa de Conversión Global",
      [
        { label: "Leads a Clientes", value: `${conversionRate}%`, highlight: true },
        { label: "Total Convertidos", value: formatNumber(data.embudoVentas.conversionFinal) },
      ],
      [220, 252, 231],
      [22, 101, 52],
      [34, 197, 94],
    )

    addFooter(pdf, 1, 1)

    return pdf
  }

  // ==========================================
  // GENERACIÓN DE PDF DETALLADO (5 páginas)
  // ==========================================
  const generateDetailedPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4")
    let currentPage = 1
    const totalPages = 5
    const precioPromedio = 75000

    // ========== PÁGINA 1: Portada y KPIs ==========
    addHeader(pdf, "Reporte Analítico Completo", "Análisis integral de métricas empresariales")

    let y = CONTENT_START_Y

    // Introducción
    pdf.setFillColor(248, 250, 252)
    roundedRect(pdf, MARGIN_LEFT, y, CONTENT_WIDTH, 18, 3, "F")
    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(71, 85, 105)
    const introText = `Este reporte presenta un análisis detallado del rendimiento empresarial para el período "${periodLabel}". Incluye indicadores clave, análisis de inventario, embudo de ventas y estrategias de marketing.`
    const introLines = pdf.splitTextToSize(introText, CONTENT_WIDTH - 12)
    pdf.text(introLines, MARGIN_LEFT + 6, y + 8)

    y += 24

    // KPIs
    y = drawSectionTitle(pdf, y, "Indicadores Clave de Rendimiento (KPIs)")

    const kpisDetailed = [
      {
        label: "Unidades Entregadas",
        value: formatNumber(data.unidadesEntregadas),
        variation: data.variacionUnidadesEntregadas,
        color: [6, 182, 212],
        desc: "Entregadas a clientes",
      },
      {
        label: "Unidades Vendidas",
        value: formatNumber(data.unidadesVendidas),
        variation: data.variacionUnidadesVendidas,
        color: [99, 102, 241],
        desc: "Incluye reservas",
      },
      {
        label: "Ventas Totales (USD)",
        value: formatCurrency(data.ventasTotales),
        variation: data.variacionVentasTotales,
        color: [34, 197, 94],
        desc: "Valor en USD",
      },
      {
        label: "Unidades en Stock",
        value: formatNumber(data.unidadesEnStock),
        variation: data.variacionUnidadesStock,
        color: [234, 179, 8],
        desc: "Disponibles",
      },
      {
        label: "Cantidad de Reclamos",
        value: formatNumber(data.cantidadReclamos),
        variation: data.variacionReclamos,
        color: [239, 68, 68],
        desc: "Tickets activos",
      },
    ]

    const cardWidth = (CONTENT_WIDTH - 6) / 2
    const cardHeight = 34

    kpisDetailed.forEach((kpi, index) => {
      const col = index % 2
      const row = Math.floor(index / 2)
      const xPos = MARGIN_LEFT + col * (cardWidth + 6)
      const yPos = y + row * (cardHeight + 5)
      drawKPICard(pdf, xPos, yPos, cardWidth, cardHeight, kpi.label, kpi.value, kpi.variation, kpi.color, kpi.desc)
    })

    y += Math.ceil(kpisDetailed.length / 2) * (cardHeight + 5) + 10

    // Análisis de variaciones
    pdf.setFontSize(9)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(51, 65, 85)
    pdf.text("Análisis de Variaciones", MARGIN_LEFT, y)
    y += 6

    const positiveKpis = kpisDetailed.filter((k) => k.variation >= 0).length
    const negativeKpis = kpisDetailed.length - positiveKpis

    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(71, 85, 105)
    pdf.text(
      `De los ${kpisDetailed.length} indicadores, ${positiveKpis} muestran tendencia positiva y ${negativeKpis} presentan variación negativa.`,
      MARGIN_LEFT,
      y,
    )

    addFooter(pdf, currentPage, totalPages)

    // ========== PÁGINA 2: Análisis de Inventario ==========
    pdf.addPage()
    currentPage++
    addHeader(pdf, "Análisis de Inventario", "Distribución y valoración del inventario")

    y = CONTENT_START_Y

    y = drawSectionTitle(pdf, y, "Distribución del Inventario")

    const totalUnits = data.ventasVsStock.vendido + data.ventasVsStock.stock
    const vendidoPct = totalUnits > 0 ? (data.ventasVsStock.vendido / totalUnits) * 100 : 0
    const stockPct = totalUnits > 0 ? (data.ventasVsStock.stock / totalUnits) * 100 : 0

    y = drawProgressBar(
      pdf,
      MARGIN_LEFT,
      y + 4,
      CONTENT_WIDTH,
      12,
      vendidoPct,
      [6, 182, 212],
      "Unidades Vendidas",
      `${formatNumber(data.ventasVsStock.vendido)} un. (${vendidoPct.toFixed(1)}%)`,
    )
    y += 4
    y = drawProgressBar(
      pdf,
      MARGIN_LEFT,
      y,
      CONTENT_WIDTH,
      12,
      stockPct,
      [99, 102, 241],
      "Unidades en Stock",
      `${formatNumber(data.ventasVsStock.stock)} un. (${stockPct.toFixed(1)}%)`,
    )

    y += 6

    // Tabla de inventario
    y = drawSectionTitle(pdf, y, "Desglose de Inventario y Valoración")

    y = drawTable(
      pdf,
      y,
      ["Categoría", "Unidades", "% Total", "Precio Prom.", "Valor Est."],
      [
        [
          "Vendido",
          formatNumber(data.ventasVsStock.vendido),
          `${vendidoPct.toFixed(1)}%`,
          formatCurrency(precioPromedio),
          formatCurrency(data.ventasVsStock.vendido * precioPromedio),
        ],
        [
          "En Stock",
          formatNumber(data.ventasVsStock.stock),
          `${stockPct.toFixed(1)}%`,
          formatCurrency(precioPromedio),
          formatCurrency(data.ventasVsStock.stock * precioPromedio),
        ],
        ["TOTAL", formatNumber(totalUnits), "100%", "-", formatCurrency(totalUnits * precioPromedio)],
      ],
      [35, 30, 28, 40, 47],
    )

    // Métricas de inventario
    const valorStock = data.ventasVsStock.stock * precioPromedio
    const velocidadVenta = totalUnits > 0 ? (data.ventasVsStock.vendido / totalUnits) * 100 : 0

    y = drawMetricBox(
      pdf,
      y,
      "Métricas de Inventario",
      [
        { label: "Valor total en stock", value: formatCurrency(valorStock), highlight: true },
        { label: "Valor total vendido", value: formatCurrency(data.ventasVsStock.vendido * precioPromedio) },
        { label: "Velocidad de venta", value: `${velocidadVenta.toFixed(1)}% del inventario` },
      ],
      [239, 246, 255],
      [30, 64, 175],
      [99, 102, 241],
    )

    y += 6

    // Cards informativos
    y = drawSectionTitle(pdf, y, "Indicadores de Rendimiento")

    const cardInfoWidth = (CONTENT_WIDTH - 12) / 3
    drawInfoCard(
      pdf,
      MARGIN_LEFT,
      y,
      cardInfoWidth,
      "Total Unidades",
      formatNumber(totalUnits),
      "En el sistema",
      [6, 182, 212],
    )
    drawInfoCard(
      pdf,
      MARGIN_LEFT + cardInfoWidth + 6,
      y,
      cardInfoWidth,
      "Tasa de Venta",
      `${vendidoPct.toFixed(1)}%`,
      "Del total",
      [34, 197, 94],
    )
    drawInfoCard(
      pdf,
      MARGIN_LEFT + (cardInfoWidth + 6) * 2,
      y,
      cardInfoWidth,
      "Stock Disp.",
      formatNumber(data.ventasVsStock.stock),
      "Para venta",
      [234, 179, 8],
    )

    addFooter(pdf, currentPage, totalPages)

    // ========== PÁGINA 3: Ventas por Proyecto ==========
    pdf.addPage()
    currentPage++
    addHeader(pdf, "Análisis de Ventas", "Rendimiento por proyecto")

    y = CONTENT_START_Y

    y = drawSectionTitle(pdf, y, "Ventas por Proyecto")

    const projectRows = data.vendidoPorProyecto.map((p: any) => {
      const unidadesEst = Math.round(p.monto / precioPromedio)
      const participacion = ((p.monto / data.ventasTotales) * 100).toFixed(1)
      return [p.nombre, formatNumber(unidadesEst), formatCurrency(p.monto), `${participacion}%`]
    })
    const totalVentas = data.vendidoPorProyecto.reduce((sum: number, p: any) => sum + p.monto, 0)
    projectRows.push(["TOTAL GENERAL", "-", formatCurrency(totalVentas), "100%"])

    y = drawTable(pdf, y, ["Proyecto", "Unid. Est.", "Monto (USD)", "Participación"], projectRows, [50, 32, 50, 48])

    // Análisis del proyecto líder
    const topProject = data.vendidoPorProyecto.reduce(
      (max: any, p: any) => (p.monto > (max?.monto || 0) ? p : max),
      null,
    )
    const avgVenta = data.vendidoPorProyecto.length > 0 ? totalVentas / data.vendidoPorProyecto.length : 0

    y = drawMetricBox(
      pdf,
      y,
      "Análisis de Rendimiento por Proyecto",
      [
        { label: "Proyecto líder", value: topProject?.nombre || "N/A", highlight: true },
        { label: "Venta del proyecto líder", value: formatCurrency(topProject?.monto || 0) },
        { label: "Promedio por proyecto", value: formatCurrency(avgVenta) },
        { label: "Total proyectos activos", value: `${data.vendidoPorProyecto.length} proyectos` },
      ],
      [254, 243, 199],
      [133, 77, 14],
      [234, 179, 8],
    )

    y += 8

    // Ranking visual
    y = drawSectionTitle(pdf, y, "Ranking de Proyectos")

    const sortedProjects = [...data.vendidoPorProyecto].sort((a: any, b: any) => b.monto - a.monto)
    const maxMonto = sortedProjects[0]?.monto || 1

    const colors = [
      [6, 182, 212],
      [99, 102, 241],
      [168, 85, 247],
      [234, 179, 8],
      [239, 68, 68],
    ]

    sortedProjects.slice(0, 5).forEach((project: any, index: number) => {
      const pct = (project.monto / maxMonto) * 100

      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(51, 65, 85)
      pdf.text(`${index + 1}. ${project.nombre}`, MARGIN_LEFT, y + 3)

      const barX = MARGIN_LEFT + 45
      const barWidth = CONTENT_WIDTH - 90

      pdf.setFillColor(241, 245, 249)
      roundedRect(pdf, barX, y, barWidth, 8, 2, "F")

      const fillWidth = Math.max((barWidth * pct) / 100, 8)
      pdf.setFillColor(colors[index][0], colors[index][1], colors[index][2])
      roundedRect(pdf, barX, y, fillWidth, 8, 2, "F")

      pdf.setFontSize(7)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(51, 65, 85)
      const valueText = formatCurrency(project.monto)
      pdf.text(valueText, MARGIN_LEFT + CONTENT_WIDTH - pdf.getTextWidth(valueText), y + 5)

      y += 12
    })

    addFooter(pdf, currentPage, totalPages)

    // ========== PÁGINA 4: Embudo de Ventas ==========
    pdf.addPage()
    currentPage++
    addHeader(pdf, "Embudo de Conversión", "Análisis del proceso de ventas")

    y = CONTENT_START_Y

    y = drawSectionTitle(pdf, y, "Embudo de Ventas - Visualización")

    const leadsTotal = data.embudoVentas.leadsGenerados || 1
    const funnelSteps = [
      { label: "Atracción de Leads", value: data.embudoVentas.leadsGenerados, percentage: 100, color: [6, 182, 212] },
      {
        label: "Captación Inicial",
        value: data.embudoVentas.leadsGenerados - data.embudoVentas.noInteresados,
        percentage: ((data.embudoVentas.leadsGenerados - data.embudoVentas.noInteresados) / leadsTotal) * 100,
        color: [59, 130, 246],
      },
      {
        label: "En Seguimiento",
        value: data.embudoVentas.enSeguimiento,
        percentage: (data.embudoVentas.enSeguimiento / leadsTotal) * 100,
        color: [234, 179, 8],
      },
      {
        label: "Reunión Agendada",
        value: data.embudoVentas.reunionAgendada,
        percentage: (data.embudoVentas.reunionAgendada / leadsTotal) * 100,
        color: [168, 85, 247],
      },
      {
        label: "Conversión Final",
        value: data.embudoVentas.conversionFinal,
        percentage: (data.embudoVentas.conversionFinal / leadsTotal) * 100,
        color: [34, 197, 94],
      },
    ]

    funnelSteps.forEach((step, index) => {
      y = drawFunnelStep(pdf, MARGIN_LEFT, y, CONTENT_WIDTH - 40, 14, step, index)
    })

    y += 8

    // Tabla detallada del embudo
    y = drawSectionTitle(pdf, y, "Análisis Detallado de Conversión")

    y = drawTable(
      pdf,
      y,
      ["Etapa", "Cantidad", "% Total", "Pérdida"],
      [
        ["Leads Generados", formatNumber(data.embudoVentas.leadsGenerados), "100%", "-"],
        [
          "No Interesados",
          formatNumber(data.embudoVentas.noInteresados),
          `${((data.embudoVentas.noInteresados / leadsTotal) * 100).toFixed(1)}%`,
          formatNumber(data.embudoVentas.noInteresados),
        ],
        [
          "En Seguimiento",
          formatNumber(data.embudoVentas.enSeguimiento),
          `${((data.embudoVentas.enSeguimiento / leadsTotal) * 100).toFixed(1)}%`,
          "-",
        ],
        [
          "Reunión Agendada",
          formatNumber(data.embudoVentas.reunionAgendada),
          `${((data.embudoVentas.reunionAgendada / leadsTotal) * 100).toFixed(1)}%`,
          "-",
        ],
        [
          "Conversión Final",
          formatNumber(data.embudoVentas.conversionFinal),
          `${((data.embudoVentas.conversionFinal / leadsTotal) * 100).toFixed(1)}%`,
          "-",
        ],
      ],
      [50, 38, 38, 54],
      { highlightLastRow: true },
    )

    // Métricas de conversión
    const conversionRate = ((data.embudoVentas.conversionFinal / leadsTotal) * 100).toFixed(2)
    const meetingRate = ((data.embudoVentas.reunionAgendada / leadsTotal) * 100).toFixed(2)
    const lossRate = ((data.embudoVentas.noInteresados / leadsTotal) * 100).toFixed(2)

    y = drawMetricBox(
      pdf,
      y,
      "Métricas Clave de Conversión",
      [
        { label: "Tasa de conversión (Lead → Cliente)", value: `${conversionRate}%`, highlight: true },
        { label: "Tasa de reuniones agendadas", value: `${meetingRate}%` },
        { label: "Tasa de pérdida inicial", value: `${lossRate}%` },
        { label: "Leads convertidos", value: formatNumber(data.embudoVentas.conversionFinal) },
      ],
      [220, 252, 231],
      [22, 101, 52],
      [34, 197, 94],
    )

    addFooter(pdf, currentPage, totalPages)

    // ========== PÁGINA 5: Marketing y Resumen ==========
    pdf.addPage()
    currentPage++
    addHeader(pdf, "Marketing y Resumen", "Inversión y conclusiones")

    y = CONTENT_START_Y

    // Canales de Marketing
    y = drawSectionTitle(pdf, y, "Distribución por Canales de Marketing")

    const channelColors = [
      [6, 182, 212],
      [99, 102, 241],
      [234, 179, 8],
      [239, 68, 68],
      [168, 85, 247],
    ]
    const channelData = data.canalesMarketing.map((c: any, i: number) => ({
      label: c.canal,
      value: c.cantidad,
      percentage: c.porcentaje,
      color: channelColors[i % channelColors.length],
    }))

    y = drawDonutLegend(pdf, y, channelData)

    // Inversión en Marketing
    y = drawSectionTitle(pdf, y, "Inversión en Marketing vs Leads")

    const marketingRows = data.inversionMarketing.map((m: any) => [
      m.mes,
      formatCurrency(m.inversion),
      formatNumber(m.leads),
      m.leads > 0 ? formatCurrency(m.inversion / m.leads) : "-",
    ])
    const totalInversion = data.inversionMarketing.reduce((sum: number, m: any) => sum + m.inversion, 0)
    const totalLeadsMarketing = data.inversionMarketing.reduce((sum: number, m: any) => sum + m.leads, 0)
    const avgCostPerLead = totalLeadsMarketing > 0 ? totalInversion / totalLeadsMarketing : 0
    marketingRows.push([
      "TOTAL",
      formatCurrency(totalInversion),
      formatNumber(totalLeadsMarketing),
      formatCurrency(avgCostPerLead),
    ])

    y = drawTable(pdf, y, ["Período", "Inversión", "Leads", "Costo/Lead"], marketingRows, [40, 50, 40, 50])

    // ROI
    const roiEstimado =
      totalInversion > 0 ? ((data.embudoVentas.conversionFinal * precioPromedio) / totalInversion) * 100 : 0

    y = drawMetricBox(
      pdf,
      y,
      "Eficiencia de Marketing",
      [
        { label: "Inversión total", value: formatCurrency(totalInversion), highlight: true },
        { label: "Costo promedio por lead", value: formatCurrency(avgCostPerLead) },
        { label: "ROI estimado", value: `${roiEstimado.toFixed(0)}%` },
      ],
      [254, 243, 199],
      [133, 77, 14],
      [234, 179, 8],
    )

    y += 6

    // Resumen Ejecutivo Final
    y = drawSectionTitle(pdf, y, "Resumen Ejecutivo Final")

    const totalStatVentas = data.statisticsOverview.reduce((sum: number, s: any) => sum + s.ventas, 0)
    const totalStatSueldos = data.statisticsOverview.reduce((sum: number, s: any) => sum + s.sueldos, 0)
    const margenOperativo = totalStatVentas - totalStatSueldos
    const ratioEficiencia = totalStatSueldos > 0 ? totalStatVentas / totalStatSueldos : 0

    pdf.setFillColor(15, 23, 42)
    roundedRect(pdf, MARGIN_LEFT, y, CONTENT_WIDTH, 40, 4, "F")

    pdf.setFontSize(10)
    pdf.setFont("helvetica", "bold")
    pdf.setTextColor(255, 255, 255)
    pdf.text("Conclusiones del Período", MARGIN_LEFT + 8, y + 10)

    const conclusions = [
      `• Ventas totales: ${formatCurrency(totalStatVentas)} | Margen: ${formatCurrency(margenOperativo)}`,
      `• Tasa de conversión: ${conversionRate}% | Inventario vendido: ${vendidoPct.toFixed(1)}%`,
      `• Inversión marketing: ${formatCurrency(totalInversion)} | Costo/lead: ${formatCurrency(avgCostPerLead)}`,
    ]

    pdf.setFontSize(8)
    pdf.setFont("helvetica", "normal")
    pdf.setTextColor(226, 232, 240)
    conclusions.forEach((line, i) => {
      pdf.text(line, MARGIN_LEFT + 8, y + 18 + i * 7)
    })

    addFooter(pdf, currentPage, totalPages)

    return pdf
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportSuccess(false)

    try {
      const pdf = exportType === "simple" ? await generateSimplePDF() : await generateDetailedPDF()

      const typeLabel = exportType === "simple" ? "ejecutivo" : "analitico"
      const fileName = `ADN_Reporte_${typeLabel}_${periodLabel.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`

      pdf.save(fileName)

      setExportSuccess(true)
      setTimeout(() => {
        setExportSuccess(false)
        onOpenChange(false)
      }, 1500)
    } catch (error) {
      console.error("Error al generar PDF:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Download className="h-5 w-5 text-cyan-500" />
            </div>
            Exportar Reporte PDF
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Genera un reporte profesional para el período:{" "}
            <span className="font-semibold text-foreground">{periodLabel}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={exportType} onValueChange={(v) => setExportType(v as ExportType)} className="space-y-3">
            <div
              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                exportType === "simple"
                  ? "border-cyan-500 bg-cyan-500/5 shadow-sm"
                  : "border-border hover:border-cyan-500/40 hover:bg-muted/30"
              }`}
              onClick={() => setExportType("simple")}
            >
              <RadioGroupItem value="simple" id="simple" className="mt-1" />
              <div className="flex-1 space-y-2">
                <Label htmlFor="simple" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-500" />
                  Reporte Ejecutivo
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Resumen de 1 página con KPIs principales, distribución de inventario y embudo de ventas.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs bg-cyan-500/10 text-cyan-600 px-2.5 py-1 rounded-full font-medium">
                    1 página
                  </span>
                  <span className="text-xs text-muted-foreground">Ideal para presentaciones</span>
                </div>
              </div>
            </div>

            <div
              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                exportType === "detallada"
                  ? "border-indigo-500 bg-indigo-500/5 shadow-sm"
                  : "border-border hover:border-indigo-500/40 hover:bg-muted/30"
              }`}
              onClick={() => setExportType("detallada")}
            >
              <RadioGroupItem value="detallada" id="detallada" className="mt-1" />
              <div className="flex-1 space-y-2">
                <Label htmlFor="detallada" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-indigo-500" />
                  Reporte Analítico Completo
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Análisis exhaustivo de 5 páginas con KPIs, inventario, ventas, embudo y marketing.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs bg-indigo-500/10 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                    5 páginas
                  </span>
                  <span className="text-xs text-muted-foreground">Análisis completo</span>
                </div>
              </div>
            </div>
          </RadioGroup>

          <div className="mt-4 p-3.5 bg-muted/40 rounded-lg flex items-start gap-3 border border-border/50">
            <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              El reporte incluye el logo de ADN Developers y está optimizado para impresión en formato A4.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className={`min-w-[160px] ${
              exportSuccess
                ? "bg-green-600 hover:bg-green-600 text-white"
                : "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white"
            }`}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Descargado
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
