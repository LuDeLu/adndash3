"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SvgConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: number
  projectName: string
  onSave: (config: SvgConfiguration) => void
}

interface SvgConfiguration {
  apartment_svg_paths: { [key: string]: string }
  parking_svg_paths: { [key: string]: string }
  default_apartment_svg: string
  default_parking_svg: string
}

export function SvgConfigurationModal({ isOpen, onClose, projectId, projectName, onSave }: SvgConfigurationModalProps) {
  const [config, setConfig] = useState<SvgConfiguration>({
    apartment_svg_paths: {},
    parking_svg_paths: {},
    default_apartment_svg: "",
    default_parking_svg: "",
  })

  const [newApartmentId, setNewApartmentId] = useState("")
  const [newApartmentPath, setNewApartmentPath] = useState("")
  const [newParkingId, setNewParkingId] = useState("")
  const [newParkingPath, setNewParkingPath] = useState("")

  useEffect(() => {
    if (isOpen && projectId) {
      loadConfiguration()
    }
  }, [isOpen, projectId])

  const loadConfiguration = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/svg-config`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Error loading SVG configuration:", error)
    }
  }

  const addApartmentPath = () => {
    if (newApartmentId && newApartmentPath) {
      setConfig((prev) => ({
        ...prev,
        apartment_svg_paths: {
          ...prev.apartment_svg_paths,
          [newApartmentId]: newApartmentPath,
        },
      }))
      setNewApartmentId("")
      setNewApartmentPath("")
    }
  }

  const addParkingPath = () => {
    if (newParkingId && newParkingPath) {
      setConfig((prev) => ({
        ...prev,
        parking_svg_paths: {
          ...prev.parking_svg_paths,
          [newParkingId]: newParkingPath,
        },
      }))
      setNewParkingId("")
      setNewParkingPath("")
    }
  }

  const removeApartmentPath = (id: string) => {
    setConfig((prev) => {
      const newPaths = { ...prev.apartment_svg_paths }
      delete newPaths[id]
      return { ...prev, apartment_svg_paths: newPaths }
    })
  }

  const removeParkingPath = (id: string) => {
    setConfig((prev) => {
      const newPaths = { ...prev.parking_svg_paths }
      delete newPaths[id]
      return { ...prev, parking_svg_paths: newPaths }
    })
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/svg-config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        onSave(config)
        onClose()
      }
    } catch (error) {
      console.error("Error saving SVG configuration:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Configuración SVG - {projectName}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="apartments" className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apartments">Departamentos</TabsTrigger>
            <TabsTrigger value="parking">Cocheras</TabsTrigger>
            <TabsTrigger value="defaults">Por Defecto</TabsTrigger>
          </TabsList>

          <TabsContent value="apartments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agregar Path de Departamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apartmentId">ID Departamento</Label>
                    <Input
                      id="apartmentId"
                      value={newApartmentId}
                      onChange={(e) => setNewApartmentId(e.target.value)}
                      placeholder="ej: 1A, 2B, ST01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apartmentPath">SVG Path</Label>
                    <Textarea
                      id="apartmentPath"
                      value={newApartmentPath}
                      onChange={(e) => setNewApartmentPath(e.target.value)}
                      placeholder="M100,100 L200,100 L200,200 L100,200 Z"
                      rows={2}
                    />
                  </div>
                </div>
                <Button onClick={addApartmentPath} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Path
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paths Configurados</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {Object.entries(config.apartment_svg_paths).map(([id, path]) => (
                      <div key={id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <span className="font-medium">{id}</span>
                          <p className="text-xs text-muted-foreground truncate">{path}</p>
                        </div>
                        <Button onClick={() => removeApartmentPath(id)} variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agregar Path de Cochera</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="parkingId">ID Cochera</Label>
                    <Input
                      id="parkingId"
                      value={newParkingId}
                      onChange={(e) => setNewParkingId(e.target.value)}
                      placeholder="ej: P1, C001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parkingPath">SVG Path</Label>
                    <Textarea
                      id="parkingPath"
                      value={newParkingPath}
                      onChange={(e) => setNewParkingPath(e.target.value)}
                      placeholder="M100,100 L180,100 L180,150 L100,150 Z"
                      rows={2}
                    />
                  </div>
                </div>
                <Button onClick={addParkingPath} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Path
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paths Configurados</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {Object.entries(config.parking_svg_paths).map(([id, path]) => (
                      <div key={id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <span className="font-medium">{id}</span>
                          <p className="text-xs text-muted-foreground truncate">{path}</p>
                        </div>
                        <Button onClick={() => removeParkingPath(id)} variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="defaults" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paths por Defecto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="defaultApartment">Path por Defecto - Departamentos</Label>
                  <Textarea
                    id="defaultApartment"
                    value={config.default_apartment_svg}
                    onChange={(e) => setConfig((prev) => ({ ...prev, default_apartment_svg: e.target.value }))}
                    placeholder="M100,100 L200,100 L200,200 L100,200 Z"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultParking">Path por Defecto - Cocheras</Label>
                  <Textarea
                    id="defaultParking"
                    value={config.default_parking_svg}
                    onChange={(e) => setConfig((prev) => ({ ...prev, default_parking_svg: e.target.value }))}
                    placeholder="M100,100 L180,100 L180,150 L100,150 Z"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
