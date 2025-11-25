import type React from "react"
import type { Tarea } from "@/types/index"

interface TareaDetalleProps {
  tarea: Tarea
}

export const TareaDetalle: React.FC<TareaDetalleProps> = ({ tarea }) => {
  const calcularDuracion = (inicio: Date, fin: Date) => {
    const diferencia = fin.getTime() - inicio.getTime()
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24))
    return dias
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium">Responsable</h4>
        <p>{tarea.responsable}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium">Fechas</h4>
        <p>Inicio: {tarea.inicio.toLocaleDateString()}</p>
        <p>Fin: {tarea.fin.toLocaleDateString()}</p>
        <p>Duración: {calcularDuracion(tarea.inicio, tarea.fin)} días</p>
      </div>
      <div>
        <h4 className="text-sm font-medium">Progreso</h4>
        <p>{tarea.progreso}% completado</p>
      </div>
      <div>
        <h4 className="text-sm font-medium">Estado</h4>
        <p>{tarea.estado}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium">Horas de trabajo estimadas</h4>
        <p>{calcularDuracion(tarea.inicio, tarea.fin) * 8} horas</p>
      </div>
      <div>
        <h4 className="text-sm font-medium">Descripción</h4>
        <p>{tarea.descripcion || "No hay descripción disponible."}</p>
      </div>
    </div>
  )
}
