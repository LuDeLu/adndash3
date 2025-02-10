"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reclamo } from "../../types/postVenta"

type ComunicacionClienteProps = {
  reclamo: Reclamo
  onEnviarCorreo: (reclamo: Reclamo, tipo: "nuevo_reclamo" | "actualizacion_estado") => void
}

export default function ComunicacionCliente({ reclamo, onEnviarCorreo }: ComunicacionClienteProps) {
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")

  const handleEnviarCorreo = () => {
    onEnviarCorreo(reclamo, "actualizacion_estado")
  }

  const handleEnviarWhatsApp = () => {
    const whatsappLink = `https://wa.me/${reclamo.telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappLink, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comunicación con el Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="asunto" className="block text-sm font-medium text-gray-700">
              Asunto del correo
            </label>
            <Input
              id="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="Asunto del correo"
            />
          </div>
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
              Mensaje
            </label>
            <Textarea
              id="mensaje"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escriba su mensaje aquí"
              rows={4}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleEnviarCorreo}>Enviar por Correo</Button>
            <Button onClick={handleEnviarWhatsApp}>Enviar por WhatsApp</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

