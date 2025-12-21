// Datos completos del proyecto DOME Torre Beruti basados en la información proporcionada

// Tipos para el proyecto
export type BerutiApartmentStatus = "DISPONIBLE" | "VENDIDO" | "RESERVADO" | "BLOQUEADO"
export type BerutiFloorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14
export type BerutiGarageLevel = 1 | 2 | 3

export interface BerutiApartment {
  id: string
  unitNumber: string
  description: string
  orientation: string
  coveredArea: number
  balconArea: number
  terraceArea: number
  totalArea: number
  weightedArea: number
  amenitiesArea: number
  totalWithAmenities: number
  saleValue: number
  pricePerM2: number
  status: BerutiApartmentStatus
  coordinates?: string
  reserveAmount: number
  downPayment: number
  balance: number
  monthlyPayment: number
}

export interface BerutiFloor {
  level: number
  name: string
  apartments: BerutiApartment[]
}

export interface BerutiParkingSpot {
  id: string
  level: BerutiGarageLevel
  type: "A" | "B" | "C"
  price: number
  status: BerutiApartmentStatus
  assignedTo: string | null
  coordinates?: string
}

// Datos del proyecto
export const berutiProjectInfo = {
  id: "dome-torre-beruti",
  name: "DOME Torre Beruti",
  location: "Beruti 4540, CABA",
  description:
    "Emprendimiento en torre de primera categoría que cuenta con un total de 43 unidades residenciales de 3 y 4 ambientes con dependencia distribuidas en 14 niveles. Posee 3 niveles de subsuelos de cocheras.",
  totalUnits: 43,
  floors: 14,
  garageSublevels: 3,
  image: "/images/edificio/beruti.webp",
  logo: "/images/logo/berutilogo.png",
  brochure: "/documents/beruti-brochure.pdf",

  // Estadísticas calculadas
  get availableUnits() {
    return berutiFloorsData.reduce(
      (total, floor) => total + floor.apartments.filter((apt) => apt.status === "DISPONIBLE").length,
      0,
    )
  },
  get soldUnits() {
    return berutiFloorsData.reduce(
      (total, floor) => total + floor.apartments.filter((apt) => apt.status === "VENDIDO").length,
      0,
    )
  },
  get reservedUnits() {
    return berutiFloorsData.reduce(
      (total, floor) => total + floor.apartments.filter((apt) => apt.status === "RESERVADO").length,
      0,
    )
  },
}

// Amenities del proyecto
export const berutiAmenities = [
  {
    name: "3 niveles de cocheras",
    description: "Cocheras cubiertas en subsuelos con acceso directo",
  },
  {
    name: "Salón de usos múltiples",
    description: "Ubicado en PB completamente equipado con expansión descubierta",
  },
  {
    name: "Salón adicional",
    description: "Segundo salón en PB con destino a definir según tendencias de mercado",
  },
  {
    name: "Gameroom",
    description: "Espacio de esparcimiento situado en la PB",
  },
  {
    name: "Gimnasio completo",
    description: "En PB con sala exclusiva de relax",
  },
  {
    name: "Pileta in/out",
    description: "Con solárium en PB, área de sauna y sala de spa",
  },
  {
    name: "Juegos infantiles",
    description: "Espacio de juegos para niños en PB, sector descubierto",
  },
  {
    name: "Seguridad 24hs",
    description: "Cabina de seguridad con control permanente",
  },
]

// Tipos de unidades
export const berutiUnitTypes = [
  {
    type: "2 Dormitorios",
    size: "87-192 m²",
    priceRange: "$371.600 - $980.700 USD",
    status: "Disponible",
  },
  {
    type: "3 Dormitorios",
    size: "107-228 m²",
    priceRange: "$408.800 - $1.229.100 USD",
    status: "Disponible",
  },
  {
    type: "3 Dormitorios con Dependencia",
    size: "147-248 m²",
    priceRange: "$623.800 - $1.185.000 USD",
    status: "Disponible",
  },
  {
    type: "Town House",
    size: "181-270 m²",
    priceRange: "$797.800 - $823.500 USD",
    status: "Disponible",
  },
  {
    type: "Penthouse",
    size: "322-353 m²",
    priceRange: "$1.680.600 - $1.707.900 USD",
    status: "Disponible",
  },
]

// Opciones financieras
export const berutiFinancialOptions = [
  {
    name: "Reserva",
    description: "10% del valor total de la unidad",
  },
  {
    name: "Anticipo",
    description: "30% del valor total",
  },
  {
    name: "Saldo",
    description: "60% en 40 cuotas mensuales",
  },
  {
    name: "Cocheras",
    description: "Disponibles en 3 subsuelos desde $45.000 USD",
  },
]

