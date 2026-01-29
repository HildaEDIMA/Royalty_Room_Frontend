const API_URL = 'https://backend-production-7365.up.railway.app/api';

export interface Category {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Color {
  name: string;
  hex: string;
}

export interface ProductImage {
  url: string;
  public_id?: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string | Category;
  images: ProductImage[];
  price: number;
  description?: string;
  availableColors?: Color[];
  availability: boolean;
  createdAt: string;
  updatedAt: string;
}

// Fonctions pour les catégories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur API getCategories:', error);
    return [];
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération de la catégorie');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur API getCategory:', error);
    return null;
  }
}

// Fonctions pour les produits
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des produits');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur API getProducts:', error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du produit');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur API getProduct:', error);
    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const products = await getProducts();
    return products.filter(product => {
      const catId = typeof product.category === 'string' 
        ? product.category 
        : product.category._id;
      return catId === categoryId;
    });
  } catch (error) {
    console.error('Erreur API getProductsByCategory:', error);
    return [];
  }
}

// Fonction utilitaire pour formater le prix
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);
}