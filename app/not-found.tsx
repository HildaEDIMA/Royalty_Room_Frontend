import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <svg 
            className="w-32 h-32 mx-auto text-rose-200" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h1 className="text-7xl font-extralight text-gray-900 mb-4 tracking-tight">
          404
        </h1>
        
        <h2 className="text-3xl font-light text-gray-800 mb-6">
          Page introuvable
        </h2>
        
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas ou n'est plus disponible.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full hover:from-rose-500 hover:to-pink-500 transition-all hover:shadow-lg group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour à l'accueil</span>
          </Link>
          
          <Link
            href="/produits"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-rose-300 text-rose-600 rounded-full hover:bg-rose-50 transition-all group"
          >
            <span>Voir tous les produits</span>
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}