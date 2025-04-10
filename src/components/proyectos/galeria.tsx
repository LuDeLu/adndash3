"use client"

import React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import {
  FaDownload,
  FaPlay,
  FaArrowLeft,
  FaWhatsapp,
  FaEnvelope,
  FaCheck,
  FaSync,
  FaSearch,
  FaStar,
  FaRegStar,
  FaTimes,
} from "react-icons/fa"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ImageMedia {
  id: number
  src: string
  alt: string
  type: "image"
  category?: string
  dateAdded?: string
  favorite?: boolean
}

interface VideoMedia {
  id: number
  src: string
  title: string
  type: "video"
  category?: string
  dateAdded?: string
  favorite?: boolean
}

type MediaItem = ImageMedia | VideoMedia

type SortOption = "newest" | "oldest" | "nameAsc" | "nameDesc"

// Cache for downloaded media
const mediaCache = new Map<string, Blob>()

// Default images and videos - moved outside component to prevent recreation on each render
const defaultImages: ImageMedia[] = [
  {
    id: 1,
    src: "/images/fotos/depto.jpg",
    alt: "Interior",
    type: "image",
    category: "Interiores",
    dateAdded: "2023-10-15",
  },
  {
    id: 2,
    src: "/images/fotos/depto2.jpg",
    alt: "Interior",
    type: "image",
    category: "Interiores",
    dateAdded: "2023-11-20",
  },
  {
    id: 3,
    src: "/images/fotos/frontal.jpg",
    alt: "Edificio",
    type: "image",
    category: "Exteriores",
    dateAdded: "2023-09-05",
  },
  {
    id: 4,
    src: "/images/fotos/frontal2.jpg",
    alt: "Edificio esquina",
    type: "image",
    category: "Exteriores",
    dateAdded: "2023-09-10",
  },
  {
    id: 5,
    src: "/images/fotos/gym.jpg",
    alt: "Gimnasio",
    type: "image",
    category: "Amenities",
    dateAdded: "2023-12-01",
  },
  {
    id: 6,
    src: "/images/fotos/hall.jpg",
    alt: "Recepcion",
    type: "image",
    category: "Áreas comunes",
    dateAdded: "2023-10-25",
  },
  {
    id: 7,
    src: "/images/fotos/hall2.jpg",
    alt: "Entrada principal",
    type: "image",
    category: "Áreas comunes",
    dateAdded: "2023-11-05",
  },
  {
    id: 8,
    src: "/images/fotos/pileta.jpg",
    alt: "Piscina",
    type: "image",
    category: "Amenities",
    dateAdded: "2023-12-10",
  },
  {
    id: 9,
    src: "/images/fotos/pileta2.jpg",
    alt: "Piscina",
    type: "image",
    category: "Amenities",
    dateAdded: "2023-12-15",
  },
  {
    id: 10,
    src: "/images/fotos/sum.jpg",
    alt: "Salon de Usos Multiples",
    type: "image",
    category: "Amenities",
    dateAdded: "2023-11-15",
  },
]

const defaultVideos: VideoMedia[] = [
  {
    id: 11,
    src: "/images/fotos/domeresidence.mp4",
    title: "Video muestra",
    type: "video",
    category: "Recorridos",
    dateAdded: "2023-12-20",
  },
]

const defaultAllMedia: MediaItem[] = [...defaultImages, ...defaultVideos]

interface MediaGalleryComponentProps {
  projectId?: number
  setActiveSection: (section: string) => void
}

