"use client";

import { useState } from "react";
import { useCart } from "../cart-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/api";

type Step = "info" | "delivery" | "confirm";

const COUNTRIES = [
  "Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Burkina Faso",
  "Togo", "Bénin", "Niger", "Mauritanie", "Cameroun",
  "Gabon", "Congo", "RDC", "France", "Belgique", "Suisse", "Maroc", "Autre"
];

function getShippingCost(country: string, city: string): number | null {
  if (!country || !city.trim()) return null;
  const c = country.toLowerCase();
  const v = city.trim().toLowerCase();
  if (c === "sénégal") return v === "dakar" ? 2000 : 4500;
  const afriqueOuest = ["côte d'ivoire", "mali", "guinée", "burkina faso", "togo", "bénin", "niger", "mauritanie"];
  if (afriqueOuest.includes(c)) return 8000;
  const afriqueCentrale = ["cameroun", "gabon", "congo", "rdc"];
  if (afriqueCentrale.includes(c)) return 12000;
  const europe = ["france", "belgique", "suisse", "maroc"];
  if (europe.includes(c)) return 25000;
  return 15000;
}


function getDeliveryDays(country: string, city: string): number {
  if (!country || !city.trim()) return 10;
  const c = country.toLowerCase();
  const v = city.trim().toLowerCase();
  if (c === "sénégal") return v === "dakar" ? 3 : 5;
  const afriqueOuest = ["côte d'ivoire", "mali", "guinée", "burkina faso", "togo", "bénin", "niger", "mauritanie"];
  if (afriqueOuest.includes(c)) return 7;
  const afriqueCentrale = ["cameroun", "gabon", "congo", "rdc"];
  if (afriqueCentrale.includes(c)) return 10;
  const europe = ["france", "belgique", "suisse", "maroc"];
  if (europe.includes(c)) return 14;
  return 10;
}

function getEstimatedDelivery(country: string, city: string): { label: string; days: number } {
  const days = getDeliveryDays(country, city);
  const from = new Date();
  from.setDate(from.getDate() + days);
  const to = new Date(from);
  to.setDate(to.getDate() + 2);
  const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  return { label: `${fmt(from)} – ${fmt(to)}`, days };
}

