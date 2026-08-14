"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

export type ProductCardData = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  colorHex: string;
  stock: number;
  featured: boolean;
  scentFr: string;
  scentAr: string;
};

export default function ProductCard({ product, index = 0 }: { product: ProductCardData; index?: number }) {
  const t = useTranslations();
  const locale = useLocale();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const name = locale === "ar" ? product.nameAr : product.nameFr;
  const scent = locale === "ar" ? product.scentAr : product.scentFr;
  const out = product.stock <= 0;

  const handleAdd = () => {
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

  return (
    <div className="group relative border border-line rounded-3xl overflow-hidden bg-card/60 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gold/10 flex flex-col">
      <Link href={`/produit/${product.slug}`} className="relative block overflow-hidden">
        <img
          src={product.image}
          alt={name}
          loading="lazy"
          className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-background text-[11px] font-bold tracking-wider uppercase">
            {t("collection.featured")}
          </span>
        )}
        {product.compareAtPrice && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/90 text-white text-[11px] font-bold tracking-wider uppercase">
            {t("collection.sale")}
          </span>
        )}
        {out && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 rounded-full border border-cream/40 text-cream text-sm">
              {t("collection.soldOut")}
            </span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-[11px] text-gold uppercase tracking-widest mb-1">{scent}</span>
        <Link
          href={`/produit/${product.slug}`}
          className="font-display text-lg text-cream hover:text-gold transition-colors leading-snug"
        >
          {name}
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-gold font-bold text-lg">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-muted text-sm line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={out}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              added
                ? "bg-emerald-500 text-white"
                : out
                ? "bg-white/5 text-muted cursor-not-allowed"
                : "bg-gradient-to-r from-gold to-gold-light text-background hover:scale-110"
            }`}
            aria-label={t("collection.addToCart")}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
