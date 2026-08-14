"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyOrderNumber({ number }: { number: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(number);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = number;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="flex items-center gap-2">
      <span className="text-gold font-bold font-mono">{number}</span>
      <button
        onClick={copy}
        aria-label="Copier le numéro de commande"
        title="Copier le numéro"
        className={`p-1.5 rounded-full border transition-colors ${
          copied
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            : "border-line text-muted hover:text-gold hover:border-gold/40"
        }`}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </span>
  );
}