'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, CheckCircle, MessageCircle } from 'lucide-react'
import { useAuth } from '@/app/auth/auth-context'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

type Event = {
  id: string
  title: string
  start: Date
  end: Date
  client: string
  completed: boolean
  reminded: boolean
  googleEventId: string | null
  classNames: string[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://adndashbackend.onrender.com/api';

export default function CombinedCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    client: "",
    start: new Date(),
    end: new Date(),
    completed: false,
    reminded: false,
    googleEventId: null,
    classNames: []
  })
  const [filter, setFilter] = useState<"pendientes" | "cerrados" | "recordados">("pendientes")
  const { user } = useAuth()

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data.map((event: any): Event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          classNames: getEventClassNames(event),
          googleEventId: event.googleEventId || null
        })));
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const getEventClassNames = (event: Event) => {
    if (event.completed) return ['fc-event-success'];
    if (event.reminded) return ['fc-event-warning'];
    return ['fc-event-info'];
  }

  const handleDateClick = (arg: any) => {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      end: addDays(arg.date, 1)
    })
    setShowEventModal(true)
  }

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
      setNewEvent(event)
      setShowEventModal(true)
    }
  }

  const handleAddOrEditEvent = async () => {
    if (newEvent.title && newEvent.client && newEvent.start && newEvent.end) {
      try {
        const url = selectedEvent 
          ? `${API_BASE_URL}/events/${selectedEvent.id}`
          : `${API_BASE_URL}/events`;
        const method = selectedEvent ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newEvent)
        });
  
        if (response.ok) {
          const data = await response.json();
          const event: Event = {
            ...data,
            start: new Date(data.start),
            end: new Date(data.end),
            classNames: getEventClassNames(data),
            googleEventId: data.googleEventId || null
          };
          
          setEvents(prev => 
            selectedEvent
              ? prev.map(e => e.id === event.id ? event : e)
              : [...prev, event]
          );
          
          setShowEventModal(false);
          setSelectedEvent(null);
          setNewEvent({
            title: "",
            client: "",
            start: new Date(),
            end: new Date(),
            completed: false,
            reminded: false,
            googleEventId: null,
            classNames: []
          });
        } else {
          throw new Error(`Failed to ${selectedEvent ? 'update' : 'create'} event`);
        }
      } catch (error) {
        console.error(`Error ${selectedEvent ? 'updating' : 'creating'} event:`, error);
      }
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setSelectedEvent(null);
        setShowEventModal(false);
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleCompleteEvent = async (eventId: string) => {
    try {
      const eventToUpdate = events.find(e => e.id === eventId);
      if (!eventToUpdate) return;
  
      const updatedEvent = { ...eventToUpdate, completed: !eventToUpdate.completed };
  
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedEvent)
      });
  
      if (response.ok) {
        setEvents(prev =>
          prev.map(e => (e.id === eventId ? {...updatedEvent, classNames: getEventClassNames(updatedEvent)} : e))
        );
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleRemindEvent = async (eventId: string) => {
    try {
      const eventToUpdate = events.find(e => e.id === eventId);
      if (!eventToUpdate) return;

      const updatedEvent = { ...eventToUpdate, reminded: true };

      const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedEvent)
      });

      if (response.ok) {
        setEvents(prev =>
          prev.map(e => (e.id === eventId ? {...updatedEvent, classNames: getEventClassNames(updatedEvent)} : e))
        );
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
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

  const handleEventDrop = async (info: any) => {
    const { event } = info;
    await updateEventDates(event);
  };

  const handleEventResize = async (info: any) => {
    const { event } = info;
    await updateEventDates(event);
  };

  const updateEventDates = async (event: any) => {
    const existingEvent = events.find(e => e.id === event.id);
    if (!existingEvent) return;

    const updatedEvent: Event = {
      ...existingEvent,
      start: event.start,
      end: event.end || event.start,
      classNames: getEventClassNames(existingEvent)
    };

    try {
      const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedEvent)
      });

      if (response.ok) {
        setEvents(prev =>
          prev.map(e => (e.id === event.id ? updatedEvent : e))
        );
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const syncWithGoogleCalendar = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        await fetchEvents();
      } else {
        throw new Error('Failed to sync with Google Calendar');
      }
    } catch (error) {
      console.error('Error syncing with Google Calendar:', error);
    }
  };

  useEffect(() => {
    if (user) {
      syncWithGoogleCalendar();
    }
  }, [user]);

  return (
    <div className="h-screen flex flex-col md:flex-row bg-black text-white">
      <div className="flex-grow p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Calendario de {user?.name}</h1>
            <div>
              <Button onClick={syncWithGoogleCalendar} className="mr-2 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Sincronizar con Google
              </Button>
              <Button onClick={() => {
                setSelectedEvent(null);
                setNewEvent({
                  title: "",
                  client: "",
                  start: new Date(),
                  end: new Date(),
                  completed: false,
                  reminded: false,
                  googleEventId: null,
                  classNames: []
                });
                setShowEventModal(true);
              }} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Agregar Evento
              </Button>
            </div>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={filteredEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            locale={es}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              list: 'Lista'
            }}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            themeSystem="standard"
          />
          <style jsx global>{`
            .fc {
              background-color: #111;
              color: #fff;
            }
            .fc-theme-standard td, .fc-theme-standard th {
              border-color: #333;
            }
            .fc-theme-standard .fc-scrollgrid {
              border-color: #333;
            }
            .fc-theme-standard .fc-list-day-cushion {
              background-color: #222;
            }
            .fc .fc-button {
              background-color: #333;
              border-color: #444;
              color: #fff;
            }
            .fc .fc-button:hover {
              background-color: #444;
            }
            .fc .fc-button-primary:not(:disabled).fc-button-active, 
            .fc .fc-button-primary:not(:disabled):active {
              background-color: #555;
            }
          `}</style>
        </div>
      </div>

      <div className="w-full md:w-96  text-white border-t md:border-l md:border-t-0  p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-white">Citas registradas</h2>
        <Tabs value={filter} onValueChange={(value: string) => setFilter(value as "pendientes" | "cerrados" | "recordados")} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="cerrados">Cerrados</TabsTrigger>
            <TabsTrigger value="recordados">Recordados</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className={`${event.completed ? 'bg-green-900' : event.reminded ? 'bg-yellow-900' : 'bg-gray-800'} text-white`}>
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription>
                  Cliente: {event.client}
                  {event.completed && (
                    <Badge className="ml-2 bg-green-500 text-white">Finalizado</Badge>
                  )}
                  {event.reminded && !event.completed && (
                    <Badge className="ml-2 bg-yellow-500 text-white">Recordado</Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-1">Inicio: {format(event.start, 'dd \'de\' MMMM \'de\' yyyy, HH:mm', { locale: es })}</p>
                <p className="text-sm mb-4">Fin: {format(event.end, 'dd \'de\' MMMM \'de\' yyyy, HH:mm', { locale: es })}</p>
                <div className="flex justify-between">
                  <Button size="icon" variant="outline" onClick={() => {
                    setSelectedEvent(event)
                    setNewEvent(event)
                    setShowEventModal(true)
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={event.completed ? "secondary" : "default"}
                    onClick={() => handleCompleteEvent(event.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleRemindEvent(event.id)}>
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Editar Evento' : 'Agregar Nuevo Evento'}</DialogTitle>
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
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="client" className="text-right">
                Cliente
              </Label>
              <Input
                id="client"
                value={newEvent.client}
                onChange={(e) => setNewEvent({ ...newEvent, client: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Inicio
              </Label>
              <Input
                id="start"
                type="datetime-local"
                value={newEvent.start ? format(newEvent.start, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                Fin
              </Label>
              <Input
                id="end"
                type="datetime-local"
                value={newEvent.end ? format(newEvent.end, "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEventModal(false)
              setSelectedEvent(null)
              setNewEvent({
                title: "",
                client: "",
                start: new Date(),
                end: new Date(),
                completed: false,
                reminded: false,
                googleEventId: null,
                classNames: []
              })
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAddOrEditEvent}>
              {selectedEvent ? 'Guardar' : 'Agregar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

