// src/contexts/AuthContext.tsx - VERSIÓN FINAL SEGURA
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '@/services/authService'

interface User {
  id: string
  email?: string
  correo?: string
  nombreCompleto: string
}

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Verificar sesión automáticamente SOLO UNA VEZ al montar
  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        setIsLoading(true)
        const result = await authService.getProfile()
        
        // Solo actualizar estado si el componente sigue montado
        if (isMounted) {
          if (result.success && result.user) {
            setUser(result.user)
          }
        }
      } catch (err) {
        // Silently fail if no session
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setIsInitialized(true)
        }
      }
    }

    initAuth()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, []) // Array vacío - solo una vez

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await authService.login({
        correo: email,
        contrasena: password
      })

      if (result.success && result.user) {
        setUser(result.user)
        return true
      } else {
        setError(result.error || 'Error al iniciar sesión')
        return false
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Error en logout:', err)
    } finally {
      setUser(null)
      setError(null)
    }
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