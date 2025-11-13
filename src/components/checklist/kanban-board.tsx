"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ApprovalTicket } from "@/types/approval-ticket"

interface KanbanBoardProps {
  tickets: ApprovalTicket[]
  onTicketClick: (ticket: ApprovalTicket) => void
}

export function KanbanBoard({ tickets, onTicketClick }: KanbanBoardProps) {
  const columns = {
    pendiente: tickets.filter((t) => t.estado === "pendiente"),
    aprobado: tickets.filter((t) => t.estado === "aprobado"),
    rechazado: tickets.filter((t) => t.estado === "rechazado"),
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Columna Pendientes */}
      <KanbanColumn
        title="Pendientes"
        icon="⏳"
        tickets={columns.pendiente}
        onTicketClick={onTicketClick}
        color="yellow"
      />

      {/* Columna Aprobados */}
      <KanbanColumn title="Aprobados" icon="✓" tickets={columns.aprobado} onTicketClick={onTicketClick} color="green" />

      {/* Columna Rechazados */}
      <KanbanColumn title="Rechazados" icon="✕" tickets={columns.rechazado} onTicketClick={onTicketClick} color="red" />
    </div>
  )
}

interface KanbanColumnProps {
  title: string
  icon: string
  tickets: ApprovalTicket[]
  onTicketClick: (ticket: ApprovalTicket) => void
  color: "yellow" | "green" | "red"
}

function KanbanColumn({ title, icon, tickets, onTicketClick, color }: KanbanColumnProps) {
  const colorMap = {
    yellow: " border-yellow-200",
    green: " border-green-200",
    red: " border-red-200",
  }

  const badgeMap = {
    yellow: " text-yellow-800",
    green: " text-green-800",
    red: " text-red-800",
  }

  return (
    <div className={`rounded-lg border-2 p-4 ${colorMap[color]} min-h-96`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
        <Badge className={badgeMap[color]}>{tickets.length}</Badge>
      </div>

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">Sin tickets</p>
        ) : (
          tickets.map((ticket) => {
            const totalDepts = Object.keys(ticket.aprobaciones).length
            const approvedDepts = Object.values(ticket.aprobaciones).filter((a) => a.aprobado).length
            const progress = Math.round((approvedDepts / totalDepts) * 100)

            return (
              <Card
                key={ticket.id}
                className="cursor-pointer hover:shadow-md transition-all hover:scale-105"
                onClick={() => onTicketClick(ticket)}
              >
                <CardContent className="p-3">
                  <div className="font-mono text-xs font-bold text-primary mb-1">{ticket.ticket_id}</div>
                  <p className="text-sm font-medium line-clamp-2 mb-2">{ticket.title}</p>

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p className="truncate">{ticket.emprendimiento}</p>
                      <p>UF {ticket.unidad_funcional}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-semibold text-primary">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            progress === 100 ? "bg-green-500" : progress > 50 ? "bg-blue-500" : "bg-yellow-500"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
