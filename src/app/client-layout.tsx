"use client"

import type React from "react"
import { useAuth } from "@/app/auth/auth-context"
import Login from "@/components/usuarios/login"
import { Navigation } from "@/components/Navigation"
import UserMenu from "@/components/UserMenu"
import { useEffect, useState } from "react"
import Image from "next/image"

// Hook para detectar móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

// Componente de loading mejorado
function LoadingScreen() {
  const [loadingText, setLoadingText] = useState("Iniciando...")

  useEffect(() => {
    const texts = ["Iniciando...", "Cargando datos...", "Preparando interfaz...", "Casi listo..."]
    let index = 0

    const interval = setInterval(() => {
      index = (index + 1) % texts.length
      setLoadingText(texts[index])
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="text-center space-y-6">
        {/* Logo animado */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
            <Image
              src="/images/logo/adn-developers-logo-big.png"
              alt="ADN Developers"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div
            className="absolute inset-0 w-24 h-24 mx-auto border-4 border-cyan-500/30 rounded-2xl animate-spin"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute inset-0 w-24 h-24 mx-auto border-4 border-indigo-500/20 rounded-2xl animate-spin"
            style={{ animationDuration: "4s", animationDirection: "reverse" }}
          ></div>
        </div>

        {/* Texto de carga */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">ADN Developers</h2>
          <p className="text-gray-400 text-sm animate-pulse">{loadingText}</p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full animate-pulse w-3/4"></div>
        </div>

        {/* Puntos de carga */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
    </div>
  )
}

// Componente interno para manejar la autenticación
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const isMobile = useIsMobile()
  const [isHydrated, setIsHydrated] = useState(false)

  // Manejar hidratación
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Mientras verifica la autenticación, muestra un loader
  if (isLoading || !isHydrated) {
    return <LoadingScreen />
  }

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Login />
      </div>
    )
  }

  // Layout para móvil
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pb-safe">
          <div className="min-h-[calc(100vh-4rem)] bg-background">
            <div className="px-4 py-6 space-y-6 max-w-full overflow-x-hidden">{children}</div>
          </div>
        </main>
      </div>
    )
  }

  // Layout para desktop
  return (
    <div className="h-screen  overflow-hidden flex">
      <div className="flex-shrink-0">
        <Navigation />
      </div>
      <main className="flex-1 flex flex-col min-w-0  text-white">
        <div className="flex justify-between items-center p-6 flex-shrink-0">
          <div className="ml-auto">
            <UserMenu />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  )
}

export default AuthenticatedLayout
