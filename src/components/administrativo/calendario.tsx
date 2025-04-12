"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Button } from "@/components/ui/button"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  MessageCircle,
  FolderSyncIcon as Sync,
  AlertCircle,
  CalendarIcon,
  Loader2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { Notyf } from "notyf"
import "notyf/notyf.min.css"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { useAuth } from "@/app/auth/auth-context"

let notyf: Notyf | null = null

if (typeof window !== "undefined") {
  notyf = new Notyf({
    duration: 3000,
    position: { x: "right", y: "top" },
  })
}

type Event = {
  id: string
  title: string
  start: Date
  end: Date
  client: string
  completed: boolean
  reminded: boolean
  description?: string
  location?: string
  googleEventId?: string
}

type Client = {
  id: string
  nombre: string
  apellido: string
}

type GoogleConnectionStatus = {
  connected: boolean
  loading: boolean
  error: string | null
}

function ClientSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isOther, setIsOther] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch clients from the API
    setLoading(true)
    fetch("https://adndashboard.squareweb.app/api/clientes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClients(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching clients:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    // Verificar si el valor actual no está en la lista de clientes
    if (value && clients.length > 0) {
      const clientExists = clients.some((client) => client.id === value)
      setIsOther(!clientExists)
    }
  }, [value, clients])

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
      {loading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Cargando clientes...</span>
        </div>
      ) : (
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
      )}
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
  const { toast } = useToast()
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
    description: "",
    location: "",
  })
  const [filter, setFilter] = useState<"pendientes" | "cerrados" | "recordados">("pendientes")
  const [loading, setLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [googleStatus, setGoogleStatus] = useState<GoogleConnectionStatus>({
    connected: false,
    loading: true,
    error: null,
  })
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false)
  const [googleAuthUrl, setGoogleAuthUrl] = useState("")

  // Verificar el estado de conexión con Google Calendar
  const checkGoogleConnection = useCallback(async () => {
    try {
      setGoogleStatus((prev) => ({ ...prev, loading: true, error: null }))
      const response = await fetch("https://adndashboard.squareweb.app/api/events/google/status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setGoogleStatus({
          connected: data.connected,
          loading: false,
          error: null,
        })
      } else {
        setGoogleStatus({
          connected: false,
          loading: false,
          error: "No se pudo verificar la conexión con Google Calendar",
        })
      }
    } catch (error) {
      console.error("Error checking Google connection:", error)
      setGoogleStatus({
        connected: false,
        loading: false,
        error: "Error al verificar la conexión con Google Calendar",
      })
    }
  }, [])

  useEffect(() => {
    fetchEvents()
    checkGoogleConnection()

    // Verificar si venimos de una redirección de Google OAuth
    const urlParams = new URLSearchParams(window.location.search)
    const status = urlParams.get("status")

    if (status === "connected") {
      notyf?.success("Tu cuenta de Google Calendar ha sido conectada correctamente.")

      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [checkGoogleConnection])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://adndashboard.squareweb.app/api/events", {
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
        notyf?.error("No se pudieron cargar los eventos")
      }
    } catch (error) {
      console.error("Error fetching events:", error)
      notyf?.error("Error al cargar los eventos")
    } finally {
      setLoading(false)
    }
  }

  const handleDateClick = (arg: any) => {
    const startDate = arg.date
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + 1)

    setNewEvent({
      ...newEvent,
      start: startDate,
      end: endDate,
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
      try {
        setLoading(true)
        const eventToAdd: Event = {
          ...newEvent,
          id: selectedEvent ? selectedEvent.id : Date.now().toString(),
        }

        const url = selectedEvent
          ? `https://adndashboard.squareweb.app/api/events/${selectedEvent.id}`
          : "https://adndashboard.squareweb.app/api/events"
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
            description: "",
            location: "",
          })

          notyf?.success(selectedEvent ? "Evento actualizado" : "Evento creado")
        } else if (response.status === 207) {
          // Evento creado localmente pero falló la sincronización con Google
          const data = await response.json()
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
            description: "",
            location: "",
          })

          notyf?.error(data.message)
        } else {
          console.error("Failed to add/edit event")
          notyf?.error("No se pudo guardar el evento")
        }
      } catch (error) {
        console.error("Error adding/editing event:", error)
        notyf?.error("Error al guardar el evento")
      } finally {
        setLoading(false)
      }
    } else {
      notyf?.error("Por favor complete todos los campos requeridos")
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`https://adndashboard.squareweb.app/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        await fetchEvents()
        notyf?.success("Evento eliminado")
      } else if (response.status === 207) {
        // Evento eliminado localmente pero falló la eliminación en Google
        const data = await response.json()
        await fetchEvents()

        notyf?.error(data.message)
      } else {
        console.error("Failed to delete event")
        notyf?.error("No se pudo eliminar el evento")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      notyf?.error("Error al eliminar el evento")
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteEvent = async (eventId: string) => {
    const eventToUpdate = events.find((e) => e.id === eventId)
    if (eventToUpdate) {
      try {
        setLoading(true)
        const response = await fetch(`https://adndashboard.squareweb.app/api/events/${eventId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ...eventToUpdate, completed: !eventToUpdate.completed }),
        })

        if (response.ok) {
          await fetchEvents()
          notyf?.success(eventToUpdate.completed ? "Evento reabierto" : "Evento completado")
        } else {
          console.error("Failed to update event")
          notyf?.error("No se pudo actualizar el estado del evento")
        }
      } catch (error) {
        console.error("Error updating event:", error)
        notyf?.error("Error al actualizar el estado del evento")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRemindEvent = async (eventId: string) => {
    const eventToUpdate = events.find((e) => e.id === eventId)
    if (eventToUpdate) {
      try {
        setLoading(true)
        const response = await fetch(`https://adndashboard.squareweb.app/api/events/${eventId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ...eventToUpdate, reminded: true }),
        })

        if (response.ok) {
          await fetchEvents()
          notyf?.success("Recordatorio enviado")
        } else {
          console.error("Failed to update event")
          notyf?.error("No se pudo marcar el evento como recordado")
        }
      } catch (error) {
        console.error("Error updating event:", error)
        notyf?.error("Error al marcar el evento como recordado")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSyncWithGoogleCalendar = async () => {
    try {
      setSyncLoading(true)

      // Si no está conectado, iniciar el flujo de autenticación
      if (!googleStatus.connected) {
        const response = await fetch("https://adndashboard.squareweb.app/api/events/google/auth", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setGoogleAuthUrl(data.authUrl)
          setShowGoogleAuthModal(true)
        } else {
          notyf?.error("No se pudo iniciar la autenticación con Google Calendar")
        }
        return
      }

      // Si ya está conectado, sincronizar eventos
      const response = await fetch("https://adndashboard.squareweb.app/api/events/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        await fetchEvents()
        notyf?.success(
          `Se importaron ${data.stats.imported} eventos nuevos y se actualizaron ${data.stats.updated} eventos existentes.`,
        )
      } else if (response.status === 401) {
        // Token expirado, necesita reconectar
        const data = await response.json()
        if (data.action === "reauthorize") {
          setGoogleStatus((prev) => ({ ...prev, connected: false }))
          notyf?.error("La conexión con Google Calendar ha expirado. Por favor, reconecte su cuenta.")
        }
      } else {
        console.error("Failed to sync with Google Calendar")
        notyf?.error("No se pudo sincronizar con Google Calendar")
      }
    } catch (error) {
      console.error("Error syncing with Google Calendar:", error)
      notyf?.error("Error al sincronizar con Google Calendar")
    } finally {
      setSyncLoading(false)
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
                    description: "",
                    location: "",
                  })
                  setShowEventModal(true)
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" /> Agregar Evento
              </Button>
              <Button
                onClick={handleSyncWithGoogleCalendar}
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={syncLoading}
              >
                {syncLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sync className="mr-2 h-4 w-4" />}
                {googleStatus.connected ? "Sincronizar" : "Conectar Google"}
              </Button>
            </div>
          </div>

          {googleStatus.connected && (
            <Alert className="mb-4 bg-green-900 border-green-700">
              <CalendarIcon className="h-4 w-4" />
              <AlertTitle>Google Calendar conectado</AlertTitle>
              <AlertDescription>
                Tu cuenta está conectada con Google Calendar. Los eventos se sincronizarán automáticamente.
              </AlertDescription>
            </Alert>
          )}

          {googleStatus.error && (
            <Alert className="mb-4 bg-red-900 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error de conexión</AlertTitle>
              <AlertDescription>{googleStatus.error}</AlertDescription>
            </Alert>
          )}

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events.map((event) => ({
              id: event.id,
              title: event.title,
              start: event.start,
              end: event.end,
              backgroundColor: event.completed ? "#22543d" : event.reminded ? "#744210" : "#2a4365",
              borderColor: event.completed ? "#22543d" : event.reminded ? "#744210" : "#2a4365",
              textColor: "#ffffff",
              extendedProps: {
                client: event.client,
                completed: event.completed,
                reminded: event.reminded,
                description: event.description,
                location: event.location,
              },
            }))}
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
            loading={() => {}}
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
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center p-8 text-gray-400">
              No hay eventos{" "}
              {filter === "pendientes" ? "pendientes" : filter === "cerrados" ? "cerrados" : "recordados"}
            </div>
          ) : (
            filteredEvents.map((event) => (
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
                  {event.location && <p className="text-sm mb-2">Ubicación: {event.location}</p>}
                  {event.description && <p className="text-sm mb-4">Descripción: {event.description}</p>}
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
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant={event.completed ? "secondary" : "default"}
                      onClick={() => handleCompleteEvent(event.id)}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                      disabled={loading}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleRemindEvent(event.id)}
                      className="bg-gray-800 text-white hover:bg-gray-700"
                      disabled={loading || event.reminded}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal para crear/editar eventos */}
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
              <Label htmlFor="location" className="text-right">
                Ubicación
              </Label>
              <Input
                id="location"
                value={newEvent.location || ""}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="col-span-3 bg-gray-800 text-white border-gray-700"
                placeholder="Opcional"
              />
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={newEvent.description || ""}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="col-span-3 bg-gray-800 text-white border-gray-700"
                placeholder="Opcional"
                rows={3}
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
                  description: "",
                  location: "",
                })
              }}
              className="bg-gray-800 text-white hover:bg-gray-700"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddOrEditEvent}
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {selectedEvent ? "Guardar" : "Agregar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para autenticación de Google */}
      <Dialog open={showGoogleAuthModal} onOpenChange={setShowGoogleAuthModal}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Conectar con Google Calendar</DialogTitle>
            <DialogDescription>
              Para sincronizar tus eventos con Google Calendar, necesitas autorizar la aplicación.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="mb-4 bg-blue-900 border-blue-700">
              <CalendarIcon className="h-4 w-4" />
              <AlertTitle>Autorización requerida</AlertTitle>
              <AlertDescription>
                Serás redirigido a Google para autorizar el acceso a tu calendario. Una vez completado, volverás
                automáticamente a esta aplicación.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGoogleAuthModal(false)}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                window.location.href = googleAuthUrl
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Conectar con Google
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
