// RUTA: src/app/pedidos/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
// --- ¡CAMBIO IMPORTANTE! ---
// Importamos los tipos `Pedido` y `Platillo` desde sus respectivos servicios
import { pedidosService, type Pedido } from '@/services/pedidosService'
import { menuService, type Platillo } from '@/services/menuService'
import { useApi } from '@/hooks/useApi'
import { MagnifyingGlassIcon, PlusIcon, EyeIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import NewOrderModal from '@/components/NewOrderModal'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import { Loader2, AlertCircle } from 'lucide-react'

// Las interfaces locales `OrderItem` y `Order` se han eliminado
// para usar `Pedido` y `PedidoDetalle` del servicio.

// Interfaz para los items en el modal de nuevo pedido
interface NewOrderItem {
  id: string;
  quantity: number;
  notes?: string;
}

//hol
export default function PedidosPage() {
  // El estado ahora usa el tipo `Pedido` importado
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'todos' | 'pendientes' | 'completados'>('todos')
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false)
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  // El hook ahora espera un array de `Pedido` o `Platillo`
  const { loading, error, execute } = useApi<Array<Pedido | Platillo>>()

  const loadInitialData = useCallback(async () => {
    await execute(async () => {
      try {
        const [pedidosResult, platillosResult] = await Promise.all([
          pedidosService.getMisPedidos(),
          menuService.getMisPlatillos()
        ])

        if (pedidosResult.success && pedidosResult.data) {
          // El `.map` ahora es seguro, `pedido` es de tipo `Pedido`
          const cleanedPedidos = pedidosResult.data.map((pedido) => ({
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
  }, [execute])

  const reloadPedidos = useCallback(async () => {
    try {
      const pedidosResult = await pedidosService.getMisPedidos()
      
      if (pedidosResult.success && pedidosResult.data) {
        // El `.map` ahora es seguro
        const cleanedPedidos = pedidosResult.data.map((pedido) => ({
          ...pedido,
          total: Number(pedido.total) || 0,
          estado: pedido.estado || 'pendiente',
          createdAt: pedido.createdAt || new Date().toISOString(),
          detalles: Array.isArray(pedido.detalles) ? pedido.detalles : []
        }))
        setPedidos(cleanedPedidos)
      }
    } catch (err) {
      console.error('Error reloading pedidos:', err)
    }
  }, [])

  useEffect(() => {
    loadInitialData()
  }, [loadInitialData]) // Se agrega la dependencia correcta

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

  const handleViewOrder = (order: Pedido) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const handleStatusChange = async (orderId: string, newStatus: Pedido['estado']) => {
    setUpdatingOrderId(orderId)
    try {
      const result = await pedidosService.updatePedido(orderId, { estado: newStatus })
      if (result.success) {
        await reloadPedidos()
        setIsDetailsModalOpen(false)
        setSelectedOrder(null)
        // NOTA: `alert` no es ideal. Considera usar una librería de notificaciones (toasts).
      } else {
        console.error('Error updating status:', result.error)
      }
    } catch (err) {
      console.error('Failed to update order:', err)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Se añade un tipo para los items del nuevo pedido
  const handleNewOrder = async (customerName: string, items: NewOrderItem[]) => {
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
        await reloadPedidos()
        setIsNewOrderModalOpen(false)
      } else {
        console.error('Error creating order:', result.error)
      }
    } catch (err) {
      console.error('Failed to create order:', err)
    }
  }

  const getStatusColor = (status: Pedido['estado']) => {
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

  const getStatusText = (status: Pedido['estado']) => {
    // Capitaliza la primera letra
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  const getStatusIcon = (status: Pedido['estado']) => {
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
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
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
      {/* Header (sin cambios) */}
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

      {/* Search Bar (sin cambios) */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar pedidos por ID, número o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs (sin cambios) */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'todos' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Todos ({pedidos.length})
          </button>
          <button
            onClick={() => setActiveTab('pendientes')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pendientes' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pendientes ({pedidos.filter(p => ['pendiente', 'confirmado', 'preparando'].includes(p.estado)).length})
          </button>
          <button
            onClick={() => setActiveTab('completados')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'completados' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Completados ({pedidos.filter(p => ['listo', 'entregado'].includes(p.estado)).length})
          </button>
        </div>
      </div>

      {/* Error State (sin cambios) */}
      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-900/50 border border-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-300">{error}</p>
          <button 
            onClick={loadInitialData}
            className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Orders Table (sin cambios en JSX, pero ahora con tipos seguros) */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">ID Pedido</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Fecha y Hora</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{order.numero || `#${order.id.slice(0, 8)}`}</div>
                        {order.notas && (<div className="text-xs text-gray-400 truncate max-w-32">{order.notas}</div>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.estado)}`}>
                        {getStatusIcon(order.estado)}
                        {getStatusText(order.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${(order.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleViewOrder(order)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Ver detalles">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {order.estado === 'pendiente' && (
                          <button onClick={() => handleStatusChange(order.id, 'confirmado')} disabled={updatingOrderId === order.id} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-2 py-1 rounded text-xs flex items-center gap-1" title="Confirmar">
                            {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircleIcon className="w-3 h-3" />}
                          </button>
                        )}
                        {order.estado === 'confirmado' && (
                           <button onClick={() => handleStatusChange(order.id, 'listo')} disabled={updatingOrderId === order.id} className="bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-2 py-1 rounded text-xs flex items-center gap-1" title="Marcar como listo">
                            {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircleIcon className="w-3 h-3" />}
                          </button>
                        )}
                        {order.estado === 'listo' && (
                           <button onClick={() => handleStatusChange(order.id, 'entregado')} disabled={updatingOrderId === order.id} className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-2 py-1 rounded text-xs flex items-center gap-1" title="Marcar como entregado">
                            {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircleIcon className="w-3 h-3" />}
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
            <h3 className="text-xl font-semibold text-gray-400 mb-2">{searchTerm ? 'No se encontraron pedidos' : 'No hay pedidos disponibles'}</h3>
            <p className="text-gray-500 mb-4">{searchTerm ? `No hay pedidos que coincidan con "${searchTerm}"` : 'Crea tu primer pedido para comenzar'}</p>
            {!searchTerm && (<button onClick={() => setIsNewOrderModalOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">Crear Primer Pedido</button>)}
          </div>
        )}
      </div>

      {/* Loading overlay (sin cambios) */}
      {loading && pedidos.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-gray-900 p-6 rounded-lg">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto mb-2" />
            <p className="text-white">Actualizando pedidos...</p>
          </div>
        </div>
      )}

      {/* Modals (ahora con tipos seguros) */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        products={platillos.map(p => ({ id: p.id, name: p.nombre, price: p.precio, category: p.categoria }))}
        onConfirm={handleNewOrder}
      />

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        order={selectedOrder ? {
          id: selectedOrder.id,
          orderNumber: selectedOrder.numero || `#${selectedOrder.id.slice(0, 8)}`,
          customer: selectedOrder.cliente || 'Cliente no especificado',
          time: new Date(selectedOrder.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          status: selectedOrder.estado,
          total: selectedOrder.total || 0,
          items: (selectedOrder.detalles || []).map(detalle => {
            const platillo = platillos.find(p => p.id === detalle.platilloId);
            return {
              id: detalle.id,
              name: platillo?.nombre || `Platillo ${detalle.platilloId}`,
              quantity: detalle.cantidad,
              price: platillo?.precio || 0,
              notes: detalle.notasEspeciales
            }
          })
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
