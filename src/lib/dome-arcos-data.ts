/**
 * DOME Torre Arcos - Data Structure
 * Complete data for the ARCOS residential project
 */

export type ArcosApartmentStatus = "DISPONIBLE" | "VENDIDO" | "RESERVADO" | "BLOQUEADO"

export interface ArcosApartment {
  id: string
  unitNumber: string
  level: number
  description: string
  orientation: string
  coveredArea: number // SUP. CUBIERTA (M²)
  balconyArea: number // SUP. BALCÓN (m²)
  terraceArea: number // SUP. TERRAZA (M²)
  weightedOwnArea: number // SUP. PROPIA PONDERADA (M²)
  amenitiesArea: number // AMENITIES
  totalArea: number // TOTAL M² C/ AMENITIES
  salePrice: number // VALOR DE VENTA (USD)
  reservePrice: number // RESERVA 10%
  contractPrice: number // AL BOLETO 30%
  balancePrice: number // SALDO 60%
  installmentPrice: number // 44 CUOTAS
  pricePerSqm: number // VALOR M²
  status: ArcosApartmentStatus
  coordinates: string // SVG polygon or rect coordinates
}

export interface ArcosFloor {
  level: number
  name: string
  apartments: ArcosApartment[]
}

export interface ArcosGarageSpot {
  id: string
  spotNumber: number
  garageLevel: number // 1, 2, 3, 4
  condition: string // A, B, C, D (Cubierta)
  price: number
  status: ArcosApartmentStatus
  coordinates: string
  assignedTo?: string // Unit number if assigned
}

// PISO 1 DATA
const piso1Data: ArcosApartment[] = [
  {
    id: "arcos-101",
    unitNumber: "101",
    level: 1,
    description: "3 DORMITORIOS",
    orientation: "FRENTE",
    coveredArea: 138.98,
    balconyArea: 8.83,
    terraceArea: 0,
    weightedOwnArea: 147.81,
    amenitiesArea: 13.3,
    totalArea: 161.11,
    salePrice: 636100,
    reservePrice: 63610,
    contractPrice: 190830,
    balancePrice: 381660,
    installmentPrice: 8674,
    pricePerSqm: 3948,
    status: "DISPONIBLE",
    coordinates:
      "165,591,166,754,303,754,300,711,309,711,310,618,417,616,418,592,459,591,461,548,420,548,420,338,313,339,312,498,232,498,232,588",
  },
  {
    id: "arcos-102",
    unitNumber: "102",
    level: 1,
    description: "2 DORMITORIOS",
    orientation: "CONTRAFRENTE",
    coveredArea: 76.83,
    balconyArea: 15.54,
    terraceArea: 0,
    weightedOwnArea: 92.37,
    amenitiesArea: 8.31,
    totalArea: 100.68,
    salePrice: 397500,
    reservePrice: 39750,
    contractPrice: 119250,
    balancePrice: 238500,
    installmentPrice: 5420,
    pricePerSqm: 3948,
    status: "DISPONIBLE",
    coordinates: "308,93,308,294,313,294,312,338,422,336,422,325,452,325,452,97",
  },
  {
    id: "arcos-103",
    unitNumber: "103",
    level: 1,
    description: "3 DORMITORIOS + DEP",
    orientation: "FRENTE PASANTE",
    coveredArea: 175.41,
    balconyArea: 29.38,
    terraceArea: 0,
    weightedOwnArea: 204.79,
    amenitiesArea: 18.43,
    totalArea: 223.22,
    salePrice: 881300,
    reservePrice: 88130,
    contractPrice: 264390,
    balancePrice: 528780,
    installmentPrice: 12018,
    pricePerSqm: 3948,
    status: "DISPONIBLE",
    coordinates: "512,329,511,448,561,448,557,617,605,618,601,756,740,752,742,327",
  },
]

