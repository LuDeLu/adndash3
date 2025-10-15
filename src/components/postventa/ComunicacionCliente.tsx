"use client"

import { Calendar } from "@/components/ui/calendar"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MessageSquare } from "lucide-react"
import type { Reclamo } from "../../types/postVenta"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type ComunicacionClienteProps = {
  reclamo: Reclamo
  onEnviarCorreo: (reclamo: Reclamo, tipo: "nuevo_reclamo" | "actualizacion_estado") => void
}

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" className="text-green-600">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ComunicacionCliente({ reclamo, onEnviarCorreo }: ComunicacionClienteProps) {
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [detallesSeleccionados, setDetallesSeleccionados] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("whatsapp")

  const handleEnviarCorreo = () => {
    onEnviarCorreo(reclamo, "actualizacion_estado")
  }

  const handleEnviarWhatsApp = () => {
    const whatsappLink = `https://wa.me/${reclamo.telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappLink, "_blank")
  }

  const generarMensajeVisita = () => {
    // Formatear la fecha de manera más profesional
    const fechaFormateada = reclamo.fechaVisita
      ? format(new Date(reclamo.fechaVisita), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
      : "fecha por confirmar"

    // Formatear la hora de manera más profesional
    const horaFormateada = reclamo.horaVisita
      ? `${reclamo.horaVisita.split(":")[0]}:${reclamo.horaVisita.split(":")[1]}`
      : "horario por confirmar"

    // Crear el mensaje con el template solicitado
    return `*ADN DEVELOPERS - SERVICIO DE POSTVENTA*

Estimado/a ${reclamo.cliente},

Le informamos que hemos programado una visita técnica para atender su solicitud (Ticket: ${reclamo.ticket}) en su propiedad ubicada en:

📍 *${reclamo.edificio}, Unidad Funcional ${reclamo.unidadFuncional}*

*Fecha de visita:* ${fechaFormateada}
*Horario:* ${horaFormateada} hs.

*El problema a resolver será:*
${detallesSeleccionados.length > 0 ? detallesSeleccionados.map((d, i) => `${i + 1}. ${d}`).join("\n") : reclamo.detalle}

*Información importante:*
• La visita puede ser recibida por cualquier persona mayor de 18 años.
• El técnico asignado es Yoni.
• Por favor, asegúrese de que la propiedad esté accesible en el horario indicado.

Si necesita reprogramar la visita o tiene alguna consulta, responda a este mensaje o comuníquese con nuestro departamento de Postventa con 24 horas de antelación.

Atentamente,
*Equipo de Postventa*
*ADN DEVELOPERS*`
  }

  const enviarNotificacionVisita = (esGrupo: boolean) => {
    const mensajeVisita = generarMensajeVisita()

    // Abrir WhatsApp con el mensaje
    if (esGrupo) {
      // Para grupos, usar WhatsApp Web
      window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(mensajeVisita)}`, "_blank")
    } else {
      // Para contactos individuales, usar la API de WhatsApp que permite seleccionar contacto
      window.open(`https://wa.me/${reclamo.telefono}?text=${encodeURIComponent(mensajeVisita)}`, "_blank")
    }
  }

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Comunicación con el Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <WhatsAppLogo />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-4">
            <div className=" dark:bg-green-900/20 p-3 rounded-md flex items-center text-sm">
              <Phone className="h-4 w-4 mr-2 text-green-600" />
              <span>
                Teléfono del cliente: <strong>{reclamo.telefono}</strong>
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje" className="text-sm font-medium">
                Mensaje
              </Label>
              <Textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escriba su mensaje aquí"
                rows={4}
                className="resize-none"
              />
            </div>

            {reclamo.detalles && reclamo.detalles.length > 0 && (
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">
                  Seleccione los detalles a incluir en la notificación:
                </Label>
                <div className="space-y-2 border rounded-md p-3 bg-muted/30">
                  {reclamo.detalles.map((detalle, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`detalle-${index}`}
                        checked={detallesSeleccionados.includes(detalle)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDetallesSeleccionados([...detallesSeleccionados, detalle])
                          } else {
                            setDetallesSeleccionados(detallesSeleccionados.filter((d) => d !== detalle))
                          }
                        }}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor={`detalle-${index}`} className="text-sm">
                        {detalle}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Estos detalles se incluirán en el mensaje de notificación de visita.
                </div>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <Button
                onClick={handleEnviarWhatsApp}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!mensaje.trim()}
              >
                <WhatsAppLogo />
                <span className="ml-2">Enviar mensaje</span>
              </Button>

              <Button
                variant="outline"
                className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => {
                  const mensajeVisita = generarMensajeVisita()
                  window.open(`https://wa.me/${reclamo.telefono}?text=${encodeURIComponent(mensajeVisita)}`, "_blank")
                }}
              >
                <div className="mr-2 h-4 w-4" />
                <span>Notificar visita técnica</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asunto" className="text-sm font-medium">
                Asunto del correo
              </Label>
              <Input
                id="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Asunto del correo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje-email" className="text-sm font-medium">
                Contenido del correo
              </Label>
              <Textarea
                id="mensaje-email"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Escriba su mensaje aquí"
                rows={6}
                className="resize-none"
              />
            </div>

            <Button onClick={handleEnviarCorreo} className="w-full" disabled={!asunto.trim() || !mensaje.trim()}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar por Correo
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4">
        <div className="text-xs text-center text-muted-foreground">
          <p>Recuerde mantener un tono profesional y cordial en todas las comunicaciones con el cliente.</p>
        </div>
      </CardFooter>
    </Card>
  )
}

 