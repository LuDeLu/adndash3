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
  image: "/images/edificio/beruti.png",
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
      description: "3 DORMITORIOS CON DEPENDENCIA",
      orientation: "FRENTE",
      coveredArea: 147.62,
      balconArea: 10.02,
      terraceArea: 0.0,
      totalArea: 157.63,
      weightedArea: 157.63,
      amenitiesArea: 12.61,
      totalWithAmenities: 170.24,
      saleValue: 623800,
      pricePerM2: 3664,
      status: "VENDIDO",
      coordinates: "81,187,83,407,176,408,177,367,375,368,375,268,381,269,382,187",
      reserveAmount: 62380,
      downPayment: 187140,
      balance: 374280,
      monthlyPayment: 9357,
    },
    {
      id: "102",
      unitNumber: "102",
      description: "3 DORMITORIOS",
      orientation: "FRENTE",
      coveredArea: 128.5,
      balconArea: 9.91,
      terraceArea: 11.92,
      totalArea: 150.34,
      weightedArea: 150.34,
      amenitiesArea: 12.03,
      totalWithAmenities: 162.36,
      saleValue: 595000,
      pricePerM2: 3665,
      status: "DISPONIBLE",
      coordinates: "83,407,83,624,349,622,349,546,378,548,378,446,174,444,171,406",
      reserveAmount: 59500,
      downPayment: 178500,
      balance: 357000,
      monthlyPayment: 8925,
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
      description: "3 DORMITORIOS CON DEPENDENCIA",
      orientation: "FRENTE",
      coveredArea: 147.44,
      balconArea: 10.02,
      terraceArea: 0.0,
      totalArea: 157.45,
      weightedArea: 157.45,
      amenitiesArea: 12.6,
      totalWithAmenities: 170.05,
      saleValue: 635700,
      pricePerM2: 3738,
      status: "VENDIDO",
      coordinates: "147,86,147,384,276,387,276,335,548,333,550,200,556,199,556,86",
      reserveAmount: 63570,
      downPayment: 190710,
      balance: 381420,
      monthlyPayment: 9536,
    },
    {
      id: "202",
      unitNumber: "202",
      description: "3 DORMITORIOS CON DEPENDENCIA",
      orientation: "FRENTE",
      coveredArea: 153.13,
      balconArea: 9.91,
      terraceArea: 0.0,
      totalArea: 163.05,
      weightedArea: 163.05,
      amenitiesArea: 13.04,
      totalWithAmenities: 176.09,
      saleValue: 658300,
      pricePerM2: 3738,
      status: "DISPONIBLE",
      coordinates: "146,387,147,683,426,684,426,576,660,574,657,389,593,389,592,433,271,436,270,389",
      reserveAmount: 65830,
      downPayment: 197490,
      balance: 394980,
      monthlyPayment: 9875,
    },
    {
      id: "203",
      unitNumber: "203",
      description: "2 DORMITORIOS",
      orientation: "CONTRAFRENTE",
      coveredArea: 101.31,
      balconArea: 10.28,
      terraceArea: 0.0,
      totalArea: 111.6,
      weightedArea: 111.6,
      amenitiesArea: 8.93,
      totalWithAmenities: 120.53,
      saleValue: 459500,
      pricePerM2: 3812,
      status: "VENDIDO",
      coordinates: "605,576,605,684,889,685,889,441,659,441,658,574",
      reserveAmount: 45950,
      downPayment: 137850,
      balance: 275700,
      monthlyPayment: 6893,
    },
    {
      id: "204",
      unitNumber: "204",
      description: "2 DORMITORIOS",
      orientation: "CONTRAFRENTE",
      coveredArea: 80.06,
      balconArea: 10.19,
      terraceArea: 0.0,
      totalArea: 90.25,
      weightedArea: 90.25,
      amenitiesArea: 7.22,
      totalWithAmenities: 97.47,
      saleValue: 371600,
      pricePerM2: 3813,
      status: "VENDIDO",
      coordinates: "891,192,888,436,657,435,658,336,551,338,551,200,556,202,556,191,702,194",
      reserveAmount: 37160,
      downPayment: 111480,
      balance: 222960,
      monthlyPayment: 5574,
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
      description: "3 DORMITORIOS CON DEPENDENCIA",
      orientation: "FRENTE",
      coveredArea: 147.69,
      balconArea: 10.02,
      terraceArea: 0.0,
      totalArea: 157.71,
      weightedArea: 157.71,
      amenitiesArea: 12.62,
      totalWithAmenities: 170.32,
      saleValue: 649300,
      pricePerM2: 3812,
      status: "DISPONIBLE",
      coordinates: "120,82,123,377,253,380,253,330,524,329,523,195,530,191,527,82",
      reserveAmount: 64930,
      downPayment: 194790,
      balance: 389580,
      monthlyPayment: 9740,
    },
    {
      id: "302",
      unitNumber: "302",
      description: "3 DORMITORIOS",
      orientation: "FRENTE",
      coveredArea: 107.59,
      balconArea: 9.91,
      terraceArea: 39.1,
      totalArea: 156.6,
      weightedArea: 137.05,
      amenitiesArea: 10.96,
      totalWithAmenities: 148.01,
      saleValue: 564300,
      pricePerM2: 3813,
      status: "DISPONIBLE",
      coordinates: "123,378,123,564,622,566,625,428,246,427,244,381",
      reserveAmount: 56430,
      downPayment: 169290,
      balance: 338580,
      monthlyPayment: 8465,
    },
    {
      id: "303",
      unitNumber: "303",
      description: "2 DORMITORIOS",
      orientation: "CONTRAFRENTE",
      coveredArea: 101.31,
      balconArea: 10.28,
      terraceArea: 0.0,
      totalArea: 111.6,
      weightedArea: 111.6,
      amenitiesArea: 8.93,
      totalWithAmenities: 120.53,
      saleValue: 459500,
      pricePerM2: 3812,
      status: "VENDIDO",
      coordinates: "575,566,577,671,854,672,854,377,666,378,665,425,628,428,626,564",
      reserveAmount: 45950,
      downPayment: 137850,
      balance: 275700,
      monthlyPayment: 6893,
    },
    {
      id: "304",
      unitNumber: "304",
      description: "2 DORMITORIOS",
      orientation: "CONTRAFRENTE",
      coveredArea: 80.06,
      balconArea: 10.19,
      terraceArea: 0.0,
      totalArea: 90.25,
      weightedArea: 90.25,
      amenitiesArea: 7.22,
      totalWithAmenities: 97.47,
      saleValue: 371600,
      pricePerM2: 3813,
      status: "VENDIDO",
      coordinates: "855,374,625,380,624,328,525,329,522,196,530,193,531,187,854,190",
      reserveAmount: 37160,
      downPayment: 111480,
      balance: 222960,
      monthlyPayment: 5574,
    },
  ],
}

