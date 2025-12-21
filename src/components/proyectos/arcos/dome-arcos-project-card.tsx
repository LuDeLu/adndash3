"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Users, Eye, FlowerIcon as FloorPlan, ImageIcon } from "lucide-react"
import { arcosProjectInfo, getArcosProjectStats, formatArcosPrice } from "@/lib/dome-arcos-data"
import Image from "next/image"

type ArcosProjectCardProps = {
  onViewProject: () => void
  onViewFloorPlans: () => void
  onViewGallery: () => void
}

export default function ArcosProjectCard({ onViewProject, onViewFloorPlans, onViewGallery }: ArcosProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const stats = getArcosProjectStats()

  return (
    <Card
      className="w-full max-w-md mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen principal */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={arcosProjectInfo.image || "/placeholder.svg"}
          alt={arcosProjectInfo.name}
          fill
          className={`object-cover transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Badge de estado */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-green-500 text-white">
            {stats.available} Disponibles
          </Badge>
        </div>

        {/* Precio destacado */}
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-sm opacity-90">Desde</p>
          <p className="text-xl font-bold">{formatArcosPrice(138000)}</p>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src={arcosProjectInfo.logo || "/placeholder.svg"}
              alt="Arcos Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">{arcosProjectInfo.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {arcosProjectInfo.location}
              </div>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {stats.occupancyRate}% Vendido
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Descripción */}
        <p className="text-sm text-gray-600 line-clamp-2">{arcosProjectInfo.description}</p>

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
              <p className="font-medium">{arcosProjectInfo.totalFloors}</p>
              <p className="text-gray-500">Pisos</p>
            </div>
          </div>
        </div>

        {/* Tipos de unidades */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Tipos de Unidades:</p>
          <div className="flex flex-wrap gap-1">
            {arcosProjectInfo.unitTypes.slice(0, 3).map((type, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {type.type}
              </Badge>
            ))}
            {arcosProjectInfo.unitTypes.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{arcosProjectInfo.unitTypes.length - 3} más
              </Badge>
            )}
          </div>
        </div>

        {/* Amenities destacados */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Amenities:</p>
          <div className="flex flex-wrap gap-1">
            {arcosProjectInfo.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {arcosProjectInfo.amenities.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{arcosProjectInfo.amenities.length - 3} más
              </Badge>
            )}
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
          <p className="text-xs text-gray-500">
            {arcosProjectInfo.generalPromotions.map((promo, index) => (
              <span key={index}>
                {promo.title}
                {index < arcosProjectInfo.generalPromotions.length - 1 ? " • " : ""}
              </span>
            ))}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
