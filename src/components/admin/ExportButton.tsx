"use client";

import { Download } from "lucide-react";

export default function ExportButton() {
  const handleExport = async () => {
    const res = await fetch("/api/export");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lumina-commandes-${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm hover:bg-gold/20 transition-colors"
    >
      <Download className="w-4 h-4" /> Exporter Excel
    </button>
  );
}