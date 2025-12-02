const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Interfaces para tipado fuerte
export interface ProjectConfig {
  project: {
    id: number
    name: string
    description?: string
    location?: string
    status: string
    start_date?: string
    end_date?: string
    created_at: string
    updated_at: string
  }
  floorConfig: Record<number, FloorConfig>
  files: ProjectFile[]
  settings: Record<string, any>
  statistics: ProjectStatistics
}

export interface FloorConfig {
  id: number
  floor_number: number
  floor_name?: string
  view_box?: string
  background_image?: string
  apartment_config?: Record<string, any>
  apartments: Record<string, ApartmentConfig>
  statistics: FloorStatistics
}

export interface ApartmentConfig {
  id: number
  apartment_id: string
  apartment_name?: string
  status: "libre" | "reservado" | "ocupado" | "bloqueado"
  price: number
  area: number
  buyer_name?: string
  buyer_phone?: string
  buyer_email?: string
  reservation_date?: string
  sale_date?: string
  notes?: string
  svg_path?: any
  assigned_parkings: string[]
  parking_spots_count: number
}

export interface ParkingSpot {
  id: number
  parking_id: string
  level: number
  status: "libre" | "ocupado"
  svg_path?: any
  notes?: string
}

export interface ProjectFile {
  id: number
  file_name: string
  file_path: string
  file_type: "image" | "pdf" | "document" | "floor_plan" | "apartment_pdf" | "garage_plan" | "brochure" | "other"
  file_size?: number
  floor_number?: number
  apartment_id_code?: string
  level?: number
  uploaded_by?: number
  uploaded_by_name?: string
  created_at: string
  updated_at: string
}

export interface ProjectStatistics {
  total_floors: number
  total_apartments: number
  total_parking_spots: number
  apartments_by_status: {
    available: number
    reserved: number
    sold: number
    blocked: number
  }
  parking_by_status: {
    available: number
    occupied: number
  }
  financial?: {
    average_price: number
    total_value: number
    average_area: number
    total_area: number
  }
}

export interface FloorStatistics {
  total_apartments: number
  available: number
  reserved: number
  sold: number
  blocked: number
}

// Cache para mejorar rendimiento
const projectConfigCache = new Map<number, { data: ProjectConfig; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Función para validar IDs
const validateId = (id: any): number => {
  const numId = Number.parseInt(id)
  if (isNaN(numId) || numId <= 0) {
    throw new Error(`ID inválido: ${id}`)
  }
  return numId
}

// Función helper para hacer requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token")

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Función para obtener configuración completa de un proyecto
export const fetchProjectConfigById = async (projectId: number | string, token?: string): Promise<ProjectConfig> => {
  try {
    const validId = validateId(projectId)

    // Verificar cache
    const cached = projectConfigCache.get(validId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Usando configuración en cache para proyecto ${validId}`)
      return cached.data
    }

    console.log(`Obteniendo configuración del proyecto ${validId} desde API`)

    const authToken = token || localStorage.getItem("token")
    if (!authToken) {
      throw new Error("Token de autenticación no encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/projects/${validId}/configuration`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || "Error obteniendo configuración del proyecto")
    }

    const projectConfig: ProjectConfig = result.data

    // Guardar en cache
    projectConfigCache.set(validId, {
      data: projectConfig,
      timestamp: Date.now(),
    })

    console.log(`Configuración obtenida exitosamente para proyecto ${validId}`)
    return projectConfig
  } catch (error) {
    console.error("Error en fetchProjectConfigById:", error)
    throw error
  }
}

// Función para obtener estadísticas de un proyecto
export const fetchProjectStatistics = async (projectId: number | string): Promise<ProjectStatistics> => {
  try {
    const validId = validateId(projectId)

    const response = await apiRequest(`/projects/${validId}/statistics`)

    if (!response.success) {
      throw new Error(response.message || "Error obteniendo estadísticas")
    }

    return response.data
  } catch (error) {
    console.error("Error en fetchProjectStatistics:", error)
    throw error
  }
}

// Función para obtener estadísticas de un piso específico
export const fetchFloorData = async (projectId: number, floorNumber: number, forceRefresh = false): Promise<any> => {
  try {
    const validProjectId = validateId(projectId)
    const validFloorNumber = validateId(floorNumber)

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Token de autenticación no encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/projects/${validProjectId}/floors/${validFloorNumber}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch floor data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching floor data for project ${projectId}, floor ${floorNumber}:`, error)
    throw error
  }
}

// Función para obtener estadísticas del proyecto
export const fetchProjectStats = async (projectId: number, forceRefresh = false): Promise<any> => {
  try {
    const validProjectId = validateId(projectId)

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Token de autenticación no encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/projects/${validProjectId}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch project stats: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching project stats for project ${projectId}:`, error)
    throw error
  }
}

