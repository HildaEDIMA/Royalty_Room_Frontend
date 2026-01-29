import Image from "next/image";
import Link from "next/link";
import { getProduct, getProducts, formatPrice, Category } from "@/lib/api";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Récupérer des produits similaires
  const allProducts = await getProducts();
  const categoryId = typeof product.category === 'string' 
    ? product.category 
    : product.category._id;
  
  const similarProducts = allProducts
    .filter(p => {
      const pCatId = typeof p.category === 'string' ? p.category : p.category._id;
      return pCatId === categoryId && p._id !== product._id && p.availability;
    })
    .slice(0, 3);

  const categoryName = typeof product.category === 'object' 
    ? (product.category as Category).name 
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-extralight tracking-tight text-gray-900">
              Espace Rêve
            </Link>
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-sm tracking-wide text-gray-600 hover:text-rose-400 transition-colors">
                Accueil
              </Link>
              <Link href="/produits" className="text-sm tracking-wide text-gray-600 hover:text-rose-400 transition-colors">
                Produits
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-rose-400 transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-rose-400 transition-colors">Produits</Link>
            {categoryName && (
              <>
                <span>/</span>
                <Link href={`/categories/${categoryId}`} className="hover:text-rose-400 transition-colors">
                  {categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Produit */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Galerie d'images */}
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl overflow-hidden relative">
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {product.images.slice(1, 5).map((image, idx) => (
                        <div key={idx} className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl overflow-hidden relative">
                          <Image
                            src={image.url}
                            alt={`${product.name} - Image ${idx + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl flex items-center justify-center">
                  <span className="text-gray-400">Aucune image disponible</span>
                </div>
              )}
            </div>

            {/* Informations produit */}
            <div className="space-y-8">
              {categoryName && (
                <Link 
                  href={`/categories/${categoryId}`}
                  className="inline-block px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm hover:bg-rose-100 transition-colors"
                >
                  {categoryName}
                </Link>
              )}

              <div>
                <h1 className="text-5xl font-extralight text-gray-900 mb-4 tracking-tight">
                  {product.name}
                </h1>
                <p className="text-3xl text-rose-400 font-light">
                  {formatPrice(product.price)}
                </p>
              </div>

              {product.description && (
                <div className="py-6 border-y border-rose-100">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>
              )}

              {product.availableColors && product.availableColors.length > 0 && (
                <div>
                  <h3 className="text-sm tracking-wide uppercase text-gray-600 mb-4">
                    Couleurs disponibles
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.availableColors.map((color, idx) => (
                      <div key={idx} className="group relative">
                        <div
                          className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-rose-400 transition-all cursor-pointer hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {color.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8">
                  <h3 className="text-xl font-light text-gray-900 mb-3">
                    Intéressé par ce produit ?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Contactez-nous pour obtenir plus d'informations ou pour passer commande.
                  </p>
                  <a
                    href="#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full hover:from-rose-500 hover:to-pink-500 transition-all hover:shadow-lg group"
                  >
                    <span className="tracking-wide">Nous contacter</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Personnalisation</h4>
                    <p className="text-sm text-gray-600">Chaque pièce peut être adaptée à vos besoins</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Fabrication artisanale</h4>
                    <p className="text-sm text-gray-600">Réalisé avec soin par nos artisans</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Matériaux premium</h4>
                    <p className="text-sm text-gray-600">Sélection rigoureuse des meilleurs matériaux</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produits similaires */}
      {similarProducts.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extralight text-gray-900 mb-4 tracking-tight">
                Vous aimerez aussi
              </h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProducts.map((similarProduct) => (
                <Link
                  href={`/produits/${similarProduct._id}`}
                  key={similarProduct._id}
                  className="group"
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden mb-4 relative">
                    {similarProduct.images && similarProduct.images.length > 0 ? (
                      <>
                        <Image
                          src={similarProduct.images[0].url}
                          alt={similarProduct.name}
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
                      {similarProduct.name}
                    </h3>
                    <p className="text-lg text-rose-400 font-light">
                      {formatPrice(similarProduct.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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