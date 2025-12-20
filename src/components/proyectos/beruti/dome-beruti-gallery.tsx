"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
  Heart,
  ZoomIn,
  Grid3X3,
  Play,
  Camera,
  Building,
  Home,
  Car,
  Waves,
} from "lucide-react"

interface DomeBerutiGalleryProps {
  onReturnToProject: () => void
}

export function DomeBerutiGallery({ onReturnToProject }: DomeBerutiGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

const galleryItems = [
  {
    id: 1,
    src: "/images/multimedia/beruti/250109 - Berutti Fachada_ copy EDIT.webp",
    alt: "Fachada del edificio Beruti",
    category: "exterior",
    type: "image",
    title: "Fachada",
    description: "Vista frontal del edificio sobre Beruti",
  },
  {
    id: 2,
    src: "/images/multimedia/beruti/250109 - Berutti vereda PB_ copy EDIT 3.webp",
    alt: "Vista peatonal en planta baja del edificio Beruti",
    category: "exterior",
    type: "image",
    title: "Vereda Planta Baja",
    description: "Vista del edificio a nivel peatonal",
  },
  {
    id: 3,
    src: "/images/multimedia/beruti/250109 - BER - Contrafrente_ copy EDIT.webp",
    alt: "Contrafrente del edificio Beruti",
    category: "exterior",
    type: "image",
    title: "Contrafrente",
    description: "Vista del contrafrente del edificio",
  },
  {
    id: 4,
    src: "/images/multimedia/beruti/250109 - BER - Contrafrente_patio copy EDIT.webp",
    alt: "Contrafrente con patio del edificio Beruti",
    category: "exterior",
    type: "image",
    title: "Contrafrente con Patio",
    description: "Vista del contrafrente con patio interior",
  },
  {
    id: 5,
    src: "/images/multimedia/beruti/250109 - Berutti - Pileta_ copy EDIT 1.webp",
    alt: "Piscina del edificio Beruti",
    category: "amenities",
    type: "image",
    title: "Piscina",
    description: "Área de piscina del edificio",
  },
  {
    id: 6,
    src: "/images/multimedia/beruti/250109 - Berutti GYM_ copy EDIT 1.webp",
    alt: "Gimnasio del edificio Beruti",
    category: "amenities",
    type: "image",
    title: "Gimnasio",
    description: "Espacio de gimnasio del edificio",
  },
  {
    id: 7,
    src: "/images/multimedia/beruti/250109 - Berutti 4 ambientes_ copy EDIT.webp",
    alt: "Unidad de cuatro ambientes",
    category: "interior",
    type: "image",
    title: "Unidad 4 Ambientes",
    description: "Interior de departamento de cuatro ambientes",
  },
  {
    id: 8,
    src: "/images/multimedia/beruti/250109 - Berutti piso7 4D_ copy EDIT.webp",
    alt: "Departamento en piso 7 de cuatro dormitorios",
    category: "interior",
    type: "image",
    title: "Unidad Piso 7",
    description: "Vista interior de unidad ubicada en el séptimo piso",
  },
  {
    id: 9,
    src: "/images/multimedia/beruti/250109 BER - Unidad Terraza_ copy SGEDIT.webp",
    alt: "Unidad con terraza",
    category: "interior",
    type: "image",
    title: "Unidad con Terraza",
    description: "Departamento con expansión a terraza",
  },
  {
    id: 10,
    src: "/images/multimedia/beruti/250109 - Berutti terraza duplex copy SGEDIT.webp",
    alt: "Terraza de unidad dúplex",
    category: "amenities",
    type: "image",
    title: "Terraza Dúplex",
    description: "Terraza correspondiente a unidad tipo dúplex",
  },
];


  const categories = [
    { id: "all", name: "Todas", icon: <Grid3X3 className="w-4 h-4" /> },
    { id: "exterior", name: "Exterior", icon: <Building className="w-4 h-4" /> },
    { id: "interior", name: "Interior", icon: <Home className="w-4 h-4" /> },
    { id: "amenities", name: "Amenities", icon: <Waves className="w-4 h-4" /> },
    { id: "parking", name: "Cocheras", icon: <Car className="w-4 h-4" /> },
    { id: "video", name: "Videos", icon: <Play className="w-4 h-4" /> },
  ]

  const filteredItems =
    selectedCategory === "all" ? galleryItems : galleryItems.filter((item) => item.category === selectedCategory)

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredItems.length)
  }

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
  }

  const handleDownload = (src: string, title: string) => {
    const link = document.createElement("a")
    link.href = src
    link.download = `dome-beruti-${title.toLowerCase().replace(/\s+/g, "-")}.webp`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onReturnToProject} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver al proyecto
          </Button>
          <h1 className="text-2xl font-bold">Galería - DOME Torre Beruti</h1>
          <div></div>
        </div>

        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={`${
                  selectedCategory === category.id
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-zinc-700 hover:bg-zinc-800"
                }`}
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
                <Badge variant="secondary" className="ml-2 bg-zinc-700">
                  {category.id === "all"
                    ? galleryItems.length
                    : galleryItems.filter((item) => item.category === category.id).length}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-zinc-800 cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {item.type === "video" ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-zinc-800">
                      <Play className="w-12 h-12 text-white opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <Image
                      src={item.src || "/placeholder.svg?height=300&width=300"}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 /60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center p-4">
                      <ZoomIn className="w-8 h-8 text-white mx-auto mb-2" />
                      <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge className={`${item.type === "video" ? "bg-red-600" : "bg-blue-600"} text-white`}>
                      {item.type === "video" ? "Video" : "Imagen"}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <Camera className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400 text-lg">No hay elementos en esta categoría</p>
            </div>
          )}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 /95 flex items-center justify-center"
              onClick={() => setIsLightboxOpen(false)}
            >
              <div className="relative w-full h-full flex items-center justify-center p-4">
                {/* Close Button */}
                <Button
                  onClick={() => setIsLightboxOpen(false)}
                  className="absolute top-4 right-4 z-10 /50 hover:/70"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>

                {/* Navigation Buttons */}
                <Button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 /50 hover:/70"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 /50 hover:/70"
                  size="sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Image */}
                <div className="relative max-w-5xl max-h-[80vh] w-full h-full">
                  {filteredItems[lightboxIndex]?.type === "video" ? (
                    <video
                      src={filteredItems[lightboxIndex].src}
                      controls
                      className="w-full h-full object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <Image
                      src={filteredItems[lightboxIndex]?.src || ""}
                      alt={filteredItems[lightboxIndex]?.alt || ""}
                      fill
                      className="object-contain"
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </div>

                {/* Image Info */}
                <div className="absolute bottom-4 left-4 right-4 /70 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{filteredItems[lightboxIndex]?.title}</h3>
                      <p className="text-zinc-300 text-sm mt-1">{filteredItems[lightboxIndex]?.description}</p>
                      <p className="text-zinc-400 text-xs mt-2">
                        {lightboxIndex + 1} de {filteredItems.length}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(filteredItems[lightboxIndex].src, filteredItems[lightboxIndex].title)
                        }}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={(e) => e.stopPropagation()}
                        size="sm"
                        variant="outline"
                        className="border-zinc-600"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DomeBerutiGallery
