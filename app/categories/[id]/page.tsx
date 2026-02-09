import Image from "next/image";
import Link from "next/link";
import { getCategory, getProductsByCategory, getCategories, formatPrice } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Attendre les params (Next.js 15)
  const { id } = await params;
  
  const [category, products, allCategories] = await Promise.all([
    getCategory(id),
    getProductsByCategory(id),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }
  
  const availableProducts = products.filter(p => p.availability);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Breadcrumb */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-rose-400 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-rose-400 transition-colors">Produits</Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section Catégorie */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-4 block">
            Collection
          </span>
          <h1 className="text-6xl md:text-7xl font-extralight text-gray-900 mb-6 tracking-tight">
            {category.name}
          </h1>
          <div className="w-20 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de {category.name.toLowerCase()} alliant élégance et qualité exceptionnelle
          </p>
        </div>
      </section>

      {/* Filtres par catégories */}
      {allCategories.length > 1 && (
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/produits"
                className="px-6 py-3 rounded-full bg-white border border-rose-200 text-gray-700 text-sm tracking-wide transition-all hover:bg-rose-50 hover:border-rose-300"
              >
                Tous
              </Link>
              {allCategories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat._id}`}
                  className={`px-6 py-3 rounded-full text-sm tracking-wide transition-all ${
                    cat._id === category._id
                      ? 'bg-rose-400 text-white hover:bg-rose-500'
                      : 'bg-white border border-rose-200 text-gray-700 hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  {cat.name}
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
            <>
              <div className="mb-8">
                <p className="text-gray-600 text-center">
                  {availableProducts.length} produit{availableProducts.length > 1 ? 's' : ''} disponible{availableProducts.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {availableProducts.map((product) => (
                  <Link
                    href={`/produits/${product._id}`}
                    key={product._id}
                    className="group"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden mb-4 relative">
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
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-light text-gray-900 group-hover:text-rose-400 transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <p className="text-lg text-rose-400 font-light">
                        {formatPrice(product.price)}
                      </p>
                      
                      {product.availableColors && product.availableColors.length > 0 && (
                        <div className="flex gap-2 pt-2">
                          {product.availableColors.slice(0, 5).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                          {product.availableColors.length > 5 && (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{product.availableColors.length - 5}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-2xl font-light text-gray-900 mb-3">
                  Aucun produit dans cette catégorie
                </h3>
                <p className="text-gray-600 mb-8">
                  De nouvelles créations seront bientôt disponibles dans cette collection.
                </p>
                <Link
                  href="/produits"
                  className="inline-flex items-center text-rose-400 hover:text-rose-500 transition-colors group"
                >
                  <span className="tracking-wide">Voir tous les produits</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-rose-100/50 to-pink-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-extralight text-gray-900 mb-6 tracking-tight">
            Un projet sur mesure ?
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            Nos artisans peuvent créer des pièces uniques adaptées à vos besoins et à votre espace.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-10 py-4 text-sm tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:scale-105 group"
          >
            <span>Nous contacter</span>
            <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
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