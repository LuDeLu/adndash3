"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Building, Home, Car } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ApartmentType = {
  id: string
  price: string
  surface: string
  svgPath: string
}

type FloorConfig = {
  floorNumber: number
  apartments: ApartmentType[]
  viewBox: string
}

type ProjectFormData = {
  name: string
  location: string
  image: string
  edificio: string
  brochure: string
  totalUnits: number
  floors: FloorConfig[]
  parkingSpots: number
}

const defaultApartmentTypes = {
  A: {
    price: "$650.000",
    surface: "180 m²",
    svgPath:
      "M136,509 L126,2004 L764,2001 L767,1918 L1209,1915 L1207,1999 L1218,2001 L1221,1692 L1635,1692 L1639,1544 L1224,1543 L1227,1291 L1430,1292 L1424,899 L1219,902 L1216,578 L506,575 L504,455 Z",
  },
  B: {
    price: "$720.000",
    surface: "200 m²",
    svgPath: "M3111,2317 L1421,2314 L1418,2007 L1209,2004 L1209,1680 L1635,1683 L2078,1683 L2084,1270 L3117,1270 Z",
  },
  C: {
    price: "$480.000",
    surface: "160 m²",
    svgPath:
      "M3111,1276 L3114,300 L2298,303 L2304,214 L1206,366 L1212,904 L1415,910 L1418,1288 L1674,1291 L1677,1115 L1879,1109 L1879,1285 Z",
  },
  D: {
    price: "$580.000",
    surface: "170 m²",
    svgPath:
      "M854,1776 L203,1786 L208,420 L605,414 L595,351 L1341,255 L1346,1304 L1754,1304 L1754,1447 L1346,1463 L1346,1702 L859,1712 Z",
  },
}

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectAdded: () => void
}

