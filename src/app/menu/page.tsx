// src/app/menu/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { menuService, type Platillo } from '@/services/menuService'
import { useApi } from '@/hooks/useApi'
import ProductCard from '@/components/ProductCard'
import CreatePlatilloModal from '@/components/CreatePlatilloModal'
import EditPlatilloModal from '@/components/EditPlatilloModal'
import { Loader2, Plus, AlertCircle, Trash2, Edit, Eye } from 'lucide-react'

export default function MenuPage() {
  const [platillos, setPlatillos] = useState<Platillo[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPlatillo, setEditingPlatillo] = useState<Platillo | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const { loading, error, execute } = useApi<Platillo[]>()

  useEffect(() => {
    loadPlatillos()
  }, [])

  const loadPlatillos = async () => {
    const result = await execute(() => menuService.getMisPlatillos())
    if (result.success && result.data) {
      setPlatillos(result.data)
    }
  }

  const handleCreatePlatillo = async (data: Omit<Platillo, 'id'>) => {
    const result = await menuService.createPlatillo(data)
    if (result.success) {
      await loadPlatillos() // Recargar lista
      setIsCreateModalOpen(false)
      alert('Platillo creado exitosamente!')
    } else {
      alert('Error: ' + result.error)
    }
  }

  const handleUpdatePlatillo = async (id: string, data: Partial<Omit<Platillo, 'id'>>) => {
    const result = await menuService.updatePlatillo(id, data)
    if (result.success) {
      await loadPlatillos()
      setEditingPlatillo(null)
      alert('Platillo actualizado exitosamente!')
    } else {
      alert('Error: ' + result.error)
    }
  }

  const handleDeletePlatillo = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este platillo?')) return
    
    setDeletingId(id)
    const result = await menuService.deletePlatillo(id)
    
    if (result.success) {
      await loadPlatillos()
      alert('Platillo eliminado exitosamente!')
    } else {
      alert('Error: ' + result.error)
    }
    setDeletingId(null)
  }

  const toggleAvailability = async (platillo: Platillo) => {
    await handleUpdatePlatillo(platillo.id!, { disponible: !platillo.disponible })
  }

  // Filtrar platillos
  const filteredPlatillos = platillos.filter(platillo => {
    const matchesSearch = platillo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || platillo.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(platillos.map(p => p.categoria)))]

  if (loading && platillos.length === 0) {
    return (
      <div className="p-6 bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-white">Cargando menú...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Menú del Restaurante</h1>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Agregar Platillo
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar platillos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-3.5 h-5 w-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
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
            onClick={loadPlatillos}
            className="ml-auto bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Content */}
      <div className="space-y-6">
        {filteredPlatillos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlatillos.map((platillo) => (
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
                
                {/* Action buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => setEditingPlatillo(platillo)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded text-xs"
                    title="Editar"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => toggleAvailability(platillo)}
                    className={`${platillo.disponible ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white p-1 rounded text-xs`}
                    title={platillo.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeletePlatillo(platillo.id!)}
                    disabled={deletingId === platillo.id}
                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded text-xs disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deletingId === platillo.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-gray-500">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {searchTerm ? 'No se encontraron platillos' : 'No hay platillos disponibles'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No hay platillos que coincidan con "${searchTerm}"` 
                : 'Agrega tu primer platillo para comenzar'
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Agregar Primer Platillo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePlatilloModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleCreatePlatillo}
      />

      <EditPlatilloModal
        isOpen={!!editingPlatillo}
        platillo={editingPlatillo}
        onClose={() => setEditingPlatillo(null)}
        onConfirm={handleUpdatePlatillo}
      />
    </div>
  )
}