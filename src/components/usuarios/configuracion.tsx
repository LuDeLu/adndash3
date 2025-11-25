'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Bell, Calendar, Image, Home, Users, Globe, Lock, User } from 'lucide-react'

export function SettingsDashboardComponent() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notificationFrequency, setNotificationFrequency] = useState('daily')
  const [calendarView, setCalendarView] = useState('month')
  const [mediaResolution, setMediaResolution] = useState(720)
  const [language, setLanguage] = useState('es')
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Configuración del Dashboard</h1>
      
      <Tabs defaultValue="ui" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <TabsTrigger value="ui">Interfaz de Usuario</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="media">Galería de Medios</TabsTrigger>
          <TabsTrigger value="account">Cuenta</TabsTrigger>
        </TabsList>

        <TabsContent value="ui">
          <Card>
            <CardHeader>
              <CardTitle>Personalización de la Interfaz</CardTitle>
              <CardDescription>Ajusta la apariencia y los elementos visibles en tu dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Tema</Label>
                <div className="flex items-center space-x-2">
                  <Sun className="h-5 w-5" />
                  <Switch
                    id="theme"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                  <Moon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <Label>Widgets Visibles</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {['Estadísticas de Ventas', 'Calendario', 'Gráfico de Progreso', 'Galería de Medios', 'Plano Interactivo'].map((widget) => (
                    <div key={widget} className="flex items-center space-x-2">
                      <Checkbox id={widget} />
                      <Label htmlFor={widget}>{widget}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo recibes notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notification-frequency">Frecuencia de Notificaciones</Label>
                <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Selecciona la frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Inmediatas</SelectItem>
                    <SelectItem value="daily">Diarias</SelectItem>
                    <SelectItem value="weekly">Semanales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tipos de Notificaciones</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {['Nuevas Estadísticas', 'Citas Programadas', 'Eventos de Google Calendar'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Switch id={type} />
                      <Label htmlFor={type}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar Preferencias</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Calendario</CardTitle>
              <CardDescription>Personaliza la integración y visualización del calendario.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="google-calendar" />
                <Label htmlFor="google-calendar">Integrar con Google Calendar</Label>
              </div>
              <div>
                <Label htmlFor="calendar-view">Vista Predeterminada</Label>
                <Select value={calendarView} onValueChange={setCalendarView}>
                  <SelectTrigger id="calendar-view">
                    <SelectValue placeholder="Selecciona la vista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Diaria</SelectItem>
                    <SelectItem value="week">Semanal</SelectItem>
                    <SelectItem value="month">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Selecciona la zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-argentina">América/Argentina/Buenos Aires</SelectItem>
                    <SelectItem value="america-mexico">América/Mexico City</SelectItem>
                    <SelectItem value="america-bogota">América/Bogotá</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Aplicar Cambios</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Galería de Medios</CardTitle>
              <CardDescription>Ajusta la calidad y organización de tus archivos multimedia.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="media-resolution">Resolución Predeterminada</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="media-resolution"
                    min={480}
                    max={1080}
                    step={120}
                    value={[mediaResolution]}
                    onValueChange={(value) => setMediaResolution(value[0])}
                  />
                  <span>{mediaResolution}p</span>
                </div>
              </div>
              <div>
                <Label>Organización Automática</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {['Por Fecha', 'Por Categoría', 'Por Etiquetas'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Guardar Configuración</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Cuenta</CardTitle>
              <CardDescription>Gestiona tu información personal y preferencias de seguridad.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" placeholder="Tu nombre" />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="language">Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Selecciona el idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="pt">Português</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="two-factor"
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
                <Label htmlFor="two-factor">Activar Autenticación de Dos Factores</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Actualizar Perfil</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
