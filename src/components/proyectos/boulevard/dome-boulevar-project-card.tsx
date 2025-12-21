"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Users, Eye, LampFloorIcon as FloorPlan, ImageIcon } from "lucide-react"
import { getBoulevardProjectStats } from "@/lib/dome-boulevar-data"
import Image from "next/image"

type BoulevardProjectCardProps = {
  onViewProject: () => void
  onViewFloorPlans: () => void
  onViewGallery: () => void
}

export function DomeBoulevardProjectCard({
  onViewProject,
  onViewFloorPlans,
  onViewGallery,
}: BoulevardProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const stats = getBoulevardProjectStats()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const occupancyRate = Math.round(((stats.soldUnits + stats.reservedUnits) / stats.totalUnits) * 100)

  return (
    <Card
      className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src="/images/logo/palermobou.webp"
          alt="DOME Cerviño Boulevard"
          fill
          className={`object-cover transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badge de estado */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-green-500 text-white">
            {stats.availableUnits} Disponibles
          </Badge>
        </div>

        {/* Precio destacado */}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-90">Desde</p>
          <p className="text-xl font-bold">{formatPrice(455300)}</p>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/logo/palermobou.webp"
              alt="DOME Boulevar Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">DOME Cerviño Boulevard</CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                Cerviño 3941, Palermo
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {occupancyRate}% Vendido
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descripción */}
        <p className="text-sm text-gray-600 line-clamp-2">
          Exclusivo desarrollo inmobiliario en el corazón de Palermo con unidades de 2 y 3 dormitorios, amenities de
          primer nivel y cocheras.
        </p>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium">{stats.totalUnits}</p>
              <p className="text-gray-500">Unidades</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-500" />
            <div>
              <p className="font-medium">12</p>
              <p className="text-gray-500">Pisos</p>
            </div>
          </div>
        </div>

        {/* Tipos de unidades */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Tipos de Unidades:</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              2 Dormitorios
            </Badge>
            <Badge variant="outline" className="text-xs">
              3 Dormitorios
            </Badge>
            <Badge variant="outline" className="text-xs">
              3 Dorm c/Palier
            </Badge>
          </div>
        </div>

        {/* Amenities destacados */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Amenities:</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              Piscina Rooftop
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Gimnasio
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Coworking
            </Badge>
            <Badge variant="secondary" className="text-xs">
              +9 más
            </Badge>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-1 gap-2 pt-2">
          <Button onClick={onViewProject} className="w-full" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Proyecto Completo
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onViewFloorPlans} variant="outline" size="sm">
              <FloorPlan className="h-4 w-4 mr-1" />
              Planos
            </Button>
            <Button onClick={onViewGallery} variant="outline" size="sm">
              <ImageIcon className="h-4 w-4 mr-1" />
              Galería
            </Button>
          </div>
        </div>

        {/* Información de contacto rápida */}
        <div className="border-t pt-3 text-center">
          <p className="text-xs text-gray-500">Consulte por promociones vigentes y descuentos por pago contado</p>
        </div>
      </CardContent>
    </Card>
  )
}
