// Helper para procesar datos de estadísticas de todos los proyectos
import { apartUnits } from "./dome-apart-data"
import { berutiFloorsData } from "./dome-beruti-data"
import { boulevardUnits } from "./dome-boulevar-data"
import { domePalermoData } from "./dome-palermo-data"
import { domeFloorsData } from "./dome-puertos-data"
import { suitesFloorsData } from "./dome-suites-data"

export interface ProjectStats {
  name: string
  totalUnits: number
  availableUnits: number
  soldUnits: number
  reservedUnits: number
  totalSalesValue: number
  deliveredUnits: number
}

export interface GlobalStats {
  totalProjects: number
  totalUnits: number
  availableUnits: number
  soldUnits: number
  reservedUnits: number
  totalSalesValue: number
  deliveredUnits: number
  projects: ProjectStats[]
  totalTickets?: number
}

// Procesar datos de DOME Apart
function getApartStats(): ProjectStats {
  const totalUnits = apartUnits.length
  const availableUnits = apartUnits.filter((u) => u.status === "DISPONIBLE").length
  const soldUnits = apartUnits.filter((u) => u.status === "VENDIDO").length
  const reservedUnits = apartUnits.filter((u) => u.status === "RESERVADO").length
  const totalSalesValue = apartUnits.filter((u) => u.status === "VENDIDO").reduce((sum, u) => sum + u.saleValue, 0)

  return {
    name: "DOME Palermo Apartament",
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    totalSalesValue,
    deliveredUnits: soldUnits,
  }
}

// Procesar datos de DOME Torre Beruti
function getBerutiStats(): ProjectStats {
  let totalUnits = 0
  let availableUnits = 0
  let soldUnits = 0
  let reservedUnits = 0
  let totalSalesValue = 0

  berutiFloorsData.forEach((floor) => {
    floor.apartments.forEach((apt) => {
      totalUnits++
      if (apt.status === "DISPONIBLE") availableUnits++
      if (apt.status === "VENDIDO") {
        soldUnits++
        totalSalesValue += apt.saleValue
      }
      if (apt.status === "RESERVADO") reservedUnits++
    })
  })

  return {
    name: "DOME Torre Beruti",
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    totalSalesValue,
    deliveredUnits: soldUnits,
  }
}

// Procesar datos de DOME Boulevard
function getBoulevardStats(): ProjectStats {
  const totalUnits = boulevardUnits.length
  const availableUnits = boulevardUnits.filter((u) => u.status === "DISPONIBLE").length
  const soldUnits = boulevardUnits.filter((u) => u.status === "VENDIDO").length
  const reservedUnits = boulevardUnits.filter((u) => u.status === "RESERVADO").length
  const totalSalesValue = boulevardUnits.filter((u) => u.status === "VENDIDO").reduce((sum, u) => sum + u.saleValue, 0)

  return {
    name: "DOME Palermo Boulevard",
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    totalSalesValue,
    deliveredUnits: soldUnits,
  }
}

// Procesar datos de DOME Palermo Residence
function getPalermoStats(): ProjectStats {
  let totalUnits = 0
  let availableUnits = 0
  let soldUnits = 0
  let reservedUnits = 0
  let totalSalesValue = 0

  // Procesar apartamentos por piso
  Object.values(domePalermoData.apartmentData).forEach((floor) => {
    Object.values(floor).forEach((apt) => {
      totalUnits++
      if (apt.status === "available") availableUnits++
      if (apt.status === "sold") {
        soldUnits++
        // Convertir precio de string a número (eliminar $ y comas)
        const price = Number.parseFloat(apt.price.replace(/[$,]/g, ""))
        totalSalesValue += price
      }
      if (apt.status === "reserved") reservedUnits++
    })
  })

  // Agregar locales comerciales
  domePalermoData.commercialUnits.forEach((unit) => {
    totalUnits++
    if (unit.status === "sold") soldUnits++
  })

  return {
    name: "DOME Palermo Residence",
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    totalSalesValue,
    deliveredUnits: soldUnits,
  }
}

