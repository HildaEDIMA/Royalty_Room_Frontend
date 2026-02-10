"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  availability: boolean;
  category?: {
    _id: string;
    name: string;
  };
}

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  isFavoritesSidebarOpen: boolean;
  setFavoritesSidebarOpen: (open: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isFavoritesSidebarOpen, setFavoritesSidebarOpen] = useState(false);

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
      }
    }
  }, []);

  // Sauvegarder les favoris dans localStorage à chaque modification
  useEffect(() => {
    if (favorites.length > 0 || localStorage.getItem('favorites')) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      // Vérifier si le produit n'est pas déjà dans les favoris
      if (prev.some(item => item._id === product._id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites((prev) => prev.filter(item => item._id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item._id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        isFavoritesSidebarOpen,
        setFavoritesSidebarOpen,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites doit être utilisé à l\'intérieur de FavoritesProvider');
  }
  return context;
}