export function AddProjectModal({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    location: "",
    image: "",
    edificio: "",
    brochure: "",
    totalUnits: 0,
    floors: [],
    parkingSpots: 13,
  })

  const addFloor = () => {
    const newFloor: FloorConfig = {
      floorNumber: formData.floors.length + 1,
      apartments: [],
      viewBox: "0 0 3200 2400",
    }
    setFormData((prev) => ({
      ...prev,
      floors: [...prev.floors, newFloor],
    }))
  }

  const removeFloor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      floors: prev.floors.filter((_, i) => i !== index),
    }))
  }

  const addApartmentToFloor = (floorIndex: number, apartmentType: string) => {
    const apartmentConfig = defaultApartmentTypes[apartmentType as keyof typeof defaultApartmentTypes]
    if (!apartmentConfig) return

    const newApartment: ApartmentType = {
      id: apartmentType,
      ...apartmentConfig,
    }

    setFormData((prev) => ({
      ...prev,
      floors: prev.floors.map((floor, index) =>
        index === floorIndex ? { ...floor, apartments: [...floor.apartments, newApartment] } : floor,
      ),
    }))
  }

  const removeApartmentFromFloor = (floorIndex: number, apartmentIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      floors: prev.floors.map((floor, index) =>
        index === floorIndex
          ? { ...floor, apartments: floor.apartments.filter((_, i) => i !== apartmentIndex) }
          : floor,
      ),
    }))
  }

  const calculateTotalUnits = () => {
    return formData.floors.reduce((total, floor) => total + floor.apartments.length, 0)
  }

  const generateQuickConfig = (sections: number, unitsPerSection: number) => {
    const floors: FloorConfig[] = []
    const apartmentTypes = ["A", "B", "C"]

    for (let section = 1; section <= sections; section++) {
      const floorsPerSection = Math.ceil(unitsPerSection / apartmentTypes.length)

      for (let floor = 1; floor <= floorsPerSection; floor++) {
        const floorNumber = (section - 1) * floorsPerSection + floor
        const newFloor: FloorConfig = {
          floorNumber,
          apartments: [],
          viewBox: "0 0 3200 2400",
        }

        // Add apartments to this floor
        apartmentTypes.forEach((type) => {
          if (newFloor.apartments.length < unitsPerSection / floorsPerSection) {
            const apartmentConfig = defaultApartmentTypes[type as keyof typeof defaultApartmentTypes]
            newFloor.apartments.push({
              id: type,
              ...apartmentConfig,
            })
          }
        })

        floors.push(newFloor)
      }
    }

    setFormData((prev) => ({
      ...prev,
      floors,
      totalUnits: calculateTotalUnits(),
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const API_BASE_URL = "http://localhost:3001/api"

      // Create the project
      const projectResponse = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          image: formData.image,
          edificio: formData.edificio,
          brochure: formData.brochure,
          available_units: calculateTotalUnits(),
          reserved_units: 0,
          sold_units: 0,
          total_units: calculateTotalUnits(),
        }),
      })

      if (!projectResponse.ok) {
        throw new Error("Error creating project")
      }

      const project = await projectResponse.json()
      const projectId = project.id

      // Create floors and apartments
      for (const floor of formData.floors) {
        const floorResponse = await fetch(`${API_BASE_URL}/floors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            project_id: projectId,
            floor_number: floor.floorNumber,
            view_box: floor.viewBox,
          }),
        })

        if (!floorResponse.ok) {
          throw new Error(`Error creating floor ${floor.floorNumber}`)
        }

        const floorData = await floorResponse.json()
        const floorId = floorData.id

        // Create apartments for this floor
        for (const apartment of floor.apartments) {
          await fetch(`${API_BASE_URL}/apartments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              floor_id: floorId,
              apartment_id: `${floor.floorNumber}${apartment.id}`,
              status: "libre",
              price: apartment.price,
              surface: apartment.surface,
              svg_path: apartment.svgPath,
            }),
          })
        }
      }

      // Create parking spots
      const defaultParkingPaths = [
        "M571,885 L640,1391 L737,1405 L817,1369 L753,869 L668,865 Z",
        "M862,845 L926,1349 L1039,1373 L1120,1321 L1055,841 L1007,816 L951,824 L910,833 Z",
        "M1164,811 L1221,1311 L1318,1319 L1394,1303 L1418,1255 L1350,779 L1245,783 Z",
        "M1455,763 L1531,1271 L1636,1279 L1717,1243 L1644,730 Z",
        "M1761,722 L1826,1227 L1911,1243 L2011,1214 L1943,694 Z",
        "M2060,685 L2140,1193 L2229,1209 L2318,1177 L2253,660 Z",
        "M2374,654 L2447,1150 L2544,1158 L2625,1122 L2552,625 Z",
        "M2681,639 L2754,1107 L2850,1115 L2931,1083 L2862,578 L2681,607 Z",
        "M2992,560 L3064,1064 L3165,1076 L3250,1036 L3169,535 Z",
        "M3520,1198 L4020,1198 L4020,1384 L3520,1392 L3488,1307 Z",
        "M3512,1497 L4020,1501 L4028,1670 L3524,1687 L3496,1586 Z",
        "M1253,2522 L1435,2522 L1427,2009 L1338,1985 L1245,2017 Z",
        "M1552,2013 L1552,2518 L1741,2522 L1729,2017 L1644,1989 Z",
      ]

      for (let i = 1; i <= formData.parkingSpots; i++) {
        await fetch(`${API_BASE_URL}/parking`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            project_id: projectId,
            parking_id: `P${i}`,
            level: 1,
            status: "libre",
            svg_path: defaultParkingPaths[i - 1] || defaultParkingPaths[0],
          }),
        })
      }

      onProjectAdded()
      onClose()

      // Reset form
      setFormData({
        name: "",
        location: "",
        image: "",
        edificio: "",
        brochure: "",
        totalUnits: 0,
        floors: [],
        parkingSpots: 13,
      })
      setCurrentStep(1)
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Error al crear el proyecto")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Agregar Nuevo Proyecto</DialogTitle>
        </DialogHeader>

        <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(Number.parseInt(value))}>
          <TabsList className="grid w-full grid-cols-3 bg-zinc-800">
            <TabsTrigger value="1" className="data-[state=active]:bg-zinc-700">
              <Building className="w-4 h-4 mr-2" />
              Información Básica
            </TabsTrigger>
            <TabsTrigger value="2" className="data-[state=active]:bg-zinc-700">
              <Home className="w-4 h-4 mr-2" />
              Configuración de Pisos
            </TabsTrigger>
            <TabsTrigger value="3" className="data-[state=active]:bg-zinc-700">
              <Car className="w-4 h-4 mr-2" />
              Cocheras y Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="1" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre del Proyecto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="DOME Nuevo Proyecto"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Av. Corrientes & Callao"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://ejemplo.com/imagen.png"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div>
              <Label htmlFor="edificio">URL del Edificio (SVG)</Label>
              <Input
                id="edificio"
                value={formData.edificio}
                onChange={(e) => setFormData((prev) => ({ ...prev, edificio: e.target.value }))}
                placeholder="https://ejemplo.com/edificio.svg"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div>
              <Label htmlFor="brochure">URL del Brochure</Label>
              <Input
                id="brochure"
                value={formData.brochure}
                onChange={(e) => setFormData((prev) => ({ ...prev, brochure: e.target.value }))}
                placeholder="https://ejemplo.com/brochure.pdf"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg">Configuración Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-zinc-400">
                  Para proyectos con 3 secciones y 92 departamentos, puedes usar la configuración automática:
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => generateQuickConfig(3, 30)}
                    variant="outline"
                    className="bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                  >
                    3 Secciones - 90 Unidades
                  </Button>
                  <Button
                    onClick={() => generateQuickConfig(3, 31)}
                    variant="outline"
                    className="bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                  >
                    3 Secciones - 93 Unidades
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="2" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Configuración de Pisos</h3>
              <Button onClick={addFloor} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Piso
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {formData.floors.map((floor, floorIndex) => (
                <Card key={floorIndex} className="bg-zinc-800 border-zinc-700">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Piso {floor.floorNumber}</CardTitle>
                    <Button onClick={() => removeFloor(floorIndex)} variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>ViewBox del SVG</Label>
                      <Input
                        value={floor.viewBox}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            floors: prev.floors.map((f, i) =>
                              i === floorIndex ? { ...f, viewBox: e.target.value } : f,
                            ),
                          }))
                        }
                        className="bg-zinc-700 border-zinc-600"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">Departamentos</Label>
                      <div className="flex gap-2 mb-2">
                        {Object.keys(defaultApartmentTypes).map((type) => (
                          <Button
                            key={type}
                            onClick={() => addApartmentToFloor(floorIndex, type)}
                            variant="outline"
                            size="sm"
                            className="bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                          >
                            Agregar {type}
                          </Button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {floor.apartments.map((apartment, apartmentIndex) => (
                          <Badge
                            key={apartmentIndex}
                            variant="secondary"
                            className="bg-zinc-700 text-white cursor-pointer hover:bg-red-600"
                            onClick={() => removeApartmentFromFloor(floorIndex, apartmentIndex)}
                          >
                            {floor.floorNumber}
                            {apartment.id} - {apartment.price}
                            <Trash2 className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {formData.floors.length === 0 && (
              <div className="text-center py-8 text-zinc-400">
                No hay pisos configurados. Agrega un piso para comenzar.
              </div>
            )}
          </TabsContent>

          <TabsContent value="3" className="space-y-4">
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle>Configuración de Cocheras</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="parkingSpots">Número de Cocheras</Label>
                  <Input
                    id="parkingSpots"
                    type="number"
                    value={formData.parkingSpots}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, parkingSpots: Number.parseInt(e.target.value) || 0 }))
                    }
                    className="bg-zinc-700 border-zinc-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle>Resumen del Proyecto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span className="font-semibold">{formData.name || "Sin nombre"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ubicación:</span>
                  <span className="font-semibold">{formData.location || "Sin ubicación"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Pisos:</span>
                  <span className="font-semibold">{formData.floors.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total de Departamentos:</span>
                  <span className="font-semibold">{calculateTotalUnits()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cocheras:</span>
                  <span className="font-semibold">{formData.parkingSpots}</span>
                </div>
              </CardContent>
            </Card>

            {formData.floors.length > 0 && (
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle>Detalle por Piso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.floors.map((floor, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>Piso {floor.floorNumber}:</span>
                        <span>{floor.apartments.length} departamentos</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                variant="outline"
                className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
              >
                Anterior
              </Button>
            )}
            {currentStep < 3 && (
              <Button onClick={() => setCurrentStep((prev) => prev + 1)} className="bg-blue-600 hover:bg-blue-700">
                Siguiente
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
              Cancelar
            </Button>
            {currentStep === 3 && (
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.name || formData.floors.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Creando..." : "Crear Proyecto"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
