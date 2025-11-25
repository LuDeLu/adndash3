import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell } from "lucide-react"
import type { Notificacion } from "@/types/index"

export const SistemaAlertasNotificaciones: React.FC = () => {
  const [notificaciones] = useState<Notificacion[]>([
    { id: "1", mensaje: "Plazo próximo para la tarea de Estructura", tipo: "plazo", fecha: new Date() },
    { id: "2", mensaje: "Tarea de Techado retrasada por 2 días", tipo: "retraso", fecha: new Date() },
    { id: "3", mensaje: "Hito de finalización de Cimentación alcanzado", tipo: "hito", fecha: new Date() },
  ])
  const [configuraciones, setConfiguraciones] = useState({
    alertasPlazo: true,
    notificacionesRetraso: true,
    actualizacionesHito: true,
  })

  const handleCambioConfiguracion = (configuracion: keyof typeof configuraciones) => {
    setConfiguraciones((prev) => ({ ...prev, [configuracion]: !prev[configuracion] }))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>Personaliza tus preferencias de alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(configuraciones).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch
                id={key}
                checked={value}
                onCheckedChange={() => handleCambioConfiguracion(key as keyof typeof configuraciones)}
              />
              <Label htmlFor={key} className="text-sm sm:text-base">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones Recientes</CardTitle>
          <CardDescription>Últimas alertas y actualizaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] w-full">
            {notificaciones.map((notificacion) => (
              <div key={notificacion.id} className="flex items-center space-x-2 mb-2">
                <Bell className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm sm:text-base">{notificacion.mensaje}</span>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
