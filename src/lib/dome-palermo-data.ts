// Datos completos del proyecto DOME Palermo Residence basados en la base de datos

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
}

export interface ParkingSpot {
  id: string
  level: GarageLevel
  status: ApartmentStatus
  assignedTo: string | null
  path: string
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
    totalUnits: 26,
    availableUnits: 16,
    reservedUnits: 2,
    soldUnits: 8,
    floors: 9,
    brochure: "https://adndevelopers.com.ar/wp-content/uploads/2023/01/Brochure_DOME-Palermo-Residence.pdf",
  },

  // Configuración de pisos basada en la BD
  floorsConfig: {
    floorRange: [1, 2, 3, 4, 5, 6, 7, 8, 9] as FloorNumber[],
    totalFloors: 9,
    garageLevels: [1, 2, 3] as GarageLevel[],
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
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!3d3284.955759537342!2d-58.415668523393144!3d-34.57998595624697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb579134f34b3%3A0x6d06db0893f18a5b!2sRep%C3%BAblica%20%C3%81rabe%20Siria%20%26%20Cabello%2C%20C1425%20Cdad.%20Aut%C3%B3noma%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1733140225777!5m2!1ses!2sar",
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
      size: "60-140 m²",
      type: "Local",
      status: "Finalizados",
      priceRange: "$100,000 - $150,000",
    },
    {
      size: "150-250 m²",
      type: "4 Ambientes",
      status: "Listo para habitar",
      priceRange: "$160,000 - $300,000",
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
    totalSpots: 13,
    parkingInfo:
      "Disponemos de 50 espacios de estacionamiento subterráneo. Costo adicional de $15,000 por unidad. Acceso con tarjeta magnética y vigilancia 24/7.",
    spotsPerLevel: {
      1: 13,
      2: 0,
      3: 0,
    },
  },

  // Datos de departamentos por piso (basados en la BD)
  apartmentData: {
    1: {
      "1A": {
        id: "1A",
        buyer: "",
        date: "",
        price: "$774,200",
        status: "available" as ApartmentStatus,
        surface: "181,55 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "1B": {
        id: "1B",
        buyer: "Camila Belen Granado",
        date: "",
        price: "$820,900",
        status: "reserved" as ApartmentStatus,
        surface: "183,35 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "1C": {
        id: "1C",
        buyer: "",
        date: "",
        price: "$667,600",
        status: "available" as ApartmentStatus,
        surface: "154,25 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    2: {
      "2A": {
        id: "2A",
        buyer: "",
        date: "",
        price: "$774,200",
        status: "available" as ApartmentStatus,
        surface: "181,55 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "2B": {
        id: "2B",
        buyer: "",
        date: "",
        price: "$820,900",
        status: "available" as ApartmentStatus,
        surface: "183,35 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "2C": {
        id: "2C",
        buyer: "",
        date: "",
        price: "$667,600",
        status: "available" as ApartmentStatus,
        surface: "154,25 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    3: {
      "3A": {
        id: "3A",
        buyer: "Luciano Florentino",
        date: "2023-09-27",
        price: "$774,200",
        status: "sold" as ApartmentStatus,
        surface: "181,55 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "3B": {
        id: "3B",
        buyer: "Pedro Ramírez",
        date: "2023-09-05",
        price: "$820,900",
        status: "sold" as ApartmentStatus,
        surface: "183,35 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "3C": {
        id: "3C",
        buyer: "",
        date: "",
        price: "$667,600",
        status: "available" as ApartmentStatus,
        surface: "154,25 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    4: {
      "4A": {
        id: "4A",
        buyer: "",
        date: "",
        price: "$774,200",
        status: "available" as ApartmentStatus,
        surface: "181,55 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "4B": {
        id: "4B",
        buyer: "",
        date: "",
        price: "$820,900",
        status: "available" as ApartmentStatus,
        surface: "183,35 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "4C": {
        id: "4C",
        buyer: "",
        date: "",
        price: "$667,600",
        status: "available" as ApartmentStatus,
        surface: "154,25 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    5: {
      "5A": {
        id: "5A",
        buyer: "Carlos Hernández",
        date: "2024-01-23",
        price: "$774,200",
        status: "sold" as ApartmentStatus,
        surface: "181,55 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "5B": {
        id: "5B",
        buyer: "Javier Martínez",
        date: "2023-11-20",
        price: "$820,900",
        status: "sold" as ApartmentStatus,
        surface: "183,35 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "5C": {
        id: "5C",
        buyer: "Laura Fernández",
        date: "2024-09-04",
        price: "$667,600",
        status: "sold" as ApartmentStatus,
        surface: "154,25 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    6: {
      "6A": {
        id: "6A",
        buyer: "",
        date: "",
        price: "$774,200",
        status: "available" as ApartmentStatus,
        surface: "181,55 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "6B": {
        id: "6B",
        buyer: "Mariano Nicolas Aldrede",
        date: "2023-07-14",
        price: "$820,900",
        status: "sold" as ApartmentStatus,
        surface: "183,35 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "6C": {
        id: "6C",
        buyer: "",
        date: "2023-12-25",
        price: "$667,600",
        status: "reserved" as ApartmentStatus,
        surface: "154,25 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    7: {
      "7A": {
        id: "7A",
        buyer: "",
        date: "",
        price: "$774,200",
        status: "available" as ApartmentStatus,
        surface: "181,55 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "7B": {
        id: "7B",
        buyer: "Mariano Nicolas Aldrede",
        date: "2023-07-14",
        price: "$820,900",
        status: "sold" as ApartmentStatus,
        surface: "183,35 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "7C": {
        id: "7C",
        buyer: "",
        date: "2023-12-25",
        price: "$667,600",
        status: "available" as ApartmentStatus,
        surface: "154,25 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    8: {
      "8A": {
        id: "8A",
        buyer: "",
        date: "",
        price: "$950,000",
        status: "available" as ApartmentStatus,
        surface: "220 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "8B": {
        id: "8B",
        buyer: "Mariano Nicolas Aldrede",
        date: "2023-07-14",
        price: "$1,100,000",
        status: "sold" as ApartmentStatus,
        surface: "250 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "8C": {
        id: "8C",
        buyer: "",
        date: "2023-12-25",
        price: "$890,000",
        status: "available" as ApartmentStatus,
        surface: "200 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
    },
    9: {
      "9A": {
        id: "9A",
        buyer: "",
        date: "",
        price: "$1,200,000",
        status: "available" as ApartmentStatus,
        surface: "280 m²",
        phoneNumber: "",
        email: "",
        assignedParkings: [],
      },
      "9B": {
        id: "9B",
        buyer: "asd",
        date: "",
        price: "$1,350,000",
        status: "available" as ApartmentStatus,
        surface: "320 m²",
        phoneNumber: "01163665344",
        email: "",
        assignedParkings: [],
      },
    },
  } as Record<FloorNumber, Record<string, ApartmentData>>,

  // Paths SVG para cada departamento
  svgPaths: {
    1: {
      "1A": "M136,509 L126,2004 L764,2001 L767,1918 L1209,1915 L1207,1999 L1218,2001 L1221,1692 L1635,1692 L1639,1544 L1224,1543 L1227,1291 L1430,1292 L1424,899 L1219,902 L1216,578 L506,575 L504,455 Z",
      "1B": "M3111,2317 L1421,2314 L1418,2007 L1209,2004 L1209,1680 L1635,1683 L2078,1683 L2084,1270 L3117,1270 Z",
      "1C": "M3111,1276 L3114,300 L2298,303 L2304,214 L1206,366 L1212,904 L1415,910 L1418,1288 L1674,1291 L1677,1115 L1879,1109 L1879,1285 Z",
    },
    2: {
      "2A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "2B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "2C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    // Los pisos 3-7 usan los mismos paths que el piso 2
    3: {
      "3A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "3B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "3C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    4: {
      "4A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "4B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "4C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    5: {
      "5A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "5B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "5C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    6: {
      "6A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "6B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "6C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    7: {
      "7A": "M138,2013 L1224,2019 L1221,1704 L1638,1716 L1638,1555 L1221,1552 L1224,1303 L1424,1300 L1421,913 L1224,904 L1215,232 L168,372 L171,396 L207,396 L204,514 L135,526 Z",
      "7B": "M3111,2325 L1418,2325 L1421,2016 L1215,2013 L1227,1701 L2075,1698 L2087,1294 L3253,1291 L3259,2290 L3230,2290 L3230,2260 L3114,2260 Z",
      "7C": "M1882,1300 L3248,1294 L3259,749 L3242,755 L3239,794 L3117,791 L3123,83 L3096,80 L3096,113 L1912,277 L1915,158 L1959,155 L1953,128 L1209,232 L1218,907 L1424,916 L1418,1300 L1671,1294 L1671,1124 L1876,1130 Z",
    },
    8: {
      "8A": "M854,1776 L203,1786 L208,420 L605,414 L595,351 L1341,255 L1346,1304 L1754,1304 L1754,1447 L1346,1463 L1346,1702 L859,1712 Z",
      "8B": "M1346,1447 L1341,1702 L1558,1712 L1558,1792 L1748,1792 L1748,2094 L3114,2094 L3108,1087 L2436,1087 L2431,1214 L2251,1220 L2256,1431 Z",
      "8C": "M3119,1092 L2426,1082 L2426,1008 L2045,1018 L2039,838 L2436,817 L2442,626 L1965,626 L1976,838 L1817,838 L1817,1008 L1346,1008 L1346,255 L3124,22 Z",
    },
    9: {
      "9A": "M22,342 L26,1335 L1599,1335 L1602,1054 L1449,1054 L1442,926 L1001,929 L1001,214 Z",
      "9B": "M1342,1332 L1342,1613 L2345,1610 L2352,26 L1001,217 L994,342 L1175,346 L1178,679 L1783,683 L1783,1047 L1606,1051 L1606,1325 Z",
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
    "1A": "/resi/uf101.pdf",
    "1B": "/resi/ufuf102.pdf",
    "1C": "/resi/ufuf103.pdf",
    "2A": "/resi/ufuf201-601.pdf",
    "2B": "/resi/ufuf202-602.pdf",
    "2C": "/resi/ufuf203-603.pdf",
    "3A": "/resi/ufuf201-601.pdf",
    "3B": "/resi/ufuf202-602.pdf",
    "3C": "/resi/ufuf203-603.pdf",
    "4A": "/resi/ufuf201-601.pdf",
    "4B": "/resi/ufuf202-602.pdf",
    "4C": "/resi/ufuf203-603.pdf",
    "5A": "/resi/ufuf201-601.pdf",
    "5B": "/resi/ufuf202-602.pdf",
    "5C": "/resi/ufuf203-603.pdf",
    "6A": "/resi/ufuf201-601.pdf",
    "6B": "/resi/ufuf202-602.pdf",
    "6C": "/resi/ufuf203-603.pdf",
    "7A": "/resi/ufuf701.pdf",
    "8A": "/resi/ufuf801.pdf",
    "8B": "/resi/ufuf802.pdf",
    "8C": "/resi/ufuf803.pdf",
    "9A": "/resi/ufuf901.pdf",
    "9B": "/resi/ufuf902.pdf",
  } as Record<string, string>,

  // Cocheras (basado en la BD)
  parkingSpots: [
    {
      id: "P1",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M571,885 L640,1391 L737,1405 L817,1369 L753,869 L668,865 Z",
    },
    {
      id: "P2",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M862,845 L926,1349 L1039,1373 L1120,1321 L1055,841 L1007,816 L951,824 L910,833 Z",
    },
    {
      id: "P3",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1164,811 L1221,1311 L1318,1319 L1394,1303 L1418,1255 L1350,779 L1245,783 Z",
    },
    {
      id: "P4",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1455,763 L1531,1271 L1636,1279 L1717,1243 L1644,730 Z",
    },
    {
      id: "P5",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1761,722 L1826,1227 L1911,1243 L2011,1214 L1943,694 Z",
    },
    {
      id: "P6",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M2060,685 L2140,1193 L2229,1209 L2318,1177 L2253,660 Z",
    },
    {
      id: "P7",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M2374,654 L2447,1150 L2544,1158 L2625,1122 L2552,625 Z",
    },
    {
      id: "P8",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M2681,639 L2754,1107 L2850,1115 L2931,1083 L2862,578 L2681,607 Z",
    },
    {
      id: "P9",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M2992,560 L3064,1064 L3165,1076 L3250,1036 L3169,535 Z",
    },
    {
      id: "P10",
      level: 1 as GarageLevel,
      status: "sold" as ApartmentStatus,
      assignedTo: "1-1B",
      path: "M3520,1198 L4020,1198 L4020,1384 L3520,1392 L3488,1307 Z",
    },
    {
      id: "P11",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M3512,1497 L4020,1501 L4028,1670 L3524,1687 L3496,1586 Z",
    },
    {
      id: "P12",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1253,2522 L1435,2522 L1427,2009 L1338,1985 L1245,2017 Z",
    },
    {
      id: "P13",
      level: 1 as GarageLevel,
      status: "available" as ApartmentStatus,
      assignedTo: null,
      path: "M1552,2013 L1552,2518 L1741,2522 L1729,2017 L1644,1989 Z",
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
      occupancyRate: Math.round((soldUnits / totalUnits) * 100),
    }
  },
}