// Función para generar datos de pisos 4-6 (mismo plano y paths)
const generateFloor4to6Data = (floorLevel: number): BerutiFloor => {
  const priceMultiplier = 1 + (floorLevel - 4) * 0.02 // Incremento del 2% por piso

  return {
    level: floorLevel,
    name: `Piso ${floorLevel}`,
    apartments: [
      {
        id: `${floorLevel}01`,
        unitNumber: `${floorLevel}01`,
        description: "3 DORMITORIOS CON DEPENDENCIA",
        orientation: "FRENTE",
        coveredArea: 147.56,
        balconArea: 10.02,
        terraceArea: 0.0,
        totalArea: 157.58,
        weightedArea: 157.58,
        amenitiesArea: 12.61,
        totalWithAmenities: 170.19,
        saleValue: Math.round((floorLevel === 4 ? 661400 : floorLevel === 5 ? 674000 : 686600) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 4 ? 3886 : floorLevel === 5 ? 3960 : 4034) * priceMultiplier),
        status: floorLevel === 4 || floorLevel === 5 || floorLevel === 6 ? "VENDIDO" : "DISPONIBLE",
        coordinates: "95,378,97,573,508,572,507,432,223,431,223,379,151,378",
        reserveAmount: Math.round((floorLevel === 4 ? 66140 : floorLevel === 5 ? 67400 : 68660) * priceMultiplier),
        downPayment: Math.round((floorLevel === 4 ? 198420 : floorLevel === 5 ? 202200 : 205980) * priceMultiplier),
        balance: Math.round((floorLevel === 4 ? 396840 : floorLevel === 5 ? 404400 : 411960) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 4 ? 9921 : floorLevel === 5 ? 10110 : 10299) * priceMultiplier),
      },
      {
        id: `${floorLevel}02`,
        unitNumber: `${floorLevel}02`,
        description: "2 DORMITORIOS",
        orientation: "FRENTE",
        coveredArea: 87.48,
        balconArea: 9.91,
        terraceArea: 0.0,
        totalArea: 97.4,
        weightedArea: 97.4,
        amenitiesArea: 7.79,
        totalWithAmenities: 105.19,
        saleValue: Math.round((floorLevel === 4 ? 408800 : floorLevel === 5 ? 416500 : 424300) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 4 ? 3886 : floorLevel === 5 ? 3960 : 4035) * priceMultiplier),
        status: "DISPONIBLE",
        coordinates: "96,76,96,378,226,379,226,328,505,329,506,190,512,189,513,77,252,78",
        reserveAmount: Math.round((floorLevel === 4 ? 40880 : floorLevel === 5 ? 41650 : 42430) * priceMultiplier),
        downPayment: Math.round((floorLevel === 4 ? 122640 : floorLevel === 5 ? 124950 : 127290) * priceMultiplier),
        balance: Math.round((floorLevel === 4 ? 245280 : floorLevel === 5 ? 249900 : 254580) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 4 ? 6132 : floorLevel === 5 ? 6248 : 6365) * priceMultiplier),
      },
      {
        id: `${floorLevel}03`,
        unitNumber: `${floorLevel}03`,
        description: "3 DORMITORIOS",
        orientation: "CONTRAFRENTE",
        coveredArea: 121.73,
        balconArea: 10.28,
        terraceArea: 0.0,
        totalArea: 132.01,
        weightedArea: 132.01,
        amenitiesArea: 10.56,
        totalWithAmenities: 142.58,
        saleValue: Math.round((floorLevel === 4 ? 554100 : floorLevel === 5 ? 564700 : 575200) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 4 ? 3886 : floorLevel === 5 ? 3961 : 4034) * priceMultiplier),
        status: "DISPONIBLE",
        coordinates: "508,432,510,571,561,574,562,683,850,682,848,382,652,382,652,432",
        reserveAmount: Math.round((floorLevel === 4 ? 55410 : floorLevel === 5 ? 56470 : 57520) * priceMultiplier),
        downPayment: Math.round((floorLevel === 4 ? 166230 : floorLevel === 5 ? 169410 : 172560) * priceMultiplier),
        balance: Math.round((floorLevel === 4 ? 332460 : floorLevel === 5 ? 338820 : 345120) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 4 ? 8312 : floorLevel === 5 ? 8471 : 8628) * priceMultiplier),
      },
      {
        id: `${floorLevel}04`,
        unitNumber: `${floorLevel}04`,
        description: "2 DORMITORIOS",
        orientation: "CONTRAFRENTE",
        coveredArea: 79.99,
        balconArea: 10.19,
        terraceArea: 0.0,
        totalArea: 90.17,
        weightedArea: 90.17,
        amenitiesArea: 7.21,
        totalWithAmenities: 97.39,
        saleValue: Math.round((floorLevel === 4 ? 378500 : floorLevel === 5 ? 385700 : 392900) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 4 ? 3887 : floorLevel === 5 ? 3960 : 4034) * priceMultiplier),
        status: floorLevel === 5 || floorLevel === 6 ? "VENDIDO" : "DISPONIBLE",
        coordinates: "506,329,612,327,613,379,848,381,845,190,515,185,513,192,506,192",
        reserveAmount: Math.round((floorLevel === 4 ? 37850 : floorLevel === 5 ? 38570 : 39290) * priceMultiplier),
        downPayment: Math.round((floorLevel === 4 ? 113550 : floorLevel === 5 ? 115710 : 117870) * priceMultiplier),
        balance: Math.round((floorLevel === 4 ? 227100 : floorLevel === 5 ? 231420 : 235740) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 4 ? 5678 : floorLevel === 5 ? 5786 : 5894) * priceMultiplier),
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
      description: "3 DORMITORIOS CON DEPENDENCIA",
      orientation: "FRENTE",
      coveredArea: 147.56,
      balconArea: 10.02,
      terraceArea: 0.0,
      totalArea: 157.58,
      weightedArea: 157.58,
      amenitiesArea: 12.61,
      totalWithAmenities: 170.19,
      saleValue: 699200,
      pricePerM2: 4108,
      status: "DISPONIBLE",
      coordinates: "109,387,242,389,240,334,521,334,520,194,528,190,524,84,109,82",
      reserveAmount: 69920,
      downPayment: 209760,
      balance: 419520,
      monthlyPayment: 10488,
    },
    {
      id: "702",
      unitNumber: "702",
      description: "3 DORMITORIOS",
      orientation: "FRENTE",
      coveredArea: 107.74,
      balconArea: 9.91,
      terraceArea: 0.0,
      totalArea: 117.66,
      weightedArea: 117.66,
      amenitiesArea: 9.41,
      totalWithAmenities: 127.07,
      saleValue: 522100,
      pricePerM2: 4109,
      status: "VENDIDO",
      coordinates: "109,388,111,575,627,576,626,437,236,435,237,388",
      reserveAmount: 52210,
      downPayment: 156630,
      balance: 313260,
      monthlyPayment: 7832,
    },
    {
      id: "703",
      unitNumber: "703",
      description: "3 DORMITORIOS CON DEPENDENCIA",
      orientation: "CONTRAFRENTE",
      coveredArea: 144.62,
      balconArea: 20.47,
      terraceArea: 42.05,
      totalArea: 207.14,
      weightedArea: 186.12,
      amenitiesArea: 14.89,
      totalWithAmenities: 201.01,
      saleValue: 825800,
      pricePerM2: 4108,
      status: "DISPONIBLE",
      coordinates: "627,436,628,575,862,574,860,384,859,193,527,191,523,197,520,389,626,386",
      reserveAmount: 82580,
      downPayment: 247740,
      balance: 495480,
      monthlyPayment: 12387,
    },
  ],
}

