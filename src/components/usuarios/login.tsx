'use client'

import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '../../app/auth/auth-context'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const API_BASE_URL = 'https://adndashbackend.onrender.com/api';

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        login({ email: data.user.email, name: data.user.nombre, rol: data.user.rol });
        localStorage.setItem('token', data.token);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());
  
        const serverResponse = await fetch(`${API_BASE_URL}/auth/google-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: userInfo.email,
            name: userInfo.name,
            googleId: userInfo.sub
          }),
        });
  
        if (serverResponse.ok) {
          const data = await serverResponse.json();
          login({ email: userInfo.email, name: userInfo.name, rol: data.user.rol });
          localStorage.setItem('token', data.token);
        } else {
          console.error('Google login failed');
        }
      } catch (error) {
        console.error('Error during Google login:', error);
      }
    },
    onError: () => console.log('Google Login Failed'),
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Tu correo electronico..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">Iniciar sesión</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => googleLogin()}
            variant="outline"
            className="w-full"
          >
            Iniciar sesión con Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}