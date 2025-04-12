"use client"

import type React from "react"
import { useAuth } from "@/app/auth/auth-context"
import Login from "@/components/usuarios/login"
import { Navigation } from "@/components/Navigation"
import UserMenu from "@/components/UserMenu"

// Componente interno para manejar la autenticación
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  // Mientras verifica la autenticación, muestra un loader
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-gray-800"></div>
      </div>
    )
  }

  // Si no hay usuario autenticado, muestra el login
  if (!user) {
    return <Login />
  }

  // Si hay usuario autenticado, muestra el layout con navegación
  return (
    <div className="flex h-screen bg-black">
      <Navigation />
      <main className="flex-1 overflow-auto p-6 bg-black text-white">
        {/* Añadimos el UserMenu en la parte superior derecha */}
        <div className="flex justify-end mb-4">
          <UserMenu />
        </div>
        {children}
      </main>
    </div>
  )
}

export default AuthenticatedLayout
