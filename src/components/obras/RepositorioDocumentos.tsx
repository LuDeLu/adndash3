import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDropzone } from 'react-dropzone'
import { UploadIcon, DownloadIcon, ImageIcon, Video, FileIcon } from 'lucide-react'
import { Documento } from '@/types/index'

export const RepositorioDocumentos: React.FC = () => {
  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: '1',
      nombre: 'Plano de cimentación.jpg',
      tipo: 'image/jpeg',
      fechaSubida: new Date(2023, 5, 15),
      url: '/placeholder.svg?height=400&width=300'
    },
    {
      id: '2',
      nombre: 'Video de avance de obra.mp4',
      tipo: 'video/mp4',
      fechaSubida: new Date(2023, 6, 1),
      url: '/placeholder.svg?height=400&width=300'
    },
    {
      id: '3',
      nombre: 'Contrato de construcción.pdf',
      tipo: 'application/pdf',
      fechaSubida: new Date(2023, 4, 30),
      url: '/placeholder.svg?height=400&width=300'
    }
  ])
  const [terminoBusqueda, setTerminoBusqueda] = useState('')

  const onDrop = useCallback((archivosAceptados: File[]) => {
    const nuevosDocumentos = archivosAceptados.map(archivo => ({
      id: Math.random().toString(36).substr(2, 9),
      nombre: archivo.name,
      tipo: archivo.type,
      fechaSubida: new Date(),
      url: URL.createObjectURL(archivo)
    }))
    setDocumentos(prev => [...prev, ...nuevosDocumentos])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const documentosFiltrados = documentos.filter(doc =>
    doc.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Subir Documentos</CardTitle>
          <CardDescription>Arrastra y suelta archivos o haz clic para subir</CardDescription>
        </CardHeader>
        <CardContent>
          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-8 text-center cursor-pointer">
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-sm sm:text-base">Suelta los archivos aquí ...</p>
            ) : (
              <p className="text-sm sm:text-base">Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos</p>
            )}
            <UploadIcon className="mx-auto mt-4" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Documentos</CardTitle>
          <CardDescription>Busca y gestiona tus documentos técnicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="busqueda">Buscar Documentos</Label>
            <Input
              id="busqueda"
              type="text"
              placeholder="Buscar por nombre de documento"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {documentosFiltrados.map(doc => (
                <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-gray-800 rounded">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    {doc.tipo.startsWith('image/') ? (
                      <ImageIcon className="h-4 w-4 flex-shrink-0" />
                    ) : doc.tipo.startsWith('video/') ? (
                      <Video className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <FileIcon className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="text-sm sm:text-base">{doc.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={doc.url} download={doc.nombre}>
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Descargar</span>
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
