"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { FormData } from "@/types/form-data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Share2, Download, Eye, RefreshCw, Loader2 } from "lucide-react"
import { generatePDF } from "@/lib/checklist"

interface PDFViewerProps {
  formData: FormData
}

export function PDFViewer({ formData }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  useEffect(() => {
    generatePdfDocument()
    // Limpiar URL al desmontar
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generatePdfDocument = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      // Limpiar URL anterior si existe
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
        setPdfUrl(null)
      }

      // Generar nuevo PDF usando la API
      const pdfBlob = await generatePDF(formData)
      const url = URL.createObjectURL(pdfBlob)
      setPdfUrl(url)
      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating PDF:", error)
      setError("Ocurrió un error al generar el PDF. Por favor, intente nuevamente.")
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfUrl
      const fileName = formData.emprendimiento
        ? `Formulario_Aprobacion_${formData.emprendimiento.replace(/\s+/g, "_")}.pdf`
        : "Formulario_Aprobacion.pdf"
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleShare = async () => {
    if (pdfUrl) {
      // En una aplicación real, subirías el PDF a un servidor y obtendrías una URL compartible
      // Para este ejemplo, simulamos esto
      setShareUrl(`https://example.com/shared-document/${Math.random().toString(36).substring(2, 15)}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vista Previa del PDF</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={generatePdfDocument} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Regenerar
          </Button>

          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!pdfUrl || isGenerating}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleShare} disabled={!pdfUrl || isGenerating}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Compartir Documento</DialogTitle>
              </DialogHeader>
              {shareUrl ? (
                <div className="space-y-4">
                  <p>Utiliza el siguiente enlace para compartir este documento:</p>
                  <div className="flex">
                    <input type="text" value={shareUrl} readOnly className="flex-1 p-2 border rounded-l-md" />
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl)
                        alert("Enlace copiado al portapapeles")
                      }}
                      className="rounded-l-none"
                    >
                      Copiar
                    </Button>
                  </div>
                </div>
              ) : (
                <p>Generando enlace para compartir...</p>
              )}
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={!pdfUrl || isGenerating}>
                <Eye className="h-4 w-4 mr-2" />
                Ver Completo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh]">
              <DialogHeader>
                <DialogTitle>Documento Completo</DialogTitle>
              </DialogHeader>
              {pdfUrl ? (
                <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
              ) : (
                <p>Cargando documento...</p>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isGenerating ? (
        <div className="flex justify-center items-center h-[500px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Generando PDF...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-[500px] space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={generatePdfDocument} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      ) : pdfUrl ? (
        <Card className="overflow-hidden">
          <div className="h-[500px] overflow-auto">
            <iframe src={pdfUrl} className="w-full h-full" title="PDF Preview" />
          </div>
        </Card>
      ) : (
        <div className="flex justify-center items-center h-[500px]">
          <p>No se pudo generar el PDF. Por favor, intente nuevamente.</p>
          <Button onClick={generatePdfDocument} className="ml-4">
            Reintentar
          </Button>
        </div>
      )}
    </div>
  )
}
