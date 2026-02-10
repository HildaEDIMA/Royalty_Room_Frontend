"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton Menu Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-rose-50 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Mobile */}
      <div
        className={`fixed right-0 top-0 h-full w-[280px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-rose-100 flex items-center justify-between">
            <h2 className="text-lg font-light text-gray-900">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-rose-50 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 p-6">
            <div className="space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-400 rounded-lg transition-all"
              >
                Accueil
              </Link>
              
              <Link
                href="/produits"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-rose-50 hover:text-rose-400 rounded-lg transition-all font-medium"
              >
                Nos Produits
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-rose-100">
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 px-6 text-center text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 rounded-full transition-all shadow-lg"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </>
  );
}