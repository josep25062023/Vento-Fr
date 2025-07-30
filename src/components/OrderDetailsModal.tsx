// src/components/OrderDetailsModal.tsx - Actualizado
'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

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
  status: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado'
  total: number
  items: OrderItem[]
}

interface OrderDetailsModalProps {
  isOpen: boolean
  order: Order | null
  onClose: () => void
  onStatusChange: (orderId: string, newStatus: 'pendiente' | 'confirmado' | 'preparando' | 'listo' | 'entregado' | 'cancelado') => void
}

export default function OrderDetailsModal({ isOpen, order, onClose, onStatusChange }: OrderDetailsModalProps) {
  const [updating, setUpdating] = useState(false)

  if (!isOpen || !order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'confirmado': return 'bg-blue-100 text-blue-800'
      case 'preparando': return 'bg-orange-100 text-orange-800'
      case 'listo': return 'bg-green-100 text-green-800'
      case 'entregado': return 'bg-green-100 text-green-800'
      case 'cancelado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  const handleStatusChange = async (newStatus: typeof order.status) => {
    setUpdating(true)
    try {
      await onStatusChange(order.id, newStatus)
    } finally {
      setUpdating(false)
    }
  }

  const getAvailableActions = () => {
    switch (order.status) {
      case 'pendiente':
        return [
          { status: 'confirmado' as const, label: 'Confirmar Pedido', color: 'bg-blue-600 hover:bg-blue-700' },
          { status: 'cancelado' as const, label: 'Cancelar Pedido', color: 'bg-red-600 hover:bg-red-700' }
        ]
      case 'confirmado':
        return [
          { status: 'preparando' as const, label: 'Iniciar Preparación', color: 'bg-orange-600 hover:bg-orange-700' },
          { status: 'cancelado' as const, label: 'Cancelar Pedido', color: 'bg-red-600 hover:bg-red-700' }
        ]
      case 'preparando':
        return [
          { status: 'listo' as const, label: 'Marcar como Listo', color: 'bg-green-600 hover:bg-green-700' }
        ]
      case 'listo':
        return [
          { status: 'entregado' as const, label: 'Marcar como Entregado', color: 'bg-purple-600 hover:bg-purple-700' }
        ]
      default:
        return []
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
          <div className="border-t border-gray-800 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total del Pedido:</span>
              <span className="text-2xl font-bold text-green-400">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {getAvailableActions().map((action) => (
              <button 
                key={action.status}
                onClick={() => handleStatusChange(action.status)}
                disabled={updating}
                className={`flex-1 min-w-40 ${action.color} disabled:opacity-50 text-white py-2 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2`}
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                {action.label}
              </button>
            ))}
            
            <button
              onClick={onClose}
              disabled={updating}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white py-2 px-4 rounded-xl border border-gray-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}