// Configuración del mapa
export const berutiMapConfig = {
  coordinates: {
    lat: -34.5875,
    lng: -58.3974,
  },
  postalCode: "C1425",
  googleMapsLink: "https://maps.google.com/?q=Beruti+4540+CABA",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.123456789!2d-58.3974!3d-34.5875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb59c42ad921b%3A0x1234567890abcdef!2sBeruti+4540%2C+CABA!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar",
  address: "Beruti 4540, CABA",
  amenitiesDescription:
    "Ubicado en el corazón de Palermo, con excelente conectividad y acceso a todos los servicios de la zona.",
}

// Datos de apartamentos por piso
const piso1Data: BerutiFloor = {
  level: 1,
  name: "Piso 1",
  apartments: [
    {
      id: "101",
      unitNumber: "101",
      description: "3 DORMITORIOS",
      orientation: "CONTRAFRENTE 3 DOR",
      coveredArea: 114.0,
      balconArea: 4.05,
      terraceArea: 0.0,
      totalArea: 118.05,
      weightedArea: 118.05,
      amenitiesArea: 11.81,
      totalWithAmenities: 129.86,
      saleValue: 640900,
      pricePerM2: 4936,
      status: "DISPONIBLE",
      coordinates: "81,187,83,407,176,408,177,367,375,368,375,268,381,269,382,187",
      reserveAmount: 64090,
      downPayment: 192270,
      balance: 384540,
      monthlyPayment: 9614,
    },
    {
      id: "102",
      unitNumber: "102",
      description: "2 DORMITORIOS (ALL SUITES)",
      orientation: "CONTRAFRENTE 2 DOR",
      coveredArea: 86.4,
      balconArea: 8.25,
      terraceArea: 0.0,
      totalArea: 94.65,
      weightedArea: 94.65,
      amenitiesArea: 9.47,
      totalWithAmenities: 104.12,
      saleValue: 513900,
      pricePerM2: 4936,
      status: "DISPONIBLE",
      coordinates: "83,407,83,624,349,622,349,546,378,548,378,446,174,444,171,406",
      reserveAmount: 51390,
      downPayment: 154170,
      balance: 308340,
      monthlyPayment: 7709,
    },
    {
      id: "103",
      unitNumber: "103",
      description: "TOWN HOUSE - 3 Dormitorios c/Dep",
      orientation: "CONTRAFRENTE",
      coveredArea: 187.18,
      balconArea: 0.0,
      terraceArea: 83.64,
      totalArea: 270.82,
      weightedArea: 208.09,
      amenitiesArea: 16.65,
      totalWithAmenities: 224.74,
      saleValue: 823500,
      pricePerM2: 3664,
      status: "DISPONIBLE",
      coordinates: "378,546,418,547,418,621,623,622,622,447,376,446",
      reserveAmount: 82350,
      downPayment: 247050,
      balance: 494100,
      monthlyPayment: 12353,
    },
    {
      id: "104",
      unitNumber: "104",
      description: "TOWN HOUSE - 3 Dormitorios c/Dep",
      orientation: "CONTRAFRENTE",
      coveredArea: 181.04,
      balconArea: 0.0,
      terraceArea: 82.25,
      totalArea: 263.29,
      weightedArea: 201.6,
      amenitiesArea: 16.13,
      totalWithAmenities: 217.73,
      saleValue: 797800,
      pricePerM2: 3664,
      status: "VENDIDO",
      coordinates: "377,268,378,368,454,369,453,405,487,408,486,444,622,445,620,267",
      reserveAmount: 79780,
      downPayment: 239340,
      balance: 478680,
      monthlyPayment: 11967,
    },
  ],
}

