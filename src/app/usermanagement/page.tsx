"use client"

import UserManagement from "@/components/config/roles"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useAuth } from "@/app/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UserManagementPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Verificar si el usuario tiene permisos de administrador
  useEffect(() => {
    if (user && user.rol !== "admin") {
      router.push("/proyectos")
    }
  }, [user, router])

  if (user?.rol !== "admin") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-red-500">No tienes permisos para acceder a esta página</p>
      </div>
    )
  }

  return (
    <>
      <UserManagement />
      <SpeedInsights />
    </>
  )
}
