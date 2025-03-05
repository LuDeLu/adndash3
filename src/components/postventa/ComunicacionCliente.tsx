"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Send, Users } from "lucide-react"
import type { Reclamo } from "../../types/postVenta"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type ComunicacionClienteProps = {
  reclamo: Reclamo
  onEnviarCorreo: (reclamo: Reclamo, tipo: "nuevo_reclamo" | "actualizacion_estado") => void
}

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function ComunicacionCliente({ reclamo, onEnviarCorreo }: ComunicacionClienteProps) {
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [detallesSeleccionados, setDetallesSeleccionados] = useState<string[]>([])

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

Si necesita reprogramar la visita o tiene alguna consulta, responda a este mensaje o comuníquese con nuestro departamento de Postventa con 24 horas de antelación.

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
      window.open(`https://wa.me/?text=${encodeURIComponent(mensajeVisita)}`, "_blank")
    }
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

          {reclamo.detalles && reclamo.detalles.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccione los detalles a incluir en la notificación:
              </label>
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
            <div className="flex space-x-2">
              <Button onClick={handleEnviarCorreo} className="flex-1">
                Enviar por Correo
              </Button>
              <Button onClick={handleEnviarWhatsApp} className="flex-1">
                Enviar por WhatsApp
              </Button>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white border-green-600 hover:border-green-700 transition-colors duration-200"
                >
                  <WhatsAppLogo />
                  <span className="ml-2">Notificar visita técnica</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center text-xl font-semibold text-gray-700 flex items-center justify-center">
                    <WhatsAppLogo />
                    <span className="ml-2">Notificación de Visita Técnica</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-center text-gray-600 mb-4">
                    Enviar notificación de visita técnica para el ticket {reclamo.ticket}
                  </p>

                  <div className="border rounded-md p-3 bg-muted/30 mb-4 text-sm">
                    <p className="font-bold">Vista previa del mensaje:</p>
                    <p className="mt-1">*ADN DEVELOPERS - SERVICIO DE POSTVENTA*</p>
                    <p className="mt-1">Estimado/a {reclamo.cliente},</p>
                    <p className="mt-1">Le informamos que hemos programado una visita técnica...</p>

                    <p className="mt-1 font-semibold">Fecha y hora de visita:</p>
                    <p className="mt-1">
                      • Fecha:{" "}
                      {reclamo.fechaVisita
                        ? format(new Date(reclamo.fechaVisita), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
                        : "fecha por confirmar"}
                    </p>
                    <p className="mt-1">
                      • Hora:{" "}
                      {reclamo.horaVisita
                        ? `${reclamo.horaVisita.split(":")[0]}:${reclamo.horaVisita.split(":")[1]} hs.`
                        : "horario por confirmar"}
                    </p>

                    <p className="mt-1 font-semibold">El problema a resolver será:</p>
                    {detallesSeleccionados.length > 0 ? (
                      detallesSeleccionados.slice(0, 2).map((d, i) => (
                        <p key={i} className="mt-0.5">
                          • {d}
                          {i === 1 && detallesSeleccionados.length > 2 ? " (y más...)" : ""}
                        </p>
                      ))
                    ) : (
                      <p className="mt-0.5">
                        • {reclamo.detalle.length > 50 ? reclamo.detalle.substring(0, 50) + "..." : reclamo.detalle}
                      </p>
                    )}

                    <p className="mt-1">• Técnico asignado: Yoni</p>
                    <p className="mt-1">Atentamente, Equipo de Postventa</p>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => enviarNotificacionVisita(false)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                    >
                      <Send className="mr-2 h-4 w-4" /> Contacto
                    </Button>
                    <Button
                      onClick={() => enviarNotificacionVisita(true)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                    >
                      <Users className="mr-2 h-4 w-4" /> Grupo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

