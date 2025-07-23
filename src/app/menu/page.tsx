'use client'

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';

// Tipos para los productos del menú
type MenuProduct = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: 'hamburguesas' | 'hotdogs' | 'refrescos' | 'complementos';
  description?: string;
  isAvailable: boolean;
};

// Datos de ejemplo para el menú
const menuProducts: MenuProduct[] = [
  // Hamburguesas
  {
    id: 1,
    name: "Hamburguesa Clásica",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    category: "hamburguesas",
    description: "Carne jugosa, lechuga, tomate, cebolla",
    isAvailable: true
  },
  {
    id: 2,
    name: "Hamburguesa BBQ",
    price: 7.49,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=300&h=200&fit=crop",
    category: "hamburguesas",
    description: "Carne, salsa BBQ, cebolla caramelizada",
    isAvailable: true
  },
  {
    id: 3,
    name: "Hamburguesa Vegetariana",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1525059696034-4967a729002e?w=300&h=200&fit=crop",
    category: "hamburguesas",
    description: "Hamburguesa de lentejas y vegetales",
    isAvailable: true
  },
  // Hotdogs
  {
    id: 4,
    name: "Hotdog Clásico",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1612392062798-2dd8b83e8d8e?w=300&h=200&fit=crop",
    category: "hotdogs",
    description: "Salchicha, mostaza, ketchup",
    isAvailable: true
  },
  {
    id: 5,
    name: "Hotdog Especial",
    price: 5.49,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=200&fit=crop",
    category: "hotdogs",
    description: "Salchicha, queso, cebolla, jalapeños",
    isAvailable: true
  },
  // Refrescos
  {
    id: 6,
    name: "Coca Cola",
    price: 1.99,
    image: "https://images.unsplash.com/photo-1581636625402-29d2c5b3cc88?w=300&h=200&fit=crop",
    category: "refrescos",
    description: "Refresco de cola 500ml",
    isAvailable: true
  },
  {
    id: 7,
    name: "Agua Natural",
    price: 1.49,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=200&fit=crop",
    category: "refrescos",
    description: "Agua purificada 500ml",
    isAvailable: true
  },
  // Complementos
  {
    id: 8,
    name: "Papas Fritas",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop",
    category: "complementos",
    description: "Papas fritas crujientes",
    isAvailable: true
  },
  {
    id: 9,
    name: "Aros de Cebolla",
    price: 3.49,
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=300&h=200&fit=crop",
    category: "complementos",
    description: "Aros de cebolla empanizados",
    isAvailable: true
  }
];

type CategoryType = 'hamburguesas' | 'hotdogs' | 'refrescos' | 'complementos' | 'promociones';

const categories = [
  { id: 'hamburguesas', name: 'Hamburguesas' },
  { id: 'hotdogs', name: 'Hotdogs' },
  { id: 'refrescos', name: 'Refrescos' },
  { id: 'complementos', name: 'Complementos' },
  { id: 'promociones', name: 'Promociones' }
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('hamburguesas');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = menuProducts.filter(product => {
    const matchesCategory = activeCategory === 'promociones' ? true : product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: MenuProduct) => {
    console.log('Producto del menú seleccionado:', product);
    // Aquí puedes agregar lógica para editar producto, ver detalles, etc.
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Menú de la Hamburguesería</h1>
        <p className="text-gray-400 mb-6">
          Gestiona los productos, categorías y precios del menú de tu hamburguesería.
        </p>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar productos..."
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as CategoryType)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeCategory === 'promociones' ? (
          /* Sección de Promociones */
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-6">Promociones Especiales</h2>
            
            {/* Promoción 1 */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Combo Familiar</h3>
                  <p className="text-orange-100 mb-4">4 Hamburguesas + 4 Papas + 4 Refrescos</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold">$19.99</span>
                    <span className="text-sm line-through text-orange-200">$25.96</span>
                    <span className="bg-white text-orange-500 px-2 py-1 rounded-full text-sm font-bold">¡Ahorra $5.97!</span>
                  </div>
                </div>
                <div className="text-4xl font-bold">COMBO</div>
              </div>
            </div>

            {/* Promoción 2 */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Martes de Hotdogs</h3>
                  <p className="text-purple-100 mb-4">2x1 en todos los hotdogs los martes</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold">2x1</span>
                    <span className="bg-white text-purple-500 px-2 py-1 rounded-full text-sm font-bold">Solo Martes</span>
                  </div>
                </div>
                <div className="text-4xl font-bold">2x1</div>
              </div>
            </div>

            {/* Promoción 3 */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Happy Hour</h3>
                  <p className="text-green-100 mb-4">50% descuento en refrescos de 3-5 PM</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold">50% OFF</span>
                    <span className="bg-white text-green-500 px-2 py-1 rounded-full text-sm font-bold">3-5 PM</span>
                  </div>
                </div>
                <div className="text-4xl font-bold">50%</div>
              </div>
            </div>
          </div>
        ) : (
          /* Sección de Productos */
          <div>
            <h2 className="text-2xl font-semibold text-white mb-6">
              {categories.find(cat => cat.id === activeCategory)?.name}
            </h2>
            
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.name}
                    imageSrc={product.image}
                    price={product.price}
                    category={product.category}
                    description={product.description}
                    isAvailable={product.isAvailable}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 text-gray-500">•••</div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No se encontraron productos</h3>
                <p className="text-gray-500">
                  {searchTerm ? `No hay productos que coincidan con "${searchTerm}"` : 'No hay productos en esta categoría'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button para agregar productos */}
      <button className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}