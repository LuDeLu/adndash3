import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { AuthProvider } from "@/app/auth/auth-context"
import AuthenticatedLayout from "@/app/client-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "ADN Developers | Panel de Control",
    template: "%s | ADN Developers",
  },
  description: "Sistema de gestión integral para proyectos inmobiliarios de ADN Developers",
  icons: {
    icon: "/images/logo/adn-developers-logo-big.png",
    shortcut: "/images/logo/adn-developers-logo-big.png",
    apple: "/images/logo/adn-developers-logo-big.png",
  },
}

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
