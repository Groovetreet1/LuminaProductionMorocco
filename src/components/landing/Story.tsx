"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Story() {
  const t = useTranslations();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gold/5 rounded-[2.5rem] blur-2xl" />
          <div className="relative rounded-[2rem] overflow-hidden border border-line">
            <img
              src="/products/ambre-nocturne.svg"
              alt="Atelier LUMINA"
              className="w-full aspect-[4/5] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-4 sm:right-6 glass rounded-2xl px-6 py-4 glow-gold">
            <p className="font-display text-3xl text-gradient-gold">100%</p>
            <p className="text-xs text-muted tracking-widest uppercase">Cire naturelle</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase mb-3 block">
            {t("story.badge")}
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-6 leading-tight text-balance">
            {t("story.title")}
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-5">{t("story.p1")}</p>
          <p className="text-muted text-lg leading-relaxed mb-8">{t("story.p2")}</p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            {t("story.cta")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}