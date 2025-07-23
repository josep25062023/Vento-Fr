'use client'

import React from 'react';

type ProductCardProps = {
  id?: string | number;
  title: string;
  imageSrc: string;
  price: string | number;
  category?: string;
  description?: string;
  isAvailable?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  onClick?: () => void;
};

export default function ProductCard({ 
  id,
  title, 
  imageSrc, 
  price, 
  category,
  description,
  isAvailable = true,
  gradientFrom = 'from-amber-400', 
  gradientTo = 'to-orange-600',
  onClick
}: ProductCardProps) {
  const formattedPrice = typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  
  return (
    <div 
      className={`bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-4 text-center group relative shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 border border-gray-800 ${
        onClick ? 'cursor-pointer' : ''
      } ${
        !isAvailable ? 'opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <div className={`w-full h-48 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden shadow-lg`}>
        <img 
          src={imageSrc} 
          alt={title} 
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-white font-bold text-xl bg-orange-500 px-4 py-2 rounded-full shadow-lg">
              {formattedPrice}
            </span>
          </div>
        </div>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
            <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full text-sm">
              No disponible
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl"></div>
      </div>
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
        {title}
      </h3>
      {category && (
        <p className="text-xs text-gray-400 mb-2">{category}</p>
      )}
      {description && (
        <p className="text-xs text-gray-300 mb-2 line-clamp-2">{description}</p>
      )}
      <div className="w-8 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}