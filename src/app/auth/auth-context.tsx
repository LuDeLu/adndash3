"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback, useRef } from "react"

type User = {
  email: string
  userId: number
  name: string
  rol: string
  avatarUrl?: string
} | null

type AuthContextType = {
  user: User
  login: (user: User, token: string, refreshToken: string, googleAccessToken?: string) => void
  logout: () => void
  getGoogleAccessToken: () => string | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"

const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000 // Refrescar cada 30 minutos
const SESSION_ACTIVITY_TIMEOUT = 8 * 60 * 60 * 1000 // 8 horas de inactividad máxima

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const activityTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRefreshingRef = useRef(false)
  const lastActivityRef = useRef<number>(Date.now())

  const logout = useCallback(() => {
    console.log("[Auth] Cerrando sesión...")
    setUser(null)
    setIsAuthenticated(false)

    // Limpiar localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("googleAccessToken")
    localStorage.removeItem("lastActivity")

    // Limpiar intervalos
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current)
      activityTimeoutRef.current = null
    }
  }, [])

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    // Evitar múltiples refreshes simultáneos
    if (isRefreshingRef.current) {
      console.log("[Auth] Refresh ya en progreso, saltando...")
      return true
    }

    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      console.log("[Auth] No hay refresh token disponible")
      return false
    }

    isRefreshingRef.current = true

    try {
      console.log("[Auth] Refrescando token...")
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        console.log("[Auth] Error al refrescar token:", response.status)
        return false
      }

      const data = await response.json()

      // Actualizar tokens en localStorage
      localStorage.setItem("token", data.token)
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken)
      }

      // Actualizar usuario si viene en la respuesta
      if (data.user) {
        const userData = {
          email: data.user.email,
          name: data.user.nombre,
          rol: data.user.rol,
          userId: data.user.id,
        }
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)
      }

      console.log("[Auth] Token refrescado exitosamente")
      return true
    } catch (error) {
      console.error("[Auth] Error al refrescar token:", error)
      return false
    } finally {
      isRefreshingRef.current = false
    }
  }, [])

  const validateExistingToken = useCallback(async (): Promise<boolean> => {
    const token = localStorage.getItem("token")
    if (!token) return false

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        return true
      }

      // Si el token expiró, intentar refrescar
      if (response.status === 401) {
        const data = await response.json()
        if (data.code === "TOKEN_EXPIRED") {
          console.log("[Auth] Token expirado, intentando refrescar...")
          return await refreshAccessToken()
        }
      }

      return false
    } catch (error) {
      console.error("[Auth] Error validando token:", error)
      // En caso de error de red, asumimos que el token es válido para no cerrar sesión innecesariamente
      return true
    }
  }, [refreshAccessToken])

  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now()
    localStorage.setItem("lastActivity", lastActivityRef.current.toString())
  }, [])

  const checkActivityTimeout = useCallback(() => {
    const lastActivity = lastActivityRef.current
    const now = Date.now()

    if (now - lastActivity > SESSION_ACTIVITY_TIMEOUT) {
      console.log("[Auth] Sesión expirada por inactividad")
      logout()
      return false
    }
    return true
  }, [logout])

  const login = useCallback(
    (userData: User, token: string, refreshToken: string, googleAccessToken?: string) => {
      console.log("[Auth] Iniciando sesión para:", userData?.email)

      setUser(userData)
      setIsAuthenticated(true)

      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", token)
      localStorage.setItem("refreshToken", refreshToken)

      if (googleAccessToken) {
        localStorage.setItem("googleAccessToken", googleAccessToken)
      }

      updateActivity()
    },
    [updateActivity],
  )

  const getGoogleAccessToken = useCallback(() => {
    return localStorage.getItem("googleAccessToken")
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("[Auth] Inicializando autenticación...")

      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("token")
      const lastActivity = localStorage.getItem("lastActivity")

      if (lastActivity) {
        lastActivityRef.current = Number.parseInt(lastActivity, 10)
      }

      if (storedUser && storedToken) {
        // Verificar timeout por inactividad primero
        if (!checkActivityTimeout()) {
          setIsLoading(false)
          return
        }

        // Validar el token con el servidor
        const isValid = await validateExistingToken()

        if (isValid) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setIsAuthenticated(true)
            console.log("[Auth] Sesión restaurada para:", userData.email)
          } catch (e) {
            console.error("[Auth] Error parsing stored user:", e)
            logout()
          }
        } else {
          console.log("[Auth] Token inválido, cerrando sesión")
          logout()
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [validateExistingToken, checkActivityTimeout, logout])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Limpiar intervalo si no hay sesión
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
      return
    }

    console.log("[Auth] Configurando refresh automático de tokens")

    // Refrescar token periódicamente
    refreshIntervalRef.current = setInterval(async () => {
      if (!checkActivityTimeout()) return

      const success = await refreshAccessToken()
      if (!success) {
        console.log("[Auth] Fallo en refresh automático, cerrando sesión")
        logout()
      }
    }, TOKEN_REFRESH_INTERVAL)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
        refreshIntervalRef.current = null
      }
    }
  }, [isAuthenticated, user, refreshAccessToken, checkActivityTimeout, logout])

  useEffect(() => {
    if (!isAuthenticated) return

    const handleActivity = () => {
      updateActivity()
    }

    // Eventos que indican actividad
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"]

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [isAuthenticated, updateActivity])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        // Token fue removido en otra pestaña
        console.log("[Auth] Sesión cerrada en otra pestaña")
        setUser(null)
        setIsAuthenticated(false)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        getGoogleAccessToken,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
