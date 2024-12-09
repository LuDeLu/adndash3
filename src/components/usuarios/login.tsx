'use client'

import { useState, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from '../../app/auth/auth-context'
import { Loader2, Mail, Lock, LogIn } from 'lucide-react'

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

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .bg-grid-dark {
        background-image: 
          linear-gradient(to right, rgba(75, 75, 75, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(75, 75, 75, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-black bg-grid-dark relative">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <Card className="w-full max-w-md relative overflow-hidden border border-gray-800 bg-gray-900 bg-opacity-80 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50"></div>
        <CardHeader className="relative z-10">
          <CardTitle className="text-3xl font-bold text-gray-100 mb-2">Iniciar sesión</CardTitle>
          <CardDescription className="text-gray-400">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Correo electrónico</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="Tu correo electronico..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-gray-800 bg-opacity-50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-gray-600 focus:ring-gray-600"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-gray-800 bg-opacity-50 border-gray-700 text-gray-100 focus:border-gray-600 focus:ring-gray-600"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-gray-100 font-semibold py-2 px-4 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center justify-center">
              <LogIn className="mr-2" size={18} />
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="relative z-10">
          <Button
            onClick={() => googleLogin()}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Iniciar sesión con Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