const piso2Data: BerutiFloor = {
  level: 2,
  name: "Piso 2",
  apartments: [
    {
      id: "201",
      unitNumber: "201",
      description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
      orientation: "PASANTE DERECHO",
      coveredArea: 138.94,
      balconArea: 11.4,
      terraceArea: 12.31,
      totalArea: 162.65,
      weightedArea: 162.65,
      amenitiesArea: 16.26,
      totalWithAmenities: 181.51,
      saleValue: 921400,
      pricePerM2: 5076,
      status: "VENDIDO",
      coordinates: "147,86,147,384,276,387,276,335,548,333,550,200,556,199,556,86",
      reserveAmount: 92140,
      downPayment: 276420,
      balance: 552840,
      monthlyPayment: 13821,
    },
    {
      id: "202",
      unitNumber: "202",
      description: "3 DORMITORIOS C/PARRILLA",
      orientation: "PASANTE IZQUIERDO",
      coveredArea: 133.43,
      balconArea: 8.42,
      terraceArea: 17.32,
      totalArea: 159.17,
      weightedArea: 159.17,
      amenitiesArea: 15.92,
      totalWithAmenities: 175.09,
      saleValue: 888800,
      pricePerM2: 5076,
      status: "VENDIDO",
      coordinates: "146,387,147,683,426,684,426,576,660,574,657,389,593,389,592,433,271,436,270,389",
      reserveAmount: 88880,
      downPayment: 266640,
      balance: 533280,
      monthlyPayment: 13332,
    },
    {
      id: "203",
      unitNumber: "203",
      description: "2 DORMITORIOS (ALL SUITES)",
      orientation: "CONTRAFRENTE 2 DOR",
      coveredArea: 76.95,
      balconArea: 4.58,
      terraceArea: 0.0,
      totalArea: 81.53,
      weightedArea: 81.53,
      amenitiesArea: 8.15,
      totalWithAmenities: 89.68,
      saleValue: 455300,
      pricePerM2: 5077,
      status: "VENDIDO",
      coordinates: "605,576,605,684,889,685,889,441,659,441,658,574",
      reserveAmount: 45530,
      downPayment: 136590,
      balance: 273180,
      monthlyPayment: 6830,
    },
    {
      id: "204",
      unitNumber: "204",
      description: "2 DORMITORIOS (ALL SUITES)",
      orientation: "CONTRAFRENTE 2 DOR",
      coveredArea: 76.95,
      balconArea: 4.58,
      terraceArea: 0.0,
      totalArea: 81.53,
      weightedArea: 81.53,
      amenitiesArea: 8.15,
      totalWithAmenities: 89.68,
      saleValue: 455300,
      pricePerM2: 5077,
      status: "VENDIDO",
      coordinates: "891,192,888,436,657,435,658,336,551,338,551,200,556,202,556,191,702,194",
      reserveAmount: 45530,
      downPayment: 136590,
      balance: 273180,
      monthlyPayment: 6830,
    },
  ],
}

const piso3Data: BerutiFloor = {
  level: 3,
  name: "Piso 3",
  apartments: [
    {
      id: "301",
      unitNumber: "301",
      description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
      orientation: "PASANTE DERECHO",
      coveredArea: 146.46,
      balconArea: 20.79,
      terraceArea: 0.0,
      totalArea: 167.26,
      weightedArea: 167.26,
      amenitiesArea: 16.73,
      totalWithAmenities: 186.58,
      saleValue: 973400,
      pricePerM2: 5217,
      status: "VENDIDO",
      coordinates: "120,82,123,377,253,380,253,330,524,329,523,195,530,191,527,82",
      reserveAmount: 97340,
      downPayment: 292020,
      balance: 584040,
      monthlyPayment: 14601,
    },
    {
      id: "302",
      unitNumber: "302",
      description: "3 DORMITORIOS C/PARRILLA",
      orientation: "PASANTE IZQUIERDO",
      coveredArea: 133.43,
      balconArea: 8.42,
      terraceArea: 0.0,
      totalArea: 141.85,
      weightedArea: 141.85,
      amenitiesArea: 14.19,
      totalWithAmenities: 156.04,
      saleValue: 814100,
      pricePerM2: 5217,
      status: "VENDIDO",
      coordinates: "123,378,123,564,622,566,625,428,246,427,244,381",
      reserveAmount: 81410,
      downPayment: 244230,
      balance: 488460,
      monthlyPayment: 12212,
    },
    {
      id: "303",
      unitNumber: "303",
      description: "2 DORMITORIOS (ALL SUITES)",
      orientation: "CONTRAFRENTE 2 DOR",
      coveredArea: 77.27,
      balconArea: 4.26,
      terraceArea: 0.0,
      totalArea: 81.53,
      weightedArea: 81.53,
      amenitiesArea: 8.15,
      totalWithAmenities: 89.68,
      saleValue: 467900,
      pricePerM2: 5218,
      status: "VENDIDO",
      coordinates: "575,566,577,671,854,672,854,377,666,378,665,425,628,428,626,564",
      reserveAmount: 46790,
      downPayment: 140370,
      balance: 280740,
      monthlyPayment: 7019,
    },
    {
      id: "304",
      unitNumber: "304",
      description: "2 DORMITORIOS (ALL SUITES)",
      orientation: "CONTRAFRENTE 2 DOR",
      coveredArea: 77.27,
      balconArea: 4.26,
      terraceArea: 0.0,
      totalArea: 81.53,
      weightedArea: 81.53,
      amenitiesArea: 8.15,
      totalWithAmenities: 89.68,
      saleValue: 467900,
      pricePerM2: 5218,
      status: "VENDIDO",
      coordinates: "855,374,625,380,624,328,525,329,522,196,530,193,531,187,854,190",
      reserveAmount: 46790,
      downPayment: 140370,
      balance: 280740,
      monthlyPayment: 7019,
    },
  ],
}

