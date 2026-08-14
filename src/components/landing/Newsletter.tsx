"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border-t border-line bg-card/40 py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        {done ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <p className="font-display text-2xl text-cream">{t("newsletter.success")}</p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-3 text-balance">{t("newsletter.title")}</h2>
            <p className="text-muted mb-8">{t("newsletter.subtitle")}</p>
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletter.placeholder")}
                className="field flex-1"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {t("newsletter.button")}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}