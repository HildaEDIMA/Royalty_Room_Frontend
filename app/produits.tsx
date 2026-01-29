import { useEffect, useState } from "react";

interface Produit {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  images: string[];
  couleurs?: string[];
  availability: boolean;
}

export default function Produits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remplace par ton URL backend sur Railway
    const API_URL = "https://royalty-backend-production.up.railway.app/api/products";

    fetch(API_URL)
      .then((res) => res.json())
      .then((data: Produit[]) => {
        setProduits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur fetch produits :", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-light text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 py-20 px-6">
      <h1 className="text-5xl font-extralight text-gray-900 mb-12 text-center">
        Nos Produits
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {produits.map((produit) => (
          <div
            key={produit._id}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative h-80">
              <img
                src={produit.images[0]}
                alt={produit.nom}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-light text-gray-900 mb-2">{produit.nom}</h2>
              <p className="text-gray-600 mb-4">{produit.description}</p>
              <p className="text-lg text-rose-400 font-light mb-2">
                {produit.prix.toLocaleString()} FCFA
              </p>
              {produit.couleurs && produit.couleurs.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {produit.couleurs.map((c, i) => (
                    <span
                      key={i}
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
