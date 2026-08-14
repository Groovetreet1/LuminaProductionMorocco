"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const EMBERS = [
  { left: 22, delay: 0, dur: 7, size: 4 },
  { left: 38, delay: 2.4, dur: 8, size: 3 },
  { left: 54, delay: 1.2, dur: 7.5, size: 5 },
  { left: 68, delay: 3.6, dur: 8.5, size: 3 },
  { left: 80, delay: 0.8, dur: 7, size: 4 },
  { left: 30, delay: 5, dur: 9, size: 3 },
  { left: 60, delay: 6.4, dur: 8, size: 4 },
];

export default function HeroCandle() {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 120, damping: 20 });
  const sy = useSpring(py, { stiffness: 120, damping: 20 });
  const rotX = useTransform(sy, [0, 1], [8, -8]);
  const rotY = useTransform(sx, [0, 1], [-10, 10]);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ perspective: 1200 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      <div className="absolute w-[78%] h-[78%] rounded-full bg-gold/20 blur-[90px] animate-flicker pointer-events-none" />

      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="relative w-[84%] max-w-md aspect-[4/5]"
      >
        {/* warm yellow light that turns on with the candle */}
        <motion.div
          className="absolute -inset-12 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,205,95,0.6), rgba(255,175,70,0.22) 45%, rgba(255,160,60,0.05) 70%, transparent 82%)",
          }}
          animate={{ opacity: [0, 1, 0.78, 1, 0.85, 1], scale: [0.55, 1, 0.9, 1, 0.94, 1] }}
          transition={{ duration: 10, repeat: Infinity, times: [0, 0.09, 0.4, 0.58, 0.8, 1] }}
        />

        {/* main frame */}
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-gold/40 glow-gold shadow-2xl shadow-black/70 bg-black">
          {/* Ken Burns slow zoom — cinematic, hides the loop seam */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: [1.04, 1.16, 1.04] }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          >
            <video
              src="/candle/hero-candle-green.mp4"
              poster="/candle/hero-candle-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* cinematic vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_22%,rgba(9,8,6,0.92)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-background/15" />

          {/* warm light beam */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[150%] h-48 bg-gradient-to-b from-gold/25 via-gold/5 to-transparent blur-2xl pointer-events-none" />

          {/* rising embers */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {EMBERS.map((e, i) => (
              <motion.span
                key={i}
                className="absolute bottom-0 rounded-full bg-gold"
                style={{ left: `${e.left}%`, width: e.size, height: e.size }}
                animate={{ y: [0, -140], opacity: [0, 1, 0] }}
                transition={{ duration: e.dur, repeat: Infinity, delay: e.delay, ease: "easeOut" }}
              />
            ))}
          </div>

          {/* top sheen line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

          {/* badge with animated shine */}
          <motion.span className="absolute bottom-5 left-1/2 -translate-x-1/2 overflow-hidden text-[11px] tracking-[0.35em] uppercase text-gold/95 bg-background/45 backdrop-blur px-5 py-1.5 rounded-full border border-gold/30">
            <span className="relative z-10">LUMINA · Artisanal</span>
            <motion.span
              className="absolute inset-y-0 w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              animate={{ x: ["-150%", "250%"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.span>
        </div>

        {/* corner accents */}
        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 border-t-2 border-l-2 border-gold/70 rounded-tl-xl" />
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 border-t-2 border-r-2 border-gold/70 rounded-tr-xl" />
        <span className="absolute -bottom-1.5 -left-1.5 w-5 h-5 border-b-2 border-l-2 border-gold/70 rounded-bl-xl" />
        <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 border-b-2 border-r-2 border-gold/70 rounded-br-xl" />
      </motion.div>
    </motion.div>
  );
}