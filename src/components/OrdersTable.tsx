'use client'

import { EyeIcon } from '@heroicons/react/24/outline'

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

interface OrdersTableProps {
  orders: Order[]
  onViewOrder: (order: Order) => void
}

export default function OrdersTable({ orders, onViewOrder }: OrdersTableProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Número de Pedido
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300 uppercase tracking-wider">
                Hora del Pedido
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {order.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    onClick={() => onViewOrder(order)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}