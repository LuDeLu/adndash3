import { apartUnits } from "./dome-apart-data"
import { berutiFloorsData } from "./dome-beruti-data"
import { boulevardUnits } from "./dome-boulevar-data"
import { domePalermoData } from "./dome-palermo-data"
import { domeFloorsData } from "./dome-puertos-data"
import { suitesFloorsData } from "./dome-suites-data"

export interface UnitRecommendation {
  projectId: number
  projectName: string
  unitNumber: string
  floor: number
  matchScore: number
  matchReasons: string[]
  saleValue: number
  pricePerM2: number
  totalArea: number
  description: string
  status: string
  orientation?: string
  amenities?: string[]
}

export interface ClienteCriteria {
  emprendimientos: number[]
  tipologias: number[]
  metros_min: string
  metros_max: string
  precio_min: string
  precio_max: string
}

const emprendimientosMap: Record<number, string> = {
  1: "DOME Cabello Apartments",
  2: "DOME Torre Beruti",
  3: "DOME Cerviño Boulevard",
  4: "DOME Puertos del Lago",
  5: "DOME Cabello Residence",
  6: "DOME Suites & Residence",
}

const tipologiasMap: Record<number, string> = {
  1: "1 Dormitorio",
  2: "2 Dormitorios",
  3: "3 Dormitorios",
  4: "4 Dormitorios",
  5: "Monoambiente",
  6: "Penthouse",
  7: "Town House",
  8: "Local Comercial",
}

const matchesTipologia = (description: string, tipologiasIds: number[]): { match: boolean; matchedType: string } => {
  if (tipologiasIds.length === 0) return { match: true, matchedType: "" }

  const desc = description.toLowerCase()

  for (const tipId of tipologiasIds) {
    const tipName = tipologiasMap[tipId]?.toLowerCase()
    if (!tipName) continue

    // Enhanced matching patterns
    if (
      tipName.includes("1 dormitorio") &&
      (desc.includes("1 dorm") || desc.includes("1 dormitorio") || desc.includes("1d"))
    ) {
      return { match: true, matchedType: "1 Dormitorio" }
    }
    if (
      tipName.includes("2 dormitorios") &&
      (desc.includes("2 dorm") || desc.includes("2 dormitorios") || desc.includes("2d"))
    ) {
      return { match: true, matchedType: "2 Dormitorios" }
    }
    if (
      tipName.includes("3 dormitorios") &&
      (desc.includes("3 dorm") || desc.includes("3 dormitorios") || desc.includes("3d"))
    ) {
      return { match: true, matchedType: "3 Dormitorios" }
    }
    if (
      tipName.includes("4 dormitorios") &&
      (desc.includes("4 dorm") || desc.includes("4 dormitorios") || desc.includes("4d"))
    ) {
      return { match: true, matchedType: "4 Dormitorios" }
    }
    if (tipName.includes("monoambiente") && (desc.includes("monoambiente") || desc.includes("mono"))) {
      return { match: true, matchedType: "Monoambiente" }
    }
    if (tipName.includes("penthouse") && desc.includes("penthouse")) {
      return { match: true, matchedType: "Penthouse" }
    }
    if (tipName.includes("town house") && (desc.includes("town house") || desc.includes("townhouse"))) {
      return { match: true, matchedType: "Town House" }
    }
    if (tipName.includes("local") && desc.includes("local")) {
      return { match: true, matchedType: "Local Comercial" }
    }
  }

  return { match: false, matchedType: "" }
}