// Función para generar datos de pisos 4-6 (mismo plano y paths)
const generateFloor4to6Data = (floorLevel: number): BerutiFloor => {
  const floorDataMap: Record<number, { apt1: number; apt2: number; apt3: number; pricePerM2: number }> = {
    4: { apt1: 999700, apt2: 836100, apt3: 480500, pricePerM2: 5358 },
    5: { apt1: 1026100, apt2: 858100, apt3: 493200, pricePerM2: 5499 },
    6: { apt1: 1052400, apt2: 880100, apt3: 505800, pricePerM2: 5640 },
  }

  const data = floorDataMap[floorLevel]

  return {
    level: floorLevel,
    name: `Piso ${floorLevel}`,
    apartments: [
      {
        id: `${floorLevel}01`,
        unitNumber: `${floorLevel}01`,
        description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
        orientation: "PASANTE DERECHO",
        coveredArea: 146.46,
        balconArea: 20.79,
        terraceArea: 0.0,
        totalArea: 167.26,
        weightedArea: 167.26,
        amenitiesArea: 16.73,
        totalWithAmenities: 186.58,
        saleValue: data.apt1,
        pricePerM2: data.pricePerM2,
        status: "VENDIDO",
        coordinates: "95,378,97,573,508,572,507,432,223,431,223,379,151,378",
        reserveAmount: Math.round(data.apt1 * 0.1),
        downPayment: Math.round(data.apt1 * 0.3),
        balance: Math.round(data.apt1 * 0.6),
        monthlyPayment: Math.round((data.apt1 * 0.6) / 40),
      },
      {
        id: `${floorLevel}02`,
        unitNumber: `${floorLevel}02`,
        description: "3 DORMITORIOS C/PARRILLA",
        orientation: "PASANTE IZQUIERDO",
        coveredArea: 133.43,
        balconArea: 8.42,
        terraceArea: 0.0,
        totalArea: 141.85,
        weightedArea: 141.85,
        amenitiesArea: 14.19,
        totalWithAmenities: 156.04,
        saleValue: data.apt2,
        pricePerM2: data.pricePerM2,
        status: floorLevel === 4 ? "DISPONIBLE" : "VENDIDO",
        coordinates: "96,76,96,378,226,379,226,328,505,329,506,190,512,189,513,77,252,78",
        reserveAmount: Math.round(data.apt2 * 0.1),
        downPayment: Math.round(data.apt2 * 0.3),
        balance: Math.round(data.apt2 * 0.6),
        monthlyPayment: Math.round((data.apt2 * 0.6) / 40),
      },
      {
        id: `${floorLevel}03`,
        unitNumber: `${floorLevel}03`,
        description: "2 DORMITORIOS (ALL SUITES)",
        orientation: "CONTRAFRENTE 2 DOR",
        coveredArea: 77.27,
        balconArea: 4.26,
        terraceArea: 0.0,
        totalArea: 81.53,
        weightedArea: 81.53,
        amenitiesArea: 8.15,
        totalWithAmenities: 89.68,
        saleValue: data.apt3,
        pricePerM2: data.pricePerM2,
        status: "VENDIDO",
        coordinates: "508,432,510,571,561,574,562,683,850,682,848,382,652,382,652,432",
        reserveAmount: Math.round(data.apt3 * 0.1),
        downPayment: Math.round(data.apt3 * 0.3),
        balance: Math.round(data.apt3 * 0.6),
        monthlyPayment: Math.round((data.apt3 * 0.6) / 40),
      },
    ],
  }
}

const piso7Data: BerutiFloor = {
  level: 7,
  name: "Piso 7",
  apartments: [
    {
      id: "701",
      unitNumber: "701",
      description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
      orientation: "PASANTE DERECHO",
      coveredArea: 146.46,
      balconArea: 20.79,
      terraceArea: 0.0,
      totalArea: 167.26,
      weightedArea: 167.26,
      amenitiesArea: 16.73,
      totalWithAmenities: 186.58,
      saleValue: 1083900,
      pricePerM2: 5809,
      status: "VENDIDO",
      coordinates: "109,387,242,389,240,334,521,334,520,194,528,190,524,84,109,82",
      reserveAmount: 108390,
      downPayment: 325170,
      balance: 650340,
      monthlyPayment: 16259,
    },
    {
      id: "702",
      unitNumber: "702",
      description: "3 DORMITORIOS C/PARRILLA",
      orientation: "PASANTE IZQUIERDO",
      coveredArea: 133.43,
      balconArea: 8.42,
      terraceArea: 0.0,
      totalArea: 141.85,
      weightedArea: 141.85,
      amenitiesArea: 14.19,
      totalWithAmenities: 156.04,
      saleValue: 906500,
      pricePerM2: 5809,
      status: "VENDIDO",
      coordinates: "109,388,111,575,627,576,626,437,236,435,237,388",
      reserveAmount: 90650,
      downPayment: 271950,
      balance: 543900,
      monthlyPayment: 13598,
    },
    {
      id: "703",
      unitNumber: "703",
      description: "2 DORMITORIOS (ALL SUITES)",
      orientation: "CONTRAFRENTE 2 DOR",
      coveredArea: 77.27,
      balconArea: 4.26,
      terraceArea: 0.0,
      totalArea: 81.53,
      weightedArea: 81.53,
      amenitiesArea: 8.15,
      totalWithAmenities: 89.68,
      saleValue: 521000,
      pricePerM2: 5810,
      status: "VENDIDO",
      coordinates: "627,436,628,575,862,574,860,384,859,193,527,191,523,197,520,389,626,386",
      reserveAmount: 52100,
      downPayment: 156300,
      balance: 312600,
      monthlyPayment: 7815,
    },
  ],
}

