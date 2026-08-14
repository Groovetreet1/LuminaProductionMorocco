"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { HandHeart, Leaf, Flame, Truck } from "lucide-react";

const icons = [HandHeart, Leaf, Flame, Truck];

export default function Features() {
  const t = useTranslations();
  const items = t.raw("features.items") as { title: string; desc: string }[];

  return (
    <section className="border-y border-line bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-4 text-balance">{t("features.title")}</h2>
          <p className="text-muted max-w-2xl mx-auto">{t("features.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group border border-line rounded-3xl p-7 bg-card/60 hover:border-gold/40 hover:bg-card transition-all hover:-translate-y-1"
              >
                <span className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/25 flex items-center justify-center mb-5 group-hover:bg-gold/20 transition-colors">
                  <Icon className="w-6 h-6 text-gold" />
                </span>
                <h3 className="font-display text-lg text-cream mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}