// PISO 2 DATA
const piso2Data: ArcosApartment[] = [
  {
    id: "arcos-201",
    unitNumber: "201",
    level: 2,
    description: "3 DORMITORIOS",
    orientation: "FRENTE",
    coveredArea: 134.93,
    balconyArea: 8.66,
    terraceArea: 0,
    weightedOwnArea: 143.59,
    amenitiesArea: 12.92,
    totalArea: 156.51,
    salePrice: 629700,
    reservePrice: 62970,
    contractPrice: 188910,
    balancePrice: 377820,
    installmentPrice: 8587,
    pricePerSqm: 4023,
    status: "VENDIDO",
    coordinates:
      "173,575,173,734,305,735,304,693,314,694,313,603,460,601,460,532,421,532,422,333,316,332,314,485,238,487,238,570",
  },
  {
    id: "arcos-202",
    unitNumber: "202",
    level: 2,
    description: "2 DORMITORIOS",
    orientation: "CONTRAFRENTE",
    coveredArea: 76.83,
    balconyArea: 15.54,
    terraceArea: 0,
    weightedOwnArea: 92.37,
    amenitiesArea: 8.31,
    totalArea: 100.68,
    salePrice: 405100,
    reservePrice: 40510,
    contractPrice: 121530,
    balancePrice: 243060,
    installmentPrice: 5524,
    pricePerSqm: 4024,
    status: "VENDIDO",
    coordinates: "310,93,311,285,316,286,314,328,422,328,421,319,451,315,451,93",
  },
  {
    id: "arcos-203",
    unitNumber: "203",
    level: 2,
    description: "2 DORMITORIOS",
    orientation: "CONTRAFRENTE",
    coveredArea: 94.69,
    balconyArea: 17.08,
    terraceArea: 0,
    weightedOwnArea: 111.77,
    amenitiesArea: 10.06,
    totalArea: 121.83,
    salePrice: 490200,
    reservePrice: 49020,
    contractPrice: 147060,
    balancePrice: 294120,
    installmentPrice: 6685,
    pricePerSqm: 4024,
    status: "DISPONIBLE",
    coordinates: "508,319,508,436,554,437,556,515,732,515,731,319",
  },
]

// PISO 3 DATA
const piso3Data: ArcosApartment[] = [
  {
    id: "arcos-301",
    unitNumber: "301",
    level: 3,
    description: "3 DORMITORIOS + DEP",
    orientation: "FRENTE",
    coveredArea: 150.53,
    balconyArea: 10.25,
    terraceArea: 20.59,
    weightedOwnArea: 171.08,
    amenitiesArea: 16.32,
    totalArea: 197.69,
    salePrice: 768100,
    reservePrice: 76810,
    contractPrice: 230430,
    balancePrice: 460860,
    installmentPrice: 10474,
    pricePerSqm: 3885,
    status: "VENDIDO",
    coordinates:
      "162,601,163,695,298,694,299,714,310,714,309,722,376,719,377,694,461,692,463,505,422,504,422,347,311,346,310,503,230,508,229,597",
  },
  {
    id: "arcos-302",
    unitNumber: "302",
    level: 3,
    description: "2 DORMITORIOS",
    orientation: "CONTRAFRENTE",
    coveredArea: 76.83,
    balconyArea: 15.54,
    terraceArea: 0,
    weightedOwnArea: 92.37,
    amenitiesArea: 8.31,
    totalArea: 100.68,
    salePrice: 412700,
    reservePrice: 41270,
    contractPrice: 123810,
    balancePrice: 247620,
    installmentPrice: 5628,
    pricePerSqm: 4099,
    status: "DISPONIBLE",
    coordinates: "312,342,420,343,420,330,453,330,452,94,304,94,305,296,312,297",
  },
  {
    id: "arcos-303",
    unitNumber: "303",
    level: 3,
    description: "2 DORMITORIOS",
    orientation: "CONTRAFRENTE",
    coveredArea: 68.48,
    balconyArea: 17.08,
    terraceArea: 0,
    weightedOwnArea: 85.56,
    amenitiesArea: 7.7,
    totalArea: 93.26,
    salePrice: 382300,
    reservePrice: 38230,
    contractPrice: 114690,
    balancePrice: 229380,
    installmentPrice: 5213,
    pricePerSqm: 4099,
    status: "VENDIDO",
    coordinates: "513,333,514,471,745,471,743,334",
  },
  {
    id: "arcos-304",
    unitNumber: "304",
    level: 3,
    description: "3 DORMITORIOS",
    orientation: "FRENTE",
    coveredArea: 108.03,
    balconyArea: 6.09,
    terraceArea: 22.99,
    weightedOwnArea: 125.62,
    amenitiesArea: 12.34,
    totalArea: 149.45,
    salePrice: 565400,
    reservePrice: 56540,
    contractPrice: 169620,
    balancePrice: 339240,
    installmentPrice: 7710,
    pricePerSqm: 3783,
    status: "DISPONIBLE",
    coordinates:
      "465,622,464,695,455,693,455,720,597,722,597,714,623,712,626,694,746,691,746,472,598,473,598,507,561,507,558,619",
  },
]

