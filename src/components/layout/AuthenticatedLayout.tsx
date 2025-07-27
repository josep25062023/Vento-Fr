'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si está en la página de login, mostrar solo el contenido
  if (pathname === '/login') {
    return <div className="min-h-screen bg-black">{children}</div>
  }

  // Si no está autenticado, no mostrar nada (el AuthProvider se encarga de redirigir)
  if (!user) {
    return null
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