// Procesar datos de DOME Puertos del Lago
function getPuertosStats(): ProjectStats {
  let totalUnits = 0
  let availableUnits = 0
  let soldUnits = 0
  let reservedUnits = 0
  let totalSalesValue = 0

  domeFloorsData.forEach((floor) => {
    // Procesar secciones A, B, C
    Object.values(floor.sections).forEach((section) => {
      section.forEach((apt) => {
        totalUnits++
        if (apt.status === "DISPONIBLE") availableUnits++
        if (apt.status === "VENDIDO") {
          soldUnits++
          totalSalesValue += apt.saleValue
        }
        if (apt.status === "reservado") reservedUnits++
      })
    })
  })

  return {
    name: "DOME Puertos del Lago",
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    totalSalesValue,
    deliveredUnits: soldUnits,
  }
}

// Procesar datos de DOME Suites & Residences
function getSuitesStats(): ProjectStats {
  let totalUnits = 0
  let availableUnits = 0
  let soldUnits = 0
  let reservedUnits = 0
  let totalSalesValue = 0

  suitesFloorsData.forEach((floor) => {
    floor.apartments.forEach((apt) => {
      totalUnits++
      if (apt.status === "DISPONIBLE") availableUnits++
      if (apt.status === "VENDIDO") {
        soldUnits++
        totalSalesValue += apt.saleValue
      }
      if (apt.status === "RESERVADO") reservedUnits++
    })
  })

  return {
    name: "DOME Suites & Residences",
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    totalSalesValue,
    deliveredUnits: soldUnits,
  }
}

// Obtener estadísticas globales de todos los proyectos
export function getGlobalStatistics(): GlobalStats {
  const projects = [
    getApartStats(),
    getBerutiStats(),
    getBoulevardStats(),
    getPalermoStats(),
    getPuertosStats(),
    getSuitesStats(),
  ]

  const globalStats: GlobalStats = {
    totalProjects: projects.length,
    totalUnits: projects.reduce((sum, p) => sum + p.totalUnits, 0),
    availableUnits: projects.reduce((sum, p) => sum + p.availableUnits, 0),
    soldUnits: projects.reduce((sum, p) => sum + p.soldUnits, 0),
    reservedUnits: projects.reduce((sum, p) => sum + p.reservedUnits, 0),
    totalSalesValue: projects.reduce((sum, p) => sum + p.totalSalesValue, 0),
    deliveredUnits: projects.reduce((sum, p) => sum + p.deliveredUnits, 0),
    projects,
  }

  return globalStats
}

// Calcular comparación de precio de venta vs precio de lista
export function getSalesPriceComparison() {
  // Esta función podría expandirse si tienes datos de precios de lista vs precios de venta reales
  const allProjects = getGlobalStatistics()

  return {
    totalListPrice: allProjects.totalSalesValue,
    totalSalePrice: allProjects.totalSalesValue, // Mismo valor si no hay descuentos
    difference: 0,
    percentageDifference: 0,
  }
}

export function getProjectsPriceComparison() {
  const allProjects = getGlobalStatistics()

  return allProjects.projects.map((project) => ({
    proyecto: project.name,
    vendido: project.totalSalesValue,
    precioLista: project.totalSalesValue * 1.15, // Precio de lista es 15% mayor que precio vendido (ajustable)
    color: getProjectColor(project.name),
  }))
}

function getProjectColor(projectName: string): string {
  const colorMap: { [key: string]: string } = {
    "DOME Palermo Apartament": "#06b6d4",
    "DOME Torre Beruti": "#8b5cf6",
    "DOME Palermo Boulevard": "#f59e0b",
    "DOME Palermo Residence": "#10b981",
    "DOME Puertos del Lago": "#ef4444",
    "DOME Suites & Residences": "#ec4899",
  }
  return colorMap[projectName] || "#6b7280"
}