// PISOS 4-8 DATA (same structure, different pricing)
const generateFloorData = (level: number, basePriceMultiplier: number): ArcosApartment[] => {
  return [
    {
      id: `arcos-${level}01`,
      unitNumber: `${level}01`,
      level: level,
      description: "3 DORMITORIOS + DEP",
      orientation: "FRENTE",
      coveredArea: 150.53,
      balconyArea: 9.78,
      terraceArea: 0,
      weightedOwnArea: 160.31,
      amenitiesArea: 14.43,
      totalArea: 174.74,
      salePrice: Math.round(729300 + (level - 4) * 13200),
      reservePrice: Math.round((729300 + (level - 4) * 13200) * 0.1),
      contractPrice: Math.round((729300 + (level - 4) * 13200) * 0.3),
      balancePrice: Math.round((729300 + (level - 4) * 13200) * 0.6),
      installmentPrice: Math.round(((729300 + (level - 4) * 13200) * 0.6) / 44),
      pricePerSqm: 4174 + (level - 4) * 75,
      status: level === 4 || level === 5 || level === 6 || level === 7 || level === 8 ? "DISPONIBLE" : "DISPONIBLE",
      coordinates:
        "220,560,220,663,144,663,143,770,280,769,297,768,296,789,309,790,309,799,382,801,383,767,480,768,477,560,435,558,433,378,312,378,308,558",
    },
    {
      id: `arcos-${level}02`,
      unitNumber: `${level}02`,
      level: level,
      description: "2 DORMITORIOS",
      orientation: "CONTRAFRENTE",
      coveredArea: 76.83,
      balconyArea: 15.54,
      terraceArea: 0,
      weightedOwnArea: 92.37,
      amenitiesArea: 8.31,
      totalArea: 100.68,
      salePrice: Math.round(420300 + (level - 4) * 7500),
      reservePrice: Math.round((420300 + (level - 4) * 7500) * 0.1),
      contractPrice: Math.round((420300 + (level - 4) * 7500) * 0.3),
      balancePrice: Math.round((420300 + (level - 4) * 7500) * 0.6),
      installmentPrice: Math.round(((420300 + (level - 4) * 7500) * 0.6) / 44),
      pricePerSqm: 4174 + (level - 4) * 75,
      status: level === 4 ? "VENDIDO" : "DISPONIBLE",
      coordinates: "310,371,311,323,304,324,304,97,471,95,473,357,436,359,435,373",
    },
    {
      id: `arcos-${level}03`,
      unitNumber: `${level}03`,
      level: level,
      description: "2 DORMITORIOS",
      orientation: "CONTRAFRENTE",
      coveredArea: 69.48,
      balconyArea: 17.08,
      terraceArea: 0,
      weightedOwnArea: 86.56,
      amenitiesArea: 7.79,
      totalArea: 94.35,
      salePrice: Math.round(393800 + (level - 4) * 7100),
      reservePrice: Math.round((393800 + (level - 4) * 7100) * 0.1),
      contractPrice: Math.round((393800 + (level - 4) * 7100) * 0.3),
      balancePrice: Math.round((393800 + (level - 4) * 7100) * 0.6),
      installmentPrice: Math.round(((393800 + (level - 4) * 7100) * 0.6) / 44),
      pricePerSqm: 4174 + (level - 4) * 75,
      status: level === 5 || level === 8 ? "VENDIDO" : "DISPONIBLE",
      coordinates: "537,364,537,506,591,508,591,516,798,520,798,364",
    },
    {
      id: `arcos-${level}04`,
      unitNumber: `${level}04`,
      level: level,
      description: "3 DORMITORIOS",
      orientation: "FRENTE",
      coveredArea: 108.03,
      balconyArea: 5.63,
      terraceArea: 0,
      weightedOwnArea: 113.66,
      amenitiesArea: 10.23,
      totalArea: 123.89,
      salePrice: Math.round(517100 + (level - 4) * 9300),
      reservePrice: Math.round((517100 + (level - 4) * 9300) * 0.1),
      contractPrice: Math.round((517100 + (level - 4) * 9300) * 0.3),
      balancePrice: Math.round((517100 + (level - 4) * 9300) * 0.6),
      installmentPrice: Math.round(((517100 + (level - 4) * 9300) * 0.6) / 44),
      pricePerSqm: 4174 + (level - 4) * 75,
      status: level === 4 || level === 6 || level === 7 ? "VENDIDO" : "DISPONIBLE",
      coordinates:
        "483,769,477,770,476,800,636,800,633,790,650,790,652,767,801,769,800,522,632,518,632,558,590,560,590,682,484,680",
    },
  ]
}

const piso4Data = generateFloorData(4, 1)
const piso5Data = generateFloorData(5, 1.018)
const piso6Data = generateFloorData(6, 1.036)
const piso7Data = generateFloorData(7, 1.054)
const piso8Data = generateFloorData(8, 1.072)

