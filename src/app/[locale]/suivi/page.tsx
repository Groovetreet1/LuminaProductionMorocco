"use client";

import { useState } from "react";
import { Search, PackageSearch, Loader2, Check, XCircle, Package } from "lucide-react";

type EventT = { id: string; status: string; note?: string | null; createdAt: string };
type OrderT = {
  number: string;
  customerName: string;
  phone: string;
  city: string;
  status: string;
  total: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  statusEvents: EventT[];
};

const FLOW = ["PENDING", "PAID", "CONFIRMED", "SHIPPED", "DELIVERED"];

const STEP_LABELS: Record<string, string> = {
  PENDING: "Commande passée",
  PAID: "Payée",
  CONFIRMED: "Confirmée",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  PENDING: { label: "En attente", cls: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  PAID: { label: "Payée", cls: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  CONFIRMED: { label: "Confirmée", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  SHIPPED: { label: "Expédiée", cls: "bg-violet-500/10 text-violet-400 border-violet-500/30" },
  DELIVERED: { label: "Livrée", cls: "bg-gold/10 text-gold border-gold/40" },
  CANCELLED: { label: "Annulée", cls: "bg-red-500/10 text-red-400 border-red-500/30" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

export default function SuiviPage() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderT | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = number.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const res = await fetch(`/api/suivi?number=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) {
        setOrder(null);
        setError(data.error ?? "Erreur");
      } else {
        setOrder(data);
      }
    } catch {
      setOrder(null);
      setError("Erreur — réessayez");
    } finally {
      setLoading(false);
    }
  };

  const eventsByStatus = new Map(
    (order?.statusEvents ?? []).map((e) => [e.status, new Date(e.createdAt)])
  );
  const cancelled = order?.status === "CANCELLED";
  const currentIdx = order ? FLOW.indexOf(order.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-24 sm:pt-28 pb-24 min-h-screen">
      <div className="text-center mb-10">
        <span className="inline-flex w-16 h-16 rounded-full bg-gold/10 border border-gold/30 items-center justify-center mb-5">
          <PackageSearch className="w-8 h-8 text-gold" />
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-cream mb-3">Suivi de commande</h1>
        <p className="text-muted max-w-md mx-auto">
          Entrez votre numéro de commande (ex. LM-XXXXXX) pour suivre son avancement, de la
          commande jusqu&apos;à la livraison.
        </p>
      </div>

      <form
        onSubmit={search}
        className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-12"
      >
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="LM-XXXXXXXX"
          className="field flex-1 text-[16px] uppercase tracking-wider"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !number.trim()}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Chercher
        </button>
      </form>

      {error && (
        <div className="border border-red-500/30 bg-red-500/10 rounded-2xl px-6 py-5 text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {searched && !error && loading && (
        <p className="text-center text-muted">Recherche…</p>
      )}

      {order && !loading && (
        <div className="border border-line rounded-3xl bg-card/40 overflow-hidden">
          <div className="px-6 py-5 border-b border-line flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono text-gold font-bold text-lg">{order.number}</p>
              <p className="text-xs text-muted mt-0.5">
                Commandé le {formatDate(order.createdAt)} · {order.items.length} article(s) ·{" "}
                {order.total.toFixed(2)} MAD
              </p>
            </div>
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
                STATUS_META[order.status]?.cls ?? STATUS_META.PENDING.cls
              }`}
            >
              {STATUS_META[order.status]?.label ?? order.status}
            </span>
          </div>

          {cancelled && (
            <div className="px-6 py-4 bg-red-500/5 border-b border-red-500/20 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">
                Cette commande a été annulée. Contactez-nous pour plus d&apos;informations.
              </p>
            </div>
          )}

          <div className="px-6 py-6 flex flex-col gap-4 border-b border-line">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-3 text-cream min-w-0">
                  <Package className="w-4 h-4 text-gold shrink-0" />
                  <span className="truncate">{item.name}</span>
                  <span className="text-muted shrink-0">×{item.quantity}</span>
                </span>
                <span className="text-gold shrink-0">{(item.price * item.quantity).toFixed(2)} MAD</span>
              </div>
            ))}
          </div>

          <div className="px-6 py-8">
            <h2 className="font-display text-lg text-cream mb-6">Historique de la commande</h2>

            <div className="flex flex-col">
              {FLOW.map((step, i) => {
                const date = eventsByStatus.get(step);
                const reached = !cancelled && currentIdx >= 0 && i <= currentIdx;
                const isLast = i === FLOW.length - 1;
                return (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          reached
                            ? "bg-gold/15 border-gold text-gold"
                            : "bg-white/5 border-line text-muted"
                        }`}
                      >
                        {reached ? <Check className="w-4 h-4" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                      </span>
                      {!isLast && (
                        <span
                          className={`w-px flex-1 min-h-8 ${
                            currentIdx > i && !cancelled ? "bg-gold/50" : "bg-line"
                          }`}
                        />
                      )}
                    </div>
                    <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
                      <p className={`font-semibold text-sm ${reached ? "text-cream" : "text-muted"}`}>
                        {STEP_LABELS[step]}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {date
                          ? formatDate(date.toISOString())
                          : reached
                          ? formatDate(order.updatedAt ? order.updatedAt : order.createdAt)
                          : "À venir"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}