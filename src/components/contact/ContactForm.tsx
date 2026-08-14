"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, CheckCircle2, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState("done");
    } catch {
      setState("idle");
    }
  };

  const info = [
    { icon: MapPin, text: t("contact.info.address") },
    { icon: Clock, text: t("contact.info.hours") },
    { icon: MessageCircle, text: "+212 6 00 00 00 00" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-32 pb-24 min-h-screen">
      <div className="text-center mb-14">
        <h1 className="font-display text-4xl md:text-5xl text-cream mb-4">{t("contact.title")}</h1>
        <p className="text-muted max-w-xl mx-auto">{t("contact.subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
        <div className="border border-line rounded-3xl p-6 md:p-8 bg-card/40">
          {state === "done" ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <CheckCircle2 className="w-14 h-14 text-emerald-400" />
              <p className="font-display text-2xl text-cream">{t("contact.form.success")}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">{t("contact.form.name")} *</label>
                <input required className="field" value={form.name} onChange={set("name")} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">{t("contact.form.email")} *</label>
                <input required type="email" className="field" value={form.email} onChange={set("email")} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">{t("contact.form.phone")}</label>
                <input className="field" value={form.phone} onChange={set("phone")} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1.5">{t("contact.form.subject")}</label>
                <input className="field" value={form.subject} onChange={set("subject")} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-muted mb-1.5">{t("contact.form.message")} *</label>
                <textarea required rows={5} className="field" value={form.message} onChange={set("message")} />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-background font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> {t("contact.form.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> {t("contact.form.send")}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="border border-line rounded-3xl p-6 bg-card/40 flex flex-col gap-4">
          <h2 className="font-display text-xl text-cream">{t("contact.info.title")}</h2>
          {info.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-muted text-sm">
              <span className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-gold" />
              </span>
              {item.text}
            </div>
          ))}
          <div className="mt-auto pt-4 border-t border-line">
            <img src="/products/rose-marrakech.svg" alt="LUMINA" className="w-full aspect-[4/5] object-cover rounded-2xl border border-line" />
          </div>
        </aside>
      </div>
    </div>
  );
}