// PISO 9 DATA
const piso9Data: ArcosApartment[] = [
  {
    id: "arcos-901",
    unitNumber: "901",
    level: 9,
    description: "3 DORMITORIOS",
    orientation: "FRENTE",
    coveredArea: 124.44,
    balconyArea: 9.78,
    terraceArea: 0,
    weightedOwnArea: 134.22,
    amenitiesArea: 12.08,
    totalArea: 146.3,
    salePrice: 665700,
    reservePrice: 66570,
    contractPrice: 199710,
    balancePrice: 399420,
    installmentPrice: 9078,
    pricePerSqm: 4550,
    status: "DISPONIBLE",
    coordinates:
      "149,659,149,764,300,766,298,786,311,787,311,797,387,795,387,770,480,769,486,556,436,555,435,497,315,498,314,554,224,555,222,658",
  },
  {
    id: "arcos-902",
    unitNumber: "902",
    level: 9,
    description: "2 DORMITORIOS",
    orientation: "CONTRAFRENTE",
    coveredArea: 86.81,
    balconyArea: 2.19,
    terraceArea: 29.05,
    weightedOwnArea: 103.53,
    amenitiesArea: 10.62,
    totalArea: 128.67,
    salePrice: 519400,
    reservePrice: 51940,
    contractPrice: 155820,
    balancePrice: 311640,
    installmentPrice: 7083,
    pricePerSqm: 4037,
    status: "DISPONIBLE",
    coordinates: "315,493,437,491,436,355,474,355,474,318,496,320,494,171,312,172,309,319,313,319",
  },
  {
    id: "arcos-903",
    unitNumber: "903",
    level: 9,
    description: "3 DORMITORIOS + DEP",
    orientation: "FRENTE PASANTE",
    coveredArea: 161.0,
    balconyArea: 14.26,
    terraceArea: 33.73,
    weightedOwnArea: 192.13,
    amenitiesArea: 18.81,
    totalArea: 227.8,
    salePrice: 959700,
    reservePrice: 95970,
    contractPrice: 287910,
    balancePrice: 575820,
    installmentPrice: 13087,
    pricePerSqm: 4213,
    status: "VENDIDO",
    coordinates:
      "537,359,540,514,624,513,625,551,592,553,592,678,484,682,484,768,480,768,480,792,635,793,636,785,652,785,653,762,800,759,799,457,652,456,651,362,581,360",
  },
]

// PISO 10 DATA
const piso10Data: ArcosApartment[] = [
  {
    id: "arcos-1001",
    unitNumber: "1001",
    level: 10,
    description: "PISO 360° + TERRAZA",
    orientation: "PISO",
    coveredArea: 169.4,
    balconyArea: 16.69,
    terraceArea: 149.0,
    weightedOwnArea: 260.59,
    amenitiesArea: 30.16,
    totalArea: 365.25,
    salePrice: 1344700,
    reservePrice: 134470,
    contractPrice: 403410,
    balancePrice: 806820,
    installmentPrice: 18337,
    pricePerSqm: 3682,
    status: "DISPONIBLE",
    coordinates:
      "302,622,302,792,392,793,392,802,644,803,641,793,657,794,656,365,491,365,489,457,392,459,394,538,381,539,383,621",
  },
]

// PISO 11 DATA
const piso11Data: ArcosApartment[] = [
  {
    id: "arcos-1101",
    unitNumber: "1101",
    level: 11,
    description: "PISO 360° + TERRAZA",
    orientation: "PISO",
    coveredArea: 184.52,
    balconyArea: 13.23,
    terraceArea: 87.22,
    weightedOwnArea: 219.56,
    amenitiesArea: 25.65,
    totalArea: 310.62,
    salePrice: 1357500,
    reservePrice: 135750,
    contractPrice: 407250,
    balancePrice: 814500,
    installmentPrice: 18511,
    pricePerSqm: 4370,
    status: "VENDIDO",
    coordinates:
      "568,221,318,222,316,338,230,342,229,441,216,442,218,550,112,556,112,773,132,773,132,787,550,785,552,771,572,771",
  },
]

// PISOS 12-23 DATA (PISO 360° sin terraza)
const generatePiso360Data = (level: number): ArcosApartment[] => {
  const basePrice = 1034400
  const priceIncrement = 21300
  const price = basePrice + (level - 12) * priceIncrement

  // Ajuste especial para pisos 20-23
  const adjustedPrice = level >= 20 ? price + 30400 * (level - 19) : price

  return [
    {
      id: `arcos-${level}01`,
      unitNumber: `${level}01`,
      level: level,
      description: "PISO 360°",
      orientation: "PISO",
      coveredArea: 184.52,
      balconyArea: 13.23,
      terraceArea: 0,
      weightedOwnArea: 197.75,
      amenitiesArea: 17.8,
      totalArea: 215.55,
      salePrice: adjustedPrice,
      reservePrice: Math.round(adjustedPrice * 0.1),
      contractPrice: Math.round(adjustedPrice * 0.3),
      balancePrice: Math.round(adjustedPrice * 0.6),
      installmentPrice: Math.round((adjustedPrice * 0.6) / 44),
      pricePerSqm: Math.round(adjustedPrice / 215.55),
      status:
        level === 11 || level === 15 || level === 16 || level === 17 || level === 19 || level === 23
          ? "VENDIDO"
          : "DISPONIBLE",
      coordinates:
        "655,194,393,194,390,318,299,316,299,422,286,423,287,538,179,539,179,769,199,771,200,783,636,781,636,770,661,770",
    },
  ]
}

