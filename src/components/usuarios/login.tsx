"use client"

import type React from "react"

import { useState } from "react"
import { useGoogleLogin } from "@react-oauth/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useAuth } from "../../app/auth/auth-context"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const API_BASE_URL = "https://adndashboard.squareweb.app/api"

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(JSON.stringify(errorData))
      }

      const data = await response.json()
      login(
        {
          email: data.user.email,
          name: data.user.nombre,
          rol: data.user.rol,
          userId: data.user.id || data.user.userId || 0,
        },
        data.token,
        data.refreshToken || "", // Nuevo: refresh token
        "", // Empty string for googleAccessToken since this is email login
      )
    } catch (error) {
      console.error("Error during login:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError(null)
      setLoading(true)
      try {
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json())

        const serverResponse = await fetch(`${API_BASE_URL}/auth/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            googleId: userInfo.sub,
          }),
        })

        if (serverResponse.ok) {
          const data = await serverResponse.json()
          login(
            {
              email: userInfo.email,
              name: userInfo.name,
              rol: data.user.rol,
              userId: data.user.id || data.user.userId || 0,
            },
            data.token,
            data.refreshToken || "", // Nuevo: refresh token
            tokenResponse.access_token, // Google access token
          )
        } else {
          const errorData = await serverResponse.json()
          setError(errorData.error || "Error al iniciar sesión con Google")
        }
      } catch (error) {
        console.error("Error during Google login:", error)
        setError("Error al conectar con el servidor")
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      setError("Error al iniciar sesión con Google")
      setLoading(false)
    },
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-zinc-900/90 border-zinc-800 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden mb-4">
            <Image
              src="/images/logo/adn-developers-logo-big.png"
              alt="ADN Developers"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-white">ADN Developers Dashboard</CardTitle>
          <CardDescription className="text-zinc-400">Accede a tu cuenta para gestionar el Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Tu correo electrónico..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-cyan-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="relative w-full mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700"></span>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-zinc-900 px-2 text-zinc-500">O continuar con</span>
            </div>
          </div>
          <Button
            onClick={() => googleLogin()}
            variant="outline"
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            disabled={loading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="h-5 w-5 mr-2">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Iniciar sesión con Google
          </Button>
          <p className="text-xs text-zinc-500 text-center mt-6">
            © 2025 ADN Developers. Todos los derechos reservados.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
