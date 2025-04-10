// API Service para manejar las peticiones a la API

const API_BASE_URL = "https://adndashboard.squareweb.app/api"

// Cache para almacenar datos y reducir llamadas a la API
const cache = {
  projectStats: new Map<number, ProjectStats>(),
  floorData: new Map<string, any>(),
  allFloorsData: new Map<number, Map<number, any>>(), // Nuevo: caché para todos los pisos de un proyecto
  lastFetch: new Map<string, number>(),
  // Tiempo de expiración de la caché en milisegundos (30 segundos)
  expirationTime: 30000,
}

export interface ProjectStats {
  available_units: number
  reserved_units: number
  sold_units: number
  total_units: number
  timestamp?: number
}

export async function fetchProjectStats(projectId: number, forceRefresh = false): Promise<ProjectStats> {
  const cacheKey = `project_${projectId}_stats`
  const now = Date.now()

  // Usar caché si está disponible y no ha expirado
  if (
    !forceRefresh &&
    cache.projectStats.has(projectId) &&
    now - (cache.lastFetch.get(cacheKey) || 0) < cache.expirationTime
  ) {
    return cache.projectStats.get(projectId)!
  }

  try {
    // Obtener los pisos del proyecto
    const floorsResponse = await fetch(`${API_BASE_URL}/floors/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!floorsResponse.ok) {
      throw new Error(`Error al obtener pisos: ${floorsResponse.statusText}`)
    }

    const floorsData = await floorsResponse.json()

    // Inicializar contadores
    let available = 0
    let reserved = 0
    let sold = 0

    // Para cada piso, obtener sus departamentos y contar por estado
    await Promise.all(
      floorsData.map(async (floor: any) => {
        const floorData = await fetchFloorData(projectId, floor.floor_number, forceRefresh)

        if (floorData && floorData.apartments) {
          Object.values(floorData.apartments).forEach((apt: any) => {
            if (apt.status === "libre") available++
            else if (apt.status === "reservado") reserved++
            else if (apt.status === "ocupado") sold++
          })
        }
      }),
    )

    const stats = {
      available_units: available,
      reserved_units: reserved,
      sold_units: sold,
      total_units: available + reserved + sold,
      timestamp: now,
    }

    // Actualizar caché
    cache.projectStats.set(projectId, stats)
    cache.lastFetch.set(cacheKey, now)

    return stats
  } catch (error) {
    console.error("Error fetching project stats:", error)

    // Si hay un error, devolver datos en caché si existen
    if (cache.projectStats.has(projectId)) {
      return cache.projectStats.get(projectId)!
    }

    // O valores por defecto
    return {
      available_units: 0,
      reserved_units: 0,
      sold_units: 0,
      total_units: 0,
    }
  }
}

export async function fetchFloorData(projectId: number, floorNumber: number, forceRefresh = false) {
  const cacheKey = `project_${projectId}_floor_${floorNumber}`
  const now = Date.now()

  // Usar caché si está disponible y no ha expirado
  if (
    !forceRefresh &&
    cache.floorData.has(cacheKey) &&
    now - (cache.lastFetch.get(cacheKey) || 0) < cache.expirationTime
  ) {
    return cache.floorData.get(cacheKey)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/floors/project/${projectId}/data/${floorNumber}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error al obtener datos del piso: ${response.statusText}`)
    }

    const data = await response.json()

    // Actualizar caché
    cache.floorData.set(cacheKey, data)
    cache.lastFetch.set(cacheKey, now)

    // También actualizar en la caché de todos los pisos
    if (!cache.allFloorsData.has(projectId)) {
      cache.allFloorsData.set(projectId, new Map())
    }
    cache.allFloorsData.get(projectId)!.set(floorNumber, data)

    return data
  } catch (error) {
    console.error(`Error fetching floor ${floorNumber} data:`, error)

    // Si hay un error, devolver datos en caché si existen
    if (cache.floorData.has(cacheKey)) {
      return cache.floorData.get(cacheKey)
    }

    return null
  }
}

// Nueva función para precargar todos los pisos de un proyecto
export async function preloadAllFloors(projectId: number) {
  try {
    // Obtener los pisos del proyecto
    const floorsResponse = await fetch(`${API_BASE_URL}/floors/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    if (!floorsResponse.ok) {
      throw new Error(`Error al obtener pisos: ${floorsResponse.statusText}`)
    }

    const floorsData = await floorsResponse.json()

    // Inicializar el mapa para este proyecto si no existe
    if (!cache.allFloorsData.has(projectId)) {
      cache.allFloorsData.set(projectId, new Map())
    }

    // Cargar datos de todos los pisos en paralelo
    await Promise.all(
      floorsData.map(async (floor: any) => {
        try {
          const floorData = await fetchFloorData(projectId, floor.floor_number, false)
          if (floorData) {
            cache.allFloorsData.get(projectId)!.set(floor.floor_number, floorData)
          }
        } catch (err) {
          console.error(`Error preloading floor ${floor.floor_number}:`, err)
        }
      }),
    )

    return true
  } catch (error) {
    console.error("Error preloading all floors:", error)
    return false
  }
}

// Función para obtener datos de un piso desde la caché (sin llamada a la API)
export function getFloorDataFromCache(projectId: number, floorNumber: number) {
  if (cache.allFloorsData.has(projectId) && cache.allFloorsData.get(projectId)!.has(floorNumber)) {
    return cache.allFloorsData.get(projectId)!.get(floorNumber)
  }

  // Si no está en la caché de todos los pisos, intentar en la caché individual
  const cacheKey = `project_${projectId}_floor_${floorNumber}`
  if (cache.floorData.has(cacheKey)) {
    return cache.floorData.get(cacheKey)
  }

  return null
}

// Función para invalidar la caché después de una actualización
export function invalidateCache(projectId: number, floorNumber?: number) {
  if (floorNumber) {
    // Invalidar datos específicos del piso
    const cacheKey = `project_${projectId}_floor_${floorNumber}`
    cache.floorData.delete(cacheKey)
    cache.lastFetch.delete(cacheKey)

    // También invalidar en la caché de todos los pisos
    if (cache.allFloorsData.has(projectId)) {
      cache.allFloorsData.get(projectId)!.delete(floorNumber)
    }
  }

  // Invalidar estadísticas del proyecto
  cache.projectStats.delete(projectId)
  cache.lastFetch.delete(`project_${projectId}_stats`)
}

// Función para actualizar un departamento y refrescar la caché inmediatamente
export async function updateApartment(
  apartmentId: number,
  data: any,
  projectId: number,
  floorNumber: number,
): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/apartments/${apartmentId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Error al actualizar departamento: ${response.statusText}`)
    }

    // Invalidar caché para este proyecto y piso
    invalidateCache(projectId, floorNumber)

    return true
  } catch (error) {
    console.error("Error updating apartment:", error)
    return false
  }
}
