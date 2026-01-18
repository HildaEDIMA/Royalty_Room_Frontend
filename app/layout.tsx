import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Espace Rêve - Créateur d'intérieurs",
  description: "Nous créons votre espace de rêve",
};

function Navigation() {
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
                <Link href="#mobilier" className="block px-6 py-3 text-sm text-gray-600 hover:text-rose-400 hover:bg-rose-50/50 transition-all">
                  Mobilier de salon
                </Link>
                <Link href="#chambres" className="block px-6 py-3 text-sm text-gray-600 hover:text-rose-400 hover:bg-rose-50/50 transition-all">
                  Chambres à coucher
                </Link>
                <Link href="#cuisine" className="block px-6 py-3 text-sm text-gray-600 hover:text-rose-400 hover:bg-rose-50/50 transition-all">
                  Cuisine & Salle à manger
                </Link>
                <Link href="#decoration" className="block px-6 py-3 text-sm text-gray-600 hover:text-rose-400 hover:bg-rose-50/50 transition-all">
                  Décoration
                </Link>
                <Link href="#luminaires" className="block px-6 py-3 text-sm text-gray-600 hover:text-rose-400 hover:bg-rose-50/50 transition-all">
                  Luminaires
                </Link>
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

export default function RootLayout({
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