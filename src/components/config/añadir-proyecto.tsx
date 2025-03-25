'use client'

import { useState, useRef } from "react"
import { useAuth } from '@/app/auth/auth-context'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from 'lucide-react'

const API_BASE_URL = 'https://adndashbackend.onrender.com/api';

export function AddProject() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    image: '',
    edificio: '',
    available_units: 0,
    reserved_units: 0,
    sold_units: 0,
  })
  const [brochureFile, setBrochureFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('units') ? parseInt(value) : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBrochureFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })
      if (brochureFile) {
        formDataToSend.append('brochure', brochureFile)
      }

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      setSuccess(true)
      setFormData({
        name: '',
        location: '',
        image: '',
        edificio: '',
        available_units: 0,
        reserved_units: 0,
        sold_units: 0,
      })
      setBrochureFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  if (user?.rol !== 'admin' && user?.rol !== 'superadmin') {
    return <div className="container mx-auto p-4">No tienes permiso para acceder a esta página.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Añadir Nuevo Proyecto</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Éxito</AlertTitle>
              <AlertDescription>Proyecto creado con éxito</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Proyecto</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">URL de la Imagen</Label>
              <Input
                id="image"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edificio">URL del Edificio</Label>
              <Input
                id="edificio"
                name="edificio"
                type="url"
                value={formData.edificio}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_units">Unidades Disponibles</Label>
              <Input
                id="available_units"
                name="available_units"
                type="number"
                value={formData.available_units}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reserved_units">Unidades Reservadas</Label>
              <Input
                id="reserved_units"
                name="reserved_units"
                type="number"
                value={formData.reserved_units}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sold_units">Unidades Vendidas</Label>
              <Input
                id="sold_units"
                name="sold_units"
                type="number"
                value={formData.sold_units}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brochure">Brochure (PDF)</Label>
              <Input
                id="brochure"
                name="brochure"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear Proyecto'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

