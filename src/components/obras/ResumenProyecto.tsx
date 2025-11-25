import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Proyecto } from "@/types/index"

export const ResumenProyecto: React.FC<{ proyecto: Proyecto }> = ({ proyecto }) => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Progreso General</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={proyecto.progreso} className="w-full" />
        <p className="mt-2 text-center text-2xl font-bold">{proyecto.progreso}%</p>
      </CardContent>
    </Card>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Object.entries(proyecto.detalles).map(([key, value]) => (
        <Card key={key}>
          <CardHeader>
            <CardTitle>{key.charAt(0).toUpperCase() + key.slice(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={value} className="w-full" />
            <p className="mt-2 text-center text-xl font-bold">{value}%</p>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Fechas Clave</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Inicio:</strong> {proyecto.fechaInicio}
          </p>
          <p>
            <strong>Fin estimado:</strong> {proyecto.fechaFin}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Próximos Hitos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            <li>Finalización de cimentación: 15/07/2023</li>
            <li>Inicio de estructura: 01/08/2023</li>
            <li>Instalación de techos: 15/09/2023</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
)
