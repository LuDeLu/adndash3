import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, Calendar, List } from "lucide-react"
import type { Reclamo } from "../../types/postVenta"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type ListaReclamosProps = {
  reclamos: Reclamo[]
  onSeleccionarReclamo: (reclamo: Reclamo) => void
  onEliminarReclamo: (id: string | number) => void
  onEditarReclamo: (reclamo: Reclamo) => void
  reclamosSeleccionados: (string | number)[]
  toggleSeleccionReclamo: (id: string | number) => void
  isLoading: boolean
}

export default function ListaReclamos({
  reclamos,
  onSeleccionarReclamo,
  onEliminarReclamo,
  onEditarReclamo,
  reclamosSeleccionados,
  toggleSeleccionReclamo,
  isLoading,
}: ListaReclamosProps) {
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Ingresado":
        return <Badge variant="secondary">Ingresado</Badge>
      case "En Inspección":
        return <Badge variant="default">En Inspección</Badge>
      case "En Reparación":
        return <Badge variant="secondary">En Reparación</Badge>
      case "Solucionado":
        return <Badge variant="outline">Solucionado</Badge>
      case "No Corresponde":
        return <Badge variant="destructive">No Corresponde</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "No programada"
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es })
    } catch (error) {
      return "Fecha inválida"
    }
  }

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
        <CardTitle className="flex items-center">
          <List className="h-5 w-5 mr-2" />
          Reclamos Ingresados
        </CardTitle>
        <CardDescription>
          {reclamos.length} {reclamos.length === 1 ? "reclamo encontrado" : "reclamos encontrados"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reclamos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No se encontraron reclamos</div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Seleccionar</span>
                  </TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="hidden md:table-cell">Edificio</TableHead>
                  <TableHead className="hidden md:table-cell">UF</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden md:table-cell">Visita</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reclamos.map((reclamo) => (
                  <TableRow key={reclamo.id} className="hover:bg-muted/50">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={reclamosSeleccionados.includes(reclamo.id)}
                        onChange={() => toggleSeleccionReclamo(reclamo.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{reclamo.ticket}</TableCell>
                    <TableCell>{reclamo.cliente}</TableCell>
                    <TableCell className="hidden md:table-cell">{reclamo.edificio}</TableCell>
                    <TableCell className="hidden md:table-cell">{reclamo.unidadFuncional}</TableCell>
                    <TableCell>{getEstadoBadge(reclamo.estado)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {reclamo.fechaVisita ? (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          {formatDate(reclamo.fechaVisita)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No programada</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onSeleccionarReclamo(reclamo)}
                          className="flex items-center"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditarReclamo(reclamo)}
                          className="flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onEliminarReclamo(reclamo.id)}
                          className="flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

