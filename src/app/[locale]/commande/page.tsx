"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCart, cartSubtotal } from "@/store/cart";
import { Link, useRouter } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { Banknote, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { getUtm } from "@/lib/utm";
import CitySelect from "@/components/checkout/CitySelect";

export default function CheckoutPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { items, clear } = useCart();
  const subtotal = cartSubtotal(items);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    notes: "",
  });
  const [payment, setPayment] = useState<"COD" | "STRIPE">("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, paymentMethod: payment, items, utm: getUtm() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? t("checkout.error"));
        setLoading(false);
        return;
      }
      if (payment === "STRIPE" && data.url) {
        window.location.href = data.url;
        return;
      }
      clear();
      router.push(`/commande/${data.number}`);
    } catch {
      setError(t("checkout.error"));
      setLoading(false);
    }
  };

  const name = (item: { nameFr: string; nameAr: string }) =>
    locale === "ar" ? item.nameAr : item.nameFr;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-3xl text-cream">{t("cart.empty")}</h1>
        <Link href="/produits" className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold">
          {t("cart.emptyCta")}
        </Link>
      </div>
    );
  }

  const input = "field";
  const label = "block text-sm text-muted mb-1.5";

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-24 min-h-screen">
      <h1 className="font-display text-4xl md:text-5xl text-cream mb-10">{t("checkout.title")}</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
        <div className="flex flex-col gap-8">
          <section className="border border-line rounded-3xl p-6 bg-card/40">
            <h2 className="font-display text-xl text-cream mb-5">{t("checkout.contact")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={label}>{t("checkout.name")} *</label>
                <input required className={input} value={form.name} onChange={set("name")} />
              </div>
              <div>
                <label className={label}>{t("checkout.phone")} *</label>
                <input required type="tel" className={input} value={form.phone} onChange={set("phone")} placeholder="06 XX XX XX XX" />
              </div>
              <div>
                <label className={label}>{t("checkout.email")}</label>
                <input type="email" className={input} value={form.email} onChange={set("email")} />
              </div>
            </div>
          </section>

          <section className="border border-line rounded-3xl p-6 bg-card/40">
            <h2 className="font-display text-xl text-cream mb-5">{t("checkout.shipping")}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>{t("checkout.city")} *</label>
                <CitySelect value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>{t("checkout.address")} *</label>
                <input required className={input} value={form.address} onChange={set("address")} />
              </div>
              <div className="sm:col-span-2">
                <label className={label}>{t("checkout.notes")}</label>
                <textarea rows={2} className={input} value={form.notes} onChange={set("notes")} />
              </div>
            </div>
          </section>

          <section className="border border-line rounded-3xl p-6 bg-card/40">
            <h2 className="font-display text-xl text-cream mb-5">{t("checkout.payment")}</h2>
            <div className="flex flex-col gap-3">
              <label
                className={`flex items-start gap-4 border rounded-2xl p-4 cursor-pointer transition-all ${
                  payment === "COD" ? "border-gold bg-gold/5" : "border-line hover:border-gold/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "COD"}
                  onChange={() => setPayment("COD")}
                  className="mt-1 accent-gold"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-cream font-semibold">
                    <Banknote className="w-4 h-4 text-gold" /> {t("checkout.cod")}
                  </span>
                  <span className="text-sm text-muted">{t("checkout.codDesc")}</span>
                </span>
              </label>
              <label
                className={`flex items-start gap-4 border rounded-2xl p-4 cursor-pointer transition-all ${
                  payment === "STRIPE" ? "border-gold bg-gold/5" : "border-line hover:border-gold/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === "STRIPE"}
                  onChange={() => setPayment("STRIPE")}
                  className="mt-1 accent-gold"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-2 text-cream font-semibold">
                    <CreditCard className="w-4 h-4 text-gold" /> {t("checkout.card")}
                  </span>
                  <span className="text-sm text-muted">{t("checkout.cardDesc")}</span>
                </span>
              </label>
            </div>
            {payment === "STRIPE" && (
              <p className="flex items-center gap-2 text-xs text-emerald-400/80 mt-3">
                <ShieldCheck className="w-4 h-4" /> {t("checkout.redirecting")}
              </p>
            )}
          </section>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>
          )}
        </div>

        <aside className="border border-line rounded-3xl p-6 bg-card/40 lg:sticky lg:top-28">
          <h2 className="font-display text-xl text-cream mb-5">{t("checkout.summary")}</h2>
          <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-5 pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} alt={name(item)} className="w-12 h-14 rounded-lg object-cover border border-line" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cream truncate">{name(item)}</p>
                  <p className="text-xs text-muted">x{item.quantity}</p>
                </div>
                <span className="text-sm text-gold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-line pt-4 mb-2">
            <span className="text-muted text-sm">{t("cart.subtotal")}</span>
            <span className="text-cream font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span className="text-muted text-sm">{t("cart.shipping")}</span>
            <span className="text-emerald-400 text-sm">{t("cart.shippingFree")}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-4 mb-6">
            <span className="font-display text-lg text-cream">{t("cart.total")}</span>
            <span className="font-display text-2xl text-gold">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> {t("checkout.processing")}
              </>
            ) : (
              t("checkout.placeOrder")
            )}
          </button>
        </aside>
      </form>
    </div>
  );
}
