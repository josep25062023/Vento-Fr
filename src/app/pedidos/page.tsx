// src/app/pedidos/page.tsx - VERSIÓN ROBUSTA
'use client'

import { useState, useEffect } from 'react'
import { pedidosService } from '@/services/pedidosService'
import { menuService, type Platillo } from '@/services/menuService'
import { useApi } from '@/hooks/useApi'
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import NewOrderModal from '@/components/NewOrderModal'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import { Loader2, AlertCircle } from 'lucide-react'

interface OrderItem {
  id: string
  platilloId: string
  platillo?: Platillo
  cantidad: number
  precio: number
  notasEspeciales?: string
}

interface Order {
  id: string
  numero?: string
  cliente?: string
  notas?: string
  estado: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado'
  total: number
  createdAt: string
  detalles: OrderItem[]
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Order[]>([])
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'todos' | 'pendientes' | 'completados'>('todos')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const { loading, error, execute } = useApi()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    await execute(async () => {
      try {
        // Cargar pedidos y platillos en paralelo
        const [pedidosResult, platillosResult] = await Promise.all([
          pedidosService.getMisPedidos(),
          menuService.getMisPlatillos()
        ])

        if (pedidosResult.success && pedidosResult.data) {
          // Validar y limpiar datos de pedidos
          const cleanedPedidos = pedidosResult.data.map((pedido: any) => ({
            ...pedido,
            total: Number(pedido.total) || 0,
            estado: pedido.estado || 'pendiente',
            createdAt: pedido.createdAt || new Date().toISOString(),
            detalles: Array.isArray(pedido.detalles) ? pedido.detalles : []
          }))
          setPedidos(cleanedPedidos)
        }

        if (platillosResult.success && platillosResult.data) {
          setPlatillos(platillosResult.data)
        }

        return { success: true }
      } catch (err) {
        console.error('Error loading data:', err)
        return { success: false, error: 'Error al cargar datos' }
      }
    })
  }

  const filteredOrders = pedidos.filter(order => {
    const matchesSearch = searchTerm === '' || 
      (order.numero && order.numero.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.cliente && order.cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTab = activeTab === 'todos' || 
      (activeTab === 'pendientes' && ['pendiente', 'confirmado', 'preparando'].includes(order.estado)) ||
      (activeTab === 'completados' && ['listo', 'entregado'].includes(order.estado))
    
    return matchesSearch && matchesTab
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const handleStatusChange = async (orderId: string, newStatus: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado') => {
    setUpdatingOrderId(orderId)
    
    try {
      const result = await pedidosService.updatePedido(orderId, { estado: newStatus })
      
      if (result.success) {
        await loadData() // Recargar pedidos
        setIsDetailsModalOpen(false)
        setSelectedOrder(null)
        alert('Estado del pedido actualizado exitosamente!')
      } else {
        alert('Error: ' + result.error)
      }
    } catch (err) {
      alert('Error al actualizar pedido')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleNewOrder = async (customerName: string, items: any[]) => {
    try {
      const detalles = items.map(item => ({
        platilloId: item.id,
        cantidad: item.quantity,
        notasEspeciales: item.notes
      }))

      const result = await pedidosService.createPedido({
        notas: `Cliente: ${customerName}`,
        detalles
      })

      if (result.success) {
        await loadData()
        setIsNewOrderModalOpen(false)
        alert('Pedido creado exitosamente!')
      } else {
        alert('Error: ' + result.error)
      }
    } catch (err) {
      alert('Error al crear pedido')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'confirmado': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'preparando': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'listo': return 'bg-green-100 text-green-800 border-green-300'
      case 'entregado': return 'bg-green-100 text-green-800 border-green-300'
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente': return 'Pendiente'
      case 'confirmado': return 'Confirmado'
      case 'preparando': return 'Preparando'
      case 'listo': return 'Listo'
      case 'entregado': return 'Entregado'
      case 'cancelado': return 'Cancelado'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente': return <ClockIcon className="w-4 h-4" />
      case 'confirmado': return <CheckCircleIcon className="w-4 h-4" />
      case 'preparando': return <ClockIcon className="w-4 h-4" />
      case 'listo': return <CheckCircleIcon className="w-4 h-4" />
      case 'entregado': return <CheckCircleIcon className="w-4 h-4" />
      case 'cancelado': return <XCircleIcon className="w-4 h-4" />
      default: return <ClockIcon className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  if (loading && pedidos.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-white">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-gray-400 mt-1">Gestión de pedidos activos y historial</p>
        </div>
        <button 
          onClick={() => setIsNewOrderModalOpen(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl border border-gray-700 flex items-center gap-2 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Nuevo Pedido
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pedidos por ID, número o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-900 p-1 rounded-xl border border-gray-800">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'pendientes', label: 'Activos' },
            { key: 'completados', label: 'Completados' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-gray-200 text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">{error}</p>
          <button 
            onClick={loadData}
            className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    ID Pedido
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {order.numero || `#${order.id.slice(0, 8)}`}
                        </div>
                        {order.notas && (
                          <div className="text-xs text-gray-400 truncate max-w-32">
                            {order.notas}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${
                        getStatusColor(order.estado)
                      }`}>
                        {getStatusIcon(order.estado)}
                        {getStatusText(order.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      ${(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Ver detalles"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        
                        {/* Quick status change buttons */}
                        {order.estado === 'pendiente' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'confirmado')}
                            disabled={updatingOrderId === order.id}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                            title="Confirmar"
                          >
                            {updatingOrderId === order.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircleIcon className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        
                        {order.estado === 'confirmado' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'listo')}
                            disabled={updatingOrderId === order.id}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                            title="Marcar como listo"
                          >
                            {updatingOrderId === order.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircleIcon className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        
                        {order.estado === 'listo' && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'entregado')}
                            disabled={updatingOrderId === order.id}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                            title="Marcar como entregado"
                          >
                            {updatingOrderId === order.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircleIcon className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-gray-500">📋</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos disponibles'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No hay pedidos que coincidan con "${searchTerm}"` 
                : 'Crea tu primer pedido para comenzar'
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setIsNewOrderModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Crear Primer Pedido
              </button>
            )}
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {loading && pedidos.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-gray-900 p-6 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto mb-2" />
            <p className="text-white">Actualizando pedidos...</p>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        products={platillos.map(p => ({
          id: p.id!,
          name: p.nombre,
          price: p.precio,
          category: p.categoria
        }))}
        onConfirm={handleNewOrder}
      />

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        order={selectedOrder ? {
          id: selectedOrder.id,
          orderNumber: selectedOrder.numero || `#${selectedOrder.id.slice(0, 8)}`,
          customer: selectedOrder.notas?.includes('Cliente:') 
            ? selectedOrder.notas.replace('Cliente: ', '') 
            : 'Cliente no especificado',
          time: new Date(selectedOrder.createdAt).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: selectedOrder.estado as any,
          total: selectedOrder.total || 0,
          items: (selectedOrder.detalles || []).map(detalle => ({
            id: detalle.id,
            name: detalle.platillo?.nombre || `Platillo ${detalle.platilloId}`,
            quantity: detalle.cantidad,
            price: detalle.precio || 0,
            notes: detalle.notasEspeciales
          }))
        } : null}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedOrder(null)
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}