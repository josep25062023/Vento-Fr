// RUTA: src/components/QuickOrderModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Plus, Minus, Loader2 } from 'lucide-react'
import { type Platillo } from '@/services/menuService'
import Image from 'next/image'

interface QuickOrderModalProps {
  isOpen: boolean
  platillo: Platillo | null
  onClose: () => void
  onConfirm: (platilloId: string, cantidad: number, notas?: string) => Promise<void>
}

// --- CORRECCIÓN ---
// Se cambia `any` por `unknown` para mayor seguridad de tipos.
const safeNumber = (value: unknown): number => {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

export default function QuickOrderModal({ isOpen, platillo, onClose, onConfirm }: QuickOrderModalProps) {
  const [cantidad, setCantidad] = useState(1)
  const [notas, setNotas] = useState('')
  const [loading, setLoading] = useState(false)

  // Reset state when the modal opens with a new platillo
  useEffect(() => {
    if (isOpen) {
      setCantidad(1);
      setNotas('');
      setLoading(false);
    }
  }, [isOpen, platillo]);


  if (!isOpen || !platillo) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onConfirm(platillo.id, cantidad, notas || undefined)
      // The parent component will close the modal on success
    } catch (error) {
      console.error('Error creating quick order:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  const incrementCantidad = () => setCantidad(prev => prev + 1)
  const decrementCantidad = () => setCantidad(prev => Math.max(1, prev - 1))

  const precio = safeNumber(platillo.precio)
  const total = precio * cantidad

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Pedido Rápido</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Product Info */}
          <div className="mb-6">
            <div className="flex gap-4">
              <Image
                src={platillo.imagenUrl}
                alt={platillo.nombre}
                width={80}
                height={80}
                className="object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/80x80?text=Sin+Imagen'
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{platillo.nombre}</h3>
                <p className="text-gray-400 text-sm mb-1">{platillo.categoria}</p>
                <p className="text-orange-400 font-bold">${precio.toFixed(2)}</p>
              </div>
            </div>
            {platillo.descripcion && (
              <p className="text-gray-300 text-sm mt-3">{platillo.descripcion}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Cantidad
              </label>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={decrementCantidad}
                  disabled={cantidad <= 1 || loading}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <div className="w-16 text-center">
                  <span className="text-2xl font-bold text-white">{cantidad}</span>
                </div>
                
                <button
                  type="button"
                  onClick={incrementCantidad}
                  disabled={loading}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notas especiales (opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                placeholder="Ej: Sin cebolla, término medio, etc..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Total */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total:</span>
                <span className="text-2xl font-bold text-orange-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 text-white py-3 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Creando pedido...' : 'Crear Pedido'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 text-white py-3 px-4 rounded-lg border border-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
