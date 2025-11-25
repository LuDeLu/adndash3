import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

type UnitInfoProps = {
  isOpen: boolean
  onClose: () => void
  project: {
    name: string
    total_units: number
    available_units: number
    reserved_units: number
    sold_units: number
  }
}

export function UnitInfoModal({ isOpen, onClose, project }: UnitInfoProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>Información de unidades</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Total de unidades: {project.total_units}</h4>
            <Progress value={100} className="w-full" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Unidades disponibles: {project.available_units}</h4>
            <Progress value={(project.available_units / project.total_units) * 100} className="w-full" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Unidades reservadas: {project.reserved_units}</h4>
            <Progress value={(project.reserved_units / project.total_units) * 100} className="w-full" />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Unidades vendidas: {project.sold_units}</h4>
            <Progress value={(project.sold_units / project.total_units) * 100} className="w-full" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
