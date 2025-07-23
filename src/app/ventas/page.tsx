'use client'

import { useState } from 'react'
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  UserGroupIcon,
  DocumentArrowDownIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

interface SalesData {
  totalRevenue: number
  completedOrders: number
  averageSpent: number
  customersServed: number
}

interface DailySales {
  day: string
  sales: number
}

interface MonthlySales {
  month: string
  sales: number
}

export default function VentasPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  // Datos de ejemplo - estos vendrían de tu base de datos
  const salesData: SalesData = {
    totalRevenue: 1250,
    completedOrders: 75,
    averageSpent: 16.67,
    customersServed: 60
  }

  const dailySalesData: DailySales[] = [
    { day: 'Lun', sales: 180 },
    { day: 'Mar', sales: 220 },
    { day: 'Mié', sales: 160 },
    { day: 'Jue', sales: 240 },
    { day: 'Vie', sales: 200 },
    { day: 'Sáb', sales: 280 },
    { day: 'Dom', sales: 190 }
  ]

  const monthlySalesData: MonthlySales[] = [
    { month: 'Ene', sales: 4200 },
    { month: 'Feb', sales: 3800 },
    { month: 'Mar', sales: 4500 },
    { month: 'Abr', sales: 3900 },
    { month: 'May', sales: 4800 },
    { month: 'Jun', sales: 4200 },
    { month: 'Jul', sales: 5100 }
  ]

  const maxDailySales = Math.max(...dailySalesData.map(d => d.sales))
  const maxMonthlySales = Math.max(...monthlySalesData.map(d => d.sales))

  const handleExport = () => {
    // Implementar lógica de exportación
    console.log('Exportando datos...')
  }

  const handlePrint = () => {
    // Implementar lógica de impresión
    window.print()
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Ventas</h1>
        <p className="text-gray-400">Resumen de las ventas realizadas en un período específico</p>
      </div>

      {/* Filtros de tiempo */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'daily'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Diario
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'bg-white text-black'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Mensual
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total de ingresos */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total de ingresos</h3>
            <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">${salesData.totalRevenue.toLocaleString()}</p>
        </div>

        {/* Pedidos completados */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Pedidos completados</h3>
            <ShoppingBagIcon className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">{salesData.completedOrders}</p>
        </div>

        {/* Promedio de gasto por cliente */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Promedio de gasto por cliente</h3>
            <ArrowTrendingUpIcon className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white">${salesData.averageSpent}</p>
        </div>

        {/* Clientes atendidos */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Clientes atendidos</h3>
            <UserGroupIcon className="h-5 w-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-white">{salesData.customersServed}</p>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Comparativa de Ventas</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ventas por Día */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">Ventas por Día</h3>
            <div className="flex items-end justify-between h-48 space-x-2">
              {dailySalesData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="bg-gray-600 w-full rounded-t transition-all duration-300 hover:bg-gray-500"
                    style={{ 
                      height: `${(data.sales / maxDailySales) * 100}%`,
                      minHeight: '20px'
                    }}
                  ></div>
                  <span className="text-gray-400 text-xs mt-2">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tendencia de Ventas */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">Tendencia de Ventas</h3>
            <div className="relative h-48">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Línea de tendencia */}
                <polyline
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  points={monthlySalesData.map((data, index) => 
                    `${(index * 400) / (monthlySalesData.length - 1)},${200 - (data.sales / maxMonthlySales) * 180}`
                  ).join(' ')}
                />
                
                {/* Área bajo la línea */}
                <polygon
                  fill="url(#salesGradient)"
                  points={`0,200 ${monthlySalesData.map((data, index) => 
                    `${(index * 400) / (monthlySalesData.length - 1)},${200 - (data.sales / maxMonthlySales) * 180}`
                  ).join(' ')} 400,200`}
                />
                
                {/* Puntos en la línea */}
                {monthlySalesData.map((data, index) => (
                  <circle
                    key={index}
                    cx={(index * 400) / (monthlySalesData.length - 1)}
                    cy={200 - (data.sales / maxMonthlySales) * 180}
                    r="3"
                    fill="#ffffff"
                  />
                ))}
              </svg>
              
              {/* Etiquetas del eje X */}
              <div className="flex justify-between mt-2">
                {monthlySalesData.map((data, index) => (
                  <span key={index} className="text-gray-400 text-xs">{data.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Exportar</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors border border-gray-700"
        >
          <PrinterIcon className="h-5 w-5" />
          <span>Imprimir</span>
        </button>
      </div>
    </div>
  )
}