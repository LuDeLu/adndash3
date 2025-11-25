import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "../../app/auth/auth-context"
import { RegistroInformes } from "@/components/obras/RegistroInformes"
import type { Informe } from "@/types/index"

export const InformeProgresoDiario: React.FC = () => {
  const { user } = useAuth()
  const [informe, setInforme] = useState<Informe>({
    id: "",
    fecha: "",
    titulo: "",
    tareasCompletadas: "",
    porcentajeProgreso: "",
    cronogramaActualizado: "",
    notasAdicionales: "",
    problemas: "",
    solucionesPropuestas: "",
    materialUtilizado: "",
    horasTrabajadas: "",
    climaCondiciones: "",
    usuario: user?.name || "Usuario Desconocido",
  })
  const [informes, setInformes] = useState<Informe[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInforme((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevoInforme = {
      ...informe,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      usuario: user?.name || "Usuario Desconocido",
    }
    setInformes((prev) => [...prev, nuevoInforme])
    console.log("Enviando informe:", nuevoInforme)
    // Aquí iría la lógica para enviar el informe al backend
    setInforme({
      id: "",
      fecha: "",
      titulo: "",
      tareasCompletadas: "",
      porcentajeProgreso: "",
      cronogramaActualizado: "",
      notasAdicionales: "",
      problemas: "",
      solucionesPropuestas: "",
      materialUtilizado: "",
      horasTrabajadas: "",
      climaCondiciones: "",
      usuario: user?.name || "Usuario Desconocido",
    })
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informe de Progreso Diario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo">Título del Informe</Label>
                <Input id="titulo" name="titulo" value={informe.titulo} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="porcentajeProgreso">Porcentaje de Progreso</Label>
                <Input
                  type="number"
                  id="porcentajeProgreso"
                  name="porcentajeProgreso"
                  value={informe.porcentajeProgreso}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="tareasCompletadas">Tareas Completadas</Label>
              <Textarea
                id="tareasCompletadas"
                name="tareasCompletadas"
                value={informe.tareasCompletadas}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="cronogramaActualizado">Cronograma Actualizado</Label>
              <Input
                type="text"
                id="cronogramaActualizado"
                name="cronogramaActualizado"
                value={informe.cronogramaActualizado}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="problemas">Problemas Encontrados</Label>
              <Textarea id="problemas" name="problemas" value={informe.problemas} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="solucionesPropuestas">Soluciones Propuestas</Label>
              <Textarea
                id="solucionesPropuestas"
                name="solucionesPropuestas"
                value={informe.solucionesPropuestas}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="materialUtilizado">Material Utilizado</Label>
              <Input
                type="text"
                id="materialUtilizado"
                name="materialUtilizado"
                value={informe.materialUtilizado}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="horasTrabajadas">Horas Trabajadas</Label>
              <Input
                type="number"
                id="horasTrabajadas"
                name="horasTrabajadas"
                value={informe.horasTrabajadas}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="climaCondiciones">Condiciones Climáticas</Label>
              <Input
                type="text"
                id="climaCondiciones"
                name="climaCondiciones"
                value={informe.climaCondiciones}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="notasAdicionales">Notas Adicionales</Label>
              <Textarea
                id="notasAdicionales"
                name="notasAdicionales"
                value={informe.notasAdicionales}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar Informe Diario
            </Button>
          </form>
        </CardContent>
      </Card>
      <RegistroInformes informes={informes} />
    </div>
  )
}