const calculateMatchScore = (
  area: number,
  price: number,
  tipologiaResult: { match: boolean; matchedType: string },
  isPreferredProject: boolean,
): { score: number; reasons: string[] } => {
  let score = 0
  const reasons: string[] = []

  // Parse client criteria
  const metrosMin = Number.parseFloat(localStorage.getItem("temp_metros_min") || "0") || 0
  const metrosMax = Number.parseFloat(localStorage.getItem("temp_metros_max") || "999999") || 999999
  const precioMin = Number.parseFloat(localStorage.getItem("temp_precio_min") || "0") || 0
  const precioMax = Number.parseFloat(localStorage.getItem("temp_precio_max") || "999999999") || 999999999

  // PRIORITY 1: Emprendimiento match (30 points)
  if (isPreferredProject) {
    score += 30
    reasons.push("⭐ Proyecto seleccionado por el cliente")
  }

  // PRIORITY 2: Tipología match (30 points)
  if (tipologiaResult.match && tipologiaResult.matchedType) {
    score += 30
    reasons.push(`✓ Tipo: ${tipologiaResult.matchedType} - coincide con la tipología buscada`)
  } else if (tipologiaResult.match) {
    score += 15
    reasons.push("✓ Tipología compatible con búsqueda")
  }

  // Metros (25 points)
  if (area >= metrosMin && area <= metrosMax) {
    score += 25
    reasons.push(`✓ Superficie ideal: ${area.toFixed(1)} m² (rango: ${metrosMin}-${metrosMax} m²)`)
  } else if (area < metrosMin) {
    const diff = (area / metrosMin) * 100
    if (diff >= 85) {
      score += 20
      reasons.push(`⚠ ${area.toFixed(1)} m² - Levemente menor al mínimo buscado`)
    } else if (diff >= 70) {
      score += 10
      reasons.push(`⚠ ${area.toFixed(1)} m² - Menor al rango buscado`)
    }
  } else {
    const diff = (area / metrosMax) * 100
    if (diff <= 115) {
      score += 20
      reasons.push(`⚠ ${area.toFixed(1)} m² - Levemente mayor al máximo buscado`)
    } else if (diff <= 130) {
      score += 10
      reasons.push(`⚠ ${area.toFixed(1)} m² - Mayor al rango buscado`)
    }
  }

  // Precio (15 points)
  if (price >= precioMin && price <= precioMax) {
    score += 15
    reasons.push(
      `✓ Precio: USD ${price.toLocaleString()} (presupuesto: ${precioMin.toLocaleString()}-${precioMax.toLocaleString()})`,
    )
  } else if (price < precioMin) {
    const diff = (price / precioMin) * 100
    if (diff >= 80) {
      score += 15
      const savings = precioMin - price
      reasons.push(`💰 USD ${price.toLocaleString()} - Ahorro de USD ${savings.toLocaleString()}`)
    } else {
      score += 10
      reasons.push(`💰 Precio por debajo del presupuesto`)
    }
  } else {
    const diff = (price / precioMax) * 100
    const excess = price - precioMax
    if (diff <= 110) {
      score += 10
      reasons.push(`⚠ USD ${price.toLocaleString()} - Excede presupuesto en USD ${excess.toLocaleString()}`)
    } else if (diff <= 125) {
      score += 5
      reasons.push(`⚠ USD ${price.toLocaleString()} - Fuera del presupuesto`)
    }
  }

  return { score, reasons }
}