// Función para generar datos de pisos 8-9 (mismo plano y paths)
const generateFloor8to9Data = (floorLevel: number): BerutiFloor => {
  const floorDataMap: Record<number, { apt1: number; apt2: number; apt3: number; pricePerM2: number }> = {
    8: { apt1: 1115500, apt2: 932900, apt3: 536200, pricePerM2: 5979 },
    9: { apt1: 1145900, apt2: 959300, apt3: 551400, pricePerM2: 6148 },
  }

  const data = floorDataMap[floorLevel]

  return {
    level: floorLevel,
    name: `Piso ${floorLevel}`,
    apartments: [
      {
        id: `${floorLevel}01`,
        unitNumber: `${floorLevel}01`,
        description: "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA",
        orientation: "PASANTE DERECHO",
        coveredArea: floorLevel === 8 ? 146.46 : 142.44,
        balconArea: 20.79,
        terraceArea: floorLevel === 8 ? 0.0 : 3.84,
        totalArea: floorLevel === 8 ? 167.26 : 167.08,
        weightedArea: floorLevel === 8 ? 167.26 : 167.08,
        amenitiesArea: floorLevel === 8 ? 16.73 : 16.71,
        totalWithAmenities: floorLevel === 8 ? 186.58 : 186.39,
        saleValue: data.apt1,
        pricePerM2: data.pricePerM2,
        status: "VENDIDO",
        coordinates: "105,103,109,410,239,412,238,358,520,358,521,220,528,216,526,104",
        reserveAmount: Math.round(data.apt1 * 0.1),
        downPayment: Math.round(data.apt1 * 0.3),
        balance: Math.round(data.apt1 * 0.6),
        monthlyPayment: Math.round((data.apt1 * 0.6) / 40),
      },
      {
        id: `${floorLevel}02`,
        unitNumber: `${floorLevel}02`,
        description: "3 DORMITORIOS C/PARRILLA",
        orientation: "PASANTE IZQUIERDO",
        coveredArea: 133.43,
        balconArea: 8.42,
        terraceArea: 0.0,
        totalArea: 141.85,
        weightedArea: 141.85,
        amenitiesArea: 14.19,
        totalWithAmenities: 156.04,
        saleValue: data.apt2,
        pricePerM2: data.pricePerM2,
        status: "VENDIDO",
        coordinates: "108,411,106,605,521,602,519,464,234,460,234,413",
        reserveAmount: Math.round(data.apt2 * 0.1),
        downPayment: Math.round(data.apt2 * 0.3),
        balance: Math.round(data.apt2 * 0.6),
        monthlyPayment: Math.round((data.apt2 * 0.6) / 40),
      },
      {
        id: `${floorLevel}03`,
        unitNumber: `${floorLevel}03`,
        description: "2 DORMITORIOS (ALL SUITES)",
        orientation: "CONTRAFRENTE 2 DOR",
        coveredArea: 77.27,
        balconArea: 4.26,
        terraceArea: 0.0,
        totalArea: 81.53,
        weightedArea: 81.53,
        amenitiesArea: 8.15,
        totalWithAmenities: 89.68,
        saleValue: data.apt3,
        pricePerM2: data.pricePerM2,
        status: "VENDIDO",
        coordinates: "519,464,520,604,861,602,864,413,668,412,667,462",
        reserveAmount: Math.round(data.apt3 * 0.1),
        downPayment: Math.round(data.apt3 * 0.3),
        balance: Math.round(data.apt3 * 0.6),
        monthlyPayment: Math.round((data.apt3 * 0.6) / 40),
      },
    ],
  }
}

