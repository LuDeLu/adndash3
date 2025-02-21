"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback } from "react"

type User = {
  email: string
  name: string
  rol: string
  avatarUrl?: string
} | null

type AuthContextType = {
  user: User
  login: (user: User, token: string, googleAccessToken: string) => void
  logout: () => void
  getGoogleAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)

  const SESSION_TIMEOUT = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

  const resetLogoutTimer = useCallback(() => {
    const expirationTime = new Date().getTime() + SESSION_TIMEOUT
    localStorage.setItem("sessionExpiration", expirationTime.toString())
  }, [])

  const checkSessionExpiration = useCallback(() => {
    const expirationTime = localStorage.getItem("sessionExpiration")
    if (expirationTime && new Date().getTime() > Number.parseInt(expirationTime, 10)) {
      logout()
    }
  }, [])

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData: User, token: string, googleAccessToken: string) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)
    localStorage.setItem("googleAccessToken", googleAccessToken)
    resetLogoutTimer()
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("googleAccessToken")
    localStorage.removeItem("sessionExpiration")
  }

  const getGoogleAccessToken = () => {
    return localStorage.getItem("googleAccessToken")
  }

  useEffect(() => {
    if (user) {
      resetLogoutTimer()
      const interval = setInterval(checkSessionExpiration, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [user, resetLogoutTimer, checkSessionExpiration])

  useEffect(() => {
    window.addEventListener("mousemove", resetLogoutTimer)
    window.addEventListener("keypress", resetLogoutTimer)
    return () => {
      window.removeEventListener("mousemove", resetLogoutTimer)
      window.removeEventListener("keypress", resetLogoutTimer)
    }
  }, [resetLogoutTimer])

  return <AuthContext.Provider value={{ user, login, logout, getGoogleAccessToken }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

