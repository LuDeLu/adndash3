"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useAuth } from "@/app/auth/auth-context"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/proyectos")
    }
  }, [user, router])

  // La página principal solo sirve como redirección
  // El login se maneja en el layout principal
  return <SpeedInsights />
}