const piso12Data = generatePiso360Data(12)
const piso13Data = generatePiso360Data(13)
const piso14Data = generatePiso360Data(14)
const piso15Data = generatePiso360Data(15)
const piso16Data = generatePiso360Data(16)
const piso17Data = generatePiso360Data(17)
const piso18Data = generatePiso360Data(18)
const piso19Data = generatePiso360Data(19)
const piso20Data = generatePiso360Data(20)
const piso21Data = generatePiso360Data(21)
const piso22Data = generatePiso360Data(22)
const piso23Data = generatePiso360Data(23)

// PISO 24 DATA
const piso24Data: ArcosApartment[] = [
  {
    id: "arcos-2401",
    unitNumber: "2401",
    level: 24,
    description: "PISO 360° + TERRAZA",
    orientation: "PISO",
    coveredArea: 191.78,
    balconyArea: 17.0,
    terraceArea: 79.69,
    weightedOwnArea: 248.63,
    amenitiesArea: 25.96,
    totalArea: 314.43,
    salePrice: 1701000,
    reservePrice: 170100,
    contractPrice: 510300,
    balancePrice: 1020600,
    installmentPrice: 23195,
    pricePerSqm: 5410,
    status: "DISPONIBLE",
    coordinates:
      "24,557,24,777,43,777,43,793,469,791,468,778,488,780,486,222,231,221,229,340,143,342,142,442,129,442,129,552",
  },
]

// GARAGE SPOTS DATA
const nivel1Cocheras: ArcosGarageSpot[] = [
  {
    id: "Lugar 1",
    spotNumber: 1,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "310,33,364,146",
  },
  {
    id: "Lugar 2",
    spotNumber: 2,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "366,33,423,146",
  },
  {
    id: "Lugar 3",
    spotNumber: 3,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "424,29,482,146",
  },
  {
    id: "Lugar 4",
    spotNumber: 4,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "482,30,539,146",
  },
  {
    id: "Lugar 5",
    spotNumber: 5,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "538,29,599,146",
  },
  {
    id: "Lugar 6",
    spotNumber: 6,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "638,145,752,202",
  },
  {
    id: "Lugar 7",
    spotNumber: 7,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "638,202,753,260",
  },
  {
    id: "Lugar 8",
    spotNumber: 8,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 65000,
    status: "DISPONIBLE",
    coordinates: "638,261,755,320",
  },
  {
    id: "Lugar 9",
    spotNumber: 9,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,261,755,320",
  },
  {
    id: "Lugar 10",
    spotNumber: 10,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,318,754,376",
  },
  {
    id: "Lugar 23",
    spotNumber: 23,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,375,753,434",
  },
  {
    id: "Lugar 11",
    spotNumber: 11,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,433,755,490",
  },
  {
    id: "Lugar 12",
    spotNumber: 12,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,490,753,549",
  },
  {
    id: "Lugar 13",
    spotNumber: 13,
    garageLevel: 1,
    condition: "A - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "639,547,756,606",
  },
]

