// src/components/EditPlatilloModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Loader2 } from 'lucide-react'
import { type Platillo } from '@/services/menuService'

interface EditPlatilloModalProps {
  isOpen: boolean
  platillo: Platillo | null
  onClose: () => void
  onConfirm: (id: string, data: Partial<Omit<Platillo, 'id'>>) => Promise<void>
}

export default function EditPlatilloModal({ isOpen, platillo, onClose, onConfirm }: EditPlatilloModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    imagenUrl: '',
    disponible: true,
    categoria: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (platillo) {
      setFormData({
        nombre: platillo.nombre,
        descripcion: platillo.descripcion,
        precio: platillo.precio,
        imagenUrl: platillo.imagenUrl,
        disponible: platillo.disponible,
        categoria: platillo.categoria
      })
    }
  }, [platillo])

  if (!isOpen || !platillo) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onConfirm(platillo.id!, formData)
    } catch (error) {
      console.error('Error updating platillo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Editar Platillo</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre del Platillo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Precio *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría *
              </label>
              <input
                type="text"
                required
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* URL de imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL de la Imagen
              </label>
              <input
                type="url"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            {/* Disponible */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="disponible-edit"
                checked={formData.disponible}
                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                className="w-4 h-4 text-orange-600 bg-gray-800 border-gray-600 rounded focus:ring-orange-500"
                disabled={loading}
              />
              <label htmlFor="disponible-edit" className="ml-2 text-sm font-medium text-gray-300">
                Platillo disponible
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800 text-white py-3 px-4 rounded-xl border border-gray-700 transition-colors"
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