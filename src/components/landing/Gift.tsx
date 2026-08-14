"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Gift as GiftIcon, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Gift() {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-[2.5rem] border border-gold/25 px-8 py-16 md:py-20 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/15 via-card to-transparent" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-gold/15 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-[#8a5a3a]/20 blur-[120px]" />

        <div className="relative">
          <span className="inline-flex w-16 h-16 rounded-full bg-gold/15 border border-gold/40 items-center justify-center mb-6">
            <GiftIcon className="w-8 h-8 text-gold" />
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-5 text-balance">{t("gift.title")}</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto mb-10">{t("gift.subtitle")}</p>
          <Link
            href="/produits"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold shadow-xl shadow-gold/20 hover:shadow-gold/35 transition-all hover:-translate-y-0.5"
          >
            {t("gift.cta")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}