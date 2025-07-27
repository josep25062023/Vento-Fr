'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Eye, EyeOff, Utensils, AlertCircle } from 'lucide-react'
import food from '@/assets/images/food.jpg'


export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        router.push('/')
      } else {
        setError('Credenciales incorrectas')
      }
    } catch {
      setError('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const demoUsers = [
    { role: 'Gerente', email: 'admin@quickbite.com', pass: 'admin123' },
    { role: 'Cajero',  email: 'cajero@quickbite.com', pass: 'cajero123' },
    { role: 'Mesero',  email: 'mesero@quickbite.com', pass: 'mesero123' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex">

     <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
  
  <img
    src={food.src}
    alt="Comida rápida"
    className="absolute inset-0 w-full h-full object-cover"
  />


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


      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
      
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
              <Utensils className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">VENTO</h1>
            <p className="text-base text-gray-600 mt-2">Sistema de gestión de restaurante</p>
          </div>

        
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
     
            <div className="px-8 pt-8 pb-4 text-center">
              <h2 className="text-2xl font-bold text-neutral-900">Iniciar Sesión</h2>
              <p className="text-sm text-gray-500 mt-1">Accede a tu panel de administración</p>
            </div>

        
            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
        
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@quickbite.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ringf-2 focus:ring-orange-400 text-black"
                />
              </div>

            
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
                    className="w-full h-11 pr-10 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center"
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
                className={`w-full h-11 rounded-lg text-white font-semibold ${
                  isLoading
                    ? 'bg-orange-300 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>

              {/* Separator */}
              <div className="relative my-6">
                <hr className="border-gray-300" />
                <span className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 bg-white px-2 text-xs uppercase text-gray-500">
                  Usuarios de prueba
                </span>
              </div>

              {/* Demo users */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                {demoUsers.map(({ role, email, pass }) => (
                  <div key={role} className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-orange-600 font-medium">{role}:</p>
                      <p className="text-xs text-gray-700">{email}</p>
                    </div>
                    <p className="text-xs text-gray-500">{pass}</p>
                  </div>
                ))}
              </div>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-8">
            © 2024 QuickBite POS. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
