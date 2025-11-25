import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Tarea } from "@/types/index"
import { TareaDetalle } from "@/components/obras/TareaDetalle"

interface CronogramaProps {
  tareas: Tarea[]
}

export const Cronograma: React.FC<CronogramaProps> = ({ tareas }) => {
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)

  // Función para calcular el ancho y la posición de las barras del cronograma
  const calcularEstiloBarra = (inicio: Date, fin: Date) => {
    const proyectoInicio = new Date(2023, 0, 1)
    const proyectoFin = new Date(2023, 11, 31)
    const duracionProyecto = proyectoFin.getTime() - proyectoInicio.getTime()

    const inicioTarea = inicio.getTime() - proyectoInicio.getTime()
    const duracionTarea = fin.getTime() - inicio.getTime()

    const left = (inicioTarea / duracionProyecto) * 100
    const width = (duracionTarea / duracionProyecto) * 100

    return { left: `${left}%`, width: `${width}%` }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronograma del Proyecto</CardTitle>
        <CardDescription>
          Vista general de las tareas y su duración. Haz clic en una tarea para ver más detalles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 bg-muted rounded-md overflow-hidden">
          {tareas.map((tarea, index) => (
            <div
              key={tarea.id}
              className="absolute h-10 bg-primary rounded-md shadow-md transition-all duration-300 hover:brightness-110 cursor-pointer"
              style={{
                ...calcularEstiloBarra(tarea.inicio, tarea.fin),
                top: `${index * 40 + 10}px`,
              }}
              onClick={() => setTareaSeleccionada(tarea)}
            >
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-primary-foreground whitespace-nowrap overflow-hidden overflow-ellipsis max-w-full px-1">
                {tarea.nombre}
              </span>
            </div>
          ))}
          <div className="absolute top-0 left-0 w-full h-full flex justify-between pointer-events-none">
            {[...Array(13)].map((_, i) => (
              <div key={i} className="border-l border-muted-foreground h-full opacity-20"></div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-muted-foreground px-2">
            {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].map((mes, i) => (
              <span key={i}>{mes}</span>
            ))}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {tareas.map((tarea) => (
            <div key={tarea.id} className="flex justify-between items-center text-sm">
              <span className="font-medium">{tarea.nombre}</span>
              <span className="text-muted-foreground">
                {tarea.inicio.toLocaleDateString()} - {tarea.fin.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!tareaSeleccionada} onOpenChange={() => setTareaSeleccionada(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tareaSeleccionada?.nombre}</DialogTitle>
            <DialogDescription>Detalles de la tarea</DialogDescription>
          </DialogHeader>
          {tareaSeleccionada && <TareaDetalle tarea={tareaSeleccionada} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
