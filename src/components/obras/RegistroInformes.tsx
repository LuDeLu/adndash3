import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Informe } from "@/types/index"

interface RegistroInformesProps {
  informes: Informe[]
}

export const RegistroInformes: React.FC<RegistroInformesProps> = ({ informes }) => {
  const [selectedInforme, setSelectedInforme] = useState<Informe | null>(null)

  const handleOpenModal = (informe: Informe) => {
    setSelectedInforme(informe)
  }

  const handleCloseModal = () => {
    setSelectedInforme(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registro de Informes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {informes.map((informe) => (
              <TableRow key={informe.id}>
                <TableCell>{informe.fecha}</TableCell>
                <TableCell>{informe.usuario}</TableCell>
                <TableCell>{informe.titulo}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(informe)}>Ver Detalles</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={!!selectedInforme} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedInforme?.titulo}</DialogTitle>
            <DialogDescription>
              Informe de {selectedInforme?.usuario} - {selectedInforme?.fecha}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[60vh]">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Tareas Completadas</h4>
                <p>{selectedInforme?.tareasCompletadas}</p>
              </div>
              <div>
                <h4 className="font-semibold">Porcentaje de Progreso</h4>
                <p>{selectedInforme?.porcentajeProgreso}%</p>
              </div>
              <div>
                <h4 className="font-semibold">Cronograma Actualizado</h4>
                <p>{selectedInforme?.cronogramaActualizado}</p>
              </div>
              <div>
                <h4 className="font-semibold">Problemas Encontrados</h4>
                <p>{selectedInforme?.problemas}</p>
              </div>
              <div>
                <h4 className="font-semibold">Soluciones Propuestas</h4>
                <p>{selectedInforme?.solucionesPropuestas}</p>
              </div>
              <div>
                <h4 className="font-semibold">Material Utilizado</h4>
                <p>{selectedInforme?.materialUtilizado}</p>
              </div>
              <div>
                <h4 className="font-semibold">Horas Trabajadas</h4>
                <p>{selectedInforme?.horasTrabajadas}</p>
              </div>
              <div>
                <h4 className="font-semibold">Condiciones Climáticas</h4>
                <p>{selectedInforme?.climaCondiciones}</p>
              </div>
              <div>
                <h4 className="font-semibold">Notas Adicionales</h4>
                <p>{selectedInforme?.notasAdicionales}</p>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

