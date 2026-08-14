"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const HOURS = 24;
const MS = 1000 * 60 * 60 * HOURS;

function getDeadline(slug: string): number {
  if (typeof window === "undefined") return Date.now() + MS;
  const key = `lumina-ad-deadline-${slug}`;
  const saved = parseInt(localStorage.getItem(key) ?? "", 10);
  const now = Date.now();
  if (!isNaN(saved) && saved > now) return saved;
  const deadline = now + MS;
  localStorage.setItem(key, String(deadline));
  return deadline;
}

export default function Countdown({ slug }: { slug: string }) {
  const t = useTranslations();
  const [left, setLeft] = useState(MS);

  useEffect(() => {
    const deadline = getDeadline(slug);
    const tick = () => setLeft(Math.max(0, deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [slug]);

  const h = Math.floor(left / (1000 * 60 * 60));
  const m = Math.floor((left % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((left % (1000 * 60)) / 1000);

  const cell = "flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-background/80 border border-gold/30";
  const num = "font-display text-2xl sm:text-3xl text-gold tabular-nums";
  const lbl = "text-[10px] uppercase tracking-widest text-muted mt-0.5";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs sm:text-sm text-cream/80 tracking-wide">
        ⏳ {t("ad.offerEnds")}
      </p>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={cell}>
          <span className={num}>{String(h).padStart(2, "0")}</span>
          <span className={lbl}>{t("ad.hours")}</span>
        </div>
        <span className="font-display text-2xl text-gold/60">:</span>
        <div className={cell}>
          <span className={num}>{String(m).padStart(2, "0")}</span>
          <span className={lbl}>{t("ad.minutes")}</span>
        </div>
        <span className="font-display text-2xl text-gold/60">:</span>
        <div className={cell}>
          <span className={num}>{String(s).padStart(2, "0")}</span>
          <span className={lbl}>{t("ad.seconds")}</span>
        </div>
      </div>
    </div>
  );
}
