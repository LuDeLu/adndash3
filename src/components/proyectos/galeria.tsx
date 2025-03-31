"use client"

import { useState, useEffect } from "react"
import { FaDownload, FaPlay, FaArrowLeft, FaWhatsapp, FaEnvelope, FaCheck } from "react-icons/fa"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface ImageMedia {
  id: number
  src: string
  alt: string
  type: "image"
}

interface VideoMedia {
  id: number
  src: string
  title: string
  type: "video"
}

type MediaItem = ImageMedia | VideoMedia

const images: ImageMedia[] = [
  { id: 1, src: "/images/fotos/depto.jpg", alt: "Interior", type: "image" },
  { id: 2, src: "/images/fotos/depto2.jpg", alt: "Interior", type: "image" },
  { id: 3, src: "/images/fotos/frontal.jpg", alt: "Edificio", type: "image" },
  { id: 4, src: "/images/fotos/frontal2.jpg", alt: "Edificio esquina", type: "image" },
  { id: 5, src: "/images/fotos/gym.jpg", alt: "Gimnasio", type: "image" },
  { id: 6, src: "/images/fotos/hall.jpg", alt: "Recepcion", type: "image" },
  { id: 7, src: "/images/fotos/hall2.jpg", alt: "Entrada principal", type: "image" },
  { id: 8, src: "/images/fotos/pileta.jpg", alt: "Piscina", type: "image" },
  { id: 9, src: "/images/fotos/pileta2.jpg", alt: "Piscina", type: "image" },
  { id: 10, src: "/images/fotos/sum.jpg", alt: "Salon de Usos Multiples", type: "image" },
]

const videos: VideoMedia[] = [{ id: 11, src: "/images/fotos/domeresidence.mp4", title: "Video muestra", type: "video" }]

const allMedia: MediaItem[] = [...images, ...videos]

interface MediaGalleryComponentProps {
  projectId?: number
  setActiveSection: (section: string) => void
}

