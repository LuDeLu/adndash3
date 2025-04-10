"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormDataInput } from "@/components/checklist/form-data-input"
import { PDFViewer } from "@/components/checklist/pdf-viewer"
import { ApprovalDashboard } from "@/components/checklist/dashboard-view"
import type { FormData } from "@/types/form-data"
import { initialFormData } from "@/lib/initial-data"
import { createTicket } from "@/lib/checklist"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ApprovalFormProps {
  onSubmit?: (formData: FormData) => void
  isInDialog?: boolean
}

export function ApprovalForm({ onSubmit, isInDialog = false }: ApprovalFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormDataChange = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (onSubmit) {
        onSubmit(formData)
        // Resetear el formulario después de enviar
        setFormData(initialFormData)
      } else {
        // Si no hay onSubmit, creamos el ticket directamente
        await createTicket(formData)
        toast({
          title: "Éxito",
          description: "Ticket creado correctamente",
        })
        // Resetear el formulario y cambiar a la pestaña de dashboard
        setFormData(initialFormData)
        setActiveTab("dashboard")
      }
    } catch (error) {
      console.error("Error al crear ticket:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el ticket. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Si está en un diálogo, mostramos solo el formulario y las aprobaciones
  if (isInDialog) {
    return (
      <div>
        <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="form">Formulario</TabsTrigger>
            <TabsTrigger value="preview">Vista Previa PDF</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <FormDataInput formData={formData} onChange={handleFormDataChange} />
            <div className="flex justify-end mt-6">
              <Button onClick={() => setActiveTab("preview")}>Continuar a Vista Previa</Button>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <PDFViewer formData={formData} />
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setActiveTab("form")}>
                Volver al Formulario
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  "Crear Ticket"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Versión completa con dashboard
  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard CheckList</h2>
        </div>
        <ApprovalDashboard />
      </CardContent>
    </Card>
  )
}
