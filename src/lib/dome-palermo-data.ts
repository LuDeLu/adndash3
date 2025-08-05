// Datos completos del proyecto DOME Palermo Residence basados en la lista de precios actualizada

// Tipos para el proyecto
export type ApartmentStatus = "available" | "reserved" | "sold" | "blocked"
export type FloorNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type GarageLevel = 1 | 2 | 3

export interface ApartmentData {
  id: string
  buyer: string
  date: string
  price: string
  status: ApartmentStatus
  surface: string
  phoneNumber: string
  email: string
  assignedParkings: string[]
  orientation: string
  type: string
  coveredSurface: number
  semiCoveredSurface: number
  uncoveredSurface: number
  terraceSurface: number
  totalSurface: number
  amenitiesSurface: number
  totalWithAmenities: number
  pricePerM2: string
}

export interface CommercialUnit {
  id: string
  name: string
  location: string
  surface: number
  status: ApartmentStatus
}

export interface ParkingSpot {
  id: string
  level: GarageLevel
  status: ApartmentStatus
  assignedTo: string | null
  path: string
  price: string
}

export interface FloorData {
  apartments: Record<string, ApartmentData>
  svgPaths: Record<string, string>
  viewBox: string
}

export const domePalermoData = {
  projectInfo: {
    id: 17,
    name: "DOME Palermo Residence",
    location: "Cabello & R. Arabe Siria",
    image: "https://adndash.vercel.app/images/logo/palermoresi.png",
    edificio: "https://adndevelopers.com.ar/wp-content/uploads/2024/12/edi-1.png",
    totalUnits: 26, // 26 departamentos + 3 locales = 29 unidades totales
    commercialUnits: 3,
    availableUnits: 16, // Contando disponibles de la lista
    reservedUnits: 1, // 402 está reservado
    soldUnits: 9, // Contando vendidos de la lista
    floors: 9,
    brochure: "https://adndevelopers.com.ar/wp-content/uploads/2023/01/Brochure_DOME-Palermo-Residence.pdf",
    lastUpdate: "23/7/2025",
  },

  // Locales comerciales en planta baja
  commercialUnits: [
    {
      id: "C1",
      name: "LOCAL ESQUINA",
      location: "ESQUINA",
      surface: 143.84,
      status: "sold" as ApartmentStatus,
    },
    {
      id: "C2",
      name: "LOCAL SIRIA 1",
      location: "SIRIA",
      surface: 60.45,
      status: "sold" as ApartmentStatus,
    },
    {
      id: "C3",
      name: "LOCAL SIRIA 2",
      location: "SIRIA",
      surface: 81.91,
      status: "sold" as ApartmentStatus,
    },
  ] as CommercialUnit[],

  // Configuración de pisos basada en la lista de precios
  floorsConfig: {
    floorRange: [1, 2, 3, 4, 5, 6, 7, 8, 9] as FloorNumber[],
    totalFloors: 9,
    garageLevels: [1, 2, 3] as GarageLevel[],
    unitsPerFloor: {
      1: 3, // 101, 102, 103
      2: 3, // 201, 202, 203
      3: 3, // 301, 302, 303
      4: 3, // 401, 402, 403
      5: 3, // 501, 502, 503
      6: 3, // 601, 602, 603
      7: 3, // 701, 702, 703
      8: 3, // 801, 802, 803
      9: 2, // 901, 902
    },
  },

  // Configuración del edificio
  buildingConfig: {
    viewBox: "0 0 1000 2400",
    buildingSvg: "https://adndevelopers.com.ar/wp-content/uploads/2024/12/edi-1.png",
    floorCoordinates: {
      baseX: 448,
      baseY: 680,
      floorHeight: 80,
      specialFloors: {
        8: { y: 125 },
        9: { y: 55 },
      },
    },
  },

  // Configuración del mapa
  mapConfig: {
    coordinates: {
      lat: -34.57998595624697,
      lng: -58.415668523393144,
    },
    postalCode: "C1425",
    googleMapsLink: "https://maps.app.goo.gl/1XqsNPMyqdYwzErn7",
    googleMapsEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!3d3284.955759537342!2d-58.415668523393144!3d-34.57998595624697!2m3!1f0!2f0!3f3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb579134f34b3%3A0x6d06db0893f18a5b!2sRep%C3%BAblica%20%C3%81rabe%20Siria%20%26%20Cabello%2C%20C1425%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1733140225777!5m2!1ses!2sar",
  },

  // Amenities del proyecto
  amenities: [
    {
      name: "Hall de acceso",
      description: "Importante hall de acceso",
    },
    {
      name: "Seguridad 24 Hs.",
      description: "Servicio de seguridad las 24 horas",
    },
    {
      name: "Cocheras cubiertas",
      description: "En 3 subsuelos, con acceso por rampa",
    },
    {
      name: "Salón de usos múltiples",
      description: "Con sus servicios en 1er subsuelo",
    },
    {
      name: "Gimnasio",
      description: "Con baños y vestuario en 1er subsuelo",
    },
    {
      name: "Piscina descubierta",
      description: "Con solárium, en terraza 10mo piso",
    },
    {
      name: "Rooftop",
      description: "En 10mo piso",
    },
    {
      name: "Laundry",
      description: "Servicio de lavandería",
    },
    {
      name: "Bike Parking",
      description: "Estacionamiento para bicicletas",
    },
    {
      name: "Local E-Commerce",
      description: "Espacio para comercio electrónico",
    },
  ],

  // Tipos de unidades
  unitTypes: [
    {
      size: "60-144 m²",
      type: "Locales Comerciales",
      status: "Vendidos",
      priceRange: "Vendidos",
    },
    {
      size: "162-334 m²",
      type: "3 Dormitorios c/Dependencia",
      status: "Disponibles y Vendidos",
      priceRange: "$826,800 - $2,059,000",
    },
  ],

  // Opciones financieras
  financialOptions: [
    {
      name: "Financiamiento directo",
      description: "Hasta 60 cuotas con tasa preferencial",
    },
    {
      name: "Hipoteca bancaria",
      description: "Acuerdos con principales bancos",
    },
  ],

  // Configuración de cocheras
  parkingConfig: {
    levels: [1, 2, 3] as GarageLevel[],
    totalSpots: 45,
    parkingInfo:
      "Disponemos de 45 espacios de estacionamiento subterráneo distribuidos en 3 niveles. Precios: 1º Subsuelo $60,000, 2º Subsuelo $55,000, 3º Subsuelo $50,000. Acceso con tarjeta magnética y vigilancia 24/7.",
    spotsPerLevel: {
      1: 15,
      2: 15,
      3: 15,
    },
    prices: {
      1: "$60,000",
      2: "$55,000",
      3: "$50,000",
    },
  },

  // Datos de departamentos por piso (basados en la lista de precios actualizada)
  apartmentData: {
    1: {
      "101": {
        id: "101",
        buyer: "",
        date: "",
        price: "$1,008,900",
        status: "available" as ApartmentStatus,
        surface: "210.45 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 184.48,
        semiCoveredSurface: 10.38,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 194.86,
        amenitiesSurface: 15.59,
        totalWithAmenities: 210.45,
        pricePerM2: "$4,794",
      },
      "102": {
        id: "102",
        buyer: "",
        date: "",
        price: "$1,054,400",
        status: "available" as ApartmentStatus,
        surface: "199.94 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 177.63,
        semiCoveredSurface: 7.5,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 185.13,
        amenitiesSurface: 14.81,
        totalWithAmenities: 199.94,
        pricePerM2: "$5,274",
      },
      "103": {
        id: "103",
        buyer: "",
        date: "",
        price: "$826,800",
        status: "available" as ApartmentStatus,
        surface: "169.92 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 152.28,
        semiCoveredSurface: 5.05,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 157.33,
        amenitiesSurface: 12.59,
        totalWithAmenities: 169.92,
        pricePerM2: "$4,866",
      },
    },
    2: {
      "201": {
        id: "201",
        buyer: "",
        date: "",
        price: "$1,114,000",
        status: "available" as ApartmentStatus,
        surface: "227.51 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 188.98,
        semiCoveredSurface: 21.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 210.66,
        amenitiesSurface: 16.85,
        totalWithAmenities: 227.51,
        pricePerM2: "$4,896",
      },
      "202": {
        id: "202",
        buyer: "",
        date: "",
        price: "$1,171,000",
        status: "available" as ApartmentStatus,
        surface: "217.41 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 177.63,
        semiCoveredSurface: 23.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 201.31,
        amenitiesSurface: 16.1,
        totalWithAmenities: 217.41,
        pricePerM2: "$5,386",
      },
      "203": {
        id: "203",
        buyer: "",
        date: "",
        price: "$917,900",
        status: "available" as ApartmentStatus,
        surface: "184.70 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 154.64,
        semiCoveredSurface: 16.38,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 171.02,
        amenitiesSurface: 13.68,
        totalWithAmenities: 184.7,
        pricePerM2: "$4,970",
      },
    },
    3: {
      "301": {
        id: "301",
        buyer: "Cliente Vendido",
        date: "2024-01-15",
        price: "$1,137,200",
        status: "sold" as ApartmentStatus,
        surface: "227.51 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 188.98,
        semiCoveredSurface: 21.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 210.66,
        amenitiesSurface: 16.85,
        totalWithAmenities: 227.51,
        pricePerM2: "$4,998",
      },
      "302": {
        id: "302",
        buyer: "Cliente Vendido",
        date: "2024-02-20",
        price: "$1,195,400",
        status: "sold" as ApartmentStatus,
        surface: "217.41 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 177.63,
        semiCoveredSurface: 23.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 201.31,
        amenitiesSurface: 16.1,
        totalWithAmenities: 217.41,
        pricePerM2: "$5,498",
      },
      "303": {
        id: "303",
        buyer: "",
        date: "",
        price: "$937,000",
        status: "available" as ApartmentStatus,
        surface: "184.70 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 154.64,
        semiCoveredSurface: 16.38,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 171.02,
        amenitiesSurface: 13.68,
        totalWithAmenities: 184.7,
        pricePerM2: "$5,073",
      },
    },
    4: {
      "401": {
        id: "401",
        buyer: "",
        date: "",
        price: "$1,160,400",
        status: "available" as ApartmentStatus,
        surface: "227.51 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 188.98,
        semiCoveredSurface: 21.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 210.66,
        amenitiesSurface: 16.85,
        totalWithAmenities: 227.51,
        pricePerM2: "$5,100",
      },
      "402": {
        id: "402",
        buyer: "Cliente Reservado",
        date: "2024-12-01",
        price: "$1,219,700",
        status: "reserved" as ApartmentStatus,
        surface: "217.41 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 177.63,
        semiCoveredSurface: 23.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 201.31,
        amenitiesSurface: 16.1,
        totalWithAmenities: 217.41,
        pricePerM2: "$5,610",
      },
      "403": {
        id: "403",
        buyer: "",
        date: "",
        price: "$956,200",
        status: "available" as ApartmentStatus,
        surface: "184.70 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 154.64,
        semiCoveredSurface: 16.38,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 171.02,
        amenitiesSurface: 13.68,
        totalWithAmenities: 184.7,
        pricePerM2: "$5,177",
      },
    },
    5: {
      "501": {
        id: "501",
        buyer: "Cliente Vendido",
        date: "2024-03-10",
        price: "$1,183,600",
        status: "sold" as ApartmentStatus,
        surface: "227.51 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 188.98,
        semiCoveredSurface: 21.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 210.66,
        amenitiesSurface: 16.85,
        totalWithAmenities: 227.51,
        pricePerM2: "$5,202",
      },
      "502": {
        id: "502",
        buyer: "Cliente Vendido",
        date: "2024-04-15",
        price: "$1,244,100",
        status: "sold" as ApartmentStatus,
        surface: "217.41 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 177.63,
        semiCoveredSurface: 23.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 201.31,
        amenitiesSurface: 16.1,
        totalWithAmenities: 217.41,
        pricePerM2: "$5,722",
      },
      "503": {
        id: "503",
        buyer: "Cliente Vendido",
        date: "2024-05-20",
        price: "$975,300",
        status: "sold" as ApartmentStatus,
        surface: "184.70 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 154.64,
        semiCoveredSurface: 16.38,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 171.02,
        amenitiesSurface: 13.68,
        totalWithAmenities: 184.7,
        pricePerM2: "$5,280",
      },
    },
    6: {
      "601": {
        id: "601",
        buyer: "",
        date: "",
        price: "$1,206,800",
        status: "available" as ApartmentStatus,
        surface: "227.51 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 188.98,
        semiCoveredSurface: 21.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 210.66,
        amenitiesSurface: 16.85,
        totalWithAmenities: 227.51,
        pricePerM2: "$5,304",
      },
      "602": {
        id: "602",
        buyer: "Cliente Vendido",
        date: "2024-06-25",
        price: "$1,268,500",
        status: "sold" as ApartmentStatus,
        surface: "217.41 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 177.63,
        semiCoveredSurface: 23.68,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 201.31,
        amenitiesSurface: 16.1,
        totalWithAmenities: 217.41,
        pricePerM2: "$5,834",
      },
      "603": {
        id: "603",
        buyer: "",
        date: "",
        price: "$994,400",
        status: "available" as ApartmentStatus,
        surface: "184.70 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 154.64,
        semiCoveredSurface: 16.38,
        uncoveredSurface: 0,
        terraceSurface: 0,
        totalSurface: 171.02,
        amenitiesSurface: 13.68,
        totalWithAmenities: 184.7,
        pricePerM2: "$5,384",
      },
    },
    7: {
      "701": {
        id: "701",
        buyer: "",
        date: "",
        price: "$1,233,000",
        status: "available" as ApartmentStatus,
        surface: "228.07 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 189.17,
        semiCoveredSurface: 8.1,
        uncoveredSurface: 13.91,
        terraceSurface: 0,
        totalSurface: 211.18,
        amenitiesSurface: 16.89,
        totalWithAmenities: 228.07,
        pricePerM2: "$5,406",
      },
      "702": {
        id: "702",
        buyer: "Cliente Vendido",
        date: "2024-07-30",
        price: "$1,293,400",
        status: "sold" as ApartmentStatus,
        surface: "217.50 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 177.63,
        semiCoveredSurface: 7.51,
        uncoveredSurface: 16.25,
        terraceSurface: 0,
        totalSurface: 201.39,
        amenitiesSurface: 16.11,
        totalWithAmenities: 217.5,
        pricePerM2: "$5,947",
      },
      "703": {
        id: "703",
        buyer: "",
        date: "",
        price: "$1,013,900",
        status: "available" as ApartmentStatus,
        surface: "184.78 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 154.64,
        semiCoveredSurface: 3.54,
        uncoveredSurface: 12.91,
        terraceSurface: 0,
        totalSurface: 171.09,
        amenitiesSurface: 13.69,
        totalWithAmenities: 184.78,
        pricePerM2: "$5,487",
      },
    },
    8: {
      "801": {
        id: "801",
        buyer: "",
        date: "",
        price: "$1,165,500",
        status: "available" as ApartmentStatus,
        surface: "211.60 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 169.67,
        semiCoveredSurface: 0.0,
        uncoveredSurface: 26.26,
        terraceSurface: 0,
        totalSurface: 195.92,
        amenitiesSurface: 15.67,
        totalWithAmenities: 211.6,
        pricePerM2: "$5,508",
      },
      "802": {
        id: "802",
        buyer: "",
        date: "",
        price: "$1,218,300",
        status: "available" as ApartmentStatus,
        surface: "201.07 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 129.56,
        semiCoveredSurface: 0.0,
        uncoveredSurface: 56.62,
        terraceSurface: 0,
        totalSurface: 186.18,
        amenitiesSurface: 14.89,
        totalWithAmenities: 201.07,
        pricePerM2: "$6,059",
      },
      "803": {
        id: "803",
        buyer: "",
        date: "",
        price: "$909,500",
        status: "available" as ApartmentStatus,
        surface: "162.67 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "SIRIA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 126.34,
        semiCoveredSurface: 4.05,
        uncoveredSurface: 20.24,
        terraceSurface: 0,
        totalSurface: 150.62,
        amenitiesSurface: 12.05,
        totalWithAmenities: 162.67,
        pricePerM2: "$5,591",
      },
    },
    9: {
      "901": {
        id: "901",
        buyer: "",
        date: "",
        price: "$1,703,000",
        status: "available" as ApartmentStatus,
        surface: "289.09 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "FRENTE CABELLO",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 171.6,
        semiCoveredSurface: 26.23,
        uncoveredSurface: 69.85,
        terraceSurface: 0,
        totalSurface: 267.68,
        amenitiesSurface: 21.41,
        totalWithAmenities: 289.09,
        pricePerM2: "$5,891",
      },
      "902": {
        id: "902",
        buyer: "Cliente Vendido",
        date: "2024-08-15",
        price: "$2,059,000",
        status: "sold" as ApartmentStatus,
        surface: "333.64 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
        orientation: "ESQUINA",
        type: "3 DORMITORIOS C/DEP",
        coveredSurface: 181.2,
        semiCoveredSurface: 68.87,
        uncoveredSurface: 58.86,
        terraceSurface: 0,
        totalSurface: 308.93,
        amenitiesSurface: 24.71,
        totalWithAmenities: 333.64,
        pricePerM2: "$6,171",
      },
    },
  } as Record<FloorNumber, Record<string, ApartmentData>>,

  // Paths SVG para cada departamento (manteniendo los existentes)
  svgPaths: {
    1: {
      "101":
        "M136,509 L126,2004 L764,2001 L767,1918 L1209,1915 L1207,1999 L1218,2001 L1221,1692 L1635,1692 L1639,1544 L1224,1543 L1227,1291 L1430,1292 L1424,899 L1219,902 L1216,578 L506,575 L504,455 Z",
      "102": "M3111,2317 L1421,2314 L1418,2007 L1209,2004 L1209,1680 L1635,1683 L2078,1683 L2084,1270 L3117,1270 Z",
      "103":
        "M3111,1276 L3114,300 L2298,303 L2304,214 L1206,366 L1212,904 L1415,910 L1418,1288 L1674,1291 L1677,1115 L1879,1109 L1879,1285 Z",
    },
    2: {
      "201":
        "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "202":
        "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "203":
        "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    // Los pisos 3-7 usan los mismos paths que el piso 2
    3: {
      "301":
        "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "302":
        "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "303":
        "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    4: {
      "401":
        "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "402":
        "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "403":
        "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    5: {
      "501":
        "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "502":
        "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "503":
        "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    6: {
      "601":
        "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "602":
        "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "603":
        "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    7: {
      "701":
        "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "702":
        "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "703":
        "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    8: {
      "801":
        "M854,1776 L203,1786 L208,420 L605,414 L595,351 L1341,255 L1346,1304 L1754,1304 L1754,1447 L1346,1463 L1346,1702 L859,1712 Z",
      "802":
        "M1346,1447 L1341,1702 L1558,1712 L1558,1792 L1748,1792 L1748,2094 L3114,2094 L3108,1087 L2436,1087 L2431,1214 L2251,1220 L2256,1431 Z",
      "803":
        "M3119,1092 L2426,1082 L2426,1008 L2045,1018 L2039,838 L2436,817 L2442,626 L1965,626 L1976,838 L1817,838 L1817,1008 L1346,1008 L1346,255 L3124,22 Z",
    },
    9: {
      "901": "M22,342 L26,1335 L1599,1335 L1602,1054 L1449,1054 L1442,926 L1001,929 L1001,214 Z",
      "902":
        "M1342,1332 L1342,1613 L2345,1610 L2352,26 L1001,217 L994,342 L1175,346 L1178,679 L1783,683 L1783,1047 L1606,1051 L1606,1325 Z",
    },
  } as Record<FloorNumber, Record<string, string>>,

  // ViewBox para cada piso
  viewBoxes: {
    1: "0 0 3200 2400",
    2: "0 0 3200 2400",
    3: "0 0 3200 2400",
    4: "0 0 3200 2400",
    5: "0 0 3200 2400",
    6: "0 0 3200 2400",
    7: "0 0 3200 2400",
    8: "0 0 3455 2250",
    9: "0 0 2220 1700",
  } as Record<FloorNumber, string>,

  // Planos de pisos
  floorPlans: {
    1: "/planos/resi/pisos/plano_piso_1.svg",
    2: "/planos/resi/pisos/plano_piso_2-6.svg",
    3: "/planos/resi/pisos/plano_piso_2-6.svg",
    4: "/planos/resi/pisos/plano_piso_2-6.svg",
    5: "/planos/resi/pisos/plano_piso_2-6.svg",
    6: "/planos/resi/pisos/plano_piso_2-6.svg",
    7: "/planos/resi/pisos/plano_piso_2-6.svg",
    8: "/planos/resi/pisos/plano_piso_8.svg",
    9: "/planos/resi/pisos/plano_piso_9.svg",
  } as Record<FloorNumber, string>,

  // Planos de cocheras
  garagePlans: {
    1: "/planos/resi/cochera1.svg",
    2: "/planos/resi/cochera2.svg",
    3: "/planos/resi/cochera3.svg",
  } as Record<GarageLevel, string>,

  // PDFs de departamentos
  apartmentPDFs: {
    "101": "/resi/uf101.pdf",
    "102": "/resi/uf102.pdf",
    "103": "/resi/uf103.pdf",
    "201": "/resi/uf201.pdf",
    "202": "/resi/uf202.pdf",
    "203": "/resi/uf203.pdf",
    "301": "/resi/uf301.pdf",
    "302": "/resi/uf302.pdf",
    "303": "/resi/uf303.pdf",
    "401": "/resi/uf401.pdf",
    "402": "/resi/uf402.pdf",
    "403": "/resi/uf403.pdf",
    "501": "/resi/uf501.pdf",
    "502": "/resi/uf502.pdf",
    "503": "/resi/uf503.pdf",
    "601": "/resi/uf601.pdf",
    "602": "/resi/uf602.pdf",
    "603": "/resi/uf603.pdf",
    "701": "/resi/uf701.pdf",
    "702": "/resi/uf702.pdf",
    "703": "/resi/uf703.pdf",
    "801": "/resi/uf801.pdf",
    "802": "/resi/uf802.pdf",
    "803": "/resi/uf803.pdf",
    "901": "/resi/uf901.pdf",
    "902": "/resi/uf902.pdf",
  } as Record<string, string>,

  // Cocheras con coordenadas exactas según la lista proporcionada (A1-A45)
  parkingSpots: [
    // Nivel 1 - Cocheras A1-A15 ($60,000)
    {
      id: "A1",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M313,204 L317,229 L317,246 L323,270 L326,291 L327,312 L331,337 L338,346 L358,346 L380,340 L387,324 L383,298 L380,278 L376,257 L376,237 L369,214 L365,200 L356,188 L334,196 Z",
      price: "$60,000",
    },
    {
      id: "A2",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M402,190 L399,202 L401,216 L404,230 L406,248 L408,257 L410,273 L410,285 L410,302 L413,318 L416,329 L424,335 L442,336 L453,338 L466,329 L471,320 L471,299 L469,281 L464,263 L464,249 L462,239 L462,230 L459,217 L459,208 L456,198 L452,184 L441,183 L430,181 L419,181 Z",
      price: "$60,000",
    },
    {
      id: "A3",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M484,179 L482,187 L482,199 L482,210 L487,226 L488,241 L491,259 L492,274 L495,292 L496,307 L500,320 L513,322 L524,324 L535,324 L545,320 L554,311 L554,291 L554,278 L550,267 L547,253 L546,235 L545,221 L543,209 L539,198 L536,184 L534,172 L518,170 L506,170 Z",
      price: "$60,000",
    },
    {
      id: "A4",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M567,170 L564,190 L572,217 L574,230 L577,242 L579,262 L579,271 L579,293 L582,306 L588,311 L601,311 L622,311 L635,303 L636,285 L636,267 L633,253 L631,238 L628,223 L621,194 L619,176 L615,163 L595,159 L582,161 Z",
      price: "$60,000",
    },
    {
      id: "A5",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M650,155 L650,167 L650,190 L655,220 L661,248 L662,281 L667,295 L675,299 L689,300 L704,299 L715,291 L718,277 L716,257 L716,238 L714,213 L709,198 L708,183 L705,167 L703,152 L693,145 L676,148 L665,149 Z",
      price: "$60,000",
    },
    {
      id: "A6",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M736,145 L734,165 L737,183 L744,205 L744,224 L744,248 L750,268 L754,292 L773,292 L783,292 L797,285 L805,278 L808,262 L805,245 L804,227 L801,212 L799,195 L795,180 L794,166 L790,147 L786,134 L772,131 L758,131 L747,133 Z",
      price: "$60,000",
    },
    {
      id: "A7",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M820,133 L824,152 L824,165 L824,184 L824,205 L828,226 L834,253 L844,275 L856,278 L870,278 L882,274 L891,270 L895,256 L895,246 L891,227 L888,205 L885,181 L882,166 L882,151 L881,138 L874,125 L851,122 L837,125 Z",
      price: "$60,000",
    },
    {
      id: "A8",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M909,126 L909,143 L912,166 L916,187 L918,217 L920,248 L927,259 L935,266 L950,266 L968,262 L981,252 L979,234 L974,208 L972,185 L970,169 L970,155 L967,134 L963,123 L960,112 L948,111 L934,111 L918,116 Z",
      price: "$60,000",
    },
    {
      id: "A9",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M997,108 L996,122 L996,138 L1000,163 L1003,183 L1006,197 L1008,226 L1010,242 L1017,251 L1031,251 L1047,251 L1060,245 L1065,233 L1065,209 L1061,197 L1061,177 L1058,154 L1056,138 L1054,119 L1047,104 L1038,100 L1021,100 L1006,100 Z",
      price: "$60,000",
    },
    {
      id: "A10",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1143,291 L1155,286 L1172,286 L1190,286 L1215,286 L1238,285 L1253,285 L1273,288 L1281,291 L1288,300 L1288,316 L1288,325 L1288,336 L1274,342 L1263,342 L1249,343 L1233,343 L1220,342 L1201,342 L1186,340 L1169,340 L1154,340 L1143,340 L1137,335 L1136,325 L1136,314 L1136,302 Z",
      price: "$60,000",
    },
    {
      id: "A11",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1140,375 L1159,370 L1184,368 L1202,367 L1231,368 L1253,368 L1269,371 L1283,372 L1289,381 L1289,394 L1285,414 L1278,422 L1259,424 L1234,426 L1187,424 L1173,424 L1151,425 L1140,425 L1139,410 L1137,400 Z",
      price: "$60,000",
    },
    {
      id: "A12",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M592,513 L590,527 L589,544 L586,567 L586,585 L588,598 L589,626 L586,641 L588,660 L611,660 L629,662 L642,659 L646,634 L646,614 L646,595 L646,574 L644,558 L643,545 L643,531 L643,518 L633,512 L618,505 Z",
      price: "$60,000",
    },
    {
      id: "A13",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M506,513 L506,525 L506,538 L506,554 L506,567 L506,584 L506,603 L506,626 L506,637 L505,650 L516,657 L527,660 L543,659 L557,657 L560,646 L561,628 L564,616 L561,599 L560,583 L559,563 L561,552 L563,540 L563,529 L556,515 L543,508 L527,508 L516,508 Z",
      price: "$60,000",
    },
    {
      id: "A14",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M334,513 L334,525 L334,538 L334,554 L334,567 L334,584 L334,603 L334,626 L334,637 L333,650 L344,657 L355,660 L371,659 L385,657 L388,646 L389,628 L392,616 L389,599 L388,583 L387,563 L389,552 L391,540 L391,529 L384,515 L371,508 L355,508 L344,508 Z",
      price: "$60,000",
    },
    {
      id: "A15",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M334,513 L334,525 L334,538 L334,554 L334,567 L334,584 L334,603 L334,626 L334,637 L333,650 L344,657 L355,660 L371,659 L385,657 L388,646 L389,628 L392,616 L389,599 L388,583 L387,563 L389,552 L391,540 L391,529 L384,515 L371,508 L355,508 L344,508 Z",
      price: "$60,000",
    },

    // Nivel 2 - Cocheras A16-A30 ($55,000)
    {
      id: "A16",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M307,208 L309,226 L311,248 L315,270 L318,296 L322,328 L325,349 L338,353 L358,350 L372,345 L379,335 L376,314 L370,286 L370,270 L370,253 L365,231 L362,212 L356,202 L344,197 L329,199 L318,203 Z",
      price: "$55,000",
    },
    {
      id: "A17",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M392,194 L392,209 L391,228 L395,244 L398,263 L401,278 L401,293 L405,313 L410,329 L415,338 L433,340 L449,339 L458,332 L462,317 L458,293 L453,257 L451,241 L449,213 L444,198 L440,188 L426,187 L412,187 Z",
      price: "$55,000",
    },
    {
      id: "A18",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M473,181 L474,199 L475,212 L480,221 L480,241 L485,257 L487,278 L489,292 L491,313 L495,324 L505,328 L521,329 L532,325 L543,321 L546,311 L546,292 L541,266 L536,246 L535,227 L534,213 L532,201 L531,191 L528,179 L510,177 L492,176 Z",
      price: "$55,000",
    },
    {
      id: "A19",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M559,170 L558,180 L558,203 L560,220 L564,233 L568,251 L569,271 L569,285 L571,299 L574,310 L580,317 L592,318 L609,317 L625,306 L628,291 L627,271 L623,255 L621,237 L618,223 L617,212 L614,199 L614,187 L610,167 L596,163 L580,163 Z",
      price: "$55,000",
    },
    {
      id: "A20",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M643,162 L642,179 L644,194 L646,206 L649,223 L650,244 L650,266 L655,280 L657,292 L658,302 L668,309 L685,309 L697,304 L707,300 L714,292 L714,280 L714,263 L709,246 L709,230 L707,213 L705,202 L703,190 L700,176 L696,159 L691,148 L676,148 L661,148 L654,152 Z",
      price: "$55,000",
    },
    {
      id: "A21",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M730,145 L729,166 L730,187 L734,208 L740,239 L740,255 L743,273 L747,289 L757,293 L773,293 L783,289 L797,285 L799,275 L798,255 L797,245 L794,233 L791,217 L792,209 L790,194 L790,177 L788,161 L783,148 L780,141 L766,140 L751,140 Z",
      price: "$55,000",
    },
    {
      id: "A22",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M819,137 L817,155 L819,174 L823,203 L823,221 L827,241 L831,267 L837,280 L856,285 L870,281 L882,274 L885,263 L885,246 L885,231 L882,217 L880,201 L877,185 L877,170 L876,158 L871,141 L867,130 L849,130 L835,130 Z",
      price: "$55,000",
    },
    {
      id: "A23",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M902,126 L902,141 L906,161 L907,179 L910,194 L910,209 L912,226 L913,238 L914,256 L917,268 L928,268 L941,268 L954,268 L964,267 L974,259 L974,239 L971,223 L968,205 L967,188 L964,177 L963,162 L961,141 L959,127 L957,116 L939,115 L921,116 Z",
      price: "$55,000",
    },
    {
      id: "A24",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M986,116 L989,134 L992,154 L992,172 L996,194 L997,210 L1001,239 L1007,255 L1018,257 L1029,260 L1043,260 L1053,253 L1058,244 L1058,226 L1057,206 L1054,185 L1053,170 L1050,155 L1046,131 L1041,118 L1040,105 L1025,105 L1005,105 Z",
      price: "$55,000",
    },
    {
      id: "A25",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1136,293 L1145,293 L1163,291 L1188,289 L1212,289 L1237,292 L1255,291 L1276,289 L1283,300 L1285,320 L1280,347 L1269,345 L1252,345 L1233,346 L1215,347 L1201,347 L1188,347 L1175,347 L1159,347 L1148,346 L1139,343 L1133,334 L1130,322 L1130,313 Z",
      price: "$55,000",
    },
    {
      id: "A26",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1134,378 L1281,378 L1281,429 L1134,429 Z",
      price: "$55,000",
    },
    {
      id: "A27",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1133,459 L1280,459 L1280,515 L1133,515 Z",
      price: "$55,000",
    },
    {
      id: "A28",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1137,547 L1280,547 L1280,596 L1137,596 Z",
      price: "$55,000",
    },
    {
      id: "A29",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1136,630 L1282,630 L1282,682 L1136,682 Z",
      price: "$55,000",
    },
    {
      id: "A30",
      level: 2 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1136,714 L1281,714 L1281,765 L1136,765 Z",
      price: "$55,000",
    },

    // Nivel 3 - Cocheras A31-A45 ($50,000)
    {
      id: "A31",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M308,197 L308,213 L312,235 L315,271 L322,309 L325,328 L332,336 L350,339 L369,335 L380,329 L379,314 L376,293 L366,203 L362,191 L352,187 L334,187 L319,190 Z",
      price: "$50,000",
    },
    {
      id: "A32",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M392,184 L391,201 L394,223 L395,245 L398,273 L399,284 L404,307 L408,325 L424,328 L449,327 L459,321 L463,304 L463,285 L459,259 L453,238 L452,219 L452,203 L449,190 L446,177 L427,173 L409,177 Z",
      price: "$50,000",
    },
    {
      id: "A33",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M474,175 L478,209 L481,246 L488,274 L487,287 L495,314 L513,317 L531,317 L543,304 L547,281 L539,263 L538,242 L536,224 L535,209 L534,193 L531,182 L528,171 L524,163 L513,163 L493,163 L485,166 Z",
      price: "$50,000",
    },
    {
      id: "A34",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M559,155 L556,176 L556,193 L557,207 L561,229 L567,250 L568,276 L574,290 L581,303 L597,305 L611,303 L619,295 L629,294 L628,277 L621,255 L621,233 L619,219 L617,205 L613,191 L610,179 L610,170 L611,165 L607,151 L592,151 Z",
      price: "$50,000",
    },
    {
      id: "A35",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M640,149 L640,161 L642,183 L643,206 L650,233 L651,254 L653,278 L660,289 L674,294 L699,289 L708,283 L711,265 L707,242 L703,218 L700,200 L697,181 L697,170 L696,159 L694,147 L682,141 L658,141 Z",
      price: "$50,000",
    },
    {
      id: "A36",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M725,137 L725,151 L728,172 L730,202 L736,239 L740,268 L748,281 L766,280 L782,280 L788,273 L794,263 L794,248 L791,230 L788,216 L788,203 L786,191 L784,179 L783,165 L782,156 L780,148 L777,137 L766,130 L751,130 L741,131 Z",
      price: "$50,000",
    },
    {
      id: "A37",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M815,123 L815,136 L813,149 L817,174 L822,198 L823,213 L827,235 L828,255 L835,264 L845,273 L859,270 L874,266 L884,262 L884,246 L881,224 L873,183 L869,158 L867,141 L864,127 L862,119 L842,119 Z",
      price: "$50,000",
    },
    {
      id: "A38",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M902,112 L899,133 L899,148 L903,158 L906,167 L909,185 L909,202 L909,223 L913,242 L917,253 L928,257 L942,257 L959,255 L968,249 L970,231 L967,205 L964,190 L961,167 L960,148 L957,131 L953,107 L924,105 Z",
      price: "$50,000",
    },
    {
      id: "A39",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M985,102 L983,113 L983,133 L990,166 L994,210 L999,233 L1003,246 L1019,249 L1028,245 L1043,244 L1053,237 L1054,221 L1055,208 L1051,190 L1051,180 L1051,163 L1046,147 L1043,136 L1041,119 L1039,105 L1033,95 L1015,94 L1001,95 Z",
      price: "$50,000",
    },
    {
      id: "A40",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1129,281 L1276,281 L1276,332 L1129,332 Z",
      price: "$50,000",
    },
    {
      id: "A41",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1130,364 L1276,364 L1276,418 L1130,418 Z",
      price: "$50,000",
    },
    {
      id: "A42",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1128,446 L1278,446 L1278,502 L1128,502 Z",
      price: "$50,000",
    },
    {
      id: "A43",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1130,533 L1276,533 L1276,584 L1130,584 Z",
      price: "$50,000",
    },
    {
      id: "A44",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1129,613 L1274,613 L1274,670 L1129,670 Z",
      price: "$50,000",
    },
    {
      id: "A45",
      level: 3 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1133,698 L1276,698 L1276,752 L1133,752 Z",
      price: "$50,000",
    },
  ] as ParkingSpot[],

  // Métodos helper para acceso type-safe
  getFloorData: (floor: number): FloorData | null => {
    const floorNum = floor as FloorNumber
    const apartments = domePalermoData.apartmentData[floorNum]
    const svgPaths = domePalermoData.svgPaths[floorNum]
    const viewBox = domePalermoData.viewBoxes[floorNum]

    if (!apartments || !svgPaths || !viewBox) {
      return null
    }

    return {
      apartments,
      svgPaths,
      viewBox,
    }
  },

  getFloorPlan: (floor: number): string | null => {
    const floorNum = floor as FloorNumber
    return domePalermoData.floorPlans[floorNum] || null
  },

  getGaragePlan: (level: number): string | null => {
    const garageLevel = level as GarageLevel
    return domePalermoData.garagePlans[garageLevel] || null
  },

  getApartmentPDF: (apartmentId: string): string | null => {
    return domePalermoData.apartmentPDFs[apartmentId] || null
  },

  getProjectStats: () => {
    const { totalUnits, availableUnits, reservedUnits, soldUnits } = domePalermoData.projectInfo
    return {
      total: totalUnits,
      available: availableUnits,
      reserved: reservedUnits,
      sold: soldUnits,
      occupancyRate: Math.round(((soldUnits + reservedUnits) / totalUnits) * 100),
    }
  },

  getParkingSpotsByLevel: (level: GarageLevel): ParkingSpot[] => {
    return domePalermoData.parkingSpots.filter((spot) => spot.level === level)
  },

  getParkingStats: () => {
    const spots = domePalermoData.parkingSpots
    return {
      total: spots.length,
      available: spots.filter((spot) => spot.status === "available").length,
      occupied: spots.filter((spot) => spot.status === "sold" || spot.status === "reserved").length,
      reserved: spots.filter((spot) => spot.status === "reserved").length,
      sold: spots.filter((spot) => spot.status === "sold").length,
    }
  },

  // Método para obtener estadísticas por piso
  getFloorStats: (floor: FloorNumber) => {
    const apartments = domePalermoData.apartmentData[floor]
    if (!apartments) return null

    const apartmentList = Object.values(apartments)
    return {
      total: apartmentList.length,
      available: apartmentList.filter((apt) => apt.status === "available").length,
      reserved: apartmentList.filter((apt) => apt.status === "reserved").length,
      sold: apartmentList.filter((apt) => apt.status === "sold").length,
    }
  },

  // Método para obtener el rango de precios
  getPriceRange: () => {
    const allApartments = Object.values(domePalermoData.apartmentData)
      .flat()
      .flatMap((floor) => Object.values(floor))
    const prices = allApartments
      .map((apt) => {
        const priceStr = apt.price.replace(/[$,]/g, "")
        return Number.parseInt(priceStr)
      })
      .filter((price) => !isNaN(price))

    if (prices.length === 0) return { min: 0, max: 0 }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  },
}
