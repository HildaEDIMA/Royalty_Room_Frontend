export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Hero Section avec Vidéo */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
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
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-7xl md:text-8xl font-extralight text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
            Nous créons votre
            <br />
            <span className="font-light italic">espace de rêve</span>
          </h1>
        </div>
      </section>

      {/* Section Best-Sellers */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-4 block">Coups de cœur</span>
            <h2 className="text-6xl font-extralight text-gray-900 mb-6 tracking-tight">
              Nos Best-Sellers
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Produit 1 */}
            <div className="group">
              <div className="aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-white/40 group-hover:bg-white/20 transition-all duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-gray-500 tracking-[0.2em] uppercase">Canapé Oslo</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-light text-gray-900 mb-2">Canapé Oslo</h3>
                <p className="text-sm text-gray-600 mb-3">Design scandinave épuré</p>
                <p className="text-lg text-rose-400 font-light">À partir de 1 890 €</p>
              </div>
            </div>

            {/* Produit 2 */}
            <div className="group">
              <div className="aspect-[3/4] bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-white/40 group-hover:bg-white/20 transition-all duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-gray-500 tracking-[0.2em] uppercase">Table Aurore</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-light text-gray-900 mb-2">Table Aurore</h3>
                <p className="text-sm text-gray-600 mb-3">Élégance intemporelle</p>
                <p className="text-lg text-rose-400 font-light">À partir de 1 290 €</p>
              </div>
            </div>

            {/* Produit 3 */}
            <div className="group">
              <div className="aspect-[3/4] bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-white/40 group-hover:bg-white/20 transition-all duration-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-gray-500 tracking-[0.2em] uppercase">Fauteuil Luna</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-light text-gray-900 mb-2">Fauteuil Luna</h3>
                <p className="text-sm text-gray-600 mb-3">Confort et raffinement</p>
                <p className="text-lg text-rose-400 font-light">À partir de 790 €</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <a
              href="#produits"
              className="inline-flex items-center text-rose-400 hover:text-rose-500 transition-colors group"
            >
              <span className="tracking-wide">Voir toute la collection</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Section Valeurs avec design amélioré */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/40 to-rose-50/80"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-4 block">Ce qui nous distingue</span>
            <h2 className="text-6xl font-extralight text-gray-900 mb-6 tracking-tight">
              Notre signature
            </h2>
            <div className="w-20 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-rose-100/50">
                <div className="w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                  Sur Mesure
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Des créations uniques, pensées exclusivement pour vous et adaptées à votre style de vie unique
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-rose-100/50">
                <div className="w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                  Excellence
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Matériaux nobles et savoir-faire artisanal pour un résultat d'une qualité irréprochable
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-rose-100/50">
                <div className="w-20 h-20 mb-8 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-light text-gray-900 mb-4 tracking-wide">
                  Accompagnement
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Un suivi personnalisé et attentif à chaque étape de la réalisation de votre projet
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Galerie */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-4 block">Portfolio</span>
            <h2 className="text-6xl font-extralight text-gray-900 mb-6 tracking-tight leading-tight">
              Laissez-vous inspirer
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Découvrez comment nous transformons les espaces en véritables havres de paix et d'élégance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl overflow-hidden group relative">
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-sm text-gray-700 tracking-[0.2em] uppercase font-light">Salon</span>
              </div>
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl overflow-hidden group relative md:translate-y-12">
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-sm text-gray-700 tracking-[0.2em] uppercase font-light">Chambre</span>
              </div>
            </div>
            <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl overflow-hidden group relative">
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="text-sm text-gray-700 tracking-[0.2em] uppercase font-light">Cuisine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section CTA Premium */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-100"></div>
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-extralight text-gray-900 mb-8 tracking-tight">
            Créons ensemble
          </h2>
          <p className="text-xl text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto">
            Votre projet mérite une attention exceptionnelle. Parlons de vos aspirations et donnons vie à vos rêves.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-12 py-5 text-sm tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 transition-all duration-300 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 group"
          >
            <span>Commencer votre projet</span>
            <svg className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer élégant */}
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
                © 2026 — Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}