// Función para generar datos de pisos 10-14 (semi pisos)
const generateSemiFloorData = (floorLevel: number): BerutiFloor => {
  const baseData: Record<
    number,
    {
      apt1: { value: number; coveredArea: number; balconArea: number; terraceArea: number; totalArea: number }
      apt2: { value: number; coveredArea: number; balconArea: number; terraceArea: number; totalArea: number }
      pricePerM2: number
    }
  > = {
    10: {
      apt1: {
        value: 1147800,
        coveredArea: 138.18,
        balconArea: 20.79,
        terraceArea: 3.84,
        totalArea: 162.81,
      },
      apt2: {
        value: 985700,
        coveredArea: 133.43,
        balconArea: 8.42,
        terraceArea: 0.0,
        totalArea: 141.85,
      },
      pricePerM2: 6317,
    },
    11: {
      apt1: {
        value: 1494300,
        coveredArea: 147.79,
        balconArea: 24.86,
        terraceArea: 33.37,
        totalArea: 206.02,
      },
      apt2: {
        value: 1205000,
        coveredArea: 124.19,
        balconArea: 7.6,
        terraceArea: 37.1,
        totalArea: 168.89,
      },
      pricePerM2: 6486,
    },
    12: {
      apt1: {
        value: 1288500,
        coveredArea: 147.99,
        balconArea: 9.04,
        terraceArea: 15.55,
        totalArea: 172.58,
      },
      apt2: {
        value: 970300,
        coveredArea: 125.19,
        balconArea: 7.34,
        terraceArea: 0.0,
        totalArea: 132.53,
      },
      pricePerM2: 6655,
    },
    13: {
      apt1: {
        value: 1185000,
        coveredArea: 223.01,
        balconArea: 0.0,
        terraceArea: 25.45,
        totalArea: 248.46,
      },
      apt2: {
        value: 904900,
        coveredArea: 170.8,
        balconArea: 0.0,
        terraceArea: 18.93,
        totalArea: 189.73,
      },
      pricePerM2: 6825,
    },
    14: {
      apt1: {
        value: 1229100,
        coveredArea: 226.02,
        balconArea: 0.0,
        terraceArea: 25.8,
        totalArea: 251.82,
      },
      apt2: {
        value: 926000,
        coveredArea: 170.8,
        balconArea: 0.0,
        terraceArea: 18.93,
        totalArea: 189.73,
      },
      pricePerM2: 6993,
    },
  }

  const floorData = baseData[floorLevel]

  return {
    level: floorLevel,
    name: `Piso ${floorLevel}`,
    apartments: [
      {
        id: `${floorLevel}01`,
        unitNumber: `${floorLevel}01`,
        description:
          floorLevel === 10 ? "3 DORMITORIOS C/PALIER PRIV - C/PARRILLA" : "3 DORMITORIOS C/PALIER PRIV C/PARRILLA",
        orientation: floorLevel === 10 ? "PASANTE DERECHO" : floorLevel === 11 ? "FRENTE" : "FRENTE",
        coveredArea: floorData.apt1.coveredArea,
        balconArea: floorData.apt1.balconArea,
        terraceArea: floorData.apt1.terraceArea,
        totalArea: floorData.apt1.totalArea,
        weightedArea: floorData.apt1.totalArea,
        amenitiesArea: Math.round(floorData.apt1.totalArea * 0.1 * 100) / 100,
        totalWithAmenities: Math.round(floorData.apt1.totalArea * 1.1 * 100) / 100,
        saleValue: floorData.apt1.value,
        pricePerM2: floorData.pricePerM2,
        status: "VENDIDO",
        coordinates: "100,421,232,423,233,371,632,369,634,421,874,422,873,223,526,220,526,110,100,113",
        reserveAmount: Math.round(floorData.apt1.value * 0.1),
        downPayment: Math.round(floorData.apt1.value * 0.3),
        balance: Math.round(floorData.apt1.value * 0.6),
        monthlyPayment: Math.round((floorData.apt1.value * 0.6) / 40),
      },
      {
        id: `${floorLevel}02`,
        unitNumber: `${floorLevel}02`,
        description: floorLevel === 10 ? "3 DORMITORIOS C/PARRILLA" : "3 DORMITORIOS C/PARRILLA",
        orientation: floorLevel === 10 ? "PASANTE IZQUIERDO" : "CONTRAFRENTE",
        coveredArea: floorData.apt2.coveredArea,
        balconArea: floorData.apt2.balconArea,
        terraceArea: floorData.apt2.terraceArea,
        totalArea: floorData.apt2.totalArea,
        weightedArea: floorData.apt2.totalArea,
        amenitiesArea: Math.round(floorData.apt2.totalArea * 0.1 * 100) / 100,
        totalWithAmenities: Math.round(floorData.apt2.totalArea * 1.1 * 100) / 100,
        saleValue: floorData.apt2.value,
        pricePerM2: floorData.pricePerM2,
        status: floorLevel === 10 || floorLevel === 12 ? "DISPONIBLE" : "VENDIDO",
        coordinates: "99,423,100,616,872,618,874,426,632,426,630,476,226,473,225,425",
        reserveAmount: Math.round(floorData.apt2.value * 0.1),
        downPayment: Math.round(floorData.apt2.value * 0.3),
        balance: Math.round(floorData.apt2.value * 0.6),
        monthlyPayment: Math.round((floorData.apt2.value * 0.6) / 40),
      },
    ],
  }
}

