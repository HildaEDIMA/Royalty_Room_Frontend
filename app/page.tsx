import Image from "next/image";
import Link from "next/link";
import { getCategories, getProducts, formatPrice } from "@/lib/api";
import AddToCartButton from "./add-to-cart-button";
import AddToFavoritesButton from "./add-to-favorites-button";

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
      {/* Hero Section avec Image */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dyboo0v03/image/upload/v1774053240/WhatsApp_Image_2026-03-21_at_01.29.16_vfqbkv.jpg"
          alt="Royalty Room – intérieur d'exception"
          fill
          priority
          className="object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/50 via-black/30 to-rose-900/40" />
        
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extralight text-white mb-4 sm:mb-6 tracking-tight leading-tight drop-shadow-lg">
            Nous créons votre
            <br />
            <span className="font-light italic">espace de rêve</span>
          </h1>
        </div>
      </section>

      {/* Section Produits Vedettes */}
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
              {featuredProducts.map((product) => {
                // Normaliser la catégorie en objet
                const category = typeof product.category === 'string' 
                  ? undefined 
                  : product.category;

                return (
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
                              category: category
                            }}
                            size="md"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Informations et boutons */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <Link href={`/produits/${product._id}`}>
                          <h3 className="text-xl font-light text-gray-900 group-hover:text-rose-400 transition-colors cursor-pointer mb-2">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-2xl font-light text-rose-400 mb-4">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      
                      {/* Boutons Panier et Favoris */}
                      <div className="flex gap-3">
                        <div className="flex-1">
<AddToCartButton product={{
  _id: product._id,
  name: product.name,
  price: product.price,
  image: product.images?.[0]?.url,
  availableColors: product.availableColors,
}} />
                        </div>
                        <AddToFavoritesButton 
                          product={{
                            _id: product._id,
                            name: product.name,
                            description: product.description || "",
                            price: product.price,
                            images: product.images,
                            availability: product.availability,
                            category: category
                          }}
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

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
      )}

      {/* Section Galerie – mosaïque éditoriale */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* En-tête éditorial */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-14 md:mb-20 gap-4">
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-2 block">Univers Royalty Room</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extralight text-gray-900 tracking-tight leading-tight">
                Laissez-vous<br />
                <span className="italic font-light text-rose-400">inspirer</span>
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed sm:text-right">
              Chaque espace est une signature. Découvrez nos univers de référence, entre mobilier sur mesure et matières d'exception.
            </p>
          </div>

          {/* Ligne 1 : grande image vedette + 2 images empilées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-4 sm:mb-5">
            {/* Grande image vedette */}
            <div className="md:col-span-2 h-[360px] sm:h-[480px] md:h-[560px] rounded-2xl overflow-hidden relative group">
              <Image
                src="https://res.cloudinary.com/dyboo0v03/image/upload/v1781139998/t%C3%A9l%C3%A9charger_2_x3c2a3.jpg"
                alt="Inspiration chambre – lit bouclé"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute bottom-5 left-6 text-white text-xs tracking-[0.25em] uppercase opacity-80">Literie & Confort</span>
            </div>
            {/* 2 images empilées */}
            <div className="grid grid-rows-2 gap-4 sm:gap-5">
              <div className="h-[170px] sm:h-[228px] md:h-[270px] rounded-2xl overflow-hidden relative group">
                <Image
                  src="https://res.cloudinary.com/dyboo0v03/image/upload/v1781139998/t%C3%A9l%C3%A9charger_3_jsg5dh.jpg"
                  alt="Inspiration table de nuit"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              <div className="h-[170px] sm:h-[228px] md:h-[270px] rounded-2xl overflow-hidden relative group">
                <Image
                  src="https://res.cloudinary.com/dyboo0v03/image/upload/v1781140058/t%C3%A9l%C3%A9charger_9_vlwabc.jpg"
                  alt="Inspiration dressing"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
            </div>
          </div>

          {/* Ligne 2 : 4 images horizontales de hauteur égale */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-4 sm:mb-5">
            {[
              { src: "https://res.cloudinary.com/dyboo0v03/image/upload/v1781139998/t%C3%A9l%C3%A9charger_4_fxwvb9.jpg", label: "Armoire" },
              { src: "https://res.cloudinary.com/dyboo0v03/image/upload/v1781139998/t%C3%A9l%C3%A9charger_5_doc1zl.jpg", label: "Dressing" },
              { src: "https://res.cloudinary.com/dyboo0v03/image/upload/v1781139998/t%C3%A9l%C3%A9charger_6_peeejd.jpg", label: "Coiffeuse" },
              { src: "https://res.cloudinary.com/dyboo0v03/image/upload/v1781140058/Jig_Maker_s_Tool_Kit_yctrrn.jpg", label: "Matériaux" },
            ].map(({ src, label }, i) => (
              <div key={i} className="h-[200px] sm:h-[260px] md:h-[300px] rounded-2xl overflow-hidden relative group">
                <Image
                  src={src}
                  alt={`Inspiration – ${label}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute bottom-4 left-4 text-white text-xs tracking-[0.2em] uppercase opacity-0 group-hover:opacity-90 transition-opacity duration-500">{label}</span>
              </div>
            ))}
          </div>

          {/* Ligne 3 : petite + grande + petite */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5">
            <div className="md:col-span-1 h-[240px] md:h-[340px] rounded-2xl overflow-hidden relative group">
              <Image
                src="https://res.cloudinary.com/dyboo0v03/image/upload/v1781140059/t%C3%A9l%C3%A9charger_10_wsmzsw.jpg"
                alt="Inspiration coussins bouclé"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <div className="md:col-span-3 h-[240px] md:h-[340px] rounded-2xl overflow-hidden relative group">
              <Image
                src="https://res.cloudinary.com/dyboo0v03/image/upload/v1781140061/Gemini_Generated_Image_njcykmnjcykmnjcy_lsxyix.png"
                alt="Visualisation chambre Royalty Room"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <span className="absolute bottom-5 left-6 text-white text-xs tracking-[0.25em] uppercase opacity-80">Vision Royalty Room</span>
            </div>
            <div className="md:col-span-1 h-[240px] md:h-[340px] rounded-2xl overflow-hidden relative group">
              <Image
                src="https://res.cloudinary.com/dyboo0v03/image/upload/v1774053240/WhatsApp_Image_2026-03-21_at_01.29.16_vfqbkv.jpg"
                alt="Réalisation Royalty Room"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Section Valeurs */}
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
                  Matériaux nobles et savoir-faire artisanal pour un résultat de qualité
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
            Vous voulez du sur mesure? Parlons de vos aspirations et donnons vie à vos rêves.
          </p>
<a
  href="https://wa.me/221778719982?text=Bonjour%20Royalty%20Room%2C%20je%20souhaite%20discuter%20sur%20mon%20projet%20de%20meuble%20sur%20mesure."
  className="inline-flex items-center px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 transition-all duration-300 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 group"
>
  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.824L.057 23.143a.75.75 0 00.92.92l5.356-1.461A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 01-4.964-1.355l-.355-.212-3.688 1.005 1.017-3.62-.232-.373A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
  </svg>
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