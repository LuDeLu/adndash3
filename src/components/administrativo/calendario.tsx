"use client"

import React, { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, CheckCircle, MessageCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"

type Event = {
  id: string
  title: string
  start: Date
  end: Date
  client: string
  completed: boolean
  reminded: boolean
}

type Client = {
  id: string
  nombre: string
  apellido: string
}

function ClientSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isOther, setIsOther] = useState(false)

  useEffect(() => {
    // En una aplicación real, aquí se haría una llamada a la API para obtener los clientes
    setClients([
      { id: "Lucas Baez", nombre: "Lucas", apellido: "Baez" },
      { id: "Nicolas Mazzotti", nombre: "Nicolas", apellido: "Mazzotti" },
      { id: "Sofia Ortiz", nombre: "Sofia", apellido: "Ortiz" },
      { id: "Noumeira Alberdi", nombre: "Noumeira", apellido: "Alberdi" },
    ])
  }, [])

  const handleChange = (newValue: string) => {
    if (newValue === "other") {
      setIsOther(true)
      onChange("")
    } else {
      setIsOther(false)
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <Select value={isOther ? "other" : value} onValueChange={handleChange}>
        <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
          <SelectValue placeholder="Seleccionar cliente" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white border-gray-700">
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.nombre} {client.apellido}
            </SelectItem>
          ))}
          <SelectItem value="other">Otro</SelectItem>
        </SelectContent>
      </Select>
      {isOther && (
        <Input
          placeholder="Ingrese el nombre del cliente"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 bg-gray-800 text-white border-gray-700"
        />
      )}
    </div>
  )
}

export default function DemoCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Event>({
    id: "",
    title: "",
    client: "",
    start: new Date(),
    end: new Date(),
    completed: false,
    reminded: false,
  })
  const [filter, setFilter] = useState<"pendientes" | "cerrados" | "recordados">("pendientes")

  const handleDateClick = (arg: any) => {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      end: addDays(arg.date, 1),
    })
    setShowEventModal(true)
  }

  const handleEventClick = (info: any) => {
    const event = events.find((e) => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
      setNewEvent(event)
      setShowEventModal(true)
    }
  }

  const handleAddOrEditEvent = () => {
    if (newEvent.title && newEvent.client && newEvent.start && newEvent.end) {
      const eventToAdd: Event = {
        ...newEvent,
        id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      }

      setEvents((prev) =>
        selectedEvent ? prev.map((e) => (e.id === eventToAdd.id ? eventToAdd : e)) : [...prev, eventToAdd],
      )

      setShowEventModal(false)
      setSelectedEvent(null)
      setNewEvent({
        id: "",
        title: "",
        client: "",
        start: new Date(),
        end: new Date(),
        completed: false,
        reminded: false,
      })
    }
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId))
  }

  const handleCompleteEvent = (eventId: string) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, completed: !e.completed } : e)))
  }

  const handleRemindEvent = (eventId: string) => {
    setEvents((prev) => prev.map((e) => (e.id === eventId ? { ...e, reminded: true } : e)))
  }

  const filteredEvents = events.filter((event) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    switch (filter) {
      case "pendientes":
        return !event.completed && event.start >= today
      case "cerrados":
        return event.completed
      case "recordados":
        return event.reminded && !event.completed
      default:
        return true
    }
  })

  return (
    <div className="h-screen flex flex-col md:flex-row bg-black text-white">
      <div className="flex-grow p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Calendario de Demostración</h1>
            <Button
              onClick={() => {
                setSelectedEvent(null)
                setNewEvent({
                  id: "",
                  title: "",
                  client: "",
                  start: new Date(),
                  end: new Date(),
                  completed: false,
                  reminded: false,
                })
                setShowEventModal(true)
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" /> Agregar Evento
            </Button>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            locale={es}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              list: "Lista",
            }}
          />
        </div>
      </div>

      <div className="w-full md:w-96 text-white border-t md:border-l md:border-t-0 p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Citas registradas</h2>
        <Tabs
          value={filter}
          onValueChange={(value: string) => setFilter(value as "pendientes" | "cerrados" | "recordados")}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="cerrados">Cerrados</TabsTrigger>
            <TabsTrigger value="recordados">Recordados</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className={`${event.completed ? "bg-green-900" : event.reminded ? "bg-yellow-900" : "bg-gray-900"} text-white border border-gray-700`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription>
                  Cliente: {event.client}
                  {event.completed && <Badge className="ml-2 bg-green-500 text-white">Finalizado</Badge>}
                  {event.reminded && !event.completed && (
                    <Badge className="ml-2 bg-yellow-500 text-white">Recordado</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-1">
                  Inicio: {format(event.start, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                </p>
                <p className="text-sm mb-4">
                  Fin: {format(event.end, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                </p>
                <div className="flex justify-between">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setSelectedEvent(event)
                      setNewEvent(event)
                      setShowEventModal(true)
                    }}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDeleteEvent(event.id)}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={event.completed ? "secondary" : "default"}
                    onClick={() => handleCompleteEvent(event.id)}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleRemindEvent(event.id)}
                    className="bg-gray-800 text-white hover:bg-gray-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Editar Evento" : "Agregar Nuevo Evento"}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Modifica los detalles del evento" : "Ingresa los detalles del nuevo evento"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="col-span-3 bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Cliente
              </Label>
              <div className="col-span-3">
                <ClientSelector
                  value={newEvent.client}
                  onChange={(value) => setNewEvent({ ...newEvent, client: value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Inicio
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={newEvent.start ? format(newEvent.start, "yyyy-MM-dd'T'HH:mm") : ""}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                className="col-span-3 bg-gray-800 text-white border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                Fin
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={newEvent.end ? format(newEvent.end, "yyyy-MM-dd'T'HH:mm") : ""}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                className="col-span-3 bg-gray-800 text-white border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEventModal(false)
                setSelectedEvent(null)
                setNewEvent({
                  id: "",
                  title: "",
                  client: "",
                  start: new Date(),
                  end: new Date(),
                  completed: false,
                  reminded: false,
                })
              }}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button onClick={handleAddOrEditEvent} className="bg-gray-800 text-white hover:bg-gray-700">
              {selectedEvent ? "Guardar" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