// Generar todos los pisos
export const berutiFloorsData: BerutiFloor[] = [
  piso1Data,
  piso2Data,
  piso3Data,
  generateFloor4to6Data(4),
  generateFloor4to6Data(5),
  generateFloor4to6Data(6),
  piso7Data,
  generateFloor8to9Data(8),
  generateFloor8to9Data(9),
  generateSemiFloorData(10),
  generateSemiFloorData(11),
  generateSemiFloorData(12),
  generateSemiFloorData(13), // Keeping original values for 13 and 14 as updates were only for 10-12
  generateSemiFloorData(14), // Keeping original values for 13 and 14 as updates were only for 10-12
]

// Configuración de planos por piso
export const berutiFloorPlans = {
  1: "/planos/beruti/pisos/piso1.png",
  2: "/planos/beruti/pisos/piso2.png",
  3: "/planos/beruti/pisos/piso3.png",
  4: "/planos/beruti/pisos/piso4-6.png",
  5: "/planos/beruti/pisos/piso4-6.png",
  6: "/planos/beruti/pisos/piso4-6.png",
  7: "/planos/beruti/pisos/piso7.png",
  8: "/planos/beruti/pisos/piso8-9.png",
  9: "/planos/beruti/pisos/piso8-9.png",
  10: "/planos/beruti/pisos/piso10.png",
  11: "/planos/beruti/pisos/piso11.png",
  12: "/planos/beruti/pisos/piso12.png",
  13: "/planos/beruti/pisos/piso13.png",
  14: "/planos/beruti/pisos/piso14.png",
}

// Cocheras
export const berutiParkingSpots: BerutiParkingSpot[] = [
  // Nivel 1 (1er subsuelo) - 17 cocheras
  {
    id: "A1",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "126,519,178,628",
  },
  {
    id: "A2",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "188,520,238,625",
  },
  {
    id: "A3",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "248,521,300,626",
  },
  {
    id: "A4",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "307,520,360,626",
  },
  {
    id: "A5",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "364,520,414,625",
  },
  {
    id: "A6",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "422,519,475,625",
  },
  {
    id: "A7",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "483,519,536,626",
  },
  {
    id: "A8",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "539,520,590,627",
  },
  {
    id: "A9",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "599,521,651,626",
  },
  {
    id: "A10",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "660,518,713,627",
  },
  {
    id: "A11",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "720,518,772,626",
  },
  {
    id: "A12",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "775,519,828,625",
  },
  {
    id: "A13",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "831,518,884,624",
  },
  {
    id: "A14",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "793,303,846,411",
  },
  {
    id: "A15",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "569,326,676,376",
  },
  {
    id: "A16",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "568,249,676,300",
  },
  {
    id: "A17",
    level: 1 as BerutiGarageLevel,
    type: "A" as const,
    price: 60000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "785,162,892,212",
  },

  // Nivel 2 (2do subsuelo) - 16 cocheras
  {
    id: "A18",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "114,534,167,639",
  },
  {
    id: "A19",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "175,532,228,639",
  },
  {
    id: "A20",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "238,532,289,639",
  },
  {
    id: "A21",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "297,533,349,639",
  },
  {
    id: "A22",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "351,533,403,639",
  },
  {
    id: "A23",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "412,532,464,639",
  },
  {
    id: "A24",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "473,532,525,640",
  },
  {
    id: "A25",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "526,533,578,640",
  },
  {
    id: "A26",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "586,534,639,639",
  },
  {
    id: "A27",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "650,533,699,640",
  },
  {
    id: "A28",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "708,534,761,638",
  },
  {
    id: "A29",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "764,534,814,639",
  },
  {
    id: "A30",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "818,533,871,640",
  },
  {
    id: "A31",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "781,317,833,426",
  },
  {
    id: "A32",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "605,316,657,426",
  },
  {
    id: "A33",
    level: 2 as BerutiGarageLevel,
    type: "B" as const,
    price: 50000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "772,178,877,229",
  },

  // Nivel 3 (3er subsuelo) - 18 cocheras
  {
    id: "A34",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "111,420,220,470",
  },
  {
    id: "A35",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "113,473,219,521",
  },
  {
    id: "A36",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "247,524,299,628",
  },
  {
    id: "A37",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "307,524,358,627",
  },
  {
    id: "A38",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "360,524,413,628",
  },
  {
    id: "A39",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "421,523,472,629",
  },
  {
    id: "A40",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "482,524,531,629",
  },
  {
    id: "A41",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "534,525,585,628",
  },
  {
    id: "A42",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "594,524,646,629",
  },
  {
    id: "A43",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "653,523,706,629",
  },
  {
    id: "A44",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "714,524,764,628",
  },
  {
    id: "A45",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "768,524,818,629",
  },
  {
    id: "A46",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "822,524,873,628",
  },
  {
    id: "A47",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "786,311,837,418",
  },
  {
    id: "A48",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "611,312,663,417",
  },
  {
    id: "A49",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "552,312,604,417",
  },
  {
    id: "A50",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "552,259,666,310",
  },
  {
    id: "A51",
    level: 3 as BerutiGarageLevel,
    type: "C" as const,
    price: 45000,
    status: "DISPONIBLE" as BerutiApartmentStatus,
    assignedTo: null,
    coordinates: "777,172,881,223",
  },
]

