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
  if (floor === 1) return "/planos/boulevard/piso1.png"
  if (floor === 2) return "/planos/boulevard/piso2.png"
  if (floor >= 3 && floor <= 8) return "/planos/boulevard/piso3-8.png"
  if (floor === 9) return "/planos/boulevard/piso9.png"
  if (floor === 10) return "/planos/boulevard/piso10.png"
  if (floor === 11) return "/planos/boulevard/piso11.png"
  if (floor === 12) return "/planos/boulevard/piso12.png"
  return "/planos/boulevard/piso1.png"
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