// Memoized MediaCard component to prevent unnecessary re-renders
const MediaCard = React.memo(
  ({
    media,
    downloadMedia,
    isSelected,
    onSelect,
    onPreview,
    onToggleFavorite,
  }: {
    media: MediaItem
    downloadMedia: (src: string, title: string, type: "image" | "video") => Promise<void>
    isSelected: boolean
    onSelect: () => void
    onPreview: () => void
    onToggleFavorite: () => void
  }) => {
    const handleDownload = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        downloadMedia(media.src, media.type === "image" ? media.alt : media.title, media.type)
      },
      [media, downloadMedia],
    )

    return (
      <Card
        className="overflow-hidden relative group hover:shadow-lg transition-shadow duration-300"
        onClick={onPreview}
      >
        <CardContent className="p-0">
          {media.type === "image" ? (
            <div className="w-full h-48 relative">
              <Image
                src={media.src || "/placeholder.svg"}
                alt={media.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
            </div>
          ) : (
            <div className="relative">
              <video id={`video-${media.id}`} className="w-full h-48 object-cover">
                <source src={media.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Button
                className="absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-75 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  const videoElement = document.getElementById(`video-${media.id}`) as HTMLVideoElement
                  if (videoElement.paused) {
                    videoElement.play()
                  } else {
                    videoElement.pause()
                  }
                }}
                aria-label={`Reproducir video ${media.title}`}
              >
                <FaPlay className="text-white" />
              </Button>
            </div>
          )}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                {media.type === "image" ? media.alt : media.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite()
                }}
                className="text-yellow-500 hover:text-yellow-600 transition-colors"
                aria-label={media.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                {media.favorite ? <FaStar /> : <FaRegStar />}
              </button>
            </div>
            <div className="flex items-center mb-2 text-xs text-gray-500">
              <Badge variant="outline" className="mr-2">
                {media.category}
              </Badge>
              <span>{new Date(media.dateAdded || "").toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <Button
                onClick={handleDownload}
                className="flex-grow mr-2 text-xs sm:text-sm"
                aria-label={`Descargar ${media.type === "image" ? media.alt : media.title}`}
              >
                <FaDownload className="mr-2" />
                Descargar
              </Button>
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                id={`select-${media.id}`}
                aria-label={`Seleccionar ${media.type === "image" ? media.alt : media.title}`}
              />
            </div>
          </div>
        </CardContent>
        {isSelected && (
          <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <FaCheck className="text-white" />
          </div>
        )}
        {media.category && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-black bg-opacity-70">{media.category}</Badge>
          </div>
        )}
      </Card>
    )
  },
)

MediaCard.displayName = "MediaCard"