// Función para generar datos de pisos 8-9 (mismo plano y paths)
const generateFloor8to9Data = (floorLevel: number): BerutiFloor => {
  const priceMultiplier = 1 + (floorLevel - 8) * 0.025 // Incremento del 2.5% por piso

  return {
    level: floorLevel,
    name: `Piso ${floorLevel}`,
    apartments: [
      {
        id: `${floorLevel}01`,
        unitNumber: `${floorLevel}01`,
        description: "3 DORMITORIOS CON DEPENDENCIA",
        orientation: "FRENTE",
        coveredArea: 147.54,
        balconArea: 10.02,
        terraceArea: 0.0,
        totalArea: 157.56,
        weightedArea: 157.56,
        amenitiesArea: 12.6,
        totalWithAmenities: 170.16,
        saleValue: Math.round((floorLevel === 8 ? 716600 : 734000) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 8 ? 4211 : 4313) * priceMultiplier),
        status: floorLevel === 8 ? "VENDIDO" : "DISPONIBLE",
        coordinates: "105,103,109,410,239,412,238,358,520,358,521,220,528,216,526,104",
        reserveAmount: Math.round((floorLevel === 8 ? 71660 : 73400) * priceMultiplier),
        downPayment: Math.round((floorLevel === 8 ? 214980 : 220200) * priceMultiplier),
        balance: Math.round((floorLevel === 8 ? 429960 : 440400) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 8 ? 10749 : 11010) * priceMultiplier),
      },
      {
        id: `${floorLevel}02`,
        unitNumber: `${floorLevel}02`,
        description: "2 DORMITORIOS",
        orientation: "FRENTE",
        coveredArea: 87.46,
        balconArea: 9.91,
        terraceArea: 0.0,
        totalArea: 97.38,
        weightedArea: 97.38,
        amenitiesArea: 7.79,
        totalWithAmenities: 105.17,
        saleValue: Math.round((floorLevel === 8 ? 442900 : 453600) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 8 ? 4211 : 4313) * priceMultiplier),
        status: floorLevel === 9 ? "VENDIDO" : "DISPONIBLE",
        coordinates: "108,411,106,605,521,602,519,464,234,460,234,413",
        reserveAmount: Math.round((floorLevel === 8 ? 44290 : 45360) * priceMultiplier),
        downPayment: Math.round((floorLevel === 8 ? 132870 : 136080) * priceMultiplier),
        balance: Math.round((floorLevel === 8 ? 265740 : 272160) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 8 ? 6644 : 6804) * priceMultiplier),
      },
      {
        id: `${floorLevel}03`,
        unitNumber: `${floorLevel}03`,
        description: "2 DORMITORIOS",
        orientation: "CONTRAFRENTE",
        coveredArea: 78.33,
        balconArea: 10.28,
        terraceArea: 0.0,
        totalArea: 88.62,
        weightedArea: 88.62,
        amenitiesArea: 7.09,
        totalWithAmenities: 95.71,
        saleValue: Math.round((floorLevel === 8 ? 403100 : 412800) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 8 ? 4212 : 4313) * priceMultiplier),
        status: floorLevel === 9 ? "VENDIDO" : "DISPONIBLE",
        coordinates: "519,464,520,604,861,602,864,413,668,412,667,462",
        reserveAmount: Math.round((floorLevel === 8 ? 40310 : 41280) * priceMultiplier),
        downPayment: Math.round((floorLevel === 8 ? 120930 : 123840) * priceMultiplier),
        balance: Math.round((floorLevel === 8 ? 241860 : 247680) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 8 ? 6047 : 6192) * priceMultiplier),
      },
      {
        id: `${floorLevel}04`,
        unitNumber: `${floorLevel}04`,
        description: "2 DORMITORIOS",
        orientation: "CONTRAFRENTE",
        coveredArea: 80.0,
        balconArea: 10.19,
        terraceArea: 0.0,
        totalArea: 90.18,
        weightedArea: 90.18,
        amenitiesArea: 7.21,
        totalWithAmenities: 97.4,
        saleValue: Math.round((floorLevel === 8 ? 410200 : 420100) * priceMultiplier),
        pricePerM2: Math.round((floorLevel === 8 ? 4212 : 4313) * priceMultiplier),
        status: "DISPONIBLE",
        coordinates: "529,212,529,218,522,220,522,356,627,357,629,413,865,411,862,215",
        reserveAmount: Math.round((floorLevel === 8 ? 41020 : 42010) * priceMultiplier),
        downPayment: Math.round((floorLevel === 8 ? 123060 : 126030) * priceMultiplier),
        balance: Math.round((floorLevel === 8 ? 246120 : 252060) * priceMultiplier),
        monthlyPayment: Math.round((floorLevel === 8 ? 6153 : 6302) * priceMultiplier),
      },
    ],
  }
}

