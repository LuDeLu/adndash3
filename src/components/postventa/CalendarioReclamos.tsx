"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import { Calendar, momentLocalizer, type View } from "react-big-calendar"
import moment from "moment"
import "moment/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, MapPin, User, Phone } from "lucide-react"
import type { Reclamo, EstadoReclamo } from "../../types/postVenta"
import { format } from "date-fns"

moment.locale("es")
const localizer = momentLocalizer(moment)

interface CalendarioReclamosProps {
  reclamos: Reclamo[]
  onEventClick: (reclamo: Reclamo) => void
}

interface EventoCalendario {
  id: string
  title: string
  start: Date
  end: Date
  reclamo: Reclamo
  estado: EstadoReclamo
}

export default function CalendarioReclamos({ reclamos, onEventClick }: CalendarioReclamosProps) {
  const [view, setView] = useState<View>("month")
  const [date, setDate] = useState(new Date())

  // Modificar la función eventos para manejar fechas inválidas
  const eventos = useMemo<EventoCalendario[]>(() => {
    return reclamos
      .filter(
        (reclamo): reclamo is Reclamo & { fechaVisita: string; horaVisita: string } =>
          typeof reclamo.fechaVisita === "string" &&
          reclamo.fechaVisita.trim() !== "" &&
          typeof reclamo.horaVisita === "string" &&
          reclamo.horaVisita.trim() !== "",
      )
      .map((reclamo) => {
        try {
          const [hours, minutes] = reclamo.horaVisita.split(":")
          const startDate = new Date(reclamo.fechaVisita)

          // Verificar que la fecha base sea válida
          if (isNaN(startDate.getTime())) {
            console.warn("Fecha de visita inválida:", reclamo.fechaVisita)
            // Usar la fecha actual como fallback
            const fallbackDate = new Date()
            return {
              id: `visita-${reclamo.id}`,
              title: `${reclamo.ticket} - ${reclamo.cliente} (fecha inválida)`,
              start: fallbackDate,
              end: new Date(fallbackDate.getTime() + 2 * 60 * 60 * 1000),
              reclamo: reclamo,
              estado: reclamo.estado,
            }
          }

          // Verificar que las horas y minutos sean números válidos
          if (isNaN(Number.parseInt(hours, 10)) || isNaN(Number.parseInt(minutes, 10))) {
            console.warn("Hora de visita inválida:", reclamo.horaVisita)
            startDate.setHours(9, 0) // Usar 9:00 AM como hora predeterminada
          } else {
            startDate.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10))
          }

          const endDate = new Date(startDate)
          endDate.setHours(endDate.getHours() + 2) // Asumimos que cada visita dura 2 horas

          return {
            id: `visita-${reclamo.id}`,
            title: `${reclamo.ticket} - ${reclamo.cliente}`,
            start: startDate,
            end: endDate,
            reclamo: reclamo,
            estado: reclamo.estado,
          }
        } catch (error) {
          console.error("Error al procesar fecha de reclamo:", error, reclamo)
          // Usar la fecha actual como fallback
          const fallbackDate = new Date()
          return {
            id: `visita-${reclamo.id}`,
            title: `${reclamo.ticket} - ${reclamo.cliente} (error de fecha)`,
            start: fallbackDate,
            end: new Date(fallbackDate.getTime() + 2 * 60 * 60 * 1000),
            reclamo: reclamo,
            estado: reclamo.estado,
          }
        }
      })
  }, [reclamos])

  const eventStyleGetter = (event: EventoCalendario) => {
    let backgroundColor = "#3b82f6" // azul por defecto
    let borderColor = "#2563eb"

    switch (event.estado) {
      case "Ingresado":
        backgroundColor = "#f59e0b" // amarillo
        borderColor = "#d97706"
        break
      case "En Inspección":
        backgroundColor = "#3b82f6" // azul
        borderColor = "#2563eb"
        break
      case "En Reparación":
        backgroundColor = "#10b981" // verde
        borderColor = "#059669"
        break
      case "Solucionado":
        backgroundColor = "#6b7280" // gris
        borderColor = "#4b5563"
        break
      case "No Corresponde":
        backgroundColor = "#ef4444" // rojo
        borderColor = "#dc2626"
        break
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "6px",
        opacity: 0.9,
        color: "white",
        border: `2px solid ${borderColor}`,
        display: "block",
        fontWeight: "500",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
        cursor: "pointer",
      },
    }
  }

  const onNavigate = (newDate: Date) => setDate(newDate)

  interface ToolbarProps {
    date: Date
    onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
    onView: (view: View) => void
    view: View
  }

  const CustomToolbar: React.FC<ToolbarProps> = ({ date, onNavigate, onView, view }) => {
    const goToBack = () => {
      onNavigate("PREV")
    }

    const goToNext = () => {
      onNavigate("NEXT")
    }

    const goToCurrent = () => {
      onNavigate("TODAY")
    }

    const label = () => {
      const momentDate = moment(date)
      return <span className="text-lg font-semibold">{momentDate.format("MMMM YYYY")}</span>
    }

    return (
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={goToBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-xl font-bold">{label()}</div>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-muted rounded-md p-1">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => onView("month")}
              className="rounded-r-none"
            >
              Mes
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => onView("week")}
              className="rounded-none"
            >
              Semana
            </Button>
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => onView("day")}
              className="rounded-l-none"
            >
              Día
            </Button>
          </div>
          <Button variant="outline" onClick={goToCurrent}>
            Hoy
          </Button>
        </div>
      </div>
    )
  }

  const EventComponent = useCallback(
    ({ event }: { event: EventoCalendario }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-full w-full p-1 overflow-hidden">
              <div className="font-medium truncate">{event.title}</div>
              {view !== "month" && (
                <div className="text-xs flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span className="truncate">
                    {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
                  </span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <div className="font-bold">{event.title}</div>
              <div className="text-xs flex items-center">
                <Badge variant="outline" className="mr-2">
                  {event.estado}
                </Badge>
                <Clock className="h-3 w-3 mr-1" />
                {format(event.start, "HH:mm")} - {format(event.end, "HH:mm")}
              </div>
              <div className="text-xs flex items-center">
                <User className="h-3 w-3 mr-1" />
                {event.reclamo.cliente}
              </div>
              <div className="text-xs flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                {event.reclamo.telefono}
              </div>
              <div className="text-xs flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {event.reclamo.edificio} - UF {event.reclamo.unidadFuncional}
              </div>
              {event.reclamo.detalle && (
                <div className="text-xs mt-1 border-t pt-1">
                  {event.reclamo.detalle.length > 100
                    ? `${event.reclamo.detalle.substring(0, 100)}...`
                    : event.reclamo.detalle}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    [view],
  )

  const components = {
    toolbar: CustomToolbar as any,
    event: EventComponent as any,
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Cronograma de Visitas
        </CardTitle>
        <CardDescription>Visualice y gestione las visitas programadas para los reclamos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[650px]">
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={["month", "week", "day"]}
            view={view}
            onView={(newView) => setView(newView as View)}
            date={date}
            onNavigate={onNavigate}
            eventPropGetter={eventStyleGetter}
            onSelectEvent={(event: EventoCalendario) => onEventClick(event.reclamo)}
            components={components}
            messages={{
              week: "Semana",
              day: "Día",
              month: "Mes",
              previous: "Anterior",
              next: "Siguiente",
              today: "Hoy",
              agenda: "Agenda",
              noEventsInRange: "No hay visitas programadas en este período",
              allDay: "Todo el día",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
            }}
            popup
            selectable
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="text-sm font-medium">Estados:</div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#f59e0b]">Ingresado</Badge>
            <Badge className="bg-[#3b82f6]">En Inspección</Badge>
            <Badge className="bg-[#10b981]">En Reparación</Badge>
            <Badge className="bg-[#6b7280]">Solucionado</Badge>
            <Badge className="bg-[#ef4444]">No Corresponde</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

