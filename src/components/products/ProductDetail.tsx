"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useCart } from "@/store/cart";
import { Link, useRouter } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, Zap, Weight, Flame, Truck, Leaf, Sparkles, ArrowLeft } from "lucide-react";

export type ProductDetailData = {
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
  weightGr: number;
  burnHours: number;
};

export default function ProductDetail({ product }: { product: ProductDetailData }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { add, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const name = locale === "ar" ? product.nameAr : product.nameFr;
  const scent = locale === "ar" ? product.scentAr : product.scentFr;
  const description = locale === "ar" ? product.descriptionAr : product.descriptionFr;
  const out = product.stock <= 0;

  const addToCart = () => {
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
    setTimeout(() => setAdded(false), 1500);
  };

  const buyNow = () => {
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
    router.push("/commande");
  };

  const specs = [
    { icon: Weight, label: t("product.weight"), value: `${product.weightGr}g` },
    { icon: Flame, label: t("product.burn"), value: `${product.burnHours}h` },
    { icon: Truck, label: t("cart.shipping"), value: t("cart.shippingFree") },
    { icon: Leaf, label: t("product.scent"), value: scent },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-24">
      <Link
        href="/produits"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {t("product.back")}
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="relative rounded-[2rem] overflow-hidden border border-line bg-card/40 group">
          <img src={product.image} alt={name} className="w-full aspect-[4/5] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          {product.compareAtPrice && (
            <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-bold">
              -{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
            </span>
          )}
        </div>

        <div className="lg:pt-4">
          <span className="text-gold text-xs tracking-[0.3em] uppercase">{scent}</span>
          <h1 className="font-display text-4xl md:text-5xl text-cream mt-2 mb-4">{name}</h1>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl text-gold font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {specs.map((s) => (
              <div key={s.label} className="border border-line rounded-2xl px-4 py-3 bg-card/40">
                <div className="flex items-center gap-2 text-muted text-xs mb-1">
                  <s.icon className="w-3.5 h-3.5 text-gold" />
                  {s.label}
                </div>
                <p className="text-cream text-sm font-medium">{s.value}</p>
              </div>
            ))}
          </div>

          {out ? (
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-8">
              {t("product.outOfStock")}
            </p>
          ) : product.stock <= 5 ? (
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              {t("product.lowStock", { count: product.stock })}
            </p>
          ) : (
            <p className="inline-flex items-center gap-2 text-sm text-emerald-400/90 mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {t("product.stock")}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <button
              onClick={addToCart}
              disabled={out}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border transition-all font-semibold ${
                out
                  ? "border-line text-muted cursor-not-allowed"
                  : added
                  ? "border-emerald-500 text-emerald-400"
                  : "border-gold/50 text-gold hover:bg-gold/10"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              {added ? t("collection.added") : t("product.addToCart")}
            </button>
            <button
              onClick={buyNow}
              disabled={out}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold transition-all ${
                out
                  ? "bg-white/5 text-muted cursor-not-allowed"
                  : "bg-gradient-to-r from-gold to-gold-light text-background hover:opacity-90 shadow-lg shadow-gold/20"
              }`}
            >
              <Zap className="w-4 h-4" />
              {t("product.buyNow")}
            </button>
          </div>

          <div className="border-t border-line pt-8">
            <h2 className="font-display text-xl text-cream mb-3">{t("product.description")}</h2>
            <p className="text-muted leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
