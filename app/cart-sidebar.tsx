"use client";

import { useCart } from './cart-context';
import Image from 'next/image';
import { formatPrice } from '@/lib/api';

export default function CartSidebar() {
  const { items, isOpen, toggleCart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-rose-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-light text-gray-900">
                Panier ({items.length})
              </h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-rose-50 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-600 mb-2">Votre panier est vide</p>
                <p className="text-sm text-gray-500">Ajoutez des produits pour commencer</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item._id}-${item.selectedColor?.name || 'default'}`}
                    className="flex gap-4 p-4 bg-rose-50/30 rounded-xl"
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      
                      {item.selectedColor && (
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <span className="text-xs text-gray-600">
                            {item.selectedColor.name}
                          </span>
                        </div>
                      )}

                      <p className="text-rose-400 font-light mt-1">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantité */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1, item.selectedColor?.name)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-rose-200 hover:bg-rose-50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="text-sm font-medium text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1, item.selectedColor?.name)}
                          className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-rose-200 hover:bg-rose-50 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>

                        <button
                          onClick={() => removeFromCart(item._id, item.selectedColor?.name)}
                          className="ml-auto p-1 hover:bg-rose-100 rounded transition-colors"
                        >
                          <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-rose-100 p-6 space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-600">Total</span>
                <span className="text-2xl font-light text-rose-400">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <button
                onClick={() => {
                  // Ici vous pouvez ajouter la logique de commande
                  alert('Fonctionnalité de commande à implémenter');
                }}
                className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full hover:from-rose-500 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl"
              >
                Commander
              </button>

              <button
                onClick={clearCart}
                className="w-full py-3 text-sm text-gray-600 hover:text-rose-400 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}