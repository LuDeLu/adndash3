"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from "lucide-react"
import { getAllTickets, approveTicket } from "@/lib/checklist"
import type { ApprovalTicket } from "@/types/approval-ticket"
import { useToast } from "@/hooks/use-toast"
import { KanbanBoard } from "./kanban-board"
import { TicketDetailModal } from "./ticket-detail-modal"
import { NewTicketDialog } from "./new-ticket-dialog"

export function EnhancedDashboard() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<ApprovalTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<ApprovalTicket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<ApprovalTicket | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Cargar tickets al iniciar
  useEffect(() => {
    fetchTickets()
  }, [])

  // Filtrar tickets en tiempo real
  useEffect(() => {
    let filtered = tickets
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = tickets.filter(
        (t) =>
          t.ticket_id.toLowerCase().includes(term) ||
          t.title.toLowerCase().includes(term) ||
          t.emprendimiento.toLowerCase().includes(term) ||
          t.unidad_funcional.toLowerCase().includes(term),
      )
    }
    setFilteredTickets(filtered)
  }, [searchTerm, tickets])

  const fetchTickets = async () => {
    setIsLoading(true)
    try {
      const data = await getAllTickets()
      setTickets(data || [])
    } catch (error) {
      console.error("Error al cargar tickets:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTicketCreated = (newTicket: ApprovalTicket) => {
    setTickets((prev) => [newTicket, ...prev])
    toast({
      title: "Éxito",
      description: "Ticket creado correctamente",
    })
  }

  const handleQuickApprove = async (ticketId: string, department: string, approved: boolean) => {
    try {
      const updatedTicket = await approveTicket(ticketId, department, approved)
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updatedTicket : t)))
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(updatedTicket)
      }
      toast({
        title: "Éxito",
        description: `Ticket ${approved ? "aprobado" : "rechazado"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo procesar la acción",
        variant: "destructive",
      })
    }
  }

  const stats = {
    total: tickets.length,
    pendientes: tickets.filter((t) => t.estado === "pendiente").length,
    aprobados: tickets.filter((t) => t.estado === "aprobado").length,
    rechazados: tickets.filter((t) => t.estado === "rechazado").length,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header con estadísticas */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Aprobaciones</h1>
            <p className="text-muted-foreground mt-1">Seguimiento de tickets de firma digital</p>
          </div>
          <NewTicketDialog onTicketCreated={handleTicketCreated} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total de tickets</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.pendientes}</div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.aprobados}</div>
              <p className="text-sm text-muted-foreground">Aprobados</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.rechazados}</div>
              <p className="text-sm text-muted-foreground">Rechazados</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controles de búsqueda y vista */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ticket, título, emprendimiento..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "kanban" | "list")}>
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Contenido principal */}
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard
          tickets={filteredTickets}
          onTicketClick={(ticket) => {
            setSelectedTicket(ticket)
            setIsDetailOpen(true)
          }}
        />
      ) : (
        <ListView
          tickets={filteredTickets}
          onTicketClick={(ticket) => {
            setSelectedTicket(ticket)
            setIsDetailOpen(true)
          }}
        />
      )}

      {/* Modal de detalles */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onApprove={handleQuickApprove}
        />
      )}
    </div>
  )
}

// Componente de vista lista
function ListView({
  tickets,
  onTicketClick,
}: {
  tickets: ApprovalTicket[]
  onTicketClick: (ticket: ApprovalTicket) => void
}) {
  return (
    <div className="space-y-3">
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron tickets</p>
          </CardContent>
        </Card>
      ) : (
        tickets.map((ticket) => {
          const totalDepts = Object.keys(ticket.aprobaciones).length
          const approvedDepts = Object.values(ticket.aprobaciones).filter((a) => a.aprobado).length
          const progress = Math.round((approvedDepts / totalDepts) * 100)

          return (
            <Card
              key={ticket.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onTicketClick(ticket)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm font-semibold text-primary">{ticket.ticket_id}</div>
                      {ticket.estado === "pendiente" && (
                        <Badge variant="outline" className="bg-yellow-50">
                          Pendiente
                        </Badge>
                      )}
                      {ticket.estado === "aprobado" && <Badge className="bg-green-100 text-green-800">Aprobado</Badge>}
                      {ticket.estado === "rechazado" && <Badge variant="destructive">Rechazado</Badge>}
                    </div>
                    <p className="font-medium mt-1">{ticket.title}</p>
                    <div className="flex gap-6 text-sm text-muted-foreground mt-2">
                      <span>{ticket.emprendimiento}</span>
                      <span>UF {ticket.unidad_funcional}</span>
                      <span>{new Date(ticket.fecha_creacion).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right min-w-max ml-4">
                    <div className="text-2xl font-bold text-primary">{progress}%</div>
                    <p className="text-xs text-muted-foreground">
                      {approvedDepts}/{totalDepts} aprobadas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
