'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useDropzone } from 'react-dropzone'
import { Bell, FileIcon, UploadIcon, DownloadIcon, ArrowLeft, ImageIcon, Video, Menu } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

// Tipos
type Proyecto = {
  id: string
  nombre: string
}

type Tarea = {
  id: string
  nombre: string
  inicio: Date
  fin: Date
  progreso: number
}

type Notificacion = {
  id: string
  mensaje: string
  tipo: 'plazo' | 'retraso' | 'hito'
  fecha: Date
}

type Documento = {
  id: string
  nombre: string
  tipo: string
  fechaSubida: Date
  url: string
}

// Componente principal
export function SeguimientoProyectosConstruccionComponent() {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string | null>(null)
  const [proyectos, setProyectos] = useState<Proyecto[]>([
    { id: '1', nombre: 'DOME Palermo' },
    { id: '2', nombre: 'Business Plaza' },
  ])
  const [activeTab, setActiveTab] = useState("tareas")

  const volverASeleccion = () => {
    setProyectoSeleccionado(null)
  }

  if (!proyectoSeleccionado) {
    return (
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Seleccionar Proyecto</h1>
        <Select onValueChange={(value) => setProyectoSeleccionado(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un proyecto" />
          </SelectTrigger>
          <SelectContent>
            {proyectos.map((proyecto) => (
              <SelectItem key={proyecto.id} value={proyecto.id}>
                {proyecto.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="flex items-center mb-4 sm:mb-0">
          <Button onClick={volverASeleccion} variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Seguimiento: {proyectos.find(p => p.id === proyectoSeleccionado)?.nombre}</h1>
        </div>
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Seleccionar vista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tareas">Monitoreo de Tareas</SelectItem>
            <SelectItem value="progreso">Progreso Diario</SelectItem>
            <SelectItem value="alertas">Alertas y Notificaciones</SelectItem>
            <SelectItem value="documentos">Repositorio de Documentos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden sm:flex">
          <TabsTrigger value="tareas">Monitoreo de Tareas</TabsTrigger>
          <TabsTrigger value="progreso">Progreso Diario</TabsTrigger>
          <TabsTrigger value="alertas">Alertas y Notificaciones</TabsTrigger>
          <TabsTrigger value="documentos">Repositorio de Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="progreso">
          <InformeProgresoDiario />
        </TabsContent>
        <TabsContent value="tareas">
          <PanelMonitoreoTareas />
        </TabsContent>
        <TabsContent value="alertas">
          <SistemaAlertasNotificaciones />
        </TabsContent>
        <TabsContent value="documentos">
          <RepositorioDocumentos />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente de Informe de Progreso Diario
function InformeProgresoDiario() {
  const [informe, setInforme] = useState({
    fecha: '',
    tareasCompletadas: '',
    porcentajeProgreso: '',
    cronogramaActualizado: '',
    notasAdicionales: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInforme(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Enviando informe:', informe)
    setInforme({
      fecha: '',
      tareasCompletadas: '',
      porcentajeProgreso: '',
      cronogramaActualizado: '',
      notasAdicionales: ''
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="fecha">Fecha</Label>
        <Input
          type="date"
          id="fecha"
          name="fecha"
          value={informe.fecha}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="tareasCompletadas">Tareas Completadas</Label>
        <Input
          type="text"
          id="tareasCompletadas"
          name="tareasCompletadas"
          value={informe.tareasCompletadas}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="porcentajeProgreso">Porcentaje de Progreso</Label>
        <Input
          type="number"
          id="porcentajeProgreso"
          name="porcentajeProgreso"
          value={informe.porcentajeProgreso}
          onChange={handleChange}
          min="0"
          max="100"
          required
        />
      </div>
      <div>
        <Label htmlFor="cronogramaActualizado">Cronograma Actualizado</Label>
        <Input
          type="text"
          id="cronogramaActualizado"
          name="cronogramaActualizado"
          value={informe.cronogramaActualizado}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="notasAdicionales">Notas Adicionales</Label>
        <Textarea
          id="notasAdicionales"
          name="notasAdicionales"
          value={informe.notasAdicionales}
          onChange={handleChange}
          rows={4}
        />
      </div>
      <Button type="submit" className="w-full sm:w-auto">Enviar Informe Diario</Button>
    </form>
  )
}

// Componente de Panel de Monitoreo de Tareas
function PanelMonitoreoTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([])

  useEffect(() => {
    const obtenerTareas = async () => {
      const tareasMock: Tarea[] = [
        { id: '1', nombre: 'Cimentación', inicio: new Date(2023, 0, 1), fin: new Date(2023, 1, 15), progreso: 100 },
        { id: '2', nombre: 'Estructura', inicio: new Date(2023, 1, 16), fin: new Date(2023, 3, 15), progreso: 75 },
        { id: '3', nombre: 'Techado', inicio: new Date(2023, 3, 16), fin: new Date(2023, 4, 31), progreso: 25 },
        { id: '4', nombre: 'Trabajo Interior', inicio: new Date(2023, 5, 1), fin: new Date(2023, 7, 31), progreso: 0 },
      ]
      setTareas(tareasMock)
    }
    obtenerTareas()
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Tareas</CardTitle>
          <CardDescription>Progreso actual de todas las tareas</CardDescription>
        </CardHeader>
        <CardContent>
          {tareas.map(tarea => (
            <div key={tarea.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm sm:text-base">{tarea.nombre}</span>
                <span className="text-sm sm:text-base">{tarea.progreso}%</span>
              </div>
              <Progress value={tarea.progreso} className="w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tareas pendientes</CardTitle>
          <CardDescription>Visualización de la línea de tiempo de las tareas del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-800 p-4 rounded">
            <p className="text-sm sm:text-base">Las tareas pendientes se mostrarán en este lugar</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de Sistema de Alertas y Notificaciones
function SistemaAlertasNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [configuraciones, setConfiguraciones] = useState({
    alertasPlazo: true,
    notificacionesRetraso: true,
    actualizacionesHito: true
  })

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      const notificacionesMock: Notificacion[] = [
        { id: '1', mensaje: 'Plazo próximo para la tarea de Estructura', tipo: 'plazo', fecha: new Date() },
        { id: '2', mensaje: 'Tarea de Techado retrasada por 2 días', tipo: 'retraso', fecha: new Date() },
        { id: '3', mensaje: 'Hito de finalización de Cimentación alcanzado', tipo: 'hito', fecha: new Date() },
      ]
      setNotificaciones(notificacionesMock)
    }
    obtenerNotificaciones()
  }, [])

  const handleCambioConfiguracion = (configuracion: keyof typeof configuraciones) => {
    setConfiguraciones(prev => ({ ...prev, [configuracion]: !prev[configuracion] }))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>Personaliza tus preferencias de alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="alertas-plazo"
              checked={configuraciones.alertasPlazo}
              onCheckedChange={() => handleCambioConfiguracion('alertasPlazo')}
            />
            <Label htmlFor="alertas-plazo" className="text-sm sm:text-base">Alertas de Plazo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notificaciones-retraso"
              checked={configuraciones.notificacionesRetraso}
              onCheckedChange={() => handleCambioConfiguracion('notificacionesRetraso')}
            />
            <Label htmlFor="notificaciones-retraso" className="text-sm sm:text-base">Notificaciones de Retraso</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="actualizaciones-hito"
              checked={configuraciones.actualizacionesHito}
              onCheckedChange={() => handleCambioConfiguracion('actualizacionesHito')}
            />
            <Label htmlFor="actualizaciones-hito" className="text-sm sm:text-base">Actualizaciones de Hitos</Label>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones Recientes</CardTitle>
          <CardDescription>Últimas alertas y actualizaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full">
            {notificaciones.map(notificacion => (
              <div key={notificacion.id} className="flex items-center space-x-2 mb-2">
                <Bell className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">{notificacion.mensaje}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de Repositorio de Documentos
function RepositorioDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: '1',
      nombre: 'Plano de cimentación.jpg',
      tipo: 'image/jpeg',
      fechaSubida: new Date(2023, 5, 15),
      url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plano-cimentacion-RDN0Z6HoT8k9d3p8k7X3v1j7d2Iy3K.jpg'
    },
    {
      id: '2',
      nombre: 'Video de avance de obra.mp4',
      tipo: 'video/mp4',
      fechaSubida: new Date(2023, 6, 1),
      url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video-avance-obra-5Xh0tDHHOI8RNZJZ8a5Ys8Yl8Hy2Uj.mp4'
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
                    {doc.tipo.startsWith('image/') && (
                      <img src={doc.url} alt={doc.nombre} className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded" />
                    )}
                    {doc.tipo.startsWith('video/') && (
                      <video src={doc.url} className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded" />
                    )}
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

export default SeguimientoProyectosConstruccionComponent

