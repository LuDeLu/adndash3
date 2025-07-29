// Datos del proyecto DOME Apart
export const apartProjectInfo = {
  name: "DOME Palermo Apartament",
  location: "Cabello & Lafinur, Palermo",
  description:
    "Emprendimiento de viviendas de primera categoría, cuenta con 26 unidades funcionales en 10 niveles y 3 subsuelos de cocheras.",
  image: "/images/edificio/lafinuredificio.png",
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

// Datos exactos de las unidades según la tabla proporcionada
export const apartUnits: ApartUnit[] = [
  // Piso 1
  {
    id: "apart-1-01",
    unitNumber: "101",
    floor: 1,
    status: "VENDIDO",
    saleValue: 662500,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.1,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 136.9,
    amenitiesArea: 8.21,
    totalAreaWithAmenities: 145.11,
    pricePerSqm: 4565,
    coordinates:
      "236,426,366,444,372,423,422,429,483,428,484,340,528,339,525,261,532,250,538,240,545,232,555,228,566,227,575,225,585,227,595,233,605,239,609,248,778,244,779,131,317,64,303,158,281,156",
  },
  {
    id: "apart-1-02",
    unitNumber: "102",
    floor: 1,
    status: "VENDIDO",
    saleValue: 641000,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 121.1,
    balconyArea: 5.0,
    terraceArea: 0,
    weightedArea: 126.1,
    amenitiesArea: 7.57,
    totalAreaWithAmenities: 133.67,
    pricePerSqm: 4796,
    coordinates: "241,428,203,677,727,677,726,499,673,499,671,448,652,448,655,431,413,430,374,425,365,445",
  },
  {
    id: "apart-1-03",
    unitNumber: "103",
    floor: 1,
    status: "VENDIDO",
    saleValue: 466000,
    description: "3 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 92.0,
    balconyArea: 3.8,
    terraceArea: 0,
    weightedArea: 95.8,
    amenitiesArea: 5.75,
    totalAreaWithAmenities: 101.55,
    pricePerSqm: 4589,
    coordinates:
      "931,679,727,681,726,497,674,496,673,449,689,449,689,429,664,425,666,355,726,353,726,250,668,251,667,245,829,245,931,246",
  },
  // Piso 2
  {
    id: "apart-2-01",
    unitNumber: "201",
    floor: 2,
    status: "VENDIDO",
    saleValue: 687200,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.1,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 136.9,
    amenitiesArea: 8.21,
    totalAreaWithAmenities: 145.11,
    pricePerSqm: 4736,
    coordinates:
      "489,426,375,421,373,441,248,421,286,150,309,152,325,56,786,122,788,238,615,238,602,226,590,219,572,216,557,219,546,228,539,237,534,250,531,333,491,336",
  },
  {
    id: "apart-2-02",
    unitNumber: "202",
    floor: 2,
    status: "DISPONIBLE",
    saleValue: 753600,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 4975,
    coordinates: "733,674,732,498,680,498,679,445,661,446,661,425,376,423,374,442,252,419,210,676",
  },
  {
    id: "apart-2-03",
    unitNumber: "203",
    floor: 2,
    status: "VENDIDO",
    saleValue: 528200,
    description: "3 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 96.5,
    balconyArea: 8.2,
    terraceArea: 0,
    weightedArea: 104.7,
    amenitiesArea: 6.28,
    totalAreaWithAmenities: 110.98,
    pricePerSqm: 4759,
    coordinates: "676,351,677,423,659,426,660,445,680,445,683,498,736,498,734,676,936,675,939,243,736,241,734,351",
  },
  // Piso 3
  {
    id: "apart-3-01",
    unitNumber: "301",
    floor: 3,
    status: "VENDIDO",
    saleValue: 712000,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.1,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 136.9,
    amenitiesArea: 8.21,
    totalAreaWithAmenities: 145.11,
    pricePerSqm: 4906,
    coordinates:
      "237,422,363,442,369,417,479,424,480,336,522,333,524,263,529,248,535,237,543,228,555,222,566,220,580,220,589,222,602,229,607,242,651,241,780,238,781,123,316,53,299,155,276,152",
  },
  {
    id: "apart-3-02",
    unitNumber: "302",
    floor: 3,
    status: "VENDIDO",
    saleValue: 780700,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5154,
    coordinates: "236,424,198,675,730,677,727,497,676,494,675,448,653,443,653,429,370,420,363,445",
  },
  {
    id: "apart-3-03",
    unitNumber: "303",
    floor: 3,
    status: "DISPONIBLE",
    saleValue: 529400,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.4,
    balconyArea: 4.6,
    terraceArea: 13.27,
    weightedArea: 101.27,
    amenitiesArea: 6.08,
    totalAreaWithAmenities: 107.35,
    pricePerSqm: 4932,
    coordinates:
      "730,678,830,675,831,551,932,547,933,242,730,242,726,353,665,354,667,425,689,424,690,443,675,446,676,494,730,499",
  },
  // Piso 4
  {
    id: "apart-4-01",
    unitNumber: "401",
    floor: 4,
    status: "VENDIDO",
    saleValue: 740400,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 5076,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "apart-4-02",
    unitNumber: "402",
    floor: 4,
    status: "DISPONIBLE",
    saleValue: 807900,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5334,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  {
    id: "apart-4-03",
    unitNumber: "403",
    floor: 4,
    status: "VENDIDO",
    saleValue: 478700,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.9,
    balconyArea: 4.6,
    terraceArea: 0,
    weightedArea: 88.5,
    amenitiesArea: 5.31,
    totalAreaWithAmenities: 93.81,
    pricePerSqm: 5103,
    coordinates:
      "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
  },
  // Piso 5
  {
    id: "apart-5-01",
    unitNumber: "501",
    floor: 5,
    status: "VENDIDO",
    saleValue: 765400,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 5248,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "apart-5-02",
    unitNumber: "502",
    floor: 5,
    status: "VENDIDO",
    saleValue: 835000,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5512,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  {
    id: "apart-5-03",
    unitNumber: "503",
    floor: 5,
    status: "VENDIDO",
    saleValue: 494800,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.9,
    balconyArea: 4.6,
    terraceArea: 0,
    weightedArea: 88.5,
    amenitiesArea: 5.31,
    totalAreaWithAmenities: 93.81,
    pricePerSqm: 5274,
    coordinates:
      "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
  },
  // Piso 6
  {
    id: "apart-6-01",
    unitNumber: "601",
    floor: 6,
    status: "VENDIDO",
    saleValue: 784500,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 5379,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "apart-6-02",
    unitNumber: "602",
    floor: 6,
    status: "VENDIDO",
    saleValue: 855900,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5650,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  {
    id: "apart-6-03",
    unitNumber: "603",
    floor: 6,
    status: "VENDIDO",
    saleValue: 507100,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.9,
    balconyArea: 4.6,
    terraceArea: 0,
    weightedArea: 88.5,
    amenitiesArea: 5.31,
    totalAreaWithAmenities: 93.81,
    pricePerSqm: 5406,
    coordinates:
      "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
  },
  // Piso 7
  {
    id: "apart-7-01",
    unitNumber: "701",
    floor: 7,
    status: "VENDIDO",
    saleValue: 803600,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "LAFINUR",
    coveredArea: 119.8,
    balconyArea: 17.8,
    terraceArea: 0,
    weightedArea: 137.6,
    amenitiesArea: 8.26,
    totalAreaWithAmenities: 145.86,
    pricePerSqm: 5510,
    coordinates:
      "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
  },
  {
    id: "apart-7-02",
    unitNumber: "702",
    floor: 7,
    status: "VENDIDO",
    saleValue: 876800,
    description: "3 DORMITORIOS C/ DEPENDENCIA",
    orientation: "ESQUINA",
    coveredArea: 120.0,
    balconyArea: 22.9,
    terraceArea: 0,
    weightedArea: 142.9,
    amenitiesArea: 8.57,
    totalAreaWithAmenities: 151.47,
    pricePerSqm: 5788,
    coordinates: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442",
  },
  {
    id: "apart-7-03",
    unitNumber: "703",
    floor: 7,
    status: "VENDIDO",
    saleValue: 519500,
    description: "2 DORMITORIOS",
    orientation: "CABELLO",
    coveredArea: 83.9,
    balconyArea: 4.6,
    terraceArea: 0,
    weightedArea: 88.5,
    amenitiesArea: 5.31,
    totalAreaWithAmenities: 93.81,
    pricePerSqm: 5538,
    coordinates:
      "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
  },
  // Piso 8
  {
    id: "apart-8-01",
    unitNumber: "801",
    floor: 8,
    status: "VENDIDO",
    saleValue: 616100,
    description: "2 DORMITORIOS C/ TERRAZA Y PARRILLA",
    orientation: "LAFINUR",
    coveredArea: 88.0,
    balconyArea: 0,
    terraceArea: 30.07,
    weightedArea: 103.04,
    amenitiesArea: 6.18,
    totalAreaWithAmenities: 109.22,
    pricePerSqm: 5641,
    coordinates:
      "545,398,479,398,336,376,377,98,797,153,796,268,626,271,613,256,598,249,587,249,577,249,566,253,557,260,553,267,546,278",
  },
  {
    id: "apart-8-02",
    unitNumber: "802",
    floor: 8,
    status: "VENDIDO",
    saleValue: 1226600,
    description: "3 DORMITORIOS C/ DEPENDENCIA (unificación)",
    orientation: "ESQUINA",
    coveredArea: 173.4,
    balconyArea: 0,
    terraceArea: 87.56,
    weightedArea: 195.29,
    amenitiesArea: 11.72,
    totalAreaWithAmenities: 207.01,
    pricePerSqm: 5925,
    coordinates:
      "333,378,476,400,634,396,635,419,683,418,682,381,740,380,742,276,946,270,946,577,845,579,845,641,293,638",
  },
  // Piso 9
  {
    id: "apart-9-01",
    unitNumber: "901",
    floor: 9,
    status: "VENDIDO",
    saleValue: 365300,
    description: "1 DORMITORIO C/ PARRILLA",
    orientation: "LAFINUR",
    coveredArea: 54.2,
    balconyArea: 11.0,
    terraceArea: 0,
    weightedArea: 59.7,
    amenitiesArea: 3.58,
    totalAreaWithAmenities: 63.28,
    pricePerSqm: 5773,
    coordinates:
      "334,265,489,292,496,272,499,263,505,253,519,246,532,241,546,242,560,244,570,247,580,253,585,263,595,265,797,264,798,126,363,63",
  },
  {
    id: "apart-9-02",
    unitNumber: "902",
    floor: 9,
    status: "VENDIDO",
    saleValue: 520300,
    description: "2 DORMITORIOS C/ PARRILLA",
    orientation: "ESQUINA",
    coveredArea: 69.9,
    balconyArea: 44.22,
    terraceArea: 0,
    weightedArea: 80.96,
    amenitiesArea: 4.86,
    totalAreaWithAmenities: 85.81,
    pricePerSqm: 6063,
    coordinates:
      "334,264,278,632,661,635,657,511,682,510,682,488,659,486,659,445,596,446,595,422,544,417,544,395,490,397,489,295",
  },
  {
    id: "apart-9-03",
    unitNumber: "903",
    floor: 9,
    status: "VENDIDO",
    saleValue: 518000,
    description: "2 DORMITORIOS C/ PARRILLA",
    orientation: "CABELLO",
    coveredArea: 73.9,
    balconyArea: 10.33,
    terraceArea: 0,
    weightedArea: 84.23,
    amenitiesArea: 5.05,
    totalAreaWithAmenities: 89.28,
    pricePerSqm: 5802,
    coordinates: "661,635,978,639,979,268,735,271,733,400,660,400,662,445,686,444,687,511,662,513",
  },
]

// Datos de cocheras exactos según la tabla
export const apartParking = [
  {
    id: "parking-1",
    level: "1º Subsuelo A",
    condition: "Cubierta",
    price: 51000,
  },
  {
    id: "parking-2",
    level: "2º Subsuelo B",
    condition: "Cubierta",
    price: 48000,
  },
  {
    id: "parking-3",
    level: "3º Subsuelo C",
    condition: "Cubierta",
    price: 45000,
  },
]

// Función para obtener unidades por piso
export const getApartUnitsByFloor = (floor: number): ApartUnit[] => {
  return apartUnits.filter((unit) => unit.floor === floor)
}

// Función para obtener imagen del plano por piso
export const getApartFloorImage = (floor: number): string => {
  const floorImages: { [key: number]: string } = {
    1: "/images/apart/piso1.png",
    2: "/images/apart/piso2.png",
    3: "/images/apart/piso3.png",
    4: "/images/apart/piso4-7.png",
    5: "/images/apart/piso4-7.png",
    6: "/images/apart/piso4-7.png",
    7: "/images/apart/piso4-7.png",
    8: "/images/apart/piso8.png",
    9: "/images/apart/piso9.png",
  }
  return floorImages[floor] || "/placeholder.svg?height=600&width=800"
}

// Coordenadas SVG exactas para cada piso según los paths proporcionados
export const apartFloorCoordinates: { [key: number]: Array<{ id: string; coords: string }> } = {
  1: [
    {
      id: "apart-1-01",
      coords:
        "236,426,366,444,372,423,422,429,483,428,484,340,528,339,525,261,532,250,538,240,545,232,555,228,566,227,575,225,585,227,595,233,605,239,609,248,778,244,779,131,317,64,303,158,281,156",
    },
    {
      id: "apart-1-02",
      coords: "241,428,203,677,727,677,726,499,673,499,671,448,652,448,655,431,413,430,374,425,365,445",
    },
    {
      id: "apart-1-03",
      coords:
        "931,679,727,681,726,497,674,496,673,449,689,449,689,429,664,425,666,355,726,353,726,250,668,251,667,245,829,245,931,246",
    },
  ],
  2: [
    {
      id: "apart-2-01",
      coords:
        "489,426,375,421,373,441,248,421,286,150,309,152,325,56,786,122,788,238,615,238,602,226,590,219,572,216,557,219,546,228,539,237,534,250,531,333,491,336",
    },
    { id: "apart-2-02", coords: "733,674,732,498,680,498,679,445,661,446,661,425,376,423,374,442,252,419,210,676" },
    {
      id: "apart-2-03",
      coords: "676,351,677,423,659,426,660,445,680,445,683,498,736,498,734,676,936,675,939,243,736,241,734,351",
    },
  ],
  3: [
    {
      id: "apart-3-01",
      coords:
        "237,422,363,442,369,417,479,424,480,336,522,333,524,263,529,248,535,237,543,228,555,222,566,220,580,220,589,222,602,229,607,242,651,241,780,238,781,123,316,53,299,155,276,152",
    },
    { id: "apart-3-02", coords: "236,424,198,675,730,677,727,497,676,494,675,448,653,443,653,429,370,420,363,445" },
    {
      id: "apart-3-03",
      coords:
        "730,678,830,675,831,551,932,547,933,242,730,242,726,353,665,354,667,425,689,424,690,443,675,446,676,494,730,499",
    },
  ],
  4: [
    {
      id: "apart-4-01",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "apart-4-02", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "apart-4-03",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  5: [
    {
      id: "apart-5-01",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "apart-5-02", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "apart-5-03",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  6: [
    {
      id: "apart-6-01",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "apart-6-02", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "apart-6-03",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  7: [
    {
      id: "apart-7-01",
      coords:
        "235,415,359,438,368,420,477,423,478,333,522,333,525,245,534,233,545,225,561,217,586,221,603,232,607,239,653,237,779,238,779,122,314,51,300,152,277,148",
    },
    { id: "apart-7-02", coords: "239,420,199,671,727,673,726,493,671,494,672,444,651,444,653,424,371,420,363,442" },
    {
      id: "apart-7-03",
      coords:
        "727,672,826,669,831,547,927,544,930,238,726,240,726,348,663,349,664,421,686,421,686,441,674,441,672,491,726,491",
    },
  ],
  8: [
    {
      id: "apart-8-01",
      coords:
        "545,398,479,398,336,376,377,98,797,153,796,268,626,271,613,256,598,249,587,249,577,249,566,253,557,260,553,267,546,278",
    },
    {
      id: "apart-8-02",
      coords: "333,378,476,400,634,396,635,419,683,418,682,381,740,380,742,276,946,270,946,577,845,579,845,641,293,638",
    },
  ],
  9: [
    {
      id: "apart-9-01",
      coords:
        "334,265,489,292,496,272,499,263,505,253,519,246,532,241,546,242,560,244,570,247,580,253,585,263,595,265,797,264,798,126,363,63",
    },
    {
      id: "apart-9-02",
      coords:
        "334,264,278,632,661,635,657,511,682,510,682,488,659,486,659,445,596,446,595,422,544,417,544,395,490,397,489,295",
    },
    { id: "apart-9-03", coords: "661,635,978,639,979,268,735,271,733,400,660,400,662,445,686,444,687,511,662,513" },
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
  return new Intl.NumberFormat("en-US", {
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

export const updateApartUnitStatus = (unitId: string, newStatus: ApartUnit["status"]): boolean => {
  const unitIndex = apartUnits.findIndex((unit) => unit.id === unitId)
  if (unitIndex !== -1) {
    apartUnits[unitIndex].status = newStatus
    return true
  }
  return false
}
