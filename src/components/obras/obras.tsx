"use client"

import type React from "react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResumenProyecto } from "@/components/obras/ResumenProyecto"
import { PanelMonitoreoTareas } from "@/components/obras/PanelMonitoreoTareas"
import { InformeProgresoDiario } from "@/components/obras/InformeProgresoDiario"
import { SistemaAlertasNotificaciones } from "@/components/obras/SistemaAlertasNotificaciones"
import { RepositorioDocumentos } from "@/components/obras/RepositorioDocumentos"
import { VideoEnVivo } from "@/components/obras/VideoEnVivo"
import { Cronograma } from "@/components/obras/Cronograma"
import type { Proyecto, Tarea } from "@/types/index"
import { useAuth } from "@/app/auth/auth-context"

const SeguimientoProyectosConstruccionComponent: React.FC = () => {
  const { user } = useAuth()
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<string | null>(null)
  const [proyectos] = useState<Proyecto[]>([
    {
      id: "1",
      nombre: "DOME Palermo",
      progreso: 65,
      fechaInicio: "2023-01-15",
      fechaFin: "2024-06-30",
      detalles: {
        cimentacion: 100,
        estructura: 80,
        interior: 40,
        exterior: 20,
      },
      videoEnVivo: "https://example.com/live/dome-palermo",
    },
    {
      id: "2",
      nombre: "Business Plaza",
      progreso: 30,
      fechaInicio: "2023-03-01",
      fechaFin: "2024-12-31",
      detalles: {
        cimentacion: 100,
        estructura: 50,
        interior: 0,
        exterior: 0,
      },
      videoEnVivo: "https://example.com/live/business-plaza",
    },
  ])
  const [activeTab, setActiveTab] = useState("resumen")

  const [tareas] = useState<Tarea[]>([
    {
      id: "1",
      nombre: "Cimentación",
      inicio: new Date(2023, 0, 1),
      fin: new Date(2023, 1, 15),
      progreso: 100,
      responsable: "Juan Pérez",
      estado: "Completado",
      descripcion: "Preparación y construcción de los cimientos del edificio.",
    },
    {
      id: "2",
      nombre: "Estructura",
      inicio: new Date(2023, 1, 16),
      fin: new Date(2023, 3, 15),
      progreso: 75,
      responsable: "María González",
      estado: "En progreso",
      descripcion: "Levantamiento de la estructura principal del edificio.",
    },
    {
      id: "3",
      nombre: "Techado",
      inicio: new Date(2023, 3, 16),
      fin: new Date(2023, 4, 31),
      progreso: 25,
      responsable: "Carlos Rodríguez",
      estado: "En progreso",
      descripcion: "Instalación del techo y sistemas de drenaje.",
    },
    {
      id: "4",
      nombre: "Trabajo Interior",
      inicio: new Date(2023, 5, 1),
      fin: new Date(2023, 7, 31),
      progreso: 0,
      responsable: "Ana Martínez",
      estado: "Pendiente",
      descripcion: "Acabados interiores, instalaciones eléctricas y de plomería.",
    },
  ])

  if (!proyectoSeleccionado) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Proyectos de Construcción</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {proyectos.map((proyecto) => (
            <Card
              key={proyecto.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setProyectoSeleccionado(proyecto.id)}
            >
              <CardHeader>
                <CardTitle>{proyecto.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Progreso: {proyecto.progreso}%</p>
                <Progress value={proyecto.progreso} className="mt-2" />
                <p className="mt-2">Inicio: {proyecto.fechaInicio}</p>
                <p>Fin estimado: {proyecto.fechaFin}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const proyectoActual = proyectos.find((p) => p.id === proyectoSeleccionado)!

  return (
    <div className="container mx-auto p-4 flex justify-center items-start min-h-screen">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <Button onClick={() => setProyectoSeleccionado(null)} variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <CardTitle className="text-xl sm:text-2xl">Seguimiento: {proyectoActual.nombre}</CardTitle>
            </div>
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Seleccionar vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resumen">Resumen</SelectItem>
                <SelectItem value="tareas">Monitoreo de Tareas</SelectItem>
                <SelectItem value="cronograma">Cronograma</SelectItem>
                <SelectItem value="progreso">Progreso Diario</SelectItem>
                <SelectItem value="alertas">Notificaciones</SelectItem>
                <SelectItem value="documentos"> Documentos</SelectItem>
                <SelectItem value="envivo">En Vivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden sm:flex">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="tareas">Monitoreo de Tareas</TabsTrigger>
              <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
              <TabsTrigger value="progreso">Progreso Diario</TabsTrigger>
              <TabsTrigger value="alertas">Notificaciones</TabsTrigger>
              <TabsTrigger value="documentos"> Documentos</TabsTrigger>
              <TabsTrigger value="envivo">En Vivo</TabsTrigger>
            </TabsList>
            <TabsContent value="resumen">
              <ResumenProyecto proyecto={proyectoActual} />
            </TabsContent>
            <TabsContent value="tareas">
              <PanelMonitoreoTareas />
            </TabsContent>
            <TabsContent value="cronograma">
              <Cronograma tareas={tareas} />
            </TabsContent>
            <TabsContent value="progreso">
              <InformeProgresoDiario />
            </TabsContent>
            <TabsContent value="alertas">
              <SistemaAlertasNotificaciones />
            </TabsContent>
            <TabsContent value="documentos">
              <RepositorioDocumentos />
            </TabsContent>
            <TabsContent value="envivo">
              <VideoEnVivo proyecto={proyectoActual} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default SeguimientoProyectosConstruccionComponent

