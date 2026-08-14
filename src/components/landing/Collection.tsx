"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ProductCard, { type ProductCardData } from "./ProductCard";
import { Link } from "@/i18n/navigation";

export default function Collection({ products }: { products: ProductCardData[] }) {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <span className="text-gold text-xs tracking-[0.3em] uppercase mb-3 block">
          {t("collection.badge")}
        </span>
        <h2 className="font-display text-4xl md:text-5xl text-cream mb-4 text-balance">{t("collection.title")}</h2>
        <p className="text-muted max-w-2xl mx-auto">{t("collection.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
          >
            <ProductCard product={p} index={i} />
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
        >
          {t("collection.viewAll")}
        </Link>
      </div>
    </section>
  );
}