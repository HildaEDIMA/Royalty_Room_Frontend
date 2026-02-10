import Image from "next/image";
import Link from "next/link";
import { getProduct, getProducts, formatPrice, Category } from "@/lib/api";
import { notFound } from "next/navigation";
import AddToCartButton from "@/app/add-to-cart-button";

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Attendre les params (Next.js 15)
  const { id } = await params;
  const product = await getProduct(id);

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

              {/* Bouton Ajouter au panier */}
              {product.availability && (
                <div className="pt-4">
                  <AddToCartButton
                    product={{
                      _id: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0]?.url,
                      availableColors: product.availableColors,
                    }}
                  />
                </div>
              )}

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
                <div key={similarProduct._id} className="group">
                  {/* Image cliquable */}
                  <Link href={`/produits/${similarProduct._id}`}>
                    <div className="aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden mb-4 relative cursor-pointer">
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
                  </Link>
                  
                  {/* Informations et bouton */}
                  <div className="space-y-3">
                    <div>
                      <Link href={`/produits/${similarProduct._id}`}>
                        <h3 className="text-lg font-light text-gray-900 group-hover:text-rose-400 transition-colors cursor-pointer mb-2">
                          {similarProduct.name}
                        </h3>
                      </Link>
                      <p className="text-lg text-rose-400 font-light">
                        {formatPrice(similarProduct.price)}
                      </p>
                    </div>
                    
                    {/* Bouton Ajouter au panier */}
                    <AddToCartButton
                      product={{
                        _id: similarProduct._id,
                        name: similarProduct.name,
                        price: similarProduct.price,
                        image: similarProduct.images?.[0]?.url,
                        availableColors: similarProduct.availableColors,
                      }}
                    />
                  </div>
                </div>
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
              Royalty Room Shop
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