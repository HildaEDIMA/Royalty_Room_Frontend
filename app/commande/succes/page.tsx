"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/api";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
}

interface OrderData {
  orderNumber: string;
  date: string;
  customer: { firstName: string; lastName: string; phone: string; email: string };
  delivery: { address: string; city: string; country: string; notes?: string };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  deliveryEstimate: string;
}

export default function SuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("royalty_order");
    if (raw) {
      setOrder(JSON.parse(raw));
    }
  }, []);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !order) return;
    setDownloading(true);

    try {
      // Import dynamique pour éviter le SSR
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Si la facture dépasse une page, on découpe
      const pageHeight = pdf.internal.pageSize.getHeight();
      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      } else {
        let yOffset = 0;
        let remainingHeight = pdfHeight;
        while (remainingHeight > 0) {
          pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, pdfHeight);
          remainingHeight -= pageHeight;
          yOffset += pageHeight;
          if (remainingHeight > 0) pdf.addPage();
        }
      }

      pdf.save(`Facture-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error("Erreur génération PDF:", err);
    }

    setDownloading(false);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-6 pt-24">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-7 h-7 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-700 mb-3">Aucune commande trouvée</h2>
          <p className="text-sm text-gray-400 mb-8">La session a peut-être expiré.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 rounded-full shadow-md">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.date).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Message de confirmation */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extralight text-gray-900 mb-2 tracking-tight">Paiement confirmé</h1>
          <p className="text-sm text-gray-400">Votre facture est disponible ci-dessous.</p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-between mb-6 gap-3">
          <Link
            href="/produits"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-rose-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Continuer mes achats
          </Link>

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2.5 px-6 py-3 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 disabled:opacity-60 rounded-full transition-all shadow-md hover:shadow-lg"
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Génération...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Télécharger PDF
              </>
            )}
          </button>
        </div>

        {/* ── FACTURE ── */}
        <div
          ref={invoiceRef}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {/* En-tête de facture */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              {/* Logo / Marque */}
              <div>
                <h2 style={{ fontFamily: "Georgia, serif", letterSpacing: "0.08em" }} className="text-2xl font-light text-gray-900 uppercase tracking-widest">
                  Royalty Room
                </h2>
                <p className="text-xs text-gray-400 mt-1 tracking-wide">Meubles d'exception</p>
              </div>

              {/* Titre FACTURE */}
              <div className="text-right">
                <p className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-1">Facture</p>
                <p className="text-xl font-light text-gray-800">{order.orderNumber}</p>
                <p className="text-xs text-gray-400 mt-1">{orderDate}</p>
              </div>
            </div>
          </div>

          {/* Infos client & livraison */}
          <div className="grid grid-cols-2 gap-6 px-8 py-6 border-b border-gray-100 bg-gray-50/40">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2.5">Facturer à</p>
              <p className="text-sm text-gray-800 font-medium">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="text-sm text-gray-500">{order.customer.email}</p>
              <p className="text-sm text-gray-500">{order.customer.phone}</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2.5">Livrer à</p>
              <p className="text-sm text-gray-800">{order.delivery.address}</p>
              <p className="text-sm text-gray-500">{order.delivery.city}, {order.delivery.country}</p>
              {order.delivery.notes && <p className="text-xs text-gray-400 mt-1">{order.delivery.notes}</p>}
              <div className="flex items-center gap-1.5 mt-2">
                <svg className="w-3 h-3 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-400">Livraison estimée : <span className="text-gray-600">{order.deliveryEstimate}</span></p>
              </div>
            </div>
          </div>

          {/* Tableau des articles */}
          <div className="px-8 py-6 border-b border-gray-100">
            {/* En-tête tableau */}
            <div className="grid grid-cols-12 gap-2 pb-2 border-b border-gray-100 mb-3">
              <p className="col-span-6 text-xs tracking-[0.15em] uppercase text-gray-400">Article</p>
              <p className="col-span-2 text-xs tracking-[0.15em] uppercase text-gray-400 text-center">Qté</p>
              <p className="col-span-2 text-xs tracking-[0.15em] uppercase text-gray-400 text-right">P.U.</p>
              <p className="col-span-2 text-xs tracking-[0.15em] uppercase text-gray-400 text-right">Total</p>
            </div>

            {/* Lignes articles */}
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center py-1">
                  <div className="col-span-6">
                    <p className="text-sm text-gray-800">{item.name}</p>
                    {item.color && <p className="text-xs text-gray-400 mt-0.5">Coloris : {item.color}</p>}
                  </div>
                  <p className="col-span-2 text-sm text-gray-600 text-center">{item.quantity}</p>
                  <p className="col-span-2 text-sm text-gray-600 text-right">{formatPrice(item.price)}</p>
                  <p className="col-span-2 text-sm text-gray-800 text-right">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totaux */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="ml-auto w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Expédition</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base font-medium pt-3 border-t border-gray-200">
                <span className="text-gray-800">Total TTC</span>
                <span className="text-rose-400 text-lg font-light">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 pt-1">
                <span>Méthode de paiement</span>
                <span>PayDunia</span>
              </div>
            </div>
          </div>

          {/* Pied de facture */}
          <div className="px-8 py-5 bg-gray-50/40">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                  Merci pour votre confiance. Pour toute question concernant votre commande, contactez-nous via WhatsApp.
                </p>
                <a href="https://wa.me/221778719982" className="text-xs text-rose-400 mt-1 block">+221 77 871 99 82</a>
              </div>
              <div className="text-right">
                <p className="text-xs tracking-widest uppercase text-gray-300">Royalty Room</p>
                <div className="w-12 h-0.5 bg-rose-200 mt-1.5 ml-auto" />
              </div>
            </div>
          </div>
        </div>

        {/* Note bas de page */}
        <p className="text-center text-xs text-gray-300 mt-5">
          Ce document fait office de facture pour votre commande {order.orderNumber}.
        </p>
      </div>
    </div>
  );
}