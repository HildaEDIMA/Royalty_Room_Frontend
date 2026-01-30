import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Royalty room - meubles d'exception",
  description: "Coiffeuses vanity - lits - dressings - chaises, nous créons votre espace de rêve",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

async function Navigation() {
  const categories = await getCategories();
  
  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg z-50 border-b border-rose-100">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={180}
            height={60}
            className="h-16 w-auto"
            priority
          />
        </Link>
        
        <div className="flex items-center gap-14">
          <Link 
            href="/" 
            className="text-sm tracking-wider uppercase text-gray-700 hover:text-rose-400 transition-colors duration-300"
          >
            Accueil
          </Link>
          
          <div className="group relative">
            <button className="text-sm tracking-wider uppercase text-gray-700 hover:text-rose-400 transition-colors duration-300">
              Nos Produits
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-rose-100">
              <div className="py-3">
                <Link 
                  href="/produits" 
                  className="block px-6 py-3 text-sm font-medium text-gray-700 hover:text-rose-400 hover:bg-rose-50/50 transition-all"
                >
                  Tous les produits
                </Link>
                <div className="h-px bg-rose-100 my-2"></div>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link 
                      key={category._id}
                      href={`/categories/${category._id}`} 
                      className="block px-6 py-3 text-sm text-gray-600 hover:text-rose-400 hover:bg-rose-50/50 transition-all"
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-6 py-3 text-sm text-gray-400">Chargement...</p>
                )}
              </div>
            </div>
          </div>
          
          <Link 
            href="#contact" 
            className="text-sm tracking-wider uppercase px-8 py-3 text-white bg-rose-300 hover:bg-rose-400 transition-all duration-300 rounded-full shadow-sm hover:shadow-md"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}