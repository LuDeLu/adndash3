// Datos del proyecto DOME Apart
export const apartProjectInfo = {
  name: "DOME Cabello Apartments",
  location: "Cabello & Lafinur, Palermo",
  description:
    "Emprendimiento de viviendas de primera categoría, cuenta con 26 unidades funcionales en 10 niveles y 3 subsuelos de cocheras.",
  image: "/images/edificio/apart.webp",
  logo: "/images/logo/palermoapart.jpg",
  totalUnits: 26,
  floors: 10,
  parkingLevels: 3,
  brochure: "/documents/dome-apart-brochure.pdf",
  unitTypes: [
    {
      type: "1 Dormitorio",
      size: "54-63 m²",
      priceRange: "USD 365.300",
      status: "Vendido",
    },
    {
      type: "2 Dormitorios",
      size: "84-109 m²",
      priceRange: "USD 478.700 - 529.400",
      status: "Disponible",
    },
    {
      type: "3 Dormitorios",
      size: "134-207 m²",
      priceRange: "USD 466.000 - USD 1.226.600",
      status: "Disponible",
    },
  ],
  amenities: [
    {
      name: "Elegante hall de acceso",
      description: "Hall de entrada con diseño moderno y elegante",
    },
    {
      name: "3 niveles de cocheras",
      description: "Cocheras cubiertas en 3 subsuelos con seguridad",
    },
    {
      name: "Salón gourmet y gimnasio",
      description: "Salón gourmet y gimnasio completamente equipado en el 10º nivel",
    },
    {
      name: "Rooftop con parrilla",
      description: "Rooftop con parrilla en terraza verde del 10º nivel",
    },
    {
      name: "Pileta con solárium",
      description: "Pileta con solárium en el nivel 10º",
    },
    {
      name: "Seguridad 24 Hs",
      description: "Seguridad y portería las 24 horas del día",
    },
    {
      name: "Bike Parking",
      description: "Estacionamiento para bicicletas",
    },
  ],
  financialOptions: [
    {
      name: "Contado",
      description: "Pago completo al momento de la escrituración con descuento especial",
    },
    {
      name: "Financiado",
      description: "Planes de financiación directa con la desarrolladora",
    },
    {
      name: "Crédito Hipotecario",
      description: "Asesoramiento para obtención de créditos bancarios",
    },
  ],
  generalPromotions: "Consulte por promociones especiales y planes de financiación disponibles",
  mapConfig: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168!2d-58.4261!3d-34.5875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM1JzE1LjAiUyA1OMKwMjUnMzQuMCJX!5e0!3m2!1ses!2sar!4v1234567890",
    address: "Cabello & Lafinur, Palermo, Buenos Aires",
    postalCode: "C1425",
    detailsLink: "https://maps.google.com/?q=Cabello+Lafinur+Palermo",
    amenitiesDescription:
      "Ubicado en el corazón de Palermo, cerca de Plaza Serrano, Bosques de Palermo y con excelente conectividad de transporte público.",
  },
}

// Tipos de datos
export type ApartUnit = {
  id: string
  unitNumber: string
  floor: number
  status: "DISPONIBLE" | "RESERVADO" | "VENDIDO" | "BLOQUEADO"
  saleValue: number
  description: string
  orientation: string
  coveredArea: number
  balconyArea: number
  terraceArea: number
  weightedArea: number
  amenitiesArea: number
  totalAreaWithAmenities: number
  pricePerSqm: number
  coordinates?: string
}

export type ApartUnitStatus = ApartUnit["status"]

export type ApartParking = {
  id: string
  level: string
  condition: string
  price: number
  status: "libre" | "ocupado"
  assignedTo?: string
}

export type ApartParkingSpot = ApartParking & {
  coordinates?: { x: number; y: number }[]
  area?: number
}

