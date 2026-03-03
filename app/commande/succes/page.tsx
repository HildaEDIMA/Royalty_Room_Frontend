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
    if (raw) setOrder(JSON.parse(raw));
  }, []);

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !order) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();

      if (pdfHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      } else {
        let yOffset = 0;
        let remaining = pdfHeight;
        while (remaining > 0) {
          pdf.addImage(imgData, "PNG", 0, -yOffset, pdfWidth, pdfHeight);
          remaining -= pageHeight;
          yOffset += pageHeight;
          if (remaining > 0) pdf.addPage();
        }
      }

      pdf.save(`Facture-${order.orderNumber}.pdf`);
    } catch (err) {
      console.error("Erreur PDF:", err);
    }
    setDownloading(false);
  };

  // ── Page vide ──────────────────────────────────────────────────
  if (!order) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fff1f2, #ffffff, #fdf2f8)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", maxWidth: 360 }}>
          <div style={{ width: 64, height: 64, border: "1px solid #fecdd3", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#fda4af" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 300, color: "#374151", marginBottom: "0.75rem" }}>Aucune commande trouvée</h2>
          <p style={{ fontSize: "0.875rem", color: "#9ca3af", marginBottom: "2.5rem" }}>La session a peut-être expiré.</p>
          <Link href="/produits" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 2rem", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", background: "linear-gradient(to right, #fb7185, #f472b6)", borderRadius: 999, textDecoration: "none" }}>
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
    <>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>


      {/* ── Page ── */}
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #fff1f2, #ffffff, #fdf2f8)", paddingTop: "6rem", paddingBottom: "4rem" }}>
        <div style={{ maxWidth: 672, margin: "0 auto", padding: "0 1rem" }}>

          {/* Confirmation */}
          <div className="no-print" style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: 56, height: 56, border: "1px solid #fecdd3", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#fb7185" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 200, color: "#111827", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>Paiement confirmé</h1>
            <p style={{ fontSize: "0.875rem", color: "#9ca3af" }}>Votre facture est disponible ci-dessous.</p>
          </div>

          {/* Boutons */}
          <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", gap: "0.75rem" }}>
            <Link
              href="/produits"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#9ca3af", textDecoration: "none" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Continuer mes achats
            </Link>

            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.75rem 1.5rem", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", background: "linear-gradient(to right, #fb7185, #f472b6)", border: "none", borderRadius: 999, cursor: downloading ? "not-allowed" : "pointer", opacity: downloading ? 0.6 : 1, boxShadow: "0 4px 12px rgba(251,113,133,0.3)" }}
            >
              {downloading ? (
                <>
                  <svg width="16" height="16" style={{ animation: "spin 1s linear infinite" }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }} />
                    <path fill="currentColor" style={{ opacity: 0.75 }} d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                  Génération...
                </>
              ) : (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger PDF
                </>
              )}
            </button>
          </div>

          {/* ══════════════════════════════════════════
              FACTURE — tout en style inline pour éviter
              les couleurs lab() de Tailwind à l'impression
          ══════════════════════════════════════════ */}
          <div
            id="invoice"
            ref={invoiceRef}
            style={{
              background: "#ffffff",
              borderRadius: 16,
              border: "1px solid #f3f4f6",
              overflow: "hidden",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >

            {/* En-tête */}
            <div style={{ padding: "2rem 2rem 1.5rem", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "1.375rem", fontWeight: 300, color: "#111827", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Royalty Room
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.25rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Meubles d'exception
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#fb7185", marginBottom: "0.25rem" }}>
                    Facture
                  </div>
                  <div style={{ fontSize: "1.125rem", fontWeight: 300, color: "#1f2937" }}>{order.orderNumber}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>{orderDate}</div>
                </div>
              </div>
            </div>

            {/* Trait rose */}
            <div style={{ height: 2, background: "linear-gradient(to right, #fecdd3, #fbcfe8, #fecdd3)" }} />

            {/* Infos client & livraison */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", padding: "1.5rem 2rem", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "0.625rem" }}>Facturer à</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1f2937" }}>{order.customer.firstName} {order.customer.lastName}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>{order.customer.email}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{order.customer.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "0.625rem" }}>Livrer à</div>
                <div style={{ fontSize: "0.875rem", color: "#1f2937" }}>{order.delivery.address}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{order.delivery.city}, {order.delivery.country}</div>
                {order.delivery.notes && (
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.25rem" }}>{order.delivery.notes}</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.625rem", paddingTop: "0.625rem", borderTop: "1px solid #f3f4f6" }}>
                  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="#fda4af" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                    Livraison estimée : <span style={{ color: "#4b5563" }}>{order.deliveryEstimate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau articles */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f3f4f6" }}>
              {/* En-tête colonnes */}
              <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr 1fr", gap: "0.5rem", paddingBottom: "0.625rem", borderBottom: "1px solid #f3f4f6", marginBottom: "0.5rem" }}>
                {["Article", "Qté", "P.U.", "Total"].map((h, i) => (
                  <div key={h} style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#9ca3af", textAlign: i === 0 ? "left" : "right" }}>
                    {i === 1 ? <span style={{ display: "block", textAlign: "center" }}>{h}</span> : h}
                  </div>
                ))}
              </div>

              {/* Lignes */}
              <div>
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "3fr 1fr 1fr 1fr",
                      gap: "0.5rem",
                      alignItems: "center",
                      padding: "0.75rem 0",
                      borderBottom: i < order.items.length - 1 ? "1px solid #f9fafb" : "none",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.875rem", color: "#1f2937" }}>{item.name}</div>
                      {item.color && <div style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.2rem" }}>Coloris : {item.color}</div>}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "center" }}>{item.quantity}</div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "right" }}>{formatPrice(item.price)}</div>
                    <div style={{ fontSize: "0.875rem", color: "#1f2937", textAlign: "right" }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totaux */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ marginLeft: "auto", maxWidth: 280 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  <span>Sous-total</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  <span>Expédition</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 500, paddingTop: "0.75rem", marginTop: "0.25rem", borderTop: "1px solid #e5e7eb" }}>
                  <span style={{ color: "#1f2937" }}>Total TTC</span>
                  <span style={{ color: "#fb7185", fontSize: "1.125rem", fontWeight: 300 }}>{formatPrice(order.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.5rem" }}>
                  <span>Méthode de paiement</span>
                  <span>PayDunia</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", marginTop: "0.25rem" }}>
                  <span style={{ color: "#9ca3af" }}>Statut</span>
                  <span style={{ color: "#22c55e" }}>Payé</span>
                </div>
              </div>
            </div>

            {/* Pied */}
            <div style={{ padding: "1.25rem 2rem", background: "#fafafa", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.7rem", color: "#9ca3af", lineHeight: 1.6, maxWidth: 280 }}>
                  Merci pour votre confiance. Pour toute question concernant votre commande, contactez-nous via WhatsApp.
                </p>
                <a href="https://wa.me/221778719982" style={{ fontSize: "0.7rem", color: "#fb7185", marginTop: "0.25rem", display: "block", textDecoration: "none" }}>
                  +221 77 871 99 82
                </a>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#d1d5db" }}>Royalty Room</div>
                <div style={{ width: 40, height: 1, background: "#fecdd3", marginTop: 6, marginLeft: "auto" }} />
              </div>
            </div>

          </div>

          {/* Note bas */}
          <p className="no-print" style={{ textAlign: "center", fontSize: "0.7rem", color: "#d1d5db", marginTop: "1.25rem" }}>
            Ce document fait office de facture pour votre commande {order.orderNumber}.
          </p>

        </div>
      </div>
    </>
  );
}