// RUTA: src/app/ventas/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { pedidosService } from '@/services/pedidosService'
import { useApi } from '@/hooks/useApi'
import { 
  // Se eliminó ChartBarIcon porque no se usaba
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon,
  DocumentArrowDownIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'
import { Loader2, AlertCircle } from 'lucide-react'

// --- INTERFACES PARA TIPADO ESTRICTO ---

// Define la estructura de un pedido para eliminar el uso de `any`
interface Pedido {
  id: string;
  total: number;
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  createdAt: string; // Se asume que la fecha viene como string en formato ISO
  // Agrega aquí otras propiedades que pueda tener un pedido
}

interface SalesData {
  totalRevenue: number
  completedOrders: number
  averageSpent: number
  customersServed: number
  todayRevenue: number
  weekRevenue: number
  monthRevenue: number
}

interface DailySales {
  day: string
  sales: number
  orders: number
}

// --- FUNCIONES UTILITARIAS CON TIPADO SEGURO ---

// Se reemplaza `any` por `unknown` para mayor seguridad
const safeNumber = (value: unknown): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const safeDate = (dateString: unknown): Date => {
  // Se valida que el input sea un string antes de crear la fecha
  if (typeof dateString !== 'string') {
    return new Date();
  }
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? new Date() : date
  } catch {
    return new Date()
  }
}

