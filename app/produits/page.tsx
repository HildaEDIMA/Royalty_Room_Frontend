import Image from "next/image";
import Link from "next/link";
import { getProducts, getCategories, formatPrice, Category } from "@/lib/api";

export default async function ProduitsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const availableProducts = products.filter(p => p.availability);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 pt-24">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-4 block">
            Collection complète
          </span>
          <h1 className="text-6xl md:text-7xl font-extralight text-gray-900 mb-6 tracking-tight">
            Tous nos produits
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto"></div>
        </div>
      </section>

      {/* Filtres par catégories */}
      {categories.length > 0 && (
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/produits"
                className="px-6 py-3 rounded-full bg-rose-400 text-white text-sm tracking-wide transition-all hover:bg-rose-500"
              >
                Tous
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category._id}`}
                  className="px-6 py-3 rounded-full bg-white border border-rose-200 text-gray-700 text-sm tracking-wide transition-all hover:bg-rose-50 hover:border-rose-300"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grille de produits */}
      <section className="py-12 px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {availableProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {availableProducts.map((product) => {
                const categoryName = typeof product.category === 'object' 
                  ? (product.category as Category).name 
                  : '';

                return (
                  <Link
                    href={`/produits/${product._id}`}
                    key={product._id}
                    className="group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden mb-4 relative">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm text-gray-400">Aucune image</span>
                        </div>
                      )}
                      
                      {categoryName && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs text-gray-700">
                            {categoryName}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-light text-gray-900 group-hover:text-rose-400 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <p className="text-base text-rose-400 font-light">
                        {formatPrice(product.price)}
                      </p>
                      
                      {product.availableColors && product.availableColors.length > 0 && (
                        <div className="flex gap-1.5 pt-1">
                          {product.availableColors.slice(0, 4).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-5 h-5 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                          {product.availableColors.length > 4 && (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                              <span className="text-[10px] text-gray-600">+{product.availableColors.length - 4}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-2xl font-light text-gray-900 mb-3">Aucun produit disponible</h3>
                <p className="text-gray-600">
                  Nos créations seront bientôt disponibles. Revenez nous voir prochainement.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-white border-t border-rose-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <p className="text-sm tracking-[0.2em] uppercase text-gray-400">
              Espace Rêve
            </p>
            <p className="text-xs text-gray-500">
              Créateur d'intérieurs d'exception
            </p>
            <div className="pt-8">
              <p className="text-xs text-gray-400">
                © 2026 – Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}