const nivel2Cocheras: ArcosGarageSpot[] = [
  {
    id: "Lugar 14",
    spotNumber: 14,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "310,33,364,146",
  },
  {
    id: "Lugar 15",
    spotNumber: 15,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "366,33,423,146",
  },
  {
    id: "Lugar 16",
    spotNumber: 16,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "424,29,482,146",
  },
  {
    id: "Lugar 17",
    spotNumber: 17,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "482,30,539,146",
  },
  {
    id: "Lugar 18",
    spotNumber: 18,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "538,29,599,146",
  },
  {
    id: "Lugar 19",
    spotNumber: 19,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,145,752,202",
  },
  {
    id: "Lugar 20",
    spotNumber: 20,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,202,753,260",
  },
  {
    id: "Lugar 21",
    spotNumber: 21,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,261,755,320",
  },
  {
    id: "Lugar 22",
    spotNumber: 22,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,318,754,376",
  },
  {
    id: "Lugar 23",
    spotNumber: 23,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,375,753,434",
  },
  {
    id: "Lugar 24",
    spotNumber: 24,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,433,755,490",
  },
  {
    id: "Lugar 25",
    spotNumber: 25,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "638,490,753,549",
  },
  {
    id: "Lugar 26",
    spotNumber: 26,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "639,547,756,606",
  },
  {
    id: "Lugar 27",
    spotNumber: 27,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "241,268,297,383",
  },
  {
    id: "Lugar 28",
    spotNumber: 28,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "158,393,270,450",
  },
  {
    id: "Lugar 29",
    spotNumber: 29,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "157,449,270,506",
  },
  {
    id: "Lugar 30",
    spotNumber: 30,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "157,506,271,562",
  },
  {
    id: "Lugar 31",
    spotNumber: 31,
    garageLevel: 2,
    condition: "B - Cubierta",
    price: 57000,
    status: "DISPONIBLE",
    coordinates: "156,562,270,625",
  },
]

const nivel3Cocheras: ArcosGarageSpot[] = [
  {
    id: "Lugar 32",
    spotNumber: 32,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "310,33,364,146",
  },
  {
    id: "Lugar 33",
    spotNumber: 33,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "366,33,423,146",
  },
  {
    id: "Lugar 34",
    spotNumber: 34,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "424,29,482,146",
  },
  {
    id: "Lugar 35",
    spotNumber: 35,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "482,30,539,146",
  },
  {
    id: "Lugar 36",
    spotNumber: 36,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "538,29,599,146",
  },
  {
    id: "Lugar 37",
    spotNumber: 37,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "638,145,752,202",
  },
  {
    id: "Lugar 38",
    spotNumber: 38,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "638,202,753,260",
  },
  {
    id: "Lugar 39",
    spotNumber: 39,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "638,261,755,320",
  },
  {
    id: "Lugar 40",
    spotNumber: 40,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "638,318,754,376",
  },
  {
    id: "Lugar 41",
    spotNumber: 41,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "638,375,753,434",
  },
  {
    id: "Lugar 42",
    spotNumber: 42,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "638,433,755,490",
  },
  {
    id: "Lugar 43",
    spotNumber: 43,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "638,490,753,549",
  },
  {
    id: "Lugar 44",
    spotNumber: 44,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "639,547,756,606",
  },
  {
    id: "Lugar 45",
    spotNumber: 45,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "241,268,297,383",
  },
  {
    id: "Lugar 46",
    spotNumber: 46,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "158,393,270,450",
  },
  {
    id: "Lugar 47",
    spotNumber: 47,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "157,449,270,506",
  },
  {
    id: "Lugar 48",
    spotNumber: 48,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "157,506,271,562",
  },
  {
    id: "Lugar 49",
    spotNumber: 49,
    garageLevel: 3,
    condition: "C - Cubierta",
    price: 52000,
    status: "DISPONIBLE",
    coordinates: "156,562,270,625",
  },
]

const nivel4Cocheras: ArcosGarageSpot[] = [
  {
    id: "Lugar 50",
    spotNumber: 50,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "310,33,364,146",
  },
  {
    id: "Lugar 51",
    spotNumber: 51,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "366,33,423,146",
  },
  {
    id: "Lugar 52",
    spotNumber: 52,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "424,29,482,146",
  },
  {
    id: "Lugar 53",
    spotNumber: 53,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "482,30,539,146",
  },
  {
    id: "Lugar 54",
    spotNumber: 54,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "538,29,599,146",
  },
  {
    id: "Lugar 55",
    spotNumber: 55,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "638,145,752,202",
  },
  {
    id: "Lugar 56",
    spotNumber: 56,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "638,202,753,260",
  },
  {
    id: "Lugar 57",
    spotNumber: 57,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "638,261,755,320",
  },
  {
    id: "Lugar 58",
    spotNumber: 58,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "638,318,754,376",
  },
  {
    id: "Lugar 59",
    spotNumber: 59,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "638,375,753,434",
  },
  {
    id: "Lugar 60",
    spotNumber: 60,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "638,433,755,490",
  },
  {
    id: "Lugar 61",
    spotNumber: 61,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "638,490,753,549",
  },
  {
    id: "Lugar 62",
    spotNumber: 62,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "639,547,756,606",
  },
  {
    id: "Lugar 63",
    spotNumber: 63,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "241,268,297,383",
  },
  {
    id: "Lugar 64",
    spotNumber: 64,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "158,393,270,450",
  },
  {
    id: "Lugar 65",
    spotNumber: 65,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "157,449,270,506",
  },
  {
    id: "Lugar 66",
    spotNumber: 66,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "157,506,271,562",
  },
  {
    id: "Lugar 67",
    spotNumber: 67,
    garageLevel: 4,
    condition: "D - Cubierta",
    price: 50000,
    status: "DISPONIBLE",
    coordinates: "156,562,270,625",
  },
]