export const apartUnits: ApartUnit[] = [
  // Piso 1
  {
    id: "101",
    unitNumber: "101",
    floor: 1,
    status: "VENDIDO",
    saleValue: 728700,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.1,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 136.9,
    amenitiesArea: 8.21,
    totalAreaWithAmenities: 145.11,
    pricePerSqm: 5022,
    coordinates:
      "236,426,366,444,372,423,422,429,483,428,484,340,528,339,525,261,532,250,538,240,545,232,555,228,566,227,575,225,585,227,595,233,605,239,609,248,778,244,779,131,317,64,303,158,281,156",
  },
  {
    id: "102",
    unitNumber: "102",
    floor: 1,
    status: "VENDIDO",
    saleValue: 705100,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 121.1,
    balconyArea: 5.0,
    terraceArea: 0,
    weightedArea: 126.1,
    amenitiesArea: 7.57,
    totalAreaWithAmenities: 133.67,
    pricePerSqm: 5275,
    coordinates: "241,428,203,677,727,677,726,499,673,499,671,448,652,448,655,431,413,430,374,425,365,445",
  },
  {
    id: "103",
    unitNumber: "103",
    floor: 1,
    status: "VENDIDO",
    saleValue: 512600,
    description: "3 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 92.0,
    balconyArea: 3.8,
    terraceArea: 0,
    weightedArea: 95.8,
    amenitiesArea: 5.75,
    totalAreaWithAmenities: 101.55,
    pricePerSqm: 5048,
    coordinates:
      "931,679,727,681,726,497,674,496,673,449,689,449,689,429,664,425,666,355,726,353,726,250,668,251,667,245,829,245,931,246",
  },
  // Piso 2
  {
    id: "201",
    unitNumber: "201",
    floor: 2,
    status: "VENDIDO",
    saleValue: 755900,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.1,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 136.9,
    amenitiesArea: 8.21,
    totalAreaWithAmenities: 145.11,
    pricePerSqm: 5209,
    coordinates:
      "489,426,375,421,373,441,248,421,286,150,309,152,325,56,786,122,788,238,615,238,602,226,590,219,572,216,557,219,546,228,539,237,534,250,531,333,491,336",
  },
  {
    id: "202",
    unitNumber: "202",
    floor: 2,
    status: "DISPONIBLE",
    saleValue: 828900,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5472,
    coordinates: "733,674,732,498,680,498,679,445,661,446,661,425,376,423,374,442,252,419,210,676",
  },
  {
    id: "203",
    unitNumber: "203",
    floor: 2,
    status: "VENDIDO",
    saleValue: 581000,
    description: "3 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 96.5,
    balconyArea: 8.2,
    terraceArea: 0,
    weightedArea: 104.7,
    amenitiesArea: 6.28,
    totalAreaWithAmenities: 110.98,
    pricePerSqm: 5235,
    coordinates: "676,351,677,423,659,426,660,445,680,445,683,498,736,498,734,676,936,675,939,243,736,241,734,351",
  },
  // Piso 3
  {
    id: "301",
    unitNumber: "301",
    floor: 3,
    status: "VENDIDO",
    saleValue: 783200,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.1,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 136.9,
    amenitiesArea: 8.21,
    totalAreaWithAmenities: 145.11,
    pricePerSqm: 5397,
    coordinates:
      "237,422,363,442,369,417,479,424,480,336,522,333,524,263,529,248,535,237,543,228,555,222,566,220,580,220,589,222,602,229,607,242,651,241,780,238,781,123,316,53,299,155,276,152",
  },
  {
    id: "302",
    unitNumber: "302",
    floor: 3,
    status: "VENDIDO",
    saleValue: 858800,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5670,
    coordinates: "236,424,198,675,730,677,727,497,676,494,675,448,653,443,653,429,370,420,363,445",
  },
  {
    id: "303",
    unitNumber: "303",
    floor: 3,
    status: "DISPONIBLE",
    saleValue: 582300,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.4,
    balconyArea: 4.6,
    terraceArea: 13.27,
    weightedArea: 101.27,
    amenitiesArea: 6.08,
    totalAreaWithAmenities: 107.35,
    pricePerSqm: 5425,
    coordinates:
      "730,678,830,675,831,551,932,547,933,242,730,242,726,353,665,354,667,425,689,424,690,443,675,446,676,494,730,499",
  },
  // Piso 4
  {
    id: "401",
    unitNumber: "401",
    floor: 4,
    status: "VENDIDO",
    saleValue: 814500,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 5584,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "402",
    unitNumber: "402",
    floor: 4,
    status: "DISPONIBLE",
    saleValue: 888600,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5866,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  {
    id: "403",
    unitNumber: "403",
    floor: 4,
    status: "VENDIDO",
    saleValue: 526500,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.9,
    balconyArea: 4.6,
    terraceArea: 0,
    weightedArea: 88.5,
    amenitiesArea: 5.31,
    totalAreaWithAmenities: 93.81,
    coordinates:
      "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    pricePerSqm: 5612,
  },
  // Piso 5
  {
    id: "501",
    unitNumber: "501",
    floor: 5,
    status: "VENDIDO",
    saleValue: 841900,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 5772,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "502",
    unitNumber: "502",
    floor: 5,
    status: "VENDIDO",
    saleValue: 918400,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 6063,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  {
    id: "503",
    unitNumber: "503",
    floor: 5,
    status: "VENDIDO",
    saleValue: 544200,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.9,
    balconyArea: 4.6,
    terraceArea: 0,
    weightedArea: 88.5,
    amenitiesArea: 5.31,
    totalAreaWithAmenities: 93.81,
    pricePerSqm: 5801,
    coordinates:
      "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
  },
  // Piso 6
  {
    id: "601",
    unitNumber: "601",
    floor: 6,
    status: "VENDIDO",
    saleValue: 862900,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 5916,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "602",
    unitNumber: "602",
    floor: 6,
    status: "VENDIDO",
    saleValue: 941500,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 6216,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  {
    id: "603",
    unitNumber: "603",
    floor: 6,
    status: "VENDIDO",
    saleValue: 557800,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.9,
    balconyArea: 4.6,
    terraceArea: 0,
    weightedArea: 88.5,
    amenitiesArea: 5.31,
    totalAreaWithAmenities: 93.81,
    pricePerSqm: 5946,
    coordinates:
      "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
  },
  // Piso 7
  {
    id: "701",
    unitNumber: "701",
    floor: 7,
    status: "VENDIDO",
    saleValue: 883900,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 6060,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "702",
    unitNumber: "702",
    floor: 7,
    status: "DISPONIBLE",
    saleValue: 1579700,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 205.0,
    balconyArea: 29.1,
    terraceArea: 0,
    weightedArea: 234.1,
    amenitiesArea: 14.05,
    totalAreaWithAmenities: 248.15,
    pricePerSqm: 6366,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  // Piso 8
  {
    id: "801",
    unitNumber: "801",
    floor: 8,
    status: "VENDIDO",
    saleValue: 677700,
    description: "2 DORMITORIOS C/ TERRAZA Y PARRILLA",
    orientation: "LAFINUR",
    coveredArea: 88.0,
    balconyArea: 0,
    terraceArea: 30.07,
    weightedArea: 103.04,
    amenitiesArea: 6.18,
    totalAreaWithAmenities: 109.22,
    pricePerSqm: 6205,
    coordinates:
      "545,398,479,398,336,376,377,98,797,153,796,268,626,271,613,256,598,249,587,249,577,249,566,253,557,260,553,267,546,278",
  },
  {
    id: "802",
    unitNumber: "802",
    floor: 8,
    status: "VENDIDO",
    saleValue: 1349300,
    description: "3 DORMITORIOS C/ DEPENDENCIA (unificación)",
    orientation: "ESQUINA",
    coveredArea: 173.4,
    balconyArea: 0,
    terraceArea: 87.56,
    weightedArea: 195.29,
    amenitiesArea: 11.72,
    totalAreaWithAmenities: 207.01,
    pricePerSqm: 6518,
    coordinates:
      "333,378,476,400,634,396,635,419,683,418,682,381,740,380,742,276,946,270,946,577,845,579,845,641,293,638",
  },
  // Piso 9
  {
    id: "901",
    unitNumber: "901",
    floor: 9,
    status: "VENDIDO",
    saleValue: 401800,
    description: "1 DORMITORIO C/ PARRILLA",
    orientation: "LAFINUR",
    coveredArea: 54.2,
    balconyArea: 11.0,
    terraceArea: 0,
    weightedArea: 59.7,
    amenitiesArea: 3.58,
    totalAreaWithAmenities: 63.28,
    pricePerSqm: 6349,
    coordinates:
      "334,265,489,292,496,272,499,263,505,253,519,246,532,241,546,242,560,244,570,247,580,253,585,263,595,265,797,264,798,126,363,63",
  },
  {
    id: "902",
    unitNumber: "902",
    floor: 9,
    status: "DISPONIBLE",
    saleValue: 1201500,
    description: "3 DORMITORIOS C/ DEPENDENCIA (unificación)",
    orientation: "ESQUINA",
    coveredArea: 142.6,
    balconyArea: 54.66,
    terraceArea: 0,
    weightedArea: 169.93,
    amenitiesArea: 10.2,
    totalAreaWithAmenities: 180.13,
    pricePerSqm: 6670,
    coordinates:
      "334,264,278,632,661,635,657,511,682,510,682,488,659,486,659,445,596,446,595,422,544,417,544,395,490,397,489,295",
  },
]

// Datos de cocheras con paths individuales
export const apartParking: ApartParking[] = [
  // Nivel 1
  { id: "a1", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "libre" },
  { id: "a2", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "ocupado", assignedTo: "101" },
  { id: "a3", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "libre" },
  { id: "a4", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "ocupado", assignedTo: "202" },
  { id: "a5", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "libre" },
  { id: "a6", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "ocupado", assignedTo: "301" },
  { id: "a7", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "libre" },
  { id: "a8", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "ocupado", assignedTo: "402" },
  { id: "a9", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "libre" },
  { id: "a10", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "ocupado", assignedTo: "501" },
  { id: "a11", level: "Nivel 1", condition: "Cubierta", price: 55000, status: "libre" },

  // Nivel 2
  { id: "b1", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "libre" },
  { id: "b2", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "ocupado", assignedTo: "601" },
  { id: "b3", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "libre" },
  { id: "b4", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "ocupado", assignedTo: "702" },
  { id: "b5", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "libre" },
  { id: "b6", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "ocupado", assignedTo: "801" },
  { id: "b7", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "libre" },
  { id: "b8", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "ocupado", assignedTo: "901" },
  { id: "b9", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "libre" },
  { id: "b10", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "ocupado", assignedTo: "902" },
  { id: "b11", level: "Nivel 2", condition: "Cubierta", price: 50000, status: "libre" },

  // Nivel 3
  { id: "c1", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "libre" },
  { id: "c2", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "ocupado", assignedTo: "102" },
  { id: "c3", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "libre" },
  { id: "c4", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "ocupado", assignedTo: "203" },
  { id: "c5", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "libre" },
  { id: "c6", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "ocupado", assignedTo: "302" },
  { id: "c7", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "libre" },
  { id: "c8", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "ocupado", assignedTo: "401" },
  { id: "c9", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "libre" },
  { id: "c10", level: "Nivel 3", condition: "Cubierta", price: 48000, status: "ocupado", assignedTo: "502" },
]

// Función para obtener unidades por piso
export const getApartUnitsByFloor = (floor: number): ApartUnit[] => {
  return apartUnits.filter((unit) => unit.floor === floor)
}

// Función para obtener imagen del plano por piso
export const getApartFloorImage = (floor: number): string => {
  const floorImages: { [key: number]: string } = {
    1: "/planos/apart/pisos/piso1.png",
    2: "/planos/apart/pisos/piso2.png",
    3: "/planos/apart/pisos/piso3.png",
    4: "/planos/apart/pisos/piso4-7.png",
    5: "/planos/apart/pisos/piso4-7.png",
    6: "/planos/apart/pisos/piso4-7.png",
    7: "/planos/apart/pisos/piso4-7.png",
    8: "/planos/apart/pisos/piso8.png",
    9: "/planos/apart/pisos/piso9.png",
  }
  return floorImages[floor] || "/placeholder.svg?height=600&width=800"
}

// Coordenadas SVG exactas para cada piso según los paths proporcionados
export const apartFloorCoordinates: { [key: number]: Array<{ id: string; coords: string }> } = {
  1: [
    {
      id: "101",
      coords:
        "236,426,366,444,372,423,422,429,483,428,484,340,528,339,525,261,532,250,538,240,545,232,555,228,566,227,575,225,585,227,595,233,605,239,609,248,778,244,779,131,317,64,303,158,281,156",
    },
    {
      id: "102",
      coords: "241,428,203,677,727,677,726,499,673,499,671,448,652,448,655,431,413,430,374,425,365,445",
    },
    {
      id: "103",
      coords:
        "931,679,727,681,726,497,674,496,673,449,689,449,689,429,664,425,666,355,726,353,726,250,668,251,667,245,829,245,931,246",
    },
  ],
  2: [
    {
      id: "201",
      coords:
        "489,426,375,421,373,441,248,421,286,150,309,152,325,56,786,122,788,238,615,238,602,226,590,219,572,216,557,219,546,228,539,237,534,250,531,333,491,336",
    },
    { id: "202", coords: "733,674,732,498,680,498,679,445,661,446,661,425,376,423,374,442,252,419,210,676" },
    {
      id: "203",
      coords: "676,351,677,423,659,426,660,445,680,445,683,498,736,498,734,676,936,675,939,243,736,241,734,351",
    },
  ],
  3: [
    {
      id: "301",
      coords:
        "237,422,363,442,369,417,479,424,480,336,522,333,524,263,529,248,535,237,543,228,555,222,566,220,580,220,589,222,602,229,607,242,651,241,780,238,781,123,316,53,299,155,276,152",
    },
    { id: "302", coords: "236,424,198,675,730,677,727,497,676,494,675,448,653,443,653,429,370,420,363,445" },
    {
      id: "303",
      coords:
        "730,678,830,675,831,551,932,547,933,242,730,242,726,353,665,354,667,425,689,424,690,443,675,446,676,494,730,499",
    },
  ],
  4: [
    {
      id: "401",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "402", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "403",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  5: [
    {
      id: "501",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "502", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "503",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  6: [
    {
      id: "601",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "602", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "603",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  7: [
    {
      id: "701",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "702", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "703",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  8: [
    {
      id: "801",
      coords:
        "545,398,479,398,336,376,377,98,797,153,796,268,626,271,613,256,598,249,587,249,577,249,566,253,557,260,553,267,546,278",
    },
    {
      id: "802",
      coords: "333,378,476,400,634,396,635,419,683,418,682,381,740,380,742,276,946,270,946,577,845,579,845,641,293,638",
    },
  ],
  9: [
    {
      id: "901",
      coords:
        "334,265,489,292,496,272,499,263,505,253,519,246,532,241,546,242,560,244,570,247,580,253,585,263,595,265,797,264,798,126,363,63",
    },
    {
      id: "902",
      coords:
        "334,264,278,632,661,635,657,511,682,510,682,488,659,486,659,445,596,446,595,422,544,417,544,395,490,397,489,295",
    },
    { id: "903", coords: "661,635,978,639,979,268,735,271,733,400,660,400,662,445,686,444,687,511,662,513" },
  ],
}

// Coordenadas de las cocheras para cada nivel con los paths que proporcionaste
export const apartGarageCoordinates = {
  1: [
    {
      id: "a1",
      coords: "455,109,440,216,444,226,442,241,452,248,488,255,495,250,499,233,506,227,517,118,507,109,489,106,472,104",
    },
    {
      id: "a2",
      coords: "552,127,531,236,535,245,533,260,546,269,580,272,591,263,592,250,600,240,610,136,595,128,569,122",
    },
    { id: "a3", coords: "222,283,215,318,216,342,334,362,356,356,360,336,360,306,334,295" },
    { id: "a4", coords: "208,379,202,411,203,436,254,445,326,453,341,445,347,409,343,393,294,387,247,380" },
    { id: "a5", coords: "189,488,184,525,219,536,296,547,321,546,328,533,330,506,331,490,317,486,298,480,199,468" },
    {
      id: "a6",
      coords:
        "379,634,380,735,385,750,407,755,428,754,443,747,446,637,441,631,443,615,435,615,429,610,415,607,398,607,391,610,385,617",
    },
    {
      id: "a7",
      coords:
        "478,631,477,734,480,745,484,750,498,755,530,754,539,749,541,722,541,639,537,632,536,619,531,610,511,608,495,608,486,610",
    },
    {
      id: "a8",
      coords: "569,633,571,748,588,754,599,754,622,752,630,749,633,636,629,630,631,619,623,609,599,607,585,607,576,611",
    },
    {
      id: "a9",
      coords:
        "679,634,679,748,703,754,716,754,729,753,738,750,742,743,744,637,739,629,739,617,733,610,723,608,712,608,691,608,686,613",
    },
    {
      id: "a10",
      coords: "785,634,786,744,795,753,816,756,837,753,847,745,850,637,847,630,846,618,838,609,798,607,789,611",
    },
    {
      id: "a11",
      coords:
        "887,632,889,750,896,752,902,752,921,755,936,752,946,752,952,740,951,637,950,630,947,617,942,609,928,607,908,607,900,608,892,615",
    },
  ],
  2: [
    {
      id: "b1",
      coords: "465,112,447,218,450,229,449,243,456,250,490,255,497,252,504,245,511,233,516,180,523,132,519,113,487,107",
    },
    {
      id: "b2",
      coords:
        "559,127,536,236,540,246,537,260,549,267,576,274,589,269,594,268,595,253,599,247,614,160,614,140,605,131,588,129,581,128",
    },
    {
      id: "b3",
      coords: "231,316,241,288,353,296,358,301,372,304,378,313,376,330,375,348,372,356,364,363,349,359,345,364,233,346",
    },
    {
      id: "b4",
      coords: "226,380,221,403,219,430,229,438,330,454,338,450,350,453,361,444,365,415,358,398,347,395,338,390,266,381",
    },
    {
      id: "b5",
      coords: "214,471,205,489,204,512,206,530,313,546,323,543,335,548,343,538,348,527,350,506,348,495,338,486,326,483",
    },
    {
      id: "b6",
      coords:
        "386,628,387,734,388,748,418,750,440,748,449,740,451,632,446,629,446,613,435,607,419,607,407,607,398,609,390,612",
    },
    {
      id: "b7",
      coords:
        "480,630,482,743,496,749,515,748,528,748,542,742,546,633,543,627,539,610,530,607,520,607,510,606,499,604,492,607,487,613,482,622",
    },
    {
      id: "b8",
      coords:
        "588,632,592,738,598,745,609,748,620,748,636,748,644,749,651,744,653,719,654,631,650,626,652,616,645,606,611,605,600,606,593,616,595,627",
    },
    {
      id: "b9",
      coords:
        "686,629,688,738,691,745,697,746,703,746,713,748,738,747,744,743,748,736,748,730,748,653,750,632,747,627,745,612,735,604,718,604,699,606,690,613",
    },
    {
      id: "b10",
      coords:
        "790,630,790,725,793,743,801,750,815,751,828,751,841,750,852,746,856,635,849,628,850,612,837,608,821,607,808,606,801,607,795,612",
    },
    {
      id: "b11",
      coords:
        "892,634,893,740,898,749,903,750,918,751,928,751,940,750,948,750,953,745,955,737,957,634,953,631,954,617,949,611,932,608,919,608,910,607,900,611,895,618",
    },
  ],
  3: [
    {
      id: "c1",
      coords:
        "455,104,450,126,434,217,437,222,437,236,445,242,459,246,471,245,480,246,490,242,492,230,499,226,511,119,501,109,478,105",
    },
    {
      id: "c2",
      coords:
        "546,122,539,149,525,230,529,239,525,253,536,260,541,262,551,264,567,268,583,262,583,249,587,245,590,228,600,158,601,143,603,131,591,124,566,120",
    },
    {
      id: "c3",
      coords:
        "227,280,218,292,215,313,214,327,217,337,240,347,272,348,288,350,306,353,314,355,326,356,339,355,351,354,354,348,358,340,361,321,362,311,357,298,346,296,337,294,323,291,310,291,290,288,275,286,257,283",
    },
    {
      id: "c4",
      coords:
        "213,374,204,389,202,419,204,431,226,438,250,439,284,444,292,447,309,448,319,446,332,449,342,441,347,405,343,394,331,390,314,382,279,381,253,377,232,375",
    },
    {
      id: "c5",
      coords:
        "197,466,188,480,186,499,187,512,188,520,194,524,204,529,225,530,259,535,281,539,287,541,296,543,302,538,314,539,326,536,330,528,331,512,331,495,327,486,322,482,310,481,304,475,288,475,269,475,257,473,241,471,230,469,221,468",
    },
    {
      id: "c6",
      coords:
        "369,624,370,681,370,708,369,726,372,739,383,742,396,743,409,743,420,742,429,740,432,731,434,629,431,623,433,611,429,602,420,596,411,598,398,597,386,597,374,599",
    },
    {
      id: "c7",
      coords:
        "464,621,467,644,466,667,466,683,467,699,464,722,467,734,475,741,490,743,503,742,512,741,519,739,527,739,529,726,527,678,529,651,530,641,531,629,530,622,525,617,527,604,518,601,511,598,493,598,481,597,469,602,470,610",
    },
    {
      id: "c8",
      coords:
        "575,620,576,643,578,659,579,676,576,704,577,719,579,736,588,741,603,741,619,740,629,740,635,736,641,721,641,709,641,697,641,685,640,671,640,661,639,651,640,644,641,633,641,624,638,617,637,609,635,599,626,597,617,595,600,595,588,594,580,603",
    },
    {
      id: "c9",
      coords:
        "672,623,674,645,675,658,674,685,674,697,672,709,673,719,674,728,678,740,685,740,696,740,704,742,711,741,719,739,729,739,732,734,734,728,738,720,737,655,737,644,740,636,740,629,738,623,733,619,735,604,725,598,711,593,694,594,680,596,674,609",
    },
    {
      id: "c10",
      coords:
        "778,623,780,644,781,656,779,678,779,702,780,713,782,730,784,738,798,739,818,741,831,741,841,735,840,724,842,707,843,694,842,685,844,665,842,647,846,639,842,621,842,612,837,598,825,597,810,597,791,595,781,602",
    },
  ],
}

// Estadísticas del proyecto
export const getApartProjectStats = () => {
  const totalUnits = apartUnits.length
  const availableUnits = apartUnits.filter((unit) => unit.status === "DISPONIBLE").length
  const reservedUnits = apartUnits.filter((unit) => unit.status === "RESERVADO").length
  const soldUnits = apartUnits.filter((unit) => unit.status === "VENDIDO").length
  const blockedUnits = apartUnits.filter((unit) => unit.status === "BLOQUEADO").length
  const occupancyRate = Math.round(((soldUnits + reservedUnits) / totalUnits) * 100)

  return {
    totalUnits,
    availableUnits,
    reservedUnits,
    soldUnits,
    blockedUnits,
    occupancyRate,
  }
}

// Estadísticas de cocheras
export const getApartParkingStats = () => {
  const totalParking = apartParking.length
  const availableParking = apartParking.filter((parking) => parking.status === "libre").length
  const occupiedParking = apartParking.filter((parking) => parking.status === "ocupado").length
  const occupancyRate = Math.round((occupiedParking / totalParking) * 100)

  return {
    totalParking,
    availableParking,
    occupiedParking,
    occupancyRate,
  }
}

// Especificaciones técnicas exactas según el documento
export const apartSpecifications = {
  construction: {
    title: "Sistema Constructivo",
    description: "Estructura de hormigón armado, según cálculo",
    details: [
      "Muros divisorios de unidades y medianeros según indique el proyecto: mampostería tradicional con pintura de obra color blanco, y/o según caso, tabiquería de construcción en seco",
      "Muros interiores de las unidades funcionales según indique el proyecto: mampostería tradicional y/o casos en construcción en seco",
    ],
  },
  flooring: {
    title: "Solados",
    livingBedrooms: "Porcelanato de primera calidad, color y medidas a definir",
    kitchen: "Porcelanato simil madera marca Vite modelo Pecan 120x20",
    masterBathroom: "Solado y Paredes: Porcelanato marca vite modelo Blanco apuano 80x80",
    mainBathrooms: "Solado y Paredes: combinación de porcelanato marca vite modelo apuano y ivory arido 80x80",
    toilets: "Solado: porcelanato simil madera marca Vite modelo Pecan 120x20 y paredes: pintura de obra color blanco",
  },
  kitchen: {
    title: "Cocina",
    appliances: "Horno eléctrico y anafe a gas",
    furniture: "mueble bajo mesada y alacenas en melamina, color a definir, con frentes y laterales vistos brillosos",
    countertop: "Cuarzo color blanco norte o similar",
    sink: "Bacha de acero inoxidable marca Johnson, Mi Pileta, o similar",
    faucet: "Monocomando de 1ª calidad (FV, Roca o similar) terminación cromada",
  },
  bathrooms: {
    title: "Baños",
    fixtures: "Bidet, inodoro, lavatorio (Roca o Ferrum)",
    features: "Baños principales con bañeras y baños en suite c/duchas de piso revestido, con desagüe lineal",
    faucet: "Monocomando 1ª calidad (FV o Roca o similar)",
  },
  climate: {
    title: "Climatización",
    cooling: "Preinstalación para sistemas de Aire Acondicionado f/c. Sin equipo",
    heating: "Piso radiante, alimentación a gas – regulación de temperatura por UF",
  },
  electrical:
    "Tablero, rotulado y con sus protecciones y disyuntor diferencial. Puesta a tierra según normas del Ente Regulador (ENRE) con sus protecciones",
  plumbing: {
    hotWater: "El agua caliente será por sistema central",
    coldWater: "La instalación de agua fría será central",
    drainage: "Los desagües cloacales se realizarán de polipropileno Awaduct o similar",
    rainwater: "Los desagües pluviales se realizarán de polipropileno Awaduct o similar",
  },
  windows: "Línea A40 de aluminio color peltre. DVH: Doble Vidriado Hermético según calculo y especificación",
  doors: {
    entrance: "Puertas de de madera con marcos de chapa con buña perimetral",
    interior: "De hoja placa con marcos de chapa con buña perimetral",
    fire: "Resistentes al fuego certificada en el INTI bajo normas IRAM y según normativa",
    closets: "Frentes de placares: Melamina color a definir",
  },
  elevators: "Núcleo de 2 ascensores de primera línea y prestaciones. Puertas Automáticas. Cabina de acero inoxidable",
}

// Funciones de utilidad
export const formatApartPrice = (price: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}


export const formatApartArea = (area: number): string => {
  return `${area.toFixed(2)} m²`
}

export const getApartStatusLabel = (status: ApartUnit["status"]): string => {
  const labels = {
    DISPONIBLE: "Disponible",
    RESERVADO: "Reservado",
    VENDIDO: "Vendido",
    BLOQUEADO: "Bloqueado",
  }
  return labels[status]
}

export const getApartStatusColor = (status: ApartUnit["status"]): string => {
  const colors = {
    DISPONIBLE: "#87f5af",
    RESERVADO: "#edcf53",
    VENDIDO: "#f57f7f",
    BLOQUEADO: "#3b82f6",
  }
  return colors[status]
}

export const getApartParkingStatusColor = (status: ApartParking["status"]): string => {
  const colors = {
    libre: "#22c55e",
    ocupado: "#ef4444",
  }
  return colors[status]
}

export const updateApartUnitStatus = (unitId: string, newStatus: ApartUnit["status"]): boolean => {
  const unitIndex = apartUnits.findIndex((unit) => unit.id === unitId)
  if (unitIndex !== -1) {
    apartUnits[unitIndex].status = newStatus
    return true
  }
  return false
}

export const updateApartParkingStatus = (
  parkingId: string,
  newStatus: ApartParking["status"],
  assignedTo?: string,
): boolean => {
  const parkingIndex = apartParking.findIndex((parking) => parking.id === parkingId)
  if (parkingIndex !== -1) {
    apartParking[parkingIndex].status = newStatus
    if (assignedTo) {
      apartParking[parkingIndex].assignedTo = assignedTo
    } else {
      delete apartParking[parkingIndex].assignedTo
    }
    return true
  }
  return false
}

export const apartFloorPlans: { [key: number]: string } = {
  1: "/planos/apart/pisos/piso1.png",
  2: "/planos/apart/pisos/piso2.png",
  3: "/planos/apart/pisos/piso3.png",
  4: "/planos/apart/pisos/piso4-7.png",
  5: "/planos/apart/pisos/piso4-7.png",
  6: "/planos/apart/pisos/piso4-7.png",
  7: "/planos/apart/pisos/piso4-7.png",
  8: "/planos/apart/pisos/piso8.png",
  9: "/planos/apart/pisos/piso9.png",
}

export const apartFloorsData = [
  { level: 1, units: apartUnits.filter((u) => u.floor === 1) },
  { level: 2, units: apartUnits.filter((u) => u.floor === 2) },
  { level: 3, units: apartUnits.filter((u) => u.floor === 3) },
  { level: 4, units: apartUnits.filter((u) => u.floor === 4) },
  { level: 5, units: apartUnits.filter((u) => u.floor === 5) },
  { level: 6, units: apartUnits.filter((u) => u.floor === 6) },
  { level: 7, units: apartUnits.filter((u) => u.floor === 7) },
  { level: 8, units: apartUnits.filter((u) => u.floor === 8) },
  { level: 9, units: apartUnits.filter((u) => u.floor === 9) },
]

export const getApartParkingSpotsByLevel = (level: 1 | 2 | 3): ApartParkingSpot[] => {
  const levelStr = `Nivel ${level}`
  const parkingSpots = apartParking.filter((p) => p.level === levelStr)
  const coordinates = apartGarageCoordinates[level] || []

  return parkingSpots.map((parking) => {
    const coordData = coordinates.find((c) => c.id === parking.id)
    let parsedCoordinates: { x: number; y: number }[] | undefined

    if (coordData?.coords) {
      const coordPairs = coordData.coords.split(",")
      parsedCoordinates = []
      for (let i = 0; i < coordPairs.length; i += 2) {
        parsedCoordinates.push({
          x: Number.parseInt(coordPairs[i], 10),
          y: Number.parseInt(coordPairs[i + 1], 10),
        })
      }
    }

    return {
      ...parking,
      coordinates: parsedCoordinates,
      area: 12.5, // Default parking area
    }
  })
}
