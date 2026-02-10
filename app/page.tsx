import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts, formatPrice } from "@/lib/api";
import AddToCartButton from "./add-to-cart-button";
import AddToFavoritesButton from "./add-to-favorites-button";

// Mapping des icônes SVG pour chaque catégorie
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('canapé') || name.includes('canape') || name.includes('salon')) {
    return (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  }
  
  if (name.includes('table') || name.includes('bureau')) {
    return (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    );
  }
  
  if (name.includes('fauteuil') || name.includes('chaise')) {
    return (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
      </svg>
    );
  }
  
  if (name.includes('lit') || name.includes('chambre')) {
    return (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    );
  }
  
  if (name.includes('luminaire') || name.includes('lampe') || name.includes('éclairage')) {
    return (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  }
  
  if (name.includes('décor') || name.includes('decor')) {
    return (
      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  }
  
  // Icône par défaut
  return (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
};

export default async function Home() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  // Obtenir les 3 produits les plus récents
  const featuredProducts = products
    .filter(p => p.availability)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section avec Vidéo */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dyboo0v03/video/upload/v1768780156/video_idvxff.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-br from-rose-200/40 via-pink-200/30 to-rose-300/40" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extralight text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-lg">
            Nous créons votre
            <br />
            <span className="font-light italic">espace de rêve</span>
          </h1>
        </div>
      </section>

      {/* Section Produits Vedettes - DÉPLACÉE ICI */}
      {featuredProducts.length > 0 && (
        <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-br from-rose-50/50 to-pink-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-3 sm:mb-4 block">Coups de cœur</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight text-gray-900 mb-4 sm:mb-6 tracking-tight">
                Nos dernières créations
              </h2>
              <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
              {featuredProducts.map((product) => (
                <div key={product._id} className="group">
                  {/* Image cliquable vers le détail */}
                  <div className="aspect-square bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl overflow-hidden mb-6 relative">
                    <Link href={`/produits/${product._id}`} className="absolute inset-0 cursor-pointer">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500"></div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm text-gray-400">Aucune image</span>
                        </div>
                      )}
                    </Link>
                    
                    {/* Bouton Favoris sur l'image - visible au survol */}
                    {product.images && product.images.length > 0 && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <AddToFavoritesButton 
                          product={{
                            _id: product._id,
                            name: product.name,
                            description: product.description || "",
                            price: product.price,
                            images: product.images,
                            availability: product.availability,
                            category: product.category || { _id: '', name: 'Non catégorisé' }
                          }}
                          size="md"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Informations et bouton */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <Link href={`/produits/${product._id}`}>
                        <h3 className="text-xl font-light text-gray-900 group-hover:text-rose-400 transition-colors cursor-pointer mb-2">
                          {product.name}
                        </h3>
                      </Link>
                      {product.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {product.description}
                        </p>
                      )}
                      <p className="text-lg text-rose-400 font-light">{formatPrice(product.price)}</p>
                    </div>
                    
                    {/* Boutons Panier et Favoris */}
                    <div className="flex gap-3">
                      <div className="flex-1">
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
                      <AddToFavoritesButton 
                        product={{
                          _id: product._id,
                          name: product.name,
                          description: product.description || "",
                          price: product.price,
                          images: product.images,
                          availability: product.availability,
                          category: product.category || { _id: '', name: 'Non catégorisé' }
                        }}
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section Catégories avec icônes - DÉPLACÉE ICI */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-3 sm:mb-4 block">Découvrez</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Nos Collections
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto"></div>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {categories.map((category) => (
                <Link 
                  href={`/categories/${category._id}`}
                  key={category._id}
                  className="group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                      <div className="text-rose-400 group-hover:text-rose-500 transition-colors scale-75 sm:scale-90 md:scale-100">
                        {getCategoryIcon(category.name)}
                      </div>
                    </div>
                    <h3 className="text-sm sm:text-base font-light text-gray-900 group-hover:text-rose-400 transition-colors px-2">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12 sm:py-20">
              <p className="text-sm sm:text-base">Aucune catégorie disponible pour le moment</p>
            </div>
          )}

          <div className="text-center mt-10 sm:mt-12 md:mt-16">
            <Link
              href="/produits"
              className="inline-flex items-center text-sm sm:text-base text-rose-400 hover:text-rose-500 transition-colors group"
            >
              <span className="tracking-wide">Voir tous les produits</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Galerie - DÉPLACÉE ICI */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-br from-rose-50/50 to-pink-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight text-gray-900 mb-4 sm:mb-6 tracking-tight leading-tight">
              Laissez-vous inspirer
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              "https://res.cloudinary.com/dyboo0v03/image/upload/v1769648334/Inspo1_locpof.jpg",
              "https://res.cloudinary.com/dyboo0v03/image/upload/v1769648334/Inspo2_rzdvgm.jpg",
              "https://res.cloudinary.com/dyboo0v03/image/upload/v1769648334/Inspo3_ygttw8.jpg",
              "https://res.cloudinary.com/dyboo0v03/image/upload/v1769648334/Inspo4_bkfint.jpg",
            ].map((src, i) => (
              <div
                key={i}
                className={`h-[240px] sm:h-[320px] md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden relative ${
                  i % 2 === 1 ? "md:translate-y-12" : ""
                }`}
              >
                <Image
                  src={src}
                  alt={`Inspiration ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Valeurs - DÉPLACÉE ICI */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/40 to-rose-50/80"></div>
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-rose-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-24">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-3 sm:mb-4 block">Ce qui nous distingue</span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight text-gray-900 mb-4 sm:mb-6 tracking-tight">
              Notre signature
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-rose-100/50">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-5 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-3 sm:mb-4 tracking-wide">
                  Sur Mesure
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Des créations uniques, pensées exclusivement pour vous et adaptées à votre style de vie unique
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-rose-100/50">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-5 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-3 sm:mb-4 tracking-wide">
                  Excellence
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Matériaux nobles et savoir-faire artisanal pour un résultat d'une qualité irréprochable
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-rose-100/50">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-5 sm:mb-6 md:mb-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-3 sm:mb-4 tracking-wide">
                  Accompagnement
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Un suivi personnalisé et attentif à chaque étape de la réalisation de votre projet
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA Premium */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-100"></div>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight text-gray-900 mb-5 sm:mb-6 md:mb-8 tracking-tight">
            Créons ensemble
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto px-4">
            Votre projet mérite une attention exceptionnelle. Parlons de vos aspirations et donnons vie à vos rêves.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 transition-all duration-300 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            <span>Commencer votre projet</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white border-t border-rose-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-gray-400">
              Royalty Room Shop
            </p>
            <p className="text-xs text-gray-500">
              Créateur d'intérieurs d'exception
            </p>
            <div className="pt-6 sm:pt-8">
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