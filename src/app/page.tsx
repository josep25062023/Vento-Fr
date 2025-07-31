// src/app/page.tsx - DASHBOARD REAL
'use client'

import { useState, useEffect, useCallback } from 'react'
import { menuService, type Platillo } from '@/services/menuService'
import { pedidosService } from '@/services/pedidosService'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/contexts/AuthContext'
import ProductCard from '@/components/ProductCard'
import QuickOrderModal from '@/components/QuickOrderModal'
import { ShoppingCart, Plus, Clock, CheckCircle, Loader2 } from 'lucide-react'

interface DashboardStats {
  totalPlatillos: number
  platillosDisponibles: number
  pedidosHoy: number
  ventasHoy: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPlatillos: 0,
    platillosDisponibles: 0,
    pedidosHoy: 0,
    ventasHoy: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatillo, setSelectedPlatillo] = useState<Platillo | null>(null)
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false)
  
  const { loading, execute } = useApi()

  const loadDashboardData = useCallback(async () => {
    await execute(async () => {
      // Cargar platillos
      const platillosResult = await menuService.getMisPlatillos()
      if (platillosResult.success && platillosResult.data) {
        setPlatillos(platillosResult.data)
        
        // Calcular estadísticas
        const totalPlatillos = platillosResult.data.length
        const platillosDisponibles = platillosResult.data.filter((p: Platillo) => p.disponible).length
        
        // Cargar pedidos para estadísticas
        const pedidosResult = await pedidosService.getMisPedidos()
        let pedidosHoy = 0
        let ventasHoy = 0
        
        if (pedidosResult.success && pedidosResult.data) {
          const today = new Date().toDateString()
          const pedidosDeHoy = pedidosResult.data.filter((pedido: any) => {
            const pedidoDate = new Date(pedido.createdAt || pedido.fecha).toDateString()
            return pedidoDate === today
          })
          
          pedidosHoy = pedidosDeHoy.length
          ventasHoy = pedidosDeHoy.reduce((total: number, pedido: any) => total + (pedido.total || 0), 0)
        }
        
        setStats({
          totalPlatillos,
          platillosDisponibles,
          pedidosHoy,
          ventasHoy
        })
      }
      
      return { success: true }
    })
  }, [execute])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const handleQuickOrder = (platillo: Platillo) => {
    setSelectedPlatillo(platillo)
    setIsQuickOrderOpen(true)
  }

  const handleCreateQuickOrder = async (platilloId: string, cantidad: number, notas?: string) => {
    const result = await pedidosService.createPedido({
      notas,
      detalles: [{ platilloId, cantidad }]
    })
    
    if (result.success) {
      setIsQuickOrderOpen(false)
      setSelectedPlatillo(null)
      alert('Pedido creado exitosamente!')
      loadDashboardData() // Recargar stats
    } else {
      alert('Error: ' + result.error)
    }
  }

  // Filtrar platillos para mostrar favoritos/destacados
  const featuredPlatillos = platillos.filter((p: Platillo) => p.disponible).slice(0, 6)
  const availablePlatillos = platillos.filter((p: Platillo) => 
    p.disponible && 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && platillos.length === 0) {
    return (
      <div className="p-6 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-white">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Bienvenido, {user?.nombreCompleto || 'Usuario'}
            </h1>
            <p className="text-gray-400 mt-1">
              Panel de control del restaurante
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar platillos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {(user?.nombreCompleto || 'U').charAt(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Platillos</p>
              <p className="text-2xl font-bold text-white">{stats.totalPlatillos}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Disponibles</p>
              <p className="text-2xl font-bold text-white">{stats.platillosDisponibles}</p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pedidos Hoy</p>
              <p className="text-2xl font-bold text-white">{stats.pedidosHoy}</p>
            </div>
            <div className="bg-orange-500/20 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ventas Hoy</p>
              <p className="text-2xl font-bold text-white">${stats.ventasHoy.toFixed(2)}</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="space-y-8">
        {/* Platillos Destacados */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Platillos Destacados</h2>
            <button 
              onClick={() => window.location.href = '/menu'}
              className="text-orange-400 hover:text-orange-300 text-sm font-medium"
            >
              Ver todos →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlatillos.length > 0 ? (
              featuredPlatillos.map((platillo) => (
                <div key={platillo.id} className="relative group">
                  <ProductCard
                    id={platillo.id}
                    title={platillo.nombre}
                    imageSrc={platillo.imagenUrl}
                    price={platillo.precio}
                    category={platillo.categoria}
                    description={platillo.descripcion}
                    isAvailable={platillo.disponible}
                  />
                  <button
                    onClick={() => handleQuickOrder(platillo)}
                    className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                    title="Pedido rápido"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4 text-gray-500">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No hay platillos disponibles</h3>
                <p className="text-gray-500 mb-4">Agrega platillos a tu menú para comenzar</p>
                <button 
                  onClick={() => window.location.href = '/menu'}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                >
                  Ir al Menú
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Búsqueda de Platillos */}
        {searchTerm && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">
              Resultados para &quot;{searchTerm}&quot;
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePlatillos.length > 0 ? (
                availablePlatillos.map((platillo) => (
                  <div key={platillo.id} className="relative group">
                    <ProductCard
                      id={platillo.id}
                      title={platillo.nombre}
                      imageSrc={platillo.imagenUrl}
                      price={platillo.precio}
                      category={platillo.categoria}
                      description={platillo.descripcion}
                      isAvailable={platillo.disponible}
                    />
                    <button
                      onClick={() => handleQuickOrder(platillo)}
                      className="absolute bottom-4 right-4 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                      title="Pedido rápido"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-400">No se encontraron platillos que coincidan con tu búsqueda</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones Rápidas */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => window.location.href = '/pedidos'}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6" />
                <h3 className="font-semibold">Gestionar Pedidos</h3>
              </div>
              <p className="text-blue-100 text-sm">Ver y administrar pedidos activos</p>
            </button>

            <button 
              onClick={() => window.location.href = '/menu'}
              className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <Plus className="w-6 h-6" />
                <h3 className="font-semibold">Agregar Platillo</h3>
              </div>
              <p className="text-green-100 text-sm">Añade nuevos platillos al menú</p>
            </button>

            <button 
              onClick={() => window.location.href = '/ventas'}
              className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl transition-colors text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <h3 className="font-semibold">Ver Reportes</h3>
              </div>
              <p className="text-purple-100 text-sm">Analiza las ventas y estadísticas</p>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Order Modal */}
      <QuickOrderModal
        isOpen={isQuickOrderOpen}
        platillo={selectedPlatillo}
        onClose={() => {
          setIsQuickOrderOpen(false)
          setSelectedPlatillo(null)
        }}
        onConfirm={handleCreateQuickOrder}
      />
    </div>
  )
}