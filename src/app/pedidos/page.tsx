'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import NewOrderModal from '@/components/NewOrderModal'
import OrderDetailsModal from '@/components/OrderDetailsModal'
import OrdersTable from '@/components/OrdersTable'
// npm install @heroicons/react

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

interface Product {
  id: string
  name: string
  price: number
  category: string
}

const mockProducts: Product[] = [
  { id: '1', name: 'Hamburguesa Clásica', price: 12.00, category: 'Hamburguesas' },
  { id: '2', name: 'Hamburguesa Premium', price: 18.00, category: 'Hamburguesas' },
  { id: '3', name: 'Hot Dog Especial', price: 8.50, category: 'Hot Dogs' },
  { id: '4', name: 'Hot Dog Simple', price: 6.00, category: 'Hot Dogs' },
  { id: '5', name: 'Papas Fritas', price: 4.50, category: 'Acompañamientos' },
  { id: '6', name: 'Papas con Queso', price: 6.50, category: 'Acompañamientos' },
  { id: '7', name: 'Aros de Cebolla', price: 5.25, category: 'Acompañamientos' },
  { id: '8', name: 'Coca Cola', price: 3.00, category: 'Bebidas' },
  { id: '9', name: 'Sprite', price: 3.00, category: 'Bebidas' },
  { id: '10', name: 'Agua', price: 1.25, category: 'Bebidas' },
  { id: '11', name: 'Malteada de Vainilla', price: 7.50, category: 'Bebidas' }
]

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#12345',
    customer: 'Sofía Rodríguez',
    time: '10:15 AM',
    status: 'pending',
    total: 25.50,
    items: [
      { id: '1', name: 'Hamburguesa Clásica', quantity: 2, price: 12.00 },
      { id: '2', name: 'Papas Fritas', quantity: 1, price: 4.50 },
      { id: '3', name: 'Coca Cola', quantity: 1, price: 3.00, notes: 'Sin hielo' }
    ]
  },
  {
    id: '2',
    orderNumber: '#12346',
    customer: 'Carlos López',
    time: '10:20 AM',
    status: 'pending',
    total: 18.75,
    items: [
      { id: '1', name: 'Hot Dog Especial', quantity: 1, price: 8.50 },
      { id: '2', name: 'Aros de Cebolla', quantity: 1, price: 5.25 },
      { id: '3', name: 'Sprite', quantity: 1, price: 3.00 }
    ]
  },
  {
    id: '3',
    orderNumber: '#12347',
    customer: 'Ana García',
    time: '10:25 AM',
    status: 'completed',
    total: 32.00,
    items: [
      { id: '1', name: 'Hamburguesa Premium', quantity: 1, price: 18.00 },
      { id: '2', name: 'Papas con Queso', quantity: 1, price: 6.50 },
      { id: '3', name: 'Malteada de Vainilla', quantity: 1, price: 7.50 }
    ]
  },
  {
    id: '4',
    orderNumber: '#12348',
    customer: 'Javier Martínez',
    time: '10:30 AM',
    status: 'pending',
    total: 15.25,
    items: [
      { id: '1', name: 'Hot Dog Simple', quantity: 2, price: 6.00 },
      { id: '2', name: 'Agua', quantity: 1, price: 1.25 }
    ]
  },
  {
    id: '5',
    orderNumber: '#12349',
    customer: 'Laura Pérez',
    time: '10:35 AM',
    status: 'pending',
    total: 28.50,
    items: [
      { id: '1', name: 'Combo Familiar', quantity: 1, price: 28.50, notes: 'Extra salsa' }
    ]
  }
]

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'todos' | 'pendientes' | 'completados'>('todos')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'todos' || 
                      (activeTab === 'pendientes' && order.status === 'pending') ||
                      (activeTab === 'completados' && order.status === 'completed')
    return matchesSearch && matchesTab
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const handleStatusChange = (orderId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    console.log(`Cambiar estado del pedido ${orderId} a ${newStatus}`)
    setIsDetailsModalOpen(false)
    setSelectedOrder(null)
  }

  const handleNewOrder = (customerName: string, items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `#${12350 + mockOrders.length}`,
      customer: customerName,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
      total,
      items
    }

    console.log('Nuevo pedido creado:', newOrder)
    setIsNewOrderModalOpen(false)
    alert('Pedido creado exitosamente!')
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
            placeholder="Buscar pedidos..."
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
            { key: 'pendientes', label: 'Pendientes' },
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

      {/* Orders Table */}
      <OrdersTable orders={filteredOrders} onViewOrder={handleViewOrder} />

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        products={mockProducts}
        onConfirm={handleNewOrder}
      />

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        order={selectedOrder}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedOrder(null)
        }}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}