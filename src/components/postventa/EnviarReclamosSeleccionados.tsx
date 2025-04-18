import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Send, Users } from "lucide-react"
import type { Reclamo } from "../../types/postVenta"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type EnviarReclamosSeleccionadosProps = {
  reclamos: Reclamo[]
}

const WhatsAppLogo = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export default function EnviarReclamosSeleccionados({ reclamos }: EnviarReclamosSeleccionadosProps) {
  const formatearFecha = (fecha: string | undefined, hora: string | undefined) => {
    if (!fecha) return "No programada"
    const fechaObj = new Date(fecha)
    if (hora) {
      const [horas, minutos] = hora.split(":")
      fechaObj.setHours(Number.parseInt(horas, 10), Number.parseInt(minutos, 10))
    }
    return format(fechaObj, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
  }

  const generarInformacionReclamo = (reclamo: Reclamo) => {
    return `
Cliente: ${reclamo.cliente}
Teléfono: ${reclamo.telefono}
Edificio: ${reclamo.edificio}
UF: ${reclamo.unidadFuncional}
Detalle: ${reclamo.detalle}
${
  reclamo.detalles && Array.isArray(reclamo.detalles) && reclamo.detalles.length > 0
    ? `Detalles adicionales:
${reclamo.detalles.map((d, i) => `  ${i + 1}. ${d}`).join("\n")}
`
    : ""
}
${reclamo.comentario ? `Comentario: ${reclamo.comentario}\n` : ""}
Fecha de visita: ${formatearFecha(reclamo.fechaVisita, reclamo.horaVisita)}
`.trim()
  }

  const generarMensaje = () => {
    if (reclamos.length === 0) {
      return "No hay reclamos seleccionados"
    }

    return reclamos
      .map((r, i) => {
        return `--- RECLAMO ${i + 1}: ${r.ticket} ---\n${generarInformacionReclamo(r)}`
      })
      .join("\n\n")
  }

  const enviarPorWhatsApp = (esGrupo: boolean) => {
    const mensaje = encodeURIComponent(generarMensaje())
    if (esGrupo) {
      window.open(`https://web.whatsapp.com/send?text=${mensaje}`, "_blank")
    } else {
      window.open(`https://wa.me/?text=${mensaje}`, "_blank")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white border-green-600 hover:border-green-700 transition-colors duration-200"
          disabled={reclamos.length === 0}
        >
          <WhatsAppLogo />
          <span className="ml-2">Enviar {reclamos.length} reclamo(s)</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-700 flex items-center justify-center">
            <WhatsAppLogo />
            <span className="ml-2">Enviar por WhatsApp</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-gray-600">
            {reclamos.length > 0
              ? `Enviar ${reclamos.length} reclamo(s) seleccionado(s)`
              : "No hay reclamos seleccionados"}
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => enviarPorWhatsApp(false)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
            disabled={reclamos.length === 0}
          >
            <Send className="mr-2 h-4 w-4" /> Contacto
          </Button>
          <Button
            onClick={() => enviarPorWhatsApp(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
            disabled={reclamos.length === 0}
          >
            <Users className="mr-2 h-4 w-4" /> Grupo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

