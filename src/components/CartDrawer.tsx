"use client";

import { useTranslations } from "next-intl";
import { useCart, cartSubtotal } from "@/store/cart";
import { Link } from "@/i18n/navigation";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useLocale } from "next-intl";

export default function CartDrawer() {
  const t = useTranslations();
  const locale = useLocale();
  const { items, isOpen, closeCart, remove, setQuantity } = useCart();
  const subtotal = cartSubtotal(items);

  const name = (item: { nameFr: string; nameAr: string }) =>
    locale === "ar" ? item.nameAr : item.nameFr;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-card border-l border-line transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display text-xl text-cream flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" /> {t("cart.title")}
          </h2>
          <button onClick={closeCart} className="p-2 hover:text-gold transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted" />
            </span>
            <p className="text-muted">{t("cart.empty")}</p>
            <Link
              href="/produits"
              onClick={closeCart}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t("cart.emptyCta")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border border-line rounded-2xl p-3">
                  <img
                    src={item.image}
                    alt={name(item)}
                    className="w-20 h-24 rounded-xl object-cover border border-line"
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/produit/${item.slug}`}
                        onClick={closeCart}
                        className="text-sm text-cream hover:text-gold transition-colors"
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
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-line rounded-full px-2 py-1">
                        <button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="-">
                          <Minus className="w-3.5 h-3.5 text-cream" />
                        </button>
                        <span className="text-sm text-cream w-5 text-center">{item.quantity}</span>
                        <button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="+">
                          <Plus className="w-3.5 h-3.5 text-cream" />
                        </button>
                      </div>
                      <span className="text-sm text-gold font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{t("cart.subtotal")}</span>
                <span className="font-display text-xl text-gold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{t("cart.shipping")}</span>
                <span>{t("cart.shippingFree")}</span>
              </div>
              {subtotal < 500 && (
                <p className="text-xs text-muted bg-white/5 rounded-lg px-3 py-2">
                  {t("cart.freeShippingNote")}
                </p>
              )}
              <Link
                href="/commande"
                onClick={closeCart}
                className="text-center px-6 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
              >
                {t("cart.checkout")}
              </Link>
              <button
                onClick={closeCart}
                className="text-center text-sm text-muted hover:text-cream transition-colors"
              >
                {t("cart.continue")}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