// Función para generar datos de pisos 10-14 (semi pisos)
const generateSemiFloorData = (floorLevel: number): BerutiFloor => {
  const baseData = {
    10: { apt1: { value: 1185000, area: 248.46 }, apt2: { value: 904900, area: 189.73 } },
    11: { apt1: { value: 1229100, area: 251.82 }, apt2: { value: 926000, area: 189.73 } },
    12: { apt1: { value: 1216100, area: 243.61 }, apt2: { value: 947400, area: 189.79 } },
    13: { apt1: { value: 1063500, area: 230.92 }, apt2: { value: 980700, area: 192.21 } },
    14: { apt1: { value: 1680600, area: 339.04 }, apt2: { value: 1707900, area: 344.33 } },
  }

  const floorData = baseData[floorLevel as keyof typeof baseData]
  const pricePerM2 =
    floorLevel === 14 ? 4827 : floorLevel === 13 ? 4724 : floorLevel === 12 ? 4622 : floorLevel === 11 ? 4519 : 4416

  return {
    level: floorLevel,
    name: `Piso ${floorLevel}`,
    apartments: [
      {
        id: `${floorLevel}01`,
        unitNumber: `${floorLevel}01`,
        description: floorLevel === 14 ? "PENTHOUSE - 3 Dormitorios c/Dep" : "SEMI PISO 3 DORM C/DEP",
        orientation: "SEMIPISO",
        coveredArea:
          floorLevel === 14
            ? 172.28
            : floorLevel === 13
              ? 165.76
              : floorLevel === 12
                ? 215.75
                : floorLevel === 11
                  ? 224.12
                  : 228.26,
        balconArea: floorLevel === 14 ? 0.0 : 20.21,
        terraceArea:
          floorLevel === 14
            ? 166.76
            : floorLevel === 13
              ? 44.95
              : floorLevel === 12
                ? 7.66
                : floorLevel === 11
                  ? 7.5
                  : 0.0,
        totalArea: floorData.apt1.area,
        weightedArea:
          floorLevel === 14
            ? 322.36
            : floorLevel === 13
              ? 208.44
              : floorLevel === 12
                ? 243.61
                : floorLevel === 11
                  ? 251.82
                  : 248.46,
        amenitiesArea:
          floorLevel === 14
            ? 25.79
            : floorLevel === 13
              ? 16.68
              : floorLevel === 12
                ? 19.49
                : floorLevel === 11
                  ? 20.15
                  : 19.88,
        totalWithAmenities:
          floorLevel === 14
            ? 348.15
            : floorLevel === 13
              ? 225.11
              : floorLevel === 12
                ? 263.1
                : floorLevel === 11
                  ? 271.97
                  : 268.34,
        saleValue: floorData.apt1.value,
        pricePerM2: pricePerM2,
        status:
          floorLevel === 10 || floorLevel === 12 || floorLevel === 13 || floorLevel === 14 ? "VENDIDO" : "DISPONIBLE",
        coordinates: "100,421,232,423,233,371,632,369,634,421,874,422,873,223,526,220,526,110,100,113",
        reserveAmount: Math.round(floorData.apt1.value * 0.1),
        downPayment: Math.round(floorData.apt1.value * 0.3),
        balance: Math.round(floorData.apt1.value * 0.6),
        monthlyPayment: Math.round((floorData.apt1.value * 0.6) / 40),
      },
      {
        id: `${floorLevel}02`,
        unitNumber: `${floorLevel}02`,
        description: floorLevel === 14 ? "PENTHOUSE - 3 Dormitorios c/Dep" : "SEMI PISO 3 DORM C/DEP",
        orientation: "SEMIPISO",
        coveredArea: floorLevel === 14 ? 177.12 : floorLevel === 13 ? 172.02 : floorLevel === 12 ? 169.59 : 169.54,
        balconArea: floorLevel === 14 ? 0.0 : 20.2,
        terraceArea: floorLevel === 14 ? 167.21 : 0.0,
        totalArea: floorData.apt2.area,
        weightedArea: floorLevel === 14 ? 327.6 : floorLevel === 13 ? 192.21 : floorLevel === 12 ? 189.79 : 189.73,
        amenitiesArea: floorLevel === 14 ? 26.21 : floorLevel === 13 ? 15.38 : floorLevel === 12 ? 15.18 : 15.18,
        totalWithAmenities:
          floorLevel === 14 ? 353.81 : floorLevel === 13 ? 207.59 : floorLevel === 12 ? 204.97 : 204.91,
        saleValue: floorData.apt2.value,
        pricePerM2: pricePerM2,
        status: floorLevel === 10 || floorLevel === 12 ? "VENDIDO" : "DISPONIBLE",
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
  generateSemiFloorData(13),
  generateSemiFloorData(14),
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

// Función para actualizar estado de apartamento
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

// Función para obtener datos del piso
export const getBerutiFloorData = (floorNumber: number): BerutiFloor | null => {
  return berutiFloorsData.find((floor) => floor.level === floorNumber) || null
}

// Función para obtener plano del piso
export const getBerutiFloorPlan = (floorNumber: number): string | null => {
  return berutiFloorPlans[floorNumber as keyof typeof berutiFloorPlans] || null
}
