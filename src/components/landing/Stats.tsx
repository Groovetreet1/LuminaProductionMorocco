"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1800, bounce: 0 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}+`;
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref} className="font-display text-4xl md:text-5xl text-gradient-gold">
      0{suffix}
    </span>
  );
}

export default function Stats() {
  const t = useTranslations();

  const stats = [
    { to: 5000, label: t("stats.candles") },
    { to: 1200, label: t("stats.clients") },
    { to: 40, label: t("stats.hours") },
    { to: 4.9, label: t("stats.rating"), decimal: true },
  ];

  return (
    <section className="border-y border-line bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            className="flex flex-col items-center gap-1"
          >
            <Counter to={s.to} suffix="" />
            <span className="text-sm text-muted">{s.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
