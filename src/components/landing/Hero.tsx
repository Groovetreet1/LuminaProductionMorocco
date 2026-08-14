"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronDown, ArrowRight } from "lucide-react";
import HeroCandle from "./HeroCandle";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero() {
  const t = useTranslations();

  return (
    <section className="relative min-h-svh flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-gold/10 blur-[140px]" />
        <div className="absolute -bottom-52 -left-40 w-[38rem] h-[38rem] rounded-full bg-[#8a5a3a]/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0b0a08_100%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center pt-28 pb-16 w-full">
        <div className="relative z-10 text-center lg:text-start">
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-xs tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            {t("hero.badge")}
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.1] text-cream mb-6 text-balance"
          >
            {t("hero.title1")} <span className="text-gradient-gold italic">{t("hero.title2")}</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-muted text-sm sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 text-balance"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center lg:justify-start"
          >
            <Link
              href="/produits"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold shadow-lg shadow-gold/25 hover:shadow-gold/40 transition-all hover:-translate-y-0.5 sm:w-auto w-full"
            >
              {t("hero.cta1")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors sm:w-auto w-full"
            >
              {t("hero.cta2")}
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-[420px] sm:h-[520px] lg:h-[640px]"
        >
          <div className="absolute inset-0 rounded-full bg-gold/10 blur-[100px] animate-flicker" />
          <HeroCandle />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted text-xs tracking-widest uppercase"
      >
        {t("hero.scroll")}
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
