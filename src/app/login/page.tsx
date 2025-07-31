// src/app/login/page.tsx - VERSIÓN LIMPIA
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Utensils, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await login(email, password)
    if (success) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex">
      {/* Imagen lateral */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 z-10" />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8">
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-4">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-xl xl:text-2xl text-white opacity-90">
            Gestiona tu restaurante con facilidad
          </p>
        </div>
      </div>

      {/* Formulario de login */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">VENTO</h1>
            <p className="text-base text-gray-600 mt-2">Sistema de gestión de restaurante</p>
          </div>

          {/* Tarjeta de login */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header de la tarjeta */}
            <div className="px-8 pt-8 pb-4 text-center">
              <h2 className="text-2xl font-bold text-neutral-900">Iniciar Sesión</h2>
              <p className="text-sm text-gray-500 mt-1">Accede a tu panel de administración</p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="w-full h-11 pr-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 px-3 flex items-center disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-11 rounded-lg text-white font-semibold flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-orange-300 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                } transition-colors`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>

              {/* Forgot password link */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                  onClick={() => alert('Funcionalidad de recuperación de contraseña próximamente')}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            © 2024 Vento POS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}