export function generateRecommendations(cliente: ClienteCriteria): UnitRecommendation[] {
  const recommendations: UnitRecommendation[] = []

  // Store criteria in localStorage for scoring function
  localStorage.setItem("temp_metros_min", cliente.metros_min)
  localStorage.setItem("temp_metros_max", cliente.metros_max)
  localStorage.setItem("temp_precio_min", cliente.precio_min)
  localStorage.setItem("temp_precio_max", cliente.precio_max)

  const shouldAnalyzeProject = (projectId: number) =>
    cliente.emprendimientos.length === 0 || cliente.emprendimientos.includes(projectId)

  // PROJECT 1: DOME Cabello Apartments
  if (shouldAnalyzeProject(1)) {
    apartUnits
      .filter((unit) => unit.status === "DISPONIBLE")
      .forEach((unit) => {
        const tipologiaResult = matchesTipologia(unit.description, cliente.tipologias)
        const isPreferred = cliente.emprendimientos.includes(1)
        const { score, reasons } = calculateMatchScore(
          unit.totalAreaWithAmenities,
          unit.saleValue,
          tipologiaResult,
          isPreferred,
        )

        if (score >= 30) {
          recommendations.push({
            projectId: 1,
            projectName: "DOME Cabello Apartments",
            unitNumber: unit.unitNumber,
            floor: unit.floor,
            matchScore: score,
            matchReasons: reasons,
            saleValue: unit.saleValue,
            pricePerM2: unit.pricePerSqm,
            totalArea: unit.totalAreaWithAmenities,
            description: unit.description,
            status: unit.status,
            orientation: unit.orientation,
          })
        }
      })
  }

  // PROJECT 2: DOME Torre Beruti
  if (shouldAnalyzeProject(2)) {
    berutiFloorsData.forEach((floor) => {
      floor.apartments
        .filter((apt) => apt.status === "DISPONIBLE")
        .forEach((apt) => {
          const tipologiaResult = matchesTipologia(apt.description, cliente.tipologias)
          const isPreferred = cliente.emprendimientos.includes(2)
          const { score, reasons } = calculateMatchScore(
            apt.totalWithAmenities,
            apt.saleValue,
            tipologiaResult,
            isPreferred,
          )

          if (score >= 30) {
            recommendations.push({
              projectId: 2,
              projectName: "DOME Torre Beruti",
              unitNumber: apt.unitNumber,
              matchScore: score,
              matchReasons: reasons,
              saleValue: apt.saleValue,
              pricePerM2: apt.pricePerM2,
              totalArea: apt.totalWithAmenities,
              description: apt.description,
              status: apt.status,
              orientation: apt.orientation || "N/A",
              floor: 0
            })
          }
        })
    })
  }

  // PROJECT 3: DOME Cerviño Boulevard
  if (shouldAnalyzeProject(3)) {
    boulevardUnits
      .filter((unit) => unit.status === "DISPONIBLE")
      .forEach((unit) => {
        const tipologiaResult = matchesTipologia(unit.description, cliente.tipologias)
        const isPreferred = cliente.emprendimientos.includes(3)
        const { score, reasons } = calculateMatchScore(
          unit.details.totalWithAmenities,
          unit.saleValue,
          tipologiaResult,
          isPreferred,
        )

        if (score >= 30) {
          recommendations.push({
            projectId: 3,
            projectName: "DOME Cerviño Boulevard",
            unitNumber: unit.unitNumber,
            floor: unit.floor,
            matchScore: score,
            matchReasons: reasons,
            saleValue: unit.saleValue,
            pricePerM2: unit.pricePerSqm,
            totalArea: unit.details.totalWithAmenities,
            description: unit.description,
            status: unit.status,
          })
        }
      })
  }

  // PROJECT 4: DOME Puertos del Lago
  if (shouldAnalyzeProject(4)) {
    domeFloorsData.forEach((floor) => {
      ;["A", "B", "C"].forEach((section) => {
        const apartments = floor.sections[section as "A" | "B" | "C"]
        apartments
          .filter((apt) => apt.status === "DISPONIBLE")
          .forEach((apt) => {
            const tipologiaResult = matchesTipologia(apt.description, cliente.tipologias)
            const isPreferred = cliente.emprendimientos.includes(4)
            const { score, reasons } = calculateMatchScore(
              apt.totalWithAmenities,
              apt.saleValue,
              tipologiaResult,
              isPreferred,
            )

            if (score >= 30) {
              recommendations.push({
                projectId: 4,
                projectName: "DOME Puertos del Lago",
                unitNumber: apt.unitNumber,
                matchScore: score,
                matchReasons: reasons,
                saleValue: apt.saleValue,
                pricePerM2: apt.pricePerM2,
                totalArea: apt.totalWithAmenities,
                description: apt.description,
                status: apt.status,
                orientation: apt.orientation || "N/A",
                floor: 0
              })
            }
          })
      })
    })
  }

  // PROJECT 5: DOME Cabello Residence
  if (shouldAnalyzeProject(5)) {
    Object.values(domePalermoData.apartmentData).forEach((floorData) => {
      Object.values(floorData).forEach((apt: any) => {
        if (apt.status === "available") {
          const tipologiaResult = matchesTipologia(apt.type, cliente.tipologias)
          const priceValue = Number.parseFloat(apt.price.replace(/[$,]/g, ""))
          const isPreferred = cliente.emprendimientos.includes(5)
          const { score, reasons } = calculateMatchScore(
            apt.totalWithAmenities,
            priceValue,
            tipologiaResult,
            isPreferred,
          )

          if (score >= 30) {
            recommendations.push({
              projectId: 5,
              projectName: "DOME Cabello Residence",
              unitNumber: apt.id,
              floor: Number.parseInt(apt.id) || 0,
              matchScore: score,
              matchReasons: reasons,
              saleValue: priceValue,
              pricePerM2: Number.parseFloat(apt.pricePerM2.replace(/[$,]/g, "")),
              totalArea: apt.totalWithAmenities,
              description: apt.type,
              status: "DISPONIBLE",
            })
          }
        }
      })
    })
  }

  // PROJECT 6: DOME Suites & Residence
  if (shouldAnalyzeProject(6)) {
    suitesFloorsData.forEach((floor) => {
      floor.apartments
        .filter((apt) => apt.status === "DISPONIBLE")
        .forEach((apt) => {
          const tipologiaResult = matchesTipologia(apt.description, cliente.tipologias)
          const isPreferred = cliente.emprendimientos.includes(6)
          const { score, reasons } = calculateMatchScore(
            apt.totalWithAmenities,
            apt.saleValue,
            tipologiaResult,
            isPreferred,
          )

          if (score >= 30) {
            recommendations.push({
              projectId: 6,
              projectName: "DOME Suites & Residence",
              unitNumber: apt.unitNumber,
              matchScore: score,
              matchReasons: reasons,
              saleValue: apt.saleValue,
              pricePerM2: apt.pricePerM2,
              totalArea: apt.totalWithAmenities,
              description: apt.description,
              status: apt.status,
              floor: 0
            })
          }
        })
    })
  }

  // Clean up temp storage
  localStorage.removeItem("temp_metros_min")
  localStorage.removeItem("temp_metros_max")
  localStorage.removeItem("temp_precio_min")
  localStorage.removeItem("temp_precio_max")

  // Sort by score and return top 15
  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 15)
}

