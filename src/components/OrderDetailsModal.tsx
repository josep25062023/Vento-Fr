'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

interface Order {
  id: string
  orderNumber: string
  customer: string
  time: string
  status: 'pending' | 'completed' | 'cancelled'
  total: number
  items: OrderItem[]
}

interface OrderDetailsModalProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
  onStatusChange: (orderId: string, newStatus: 'pending' | 'completed' | 'cancelled') => void
}

export default function OrderDetailsModal({ isOpen, order, onClose, onStatusChange }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Detalles del Pedido {order.orderNumber}
              </h2>
              <p className="text-gray-400 mt-1">
                Cliente: {order.customer} • {order.time}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Order Status */}
          <div className="mb-6">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              getStatusColor(order.status)
            }`}>
              {getStatusText(order.status)}
            </span>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Productos Pedidos</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="text-gray-400 text-sm">Cantidad: {item.quantity}</p>
                      {item.notes && (
                        <p className="text-yellow-400 text-sm mt-1">Nota: {item.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${item.price.toFixed(2)}</p>
                      <p className="text-gray-400 text-sm">
                        ${(item.price * item.quantity).toFixed(2)} total
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total del Pedido:</span>
              <span className="text-2xl font-bold text-green-400">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {order.status === 'pending' && (
              <>
                <button 
                  onClick={() => onStatusChange(order.id, 'completed')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-xl transition-colors"
                >
                  Marcar como Completado
                </button>
                <button 
                  onClick={() => onStatusChange(order.id, 'cancelled')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl transition-colors"
                >
                  Cancelar Pedido
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-xl border border-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}