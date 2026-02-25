const API_URL = 'https://backend-5faw.onrender.com/api';

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

// Utility: fetch with timeout + retries (handles Render cold starts)
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeoutMs = 15000
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (response.ok) return response;

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Retry on server errors (5xx)
      if (attempt === retries) {
        throw new Error(`HTTP ${response.status}: ${response.statusText} after ${retries} attempts`);
      }

      console.warn(`Attempt ${attempt} failed with status ${response.status}, retrying...`);
    } catch (error: unknown) {
      clearTimeout(timer);

      const isAbort = error instanceof Error && error.name === 'AbortError';
      if (isAbort) {
        console.warn(`Attempt ${attempt} timed out after ${timeoutMs}ms`);
      }

      if (attempt === retries) throw error;

      // Exponential backoff: 1s, 2s, 4s...
      await new Promise((res) => setTimeout(res, 1000 * 2 ** (attempt - 1)));
    }
  }

  throw new Error('fetchWithRetry: unreachable');
}

// Fonctions pour les catégories
export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/categories`, {
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur API getCategories:', error);
    return [];
  }
}

export async function getCategory(id: string): Promise<Category | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/categories/${id}`, {
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur API getCategory:', error);
    return null;
  }
}

// Fonctions pour les produits
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/products`, {
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur API getProducts:', error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });
    return await response.json();
  } catch (error) {
    console.error('Erreur API getProduct:', error);
    return null;
  }
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const products = await getProducts();
    return products.filter((product) => {
      const catId =
        typeof product.category === 'string'
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