'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, PlusIcon, MinusIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

interface NewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  onConfirm: (customerName: string, items: OrderItem[]) => void
}

export default function NewOrderModal({ isOpen, onClose, products, onConfirm }: NewOrderModalProps) {
  const [customerName, setCustomerName] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: number}>({})
  const [productSearch, setProductSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  if (!isOpen) return null

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(productSearch.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addProduct = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newQuantity = (prev[productId] || 0) - 1
      if (newQuantity <= 0) {
        const { [productId]: removed, ...rest } = prev
        return rest
      }
      return { ...prev, [productId]: newQuantity }
    })
  }

  const getOrderTotal = () => {
    return Object.entries(selectedProducts).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId)
      return total + (product ? product.price * quantity : 0)
    }, 0)
  }

  const handleConfirm = () => {
    if (!customerName.trim() || Object.keys(selectedProducts).length === 0) {
      alert('Por favor ingresa el nombre del cliente y selecciona al menos un producto')
      return
    }

    const orderItems: OrderItem[] = Object.entries(selectedProducts).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId)!
      return {
        id: productId,
        name: product.name,
        quantity,
        price: product.price
      }
    })

    onConfirm(customerName, orderItems)
    
    // Reset form
    setCustomerName('')
    setSelectedProducts({})
    setProductSearch('')
    setSelectedCategory('all')
  }

  const handleClose = () => {
    setCustomerName('')
    setSelectedProducts({})
    setProductSearch('')
    setSelectedCategory('all')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Nuevo Pedido</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Customer Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del Cliente
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ingresa el nombre del cliente"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products Section */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Productos</h3>
              
              {/* Product Search */}
              <div className="mb-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-gray-200 text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {category === 'all' ? 'Todos' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{product.name}</h4>
                        <p className="text-gray-400 text-sm">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
                          disabled={!selectedProducts[product.id]}
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-white">
                          {selectedProducts[product.id] || 0}
                        </span>
                        <button
                          onClick={() => addProduct(product.id)}
                          className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Resumen del Pedido</h3>
              
              {Object.keys(selectedProducts).length === 0 ? (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                  <p className="text-gray-400">No hay productos seleccionados</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(selectedProducts).map(([productId, quantity]) => {
                    const product = products.find(p => p.id === productId)!
                    return (
                      <div key={productId} className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{product.name}</h4>
                            <p className="text-gray-400 text-sm">Cantidad: {quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-white">
                              ${(product.price * quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Total */}
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total:</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${getOrderTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
            >
              Confirmar Pedido
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-xl border border-gray-700 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}