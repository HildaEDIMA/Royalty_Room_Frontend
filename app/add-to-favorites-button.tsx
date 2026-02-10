"use client";

import { useFavorites } from "./favorites-context";
import type { Product } from "./favorites-context";

interface AddToFavoritesButtonProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function AddToFavoritesButton({ 
  product, 
  size = "md",
  showText = false 
}: AddToFavoritesButtonProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const isInFavorites = isFavorite(product._id);

  const handleToggleFavorite = () => {
    if (isInFavorites) {
      removeFromFavorites(product._id);
    } else {
      addToFavorites(product);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  if (showText) {
    return (
      <button
        onClick={handleToggleFavorite}
        className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 rounded-full ${
          isInFavorites
            ? "text-rose-500 bg-rose-50 border-2 border-rose-200 hover:bg-rose-100"
            : "text-gray-700 bg-white border-2 border-gray-200 hover:border-rose-200 hover:text-rose-400"
        }`}
      >
        <svg
          className={iconSizeClasses[size]}
          fill={isInFavorites ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{isInFavorites ? "Dans mes favoris" : "Ajouter aux favoris"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 group ${
        isInFavorites
          ? "bg-rose-100 text-rose-500 hover:bg-rose-200"
          : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-rose-50 hover:text-rose-500 border border-gray-200 hover:border-rose-200"
      }`}
      title={isInFavorites ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        className={`${iconSizeClasses[size]} transition-transform duration-300 ${
          isInFavorites ? "scale-110" : "group-hover:scale-110"
        }`}
        fill={isInFavorites ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}