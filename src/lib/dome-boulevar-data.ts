export type BoulevardUnit = {
  id: string
  unitNumber: string
  floor: number
  description: string
  orientation: string
  totalArea: number
  saleValue: number
  pricePerSqm: number
  status: "DISPONIBLE" | "VENDIDO" | "RESERVADO" | "BLOQUEADO"
  details: {
    coveredArea: number
    balconyArea: number
    uncoveredArea: number
    privateHallway: number
    amenities: number
    totalWithAmenities: number
  }
}

export type BoulevardParking = {
  id: string
  level: string
  type: string
  price: number
  available: number
}

export type BoulevardGarageSpot = {
  id: string
  level: number
  spotNumber: string
  status: "DISPONIBLE" | "VENDIDO" | "RESERVADO" | "BLOQUEADO"
  price: number
  coords: string
}

export const boulevardUnits: BoulevardUnit[] = [
  // Piso 1
  {
    id: "101",
    unitNumber: "101",
    floor: 1,
    description: "3 DORMITORIOS",
    orientation: "CONTRAFRENTE 3 DOR",
    totalArea: 129.86,
    saleValue: 640900,
    pricePerSqm: 4936,
    status: "DISPONIBLE",
    details: {
      coveredArea: 114.0,
      balconyArea: 4.05,
      uncoveredArea: 0.0,
      privateHallway: 11.81,
      amenities: 0,
      totalWithAmenities: 129.86,
    },
  },
  {
    id: "102",
    unitNumber: "102",
    floor: 1,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 104.12,
    saleValue: 513900,
    pricePerSqm: 4936,
    status: "DISPONIBLE",
    details: {
      coveredArea: 86.4,
      balconyArea: 8.25,
      uncoveredArea: 0.0,
      privateHallway: 9.47,
      amenities: 0,
      totalWithAmenities: 104.12,
    },
  },
  // Piso 2
  {
    id: "201",
    unitNumber: "201",
    floor: 2,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 181.51,
    saleValue: 921400,
    pricePerSqm: 5076,
    status: "VENDIDO",
    details: {
      coveredArea: 138.94,
      balconyArea: 11.4,
      uncoveredArea: 12.31,
      privateHallway: 2.6,
      amenities: 16.26,
      totalWithAmenities: 181.51,
    },
  },
  {
    id: "202",
    unitNumber: "202",
    floor: 2,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 175.09,
    saleValue: 888800,
    pricePerSqm: 5076,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 17.32,
      privateHallway: 15.92,
      amenities: 0,
      totalWithAmenities: 175.09,
    },
  },
  {
    id: "203",
    unitNumber: "203",
    floor: 2,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 455300,
    pricePerSqm: 5077,
    status: "VENDIDO",
    details: {
      coveredArea: 76.95,
      balconyArea: 4.58,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 3
  {
    id: "301",
    unitNumber: "301",
    floor: 3,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 186.58,
    saleValue: 973400,
    pricePerSqm: 5217,
    status: "VENDIDO",
    details: {
      coveredArea: 146.46,
      balconyArea: 20.79,
      uncoveredArea: 0.0,
      privateHallway: 2.6,
      amenities: 16.73,
      totalWithAmenities: 186.58,
    },
  },
  {
    id: "302",
    unitNumber: "302",
    floor: 3,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 814100,
    pricePerSqm: 5217,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "303",
    unitNumber: "303",
    floor: 3,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 467900,
    pricePerSqm: 5218,
    status: "VENDIDO",
    details: {
      coveredArea: 77.27,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 4
  {
    id: "401",
    unitNumber: "401",
    floor: 4,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 186.58,
    saleValue: 999700,
    pricePerSqm: 5358,
    status: "VENDIDO",
    details: {
      coveredArea: 146.46,
      balconyArea: 20.79,
      uncoveredArea: 0.0,
      privateHallway: 2.6,
      amenities: 16.73,
      totalWithAmenities: 186.58,
    },
  },
  {
    id: "402",
    unitNumber: "402",
    floor: 4,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 836100,
    pricePerSqm: 5358,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "403",
    unitNumber: "403",
    floor: 4,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 480500,
    pricePerSqm: 5358,
    status: "VENDIDO",
    details: {
      coveredArea: 77.27,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 5
  {
    id: "501",
    unitNumber: "501",
    floor: 5,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 186.58,
    saleValue: 1026100,
    pricePerSqm: 5499,
    status: "VENDIDO",
    details: {
      coveredArea: 146.46,
      balconyArea: 20.79,
      uncoveredArea: 0.0,
      privateHallway: 2.6,
      amenities: 16.73,
      totalWithAmenities: 186.58,
    },
  },
  {
    id: "502",
    unitNumber: "502",
    floor: 5,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 858100,
    pricePerSqm: 5499,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "503",
    unitNumber: "503",
    floor: 5,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 493200,
    pricePerSqm: 5500,
    status: "VENDIDO",
    details: {
      coveredArea: 77.27,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 6
  {
    id: "601",
    unitNumber: "601",
    floor: 6,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 186.58,
    saleValue: 1052400,
    pricePerSqm: 5640,
    status: "VENDIDO",
    details: {
      coveredArea: 146.46,
      balconyArea: 20.79,
      uncoveredArea: 0.0,
      privateHallway: 2.6,
      amenities: 16.73,
      totalWithAmenities: 186.58,
    },
  },
  {
    id: "602",
    unitNumber: "602",
    floor: 6,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 880100,
    pricePerSqm: 5640,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "603",
    unitNumber: "603",
    floor: 6,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 505800,
    pricePerSqm: 5640,
    status: "VENDIDO",
    details: {
      coveredArea: 77.27,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 7
  {
    id: "701",
    unitNumber: "701",
    floor: 7,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 186.58,
    saleValue: 1083900,
    pricePerSqm: 5809,
    status: "VENDIDO",
    details: {
      coveredArea: 146.46,
      balconyArea: 20.79,
      uncoveredArea: 0.0,
      privateHallway: 2.6,
      amenities: 16.73,
      totalWithAmenities: 186.58,
    },
  },
  {
    id: "702",
    unitNumber: "702",
    floor: 7,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 906500,
    pricePerSqm: 5809,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "703",
    unitNumber: "703",
    floor: 7,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 521000,
    pricePerSqm: 5810,
    status: "VENDIDO",
    details: {
      coveredArea: 77.27,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 8
  {
    id: "801",
    unitNumber: "801",
    floor: 8,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 186.58,
    saleValue: 1115500,
    pricePerSqm: 5979,
    status: "VENDIDO",
    details: {
      coveredArea: 146.46,
      balconyArea: 20.79,
      uncoveredArea: 0.0,
      privateHallway: 2.6,
      amenities: 16.73,
      totalWithAmenities: 186.58,
    },
  },
  {
    id: "802",
    unitNumber: "802",
    floor: 8,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 932900,
    pricePerSqm: 5979,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "803",
    unitNumber: "803",
    floor: 8,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 536200,
    pricePerSqm: 5979,
    status: "VENDIDO",
    details: {
      coveredArea: 77.27,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 9
  {
    id: "901",
    unitNumber: "901",
    floor: 9,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 186.39,
    saleValue: 1145900,
    pricePerSqm: 6148,
    status: "VENDIDO",
    details: {
      coveredArea: 142.44,
      balconyArea: 20.79,
      uncoveredArea: 3.84,
      privateHallway: 2.6,
      amenities: 16.71,
      totalWithAmenities: 186.39,
    },
  },
  {
    id: "902",
    unitNumber: "902",
    floor: 9,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 959300,
    pricePerSqm: 6148,
    status: "VENDIDO",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "903",
    unitNumber: "903",
    floor: 9,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 89.68,
    saleValue: 551400,
    pricePerSqm: 6149,
    status: "VENDIDO",
    details: {
      coveredArea: 77.27,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.15,
      amenities: 0,
      totalWithAmenities: 89.68,
    },
  },
  // Piso 10
  {
    id: "1001",
    unitNumber: "1001",
    floor: 10,
    description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
    orientation: "PASANTE DERECHO",
    totalArea: 181.69,
    saleValue: 1147800,
    pricePerSqm: 6317,
    status: "VENDIDO",
    details: {
      coveredArea: 138.18,
      balconyArea: 20.79,
      uncoveredArea: 3.84,
      privateHallway: 2.6,
      amenities: 16.28,
      totalWithAmenities: 181.69,
    },
  },
  {
    id: "1002",
    unitNumber: "1002",
    floor: 10,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "PASANTE IZQUIERDO",
    totalArea: 156.04,
    saleValue: 985700,
    pricePerSqm: 6317,
    status: "DISPONIBLE",
    details: {
      coveredArea: 133.43,
      balconyArea: 8.42,
      uncoveredArea: 0.0,
      privateHallway: 14.19,
      amenities: 0,
      totalWithAmenities: 156.04,
    },
  },
  {
    id: "1003",
    unitNumber: "1003",
    floor: 10,
    description: "2 DORMITORIOS (ALL SUITES)",
    orientation: "CONTRAFRENTE 2 DOR",
    totalArea: 90.82,
    saleValue: 573700,
    pricePerSqm: 6317,
    status: "DISPONIBLE",
    details: {
      coveredArea: 78.3,
      balconyArea: 4.26,
      uncoveredArea: 0.0,
      privateHallway: 8.26,
      amenities: 0,
      totalWithAmenities: 90.82,
    },
  },
  // Piso 11
  {
    id: "1101",
    unitNumber: "1101",
    floor: 11,
    description: "3 DORMITORIOS C/PALIER PRIV C/PARRILLA",
    orientation: "FRENTE",
    totalArea: 230.39,
    saleValue: 1494300,
    pricePerSqm: 6486,
    status: "VENDIDO",
    details: {
      coveredArea: 147.79,
      balconyArea: 24.86,
      uncoveredArea: 33.37,
      privateHallway: 3.76,
      amenities: 20.6,
      totalWithAmenities: 230.39,
    },
  },
  {
    id: "1102",
    unitNumber: "1102",
    floor: 11,
    description: "3 DORMITORIOS C/PARRILLA",
    orientation: "CONTRAFRENTE",
    totalArea: 185.78,
    saleValue: 1205000,
    pricePerSqm: 6486,
    status: "VENDIDO",
    details: {
      coveredArea: 124.19,
      balconyArea: 7.6,
      uncoveredArea: 37.1,
      privateHallway: 16.89,
      amenities: 0,
      totalWithAmenities: 185.78,
    },
  },
  // Piso 12
  {
    id: "1201",
    unitNumber: "1201",
    floor: 12,
    description: "3 DORMITORIOS C/PALIER PRIV",
    orientation: "FRENTE",
    totalArea: 193.6,
    saleValue: 1288500,
    pricePerSqm: 6655,
    status: "VENDIDO",
    details: {
      coveredArea: 147.99,
      balconyArea: 9.04,
      uncoveredArea: 15.55,
      privateHallway: 3.76,
      amenities: 17.26,
      totalWithAmenities: 193.6,
    },
  },
  {
    id: "1202",
    unitNumber: "1202",
    floor: 12,
    description: "3 DORMITORIOS",
    orientation: "CONTRAFRENTE",
    totalArea: 145.78,
    saleValue: 970300,
    pricePerSqm: 6656,
    status: "DISPONIBLE",
    details: {
      coveredArea: 125.19,
      balconyArea: 7.34,
      uncoveredArea: 0.0,
      privateHallway: 13.25,
      amenities: 0,
      totalWithAmenities: 145.78,
    },
  },
]

export const boulevardParking: BoulevardParking[] = [
  {
    id: "1ss",
    level: "1º Subsuelo",
    type: "SIMPLE",
    price: 52000,
    available: 2,
  },
  {
    id: "2ss",
    level: "2º Subsuelo",
    type: "SIMPLE",
    price: 48000,
    available: 8,
  },
  {
    id: "3ss",
    level: "3º Subsuelo",
    type: "SIMPLE",
    price: 46000,
    available: 11,
  },
]

export const boulevardFloorCoordinates = {
  1: [
    {
      id: "101",
      coords: "345,407,259,408,258,400,159,400,158,12,522,17,521,245,346,250,345,313,321,315,321,366,346,365",
    },
    {
      id: "102",
      coords:
        "472,249,474,294,539,294,538,315,625,313,625,455,775,456,775,379,786,378,786,244,699,242,699,161,707,161,705,60,613,56,610,13,522,18,521,243",
    },
  ],
  2: [
    {
      id: "202",
      coords:
        "333,659,334,372,291,371,294,319,332,317,334,243,423,244,423,13,141,15,140,583,255,583,255,638,240,637,242,660",
    },
    {
      id: "201",
      coords:
        "336,466,335,658,469,660,471,717,659,719,659,703,780,700,779,428,792,427,790,207,706,206,705,234,696,234,695,319,568,321,566,372,505,370,508,466",
    },
    {
      id: "203",
      coords:
        "425,13,426,245,471,248,471,299,518,301,519,318,699,319,700,233,705,233,704,146,712,146,709,55,612,52,612,15",
    },
  ],
  3: [
    {
      id: "302",
      coords:
        "345,352,343,630,256,628,255,606,266,608,268,553,159,553,156,9,431,8,431,227,345,230,347,300,305,299,305,347",
    },
    {
      id: "303",
      coords:
        "432,7,610,9,614,43,709,43,710,132,702,133,703,217,696,218,696,303,522,299,522,282,477,279,475,227,433,228",
    },
    {
      id: "301",
      coords:
        "345,443,344,629,477,631,478,722,657,722,660,672,779,671,776,407,787,403,786,191,703,192,706,217,698,218,697,302,569,302,569,354,511,354,514,440",
    },
  ],
  // Los pisos 4-8 usan las mismas coordenadas que el piso 3
  4: [
    {
      id: "402",
      coords:
        "345,352,343,630,256,628,255,606,266,608,268,553,159,553,156,9,431,8,431,227,345,230,347,300,305,299,305,347",
    },
    {
      id: "403",
      coords:
        "432,7,610,9,614,43,709,43,710,132,702,133,703,217,696,218,696,303,522,299,522,282,477,279,475,227,433,228",
    },
    {
      id: "401",
      coords:
        "345,443,344,629,477,631,478,722,657,722,660,672,779,671,776,407,787,403,786,191,703,192,706,217,698,218,697,302,569,302,569,354,511,354,514,440",
    },
  ],
  5: [
    {
      id: "502",
      coords:
        "345,352,343,630,256,628,255,606,266,608,268,553,159,553,156,9,431,8,431,227,345,230,347,300,305,299,305,347",
    },
    {
      id: "503",
      coords:
        "432,7,610,9,614,43,709,43,710,132,702,133,703,217,696,218,696,303,522,299,522,282,477,279,475,227,433,228",
    },
    {
      id: "501",
      coords:
        "345,443,344,629,477,631,478,722,657,722,660,672,779,671,776,407,787,403,786,191,703,192,706,217,698,218,697,302,569,302,569,354,511,354,514,440",
    },
  ],
  6: [
    {
      id: "602",
      coords:
        "345,352,343,630,256,628,255,606,266,608,268,553,159,553,156,9,431,8,431,227,345,230,347,300,305,299,305,347",
    },
    {
      id: "603",
      coords:
        "432,7,610,9,614,43,709,43,710,132,702,133,703,217,696,218,696,303,522,299,522,282,477,279,475,227,433,228",
    },
    {
      id: "601",
      coords:
        "345,443,344,629,477,631,478,722,657,722,660,672,779,671,776,407,787,403,786,191,703,192,706,217,698,218,697,302,569,302,569,354,511,354,514,440",
    },
  ],
  7: [
    {
      id: "702",
      coords:
        "345,352,343,630,256,628,255,606,266,608,268,553,159,553,156,9,431,8,431,227,345,230,347,300,305,299,305,347",
    },
    {
      id: "703",
      coords:
        "432,7,610,9,614,43,709,43,710,132,702,133,703,217,696,218,696,303,522,299,522,282,477,279,475,227,433,228",
    },
    {
      id: "701",
      coords:
        "345,443,344,629,477,631,478,722,657,722,660,672,779,671,776,407,787,403,786,191,703,192,706,217,698,218,697,302,569,302,569,354,511,354,514,440",
    },
  ],
  8: [
    {
      id: "802",
      coords:
        "345,352,343,630,256,628,255,606,266,608,268,553,159,553,156,9,431,8,431,227,345,230,347,300,305,299,305,347",
    },
    {
      id: "803",
      coords:
        "432,7,610,9,614,43,709,43,710,132,702,133,703,217,696,218,696,303,522,299,522,282,477,279,475,227,433,228",
    },
    {
      id: "801",
      coords:
        "345,443,344,629,477,631,478,722,657,722,660,672,779,671,776,407,787,403,786,191,703,192,706,217,698,218,697,302,569,302,569,354,511,354,514,440",
    },
  ],
  9: [
    {
      id: "902",
      coords:
        "335,361,335,629,249,632,248,609,261,609,260,562,152,561,150,19,418,19,421,235,336,233,336,308,296,308,297,357",
    },
    {
      id: "901",
      coords:
        "337,447,337,631,464,629,467,723,648,722,647,669,762,672,763,409,774,409,773,242,687,242,685,307,560,305,559,356,499,358,501,444",
    },
    {
      id: "903",
      coords:
        "420,15,421,235,466,235,464,286,509,285,510,303,682,304,681,223,688,223,685,142,693,142,695,53,600,54,599,18",
    },
  ],
  10: [
    {
      id: "1003",
      coords:
        "349,626,261,626,259,603,273,604,273,550,161,551,164,5,436,4,436,224,351,224,350,297,309,299,309,346,350,351",
    },
    {
      id: "1001",
      coords:
        "350,441,351,624,479,627,480,720,663,717,663,668,780,670,780,422,789,421,788,281,699,277,700,297,574,296,574,350,516,349,516,439",
    },
    {
      id: "1002",
      coords:
        "702,298,526,294,526,273,480,276,477,223,436,223,437,3,616,7,614,43,710,41,714,132,706,133,707,227,700,229",
    },
  ],
  11: [
    {
      id: "1102",
      coords:
        "231,367,138,369,136,-1,686,4,688,108,679,108,680,184,669,311,539,313,539,295,499,296,499,276,451,274,450,226,323,229,323,298,282,299,281,351,233,351",
    },
    {
      id: "1101",
      coords:
        "137,371,135,625,451,625,450,721,733,721,731,585,744,585,743,471,751,469,751,269,674,266,669,313,539,314,540,349,487,348,487,439,320,435,321,351,232,347,230,369",
    },
  ],
  12: [
    {
      id: "1202",
      coords:
        "230,380,180,379,180,27,647,27,648,131,639,131,640,215,632,340,497,340,496,324,456,324,455,308,405,306,405,255,270,257,273,328,231,329",
    },
    {
      id: "1201",
      coords:
        "179,383,178,624,408,626,408,764,696,764,696,627,709,626,710,509,716,508,716,391,625,394,624,346,496,340,496,381,443,381,443,475,272,474,271,383,222,382,202,383",
    },
  ],
}

export const boulevardGarageCoordinates = {
  1: [
    {
      id: "a1",
      spotNumber: "A1",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "172,740,175,793,174,804,173,828,181,832,192,833,211,832,219,832,222,825,225,797,222,786,223,769,223,754,223,743,224,728,225,717,223,705,218,699,211,695,202,695,192,692,181,696,174,704",
    },
    {
      id: "a2",
      spotNumber: "A2",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "250,699,250,721,251,748,252,775,251,793,250,808,254,827,259,831,271,831,281,832,288,832,296,832,300,823,302,805,302,794,300,781,300,765,302,744,303,731,303,721,303,708,299,698,287,693,268,693",
    },
    {
      id: "a3",
      spotNumber: "A3",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "331,697,329,707,328,720,328,733,329,745,331,753,329,769,329,782,329,799,329,809,330,819,331,829,337,830,346,832,359,833,369,831,376,826,379,814,379,805,379,797,379,781,379,769,378,760,378,753,378,739,379,732,379,725,379,717,379,711,378,704,374,697,365,695,359,693,351,693,341,693",
    },
    {
      id: "a4",
      spotNumber: "A4",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "176,42,175,57,173,77,173,92,173,104,174,121,174,133,174,147,173,163,175,170,183,178,204,180,224,171,224,160,224,147,224,119,223,101,222,82,223,74,223,61,222,49,221,42,204,40,197,39,191,39",
    },
    {
      id: "a5",
      spotNumber: "A5",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "253,43,252,51,250,66,250,78,250,96,250,110,251,122,251,140,251,150,250,167,253,174,263,177,275,179,291,180,298,174,302,158,302,142,302,125,302,116,302,98,302,82,301,69,299,51,298,42,292,39,281,39,269,38",
    },
    {
      id: "a6",
      spotNumber: "A6",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "330,43,328,56,328,72,328,85,329,101,327,125,326,140,327,156,330,170,333,176,343,177,353,178,363,178,373,174,379,169,379,160,381,148,379,137,377,123,377,112,376,93,378,79,378,71,378,60,376,47,369,42,356,39,341,39",
    },
    {
      id: "a7",
      spotNumber: "A7",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "409,42,408,52,407,66,406,75,406,89,407,105,407,126,407,134,405,147,405,160,408,170,417,178,424,178,431,179,439,178,451,174,455,168,457,157,456,141,456,126,455,115,456,100,456,85,457,75,457,61,455,51,453,45,447,41,434,40,426,39",
    },
    {
      id: "a8",
      spotNumber: "A8",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "485,41,484,57,482,73,482,85,482,99,482,118,482,131,482,143,481,165,487,174,497,179,507,180,515,181,525,178,532,171,533,161,534,144,534,129,533,113,532,98,530,83,533,78,533,69,533,58,532,43,523,40,512,39",
    },
    {
      id: "a9",
      spotNumber: "A9",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "561,42,560,53,561,65,561,74,560,83,559,102,560,118,560,131,560,144,560,159,562,174,569,177,578,178,593,179,605,176,611,172,612,162,612,145,612,129,611,122,611,110,611,98,611,90,611,83,612,75,612,58,611,50,609,39,603,39,593,39,586,39,576,38",
    },
    {
      id: "a10",
      spotNumber: "A10",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "639,42,638,61,638,82,638,96,639,124,638,150,640,171,646,175,651,179,660,179,672,180,680,177,686,170,688,156,688,139,688,123,689,111,690,97,690,77,689,64,687,47,682,40,665,38",
    },
    {
      id: "a11",
      spotNumber: "A11",
      level: 1,
      status: "DISPONIBLE" as const,
      price: 52000,
      coords:
        "718,42,716,55,716,70,716,83,717,98,717,119,717,134,715,145,715,162,719,174,728,177,737,178,746,179,754,178,763,174,765,166,766,146,766,129,766,116,765,96,765,83,767,71,764,49,763,42,753,40,739,39,730,39,724,41",
    },
  ],
  3: [
    {
      id: "a12",
      spotNumber: "A12",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "190,692,189,706,188,724,188,746,191,758,190,778,188,793,189,809,191,822,203,828,219,828,235,825,239,819,242,801,242,785,242,771,242,750,242,739,241,725,241,712,241,701,239,691,223,686,213,685,205,685",
    },
    {
      id: "a13",
      spotNumber: "A13",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "266,692,263,709,264,722,265,734,266,747,266,760,264,783,263,799,266,819,271,824,286,826,304,827,310,824,315,819,315,803,317,790,316,779,316,760,315,748,315,730,317,722,318,714,315,699,312,691,302,688,288,685,280,686",
    },
    {
      id: "a14",
      spotNumber: "A14",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "345,691,346,712,346,733,344,753,344,780,343,794,344,819,351,824,373,825,385,826,392,824,398,810,397,789,397,781,397,764,397,750,397,740,396,729,396,718,394,709,395,693,390,689,383,688,372,688,363,686,356,688",
    },
    {
      id: "a15",
      spotNumber: "A15",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "423,692,422,710,423,725,423,740,422,751,420,771,420,790,422,811,425,824,435,826,447,826,457,825,471,823,472,817,474,811,475,799,473,783,472,764,472,755,473,742,473,731,474,720,474,710,472,691,463,688,451,688,435,688",
    },
    {
      id: "a16",
      spotNumber: "A16",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "537,693,534,708,534,720,536,740,536,755,533,771,533,795,534,816,538,827,555,827,566,827,573,826,583,825,584,813,588,793,585,774,587,759,587,734,587,725,587,718,587,709,587,694,580,690,563,685,553,685",
    },
    {
      id: "a17",
      spotNumber: "A17",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "616,693,612,710,614,727,614,739,615,756,614,770,611,780,611,804,614,818,622,824,633,824,645,824,654,822,661,822,664,813,665,799,665,787,665,774,665,764,665,752,665,741,665,731,665,719,665,708,663,697,659,689,647,686,637,686,625,686",
    },
    {
      id: "a18",
      spotNumber: "A18",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "692,691,689,717,690,733,691,753,691,768,689,779,688,800,690,811,693,821,700,825,717,825,727,825,736,825,741,817,744,804,744,792,742,786,742,765,742,750,743,725,743,716,743,704,739,694,733,688,724,687,717,686,708,686",
    },
    {
      id: "a19",
      spotNumber: "A19",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "194,31,193,40,192,51,191,61,189,71,189,89,189,105,190,118,189,137,189,159,194,168,206,168,220,169,231,169,239,164,241,140,241,119,241,102,240,88,240,69,240,57,240,46,240,37,235,32,222,32",
    },
    {
      id: "a20",
      spotNumber: "A20",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "270,32,265,40,265,52,266,63,265,74,265,85,264,103,264,128,263,140,266,156,270,166,275,170,285,173,300,174,307,169,313,163,318,151,318,131,318,115,317,101,317,86,317,74,318,65,319,50,319,44,311,34,289,33",
    },
    {
      id: "a21",
      spotNumber: "A21",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "348,34,346,44,345,56,345,74,345,85,345,110,345,127,343,153,346,167,357,169,369,170,380,171,388,168,392,160,396,149,395,136,396,117,396,105,396,90,396,77,395,68,395,57,395,45,395,38,390,31,373,31",
    },
    {
      id: "a22",
      spotNumber: "A22",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "426,36,421,49,422,65,424,87,421,124,422,151,425,168,432,172,442,171,452,171,462,169,469,165,472,158,474,142,475,125,474,109,474,93,475,81,476,70,474,54,472,36,457,29,441,30",
    },
    {
      id: "a23",
      spotNumber: "A23",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "503,32,500,45,500,61,499,72,499,87,499,108,498,141,498,158,502,171,510,171,525,173,541,172,548,166,550,158,553,143,553,122,553,111,553,95,554,82,553,71,551,59,551,45,551,34,536,32,527,32",
    },
    {
      id: "a24",
      spotNumber: "A24",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "580,34,579,46,577,65,577,82,577,97,575,119,575,142,576,160,583,170,596,172,610,172,624,170,630,156,630,138,629,120,627,105,627,88,628,73,628,64,628,53,628,42,626,35,609,32,597,31",
    },
    {
      id: "a25",
      spotNumber: "A25",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "656,32,654,42,654,58,656,83,656,101,653,123,652,134,652,154,656,166,667,167,679,170,692,171,699,166,703,161,705,148,705,129,705,114,703,102,703,84,705,69,705,57,705,43,703,36,700,30,684,30,672,30",
    },
    {
      id: "a26",
      spotNumber: "A26",
      level: 3,
      status: "DISPONIBLE" as const,
      price: 46000,
      coords:
        "736,34,734,43,733,57,734,68,734,81,733,93,732,109,730,123,732,140,732,161,736,167,746,170,758,171,768,171,778,169,782,163,783,150,783,123,784,111,784,98,783,85,783,72,783,61,783,48,778,34,768,32",
    },
  ],
}

// Helper functions
export const getBoulevardProjectStats = () => {
  const totalUnits = boulevardUnits.length
  const availableUnits = boulevardUnits.filter((unit) => unit.status === "DISPONIBLE").length
  const soldUnits = boulevardUnits.filter((unit) => unit.status === "VENDIDO").length
  const reservedUnits = boulevardUnits.filter((unit) => unit.status === "RESERVADO").length

  return {
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    occupancyRate: Math.round((soldUnits / totalUnits) * 100),
  }
}

export const getBoulevardUnitsByFloor = (floor: number) => {
  return boulevardUnits.filter((unit) => unit.floor === floor)
}

export const getBoulevardUnitById = (id: string) => {
  return boulevardUnits.find((unit) => unit.id === id)
}

export const getBoulevardFloorImage = (floor: number) => {
  if (floor === 1) return "/planos/boulevard/pisos/piso1.png"
  if (floor === 2) return "/planos/boulevard/pisos/piso2.png"
  if (floor >= 3 && floor <= 8) return "/planos/boulevard/pisos/piso3-8.png"
  if (floor === 9) return "/planos/boulevard/pisos/piso9.png"
  if (floor === 10) return "/planos/boulevard/pisos/piso10.png"
  if (floor === 11) return "/planos/boulevard/pisos/piso11.png"
  if (floor === 12) return "/planos/boulevard/pisos/piso12.png"
  return "/planos/boulevard/pisos/piso1.png"
}

export const getBoulevardGarageSpotsByLevel = (level: number) => {
  return boulevardGarageCoordinates[level as keyof typeof boulevardGarageCoordinates] || []
}

export const getBoulevardGarageSpotById = (id: string) => {
  const allSpots = [...(boulevardGarageCoordinates[1] || []), ...(boulevardGarageCoordinates[3] || [])]
  return allSpots.find((spot) => spot.id === id)
}

export const boulevardAmenities = [
  "Piscina en rooftop",
  "Gimnasio equipado",
  "Sala de reuniones",
  "Coworking",
  "Terraza con parrillas",
  "Sala de juegos",
  "Lavadero",
  "Bauleras",
  "Cocheras cubiertas",
  "Seguridad 24hs",
  "Portería",
  "Ascensores de alta velocidad",
]

export const boulevardGalleryImages = {
  exterior: ["/planos/boulevard/exterior-1.jpg", "/planos/boulevard/exterior-2.jpg", "/planos/boulevard/fachada.jpg"],
  interior: [
    "/planos/boulevard/living-1.jpg",
    "/planos/boulevard/dormitorio-1.jpg",
    "/planos/boulevard/cocina-1.jpg",
    "/planos/boulevard/baño-1.jpg",
  ],
  amenities: [
    "/planos/boulevard/piscina.jpg",
    "/planos/boulevard/gimnasio.jpg",
    "/planos/boulevard/terraza.jpg",
    "/planos/boulevard/coworking.jpg",
  ],
  planos: [
    "/planos/boulevard/piso1.png",
    "/planos/boulevard/piso2.png",
    "/planos/boulevard/piso3-8.png",
    "/planos/boulevard/piso9.png",
    "/planos/boulevard/piso10.png",
    "/planos/boulevard/piso11.png",
    "/planos/boulevard/piso12.png",
  ],
}
