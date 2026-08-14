"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { MOROCCO_CITIES } from "@/data/moroccoCities";

export default function CitySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOROCCO_CITIES;
    return MOROCCO_CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [query]);

  const commit = (city: string) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) commit(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setHighlighted(0);
          setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setHighlighted(0);
        }}
        onKeyDown={onKeyDown}
        placeholder="Ville…"
        className="field !pl-10 !pr-9 text-[16px]"
        autoComplete="off"
      />
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

      {open && (
        <ul className="absolute z-40 mt-2 w-full max-h-56 overflow-y-auto overscroll-contain rounded-2xl border border-line bg-card shadow-2xl shadow-black/50 py-1">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-sm text-muted">Aucune ville — vous pouvez la taper</li>
          )}
          {filtered.map((city, i) => (
            <li key={city}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(city);
                }}
                onMouseEnter={() => setHighlighted(i)}
                className={`w-full text-start px-4 py-2.5 text-sm transition-colors ${
                  i === highlighted ? "bg-gold/10 text-gold" : "text-cream hover:bg-white/5"
                }`}
              >
                {city}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}