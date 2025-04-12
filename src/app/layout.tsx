import type React from "react"
import { Inter } from "next/font/google"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "@/app/auth/auth-context"
import AuthenticatedLayout from "@/app/client-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId="373681027354-rjlbr8uhb7ltni7fd5ljjmm070g56pen.apps.googleusercontent.com">
          <AuthProvider>
            <AuthenticatedLayout>{children}</AuthenticatedLayout>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
