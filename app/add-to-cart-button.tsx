"use client";

import { useState } from 'react';
import { useCart } from './cart-context';

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
    availableColors?: Array<{
      name: string;
      hex: string;
    }>;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(
    product.availableColors?.[0] || null
  );
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedColor: selectedColor || undefined,
    });

    // Animation feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Sélection de couleur */}
      {product.availableColors && product.availableColors.length > 0 && (
        <div>
          <h3 className="text-sm tracking-wide uppercase text-gray-600 mb-4">
            Couleurs disponibles
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.availableColors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                className="group relative"
              >
                <div
                  className={`w-12 h-12 rounded-full border-2 transition-all cursor-pointer hover:scale-110 ${
                    selectedColor?.name === color.name
                      ? 'border-rose-400 ring-2 ring-rose-200'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
          {selectedColor && (
            <p className="text-sm text-gray-600 mt-4">
              Couleur sélectionnée: <span className="font-medium text-gray-900">{selectedColor.name}</span>
            </p>
          )}
        </div>
      )}

      {/* Bouton Ajouter au panier */}
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`w-full py-4 px-8 rounded-full text-white font-medium tracking-wide transition-all duration-300 ${
          isAdding
            ? 'bg-green-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 shadow-lg hover:shadow-xl hover:scale-105'
        }`}
      >
        {isAdding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ajouté au panier !
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Ajouter au panier
          </span>
        )}
      </button>
    </div>
  );
}