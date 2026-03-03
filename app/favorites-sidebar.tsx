"use client";

import { useFavorites } from "./favorites-context";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/api";
import { useCart } from "./cart-context";

export default function FavoritesSidebar() {
  const { favorites, isFavoritesSidebarOpen, setFavoritesSidebarOpen, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    const productWithImage = {
      ...product,
      image: product.image || (product.images && product.images.length > 0 ? product.images[0].url : undefined),
    };
    addToCart(productWithImage);
  };

  return (
    <>
      {/* Overlay */}
      {isFavoritesSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setFavoritesSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-500 ease-in-out ${
          isFavoritesSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-rose-100">
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-rose-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-xl font-light text-gray-900">
                Mes Favoris
                <span className="ml-2 text-sm text-rose-400">({favorites.length})</span>
              </h2>
            </div>
            <button
              onClick={() => setFavoritesSidebarOpen(false)}
              className="p-2 hover:bg-rose-50 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6">
                  <svg
                    className="w-12 h-12 text-rose-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <p className="text-lg font-light text-gray-900 mb-2">
                  Aucun favori pour le moment
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Ajoutez vos produits préférés pour les retrouver facilement
                </p>
                <Link
                  href="/produits"
                  onClick={() => setFavoritesSidebarOpen(false)}
                  className="px-8 py-3 text-sm tracking-wider uppercase text-white bg-rose-400 hover:bg-rose-500 transition-all duration-300 rounded-full"
                >
                  Découvrir nos produits
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {favorites.map((product) => (
                  <div
                    key={product._id}
                    className="group relative bg-gradient-to-br from-rose-50/30 to-pink-50/30 rounded-2xl p-4 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link
                        href={`/produits/${product._id}`}
                        onClick={() => setFavoritesSidebarOpen(false)}
                        className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-white"
                      >
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Aucune image</span>
                          </div>
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/produits/${product._id}`}
                          onClick={() => setFavoritesSidebarOpen(false)}
                        >
                          <h3 className="text-base font-light text-gray-900 mb-1 truncate hover:text-rose-400 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gray-500 mb-3">
                          {product.category?.name || 'Non catégorisé'}
                        </p>
                        <p className="text-lg font-light text-rose-400 mb-3">
                          {formatPrice(product.price)}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleAddToCart(product);
                              setFavoritesSidebarOpen(false);
                            }}
                            className="flex-1 px-4 py-2 text-xs tracking-wider uppercase text-white bg-rose-400 hover:bg-rose-500 transition-colors rounded-lg"
                          >
                            Ajouter au panier
                          </button>
                          <button
                            onClick={() => removeFromFavorites(product._id)}
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Retirer des favoris"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="border-t border-rose-100 p-6 bg-gradient-to-br from-rose-50/30 to-pink-50/30">
              <Link
                href="/produits"
                onClick={() => setFavoritesSidebarOpen(false)}
                className="block w-full text-center px-6 py-3.5 text-sm tracking-wider uppercase text-rose-400 bg-white hover:bg-rose-50 border border-rose-200 transition-all duration-300 rounded-full"
              >
                Continuer mes achats
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}