// COMBINED FLOOR DATA
export const arcosFloorsData: ArcosFloor[] = [
  { level: 1, name: "Piso 1", apartments: piso1Data },
  { level: 2, name: "Piso 2", apartments: piso2Data },
  { level: 3, name: "Piso 3", apartments: piso3Data },
  { level: 4, name: "Piso 4", apartments: piso4Data },
  { level: 5, name: "Piso 5", apartments: piso5Data },
  { level: 6, name: "Piso 6", apartments: piso6Data },
  { level: 7, name: "Piso 7", apartments: piso7Data },
  { level: 8, name: "Piso 8", apartments: piso8Data },
  { level: 9, name: "Piso 9", apartments: piso9Data },
  { level: 10, name: "Piso 10", apartments: piso10Data },
  { level: 11, name: "Piso 11", apartments: piso11Data },
  { level: 12, name: "Piso 12", apartments: piso12Data },
  { level: 13, name: "Piso 13", apartments: piso13Data },
  { level: 14, name: "Piso 14", apartments: piso14Data },
  { level: 15, name: "Piso 15", apartments: piso15Data },
  { level: 16, name: "Piso 16", apartments: piso16Data },
  { level: 17, name: "Piso 17", apartments: piso17Data },
  { level: 18, name: "Piso 18", apartments: piso18Data },
  { level: 19, name: "Piso 19", apartments: piso19Data },
  { level: 20, name: "Piso 20", apartments: piso20Data },
  { level: 21, name: "Piso 21", apartments: piso21Data },
  { level: 22, name: "Piso 22", apartments: piso22Data },
  { level: 23, name: "Piso 23", apartments: piso23Data },
  { level: 24, name: "Piso 24", apartments: piso24Data },
]

export const arcosGarageData = {
  nivel1: nivel1Cocheras,
  nivel2: nivel2Cocheras,
  nivel3: nivel3Cocheras,
  nivel4: nivel4Cocheras,
}

// Helper functions
export const getArcosApartmentByUnitNumber = (unitNumber: string): ArcosApartment | undefined => {
  for (const floor of arcosFloorsData) {
    const apartment = floor.apartments.find((apt) => apt.unitNumber === unitNumber)
    if (apartment) return apartment
  }
  return undefined
}

export const getArcosGarageSpotsByLevel = (level: number): ArcosGarageSpot[] => {
  switch (level) {
    case 1:
      return arcosGarageData.nivel1
    case 2:
      return arcosGarageData.nivel2
    case 3:
      return arcosGarageData.nivel3
    case 4:
      return arcosGarageData.nivel4
    default:
      return []
  }
}

