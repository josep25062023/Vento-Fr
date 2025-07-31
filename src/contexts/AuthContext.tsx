// RUTA: src/contexts/AuthContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// --- ¡CAMBIO IMPORTANTE! ---
// Importamos tanto el servicio como la interfaz `User` desde el mismo lugar.
import { authService, User } from '@/services/authService'

// La interfaz `User` local se ha ELIMINADO.

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Verificar localStorage SOLO una vez al montar
  useEffect(() => {
    try {
      console.log('🔍 Checking localStorage for saved user...')
      const savedUser = localStorage.getItem('vento_user')
      
      if (savedUser) {
        const userData: User = JSON.parse(savedUser)
        console.log('✅ Found saved user:', userData)
        setUser(userData)
      } else {
        console.log('ℹ️ No saved user found')
      }
    } catch (err) {
      console.error('❌ Error reading localStorage:', err)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    setIsLoading(true)

    try {
      console.log('🚀 Attempting login...')
      const result = await authService.login({
        correo: email,
        contrasena: password
      })

      // --- ¡CORRECCIÓN CLAVE! ---
      // Accedemos al usuario a través de `result.data.user`
      if (result.success && result.data?.user) {
        const loggedInUser = result.data.user;
        console.log('✅ Login successful:', loggedInUser)
        setUser(loggedInUser)
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('vento_user', JSON.stringify(loggedInUser))
        
        return true
      } else {
        console.log('❌ Login failed:', result.error)
        setError(result.error || 'Error al iniciar sesión')
        return false
      }
    } catch (err: unknown) {
      console.error('❌ Login error:', err)
      setError(err instanceof Error ? err.message : 'Error de conexión')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log('🚪 Logging out...')
    setUser(null)
    setError(null)
    
    // Limpiar localStorage
    localStorage.removeItem('vento_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, isInitialized }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
