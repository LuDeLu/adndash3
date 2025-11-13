"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormDataInput } from "./form-data-input"
import { PDFViewer } from "./pdf-viewer"
import { initialFormData } from "@/lib/initial-data"
import { createTicket } from "@/lib/checklist"
import { useToast } from "@/hooks/use-toast"
import type { FormData } from "@/types/form-data"
import type { ApprovalTicket } from "@/types/approval-ticket"

interface NewTicketDialogProps {
  onTicketCreated: (ticket: ApprovalTicket) => void
}

export function NewTicketDialog({ onTicketCreated }: NewTicketDialogProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [activeTab, setActiveTab] = useState("form")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const handleCreateTicket = async () => {
    setIsSubmitting(true)
    try {
      const title = `Aprobación ${formData.tipoDocumento || "Documento"}`
      const newTicket = await createTicket(formData, title)
      onTicketCreated(newTicket)
      setIsOpen(false)
      setFormData(initialFormData)
      setActiveTab("form")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el ticket",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Ticket de Aprobación</DialogTitle>
          <DialogDescription>Complete el formulario para crear un nuevo ticket</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Formulario</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4">
            <FormDataInput formData={formData} onChange={handleFormDataChange} showRequired />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setActiveTab("preview")}>Continuar a Vista Previa</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <PDFViewer formData={formData} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveTab("form")}>
                Volver
              </Button>
              <Button onClick={handleCreateTicket} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Ticket"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
