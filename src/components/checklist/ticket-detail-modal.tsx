"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, Download, MessageSquare, Loader2, Calendar, FileText } from "lucide-react"
import type { ApprovalTicket } from "@/types/approval-ticket"

interface TicketDetailModalProps {
  ticket: ApprovalTicket
  isOpen: boolean
  onClose: () => void
  onApprove: (ticketId: string, department: string, approved: boolean) => Promise<void>
}

export function TicketDetailModal({ ticket, isOpen, onClose, onApprove }: TicketDetailModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeComment, setActiveComment] = useState("")
  const [activeDept, setActiveDept] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false) // Add state for PDF download

  const handleApprove = async (dept: string, approved: boolean) => {
    setIsSubmitting(true)
    try {
      await onApprove(ticket.id, dept, approved)
      setActiveComment("")
      setActiveDept(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://adndashboard.squareweb.app/api"}/checklist/${ticket.id}/download-pdf`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Error al descargar el PDF")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${ticket.ticket_id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error descargando PDF:", error)
      alert("Error al descargar el PDF")
    } finally {
      setIsDownloading(false)
    }
  }

  const totalDepts = Object.keys(ticket.aprobaciones).length
  const approvedDepts = Object.values(ticket.aprobaciones).filter((a) => a.aprobado).length
  const progress = Math.round((approvedDepts / totalDepts) * 100)

  const deptNames = {
    contaduria: "Contaduría",
    legales: "Legales",
    tesoreria: "Tesorería",
    gerenciaComercial: "Gerencia Comercial",
    gerencia: "Gerencia",
    arquitecto: "Arquitecto",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl">{ticket.ticket_id}</DialogTitle>
                {ticket.estado === "pendiente" && <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>}
                {ticket.estado === "aprobado" && <Badge className="bg-green-100 text-green-800">Aprobado</Badge>}
                {ticket.estado === "rechazado" && <Badge variant="destructive">Rechazado</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{ticket.title}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{progress}%</div>
              <p className="text-xs text-muted-foreground">
                {approvedDepts}/{totalDepts} aprobadas
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="approvals">Firmas</TabsTrigger>
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          {/* Tab de Firmas - INTERFAZ RÁPIDA */}
          <TabsContent value="approvals" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(ticket.aprobaciones).map(([dept, approval]) => {
                const deptName = deptNames[dept as keyof typeof deptNames]
                const isApproved = approval.aprobado
                const isPending = !approval.usuario

                return (
                  <Card
                    key={dept}
                    className={`border-l-4 ${
                      isApproved ? "border-l-green-500" : isPending ? "border-l-gray-300" : "border-l-red-500"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{deptName}</CardTitle>
                        {isApproved ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : isPending ? (
                          <Clock className="h-5 w-5 text-gray-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isPending ? (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">Pendiente de firma</p>
                          {activeDept === dept ? (
                            <>
                              <Textarea
                                placeholder="Comentarios (opcional)"
                                value={activeComment}
                                onChange={(e) => setActiveComment(e.target.value)}
                                className="text-xs"
                                rows={2}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1"
                                  disabled={isSubmitting}
                                  onClick={() => handleApprove(dept, true)}
                                >
                                  {isSubmitting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 bg-transparent"
                                  disabled={isSubmitting}
                                  onClick={() => handleApprove(dept, false)}
                                >
                                  {isSubmitting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                                  Rechazar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setActiveDept(null)
                                    setActiveComment("")
                                  }}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Button size="sm" className="w-full" onClick={() => setActiveDept(dept)} variant="default">
                              Firmar
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Firmado por:</span> {approval.usuario}
                          </div>
                          <div>
                            <span className="font-medium">Fecha:</span>{" "}
                            {approval.fecha ? new Date(approval.fecha).toLocaleDateString() : "N/A"}
                          </div>
                          {approval.comentarios && (
                            <div className="mt-2 p-2 bg-muted rounded text-xs">
                              <p className="font-medium mb-1 flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" /> Comentarios:
                              </p>
                              <p>{approval.comentarios}</p>
                            </div>
                          )}
                          {isApproved ? (
                            <Badge className="bg-green-100 text-green-800 w-fit">Aprobado</Badge>
                          ) : (
                            <Badge variant="destructive" className="w-fit">
                              Rechazado
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Tab de Información */}
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Documento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{ticket.formData?.tipoDocumento || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Emprendimiento:</span>
                    <span className="font-medium">{ticket.formData?.emprendimiento}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unidad:</span>
                    <span className="font-medium">{ticket.formData?.unidadFuncional}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Cronograma
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Creado:</span>
                    <span className="font-medium">{new Date(ticket.fecha_creacion).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Por:</span>
                    <span className="font-medium">{ticket.creador_id}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Detalles del Comprador</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div>
                  <span className="text-muted-foreground">Nombre:</span> {ticket.formData?.comprador?.nombre}
                </div>
                <div>
                  <span className="text-muted-foreground">DNI:</span> {ticket.formData?.comprador?.dni}
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span> {ticket.formData?.comprador?.mail}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Historial */}
          <TabsContent value="history" className="space-y-4">
            <div className="border-l-2 border-gray-200 pl-4 space-y-6">
              <div className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-500"></div>
                <p className="text-sm font-medium">Ticket creado</p>
                <p className="text-xs text-muted-foreground">{new Date(ticket.fecha_creacion).toLocaleDateString()}</p>
              </div>

              {Object.entries(ticket.aprobaciones)
                .filter(([_, a]) => a.usuario)
                .map(([dept, approval]) => (
                  <div key={dept} className="relative">
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full ${
                        approval.aprobado ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <p className="text-sm font-medium">
                      {deptNames[dept as keyof typeof deptNames]} - {approval.aprobado ? "Aprobado" : "Rechazado"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {approval.fecha ? new Date(approval.fecha).toLocaleDateString() : "N/A"} - {approval.usuario}
                    </p>
                    {approval.comentarios && <p className="text-xs mt-1">{approval.comentarios}</p>}
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF} disabled={isDownloading}>
            {isDownloading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