export function MediaGalleryComponent({ projectId, setActiveSection }: MediaGalleryComponentProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(allMedia)
  const [downloading, setDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "image" | "video">("all")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [emailAddress, setEmailAddress] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const downloadMedia = async (src: string, title: string, type: "image" | "video") => {
    if (!isMounted) return

    const response = await fetch(src)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${title}.${type === "image" ? "jpg" : "mp4"}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllMedia = async () => {
    if (!isMounted) return

    setDownloading(true)
    const zip = new JSZip()

    for (const media of allMedia) {
      const response = await fetch(media.src)
      const blob = await response.blob()
      zip.file(`${media.type === "image" ? media.alt : media.title}.${media.type === "image" ? "jpg" : "mp4"}`, blob)
    }

    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, "all_media.zip")
    setDownloading(false)
  }

  const toggleMediaSelection = (media: MediaItem) => {
    setSelectedMedia((prev) =>
      prev.some((item) => item.id === media.id) ? prev.filter((item) => item.id !== media.id) : [...prev, media],
    )
  }

  const shareViaWhatsApp = async () => {
    if (!isMounted) return

    setDownloading(true)
    const zip = new JSZip()

    for (const media of selectedMedia) {
      const response = await fetch(media.src)
      const blob = await response.blob()
      zip.file(`${media.type === "image" ? media.alt : media.title}.${media.type === "image" ? "jpg" : "mp4"}`, blob)
    }

    const content = await zip.generateAsync({ type: "blob" })
    const file = new File([content], "selected_media.zip", { type: "application/zip" })

    // En una implementación real, aquí subirías el archivo a un servidor y obtendrías una URL de descarga
    const fakeDownloadUrl = URL.createObjectURL(file)

    const text = `Mira estos archivos multimedia de nuestro proyecto. Puedes descargarlos aquí: ${fakeDownloadUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, "_blank")
    setDownloading(false)
  }

  const shareViaEmail = async () => {
    setDownloading(true)
    // En una implementación real, aquí enviarías los archivos a un servidor para procesarlos y enviarlos por correo
    // Simulamos el proceso con un retardo
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setDownloading(false)
    setIsShareDialogOpen(false)
  }

  useEffect(() => {
    if (projectId) {
      console.log(`Project ID: ${projectId}`)
      // You can add logic here to filter mediaItems based on projectId if needed
      // For now, we'll just use all media items
      setMediaItems(allMedia)
    }
  }, [projectId])

  const filteredMedia = activeTab === "all" ? allMedia : allMedia.filter((media) => media.type === activeTab)

  // Don't render anything until we're mounted on the client
  if (!isMounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Galería Multimedia</h1>
        <Button onClick={() => setActiveSection("proyectos")} className="px-4 py-2 w-full sm:w-auto">
          <FaArrowLeft className="mr-2" />
          Volver a Proyectos
        </Button>
      </div>
      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "all" | "image" | "video")}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="image">Imágenes</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                downloadMedia={downloadMedia}
                isSelected={selectedMedia.some((item) => item.id === media.id)}
                onSelect={() => toggleMediaSelection(media)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="image">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                downloadMedia={downloadMedia}
                isSelected={selectedMedia.some((item) => item.id === media.id)}
                onSelect={() => toggleMediaSelection(media)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="video">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedia.map((media) => (
              <MediaCard
                key={media.id}
                media={media}
                downloadMedia={downloadMedia}
                isSelected={selectedMedia.some((item) => item.id === media.id)}
                onSelect={() => toggleMediaSelection(media)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <Button onClick={downloadAllMedia} disabled={downloading} className="px-6 py-3 w-full sm:w-auto">
          {downloading ? "Descargando..." : "Descargar todos los archivos"}
        </Button>
        <Button
          onClick={shareViaWhatsApp}
          disabled={selectedMedia.length === 0 || downloading}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 w-full sm:w-auto"
        >
          <FaWhatsapp className="mr-2" />
          Compartir por WhatsApp
        </Button>
        <Button
          onClick={() => setIsShareDialogOpen(true)}
          disabled={selectedMedia.length === 0 || downloading}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 w-full sm:w-auto"
        >
          <FaEnvelope className="mr-2" />
          Compartir por Email
        </Button>
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartir por Email</DialogTitle>
            <DialogDescription>
              Ingrese la dirección de email para compartir los archivos seleccionados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={shareViaEmail} disabled={!emailAddress || downloading}>
              {downloading ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface MediaCardProps {
  media: MediaItem
  downloadMedia: (src: string, title: string, type: "image" | "video") => void
  isSelected: boolean
  onSelect: () => void
}

function MediaCard({ media, downloadMedia, isSelected, onSelect }: MediaCardProps) {
  return (
    <Card className="overflow-hidden relative">
      <CardContent className="p-0">
        {media.type === "image" ? (
          <div className="w-full h-48 relative">
            <Image
              src={media.src || "/placeholder.svg"}
              alt={media.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative">
            <video id={`video-${media.id}`} className="w-full h-48 object-cover">
              <source src={media.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Button
              className="absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity"
              onClick={() => {
                const videoElement = document.getElementById(`video-${media.id}`) as HTMLVideoElement
                if (videoElement.paused) {
                  videoElement.play()
                } else {
                  videoElement.pause()
                }
              }}
            >
              <FaPlay className="text-white" />
            </Button>
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold mb-2 text-sm sm:text-base">
            {media.type === "image" ? media.alt : media.title}
          </h3>
          <div className="flex justify-between items-center">
            <Button
              onClick={() => downloadMedia(media.src, media.type === "image" ? media.alt : media.title, media.type)}
              className="flex-grow mr-2 text-xs sm:text-sm"
            >
              <FaDownload className="mr-2" />
              Descargar
            </Button>
            <Checkbox checked={isSelected} onCheckedChange={onSelect} id={`select-${media.id}`} />
          </div>
        </div>
      </CardContent>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
          <FaCheck className="text-white" />
        </div>
      )}
    </Card>
  )
}

