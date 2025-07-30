// src/components/layout/AuthenticatedLayout.tsx - FINAL
'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Link from 'next/link'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, isLoading, isInitialized } = useAuth()
  const pathname = usePathname()

  // Mostrar loading solo mientras inicializa
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <p className="text-gray-400">
            {!isInitialized ? 'Inicializando...' : 'Cargando...'}
          </p>
        </div>
      </div>
    )
  }

  // Login page - mostrar sin sidebar
  if (pathname === '/login') {
    return <div className="min-h-screen bg-black">{children}</div>
  }

  // Si no hay usuario después de inicializar, mostrar pantalla de bienvenida
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bienvenido a Vento</h2>
          <p className="text-gray-400 mb-6">Sistema de gestión de restaurante</p>
          
          <Link 
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors inline-block font-medium"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  // Layout normal con sidebar para usuarios autenticados
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-black">
        {children}
      </main>
    </div>
  )
}