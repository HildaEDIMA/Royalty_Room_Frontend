"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedColor?: {
    name: string;
    hex: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string, colorName?: string) => void;
  updateQuantity: (id: string, quantity: number, colorName?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Vérifier si le produit avec la même couleur existe déjà
      const existingItemIndex = prevItems.findIndex(
        i => i._id === item._id && 
        (i.selectedColor?.name === item.selectedColor?.name)
      );

      if (existingItemIndex > -1) {
        // Augmenter la quantité
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      } else {
        // Ajouter un nouveau produit
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    // Ouvrir le panier
    setIsOpen(true);
  };

  const removeFromCart = (id: string, colorName?: string) => {
    setItems(prevItems => 
      prevItems.filter(item => 
        !(item._id === id && 
          (colorName === undefined || item.selectedColor?.name === colorName))
      )
    );
  };

  const updateQuantity = (id: string, quantity: number, colorName?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, colorName);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item._id === id && 
        (colorName === undefined || item.selectedColor?.name === colorName)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}