// Preview component for media items
const MediaPreview = React.memo(
  ({
    media,
    onClose,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
    onDownload,
    onToggleFavorite,
  }: {
    media: MediaItem | null
    onClose: () => void
    onNext: () => void
    onPrevious: () => void
    hasNext: boolean
    hasPrevious: boolean
    onDownload: () => Promise<void>
    onToggleFavorite: () => void
  }) => {
    if (!media) return null

    return (
      <Dialog open={!!media} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
          <div className="relative h-full">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-opacity"
              aria-label="Cerrar vista previa"
            >
              <FaTimes />
            </button>
            <div className="flex flex-col h-full">
              <div className="flex-grow relative overflow-hidden">
                {media.type === "image" ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={media.src || "/placeholder.svg"}
                      alt={media.alt}
                      fill
                      className="object-contain"
                      sizes="90vw"
                    />
                  </div>
                ) : (
                  <video
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    aria-label={`Video: ${media.title}`}
                  >
                    <source src={media.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
                {hasPrevious && (
                  <button
                    onClick={onPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-opacity"
                    aria-label="Anterior"
                  >
                    <FaArrowLeft />
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={onNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-opacity"
                    aria-label="Siguiente"
                  >
                    <FaArrowLeft className="transform rotate-180" />
                  </button>
                )}
              </div>
              <div className="p-4 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">{media.type === "image" ? media.alt : media.title}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={onToggleFavorite}
                      className="text-yellow-500 hover:text-yellow-600 transition-colors text-xl"
                      aria-label={media.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                      {media.favorite ? <FaStar /> : <FaRegStar />}
                    </button>
                    <Button onClick={onDownload} size="sm">
                      <FaDownload className="mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Badge variant="outline" className="mr-2">
                    {media.category}
                  </Badge>
                  <span>Añadido: {new Date(media.dateAdded || "").toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  },
)

MediaPreview.displayName = "MediaPreview"

export function MediaGalleryComponent({ projectId, setActiveSection }: MediaGalleryComponentProps) {
  // Use refs for values that don't need to trigger re-renders
  const isMounted = useRef(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"all" | "image" | "video" | "favorites">("all")
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {})
  const [confirmMessage, setConfirmMessage] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const notyfRef = useRef<Notyf | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number>(-1)

  // Initialize Notyf
  useEffect(() => {
    if (typeof window !== "undefined" && !notyfRef.current) {
      notyfRef.current = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
        ripple: true,
        dismissible: true,
      })
    }

    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  // Extract unique categories from media items
  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    mediaItems.forEach((item) => {
      if (item.category) categorySet.add(item.category)
    })
    return Array.from(categorySet)
  }, [mediaItems])

  // Fetch media items when component mounts or projectId changes
  useEffect(() => {
    const fetchMediaItems = async () => {
      setLoading(true)
      setError(null)

      try {
        // In a real app, this would be an API call
        // For now, simulate a network request with setTimeout
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (projectId) {
          console.log(`Fetching media for project ID: ${projectId}`)
          // Here you would fetch project-specific media
          // For now, use the default media
          setMediaItems(defaultAllMedia)
        } else {
          setMediaItems(defaultAllMedia)
        }
      } catch (err) {
        console.error("Error fetching media items:", err)
        setError("No se pudieron cargar los archivos multimedia. Por favor, intente nuevamente.")
        // Fall back to default media
        setMediaItems(defaultAllMedia)
      } finally {
        setLoading(false)
      }
    }

    fetchMediaItems()
  }, [projectId])

  // Apply filters, search and sorting to media items
  const filteredAndSortedMedia = useMemo(() => {
    // First filter by type
    let filtered = mediaItems
    if (activeTab === "image") {
      filtered = mediaItems.filter((media) => media.type === "image")
    } else if (activeTab === "video") {
      filtered = mediaItems.filter((media) => media.type === "video")
    } else if (activeTab === "favorites") {
      filtered = mediaItems.filter((media) => media.favorite)
    }

    // Then filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter((media) => media.category === selectedCategory)
    }

    // Then filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter((media) => {
        const title = media.type === "image" ? media.alt.toLowerCase() : media.title.toLowerCase()
        const category = (media.category || "").toLowerCase()
        return title.includes(term) || category.includes(term)
      })
    }

    // Finally sort
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.dateAdded || "").getTime() - new Date(a.dateAdded || "").getTime()
        case "oldest":
          return new Date(a.dateAdded || "").getTime() - new Date(b.dateAdded || "").getTime()
        case "nameAsc":
          const nameA = a.type === "image" ? a.alt : a.title
          const nameB = b.type === "image" ? b.alt : b.title
          return nameA.localeCompare(nameB)
        case "nameDesc":
          const nameC = a.type === "image" ? a.alt : a.title
          const nameD = b.type === "image" ? b.alt : b.title
          return nameD.localeCompare(nameC)
        default:
          return 0
      }
    })
  }, [activeTab, mediaItems, searchTerm, sortOption, selectedCategory])

  // Handle media preview
  const handlePreview = useCallback(
    (media: MediaItem) => {
      const index = filteredAndSortedMedia.findIndex((m) => m.id === media.id)
      setPreviewMedia(media)
      setPreviewIndex(index)
    },
    [filteredAndSortedMedia],
  )

  const handleNextPreview = useCallback(() => {
    if (previewIndex < filteredAndSortedMedia.length - 1) {
      const nextIndex = previewIndex + 1
      setPreviewMedia(filteredAndSortedMedia[nextIndex])
      setPreviewIndex(nextIndex)
    }
  }, [previewIndex, filteredAndSortedMedia])

  const handlePreviousPreview = useCallback(() => {
    if (previewIndex > 0) {
      const prevIndex = previewIndex - 1
      setPreviewMedia(filteredAndSortedMedia[prevIndex])
      setPreviewIndex(prevIndex)
    }
  }, [previewIndex, filteredAndSortedMedia])

  // Toggle favorite status
  const toggleFavorite = useCallback((mediaId: number) => {
    setMediaItems((prev) => prev.map((item) => (item.id === mediaId ? { ...item, favorite: !item.favorite } : item)))
  }, [])

  // Optimized download function with caching
  const downloadMedia = useCallback(async (src: string, title: string, type: "image" | "video") => {
    if (!isMounted.current) return

    try {
      // Check if media is already in cache
      if (mediaCache.has(src)) {
        const cachedBlob = mediaCache.get(src)
        if (cachedBlob) {
          const url = URL.createObjectURL(cachedBlob)
          const link = document.createElement("a")
          link.href = url
          link.download = `${title}.${type === "image" ? "jpg" : "mp4"}`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up the URL object
          setTimeout(() => URL.revokeObjectURL(url), 100)

          if (notyfRef.current) {
            notyfRef.current.success(`${title} descargado con éxito`)
          }
          return
        }
      }

      // If not in cache, fetch and cache it
      const response = await fetch(src)

      // Check if the response is ok
      if (!response.ok) {
        throw new Error(`Error al descargar: ${response.statusText}`)
      }

      const blob = await response.blob()

      // Store in cache
      mediaCache.set(src, blob)

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${title}.${type === "image" ? "jpg" : "mp4"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100)

      if (notyfRef.current) {
        notyfRef.current.success(`${title} descargado con éxito`)
      }
    } catch (err) {
      console.error("Error downloading media:", err)
      if (notyfRef.current) {
        notyfRef.current.error(
          `Error al descargar el archivo: ${err instanceof Error ? err.message : "Error desconocido"}`,
        )
      }
    }
  }, [])

  // Optimized download all function with progress tracking
  const downloadAllMedia = useCallback(async () => {
    if (!isMounted.current) return

    // If no media items are selected, confirm downloading all
    if (selectedMedia.length === 0) {
      setConfirmMessage(`¿Está seguro que desea descargar todos los ${filteredAndSortedMedia.length} archivos?`)
      setConfirmAction(() => async () => {
        await performDownloadAll(filteredAndSortedMedia)
      })
      setIsConfirmDialogOpen(true)
      return
    }

    // If media items are selected, confirm downloading selected
    setConfirmMessage(`¿Está seguro que desea descargar los ${selectedMedia.length} archivos seleccionados?`)
    setConfirmAction(() => async () => {
      await performDownloadAll(selectedMedia)
    })
    setIsConfirmDialogOpen(true)
  }, [filteredAndSortedMedia, selectedMedia])

  // Actual download function
  const performDownloadAll = async (itemsToDownload: MediaItem[]) => {
    setDownloading(true)
    setDownloadProgress(0)
    const zip = new JSZip()
    const totalItems = itemsToDownload.length

    try {
      // Process media items in batches to avoid overwhelming the browser
      const batchSize = 3
      const batches = Math.ceil(itemsToDownload.length / batchSize)

      for (let i = 0; i < batches; i++) {
        const batchStart = i * batchSize
        const batchEnd = Math.min(batchStart + batchSize, itemsToDownload.length)
        const batchItems = itemsToDownload.slice(batchStart, batchEnd)

        // Process items in current batch concurrently
        await Promise.all(
          batchItems.map(async (media) => {
            try {
              // Check if media is already in cache
              let blob
              if (mediaCache.has(media.src)) {
                blob = mediaCache.get(media.src)
              } else {
                const response = await fetch(media.src)
                blob = await response.blob()
                mediaCache.set(media.src, blob)
              }

              if (blob) {
                const fileName = `${media.type === "image" ? media.alt : media.title}.${media.type === "image" ? "jpg" : "mp4"}`
                zip.file(fileName, blob)
              }

              // Update progress
              const processedItems = Math.min(batchEnd, itemsToDownload.length)
              const progress = Math.round((processedItems / totalItems) * 100)
              setDownloadProgress(progress)
            } catch (err) {
              console.error(`Error processing ${media.src}:`, err)
            }
          }),
        )
      }

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      })

      saveAs(content, "archivos_multimedia.zip")

      if (notyfRef.current) {
        notyfRef.current.success(`${totalItems} archivos descargados con éxito`)
      }
    } catch (err) {
      console.error("Error downloading all media:", err)
      if (notyfRef.current) {
        notyfRef.current.error(
          `Error al descargar los archivos: ${err instanceof Error ? err.message : "Error desconocido"}`,
        )
      }
    } finally {
      setDownloading(false)
      setDownloadProgress(0)
    }
  }

  // Optimized toggle selection function
  const toggleMediaSelection = useCallback((media: MediaItem) => {
    setSelectedMedia((prev) => {
      const isSelected = prev.some((item) => item.id === media.id)
      if (isSelected) {
        return prev.filter((item) => item.id !== media.id)
      } else {
        return [...prev, media]
      }
    })
  }, [])

  // Select all visible media
  const selectAllVisible = useCallback(() => {
    setSelectedMedia(filteredAndSortedMedia)
  }, [filteredAndSortedMedia])

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedMedia([])
  }, [])

  // Optimized share via WhatsApp function
  const shareViaWhatsApp = useCallback(async () => {
    if (!isMounted.current || selectedMedia.length === 0) return

    setConfirmMessage(`¿Está seguro que desea compartir ${selectedMedia.length} archivos por WhatsApp?`)
    setConfirmAction(() => async () => {
      setDownloading(true)
      setDownloadProgress(0)

      try {
        const zip = new JSZip()
        const totalItems = selectedMedia.length

        // Process selected media
        for (let i = 0; i < selectedMedia.length; i++) {
          const media = selectedMedia[i]
          let blob
          if (mediaCache.has(media.src)) {
            blob = mediaCache.get(media.src)
          } else {
            const response = await fetch(media.src)
            blob = await response.blob()
            mediaCache.set(media.src, blob)
          }

          if (blob) {
            zip.file(
              `${media.type === "image" ? media.alt : media.title}.${media.type === "image" ? "jpg" : "mp4"}`,
              blob,
            )
          }

          // Update progress
          const progress = Math.round(((i + 1) / totalItems) * 100)
          setDownloadProgress(progress)
        }

        const content = await zip.generateAsync({ type: "blob" })
        const file = new File([content], "archivos_seleccionados.zip", { type: "application/zip" })

        // In a real implementation, here you would upload the file to a server and get a download URL
        const fakeDownloadUrl = URL.createObjectURL(file)

        const text = `Mira estos archivos multimedia de nuestro proyecto. Puedes descargarlos aquí: ${fakeDownloadUrl}`
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
        window.open(whatsappUrl, "_blank")

        if (notyfRef.current) {
          notyfRef.current.success("WhatsApp abierto con los archivos seleccionados")
        }
      } catch (err) {
        console.error("Error sharing via WhatsApp:", err)
        if (notyfRef.current) {
          notyfRef.current.error(
            `Error al preparar los archivos: ${err instanceof Error ? err.message : "Error desconocido"}`,
          )
        }
      } finally {
        setDownloading(false)
        setDownloadProgress(0)
      }
    })
    setIsConfirmDialogOpen(true)
  }, [selectedMedia])

  // Optimized share via email function
  const shareViaEmail = useCallback(async () => {
    if (!emailAddress || selectedMedia.length === 0) {
      if (notyfRef.current) {
        notyfRef.current.error("Por favor ingrese una dirección de email válida")
      }
      return
    }

    setDownloading(true)
    setDownloadProgress(0)

    try {
      const zip = new JSZip()
      const totalItems = selectedMedia.length

      // Process selected media
      for (let i = 0; i < selectedMedia.length; i++) {
        const media = selectedMedia[i]
        let blob
        if (mediaCache.has(media.src)) {
          blob = mediaCache.get(media.src)
        } else {
          const response = await fetch(media.src)
          blob = await response.blob()
          mediaCache.set(media.src, blob)
        }

        if (blob) {
          zip.file(
            `${media.type === "image" ? media.alt : media.title}.${media.type === "image" ? "jpg" : "mp4"}`,
            blob,
          )
        }

        // Update progress
        const progress = Math.round(((i + 1) / totalItems) * 100)
        setDownloadProgress(progress)
      }

      const content = await zip.generateAsync({ type: "blob" })

      // In a real implementation, here you would send the files to a server for processing and emailing
      // Simulate the process with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (notyfRef.current) {
        notyfRef.current.success(`Archivos enviados a ${emailAddress}`)
      }

      setIsShareDialogOpen(false)
      setEmailAddress("")
    } catch (err) {
      console.error("Error sharing via email:", err)
      if (notyfRef.current) {
        notyfRef.current.error(`Error al enviar el email: ${err instanceof Error ? err.message : "Error desconocido"}`)
      }
    } finally {
      setDownloading(false)
      setDownloadProgress(0)
    }
  }, [emailAddress, selectedMedia])

  // Function to refresh media items
  const refreshMedia = useCallback(async () => {
    if (refreshing) return

    setRefreshing(true)
    setError(null)

    try {
      // In a real app, this would be an API call to refresh the data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, just shuffle the existing media
      setMediaItems((prev) => [...prev].sort(() => Math.random() - 0.5))

      if (notyfRef.current) {
        notyfRef.current.success("Galería actualizada con el contenido más reciente")
      }
    } catch (err) {
      console.error("Error refreshing media:", err)
      setError("Error al actualizar la galería. Por favor, intente nuevamente.")

      if (notyfRef.current) {
        notyfRef.current.error(
          `Error al actualizar la galería: ${err instanceof Error ? err.message : "Error desconocido"}`,
        )
      }
    } finally {
      setRefreshing(false)
    }
  }, [refreshing])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setSortOption("newest")
    setSelectedCategory(null)
  }, [])

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Galería Multimedia</h1>
          <Button onClick={() => setActiveSection("proyectos")} className="px-4 py-2 w-full sm:w-auto">
            <FaArrowLeft className="mr-2" />
            Volver a Proyectos
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-9 w-4/5" />
                    <Skeleton className="h-5 w-5 rounded-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Galería Multimedia</h1>
          <Button onClick={() => setActiveSection("proyectos")} className="px-4 py-2 w-full sm:w-auto">
            <FaArrowLeft className="mr-2" />
            Volver a Proyectos
          </Button>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <Button onClick={refreshMedia} className="mt-2 bg-red-600 hover:bg-red-700">
            <FaSync className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Reintentar
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedMedia.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              downloadMedia={downloadMedia}
              isSelected={selectedMedia.some((item) => item.id === media.id)}
              onSelect={() => toggleMediaSelection(media)}
              onPreview={() => handlePreview(media)}
              onToggleFavorite={() => toggleFavorite(media.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Galería Multimedia</h1>
        <div className="flex space-x-2">
          <Button onClick={refreshMedia} disabled={refreshing} variant="outline" className="px-3 py-2">
            <FaSync className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Actualizando..." : "Actualizar"}
          </Button>
          <Button onClick={() => setActiveSection("proyectos")} className="px-4 py-2">
            <FaArrowLeft className="mr-2" />
            Volver a Proyectos
          </Button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="mb-6  dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Buscar archivos multimedia"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="oldest">Más antiguos</SelectItem>
                <SelectItem value="nameAsc">Nombre (A-Z)</SelectItem>
                <SelectItem value="nameDesc">Nombre (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedCategory || "all"}
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
              <FaTimes className="mr-2" />
              Limpiar filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Selection controls */}
      {selectedMedia.length > 0 && (
        <div className="mb-4 p-3  dark:bg-blue-900 rounded-lg flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium mr-2">{selectedMedia.length} elementos seleccionados</span>
            <Button variant="outline" size="sm" onClick={clearSelections} className="mr-2">
              Deseleccionar todo
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button size="sm" onClick={downloadAllMedia}>
              <FaDownload className="mr-2" />
              Descargar seleccionados
            </Button>
            <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={shareViaWhatsApp}>
              <FaWhatsapp className="mr-2" />
              Compartir por WhatsApp
            </Button>
            <Button size="sm" className="0 hover:bg-blue-600" onClick={() => setIsShareDialogOpen(true)}>
              <FaEnvelope className="mr-2" />
              Compartir por Email
            </Button>
          </div>
        </div>
      )}

      <Tabs
        defaultValue="all"
        className="w-full"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "all" | "image" | "video" | "favorites")}
      >
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="image">Imágenes</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
        </TabsList>

        <div className="mb-4 flex flex-wrap justify-between items-center">
          <div className="mb-2 sm:mb-0">
            <span className="text-sm text-gray-500">{filteredAndSortedMedia.length} elementos</span>
            {filteredAndSortedMedia.length > 0 && (
              <Button variant="link" size="sm" onClick={selectAllVisible} className="ml-2">
                Seleccionar todos
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          {filteredAndSortedMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No se encontraron archivos multimedia</p>
              <Button onClick={resetFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  downloadMedia={downloadMedia}
                  isSelected={selectedMedia.some((item) => item.id === media.id)}
                  onSelect={() => toggleMediaSelection(media)}
                  onPreview={() => handlePreview(media)}
                  onToggleFavorite={() => toggleFavorite(media.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="image" className="space-y-6">
          {filteredAndSortedMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No se encontraron imágenes</p>
              <Button onClick={resetFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  downloadMedia={downloadMedia}
                  isSelected={selectedMedia.some((item) => item.id === media.id)}
                  onSelect={() => toggleMediaSelection(media)}
                  onPreview={() => handlePreview(media)}
                  onToggleFavorite={() => toggleFavorite(media.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          {filteredAndSortedMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No se encontraron videos</p>
              <Button onClick={resetFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  downloadMedia={downloadMedia}
                  isSelected={selectedMedia.some((item) => item.id === media.id)}
                  onSelect={() => toggleMediaSelection(media)}
                  onPreview={() => handlePreview(media)}
                  onToggleFavorite={() => toggleFavorite(media.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {filteredAndSortedMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No hay elementos marcados como favoritos</p>
              <Button onClick={() => setActiveTab("all")}>Ver todos los elementos</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedMedia.map((media) => (
                <MediaCard
                  key={media.id}
                  media={media}
                  downloadMedia={downloadMedia}
                  isSelected={selectedMedia.some((item) => item.id === media.id)}
                  onSelect={() => toggleMediaSelection(media)}
                  onPreview={() => handlePreview(media)}
                  onToggleFavorite={() => toggleFavorite(media.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Download all button */}
      {filteredAndSortedMedia.length > 0 && selectedMedia.length === 0 && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={downloadAllMedia}
            disabled={downloading || filteredAndSortedMedia.length === 0}
            className="px-6 py-3"
          >
            <FaDownload className="mr-2" />
            {downloading ? "Descargando..." : `Descargar todos (${filteredAndSortedMedia.length})`}
          </Button>
        </div>
      )}

      {/* Media preview dialog */}
      {previewMedia && (
        <MediaPreview
          media={previewMedia}
          onClose={() => setPreviewMedia(null)}
          onNext={handleNextPreview}
          onPrevious={handlePreviousPreview}
          hasNext={previewIndex < filteredAndSortedMedia.length - 1}
          hasPrevious={previewIndex > 0}
          onDownload={() =>
            downloadMedia(
              previewMedia.src,
              previewMedia.type === "image" ? previewMedia.alt : previewMedia.title,
              previewMedia.type,
            )
          }
          onToggleFavorite={() => toggleFavorite(previewMedia.id)}
        />
      )}

      {/* Email sharing dialog */}
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
                type="email"
              />
            </div>
            <div className="col-span-4">
              <p className="text-sm text-muted-foreground">
                {selectedMedia.length} archivos seleccionados para compartir
              </p>
              {downloading && (
                <div className="mt-2">
                  <Label>Progreso: {downloadProgress}%</Label>
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={shareViaEmail} disabled={!emailAddress || downloading}>
              {downloading ? "Enviando..." : "Enviar"}
              {downloading && <span className="ml-2 inline-block animate-pulse">...</span>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar acción</DialogTitle>
          </DialogHeader>
          <p>{confirmMessage}</p>
          {downloading && (
            <div className="mt-2">
              <Label>Progreso: {downloadProgress}%</Label>
              <Progress value={downloadProgress} className="h-2" />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)} disabled={downloading}>
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                setIsConfirmDialogOpen(false)
                await confirmAction()
              }}
              disabled={downloading}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
