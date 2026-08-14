"use client";

import { useTranslations } from "next-intl";
import { useCart, cartSubtotal } from "@/store/cart";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const { items, remove, setQuantity } = useCart();
  const subtotal = cartSubtotal(items);

  const name = (item: { nameFr: string; nameAr: string }) =>
    locale === "ar" ? item.nameAr : item.nameFr;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-4">
        <span className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
          <ShoppingBag className="w-9 h-9 text-muted" />
        </span>
        <h1 className="font-display text-3xl text-cream">{t("cart.empty")}</h1>
        <Link
          href="/produits"
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
        >
          {t("cart.emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 pb-24 min-h-screen">
      <h1 className="font-display text-4xl md:text-5xl text-cream mb-10">{t("cart.title")}</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border border-line rounded-2xl p-4 bg-card/40 hover:border-gold/30 transition-colors"
            >
              <img src={item.image} alt={name(item)} className="w-24 h-28 rounded-xl object-cover border border-line" />
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/produit/${item.slug}`}
                    className="font-display text-lg text-cream hover:text-gold transition-colors"
                  >
                    {name(item)}
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-muted hover:text-red-400 transition-colors"
                    aria-label={t("cart.remove")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gold mt-1">{formatPrice(item.price)}</span>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-3 border border-line rounded-full px-3 py-1.5">
                    <button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="-">
                      <Minus className="w-4 h-4 text-cream" />
                    </button>
                    <span className="text-sm text-cream w-6 text-center">{item.quantity}</span>
                    <button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="+">
                      <Plus className="w-4 h-4 text-cream" />
                    </button>
                  </div>
                  <span className="text-gold font-bold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-line rounded-3xl p-6 bg-card/40 lg:sticky lg:top-28">
          <div className="flex justify-between mb-3">
            <span className="text-muted">{t("cart.subtotal")}</span>
            <span className="text-cream font-semibold">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-muted">{t("cart.shipping")}</span>
            <span className="text-emerald-400 text-sm">{t("cart.shippingFree")}</span>
          </div>
          {subtotal < 500 && (
            <p className="text-xs text-muted bg-white/5 rounded-lg px-3 py-2 mb-3">{t("cart.freeShippingNote")}</p>
          )}
          <div className="flex justify-between border-t border-line pt-4 mb-6">
            <span className="font-display text-lg text-cream">{t("cart.total")}</span>
            <span className="font-display text-2xl text-gold">{formatPrice(subtotal)}</span>
          </div>
          <Link
            href="/commande"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
          >
            {t("cart.checkout")}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
