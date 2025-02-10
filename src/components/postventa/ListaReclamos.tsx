import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reclamo } from "../../types/postVenta"

type ListaReclamosProps = {
  reclamos: Reclamo[]
  onSeleccionarReclamo: (reclamo: Reclamo) => void
}

export default function ListaReclamos({ reclamos, onSeleccionarReclamo }: ListaReclamosProps) {
  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Reclamos Ingresados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Edificio</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reclamos.map((reclamo) => (
                <TableRow key={reclamo.ticket}>
                  <TableCell>{reclamo.ticket}</TableCell>
                  <TableCell>{reclamo.cliente}</TableCell>
                  <TableCell>{reclamo.edificio}</TableCell>
                  <TableCell>{reclamo.unidadFuncional}</TableCell>
                  <TableCell>{reclamo.estado}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" onClick={() => onSeleccionarReclamo(reclamo)}>
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

