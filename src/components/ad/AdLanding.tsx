"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { captureUtm } from "@/lib/utm";
import Countdown from "./Countdown";
import {
  ShoppingBag,
  Zap,
  Star,
  Truck,
  Banknote,
  ShieldCheck,
  Flame,
  Leaf,
  Gift,
  ChevronDown,
} from "lucide-react";

export type AdProduct = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  colorHex: string;
  stock: number;
  scentFr: string;
  scentAr: string;
  descriptionFr: string;
  descriptionAr: string;
  burnHours: number;
};

export default function AdLanding({ product }: { product: AdProduct }) {
  const t = useTranslations();
  const locale = useLocale();
  const { add, openCart } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    captureUtm();
  }, []);

  const name = locale === "ar" ? product.nameAr : product.nameFr;
  const scent = locale === "ar" ? product.scentAr : product.scentFr;
  const description = locale === "ar" ? product.descriptionAr : product.descriptionFr;
  const trust = t.raw("ad.trust") as string[];
  const why = t.raw("ad.why") as { title: string; desc: string }[];
  const reviews = t.raw("ad.reviews") as { name: string; city: string; text: string }[];
  const faq = t.raw("ad.faq") as { q: string; a: string }[];

  const out = product.stock <= 0;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  const stockPct = Math.min(100, Math.round((product.stock / 50) * 100));

  const order = () => {
    if (out) return;
    add({
      id: product.id,
      slug: product.slug,
      nameFr: product.nameFr,
      nameAr: product.nameAr,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: product.image,
      colorHex: product.colorHex,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
    openCart();
  };

  const whyIcons = [Flame, Leaf, Star, Gift];

  return (
    <div className="pt-16 md:pt-20 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      {/* Strip */}
      <div className="bg-gradient-to-r from-red-700/80 via-red-600/80 to-red-700/80 text-white text-center text-xs sm:text-sm font-semibold py-2.5 px-4">
        🔥 {t("ad.strip")}
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-md px-4 pt-6">
          <div className="relative rounded-[2rem] overflow-hidden border border-gold/25 glow-gold">
            <img src={product.image} alt={name} className="w-full aspect-[4/5] object-cover" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold shadow-lg">
                -{discount}%
              </span>
            )}
            {product.compareAtPrice && (
              <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-background/85 backdrop-blur border border-gold/30 text-gold font-bold text-sm">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <div className="text-center mt-6">
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gold fill-gold" />
              ))}
              <span className="text-xs text-muted ml-1">4.9/5</span>
            </div>
            <p className="text-gold text-xs tracking-[0.3em] uppercase mb-1">{scent}</p>
            <h1 className="font-display text-3xl sm:text-4xl text-cream leading-tight mb-3">{name}</h1>
            <p className="text-muted text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-4">
              {description}
            </p>

            <div className="flex items-baseline justify-center gap-3 mb-5">
              <span className="font-display text-4xl text-gold font-bold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            <Countdown slug={product.slug} />

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-red-400 font-semibold animate-pulse">
                  🔥 {t("ad.stockLeft", { count: Math.max(0, product.stock) })}
                </span>
                <span className="text-muted">{100 - stockPct}% vendus</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/5 border border-line overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000"
                  style={{ width: `${100 - stockPct}%` }}
                />
              </div>
            </div>

            <button
              onClick={order}
              disabled={out}
              className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold transition-all ${
                out
                  ? "bg-white/5 text-muted cursor-not-allowed"
                  : added
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-gold to-gold-light text-background shadow-xl shadow-gold/25 hover:shadow-gold/40 hover:-translate-y-0.5"
              }`}
            >
              {added ? (
                "✓ " + t("collection.added")
              ) : (
                <>
                  <Zap className="w-5 h-5" /> {t("ad.orderNow")}
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6">
            {trust.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 text-center border border-line rounded-2xl px-2 py-3 bg-card/40">
                {i === 0 ? (
                  <Banknote className="w-5 h-5 text-gold" />
                ) : i === 1 ? (
                  <Truck className="w-5 h-5 text-gold" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-gold" />
                )}
                <span className="text-[11px] text-muted leading-tight">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 text-muted">
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mt-12">
        <div className="mx-auto max-w-md px-4">
          <h2 className="font-display text-2xl text-cream text-center mb-1">{t("ad.whyTitle")}</h2>
          <p className="text-sm text-muted text-center mb-6">{t("ad.whySubtitle")}</p>
          <div className="grid grid-cols-2 gap-3">
            {why.map((item, i) => {
              const Icon = whyIcons[i % whyIcons.length];
              return (
                <div key={i} className="border border-line rounded-2xl p-4 bg-card/40">
                  <span className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-gold" />
                  </span>
                  <h3 className="text-cream font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-12">
        <div className="mx-auto max-w-md px-4">
          <h2 className="font-display text-2xl text-cream text-center mb-6">⭐ {t("ad.reviewsTitle")}</h2>
          <div className="flex flex-col gap-3">
            {reviews.map((r, i) => (
              <div key={i} className="border border-line rounded-2xl p-4 bg-card/40">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-sm text-cream/90 leading-relaxed mb-3">« {r.text} »</p>
                <p className="text-xs text-muted">
                  <span className="text-gold font-semibold">{r.name}</span> — {r.city} ✓
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <div className="mx-auto max-w-md px-4">
          <h2 className="font-display text-2xl text-cream text-center mb-6">{t("ad.faqTitle")}</h2>
          <div className="flex flex-col gap-3">
            {faq.map((f, i) => (
              <div key={i} className="border border-line rounded-2xl p-4 bg-card/40">
                <h3 className="text-cream font-semibold text-sm mb-1.5">{f.q}</h3>
                <p className="text-xs text-muted leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-12">
        <div className="mx-auto max-w-md px-4">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 px-6 py-10 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/15 via-card to-transparent" />
            <div className="absolute -top-20 left-1/3 w-72 h-72 rounded-full bg-gold/15 blur-[100px]" />
            <div className="relative">
              <h2 className="font-display text-2xl text-cream mb-2">{t("ad.finalTitle")}</h2>
              <p className="text-sm text-muted mb-5">{t("ad.finalSubtitle")}</p>
              <Countdown slug={product.slug} />
              <button
                onClick={order}
                disabled={out}
                className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold ${
                  out
                    ? "bg-white/5 text-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-gold to-gold-light text-background shadow-xl shadow-gold/25 hover:shadow-gold/40 hover:-translate-y-0.5 transition-all"
                }`}
              >
                <ShoppingBag className="w-5 h-5" /> {t("ad.orderNow")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA (mobile) */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="glass border-t border-gold/20 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted line-through">{product.compareAtPrice ? formatPrice(product.compareAtPrice) : ""}</span>
            <span className="font-display text-2xl text-gold font-bold leading-none">{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={order}
            disabled={out}
            className={`flex-1 max-w-[220px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-base font-bold ${
              out
                ? "bg-white/5 text-muted cursor-not-allowed"
                : "bg-gradient-to-r from-gold to-gold-light text-background shadow-lg shadow-gold/25"
            }`}
          >
            <Zap className="w-4 h-4" /> {t("ad.orderNow")}
          </button>
        </div>
      </div>
    </div>
  );
}