// Logo PayDunya reconstruit en SVG fidèle à leur identité visuelle
function PayDunyaLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 40" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Icône "P" stylisée */}
      <rect x="0" y="4" width="32" height="32" rx="6" fill="#F97316" />
      <text x="16" y="25" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill="white">P</text>
      {/* Texte "Pay" */}
      <text x="40" y="27" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="17" fill="#F97316">Pay</text>
      {/* Texte "Dunya" */}
      <text x="76" y="27" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="17" fill="#1f2937">Dunya</text>
    </svg>
  );
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("info");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    country: "Sénégal", city: "", address: "", notes: "",
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost(form.country, form.city);
  const total = subtotal + (shippingCost ?? 0);
  const delivery = getEstimatedDelivery(form.country, form.city);

  const update = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateInfo = () => {
    const e: Partial<typeof form> = {};
    if (!form.firstName.trim()) e.firstName = "Requis";
    if (!form.lastName.trim()) e.lastName = "Requis";
    if (!form.phone.trim()) e.phone = "Requis";
    if (!form.email.trim()) e.email = "Requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateDelivery = () => {
    const e: Partial<typeof form> = {};
    if (!form.city.trim()) e.city = "Requis";
    if (!form.address.trim()) e.address = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === "info" && validateInfo()) setStep("delivery");
    else if (step === "delivery" && validateDelivery()) setStep("confirm");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // TODO: remplacer par l'appel API PayDunia
    // const res = await fetch("/api/checkout", { method: "POST", body: JSON.stringify({ ...form, total }) });
    // const data = await res.json();
    // window.location.href = data.checkout_url; // PayDunia redirige ensuite vers /commande/succes

    // Simulation temporaire : on stocke les données de commande et on redirige
    await new Promise(r => setTimeout(r, 900));
    const orderData = {
      orderNumber: `RR-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      customer: { firstName: form.firstName, lastName: form.lastName, phone: form.phone, email: form.email },
      delivery: { address: form.address, city: form.city, country: form.country, notes: form.notes },
      items: items.map(i => ({ id: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, color: i.selectedColor?.name })),
      subtotal,
      shippingCost: shippingCost ?? 0,
      total,
      deliveryEstimate: delivery.label,
    };
    sessionStorage.setItem("royalty_order", JSON.stringify(orderData));
    clearCart();
    router.push("/commande/succes");
    setIsLoading(false);
  };

  const steps: { id: Step; label: string; num: number }[] = [
    { id: "info", label: "Identité", num: 1 },
    { id: "delivery", label: "Livraison", num: 2 },
    { id: "confirm", label: "Confirmation", num: 3 },
  ];
  const currentIdx = steps.findIndex(s => s.id === step);

  // ---- Commande confirmée ----
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-6 pt-24">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extralight text-gray-900 mb-3 tracking-tight">Commande enregistrée</h1>
          <p className="text-sm text-gray-500 mb-1">Nous avons bien reçu votre commande.</p>
          <p className="text-sm text-gray-400 mb-10">Nous vous contacterons très prochainement.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 rounded-full shadow-md">
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  // ---- Panier vide ----
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-6 pt-24">
        <div className="text-center max-w-sm w-full">
          <div className="w-16 h-16 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-7 h-7 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-700 mb-3">Panier vide</h2>
          <p className="text-sm text-gray-400 mb-10">Ajoutez des produits avant de commander.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 rounded-full shadow-md">
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">

      {/* ── BARRE MOBILE DU TOTAL (sticky en haut sous la nav) ── */}
      <div className="lg:hidden sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-rose-100 px-4 py-3">
        <button
          onClick={() => setSummaryOpen(v => !v)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-sm text-rose-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="font-light">Voir le récapitulatif</span>
            <svg className={`w-3.5 h-3.5 transition-transform ${summaryOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="text-right">
            <p className="text-lg font-light text-rose-400">{formatPrice(shippingCost === null ? subtotal : total)}</p>
            {shippingCost === null && <p className="text-xs text-gray-300">+ expédition</p>}
          </div>
        </button>

        {/* Panier déroulant mobile */}
        {summaryOpen && (
          <div className="mt-3 pt-3 border-t border-rose-100 space-y-3">
            {items.map(item => (
              <div key={`${item._id}-${item.selectedColor?.name || "default"}`} className="flex gap-3 items-center">
                {item.image && (
                  <div className="w-12 h-12 bg-rose-50 rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">×{item.quantity}</p>
                </div>
                <span className="text-sm text-rose-400 font-light flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-rose-100 space-y-1.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Sous-total</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Expédition</span>
                <span>{shippingCost === null ? "Selon destination" : formatPrice(shippingCost)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-24 lg:pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-2 block">Finaliser</span>
            <h1 className="text-3xl lg:text-5xl font-extralight text-gray-900 tracking-tight">Ma commande</h1>
            <div className="w-12 lg:w-16 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto mt-4" />
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-center mb-8 lg:mb-14 max-w-xs mx-auto">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-sm font-light transition-all duration-300 ${
                    i < currentIdx ? "bg-gradient-to-br from-rose-400 to-pink-400 text-white"
                    : i === currentIdx ? "bg-white border-2 border-rose-300 text-rose-400"
                    : "bg-white border border-rose-100 text-gray-300"
                  }`}>
                    {i < currentIdx ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.num}
                  </div>
                  <span className={`text-xs mt-1.5 tracking-wide ${i === currentIdx ? "text-rose-400" : "text-gray-300"}`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 mb-5 ${i < currentIdx ? "bg-rose-300" : "bg-rose-100"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* ===== FORM ===== */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-rose-100/60 p-5 md:p-8 lg:p-10">

                {/* STEP 1 — Identité */}
                {step === "info" && (
                  <div className="space-y-5">
                    <SectionTitle
                      icon={<svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                      title="Vos informations"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Prénom" error={errors.firstName}>
                        <input type="text" value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="Marie" className={inputCls(errors.firstName)} />
                      </Field>
                      <Field label="Nom" error={errors.lastName}>
                        <input type="text" value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Diallo" className={inputCls(errors.lastName)} />
                      </Field>
                    </div>
                    <Field label="Téléphone" error={errors.phone}>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-rose-50/60 border border-rose-100 border-r-0 rounded-l-xl text-sm text-gray-400">+</span>
                        <input type="tel" inputMode="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="221 77 000 00 00" className={`${inputCls(errors.phone)} rounded-l-none`} />
                      </div>
                    </Field>
                    <Field label="Adresse email" error={errors.email}>
                      <input type="email" inputMode="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="marie@exemple.com" className={inputCls(errors.email)} />
                    </Field>
                  </div>
                )}

                {/* STEP 2 — Livraison */}
                {step === "delivery" && (
                  <div className="space-y-5">
                    <SectionTitle
                      icon={<svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                      title="Adresse de livraison"
                    />
                    <Field label="Pays">
                      <select value={form.country} onChange={e => update("country", e.target.value)} className={inputCls()}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                    <Field label="Ville" error={errors.city}>
                      <input type="text" value={form.city} onChange={e => update("city", e.target.value)} placeholder="Dakar" className={inputCls(errors.city)} />
                    </Field>

                    {shippingCost !== null && (
                      <div className="border border-rose-100 rounded-xl bg-rose-50/20 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <svg className="w-4 h-4 text-rose-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <span className="text-xs text-gray-500">Expédition — {form.city}, {form.country}</span>
                          </div>
                          <span className="text-rose-400 font-light text-sm">{formatPrice(shippingCost)}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-rose-100 bg-white">
                          <svg className="w-3.5 h-3.5 text-rose-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-400">
                            Livraison estimée entre le <span className="text-gray-600">{delivery.label}</span>
                            <span className="text-gray-300"> ({delivery.days}–{delivery.days + 2} jours)</span>
                          </p>
                        </div>
                      </div>
                    )}

                    <Field label="Adresse complète" error={errors.address}>
                      <input type="text" value={form.address} onChange={e => update("address", e.target.value)} placeholder="Rue 10, Médina, Apt 3B" className={inputCls(errors.address)} />
                    </Field>
                    <Field label="Instructions (optionnel)">
                      <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Code d'accès, étage, point de repère..." rows={3} className={`${inputCls()} resize-none`} />
                    </Field>
                  </div>
                )}

                {/* STEP 3 — Confirmation */}
                {step === "confirm" && (
                  <div className="space-y-6">
                    <SectionTitle
                      icon={<svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                      title="Récapitulatif"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InfoBlock label="Identité">
                        <p>{form.firstName} {form.lastName}</p>
                        <p className="text-gray-400">{form.phone}</p>
                        <p className="text-gray-400">{form.email}</p>
                      </InfoBlock>
                      <InfoBlock label="Livraison">
                        <p>{form.address}</p>
                        <p className="text-gray-400">{form.city}, {form.country}</p>
                        {form.notes && <p className="text-gray-300 text-xs mt-1">{form.notes}</p>}
                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-rose-100">
                          <svg className="w-3 h-3 text-rose-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-400">Estimée : <span className="text-gray-600">{delivery.label}</span></p>
                        </div>
                      </InfoBlock>
                    </div>

                    {/* Bloc PayDunia */}
                    <div className="border border-rose-100 rounded-2xl overflow-hidden">
                      {/* Header du bloc */}
                      <div className="flex items-center justify-between px-4 py-3.5 bg-rose-50/40 border-b border-rose-100">
                        <PayDunyaLogo className="h-7 w-auto" />
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <svg className="w-3.5 h-3.5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Paiement sécurisé
                        </div>
                      </div>

                      {/* Corps */}
                      <div className="p-4 bg-white space-y-4">
                        <p className="text-sm font-light text-gray-600 leading-relaxed">
                          En confirmant, vous serez redirigé vers PayDunia pour finaliser votre paiement en toute sécurité.
                        </p>

                        {/* Moyens acceptés */}
                        <div>
                          <p className="text-xs text-gray-400 mb-2.5">Moyens acceptés</p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "Orange Money", bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-100" },
                              { label: "Wave", bg: "bg-blue-50", text: "text-blue-500", border: "border-blue-100" },
                              { label: "Free Money", bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
                              { label: "Visa", bg: "bg-indigo-50", text: "text-indigo-500", border: "border-indigo-100" },
                              { label: "Mastercard", bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
                            ].map(m => (
                              <span key={m.label} className={`text-xs px-2.5 py-1 rounded-full border font-light ${m.bg} ${m.text} ${m.border}`}>
                                {m.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-gray-300 leading-relaxed">
                          Vos données bancaires ne transitent pas par nos serveurs — le paiement est géré intégralement par PayDunia.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-rose-100">
                  {step !== "info" ? (
                    <button
                      onClick={() => { const idx = steps.findIndex(s => s.id === step); setStep(steps[idx - 1].id); }}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-rose-400 transition-colors py-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                      Retour
                    </button>
                  ) : (
                    <Link href="/produits" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-rose-400 transition-colors py-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="hidden sm:inline">Continuer mes achats</span>
                      <span className="sm:hidden">Retour</span>
                    </Link>
                  )}

                  {step !== "confirm" ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-6 sm:px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 rounded-full transition-all shadow-md hover:shadow-lg"
                    >
                      Suivant
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="flex items-center gap-2.5 px-5 sm:px-8 py-3.5 text-xs tracking-[0.15em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-full transition-all shadow-md hover:shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                          </svg>
                          Redirection...
                        </>
                      ) : (
                        <>
                          Payer avec
                          <PayDunyaLogo className="h-5 w-auto brightness-0 invert" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ===== SUMMARY DESKTOP ===== */}
            <div className="hidden lg:block order-1 lg:order-2 space-y-5">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-rose-100/60 p-6">
                <h3 className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-5">Récapitulatif</h3>

                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item._id}-${item.selectedColor?.name || "default"}`} className="flex gap-3">
                      {item.image && (
                        <div className="w-13 h-13 bg-rose-50 rounded-xl overflow-hidden flex-shrink-0" style={{ width: 52, height: 52 }}>
                          <Image src={item.image} alt={item.name} width={52} height={52} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-light text-gray-800 truncate">{item.name}</p>
                        {item.selectedColor && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{ backgroundColor: item.selectedColor.hex }} />
                            <span className="text-xs text-gray-400">{item.selectedColor.name}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-xs text-gray-300">×{item.quantity}</span>
                          <span className="text-sm text-rose-400 font-light">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-rose-100 space-y-2.5">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Sous-total</span>
                    <span className="text-gray-600">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 items-start">
                    <span>Expédition</span>
                    {shippingCost === null
                      ? <span className="text-xs text-gray-300">Selon destination</span>
                      : <div className="text-right">
                          <span className="text-gray-600">{formatPrice(shippingCost)}</span>
                          <p className="text-xs text-gray-300 mt-0.5">{delivery.label}</p>
                        </div>
                    }
                  </div>
                  <div className="flex justify-between pt-3 border-t border-rose-100 items-start">
                    <span className="text-sm text-gray-600">Total</span>
                    {shippingCost === null ? (
                      <div className="text-right">
                        <p className="text-xl font-light text-rose-400">{formatPrice(subtotal)}</p>
                        <p className="text-xs text-gray-300">+ expédition</p>
                      </div>
                    ) : (
                      <span className="text-xl font-light text-rose-400">{formatPrice(total)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Réassurances */}
              <div className="bg-white/60 rounded-2xl border border-rose-100/40 p-5 space-y-3.5">
                {[
                  { label: "Paiement sécurisé via PayDunia", icon: <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
                  { label: "Livraison soignée", icon: <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg> },
                  { label: "Support disponible", icon: <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2.5">
                    {b.icon}
                    <span className="text-xs text-gray-400">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-1 pb-4 border-b border-rose-100">
      {icon}
      <h2 className="text-base lg:text-lg font-light text-gray-700 tracking-wide">{title}</h2>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs tracking-[0.12em] uppercase text-gray-400">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full px-4 py-3.5 rounded-xl border ${
    error ? "border-rose-300 bg-rose-50/30" : "border-rose-100 bg-white"
  } text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-rose-200 focus:ring-2 focus:ring-rose-50 transition-all`;
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-4 border border-rose-100 rounded-xl bg-white">
      <p className="text-xs tracking-[0.12em] uppercase text-gray-300 mb-2">{label}</p>
      <div className="text-sm text-gray-600 space-y-0.5 font-light">{children}</div>
    </div>
  );
}