// Función para obtener pisos del proyecto
export const fetchProjectFloors = async (projectId: number): Promise<any[]> => {
  try {
    const validProjectId = validateId(projectId)

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Token de autenticación no encontrado")
    }

    const response = await fetch(`${API_BASE_URL}/projects/${validProjectId}/floors`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch project floors: ${response.status} ${response.statusText}`)
    }

    const floors = await response.json()
    return floors.data || []
  } catch (error) {
    console.error(`Error fetching floors for project ${projectId}:`, error)
    throw error
  }
}

// Función para obtener apartamentos del proyecto
export const fetchProjectApartments = async (projectId: number, floorNumber?: number): Promise<any[]> => {
  try {
    const validProjectId = validateId(projectId)

    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Token de autenticación no encontrado")
    }

    let url = `${API_BASE_URL}/projects/${validProjectId}/apartments`
    if (floorNumber) {
      url += `?floor=${floorNumber}`
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch project apartments: ${response.status} ${response.statusText}`)
    }

    const apartments = await response.json()
    return apartments.data || []
  } catch (error) {
    console.error(`Error fetching apartments for project ${projectId}:`, error)
    throw error
  }
}

// Función para actualizar apartamento
export const updateApartment = async (
  apartmentDbId: number,
  payload: any,
  projectId: number,
  floorNumber: number,
  token: string,
  isFormData = false,
): Promise<boolean> => {
  try {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
    }
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    let body: FormData | string
    if (isFormData) {
      body = new FormData()
      for (const key in payload) {
        if (payload.hasOwnProperty(key)) {
          if (payload[key] instanceof File) {
            ;(body as FormData).append(key, payload[key], payload[key].name)
          } else if (payload[key] !== undefined && payload[key] !== null) {
            ;(body as FormData).append(key, payload[key])
          }
        }
      }
    } else {
      body = JSON.stringify(payload)
    }

    const response = await fetch(`${API_BASE_URL}/apartments/${apartmentDbId}`, {
      method: "PUT",
      headers: headers,
      body: body,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error updating apartment:", errorData)
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    // Limpiar cache relacionado
    clearProjectCache(projectId)
    return true
  } catch (error) {
    console.error("Error in updateApartment service:", error)
    return false
  }
}

// Función helper para formatear precios
export const formatPrice = (price: number, currency = "USD"): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Función helper para formatear área
export const formatArea = (area: number, unit = "m²"): string => {
  return `${area.toFixed(1)} ${unit}`
}

// Función helper para obtener color por status
export const getStatusColor = (status: string): string => {
  const colors = {
    libre: "#10B981", // Verde
    reservado: "#F59E0B", // Amarillo
    ocupado: "#EF4444", // Rojo
    bloqueado: "#6B7280", // Gris
  }
  return colors[status as keyof typeof colors] || "#6B7280"
}

// Función helper para obtener texto en español por status
export const getStatusText = (status: string): string => {
  const texts = {
    libre: "Disponible",
    reservado: "Reservado",
    ocupado: "Vendido",
    bloqueado: "Bloqueado",
  }
  return texts[status as keyof typeof texts] || status
}

// Función para invalidar cache
export const invalidateProjectCache = (projectId?: number): void => {
  if (projectId) {
    projectConfigCache.delete(projectId)
  } else {
    projectConfigCache.clear()
  }
}

// Función para limpiar cache cuando sea necesario
export function clearProjectCache(projectId?: number) {
  if (projectId) {
    projectConfigCache.delete(projectId)
  } else {
    projectConfigCache.clear()
  }
}

// Función para obtener estadísticas resumidas
export const getProjectSummary = (config: ProjectConfig): string => {
  const { statistics } = config
  const totalApartments = statistics.total_apartments
  const availableApartments = statistics.apartments_by_status.available
  const occupancyRate =
    totalApartments > 0 ? (((totalApartments - availableApartments) / totalApartments) * 100).toFixed(1) : "0"

  return `${statistics.total_floors} pisos, ${totalApartments} apartamentos, ${occupancyRate}% ocupación`
}
