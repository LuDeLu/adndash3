import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Reclamo } from "../../types/postVenta"
import { Loader2 } from 'lucide-react'

type ListaReclamosProps = {
  reclamos: Reclamo[]
  onSeleccionarReclamo: (reclamo: Reclamo) => void
  isLoading: boolean
}

export default function ListaReclamos({ reclamos, onSeleccionarReclamo, isLoading }: ListaReclamosProps) {
  if (isLoading) {
    return (
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Cargando Reclamos...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

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
                <TableRow key={reclamo.id}>
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