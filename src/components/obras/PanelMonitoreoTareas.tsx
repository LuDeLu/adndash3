import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { Tarea, TodoItem } from "@/types/index"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "../../app/auth/auth-context"

export const PanelMonitoreoTareas: React.FC = () => {
  const { user } = useAuth()
  const [tareas, setTareas] = useState<Tarea[]>([
    {
      id: "1",
      nombre: "Cimentación",
      inicio: new Date(2023, 0, 1),
      fin: new Date(2023, 1, 15),
      progreso: 100,
      responsable: "Juan Pérez",
      estado: "Completado",
    },
    {
      id: "2",
      nombre: "Estructura",
      inicio: new Date(2023, 1, 16),
      fin: new Date(2023, 3, 15),
      progreso: 75,
      responsable: "María González",
      estado: "En progreso",
    },
    {
      id: "3",
      nombre: "Techado",
      inicio: new Date(2023, 3, 16),
      fin: new Date(2023, 4, 31),
      progreso: 25,
      responsable: "Carlos Rodríguez",
      estado: "En progreso",
    },
    {
      id: "4",
      nombre: "Trabajo Interior",
      inicio: new Date(2023, 5, 1),
      fin: new Date(2023, 7, 31),
      progreso: 0,
      responsable: "Ana Martínez",
      estado: "Pendiente",
    },
  ])

  const [todoItems, setTodoItems] = useState<(TodoItem & { enTransicion?: boolean; completadoPor?: string })[]>([
    { id: "1", texto: "Revisar planos de cimentación", completado: false },
    { id: "2", texto: "Coordinar entrega de materiales", completado: true, completadoPor: "Juan Pérez" },
    { id: "3", texto: "Actualizar cronograma de obra", completado: false },
  ])

  const [nuevaTarea, setNuevaTarea] = useState("")
  const [tareaAEliminar, setTareaAEliminar] = useState<string | null>(null)

  const agregarTarea = () => {
    if (nuevaTarea.trim() !== "") {
      setTodoItems([...todoItems, { id: Date.now().toString(), texto: nuevaTarea, completado: false }])
      setNuevaTarea("")
    }
  }

  const toggleTarea = (id: string) => {
    setTodoItems(
      todoItems.map((item) =>
        item.id === id
          ? {
              ...item,
              completado: !item.completado,
              enTransicion: !item.completado,
              completadoPor: !item.completado ? user?.name || "Usuario Desconocido" : undefined,
            }
          : item,
      ),
    )

    if (!todoItems.find((item) => item.id === id)?.completado) {
      setTimeout(() => {
        setTodoItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, enTransicion: false } : item)))
      }, 100)
    }
  }

  const confirmarEliminarTarea = (id: string) => {
    setTareaAEliminar(id)
  }

  const eliminarTarea = () => {
    if (tareaAEliminar) {
      setTodoItems(todoItems.filter((item) => item.id !== tareaAEliminar))
      setTareaAEliminar(null)
    }
  }

  const tareasPendientes = todoItems.filter((item) => !item.completado)
  const tareasFinalizadas = todoItems.filter((item) => item.completado && !item.enTransicion)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Tareas</CardTitle>
          <CardDescription>Progreso actual de todas las tareas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tareas.map((tarea) => (
              <div key={tarea.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{tarea.nombre}</span>
                  <span className="text-sm">{tarea.progreso}%</span>
                </div>
                <Progress value={tarea.progreso} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Responsable: {tarea.responsable}</span>
                  <span>Estado: {tarea.estado}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tareas pendientes y finalizadas</CardTitle>
          <CardDescription>Gestiona tus tareas del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pendientes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
            </TabsList>
            <TabsContent value="pendientes">
              <div className="space-y-4">
                {tareasPendientes.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={item.id} checked={item.completado} onCheckedChange={() => toggleTarea(item.id)} />
                    <label
                      htmlFor={item.id}
                      className={`flex-grow transition-all duration-3000 ease-in-out ${item.enTransicion ? "line-through text-muted-foreground" : ""}`}
                    >
                      {item.texto}
                    </label>
                    <Button variant="ghost" size="sm" onClick={() => confirmarEliminarTarea(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Nueva tarea"
                    value={nuevaTarea}
                    onChange={(e) => setNuevaTarea(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={agregarTarea}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="finalizadas">
              <div className="space-y-4">
                {tareasFinalizadas.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox id={item.id} checked={item.completado} onCheckedChange={() => toggleTarea(item.id)} />
                    <label htmlFor={item.id} className="flex-grow line-through text-muted-foreground">
                      {item.texto}
                    </label>
                    <span className="ml-2 text-xs text-muted-foreground">(Completada por: {item.completadoPor})</span>

                    <Button variant="ghost" size="sm" onClick={() => confirmarEliminarTarea(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!tareaAEliminar} onOpenChange={() => setTareaAEliminar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTareaAEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={eliminarTarea}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes strikethrough {
          from {
            text-decoration-color: transparent;
          }
          to {
            text-decoration-color: currentColor;
          }
        }
        .line-through {
          text-decoration: line-through;
          text-decoration-color: transparent;
          animation: strikethrough 3s linear forwards;
        }
      `}</style>
    </div>
  )
}
