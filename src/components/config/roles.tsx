'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/app/auth/auth-context'
import { Loader2 } from 'lucide-react'

type User = {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://adndash.squareweb.app/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Error al cargar los usuarios. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch(`https://adndash.squareweb.app/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newRole })
      })
      if (response.ok) {
        fetchUsers() // Refresh the user list
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      setError('Error al actualizar el rol del usuario. Por favor, intenta de nuevo.')
    }
  }

  if (user?.rol !== 'admin' && user?.rol !== 'superadmin') {
    return <div className="container mx-auto p-4">No tienes permiso para acceder a esta página.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Cargando usuarios...</span>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div>No se encontraron usuarios.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map(user => (
            <Card key={user.id}>
              <CardHeader>
                <CardTitle>{user.nombre} {user.apellido}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Email: {user.email}</p>
                <div className="mt-2">
                  <Label htmlFor={`role-${user.id}`}>Rol</Label>
                  <Select
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    defaultValue={user.rol}
                  >
                    <SelectTrigger id={`role-${user.id}`}>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem  value="superadmin" disabled>Programador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}