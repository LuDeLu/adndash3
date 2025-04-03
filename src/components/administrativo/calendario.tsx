"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, CheckCircle, MessageCircle, FolderSyncIcon as Sync } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useAuth } from "@/app/auth/auth-context"

type Event = {
  id: string
  title: string
  start: Date
  end: Date
  client: string
  completed: boolean
  reminded: boolean
  googleEventId?: string
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
    // Fetch clients from the API
    fetch("https://adndash.squareweb.app/api/clientes")
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Error fetching clients:", error))
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

export default function Calendar() {
  const { user } = useAuth()
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

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://adndash.squareweb.app/api/events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setEvents(
          data.map((event: any) => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          })),
        )
      } else {
        console.error("Failed to fetch events")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

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

  const handleAddOrEditEvent = async () => {
    if (newEvent.title && newEvent.client && newEvent.start && newEvent.end) {
      const eventToAdd: Event = {
        ...newEvent,
        id: selectedEvent ? selectedEvent.id : Date.now().toString(),
      }

      try {
        const url = selectedEvent
          ? `https://adndash.squareweb.app/api/events/${selectedEvent.id}`
          : "https://adndash.squareweb.app/api/events"
        const method = selectedEvent ? "PUT" : "POST"

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(eventToAdd),
        })

        if (response.ok) {
          await fetchEvents()
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
        } else {
          console.error("Failed to add/edit event")
        }
      } catch (error) {
        console.error("Error adding/editing event:", error)
      }
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`https://adndash.squareweb.app/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        await fetchEvents()
      } else {
        console.error("Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const handleCompleteEvent = async (eventId: string) => {
    const eventToUpdate = events.find((e) => e.id === eventId)
    if (eventToUpdate) {
      try {
        const response = await fetch(`https://adndash.squareweb.app/api/events/${eventId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ...eventToUpdate, completed: !eventToUpdate.completed }),
        })

        if (response.ok) {
          await fetchEvents()
        } else {
          console.error("Failed to update event")
        }
      } catch (error) {
        console.error("Error updating event:", error)
      }
    }
  }

  const handleRemindEvent = async (eventId: string) => {
    const eventToUpdate = events.find((e) => e.id === eventId)
    if (eventToUpdate) {
      try {
        const response = await fetch(`https://adndash.squareweb.app/api/events/${eventId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ...eventToUpdate, reminded: true }),
        })

        if (response.ok) {
          await fetchEvents()
        } else {
          console.error("Failed to update event")
        }
      } catch (error) {
        console.error("Error updating event:", error)
      }
    }
  }

  const handleSyncWithGoogleCalendar = async () => {
    try {
      const response = await fetch("https://adndash.squareweb.app/api/events/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        await fetchEvents()
        console.log("Synced with Google Calendar successfully")
      } else {
        console.error("Failed to sync with Google Calendar")
      }
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error)
    }
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">Calendario de {user?.name || "Demostración"}</h1>
            <div className="flex space-x-2">
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
              <Button onClick={handleSyncWithGoogleCalendar} className="bg-blue-600 text-white hover:bg-blue-700">
                <Sync className="mr-2 h-4 w-4" /> Sincronizar con Google
              </Button>
            </div>
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

