'use client'

import ProductCard from '@/components/ProductCard';

// Tipos para los datos que vendrán de la BD
type Product = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  isAvailable: boolean;
  isFavorite?: boolean;
  isFeatured?: boolean;
};

// Datos de ejemplo - reemplazar con llamada a API
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Hamburguesa Clásica",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop",
    category: "Hamburguesas",
    description: "Deliciosa hamburguesa con carne jugosa",
    isAvailable: true,
    isFavorite: true,
    isFeatured: false
  },
  {
    id: 2,
    name: "Hamburguesa de Pollo",
    price: 6.49,
    image: "https://images.unsplash.com/photo-1606755962773-d324e2d53014?w=300&h=200&fit=crop",
    category: "Hamburguesas",
    description: "Hamburguesa de pollo crujiente",
    isAvailable: true,
    isFavorite: false,
    isFeatured: true
  },
  {
    id: 3,
    name: "Papas Fritas",
    price: 2.49,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop",
    category: "Acompañamientos",
    description: "Papas fritas crujientes",
    isAvailable: true,
    isFavorite: true,
    isFeatured: false
  }
];

export default function Dashboard() {
  // Filtrar productos por categoría
  const favoriteProducts = mockProducts.filter(product => product.isFavorite);
  const featuredProducts = mockProducts.filter(product => product.isFeatured);
  
  const handleProductClick = (product: Product) => {
    console.log('Producto seleccionado:', product);
    // Aquí puedes agregar lógica para mostrar detalles, agregar al carrito, etc.
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artículos"
                className="w-80 pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
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
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">U</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="space-y-8">
        {/* Favoritos Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Favoritos</h2>
          <div className="grid grid-cols-3 gap-4">
            {favoriteProducts.length > 0 ? (
              favoriteProducts.map((product) => (
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
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400 py-8">
                No hay productos favoritos disponibles
              </div>
            )}
          </div>
        </div>

        {/* Destacados Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Destacados</h2>
          <div className="grid grid-cols-3 gap-4">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
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
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-400 py-8">
                No hay productos destacados disponibles
              </div>
            )}
          </div>
        </div>

        {/* Promociones Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Promociones</h2>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Oferta por tiempo limitado</p>
                <h3 className="text-lg font-semibold text-white mb-2">Menú Familiar</h3>
                <p className="text-sm text-gray-300 mb-4">Disfruta de una comida completa para toda la familia a un precio especial.</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Pedir ahora
                </button>
              </div>
              <div className="w-32 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-3xl">🍽️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