export function generateRecommendationSummary(recommendations: UnitRecommendation[]): string {
  if (recommendations.length === 0) {
    return "No se encontraron unidades disponibles que cumplan con los criterios especificados."
  }

  const topRec = recommendations[0]
  const projectCounts: Record<string, number> = {}

  recommendations.forEach((rec) => {
    projectCounts[rec.projectName] = (projectCounts[rec.projectName] || 0) + 1
  })

  const projectSummary = Object.entries(projectCounts)
    .map(([name, count]) => `${name} (${count})`)
    .join(", ")

  return `Se encontraron ${recommendations.length} unidades recomendadas en: ${projectSummary}. Mejor coincidencia: ${topRec.projectName} - Unidad ${topRec.unitNumber} con ${topRec.matchScore.toFixed(0)}% de compatibilidad.`
}

export function generateWhatsAppMessage(
  clienteName: string,
  recommendations: UnitRecommendation[],
  topCount = 3,
): string {
  const topRecs = recommendations.slice(0, topCount)

  let message = `Hola ${clienteName}! 👋\n\n`
  message += `Basándonos en tu búsqueda, encontramos ${recommendations.length} opciones perfectas para vos:\n\n`

  topRecs.forEach((rec, index) => {
    message += `${index + 1}️⃣ *${rec.projectName}*\n`
    message += `   📍 Unidad ${rec.unitNumber} - Piso ${rec.floor}\n`
    message += `   🏠 ${rec.description}\n`
    message += `   📐 ${rec.totalArea.toFixed(1)} m²\n`
    message += `   💵 USD ${rec.saleValue.toLocaleString()}\n`
    message += `   📊 Compatibilidad: ${rec.matchScore.toFixed(0)}%\n\n`
  })

  if (recommendations.length > topCount) {
    message += `Y ${recommendations.length - topCount} opciones más que se ajustan a tu búsqueda.\n\n`
  }

  message += `¿Te gustaría agendar una visita o recibir más información? 🏢`

  return encodeURIComponent(message)
}

export function getProjectStatistics(recommendations: UnitRecommendation[]) {
  const stats: Record<string, { count: number; avgScore: number; avgPrice: number; avgArea: number }> = {}

  recommendations.forEach((rec) => {
    if (!stats[rec.projectName]) {
      stats[rec.projectName] = { count: 0, avgScore: 0, avgPrice: 0, avgArea: 0 }
    }
    stats[rec.projectName].count++
    stats[rec.projectName].avgScore += rec.matchScore
    stats[rec.projectName].avgPrice += rec.saleValue
    stats[rec.projectName].avgArea += rec.totalArea
  })

  Object.keys(stats).forEach((project) => {
    stats[project].avgScore /= stats[project].count
    stats[project].avgPrice /= stats[project].count
    stats[project].avgArea /= stats[project].count
  })

  return stats
}
