"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Upload, Trash2, Copy } from "lucide-react"
import { storageManager } from "@/lib/storage/storageManager"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Notyf } from "notyf"

let notyf: Notyf | null = null

interface ProjectDataManagerProps {
  projectId: string
  projectName: string
}

export function ProjectDataManager({ projectId, projectName }: ProjectDataManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined" && !notyf) {
      notyf = new Notyf({
        duration: 3000,
        position: { x: "right", y: "top" },
      })
    }
  }, [])

  const handleExport = () => {
    try {
      storageManager.downloadProjectAsJSON(projectId)
      if (notyf) notyf.success("Datos exportados correctamente")
    } catch (error) {
      console.error("Error al exportar:", error)
      if (notyf) notyf.error("Error al exportar los datos")
    }
  }

  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)

        if (data.projectId === projectId) {
          storageManager.importProjectData(data)
          if (notyf) notyf.success("Datos importados correctamente")
          window.location.reload()
        } else {
          if (notyf) notyf.error("El archivo no corresponde a este proyecto")
        }
      } catch (error) {
        console.error("Error al importar:", error)
        if (notyf) notyf.error("Error al importar los datos")
      }
    }
    input.click()
  }

  const handleClear = () => {
    try {
      storageManager.clearProjectData(projectId)
      if (notyf) notyf.success("Datos eliminados correctamente")
      setIsClearDialogOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("Error al limpiar:", error)
      if (notyf) notyf.error("Error al eliminar los datos")
    }
  }

  const getStats = () => {
    const data = storageManager.exportProjectData(projectId)
    return {
      owners: Object.keys(data.owners).length,
      statuses: Object.keys(data.statuses).length,
    }
  }

  const stats = getStats()

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar JSON
        </Button>
        <Button onClick={handleImport} className="bg-green-600 hover:bg-green-700" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Importar JSON
        </Button>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Ver Estadísticas
        </Button>
        <Button onClick={() => setIsClearDialogOpen(true)} className="bg-red-600 hover:bg-red-700" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Limpiar Datos
        </Button>
      </div>

      {/* Estadísticas Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle>Estadísticas de {projectName}</DialogTitle>
            <DialogDescription className="text-zinc-300">Datos almacenados localmente</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-zinc-800 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm">Propietarios Registrados</p>
              <p className="text-3xl font-bold text-green-400">{stats.owners}</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg">
              <p className="text-zinc-400 text-sm">Cambios de Estado Registrados</p>
              <p className="text-3xl font-bold text-blue-400">{stats.statuses}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmación Limpiar Dialog */}
      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className="bg-zinc-900 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">Confirmar Limpieza</DialogTitle>
            <DialogDescription className="text-zinc-300">
              ¿Estás seguro de que deseas eliminar todos los datos locales? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-zinc-400">
            <p>Se eliminarán:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{stats.owners} registros de propietarios</li>
              <li>{stats.statuses} cambios de estado registrados</li>
            </ul>
          </div>
          <DialogFooter className="flex gap-2">
            <Button onClick={() => setIsClearDialogOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">
              Cancelar
            </Button>
            <Button onClick={handleClear} className="bg-red-600 hover:bg-red-700">
              Confirmar Limpieza
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
