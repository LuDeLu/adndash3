"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Play, Download, FileText, Video, ImageIcon } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

type SuitesGalleryProps = {
  onReturnToProject: () => void
}

// Datos de ejemplo para la galería
const galleryData = {
  images: [
    {
      id: 1,
      src: "/placeholder.svg?height=400&width=600&text=Fachada+Principal",
      title: "Fachada Principal",
      category: "exterior",
    },
    {
      id: 2,
      src: "/placeholder.svg?height=400&width=600&text=Hall+de+Entrada",
      title: "Hall de Entrada",
      category: "interior",
    },
    {
      id: 3,
      src: "/placeholder.svg?height=400&width=600&text=Piscina+Solárium",
      title: "Piscina Solárium",
      category: "amenities",
    },
    {
      id: 4,
      src: "/placeholder.svg?height=400&width=600&text=Gimnasio",
      title: "Gimnasio",
      category: "amenities",
    },
    {
      id: 5,
      src: "/placeholder.svg?height=400&width=600&text=Suite+Deluxe",
      title: "Suite Deluxe",
      category: "interior",
    },
    {
      id: 6,
      src: "/placeholder.svg?height=400&width=600&text=Vista+Aérea",
      title: "Vista Aérea",
      category: "exterior",
    },
    {
      id: 7,
      src: "/placeholder.svg?height=400&width=600&text=Área+Parrillas",
      title: "Área Parrillas",
      category: "amenities",
    },
    {
      id: 8,
      src: "/placeholder.svg?height=400&width=600&text=Cocina+Integrada",
      title: "Cocina Integrada",
      category: "interior",
    },
    {
      id: 9,
      src: "/placeholder.svg?height=400&width=600&text=Balcón+Vista",
      title: "Balcón Vista",
      category: "interior",
    },
    {
      id: 10,
      src: "/placeholder.svg?height=400&width=600&text=Lobby+Principal",
      title: "Lobby Principal",
      category: "interior",
    },
    {
      id: 11,
      src: "/placeholder.svg?height=400&width=600&text=Zócalo+Comercial",
      title: "Zócalo Comercial",
      category: "exterior",
    },
    {
      id: 12,
      src: "/placeholder.svg?height=400&width=600&text=Residence+2+Dorm",
      title: "Residence 2 Dormitorios",
      category: "interior",
    },
  ],
  videos: [
    {
      id: 1,
      src: "/placeholder.mp4",
      title: "Recorrido Virtual",
      thumbnail: "/placeholder.svg?height=300&width=400&text=Video+Recorrido",
    },
    {
      id: 2,
      src: "/placeholder.mp4",
      title: "Amenities Premium",
      thumbnail: "/placeholder.svg?height=300&width=400&text=Video+Amenities",
    },
    {
      id: 3,
      src: "/placeholder.mp4",
      title: "Ubicación Palermo",
      thumbnail: "/placeholder.svg?height=300&width=400&text=Video+Ubicación",
    },
    {
      id: 4,
      src: "/placeholder.mp4",
      title: "Suites y Residences",
      thumbnail: "/placeholder.svg?height=300&width=400&text=Video+Unidades",
    },
  ],
  documents: [
    { id: 1, name: "Brochure Completo", type: "PDF", size: "3.2 MB", url: "/documents/brochure-suites.pdf" },
    { id: 2, name: "Planos Generales", type: "PDF", size: "6.8 MB", url: "/documents/planos-suites.pdf" },
    { id: 3, name: "Especificaciones Técnicas", type: "PDF", size: "2.1 MB", url: "/documents/especificaciones.pdf" },
    { id: 4, name: "Lista de Precios", type: "PDF", size: "1.2 MB", url: "/documents/precios-suites.pdf" },
    { id: 5, name: "Reglamento de Copropiedad", type: "PDF", size: "4.1 MB", url: "/documents/reglamento-suites.pdf" },
    { id: 6, name: "Planos por Tipología", type: "PDF", size: "5.5 MB", url: "/documents/tipologias.pdf" },
  ],
}

export default function SuitesGallery({ onReturnToProject }: SuitesGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("images")
  const [imageFilter, setImageFilter] = useState<string>("all")

  const filteredImages = galleryData.images.filter((image) => imageFilter === "all" || image.category === imageFilter)

  const handleImageClick = (imageId: number) => {
    setSelectedImage(imageId)
  }

  const handleVideoClick = (videoId: number) => {
    setSelectedVideo(videoId)
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button onClick={onReturnToProject} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al proyecto
          </Button>
          <h1 className="text-2xl font-bold">Galería Multimedia</h1>
          <div></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800 mb-8">
            <TabsTrigger value="images" className="data-[state=active]:bg-zinc-700">
              <ImageIcon className="mr-2 h-4 w-4" />
              Imágenes ({galleryData.images.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-zinc-700">
              <Video className="mr-2 h-4 w-4" />
              Videos ({galleryData.videos.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-zinc-700">
              <FileText className="mr-2 h-4 w-4" />
              Documentos ({galleryData.documents.length})
            </TabsTrigger>
          </TabsList>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            {/* Image Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={imageFilter === "all" ? "default" : "outline"}
                onClick={() => setImageFilter("all")}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={imageFilter === "exterior" ? "default" : "outline"}
                onClick={() => setImageFilter("exterior")}
                size="sm"
              >
                Exteriores
              </Button>
              <Button
                variant={imageFilter === "interior" ? "default" : "outline"}
                onClick={() => setImageFilter("interior")}
                size="sm"
              >
                Interiores
              </Button>
              <Button
                variant={imageFilter === "amenities" ? "default" : "outline"}
                onClick={() => setImageFilter("amenities")}
                size="sm"
              >
                Amenities
              </Button>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className="bg-zinc-900 border-zinc-700 overflow-hidden cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-video" onClick={() => handleImageClick(image.id)}>
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <ImageIcon className="text-white opacity-0 hover:opacity-100 transition-opacity" size={32} />
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-white">{image.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryData.videos.map((video) => (
                <Card key={video.id} className="bg-zinc-900 border-zinc-700 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-video cursor-pointer" onClick={() => handleVideoClick(video.id)}>
                      <Image
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-20 transition-all duration-200">
                        <Play className="text-white" size={48} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-white">{video.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryData.documents.map((doc) => (
                <Card key={doc.id} className="bg-zinc-900 border-zinc-700">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-white truncate">{doc.name}</h3>
                        <p className="text-sm text-zinc-400">
                          {doc.type} • {doc.size}
                        </p>
                        <Button
                          onClick={() => handleDownload(doc.url, doc.name)}
                          className="mt-3 bg-blue-600 hover:bg-blue-700"
                          size="sm"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Image Modal */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black border-zinc-700">
            {selectedImage && (
              <div className="relative">
                <Image
                  src={galleryData.images.find((img) => img.id === selectedImage)?.src || ""}
                  alt={galleryData.images.find((img) => img.id === selectedImage)?.title || ""}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h3 className="text-xl font-bold text-white">
                    {galleryData.images.find((img) => img.id === selectedImage)?.title}
                  </h3>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Video Modal */}
        <Dialog open={selectedVideo !== null} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black border-zinc-700">
            {selectedVideo && (
              <div className="relative">
                <video
                  controls
                  className="w-full h-auto"
                  src={galleryData.videos.find((vid) => vid.id === selectedVideo)?.src}
                >
                  Tu navegador no soporta el elemento de video.
                </video>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">
                    {galleryData.videos.find((vid) => vid.id === selectedVideo)?.title}
                  </h3>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
