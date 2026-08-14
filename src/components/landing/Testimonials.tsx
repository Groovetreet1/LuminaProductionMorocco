"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  const t = useTranslations();
  const items = t.raw("testimonials.items") as { name: string; city: string; text: string }[];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  const item = items[index];

  return (
    <section className="border-y border-line bg-card/30 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-3 text-balance">{t("testimonials.title")}</h2>
          <p className="text-muted mb-12">{t("testimonials.subtitle")}</p>
        </motion.div>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-5"
            >
              <Quote className="w-10 h-10 text-gold/40 rotate-180" />
              <blockquote className="font-display text-2xl md:text-3xl text-cream/90 leading-relaxed max-w-3xl">
                « {item.text} »
              </blockquote>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <figcaption className="text-sm text-muted">
                <span className="text-cream font-semibold">{item.name}</span> — {item.city}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-gold" : "w-2 bg-line hover:bg-gold/40"
              }`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}