// Funciones helper
export const getBerutiStatusColor = (status: BerutiApartmentStatus): string => {
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

export const getBerutiStatusLabel = (status: BerutiApartmentStatus): string => {
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
      return status
  }
}

export const formatBerutiPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export const formatBerutiArea = (area: number): string => {
  return `${area.toFixed(1)} m²`
}

// Función para obtener estadísticas del proyecto
export const getBerutiProjectStats = () => {
  const allApartments = berutiFloorsData.flatMap((floor) => floor.apartments)

  const totalUnits = allApartments.length
  const availableUnits = allApartments.filter((apt) => apt.status === "DISPONIBLE").length
  const soldUnits = allApartments.filter((apt) => apt.status === "VENDIDO").length
  const reservedUnits = allApartments.filter((apt) => apt.status === "RESERVADO").length
  const blockedUnits = allApartments.filter((apt) => apt.status === "BLOQUEADO").length

  return {
    totalUnits,
    availableUnits,
    soldUnits,
    reservedUnits,
    blockedUnits,
    occupancyRate: Math.round(((soldUnits + reservedUnits) / totalUnits) * 100),
  }
}

// Función para obtener apartamento por ID
export const getBerutiApartmentById = (id: string): BerutiApartment | null => {
  for (const floor of berutiFloorsData) {
    const apartment = floor.apartments.find((apt) => apt.id === id)
    if (apartment) return apartment
  }
  return null
}

export const updateBerutiApartmentStatus = (id: string, newStatus: BerutiApartmentStatus): boolean => {
  for (const floor of berutiFloorsData) {
    const aptIndex = floor.apartments.findIndex((apt) => apt.id === id)
    if (aptIndex !== -1) {
      floor.apartments[aptIndex].status = newStatus
      return true
    }
  }
  return false
}

export const getBerutiApartmentStatusWithOverride = (
  id: string,
  statusOverrides: { [key: string]: { status: BerutiApartmentStatus } },
): BerutiApartmentStatus | null => {
  const apartment = getBerutiApartmentById(id)
  if (!apartment) return null

  // Verificar si hay un override del backend
  const override = statusOverrides[apartment.unitNumber]
  if (override && override.status) {
    return override.status
  }

  return apartment.status
}

export const getBerutiProjectStatsWithOverrides = (statusOverrides: {
  [key: string]: { status: BerutiApartmentStatus }
}): {
  totalUnits: number
  availableUnits: number
  reservedUnits: number
  soldUnits: number
  blockedUnits: number
} => {
  let totalUnits = 0
  let availableUnits = 0
  let reservedUnits = 0
  let soldUnits = 0
  let blockedUnits = 0

  berutiFloorsData.forEach((floor) => {
    floor.apartments.forEach((apt) => {
      totalUnits++
      // Obtener estado del backend si existe, si no usar el estático
      const override = statusOverrides[apt.unitNumber]
      const currentStatus = override?.status || apt.status

      switch (currentStatus) {
        case "DISPONIBLE":
          availableUnits++
          break
        case "RESERVADO":
          reservedUnits++
          break
        case "VENDIDO":
          soldUnits++
          break
        case "BLOQUEADO":
          blockedUnits++
          break
      }
    })
  })

  return { totalUnits, availableUnits, reservedUnits, soldUnits, blockedUnits }
}

// Función para obtener datos del piso
export const getBerutiFloorData = (floorNumber: number): BerutiFloor | null => {
  return berutiFloorsData.find((floor) => floor.level === floorNumber) || null
}

// Función para obtener plano del piso
export const getBerutiFloorPlan = (floorNumber: number): string | null => {
  return berutiFloorPlans[floorNumber as keyof typeof berutiFloorPlans] || null
}
