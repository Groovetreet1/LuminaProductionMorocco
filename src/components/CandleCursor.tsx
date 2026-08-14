"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue } from "framer-motion";

type Puff = {
  id: number;
  x: number;
  y: number;
  drift: number;
  size: number;
  dur: number;
  rot: number;
};

const finePointerMql = typeof window !== "undefined" ? window.matchMedia("(pointer: fine)") : null;

function subscribeFinePointer(cb: () => void) {
  finePointerMql?.addEventListener("change", cb);
  return () => finePointerMql?.removeEventListener("change", cb);
}

function getFinePointer() {
  return finePointerMql?.matches ?? false;
}

function getFinePointerSSR() {
  return false;
}

function CandleSvg() {
  return (
    <svg width="30" height="40" viewBox="0 0 30 40" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="candleFlameG" cx="50%" cy="70%" r="65%">
          <stop offset="0%" stopColor="#fff6d8" />
          <stop offset="45%" stopColor="#ffd98a" />
          <stop offset="100%" stopColor="#ff9d3c" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="11" r="11" fill="url(#candleFlameG)" opacity="0.3" className="animate-flicker" />
      <g className="animate-flicker" style={{ transformOrigin: "15px 22px" }}>
        <path
          d="M15 3 C18 7 20 10 20 14 C20 17.5 17.8 19.5 15 19.5 C12.2 19.5 10 17.5 10 14 C10 10 12 7 15 3 Z"
          fill="url(#candleFlameG)"
        />
        <path
          d="M15 7 C16.4 9.5 17.3 11 17.3 13.3 C17.3 15.6 16.2 17 15 17 C13.8 17 12.7 15.6 12.7 13.3 C12.7 11 13.6 9.5 15 7 Z"
          fill="#fff7e0"
          opacity="0.9"
        />
      </g>
      <rect x="14.2" y="19" width="1.6" height="4.5" rx="0.8" fill="#4a3a28" />
      <rect x="7" y="23" width="16" height="11" rx="2.5" fill="#f2e8d5" />
      <rect x="7" y="29" width="16" height="2.6" rx="1.3" fill="#d4af37" />
      <rect x="7" y="23" width="16" height="1.2" rx="0.6" fill="#ffffff" opacity="0.5" />
      <ellipse cx="15" cy="40" rx="9" ry="1.6" fill="#000000" opacity="0.35" />
    </svg>
  );
}

export default function CandleCursor() {
  const pathname = usePathname();
  const enabled = useSyncExternalStore(subscribeFinePointer, getFinePointer, getFinePointerSSR);
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const idRef = useRef(0);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const active = enabled && !pathname.includes("/admin");

  useEffect(() => {
    const root = document.documentElement;
    if (active) {
      root.classList.add("candle-cursor-active");
      return () => root.classList.remove("candle-cursor-active");
    }
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active, mx, my]);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const id = idRef.current++;
      setPuffs((prev) => [
        ...prev.slice(-16),
        {
          id,
          x: mx.get() + (Math.random() * 6 - 3),
          y: my.get() - 16,
          drift: Math.random() * 24 - 12,
          size: 5 + Math.random() * 5,
          dur: 1.1 + Math.random() * 0.9,
          rot: Math.random() * 70 - 35,
        },
      ]);
      setTimeout(() => setPuffs((prev) => prev.filter((p) => p.id !== id)), 2400);
    }, 90);
    return () => clearInterval(interval);
  }, [active, mx, my]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true">
      {puffs.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-zinc-300/45 blur-[3px]"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          initial={{ opacity: 0.55, scale: 0.4, x: 0, y: 0, rotate: 0 }}
          animate={{ opacity: 0, scale: 1.7, x: p.drift, y: -54, rotate: p.rot }}
          transition={{ duration: p.dur, ease: "easeOut" }}
        />
      ))}

      <motion.div style={{ x: mx, y: my }} className="absolute">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <CandleSvg />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}