export const formatArcosPrice = (price: number): string => {
  return `USD ${price.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}


export const formatArcosArea = (area: number): string => {
  return `${area.toFixed(2)} m²`
}

export const updateArcosApartmentStatus = (
  unitNumber: string,
  newStatus: ArcosApartmentStatus,
): ArcosApartment | null => {
  for (const floor of arcosFloorsData) {
    const apartment = floor.apartments.find((apt) => apt.unitNumber === unitNumber)
    if (apartment) {
      apartment.status = newStatus
      return apartment
    }
  }
  return null
}

export const getArcosStatusColor = (status: ArcosApartmentStatus): string => {
  switch (status) {
    case "DISPONIBLE":
      return "#10B981" // Verde
    case "VENDIDO":
      return "#EF4444" // Rojo
    case "RESERVADO":
      return "#F59E0B" // Amarillo
    case "BLOQUEADO":
      return "#3B82F6" // Azul
    default:
      return "#6B7280" // Gris
  }

}

export const getArcosStatusLabel = (status: ArcosApartmentStatus): string => {
  switch (status) {
    case "DISPONIBLE":
      return "Disponible"
    case "VENDIDO":
      return "Vendido"
    case "RESERVADO":
      return "Reservado"
    case "BLOQUEADO":
      return "Bloqueado"
    default:
      return "Desconocido"
  }
}

// Project stats
export const getArcosProjectStats = () => {
  const allApartments = arcosFloorsData.flatMap((floor) => floor.apartments)
  const allGarages = [
    ...arcosGarageData.nivel1,
    ...arcosGarageData.nivel2,
    ...arcosGarageData.nivel3,
    ...arcosGarageData.nivel4,
  ]

  const totalUnits = allApartments.length
  const available = allApartments.filter((apt) => apt.status === "DISPONIBLE").length
  const sold = allApartments.filter((apt) => apt.status === "VENDIDO").length
  const reserved = allApartments.filter((apt) => apt.status === "RESERVADO").length
  const blocked = allApartments.filter((apt) => apt.status === "BLOQUEADO").length

  const totalGarages = allGarages.length
  const garagesAvailable = allGarages.filter((g) => g.status === "DISPONIBLE").length

  const minPrice = Math.min(...allApartments.map((apt) => apt.salePrice))

  return {
    totalUnits,
    available,
    sold,
    reserved,
    blocked,
    totalGarages,
    garagesAvailable,
    minPrice,
    occupancyRate: Math.round((sold / totalUnits) * 100),
  }
}

// Project information with additional properties
export const arcosProjectInfo = {
  name: "DOME Torre Arcos",
  shortName: "Arcos",
  location: "Belgrano",
  description:
    "Elegancia y confort en el corazón de Belgrano. DOME Torre Arcos, un exclusivo complejo residencial de 24 pisos que lleva el concepto de vida premium al siguiente nivel en el prestigioso barrio de Belgrano. Cada unidad fue diseñada para combinar la sofisticación y la funcionalidad, con terminaciones de alta gama y espacios luminosos que brindan un ambiente de serenidad y modernidad, al que se le suman increíbles vistas panorámicas de la ciudad.",
  totalFloors: 24,
  logo: "/dome-arcos/arcos-logo.png",
  image: "/dome-arcos/arcos-edificio.jpg",
  floors: arcosFloorsData,
  generalPromotions: [
    { title: "10% de Descuento", description: "Para propietarios del Barrio", isActive: true },
    { title: "Planes de Financiación", description: "Hasta en 44 cuotas", isActive: true },
  ],
  amenities: [
    "GYM + ÁREA FITNESS",
    "SUM",
    "SOLARIUM CON PISCINA IN/OUT",
    "HEALTHY SPA",
    "SAUNA SECO Y HÚMEDO + SALA DE RELAX",
    "FRONT DESK",
    "LAUNDRY",
    "SMART LOCKERS",
    "SEGURIDAD 24HS",
    "BIKE PARKING",
    "ESPACIO LÚDICO EXTERIOR",
  ],
  unitTypes: [
    { type: "2 Dormitorios", name: "2 Dormitorios" },
    { type: "3 Dormitorios", name: "3 Dormitorios" },
    { type: "3 Dormitorios + Dep", name: "3 Dormitorios + Dep" },
    { type: "Piso 360°", name: "Piso 360°" },
    { type: "Piso 360° + Terraza", name: "Piso 360° + Terraza" },
  ],
}

// Floor plans export
export const arcosFloorPlans = {
  1: "/planos/arcos/pisos/piso_1.png",
  2: "/planos/arcos/pisos/piso_2.png",
  3: "/planos/arcos/pisos/piso_3.png",
  4: "/planos/arcos/pisos/piso_4-8.png",
  5: "/planos/arcos/pisos/piso_4-8.png",
  6: "/planos/arcos/pisos/piso_4-8.png",
  7: "/planos/arcos/pisos/piso_4-8.png",
  8: "/planos/arcos/pisos/piso_4-8.png",
  9: "/planos/arcos/pisos/piso_9.png",
  10: "/planos/arcos/pisos/piso_10.png",
  11: "/planos/arcos/pisos/piso_11.png",
  12: "/planos/arcos/pisos/piso_12-23.png",
  13: "/planos/arcos/pisos/piso_12-23.png",
  14: "/planos/arcos/pisos/piso_12-23.png",
  15: "/planos/arcos/pisos/piso_12-23.png",
  16: "/planos/arcos/pisos/piso_12-23.png",
  17: "/planos/arcos/pisos/piso_12-23.png",
  18: "/planos/arcos/pisos/piso_12-23.png",
  19: "/planos/arcos/pisos/piso_12-23.png",
  20: "/planos/arcos/pisos/piso_12-23.png",
  21: "/planos/arcos/pisos/piso_12-23.png",
  22: "/planos/arcos/pisos/piso_12-23.png",
  23: "/planos/arcos/pisos/piso_12-23.png",
  24: "/planos/arcos/pisos/piso_24.png",
  25: "/planos/arcos/pisos/piso_12-23.png",
  26: "/planos/arcos/pisos/piso_12-23.png",
  27: "/planos/arcos/pisos/piso_12-23.png",
  // Parking levels
  parking1: "/planos/arcos/cocheras/nivel1.png",
  parking2: "/planos/arcos/cocheras/nivel2.png",
  parking3: "/planos/arcos/cocheras/nivel3.png",
  parking4: "/planos/arcos/cocheras/nivel4.png",
} as const