export default function VentasPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 0,
    completedOrders: 0,
    averageSpent: 0,
    customersServed: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0
  })
  const [dailySalesData, setDailySalesData] = useState<DailySales[]>([])
  // El estado de `pedidos` ahora usa la interfaz `Pedido`
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  // Se especifica el tipo de dato que manejará el hook
  const { loading, error, execute } = useApi<Pedido[]>()

  const loadSalesData = useCallback(async () => {
    // La función que se pasa a `execute` ahora tiene un tipado correcto
    await execute(async () => {
      try {
        const result = await pedidosService.getMisPedidos()
        
        if (result.success && result.data && Array.isArray(result.data)) {
          // El `map` ahora infiere `order` como tipo `Pedido`
          const cleanedOrders = result.data.map((order) => ({
            id: order.id || `temp-id-${Math.random()}`, // Asegurar que siempre haya un ID
            total: safeNumber(order.total),
            estado: order.estado || 'pendiente',
            createdAt: order.createdAt || new Date().toISOString()
          }))
          
          setPedidos(cleanedOrders)
          calculateSalesMetrics(cleanedOrders)
          calculateDailySales(cleanedOrders)
        } else {
          setPedidos([])
          setSalesData({
            totalRevenue: 0,
            completedOrders: 0,
            averageSpent: 0,
            customersServed: 0,
            todayRevenue: 0,
            weekRevenue: 0,
            monthRevenue: 0
          })
          setDailySalesData([])
        }
        
        // Se devuelve un objeto compatible con ServiceResponse
        return { success: true, data: result.data }
      } catch (err) {
        console.error('Error loading sales data:', err)
        return { success: false, error: 'Error al cargar datos de ventas' }
      }
    })
  }, [execute])

  useEffect(() => {
    loadSalesData()
  }, [loadSalesData]) // La dependencia es correcta

  // La función ahora espera un array de `Pedido`
  const calculateSalesMetrics = (orders: Pedido[]) => {
    try {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const completedOrders = orders.filter(order => 
        ['listo', 'entregado'].includes(order.estado)
      )

      const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0)
      const completedOrdersCount = completedOrders.length
      const averageSpent = completedOrdersCount > 0 ? totalRevenue / completedOrdersCount : 0
      
      const todayOrders = completedOrders.filter(order => safeDate(order.createdAt) >= today)
      const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0)

      const weekOrders = completedOrders.filter(order => safeDate(order.createdAt) >= weekAgo)
      const weekRevenue = weekOrders.reduce((sum, order) => sum + order.total, 0)

      const monthOrders = completedOrders.filter(order => safeDate(order.createdAt) >= monthAgo)
      const monthRevenue = monthOrders.reduce((sum, order) => sum + order.total, 0)

      setSalesData({
        totalRevenue,
        completedOrders: completedOrdersCount,
        averageSpent,
        customersServed: completedOrdersCount, // Simplificado
        todayRevenue,
        weekRevenue,
        monthRevenue
      })
    } catch (err) {
      console.error('Error calculating sales metrics:', err)
    }
  }

  // La función ahora espera un array de `Pedido`
  const calculateDailySales = (orders: Pedido[]) => {
    try {
      const completedOrders = orders.filter(order => 
        ['listo', 'entregado'].includes(order.estado)
      )

      const salesByDay: { [key: string]: { sales: number, orders: number } } = {}
      const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dayKey = daysOfWeek[date.getDay()]
        const dateKey = date.toDateString()

        const dayOrders = completedOrders.filter(order => {
          return safeDate(order.createdAt).toDateString() === dateKey
        })

        salesByDay[dayKey] = {
          sales: dayOrders.reduce((sum, order) => sum + order.total, 0),
          orders: dayOrders.length
        }
      }

      const dailySales = Object.entries(salesByDay).map(([day, data]) => ({
        day,
        sales: data.sales,
        orders: data.orders
      }))

      setDailySalesData(dailySales)
    } catch (err) {
      console.error('Error calculating daily sales:', err)
      setDailySalesData([])
    }
  }

  const handleExport = () => {
    try {
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Fecha,Pedidos,Ventas\n" +
        dailySalesData.map(data => `${data.day},${data.orders},${data.sales.toFixed(2)}`).join("\n")

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "ventas_reporte.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch {
      // Se puede usar un modal o una notificación en lugar de alert
      console.error('Error al exportar datos')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const maxDailySales = dailySalesData.length > 0 ? Math.max(...dailySalesData.map(d => d.sales)) : 0

  const formatDate = (dateString: string) => {
    try {
      return safeDate(dateString).toLocaleDateString('es-ES')
    } catch {
      return 'Fecha inválida'
    }
  }

  if (loading && pedidos.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-white">Cargando datos de ventas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ventas</h1>
        <p className="text-gray-400">Resumen de las ventas realizadas</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">{error}</p>
          <button 
            onClick={loadSalesData}
            className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Filtros de tiempo */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Diario
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Mensual
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de ingresos */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">
              {activeTab === 'daily' ? 'Ingresos Hoy' : 
                activeTab === 'weekly' ? 'Ingresos Semana' : 
                'Ingresos Mes'}
            </h3>
            <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            ${(activeTab === 'daily' ? salesData.todayRevenue :
              activeTab === 'weekly' ? salesData.weekRevenue :
              salesData.monthRevenue).toFixed(2)}
          </p>
        </div>

        {/* Pedidos completados */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Pedidos completados</h3>
            <ShoppingBagIcon className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">{salesData.completedOrders}</p>
        </div>

        {/* Promedio por pedido */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Promedio por pedido</h3>
            <ArrowTrendingUpIcon className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white">${salesData.averageSpent.toFixed(2)}</p>
        </div>

        {/* Total general */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total general</h3>
            <UserGroupIcon className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-white">${salesData.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Gráfico de ventas diarias */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Ventas de los Últimos 7 Días</h2>
        
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-end justify-between h-64 space-x-2">
            {dailySalesData.length > 0 ? dailySalesData.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1 h-full">
                <div className="flex-1 flex items-end w-full">
                  <div 
                    className="bg-gradient-to-t from-orange-600 to-orange-400 w-full rounded-t-lg transition-all duration-300 hover:from-orange-500 hover:to-orange-300 relative group"
                    style={{ 
                      height: maxDailySales > 0 ? `${(data.sales / maxDailySales) * 80}%` : '4px',
                      minHeight: '4px'
                    }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${data.sales.toFixed(2)} ({data.orders} pedidos)
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 text-xs mt-2 text-center">{data.day}</span>
              </div>
            )) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-400">No hay datos de ventas disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resumen de pedidos recientes */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Pedidos Recientes</h2>
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          {pedidos.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pedidos.slice(0, 5).map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-white">#{(pedido.id || '').toString().slice(0, 8)}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {formatDate(pedido.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                          pedido.estado === 'listo' ? 'bg-blue-100 text-blue-800' :
                          pedido.estado === 'preparando' ? 'bg-orange-100 text-orange-800' :
                          pedido.estado === 'confirmado' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pedido.estado || 'pendiente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        ${pedido.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No hay pedidos registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Exportar CSV</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700"
        >
          <PrinterIcon className="h-5 w-5" />
          <span>Imprimir</span>
        </button>
      </div>
    </div>
  )
}
