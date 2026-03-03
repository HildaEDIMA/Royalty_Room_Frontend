"use client";

import { useState } from "react";
import { useCart } from "../cart-context";
import Image from "next/image";
import Link from "next/link";
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

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [step, setStep] = useState<Step>("info");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    country: "Sénégal", city: "", address: "", notes: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost(form.country, form.city);
  const total = subtotal + (shippingCost ?? 0);

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
    // TODO: remplacer par l'appel API PayDunia une fois les identifiants obtenus
    // const res = await fetch("/api/checkout", { method: "POST", ... });
    // const data = await res.json();
    // window.location.href = data.checkout_url;
    await new Promise(r => setTimeout(r, 800)); // simulation temporaire
    setOrderPlaced(true);
    clearCart();
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-4 pt-32">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 border border-rose-200 rounded-full flex items-center justify-center mx-auto mb-10">
            <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-extralight text-gray-900 mb-4 tracking-tight">Commande enregistrée</h1>
          <p className="text-sm text-gray-500 mb-2">Nous avons bien reçu votre commande.</p>
          <p className="text-sm text-gray-400 mb-12">Nous vous contacterons très prochainement pour confirmer les détails.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 rounded-full transition-all shadow-md hover:shadow-lg">
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  // ---- Panier vide ----
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center px-4 pt-32">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 border border-rose-100 rounded-full flex items-center justify-center mx-auto mb-10">
            <svg className="w-8 h-8 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-700 mb-3">Votre panier est vide</h2>
          <p className="text-sm text-gray-400 mb-10">Ajoutez des produits avant de valider votre commande.</p>
          <Link href="/produits" className="inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 rounded-full transition-all shadow-md">
            Voir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.3em] uppercase text-rose-400 mb-3 block">Finaliser</span>
          <h1 className="text-4xl md:text-5xl font-extralight text-gray-900 tracking-tight">Ma commande</h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-rose-300 via-pink-300 to-rose-300 mx-auto mt-5" />
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-14 max-w-md mx-auto">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-light transition-all duration-300 ${
                  i < currentIdx
                    ? "bg-gradient-to-br from-rose-400 to-pink-400 text-white"
                    : i === currentIdx
                    ? "bg-white border-2 border-rose-300 text-rose-400"
                    : "bg-white border border-rose-100 text-gray-300"
                }`}>
                  {i < currentIdx ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : s.num}
                </div>
                <span className={`text-xs mt-2 tracking-wider uppercase ${i === currentIdx ? "text-rose-400" : "text-gray-300"}`}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px flex-1 mb-6 ${i < currentIdx ? "bg-rose-300" : "bg-rose-100"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== FORM ===== */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-rose-100/60 p-6 md:p-10">

              {/* STEP 1 — Identité */}
              {step === "info" && (
                <div className="space-y-6">
                  <SectionTitle
                    icon={<svg className="w-5 h-5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                    title="Vos informations"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Prénom" error={errors.firstName}>
                      <input type="text" value={form.firstName} onChange={e => update("firstName", e.target.value)} placeholder="Marie" className={inputCls(errors.firstName)} />
                    </Field>
                    <Field label="Nom" error={errors.lastName}>
                      <input type="text" value={form.lastName} onChange={e => update("lastName", e.target.value)} placeholder="Diallo" className={inputCls(errors.lastName)} />
                    </Field>
                  </div>
                  <Field label="Téléphone" error={errors.phone}>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 bg-rose-50/60 border border-rose-100 border-r-0 rounded-l-xl text-sm text-gray-400">+</span>
                      <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="221 77 000 00 00" className={`${inputCls(errors.phone)} rounded-l-none`} />
                    </div>
                  </Field>
                  <Field label="Adresse email" error={errors.email}>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="marie@exemple.com" className={inputCls(errors.email)} />
                  </Field>
                </div>
              )}

              {/* STEP 2 — Livraison */}
              {step === "delivery" && (
                <div className="space-y-6">
                  <SectionTitle
                    icon={<svg className="w-5 h-5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
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
                    <div className="flex items-center justify-between px-5 py-3.5 border border-rose-100 rounded-xl bg-white">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <svg className="w-4 h-4 text-rose-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span>Expédition — {form.city}, {form.country}</span>
                      </div>
                      <span className="text-rose-400 font-light text-sm">{formatPrice(shippingCost)}</span>
                    </div>
                  )}

                  <Field label="Adresse complète" error={errors.address}>
                    <input type="text" value={form.address} onChange={e => update("address", e.target.value)} placeholder="Rue 10, Médina, Apt 3B" className={inputCls(errors.address)} />
                  </Field>
                  <Field label="Instructions de livraison (optionnel)">
                    <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Code d'accès, étage, point de repère..." rows={3} className={`${inputCls()} resize-none`} />
                  </Field>
                </div>
              )}

              {/* STEP 3 — Confirmation + info paiement */}
              {step === "confirm" && (
                <div className="space-y-8">
                  <SectionTitle
                    icon={<svg className="w-5 h-5 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                    title="Récapitulatif"
                  />

                  {/* Infos client & livraison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoBlock label="Identité">
                      <p>{form.firstName} {form.lastName}</p>
                      <p className="text-gray-400">{form.phone}</p>
                      <p className="text-gray-400">{form.email}</p>
                    </InfoBlock>
                    <InfoBlock label="Livraison">
                      <p>{form.address}</p>
                      <p className="text-gray-400">{form.city}, {form.country}</p>
                      {form.notes && <p className="text-gray-300 text-xs mt-1">{form.notes}</p>}
                    </InfoBlock>
                  </div>

                  {/* Bloc paiement PayDunia */}
                  <div className="border border-rose-100 rounded-2xl overflow-hidden">
                    {/* En-tête */}
                    <div className="flex items-center justify-between px-5 py-4 bg-rose-50/40 border-b border-rose-100">
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-xs tracking-[0.15em] uppercase text-gray-500">Paiement</span>
                      </div>
                      <span className="text-xs text-rose-400 border border-rose-200 px-2.5 py-0.5 rounded-full">Sécurisé</span>
                    </div>

                    {/* Corps */}
                    <div className="p-5 bg-white space-y-4">
                      <p className="text-sm font-light text-gray-600">
                        En confirmant votre commande, vous serez redirigé vers <strong className="font-normal text-gray-800">PayDunia</strong> pour finaliser le paiement.
                      </p>

                      {/* Moyens acceptés */}
                      <div>
                        <p className="text-xs text-gray-400 mb-3 tracking-wide">Moyens de paiement acceptés</p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Orange Money", color: "bg-orange-50 text-orange-400 border-orange-100" },
                            { label: "Wave", color: "bg-blue-50 text-blue-400 border-blue-100" },
                            { label: "Free Money", color: "bg-green-50 text-green-500 border-green-100" },
                            { label: "Visa", color: "bg-indigo-50 text-indigo-400 border-indigo-100" },
                            { label: "Mastercard", color: "bg-red-50 text-red-400 border-red-100" },
                          ].map(m => (
                            <span key={m.label} className={`text-xs px-3 py-1 rounded-full border font-light ${m.color}`}>
                              {m.label}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Note sécurité */}
                      <div className="flex items-start gap-2.5 pt-1">
                        <svg className="w-3.5 h-3.5 text-gray-300 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          Vos données bancaires ne transitent pas par nos serveurs. Le paiement est entièrement géré par PayDunia.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-rose-100">
                {step !== "info" ? (
                  <button
                    onClick={() => { const idx = steps.findIndex(s => s.id === step); setStep(steps[idx - 1].id); }}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                  </button>
                ) : (
                  <Link href="/produits" className="flex items-center gap-2 text-sm text-gray-400 hover:text-rose-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Continuer mes achats
                  </Link>
                )}

                {step !== "confirm" ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 rounded-full transition-all shadow-md hover:shadow-lg"
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
                    className="flex items-center gap-3 px-8 py-3.5 text-xs tracking-[0.2em] uppercase text-white bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-full transition-all shadow-md hover:shadow-lg"
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
                        Payer avec PayDunia
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ===== SUMMARY ===== */}
          <div className="space-y-5">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-rose-100/60 p-6">
              <h3 className="text-xs tracking-[0.25em] uppercase text-gray-400 mb-6">Récapitulatif</h3>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item._id}-${item.selectedColor?.name || "default"}`} className="flex gap-3">
                    {item.image && (
                      <div className="w-14 h-14 bg-rose-50 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-light text-gray-800 truncate">{item.name}</p>
                      {item.selectedColor && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.selectedColor.hex }} />
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

              <div className="mt-6 pt-5 border-t border-rose-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Sous-total</span>
                  <span className="text-gray-600">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400 items-center">
                  <span>Expédition</span>
                  {shippingCost === null
                    ? <span className="text-xs text-gray-300">Selon destination</span>
                    : <span className="text-gray-600">{formatPrice(shippingCost)}</span>
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
            <div className="bg-white/60 rounded-2xl border border-rose-100/40 p-5 space-y-4">
              {[
                {
                  label: "Paiement sécurisé via PayDunia",
                  icon: <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
                },
                {
                  label: "Livraison soignée",
                  icon: <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
                },
                {
                  label: "Support disponible",
                  icon: <svg className="w-4 h-4 text-rose-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
                },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-3">
                  {b.icon}
                  <span className="text-xs text-gray-400 tracking-wide">{b.label}</span>
                </div>
              ))}
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
    <div className="flex items-center gap-3 mb-2 pb-5 border-b border-rose-100">
      {icon}
      <h2 className="text-lg font-light text-gray-700 tracking-wide">{title}</h2>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs tracking-[0.15em] uppercase text-gray-400">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full px-4 py-3 rounded-xl border ${
    error ? "border-rose-300 bg-rose-50/30" : "border-rose-100 bg-white"
  } text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-rose-200 focus:ring-2 focus:ring-rose-50 transition-all`;
}

function InfoBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-4 border border-rose-100 rounded-2xl bg-white">
      <p className="text-xs tracking-[0.15em] uppercase text-gray-300 mb-2.5">{label}</p>
      <div className="text-sm text-gray-600 space-y-1 font-light">{children}</div>
    </div>
  );
}