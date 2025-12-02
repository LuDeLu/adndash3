/**
 * Cliente API centralizado con manejo automático de autenticación
 * - Añade automáticamente el token a las peticiones
 * - Refresca el token cuando expira
 * - Hace logout automático cuando la sesión es inválida
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

// Estado para evitar múltiples refreshes simultáneos
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

// Cola de peticiones pendientes mientras se refresca el token
type QueuedRequest = {
  resolve: (value: boolean) => void
  reject: (reason?: unknown) => void
}
let failedRequestsQueue: QueuedRequest[] = []

// Función para obtener el token actual
const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

// Función para obtener el refresh token
const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("refreshToken")
}

// Función para actualizar tokens
const setTokens = (token: string, refreshToken?: string) => {
  localStorage.setItem("token", token)
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken)
  }
}

// Función para limpiar sesión (logout)
const clearSession = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")
  localStorage.removeItem("googleAccessToken")
  localStorage.removeItem("lastActivity")

  // Disparar evento para que el AuthContext detecte el cambio
  window.dispatchEvent(new StorageEvent("storage", { key: "token", newValue: null }))
}

// Función para refrescar el token
const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    console.log("[API Client] No refresh token available")
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      console.log("[API Client] Refresh token failed:", response.status)
      return false
    }

    const data = await response.json()
    setTokens(data.token, data.refreshToken)

    // Actualizar usuario si viene en la respuesta
    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.user.email,
          name: data.user.nombre,
          rol: data.user.rol,
          userId: data.user.id,
        }),
      )
    }

    console.log("[API Client] Token refreshed successfully")
    return true
  } catch (error) {
    console.error("[API Client] Error refreshing token:", error)
    return false
  }
}

// Procesar cola de peticiones después del refresh
const processQueue = (success: boolean) => {
  failedRequestsQueue.forEach((request) => {
    if (success) {
      request.resolve(true)
    } else {
      request.reject(new Error("Session expired"))
    }
  })
  failedRequestsQueue = []
}

// Manejar refresh con cola de peticiones
const handleTokenRefresh = async (): Promise<boolean> => {
  if (isRefreshing) {
    // Si ya se está refrescando, encolar esta petición
    return new Promise((resolve, reject) => {
      failedRequestsQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    const success = await refreshAccessToken()
    processQueue(success)
    return success
  } finally {
    isRefreshing = false
    refreshPromise = null
  }
}

// Tipos para las opciones de fetch
type FetchOptions = RequestInit & {
  skipAuth?: boolean
  skipRefresh?: boolean
}

// Cliente fetch con manejo de autenticación
export const apiClient = async <T = unknown>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { skipAuth = false, skipRefresh = false, ...fetchOptions } = options

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`

  // Preparar headers
  const headers = new Headers(fetchOptions.headers)

  // Añadir token si no se salta auth
  if (!skipAuth) {
    const token = getToken()
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
  }

  // Añadir Content-Type si no está definido y hay body
  if (fetchOptions.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  // Hacer la petición
  let response = await fetch(url, {
    ...fetchOptions,
    headers,
  })

  // Si el token expiró, intentar refrescar
  if (response.status === 401 && !skipAuth && !skipRefresh) {
    const data = await response.json().catch(() => ({}))

    if (data.code === "TOKEN_EXPIRED" || data.error === "Token expired") {
      console.log("[API Client] Token expired, attempting refresh...")

      const refreshSuccess = await handleTokenRefresh()

      if (refreshSuccess) {
        // Reintentar la petición con el nuevo token
        const newToken = getToken()
        if (newToken) {
          headers.set("Authorization", `Bearer ${newToken}`)
        }

        response = await fetch(url, {
          ...fetchOptions,
          headers,
        })
      } else {
        // Refresh falló, hacer logout
        console.log("[API Client] Refresh failed, clearing session")
        clearSession()
        throw new Error("Session expired")
      }
    } else if (data.code === "INVALID_TOKEN" || data.code === "NO_TOKEN") {
      // Token inválido o no existe, hacer logout
      console.log("[API Client] Invalid token, clearing session")
      clearSession()
      throw new Error("Invalid session")
    }
  }

  // Manejar errores de autorización
  if (response.status === 403) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || "Access denied")
  }

  // Manejar otros errores
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`)
  }

  // Parsear respuesta
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return response.json()
  }

  return response.text() as unknown as T
}

// Métodos de conveniencia
export const api = {
  get: <T = unknown>(endpoint: string, options?: FetchOptions) => apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = unknown>(endpoint: string, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
}

// Hook para usar en componentes que necesiten saber si hay error de sesión
export const isSessionError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message === "Session expired" || error.message === "Invalid session"
  }
  return false
}

export default api
