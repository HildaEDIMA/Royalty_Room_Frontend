"use client";

import { useFavorites } from "./favorites-context";

export default function FavoritesButton() {
  const { favorites, setFavoritesSidebarOpen } = useFavorites();

  return (
    <button
      onClick={() => setFavoritesSidebarOpen(true)}
      className="relative p-2 text-gray-700 hover:text-rose-400 transition-colors duration-300"
      aria-label="Favoris"
    >
      <svg
        className="w-6 h-6"
        fill="none"
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
      {favorites.length > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-400 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {favorites.length}
        </span>
      )}
    </button>
  );
}